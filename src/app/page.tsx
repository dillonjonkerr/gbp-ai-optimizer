'use client'

/* =============================================================
   MAIN FUNNEL PAGE — Orchestrates the 4-step conversion funnel
   
   STEP 1: Business Info    → User enters business name, city, website
   STEP 2: Market Scan      → AI scans and analyzes the business
   STEP 3: Results           → Shows gaps, competitor comparison, opportunities
   STEP 4: Choose Option     → DIY PDF or AI Optimization
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


/* ── TYPES ── */

type FunnelStep = 1 | 2 | 3 | 4

interface BusinessData {
  businessName: string
  city: string
  website: string
}


/* ── PAGE COMPONENT ── */

export default function FunnelPage() {
  const router = useRouter()

  // Current step in the funnel (1-4)
  const [currentStep, setCurrentStep] = useState<FunnelStep>(1)

  // Data collected from the user in Step 1
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)

  // Full audit result returned from the API in Step 2
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)

  // Toggle for visible QA debug overlay
  const [qaMode, setQaMode] = useState(false)


  /* ── STEP HANDLERS ── */

  // Step 1 → Step 2: User submitted business info
  const handleStep1Complete = (data: BusinessData) => {
    setBusinessData(data)
    setCurrentStep(2)
  }

  // Step 2 → Step 3: API returned audit results
  const handleStep2Complete = (result: AuditResult) => {
    setAuditResult(result)
    setCurrentStep(3)
  }

  // Step 3 → Step 4: User clicked "Show Me How to Fix This"
  const handleStep3Complete = () => {
    setCurrentStep(4)
  }

  // Step 4: User chose DIY PDF
  const handleSelectDIY = () => {
    alert('Your painting business audit report is being generated.')
  }

  // Step 4: User chose AI Optimization
  const handleSelectAI = () => {
    router.push('/dashboard')
  }


  /* ── DERIVED DATA ── */

  const missedSearches = auditResult?.marketScan.estimatedMissedTraffic ?? 0


  /* ── RENDER ── */

  return (
    <div data-id="PG" className={`min-h-screen bg-background ${qaMode ? 'qa-debug' : ''}`}>

      {/* ── HEADER ── */}
      <header data-id="HD" className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div data-id="HI" className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
          <Logo size="sm" />
          <ProgressSteps currentStep={currentStep} totalSteps={4} />
        </div>
      </header>

      {/* ── MAIN CONTENT — renders the active step ── */}
      <main data-id="MN">
        {currentStep === 1 && (
          <StepBusinessScan onNext={handleStep1Complete} />
        )}

        {currentStep === 2 && businessData && (
          <StepMarketScan
            businessData={businessData}
            onComplete={handleStep2Complete}
          />
        )}

        {currentStep === 3 && businessData && auditResult && (
          <StepResults
            businessData={businessData}
            auditResult={auditResult}
            onNext={handleStep3Complete}
          />
        )}

        {currentStep === 4 && (
          <StepChooseOption
            onSelectDIY={handleSelectDIY}
            onSelectAI={handleSelectAI}
            missedSearches={missedSearches}
          />
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer data-id="FT" className="border-t border-border bg-background py-5">
        <div data-id="FC" className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p data-id="FP" className="text-xs font-medium text-muted-foreground">
            Paint &amp; Profits &middot; AI-Powered Marketing for Painters
          </p>
        </div>
      </footer>

      {/* ── QA TOGGLE BUTTON (bottom-right corner) ── */}
      <button
        onClick={() => setQaMode(prev => !prev)}
        className="fixed bottom-4 right-4 z-[9999] rounded-full px-3 py-1.5 text-xs font-bold shadow-lg"
        style={{ background: qaMode ? '#ff0064' : '#222', color: '#fff' }}
      >
        {qaMode ? 'QA ON' : 'QA'}
      </button>
    </div>
  )
}
