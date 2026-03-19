'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckCircle, Loader2, Search, Building,
  Sparkles, AlertCircle, TrendingDown, Star, Eye,
  Shield, Crown, Flame, Target, Swords
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AuditResult } from '@/lib/types'


interface StepMarketScanProps {
  businessData: {
    businessName: string
    city: string
    website: string
  }
  onComplete: (result: AuditResult) => void
}

interface CompetitorPreview {
  name: string
  rating: number
  reviewCount: number
  photoUrl?: string | null
}

type Phase = 'scanning' | 'competitor-reveal' | 'you-reveal' | 'investigating'

interface Discovery {
  text: string
  detail: string
  icon: typeof Building
  delay: number
  type: 'neutral' | 'warning' | 'danger'
}

const typeColors = {
  neutral: { bg: 'bg-primary',    border: 'border-primary/40',    text: 'text-primary' },
  warning: { bg: 'bg-amber-500',  border: 'border-amber-500/40',  text: 'text-amber-600' },
  danger:  { bg: 'bg-red-500',    border: 'border-red-500/40',    text: 'text-red-600' },
}


export function StepMarketScan({ businessData, onComplete }: StepMarketScanProps) {

  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [apiDone, setApiDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<AuditResult | null>(null)
  const hasFetched = useRef(false)

  const [phase, setPhase] = useState<Phase>('scanning')
  const [competitor, setCompetitor] = useState<CompetitorPreview | null>(null)
  const [competitorVisible, setCompetitorVisible] = useState(false)
  const [youVisible, setYouVisible] = useState(false)
  const [cheekLine, setCheekLine] = useState('')

  const cheekLines = [
    'Look who\'s stealing your leads...',
    'Looks familiar? They\'re ranking above you.',
    'This one keeps popping up in your area...',
    'Your customers are finding them first.',
    'They\'re showing up where you should be.',
  ]

  const buildDiscoveries = useCallback((comp: CompetitorPreview | null): Discovery[] => {
    const compName = comp?.name ?? 'Your top competitor'
    const shortName = compName.length > 20 ? compName.split(' ').slice(0, 2).join(' ') : compName
    return [
      { text: `${shortName} found in your area`,        detail: 'They\'re ranking for your keywords...',        icon: Target,       delay: 5500,  type: 'danger'  },
      { text: 'Outranking you by 10+ positions',         detail: 'On the keywords that matter most',             icon: TrendingDown, delay: 7500,  type: 'danger'  },
      { text: 'Review gap detected',                     detail: `${shortName} is winning the trust game`,       icon: Star,         delay: 9500,  type: 'warning' },
      { text: 'High-intent keywords you\'re missing',    detail: 'You\'re missing 300+ calls from these keywords', icon: Search,       delay: 11500, type: 'danger'  },
      { text: 'Map pack visibility gaps found',          detail: 'You\'re invisible in the local 3-pack',        icon: Eye,          delay: 13500, type: 'warning' },
      { text: 'Building your counter-attack plan',       detail: 'AI generating your playbook...',               icon: Sparkles,     delay: 16000, type: 'neutral' },
    ]
  }, [])

  const [discoveries, setDiscoveries] = useState<Discovery[]>(() => buildDiscoveries(null))


  // Fetch quick competitor preview via business-preview API
  useEffect(() => {
    if (hasFetched.current) return

    async function fetchPreview() {
      try {
        const res = await fetch('/api/business-preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: businessData.businessName,
            city: businessData.city,
            industry: 'Painter',
          }),
        })
        if (!res.ok) return

        const data = await res.json()
        const topComp = data.competitors?.[0]
        if (topComp) {
          setCompetitor({
            name: topComp.name,
            rating: topComp.rating ?? 0,
            reviewCount: topComp.reviewCount ?? 0,
          })
          setDiscoveries(buildDiscoveries({
            name: topComp.name,
            rating: topComp.rating ?? 0,
            reviewCount: topComp.reviewCount ?? 0,
          }))
        }
      } catch {
        // Non-critical — we'll use generic text
      }
    }

    fetchPreview()
  }, [businessData, buildDiscoveries])


  // Main audit API call
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
            website: businessData.website || undefined,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.error || `Audit failed (${res.status})`)
        }

        const data: AuditResult = await res.json()
        resultRef.current = data

        if (!competitor && data.marketScan?.competitorProfile) {
          const cp = data.marketScan.competitorProfile
          setCompetitor({
            name: cp.name,
            rating: cp.rating,
            reviewCount: cp.reviewCount,
            photoUrl: cp.photoUrl,
          })
          setDiscoveries(buildDiscoveries({
            name: cp.name,
            rating: cp.rating,
            reviewCount: cp.reviewCount,
          }))
        }

        setApiDone(true)
      } catch (err) {
        console.error('[StepMarketScan] API error:', err)
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }

    runAudit()
  }, [businessData, competitor, buildDiscoveries])


  // Phase timeline + progress bar
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (apiDone && prev >= 98) { clearInterval(progressInterval); return 100 }
        if (prev >= 90 && !apiDone) return 90
        return prev + 0.45
      })
    }, 100)

    // Phase 1 → competitor reveal at ~2.5s
    const t1 = setTimeout(() => {
      setPhase('competitor-reveal')
      setCheekLine(cheekLines[Math.floor(Math.random() * cheekLines.length)])
      setTimeout(() => setCompetitorVisible(true), 100)
    }, 2500)

    // Phase 2 → your card at ~4.5s
    const t2 = setTimeout(() => {
      setPhase('you-reveal')
      setTimeout(() => setYouVisible(true), 100)
    }, 4500)

    // Phase 3 → investigating feed at ~5.5s
    const t3 = setTimeout(() => setPhase('investigating'), 5500)

    // Discovery timers
    const discoveryTimers = discoveries.map((d, index) =>
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index])
      }, d.delay)
    )

    return () => {
      clearInterval(progressInterval)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      discoveryTimers.forEach(clearTimeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiDone])


  // Auto-advance when done
  useEffect(() => {
    if (progress >= 100 && apiDone && resultRef.current) {
      const timer = setTimeout(() => onComplete(resultRef.current!), 600)
      return () => clearTimeout(timer)
    }
  }, [progress, apiDone, onComplete])


  if (error) {
    return (
      <div data-id="ER" className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 py-6 sm:min-h-[calc(100vh-64px)]">
        <div data-id="EW" className="mx-auto w-full max-w-md text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-black text-foreground">Scan Failed</h2>
          <p className="text-sm text-muted-foreground font-medium">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-2 font-bold">
            Try Again
          </Button>
        </div>
      </div>
    )
  }


  const latestCompleted = completedSteps.length > 0 ? completedSteps[completedSteps.length - 1] : -1
  const compName = competitor?.name ?? 'Top Competitor'

  return (
    <div data-id="S2" className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-10">
      <div data-id="MW" className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center">


        {/* ── SCANNING ANIMATION ── */}
        <div data-id="SI" className="text-center mb-5">
          <div className="relative mx-auto h-20 w-20 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 rounded-full border-4 border-primary/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-700',
                phase === 'competitor-reveal' || phase === 'you-reveal'
                  ? 'bg-red-500 shadow-red-500/40'
                  : 'bg-primary shadow-primary/40'
              )}>
                {phase === 'competitor-reveal' ? (
                  <Swords className="h-7 w-7 text-white animate-pulse" />
                ) : phase === 'you-reveal' ? (
                  <Shield className="h-7 w-7 text-white animate-pulse" />
                ) : (
                  <Search className="h-7 w-7 text-white animate-pulse" />
                )}
              </div>
            </div>
          </div>

          <h1 data-id="MT" className="text-xl font-black tracking-tight text-foreground sm:text-2xl mb-1 transition-all duration-500">
            {phase === 'scanning' && 'Scanning your market...'}
            {phase === 'competitor-reveal' && 'Oh... we found something.'}
            {phase === 'you-reveal' && 'Now let\'s look at your profile.'}
            {phase === 'investigating' && 'Digging deeper...'}
          </h1>
          <p data-id="MS" className="text-sm text-muted-foreground font-medium transition-all duration-500">
            {phase === 'scanning' && `Investigating every painting contractor in ${businessData.city}`}
            {phase === 'competitor-reveal' && cheekLine}
            {phase === 'you-reveal' && 'Let\'s see how you stack up against them.'}
            {phase === 'investigating' && 'Uncovering exactly where they\'re beating you'}
          </p>
        </div>


        {/* ── PROGRESS BAR ── */}
        <div data-id="PB" className="space-y-2 mb-5">
          <Progress value={progress} className="h-2.5 rounded-full" />
          <div className="flex justify-between text-xs font-bold">
            <span className="text-muted-foreground">
              {progress >= 90 && !apiDone ? 'Finalizing report...' : 'Scanning...'}
            </span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
        </div>


        {/* ── COMPETITOR CARD — slides in first with cheeky intro ── */}
        {(phase === 'competitor-reveal' || phase === 'you-reveal' || phase === 'investigating') && (
          <div className={cn(
            'mb-3 transition-all duration-700 ease-out',
            competitorVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}>
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs font-black text-red-500 uppercase tracking-wider">
                Currently outranking you
              </span>
            </div>
            <Card className="border-2 border-red-200 bg-red-50/50 shadow-lg shadow-red-500/10 dark:bg-red-950/20 dark:border-red-900/40">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/15 shrink-0">
                    <Flame className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-foreground truncate">{compName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {competitor && competitor.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-foreground">{competitor.rating.toFixed(1)}</span>
                        </span>
                      )}
                      {competitor && competitor.reviewCount > 0 && (
                        <span className="text-xs font-semibold text-muted-foreground">
                          ({competitor.reviewCount} reviews)
                        </span>
                      )}
                      <span className="text-xs font-semibold text-red-500">
                        {businessData.city}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-wide">
                      #1
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {/* ── YOUR BUSINESS CARD — slides in second ── */}
        {(phase === 'you-reveal' || phase === 'investigating') && (
          <div className={cn(
            'mb-5 transition-all duration-700 ease-out',
            youVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}>
            <div className="flex items-center gap-2 mb-1.5">
              <Building className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                Your profile
              </span>
            </div>
            <Card className="border-2 border-border bg-card shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-foreground truncate">{businessData.businessName}</h3>
                    <p className="text-xs font-semibold text-muted-foreground truncate">
                      {businessData.city} &middot; Painting Contractor
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-black text-muted-foreground uppercase tracking-wide">
                      ?
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── BUSINESS CARD — shown during initial scanning only ── */}
        {phase === 'scanning' && (
          <Card data-id="BC" className="border-2 border-border bg-card shadow-md mb-5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground truncate">{businessData.businessName}</h3>
                  <p className="text-xs font-semibold text-muted-foreground truncate">
                    {businessData.city} &middot; Painting Contractor
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}


        {/* ── DISCOVERY FEED — competitive findings ── */}
        {phase === 'investigating' && (
          <div data-id="DL" className="space-y-2">
            {discoveries.map((discovery, index) => {
              const isCompleted = completedSteps.includes(index)
              const isLatest = index === latestCompleted
              const Icon = discovery.icon
              const colors = typeColors[discovery.type]

              return (
                <div
                  key={index}
                  data-id={`D${index}`}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500',
                    isCompleted ? `opacity-100 ${colors.border} bg-card shadow-sm` : 'opacity-20 border-border bg-card'
                  )}
                >
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 shrink-0',
                    isCompleted ? `${colors.bg} text-white shadow-md` : 'bg-muted text-muted-foreground'
                  )}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className={cn('text-sm font-bold transition-colors block', isCompleted ? 'text-foreground' : 'text-muted-foreground')}>
                      {discovery.text}
                    </span>
                    {isCompleted && (
                      <span className={cn('text-xs font-medium', colors.text)}>{discovery.detail}</span>
                    )}
                  </div>

                  {isCompleted && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                  {isLatest && !isCompleted && <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}