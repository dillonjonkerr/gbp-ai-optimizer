"use client";

import { useState, useEffect, useCallback } from "react";

type CompetitorPreview = {
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
};

type BusinessPreview = {
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string | null;
  website: string | null;
  photoCount: number;
  photoUrls: string[];
  topReviews: { author: string; rating: number; text: string; time: string }[];
  category: string;
  competitors: CompetitorPreview[];
  insights: string[];
};

type DiscoveryCard = {
  id: string;
  icon: string;
  title: string;
  detail: string;
  accent: "blue" | "green" | "amber" | "rose" | "slate";
};

const SCAN_PHASES = [
  "Locating your Google Business Profile…",
  "Scanning your reviews and photos…",
  "Finding competitors in your area…",
  "Comparing profiles and ratings…",
  "Generating local keyword targets…",
  "Checking live Google rankings…",
  "Calculating traffic opportunities…",
  "Building your competitor gap report…",
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-sm">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

const ACCENT_STYLES = {
  blue: "border-primary-200 bg-primary-50/60",
  green: "border-emerald-200 bg-emerald-50/60",
  amber: "border-amber-200 bg-amber-50/60",
  rose: "border-rose-200 bg-rose-50/60",
  slate: "border-slate-200 bg-slate-50/60",
};

const ICON_STYLES = {
  blue: "bg-primary-100 text-primary-600",
  green: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
};

export default function AuditLoading({
  businessName,
  city,
  industry,
}: {
  businessName: string;
  city: string;
  industry?: string;
}) {
  const [preview, setPreview] = useState<BusinessPreview | null>(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [cards, setCards] = useState<DiscoveryCard[]>([]);
  const [visibleCards, setVisibleCards] = useState(0);

  const addCards = useCallback((newCards: DiscoveryCard[]) => {
    setCards((prev) => [...prev, ...newCards]);
  }, []);

  // Fetch preview data
  useEffect(() => {
    async function fetchPreview() {
      try {
        const res = await fetch("/api/business-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessName, city, industry }),
        });
        if (res.ok) {
          const data: BusinessPreview = await res.json();
          setPreview(data);

          // Build discovery cards from real data
          const discovered: DiscoveryCard[] = [];

          discovered.push({
            id: "found",
            icon: "📍",
            title: "Business Found",
            detail: `${data.name} — ${data.rating.toFixed(1)}★ with ${data.reviewCount.toLocaleString()} reviews`,
            accent: "blue",
          });

          if (data.photoCount > 0) {
            discovered.push({
              id: "photos",
              icon: "📸",
              title: `${data.photoCount} Photos Found`,
              detail: data.photoCount < 10
                ? "Top-performing profiles typically have 20+ photos"
                : "Good photo count — helps with click-through rate",
              accent: data.photoCount >= 10 ? "green" : "amber",
            });
          }

          if (data.competitors.length > 0) {
            const top = data.competitors[0]!;
            discovered.push({
              id: "competitor",
              icon: "⚔️",
              title: `Top Competitor: ${top.name}`,
              detail: `${top.rating.toFixed(1)}★ rating · ${top.reviewCount.toLocaleString()} reviews`,
              accent: "rose",
            });

            if (data.competitors.length > 1) {
              const names = data.competitors.slice(0, 3).map((c) => c.name);
              discovered.push({
                id: "competitors-list",
                icon: "🏢",
                title: `${data.competitors.length} Competitors Found`,
                detail: names.join(", "),
                accent: "slate",
              });
            }

            const top3 = data.competitors.slice(0, 3);
            const avgReviews = Math.round(
              top3.reduce((s, c) => s + c.reviewCount, 0) / top3.length,
            );
            const avgRating = (
              top3.reduce((s, c) => s + c.rating, 0) / top3.length
            ).toFixed(1);
            discovered.push({
              id: "avg-comp",
              icon: "📊",
              title: "Area Average",
              detail: `Competitors average ${avgRating}★ and ${avgReviews.toLocaleString()} reviews`,
              accent: "slate",
            });

            if (top.reviewCount > data.reviewCount) {
              discovered.push({
                id: "review-gap",
                icon: "⚠️",
                title: "Review Gap Detected",
                detail: `${top.name} has ${(top.reviewCount - data.reviewCount).toLocaleString()} more reviews than you`,
                accent: "rose",
              });
            }

            if (top.rating > data.rating) {
              discovered.push({
                id: "rating-gap",
                icon: "⭐",
                title: "Rating Gap",
                detail: `${top.name} is rated ${(top.rating - data.rating).toFixed(1)} stars higher`,
                accent: "amber",
              });
            } else if (data.rating > top.rating) {
              discovered.push({
                id: "rating-win",
                icon: "🏆",
                title: "You're Winning on Rating",
                detail: `Your ${data.rating.toFixed(1)}★ beats ${top.name}'s ${top.rating.toFixed(1)}★`,
                accent: "green",
              });
            }
          }

          for (const insight of data.insights.slice(0, 2)) {
            if (insight.includes("missing") || insight.includes("Only") || insight.includes("Fewer")) {
              discovered.push({
                id: `insight-${discovered.length}`,
                icon: "💡",
                title: "Quick Insight",
                detail: insight,
                accent: "amber",
              });
            }
          }

          discovered.push({
            id: "keywords",
            icon: "🔍",
            title: "Analyzing Keywords",
            detail: `Generating high-intent local keywords for ${data.category || industry || "your industry"} in ${city}`,
            accent: "blue",
          });

          discovered.push({
            id: "serp",
            icon: "📈",
            title: "Checking Google Rankings",
            detail: "Scanning live SERP data to find where competitors outrank you",
            accent: "blue",
          });

          addCards(discovered);
        }
      } catch {
        // Preview is best-effort
      }
    }
    fetchPreview();
  }, [businessName, city, industry, addCards]);

  // Phase progression
  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseIdx((i) => (i < SCAN_PHASES.length - 1 ? i + 1 : i));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Reveal cards one at a time
  useEffect(() => {
    if (cards.length === 0) return;
    const timer = setInterval(() => {
      setVisibleCards((v) => {
        if (v >= cards.length) {
          clearInterval(timer);
          return v;
        }
        return v + 1;
      });
    }, 2200);
    return () => clearInterval(timer);
  }, [cards.length]);

  // Photo rotation
  useEffect(() => {
    if (!preview?.photoUrls?.length) return;
    const timer = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % preview.photoUrls.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [preview?.photoUrls?.length]);

  const progress = Math.min(((phaseIdx + 1) / SCAN_PHASES.length) * 100, 95);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          AI is scanning your market…
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Analyzing{" "}
          <span className="font-medium text-slate-700">{businessName}</span> in{" "}
          <span className="font-medium text-slate-700">{city}</span>
        </p>
      </div>

      {/* Progress bar + phase */}
      <div className="space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500" />
          <p className="text-sm font-medium text-primary-600">
            {SCAN_PHASES[phaseIdx]}
          </p>
        </div>
      </div>

      {/* Photo + stats hero (compact) */}
      {preview && preview.photoUrls.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="relative h-36 overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.photoUrls[photoIdx]}
              alt={`${preview.name}`}
              className="h-full w-full object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-base font-bold text-white">{preview.name}</p>
                <p className="text-xs text-white/70">{preview.address}</p>
              </div>
              <div className="flex gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-white">
                    {preview.rating.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-white/60">Rating</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">
                    {preview.reviewCount}
                  </p>
                  <p className="text-[10px] text-white/60">Reviews</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">
                    {preview.photoCount}
                  </p>
                  <p className="text-[10px] text-white/60">Photos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skeleton before preview loads */}
      {!preview && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="h-36 animate-pulse bg-slate-100" />
        </div>
      )}

      {/* Discovery cards */}
      <div className="space-y-3">
        {cards.slice(0, visibleCards).map((card, i) => (
          <div
            key={card.id}
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-sm transition-all duration-500 ${ACCENT_STYLES[card.accent]}`}
            style={{
              animation: i === visibleCards - 1 ? "slideIn 0.5s ease-out" : undefined,
            }}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base ${ICON_STYLES[card.accent]}`}
            >
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">
                {card.title}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">{card.detail}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator for next card */}
        {visibleCards < cards.length && (
          <div className="flex items-center gap-2 px-4 py-2">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: "300ms" }} />
            </span>
            <span className="text-xs text-slate-400">AI is discovering more…</span>
          </div>
        )}
      </div>

      {/* Rotating review highlight */}
      {preview && preview.topReviews.length > 0 && visibleCards >= 2 && (
        <ReviewHighlight reviews={preview.topReviews} />
      )}

      {/* CSS animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function ReviewHighlight({
  reviews,
}: {
  reviews: { author: string; rating: number; text: string; time: string }[];
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const review = reviews[idx];
  if (!review) return null;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Customer Review
      </p>
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
          {review.author?.charAt(0) ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">
              {review.author}
            </span>
            <Stars rating={review.rating} />
            <span className="text-xs text-slate-400">{review.time}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            &ldquo;{review.text}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
