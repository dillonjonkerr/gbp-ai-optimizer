'use client'

import Script from 'next/script'

export function ReviewsSection() {
  return (
    <section className="w-full bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            What Painters Are Saying
          </h2>
          <p className="mt-2 text-base font-medium text-muted-foreground sm:text-lg">
            Join hundreds of painting contractors growing their business
          </p>
        </div>
        
        <div className="w-full">
          <Script 
            src="https://static.elfsight.com/platform/platform.js" 
            strategy="lazyOnload"
          />
          <div 
            className="elfsight-app-0b3b9fe3-d5a0-4940-abf5-357dabaab9e2" 
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  )
}
