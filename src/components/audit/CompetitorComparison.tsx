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
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center border-b border-slate-100 py-3 last:border-0">
      <div className="text-right pr-4">
        <span
          className={`text-sm font-bold tabular-nums ${
            result === "win" ? "text-emerald-600" : result === "lose" ? "text-rose-500" : "text-slate-700"
          }`}
        >
          {you}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        {result === "win" && (
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        )}
        {result === "lose" && (
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        )}
        {result === "tie" && (
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        )}
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {result === "win" && (
          <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
        )}
        {result === "lose" && (
          <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
        )}
      </div>
      <div className="pl-4">
        <span
          className={`text-sm font-bold tabular-nums ${
            result === "lose" ? "text-emerald-600" : result === "win" ? "text-rose-500" : "text-slate-700"
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
        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white ${
          isYou ? "bg-primary-500" : "bg-slate-700"
        }`}
      >
        {profile.name.charAt(0).toUpperCase()}
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-900 leading-tight">
          {profile.name}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">{label}</p>
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
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-center text-sm text-slate-500">
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
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 border-b border-slate-100 bg-slate-50/40 px-8 py-6">
        <ProfileHeader profile={you} label="Your Business" isYou />
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
            vs
          </span>
        </div>
        <ProfileHeader profile={comp} label="Top Competitor" isYou={false} />
      </div>

      {/* Metrics */}
      <div className="px-8 py-3">
        <MetricRow
          label="Google Rating"
          you={`${you.rating.toFixed(1)} ★`}
          them={`${comp.rating.toFixed(1)} ★`}
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
          you={you.category || "—"}
          them={comp.category || "—"}
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
