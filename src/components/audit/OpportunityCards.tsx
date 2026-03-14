"use client";

import type { MarketScan } from "@/lib/types";
import { SearchX, Target, TrendingUp } from "lucide-react";

export default function OpportunityCards({ data }: { data: MarketScan }) {
  const gapCount = data.keywords.length;
  const total = data.totalKeywordsAnalyzed;
  const biggestKeyword = data.keywords[0];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {/* Keywords lost */}
      <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-md text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/30">
          <SearchX className="h-6 w-6" />
        </div>
        <div className="text-2xl font-black text-foreground">
          {gapCount}
          <span className="text-base font-bold text-muted-foreground">
            {" "}
            / {total}
          </span>
        </div>
        <div className="text-xs font-semibold text-muted-foreground">
          high-intent keywords lost
        </div>
      </div>

      {/* Missed searches */}
      <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-5 shadow-md text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
          <Target className="h-6 w-6" />
        </div>
        <div className="text-2xl font-black text-foreground">
          {data.estimatedMissedTraffic.toLocaleString()}
        </div>
        <div className="text-xs font-semibold text-muted-foreground">
          missed searches / month
        </div>
      </div>

      {/* Biggest opportunity */}
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 shadow-md text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
          <TrendingUp className="h-6 w-6" />
        </div>
        {biggestKeyword ? (
          <>
            <div className="text-base font-black text-foreground leading-tight">
              &ldquo;{biggestKeyword.keyword}&rdquo;
            </div>
            <div className="text-xs font-semibold text-muted-foreground mt-1">
              {biggestKeyword.volume.toLocaleString()} searches ·{" "}
              {biggestKeyword.yourRank
                ? `You: #${biggestKeyword.yourRank}`
                : "Not ranked"}
            </div>
          </>
        ) : (
          <div className="text-base font-black text-foreground">—</div>
        )}
      </div>
    </div>
  );
}
