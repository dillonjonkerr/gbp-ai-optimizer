'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AIBadge } from '@/components/ai-badge'
import { Search, ArrowRight, MapPinned, Building, CheckCircle2, Sparkles, Star } from 'lucide-react'
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

        <div className="mb-6 p-4 bg-card rounded-2xl border-2 border-border shadow-lg relative overflow-hidden">
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
              <Sparkles className="h-3 w-3" />
              Preview
            </span>
          </div>
          
          <div className="grid grid-cols-5 gap-1 mb-4">
            {[3, 5, 7, 8, 12, 2, 1, 4, 6, 9, 4, 3, 1, 2, 5, 8, 6, 3, 4, 7, 11, 9, 5, 6, 8].map((num, i) => (
              <div
                key={i}
                className={cn(
                  'aspect-square rounded-lg flex items-center justify-center text-xs font-black transition-all',
                  num <= 3 ? 'bg-green-500 text-white' : 
                  num <= 7 ? 'bg-amber-400 text-white' : 
                  'bg-red-400 text-white'
                )}
              >
                {num}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-green-500"></span>
                <span className="font-semibold text-muted-foreground">Top 3</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-amber-400"></span>
                <span className="font-semibold text-muted-foreground">4-7</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-red-400"></span>
                <span className="font-semibold text-muted-foreground">8+</span>
              </span>
            </div>
            <span className="text-xs font-bold text-muted-foreground">Map Pack Rankings</span>
          </div>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="businessName" className="block text-sm font-bold text-foreground mb-1.5">
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
                  className="pl-16 h-14 text-base font-semibold border-2 rounded-xl focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-bold text-foreground mb-1.5">
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
                  className="pl-16 h-14 text-base font-semibold border-2 rounded-xl focus:border-primary focus:ring-primary/20"
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

        <div className="mt-5 p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-xs font-bold shadow-md"
                >
                  {['J', 'M', 'R', 'S', 'T'][i - 1]}
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-foreground ml-1">4.9</span>
              </div>
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Trusted by <span className="text-foreground font-bold">10,000+</span> painting contractors
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm italic text-muted-foreground">
            &ldquo;Found out I was missing 40+ keywords my competitors were ranking for. Fixed it and calls doubled.&rdquo;
          </p>
          <p className="mt-2 text-xs font-bold text-foreground">
            — Mike T., Pro Painters Dallas
          </p>
        </div>
      </div>
    </div>
  )
}
