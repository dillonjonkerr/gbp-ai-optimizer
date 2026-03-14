"use client";

import type { BusinessProfile, MarketScan } from "@/lib/types";

function compare(a: number, b: number): "win" | "lose" | "tie" {
  if (a > b) return "win";
  if (b > a) return "lose";
  return "tie";
}

function MetricRow({
  label,
  you,
  them,
  result,
}: {
  label: string;
  you: string;
  them: string;
  result: "win" | "lose" | "tie";
}) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center border-b border-border py-3 last:border-0">
      <div className="text-right pr-4">
        <span
          className={`text-sm font-bold tabular-nums ${
            result === "win" ? "text-success" : result === "lose" ? "text-destructive" : "text-foreground"
          }`}
        >
          {you}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        {result === "win" && (
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
        )}
        {result === "lose" && (
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
        )}
        {result === "tie" && (
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        )}
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="pl-4">
        <span
          className={`text-sm font-bold tabular-nums ${
            result === "lose" ? "text-success" : result === "win" ? "text-destructive" : "text-foreground"
          }`}
        >
          {them}
        </span>
      </div>
    </div>
  );
}

function ProfileHeader({
  profile,
  label,
  isYou,
}: {
  profile: BusinessProfile;
  label: string;
  isYou: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${
          isYou ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {profile.name.charAt(0).toUpperCase()}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground leading-tight">
          {profile.name}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
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
      <div className="rounded-xl border border-border bg-card p-8">
        <p className="text-center text-sm text-muted-foreground">
          No competitor profile available for comparison.
        </p>
      </div>
    );
  }

  const kwWins = data.keywords.filter(
    (k) => k.yourRank !== null && k.competitorRank !== null && k.yourRank <= k.competitorRank,
  ).length;
  const kwLosses = data.keywords.filter(
    (k) => k.yourRank === null || (k.competitorRank !== null && k.yourRank > k.competitorRank),
  ).length;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 border-b border-border bg-muted/30 px-6 py-6 sm:px-8">
        <ProfileHeader profile={you} label="Your Business" isYou />
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            vs
          </span>
        </div>
        <ProfileHeader profile={comp} label="Top Competitor" isYou={false} />
      </div>

      {/* Metrics */}
      <div className="px-6 py-3 sm:px-8">
        <MetricRow
          label="Google Rating"
          you={`${you.rating.toFixed(1)} stars`}
          them={`${comp.rating.toFixed(1)} stars`}
          result={compare(you.rating, comp.rating)}
        />
        <MetricRow
          label="Reviews"
          you={you.reviewCount.toLocaleString()}
          them={comp.reviewCount.toLocaleString()}
          result={compare(you.reviewCount, comp.reviewCount)}
        />
        <MetricRow
          label="Photos"
          you={you.photoCount.toString()}
          them={comp.photoCount.toString()}
          result={compare(you.photoCount, comp.photoCount)}
        />
        <MetricRow
          label="Category"
          you={you.category || "-"}
          them={comp.category || "-"}
          result="tie"
        />
        <MetricRow
          label="Keywords Ranked"
          you={kwWins.toString()}
          them={kwLosses.toString()}
          result={compare(kwWins, kwLosses)}
        />
      </div>
    </div>
  );
}
