'use client'

import { rutaPublica } from '@/lib/rutaPublica'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import GenesisBurstMark from './GenesisBurstMark'
import type { LogoSize, LogoTone } from './types'

/** Ancho del lockup vertical (icono + GENESIS). */
const LOCKUP_WIDTH: Record<LogoSize, number> = {
  sm: 108,
  md: 148,
  lg: 240,
  xl: 340,
}

/**
 * EL LOCKUP NUEVO ES CUADRADO. El viejo no.
 *
 * `logo-genesis-clean.png` medía 981×648 —ratio 1.514— y ese número estaba a
 * fuego aquí como `/ 1.515`. El logotipo nuevo, `genesis-mark-512.png`, es 1:1.
 *
 * Y el cambio no es de archivo, es de FAMILIA VISUAL: el viejo es plano, de
 * trazo fino y tipografía ligera; el nuevo es volumétrico, con brillo y
 * profundidad — el mismo tratamiento que Gevy y G-Pulse. Mientras la web usara
 * el viejo, cualquier sitio donde apareciera Gevy o G-Pulse al lado iba a
 * cantar, porque son de dos épocas distintas de la marca.
 */
const LOCKUP_RATIO = 1

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
  const height = Math.round(width / LOCKUP_RATIO)

  if (isVertical) {
    return (
      <span
        className={cn('inline-flex shrink-0', className)}
        role="img"
        aria-label="GENESIS"
      >
        <Image
          src={rutaPublica('/brand/genesis-mark-512.png')}
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
