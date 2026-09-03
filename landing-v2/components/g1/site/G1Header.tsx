'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SelectorIdioma from '@/components/i18n/SelectorIdioma'
import { useIdioma } from '@/context/IdiomaContext'
import { urlConIdioma } from '@/lib/i18n/idiomas'
import { GooeyNav } from './GooeyNav'
import { GlareHover, BorderGlow } from './fx'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

const IBO_URL = 'https://genesis.ibportal.io'
const REGISTER_URL = 'https://genesis.ibportal.io/auth/register?e=3K6GzjHBJ_y8cA2HayXAJNwnNadze1aLg9ZDSOZmJUs&a=1'

/**
 * G1 HEADER — cabecera de la web G1. Marca a la izquierda, navegación GOOEY al
 * centro y en la ESQUINA los CTA de acceso: "Regístrate" (→ registro del Portal
 * IBO de Génesis) e "Ingresar" (→ Portal IBO, primario, premium con border-glow +
 * glare). Transparente sobre el hero, con blur al scrollear. Menú hamburguesa en
 * móvil.
 */

const NAV = [
  { href: '/g1/que-es-g1', label: 'Qué es G1' },
  { href: '/g1/como-funciona', label: 'Cómo funciona' },
  { href: '/g1/ecosistema', label: 'Ecosistema' },
  { href: '/g1/comunidad', label: 'Comunidad' },
  { href: '/g1/faq', label: 'FAQ' },
]

// Icono "log in" (flecha entrando a la puerta) — refuerza que es INGRESAR.
const IconIngresar = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
)
// Icono "registrarse" (persona con +) — refuerza que es crear cuenta.
const IconRegister = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 20a5 5 0 0 0-10 0" />
    <circle cx="10" cy="8" r="3.2" />
    <path d="M18 8v6M15 11h6" />
  </svg>
)

export function G1Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { t, idioma } = useIdioma()
  /* Los CTA cruzan de dominio: el idioma elegido viaja en la URL o no viaja. */
  const iboUrl = urlConIdioma(IBO_URL, idioma)
  const registerUrl = urlConIdioma(REGISTER_URL, idioma)

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
      <div className="flex h-16 w-full items-center justify-between px-[clamp(14px,2.4vw,32px)]">
        {/* marca — logo G1 (monograma de cristal chrome) */}
        <Link href="/g1" className="group flex items-center gap-2.5" aria-label="G1 · inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/g1/g1-monogram-v2-128.webp"
            alt="G1"
            className="h-9 w-auto transition-transform duration-300 group-hover:scale-[1.04]"
            style={{ filter: `drop-shadow(0 0 14px ${G1.violet}55)` }}
          />
          <span className="hidden font-mono text-[11px] font-normal tracking-[0.14em] text-genesis-mist sm:block">
            × Aitech · TAG
          </span>
        </Link>

        {/* nav centro (desktop) — gooey */}
        <GooeyNav items={NAV} current={pathname} t={t} />

        {/* esquina: Regístrate + Ingresar (IBO) + idioma + hamburguesa */}
        <div className="flex items-center gap-2">
          {/* Regístrate — crear cuenta en el Portal IBO (secundario, ghost) */}
          <a
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t('Regístrate en el Portal IBO de Génesis')}
            aria-label={t('Regístrate en el Portal IBO de Génesis')}
            className="hidden items-center gap-2 rounded-full px-4 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-genesis-text transition-colors hover:text-white sm:inline-flex"
            style={{ border: `1px solid ${G1.cyan}33`, background: 'rgba(255,255,255,0.03)' }}
          >
            {IconRegister}
            {t('Regístrate')}
          </a>
          {/* Ingresar — CTA principal, va al Portal IBO de Génesis */}
          <BorderGlow rounded="rounded-full" className="hidden sm:inline-flex">
            <GlareHover rounded="rounded-full">
              <a
                href={iboUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t('Ingresar al Portal IBO de Génesis')}
                aria-label={t('Ingresar al Portal IBO de Génesis')}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-genesis-void"
                style={{ background: G1_GRADIENT }}
              >
                {IconIngresar}
                {t('Ingresar')}
              </a>
            </GlareHover>
          </BorderGlow>
          {/* selector de idioma — español-first: arranca en ES, presente en toda la web */}
          <div className="hidden sm:block">
            <SelectorIdioma compacto />
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
          <nav className="flex w-full flex-col gap-1 px-[clamp(14px,2.4vw,32px)] py-4">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-3 font-mono text-[13px] uppercase tracking-[0.1em]"
                style={{ color: pathname === n.href ? G1.cyan : undefined }}
              >
                <span className={pathname === n.href ? '' : 'text-genesis-text'}>{t(n.label)}</span>
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t pt-4" style={{ borderColor: `${G1.cyan}1f` }}>
              {/* Ingresar — CTA al Portal IBO de Génesis */}
              <a
                href={iboUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('Ingresar al Portal IBO de Génesis')}
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-genesis-void"
                style={{ background: G1_GRADIENT }}
              >
                {IconIngresar}
                {t('Ingresar')} · Portal IBO
              </a>
              <a
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('Regístrate en el Portal IBO de Génesis')}
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-genesis-text"
                style={{ border: `1px solid ${G1.cyan}2e`, background: 'rgba(255,255,255,0.03)' }}
              >
                {IconRegister}
                Regístrate · Portal IBO
              </a>
              <div className="mt-1">
                <SelectorIdioma />
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
