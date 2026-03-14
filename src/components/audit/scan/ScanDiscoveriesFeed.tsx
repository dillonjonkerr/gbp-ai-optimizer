"use client";

import { CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";

export type Discovery = {
  id: string;
  label: string;
  detail: string;
  type: "success" | "warning" | "info" | "danger";
};

const TYPE_ICON: Record<Discovery["type"], React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-green-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  info: <Info className="h-4 w-4 text-primary" />,
  danger: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const TYPE_DOT: Record<Discovery["type"], string> = {
  success: "bg-green-500",
  warning: "bg-amber-500",
  info: "bg-primary",
  danger: "bg-red-500",
};

export default function ScanDiscoveriesFeed({
  discoveries,
  visibleCount,
  isRevealing,
}: {
  discoveries: Discovery[];
  visibleCount: number;
  isRevealing: boolean;
}) {
  const visible = discoveries.slice(0, visibleCount);

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[11px] top-0 w-px bg-border" />

      <div className="space-y-0">
        {visible.map((d, i) => {
          const isLatest = i === visibleCount - 1;
          return (
            <div
              key={d.id}
              className={`relative flex items-start gap-4 py-3 ${isLatest ? "animate-discover-in" : ""}`}
            >
              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-card shadow-sm ring-2 ring-border">
                {TYPE_ICON[d.type]}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-bold text-foreground">{d.label}</p>
                <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                  {d.detail}
                </p>
              </div>
            </div>
          );
        })}

        {isRevealing && (
          <div className="relative flex items-center gap-4 py-3">
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-card shadow-sm ring-2 ring-border">
              <span
                className={`h-2 w-2 animate-pulse rounded-full ${TYPE_DOT.info}`}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: "300ms" }}
              />
              <span className="ml-2 text-xs font-semibold text-muted-foreground">
                Analyzing…
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
