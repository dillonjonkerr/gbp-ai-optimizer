"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

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
      <div className="overflow-hidden rounded-2xl border-2 border-border bg-card">
        <div className="h-48 animate-pulse bg-muted" />
        <div className="space-y-3 p-5">
          <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg animate-fade-up">
      {photoUrls.length > 0 && (
        <div className="relative h-48 overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrls[photoIdx]}
            alt={name}
            className="h-full w-full object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute left-5 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              <CheckCircle className="h-3 w-3" />
              Profile Found
            </span>
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

      <div className="p-5">
        <h2 className="text-xl font-black text-foreground">{name}</h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {address}
        </p>

        <div className="mt-4 flex items-center gap-6">
          <Stat label="Rating" value={rating.toFixed(1)} icon="⭐" />
          <div className="h-8 w-px bg-border" />
          <Stat
            label="Reviews"
            value={reviewCount.toLocaleString()}
            icon="💬"
          />
          <div className="h-8 w-px bg-border" />
          <Stat label="Photos" value={String(photoCount)} icon="📷" />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-lg font-black leading-tight text-foreground">
          {value}
        </p>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
