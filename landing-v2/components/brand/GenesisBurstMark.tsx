'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { LogoSize, LogoTone } from './types'

const MARK_SIZE: Record<LogoSize, number> = {
  sm: 36,
  md: 48,
  lg: 72,
  xl: 120,
}

export interface GenesisBurstMarkProps {
  size?: LogoSize
  tone?: LogoTone
  scale?: number
  className?: string
}

/** Isotipo oficial GENESIS — G burst (fondo transparente). */
export default function GenesisBurstMark({
  size = 'md',
  tone = 'color',
  scale = 1,
  className,
}: GenesisBurstMarkProps) {
  const px = Math.round(MARK_SIZE[size] * scale)

  return (
    <Image
      src="/brand/logo-genesis-mark.png"
      alt=""
      width={px}
      height={px}
      className={cn(
        'shrink-0 object-contain',
        tone === 'mono' && 'grayscale brightness-110',
        tone === 'light' && 'brightness-0 invert',
        className
      )}
      aria-hidden
      priority={size === 'xl' && scale >= 2}
    />
  )
}
