"use client";

import type { MarketScan } from "@/lib/types";

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
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          Step 2 of 5
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Local Market Scan
        </h1>
        <p className="mt-2 text-base text-slate-500">
          Here&apos;s what people in{" "}
          <span className="font-medium text-slate-700">{city}</span> are
          searching for — and where{" "}
          <span className="font-medium text-slate-700">{businessName}</span>{" "}
          stands.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {data.radiusMiles}-mile radius searches
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
            {data.totalLocalSearches.toLocaleString()}
            <span className="text-sm font-normal text-slate-500">/mo</span>
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
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-amber-700">
            Est. missed traffic
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-600 tabular-nums">
            {data.estimatedMissedTraffic.toLocaleString()}
            <span className="text-sm font-normal text-amber-500">/mo</span>
          </p>
        </div>
      </div>

      {/* Keyword table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Top local keywords
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
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Your Rank
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Competitor Rank
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Missed Traffic
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.keywords.map((kw, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 font-medium text-slate-800">
                    {kw.keyword}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                    {kw.volume.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {kw.yourRank ? (
                      <span
                        className={
                          kw.yourRank <= 3
                            ? "font-semibold text-emerald-600"
                            : kw.yourRank <= 10
                              ? "text-amber-600"
                              : "text-rose-600"
                        }
                      >
                        #{kw.yourRank}
                      </span>
                    ) : (
                      <span className="text-slate-400">Not ranked</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-700">
                    #{kw.topCompetitorRank}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {kw.missedTraffic > 0 ? (
                      <span className="font-medium text-rose-600">
                        {kw.missedTraffic.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-emerald-600">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          View Comparison Report →
        </button>
      </div>
    </div>
  );
}
