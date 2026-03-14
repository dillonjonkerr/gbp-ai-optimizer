import OpenAI from "openai";

// ── CTR curve for estimating traffic by SERP position ────────────────────
const CTR_CURVE: Record<number, number> = {
  1: 0.28, 2: 0.15, 3: 0.11, 4: 0.08, 5: 0.06,
  6: 0.04, 7: 0.03, 8: 0.02, 9: 0.015, 10: 0.01,
};

// ── US state abbreviation map for DataForSEO location matching ───────────
const STATE_ABBREV: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

function normalizeLocation(city: string): { city: string; state: string; full: string } {
  const parts = city.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    const cityName = parts[0]!;
    const stateRaw = parts[1]!.toUpperCase();
    const stateFull = STATE_ABBREV[stateRaw] ?? parts[1]!;
    return {
      city: cityName,
      state: stateFull,
      full: `${cityName},${stateFull},United States`,
    };
  }
  return { city: city, state: "", full: `${city},United States` };
}

// ── DataForSEO auth & fetch ──────────────────────────────────────────────

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

export async function generateLocalKeywords(
  openai: OpenAI,
  category: string,
  city: string,
  websiteUrl?: string,
): Promise<string[]> {
  const websiteContext = websiteUrl
    ? `The business website is ${websiteUrl}. Consider the types of services a ${category} typically offers.`
    : "";

  const cityClean = city.split(",")[0]?.trim().toLowerCase() ?? city.toLowerCase();

  const prompt = `Generate exactly 20 high-intent local keywords that real customers search on Google when hiring a ${category} in ${cityClean}. ${websiteContext}

Requirements:
- Every keyword MUST include "${cityClean}" or "near me"
- Focus on commercial/transactional intent (people ready to hire or get quotes)
- Include variations: "${category.toLowerCase()} ${cityClean}", "best ${category.toLowerCase()} ${cityClean}", "${category.toLowerCase()} near me", specific service types
- Include both broad terms and specific services
- Do NOT include informational/DIY keywords ("how to paint", "painting ideas", "color palettes")
- Do NOT include brand names, chains, or national companies
- These must be keywords that a LOCAL service business would realistically want to rank for

Return ONLY a JSON array of 20 strings. No explanation.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: "You are a local SEO expert. Return only valid JSON arrays." },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "[]";
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```/g, "").trim();

  try {
    const keywords = JSON.parse(cleaned) as string[];
    console.log("[dataforseo] AI generated keywords:", keywords.length);
    return keywords.slice(0, 20);
  } catch {
    console.error("[dataforseo] Failed to parse AI keywords:", cleaned);
    const cat = category.toLowerCase();
    return [
      `${cat} ${cityClean}`, `best ${cat} ${cityClean}`, `${cat} near me`,
      `${cat} services ${cityClean}`, `${cat} company ${cityClean}`,
      `affordable ${cat} ${cityClean}`, `${cat} contractors ${cityClean}`,
      `residential ${cat} ${cityClean}`, `commercial ${cat} ${cityClean}`,
      `${cat} cost ${cityClean}`,
    ];
  }
}

// ── 2. Get Search Volumes ────────────────────────────────────────────────

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

type KeywordSeed = { keyword: string; volume: number };

async function fetchVolumes(
  keywords: string[],
  locationName: string,
): Promise<Map<string, number>> {
  const data = await dfsPost<SearchVolumeResponse>(
    "keywords_data/google_ads/search_volume/live",
    [{ keywords, language_code: "en", location_name: locationName }],
  );

  const task = data.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    console.warn("[dataforseo] Volume task error for", locationName, ":", task?.status_message);
    return new Map();
  }

  const map = new Map<string, number>();
  for (const item of task.result ?? []) {
    map.set(item.keyword, item.search_volume ?? 0);
  }
  return map;
}

export async function getSearchVolumes(
  keywords: string[],
  city: string,
): Promise<KeywordSeed[]> {
  console.log("[dataforseo] Getting LOCAL search volumes for", keywords.length, "keywords");

  const loc = normalizeLocation(city);

  // Try city-level first (e.g. "Sandy,Utah,United States")
  let volumeMap = await fetchVolumes(keywords, loc.full);
  const cityHits = Array.from(volumeMap.values()).filter((v) => v > 0).length;
  console.log("[dataforseo] City-level volumes (", loc.full, "):", cityHits, "of", keywords.length, "with data");

  // If city-level returned mostly zeros, try state-level
  if (cityHits < keywords.length / 3 && loc.state) {
    console.log("[dataforseo] Falling back to state-level:", `${loc.state},United States`);
    const stateMap = await fetchVolumes(keywords, `${loc.state},United States`);
    const stateHits = Array.from(stateMap.values()).filter((v) => v > 0).length;
    console.log("[dataforseo] State-level volumes:", stateHits, "with data");

    if (stateHits > cityHits) {
      volumeMap = stateMap;
    }
  }

  const withVolume = keywords
    .map((kw) => ({ keyword: kw, volume: volumeMap.get(kw) ?? 0 }))
    .filter((s) => s.volume > 0)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 15);

  console.log(
    "[dataforseo] Final keywords with volume:",
    withVolume.length,
    withVolume.map((s) => `${s.keyword} (${s.volume})`).join(", "),
  );

  return withVolume;
}

