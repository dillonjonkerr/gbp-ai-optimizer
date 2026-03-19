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

import type { ScrapedWebsiteData } from "./website-scraper";
import { buildKeywordSeedsFromScrapedData } from "./website-scraper";

const MIN_LOCAL_SEARCH_VOLUME = 100;
const MIN_STATEWIDE_SEARCH_VOLUME = 150;
const TOP_LOCAL_KEYWORD_COUNT = 3;
const TOP_STATEWIDE_KEYWORD_COUNT = 5;

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

function buildSeedKeywords(category: string, serviceAreas: string[]): string[] {
  const cat = category.toLowerCase();
  const baseKeywords = [
    cat,
    `${cat} near me`,
    `best ${cat}`,
    `${cat} services`,
    `${cat} company`,
    `${cat} cost`,
    `${cat} estimate`,
    `${cat} reviews`,
    `local ${cat}`,
    `${cat} contractor`,
    `${cat} residential`,
    `${cat} commercial`,
    `professional ${cat}`,
    `${cat} business`,
    `${cat} specialist`,
    `${cat} expert`,
    `${cat} repair`,
    `${cat} maintenance`,
    `${cat} installation`,
    `${cat} quote`,
  ];

  // Add location-based keywords for service areas
  const localKeywords = [];
  for (const area of serviceAreas.slice(0, 5)) { // Limit to first 5 areas
    const cleanArea = area.split(",")[0]?.trim() || area;
    localKeywords.push(
      `${cat} ${cleanArea}`,
      `${cat} in ${cleanArea}`,
      `${cleanArea} ${cat}`,
    );
  }

  return [...baseKeywords, ...localKeywords];
}

function buildScrapedSeeds(
  scrapedData: ScrapedWebsiteData | null,
  category: string,
): string[] {
  if (!scrapedData) return [];
  return buildKeywordSeedsFromScrapedData(scrapedData, category);
}

