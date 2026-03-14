'use client'

import { useState } from 'react'
import { Logo } from '@/components/logo'
import { ProgressSteps } from '@/components/funnel/progress-steps'
import { StepBusinessScan } from '@/components/funnel/step-business-scan'
import { StepMarketScan } from '@/components/funnel/step-market-scan'
import { StepResults } from '@/components/funnel/step-results'
import { StepChooseOption } from '@/components/funnel/step-choose-option'
import { useRouter } from 'next/navigation'

type FunnelStep = 1 | 2 | 3 | 4

interface BusinessData {
  businessName: string
  city: string
}

export default function FunnelPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FunnelStep>(1)
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)

  const handleStep1Complete = (data: BusinessData) => {
    setBusinessData(data)
    setCurrentStep(2)
  }

  const handleStep2Complete = () => {
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-16 items-center justify-between px-5 sm:h-[72px] sm:px-6">
          <Logo size="md" />
          <ProgressSteps currentStep={currentStep} totalSteps={4} />
        </div>
      </header>

      {/* Main content */}
      <main>
        {currentStep === 1 && <StepBusinessScan onNext={handleStep1Complete} />}
        {currentStep === 2 && businessData && (
          <StepMarketScan businessData={businessData} onComplete={handleStep2Complete} />
        )}
        {currentStep === 3 && businessData && (
          <StepResults businessData={businessData} onNext={handleStep3Complete} />
        )}
        {currentStep === 4 && (
          <StepChooseOption onSelectDIY={handleSelectDIY} onSelectAI={handleSelectAI} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-background py-6">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <p className="text-sm font-semibold text-muted-foreground">
            Paint &amp; Profits - Marketing for Painters
          </p>
        </div>
      </footer>
    </div>
  )
}
