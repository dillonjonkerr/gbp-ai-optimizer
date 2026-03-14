'use client'

import { useEffect, useState, useCallback } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Loader2, MapPinned, Users, Search, Target, Building, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepMarketScanProps {
  businessData: {
    businessName: string
    city: string
  }
  onComplete: () => void
}

const discoveries = [
  { text: 'Business profile found', icon: Building, delay: 600 },
  { text: 'Analyzing 25 local competitors', icon: Users, delay: 1400 },
  { text: 'Scanning 150+ keywords', icon: Search, delay: 2200 },
  { text: 'Mapping visibility zones', icon: MapPinned, delay: 3000 },
  { text: 'Finding ranking opportunities', icon: Target, delay: 3800 },
  { text: 'Generating AI recommendations', icon: Sparkles, delay: 4600 },
]

export function StepMarketScan({ businessData, onComplete }: StepMarketScanProps) {
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [currentStat, setCurrentStat] = useState(0)

  const stableOnComplete = useCallback(onComplete, [onComplete])

  const liveStats = [
    { label: 'Competitors analyzed', value: 25 },
    { label: 'Keywords scanned', value: 156 },
    { label: 'Grid points checked', value: 49 },
    { label: 'Data points processed', value: 1247 },
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1.8
      })
    }, 90)

    discoveries.forEach((_, index) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index])
      }, discoveries[index].delay)
    })

    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % liveStats.length)
    }, 1200)

    const completeTimeout = setTimeout(() => {
      stableOnComplete()
    }, 5500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(statInterval)
      clearTimeout(completeTimeout)
    }
  }, [stableOnComplete, liveStats.length])

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center">
        
        {/* Animated Scanner Icon */}
        <div className="text-center mb-6">
          <div className="relative mx-auto h-24 w-24">
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

        {/* Header */}
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            AI scanning your market
          </h1>
          <p className="text-muted-foreground font-semibold">
            Analyzing the {businessData.city} painting market
          </p>
        </div>

        {/* Live Stats Counter */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6 text-center">
          <div className="text-3xl font-black text-primary mb-1 transition-all">
            {liveStats[currentStat].value.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-muted-foreground">
            {liveStats[currentStat].label}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 mb-6">
          <Progress value={progress} className="h-3 rounded-full" />
          <div className="flex justify-between text-sm font-bold">
            <span className="text-muted-foreground">Scanning...</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Discoveries */}
        <div className="space-y-2 mb-6">
          {discoveries.map((discovery, index) => {
            const isCompleted = completedSteps.includes(index)
            const Icon = discovery.icon

            return (
              <div
                key={index}
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

        {/* Business card */}
        <Card className="border-2 border-border bg-card shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-foreground truncate">{businessData.businessName}</h3>
                <p className="text-xs font-semibold text-muted-foreground truncate">{businessData.city} - Painting Contractor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
