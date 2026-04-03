import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.dous_KV_REST_API_URL!,
  token: process.env.dous_KV_REST_API_TOKEN!,
});

const KEY = "dous:data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  await redis.set(KEY, JSON.stringify(body));
  return NextResponse.json({ ok: true });
}
