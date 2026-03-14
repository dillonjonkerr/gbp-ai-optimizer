"use client";

import type { MarketScan, BusinessProfile, KeywordGap } from "@/lib/types";

function StatRow({
  label,
  you,
  them,
  winner,
}: {
  label: string;
  you: string | number;
  them: string | number;
  winner: "you" | "them" | "tie";
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-slate-100 py-3.5 last:border-0">
      <div className="text-right">
        <span
          className={`text-lg font-bold tabular-nums ${
            winner === "you"
              ? "text-emerald-600"
              : winner === "them"
                ? "text-rose-500"
                : "text-slate-800"
          }`}
        >
          {you}
        </span>
      </div>
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>
      <div className="text-left">
        <span
          className={`text-lg font-bold tabular-nums ${
            winner === "them"
              ? "text-emerald-600"
              : winner === "you"
                ? "text-rose-500"
                : "text-slate-800"
          }`}
        >
          {them}
        </span>
      </div>
    </div>
  );
}

function compare(a: number, b: number): "you" | "them" | "tie" {
  if (a > b) return "you";
  if (b > a) return "them";
  return "tie";
}

function ProfileCard({
  profile,
  label,
  accent,
}: {
  profile: BusinessProfile;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${accent}`}
      >
        {profile.name.charAt(0).toUpperCase()}
      </div>
      <p className="mt-1 text-center text-sm font-bold leading-tight text-slate-900">
        {profile.name}
      </p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: KeywordGap["priority"] }) {
  const styles = {
    high: "bg-rose-100 text-rose-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold uppercase ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function RankBadge({ rank }: { rank: number | null }) {
  if (rank === null) {
    return <span className="text-sm text-slate-400">Not ranked</span>;
  }
  const color =
    rank <= 3
      ? "bg-emerald-100 text-emerald-700"
      : rank <= 10
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";
  return (
    <span
      className={`inline-flex min-w-[2.5rem] justify-center rounded-full px-2 py-0.5 text-xs font-bold ${color}`}
    >
      #{rank}
    </span>
  );
}

export default function StepMarketScan({
  data,
  businessName,
  city,
  onNext,
}: {
  data: MarketScan;
  businessName: string;
  city: string;
  onNext: () => void;
}) {
  const you = data.yourProfile;
  const comp = data.competitorProfile;
  const competitorName = data.primaryCompetitorName;
  const highPriority = data.keywords.filter((k) => k.priority === "high").length;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          Step 2 of 5
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Competitor Gap Analysis
        </h1>
        <p className="mt-2 text-base text-slate-500">
          How{" "}
          <span className="font-medium text-slate-700">{businessName}</span>{" "}
          compares to the top out-performer in{" "}
          <span className="font-medium text-slate-700">{city}</span>
        </p>
      </div>

      {/* ── Summary alert ── */}
      {data.keywords.length > 0 && (
        <div className="rounded-2xl border border-rose-200/60 bg-gradient-to-r from-rose-50 to-amber-50/50 p-6">
          <p className="text-lg font-bold text-slate-900">
            You&apos;re being outperformed by{" "}
            <span className="text-rose-600">{competitorName}</span> on{" "}
            <span className="text-rose-600">{data.keywords.length} high-intent local keywords</span>.
          </p>
          <p className="mt-1.5 text-sm text-slate-600">
            Estimated missed traffic:{" "}
            <span className="font-bold text-rose-600">
              {data.estimatedMissedTraffic.toLocaleString()} visitors/month
            </span>
          </p>
        </div>
      )}

      {data.keywords.length === 0 && (
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-6 text-center">
          <p className="text-lg font-bold text-emerald-800">
            No keyword gaps found against the top competitor.
          </p>
          <p className="mt-1 text-sm text-emerald-600">
            Across {data.totalKeywordsAnalyzed} keywords analyzed, you&apos;re holding your own.
          </p>
        </div>
      )}

      {/* ── Stats cards ── */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Keywords Analyzed
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {data.totalKeywordsAnalyzed}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Keyword Gaps
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-rose-600">
            {data.keywords.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            High Priority
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-600">
            {highPriority}
          </p>
        </div>
        <div className="rounded-xl border border-rose-200/60 bg-rose-50/50 p-4 text-center shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-rose-500">
            Missed Traffic
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-rose-600">
            {data.estimatedMissedTraffic.toLocaleString()}
            <span className="text-sm font-normal text-rose-400">/mo</span>
          </p>
        </div>
      </div>

      {/* ── Side-by-side GBP comparison ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        {comp ? (
          <>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-slate-200 bg-slate-50/50 px-6 py-5">
              <ProfileCard profile={you} label="You" accent="bg-primary-500" />
              <div className="text-2xl font-black text-slate-300">VS</div>
              <ProfileCard
                profile={comp}
                label="Out-performer"
                accent="bg-slate-700"
              />
            </div>
            <div className="px-6 py-2">
              <StatRow
                label="Google Rating"
                you={`${you.rating.toFixed(1)} ★`}
                them={`${comp.rating.toFixed(1)} ★`}
                winner={compare(you.rating, comp.rating)}
              />
              <StatRow
                label="Total Reviews"
                you={you.reviewCount.toLocaleString()}
                them={comp.reviewCount.toLocaleString()}
                winner={compare(you.reviewCount, comp.reviewCount)}
              />
              <StatRow
                label="Photos"
                you={you.photoCount.toString()}
                them={comp.photoCount.toString()}
                winner={compare(you.photoCount, comp.photoCount)}
              />
              <StatRow
                label="Website"
                you={you.hasWebsite ? "Yes" : "Missing"}
                them={comp.hasWebsite ? "Yes" : "Missing"}
                winner={
                  you.hasWebsite === comp.hasWebsite
                    ? "tie"
                    : you.hasWebsite
                      ? "you"
                      : "them"
                }
              />
              <StatRow
                label="Phone Listed"
                you={you.hasPhone ? "Yes" : "Missing"}
                them={comp.hasPhone ? "Yes" : "Missing"}
                winner={
                  you.hasPhone === comp.hasPhone
                    ? "tie"
                    : you.hasPhone
                      ? "you"
                      : "them"
                }
              />
            </div>
          </>
        ) : (
          <div className="px-6 py-8">
            <div className="mb-4 flex justify-center">
              <ProfileCard profile={you} label="Your Profile" accent="bg-primary-500" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "Google Rating", value: `${you.rating.toFixed(1)} ★` },
                { label: "Reviews", value: you.reviewCount.toLocaleString() },
                { label: "Photos", value: you.photoCount.toString() },
                { label: "Website", value: you.hasWebsite ? "Listed" : "Missing" },
                { label: "Phone", value: you.hasPhone ? "Listed" : "Missing" },
                { label: "Category", value: you.category },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xs font-medium text-slate-400">{s.label}</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-800">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Keyword gap table ── */}
      {data.keywords.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Keyword Gap Report
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Keywords where{" "}
              <span className="font-medium text-slate-600">{competitorName}</span>{" "}
              outranks you — sorted by highest opportunity
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3 font-medium text-slate-500">
                    Keyword
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-slate-500">
                    Volume
                  </th>
                  <th className="px-3 py-3 text-center font-medium text-primary-600">
                    You
                  </th>
                  <th className="px-3 py-3 text-center font-medium text-slate-500">
                    Them
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-slate-500">
                    Gap
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-slate-500">
                    Traffic Opp.
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.keywords.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-medium text-slate-800">
                      {kw.keyword}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">
                      {kw.volume.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <RankBadge rank={kw.yourRank} />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <RankBadge rank={kw.competitorRank} />
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {kw.gap !== null ? (
                        <span className="font-semibold text-rose-600">
                          {kw.gap} pos behind
                        </span>
                      ) : (
                        <span className="text-sm text-rose-500">
                          Not ranking
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {kw.trafficOpportunity > 0 ? (
                        <span className="font-semibold text-emerald-600">
                          +{kw.trafficOpportunity.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PriorityBadge priority={kw.priority} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── What you're missing (profile gaps) ── */}
      {comp && (
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-semibold text-amber-800">
            Profile gaps vs {comp.name}
          </h2>
          <ul className="mt-3 space-y-2">
            {comp.reviewCount > you.reviewCount && (
              <li className="flex items-start gap-2 text-sm text-amber-900/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                They have{" "}
                <strong>
                  {(comp.reviewCount - you.reviewCount).toLocaleString()} more
                  reviews
                </strong>{" "}
                ({comp.reviewCount} vs your {you.reviewCount})
              </li>
            )}
            {comp.rating > you.rating && (
              <li className="flex items-start gap-2 text-sm text-amber-900/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                Their rating is{" "}
                <strong>
                  {(comp.rating - you.rating).toFixed(1)} stars higher
                </strong>{" "}
                ({comp.rating.toFixed(1)} vs your {you.rating.toFixed(1)})
              </li>
            )}
            {comp.photoCount > you.photoCount && (
              <li className="flex items-start gap-2 text-sm text-amber-900/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                They have{" "}
                <strong>{comp.photoCount - you.photoCount} more photos</strong>{" "}
                on their profile
              </li>
            )}
            {!you.hasWebsite && comp.hasWebsite && (
              <li className="flex items-start gap-2 text-sm text-amber-900/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                They have a <strong>website listed</strong> — you don&apos;t
              </li>
            )}
          </ul>
        </div>
      )}

      {/* ── Source note ── */}
      <p className="text-center text-xs text-slate-400">
        Based on Google Business Profile data and live SERP analytics for{" "}
        {city}. Rankings checked across {data.totalKeywordsAnalyzed} local
        keywords. Volumes reflect US search data for location-specific terms.
      </p>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          View Full Report →
        </button>
      </div>
    </div>
  );
}
