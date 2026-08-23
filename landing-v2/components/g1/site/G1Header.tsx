'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

/**
 * G1 HEADER — cabecera de la web G1. Marca a la izquierda, navegación al centro
 * y en la ESQUINA los accesos a los portales (IBO de TAG/Génesis y G-Pulse),
 * como en cualquier cabecera de producto. Transparente sobre el hero, con blur
 * al scrollear. Menú hamburguesa en móvil.
 */

const NAV = [
  { href: '/g1/que-es-g1', label: 'Qué es G1' },
  { href: '/g1/como-funciona', label: 'Cómo funciona' },
  { href: '/g1/ecosistema', label: 'Ecosistema' },
  { href: '/g1/comunidad', label: 'Comunidad' },
  { href: '/g1/faq', label: 'FAQ' },
]

// Accesos a los portales existentes (externos) — los iconos de la esquina.
const PORTALS = [
  {
    href: 'https://genesis.ibportal.io',
    label: 'Portal IBO',
    title: 'Portal IBO · Génesis × TAG',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: 'https://g-pulse.aigenesis.io',
    label: 'G-Pulse',
    title: 'G-Pulse · tu panel',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 12h4l2 6 4-14 2 8h6" />
      </svg>
    ),
  },
]

export function G1Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(8,11,18,0.55)' : 'rgba(8,11,18,0.28)',
        backdropFilter: 'blur(18px) saturate(1.35)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.35)',
        boxShadow: scrolled ? '0 8px 34px -18px rgba(0,0,0,0.9)' : 'none',
      }}
    >
      {/* compuesto único de marca: hairline gradiente violeta→cian→ámbar */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${G1.violet}55, ${G1.cyan}66, ${G1.amber}55, transparent)`, opacity: scrolled ? 1 : 0.5 }}
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-[clamp(16px,4vw,40px)]">
        {/* marca */}
        <Link href="/g1" className="group flex items-center gap-2.5" aria-label="G1 · inicio">
          <span
            className="grid h-8 w-8 place-items-center rounded-[9px] font-display text-[15px] font-extrabold text-genesis-void"
            style={{ background: G1_GRADIENT, boxShadow: `0 0 22px -6px ${G1.violet}` }}
          >
            G1
          </span>
          <span className="hidden font-display text-[15px] font-bold tracking-tight text-genesis-text sm:block">
            G1
            <span className="ml-2 font-mono text-[11px] font-normal tracking-[0.14em] text-genesis-mist">
              × Aitech · TAG
            </span>
          </span>
        </Link>

        {/* nav centro (desktop) */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href
            return (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-3.5 py-2 font-mono text-[12.5px] uppercase tracking-[0.1em] transition-colors"
                style={{ color: active ? G1.cyan : undefined }}
              >
                <span className={active ? '' : 'text-genesis-mist hover:text-genesis-text'}>{n.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* esquina: portales + hamburguesa */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            {PORTALS.map((p) => (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                title={p.title}
                aria-label={p.title}
                className="grid h-9 w-9 place-items-center rounded-lg text-genesis-mist transition-colors hover:text-genesis-text"
                style={{ border: `1px solid ${G1.cyan}22`, background: 'rgba(255,255,255,0.03)' }}
              >
                {p.icon}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            aria-expanded={open}
            className="ml-1 grid h-9 w-9 place-items-center rounded-lg text-genesis-text md:hidden"
            style={{ border: `1px solid ${G1.cyan}22` }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* menú móvil */}
      {open ? (
        <div
          className="md:hidden"
          style={{ background: 'rgba(6,9,16,0.94)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${G1.cyan}1f` }}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-[clamp(16px,4vw,40px)] py-4">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-3 font-mono text-[13px] uppercase tracking-[0.1em]"
                style={{ color: pathname === n.href ? G1.cyan : undefined }}
              >
                <span className={pathname === n.href ? '' : 'text-genesis-text'}>{n.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
