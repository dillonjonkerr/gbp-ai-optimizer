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
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Let&apos;s audit your Google Business Profile
        </h1>
        <p className="mt-3 text-base text-slate-500">
          Tell us about your business and we&apos;ll scan your local market,
          analyze your profile, and show you exactly how to rank higher.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-5 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm ring-1 ring-slate-900/5"
      >
        <PlaceAutocomplete
          id="businessName"
          label="Business name"
          value={businessName}
          onChange={setBusinessName}
          onSelect={handlePlaceSelect}
          placeholder="Start typing your business name…"
        />
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-slate-700"
          >
            Main area / city
          </label>
          <input
            id="city"
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Sandy, Utah"
            className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div>
          <label
            htmlFor="industry"
            className="block text-sm font-medium text-slate-700"
          >
            Business category
          </label>
          <select
            id="industry"
            required
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Scanning your market…
            </span>
          ) : (
            "Scan My Business"
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          Free audit — no credit card required
        </p>
      </form>
    </div>
  );
}
