"use client";

import type { ComparisonReport } from "@/lib/types";

function ScoreRing({
  score,
  label,
  size = "lg",
}: {
  score: number;
  label: string;
  size?: "lg" | "sm";
}) {
  const radius = size === "lg" ? 54 : 38;
  const dim = size === "lg" ? 140 : 100;
  const sw = size === "lg" ? 10 : 7;
  const textSize = size === "lg" ? "text-4xl" : "text-2xl";
  const offset =
    2 * Math.PI * radius - (score / 100) * 2 * Math.PI * radius;

  const color =
    score >= 80
      ? "text-emerald-500 stroke-emerald-500"
      : score >= 60
        ? "text-amber-500 stroke-amber-500"
        : "text-rose-500 stroke-rose-500";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sw}
            className="text-slate-200"
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * radius}
            strokeDashoffset={offset}
            className={`transition-all duration-700 ease-out ${color}`}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-bold tabular-nums ${textSize} ${color.split(" ")[0]}`}
        >
          {score}
        </span>
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

export default function StepComparison({
  data,
  recommendations,
  onNext,
  onBack,
}: {
  data: ComparisonReport;
  recommendations: string[];
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          Step 3 of 5
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Your Comparison Report
        </h1>
        <p className="mt-2 text-base text-slate-500">
          How <span className="font-medium text-slate-700">{data.businessName}</span>{" "}
          stacks up against local competitors.
        </p>
      </div>

      {/* Score rings */}
      <div className="flex flex-wrap items-end justify-center gap-12 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
        <ScoreRing score={data.score} label="Your Score" size="lg" />
        <div className="text-center text-2xl font-bold text-slate-300">vs</div>
        <ScoreRing
          score={data.competitorScore}
          label="Avg Competitor"
          size="lg"
        />
      </div>

      {/* AI summary */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
        <h2 className="text-sm font-semibold text-slate-700">
          AI Overview
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {data.aiSummary}
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Google Rating", value: `${data.rating.toFixed(1)} / 5` },
          { label: "Review Count", value: data.reviewCount },
          { label: "Photo Count", value: data.photoCount },
          { label: "Category", value: data.category },
          {
            label: "Website",
            value: data.hasWebsite ? "Listed" : "Missing",
          },
          {
            label: "Phone",
            value: data.hasPhone ? "Listed" : "Missing",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Missed opportunities */}
      {data.missedOpportunities.length > 0 && (
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-semibold text-amber-800">
            Missed Opportunities
          </h2>
          <ul className="mt-3 space-y-2">
            {data.missedOpportunities.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-amber-900/80"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keyword gap table */}
      {data.keywordGaps.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Keyword Gap Analysis
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3 font-medium text-slate-500">
                    Keyword
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500">
                    You
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500">
                    Competitor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.keywordGaps.map((gap, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-medium text-slate-800">
                      {gap.keyword}
                    </td>
                    <td className="px-4 py-3 text-center text-rose-600">
                      {gap.you}
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-600">
                      {gap.competitor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
          <h2 className="text-sm font-semibold text-slate-700">
            Recommendations
          </h2>
          <ul className="mt-3 space-y-2">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Let&apos;s Optimize →
        </button>
      </div>
    </div>
  );
}
