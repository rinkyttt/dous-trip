import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Store } from "@/lib/mockData";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

function typeToCategory(types: string[]): string {
  const map: Record<string, string> = {
    restaurant: "Restaurant",
    cafe: "Café",
    bar: "Bar",
    bakery: "Bakery",
    food: "Food",
    store: "Store",
    clothing_store: "Clothing",
    book_store: "Bookstore",
    grocery_or_supermarket: "Grocery",
    meal_takeaway: "Takeout",
    meal_delivery: "Delivery",
    night_club: "Nightclub",
    spa: "Spa",
    gym: "Gym",
    pizza: "Pizza",
    lodging: "Hotel",
    shopping_mall: "Mall",
  };
  for (const t of types) {
    if (map[t]) return map[t];
  }
  return types[0]?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Store";
}

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { query, stores }: { query: string; stores: any[] } = await request.json();
  if (!query || !stores?.length) {
    return NextResponse.json({ stores: [], summary: "No results found." });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const storesJson = JSON.stringify(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stores.map((s: any) => ({
      place_id: s.place_id,
      name: s.name,
      rating: s.rating,
      reviewCount: s.reviewCount,
      priceLevel: s.priceLevel,
      reviews: s.reviews,
    }))
  );

  const prompt = `You are a discerning local guide helping someone find great spots.
User is looking for: "${query}"

For each store, analyze the reviews and:
1. Summarize what popular reviews say people love most (highlights) — 1 sentence
2. Summarize what recent reviewers say based on timeAgo (recentBuzz) — 1 sentence
3. Identify VALID concerns: food quality, wrong orders, rude staff, cleanliness. IGNORE: parking, crowds, prices, wait times, "not authentic enough"
4. Score 1-10 by how well it matches "${query}"

Then write a "summary" — 2 sentences max, specific insight about what stands out across results (e.g. common theme, what the top pick does best). Speak directly to the user. Don't just list names.

Return ONLY valid JSON (no markdown):
{
  "summary": "...",
  "results": [{"place_id":"...","score":9,"verdict":"one sentence why great","highlights":"...","recentBuzz":"...","concerns":null}]
}

Stores:
${storesJson}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonText = text.replace(/```json\n?|\n?```/g, "").trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed: { summary: string; results: any[] } = JSON.parse(jsonText);
    const analysis = parsed.results ?? [];
    const geminiSummary = parsed.summary ?? "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const analysisMap = new Map(analysis.map((a: any) => [a.place_id, a]));

    const merged = stores
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((store: any) => {
        const ai = analysisMap.get(store.place_id);
        if (!ai) return null;

        const s: Store & { _score: number } = {
          id: store.place_id,
          name: store.name,
          category: typeToCategory(store.types),
          rating: store.rating,
          reviewCount: store.reviewCount,
          priceLevel: store.priceLevel,
          address: store.address,
          hours: store.hours,
          phone: store.phone,
          website: store.website,
          description: ai.verdict,
          tags: (store.types as string[])
            .filter((t) => !["point_of_interest", "establishment", "food"].includes(t))
            .slice(0, 4)
            .map((t: string) => t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
          reviews: store.reviews,
          photoSeed: 0,
          photoUrl: store.photoUrl || undefined,
          lat: store.lat,
          lng: store.lng,
          neighborhood: store.address.split(",").slice(-3, -2)[0]?.trim() || "Chicago",
          reviewSummary: {
            verdict: ai.verdict,
            highlights: ai.highlights,
            recentBuzz: ai.recentBuzz,
            concerns: ai.concerns,
          },
          _score: ai.score,
        };
        return s;
      })
      .filter(Boolean)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => b._score - a._score)
      .slice(0, 9)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(({ _score, ...s }: any) => s);

    const summary = geminiSummary;

    return NextResponse.json({ stores: merged, summary });
  } catch (e) {
    console.error("Gemini analysis error:", e);
    return NextResponse.json({ stores: [], summary: "Couldn't analyze results. Please try again." });
  }
}
