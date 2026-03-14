"use client";

import type { MarketScan, BusinessProfile } from "@/lib/types";

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
      <p className="mt-1 text-center text-sm font-bold text-slate-900 leading-tight">
        {profile.name}
      </p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
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

  const kwWins = data.keywords.filter(
    (k) => k.yourRank !== null && k.yourRank <= k.topCompetitorRank,
  ).length;
  const kwLosses = data.keywords.filter(
    (k) => k.yourRank === null || k.yourRank > k.topCompetitorRank,
  ).length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          Step 2 of 5
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          You vs. Your Top Competitor
        </h1>
        <p className="mt-2 text-base text-slate-500">
          Real data from Google for{" "}
          <span className="font-medium text-slate-700">{businessName}</span> and
          their #1 competitor in{" "}
          <span className="font-medium text-slate-700">{city}</span>.
        </p>
      </div>

      {/* ── Side-by-side comparison card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        {comp ? (
          <>
            {/* Header with both business names */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-slate-200 bg-slate-50/50 px-6 py-5">
              <ProfileCard
                profile={you}
                label="You"
                accent="bg-primary-500"
              />
              <div className="text-2xl font-black text-slate-300">VS</div>
              <ProfileCard
                profile={comp}
                label="Top Competitor"
                accent="bg-slate-700"
              />
            </div>

            {/* Stats */}
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
              <StatRow
                label="Keywords Winning"
                you={kwWins.toString()}
                them={kwLosses.toString()}
                winner={compare(kwWins, kwLosses)}
              />
            </div>
          </>
        ) : (
          <div className="px-6 py-8">
            <div className="mb-4 flex justify-center">
              <ProfileCard
                profile={you}
                label="Your Profile"
                accent="bg-primary-500"
              />
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

      {/* ── Missed opportunity hero ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Monthly local searches
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
            {data.totalLocalSearches.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Keywords tracked
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
            {data.keywords.length}
          </p>
        </div>
        <div className="rounded-xl border border-rose-200/60 bg-rose-50/50 p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-rose-700">
            Traffic you&apos;re missing
          </p>
          <p className="mt-1 text-2xl font-bold text-rose-600 tabular-nums">
            {data.estimatedMissedTraffic.toLocaleString()}
            <span className="text-sm font-normal text-rose-400">/mo</span>
          </p>
        </div>
      </div>

      {/* ── Keyword comparison table ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Keyword-by-keyword breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 font-medium text-slate-500">
                  Keyword
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Volume
                </th>
                <th className="px-4 py-3 text-right font-medium text-primary-600">
                  You
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Competitor
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Missed Traffic
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.keywords.map((kw, i) => {
                const winning =
                  kw.yourRank !== null &&
                  kw.yourRank <= kw.topCompetitorRank;
                return (
                  <tr
                    key={i}
                    className={
                      winning
                        ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                        : "hover:bg-slate-50/50"
                    }
                  >
                    <td className="px-6 py-3 font-medium text-slate-800">
                      {kw.keyword}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                      {kw.volume.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {kw.yourRank ? (
                        <span
                          className={`inline-flex min-w-[2.5rem] justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                            kw.yourRank <= 3
                              ? "bg-emerald-100 text-emerald-700"
                              : kw.yourRank <= 10
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          #{kw.yourRank}
                        </span>
                      ) : (
                        <span className="text-slate-400">Not ranked</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className="inline-flex min-w-[2.5rem] justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                        #{kw.topCompetitorRank}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {kw.missedTraffic > 0 ? (
                        <span className="font-semibold text-rose-600">
                          +{kw.missedTraffic.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">&mdash;</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── What you're missing out on ── */}
      {comp && (
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-semibold text-amber-800">
            What you&apos;re missing compared to {comp.name}
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
                <strong>
                  {comp.photoCount - you.photoCount} more photos
                </strong>{" "}
                on their profile
              </li>
            )}
            {!you.hasWebsite && comp.hasWebsite && (
              <li className="flex items-start gap-2 text-sm text-amber-900/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                They have a <strong>website listed</strong> — you don&apos;t
              </li>
            )}
            {kwLosses > kwWins && (
              <li className="flex items-start gap-2 text-sm text-amber-900/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                They outrank you on{" "}
                <strong>{kwLosses} out of {data.keywords.length} keywords</strong>
              </li>
            )}
            {data.estimatedMissedTraffic > 0 && (
              <li className="flex items-start gap-2 text-sm text-amber-900/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                You&apos;re losing an estimated{" "}
                <strong>
                  {data.estimatedMissedTraffic.toLocaleString()} visitors/month
                </strong>{" "}
                to competitors
              </li>
            )}
          </ul>
        </div>
      )}

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
