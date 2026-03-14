import { NextRequest, NextResponse } from "next/server";

type Entry = { timestamps: number[] };

const stores = new Map<string, Map<string, Entry>>();

function getStore(routeKey: string): Map<string, Entry> {
  let store = stores.get(routeKey);
  if (!store) {
    store = new Map();
    stores.set(routeKey, store);
  }
  return store;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * IP-based in-memory rate limiter.
 * Returns null if the request is allowed, or a 429 NextResponse if rate-limited.
 */
export function rateLimit(
  request: NextRequest,
  opts: { routeKey: string; maxRequests: number; windowMs: number },
): NextResponse | null {
  const ip = getClientIP(request);
  const store = getStore(opts.routeKey);
  const now = Date.now();

  // Clean up stale IPs every 100 checks
  if (Math.random() < 0.01) {
    for (const [key, entry] of Array.from(store.entries())) {
      const fresh = entry.timestamps.filter((t) => now - t < opts.windowMs);
      if (fresh.length === 0) store.delete(key);
      else entry.timestamps = fresh;
    }
  }

  const entry = store.get(ip) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => now - t < opts.windowMs);

  if (entry.timestamps.length >= opts.maxRequests) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  entry.timestamps.push(now);
  store.set(ip, entry);
  return null;
}
