'use client'

import { useEffect, useState, useRef } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckCircle, Loader2, MapPinned, Users, Search, Target,
  Building, Sparkles, AlertCircle, TrendingDown, Star,
  Eye, BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AuditResult } from '@/lib/types'

interface StepMarketScanProps {
  businessData: {
    businessName: string
    city: string
  }
  onComplete: (result: AuditResult) => void
}

interface Discovery {
  text: string
  detail: string
  icon: typeof Building
  delay: number
  type: 'neutral' | 'warning' | 'danger'
}

const baseDiscoveries: Discovery[] = [
  { text: 'Business profile located', detail: 'Pulling Google data...', icon: Building, delay: 1200, type: 'neutral' },
  { text: 'Scanning local competitors', detail: 'Analyzing top-ranked profiles...', icon: Users, delay: 3500, type: 'neutral' },
  { text: 'Rating gap detected', detail: 'Your competitor has more reviews', icon: Star, delay: 6000, type: 'warning' },
  { text: 'Keyword opportunities found', detail: 'High-intent searches you\'re missing', icon: Search, delay: 8500, type: 'danger' },
  { text: 'Visibility zones mapped', detail: 'Checking map pack rankings...', icon: Eye, delay: 11000, type: 'neutral' },
  { text: 'Ranking gaps identified', detail: 'Competitors outrank you for key terms', icon: TrendingDown, delay: 13500, type: 'danger' },
  { text: 'Building your fix plan', detail: 'AI generating recommendations...', icon: Sparkles, delay: 16000, type: 'neutral' },
]

export function StepMarketScan({ businessData, onComplete }: StepMarketScanProps) {
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [apiDone, setApiDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<AuditResult | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    async function runAudit() {
      try {
        const res = await fetch('/api/gbp-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: businessData.businessName,
            city: businessData.city,
            industry: 'Painter',
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.error || `Audit failed (${res.status})`)
        }

        const data: AuditResult = await res.json()
        resultRef.current = data
        setApiDone(true)
      } catch (err) {
        console.error('[StepMarketScan] API error:', err)
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }

    runAudit()
  }, [businessData])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (apiDone && prev >= 98) {
          clearInterval(progressInterval)
          return 100
        }
        if (prev >= 90 && !apiDone) return 90
        return prev + 0.5
      })
    }, 100)

    baseDiscoveries.forEach((_, index) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index])
      }, baseDiscoveries[index].delay)
    })

    return () => {
      clearInterval(progressInterval)
    }
  }, [apiDone])

  useEffect(() => {
    if (progress >= 100 && apiDone && resultRef.current) {
      const timer = setTimeout(() => {
        onComplete(resultRef.current!)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [progress, apiDone, onComplete])

  if (error) {
    return (
      <div data-id="ER" className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 py-6 sm:min-h-[calc(100vh-64px)]">
        <div data-id="EW" className="mx-auto w-full max-w-md text-center space-y-4">
          <div data-id="EI" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 data-id="ET" className="text-xl font-black text-foreground">Scan Failed</h2>
          <p data-id="EM" className="text-sm text-muted-foreground font-medium">{error}</p>
          <Button
            data-id="EB"
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-2 font-bold"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const latestCompleted = completedSteps.length > 0 ? completedSteps[completedSteps.length - 1] : -1

  return (
    <div data-id="S2" className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-10">
      <div data-id="MW" className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center">
        
        {/* Scanning animation */}
        <div data-id="SI" className="text-center mb-6">
          <div data-id="SP" className="relative mx-auto h-20 w-20 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-2 rounded-full border-4 border-primary/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/40">
                <Search className="h-7 w-7 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <h1 data-id="MT" className="text-xl font-black tracking-tight text-foreground sm:text-2xl mb-1">
            AI investigating your market
          </h1>
          <p data-id="MS" className="text-sm text-muted-foreground font-medium">
            Scanning every painting contractor in {businessData.city}
          </p>
        </div>

        {/* Progress bar */}
        <div data-id="PB" className="space-y-2 mb-6">
          <Progress value={progress} className="h-2.5 rounded-full" />
          <div data-id="PL" className="flex justify-between text-xs font-bold">
            <span className="text-muted-foreground">
              {progress >= 90 && !apiDone ? 'Finalizing report...' : 'Scanning...'}
            </span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Discovery feed — progressive disclosure (Zeigarnik effect) */}
        <div data-id="DL" className="space-y-2 mb-6">
          {baseDiscoveries.map((discovery, index) => {
            const isCompleted = completedSteps.includes(index)
            const isLatest = index === latestCompleted
            const Icon = discovery.icon

            const typeColors = {
              neutral: { bg: 'bg-primary', border: 'border-primary/40', text: 'text-primary' },
              warning: { bg: 'bg-amber-500', border: 'border-amber-500/40', text: 'text-amber-600' },
              danger: { bg: 'bg-red-500', border: 'border-red-500/40', text: 'text-red-600' },
            }

            const colors = typeColors[discovery.type]

            return (
              <div
                key={index}
                data-id={`D${index}`}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500',
                  isCompleted
                    ? `opacity-100 ${colors.border} bg-card shadow-sm`
                    : 'opacity-20 border-border bg-card'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 shrink-0',
                    isCompleted ? `${colors.bg} text-white shadow-md` : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className={cn(
                    'text-sm font-bold transition-colors block',
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {discovery.text}
                  </span>
                  {isCompleted && (
                    <span className={cn('text-xs font-medium', colors.text)}>
                      {discovery.detail}
                    </span>
                  )}
                </div>
                {isCompleted && (
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                )}
                {isLatest && (
                  <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                )}
              </div>
            )
          })}
        </div>

        {/* Business card — commitment anchor */}
        <Card data-id="BC" className="border-2 border-border bg-card shadow-md">
          <CardContent data-id="BD" className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 data-id="BB" className="font-bold text-foreground truncate">{businessData.businessName}</h3>
                <p data-id="BL" className="text-xs font-semibold text-muted-foreground truncate">{businessData.city} &middot; Painting Contractor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
