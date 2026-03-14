"use client";

import { useState, FormEvent } from "react";
import { INDUSTRIES, type BusinessInfo } from "@/lib/types";
import PlaceAutocomplete from "./PlaceAutocomplete";

const TYPE_TO_INDUSTRY: Record<string, string> = {
  painter: "Painter",
  painting_contractor: "Painter",
  roofing_contractor: "Roofer",
  plumber: "Plumber",
  plumbing_contractor: "Plumber",
  hvac_contractor: "HVAC",
  air_conditioning_contractor: "HVAC",
  heating_contractor: "HVAC",
  general_contractor: "Remodeler",
  home_improvement_store: "Remodeler",
  remodeler: "Remodeler",
  landscaper: "Landscaper",
  landscaping: "Landscaper",
  lawn_care_service: "Landscaper",
  garden_center: "Landscaper",
  electrician: "Electrician",
  electrical_contractor: "Electrician",
  flooring_store: "Flooring",
  flooring_contractor: "Flooring",
  floor: "Flooring",
  window_installation_service: "Window Installer",
  window: "Window Installer",
  glass: "Window Installer",
};

const NAME_KEYWORDS: [RegExp, string][] = [
  [/paint/i, "Painter"],
  [/roof/i, "Roofer"],
  [/plumb/i, "Plumber"],
  [/hvac|heat|cool|air.?condition/i, "HVAC"],
  [/remodel|renovation|construction|contractor/i, "Remodeler"],
  [/landscape|lawn|garden/i, "Landscaper"],
  [/electric/i, "Electrician"],
  [/floor/i, "Flooring"],
  [/window|glass/i, "Window Installer"],
];

function detectIndustry(types: string[], businessName?: string): string | null {
  for (const t of types) {
    if (TYPE_TO_INDUSTRY[t]) return TYPE_TO_INDUSTRY[t];
  }
  const joined = types.join(" ");
  for (const [keyword, industry] of Object.entries(TYPE_TO_INDUSTRY)) {
    if (joined.includes(keyword)) return industry;
  }
  if (businessName) {
    for (const [pattern, industry] of NAME_KEYWORDS) {
      if (pattern.test(businessName)) return industry;
    }
  }
  return null;
}

export default function StepBusinessInfo({
  initial,
  loading,
  error,
  onSubmit,
}: {
  initial: BusinessInfo;
  loading: boolean;
  error: string | null;
  onSubmit: (info: BusinessInfo) => void;
}) {
  const [businessName, setBusinessName] = useState(initial.businessName);
  const [city, setCity] = useState(initial.city);
  const [industry, setIndustry] = useState<string>(initial.industry);

  function handlePlaceSelect(prediction: {
    mainText: string;
    secondaryText: string;
    types?: string[];
  }) {
    setBusinessName(prediction.mainText);

    if (prediction.secondaryText) {
      const parts = prediction.secondaryText.split(",").map((s) => s.trim());
      if (parts.length >= 2) {
        const cityPart = parts.length >= 3 ? parts[parts.length - 3] : parts[0];
        const statePart = parts[parts.length - 2];
        if (cityPart && statePart) {
          setCity(`${cityPart}, ${statePart}`);
        }
      }
    }

    const detected = detectIndustry(prediction.types ?? [], prediction.mainText);
    if (detected) setIndustry(detected);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      businessName,
      city,
      industry: industry as BusinessInfo["industry"],
    });
  }

  return (
    <div className="mx-auto max-w-lg">
      {/* AI Assistant visual */}
      <div className="mb-8 text-center">
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          {/* Glow rings */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <div className="absolute inset-2 rounded-full bg-primary/10" />
          {/* Core */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-card border border-border ai-glow">
            <svg
              className="h-7 w-7 text-primary"
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

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
          Let&apos;s scan your Google Business Profile
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Tell us about your business and our AI will analyze your local market,
          find keyword gaps, and show you exactly how to outrank competitors.
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <div className="space-y-5">
          <PlaceAutocomplete
            id="businessName"
            label="Business name"
            value={businessName}
            onChange={setBusinessName}
            onSelect={handlePlaceSelect}
            placeholder="Start typing your business name..."
          />

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              City / Service Area
            </label>
            <input
              id="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Austin, Texas"
              className="block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Primary Category
            </label>
            <select
              id="industry"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-foreground px-5 py-3.5 text-sm font-semibold text-background transition hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Scanning your market...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              Scan My Business
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Free audit - No credit card required
        </p>
      </form>
    </div>
  );
}
