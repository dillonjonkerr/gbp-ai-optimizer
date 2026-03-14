'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-7 w-auto',
    md: 'h-9 w-auto',
    lg: 'h-12 w-auto',
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Image
        src="/images/logo-main.png"
        alt="Paint & Profits"
        width={180}
        height={72}
        className={cn(sizeClasses[size], 'object-contain')}
        priority
      />
    </div>
  )
}
