"use client";

import type { ComparisonReport, MarketScan } from "@/lib/types";
import { Sparkles } from "lucide-react";

export default function AIInsightPanel({
  comparison,
  data,
}: {
  comparison: ComparisonReport;
  data: MarketScan;
}) {
  const comp = data.competitorProfile;
  const you = data.yourProfile;

  const fixFirst: string[] = [];

  if (comp && comp.reviewCount > you.reviewCount * 2) {
    fixFirst.push(
      `Get more reviews. ${comp.name} has ${comp.reviewCount} reviews vs your ${you.reviewCount}. Reviews are the #1 local ranking factor.`
    );
  } else if (comp && comp.reviewCount > you.reviewCount) {
    fixFirst.push(
      `Close the review gap. You need ${comp.reviewCount - you.reviewCount} more reviews to match ${comp.name}.`
    );
  }

  if (you.photoCount < 10) {
    fixFirst.push(
      `Add more photos. You have ${you.photoCount} — profiles with 20+ photos get 2x more engagement.`
    );
  }

  if (!you.hasWebsite) {
    fixFirst.push(
      "Add your website to your Google Business Profile. It builds trust and improves ranking signals."
    );
  }

  if (data.keywords.filter((k) => k.priority === "high").length > 0) {
    const topKw = data.keywords[0]!;
    fixFirst.push(
      `Optimize for "${topKw.keyword}" — it has ${topKw.volume.toLocaleString()} monthly searches and you're ${topKw.yourRank ? `ranked #${topKw.yourRank}` : "not ranking"}.`
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-primary/5 shadow-md">
      <div className="flex items-center gap-3 border-b border-primary/20 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-foreground">AI Analysis</h2>
          <p className="text-xs font-semibold text-muted-foreground">
            Why they outrank you and what to fix first
          </p>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">
        <p className="text-sm font-medium leading-relaxed text-foreground/80">
          {comparison.aiSummary}
        </p>

        {fixFirst.length > 0 && (
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-primary">
              Fix First
            </h3>
            <ul className="mt-3 space-y-3">
              {fixFirst.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium text-foreground/80">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {comparison.missedOpportunities.length > 0 && (
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-destructive">
              Missed Opportunities
            </h3>
            <ul className="mt-3 space-y-2">
              {comparison.missedOpportunities.slice(0, 4).map((opp, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm font-medium text-foreground/70"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  {opp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
