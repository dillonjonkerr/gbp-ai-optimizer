import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type {
  ComparisonReport,
  AuditResult,
} from "@/lib/types";
import { runMarketScan } from "@/lib/dataforseo";

// ── Request payload ──────────────────────────────────────────────────────

type Payload = {
  businessName: string;
  city: string;
  industry: string;
};

// ── Google Places types ──────────────────────────────────────────────────

type PlaceTextSearchResult = {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_address?: string;
};

type PlaceDetailsResult = {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  types?: string[];
  photos?: unknown[];
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

// ── Build structured profile ─────────────────────────────────────────────

function buildProfileSnapshot(details: PlaceDetailsResult, city: string) {
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
  try {
    const body = (await request.json()) as Payload;
    const { businessName, city, industry } = body;

    if (!businessName || !city || !industry) {
      return NextResponse.json(
        { error: "businessName, city, and industry are required." },
        { status: 400 },
      );
    }

    console.log("[gbp-audit] Starting audit for:", { businessName, city, industry });

    // Step 1 — Search Google Places
    const place = await searchPlace(businessName, city);
    console.log("[gbp-audit] Found place:", place.place_id, place.name);

    // Step 2 — Get detailed info
    const details = await getPlaceDetails(place.place_id);

    // Step 3 — Build structured profile
    const profile = buildProfileSnapshot(details, city);
    console.log("[gbp-audit] Profile snapshot:", profile);

    // Step 4 — AI analysis + market scan in parallel
    const openai = getOpenAIClient();
    const websiteUrl = details.website ?? undefined;

    const [analysis, scanResult] = await Promise.all([
      runAIAnalysis(profile, industry),
      runMarketScan(openai, businessName, city, industry, websiteUrl),
    ]);
    console.log("[gbp-audit] AI score:", analysis.score);
    console.log("[gbp-audit] Market scan complete:", scanResult.gapKeywords.length, "gap keywords of", scanResult.totalKeywordsAnalyzed);

    // Step 5 — Look up top competitor via Google Places for real comparison
    let competitorProfile = null;
    const primaryCompetitorName = scanResult.primaryCompetitor?.name;
    if (primaryCompetitorName && primaryCompetitorName !== "Unknown") {
      const searchVariations = [
        primaryCompetitorName,
        primaryCompetitorName.replace(/\s*[-|–—].*$/, ""),
        primaryCompetitorName.split(" ").slice(0, 3).join(" "),
      ];

      for (const variation of searchVariations) {
        try {
          console.log("[gbp-audit] Looking up competitor:", variation);
          const compPlace = await searchPlace(variation, city);
          const compDetails = await getPlaceDetails(compPlace.place_id);
          if (compPlace.name.toLowerCase() !== profile.name.toLowerCase()) {
            competitorProfile = {
              name: compDetails.name ?? variation,
              rating: compDetails.rating ?? 0,
              reviewCount: compDetails.user_ratings_total ?? 0,
              photoCount: compDetails.photos?.length ?? 0,
              hasWebsite: Boolean(compDetails.website),
              hasPhone: Boolean(compDetails.formatted_phone_number),
              category: compDetails.types?.[0]?.replace(/_/g, " ") ?? "unknown",
              address: compDetails.formatted_address ?? "",
            };
            console.log("[gbp-audit] Competitor found:", competitorProfile.name, competitorProfile.rating);
            break;
          }
        } catch (err) {
          console.warn("[gbp-audit] Competitor search failed for:", variation, err);
        }
      }
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
    };

    const marketScan = {
      keywords: scanResult.gapKeywords,
      totalKeywordsAnalyzed: scanResult.totalKeywordsAnalyzed,
      primaryCompetitorName: scanResult.primaryCompetitor?.name ?? "Top Competitor",
      topCompetitors: scanResult.topCompetitors.map((c) => c.name),
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
    console.error("[gbp-audit] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to run audit";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
