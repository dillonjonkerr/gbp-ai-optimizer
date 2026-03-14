"use client";

import { useState } from "react";
import type { AuditResult, BusinessInfo } from "@/lib/types";

export default function StepConvert({
  result,
  businessInfo,
  onBack,
}: {
  result: AuditResult;
  businessInfo: BusinessInfo;
  onBack: () => void;
}) {
  const [downloading, setDownloading] = useState(false);

  const gapCount = result.marketScan.keywords.length;
  const missedTraffic = result.marketScan.estimatedMissedTraffic;
  const competitor = result.marketScan.primaryCompetitorName;

  async function handleDownloadPDF() {
    setDownloading(true);
    try {
      const res = await fetch("/api/audit-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, businessInfo }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${businessInfo.businessName.replace(/\s+/g, "-")}-GBP-Audit.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/60 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Analysis Complete
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          How do you want to
          <br />
          <span className="text-primary-600">fix your rankings?</span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-500">
          We found{" "}
          <span className="font-semibold text-rose-600">
            {gapCount} keyword gaps
          </span>{" "}
          where{" "}
          <span className="font-medium text-slate-700">{competitor}</span> is
          outranking you, costing you an estimated{" "}
          <span className="font-semibold text-rose-600">
            {missedTraffic.toLocaleString()} searches/month
          </span>
          . Choose how you want to fix it.
        </p>
      </div>

      {/* Two options */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Option A: AI Implementation (Free, Recommended) */}
        <div className="relative flex flex-col rounded-2xl border-2 border-primary-500 bg-white p-8 shadow-lg">
          <div className="absolute -top-3 right-6 rounded-full bg-primary-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
            Recommended
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-2xl">
            🤖
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Let AI Fix It For You
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Connect your Google Business Profile and let our AI implement every
            optimization automatically. We push changes live so you start
            ranking faster.
          </p>

          <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
            {[
              "Full keyword gap analysis",
              "AI writes your business description",
              "Auto-publish optimized posts",
              "AI-generated review responses",
              "Q&A entries added automatically",
              "Monthly ranking monitoring",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs text-primary-600">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <div className="mb-3 text-center">
              <span className="text-2xl font-bold text-emerald-600">Free</span>
            </div>
            <button
              onClick={() => {
                /* TODO: Connect GBP OAuth flow */
              }}
              className="w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Connect My Google Profile
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              No credit card required
            </p>
          </div>
        </div>

        {/* Option B: DIY PDF ($9.99) */}
        <div className="flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm transition hover:border-slate-300 hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
            📄
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            DIY Optimization Guide
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Download a detailed report with every recommendation, keyword gap,
            and step-by-step instructions to optimize your Google Business
            Profile yourself.
          </p>

          <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
            {[
              "Full keyword gap analysis",
              "Competitor comparison breakdown",
              "AI-written optimization checklist",
              "Suggested posts and Q&A entries",
              "Priority action items",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <div className="mb-3 text-center">
              <span className="text-2xl font-bold text-slate-900">$9.99</span>
              <span className="text-sm text-slate-400"> one-time</span>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full rounded-xl border-2 border-slate-900 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {downloading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent" />
                  Generating…
                </span>
              ) : (
                "Download Report"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick recap */}
      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-6">
        <h3 className="text-sm font-bold text-amber-800">
          What happens if you do nothing?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/70">
          {competitor} will continue capturing{" "}
          <strong>{missedTraffic.toLocaleString()} searches every month</strong>{" "}
          that could be going to your business. Over 12 months, that&apos;s{" "}
          <strong>
            {(missedTraffic * 12).toLocaleString()} potential customers
          </strong>{" "}
          you&apos;ll miss.
        </p>
      </div>

      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ← Back to Report
        </button>
      </div>
    </div>
  );
}
