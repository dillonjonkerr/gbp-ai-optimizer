'use client'

/* =============================================================
   STEP 3 — OPPORTUNITY REVEAL (Results Page)
   
   PURPOSE:  Show the user exactly what they're missing.
             Make the gap impossible to ignore.
   
   SECTIONS:
     1. Imports
     2. Types
     3. Component
        a. Data extraction from audit result
        b. Render
           - Shock headline (keyword gap count)
           - Dollar value card (estimated lost revenue)
           - Visibility score (circular gauge)
           - Competitor comparison (head-to-head grid)
           - Top keyword opportunity
           - AI assessment
           - CTA button + urgency line
   ============================================================= */


/* ── 1. IMPORTS ── */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight, TrendingUp, Star, AlertTriangle,
  Trophy, Zap, ImageIcon, DollarSign, Sparkles,
  Globe, Phone, CheckCircle, XCircle, Camera, MessageSquare
} from 'lucide-react'
import type { AuditResult } from '@/lib/types'
import { cn } from '@/lib/utils'


/* ── 2. TYPES ── */

interface StepResultsProps {
  businessData: {
    businessName: string
    city: string
  }
  auditResult: AuditResult
  onNext: () => void
}


/* ── 3. COMPONENT ── */

export function StepResults({ businessData, auditResult, onNext }: StepResultsProps) {

  /* ── 3a. DATA EXTRACTION ── */

  const { marketScan, comparison } = auditResult

  // Missed traffic
  const missedSearches = marketScan.estimatedMissedTraffic

  // Keyword counts
  const missingKeywords = marketScan.keywords.filter(k => !k.yourRank || k.yourRank > 10).length
  const totalKeywords   = marketScan.keywords.length

  // Biggest keyword opportunity (sorted by traffic potential)
  const biggestOpportunity = marketScan.keywords
    .sort((a, b) => b.trafficOpportunity - a.trafficOpportunity)[0]

  // Visibility score + color coding
  const visibilityScore = comparison.score
  const scoreColor = visibilityScore <= 40 ? 'text-red-500' : visibilityScore <= 65 ? 'text-amber-500' : 'text-green-500'
  const scoreBg    = visibilityScore <= 40 ? 'bg-red-500'   : visibilityScore <= 65 ? 'bg-amber-500'   : 'bg-green-500'
  const scoreLabel = visibilityScore <= 40 ? 'Poor'         : visibilityScore <= 65 ? 'Below Average'  : 'Good'

  // Your profile vs competitor (always guaranteed)
  const you  = marketScan.yourProfile
  const comp = marketScan.competitorProfile

  // Estimated monthly revenue lost (missed searches × 8% conversion × $3,500 avg job)
  const estimatedMonthlyValue = Math.round(missedSearches * 0.08 * 3500)


  /* ── 3b. RENDER ── */

  return (
    <div data-id="S3" className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-8">
      <div data-id="RW" className="mx-auto w-full max-w-lg space-y-4">


        {/* ── SHOCK HEADLINE ── */}
        <div data-id="RH" className="space-y-3 text-center animate-fade-in-up">
          <Badge variant="destructive" className="gap-2 px-4 py-2 text-sm font-bold shadow-lg shadow-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            Ranking Gaps Found
          </Badge>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-[1.75rem] text-balance leading-tight">
            You&apos;re invisible for{' '}
            <span className="text-destructive">{missingKeywords} of {totalKeywords}</span>{' '}
            keywords homeowners search to find painters
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            That&apos;s an estimated{' '}
            <span className="font-black text-foreground">{missedSearches.toLocaleString()} missed searches</span>{' '}
            per month going directly to your competitors.
          </p>
        </div>


        {/* ── DOLLAR VALUE CARD — cost of inaction ── */}
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
                  Based on {missedSearches.toLocaleString()} missed searches &times; 8% conversion &times; avg painting job
                </p>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* ── VISIBILITY SCORE — circular gauge ── */}
        <Card data-id="VS" className="border-2 border-border bg-card shadow-lg animate-fade-in-up animation-delay-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-5">
              {/* Gauge */}
              <div className="relative h-24 w-24 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12"
                    strokeDasharray={`${visibilityScore * 2.64} 264`} strokeLinecap="round" className={scoreColor} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-foreground">{visibilityScore}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{scoreLabel}</span>
                </div>
              </div>

              {/* Description */}
              <div className="flex-1">
                <h3 className="text-lg font-black text-foreground mb-1">Your Visibility Score</h3>
                <p className="text-sm text-muted-foreground font-medium mb-3">
                  {visibilityScore <= 50
                    ? 'Most homeowners searching for painters in your area will never see your business.'
                    : 'You have room to grow. Your top competitor is capturing searches you could win.'}
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${scoreBg} rounded-full animate-bar-fill`} style={{ width: `${visibilityScore}%` }} />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">Goal: 80+</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* ── COMPETITOR COMPARISON — always-visible side-by-side ── */}
        <Card data-id="CC" className="border-2 border-border bg-card shadow-lg animate-fade-in-up animation-delay-300 overflow-hidden">
          <CardHeader className="pb-3 px-5 pt-5">
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Head-to-Head Comparison
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium">
              Your top-ranked competitor in {businessData.city}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {/* Column headers with names */}
            <div className="grid grid-cols-2 border-b border-border">
              <div className="px-4 py-3 bg-muted/30 border-r border-border text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">You</p>
                <p className="text-sm font-black text-foreground truncate">{you.name.split(' ').slice(0, 3).join(' ')}</p>
              </div>
              <div className="px-4 py-3 bg-primary/5 text-center">
                <p className="text-xs font-bold text-primary uppercase tracking-wide">Competitor</p>
                <p className="text-sm font-black text-foreground truncate">{comp.name.split(' ').slice(0, 3).join(' ')}</p>
              </div>
            </div>

            {/* Metric rows */}
            {[
              { label: 'Rating',  icon: Star,          yours: you.rating,      theirs: comp.rating,      format: (v: number) => v.toFixed(1) },
              { label: 'Reviews', icon: MessageSquare,  yours: you.reviewCount, theirs: comp.reviewCount, format: (v: number) => v.toLocaleString() },
              { label: 'Photos',  icon: Camera,         yours: you.photoCount,  theirs: comp.photoCount,  format: (v: number) => v.toString() },
            ].map((metric) => {
              const youWinning = metric.yours >= metric.theirs
              const Icon = metric.icon
              return (
                <div key={metric.label} className="grid grid-cols-2 border-b border-border last:border-b-0">
                  <div className={cn('px-4 py-3 border-r border-border text-center', youWinning ? 'bg-green-50' : 'bg-red-50/50')}>
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{metric.label}</span>
                    </div>
                    <span className={cn('text-xl font-black', youWinning ? 'text-green-600' : 'text-red-500')}>
                      {metric.format(metric.yours)}
                    </span>
                  </div>
                  <div className={cn('px-4 py-3 text-center', !youWinning ? 'bg-green-50' : 'bg-red-50/50')}>
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{metric.label}</span>
                    </div>
                    <span className={cn('text-xl font-black', !youWinning ? 'text-green-600' : 'text-red-500')}>
                      {metric.format(metric.theirs)}
                    </span>
                  </div>
                </div>
              )
            })}

            {/* Boolean metrics: Website + Phone */}
            <div className="grid grid-cols-2 border-t border-border">
              <div className="px-4 py-3 border-r border-border space-y-2">
                <div className="flex items-center justify-center gap-1.5">
                  {you.hasWebsite
                    ? <><CheckCircle className="h-3.5 w-3.5 text-green-500" /><span className="text-xs font-bold text-green-600">Website</span></>
                    : <><XCircle className="h-3.5 w-3.5 text-red-400" /><span className="text-xs font-bold text-red-500">No Website</span></>
                  }
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  {you.hasPhone
                    ? <><CheckCircle className="h-3.5 w-3.5 text-green-500" /><span className="text-xs font-bold text-green-600">Phone Listed</span></>
                    : <><XCircle className="h-3.5 w-3.5 text-red-400" /><span className="text-xs font-bold text-red-500">No Phone</span></>
                  }
                </div>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="flex items-center justify-center gap-1.5">
                  {comp.hasWebsite
                    ? <><CheckCircle className="h-3.5 w-3.5 text-green-500" /><span className="text-xs font-bold text-green-600">Website</span></>
                    : <><XCircle className="h-3.5 w-3.5 text-red-400" /><span className="text-xs font-bold text-red-500">No Website</span></>
                  }
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  {comp.hasPhone
                    ? <><CheckCircle className="h-3.5 w-3.5 text-green-500" /><span className="text-xs font-bold text-green-600">Phone Listed</span></>
                    : <><XCircle className="h-3.5 w-3.5 text-red-400" /><span className="text-xs font-bold text-red-500">No Phone</span></>
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* ── TOP KEYWORD OPPORTUNITY ── */}
        {biggestOpportunity && (
          <Card data-id="TO" className="border-2 border-primary/30 bg-primary/5 shadow-md animate-fade-in-up animation-delay-400">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 shrink-0">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">Biggest opportunity</p>
                  <p className="text-lg font-black text-foreground">&ldquo;{biggestOpportunity.keyword}&rdquo;</p>
                  <p className="text-xs text-muted-foreground font-medium">
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


        {/* ── AI ASSESSMENT ── */}
        {comparison.aiSummary && (
          <Card data-id="AI" className="border-2 border-border bg-card shadow-md animate-fade-in-up animation-delay-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">AI Assessment</p>
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    {comparison.aiSummary}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}


        {/* ── CTA + URGENCY ── */}
        <div data-id="CA" className="space-y-2 animate-fade-in-up animation-delay-600 pt-1">
          <Button
            onClick={onNext}
            className="w-full h-14 text-lg font-black rounded-xl shadow-xl shadow-primary/40 animate-pulse-glow"
          >
            <Zap className="mr-2 h-5 w-5" />
            Show Me How to Fix This
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-center text-xs font-semibold text-red-500 animate-urgency">
            Every day you wait, your competitor gets these leads instead
          </p>
        </div>

      </div>
    </div>
  )
}
