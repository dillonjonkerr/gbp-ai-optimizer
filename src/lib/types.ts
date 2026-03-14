export const INDUSTRIES = [
  "Painter",
  "Roofer",
  "Plumber",
  "HVAC",
  "Remodeler",
  "Landscaper",
  "Electrician",
  "Flooring",
  "Window Installer",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

// Step 1 — Business info collected from user
export type BusinessInfo = {
  businessName: string;
  city: string;
  industry: Industry | "";
};

// Step 2 — Local market scan
export type KeywordData = {
  keyword: string;
  volume: number;
  yourRank: number | null;
  topCompetitorRank: number;
  topCompetitor: string;
  missedTraffic: number;
};

export type MarketScan = {
  keywords: KeywordData[];
  topCompetitors: string[];
  estimatedMissedTraffic: number;
  radiusMiles: number;
  totalLocalSearches: number;
};

// Step 3 — Comparison report
export type ComparisonReport = {
  businessName: string;
  address: string;
  rating: number;
  score: number;
  competitorScore: number;
  reviewCount: number;
  photoCount: number;
  hasWebsite: boolean;
  hasPhone: boolean;
  category: string;
  aiSummary: string;
  missedOpportunities: string[];
  keywordGaps: { keyword: string; you: string; competitor: string }[];
};

// Full audit result from API
export type AuditResult = {
  marketScan: MarketScan;
  comparison: ComparisonReport;
  recommendations: string[];
  suggestedPosts: string[];
  suggestedQA: { question: string; answer: string }[];
};

// Step 5 — Optimization wizard phases
export type OptimizationPhase =
  | "profile-basics"
  | "services"
  | "description"
  | "reviews"
  | "qa-posts";

export const OPTIMIZATION_PHASES: {
  id: OptimizationPhase;
  label: string;
  description: string;
}[] = [
  {
    id: "profile-basics",
    label: "Profile Basics",
    description: "Business name, address, hours, categories",
  },
  {
    id: "services",
    label: "Services",
    description: "Add and optimize your service listings",
  },
  {
    id: "description",
    label: "Business Description",
    description: "Write an SEO-optimized description",
  },
  {
    id: "reviews",
    label: "Reviews & Replies",
    description: "Respond to reviews and request new ones",
  },
  {
    id: "qa-posts",
    label: "Q&A & Posts",
    description: "Add Q&A entries and schedule posts",
  },
];
