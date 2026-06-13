'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import GenesisBurstMark from './GenesisBurstMark'
import type { LogoSize, LogoTone } from './types'

/** Ancho del lockup vertical (icono + GENESIS). Ratio ~1.51 */
const LOCKUP_WIDTH: Record<LogoSize, number> = {
  sm: 108,
  md: 148,
  lg: 240,
  xl: 340,
}

export interface GenesisOfficialLogoProps {
  size?: LogoSize
  tone?: LogoTone
  layout?: 'vertical' | 'horizontal'
  /** Escala el lockup completo (hero: 2 = doble). */
  markScale?: number
  className?: string
  /** Clases extra en la imagen (hero: relleno del núcleo). */
  imageClassName?: string
}

/**
 * Lockup oficial GENESIS — asset aprobado (fondo transparente).
 * Vertical: isotipo + wordmark. Horizontal: solo isotipo.
 */
export default function GenesisOfficialLogo({
  size = 'md',
  tone = 'color',
  layout = 'vertical',
  markScale = 1,
  className,
  imageClassName,
}: GenesisOfficialLogoProps) {
  const isVertical = layout === 'vertical'
  const width = Math.round(LOCKUP_WIDTH[size] * markScale)
  const height = Math.round(width / 1.515)

  if (isVertical) {
    return (
      <span
        className={cn('inline-flex shrink-0', className)}
        role="img"
        aria-label="GENESIS"
      >
        <Image
          src="/brand/logo-genesis-clean.png"
          alt=""
          width={width}
          height={height}
          className={cn(
            'object-contain',
            imageClassName,
            tone === 'mono' && 'grayscale brightness-110',
            tone === 'light' && 'brightness-0 invert'
          )}
          style={imageClassName === 'hero-logo-fill' ? { width: '100%', height: 'auto' } : undefined}
          priority={size === 'xl'}
          aria-hidden
        />
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex items-center shrink-0', className)}
      role="img"
      aria-label="GENESIS"
    >
      <GenesisBurstMark size={size} tone={tone} />
    </span>
  )
}
