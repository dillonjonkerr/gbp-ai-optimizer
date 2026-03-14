"use client";

import { useState, FormEvent } from "react";
import { INDUSTRIES, type BusinessInfo } from "@/lib/types";
import PlaceAutocomplete from "./PlaceAutocomplete";

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
  }) {
    setBusinessName(prediction.mainText);
    // Auto-fill city from the secondary text (e.g. "Sandy, UT, USA")
    if (prediction.secondaryText && !city) {
      const parts = prediction.secondaryText.split(",").map((s) => s.trim());
      // Typically: "City, State, Country" or "Address, City, State, Country"
      if (parts.length >= 2) {
        const cityPart = parts.length >= 3 ? parts[parts.length - 3] : parts[0];
        const statePart = parts[parts.length - 2];
        if (cityPart && statePart) {
          setCity(`${cityPart}, ${statePart}`);
        }
      }
    }
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
