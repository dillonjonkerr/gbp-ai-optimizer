import * as cheerio from "cheerio";

export type ScrapedWebsiteData = {
  serviceAreas: string[];
  services: string[];
  titleKeywords: string[];
  headingKeywords: string[];
  metaKeywords: string[];
};

const TIMEOUT_MS = 8000;

async function fetchPage(url: string): Promise<string | null> {
  try {
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GBPOptimizer/1.0; +https://gbpoptimizer.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;

    return await res.text();
  } catch (err) {
    console.warn("[website-scraper] Failed to fetch:", url, err);
    return null;
  }
}

function extractTextBlocks($: cheerio.CheerioAPI): string[] {
  const blocks: string[] = [];

  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 2 && text.length < 200) blocks.push(text);
  });

  $("title").each((_, el) => {
    const text = $(el).text().trim();
    if (text) blocks.push(text);
  });

  $('meta[name="description"]').each((_, el) => {
    const content = $(el).attr("content")?.trim();
    if (content) blocks.push(content);
  });

  $('meta[name="keywords"]').each((_, el) => {
    const content = $(el).attr("content")?.trim();
    if (content) blocks.push(content);
  });

  $("li, p, span, a").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 3 && text.length < 150) blocks.push(text);
  });

  return blocks;
}

const AREA_PATTERNS = [
  /(?:serving|service\s*areas?|we\s*serve|areas?\s*(?:we\s*)?served?|locations?\s*served?|coverage\s*area)/i,
  /(?:neighborhoods?|communities|cities|towns|counties|regions)/i,
];

const SERVICE_PATTERNS = [
  /(?:our\s*)?services?/i,
  /(?:what\s*we\s*(?:do|offer))/i,
  /(?:specializ|expertise|solutions?)/i,
];

function extractServiceAreas(
  $: cheerio.CheerioAPI,
  allText: string[],
): string[] {
  const areas = new Set<string>();

  $("a[href*='service-area'], a[href*='locations'], a[href*='areas-served'], a[href*='cities']").each(
    (_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 60) areas.add(text);
    },
  );

  for (const text of allText) {
    for (const pattern of AREA_PATTERNS) {
      if (pattern.test(text)) {
        const places = text
          .replace(pattern, "")
          .split(/[,|•·–—\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 2 && s.length < 50 && !/\d{5}/.test(s));
        for (const place of places) areas.add(place);
      }
    }
  }

  const cityPatterns =
    /\b(?:in|near|serving|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}(?:,\s*[A-Z]{2})?)/g;
  for (const text of allText) {
    let match;
    while ((match = cityPatterns.exec(text)) !== null) {
      const city = match[1]?.trim();
      if (city && city.length > 2 && city.length < 50) areas.add(city);
    }
  }

  return Array.from(areas).slice(0, 30);
}

function extractServices(
  $: cheerio.CheerioAPI,
  allText: string[],
): string[] {
  const services = new Set<string>();

  $(
    'a[href*="service"], a[href*="painting"], a[href*="residential"], a[href*="commercial"]',
  ).each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 3 && text.length < 80) services.add(text);
  });

  $("h2, h3, h4").each((_, el) => {
    const text = $(el).text().trim();
    for (const pattern of SERVICE_PATTERNS) {
      if (pattern.test(text) || text.length < 60) {
        const parent = $(el).parent();
        parent.find("li, p").each((_, child) => {
          const svc = $(child).text().trim();
          if (svc && svc.length > 3 && svc.length < 80) services.add(svc);
        });
      }
    }
  });

  for (const text of allText) {
    for (const pattern of SERVICE_PATTERNS) {
      if (pattern.test(text)) {
        const items = text
          .replace(pattern, "")
          .split(/[,|•·–—\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 3 && s.length < 80);
        for (const item of items) services.add(item);
      }
    }
  }

  return Array.from(services).slice(0, 30);
}

