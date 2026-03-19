import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;
import type {
  ComparisonReport,
  AuditResult,
} from "@/lib/types";
import { runMarketScan } from "@/lib/dataforseo";
import { scrapeWebsite } from "@/lib/website-scraper";
import { rateLimit } from "@/lib/rateLimit";
import { apiErrorResponse } from "@/lib/apiError";

// ── Request payload ──────────────────────────────────────────────────────

type Payload = {
  businessName: string;
  city: string;
  industry: string;
  website?: string;
  competitorMode?: 'local' | 'state';
};

// ── Google Places types ──────────────────────────────────────────────────

type PlaceTextSearchResult = {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_address?: string;
  geometry?: { location: { lat: number; lng: number } };
};

type PlaceDetailsResult = {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  types?: string[];
  photos?: { photo_reference: string }[];
  reviews?: unknown[];
  editorial_summary?: { overview?: string };
};

// ── Key helpers ──────────────────────────────────────────────────────────

function getGoogleKey() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not set.");
  return key;
}

function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set.");
  return new OpenAI({ apiKey: key });
}

// ── Google Places calls ──────────────────────────────────────────────────

async function searchPlace(
  businessName: string,
  city: string,
): Promise<PlaceTextSearchResult> {
  const query = encodeURIComponent(`${businessName} ${city}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${getGoogleKey()}`;
  const res = await fetch(url);
  const data = await res.json();

  console.log("[gbp-audit] Places search status:", data.status, data.error_message ?? "");

  if (data.status === "REQUEST_DENIED") {
    throw new Error(
      `Google Places API request denied: ${data.error_message ?? "Make sure the Places API is enabled in your Google Cloud Console."}`,
    );
  }
  if (data.status === "OVER_QUERY_LIMIT") {
    throw new Error("Google Places API quota exceeded. Try again later.");
  }
  if (data.status === "INVALID_REQUEST") {
    throw new Error(
      `Invalid request to Google Places API: ${data.error_message ?? "Check your API key."}`,
    );
  }
  if (!data.results?.length) {
    throw new Error(
      `No Google listing found for "${businessName}" in ${city}. Check the spelling and try again.`,
    );
  }

  return data.results[0] as PlaceTextSearchResult;
}

async function getPlaceDetails(placeId: string): Promise<PlaceDetailsResult> {
  const fields = [
    "name",
    "rating",
    "user_ratings_total",
    "formatted_address",
    "formatted_phone_number",
    "website",
    "types",
    "photos",
    "reviews",
    "editorial_summary",
  ].join(",");
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${getGoogleKey()}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK") {
    throw new Error("Failed to fetch business details from Google.");
  }
  return data.result as PlaceDetailsResult;
}

