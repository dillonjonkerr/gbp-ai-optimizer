'use client'

import Script from 'next/script'
import { Star } from 'lucide-react'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

interface GoogleReviewsWidgetProps {
  className?: string
  variant?: 'compact' | 'full'
}

/*
 * Elfsight Google Reviews Widget
 *
 * HOW TO SET UP:
 * 1. Go to https://elfsight.com/google-reviews-widget/
 * 2. Click "Create widget for FREE"
 * 3. Search for your Google Business Profile
 * 4. Choose a carousel/slider layout
 * 5. Customize appearance (match your brand)
 * 6. Copy the widget ID from the embed code
 *    (it looks like: elfsight-app-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)
 * 7. Replace the ID below with yours
 */
const GOOGLE_REVIEWS_WIDGET_ID = process.env.NEXT_PUBLIC_ELFSIGHT_GOOGLE_REVIEWS_ID || ''

export function GoogleReviewsWidget({ className, variant = 'full' }: GoogleReviewsWidgetProps) {
  const hasWidget = !!GOOGLE_REVIEWS_WIDGET_ID

  return (
    <div className={className}>
      {variant === 'full' && (
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <GoogleIcon className="h-5 w-5" />
            <span className="text-sm font-black text-foreground">Google Reviews</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-foreground">4.9</span>
            <span className="text-sm text-muted-foreground font-semibold">
              from 200+ homeowners
            </span>
          </div>
        </div>
      )}

      {variant === 'compact' && (
        <div className="mb-3 flex items-center justify-center gap-2">
          <GoogleIcon className="h-4 w-4" />
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-bold text-foreground">4.9</span>
          <span className="text-xs text-muted-foreground font-semibold">
            200+ verified reviews
          </span>
        </div>
      )}

      {hasWidget ? (
        <div className="w-full">
          <Script
            src="https://static.elfsight.com/platform/platform.js"
            strategy="lazyOnload"
          />
          <div
            className={GOOGLE_REVIEWS_WIDGET_ID}
            data-elfsight-app-lazy
          />
        </div>
      ) : (
        <div className="rounded-xl border-2 border-border bg-card p-6 text-center shadow-sm">
          <GoogleIcon className="mx-auto mb-3 h-8 w-8" />
          <p className="text-sm font-bold text-foreground mb-1">
            Google Reviews Widget
          </p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Set <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono">NEXT_PUBLIC_ELFSIGHT_GOOGLE_REVIEWS_ID</code> in your environment variables to display real Google reviews here.
          </p>
        </div>
      )}
    </div>
  )
}
