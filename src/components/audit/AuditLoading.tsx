"use client";

import { useState, useEffect } from "react";

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
};

const SCAN_STEPS = [
  "Looking up your Google Business Profile…",
  "Pulling your reviews and photos…",
  "Generating local keywords with AI…",
  "Checking search volumes in your area…",
  "Scanning Google rankings for each keyword…",
  "Identifying your top competitors…",
  "Comparing your profile to competitors…",
  "Building your optimization report…",
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
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

export default function AuditLoading({
  businessName,
  city,
}: {
  businessName: string;
  city: string;
}) {
  const [preview, setPreview] = useState<BusinessPreview | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);

  useEffect(() => {
    async function fetchPreview() {
      try {
        const res = await fetch("/api/business-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessName, city }),
        });
        if (res.ok) {
          const data = await res.json();
          setPreview(data);
        }
      } catch {
        // Preview is optional
      }
    }
    fetchPreview();
  }, [businessName, city]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIdx((i) => (i < SCAN_STEPS.length - 1 ? i + 1 : i));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!preview?.photoUrls?.length) return;
    const timer = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % preview.photoUrls.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [preview?.photoUrls?.length]);

  useEffect(() => {
    if (!preview?.topReviews?.length) return;
    const timer = setInterval(() => {
      setReviewIdx((i) => (i + 1) % preview.topReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [preview?.topReviews?.length]);

  const progress = Math.min(((stepIdx + 1) / SCAN_STEPS.length) * 100, 95);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Scanning your market…
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Analyzing <span className="font-medium text-slate-700">{businessName}</span> in{" "}
          <span className="font-medium text-slate-700">{city}</span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-3">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm font-medium text-primary-600 transition-opacity duration-500">
          {SCAN_STEPS[stepIdx]}
        </p>
      </div>

      {/* Business preview card */}
      {preview && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
          {/* Photo carousel */}
          {preview.photoUrls.length > 0 && (
            <div className="relative h-48 overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.photoUrls[photoIdx]}
                alt={`${preview.name} photo`}
                className="h-full w-full object-cover transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-lg font-bold text-white">{preview.name}</p>
                <p className="text-xs text-white/80">{preview.address}</p>
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800 shadow">
                {photoIdx + 1} / {preview.photoUrls.length}
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{preview.rating.toFixed(1)}</p>
              <p className="mt-0.5">
                <Stars rating={preview.rating} />
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{preview.reviewCount}</p>
              <p className="mt-0.5 text-xs text-slate-500">Reviews</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{preview.photoCount}</p>
              <p className="mt-0.5 text-xs text-slate-500">Photos</p>
            </div>
          </div>

          {/* Rotating review */}
          {preview.topReviews.length > 0 && (
            <div className="p-5">
              <div className="min-h-[4.5rem] transition-opacity duration-500">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                    {preview.topReviews[reviewIdx]?.author?.charAt(0) ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {preview.topReviews[reviewIdx]?.author}
                      </span>
                      <span className="text-xs text-slate-400">
                        {preview.topReviews[reviewIdx]?.time}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-amber-500">
                      {"★".repeat(preview.topReviews[reviewIdx]?.rating ?? 5)}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      &ldquo;{preview.topReviews[reviewIdx]?.text}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skeleton if no preview yet */}
      {!preview && (
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
          </div>
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
        </div>
      )}
    </div>
  );
}
