"use client";

import { useState, useEffect, useCallback } from "react";
import MarketScanProgress from "./scan/MarketScanProgress";
import BusinessProfileCard from "./scan/BusinessProfileCard";
import ScanDiscoveriesFeed, { type Discovery } from "./scan/ScanDiscoveriesFeed";
import TopCompetitorHighlight from "./scan/TopCompetitorHighlight";
import ScanInsightPanel from "./scan/ScanInsightPanel";

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
  const [progress, setProgress] = useState(5);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showCompetitor, setShowCompetitor] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [insightText, setInsightText] = useState("");

  const buildDiscoveries = useCallback(
    (data: BusinessPreview): Discovery[] => {
      const items: Discovery[] = [];

      items.push({
        id: "profile-found",
        label: "Business profile detected",
        detail: `${data.name} — ${data.rating.toFixed(1)}★ with ${data.reviewCount.toLocaleString()} reviews`,
        type: "success",
      });

      if (data.competitors.length > 0) {
        items.push({
          id: "competitors-found",
          label: `${data.competitors.length} competitors identified`,
          detail: `${data.competitors.length} competitors detected in ${city}`,
          type: "info",
        });

        const top = data.competitors[0]!;
        items.push({
          id: "top-competitor",
          label: "Top competitor discovered",
          detail: `${top.name} — ${top.rating.toFixed(1)}★ rating`,
          type: "danger",
        });

        const top3 = data.competitors.slice(0, 3);
        const avgRating = (
          top3.reduce((s, c) => s + c.rating, 0) / top3.length
        ).toFixed(1);
        items.push({
          id: "market-avg",
          label: "Market insight",
          detail: `Average competitor rating: ${avgRating}★`,
          type: "info",
        });

        if (top.rating > data.rating) {
          items.push({
            id: "rating-gap",
            label: "Rating gap detected",
            detail: `Top competitor is rated ${(top.rating - data.rating).toFixed(1)}★ higher`,
            type: "warning",
          });
        } else if (data.rating > top.rating) {
          items.push({
            id: "rating-lead",
            label: "You lead on rating",
            detail: `Your ${data.rating.toFixed(1)}★ beats ${top.name}'s ${top.rating.toFixed(1)}★`,
            type: "success",
          });
        }

        if (top.reviewCount > data.reviewCount) {
          items.push({
            id: "review-gap",
            label: "Review gap detected",
            detail: `${top.name} has ${(top.reviewCount - data.reviewCount).toLocaleString()} more reviews`,
            type: "warning",
          });
        }
      }

      items.push({
        id: "keyword-scan",
        label: "Scanning local keywords",
        detail: `Generating high-intent keywords for ${data.category || industry || "your industry"} in ${city}`,
        type: "info",
      });

      items.push({
        id: "rankings",
        label: "Checking Google rankings",
        detail: "Scanning live SERP data for competitor ranking positions",
        type: "info",
      });

      return items;
    },
    [city, industry],
  );

  const buildInsight = useCallback((data: BusinessPreview): string => {
    const parts: string[] = [];
    const top = data.competitors[0];

    if (top) {
      if (data.rating >= top.rating && data.reviewCount >= top.reviewCount) {
        parts.push(
          `Your profile is strong with a ${data.rating.toFixed(1)}★ rating and ${data.reviewCount} reviews.`,
        );
        parts.push(
          "However, competitors may still outrank you on keyword-optimized descriptions, posts, and Q&A entries.",
        );
      } else if (top.rating > data.rating) {
        parts.push(
          `Your rating of ${data.rating.toFixed(1)}★ is slightly behind ${top.name}'s ${top.rating.toFixed(1)}★.`,
        );
        parts.push(
          "Google weighs ratings heavily in local map pack results — closing this gap could significantly improve your visibility.",
        );
      } else if (top.reviewCount > data.reviewCount) {
        parts.push(
          `${top.name} has ${top.reviewCount} reviews compared to your ${data.reviewCount}.`,
        );
        parts.push(
          "Review volume is a key local ranking signal. A consistent review generation strategy could help you overtake them.",
        );
      }
    }

    if (!data.website) {
      parts.push(
        "Your profile is missing a website link, which limits trust signals Google uses for ranking.",
      );
    }
    if (data.photoCount < 10) {
      parts.push(
        `Only ${data.photoCount} photos were detected. Profiles with 20+ photos tend to get more engagement.`,
      );
    }

    return (
      parts.join(" ") ||
      "We're analyzing your competitive landscape and will have detailed insights ready shortly."
    );
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
          setDiscoveries(buildDiscoveries(data));
          setInsightText(buildInsight(data));
        }
      } catch {
        // Preview is best-effort
      }
    }
    fetchPreview();
  }, [businessName, city, industry, buildDiscoveries, buildInsight]);

  // Smooth progress animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return 92;
        const increment = p < 30 ? 3 : p < 60 ? 2 : 1;
        return Math.min(p + increment, 92);
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Reveal discoveries one by one
  useEffect(() => {
    if (discoveries.length === 0) return;
    const timer = setInterval(() => {
      setVisibleCount((v) => {
        if (v >= discoveries.length) {
          clearInterval(timer);
          return v;
        }
        return v + 1;
      });
    }, 2400);
    return () => clearInterval(timer);
  }, [discoveries.length]);

  // Show competitor card after enough discoveries revealed
  useEffect(() => {
    if (visibleCount >= 3 && preview?.competitors?.length) {
      const timer = setTimeout(() => setShowCompetitor(true), 800);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, preview?.competitors?.length]);

  // Show AI insight after competitor card
  useEffect(() => {
    if (showCompetitor && insightText) {
      const timer = setTimeout(() => setShowInsight(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [showCompetitor, insightText]);

  const topCompetitor = preview?.competitors?.[0];

  return (
    <div className="mx-auto max-w-xl">
      <div className="space-y-8">
        {/* 1. Progress Section */}
        <MarketScanProgress
          businessName={businessName}
          city={city}
          progress={progress}
        />

        {/* Divider */}
        <div className="mx-auto h-px w-16 bg-slate-200" />

        {/* 2. Business Profile Card */}
        <BusinessProfileCard
          name={preview?.name ?? businessName}
          address={preview?.address ?? ""}
          rating={preview?.rating ?? 0}
          reviewCount={preview?.reviewCount ?? 0}
          photoCount={preview?.photoCount ?? 0}
          photoUrls={preview?.photoUrls ?? []}
          visible={!!preview}
        />

        {/* 3. Discoveries Feed */}
        {discoveries.length > 0 && (
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Discoveries
            </h3>
            <ScanDiscoveriesFeed
              discoveries={discoveries}
              visibleCount={visibleCount}
              isRevealing={visibleCount < discoveries.length}
            />
          </div>
        )}

        {/* 4. Top Competitor Highlight */}
        {topCompetitor && (
          <TopCompetitorHighlight
            name={topCompetitor.name}
            rating={topCompetitor.rating}
            reviewCount={topCompetitor.reviewCount}
            address={topCompetitor.address}
            visible={showCompetitor}
          />
        )}

        {/* 5. AI Insight Panel */}
        <ScanInsightPanel insight={insightText} visible={showInsight} />
      </div>
    </div>
  );
}
