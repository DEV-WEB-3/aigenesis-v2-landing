'use client'

import { cn } from '@/lib/utils'
import type { LogoSize, LogoTone } from './types'

const TITLE_CLASS: Record<LogoSize, string> = {
  sm: 'text-sm tracking-[0.28em]',
  md: 'text-lg tracking-[0.32em]',
  lg: 'text-3xl tracking-[0.34em]',
  xl: 'text-[clamp(2.85rem,9.5vw,6.25rem)] tracking-[0.22em]',
}

export interface GenesisTitleProps {
  size?: LogoSize
  tone?: LogoTone
  className?: string
}

/** Wordmark oficial — GENESIS (sin "Ai"). */
export default function GenesisTitle({ size = 'md', tone = 'color', className }: GenesisTitleProps) {
  const gradientClass =
    tone === 'color'
      ? 'genesis-title-gradient'
      : tone === 'light'
        ? 'text-genesis-void'
        : 'text-genesis-text'

  return (
    <span
      className={cn(
        'font-display font-bold uppercase whitespace-nowrap leading-none',
        TITLE_CLASS[size],
        gradientClass,
        className
      )}
      aria-label="GENESIS"
    >
      GENESIS
    </span>
  )
}
