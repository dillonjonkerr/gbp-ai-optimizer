"use client";

export default function StepCTA({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          Step 4 of 5
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Ready to dominate your local market?
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Follow the Paint &amp; Profits AI helper to optimize your Google Business
          Profile step by step. No guesswork — just clear actions that drive
          real results.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm ring-1 ring-slate-900/5 sm:p-10">
        <div className="space-y-6">
          {[
            {
              icon: "1",
              title: "Profile Basics",
              desc: "Nail your name, address, hours, and categories",
            },
            {
              icon: "2",
              title: "Services",
              desc: "Add and optimize every service you offer",
            },
            {
              icon: "3",
              title: "Business Description",
              desc: "Write a description that ranks and converts",
            },
            {
              icon: "4",
              title: "Reviews & Replies",
              desc: "Respond to reviews and earn more 5-star ratings",
            },
            {
              icon: "5",
              title: "Q&A & Posts",
              desc: "Pre-fill Q&A and publish GBP posts",
            },
          ].map((phase) => (
            <div
              key={phase.icon}
              className="flex items-start gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                {phase.icon}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{phase.title}</p>
                <p className="text-sm text-slate-500">{phase.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onNext}
          className="mt-8 w-full rounded-lg bg-primary-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Start Optimizing Now
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Takes about 10 minutes — guided every step of the way
        </p>
      </div>

      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ← Back to Report
        </button>
      </div>
    </div>
  );
}