// ── 3. SERP Rankings (returns all organic results) ───────────────────────

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
    result: { items: SerpItem[] }[];
  }[];
};

type SerpOrganic = {
  title: string;
  domain: string;
  rank: number;
};

type KeywordSerpResult = {
  myRank: number | null;
  organics: SerpOrganic[];
};

async function getKeywordSerp(
  keyword: string,
  city: string,
  businessName: string,
  businessDomain?: string,
): Promise<KeywordSerpResult> {
  const loc = normalizeLocation(city);

  const data = await dfsPost<SerpResponse>(
    "serp/google/organic/live/advanced",
    [{ keyword, location_name: loc.full, language_code: "en", depth: 20 }],
  );

  const task = data.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    console.warn(`[dataforseo] SERP failed for "${keyword}":`, task?.status_message);
    return { myRank: null, organics: [] };
  }

  const items = (task.result?.[0]?.items ?? []).filter((i) => i.type === "organic");

  const businessLower = businessName.toLowerCase();
  const businessWords = businessLower.split(/\s+/).filter((w) => w.length > 2);
  const bizDomain = businessDomain?.toLowerCase();

  let myRank: number | null = null;
  const organics: SerpOrganic[] = [];

  for (const item of items) {
    const title = (item.title ?? "").toLowerCase();
    const domain = (item.domain ?? "").toLowerCase();

    const isMe =
      (bizDomain && domain.includes(bizDomain)) ||
      title.includes(businessLower) ||
      domain.includes(businessLower.replace(/\s+/g, "")) ||
      (businessWords.length >= 2 && businessWords.every((w) => title.includes(w)));

    if (isMe && myRank === null) {
      myRank = item.rank_group;
    } else if (!isMe && item.domain) {
      organics.push({
        title: item.title ?? item.domain ?? "Unknown",
        domain: item.domain,
        rank: item.rank_group,
      });
    }
  }

  return { myRank, organics };
}

// ── 4. Find consistent primary competitor ────────────────────────────────

function findPrimaryCompetitor(
  serpResults: { organics: SerpOrganic[] }[],
): { name: string; domain: string } | null {
  const domainScores = new Map<string, { score: number; names: Map<string, number> }>();

  for (const result of serpResults) {
    for (const org of result.organics) {
      const domain = org.domain.toLowerCase();
      if (!domain) continue;

      const entry = domainScores.get(domain) ?? { score: 0, names: new Map<string, number>() };
      // Weight by position: rank 1 = 20pts, rank 20 = 1pt
      entry.score += Math.max(1, 21 - org.rank);
      entry.names.set(org.title, (entry.names.get(org.title) ?? 0) + 1);
      domainScores.set(domain, entry);
    }
  }

  if (domainScores.size === 0) return null;

  const sorted = Array.from(domainScores.entries()).sort((a, b) => b[1].score - a[1].score);
  const topDomain = sorted[0]![0];
  const topEntry = sorted[0]![1];

  const topName = Array.from(topEntry.names.entries())
    .sort((a, b) => b[1] - a[1])[0]![0];

  return { name: topName, domain: topDomain };
}

// ── 5. Priority scoring ─────────────────────────────────────────────────

function calcPriority(
  volume: number,
  yourRank: number | null,
  competitorRank: number | null,
): "high" | "medium" | "low" {
  if (!competitorRank) return "low";
  const notRanked = !yourRank || yourRank > 20;

  if (volume >= 100 && notRanked && competitorRank <= 5) return "high";
  if (volume >= 50 && notRanked && competitorRank <= 10) return "high";
  if (volume >= 100 && competitorRank <= 5) return "high";
  if (volume >= 50 && (!yourRank || yourRank > competitorRank + 3)) return "medium";
  if (volume >= 30 && competitorRank <= 10) return "medium";
  return "low";
}

// ── 6. Full market scan pipeline ────────────────────────────────────────

export type GapKeyword = {
  keyword: string;
  volume: number;
  yourRank: number | null;
  competitorRank: number | null;
  gap: number | null;
  trafficOpportunity: number;
  priority: "high" | "medium" | "low";
};

