'use client'

import Link from 'next/link'
import { useLayoutEffect, useRef, useState } from 'react'
import { G1 } from '@/lib/design/g1'

/**
 * GOOEY NAV — portado de React Bits a CSS/SVG (sin deps). Una "pill" líquida se
 * desliza bajo el ítem activo/hover; un satélite la sigue con retraso y, gracias
 * al filtro `goo` (blur + umbral de alpha), ambos se estiran y funden como un
 * fluido al moverse. El texto va en una capa aparte (nítido, sin filtro).
 */
type Item = { href: string; label: string }

export function GooeyNav({
  items,
  current,
  t,
}: {
  items: Item[]
  current: string
  t: (s: string) => string
}) {
  const refs = useRef<Array<HTMLAnchorElement | null>>([])
  const [hover, setHover] = useState<number | null>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const activeIndex = items.findIndex((i) => i.href === current)
  const target = hover ?? (activeIndex >= 0 ? activeIndex : null)

  useLayoutEffect(() => {
    if (target == null) {
      setPill(null)
      return
    }
    const el = refs.current[target]
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth })
  }, [target, items.length])

  return (
    <nav
      className="relative hidden items-center rounded-full border px-1.5 py-1 md:flex"
      style={{ borderColor: `${G1.cyan}1a`, background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onMouseLeave={() => setHover(null)}
    >
      {/* capa goo — la pill + el satélite (se funden al moverse) */}
      <span className="pointer-events-none absolute inset-0" style={{ filter: 'url(#g1-goo)' }}>
        {pill ? (
          <>
            <span
              className="absolute top-1/2 h-8 -translate-y-1/2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: pill.left, width: pill.width, background: `${G1.cyan}30` }}
            />
            <span
              className="absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full transition-all duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: pill.left + pill.width / 2 - 16, background: `${G1.cyan}30` }}
            />
          </>
        ) : null}
      </span>

      {items.map((n, idx) => {
        const active = n.href === current
        return (
          <Link
            key={n.href}
            href={n.href}
            ref={(el) => {
              refs.current[idx] = el
            }}
            onMouseEnter={() => setHover(idx)}
            className="relative z-10 rounded-full px-3.5 py-2 font-mono text-[12.5px] uppercase tracking-[0.1em] transition-colors"
            style={{ color: active ? G1.cyan : undefined }}
          >
            <span className={active ? '' : 'text-genesis-mist hover:text-genesis-text'}>{t(n.label)}</span>
          </Link>
        )
      })}

      {/* filtro goo (una sola instancia por header) */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id="g1-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="g" />
            <feBlend in="SourceGraphic" in2="g" />
          </filter>
        </defs>
      </svg>
    </nav>
  )
}
