'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ProgressStepsProps {
  currentStep: number
  totalSteps: number
}

export function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep

        return (
          <div key={stepNumber} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300',
                isCompleted && 'bg-primary text-primary-foreground shadow-lg shadow-primary/30',
                isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg shadow-primary/30',
                !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  'h-1 w-6 rounded-full transition-all duration-300',
                  stepNumber < currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
