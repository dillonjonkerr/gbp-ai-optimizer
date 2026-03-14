"use client";

import { useState, FormEvent } from "react";

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
      ? "text-emerald-500 stroke-emerald-500"
      : score >= 60
        ? "text-amber-500 stroke-amber-500"
        : "text-rose-500 stroke-rose-500";
  const bg =
    score >= 80
      ? "bg-emerald-50"
      : score >= 60
        ? "bg-amber-50"
        : "bg-rose-50";

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
          className="text-slate-200"
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
          className={`transition-all duration-700 ease-out ${color}`}
        />
      </svg>
      <p className={`-mt-[98px] mb-[50px] text-4xl font-bold tabular-nums ${color.split(" ")[0]}`}>
        {score}
      </p>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Audit Score
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
        {value}
        {sub && (
          <span className="text-sm font-normal text-slate-500"> {sub}</span>
        )}
      </p>
    </div>
  );
}

function BulletList({
  title,
  items,
  dotColor = "bg-amber-500",
}: {
  title: string;
  items: string[];
  dotColor?: string;
}) {
  if (!items.length) return null;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
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
      {/* ── Audit form ──────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Google Business Profile audit
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your business details to run an AI-powered audit of your
            profile.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-slate-700"
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
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-slate-700"
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
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-slate-700"
              >
                Industry
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
            <p className="mt-4 text-sm text-rose-600" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing profile…
                </>
              ) : (
                "Run AI Audit"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ── Results ─────────────────────────────────────────────────── */}
      {result && (
        <>
          {/* Business header */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
              Audit complete
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {result.businessName}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">{result.address}</p>
          </section>

          {/* Score ring + stats */}
          <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                Profile overview
              </h2>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <ScoreRing score={result.score} />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  label="Google Rating"
                  value={result.rating.toFixed(1)}
                  sub="/ 5"
                />
                <StatCard label="Review Count" value={result.reviewCount} />
                <StatCard label="Photo Count" value={result.photoCount} />
                <StatCard label="Category" value={result.category} />
                <StatCard
                  label="Website"
                  value={result.hasWebsite ? "Listed" : "Missing"}
                />
                <StatCard
                  label="Phone Number"
                  value={result.hasPhone ? "Listed" : "Missing"}
                />
              </div>
            </div>
          </section>

          {/* Competitor benchmark */}
          {result.competitorBenchmark && (
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
              <h3 className="text-sm font-semibold text-slate-700">
                Competitor benchmark
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {result.competitorBenchmark}
              </p>
            </section>
          )}

          {/* Missing items + recommendations */}
          <div className="grid gap-6 lg:grid-cols-2">
            <BulletList
              title="Missing Optimization Items"
              items={result.missingItems}
              dotColor="bg-amber-500"
            />
            <BulletList
              title="Recommendations"
              items={result.recommendations}
              dotColor="bg-primary-500"
            />
          </div>

          {/* Suggested posts */}
          {result.suggestedPosts.length > 0 && (
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
              <h3 className="text-sm font-semibold text-slate-700">
                Suggested GBP posts
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {result.suggestedPosts.map((post, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-700"
                  >
                    {post}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Suggested Q&A */}
          {result.suggestedQA.length > 0 && (
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
              <h3 className="text-sm font-semibold text-slate-700">
                Suggested Q&amp;A
              </h3>
              <div className="mt-4 space-y-4">
                {result.suggestedQA.map((qa, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      Q: {qa.question}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
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
