"use client";

import type { MarketScan } from "@/lib/types";

export default function OpportunityCards({ data }: { data: MarketScan }) {
  const gapCount = data.keywords.length;
  const total = data.totalKeywordsAnalyzed;
  const biggestKeyword = data.keywords[0];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Keywords lost */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Keywords Lost
          </p>
        </div>
        <p className="text-3xl font-bold tabular-nums text-foreground">
          {gapCount}
          <span className="text-lg font-normal text-muted-foreground">
            {" "}/ {total}
          </span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          high-intent local keywords
        </p>
      </div>

      {/* Missed searches */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-destructive">
            Missed Searches
          </p>
        </div>
        <p className="text-3xl font-bold tabular-nums text-destructive">
          {data.estimatedMissedTraffic.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-destructive/70">
          searches / month
        </p>
      </div>

      {/* Biggest opportunity */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-primary">
            Top Opportunity
          </p>
        </div>
        <p className="text-lg font-bold text-foreground leading-tight">
          {biggestKeyword ? `"${biggestKeyword.keyword}"` : "-"}
        </p>
        {biggestKeyword && (
          <p className="mt-1 text-xs text-primary/80">
            {biggestKeyword.volume.toLocaleString()} searches |{" "}
            {biggestKeyword.yourRank ? `You: #${biggestKeyword.yourRank}` : "Not ranked"} |{" "}
            Them: #{biggestKeyword.competitorRank}
          </p>
        )}
      </div>
    </div>
  );
}
