"use client";

import { TrendingUp } from "lucide-react";

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
    <div className="overflow-hidden rounded-2xl border-2 border-destructive/30 bg-destructive/5 shadow-md animate-fade-in-up">
      <div className="p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
          <TrendingUp className="h-3 w-3" />
          Top Competitor
        </span>

        <h3 className="mt-3 text-lg font-black text-foreground">{name}</h3>
        <p className="mt-0.5 text-sm font-medium text-muted-foreground">
          {address}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">⭐</span>
            <span className="text-xl font-black text-foreground">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              rating
            </span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="text-lg">💬</span>
            <span className="text-xl font-black text-foreground">
              {reviewCount.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              reviews
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
          This competitor currently has stronger review signals and may outrank
          you in local map pack searches.
        </p>
      </div>
    </div>
  );
}
