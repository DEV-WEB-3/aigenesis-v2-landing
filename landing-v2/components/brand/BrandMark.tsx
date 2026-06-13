'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'
import { BRAND_COLORS, MARK_PX, type LogoSize, type LogoTone } from './types'

export interface BrandMarkProps {
  size?: LogoSize
  tone?: LogoTone
  animated?: boolean
  className?: string
  'aria-hidden'?: boolean
}

/**
 * Genesis Orb — isotipo oficial (Ruta A).
 * Hexágono estructural + órbitas + núcleo energético + nodos distribuidos.
 */
export default function BrandMark({
  size = 'md',
  tone = 'color',
  animated = false,
  className,
  'aria-hidden': ariaHidden = true,
}: BrandMarkProps) {
  const uid = useId().replace(/:/g, '')
  const px = MARK_PX[size]
  const gradId = `brand-sig-${uid}`
  const glowId = `brand-glow-${uid}`

  const strokeMain =
    tone === 'mono' || tone === 'light' ? BRAND_COLORS.text : `url(#${gradId})`
  const coreFill =
    tone === 'mono' ? BRAND_COLORS.text : tone === 'light' ? BRAND_COLORS.void : `url(#${gradId})`
  const orbitStroke =
    tone === 'color' ? BRAND_COLORS.core : tone === 'light' ? BRAND_COLORS.void : BRAND_COLORS.text
  const orbitStrokeAlt =
    tone === 'color' ? BRAND_COLORS.ion : tone === 'light' ? BRAND_COLORS.core : BRAND_COLORS.text
  const nodeColors =
    tone === 'color'
      ? [BRAND_COLORS.ion, BRAND_COLORS.core, BRAND_COLORS.fuchsia]
      : [BRAND_COLORS.text, BRAND_COLORS.text, BRAND_COLORS.text]

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden={ariaHidden}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : 'AiGenesis'}
    >
      {tone === 'color' && (
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BRAND_COLORS.fuchsia} />
            <stop offset="50%" stopColor={BRAND_COLORS.core} />
            <stop offset="100%" stopColor={BRAND_COLORS.ion} />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={BRAND_COLORS.fuchsia} stopOpacity="0.35" />
            <stop offset="100%" stopColor={BRAND_COLORS.fuchsia} stopOpacity="0" />
          </radialGradient>
        </defs>
      )}

      {/* Hex frame — estructura blockchain */}
      <polygon
        points="24,3 41.5,11.5 41.5,36.5 24,45 6.5,36.5 6.5,11.5"
        stroke={strokeMain}
        strokeWidth="1.25"
        fill="none"
        strokeLinejoin="round"
      />

      {/* Órbitas — inteligencia distribuida */}
      <g className={animated ? 'brand-mark-orbit' : undefined} style={{ transformOrigin: '24px 24px' }}>
        <ellipse
          cx="24"
          cy="24"
          rx="15"
          ry="6.5"
          stroke={orbitStroke}
          strokeWidth="0.75"
          fill="none"
          opacity={tone === 'color' ? 0.45 : 0.7}
          transform="rotate(-28 24 24)"
        />
        <ellipse
          cx="24"
          cy="24"
          rx="15"
          ry="6.5"
          stroke={orbitStrokeAlt}
          strokeWidth="0.75"
          fill="none"
          opacity={tone === 'color' ? 0.38 : 0.55}
          transform="rotate(38 24 24)"
        />
        <circle cx="38.5" cy="17" r="1.75" fill={nodeColors[0]} opacity={tone === 'color' ? 0.9 : 0.85} />
        <circle cx="9.5" cy="31" r="1.75" fill={nodeColors[1]} opacity={tone === 'color' ? 0.85 : 0.8} />
        <circle cx="33" cy="38.5" r="1.35" fill={nodeColors[2]} opacity={tone === 'color' ? 0.9 : 0.8} />
      </g>

      {/* Núcleo Genesis */}
      {tone === 'color' && (
        <circle cx="24" cy="24" r="10" fill={`url(#${glowId})`} className={animated ? 'brand-mark-core-pulse' : undefined} />
      )}
      <circle
        cx="24"
        cy="24"
        r="6.25"
        fill={coreFill}
        className={animated ? 'brand-mark-core-pulse' : undefined}
      />
      <circle
        cx="24"
        cy="24"
        r="2.75"
        fill={tone === 'light' ? BRAND_COLORS.text : BRAND_COLORS.text}
        opacity={tone === 'color' ? 0.22 : tone === 'light' ? 0.15 : 0.35}
      />
    </svg>
  )
}
