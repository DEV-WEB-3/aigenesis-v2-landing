'use client'

import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { G1 } from '@/lib/design/g1'

/**
 * NAV PILL — dos indicadores independientes (pedido del owner):
 *
 *  1) PILL ACTIVA (fija): marca SIEMPRE la página en la que estoy. No se mueve al
 *     pasar el cursor por otra — se queda donde estoy. Cian con borde.
 *  2) EFECTO HOVER (temporal): un resalte más tenue sobre el ítem que estoy
 *     señalando; se desliza entre ítems y DESAPARECE al quitar el cursor (salvo
 *     que sea la propia página activa, que ya tiene su pill).
 *
 * Así siempre se entiende en qué página estoy y cuál estoy señalando.
 */
type Item = { href: string; label: string }
type Rect = { left: number; width: number } | null

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
  const [rects, setRects] = useState<Rect[]>([])
  const activeIndex = items.findIndex((i) => i.href === current)
  const labelsKey = items.map((i) => t(i.label)).join('|')

  const measure = useCallback(() => {
    setRects(refs.current.map((el) => (el ? { left: el.offsetLeft, width: el.offsetWidth } : null)))
  }, [])

  useLayoutEffect(() => {
    measure()
  }, [measure, labelsKey])

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const activeRect = activeIndex >= 0 ? rects[activeIndex] ?? null : null
  const showHover = hover != null && hover !== activeIndex
  const hoverRect = hover != null ? rects[hover] ?? null : null

  return (
    <nav
      className="relative hidden items-center rounded-full border px-1.5 py-1 md:flex"
      style={{ borderColor: `${G1.cyan}1a`, background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onMouseLeave={() => setHover(null)}
    >
      {/* 1) pill ACTIVA — fija en la página actual */}
      {activeRect ? (
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 h-8 -translate-y-1/2 rounded-full"
          style={{
            left: activeRect.left,
            width: activeRect.width,
            background: `${G1.cyan}22`,
            border: `1px solid ${G1.cyan}45`,
          }}
        />
      ) : null}

      {/* 2) efecto HOVER — temporal, sobre lo que señalo; se desvanece al salir */}
      {hoverRect ? (
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 h-8 -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
          style={{
            left: hoverRect.left,
            width: hoverRect.width,
            background: `${G1.cyan}12`,
            opacity: showHover ? 1 : 0,
          }}
        />
      ) : null}

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
            aria-current={active ? 'page' : undefined}
            className="relative z-10 rounded-full px-3.5 py-2 font-mono text-[12.5px] uppercase tracking-[0.1em]"
          >
            <span
              className={active ? 'font-semibold' : 'text-genesis-mist transition-colors hover:text-genesis-text'}
              style={active ? { color: G1.cyan } : undefined}
            >
              {t(n.label)}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
