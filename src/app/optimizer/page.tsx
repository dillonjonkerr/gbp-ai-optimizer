'use client'

/* =============================================================
   /optimizer — Alternate funnel page (same flow as /)
   ============================================================= */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/logo'
import { ProgressSteps } from '@/components/funnel/progress-steps'
import { StepBusinessScan } from '@/components/funnel/step-business-scan'
import { StepMarketScan } from '@/components/funnel/step-market-scan'
import { StepResults } from '@/components/funnel/step-results'
import { StepChooseOption } from '@/components/funnel/step-choose-option'
import type { AuditResult } from '@/lib/types'

type FunnelStep = 1 | 2 | 3 | 4

interface BusinessData {
  businessName: string
  city: string
  website: string
}

export default function OptimizerFunnelPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FunnelStep>(1)
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)

  const handleStep1Complete = (data: BusinessData) => {
    setBusinessData(data)
    setCurrentStep(2)
  }

  const handleStep2Complete = (result: AuditResult) => {
    setAuditResult(result)
    setCurrentStep(3)
  }

  const handleStep3Complete = () => {
    setCurrentStep(4)
  }

  const handleSelectDIY = () => {
    alert('Your painting business audit report is being generated.')
  }

  const handleSelectAI = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
          <Logo size="sm" />
          <ProgressSteps currentStep={currentStep} totalSteps={4} />
        </div>
      </header>

      <main>
        {currentStep === 1 && (
          <StepBusinessScan onNext={handleStep1Complete} />
        )}
        {currentStep === 2 && businessData && (
          <StepMarketScan businessData={businessData} onComplete={handleStep2Complete} />
        )}
        {currentStep === 3 && businessData && auditResult && (
          <StepResults businessData={businessData} auditResult={auditResult} onNext={handleStep3Complete} />
        )}
        {currentStep === 4 && (
          <StepChooseOption
            onSelectDIY={handleSelectDIY}
            onSelectAI={handleSelectAI}
            missedSearches={auditResult?.marketScan.estimatedMissedTraffic ?? 0}
          />
        )}
      </main>
    </div>
  )
}
