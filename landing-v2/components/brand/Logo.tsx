'use client'

import { cn } from '@/lib/utils'
import BrandMark from './BrandMark'
import Wordmark from './Wordmark'
import type { LogoBaseProps } from './types'

const GAP_CLASS: Record<NonNullable<LogoBaseProps['size']>, string> = {
  sm: 'gap-2',
  md: 'gap-2.5',
  lg: 'gap-3',
  xl: 'gap-4',
}

/**
 * Sistema de logo AiGenesis V2.
 * variant: full (lockup) | mark | wordmark
 */
export default function Logo({
  variant = 'full',
  size = 'md',
  tone = 'color',
  animated = false,
  className,
}: LogoBaseProps) {
  if (variant === 'mark') {
    return (
      <BrandMark size={size} tone={tone} animated={animated} className={className} aria-hidden={false} />
    )
  }

  if (variant === 'wordmark') {
    return <Wordmark size={size} tone={tone} className={className} />
  }

  return (
    <span
      className={cn('inline-flex items-center', GAP_CLASS[size], className)}
      aria-label="AiGenesis"
    >
      <BrandMark size={size} tone={tone} animated={animated} />
      <Wordmark size={size} tone={tone} />
    </span>
  )
}
