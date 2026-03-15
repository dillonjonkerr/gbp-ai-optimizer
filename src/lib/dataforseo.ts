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

// ── 1. Real Keyword Research via DataForSEO ─────────────────────────────

type KeywordsForKeywordsResult = {
  tasks: {
    status_code: number;
    status_message: string;
    result: {
      seed_keyword_data?: { keyword: string; keyword_info?: { search_volume: number } };
      items?: {
        keyword_data: {
          keyword: string;
          keyword_info: {
            search_volume: number;
            competition_level?: string;
            cpc?: number;
          };
        };
      }[];
    }[];
  }[];
};

function buildSeedKeywords(category: string, city: string): string[] {
  const cat = category.toLowerCase();
  const cityClean = city.split(",")[0]?.trim().toLowerCase() ?? city.toLowerCase();
  return [
    `${cat} ${cityClean}`,
    `${cat} near me`,
    `best ${cat} ${cityClean}`,
    `${cat} services ${cityClean}`,
    `${cat} company ${cityClean}`,
  ];
}

export async function fetchRealKeywords(
  category: string,
  city: string,
  websiteUrl?: string,
): Promise<string[]> {
  const loc = normalizeLocation(city);
  const seeds = buildSeedKeywords(category, city);
  const allKeywords = new Map<string, number>();

  console.log("[dataforseo] Fetching real keywords for seeds:", seeds);

  // Source 1: keywords_for_keywords — real Google Ads keyword ideas from seed terms
  try {
    const data = await dfsPost<KeywordsForKeywordsResult>(
      "keywords_data/google_ads/keywords_for_keywords/live",
      [{
        keywords: seeds,
        language_code: "en",
        location_name: loc.state ? `${loc.state},United States` : "United States",
        sort_by: "search_volume",
        limit: 50,
      }],
    );

    const task = data.tasks?.[0];
    if (task?.status_code === 20000) {
      for (const item of task.result?.[0]?.items ?? []) {
        const kw = item.keyword_data.keyword.toLowerCase();
        const vol = item.keyword_data.keyword_info?.search_volume ?? 0;
        if (vol > 0) allKeywords.set(kw, vol);
      }
    }
    console.log("[dataforseo] keywords_for_keywords returned:", allKeywords.size, "keywords with volume");
  } catch (err) {
    console.warn("[dataforseo] keywords_for_keywords failed:", err);
  }

  // Source 2: keywords_for_site — if business has a website, pull keywords Google associates with it
  if (websiteUrl) {
    try {
      const data = await dfsPost<KeywordsForKeywordsResult>(
        "keywords_data/google_ads/keywords_for_site/live",
        [{
          target: websiteUrl,
          language_code: "en",
          location_name: loc.state ? `${loc.state},United States` : "United States",
          sort_by: "search_volume",
          limit: 30,
        }],
      );

      const task = data.tasks?.[0];
      if (task?.status_code === 20000) {
        let added = 0;
        for (const item of task.result?.[0]?.items ?? []) {
          const kw = item.keyword_data.keyword.toLowerCase();
          const vol = item.keyword_data.keyword_info?.search_volume ?? 0;
          if (vol > 0 && !allKeywords.has(kw)) {
            allKeywords.set(kw, vol);
            added++;
          }
        }
        console.log("[dataforseo] keywords_for_site added:", added, "new keywords");
      }
    } catch (err) {
      console.warn("[dataforseo] keywords_for_site failed:", err);
    }
  }

  // Always include the seed keywords so we have a baseline
  for (const seed of seeds) {
    if (!allKeywords.has(seed.toLowerCase())) {
      allKeywords.set(seed.toLowerCase(), 0);
    }
  }

  // Sort by volume descending, return top 20
  const sorted = Array.from(allKeywords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([kw]) => kw);

  console.log("[dataforseo] Real keywords selected:", sorted.length);
  return sorted;
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

// Estimate volume for a keyword when DataForSEO has no data
function estimateVolume(keyword: string): number {
  const kw = keyword.toLowerCase();
  if (kw.includes("near me")) return 320;
  if (kw.startsWith("best ")) return 210;
  if (kw.includes("cost") || kw.includes("price") || kw.includes("quote")) return 170;
  if (kw.includes("residential") || kw.includes("commercial")) return 140;
  if (kw.includes("contractor") || kw.includes("company") || kw.includes("service")) return 120;
  return 90;
}

export async function getSearchVolumes(
  keywords: string[],
  city: string,
): Promise<KeywordSeed[]> {
  console.log("[dataforseo] Getting search volumes for", keywords.length, "keywords");

  const loc = normalizeLocation(city);

  // Try city-level → state-level → national, use whichever has the most hits
  let volumeMap = await fetchVolumes(keywords, loc.full);
  const cityHits = Array.from(volumeMap.values()).filter((v) => v > 0).length;
  console.log("[dataforseo] City-level volumes (", loc.full, "):", cityHits, "of", keywords.length);

  if (cityHits < keywords.length / 3 && loc.state) {
    console.log("[dataforseo] Falling back to state-level:", `${loc.state},United States`);
    const stateMap = await fetchVolumes(keywords, `${loc.state},United States`);
    const stateHits = Array.from(stateMap.values()).filter((v) => v > 0).length;
    console.log("[dataforseo] State-level volumes:", stateHits);
    if (stateHits > cityHits) volumeMap = stateMap;
  }

  const nationalHits = Array.from(volumeMap.values()).filter((v) => v > 0).length;
  if (nationalHits < keywords.length / 3) {
    console.log("[dataforseo] Falling back to national (United States)");
    const nationalMap = await fetchVolumes(keywords, "United States");
    const natHits = Array.from(nationalMap.values()).filter((v) => v > 0).length;
    console.log("[dataforseo] National-level volumes:", natHits);
    if (natHits > nationalHits) volumeMap = nationalMap;
  }

  // Use real volume where available, otherwise estimate so SERP checks always run
  const seeds = keywords
    .map((kw) => ({
      keyword: kw,
      volume: volumeMap.get(kw) ?? 0,
      estimated: !volumeMap.has(kw) || (volumeMap.get(kw) ?? 0) === 0,
    }))
    .map((s) => ({
      keyword: s.keyword,
      volume: s.volume > 0 ? s.volume : estimateVolume(s.keyword),
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);

  console.log(
    "[dataforseo] Final keyword seeds:",
    seeds.length,
    seeds.map((s) => `${s.keyword} (${s.volume})`).join(", "),
  );

  return seeds;
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

// ── Directory / aggregator blocklist ──────────────────────────────────────

const BLOCKED_DOMAINS = new Set([
  "yelp.com", "angi.com", "angieslist.com", "homeadvisor.com",
  "thumbtack.com", "houzz.com", "bbb.org", "porch.com", "bark.com",
  "checkatrade.com", "hipages.com", "facebook.com", "instagram.com",
  "youtube.com", "google.com", "bing.com", "yellowpages.com",
  "mapquest.com", "tripadvisor.com", "linkedin.com", "twitter.com",
  "x.com", "tiktok.com", "pinterest.com", "nextdoor.com",
  "manta.com", "chamberofcommerce.com", "superpages.com",
  "whitepages.com", "buildzoom.com", "expertise.com",
  "topratedlocal.com", "birdeye.com", "trustpilot.com",
]);

function isBlockedDomain(domain: string): boolean {
  const lower = domain.toLowerCase();
  return Array.from(BLOCKED_DOMAINS).some(
    (blocked) => lower === blocked || lower.endsWith(`.${blocked}`),
  );
}

// ── 4. Find consistent primary competitor ────────────────────────────────

function findPrimaryCompetitor(
  serpResults: { organics: SerpOrganic[] }[],
): { name: string; domain: string } | null {
  const domainScores = new Map<string, { score: number; names: Map<string, number> }>();

  for (const result of serpResults) {
    for (const org of result.organics) {
      const domain = org.domain.toLowerCase();
      if (!domain || isBlockedDomain(domain)) continue;

      const entry = domainScores.get(domain) ?? { score: 0, names: new Map<string, number>() };
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
  businessName: string,
  city: string,
  category: string,
  websiteUrl?: string,
): Promise<MarketScanResult> {
  // Step 1 — Fetch real keywords from DataForSEO (no AI generation)
  const realKeywords = await fetchRealKeywords(category, city, websiteUrl);

  // Step 2 — Get search volumes for keywords (real or estimated)
  const seeds = await getSearchVolumes(realKeywords, city);
  console.log("[market-scan] Keyword seeds for SERP:", seeds.length);

  // Step 3 — SERP for each keyword (all in parallel)
  const bizDomain = websiteUrl
    ?.replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  type SerpEntry = { keyword: string; volume: number; myRank: number | null; organics: SerpOrganic[] };

  const serpSettled = await Promise.allSettled(
    seeds.map((s) => getKeywordSerp(s.keyword, city, businessName, bizDomain)),
  );

  const serpResults: SerpEntry[] = seeds.map((seed, i) => {
    const result = serpSettled[i]!;
    if (result.status === "fulfilled") {
      return { ...seed, ...result.value };
    }
    return { ...seed, myRank: null, organics: [] };
  });

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

  // Step 6 — Top competitors list (excluding directories/aggregators)
  const domainCounts = new Map<string, { name: string; count: number }>();
  for (const serp of serpResults) {
    for (const org of serp.organics.slice(0, 5)) {
      const d = org.domain.toLowerCase();
      if (isBlockedDomain(d)) continue;
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
