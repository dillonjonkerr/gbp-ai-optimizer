"use client";

export type Discovery = {
  id: string;
  label: string;
  detail: string;
  type: "success" | "warning" | "info" | "danger";
};

const TYPE_ICON: Record<Discovery["type"], JSX.Element> = {
  success: (
    <svg className="h-4 w-4 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  warning: (
    <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.66 16.59A1 1 0 0120.66 21H3.34a1 1 0 01-.86-1.41L12 3z" />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4 text-[#29b6f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
    </svg>
  ),
  danger: (
    <svg className="h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
    </svg>
  ),
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
      <div className="absolute bottom-0 left-[11px] top-0 w-px bg-white/[0.06]" />

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
              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#16161a]">
                {TYPE_ICON[d.type]}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-bold text-white/70">
                  {d.label}
                </p>
                <p className="mt-0.5 text-sm font-medium text-white/30">{d.detail}</p>
              </div>
            </div>
          );
        })}

        {isRevealing && (
          <div className="relative flex items-center gap-4 py-3">
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#16161a]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#29b6f6]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 animate-bounce rounded-full bg-white/25" style={{ animationDelay: "0ms" }} />
              <span className="h-1 w-1 animate-bounce rounded-full bg-white/25" style={{ animationDelay: "150ms" }} />
              <span className="h-1 w-1 animate-bounce rounded-full bg-white/25" style={{ animationDelay: "300ms" }} />
              <span className="ml-2 text-xs font-semibold text-white/20">Analyzing…</span>
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
