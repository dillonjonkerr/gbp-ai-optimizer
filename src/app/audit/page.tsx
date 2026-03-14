"use client";

import { useState } from "react";
import type { BusinessInfo, AuditResult } from "@/lib/types";
import { Logo } from "@/components/logo";
import StepProgress from "@/components/audit/StepProgress";
import StepBusinessInfo from "@/components/audit/StepBusinessInfo";
import StepMarketScan from "@/components/audit/StepMarketScan";
import StepConvert from "@/components/audit/StepConvert";
import AuditLoading from "@/components/audit/AuditLoading";

const STEPS = [
  { label: "Business Info" },
  { label: "Gap Analysis" },
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
      <header className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:h-[72px] sm:px-6">
          <Logo size="md" />
          <StepProgress steps={STEPS} current={step} />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
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