export type MarketScanResult = {
  gapKeywords: GapKeyword[];
  totalKeywordsAnalyzed: number;
  totalLocalSearches: number;
  primaryCompetitor: { name: string; domain: string } | null;
  topCompetitors: { name: string; domain: string }[];
  estimatedMissedTraffic: number;
};

export async function runMarketScan(
  openai: OpenAI,
  businessName: string,
  city: string,
  category: string,
  websiteUrl?: string,
): Promise<MarketScanResult> {
  // Step 1 — AI generates local keywords
  const aiKeywords = await generateLocalKeywords(openai, category, city, websiteUrl);

  // Step 2 — Get real search volumes, drop zeros
  const seeds = await getSearchVolumes(aiKeywords, city);
  console.log("[market-scan] Valid keywords with volume:", seeds.length);

  if (seeds.length === 0) {
    console.warn("[market-scan] No keywords had search volume — returning empty scan");
    return {
      gapKeywords: [],
      totalKeywordsAnalyzed: 0,
      totalLocalSearches: 0,
      primaryCompetitor: null,
      topCompetitors: [],
      estimatedMissedTraffic: 0,
    };
  }

  // Step 3 — SERP for each keyword (parallel batches of 5)
  const bizDomain = websiteUrl
    ?.replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  type SerpEntry = { keyword: string; volume: number; myRank: number | null; organics: SerpOrganic[] };
  const serpResults: SerpEntry[] = [];
  const BATCH_SIZE = 5;

  for (let i = 0; i < seeds.length; i += BATCH_SIZE) {
    const batch = seeds.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((s) => getKeywordSerp(s.keyword, city, businessName, bizDomain)),
    );

    for (let j = 0; j < batch.length; j++) {
      const seed = batch[j]!;
      const result = results[j]!;
      if (result.status === "fulfilled") {
        serpResults.push({ ...seed, ...result.value });
      } else {
        serpResults.push({ ...seed, myRank: null, organics: [] });
      }
    }
  }

  // Step 4 — Find ONE consistent primary competitor
  const primaryCompetitor = findPrimaryCompetitor(serpResults);
  console.log("[market-scan] Primary competitor:", primaryCompetitor?.name, primaryCompetitor?.domain);

  // Step 5 — Build gap keywords
  const gapKeywords: GapKeyword[] = [];

  for (const serp of serpResults) {
    let competitorRank: number | null = null;

    if (primaryCompetitor) {
      const match = serp.organics.find(
        (o) => o.domain.toLowerCase() === primaryCompetitor.domain.toLowerCase(),
      );
      competitorRank = match?.rank ?? null;
    }

    // Only include if competitor ranks AND outranks us (or we're not ranked)
    const isGap =
      competitorRank !== null &&
      (serp.myRank === null || serp.myRank > competitorRank);

    if (!isGap) continue;

    const gap = serp.myRank !== null ? serp.myRank - competitorRank! : null;

    const compCtr = CTR_CURVE[competitorRank!] ?? 0.005;
    const myCtr = serp.myRank ? (CTR_CURVE[serp.myRank] ?? 0.005) : 0;
    const trafficOpportunity = Math.round(serp.volume * Math.max(0, compCtr - myCtr));

    gapKeywords.push({
      keyword: serp.keyword,
      volume: serp.volume,
      yourRank: serp.myRank,
      competitorRank,
      gap,
      trafficOpportunity,
      priority: calcPriority(serp.volume, serp.myRank, competitorRank),
    });
  }

  // Sort by traffic opportunity (highest first)
  gapKeywords.sort((a, b) => b.trafficOpportunity - a.trafficOpportunity);

  // Step 6 — Top competitors list
  const domainCounts = new Map<string, { name: string; count: number }>();
  for (const serp of serpResults) {
    for (const org of serp.organics.slice(0, 5)) {
      const d = org.domain.toLowerCase();
      const entry = domainCounts.get(d) ?? { name: org.title, count: 0 };
      entry.count++;
      domainCounts.set(d, entry);
    }
  }
  const topCompetitors = Array.from(domainCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([domain, { name }]) => ({ name, domain }));

  const estimatedMissedTraffic = gapKeywords.reduce((s, k) => s + k.trafficOpportunity, 0);
  const totalLocalSearches = serpResults.reduce((s, k) => s + k.volume, 0);

  console.log("[market-scan] Gap keywords:", gapKeywords.length, "of", serpResults.length);
  console.log("[market-scan] Estimated missed traffic:", estimatedMissedTraffic);

  return {
    gapKeywords,
    totalKeywordsAnalyzed: serpResults.length,
    totalLocalSearches,
    primaryCompetitor,
    topCompetitors,
    estimatedMissedTraffic,
  };
}
