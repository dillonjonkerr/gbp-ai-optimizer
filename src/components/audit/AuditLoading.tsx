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
  icon: React.ReactNode;
  title: string;
  detail: string;
  variant: "default" | "success" | "warning" | "danger";
};

const SCAN_PHASES = [
  "Locating your Google Business Profile...",
  "Scanning reviews and photos...",
  "Finding competitors in your area...",
  "Comparing profile metrics...",
  "Generating local keyword targets...",
  "Checking live Google rankings...",
  "Calculating traffic opportunities...",
  "Building competitor gap report...",
];

const VARIANT_STYLES = {
  default: "border-border bg-card",
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5",
  danger: "border-destructive/20 bg-destructive/5",
};

const ICON_STYLES = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

function IconWrapper({ variant, children }: { variant: DiscoveryCard["variant"]; children: React.ReactNode }) {
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${ICON_STYLES[variant]}`}>
      {children}
    </div>
  );
}

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

          const discovered: DiscoveryCard[] = [];

          discovered.push({
            id: "found",
            icon: <MapPinIcon />,
            title: "Business Found",
            detail: `${data.name} - ${data.rating.toFixed(1)} stars with ${data.reviewCount.toLocaleString()} reviews`,
            variant: "default",
          });

          if (data.photoCount > 0) {
            discovered.push({
              id: "photos",
              icon: <PhotoIcon />,
              title: `${data.photoCount} Photos Found`,
              detail: data.photoCount < 10
                ? "Top profiles typically have 20+ photos"
                : "Good photo count - helps with click-through rate",
              variant: data.photoCount >= 10 ? "success" : "warning",
            });
          }

          if (data.competitors.length > 0) {
            const top = data.competitors[0]!;
            discovered.push({
              id: "competitor",
              icon: <CompetitorIcon />,
              title: `Top Competitor: ${top.name}`,
              detail: `${top.rating.toFixed(1)} stars with ${top.reviewCount.toLocaleString()} reviews`,
              variant: "danger",
            });

            if (data.competitors.length > 1) {
              const names = data.competitors.slice(0, 3).map((c) => c.name);
              discovered.push({
                id: "competitors-list",
                icon: <BuildingIcon />,
                title: `${data.competitors.length} Competitors Found`,
                detail: names.join(", "),
                variant: "default",
              });
            }

            if (top.reviewCount > data.reviewCount) {
              discovered.push({
                id: "review-gap",
                icon: <AlertIcon />,
                title: "Review Gap Detected",
                detail: `${top.name} has ${(top.reviewCount - data.reviewCount).toLocaleString()} more reviews than you`,
                variant: "danger",
              });
            }

            if (top.rating > data.rating) {
              discovered.push({
                id: "rating-gap",
                icon: <StarIcon />,
                title: "Rating Gap",
                detail: `${top.name} is rated ${(top.rating - data.rating).toFixed(1)} stars higher`,
                variant: "warning",
              });
            } else if (data.rating > top.rating) {
              discovered.push({
                id: "rating-win",
                icon: <TrophyIcon />,
                title: "You're Winning on Rating",
                detail: `Your ${data.rating.toFixed(1)} stars beats ${top.name}'s ${top.rating.toFixed(1)} stars`,
                variant: "success",
              });
            }
          }

          discovered.push({
            id: "keywords",
            icon: <SearchIcon />,
            title: "Analyzing Keywords",
            detail: `Generating high-intent local keywords for ${data.category || industry || "your industry"} in ${city}`,
            variant: "default",
          });

          discovered.push({
            id: "serp",
            icon: <TrendingIcon />,
            title: "Checking Google Rankings",
            detail: "Scanning live SERP data to find where competitors outrank you",
            variant: "default",
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

  // Reveal cards
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
    <div className="mx-auto max-w-xl space-y-8">
      {/* Header */}
      <div className="text-center">
        {/* AI Icon */}
        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border ai-glow">
            <svg
              className="h-6 w-6 text-primary animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          AI is scanning your market
        </h1>
        <p className="mt-2 text-muted-foreground">
          Analyzing{" "}
          <span className="font-medium text-foreground">{businessName}</span> in{" "}
          <span className="font-medium text-foreground">{city}</span>
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <p className="text-sm font-medium text-primary">
            {SCAN_PHASES[phaseIdx]}
          </p>
        </div>
      </div>

      {/* Photo preview */}
      {preview && preview.photoUrls.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative h-40 overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.photoUrls[photoIdx]}
              alt={preview.name}
              className="h-full w-full object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-base font-semibold text-foreground">{preview.name}</p>
                <p className="text-xs text-muted-foreground">{preview.address}</p>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">{preview.rating.toFixed(1)}</p>
                  <p className="text-[10px] text-muted-foreground">Rating</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{preview.reviewCount}</p>
                  <p className="text-[10px] text-muted-foreground">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skeleton */}
      {!preview && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="h-40 animate-shimmer" />
        </div>
      )}

      {/* Discovery cards */}
      <div className="space-y-3">
        {cards.slice(0, visibleCards).map((card, i) => (
          <div
            key={card.id}
            className={`flex items-start gap-3 rounded-xl border p-4 transition-all duration-500 ${VARIANT_STYLES[card.variant]}`}
            style={{
              animation: i === visibleCards - 1 ? "slideIn 0.4s ease-out" : undefined,
            }}
          >
            <IconWrapper variant={card.variant}>{card.icon}</IconWrapper>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{card.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{card.detail}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {visibleCards < cards.length && (
          <div className="flex items-center gap-2 px-4 py-2">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
            </span>
            <span className="text-xs text-muted-foreground">AI is discovering more...</span>
          </div>
        )}
      </div>

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

// Icons
function MapPinIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function CompetitorIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}
