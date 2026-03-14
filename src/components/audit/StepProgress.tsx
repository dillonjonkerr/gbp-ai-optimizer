"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function StepProgress({
  steps,
  current,
}: {
  steps: { label: string }[];
  current: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                done &&
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                active &&
                  "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg shadow-primary/30",
                !done && !active && "bg-muted text-muted-foreground"
              )}
            >
              {done ? <Check className="h-4 w-4 stroke-[3]" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-1 w-6 rounded-full transition-all duration-300",
                  i < current ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
