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
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI Market Scan Complete
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
          Your competitors are capturing
          <br />
          <span className="text-destructive">searches you&apos;re missing</span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-muted-foreground leading-relaxed">
          We analyzed {data.totalKeywordsAnalyzed} local keywords in{" "}
          <span className="font-medium text-foreground">{city}</span> and found{" "}
          <span className="font-semibold text-destructive">
            {data.keywords.length} keyword gaps
          </span>{" "}
          where{" "}
          <span className="font-medium text-foreground">
            {data.primaryCompetitorName}
          </span>{" "}
          is outranking{" "}
          <span className="font-medium text-foreground">{businessName}</span>.
        </p>
      </div>

      {/* Opportunity Cards */}
      <OpportunityCards data={data} />

      {/* Competitor Comparison */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Profile Comparison
        </h2>
        <CompetitorComparison data={data} />
      </section>

      {/* Keyword Gap Table */}
      <section>
        <KeywordGapTable
          keywords={data.keywords}
          competitorName={data.primaryCompetitorName}
        />
      </section>

      {/* AI Insight Panel */}
      <section>
        <AIInsightPanel comparison={comparison} data={data} />
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          Ready to close these gaps?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
          Download a free DIY optimization guide or let our AI fix your profile
          automatically.
        </p>
        <button
          onClick={onNext}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-8 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          See My Options
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Source note */}
      <p className="text-center text-xs text-muted-foreground">
        Based on Google Business Profile data and local keyword analytics for{" "}
        {city}. Rankings checked across {data.totalKeywordsAnalyzed} local
        keywords via live SERP data.
      </p>
    </div>
  );
}
