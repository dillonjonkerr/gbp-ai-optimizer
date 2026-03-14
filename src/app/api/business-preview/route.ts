import { NextRequest, NextResponse } from "next/server";

function getGoogleKey() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not set.");
  return key;
}

type PlaceResult = {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_address?: string;
};

async function getDetails(placeId: string) {
  const fields = [
    "name", "rating", "user_ratings_total", "formatted_address",
    "formatted_phone_number", "website", "photos", "reviews", "types",
  ].join(",");
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${getGoogleKey()}`;
  const res = await fetch(url);
  return (await res.json()).result;
}

export async function POST(request: NextRequest) {
  try {
    const { businessName, city, industry } = (await request.json()) as {
      businessName: string;
      city: string;
      industry?: string;
    };

    if (!businessName || !city) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const googleKey = getGoogleKey();

    // ── Find user's business ──
    const query = encodeURIComponent(`${businessName} ${city}`);
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${googleKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.results?.length) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const place = searchData.results[0];
    const d = await getDetails(place.place_id);

    const photoUrls = (d.photos ?? []).slice(0, 6).map(
      (p: { photo_reference: string }) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${googleKey}`,
    );

    const topReviews = (d.reviews ?? []).slice(0, 5).map(
      (r: { author_name: string; rating: number; text: string; relative_time_description: string }) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text?.slice(0, 200),
        time: r.relative_time_description,
      }),
    );

    const you = {
      name: d.name ?? businessName,
      rating: d.rating ?? 0,
      reviewCount: d.user_ratings_total ?? 0,
      address: d.formatted_address ?? "",
      phone: d.formatted_phone_number ?? null,
      website: d.website ?? null,
      photoCount: d.photos?.length ?? 0,
      photoUrls,
      topReviews,
      category: d.types?.[0]?.replace(/_/g, " ") ?? "",
    };

    // ── Find top competitors in same category ──
    const competitors: {
      name: string;
      rating: number;
      reviewCount: number;
      photoCount: number;
      address: string;
    }[] = [];

    try {
      const cat = industry || d.types?.[0]?.replace(/_/g, " ") || "";
      const compQuery = encodeURIComponent(`${cat} ${city}`);
      const compUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${compQuery}&key=${googleKey}`;
      const compRes = await fetch(compUrl);
      const compData = await compRes.json();

      const results = (compData.results ?? []) as PlaceResult[];
      const userNameLower = you.name.toLowerCase();

      for (const r of results.slice(0, 8)) {
        if (r.name.toLowerCase() === userNameLower) continue;
        if (!r.rating || !r.user_ratings_total) continue;

        competitors.push({
          name: r.name,
          rating: r.rating ?? 0,
          reviewCount: r.user_ratings_total ?? 0,
          photoCount: 0,
          address: r.formatted_address ?? "",
        });

        if (competitors.length >= 3) break;
      }
    } catch (err) {
      console.warn("[business-preview] Competitor search failed:", err);
    }

    // ── Build quick insights ──
    const insights: string[] = [];
    const topComp = competitors[0];

    if (topComp) {
      if (topComp.reviewCount > you.reviewCount) {
        const diff = topComp.reviewCount - you.reviewCount;
        insights.push(`${topComp.name} has ${diff} more reviews than you`);
      }
      if (topComp.rating > you.rating) {
        insights.push(`${topComp.name} has a ${topComp.rating.toFixed(1)}★ rating vs your ${you.rating.toFixed(1)}★`);
      }
      if (you.rating > topComp.rating) {
        insights.push(`Your ${you.rating.toFixed(1)}★ rating beats ${topComp.name}'s ${topComp.rating.toFixed(1)}★`);
      }
      if (you.reviewCount > topComp.reviewCount) {
        insights.push(`You have ${you.reviewCount - topComp.reviewCount} more reviews than ${topComp.name}`);
      }
    }

    if (!you.website) insights.push("You're missing a website link on your profile");
    if (!you.phone) insights.push("No phone number listed on your profile");
    if (you.photoCount < 5) insights.push(`Only ${you.photoCount} photos — top profiles have 20+`);
    if (you.reviewCount < 10) insights.push("Fewer than 10 reviews hurts your visibility");

    const totalCompReviews = competitors.reduce((s, c) => s + c.reviewCount, 0);
    if (competitors.length > 0) {
      const avgCompReviews = Math.round(totalCompReviews / competitors.length);
      insights.push(`Average competitor has ${avgCompReviews} reviews in your area`);
    }

    return NextResponse.json({
      ...you,
      competitors,
      insights,
    });
  } catch (error) {
    console.error("[business-preview]", error);
    const msg = error instanceof Error ? error.message : "Preview failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
