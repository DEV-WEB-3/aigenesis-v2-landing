'use client'

import { useRef, type ReactNode, type MouseEvent, type CSSProperties } from 'react'
import { G1 } from '@/lib/design/g1'

/**
 * FX — efectos premium portados de React Bits a CSS/React (sin deps nuevas).
 * GlareHover, SpotlightCard, BorderGlow y SideRays. Todos respetan
 * prefers-reduced-motion (motion-safe/motion-reduce) y usan tokens de la paleta.
 */

/** GLARE HOVER — un destello diagonal barre el elemento al pasar el cursor. */
export function GlareHover({
  children,
  className = '',
  rounded = 'rounded-xl',
}: {
  children: ReactNode
  className?: string
  rounded?: string
}) {
  return (
    <span className={`group/glare relative inline-flex overflow-hidden ${rounded} ${className}`}>
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/glare:translate-x-[130%] motion-reduce:hidden"
      />
    </span>
  )
}

/** SPOTLIGHT CARD — un foco radial sigue el cursor dentro de la tarjeta. */
export function SpotlightCard({
  children,
  className = '',
  color = `${G1.cyan}22`,
  radius = 320,
  style,
}: {
  children: ReactNode
  className?: string
  color?: string
  radius?: number
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - r.left}px`)
    el.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} onMouseMove={onMove} style={style} className={`group/spot relative overflow-hidden ${className}`}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(${radius}px circle at var(--sx, 50%) var(--sy, 0%), ${color}, transparent 68%)` }}
      />
      {children}
    </div>
  )
}

/**
 * BORDER GLOW — glow de marca suave y CONTENIDO alrededor del elemento (estático,
 * sin girar). Un anillo de gradiente fino en el borde + un halo difuso detrás; el
 * halo respira muy sutilmente al pasar el cursor. Nada de luz girando.
 */
export function BorderGlow({
  children,
  className = '',
  rounded = 'rounded-full',
}: {
  children: ReactNode
  className?: string
  rounded?: string
}) {
  return (
    <span className={`group/bg relative inline-flex ${rounded} ${className}`}>
      {/* halo difuso detrás — estático, contenido, se aviva un poco al hover */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-[2px] -z-10 ${rounded} opacity-45 blur-[6px] transition-opacity duration-300 group-hover/bg:opacity-70`}
        style={{ background: `linear-gradient(120deg, ${G1.violet}, ${G1.cyan}, ${G1.amber})` }}
      />
      {/* anillo de gradiente fino en el borde (máscara) */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${rounded}`}
        style={{
          background: `linear-gradient(120deg, ${G1.violet}, ${G1.cyan}, ${G1.amber})`,
          padding: '1.4px',
          WebkitMask: 'linear-gradient(black 0 0) content-box, linear-gradient(black 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </span>
  )
}

/** SIDE RAYS — rayos de luz suaves detrás de un panel (para cristales de aviso). */
export function SideRays({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <span
        className="absolute left-1/2 top-0 h-[220%] w-[220%] -translate-x-1/2 motion-safe:animate-[spin_42s_linear_infinite]"
        style={{
          background: `repeating-conic-gradient(from 0deg at 50% 0%, ${G1.cyan}12 0deg, transparent 1.5deg, transparent 7deg)`,
          maskImage: 'radial-gradient(120% 85% at 50% 0%, rgba(0,0,0,0.9), transparent 70%)',
          WebkitMaskImage: 'radial-gradient(120% 85% at 50% 0%, rgba(0,0,0,0.9), transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
      <span
        className="absolute left-1/2 top-0 h-[220%] w-[220%] -translate-x-1/2 motion-safe:animate-[spin_66s_linear_infinite_reverse]"
        style={{
          background: `repeating-conic-gradient(from 0deg at 50% 0%, ${G1.violet}10 0deg, transparent 2deg, transparent 11deg)`,
          maskImage: 'radial-gradient(120% 85% at 50% 0%, rgba(0,0,0,0.8), transparent 70%)',
          WebkitMaskImage: 'radial-gradient(120% 85% at 50% 0%, rgba(0,0,0,0.8), transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </span>
  )
}
