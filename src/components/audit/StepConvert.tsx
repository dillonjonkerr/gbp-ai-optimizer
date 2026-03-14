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
        <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-xs font-medium text-success mb-6">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Analysis Complete
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
          Choose how you want to
          <br />
          <span className="text-primary">fix your rankings</span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-muted-foreground leading-relaxed">
          We found{" "}
          <span className="font-semibold text-destructive">
            {gapCount} keyword gaps
          </span>{" "}
          where{" "}
          <span className="font-medium text-foreground">{competitor}</span> is
          outranking you, costing you an estimated{" "}
          <span className="font-semibold text-destructive">
            {missedTraffic.toLocaleString()} searches/month
          </span>
          .
        </p>
      </div>

      {/* Two options */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Option A: AI Implementation (Free, Recommended) */}
        <div className="relative flex flex-col rounded-xl border-2 border-primary bg-card p-6 sm:p-8">
          <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            Recommended
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            AI Assisted Optimization
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Connect your Google Business Profile and let AI guide and write the
            improvements. We push changes live so you start ranking faster.
          </p>

          <ul className="mt-5 space-y-2.5 text-sm text-foreground/80">
            {[
              "Full keyword gap analysis",
              "AI writes your business description",
              "Auto-publish optimized posts",
              "AI-generated review responses",
              "Q&A entries added automatically",
              "Monthly ranking monitoring",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <div className="mb-3 text-center">
              <span className="text-2xl font-bold text-success">Free</span>
            </div>
            <button
              onClick={() => {
                /* TODO: Connect GBP OAuth flow */
              }}
              className="w-full rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              Connect My Account
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              No credit card required
            </p>
          </div>
        </div>

        {/* Option B: DIY PDF */}
        <div className="flex flex-col rounded-xl border border-border bg-card p-6 transition hover:border-muted-foreground/30 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            DIY Fix Plan
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Download a step-by-step PDF audit explaining exactly how to fix your
            Google Business Profile yourself.
          </p>

          <ul className="mt-5 space-y-2.5 text-sm text-foreground/80">
            {[
              "Full keyword gap analysis",
              "Competitor comparison breakdown",
              "AI-written optimization checklist",
              "Suggested posts and Q&A entries",
              "Priority action items",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <div className="mb-3 text-center">
              <span className="text-2xl font-bold text-foreground">$9.99</span>
              <span className="text-sm text-muted-foreground"> one-time</span>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60"
            >
              {downloading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                  Generating...
                </span>
              ) : (
                "Download My Fix Plan"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick recap */}
      <div className="rounded-xl border border-warning/20 bg-warning/5 p-6">
        <h3 className="text-sm font-bold text-warning">
          What happens if you do nothing?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/70">
          {competitor} will continue capturing{" "}
          <strong className="text-foreground">{missedTraffic.toLocaleString()} searches every month</strong>{" "}
          that could be going to your business. Over 12 months, that&apos;s{" "}
          <strong className="text-foreground">
            {(missedTraffic * 12).toLocaleString()} potential customers
          </strong>{" "}
          you&apos;ll miss.
        </p>
      </div>

      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Report
        </button>
      </div>
    </div>
  );
}
