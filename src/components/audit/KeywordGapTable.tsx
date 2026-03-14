"use client";

import type { KeywordGap } from "@/lib/types";

function OpportunityScore({ priority }: { priority: KeywordGap["priority"] }) {
  const config = {
    high: { label: "High", bar: "w-full bg-rose-500", text: "text-rose-700" },
    medium: { label: "Medium", bar: "w-2/3 bg-amber-400", text: "text-amber-700" },
    low: { label: "Low", bar: "w-1/3 bg-slate-300", text: "text-slate-500" },
  };
  const c = config[priority];
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${c.bar}`} />
      </div>
      <span className={`text-xs font-bold uppercase ${c.text}`}>
        {c.label}
      </span>
    </div>
  );
}

export default function KeywordGapTable({
  keywords,
  competitorName,
}: {
  keywords: KeywordGap[];
  competitorName: string;
}) {
  if (keywords.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-8 py-5">
        <h2 className="text-base font-bold text-slate-900">
          Keyword Gap Report
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Keywords where{" "}
          <span className="font-medium text-slate-700">{competitorName}</span>{" "}
          outranks you — sorted by opportunity
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-8 py-3 text-left font-medium text-slate-500">
                Keyword
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-500">
                Search Vol.
              </th>
              <th className="px-4 py-3 text-center font-medium text-slate-500">
                Your Rank
              </th>
              <th className="px-4 py-3 text-center font-medium text-slate-500">
                Their Rank
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">
                Opportunity
              </th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw, i) => (
              <tr
                key={i}
                className={`border-b border-slate-50 transition ${
                  kw.priority === "high"
                    ? "bg-rose-50/30 hover:bg-rose-50/60"
                    : "hover:bg-slate-50/60"
                }`}
              >
                <td className="px-8 py-3.5">
                  <span className="font-medium text-slate-900">
                    {kw.keyword}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-slate-600">
                  {kw.volume.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {kw.yourRank ? (
                    <span
                      className={`inline-flex min-w-[2rem] justify-center rounded-md px-1.5 py-0.5 text-xs font-bold ${
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
                    <span className="text-xs font-medium text-slate-400">
                      Not ranked
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {kw.competitorRank ? (
                    <span className="inline-flex min-w-[2rem] justify-center rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-700">
                      #{kw.competitorRank}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <OpportunityScore priority={kw.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/40 px-8 py-3">
        <p className="text-xs text-slate-400">
          Showing {keywords.length} keywords where you&apos;re being
          outranked. Sorted by traffic opportunity.
        </p>
      </div>
    </div>
  );
}
