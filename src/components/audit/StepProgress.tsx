"use client";

export default function StepProgress({
  steps,
  current,
}: {
  steps: { label: string }[];
  current: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              <div
                className={`mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? "bg-[#29b6f6] text-white"
                    : active
                      ? "bg-[#29b6f6] text-white ring-4 ring-[#29b6f6]/20"
                      : "bg-white/[0.06] text-white/30"
                }`}
              >
                {done ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
            </div>
            <span
              className={`text-center text-xs font-medium ${
                done || active ? "text-[#29b6f6]" : "text-white/25"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
