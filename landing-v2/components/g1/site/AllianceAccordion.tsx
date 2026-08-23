'use client'

import { useState } from 'react'
import { G1 } from '@/lib/design/g1'

/**
 * ALLIANCE ACCORDION — la trilogía como galería acordeón (estilo React Bits
 * "Accordion Gallery"): tres glassmorphy con el LOGO real de cada marca que se
 * expanden al señalar (flex-grow), con glow de acento, sheen, tilt sutil y
 * grayscale en los inactivos. Reemplaza los emblemas △.
 *
 * Logos: Génesis (marca cromo, public/brand), Aitech (símbolo orbital; su PNG
 * viene con fondo negro → se limpia con mix-blend screen) y TAG (wordmark blanco).
 * Cada marca en su acento: Génesis→violeta, Aitech→cian, TAG→ámbar.
 */
type Brand = {
  key: string
  name: string
  role: string
  color: string
  logo: string
  blend?: boolean
}

const BRANDS: Brand[] = [
  { key: 'genesis', name: 'Génesis', role: 'Comunidad + tecnología', color: G1.violet, logo: '/brand/genesis-symbol-512.png' },
  { key: 'aitech', name: 'Aitech', role: 'Adopción global', color: G1.cyan, logo: '/g1/media/aitech-brand/alianza/aitech-logo.png', blend: true },
  { key: 'tag', name: 'TAG', role: 'Finanzas', color: G1.amber, logo: '/g1/media/aitech-brand/partners/tag-markets.png' },
]

export function AllianceAccordion() {
  const [active, setActive] = useState(0)

  return (
    <div
      className="flex h-[clamp(360px,64vw,400px)] flex-col gap-3 sm:h-[clamp(260px,30vw,340px)] sm:flex-row sm:gap-4"
      onMouseLeave={() => setActive(0)}
    >
      {BRANDS.map((b, i) => {
        const on = active === i
        const dist = i - active // para el tilt/parallax
        return (
          <button
            key={b.key}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-label={`${b.name} — ${b.role}`}
            className="group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-3xl border text-center transition-[flex-grow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              flexGrow: on ? 2.2 : 1,
              flexBasis: 0,
              borderColor: on ? `${b.color}55` : `${G1.cyan}18`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: on ? `inset 0 1px 0 0 rgba(255,255,255,0.07), 0 30px 70px -50px ${b.color}` : 'inset 0 1px 0 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* glow de acento — se intensifica al activar */}
            <span aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-500" style={{ background: `radial-gradient(72% 60% at 50% 34%, ${b.color}${on ? '33' : '14'}, transparent 70%)`, opacity: on ? 1 : 0.65 }} />
            {/* sheen superior */}
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${b.color}66, transparent)` }} />
            {/* glare diagonal al hover */}
            <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/12 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%] motion-reduce:hidden" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 p-4 sm:p-6">
              {/* logo en cristal, con halo y tilt sutil */}
              <div
                className="relative grid place-items-center transition-transform duration-500 ease-out"
                style={{ transform: on ? 'rotate(0deg) scale(1)' : `rotate(${dist * 3}deg) scale(0.92)` }}
              >
                <span aria-hidden className="absolute h-24 w-24 rounded-full blur-2xl transition-opacity duration-500" style={{ background: b.color, opacity: on ? 0.38 : 0.16 }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.logo}
                  alt={b.name}
                  className="relative h-14 w-auto max-w-[78%] object-contain transition-all duration-500 sm:h-[4.5rem]"
                  style={{ mixBlendMode: b.blend ? 'screen' : undefined, filter: on ? 'none' : 'grayscale(0.5)', opacity: on ? 1 : 0.82 }}
                />
              </div>

              {/* nombre — siempre visible */}
              <p className="font-display text-[clamp(16px,2vw,20px)] font-bold tracking-tight text-genesis-text">{b.name}</p>

              {/* rol — aparece al activar */}
              <p
                className="max-w-[22ch] font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-500"
                style={{ color: b.color, opacity: on ? 1 : 0, maxHeight: on ? '48px' : '0', transform: on ? 'translateY(0)' : 'translateY(6px)' }}
              >
                {b.role}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
