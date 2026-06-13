'use client'

import { cn } from '@/lib/utils'
import type { LogoSize, LogoTone } from './types'

export interface WordmarkProps {
  size?: LogoSize
  tone?: LogoTone
  className?: string
}

const WORDMARK_CLASS: Record<LogoSize, string> = {
  sm: 'text-[0.9375rem] leading-none',
  md: 'text-lg leading-none',
  lg: 'text-2xl leading-none',
  xl: 'text-4xl leading-none tracking-tight',
}

/**
 * Wordmark AiGenesis — "Ai" sólido + "Genesis" signature gradient.
 */
export default function Wordmark({ size = 'md', tone = 'color', className }: WordmarkProps) {
  const aiColor =
    tone === 'light' ? 'text-genesis-void' : tone === 'mono' ? 'text-genesis-text' : 'text-genesis-text'
  const genesisClass =
    tone === 'color'
      ? 'text-gradient-genesis-strong'
      : tone === 'light'
        ? 'text-genesis-void'
        : 'text-genesis-text'

  return (
    <span
      className={cn(
        'font-display font-bold tracking-tight whitespace-nowrap',
        WORDMARK_CLASS[size],
        className
      )}
    >
      <span className={aiColor}>Ai</span>
      <span className={genesisClass}>Genesis</span>
    </span>
  )
}
