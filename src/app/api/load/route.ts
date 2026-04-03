import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.dous_KV_REST_API_URL!,
  token: process.env.dous_KV_REST_API_TOKEN!,
});

const KEY = "dous:data";

export async function GET() {
  const data = await redis.get(KEY);
  if (!data) return NextResponse.json(null);
  const parsed = typeof data === "string" ? JSON.parse(data) : data;
  return NextResponse.json(parsed);
}
