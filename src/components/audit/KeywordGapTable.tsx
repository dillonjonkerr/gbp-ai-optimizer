"use client";

import type { KeywordGap } from "@/lib/types";

function OpportunityScore({ priority }: { priority: KeywordGap["priority"] }) {
  const config = {
    high: { label: "High", bar: "w-full bg-destructive", text: "text-destructive" },
    medium: { label: "Medium", bar: "w-2/3 bg-warning", text: "text-warning" },
    low: { label: "Low", bar: "w-1/3 bg-muted-foreground", text: "text-muted-foreground" },
  };
  const c = config[priority];
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
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
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-5 sm:px-8">
        <h2 className="text-base font-bold text-foreground">
          Keyword Gap Report
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keywords where{" "}
          <span className="font-medium text-foreground">{competitorName}</span>{" "}
          outranks you - sorted by opportunity
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left font-medium text-muted-foreground sm:px-8">
                Keyword
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Search Vol.
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                Your Rank
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                Their Rank
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Priority
              </th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw, i) => (
              <tr
                key={i}
                className={`border-b border-border/50 transition ${
                  kw.priority === "high"
                    ? "bg-destructive/5 hover:bg-destructive/10"
                    : "hover:bg-muted/30"
                }`}
              >
                <td className="px-6 py-3.5 sm:px-8">
                  <span className="font-medium text-foreground">
                    {kw.keyword}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">
                  {kw.volume.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {kw.yourRank ? (
                    <span
                      className={`inline-flex min-w-[2rem] justify-center rounded-md px-1.5 py-0.5 text-xs font-bold ${
                        kw.yourRank <= 3
                          ? "bg-success/10 text-success"
                          : kw.yourRank <= 10
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      #{kw.yourRank}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      Not ranked
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {kw.competitorRank ? (
                    <span className="inline-flex min-w-[2rem] justify-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-bold text-foreground">
                      #{kw.competitorRank}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
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

      <div className="border-t border-border bg-muted/30 px-6 py-3 sm:px-8">
        <p className="text-xs text-muted-foreground">
          Showing {keywords.length} keywords where you&apos;re being
          outranked. Sorted by traffic opportunity.
        </p>
      </div>
    </div>
  );
}
