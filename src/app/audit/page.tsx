"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BusinessInfo, AuditResult } from "@/lib/types";
import StepProgress from "@/components/audit/StepProgress";
import StepBusinessInfo from "@/components/audit/StepBusinessInfo";
import StepMarketScan from "@/components/audit/StepMarketScan";
import StepConvert from "@/components/audit/StepConvert";
import AuditLoading from "@/components/audit/AuditLoading";

const STEPS = [
  { label: "Scan" },
  { label: "Results" },
  { label: "Fix It" },
];

export default function AuditPage() {
  const [step, setStep] = useState(0);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "",
    city: "",
    industry: "",
  });
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAudit(info: BusinessInfo) {
    setBusinessInfo(info);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/gbp-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Audit failed");
      }

      const data: AuditResult = await res.json();
      setAuditResult(data);
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header for funnel */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/brand/icon.png"
              alt="GBP AI Optimizer"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="text-base font-semibold tracking-tight text-foreground">
              GBP AI Optimizer
            </span>
          </Link>
          <StepProgress steps={STEPS} current={step} />
        </div>
      </header>

      {/* Main funnel content - centered */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        {step === 0 && !loading && (
          <StepBusinessInfo
            initial={businessInfo}
            loading={loading}
            error={error}
            onSubmit={runAudit}
          />
        )}
        {step === 0 && loading && (
          <AuditLoading
            businessName={businessInfo.businessName}
            city={businessInfo.city}
            industry={businessInfo.industry}
          />
        )}
        {step === 1 && auditResult && (
          <StepMarketScan
            data={auditResult.marketScan}
            comparison={auditResult.comparison}
            businessName={businessInfo.businessName}
            city={businessInfo.city}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && auditResult && (
          <StepConvert
            result={auditResult}
            businessInfo={businessInfo}
            onBack={() => setStep(1)}
          />
        )}
      </main>
    </div>
  );
}
