'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, SearchX, Target, TrendingUp, Star, AlertTriangle, Trophy, Zap } from 'lucide-react'
import { ImageIcon } from 'lucide-react'

interface StepResultsProps {
  businessData: {
    businessName: string
    city: string
  }
  onNext: () => void
}

export function StepResults({ businessData, onNext }: StepResultsProps) {
  const results = {
    visibilityScore: 32,
    missedSearches: 1847,
    competitorKeywords: 38,
    biggestOpportunity: 'house painters near me',
    yourRating: 4.3,
    yourReviews: 24,
    yourPhotos: 8,
    yourKeywords: 18,
    competitorRating: 4.9,
    competitorReviews: 142,
    competitorPhotos: 56,
    keywordsYoureMissing: 72,
    competitorName: 'Pro Painters Plus',
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-lg space-y-5">
        
        {/* Header */}
        <div className="space-y-3 text-center animate-fade-in-up">
          <Badge variant="destructive" className="gap-2 px-4 py-2 text-sm font-bold shadow-lg shadow-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            Low Visibility Detected
          </Badge>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl text-balance leading-tight">
            Your competitors are capturing <span className="text-destructive">1,847</span> searches you&apos;re missing
          </h1>
        </div>

        {/* SoLV Score */}
        <Card className="border-2 border-border bg-card shadow-lg animate-fade-in-up">
          <CardContent className="p-5">
            <div className="flex items-center gap-5">
              <div className="relative h-24 w-24 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-muted"
                  />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${results.visibilityScore * 2.64} 264`}
                    strokeLinecap="round"
                    className="text-red-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-foreground">{results.visibilityScore}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">SoLV</span>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-black text-foreground mb-1">Share of Local Voice</h3>
                <p className="text-sm text-muted-foreground font-medium mb-3">
                  You&apos;re visible in only <span className="text-destructive font-bold">32%</span> of searches in your area
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">Goal: 80%+</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Issues */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in-up animation-delay-200">
          <Card className="border-2 border-border bg-card shadow-md">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/30">
                <SearchX className="h-6 w-6" />
              </div>
              <div className="text-2xl font-black text-foreground">{results.missedSearches.toLocaleString()}</div>
              <div className="text-xs font-semibold text-muted-foreground">Missed searches/mo</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border bg-card shadow-md">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                <Target className="h-6 w-6" />
              </div>
              <div className="text-2xl font-black text-foreground">+{results.competitorKeywords}</div>
              <div className="text-xs font-semibold text-muted-foreground">Missing keywords</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Opportunity */}
        <Card className="border-2 border-primary/30 bg-primary/5 shadow-md animate-fade-in-up animation-delay-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">Top Opportunity</p>
                <p className="text-lg font-black text-foreground">&ldquo;{results.biggestOpportunity}&rdquo;</p>
                <p className="text-xs text-muted-foreground font-medium">480 monthly searches - You&apos;re not ranking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Comparison */}
        <Card className="border-2 border-border bg-card shadow-lg animate-fade-in-up animation-delay-400">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              vs Top Local Competitor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-sm font-bold text-muted-foreground">{businessData.businessName}</span>
              <span className="text-sm font-bold text-primary">{results.competitorName}</span>
            </div>
            
            {[
              { label: 'Reviews', yours: results.yourReviews, theirs: results.competitorReviews, icon: Star },
              { label: 'Photos', yours: results.yourPhotos, theirs: results.competitorPhotos, icon: ImageIcon },
              { label: 'Keywords', yours: results.yourKeywords, theirs: results.keywordsYoureMissing, icon: Target },
            ].map((metric, i) => (
              <div key={i} className="flex items-center gap-3">
                <metric.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-red-500">{metric.yours}</span>
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="text-green-500">{metric.theirs}</span>
                  </div>
                  <div className="flex h-1.5 gap-1">
                    <div className="flex-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${(metric.yours / Math.max(metric.yours, metric.theirs)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${(metric.theirs / Math.max(metric.yours, metric.theirs)) * 100}%` }}
                      ></div>
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
          className="w-full h-14 text-lg font-black rounded-xl shadow-xl shadow-primary/40 animate-pulse-glow animate-fade-in-up animation-delay-500"
        >
          <Zap className="mr-2 h-5 w-5" />
          See How to Fix This
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Urgency */}
        <p className="text-center text-xs font-semibold text-muted-foreground animate-fade-in-up animation-delay-500">
          Your competitors are getting these leads <span className="text-destructive">right now</span>
        </p>
      </div>
    </div>
  )
}
