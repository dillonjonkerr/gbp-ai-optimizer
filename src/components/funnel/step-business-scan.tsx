'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AIBadge } from '@/components/ai-badge'
import { FacebookTestimonialCarousel } from '@/components/facebook-testimonial-carousel'
import { Search, ArrowRight, MapPinned, Building, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-lg flex-1 flex flex-col justify-center">
        
        {/* Hero Section */}
        <div className="space-y-4 text-center mb-6">
          <AIBadge className="mx-auto animate-scale-in" />
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl text-balance leading-[1.1]">
            See where you rank on{' '}
            <span className="text-primary">Google Maps</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-medium max-w-sm mx-auto">
            Get a free local visibility report for your painting business in 30 seconds
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex justify-center gap-6 mb-6 text-center">
          <div>
            <div className="text-2xl font-black text-foreground sm:text-3xl">70%</div>
            <div className="text-xs font-semibold text-muted-foreground">of clicks go to<br/>Map Pack</div>
          </div>
          <div className="w-px bg-border"></div>
          <div>
            <div className="text-2xl font-black text-foreground sm:text-3xl">88%</div>
            <div className="text-xs font-semibold text-muted-foreground">call or visit<br/>within 24hrs</div>
          </div>
          <div className="w-px bg-border"></div>
          <div>
            <div className="text-2xl font-black text-primary sm:text-3xl">3x</div>
            <div className="text-xs font-semibold text-muted-foreground">more leads with<br/>optimized GBP</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-1.5">
              <label htmlFor="businessName" className="text-sm font-bold text-foreground">
                Your Painting Company
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                  <Building className="h-4 w-4" />
                </div>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="e.g. ABC Painting Co."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-16 h-14 text-base font-semibold border-2 rounded-xl focus-visible:border-primary focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <label htmlFor="city" className="text-sm font-bold text-foreground">
                City / Service Area
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                  <MapPinned className="h-4 w-4" />
                </div>
                <Input
                  id="city"
                  type="text"
                  placeholder="e.g. Dallas, TX"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-16 h-14 text-base font-semibold border-2 rounded-xl focus-visible:border-primary focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className={cn(
              'w-full h-14 text-lg font-black rounded-xl transition-all duration-300 shadow-lg',
              isValid && 'shadow-xl shadow-primary/40 animate-pulse-glow'
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
        <div className="flex flex-wrap items-center justify-center gap-4 pt-5 text-sm font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Free forever
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            No signup
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            30 sec results
          </span>
        </div>

        {/* Facebook Testimonials Carousel */}
        <div className="mt-6 -mx-4 sm:-mx-6">
          <FacebookTestimonialCarousel />
        </div>
      </div>
    </div>
  )
}
