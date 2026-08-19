'use client'

import { rutaPublica } from '@/lib/rutaPublica'
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

/**
 * Isotipo oficial GENESIS — la G, sin la palabra.
 *
 * Usa `genesis-symbol-*`, derivado del logotipo NUEVO recortando su lockup (ver
 * `scripts/derive-genesis-symbol.py`). Antes apuntaba a `logo-genesis-mark.png`,
 * que es el isotipo de la version VIEJA —plana, sin volumen— asi que el nav
 * llevaba una marca de otra epoca que la del resto del portal.
 *
 * Aqui hace falta el simbolo SOLO: a 36-48 px, la palabra del lockup mediria
 * menos de 4 px de alto. Ilegible, y ensucia una marca que a esa escala tiene
 * que leerse como simbolo.
 */
export default function GenesisBurstMark({
  size = 'md',
  tone = 'color',
  scale = 1,
  className,
}: GenesisBurstMarkProps) {
  const px = Math.round(MARK_SIZE[size] * scale)

  return (
    <Image
      src={rutaPublica('/brand/genesis-symbol-512.png')}
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
