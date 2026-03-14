"use client";

import { useState, useEffect } from "react";

type Props = {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  photoCount: number;
  photoUrls: string[];
  visible: boolean;
};

export default function BusinessProfileCard({
  name,
  address,
  rating,
  reviewCount,
  photoCount,
  photoUrls,
  visible,
}: Props) {
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (photoUrls.length <= 1) return;
    const timer = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % photoUrls.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [photoUrls.length]);

  if (!visible) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white">
        <div className="h-48 animate-pulse bg-slate-100" />
        <div className="space-y-3 p-5">
          <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm"
      style={{ animation: "fadeUp 0.6s ease-out" }}
    >
      {/* Photo */}
      {photoUrls.length > 0 && (
        <div className="relative h-48 overflow-hidden bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrls[photoIdx]}
            alt={name}
            className="h-full w-full object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

          <div className="absolute left-5 top-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Profile Found
            </div>
          </div>

          {photoUrls.length > 1 && (
            <div className="absolute bottom-4 right-5 flex gap-1">
              {photoUrls.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === photoIdx ? "w-4 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-slate-900">{name}</h2>
        <p className="mt-1 text-sm text-slate-500">{address}</p>

        <div className="mt-4 flex items-center gap-6">
          <Stat label="Rating" value={rating.toFixed(1)} icon="⭐" />
          <div className="h-8 w-px bg-slate-100" />
          <Stat label="Reviews" value={reviewCount.toLocaleString()} icon="💬" />
          <div className="h-8 w-px bg-slate-100" />
          <Stat label="Photos" value={String(photoCount)} icon="📷" />
        </div>
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

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-lg font-bold leading-tight text-slate-900">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}
