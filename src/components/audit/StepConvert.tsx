"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuditResult, BusinessInfo } from "@/lib/types";
import {
  Zap,
  Download,
  ArrowRight,
  CheckCircle,
  Crown,
  FileText,
} from "lucide-react";

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
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showBetaModal, setShowBetaModal] = useState(false);

  const gapCount = result.marketScan.keywords.length;
  const missedTraffic = result.marketScan.estimatedMissedTraffic;
  const competitor = result.marketScan.primaryCompetitorName;

  const triggerDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/audit-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, businessInfo }),
      });

      if (!res.ok) throw new Error("Failed to generate report");

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
  }, [result, businessInfo]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      window.history.replaceState({}, "", window.location.pathname);
      triggerDownload();
    }
  }, [triggerDownload]);

  async function handleDownloadPDF() {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripeKey) {
      setShowBetaModal(true);
      return;
    }

    setDownloading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: window.location.origin + "/audit" }),
      });

      const data = await res.json();

      if (data.error === "STRIPE_NOT_CONFIGURED") {
        setShowBetaModal(true);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No checkout URL returned");
    } catch (err) {
      console.error("Checkout failed:", err);
      setShowBetaModal(true);
    } finally {
      setDownloading(false);
    }
  }

  const diyFeatures = [
    "Full keyword gap analysis",
    "Competitor comparison breakdown",
    "AI-written optimization checklist",
    "Suggested posts and Q&A entries",
    "Priority action items",
  ];

  const aiFeatures = [
    "AI-powered profile optimization",
    "Automated post scheduling",
    "Real-time keyword tracking",
    "Continuous competitor monitoring",
    "AI-generated review responses",
    "Monthly ranking monitoring",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Analysis Complete
        </span>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Choose your path forward
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed text-muted-foreground">
          We found{" "}
          <span className="font-bold text-destructive">
            {gapCount} keyword gaps
          </span>{" "}
          where{" "}
          <span className="font-bold text-foreground">{competitor}</span> is
          outranking you, costing you an estimated{" "}
          <span className="font-bold text-destructive">
            {missedTraffic.toLocaleString()} searches/month
          </span>
          .
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* AI Option (Recommended) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-xl shadow-primary/20 animate-fade-in-up opacity-0 animation-delay-100">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30">
              <Crown className="h-3.5 w-3.5" />
              Best Value
            </span>
          </div>
          <div className="relative p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white shadow-xl shadow-primary/30 shrink-0">
                <Zap className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1 pr-20">
                <h2 className="text-xl font-black text-foreground">
                  AI Optimization
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  Connect your GBP and let AI handle improvements automatically.
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {aiFeatures.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-semibold text-muted-foreground"
                >
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <div className="mb-3 text-center">
                <span className="text-2xl font-black text-green-600">Free</span>
              </div>
              <button
                onClick={() => setShowConnectModal(true)}
                className="w-full h-12 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-xl shadow-primary/30 transition hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Zap className="h-5 w-5" />
                Connect My Account
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-2 text-center text-xs font-semibold text-muted-foreground">
                No credit card required
              </p>
            </div>
          </div>
        </div>

        {/* DIY Option */}
        <div className="rounded-2xl border-2 border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-lg animate-fade-in-up opacity-0 animation-delay-200">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted shrink-0 shadow-lg">
                <FileText className="h-7 w-7 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black text-foreground">
                  DIY Fix Plan
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  Download a professional audit with exact steps to improve your
                  profile yourself.
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {diyFeatures.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-semibold text-muted-foreground"
                >
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <div className="mb-3 text-center">
                <span className="text-2xl font-black text-foreground">
                  $9.99
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {" "}
                  one-time
                </span>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="w-full h-12 rounded-xl border-2 border-foreground bg-card text-base font-bold text-foreground transition hover:bg-muted flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {downloading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                    Generating…
                  </span>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Download My Fix Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
        <h3 className="text-sm font-black text-amber-800">
          What happens if you do nothing?
        </h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-amber-900/70">
          {competitor} will continue capturing{" "}
          <strong>{missedTraffic.toLocaleString()} searches every month</strong>{" "}
          that could be going to your business. Over 12 months, that&apos;s{" "}
          <strong>
            {(missedTraffic * 12).toLocaleString()} potential customers
          </strong>{" "}
          you&apos;ll miss.
        </p>
      </div>

      {/* Back */}
      <button
        onClick={onBack}
        className="rounded-xl border-2 border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground shadow-sm transition hover:bg-muted"
      >
        ← Back to Report
      </button>

      {/* Modals */}
      {showConnectModal && (
        <ConnectModal
          businessName={businessInfo.businessName}
          onClose={() => setShowConnectModal(false)}
        />
      )}
      {showBetaModal && (
        <BetaDownloadModal
          onClose={() => setShowBetaModal(false)}
          onDownload={() => {
            setShowBetaModal(false);
            triggerDownload();
          }}
        />
      )}
    </div>
  );
}

function ConnectModal({
  businessName,
  onClose,
}: {
  businessName: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-card border-2 border-border p-8 shadow-xl">
        {!submitted ? (
          <>
            <h3 className="text-xl font-black text-foreground">
              Connect Your Google Profile
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
              Enter your email and we&apos;ll notify you as soon as your profile
              connection is ready.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="connect-biz"
                  className="block text-sm font-bold text-foreground"
                >
                  Business Name
                </label>
                <input
                  id="connect-biz"
                  type="text"
                  value={businessName}
                  readOnly
                  className="mt-1 w-full rounded-xl border-2 border-border bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground"
                />
              </div>
              <div>
                <label
                  htmlFor="connect-email"
                  className="block text-sm font-bold text-foreground"
                >
                  Email Address
                </label>
                <input
                  id="connect-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`mt-1 w-full rounded-xl border-2 px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    emailError ? "border-destructive" : "border-border"
                  }`}
                  autoFocus
                />
                {emailError && (
                  <p className="mt-1 text-xs font-semibold text-destructive">
                    {emailError}
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  Join Early Access
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border-2 border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✓
            </div>
            <h3 className="mt-4 text-xl font-black text-foreground">
              You&apos;re on the list!
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
              We&apos;ll email you when your profile connection is ready.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BetaDownloadModal({
  onClose,
  onDownload,
}: {
  onClose: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-card border-2 border-border p-8 shadow-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
          🎉
        </div>
        <h3 className="mt-4 text-xl font-black text-foreground">
          Beta Access
        </h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
          Payment coming soon — download is free during beta!
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onDownload}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Download Free
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border-2 border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