function extractTitleKeywords($: cheerio.CheerioAPI): string[] {
  const keywords: string[] = [];

  const title = $("title").text().trim();
  if (title) {
    const parts = title.split(/[|–—\-,]/).map((s) => s.trim());
    for (const part of parts) {
      if (part.length > 2 && part.length < 60) keywords.push(part);
    }
  }

  const desc = $('meta[name="description"]').attr("content")?.trim();
  if (desc) keywords.push(desc);

  const metaKw = $('meta[name="keywords"]').attr("content")?.trim();
  if (metaKw) {
    const parts = metaKw.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (part.length > 2) keywords.push(part);
    }
  }

  return keywords;
}

function extractHeadingKeywords($: cheerio.CheerioAPI): string[] {
  const keywords: string[] = [];

  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 3 && text.length < 100) {
      keywords.push(text);
    }
  });

  return keywords.slice(0, 20);
}

async function scrapeSubPages(
  baseUrl: string,
  $: cheerio.CheerioAPI,
): Promise<string[]> {
  const subPageTexts: string[] = [];
  const normalizedBase = baseUrl.startsWith("http")
    ? baseUrl
    : `https://${baseUrl}`;
  const baseHost = new URL(normalizedBase).hostname;

  const relevantLinks = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    try {
      const absolute = new URL(href, normalizedBase).href;
      const linkHost = new URL(absolute).hostname;
      if (linkHost !== baseHost) return;

      const path = new URL(absolute).pathname.toLowerCase();
      const relevant =
        /service|area|location|cit|paint|about|residential|commercial/.test(
          path,
        );
      if (relevant) relevantLinks.add(absolute);
    } catch {
      /* skip malformed URLs */
    }
  });

  const pagesToFetch = Array.from(relevantLinks).slice(0, 4);

  const results = await Promise.allSettled(
    pagesToFetch.map(async (url) => {
      const html = await fetchPage(url);
      if (!html) return [];
      const sub$ = cheerio.load(html);
      return extractTextBlocks(sub$);
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      subPageTexts.push(...result.value);
    }
  }

  return subPageTexts;
}

export async function scrapeWebsite(
  url: string,
): Promise<ScrapedWebsiteData | null> {
  console.log("[website-scraper] Scraping:", url);

  const html = await fetchPage(url);
  if (!html) {
    console.warn("[website-scraper] Could not fetch homepage");
    return null;
  }

  const $ = cheerio.load(html);

  $("script, style, nav, footer, header, noscript, iframe").remove();

  const mainPageText = extractTextBlocks($);

  const subPageTexts = await scrapeSubPages(url, cheerio.load(html));
  const allText = [...mainPageText, ...subPageTexts];

  const serviceAreas = extractServiceAreas($, allText);
  const services = extractServices($, allText);
  const titleKeywords = extractTitleKeywords(cheerio.load(html));
  const headingKeywords = extractHeadingKeywords($);
  const metaKeywords = titleKeywords.filter(
    (k) => !headingKeywords.includes(k),
  );

  console.log("[website-scraper] Found:", {
    serviceAreas: serviceAreas.length,
    services: services.length,
    titleKeywords: titleKeywords.length,
    headingKeywords: headingKeywords.length,
  });

  return {
    serviceAreas,
    services,
    titleKeywords,
    headingKeywords,
    metaKeywords,
  };
}

export function buildKeywordSeedsFromScrapedData(
  scrapedData: ScrapedWebsiteData,
  category: string,
): string[] {
  const seeds = new Set<string>();
  const cat = category.toLowerCase();
  const catFirstWord = cat.split(" ")[0]!;

  for (const service of scrapedData.services) {
    const svc = service.toLowerCase().trim();
    if (svc.length < 3 || svc.length > 50) continue;
    seeds.add(svc);
  }

  for (const heading of scrapedData.headingKeywords) {
    const h = heading.toLowerCase().trim();
    if (h.length > 5 && h.length < 60 && h.includes(catFirstWord)) {
      seeds.add(h);
    }
  }

  for (const title of scrapedData.titleKeywords) {
    const t = title.toLowerCase().trim();
    if (t.length > 5 && t.length < 60) {
      seeds.add(t);
    }
  }

  return Array.from(seeds).slice(0, 50);
}
