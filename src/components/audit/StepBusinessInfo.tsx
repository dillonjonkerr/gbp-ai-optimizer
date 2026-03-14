"use client";

import { useState, FormEvent } from "react";
import { INDUSTRIES, type BusinessInfo } from "@/lib/types";
import { AIBadge } from "@/components/ai-badge";
import PlaceAutocomplete from "./PlaceAutocomplete";
import {
  Building,
  MapPinned,
  Search,
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isHovering, setIsHovering] = useState(false);

  const isValid = businessName.trim() && city.trim() && industry;

  function handlePlaceSelect(prediction: {
    mainText: string;
    secondaryText: string;
    types?: string[];
  }) {
    setBusinessName(prediction.mainText);

    if (prediction.secondaryText) {
      const parts = prediction.secondaryText.split(",").map((s) => s.trim());
      if (parts.length >= 2) {
        const cityPart =
          parts.length >= 3 ? parts[parts.length - 3] : parts[0];
        const statePart = parts[parts.length - 2];
        if (cityPart && statePart) {
          setCity(`${cityPart}, ${statePart}`);
        }
      }
    }

    const detected = detectIndustry(
      prediction.types ?? [],
      prediction.mainText
    );
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
    <div className="mx-auto w-full max-w-lg">
      {/* Hero */}
      <div className="space-y-4 text-center mb-6">
        <AIBadge className="mx-auto animate-scale-in" />
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl text-balance leading-[1.1]">
          See where you rank on{" "}
          <span className="text-primary">Google Maps</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg font-medium max-w-sm mx-auto">
          Get a free local visibility report for your painting business in 30
          seconds
        </p>
      </div>

      {/* Geo-Grid Preview */}
      <div className="mb-6 p-4 bg-card rounded-2xl border-2 border-border shadow-lg relative overflow-hidden">
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
            <Sparkles className="h-3 w-3" />
            Preview
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1 mb-4">
          {[
            3, 5, 7, 8, 12, 2, 1, 4, 6, 9, 4, 3, 1, 2, 5, 8, 6, 3, 4, 7, 11,
            9, 5, 6, 8,
          ].map((num, i) => (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-xs font-black text-white transition-all",
                num <= 3
                  ? "bg-green-500"
                  : num <= 7
                    ? "bg-amber-400"
                    : "bg-red-400"
              )}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-green-500" />
              <span className="font-semibold text-muted-foreground">Top 3</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-400" />
              <span className="font-semibold text-muted-foreground">4-7</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-red-400" />
              <span className="font-semibold text-muted-foreground">8+</span>
            </span>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            Map Pack Rankings
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 mb-6 text-center">
        <div>
          <div className="text-2xl font-black text-foreground sm:text-3xl">
            70%
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            of clicks go to
            <br />
            Map Pack
          </div>
        </div>
        <div className="w-px bg-border" />
        <div>
          <div className="text-2xl font-black text-foreground sm:text-3xl">
            88%
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            call or visit
            <br />
            within 24hrs
          </div>
        </div>
        <div className="w-px bg-border" />
        <div>
          <div className="text-2xl font-black text-primary sm:text-3xl">3x</div>
          <div className="text-xs font-semibold text-muted-foreground">
            more leads with
            <br />
            optimized GBP
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <PlaceAutocomplete
            id="businessName"
            label="Your Painting Company"
            value={businessName}
            onChange={setBusinessName}
            onSelect={handlePlaceSelect}
            placeholder="e.g. ABC Painting Co."
            icon={<Building className="h-4 w-4" />}
          />

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-bold text-foreground"
            >
              City / Service Area
            </label>
            <div className="relative mt-1.5">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                <MapPinned className="h-4 w-4" />
              </div>
              <input
                id="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Dallas, TX"
                className="block w-full rounded-xl border-2 border-border bg-card pl-16 pr-4 h-14 text-base font-semibold text-foreground placeholder-muted-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-bold text-foreground"
            >
              Business Category
            </label>
            <select
              id="industry"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border-2 border-border bg-card px-4 h-14 text-base font-semibold text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
          <p className="text-sm font-semibold text-destructive" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !isValid}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={cn(
            "w-full h-14 rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-lg transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2",
            isValid && "shadow-xl shadow-primary/40 animate-pulse-glow"
          )}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Scanning…
            </span>
          ) : (
            <>
              <Search
                className={cn(
                  "h-5 w-5",
                  isHovering && isValid && "animate-pulse"
                )}
              />
              Scan My Business
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Trust */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-5 text-sm font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          Free forever
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          No signup
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          30 sec results
        </span>
      </div>

      {/* Social proof */}
      <div className="mt-5 p-4 bg-muted/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {["J", "M", "R", "S", "T"].map((letter, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-xs font-bold shadow-md"
              >
                {letter}
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                />
              ))}
              <span className="text-xs font-bold text-foreground ml-1">
                4.9
              </span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground truncate">
              Trusted by{" "}
              <span className="text-foreground font-bold">10,000+</span>{" "}
              painting contractors
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="mt-4 text-center">
        <p className="text-sm italic text-muted-foreground">
          &ldquo;Found out I was missing 40+ keywords my competitors were
          ranking for. Fixed it and calls doubled.&rdquo;
        </p>
        <p className="mt-2 text-xs font-bold text-foreground">
          — Mike T., Pro Painters Dallas
        </p>
      </div>
    </div>
  );
}
