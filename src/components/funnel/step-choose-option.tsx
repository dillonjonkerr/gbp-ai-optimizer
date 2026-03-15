'use client'

/* =============================================================
   STEP 4 — CHOOSE YOUR OPTION (Decision Page)
   
   PURPOSE:  Convert the user into either a DIY PDF buyer
             or an AI Optimization account.
   
   SECTIONS:
     1. Imports
     2. Types
     3. Static Content (feature lists for DIY + AI)
     4. Component
        a. Derived data (estimated revenue)
        b. Render
           - Headline
           - Value anchor (estimated lost revenue)
           - Option A: DIY Fix Plan (paid PDF)
           - Option B: AI Optimization (free, recommended)
           - Cost of inaction warning
   ============================================================= */


/* ── 1. IMPORTS ── */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Download, Zap, FileText, CheckCircle, ArrowRight, Crown,
  Clock, Shield, Lock, Sparkles, BarChart3, PenTool, Target,
  Users, Star, XCircle
} from 'lucide-react'


/* ── 2. TYPES ── */

interface StepChooseOptionProps {
  onSelectDIY: () => void
  onSelectAI: () => void
  missedSearches?: number
}


/* ── 3. STATIC CONTENT ── */

// What's included in the DIY PDF
const diyIncludes = [
  { text: 'Full audit report (PDF)', icon: FileText },
  { text: 'Step-by-step fix guide',  icon: Target },
  { text: 'Keyword gap list',        icon: BarChart3 },
  { text: 'Competitor breakdown',    icon: Users },
]

// What's included in AI Optimization
const aiIncludes = [
  { text: 'Everything in DIY plan',        icon: CheckCircle },
  { text: 'AI writes your descriptions',   icon: PenTool },
  { text: 'AI generates optimized posts',  icon: Sparkles },
  { text: 'Keyword tracking dashboard',    icon: BarChart3 },
  { text: 'Competitor monitoring',         icon: Users },
  { text: 'Monthly optimization tasks',    icon: Target },
  { text: 'AI review response templates',  icon: Star },
  { text: 'Priority support',             icon: Shield },
]


/* ── 4. COMPONENT ── */

export function StepChooseOption({ onSelectDIY, onSelectAI, missedSearches = 0 }: StepChooseOptionProps) {

  /* ── 4a. DERIVED DATA ── */

  // Estimated monthly revenue lost (missed searches × 8% conversion × $3,500 avg job)
  const estimatedMonthlyValue = Math.round((missedSearches || 200) * 0.08 * 3500)


  /* ── 4b. RENDER ── */

  return (
    <div data-id="S4" className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-8">
      <div data-id="OW" className="mx-auto w-full max-w-md space-y-5">


        {/* ── HEADLINE ── */}
        <div data-id="OH" className="space-y-2 text-center animate-fade-in-up">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-[1.75rem] leading-tight">
            You now know exactly what&apos;s wrong.{' '}
            <span className="text-primary">Here&apos;s how to fix it.</span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Two ways to start capturing those {missedSearches > 0 ? missedSearches.toLocaleString() : ''} missed searches.
          </p>
        </div>


        {/* ── VALUE ANCHOR — what they stand to recover ── */}
        {estimatedMonthlyValue > 0 && (
          <div data-id="AV" className="rounded-xl bg-muted/60 border border-border p-3 text-center animate-fade-in-up animation-delay-100">
            <p className="text-xs font-bold text-muted-foreground">
              Fixing these gaps could recover up to{' '}
              <span className="text-foreground font-black">${estimatedMonthlyValue.toLocaleString()}/mo</span>{' '}
              in lost painting jobs
            </p>
          </div>
        )}


        <div data-id="OL" className="space-y-4">

          {/* ── OPTION A: DIY FIX PLAN ── */}
          <Card data-id="DY" className="border-2 border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg animate-fade-in-up opacity-0 animation-delay-200">
            <CardHeader className="pb-2 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted shrink-0">
                  <FileText className="h-6 w-6 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg font-black">DIY Fix Plan</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">
                    Get the exact steps. Implement them yourself.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0">
              {/* Feature list */}
              <ul className="space-y-2">
                {diyIncludes.map((item) => (
                  <li key={item.text} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                    <item.icon className="h-4 w-4 text-primary shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-foreground">$9.99</span>
                <span className="text-sm text-muted-foreground font-medium line-through">$49</span>
                <Badge variant="secondary" className="text-xs font-bold">80% off</Badge>
              </div>

              {/* CTA */}
              <Button onClick={onSelectDIY} variant="outline" className="w-full h-12 text-base font-bold border-2">
                <Download className="mr-2 h-5 w-5" />
                Download Fix Plan
              </Button>
              <p className="text-[11px] text-center text-muted-foreground font-medium">
                Instant download. No recurring charges.
              </p>
            </CardContent>
          </Card>


          {/* ── OPTION B: AI OPTIMIZATION (recommended) ── */}
          <Card data-id="AO" className="border-2 border-primary bg-card relative overflow-hidden shadow-xl shadow-primary/20 animate-fade-in-up opacity-0 animation-delay-300">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

            {/* "Recommended" badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 shadow-lg shadow-primary/30">
                <Crown className="h-3.5 w-3.5 mr-1.5" />
                Recommended
              </Badge>
            </div>

            <CardHeader className="pb-2 p-5 relative">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shrink-0 shadow-xl shadow-primary/30">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1 pr-24">
                  <CardTitle className="text-lg font-black">AI Optimization</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">
                    Connect your profile. AI does the work.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 p-5 pt-0 relative">
              {/* Feature list */}
              <ul className="space-y-2">
                {aiIncludes.map((item) => (
                  <li key={item.text} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                    <item.icon className="h-4 w-4 text-primary shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>

              {/* Price anchor */}
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-2xl font-black text-primary">Free</span>
                  <span className="text-sm text-muted-foreground font-medium line-through">$197/mo</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Free while in early access. No credit card required.
                </p>
              </div>

              {/* CTA */}
              <Button onClick={onSelectAI} className="w-full h-13 text-base font-black shadow-xl shadow-primary/30 animate-pulse-glow">
                <Zap className="mr-2 h-5 w-5" />
                Connect &amp; Start Fixing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                  <Lock className="h-3 w-3" /> Secure connection
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                  <Shield className="h-3 w-3" /> Cancel anytime
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                  <Clock className="h-3 w-3" /> 2-min setup
                </span>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* ── COST OF INACTION WARNING ── */}
        <div data-id="CI" className="rounded-xl border border-red-200 bg-red-50 p-4 animate-fade-in-up opacity-0 animation-delay-500">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700 mb-1">What happens if you do nothing?</p>
              <p className="text-xs text-red-600/80 font-medium leading-relaxed">
                Your competitor keeps their ranking advantage. Every month, they capture the searches
                you&apos;re missing — and the homeowners who would have hired you call them instead.
                The gap only grows.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
