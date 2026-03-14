"use client";

type Props = {
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  visible: boolean;
};

export default function TopCompetitorHighlight({
  name,
  rating,
  reviewCount,
  address,
  visible,
}: Props) {
  if (!visible) return null;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/[0.04]"
      style={{ animation: "fadeUp 0.6s ease-out" }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-xs font-extrabold text-rose-400">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Top Competitor
          </span>
        </div>

        <h3 className="mt-3 text-lg font-black text-white">{name}</h3>
        <p className="mt-0.5 text-sm font-medium text-white/25">{address}</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">⭐</span>
            <span className="text-xl font-black text-white">{rating.toFixed(1)}</span>
            <span className="text-sm font-semibold text-white/25">rating</span>
          </div>
          <div className="h-6 w-px bg-white/[0.06]" />
          <div className="flex items-center gap-1.5">
            <span className="text-lg">💬</span>
            <span className="text-xl font-black text-white">{reviewCount.toLocaleString()}</span>
            <span className="text-sm font-semibold text-white/25">reviews</span>
          </div>
        </div>

        <p className="mt-4 text-sm font-medium leading-relaxed text-white/30">
          This competitor currently has stronger review signals and may outrank
          you in local map pack searches.
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