function getPhotoUrl(details: PlaceDetailsResult): string | null {
  const ref = details.photos?.[0]?.photo_reference;
  if (!ref) return null;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${ref}&key=${getGoogleKey()}`;
}

const COMPETITOR_RADIUS_METERS = 24140; // 15 miles
const MIN_COMPETITOR_DISTANCE_METERS = 1600; // ~1 mile — skip competitors closer than this

function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function extractStreet(address: string): string {
  const parts = address.split(",");
  return (parts[0] ?? "").trim().toLowerCase().replace(/^\d+\s*/, "");
}

async function searchCompetitorWide(
  query: string,
  center: { lat: number; lng: number },
): Promise<PlaceTextSearchResult[]> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${center.lat},${center.lng}&radius=${COMPETITOR_RADIUS_METERS}&key=${getGoogleKey()}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.warn("[gbp-audit] Wide competitor search status:", data.status, data.error_message ?? "");
  }
  return (data.results ?? []) as PlaceTextSearchResult[];
}

function isTooClose(
  candidate: PlaceTextSearchResult,
  myName: string,
  myAddress: string,
  myCenter: { lat: number; lng: number },
): boolean {
  if (candidate.name.toLowerCase() === myName.toLowerCase()) return true;

  const candidateLoc = candidate.geometry?.location;
  if (candidateLoc) {
    const dist = haversineDistance(myCenter, candidateLoc);
    if (dist < MIN_COMPETITOR_DISTANCE_METERS) {
      console.log(`[gbp-audit] Skipping ${candidate.name} — only ${Math.round(dist)}m away`);
      return true;
    }
  }

  const myStreet = extractStreet(myAddress);
  const theirStreet = extractStreet(candidate.formatted_address ?? "");
  if (myStreet && theirStreet && myStreet === theirStreet) {
    console.log(`[gbp-audit] Skipping ${candidate.name} — same street (${myStreet})`);
    return true;
  }

  return false;
}

// ── Build structured profile ─────────────────────────────────────────────

function buildProfileSnapshot(details: PlaceDetailsResult, city: string, scrapedData?: Record<string, unknown>) {
  return {
    name: details.name ?? "Unknown",
    city,
    rating: details.rating ?? 0,
    reviewCount: details.user_ratings_total ?? 0,
    category: details.types?.[0]?.replace(/_/g, " ") ?? "unknown",
    photoCount: details.photos?.length ?? 0,
    hasWebsite: Boolean(details.website),
    hasPhone: Boolean(details.formatted_phone_number),
    descriptionPresent: Boolean(details.editorial_summary?.overview),
    address: details.formatted_address ?? "",
    websiteKeywords: scrapedData?.titleKeywords || [],
    headingKeywords: scrapedData?.headingKeywords || [],
    services: scrapedData?.services || [],
    serviceAreas: scrapedData?.serviceAreas || [],
    logoUrl: scrapedData?.logoUrl || null,
    rankings: scrapedData?.rankings || {},
  };
}

// ── OpenAI analysis ──────────────────────────────────────────────────────

async function runAIAnalysis(
  profile: ReturnType<typeof buildProfileSnapshot>,
  industry: string,
) {
  const systemPrompt = `You are an expert Google Business Profile (GBP) optimization consultant for the ${industry} industry. Analyze the following business profile data and return a JSON object (no markdown, just raw JSON) with exactly these keys:

- "score": number 0-100, an overall optimization score
- "competitorScore": number 0-100, estimated average competitor score in the area
- "aiSummary": string, a 3-4 sentence overview of the profile's strengths and weaknesses
- "missedOpportunities": string[], specific things the business is missing out on
- "keywordGaps": array of objects with "keyword", "you" (e.g. "Not ranked" or "#12"), and "competitor" (e.g. "#1")—pick the 5 most impactful
- "recommendations": string[], 5-7 actionable recommendations
- "suggestedPosts": string[], 3 specific GBP post ideas tailored to this business
- "suggestedQA": array of objects with "question" and "answer" keys, 3 Q&A entries

Scoring guidelines:
- Reviews < 10: deduct heavily
- No website: -10
- No phone: -5
- Few photos (< 5): -15
- No description: -10
- Low rating (< 4.0): -10

Consider the scraped website data including keywords, services, and logo for additional optimization opportunities.
Be specific and actionable. Reference the actual data.`;

  const userPrompt = `Business profile data:\n${JSON.stringify(profile, null, 2)}`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned) as {
    score: number;
    competitorScore: number;
    aiSummary: string;
    missedOpportunities: string[];
    keywordGaps: { keyword: string; you: string; competitor: string }[];
    recommendations: string[];
    suggestedPosts: string[];
    suggestedQA: { question: string; answer: string }[];
  };
}

// ── Route handler ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { routeKey: "gbp-audit", maxRequests: 3, windowMs: 60 * 60 * 1000 });
  if (limited) return limited;

  try {
    const body = (await request.json()) as Payload;
    const { businessName, city, industry } = body;

    if (!businessName || !city || !industry) {
      return NextResponse.json(
        { error: "businessName, city, and industry are required." },
        { status: 400 },
      );
    }

    console.log("[gbp-audit] Starting audit for:", { businessName, city, industry, userWebsite: body.website });

    // Step 1 — Search Google Places
    const place = await searchPlace(businessName, city);
    console.log("[gbp-audit] Found place:", place.place_id, place.name);

    // Step 2 — Get detailed info
    const details = await getPlaceDetails(place.place_id);

    // Step 2b — Scrape website if available
    const websiteUrl = body.website || details.website || undefined;
    let scrapedData: Record<string, unknown> | undefined;
    if (websiteUrl) {
      try {
        console.log("[gbp-audit] Scraping website:", websiteUrl);
        scrapedData = await scrapeWebsite(websiteUrl) as Record<string, unknown>;
        console.log("[gbp-audit] Scraped data:", {
          serviceAreas: (scrapedData?.serviceAreas as unknown[])?.length ?? 0,
          services: (scrapedData?.services as unknown[])?.length ?? 0,
          titleKeywords: (scrapedData?.titleKeywords as unknown[])?.length ?? 0,
          headingKeywords: (scrapedData?.headingKeywords as unknown[])?.length ?? 0,
        });
      } catch (err) {
        console.warn("[gbp-audit] Website scraping failed:", err);
      }
    }

    // Step 3 — Build structured profile
    const profile = buildProfileSnapshot(details, city, scrapedData);
    console.log("[gbp-audit] Profile snapshot:", profile);

    const serviceAreas = (scrapedData?.serviceAreas as string[]) ?? [];
    const [analysis, scanResult] = await Promise.all([
      runAIAnalysis(profile, industry),
      runMarketScan(businessName, city, industry, serviceAreas, websiteUrl),
    ]);
    console.log("[gbp-audit] AI score:", analysis.score);
    console.log("[gbp-audit] Market scan complete:", scanResult.gapKeywords.length, "gap keywords of", scanResult.totalKeywordsAnalyzed);

    // Step 5 — ALWAYS find a competitor (3-layer fallback, 15-mile radius)
    let competitorProfile = null;

    // Get center coordinates from the user's business for wide-radius searches
    const bizCenter = place.geometry?.location ?? null;
    const cityState = city.includes(",") ? city : `${city}`;

    // Attempt A: Try ALL SERP-detected competitors (not just #1) — skip ones too close
    const serpAllCompetitors = [
      ...scanResult.competitorProfiles.local,
      ...scanResult.competitorProfiles.statewide,
    ];

    if (bizCenter) {
      for (const serpComp of serpAllCompetitors) {
        if (competitorProfile) break;
        if (!serpComp.name || serpComp.name === "Unknown") continue;

        const searchVariations = [
          serpComp.name,
          serpComp.name.replace(/\s*[-|–—].*$/, ""),
          serpComp.name.split(" ").slice(0, 3).join(" "),
        ];

        for (const variation of searchVariations) {
          try {
            console.log("[gbp-audit] Competitor lookup (SERP, 15mi, >1mi away):", variation);
            const candidates = await searchCompetitorWide(variation, bizCenter);
            const match = candidates.find(
              (c) => !isTooClose(c, profile.name, profile.address, bizCenter)
            );
            if (match) {
              const compDetails = await getPlaceDetails(match.place_id);
              competitorProfile = {
                name: compDetails.name ?? variation,
                rating: compDetails.rating ?? 0,
                reviewCount: compDetails.user_ratings_total ?? 0,
                photoCount: compDetails.photos?.length ?? 0,
                hasWebsite: Boolean(compDetails.website),
                hasPhone: Boolean(compDetails.formatted_phone_number),
                category: compDetails.types?.[0]?.replace(/_/g, " ") ?? "unknown",
                address: compDetails.formatted_address ?? "",
                photoUrl: getPhotoUrl(compDetails),
              };
              console.log("[gbp-audit] Competitor found (15mi, different area):", competitorProfile.name, "-", competitorProfile.address);
              break;
            }
          } catch (err) {
            console.warn("[gbp-audit] SERP competitor search failed:", variation, err);
          }
        }
      }
    }

    // Attempt B: Wide-radius category search — skip anything on same street or <1mi
    if (!competitorProfile && bizCenter) {
      const fallbackQueries = [
        `best ${industry}`,
        `top rated ${industry}`,
        industry,
      ];

      for (const query of fallbackQueries) {
        if (competitorProfile) break;
        try {
          console.log("[gbp-audit] Competitor fallback (15mi, >1mi away):", query);
          const candidates = await searchCompetitorWide(query, bizCenter);
          const match = candidates.find(
            (c) => !isTooClose(c, profile.name, profile.address, bizCenter)
          );
          if (match) {
            const compDetails = await getPlaceDetails(match.place_id);
            competitorProfile = {
              name: compDetails.name ?? match.name,
              rating: compDetails.rating ?? 0,
              reviewCount: compDetails.user_ratings_total ?? 0,
              photoCount: compDetails.photos?.length ?? 0,
              hasWebsite: Boolean(compDetails.website),
              hasPhone: Boolean(compDetails.formatted_phone_number),
              category: compDetails.types?.[0]?.replace(/_/g, " ") ?? "unknown",
              address: compDetails.formatted_address ?? "",
              photoUrl: getPhotoUrl(compDetails),
            };
            console.log("[gbp-audit] Competitor found via fallback (different area):", competitorProfile.name, "-", competitorProfile.address);
            break;
          }
        } catch (err) {
          console.warn("[gbp-audit] Fallback competitor search failed:", query, err);
        }
      }
    }

    // Attempt C: Last resort — market-average competitor
    if (!competitorProfile) {
      console.warn("[gbp-audit] All competitor searches failed — using market average");
      competitorProfile = {
        name: `Top ${industry} in ${city}`,
        rating: Math.min(4.8, profile.rating + 0.3),
        reviewCount: Math.max(profile.reviewCount + 40, 50),
        photoCount: Math.max(profile.photoCount + 10, 20),
        hasWebsite: true,
        hasPhone: true,
        category: profile.category,
        address: city,
        photoUrl: null,
      };
    }

    const yourProfile = {
      name: profile.name,
      rating: profile.rating,
      reviewCount: profile.reviewCount,
      photoCount: profile.photoCount,
      hasWebsite: profile.hasWebsite,
      hasPhone: profile.hasPhone,
      category: profile.category,
      address: profile.address,
      photoUrl: getPhotoUrl(details),
    };

    const allCompetitors = [
      ...scanResult.competitorProfiles.local,
      ...scanResult.competitorProfiles.statewide,
    ];
    const primaryCompetitorName = allCompetitors[0]?.name ?? "Top Competitor";

    const marketScan = {
      keywords: scanResult.gapKeywords,
      totalKeywordsAnalyzed: scanResult.totalKeywordsAnalyzed,
      primaryCompetitorName,
      topCompetitors: allCompetitors.map((c) => c.name),
      estimatedMissedTraffic: scanResult.estimatedMissedTraffic,
      radiusMiles: 15,
      totalLocalSearches: scanResult.totalLocalSearches,
      yourProfile,
      competitorProfile,
    };

    // Step 6 — Build comparison report
    const comparison: ComparisonReport = {
      businessName: profile.name,
      address: profile.address,
      rating: profile.rating,
      score: analysis.score,
      competitorScore: analysis.competitorScore,
      reviewCount: profile.reviewCount,
      photoCount: profile.photoCount,
      hasWebsite: profile.hasWebsite,
      hasPhone: profile.hasPhone,
      category: profile.category,
      aiSummary: analysis.aiSummary,
      missedOpportunities: analysis.missedOpportunities,
      keywordGaps: analysis.keywordGaps,
    };

    // Step 7 — Assemble full result
    const result: AuditResult = {
      marketScan,
      comparison,
      recommendations: analysis.recommendations,
      suggestedPosts: analysis.suggestedPosts,
      suggestedQA: analysis.suggestedQA,
    };

    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error, "gbp-audit");
  }
}
