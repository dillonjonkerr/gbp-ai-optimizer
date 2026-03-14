"use client";

type Step = {
  label: string;
};

export default function StepProgress({
  steps,
  current,
}: {
  steps: Step[];
  current: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const isActive = index === current;
        const isCompleted = index < current;

        return (
          <div key={step.label} className="flex items-center">
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : isCompleted
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                    ? "bg-muted-foreground/20 text-muted-foreground"
                    : "bg-muted text-muted-foreground/50"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="h-3 w-3"
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
                  index + 1
                )}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-1 h-px w-4 ${
                  isCompleted ? "bg-muted-foreground/30" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
