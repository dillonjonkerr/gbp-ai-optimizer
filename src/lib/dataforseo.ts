// DataForSEO Labs + SERP integration + AI keyword generation
import OpenAI from "openai";

const CTR_CURVE: Record<number, number> = {
  1: 0.28,
  2: 0.15,
  3: 0.11,
  4: 0.08,
  5: 0.06,
  6: 0.04,
  7: 0.03,
  8: 0.02,
  9: 0.015,
  10: 0.01,
};

function getAuth() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error("DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD must be set.");
  }
  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

async function dfsPost<T>(endpoint: string, body: unknown[]): Promise<T> {
  const res = await fetch(`https://api.dataforseo.com/v3/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: getAuth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DataForSEO ${endpoint} failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}

// ── 1. AI-Generated Local Keywords ──────────────────────────────────────

export type KeywordSeed = { keyword: string; volume: number };

export async function generateLocalKeywords(
  openai: OpenAI,
  category: string,
  city: string,
  websiteUrl?: string,
): Promise<string[]> {
  const websiteContext = websiteUrl
    ? `The business website is ${websiteUrl}. Consider the types of services a ${category} typically offers.`
    : "";

  const prompt = `Generate exactly 15 high-intent local keywords that real customers would search on Google when looking for a ${category} in ${city}. ${websiteContext}

Requirements:
- Every keyword MUST include the city name or "near me"
- Focus on commercial intent (people ready to hire)
- Include variations: "[service] [city]", "[service] near me", "best [service] [city]", "[specific service type] [city]"
- Include both broad terms ("painter ${city}") and specific services ("interior painting ${city}", "cabinet painter ${city}", "exterior house painting ${city}")
- Do NOT include national/informational keywords like "painting ideas", "painting with a twist", "wall art", "diamond painting"
- These should be keywords a local service business would want to rank for

Return ONLY a JSON array of strings, no explanation. Example format:
["painter ${city.toLowerCase()}", "house painting ${city.toLowerCase()}", "interior painter near me"]`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: "You are a local SEO expert. Return only valid JSON arrays.",
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "[]";
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```/g, "").trim();

  try {
    const keywords = JSON.parse(cleaned) as string[];
    console.log("[dataforseo] AI generated keywords:", keywords);
    return keywords.slice(0, 15);
  } catch {
    console.error("[dataforseo] Failed to parse AI keywords:", cleaned);
    const cat = category.toLowerCase();
    const loc = city.toLowerCase();
    return [
      `${cat} ${loc}`,
      `best ${cat} ${loc}`,
      `${cat} near me`,
      `${cat} services ${loc}`,
      `local ${cat} ${loc}`,
      `residential ${cat} ${loc}`,
      `commercial ${cat} ${loc}`,
      `${cat} company ${loc}`,
      `affordable ${cat} ${loc}`,
      `${cat} contractors ${loc}`,
    ];
  }
}

// ── 2. Get Search Volumes via DataForSEO ────────────────────────────────

type SearchVolumeResponse = {
  tasks: {
    status_code: number;
    status_message: string;
    result: {
      keyword: string;
      search_volume: number;
    }[];
  }[];
};

export async function getSearchVolumes(
  keywords: string[],
  city: string,
): Promise<KeywordSeed[]> {
  console.log("[dataforseo] Getting search volumes for", keywords.length, "keywords");

  const data = await dfsPost<SearchVolumeResponse>(
    "keywords_data/google_ads/search_volume/live",
    [
      {
        keywords,
        language_code: "en",
        location_name: `${city},United States`,
      },
    ],
  );

  const task = data.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    console.warn("[dataforseo] Search volume task error:", task?.status_message);
    return keywords.map((kw) => ({ keyword: kw, volume: 0 }));
  }

  const results = task.result ?? [];
  console.log("[dataforseo] Got volumes for", results.length, "keywords");

  const volumeMap = new Map<string, number>();
  for (const item of results) {
    volumeMap.set(item.keyword, item.search_volume ?? 0);
  }

  return keywords
    .map((kw) => ({
      keyword: kw,
      volume: volumeMap.get(kw) ?? 0,
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);
}

// ── 3. SERP Rankings ────────────────────────────────────────────────────

type SerpItem = {
  type: string;
  rank_group: number;
  rank_absolute: number;
  domain?: string;
  title?: string;
  url?: string;
};

type SerpResponse = {
  status_code: number;
  tasks: {
    status_code: number;
    status_message: string;
    result: {
      items: SerpItem[];
    }[];
  }[];
};

type SerpRankResult = {
  myRank: number | null;
  competitorRank: number;
  topCompetitor: string;
  topCompetitorDomain: string;
  topCompetitors: string[];
};

export async function getSerpRankings(
  keyword: string,
  city: string,
  businessName: string,
): Promise<SerpRankResult> {
  const location = `${city},United States`;

  const data = await dfsPost<SerpResponse>(
    "serp/google/organic/live/advanced",
    [
      {
        keyword,
        location_name: location,
        language_code: "en",
        depth: 10,
      },
    ],
  );

  const task = data.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    console.warn(
      `[dataforseo] SERP task warning for "${keyword}":`,
      task?.status_message,
    );
    return { myRank: null, competitorRank: 1, topCompetitor: "Unknown", topCompetitorDomain: "", topCompetitors: [] };
  }

  const items = (task.result?.[0]?.items ?? []).filter(
    (i) => i.type === "organic",
  );

  const businessLower = businessName.toLowerCase();
  const businessWords = businessLower.split(/\s+/).filter((w) => w.length > 2);
  let myRank: number | null = null;
  let competitorRank = 1;
  let topCompetitor = "Unknown";
  let topCompetitorDomain = "";
  const topCompetitors: string[] = [];

  for (const item of items) {
    const title = (item.title ?? "").toLowerCase();
    const domain = (item.domain ?? "").toLowerCase();

    const isMe =
      title.includes(businessLower) ||
      domain.includes(businessLower.replace(/\s+/g, "")) ||
      businessWords.every((w) => title.includes(w));

    if (isMe && myRank === null) {
      myRank = item.rank_group;
    }

    if (!isMe) {
      const name = item.title ?? item.domain ?? "Unknown";
      topCompetitors.push(name);
      if (topCompetitor === "Unknown") {
        competitorRank = item.rank_group;
        topCompetitor = name;
        topCompetitorDomain = item.domain ?? "";
      }
    }
  }

  return { myRank, competitorRank, topCompetitor, topCompetitorDomain, topCompetitors };
}

