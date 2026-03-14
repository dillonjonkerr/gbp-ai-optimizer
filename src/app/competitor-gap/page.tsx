"use client";

import {
  Star,
  Camera,
  Globe,
  Tag,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Example data - in production this would come from props/API
const EXAMPLE_DATA = {
  yourBusiness: {
    name: "Mike's Professional Painting",
    rating: 4.2,
    reviews: 47,
    photos: 12,
    category: "Painter",
    website: true,
    rankedKeywords: 8,
  },
  competitor: {
    name: "Elite Painters Denver",
    rating: 4.9,
    reviews: 234,
    photos: 89,
    category: "Painting Contractor",
    website: true,
    rankedKeywords: 34,
  },
  city: "Denver",
  summary: {
    keywordsLost: 26,
    estimatedMissedTraffic: 1240,
    biggestGap: "house painters denver",
  },
  keywords: [
    {
      keyword: "house painters denver",
      volume: 1900,
      yourRank: null,
      competitorRank: 2,
      trafficOpportunity: 380,
      priority: "high" as const,
    },
    {
      keyword: "interior painting denver",
      volume: 880,
      yourRank: 14,
      competitorRank: 3,
      trafficOpportunity: 220,
      priority: "high" as const,
    },
    {
      keyword: "exterior house painting",
      volume: 720,
      yourRank: null,
      competitorRank: 1,
      trafficOpportunity: 180,
      priority: "high" as const,
    },
    {
      keyword: "commercial painters near me",
      volume: 590,
      yourRank: 18,
      competitorRank: 4,
      trafficOpportunity: 145,
      priority: "medium" as const,
    },
    {
      keyword: "residential painting services",
      volume: 480,
      yourRank: 12,
      competitorRank: 2,
      trafficOpportunity: 120,
      priority: "medium" as const,
    },
    {
      keyword: "cabinet painting denver",
      volume: 390,
      yourRank: null,
      competitorRank: 5,
      trafficOpportunity: 95,
      priority: "medium" as const,
    },
    {
      keyword: "best painters denver",
      volume: 320,
      yourRank: 20,
      competitorRank: 1,
      trafficOpportunity: 80,
      priority: "low" as const,
    },
    {
      keyword: "affordable painting contractors",
      volume: 260,
      yourRank: 15,
      competitorRank: 6,
      trafficOpportunity: 65,
      priority: "low" as const,
    },
  ],
  aiInsight: {
    summary:
      "Elite Painters Denver dominates local search due to their significantly higher review count and photo portfolio. Their profile is 5x more complete than yours, which Google rewards with better local pack visibility.",
    whyWinning: [
      "234 reviews vs your 47 creates a strong trust signal",
      "89 photos showcase work quality and build confidence",
      "More specific category targeting (Painting Contractor vs Painter)",
      "Complete business description with relevant keywords",
    ],
    whatMissing: [
      "Your profile lacks service area keywords",
      "Photo count is below competitive threshold",
      "Missing responses to existing reviews",
      "No Q&A section to capture long-tail searches",
    ],
    fixFirst:
      "Focus on review acquisition first. Each new review improves your local ranking and builds the social proof needed to convert searchers into leads.",
  },
};

function SummaryCard({
  label,
  value,
  subtext,
  highlight = false,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-white p-6 transition-all",
        highlight
          ? "border-slate-900/10 shadow-lg shadow-slate-900/5"
          : "border-slate-200/80 shadow-sm"
      )}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-sm text-slate-500">{subtext}</p>
      )}
    </div>
  );
}

