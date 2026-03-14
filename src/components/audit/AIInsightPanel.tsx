"use client";

import type { ComparisonReport, MarketScan } from "@/lib/types";

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
      `Get more reviews. ${comp.name} has ${comp.reviewCount} reviews vs your ${you.reviewCount}. Reviews are the #1 local ranking factor.`,
    );
  } else if (comp && comp.reviewCount > you.reviewCount) {
    fixFirst.push(
      `Close the review gap. You need ${comp.reviewCount - you.reviewCount} more reviews to match ${comp.name}.`,
    );
  }

  if (you.photoCount < 10) {
    fixFirst.push(
      `Add more photos. You have ${you.photoCount} - profiles with 20+ photos get 2x more engagement.`,
    );
  }

  if (!you.hasWebsite) {
    fixFirst.push(
      "Add your website to your Google Business Profile. It builds trust and improves ranking signals.",
    );
  }

  if (data.keywords.filter((k) => k.priority === "high").length > 0) {
    const topKw = data.keywords[0]!;
    fixFirst.push(
      `Optimize for "${topKw.keyword}" - it has ${topKw.volume.toLocaleString()} monthly searches and you're ${topKw.yourRank ? `ranked #${topKw.yourRank}` : "not ranking"}.`,
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-primary/20 bg-primary/5">
      <div className="flex items-center gap-3 border-b border-primary/10 px-6 py-5 sm:px-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">
            AI Analysis
          </h2>
          <p className="text-xs text-muted-foreground">
            Why they outrank you and what to fix first
          </p>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 sm:px-8">
        {/* AI summary */}
        <div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {comparison.aiSummary}
          </p>
        </div>

        {/* What to fix */}
        {fixFirst.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
              Fix First
            </h3>
            <ul className="mt-3 space-y-3">
              {fixFirst.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground/80">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missed opportunities from AI */}
        {comparison.missedOpportunities.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-destructive">
              Missed Opportunities
            </h3>
            <ul className="mt-3 space-y-2">
              {comparison.missedOpportunities.slice(0, 4).map((opp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
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
