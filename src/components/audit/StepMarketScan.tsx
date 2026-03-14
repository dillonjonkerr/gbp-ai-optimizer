"use client";

import type { MarketScan, ComparisonReport } from "@/lib/types";
import { AlertTriangle, ArrowRight, Zap } from "lucide-react";
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
    <div className="space-y-8">
      {/* Result Header */}
      <div className="text-center animate-fade-in-up">
        <span className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-bold text-white shadow-lg shadow-destructive/30">
          <AlertTriangle className="h-4 w-4" />
          Low Visibility Detected
        </span>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-foreground sm:text-3xl text-balance leading-tight">
          Your competitors are capturing{" "}
          <span className="text-destructive">searches you&apos;re missing</span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed text-muted-foreground">
          We analyzed {data.totalKeywordsAnalyzed} local keywords in{" "}
          <span className="font-bold text-foreground">{city}</span> and found{" "}
          <span className="font-bold text-destructive">
            {data.keywords.length} keyword gaps
          </span>{" "}
          where{" "}
          <span className="font-bold text-foreground">
            {data.primaryCompetitorName}
          </span>{" "}
          is outranking{" "}
          <span className="font-bold text-foreground">{businessName}</span>.
        </p>
      </div>

      {/* Opportunity Cards */}
      <OpportunityCards data={data} />

      {/* Competitor Comparison */}
      <section>
        <h2 className="mb-4 text-lg font-black text-foreground">
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

      {/* AI Insight */}
      <section>
        <AIInsightPanel comparison={comparison} data={data} />
      </section>

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full h-14 rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-xl shadow-primary/40 transition-all hover:bg-primary/90 animate-pulse-glow flex items-center justify-center gap-2"
      >
        <Zap className="h-5 w-5" />
        See How to Fix This
        <ArrowRight className="h-5 w-5" />
      </button>

      <p className="text-center text-xs font-semibold text-muted-foreground">
        Your competitors are getting these leads{" "}
        <span className="text-destructive">right now</span>
      </p>

      {/* Source note */}
      <p className="text-center text-xs text-muted-foreground">
        Based on Google Business Profile data and local keyword analytics for{" "}
        {city}. Rankings checked across {data.totalKeywordsAnalyzed} local
        keywords via live SERP data.
      </p>
    </div>
  );
}
