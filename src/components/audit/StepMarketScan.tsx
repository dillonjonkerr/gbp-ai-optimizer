"use client";

import type { MarketScan, ComparisonReport } from "@/lib/types";
import OpportunityCards from "./OpportunityCards";
import CompetitorComparison from "./CompetitorComparison";
import KeywordGapTable from "./KeywordGapTable";
import AIInsightPanel from "./AIInsightPanel";

export default function StepMarketScan({
  data,
  comparison,
  businessName,
  city,
  onNext,
}: {
  data: MarketScan;
  comparison: ComparisonReport;
  businessName: string;
  city: string;
  onNext: () => void;
}) {
  return (
    <div className="space-y-10">
      {/* ── 1. Result Header ── */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50/60 px-3 py-1 text-xs font-semibold text-primary-700">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
          AI Market Scan Complete
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Your competitors are capturing
          <br />
          <span className="text-rose-600">searches you&apos;re missing</span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-500">
          We analyzed {data.totalKeywordsAnalyzed} local keywords in{" "}
          <span className="font-medium text-slate-700">{city}</span> and found{" "}
          <span className="font-semibold text-rose-600">
            {data.keywords.length} keyword gaps
          </span>{" "}
          where{" "}
          <span className="font-medium text-slate-700">
            {data.primaryCompetitorName}
          </span>{" "}
          is outranking{" "}
          <span className="font-medium text-slate-700">{businessName}</span>.
        </p>
      </div>

      {/* ── 2. Opportunity Cards ── */}
      <OpportunityCards data={data} />

      {/* ── 3. Competitor Comparison ── */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Profile Comparison
        </h2>
        <CompetitorComparison data={data} />
      </section>

      {/* ── 4. Keyword Gap Table ── */}
      <section>
        <KeywordGapTable
          keywords={data.keywords}
          competitorName={data.primaryCompetitorName}
        />
      </section>

      {/* ── 5. AI Insight Panel ── */}
      <section>
        <AIInsightPanel comparison={comparison} data={data} />
      </section>

      {/* ── 6. CTA ── */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center shadow-lg sm:p-10">
        <h2 className="text-2xl font-bold text-white">
          Let AI Fix These Ranking Gaps
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">
          Follow a guided AI optimization flow to improve your Google Business
          Profile, close keyword gaps, and start capturing the searches
          you&apos;re missing.
        </p>
        <button
          onClick={onNext}
          className="mt-6 rounded-xl bg-primary-500 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Start Optimization →
        </button>
      </div>

      {/* ── Source note ── */}
      <p className="text-center text-xs text-slate-400">
        Based on Google Business Profile data and local keyword analytics for{" "}
        {city}. Rankings checked across {data.totalKeywordsAnalyzed} local
        keywords via live SERP data.
      </p>
    </div>
  );
}
