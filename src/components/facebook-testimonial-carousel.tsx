'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Star, ThumbsUp, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  name: string
  profileUrl: string
  profileImage?: string
  rating: number
  text: string
  date: string
  likes?: number
}

/*
 * UPDATE THESE with your real Facebook reviews.
 * profileUrl: link to the reviewer's FB profile or review
 * profileImage: URL to their FB profile picture (right-click > Copy Image Address on FB)
 */
const testimonials: Testimonial[] = [
  {
    name: 'Jason Martinez',
    profileUrl: 'https://www.facebook.com/paintandprofits/reviews',
    rating: 5,
    text: 'We went from barely showing up on Google Maps to getting 15+ calls a week. The audit showed us exactly what we were missing. Best marketing investment we ever made.',
    date: 'February 2026',
    likes: 12,
  },
  {
    name: 'Mike Thompson',
    profileUrl: 'https://www.facebook.com/paintandprofits/reviews',
    rating: 5,
    text: 'Found out I was missing 40+ keywords my competitors were ranking for. Fixed it and calls doubled within the first month. This tool is a game changer for painters.',
    date: 'January 2026',
    likes: 24,
  },
  {
    name: 'Ryan O\'Brien',
    profileUrl: 'https://www.facebook.com/paintandprofits/reviews',
    rating: 5,
    text: 'I had no idea my Google Business Profile was so incomplete. The side-by-side comparison with my top competitor was eye-opening. Already seeing more jobs come in.',
    date: 'December 2025',
    likes: 8,
  },
  {
    name: 'Sarah Collins',
    profileUrl: 'https://www.facebook.com/paintandprofits/reviews',
    rating: 5,
    text: 'As a woman in the painting industry, visibility is everything. This tool helped me outrank guys who\'ve been in business 20 years. My phone won\'t stop ringing!',
    date: 'January 2026',
    likes: 31,
  },
  {
    name: 'David Park',
    profileUrl: 'https://www.facebook.com/paintandprofits/reviews',
    rating: 5,
    text: 'We were spending $2K/mo on Google Ads and not ranking organically at all. After optimizing our GBP based on the audit, we cut ads in half and still get more leads.',
    date: 'November 2025',
    likes: 17,
  },
  {
    name: 'Carlos Reyes',
    profileUrl: 'https://www.facebook.com/paintandprofits/reviews',
    rating: 5,
    text: 'The competitor analysis alone was worth it. I could see exactly why one painter in my area was dominating — now I\'m matching them step for step.',
    date: 'March 2026',
    likes: 9,
  },
]

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <div className="h-full rounded-xl border-2 border-border bg-card shadow-md overflow-hidden transition-shadow hover:shadow-lg">
        {/* Facebook header bar */}
        <div className="flex items-center justify-between bg-[#1877F2] px-4 py-2">
          <div className="flex items-center gap-1.5">
            <FacebookIcon className="h-4 w-4 text-white" />
            <span className="text-xs font-bold text-white">Facebook Review</span>
          </div>
          <a
            href={testimonial.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="p-4 space-y-3">
          {/* Profile row */}
          <div className="flex items-center gap-3">
            {testimonial.profileImage ? (
              <img
                src={testimonial.profileImage}
                alt={testimonial.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-[#1877F2]/20"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-sm font-bold border-2 border-[#1877F2]/20 shadow-sm">
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <a
                href={testimonial.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-foreground hover:underline truncate block"
              >
                {testimonial.name}
              </a>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < testimonial.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted'
                    )}
                  />
                ))}
                <span className="text-[10px] text-muted-foreground ml-1">{testimonial.date}</span>
              </div>
            </div>
          </div>

          {/* Review text */}
          <p className="text-sm text-foreground leading-relaxed line-clamp-4">
            {testimonial.text}
          </p>

          {/* Likes */}
          {testimonial.likes && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-border">
              <ThumbsUp className="h-3.5 w-3.5 text-[#1877F2]" />
              <span className="text-xs font-semibold text-muted-foreground">
                {testimonial.likes} people found this helpful
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function FacebookTestimonialCarousel({ className }: { className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number | null>(null)
  const scrollPosRef = useRef(0)

  const animate = useCallback(() => {
    const container = scrollRef.current
    if (!container || isPaused) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    scrollPosRef.current += 0.5
    const halfScroll = container.scrollWidth / 2
    if (scrollPosRef.current >= halfScroll) {
      scrollPosRef.current = 0
    }
    container.scrollLeft = scrollPosRef.current

    animationRef.current = requestAnimationFrame(animate)
  }, [isPaused])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [animate])

  const doubled = [...testimonials, ...testimonials]

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <div className="mb-4 flex items-center justify-center gap-2">
        <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
        <span className="text-sm font-bold text-foreground">
          Verified Reviews from Painting Contractors
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden pb-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {doubled.map((t, i) => (
          <ReviewCard key={i} testimonial={t} />
        ))}
      </div>

      <div className="mt-3 text-center">
        <a
          href="https://www.facebook.com/paintandprofits/reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1877F2] hover:underline"
        >
          <FacebookIcon className="h-3.5 w-3.5" />
          See all reviews on Facebook
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
