'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, SearchX, Target, TrendingUp, Star, ImageIcon, FileText, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepResultsProps {
  businessData: {
    businessName: string
    city: string
  }
  onNext: () => void
}

export function StepResults({ businessData, onNext }: StepResultsProps) {
  const results = {
    missedSearches: 1847,
    keywordsYoureMissing: 38,
    biggestOpportunity: 'house painters near me',
    yourRating: 4.3,
    yourReviews: 24,
    yourPhotos: 8,
    yourKeywords: 18,
    competitorRating: 4.9,
    competitorReviews: 142,
    competitorPhotos: 56,
    competitorKeywords: 72,
    competitorName: 'Pro Painters Plus',
  }

  const summaryCards = [
    {
      title: 'Missed Searches / Month',
      value: results.missedSearches.toLocaleString(),
      icon: SearchX,
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      shadowColor: 'shadow-red-500/30',
    },
    {
      title: 'Keywords You\'re Missing',
      value: `+${results.keywordsYoureMissing}`,
      icon: Target,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500',
      shadowColor: 'shadow-amber-500/30',
    },
    {
      title: 'Top Opportunity',
      value: results.biggestOpportunity,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary',
      shadowColor: 'shadow-primary/30',
      isKeyword: true,
    },
  ]

  const comparisonMetrics = [
    {
      label: 'Rating',
      icon: Star,
      yours: results.yourRating,
      competitor: results.competitorRating,
      format: (v: number) => v.toFixed(1),
      max: 5,
    },
    {
      label: 'Reviews',
      icon: FileText,
      yours: results.yourReviews,
      competitor: results.competitorReviews,
      format: (v: number) => v.toString(),
      max: Math.max(results.yourReviews, results.competitorReviews),
    },
    {
      label: 'Photos',
      icon: ImageIcon,
      yours: results.yourPhotos,
      competitor: results.competitorPhotos,
      format: (v: number) => v.toString(),
      max: Math.max(results.yourPhotos, results.competitorPhotos),
    },
    {
      label: 'Keywords',
      icon: Target,
      yours: results.yourKeywords,
      competitor: results.competitorKeywords,
      format: (v: number) => `${v}%`,
      max: 100,
    },
  ]

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-5 py-8 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center animate-fade-in-up">
          <Badge variant="destructive" className="gap-2 px-4 py-2 text-sm font-bold shadow-lg shadow-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            Action Required
          </Badge>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl text-balance leading-tight">
            Local painters are capturing searches you&apos;re missing
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          {summaryCards.map((card, index) => (
            <Card
              key={index}
              className={cn(
                'border-2 border-border bg-card animate-fade-in-up opacity-0 shadow-lg',
                `animation-delay-${(index + 1) * 100}`
              )}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn('flex h-14 w-14 items-center justify-center rounded-xl shrink-0 shadow-lg', card.bgColor, card.shadowColor)}>
                  <card.icon className="h-7 w-7 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">{card.title}</p>
                  <p
                    className={cn(
                      'font-black truncate',
                      card.isKeyword ? 'text-lg text-primary' : 'text-3xl text-foreground'
                    )}
                  >
                    {card.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison */}
        <Card className="border-2 border-border bg-card shadow-lg animate-fade-in-up opacity-0 animation-delay-400">
          <CardHeader className="pb-3 px-5 pt-5">
            <CardTitle className="text-base font-black text-center">
              <span className="text-foreground">{businessData.businessName}</span>
              <span className="mx-2 text-muted-foreground font-semibold">vs</span>
              <span className="text-primary">{results.competitorName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5 pt-2">
            {comparisonMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <metric.icon className="h-5 w-5" />
                    {metric.label}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-foreground">You: {metric.format(metric.yours)}</span>
                    <span className="text-primary">Top: {metric.format(metric.competitor)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Progress value={(metric.yours / metric.max) * 100} className="h-2.5 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(metric.competitor / metric.max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA */}
        <Button 
          onClick={onNext} 
          className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/30 animate-fade-in-up opacity-0 animation-delay-500"
        >
          See How to Fix This
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
