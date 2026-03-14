"use client";

export type Discovery = {
  id: string;
  label: string;
  detail: string;
  type: "success" | "warning" | "info" | "danger";
};

const TYPE_ICON: Record<Discovery["type"], JSX.Element> = {
  success: (
    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  warning: (
    <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.66 16.59A1 1 0 0120.66 21H3.34a1 1 0 01-.86-1.41L12 3z" />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
    </svg>
  ),
  danger: (
    <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
    </svg>
  ),
};

const TYPE_DOT: Record<Discovery["type"], string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  info: "bg-primary-500",
  danger: "bg-rose-500",
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
      {/* Vertical timeline line */}
      <div className="absolute bottom-0 left-[11px] top-0 w-px bg-slate-200/80" />

      <div className="space-y-0">
        {visible.map((d, i) => {
          const isLatest = i === visibleCount - 1;
          return (
            <div
              key={d.id}
              className="relative flex items-start gap-4 py-3"
              style={{
                animation: isLatest ? "discoverIn 0.5s ease-out" : undefined,
              }}
            >
              {/* Timeline dot */}
              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/80">
                {TYPE_ICON[d.type]}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-semibold text-slate-800">
                  {d.label}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">{d.detail}</p>
              </div>
            </div>
          );
        })}

        {/* Typing / discovering indicator */}
        {isRevealing && (
          <div className="relative flex items-center gap-4 py-3">
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/80">
              <span className={`h-2 w-2 animate-pulse rounded-full ${TYPE_DOT.info}`} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
              <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
              <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
              <span className="ml-2 text-xs text-slate-400">Analyzing…</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes discoverIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
