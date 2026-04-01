import { NextRequest, NextResponse } from "next/server";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const PRICE_MAP = ["Free", "$", "$$", "$$$", "$$$$"];

async function getPhotoUrl(ref: string): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${MAPS_KEY}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    return res.url;
  } catch {
    return null;
  }
}

async function getDetails(placeId: string, sort: "most_relevant" | "newest") {
  const fields = "place_id,name,rating,user_ratings_total,price_level,formatted_address,opening_hours,geometry,types,reviews,vicinity,photos,formatted_phone_number,website";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&reviews_sort=${sort}&key=${MAPS_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result;
}

function todayHours(weekdayText?: string[]): string {
  if (!weekdayText?.length) return "Hours unavailable";
  // weekday_text is Mon(0)..Sun(6), getDay() is Sun(0)..Sat(6)
  const idx = (new Date().getDay() + 6) % 7;
  const entry = weekdayText[idx] || "";
  return entry.split(": ").slice(1).join(": ") || "Hours unavailable";
}

export async function POST(request: NextRequest) {
  const { query, lat, lng } = await request.json();
  if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

  let searchUrl: string;
  if (lat && lng) {
    searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&keyword=${encodeURIComponent(query)}&key=${MAPS_KEY}`;
  } else {
    searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + " Chicago")}&key=${MAPS_KEY}`;
  }

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candidates = ((searchData.results || []) as any[])
    .filter((r) => r.rating >= 4.0)
    .slice(0, 20);

  const detailed = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    candidates.slice(0, 8).map(async (place: any) => {
      const relevant = await getDetails(place.place_id, "most_relevant");

      // Truncate reviews to save tokens
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reviews = ((relevant?.reviews || []) as any[]).slice(0, 5).map((r: any) => ({
        author: r.author_name,
        rating: r.rating,
        text: (r.text as string).slice(0, 150),
        timeAgo: r.relative_time_description,
      }));

      // Store photo reference only — fetch URL separately (lazy)
      const photoRef = relevant?.photos?.[0]?.photo_reference ?? null;
      const photoUrl = photoRef ? await Promise.race([
        getPhotoUrl(photoRef),
        new Promise<null>((res) => setTimeout(() => res(null), 2000)),
      ]) : null;

      return {
        place_id: place.place_id,
        name: relevant?.name || place.name,
        rating: relevant?.rating || place.rating,
        reviewCount: relevant?.user_ratings_total || place.user_ratings_total || 0,
        priceLevel: PRICE_MAP[relevant?.price_level ?? place.price_level ?? 2] || "$$",
        address: relevant?.formatted_address || relevant?.vicinity || place.vicinity || "",
        hours: todayHours(relevant?.opening_hours?.weekday_text),
        phone: relevant?.formatted_phone_number || "",
        website: relevant?.website || "",
        lat: relevant?.geometry?.location?.lat ?? place.geometry?.location?.lat,
        lng: relevant?.geometry?.location?.lng ?? place.geometry?.location?.lng,
        types: relevant?.types || place.types || [],
        photoUrl,
        reviews,
      };
    })
  );

  return NextResponse.json(detailed);
}
