import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MascotProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  withSpeechBubble?: boolean
  message?: string
}

export function Mascot({ 
  size = 'md', 
  className,
  withSpeechBubble = false,
  message = "Let's grow your painting business!"
}: MascotProps) {
  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-36 w-36 sm:h-44 sm:w-44',
    lg: 'h-48 w-48 sm:h-56 sm:w-56'
  }

  return (
    <div className={cn('relative flex items-end', className)}>
      {withSpeechBubble && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full">
          <div className="relative rounded-2xl bg-primary px-4 py-2 shadow-lg">
            <p className="whitespace-nowrap text-sm font-bold text-primary-foreground">
              {message}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-primary" />
          </div>
        </div>
      )}
      <Image
        src="/images/mascot.png"
        alt="Paint & Profits Mascot"
        width={224}
        height={224}
        className={cn(sizeClasses[size], 'object-contain drop-shadow-lg')}
        priority
      />
    </div>
  )
}
