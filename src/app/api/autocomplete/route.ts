import { NextRequest, NextResponse } from "next/server";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("input");
  if (!input) return NextResponse.json({ predictions: [] });

  const lat = request.nextUrl.searchParams.get("lat") ?? "41.8781";
  const lng = request.nextUrl.searchParams.get("lng") ?? "-87.6298";

  const url =
    `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
    `?input=${encodeURIComponent(input)}` +
    `&types=establishment` +
    `&location=${lat},${lng}` +
    `&radius=50000` +
    `&origin=${lat},${lng}` +
    `&key=${MAPS_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  const predictions = (data.predictions ?? []).slice(0, 6).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => ({
      place_id: p.place_id,
      main_text: p.structured_formatting?.main_text ?? p.description,
      secondary_text: p.structured_formatting?.secondary_text ?? "",
      distance_meters: p.distance_meters ?? null,
    })
  );

  return NextResponse.json({ predictions });
}
