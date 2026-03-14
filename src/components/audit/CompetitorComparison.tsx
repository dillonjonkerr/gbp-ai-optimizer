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
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center border-b border-white/[0.05] py-3.5 last:border-0">
      <div className="text-right pr-4">
        <span
          className={`text-sm font-bold tabular-nums ${
            result === "win" ? "text-[#22c55e]" : result === "lose" ? "text-rose-400" : "text-white/60"
          }`}
        >
          {you}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        {result === "win" && (
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
        )}
        {result === "lose" && (
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
        )}
        {result === "tie" && (
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        )}
        <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-white/25">
          {label}
        </span>
      </div>
      <div className="pl-4">
        <span
          className={`text-sm font-bold tabular-nums ${
            result === "lose" ? "text-[#22c55e]" : result === "win" ? "text-rose-400" : "text-white/60"
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
          isYou ? "bg-[#29b6f6]" : "bg-white/10"
        }`}
      >
        {profile.name.charAt(0).toUpperCase()}
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-white leading-tight">
          {profile.name}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-white/25">{label}</p>
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
      <div className="rounded-2xl border border-white/[0.07] bg-[#16161a] p-8">
        <p className="text-center text-sm text-white/40">
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
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#16161a]">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 border-b border-white/[0.05] bg-white/[0.02] px-8 py-6">
        <ProfileHeader profile={you} label="Your Business" isYou />
        <div className="flex flex-col items-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-white/15">
            vs
          </span>
        </div>
        <ProfileHeader profile={comp} label="Top Competitor" isYou={false} />
      </div>

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
