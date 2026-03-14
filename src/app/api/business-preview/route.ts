import { NextRequest, NextResponse } from "next/server";

function getGoogleKey() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not set.");
  return key;
}

export async function POST(request: NextRequest) {
  try {
    const { businessName, city } = (await request.json()) as {
      businessName: string;
      city: string;
    };

    if (!businessName || !city) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const query = encodeURIComponent(`${businessName} ${city}`);
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${getGoogleKey()}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.results?.length) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const place = searchData.results[0];
    const placeId = place.place_id;

    const fields = [
      "name",
      "rating",
      "user_ratings_total",
      "formatted_address",
      "formatted_phone_number",
      "website",
      "photos",
      "reviews",
      "types",
    ].join(",");

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${getGoogleKey()}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    if (detailsData.status !== "OK") {
      return NextResponse.json({ error: "Could not fetch details" }, { status: 500 });
    }

    const d = detailsData.result;
    const googleKey = getGoogleKey();

    const photoUrls = (d.photos ?? []).slice(0, 6).map(
      (p: { photo_reference: string }) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${googleKey}`,
    );

    const topReviews = (d.reviews ?? []).slice(0, 3).map(
      (r: { author_name: string; rating: number; text: string; relative_time_description: string }) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text?.slice(0, 200),
        time: r.relative_time_description,
      }),
    );

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("[business-preview]", error);
    const msg = error instanceof Error ? error.message : "Preview failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