export async function fetchRealKeywords(
  category: string,
  city: string,
  serviceAreas: string[] = [],
  websiteUrl?: string,
  scrapedData?: ScrapedWebsiteData | null,
): Promise<{ topVolumeKeywords: string[]; additionalAreaKeywords: string[] }> {
  const allServiceAreas = [city, ...serviceAreas];
  const baseSeeds = buildSeedKeywords(category, allServiceAreas);
  const scrapedSeeds = buildScrapedSeeds(scrapedData ?? null, category);

  const allSeeds = Array.from(new Set([...baseSeeds, ...scrapedSeeds]));
  const allKeywords = new Map<string, number>();

  console.log("[dataforseo] Fetching real keywords for", allSeeds.length, "seeds (base:", baseSeeds.length, "+ scraped:", scrapedSeeds.length, ")");

  // DataForSEO keywords_for_keywords accepts max 20 seeds per request — batch if needed
  const seedBatches: string[][] = [];
  for (let i = 0; i < allSeeds.length; i += 20) {
    seedBatches.push(allSeeds.slice(i, i + 20));
  }

  // Source 1: keywords_for_keywords — real Google Ads keyword ideas from seed terms
  for (const batch of seedBatches) {
    try {
      const data = await dfsPost<KeywordsForKeywordsResult>(
        "keywords_data/google_ads/keywords_for_keywords/live",
        [{
          keywords: batch,
          language_code: "en",
          location_name: "United States",
          sort_by: "search_volume",
          limit: 200,
        }],
      );

      const task = data.tasks?.[0];
      if (task?.status_code === 20000) {
        for (const item of task.result?.[0]?.items ?? []) {
          const kw = item.keyword_data.keyword.toLowerCase();
          const vol = item.keyword_data.keyword_info?.search_volume ?? 0;
          if (vol > 0) allKeywords.set(kw, Math.max(allKeywords.get(kw) ?? 0, vol));
        }
      }
    } catch (err) {
      console.warn("[dataforseo] keywords_for_keywords batch failed:", err);
    }
  }

  console.log("[dataforseo] keywords_for_keywords returned:", allKeywords.size, "keywords with national volume > 0");

  // Source 2: keywords_for_site — if business has a website, pull keywords Google associates with it
  if (websiteUrl) {
    try {
      const data = await dfsPost<KeywordsForKeywordsResult>(
        "keywords_data/google_ads/keywords_for_site/live",
        [{
          target: websiteUrl,
          language_code: "en",
          location_name: "United States",
          sort_by: "search_volume",
          limit: 200,
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
        console.log("[dataforseo] keywords_for_site added:", added, "new keywords with national volume > 0");
      }
    } catch (err) {
      console.warn("[dataforseo] keywords_for_site failed:", err);
    }
  }

  // Include seed keywords that might not have come back with volume yet (we'll verify volume later)
  for (const seed of baseSeeds) {
    if (!allKeywords.has(seed.toLowerCase())) {
      allKeywords.set(seed.toLowerCase(), 0);
    }
  }

  // Get top 3 volume keywords from our initial 20
  const sortedByVolume = Array.from(allKeywords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const topVolumeKeywords = sortedByVolume.slice(0, 3).map(([kw]) => kw);

  // Find 5 more top keywords for the entire area/state
  const additionalAreaKeywords = sortedByVolume.slice(3, 8).map(([kw]) => kw);

  console.log("[dataforseo] Top 3 volume keywords:", topVolumeKeywords);
  console.log("[dataforseo] Additional 5 area keywords:", additionalAreaKeywords);

  return { topVolumeKeywords, additionalAreaKeywords };
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

type KeywordSeed = { keyword: string; volume: number; type: 'local' | 'statewide' };

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
  topVolumeKeywords: string[],
  additionalAreaKeywords: string[],
  city: string,
): Promise<KeywordSeed[]> {
  const allKeywords = [...topVolumeKeywords, ...additionalAreaKeywords];
  console.log("[dataforseo] Getting search volumes for", allKeywords.length, "keywords");

  const loc = normalizeLocation(city);

  // Try city-level → state-level → national, use whichever has the most hits
  let volumeMap = await fetchVolumes(allKeywords, loc.full);
  const cityHits = Array.from(volumeMap.values()).filter((v) => v > 0).length;
  console.log("[dataforseo] City-level volumes (", loc.full, "):", cityHits, "of", allKeywords.length);

  if (cityHits < allKeywords.length / 3 && loc.state) {
    console.log("[dataforseo] Falling back to state-level:", `${loc.state},United States`);
    const stateMap = await fetchVolumes(allKeywords, `${loc.state},United States`);
    const stateHits = Array.from(stateMap.values()).filter((v) => v > 0).length;
    console.log("[dataforseo] State-level volumes:", stateHits);
    if (stateHits > cityHits) volumeMap = stateMap;
  }

  const nationalHits = Array.from(volumeMap.values()).filter((v) => v > 0).length;
  if (nationalHits < allKeywords.length / 3) {
    console.log("[dataforseo] Falling back to national (United States)");
    const nationalMap = await fetchVolumes(allKeywords, "United States");
    const natHits = Array.from(nationalMap.values()).filter((v) => v > 0).length;
    console.log("[dataforseo] National-level volumes:", natHits);
    if (natHits > nationalHits) volumeMap = nationalMap;
  }

  // Process local keywords (top 3 with minimum volume of 100)
  const localSeeds = topVolumeKeywords
    .map((kw) => ({
      keyword: kw,
      volume: volumeMap.get(kw) ?? 0,
      type: 'local' as const,
    }))
    .filter((s) => s.volume >= MIN_LOCAL_SEARCH_VOLUME)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, TOP_LOCAL_KEYWORD_COUNT);

  // Process statewide/area keywords (5 more with higher volume like "near me")
  const statewideSeeds = additionalAreaKeywords
    .map((kw) => ({
      keyword: kw,
      volume: volumeMap.get(kw) ?? 0,
      type: 'statewide' as const,
    }))
    .filter((s) => s.volume >= MIN_STATEWIDE_SEARCH_VOLUME || s.keyword.includes("near me"))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, TOP_STATEWIDE_KEYWORD_COUNT);

  const verifiedSeeds = [...localSeeds, ...statewideSeeds];

  // If we couldn't find enough keywords, fall back to top available real-volume keywords
  const totalNeeded = TOP_LOCAL_KEYWORD_COUNT + TOP_STATEWIDE_KEYWORD_COUNT;
  if (verifiedSeeds.length < totalNeeded) {
    const remaining = allKeywords
      .map((kw) => ({ 
        keyword: kw, 
        volume: volumeMap.get(kw) ?? 0, 
        type: topVolumeKeywords.includes(kw) ? 'local' as const : 'statewide' as const 
      }))
      .filter((s) => s.volume > 0 && !verifiedSeeds.some((v) => v.keyword === s.keyword))
      .sort((a, b) => b.volume - a.volume);

    for (const kw of remaining) {
      if (verifiedSeeds.length >= totalNeeded) break;
      verifiedSeeds.push(kw);
    }
  }

  console.log(
    "[dataforseo] Final top 8 keyword seeds:",
    verifiedSeeds.length,
    "Local (min", MIN_LOCAL_SEARCH_VOLUME, "vol):",
    localSeeds.length,
    "Statewide (min", MIN_STATEWIDE_SEARCH_VOLUME, "vol):",
    statewideSeeds.length
  );

  return verifiedSeeds;
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

// ── 4. Find competitors by keyword type ──────────────────────────────────

function findCompetitorsByType(
  serpResults: { keyword: string; type: 'local' | 'statewide'; organics: SerpOrganic[] }[],
): { 
  localCompetitors: { name: string; domain: string; keywordCount: number }[];
  statewideCompetitors: { name: string; domain: string; keywordCount: number }[];
} {
  const localDomainScores = new Map<string, { name: string; score: number; keywordCount: number }>();
  const statewideDomainScores = new Map<string, { name: string; score: number; keywordCount: number }>();

  for (const result of serpResults) {
    const targetMap = result.type === 'local' ? localDomainScores : statewideDomainScores;
    
    for (const org of result.organics) {
      const domain = org.domain.toLowerCase();
      if (!domain || isBlockedDomain(domain)) continue;

      const entry = targetMap.get(domain) ?? { name: org.title, score: 0, keywordCount: 0 };
      entry.score += Math.max(1, 21 - org.rank);
      entry.keywordCount++;
      targetMap.set(domain, entry);
    }
  }

  const localCompetitors = Array.from(localDomainScores.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 5)
    .map(([domain, { name, keywordCount }]) => ({ name, domain, keywordCount }));

  const statewideCompetitors = Array.from(statewideDomainScores.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 5)
    .map(([domain, { name, keywordCount }]) => ({ name, domain, keywordCount }));

  return { localCompetitors, statewideCompetitors };
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
  type: 'local' | 'statewide';
};

export type CompetitorProfile = {
  name: string;
  domain: string;
  keywordCount: number;
  rankings: { keyword: string; rank: number; volume: number }[];
};

export type MarketScanResult = {
  gapKeywords: GapKeyword[];
  totalKeywordsAnalyzed: number;
  totalLocalSearches: number;
  competitorProfiles: {
    local: CompetitorProfile[];
    statewide: CompetitorProfile[];
  };
  estimatedMissedTraffic: number;
};

export async function runMarketScan(
  businessName: string,
  city: string,
  category: string,
  serviceAreas: string[] = [],
  websiteUrl?: string,
  scrapedData?: ScrapedWebsiteData | null,
): Promise<MarketScanResult> {
  // Step 1 — Fetch real keywords from DataForSEO + scraped website data
  const { topVolumeKeywords, additionalAreaKeywords } = await fetchRealKeywords(
    category, 
    city, 
    serviceAreas, 
    websiteUrl, 
    scrapedData
  );

  // Step 2 — Get search volumes for keywords (real or estimated)
  const seeds = await getSearchVolumes(topVolumeKeywords, additionalAreaKeywords, city);
  console.log("[market-scan] Keyword seeds for SERP:", seeds.length);

  // Step 3 — SERP for each keyword (all in parallel)
  const bizDomain = websiteUrl
    ?.replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  type SerpEntry = { 
    keyword: string; 
    volume: number; 
    type: 'local' | 'statewide'; 
    myRank: number | null; 
    organics: SerpOrganic[] 
  };

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

  // Step 4 — Find competitors by type (local vs statewide)
  const { localCompetitors, statewideCompetitors } = findCompetitorsByType(serpResults);

  // Step 5 — Build detailed competitor profiles with rankings
  const buildCompetitorProfiles = (
    competitors: { name: string; domain: string; keywordCount: number }[],
    type: 'local' | 'statewide'
  ): CompetitorProfile[] => {
    return competitors.map(comp => {
      const rankings = serpResults
        .filter(serp => serp.type === type)
        .map(serp => {
          const match = serp.organics.find(org => org.domain.toLowerCase() === comp.domain.toLowerCase());
          return match ? { keyword: serp.keyword, rank: match.rank, volume: serp.volume } : null;
        })
        .filter((r): r is NonNullable<typeof r> => r !== null)
        .sort((a, b) => a.rank - b.rank);

      return {
        name: comp.name,
        domain: comp.domain,
        keywordCount: comp.keywordCount,
        rankings,
      };
    });
  };

  const competitorProfiles = {
    local: buildCompetitorProfiles(localCompetitors, 'local'),
    statewide: buildCompetitorProfiles(statewideCompetitors, 'statewide'),
  };

  console.log("[market-scan] Local competitors:", localCompetitors.length);
  console.log("[market-scan] Statewide competitors:", statewideCompetitors.length);

  // Step 6 — Build gap keywords using primary competitor from each type
  const gapKeywords: GapKeyword[] = [];
  const primaryLocalCompetitor = localCompetitors[0];
  const primaryStatewideCompetitor = statewideCompetitors[0];

  for (const serp of serpResults) {
    const primaryComp = serp.type === 'local' ? primaryLocalCompetitor : primaryStatewideCompetitor;
    let competitorRank: number | null = null;

    if (primaryComp) {
      const match = serp.organics.find(
        (o) => o.domain.toLowerCase() === primaryComp.domain.toLowerCase(),
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
      type: serp.type,
    });
  }

  // Sort by traffic opportunity (highest first)
  gapKeywords.sort((a, b) => b.trafficOpportunity - a.trafficOpportunity);

  const estimatedMissedTraffic = gapKeywords.reduce((s, k) => s + k.trafficOpportunity, 0);
  const totalLocalSearches = serpResults.reduce((s, k) => s + k.volume, 0);

  console.log("[market-scan] Gap keywords:", gapKeywords.length, "of", serpResults.length);
  console.log("[market-scan] Estimated missed traffic:", estimatedMissedTraffic);

  return {
    gapKeywords,
    totalKeywordsAnalyzed: serpResults.length,
    totalLocalSearches,
    competitorProfiles,
    estimatedMissedTraffic,
  };
}