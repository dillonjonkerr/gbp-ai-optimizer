'use client'

import { useEffect, useState, useRef } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Loader2, MapPinned, Users, Search, Target, Building, Sparkles, AlertCircle } from 'lucide-react'
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

const discoverySteps = [
  { text: 'Detecting business profile', icon: Building, delay: 800 },
  { text: 'Analyzing local competitors', icon: Users, delay: 3000 },
  { text: 'Scanning keyword opportunities', icon: Search, delay: 6000 },
  { text: 'Mapping visibility zones', icon: MapPinned, delay: 9000 },
  { text: 'Finding ranking gaps', icon: Target, delay: 12000 },
  { text: 'Generating AI recommendations', icon: Sparkles, delay: 15000 },
]

export function StepMarketScan({ businessData, onComplete }: StepMarketScanProps) {
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [currentStat, setCurrentStat] = useState(0)
  const [apiDone, setApiDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<AuditResult | null>(null)
  const hasFetched = useRef(false)

  const liveStats = [
    { label: 'Competitors analyzed', value: 25 },
    { label: 'Keywords scanned', value: 156 },
    { label: 'Grid points checked', value: 49 },
    { label: 'Data points processed', value: 1247 },
  ]

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

    discoverySteps.forEach((_, index) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index])
      }, discoverySteps[index].delay)
    })

    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % liveStats.length)
    }, 1200)

    return () => {
      clearInterval(progressInterval)
      clearInterval(statInterval)
    }
  }, [apiDone, liveStats.length])

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

  return (
    <div data-id="S2" className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-10">
      <div data-id="MW" className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center">
        
        <div data-id="SI" className="text-center mb-6">
          <div data-id="SP" className="relative mx-auto h-24 w-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-ping animation-delay-200"></div>
            <div className="absolute inset-4 rounded-full border-4 border-primary/50 animate-ping animation-delay-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/40">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            </div>
          </div>
        </div>

        <div data-id="MH" className="space-y-2 text-center mb-6">
          <h1 data-id="MT" className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            AI scanning your market
          </h1>
          <p data-id="MS" className="text-muted-foreground font-semibold">
            Analyzing the {businessData.city} painting market
          </p>
        </div>

        <div data-id="LS" className="bg-muted/50 rounded-xl p-4 mb-6 text-center">
          <div data-id="LV" className="text-3xl font-black text-primary mb-1 transition-all">
            {liveStats[currentStat].value.toLocaleString()}
          </div>
          <div data-id="LL" className="text-sm font-semibold text-muted-foreground">
            {liveStats[currentStat].label}
          </div>
        </div>

        <div data-id="PB" className="space-y-2 mb-6">
          <Progress value={progress} className="h-3 rounded-full" />
          <div data-id="PL" className="flex justify-between text-sm font-bold">
            <span className="text-muted-foreground">
              {progress >= 90 && !apiDone ? 'Finalizing...' : 'Scanning...'}
            </span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
        </div>

        <div data-id="DL" className="space-y-2 mb-6">
          {discoverySteps.map((discovery, index) => {
            const isCompleted = completedSteps.includes(index)
            const Icon = discovery.icon

            return (
              <div
                key={index}
                data-id={`D${index}`}
                className={cn(
                  'flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-all duration-300',
                  isCompleted 
                    ? 'opacity-100 border-primary/50 shadow-md' 
                    : 'opacity-30 border-border'
                )}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 shrink-0',
                    isCompleted 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={cn(
                  'text-sm font-bold transition-colors',
                  isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {discovery.text}
                </span>
                {isCompleted && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto shrink-0" />
                )}
              </div>
            )
          })}
        </div>

        <Card data-id="BC" className="border-2 border-border bg-card shadow-md">
          <CardContent data-id="BD" className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 data-id="BB" className="font-bold text-foreground truncate">{businessData.businessName}</h3>
                <p data-id="BL" className="text-xs font-semibold text-muted-foreground truncate">{businessData.city} - Painting Contractor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
