"use client";

import type { BusinessProfile, MarketScan } from "@/lib/types";
import { Star, ImageIcon, Target, Trophy } from "lucide-react";

function compare(a: number, b: number): "win" | "lose" | "tie" {
  if (a > b) return "win";
  if (b > a) return "lose";
  return "tie";
}

export default function CompetitorComparison({
  data,
}: {
  data: MarketScan;
}) {
  const you = data.yourProfile;
  const comp = data.competitorProfile;

  if (!comp) {
    return (
      <div className="rounded-2xl border-2 border-border bg-card p-8 shadow-md">
        <p className="text-center text-sm font-semibold text-muted-foreground">
          No competitor profile available for comparison.
        </p>
      </div>
    );
  }

  const kwWins = data.keywords.filter(
    (k) =>
      k.yourRank !== null &&
      k.competitorRank !== null &&
      k.yourRank <= k.competitorRank
  ).length;
  const kwLosses = data.keywords.filter(
    (k) =>
      k.yourRank === null ||
      (k.competitorRank !== null && k.yourRank > k.competitorRank)
  ).length;

  const metrics = [
    {
      label: "Reviews",
      yours: you.reviewCount,
      theirs: comp.reviewCount,
      icon: Star,
    },
    {
      label: "Photos",
      yours: you.photoCount,
      theirs: comp.photoCount,
      icon: ImageIcon,
    },
    {
      label: "Keywords",
      yours: kwWins,
      theirs: kwLosses,
      icon: Target,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
      <div className="px-5 pt-5 pb-2">
        <div className="text-sm font-black flex items-center gap-2 text-foreground">
          <Trophy className="h-4 w-4 text-amber-500" />
          vs Top Local Competitor
        </div>
      </div>
      <div className="p-5 pt-2 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <span className="text-sm font-bold text-muted-foreground">
            {you.name}
          </span>
          <span className="text-sm font-bold text-primary">{comp.name}</span>
        </div>

        {metrics.map((metric, i) => {
          const result = compare(metric.yours, metric.theirs);
          return (
            <div key={i} className="flex items-center gap-3">
              <metric.icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span
                    className={
                      result === "win"
                        ? "text-green-500"
                        : result === "lose"
                          ? "text-red-500"
                          : "text-foreground"
                    }
                  >
                    {metric.yours}
                  </span>
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span
                    className={
                      result === "lose"
                        ? "text-green-500"
                        : result === "win"
                          ? "text-red-500"
                          : "text-foreground"
                    }
                  >
                    {metric.theirs}
                  </span>
                </div>
                <div className="flex h-1.5 gap-1">
                  <div className="flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${result === "win" ? "bg-green-500" : "bg-red-500"}`}
                      style={{
                        width: `${(metric.yours / Math.max(metric.yours, metric.theirs, 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${result === "lose" ? "bg-green-500" : "bg-red-500"}`}
                      style={{
                        width: `${(metric.theirs / Math.max(metric.yours, metric.theirs, 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
