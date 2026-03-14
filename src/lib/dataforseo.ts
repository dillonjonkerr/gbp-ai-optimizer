// DataForSEO Labs + SERP integration

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

// ── 1. Keyword Ideas ─────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeywordIdeasResponse = {
  status_code: number;
  status_message: string;
  tasks: {
    status_code: number;
    status_message: string;
    result: {
      seed_keywords: string[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: any[];
    }[];
  }[];
};

export type KeywordSeed = { keyword: string; volume: number };

function buildSeeds(category: string, city: string): string[] {
  const cat = category.toLowerCase();
  const loc = city.toLowerCase();
  return [
    `${cat} ${loc}`,
    `${cat} near me`,
    `best ${cat} ${loc}`,
    `${cat} services ${loc}`,
    `local ${cat} ${loc}`,
  ];
}

export async function getKeywordIdeas(
  category: string,
  city: string,
): Promise<KeywordSeed[]> {
  const seeds = buildSeeds(category, city);
  console.log("[dataforseo] Keyword seeds:", seeds);

  const data = await dfsPost<KeywordIdeasResponse>(
    "dataforseo_labs/google/keyword_ideas/live",
    [
      {
        keywords: seeds,
        language_code: "en",
        location_name: "United States",
        include_seed_keyword: true,
        limit: 30,
        order_by: ["keyword_info.search_volume,desc"],
      },
    ],
  );

  const task = data.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    console.error("[dataforseo] Keyword ideas task error:", task?.status_message);
    throw new Error(
      `DataForSEO keyword ideas failed: ${task?.status_message ?? "unknown error"}`,
    );
  }

  const items = task.result?.[0]?.items ?? [];
  console.log("[dataforseo] Raw items:", items.length);
  if (items.length > 0) {
    console.log("[dataforseo] Sample item structure:", JSON.stringify(items[0], null, 2).slice(0, 500));
  }

  const parsed = items
    .map((item: Record<string, unknown>) => ({
      keyword: String(item.keyword ?? ""),
      volume:
        (item as Record<string, Record<string, number>>).keyword_info?.search_volume ??
        (item as Record<string, number>).search_volume ??
        0,
    }))
    .filter((k: KeywordSeed) => k.volume > 0)
    .sort((a: KeywordSeed, b: KeywordSeed) => b.volume - a.volume)
    .slice(0, 10);

  console.log("[dataforseo] Parsed keywords with volume:", parsed.length);
  return parsed;
}

// ── 2. SERP Rankings ─────────────────────────────────────────────────────

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
    return { myRank: null, competitorRank: 1, topCompetitor: "Unknown", topCompetitors: [] };
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

// ── 3. Calculate missed traffic ──────────────────────────────────────────

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

// ── 4. Full market scan pipeline ─────────────────────────────────────────

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
  businessName: string,
  city: string,
  category: string,
): Promise<MarketScanResult> {
  // Step 1 — get keyword ideas
  const seeds = await getKeywordIdeas(category, city);

  // Step 2 — get SERP rankings for each keyword (sequential to avoid rate limits)
  const allCompetitors: string[] = [];
  const keywords: MarketKeyword[] = [];

  for (const seed of seeds) {
    try {
      const serp = await getSerpRankings(seed.keyword, city, businessName);
      const missed = calcMissedTraffic(seed.volume, serp.myRank);

      keywords.push({
        keyword: seed.keyword,
        volume: seed.volume,
        myRank: serp.myRank,
        competitorRank: serp.competitorRank,
        topCompetitor: serp.topCompetitor,
        missedTraffic: missed,
      });

      allCompetitors.push(...serp.topCompetitors);
    } catch (err) {
      console.warn(`[dataforseo] SERP failed for "${seed.keyword}":`, err);
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
