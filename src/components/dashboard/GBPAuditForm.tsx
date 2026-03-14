"use client";

import { useState, FormEvent } from "react";
import { Sparkles, CheckCircle2, AlertCircle, Globe, Phone, Image as ImageIcon, Star, MessageSquare } from "lucide-react";

const INDUSTRIES = [
  "Painter",
  "Roofer",
  "Plumber",
  "HVAC",
  "Remodeler",
  "Landscaper",
  "Electrician",
  "Flooring",
  "Window Installer",
] as const;

type AuditResult = {
  businessName: string;
  address: string;
  rating: number;
  score: number;
  reviewCount: number;
  photoCount: number;
  hasWebsite: boolean;
  hasPhone: boolean;
  category: string;
  missingItems: string[];
  recommendations: string[];
  suggestedPosts: string[];
  suggestedQA: { question: string; answer: string }[];
  competitorBenchmark: string;
};

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "text-success"
      : score >= 60
        ? "text-warning"
        : "text-destructive";
  const strokeColor =
    score >= 80
      ? "stroke-success"
      : score >= 60
        ? "stroke-warning"
        : "stroke-destructive";
  const bg =
    score >= 80
      ? "bg-success/10"
      : score >= 60
        ? "bg-warning/10"
        : "bg-destructive/10";

  return (
    <div className={`mx-auto flex flex-col items-center rounded-2xl p-8 ${bg}`}>
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-muted"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-700 ease-out ${strokeColor}`}
        />
      </svg>
      <p className={`-mt-[98px] mb-[50px] text-4xl font-bold tabular-nums ${color}`}>
        {score}
      </p>
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Audit Score
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
        {value}
        {sub && (
          <span className="text-sm font-normal text-muted-foreground"> {sub}</span>
        )}
      </p>
    </div>
  );
}

function BulletList({
  title,
  items,
  variant = "warning",
}: {
  title: string;
  items: string[];
  variant?: "warning" | "primary";
}) {
  if (!items.length) return null;
  const dotColor = variant === "warning" ? "bg-warning" : "bg-primary";
  
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GBPAuditForm() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/gbp-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, city, industry }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Audit failed");
      }

      const data: AuditResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Audit form */}
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Google Business Profile Audit
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your business details to run an AI-powered audit.
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-foreground"
              >
                Business name
              </label>
              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                placeholder="e.g. ABC Home Services"
                className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-foreground"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="e.g. Denver"
                className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-foreground"
              >
                Industry
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Analyzing profile...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Run AI Audit
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      {result && (
        <>
          {/* Business header */}
          <section className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <CheckCircle2 className="h-4 w-4" />
              Audit complete
            </div>
            <h2 className="mt-2 text-xl font-bold text-foreground">
              {result.businessName}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{result.address}</p>
          </section>

          {/* Score ring + stats */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                Profile Overview
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <ScoreRing score={result.score} />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  label="Google Rating"
                  value={result.rating.toFixed(1)}
                  sub="/ 5"
                  icon={Star}
                />
                <StatCard label="Review Count" value={result.reviewCount} icon={MessageSquare} />
                <StatCard label="Photo Count" value={result.photoCount} icon={ImageIcon} />
                <StatCard label="Category" value={result.category} />
                <StatCard
                  label="Website"
                  value={result.hasWebsite ? "Listed" : "Missing"}
                  icon={Globe}
                />
                <StatCard
                  label="Phone Number"
                  value={result.hasPhone ? "Listed" : "Missing"}
                  icon={Phone}
                />
              </div>
            </div>
          </section>

          {/* Competitor benchmark */}
          {result.competitorBenchmark && (
            <section className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground">
                Competitor Benchmark
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {result.competitorBenchmark}
              </p>
            </section>
          )}

          {/* Missing items + recommendations */}
          <div className="grid gap-6 lg:grid-cols-2">
            <BulletList
              title="Missing Optimization Items"
              items={result.missingItems}
              variant="warning"
            />
            <BulletList
              title="Recommendations"
              items={result.recommendations}
              variant="primary"
            />
          </div>

          {/* Suggested posts */}
          {result.suggestedPosts.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground">
                Suggested GBP Posts
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {result.suggestedPosts.map((post, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground"
                  >
                    {post}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Suggested Q&A */}
          {result.suggestedQA.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground">
                Suggested Q&amp;A
              </h3>
              <div className="mt-4 space-y-4">
                {result.suggestedQA.map((qa, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-muted/50 p-4"
                  >
                    <p className="text-sm font-medium text-foreground">
                      Q: {qa.question}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      A: {qa.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
