"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Detecting business profile",
  "Finding competitors",
  "Analyzing review strength",
  "Identifying ranking gaps",
  "Discovering keyword opportunities",
  "Calculating traffic potential",
  "Building gap report",
];

export default function MarketScanProgress({
  businessName,
  city,
  progress,
}: {
  businessName: string;
  city: string;
  progress: number;
}) {
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const mapped = Math.floor((progress / 100) * STEPS.length);
    setCompletedSteps(Math.min(mapped, STEPS.length));
  }, [progress]);

  return (
    <div className="text-center">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
        </span>
        AI Market Scan in Progress
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Scanning your local market
      </h1>

      <p className="mx-auto mt-3 max-w-md text-base text-slate-500">
        Analyzing competitors, reviews, and ranking signals for{" "}
        <span className="font-medium text-slate-700">{businessName}</span> in{" "}
        <span className="font-medium text-slate-700">{city}</span>
      </p>

      {/* Progress bar */}
      <div className="mx-auto mt-8 max-w-sm">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-[1500ms] ease-out"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-400/60 to-transparent opacity-80 blur-sm transition-all duration-[1500ms] ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step checklist */}
      <div className="mx-auto mt-6 flex max-w-xs flex-col items-start gap-2">
        {STEPS.map((label, i) => {
          const done = i < completedSteps;
          const active = i === completedSteps;
          return (
            <div
              key={label}
              className={`flex items-center gap-2.5 transition-all duration-500 ${
                done
                  ? "opacity-100"
                  : active
                    ? "opacity-100"
                    : "opacity-0 translate-y-1"
              }`}
              style={{
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {done ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              ) : active ? (
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="absolute h-5 w-5 animate-ping rounded-full bg-primary-200" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-primary-500" />
                </span>
              ) : (
                <span className="h-5 w-5 rounded-full border-2 border-slate-200" />
              )}
              <span
                className={`text-sm ${
                  done
                    ? "font-medium text-slate-700"
                    : active
                      ? "font-medium text-primary-600"
                      : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
