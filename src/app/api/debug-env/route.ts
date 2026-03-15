import { NextResponse } from "next/server";

export const maxDuration = 10;

export async function GET() {
  const checks = {
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    GOOGLE_PLACES_API_KEY: !!process.env.GOOGLE_PLACES_API_KEY,
    DATAFORSEO_LOGIN: !!process.env.DATAFORSEO_LOGIN,
    DATAFORSEO_PASSWORD: !!process.env.DATAFORSEO_PASSWORD,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    dataforseo_login_preview: process.env.DATAFORSEO_LOGIN?.slice(0, 6) + "...",
  };

  const allSet = Object.entries(checks)
    .filter(([k]) => k !== "dataforseo_login_preview")
    .every(([, v]) => v === true);

  return NextResponse.json({ ok: allSet, checks });
}