// ── 4. Calculate missed traffic ─────────────────────────────────────────

export function calcMissedTraffic(
  volume: number,
  myRank: number | null,
): number {
  const potentialCtr = CTR_CURVE[1]!;
  const potentialTraffic = Math.round(volume * potentialCtr);

  if (!myRank || myRank > 10) {
    return potentialTraffic;
  }

  const currentCtr = CTR_CURVE[myRank] ?? 0.005;
  const currentTraffic = Math.round(volume * currentCtr);
  return Math.max(0, potentialTraffic - currentTraffic);
}

// ── 5. Full market scan pipeline ────────────────────────────────────────

export type MarketKeyword = {
  keyword: string;
  volume: number;
  myRank: number | null;
  competitorRank: number;
  topCompetitor: string;
  missedTraffic: number;
};

export type MarketScanResult = {
  keywords: MarketKeyword[];
  topCompetitors: string[];
  primaryCompetitor: string;
  marketOpportunity: number;
  totalLocalSearches: number;
};

export async function runMarketScan(
  openai: OpenAI,
  businessName: string,
  city: string,
  category: string,
  websiteUrl?: string,
): Promise<MarketScanResult> {
  // Step 1 — AI generates local commercial-intent keywords
  const aiKeywords = await generateLocalKeywords(openai, category, city, websiteUrl);

  // Step 2 — Get real search volumes from DataForSEO
  const seeds = await getSearchVolumes(aiKeywords, city);
  console.log("[dataforseo] Keywords with volumes:", seeds.map((s) => `${s.keyword} (${s.volume})`));

  // Step 3 — SERP rankings in parallel batches of 5 for speed
  const allCompetitors: string[] = [];
  const keywords: MarketKeyword[] = [];
  const BATCH_SIZE = 5;

  for (let i = 0; i < seeds.length; i += BATCH_SIZE) {
    const batch = seeds.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((seed) => getSerpRankings(seed.keyword, city, businessName)),
    );

    for (let j = 0; j < batch.length; j++) {
      const seed = batch[j]!;
      const result = results[j]!;

      if (result.status === "fulfilled") {
        const serp = result.value;
        keywords.push({
          keyword: seed.keyword,
          volume: seed.volume,
          myRank: serp.myRank,
          competitorRank: serp.competitorRank,
          topCompetitor: serp.topCompetitor,
          missedTraffic: calcMissedTraffic(seed.volume, serp.myRank),
        });
        allCompetitors.push(...serp.topCompetitors);
      } else {
        console.warn(`[dataforseo] SERP failed for "${seed.keyword}":`, result.reason);
        keywords.push({
          keyword: seed.keyword,
          volume: seed.volume,
          myRank: null,
          competitorRank: 1,
          topCompetitor: "Unknown",
          missedTraffic: calcMissedTraffic(seed.volume, null),
        });
      }
    }
  }

  // Dedupe & rank top competitors by frequency
  const competitorCounts = new Map<string, number>();
  for (const c of allCompetitors) {
    competitorCounts.set(c, (competitorCounts.get(c) ?? 0) + 1);
  }
  const topCompetitors = Array.from(competitorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  const primaryCompetitor = topCompetitors[0] ?? "Unknown";
  const marketOpportunity = keywords.reduce((s, k) => s + k.missedTraffic, 0);
  const totalLocalSearches = keywords.reduce((s, k) => s + k.volume, 0);

  return { keywords, topCompetitors, primaryCompetitor, marketOpportunity, totalLocalSearches };
}
