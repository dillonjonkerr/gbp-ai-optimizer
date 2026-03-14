'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AIBadge } from '@/components/ai-badge'
import { Search, ArrowRight, MapPinned, Building } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

interface StepBusinessScanProps {
  onNext: (data: { businessName: string; city: string }) => void
}

export function StepBusinessScan({ onNext }: StepBusinessScanProps) {
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [isHovering, setIsHovering] = useState(false)

  const isValid = businessName.trim() && city.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext({ businessName, city })
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-5 py-8 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="space-y-4 text-center mb-10">
          <AIBadge className="mx-auto animate-scale-in" />
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl text-balance leading-tight">
            See how your painting business ranks locally
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-medium">
            Free instant scan of your Google Business Profile
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="businessName" className="text-sm font-bold text-foreground">
                Your Painting Company
              </FieldLabel>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="e.g. ABC Painting Co."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-[72px] h-14 text-base font-medium border-2 focus:border-primary"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="city" className="text-sm font-bold text-foreground">
                City / Service Area
              </FieldLabel>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <MapPinned className="h-5 w-5 text-primary" />
                </div>
                <Input
                  id="city"
                  type="text"
                  placeholder="e.g. Dallas, TX"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-[72px] h-14 text-base font-medium border-2 focus:border-primary"
                />
              </div>
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            disabled={!isValid}
            className={cn(
              'w-full h-14 text-lg font-bold rounded-xl transition-all duration-300',
              isValid && 'shadow-xl shadow-primary/30 animate-pulse-glow'
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Search className={cn('mr-2 h-5 w-5', isHovering && isValid && 'animate-pulse')} />
            Scan My Business
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-8 text-sm font-semibold text-muted-foreground">
          <span className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            Free to use
          </span>
          <span className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            No signup
          </span>
          <span className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            30 sec results
          </span>
        </div>
      </div>
    </div>
  )
}
