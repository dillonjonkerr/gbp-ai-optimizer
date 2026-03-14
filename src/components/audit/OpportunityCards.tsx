"use client";

import type { MarketScan } from "@/lib/types";

export default function OpportunityCards({ data }: { data: MarketScan }) {
  const gapCount = data.keywords.length;
  const total = data.totalKeywordsAnalyzed;
  const biggestKeyword = data.keywords[0];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Keywords lost */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-rose-50" />
        <p className="relative text-sm font-medium text-slate-500">
          Keywords Lost
        </p>
        <p className="relative mt-2 text-3xl font-bold tabular-nums text-slate-900">
          {gapCount}
          <span className="text-lg font-normal text-slate-400">
            {" "}/ {total}
          </span>
        </p>
        <p className="relative mt-1 text-xs text-slate-400">
          high-intent local keywords
        </p>
      </div>

      {/* Missed searches */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50/80 to-white p-6 shadow-sm">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-rose-100/50" />
        <p className="relative text-sm font-medium text-rose-600">
          Estimated Missed Searches
        </p>
        <p className="relative mt-2 text-3xl font-bold tabular-nums text-rose-700">
          {data.estimatedMissedTraffic.toLocaleString()}
        </p>
        <p className="relative mt-1 text-xs text-rose-400">
          searches / month
        </p>
      </div>

      {/* Biggest opportunity */}
      <div className="relative overflow-hidden rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50/80 to-white p-6 shadow-sm">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary-100/50" />
        <p className="relative text-sm font-medium text-primary-600">
          Biggest Opportunity
        </p>
        <p className="relative mt-2 text-lg font-bold text-slate-900 leading-tight">
          {biggestKeyword ? `"${biggestKeyword.keyword}"` : "—"}
        </p>
        {biggestKeyword && (
          <p className="relative mt-1 text-xs text-primary-500">
            {biggestKeyword.volume.toLocaleString()} searches ·{" "}
            {biggestKeyword.yourRank ? `You: #${biggestKeyword.yourRank}` : "Not ranked"} ·{" "}
            Them: #{biggestKeyword.competitorRank}
          </p>
        )}
      </div>
    </div>
  );
}
