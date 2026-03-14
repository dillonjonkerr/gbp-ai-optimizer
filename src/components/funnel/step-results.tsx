'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, SearchX, Target, TrendingUp, Star, AlertTriangle, Trophy, Zap } from 'lucide-react'
import { ImageIcon } from 'lucide-react'
import type { AuditResult } from '@/lib/types'

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

  const you = marketScan.yourProfile
  const comp = marketScan.competitorProfile
  const compName = marketScan.primaryCompetitorName

  return (
    <div data-id="S3" className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-8">
      <div data-id="RW" className="mx-auto w-full max-w-lg space-y-5">
        
        <div data-id="RH" className="space-y-3 text-center animate-fade-in-up">
          <Badge data-id="RB" variant="destructive" className="gap-2 px-4 py-2 text-sm font-bold shadow-lg shadow-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            {visibilityScore <= 50 ? 'Low Visibility Detected' : 'Opportunities Found'}
          </Badge>
          <h1 data-id="RT" className="text-2xl font-black tracking-tight text-foreground sm:text-3xl text-balance leading-tight">
            Your competitors are capturing{' '}
            <span className="text-destructive">{missedSearches.toLocaleString()}</span>{' '}
            searches you&apos;re missing
          </h1>
        </div>

        <Card data-id="VS" className="border-2 border-border bg-card shadow-lg animate-fade-in-up">
          <CardContent data-id="VC" className="p-5">
            <div className="flex items-center gap-5">
              <div data-id="VR" className="relative h-24 w-24 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray={`${visibilityScore * 2.64} 264`} strokeLinecap="round" className={scoreColor} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span data-id="VN" className="text-3xl font-black text-foreground">{visibilityScore}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Score</span>
                </div>
              </div>
              
              <div data-id="VD" className="flex-1">
                <h3 data-id="VT" className="text-lg font-black text-foreground mb-1">GBP Optimization Score</h3>
                <p data-id="VP" className="text-sm text-muted-foreground font-medium mb-3">
                  You&apos;re ranking for only{' '}
                  <span className="text-destructive font-bold">
                    {totalKeywords - missingKeywords} of {totalKeywords}
                  </span>{' '}
                  high-intent keywords
                </p>
                <div data-id="VB" className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${scoreBg} rounded-full`} style={{ width: `${visibilityScore}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">Goal: 80+</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div data-id="KI" className="grid grid-cols-2 gap-3 animate-fade-in-up animation-delay-100">
          <Card data-id="KM" className="border-2 border-border bg-card shadow-md">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/30">
                <SearchX className="h-6 w-6" />
              </div>
              <div data-id="MV" className="text-2xl font-black text-foreground">{missedSearches.toLocaleString()}</div>
              <div className="text-xs font-semibold text-muted-foreground">Missed searches/mo</div>
            </CardContent>
          </Card>
          <Card data-id="KK" className="border-2 border-border bg-card shadow-md">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                <Target className="h-6 w-6" />
              </div>
              <div data-id="MK" className="text-2xl font-black text-foreground">+{missingKeywords}</div>
              <div className="text-xs font-semibold text-muted-foreground">Missing keywords</div>
            </CardContent>
          </Card>
        </div>

        {biggestOpportunity && (
          <Card data-id="TO" className="border-2 border-primary/30 bg-primary/5 shadow-md animate-fade-in-up animation-delay-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p data-id="TL" className="text-xs font-semibold text-primary uppercase tracking-wide">Top Opportunity</p>
                  <p data-id="TK" className="text-lg font-black text-foreground">&ldquo;{biggestOpportunity.keyword}&rdquo;</p>
                  <p data-id="TV" className="text-xs text-muted-foreground font-medium">
                    {biggestOpportunity.volume.toLocaleString()} monthly searches
                    {biggestOpportunity.yourRank
                      ? ` - You're #${biggestOpportunity.yourRank}`
                      : ' - You\'re not ranking'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {comp && (
          <Card data-id="CC" className="border-2 border-border bg-card shadow-lg animate-fade-in-up animation-delay-300">
            <CardHeader data-id="CH" className="pb-2 px-5 pt-5">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                vs Top Local Competitor
              </CardTitle>
            </CardHeader>
            <CardContent data-id="CB" className="p-5 pt-2 space-y-3">
              <div data-id="CN" className="flex justify-between items-center pb-2 border-b border-border">
                <span data-id="CY" className="text-sm font-bold text-muted-foreground truncate max-w-[45%]">{you.name}</span>
                <span data-id="CX" className="text-sm font-bold text-primary truncate max-w-[45%]">{compName}</span>
              </div>
              
              {[
                { label: 'Rating', yours: you.rating, theirs: comp.rating, icon: Star, format: (v: number) => v.toFixed(1) },
                { label: 'Reviews', yours: you.reviewCount, theirs: comp.reviewCount, icon: Star, format: (v: number) => v.toString() },
                { label: 'Photos', yours: you.photoCount, theirs: comp.photoCount, icon: ImageIcon, format: (v: number) => v.toString() },
              ].map((metric, i) => {
                const maxVal = Math.max(metric.yours, metric.theirs, 1)
                const youWinning = metric.yours >= metric.theirs
                return (
                  <div key={i} data-id={`C${i}`} className="flex items-center gap-3">
                    <metric.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className={youWinning ? 'text-green-500' : 'text-red-500'}>{metric.format(metric.yours)}</span>
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className={!youWinning ? 'text-green-500' : 'text-red-500'}>{metric.format(metric.theirs)}</span>
                      </div>
                      <div className="flex h-1.5 gap-1">
                        <div className="flex-1 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${youWinning ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${(metric.yours / maxVal) * 100}%` }}></div>
                        </div>
                        <div className="flex-1 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${!youWinning ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${(metric.theirs / maxVal) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {comparison.aiSummary && (
          <Card data-id="AI" className="border-2 border-primary/30 bg-primary/5 shadow-md animate-fade-in-up animation-delay-400">
            <CardContent data-id="AC" className="p-4">
              <p data-id="AL" className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">AI Analysis</p>
              <p data-id="AT" className="text-sm text-foreground font-medium leading-relaxed">
                {comparison.aiSummary}
              </p>
            </CardContent>
          </Card>
        )}

        <Button 
          data-id="CA"
          onClick={onNext} 
          className="w-full h-14 text-lg font-black rounded-xl shadow-xl shadow-primary/40 animate-pulse-glow animate-fade-in-up animation-delay-500"
        >
          <Zap className="mr-2 h-5 w-5" />
          See How to Fix This
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p data-id="UG" className="text-center text-xs font-semibold text-muted-foreground animate-fade-in-up animation-delay-500">
          Your competitors are getting these leads <span className="text-destructive">right now</span>
        </p>
      </div>
    </div>
  )
}
