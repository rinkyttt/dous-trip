import { NextRequest, NextResponse } from "next/server";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const PRICE_MAP = ["Free", "$", "$$", "$$$", "$$$$"];

function todayHours(weekdayText?: string[]): string {
  if (!weekdayText?.length) return "Hours unavailable";
  const idx = (new Date().getDay() + 6) % 7;
  const entry = weekdayText[idx] || "";
  return entry.split(": ").slice(1).join(": ") || "Hours unavailable";
}

function typeToCategory(types: string[]): string {
  const map: Record<string, string> = {
    restaurant: "Restaurant", cafe: "Café", bar: "Bar", bakery: "Bakery",
    food: "Food", store: "Store", clothing_store: "Clothing", book_store: "Bookstore",
    grocery_or_supermarket: "Grocery", meal_takeaway: "Takeout", night_club: "Nightclub",
    spa: "Spa", gym: "Gym", lodging: "Hotel", shopping_mall: "Mall",
  };
  for (const t of types) {
    if (map[t]) return map[t];
  }
  return types[0]?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Place";
}

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("place_id");
  if (!placeId) return NextResponse.json({ error: "place_id required" }, { status: 400 });

  const fields = "place_id,name,rating,user_ratings_total,price_level,formatted_address,opening_hours,geometry,types,vicinity,photos,formatted_phone_number,website";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${MAPS_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const r = data.result;
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Fetch photo if available
  let photoUrl: string | null = null;
  const photoRef = r.photos?.[0]?.photo_reference;
  if (photoRef) {
    try {
      const photoRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${MAPS_KEY}`,
        { redirect: "follow" }
      );
      photoUrl = photoRes.url;
    } catch { /* ignore */ }
  }

  const store = {
    id: r.place_id,
    name: r.name,
    category: typeToCategory(r.types || []),
    rating: r.rating ?? 0,
    reviewCount: r.user_ratings_total ?? 0,
    priceLevel: PRICE_MAP[r.price_level ?? 2] ?? "$$",
    address: r.formatted_address || r.vicinity || "",
    hours: todayHours(r.opening_hours?.weekday_text),
    phone: r.formatted_phone_number || "",
    website: r.website || "",
    description: "",
    tags: (r.types || [])
      .filter((t: string) => !["point_of_interest", "establishment", "food"].includes(t))
      .slice(0, 4)
      .map((t: string) => t.replace(/_/g, " ")),
    reviews: [],
    photoSeed: 0,
    photoUrl: photoUrl ?? undefined,
    lat: r.geometry?.location?.lat ?? 0,
    lng: r.geometry?.location?.lng ?? 0,
    neighborhood: (r.formatted_address || "").split(",").slice(-3, -2)[0]?.trim() || "",
  };

  return NextResponse.json(store);
}
