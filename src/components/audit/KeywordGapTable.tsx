"use client";

import type { KeywordGap } from "@/lib/types";

function OpportunityScore({ priority }: { priority: KeywordGap["priority"] }) {
  const config = {
    high: { label: "High", bar: "w-full bg-rose-500", text: "text-rose-400" },
    medium: { label: "Medium", bar: "w-2/3 bg-amber-400", text: "text-amber-400" },
    low: { label: "Low", bar: "w-1/3 bg-white/20", text: "text-white/40" },
  };
  const c = config[priority];
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-white/[0.06]">
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
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#16161a]">
      <div className="border-b border-white/[0.05] px-8 py-5">
        <h2 className="text-base font-black text-white">
          Keyword Gap Report
        </h2>
        <p className="mt-1 text-sm font-medium text-white/35">
          Keywords where{" "}
          <span className="font-bold text-white/60">{competitorName}</span>{" "}
          outranks you — sorted by opportunity
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.05] bg-white/[0.02]">
              <th className="px-8 py-3 text-left text-[10px] font-extrabold uppercase tracking-[2px] text-white/25">
                Keyword
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-[2px] text-white/25">
                Volume
              </th>
              <th className="px-4 py-3 text-center text-[10px] font-extrabold uppercase tracking-[2px] text-white/25">
                Your Rank
              </th>
              <th className="px-4 py-3 text-center text-[10px] font-extrabold uppercase tracking-[2px] text-white/25">
                Their Rank
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[2px] text-white/25">
                Opportunity
              </th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw, i) => (
              <tr
                key={i}
                className={`border-b border-white/[0.03] transition ${
                  kw.priority === "high"
                    ? "bg-rose-500/[0.04] hover:bg-rose-500/[0.08]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <td className="px-8 py-3.5">
                  <span className="font-bold text-white">
                    {kw.keyword}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-white/50">
                  {kw.volume.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {kw.yourRank ? (
                    <span
                      className={`inline-flex min-w-[2rem] justify-center rounded-md px-1.5 py-0.5 text-xs font-bold ${
                        kw.yourRank <= 3
                          ? "bg-[#22c55e]/15 text-[#22c55e]"
                          : kw.yourRank <= 10
                            ? "bg-amber-400/15 text-amber-400"
                            : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      #{kw.yourRank}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-white/20">
                      Not ranked
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {kw.competitorRank ? (
                    <span className="inline-flex min-w-[2rem] justify-center rounded-md bg-white/[0.06] px-1.5 py-0.5 text-xs font-bold text-white/60">
                      #{kw.competitorRank}
                    </span>
                  ) : (
                    <span className="text-xs text-white/20">—</span>
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

      <div className="border-t border-white/[0.05] bg-white/[0.02] px-8 py-3">
        <p className="text-xs font-semibold text-white/20">
          Showing {keywords.length} keywords where you&apos;re being
          outranked. Sorted by traffic opportunity.
        </p>
      </div>
    </div>
  );
}
