'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Loader2, MapPinned, Star, ImageIcon, Search, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepMarketScanProps {
  businessData: {
    businessName: string
    city: string
  }
  onComplete: () => void
}

const discoveries = [
  { text: 'Painting business located', icon: MapPinned, delay: 800 },
  { text: 'Local competitors found', icon: Search, delay: 1600 },
  { text: 'Review data analyzed', icon: Star, delay: 2400 },
  { text: 'Ranking gaps identified', icon: TrendingUp, delay: 3200 },
  { text: 'Keyword opportunities discovered', icon: ImageIcon, delay: 4000 },
]

export function StepMarketScan({ businessData, onComplete }: StepMarketScanProps) {
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    discoveries.forEach((_, index) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index])
      }, discoveries[index].delay)
    })

    const completeTimeout = setTimeout(() => {
      onComplete()
    }, 5000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-5 py-8 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="space-y-4 text-center mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30">
            <Loader2 className="h-10 w-10 text-primary-foreground animate-spin" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Scanning local painting market...
          </h1>
        </div>

        {/* Progress bar */}
        <div className="space-y-3 mb-8">
          <Progress value={progress} className="h-3 rounded-full" />
          <p className="text-center text-base font-bold text-primary">{progress}% complete</p>
        </div>

        {/* Discoveries */}
        <div className="space-y-3 mb-8">
          {discoveries.map((discovery, index) => {
            const isCompleted = completedSteps.includes(index)
            const Icon = discovery.icon

            return (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-4 rounded-xl border-2 bg-card p-4 transition-all duration-500',
                  isCompleted ? 'opacity-100 border-primary shadow-lg shadow-primary/10' : 'opacity-40 border-border'
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 shrink-0',
                    isCompleted ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                </div>
                <span className={cn('text-base font-bold', isCompleted ? 'text-foreground' : 'text-muted-foreground')}>
                  {discovery.text}
                </span>
              </div>
            )
          })}
        </div>

        {/* Business card */}
        <Card className="border-2 border-border bg-muted/50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <MapPinned className="h-7 w-7 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-foreground text-lg truncate">{businessData.businessName}</h3>
                <p className="text-sm font-semibold text-muted-foreground truncate">{businessData.city} - Painting Contractor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
