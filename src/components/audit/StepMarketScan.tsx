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
      {/* Result Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#29b6f6]/20 bg-[#29b6f6]/[0.06] px-3 py-1 text-xs font-extrabold uppercase tracking-[2px] text-[#29b6f6]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#29b6f6]" />
          AI Market Scan Complete
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          Your competitors are capturing
          <br />
          <span className="text-rose-400">searches you&apos;re missing</span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed text-white/40">
          We analyzed {data.totalKeywordsAnalyzed} local keywords in{" "}
          <span className="font-bold text-white/60">{city}</span> and found{" "}
          <span className="font-bold text-rose-400">
            {data.keywords.length} keyword gaps
          </span>{" "}
          where{" "}
          <span className="font-bold text-white/60">
            {data.primaryCompetitorName}
          </span>{" "}
          is outranking{" "}
          <span className="font-bold text-white/60">{businessName}</span>.
        </p>
      </div>

      <OpportunityCards data={data} />

      <section>
        <h2 className="mb-4 text-[10px] font-extrabold uppercase tracking-[2px] text-white/30">
          Profile Comparison
        </h2>
        <CompetitorComparison data={data} />
      </section>

      <section>
        <KeywordGapTable
          keywords={data.keywords}
          competitorName={data.primaryCompetitorName}
        />
      </section>

      <section>
        <AIInsightPanel comparison={comparison} data={data} />
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-r from-[#16161a] to-[#1a1a2e] p-8 text-center sm:p-10">
        <h2 className="text-2xl font-black text-white">
          Ready to close these gaps?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-white/35">
          Download a free DIY optimization guide or let our AI fix your profile
          automatically.
        </p>
        <button
          onClick={onNext}
          className="mt-6 rounded-full bg-[#29b6f6] px-8 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_6px_24px_rgba(41,182,246,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(41,182,246,0.55)]"
        >
          See My Options →
        </button>
      </div>

      <p className="text-center text-xs font-semibold text-white/15">
        Based on Google Business Profile data and local keyword analytics for{" "}
        {city}. Rankings checked across {data.totalKeywordsAnalyzed} local
        keywords via live SERP data.
      </p>
    </div>
  );
}
