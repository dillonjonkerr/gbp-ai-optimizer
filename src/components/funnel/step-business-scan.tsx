'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AIBadge } from '@/components/ai-badge'
import { FacebookReviewsWidget } from '@/components/facebook-reviews-widget'
import {
  Search, ArrowRight, MapPinned, Building, Shield, CreditCard,
  Paintbrush, Star, MapPin, Phone, Globe, ImageIcon, Loader2, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepBusinessScanProps {
  onNext: (data: { businessName: string; city: string }) => void
}

interface Prediction {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}

interface BusinessPreview {
  name: string
  rating: number
  reviewCount: number
  address: string
  phone: string | null
  website: string | null
  photoCount: number
  photoUrls: string[]
  category: string
}

const carouselItems = [
  'Full GBP Audit & Score',
  'Local Keyword Gap Analysis',
  'Competitor Comparison',
  'AI Optimization Plan',
  'Review Strategy',
  'Photo Recommendations',
  'Post & Q&A Suggestions',
]

const trustItems = [
  { icon: Shield, text: 'Free Optimization' },
  { icon: CreditCard, text: 'No Credit Card' },
  { icon: Paintbrush, text: 'Made For Painters' },
]

export function StepBusinessScan({ onNext }: StepBusinessScanProps) {
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [isHovering, setIsHovering] = useState(false)

  // Autocomplete
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Business preview
  const [preview, setPreview] = useState<BusinessPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  // Carousel
  const [carouselIdx, setCarouselIdx] = useState(0)

  // Trust animation
  const [trustIdx, setTrustIdx] = useState(0)

  const isValid = businessName.trim() && city.trim()

  // Carousel rotation
  useEffect(() => {
    const t = setInterval(() => setCarouselIdx(i => (i + 1) % carouselItems.length), 2400)
    return () => clearInterval(t)
  }, [])

  // Trust animation rotation
  useEffect(() => {
    const t = setInterval(() => setTrustIdx(i => (i + 1) % trustItems.length), 3000)
    return () => clearInterval(t)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Autocomplete fetch
  const fetchPredictions = useCallback(async (q: string) => {
    if (q.length < 2) { setPredictions([]); return }
    try {
      const res = await fetch(`/api/places-autocomplete?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setPredictions(data.predictions ?? [])
      setShowDropdown(true)
    } catch { setPredictions([]) }
  }, [])

  const handleBusinessNameChange = (val: string) => {
    setBusinessName(val)
    setSelectedPlaceId(null)
    setPreview(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchPredictions(val), 300)
  }

  // When user picks a prediction
  const handleSelectPrediction = async (pred: Prediction) => {
    setBusinessName(pred.mainText)
    setShowDropdown(false)
    setSelectedPlaceId(pred.placeId)
    setPredictions([])

    // Extract city from secondary text
    const parts = pred.secondaryText.split(',')
    if (parts.length >= 2) {
      setCity(parts.slice(0, 2).join(',').trim())
    } else if (parts.length === 1) {
      setCity(parts[0].trim())
    }

    // Fetch preview
    setPreviewLoading(true)
    try {
      const res = await fetch('/api/business-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: pred.mainText, city: parts[0]?.trim() ?? '' }),
      })
      if (res.ok) {
        const data = await res.json()
        setPreview(data)
      }
    } catch (err) {
      console.error('[preview]', err)
    } finally {
      setPreviewLoading(false)
    }
  }

  const clearPreview = () => {
    setPreview(null)
    setSelectedPlaceId(null)
    setBusinessName('')
    setCity('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext({ businessName, city })
    }
  }

  return (
    <div data-id="S1" className="flex min-h-[calc(100vh-56px)] flex-col px-4 py-6 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-8">
      <div data-id="SW" className="mx-auto w-full max-w-lg flex-1 flex flex-col justify-center">

        {/* Hero Section */}
        <div data-id="HR" className="text-center mb-5">
          <AIBadge className="mx-auto animate-scale-in mb-4" />
          <h1 data-id="H1" className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl leading-[1.1] mb-3">
            Fully Optimize Your<br />
            <span className="text-primary">GBP In 3 Minutes</span>
          </h1>

          {/* Carousel of included features */}
          <div data-id="CR" className="h-7 overflow-hidden relative">
            {carouselItems.map((item, i) => (
              <div
                key={item}
                className={cn(
                  'absolute inset-x-0 flex items-center justify-center gap-2 transition-all duration-500',
                  i === carouselIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                )}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-sm font-semibold text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Circles — overlapping real reviewer photos */}
        <div data-id="PC" className="flex items-center justify-center gap-3 mb-6">
          <div className="flex -space-x-2.5">
            {[
              'https://i.pravatar.cc/80?img=11',
              'https://i.pravatar.cc/80?img=12',
              'https://i.pravatar.cc/80?img=33',
              'https://i.pravatar.cc/80?img=53',
              'https://i.pravatar.cc/80?img=68',
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Reviewer"
                className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm"
              />
            ))}
          </div>
          <span className="text-sm font-bold text-muted-foreground">
            Helped <span className="text-foreground">100+</span> painters
          </span>
        </div>

        {/* GBP Preview Card — shows after selecting a business */}
        {previewLoading && (
          <div data-id="PL" className="mb-4 flex items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-bold text-primary">Loading business profile...</span>
          </div>
        )}

        {preview && !previewLoading && (
          <div data-id="GP" className="mb-4 rounded-xl border-2 border-border bg-card shadow-lg overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.98 23.98 0 000 24c0 3.77.9 7.34 2.44 10.52l8.09-5.93z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                <span className="text-[11px] font-bold text-muted-foreground">Google Business Profile</span>
              </div>
              <button onClick={clearPreview} className="p-1 rounded-md hover:bg-muted">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex gap-3">
                {/* Main photo */}
                {preview.photoUrls?.[0] ? (
                  <img
                    src={preview.photoUrls[0]}
                    alt={preview.name}
                    className="h-16 w-16 rounded-lg object-cover shrink-0 border border-border"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building className="h-7 w-7 text-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 data-id="GN" className="font-black text-foreground text-sm truncate">{preview.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-bold text-foreground">{preview.rating.toFixed(1)}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3 w-3',
                            i < Math.round(preview.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-semibold">({preview.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-[11px] text-muted-foreground font-medium truncate">{preview.address}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    {preview.phone && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <Phone className="h-3 w-3" /> {preview.phone}
                      </span>
                    )}
                    {preview.photoCount > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <ImageIcon className="h-3 w-3" /> {preview.photoCount} photos
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form data-id="FM" onSubmit={handleSubmit} className="space-y-3">
          <div data-id="FG" className="flex w-full flex-col gap-3">
            {/* Business Name with autocomplete */}
            <div data-id="BN" className="relative" ref={dropdownRef}>
              <div data-id="BI" className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/20">
                  <Building className="h-4 w-4" />
                </div>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your Painting Company"
                  value={businessName}
                  onChange={(e) => handleBusinessNameChange(e.target.value)}
                  onFocus={() => predictions.length > 0 && setShowDropdown(true)}
                  autoComplete="off"
                  className="pl-14 h-13 text-base font-semibold border-2 rounded-xl placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20"
                />
              </div>

              {/* Autocomplete dropdown */}
              {showDropdown && predictions.length > 0 && (
                <div data-id="AD" className="absolute z-50 mt-1 w-full rounded-xl border-2 border-border bg-card shadow-xl overflow-hidden animate-fade-in-up">
                  {predictions.map((p) => (
                    <button
                      key={p.placeId}
                      type="button"
                      onClick={() => handleSelectPrediction(p)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/80 transition-colors border-b border-border last:border-b-0"
                    >
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-foreground truncate">{p.mainText}</div>
                        <div className="text-xs text-muted-foreground font-medium truncate">{p.secondaryText}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City */}
            <div data-id="CT" className="relative">
              <div data-id="CI" className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/20">
                  <MapPinned className="h-4 w-4" />
                </div>
                <Input
                  id="city"
                  type="text"
                  placeholder="City / Service Area"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-14 h-13 text-base font-semibold border-2 rounded-xl placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <Button
            data-id="SB"
            type="submit"
            disabled={!isValid}
            className={cn(
              'w-full h-13 text-lg font-black rounded-xl transition-all duration-300 shadow-lg',
              isValid && 'shadow-xl shadow-primary/40 animate-pulse-glow'
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Search className={cn('mr-2 h-5 w-5', isHovering && isValid && 'animate-pulse')} />
            Scan My Business
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        {/* Trust indicators — animated cycling */}
        <div data-id="TI" className="pt-4">
          <div className="flex items-center justify-center gap-3">
            {trustItems.map((item, i) => {
              const Icon = item.icon
              const isActive = i === trustIdx
              return (
                <span
                  key={item.text}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-bold transition-all duration-500',
                    isActive ? 'text-primary scale-105' : 'text-muted-foreground'
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5', isActive && 'text-primary')} />
                  {item.text}
                </span>
              )
            })}
          </div>
        </div>

        {/* Facebook Reviews */}
        <div data-id="FR" className="mt-5 -mx-4 sm:-mx-6">
          <FacebookReviewsWidget />
        </div>
      </div>
    </div>
  )
}
