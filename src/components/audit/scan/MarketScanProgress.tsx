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
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#29b6f6]/20 bg-[#29b6f6]/[0.06] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[2px] text-[#29b6f6]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#29b6f6] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#29b6f6]" />
        </span>
        Scanning
      </div>

      <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
        Scanning your local market
      </h1>

      <p className="mx-auto mt-3 max-w-md text-base font-medium text-white/40">
        Analyzing competitors, reviews, and ranking signals for{" "}
        <span className="font-bold text-white/60">{businessName}</span> in{" "}
        <span className="font-bold text-white/60">{city}</span>
      </p>

      <div className="mx-auto mt-8 max-w-sm">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#29b6f6] to-[#0ea5e9] transition-all duration-[1500ms] ease-out"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#29b6f6]/50 to-transparent opacity-80 blur-sm transition-all duration-[1500ms] ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-xs flex-col items-start gap-2">
        {STEPS.slice(0, completedSteps + 1).map((label, i) => {
          const done = i < completedSteps;
          return (
            <div
              key={label}
              className="flex items-center gap-2.5"
              style={{ animation: "stepIn 0.4s ease-out" }}
            >
              {done ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              ) : (
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="absolute h-5 w-5 animate-ping rounded-full bg-[#29b6f6]/30" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-[#29b6f6]" />
                </span>
              )}
              <span
                className={`text-sm font-bold ${
                  done ? "text-white/50" : "text-[#29b6f6]"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
