'use client'

import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'

interface AIBadgeProps {
  className?: string
}

export function AIBadge({ className }: AIBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30',
        className
      )}
    >
      <Zap className="h-4 w-4 fill-current" />
      <span>AI-Powered Scan</span>
    </div>
  )
}
