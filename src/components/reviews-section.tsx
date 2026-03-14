'use client'

import { GoogleReviewsWidget } from '@/components/google-reviews-widget'

export function ReviewsSection() {
  return (
    <section className="w-full bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <GoogleReviewsWidget variant="full" />
      </div>
    </section>
  )
}