function ComparisonCard({
  title,
  isYou,
  data,
}: {
  title: string;
  isYou: boolean;
  data: typeof EXAMPLE_DATA.yourBusiness | typeof EXAMPLE_DATA.competitor;
}) {
  return (
    <div
      className={cn(
        "relative flex-1 rounded-xl border bg-white p-6 transition-all",
        isYou
          ? "border-slate-200/80"
          : "border-emerald-200/60 shadow-lg shadow-emerald-500/5"
      )}
    >
      {!isYou && (
        <div className="absolute -top-3 right-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
            <TrendingUp className="h-3 w-3" />
            Outranking You
          </span>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {data.name}
          </h3>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Star className="h-4 w-4 text-amber-400" />
            Rating
          </div>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              data.rating >= 4.5 ? "text-emerald-600" : "text-slate-900"
            )}
          >
            {data.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="flex h-4 w-4 items-center justify-center text-xs text-slate-400">
              #
            </span>
            Reviews
          </div>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              !isYou && data.reviews > 100 ? "text-emerald-600" : "text-slate-900"
            )}
          >
            {data.reviews}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Camera className="h-4 w-4 text-slate-400" />
            Photos
          </div>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              !isYou && data.photos > 50 ? "text-emerald-600" : "text-slate-900"
            )}
          >
            {data.photos}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Tag className="h-4 w-4 text-slate-400" />
            Category
          </div>
          <span className="text-sm font-medium text-slate-900">
            {data.category}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Globe className="h-4 w-4 text-slate-400" />
            Website
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              data.website ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {data.website ? "Listed" : "Missing"}
          </span>
        </div>
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Search className="h-4 w-4 text-slate-400" />
              Ranked Keywords
            </div>
            <span
              className={cn(
                "text-sm font-bold tabular-nums",
                !isYou ? "text-emerald-600" : "text-slate-900"
              )}
            >
              {data.rankedKeywords}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeywordTable({ keywords }: { keywords: typeof EXAMPLE_DATA.keywords }) {
  const [expanded, setExpanded] = useState(false);
  const displayedKeywords = expanded ? keywords : keywords.slice(0, 5);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Keyword Gap Analysis
          </h2>
          <span className="text-sm text-slate-500">
            {keywords.length} competitor-winning keywords
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                Keyword
              </th>
              <th className="px-4 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                Search Volume
              </th>
              <th className="px-4 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                Your Rank
              </th>
              <th className="px-4 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                Competitor Rank
              </th>
              <th className="px-4 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                Traffic Opportunity
              </th>
              <th className="px-4 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                Priority
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedKeywords.map((kw, i) => (
              <tr
                key={i}
                className={cn(
                  "transition-colors hover:bg-slate-50/50",
                  kw.priority === "high" && "bg-slate-50/30"
                )}
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-900">
                    {kw.keyword}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="tabular-nums text-slate-600">
                    {kw.volume.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  {kw.yourRank ? (
                    <span className="tabular-nums text-slate-600">
                      #{kw.yourRank}
                    </span>
                  ) : (
                    <span className="text-rose-500">Not ranked</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="tabular-nums font-medium text-emerald-600">
                    #{kw.competitorRank}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="tabular-nums font-semibold text-slate-900">
                    +{kw.trafficOpportunity}
                  </span>
                  <span className="ml-1 text-slate-400">/mo</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                      kw.priority === "high" &&
                        "bg-rose-50 text-rose-700 ring-rose-600/10",
                      kw.priority === "medium" &&
                        "bg-amber-50 text-amber-700 ring-amber-600/10",
                      kw.priority === "low" &&
                        "bg-slate-50 text-slate-600 ring-slate-500/10"
                    )}
                  >
                    {kw.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {keywords.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 px-6 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show {keywords.length - 5} more keywords{" "}
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

function AIInsightPanel({ insight }: { insight: typeof EXAMPLE_DATA.aiInsight }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white shadow-sm">
      <div className="border-b border-slate-100 bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">
            AI Analysis
          </h2>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <p className="text-sm leading-relaxed text-slate-600">
          {insight.summary}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-xs text-emerald-700">
                1
              </span>
              Why They Are Winning
            </h3>
            <ul className="mt-3 space-y-2">
              {insight.whyWinning.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-rose-100 text-xs text-rose-700">
                2
              </span>
              What You Are Missing
            </h3>
            <ul className="mt-3 space-y-2">
              {insight.whatMissing.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900">
              <AlertCircle className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Fix This First
              </p>
              <p className="mt-1 text-sm text-slate-600">{insight.fixFirst}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompetitorGapPage() {
  const data = EXAMPLE_DATA;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/icon.png"
              alt="Paint & Profits"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              Paint <span className="text-primary-500">&</span> Profits
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            <Sparkles className="h-3 w-3" />
            AI Market Scan Complete
          </div>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {"You're losing local traffic to "}
            <span className="text-primary-600">{data.competitor.name}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-slate-600">
            {data.competitor.name} is outperforming you on high-intent local
            keywords in {data.city}, which may be costing you valuable leads
            each month.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Keywords Lost"
            value={data.summary.keywordsLost}
            subtext="competitor-winning keywords"
          />
          <SummaryCard
            label="Estimated Missed Traffic"
            value={`${data.summary.estimatedMissedTraffic.toLocaleString()}`}
            subtext="potential visitors per month"
            highlight
          />
          <SummaryCard
            label="Biggest Keyword Gap"
            value={`"${data.summary.biggestGap}"`}
            subtext="1,900 monthly searches"
          />
        </div>

        {/* Comparison Section */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900">
            Profile Comparison
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            See how your Google Business Profile stacks up against the
            competition.
          </p>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row">
            <ComparisonCard
              title="Your Business"
              isYou={true}
              data={data.yourBusiness}
            />
            <ComparisonCard
              title="Top Competitor"
              isYou={false}
              data={data.competitor}
            />
          </div>
        </div>

        {/* Keyword Gap Table */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900">
            Keywords They Rank For (And You Don{"'"}t)
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            These are the high-intent keywords your competitor is capturing that
            represent missed opportunities.
          </p>
          <div className="mt-6">
            <KeywordTable keywords={data.keywords} />
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="mt-12">
          <AIInsightPanel insight={data.aiInsight} />
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button className="group inline-flex items-center gap-2 rounded-lg bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/15">
            Let AI Fix These Gaps
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="mt-4 text-sm text-slate-500">
            Follow a guided optimization flow to improve your Google Business
            Profile step by step.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200/60 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm text-slate-500">
            Powered by AI-driven local SEO analysis
          </p>
        </div>
      </footer>
    </div>
  );
}
