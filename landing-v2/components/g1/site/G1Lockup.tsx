'use client'

import { useEffect, useRef } from 'react'
import { G1 } from '@/lib/design/g1'

/**
 * G1 LOCKUP — el logo 2D (monograma + órbitas átomo) con las ESFERAS flotantes
 * orbitando por las elipses MEDIDAS del asset (calibración por overlay, imagen
 * 1000×563). Es la versión viva del logo para toda la web: hero, footer, etc.
 * Mismo Kepler que la narrativa 3D (aceleran cerca, frenan lejos) y tejido de
 * profundidad: sin(E) decide si la esfera pasa por DELANTE o DETRÁS del
 * monograma (z-index). Respeta prefers-reduced-motion (esferas quietas).
 */

function solveKepler(M: number, e: number): number {
  let E = M
  for (let i = 0; i < 5; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
  return E
}

// Elipses medidas sobre g1-orbits-1000.webp (1000×563) + asteroides por ruta.
// `s` = diámetro de la esfera como fracción del ancho del lockup.
const PATHS = [
  { cx: 522, cy: 332, a: 428, b: 112, phi: 0, speed: 0.4, ecc: 0.3, asts: [{ M0: 0.4, s: 0.05, c: G1.cyan }, { M0: 2.7, s: 0.028, c: G1.blue }, { M0: 4.7, s: 0.038, c: G1.cyan }] },
  { cx: 697, cy: 220, a: 269, b: 82, phi: 24.6, speed: 0.62, ecc: 0.34, asts: [{ M0: 1.4, s: 0.055, c: G1.violet }, { M0: 4.2, s: 0.026, c: G1.magenta }] },
  { cx: 565, cy: 235, a: 253, b: 151, phi: -22, speed: 0.52, ecc: 0.3, asts: [{ M0: 2.4, s: 0.04, c: G1.amber }] },
] as const

const DEG = Math.PI / 180
const ALL = PATHS.flatMap((pa, pi) => pa.asts.map((ast) => ({ ...ast, pa, key: `${pi}-${ast.M0}` })))

export function G1Lockup({
  className = '',
  monoClass = 'h-[clamp(72px,13vw,124px)]',
  heightClass = 'h-[clamp(150px,26vw,250px)]',
  maxW = 580,
}: {
  className?: string
  /** clase de altura del monograma */
  monoClass?: string
  /** clase de altura del contenedor */
  heightClass?: string
  /** ancho máximo del lockup en px */
  maxW?: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const sphereRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion:reduce)').matches
    let raf = 0
    const tick = () => {
      const t = performance.now() / 1000
      for (let i = 0; i < ALL.length; i++) {
        const el = sphereRefs.current[i]
        if (!el) continue
        const { pa, M0 } = ALL[i]!
        const E = solveKepler(M0 + (reduce ? 0 : t * 0.16 * pa.speed), pa.ecc)
        const cE = Math.cos(E), sE = Math.sin(E)
        const cph = Math.cos(pa.phi * DEG), sph = Math.sin(pa.phi * DEG)
        const xi = pa.cx + pa.a * cE * cph - pa.b * sE * sph
        const yi = pa.cy + pa.a * cE * sph + pa.b * sE * cph
        el.style.left = `${(xi / 1000) * 100}%`
        el.style.top = `${(yi / 563) * 100}%`
        el.style.zIndex = sE >= 0 ? '3' : '1' // delante / detrás del monograma
      }
      if (!reduce) raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={wrapRef} className={`relative mx-auto flex w-full items-center justify-center ${heightClass} ${className}`} style={{ maxWidth: maxW }}>
      {/* órbitas — el asset 2D, la caja de referencia de las esferas */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(580px,128%)] max-w-none -translate-x-1/2 -translate-y-1/2" style={{ aspectRatio: '1000 / 563' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/g1/g1-orbits-1000.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full"
          style={{ filter: 'drop-shadow(0 0 46px rgba(0,245,255,0.22))' }}
        />
        {/* esferas flotantes — orbitan las elipses medidas (Kepler) */}
        {ALL.map((ast, i) => (
          <span
            key={ast.key}
            ref={(el) => { sphereRefs.current[i] = el }}
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: `${ast.s * 100}%`,
              aspectRatio: '1',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle at 35% 30%, white, ${ast.c} 48%, ${ast.c})`,
              boxShadow: `0 0 14px 2px ${ast.c}aa, 0 0 34px 6px ${ast.c}44`,
              left: '50%',
              top: '50%',
            }}
          />
        ))}
        {/* monograma — z 2: las esferas tejen delante (3) y detrás (1) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/g1/g1-monogram-560.webp"
          alt="G1"
          className={`absolute left-1/2 top-1/2 w-auto -translate-x-1/2 -translate-y-1/2 ${monoClass}`}
          style={{ zIndex: 2, filter: `drop-shadow(0 8px 34px ${G1.violet}77)` }}
        />
      </div>
    </div>
  )
}
