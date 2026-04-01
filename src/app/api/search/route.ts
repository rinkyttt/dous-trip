import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query, lat, lng } = body;

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const base = request.nextUrl.origin;

  // Step 1: Fetch places from Google
  const placesRes = await fetch(`${base}/api/places-search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, lat, lng }),
  });
  const stores = await placesRes.json();

  if (!Array.isArray(stores) || stores.length === 0) {
    return NextResponse.json({
      stores: [],
      summary: `No places found matching "${query}". Try a different search.`,
    });
  }

  // Step 2: Analyze with Gemini
  const analyzeRes = await fetch(`${base}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, stores }),
  });
  const result = await analyzeRes.json();

  return NextResponse.json(result);
}
