"use client";

import type { MarketScan } from "@/lib/types";

export default function OpportunityCards({ data }: { data: MarketScan }) {
  const gapCount = data.keywords.length;
  const total = data.totalKeywordsAnalyzed;
  const biggestKeyword = data.keywords[0];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/[0.07] bg-[#16161a] p-6">
        <p className="text-xs font-extrabold uppercase tracking-[2px] text-white/30">
          Keywords Lost
        </p>
        <p className="mt-3 text-3xl font-black tabular-nums text-white">
          {gapCount}
          <span className="text-lg font-normal text-white/25">
            {" "}/ {total}
          </span>
        </p>
        <p className="mt-1 text-xs font-semibold text-white/25">
          high-intent local keywords
        </p>
      </div>

      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-6">
        <p className="text-xs font-extrabold uppercase tracking-[2px] text-rose-400">
          Missed Searches
        </p>
        <p className="mt-3 text-3xl font-black tabular-nums text-rose-400">
          {data.estimatedMissedTraffic.toLocaleString()}
        </p>
        <p className="mt-1 text-xs font-semibold text-rose-400/50">
          searches / month
        </p>
      </div>

      <div className="rounded-2xl border border-[#29b6f6]/20 bg-[#29b6f6]/[0.06] p-6">
        <p className="text-xs font-extrabold uppercase tracking-[2px] text-[#29b6f6]">
          Biggest Opportunity
        </p>
        <p className="mt-3 text-lg font-black leading-tight text-white">
          {biggestKeyword ? `"${biggestKeyword.keyword}"` : "—"}
        </p>
        {biggestKeyword && (
          <p className="mt-1 text-xs font-semibold text-[#29b6f6]/60">
            {biggestKeyword.volume.toLocaleString()} searches ·{" "}
            {biggestKeyword.yourRank ? `You: #${biggestKeyword.yourRank}` : "Not ranked"} ·{" "}
            Them: #{biggestKeyword.competitorRank}
          </p>
        )}
      </div>
    </div>
  );
}
