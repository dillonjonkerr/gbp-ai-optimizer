'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight, SearchX, Target, TrendingUp, Star, AlertTriangle,
  Trophy, Zap, ImageIcon, DollarSign, TrendingDown, Eye, Sparkles
} from 'lucide-react'
import type { AuditResult } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StepResultsProps {
  businessData: {
    businessName: string
    city: string
  }
  auditResult: AuditResult
  onNext: () => void
}

export function StepResults({ businessData, auditResult, onNext }: StepResultsProps) {
  const { marketScan, comparison } = auditResult

  const missedSearches = marketScan.estimatedMissedTraffic
  const missingKeywords = marketScan.keywords.filter(k => !k.yourRank || k.yourRank > 10).length
  const totalKeywords = marketScan.keywords.length

  const biggestOpportunity = marketScan.keywords
    .sort((a, b) => b.trafficOpportunity - a.trafficOpportunity)[0]

  const visibilityScore = comparison.score
  const scoreColor = visibilityScore <= 40 ? 'text-red-500' : visibilityScore <= 65 ? 'text-amber-500' : 'text-green-500'
  const scoreBg = visibilityScore <= 40 ? 'bg-red-500' : visibilityScore <= 65 ? 'bg-amber-500' : 'bg-green-500'
  const scoreLabel = visibilityScore <= 40 ? 'Poor' : visibilityScore <= 65 ? 'Below Average' : 'Good'

  const you = marketScan.yourProfile
  const comp = marketScan.competitorProfile
  const compName = marketScan.primaryCompetitorName

  const estimatedMonthlyValue = Math.round(missedSearches * 0.08 * 3500)

  return (
    <div data-id="S3" className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-8">
      <div data-id="RW" className="mx-auto w-full max-w-lg space-y-4">
        
        {/* Shock headline — Schwartz: make the problem undeniable */}
        <div data-id="RH" className="space-y-3 text-center animate-fade-in-up">
          <Badge data-id="RB" variant="destructive" className="gap-2 px-4 py-2 text-sm font-bold shadow-lg shadow-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            Ranking Gaps Found
          </Badge>
          <h1 data-id="RT" className="text-2xl font-black tracking-tight text-foreground sm:text-[1.75rem] text-balance leading-tight">
            You&apos;re invisible for{' '}
            <span className="text-destructive">{missingKeywords} of {totalKeywords}</span>{' '}
            keywords homeowners search to find painters
          </h1>
          <p data-id="RS" className="text-sm text-muted-foreground font-medium">
            That&apos;s an estimated{' '}
            <span className="font-black text-foreground">{missedSearches.toLocaleString()} missed searches</span>{' '}
            per month going directly to your competitors.
          </p>
        </div>

        {/* Dollar value anchor — Hormozi: make the cost of inaction clear */}
        <Card data-id="DV" className="border-2 border-red-200 bg-red-50 shadow-md animate-fade-in-up animation-delay-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/30 shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Estimated monthly revenue you&apos;re losing</p>
                <p className="text-2xl font-black text-red-600">${estimatedMonthlyValue.toLocaleString()}/mo</p>
                <p className="text-[11px] text-red-600/80 font-medium">
                  Based on {missedSearches.toLocaleString()} missed searches × 8% conversion × avg painting job
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visibility Score — the "grade" */}
        <Card data-id="VS" className="border-2 border-border bg-card shadow-lg animate-fade-in-up animation-delay-200">
          <CardContent data-id="VC" className="p-5">
            <div className="flex items-center gap-5">
              <div data-id="VR" className="relative h-24 w-24 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray={`${visibilityScore * 2.64} 264`} strokeLinecap="round" className={scoreColor} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span data-id="VN" className="text-3xl font-black text-foreground">{visibilityScore}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{scoreLabel}</span>
                </div>
              </div>
              
              <div data-id="VD" className="flex-1">
                <h3 data-id="VT" className="text-lg font-black text-foreground mb-1">Your Visibility Score</h3>
                <p data-id="VP" className="text-sm text-muted-foreground font-medium mb-3">
                  {visibilityScore <= 50
                    ? 'Most homeowners searching for painters in your area will never see your business.'
                    : 'You have room to grow. Your top competitor is capturing searches you could win.'}
                </p>
                <div data-id="VB" className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${scoreBg} rounded-full animate-bar-fill`} style={{ width: `${visibilityScore}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">Goal: 80+</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Head-to-head competitor comparison — Cialdini: social comparison */}
        {comp && (
          <Card data-id="CC" className="border-2 border-border bg-card shadow-lg animate-fade-in-up animation-delay-300">
            <CardHeader data-id="CH" className="pb-2 px-5 pt-5">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                You vs. {compName}
              </CardTitle>
              <p className="text-xs text-muted-foreground font-medium">
                Your top-ranked competitor in {businessData.city}
              </p>
            </CardHeader>
            <CardContent data-id="CB" className="p-5 pt-2 space-y-3">
              <div data-id="CN" className="grid grid-cols-3 gap-2 pb-2 border-b border-border text-center">
                <span className="text-xs font-bold text-muted-foreground truncate">You</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider"></span>
                <span className="text-xs font-bold text-primary truncate">{compName.split(' ').slice(0, 2).join(' ')}</span>
              </div>
              
              {[
                { label: 'Rating', yours: you.rating, theirs: comp.rating, format: (v: number) => v.toFixed(1), icon: Star },
                { label: 'Reviews', yours: you.reviewCount, theirs: comp.reviewCount, format: (v: number) => v.toString(), icon: Star },
                { label: 'Photos', yours: you.photoCount, theirs: comp.photoCount, format: (v: number) => v.toString(), icon: ImageIcon },
              ].map((metric) => {
                const youWinning = metric.yours >= metric.theirs
                return (
                  <div key={metric.label} className="grid grid-cols-3 gap-2 items-center text-center">
                    <span className={cn(
                      'text-lg font-black',
                      youWinning ? 'text-green-600' : 'text-red-500'
                    )}>
                      {metric.format(metric.yours)}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">{metric.label}</span>
                    <span className={cn(
                      'text-lg font-black',
                      !youWinning ? 'text-green-600' : 'text-red-500'
                    )}>
                      {metric.format(metric.theirs)}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Top keyword opportunity — Kennedy: specificity sells */}
        {biggestOpportunity && (
          <Card data-id="TO" className="border-2 border-primary/30 bg-primary/5 shadow-md animate-fade-in-up animation-delay-400">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 shrink-0">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p data-id="TL" className="text-xs font-bold text-primary uppercase tracking-wide">Biggest opportunity</p>
                  <p data-id="TK" className="text-lg font-black text-foreground">&ldquo;{biggestOpportunity.keyword}&rdquo;</p>
                  <p data-id="TV" className="text-xs text-muted-foreground font-medium">
                    {biggestOpportunity.volume.toLocaleString()} people search this monthly
                    {biggestOpportunity.yourRank
                      ? ` — you're #${biggestOpportunity.yourRank}`
                      : ' — you don\'t rank at all'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI analysis — authority signal */}
        {comparison.aiSummary && (
          <Card data-id="AI" className="border-2 border-border bg-card shadow-md animate-fade-in-up animation-delay-500">
            <CardContent data-id="AC" className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">AI Assessment</p>
                  <p data-id="AT" className="text-sm text-foreground font-medium leading-relaxed">
                    {comparison.aiSummary}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA — urgency + curiosity bridge */}
        <div data-id="CA" className="space-y-2 animate-fade-in-up animation-delay-600 pt-1">
          <Button 
            onClick={onNext} 
            className="w-full h-14 text-lg font-black rounded-xl shadow-xl shadow-primary/40 animate-pulse-glow"
          >
            <Zap className="mr-2 h-5 w-5" />
            Show Me How to Fix This
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p data-id="UG" className="text-center text-xs font-semibold text-red-500 animate-urgency">
            Every day you wait, your competitor gets these leads instead
          </p>
        </div>
      </div>
    </div>
  )
}
