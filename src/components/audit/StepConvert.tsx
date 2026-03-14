"use client";

import { useState, useEffect, useCallback } from "react";
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

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/[0.06] px-3 py-1 text-xs font-extrabold uppercase tracking-[2px] text-[#22c55e]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          Analysis Complete
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          How do you want to
          <br />
          <span className="text-[#29b6f6]">fix your rankings?</span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed text-white/40">
          We found{" "}
          <span className="font-bold text-rose-400">
            {gapCount} keyword gaps
          </span>{" "}
          where{" "}
          <span className="font-bold text-white/60">{competitor}</span> is
          outranking you, costing you an estimated{" "}
          <span className="font-bold text-rose-400">
            {missedTraffic.toLocaleString()} searches/month
          </span>
          . Choose how you want to fix it.
        </p>
      </div>

      {/* Two options */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Option A: AI Implementation (Free, Recommended) */}
        <div className="relative flex flex-col rounded-2xl border-2 border-[#29b6f6]/40 bg-[#16161a] p-8">
          <div className="absolute -top-3 right-6 rounded-full bg-[#29b6f6] px-3 py-1 text-xs font-black text-white shadow-lg shadow-[#29b6f6]/30">
            Recommended
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#29b6f6]/10 text-2xl">
            🤖
          </div>

          <h2 className="mt-5 text-xl font-black text-white">
            Let AI Fix It For You
          </h2>

          <p className="mt-2 text-sm font-medium leading-relaxed text-white/35">
            Connect your Google Business Profile and let our AI implement every
            optimization automatically. We push changes live so you start
            ranking faster.
          </p>

          <ul className="mt-5 space-y-2.5 text-sm text-white/50">
            {[
              "Full keyword gap analysis",
              "AI writes your business description",
              "Auto-publish optimized posts",
              "AI-generated review responses",
              "Q&A entries added automatically",
              "Monthly ranking monitoring",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#29b6f6]/15 text-xs font-bold text-[#29b6f6]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <div className="mb-3 text-center">
              <span className="text-2xl font-black text-[#22c55e]">Free</span>
            </div>
            <button
              onClick={() => setShowConnectModal(true)}
              className="w-full rounded-full bg-[#29b6f6] px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_6px_24px_rgba(41,182,246,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(41,182,246,0.55)]"
            >
              Connect My Google Profile
            </button>
            <p className="mt-2 text-center text-xs font-semibold text-white/20">
              No credit card required
            </p>
          </div>
        </div>

        {/* Option B: DIY PDF ($9.99) */}
        <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-[#16161a] p-8 transition hover:border-white/[0.12]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-2xl">
            📄
          </div>

          <h2 className="mt-5 text-xl font-black text-white">
            DIY Optimization Guide
          </h2>

          <p className="mt-2 text-sm font-medium leading-relaxed text-white/35">
            Download a detailed report with every recommendation, keyword gap,
            and step-by-step instructions to optimize your Google Business
            Profile yourself.
          </p>

          <ul className="mt-5 space-y-2.5 text-sm text-white/50">
            {[
              "Full keyword gap analysis",
              "Competitor comparison breakdown",
              "AI-written optimization checklist",
              "Suggested posts and Q&A entries",
              "Priority action items",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-bold text-white/40">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <div className="mb-3 text-center">
              <span className="text-2xl font-black text-white">$9.99</span>
              <span className="text-sm font-semibold text-white/25"> one-time</span>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full rounded-full border-2 border-white/20 bg-transparent px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:border-white/40 hover:bg-white/[0.04] disabled:opacity-60"
            >
              {downloading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating…
                </span>
              ) : (
                "Download Report"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-6">
        <h3 className="text-sm font-black text-amber-400">
          What happens if you do nothing?
        </h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-amber-400/50">
          {competitor} will continue capturing{" "}
          <strong className="text-amber-400">{missedTraffic.toLocaleString()} searches every month</strong>{" "}
          that could be going to your business. Over 12 months, that&apos;s{" "}
          <strong className="text-amber-400">
            {(missedTraffic * 12).toLocaleString()} potential customers
          </strong>{" "}
          you&apos;ll miss.
        </p>
      </div>

      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-sm font-bold text-white/40 transition hover:bg-white/[0.04] hover:text-white/60"
        >
          ← Back to Report
        </button>
      </div>

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

  const inputCls =
    "mt-1 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white transition focus:outline-none focus:ring-2 focus:ring-[#29b6f6]/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-white/[0.07] bg-[#16161a] p-8 shadow-xl">
        {!submitted ? (
          <>
            <h3 className="text-xl font-black text-white">
              Connect Your Google Profile
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-white/35">
              Enter your email and we&apos;ll notify you as soon as your profile
              connection is ready. We&apos;re currently in early access.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="connect-biz" className="block text-sm font-bold text-white/50">
                  Business Name
                </label>
                <input
                  id="connect-biz"
                  type="text"
                  value={businessName}
                  readOnly
                  className={`${inputCls} text-white/40`}
                />
              </div>

              <div>
                <label htmlFor="connect-email" className="block text-sm font-bold text-white/50">
                  Email Address
                </label>
                <input
                  id="connect-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${inputCls} placeholder-white/20 ${emailError ? "border-rose-500/50" : ""}`}
                  autoFocus
                />
                {emailError && (
                  <p className="mt-1 text-xs font-semibold text-rose-400">{emailError}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#29b6f6] px-4 py-2.5 text-sm font-black text-white transition hover:shadow-lg hover:shadow-[#29b6f6]/30"
                >
                  Join Early Access
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-bold text-white/40 transition hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e]/15 text-2xl">
              ✓
            </div>
            <h3 className="mt-4 text-xl font-black text-white">
              You&apos;re on the list!
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-white/35">
              We&apos;ll be in touch! We&apos;re currently in early access
              — we&apos;ll email you when your profile connection is ready.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-[#29b6f6] px-6 py-2.5 text-sm font-black text-white transition hover:shadow-lg hover:shadow-[#29b6f6]/30"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-white/[0.07] bg-[#16161a] p-8 shadow-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#29b6f6]/15 text-2xl">
          🎉
        </div>
        <h3 className="mt-4 text-xl font-black text-white">
          Beta Access
        </h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-white/35">
          Payment coming soon — download is free during beta!
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onDownload}
            className="flex-1 rounded-full bg-[#29b6f6] px-4 py-2.5 text-sm font-black text-white transition hover:shadow-lg hover:shadow-[#29b6f6]/30"
          >
            Download Free
          </button>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-bold text-white/40 transition hover:bg-white/[0.04]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
