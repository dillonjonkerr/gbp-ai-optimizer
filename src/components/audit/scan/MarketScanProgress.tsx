"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

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
      {/* Animated Scanner Icon */}
      <div className="relative mx-auto mb-6 h-24 w-24">
        <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-ping animation-delay-200" />
        <div className="absolute inset-4 rounded-full border-4 border-primary/50 animate-ping animation-delay-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/40">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        </div>
      </div>

      <div className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-1.5 text-xs font-bold text-muted-foreground shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        AI Market Scan in Progress
      </div>

      <h1 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
        AI scanning your market
      </h1>

      <p className="mx-auto mt-3 max-w-md text-base font-semibold text-muted-foreground">
        Analyzing the{" "}
        <span className="font-bold text-foreground">{city}</span> painting
        market for{" "}
        <span className="font-bold text-foreground">{businessName}</span>
      </p>

      {/* Progress bar */}
      <div className="mx-auto mt-8 max-w-sm space-y-2">
        <div className="relative h-3 overflow-hidden rounded-full bg-primary/20">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-[1500ms] ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span className="text-muted-foreground">Scanning...</span>
          <span className="text-primary">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Step checklist */}
      <div className="mx-auto mt-6 flex max-w-xs flex-col items-start gap-2">
        {STEPS.slice(0, completedSteps + 1).map((label, i) => {
          const done = i < completedSteps;
          return (
            <div
              key={label}
              className="flex items-center gap-2.5 animate-step-in"
            >
              {done ? (
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <span className="relative flex h-5 w-5 items-center justify-center shrink-0">
                  <span className="absolute h-5 w-5 animate-ping rounded-full bg-primary/20" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
              )}
              <span
                className={`text-sm font-bold ${
                  done
                    ? "text-foreground"
                    : "text-primary"
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
