import type { ReactNode } from 'react'
import Link from 'next/link'
import { G1, G1_GRADIENT } from '@/lib/design/g1'
import { DisclaimerBar } from '../DisclaimerBar'
import { CredentialStrip } from '../CredentialStrip'
import { SideRays } from './fx'
import { OFFICIAL_SOCIAL } from '@/lib/official-links'

/**
 * G1 FOOTER — completo y premium, con nuestra data (adaptado del mapa de la
 * alianza). Franja de esencia (somos un ser vivo), navegación, ecosistema,
 * acceso, comunidad, legal, canales, credenciales atribuidas y aviso de riesgo
 * COMPATIBLE con la guarda de lenguaje (sin promesas ni palabras vetadas).
 */

const ESENCIA = ['Espacio', 'Conciencia', 'Presencia', 'Libertad', 'Prosperidad', 'Equilibrio']

const NAV = [
  { href: '/g1', label: 'Inicio' },
  { href: '/g1/que-es-g1', label: 'Qué es G1' },
  { href: '/g1/como-funciona', label: 'Cómo funciona' },
  { href: '/g1/ecosistema', label: 'Ecosistema' },
  { href: '/g1/comunidad', label: 'Comunidad' },
  { href: '/g1/faq', label: 'Preguntas frecuentes' },
]
const ECOSISTEMA = [
  { label: 'Tag Markets', href: 'https://www.tagmarkets.com' },
  { label: 'Bit1', href: 'https://www.bit1.com' },
  { label: 'BixCard', href: 'https://www.bit1.com' },
  { label: 'G-Pulse', href: 'https://g-pulse.aigenesis.io' },
  { label: 'Gevy', href: '/g1/ecosistema' },
  { label: 'AiG Token', href: '/g1/ecosistema' },
]
const LEGAL = ['Términos y condiciones', 'Política de privacidad', 'Política de cookies', 'Aviso de riesgo', 'Descargo de responsabilidad']

// Redes reales (lib/official-links) — iconos monoline, se tiñen al hover.
const SOCIAL = [
  { href: OFFICIAL_SOCIAL.X, label: 'X', d: 'M4 4l7 8.5L4.5 20H7l5.2-6 4.8 6H20l-7.3-9L19.5 4H17l-4.6 5.3L8.2 4H4z' },
  { href: OFFICIAL_SOCIAL.TELEGRAM, label: 'Telegram', d: 'M21 5L3 12l5 1.8L17 8l-6.5 7.2L10 20l3-2.6 4 2.9L21 5z' },
  { href: OFFICIAL_SOCIAL.INSTAGRAM, label: 'Instagram', d: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.2-.7a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z' },
  { href: OFFICIAL_SOCIAL.YOUTUBE, label: 'YouTube', d: 'M22 8.2a3 3 0 0 0-2.1-2.1C18 5.5 12 5.5 12 5.5s-6 0-7.9.6A3 3 0 0 0 2 8.2 31 31 0 0 0 1.7 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.6 7.9.6 7.9.6s6 0 7.9-.6a3 3 0 0 0 2.1-2.1c.3-1.3.3-3.8.3-3.8s0-2.5-.3-3.8zM10 15V9l5 3-5 3z' },
  { href: OFFICIAL_SOCIAL.DISCORD, label: 'Discord', d: 'M19 6.5A16 16 0 0 0 15 5l-.3.6a12 12 0 0 1 3.4 1.6 11 11 0 0 0-9.3 0A12 12 0 0 1 12.3 5.6L12 5a16 16 0 0 0-4 1.5C5 10 4.4 13.4 4.7 16.8A16 16 0 0 0 9 19l.6-1a10 10 0 0 1-1.6-.8l.4-.3a11 11 0 0 0 9.3 0l.4.3a10 10 0 0 1-1.6.8l.6 1a16 16 0 0 0 4.3-2.2c.4-4-.6-7.3-2.4-10.3zM9.5 14.5c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.5.8 1.4 1.6c0 .9-.6 1.6-1.4 1.6zm5 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.5.8 1.4 1.6c0 .9-.6 1.6-1.4 1.6z' },
  { href: OFFICIAL_SOCIAL.EMAIL, label: 'Correo', d: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.2 2L12 12l7.8-5H4.2z' },
]

function Col({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-genesis-mist">{title}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  )
}

export function G1Footer() {
  return (
    <footer className="relative border-t bg-genesis-void" style={{ borderColor: `${G1.cyan}1a` }}>
      {/* franja de esencia — somos un ser vivo */}
      <div className="border-b" style={{ borderColor: `${G1.cyan}12` }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-[clamp(16px,4vw,40px)] py-5">
          {ESENCIA.map((e, i) => (
            <span key={e} className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-genesis-mist">
              {i > 0 ? <span aria-hidden style={{ color: G1.cyan }}>·</span> : null}
              {e}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)] py-[clamp(48px,7vw,72px)]">
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          {/* marca */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-[9px] font-display text-[16px] font-extrabold text-genesis-void" style={{ background: G1_GRADIENT, boxShadow: `0 0 22px -6px ${G1.violet}` }}>G1</span>
              <span className="font-display text-[16px] font-bold tracking-tight text-genesis-text">G1</span>
            </div>
            <p className="mt-5 font-display text-[19px] font-bold leading-tight tracking-tight">
              <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Tres fuerzas. Un ecosistema.</span>
            </p>
            <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed text-genesis-mist">
              G1 conecta comunidad, mercados, activos digitales y herramientas de pago dentro de la
              alianza Génesis × Aitech × TAG.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: G1.cyan }}>
              Trading · Exchange · Tarjeta cripto
            </p>
            {/* redes reales de la comunidad */}
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={s.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  title={s.label}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg text-genesis-mist transition-colors hover:text-genesis-text"
                  style={{ border: `1px solid ${G1.cyan}1f`, background: 'rgba(255,255,255,0.03)' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: G1.amber }}>
              Sello G‑TAG · Génesis × Aitech × TAG
            </p>
          </div>

          <Col title="Navegación">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="text-[14px] text-genesis-text hover:underline">{n.label}</Link></li>
            ))}
          </Col>

          <Col title="Ecosistema">
            {ECOSISTEMA.map((e) => (
              <li key={e.label}>
                {e.href.startsWith('http')
                  ? <a href={e.href} target="_blank" rel="noopener noreferrer" className="text-[14px] text-genesis-text hover:underline">{e.label} ↗</a>
                  : <Link href={e.href} className="text-[14px] text-genesis-text hover:underline">{e.label}</Link>}
              </li>
            ))}
          </Col>

          <Col title="Acceso">
            <li><a href="https://g-pulse.aigenesis.io" target="_blank" rel="noopener noreferrer" className="text-[14px] text-genesis-text hover:underline">Únete / Ingresar ↗</a></li>
            <li><a href="https://genesis.ibportal.io" target="_blank" rel="noopener noreferrer" className="text-[14px] text-genesis-text hover:underline">Portal IBO ↗</a></li>
            <li><Link href="/g1/comunidad" className="text-[14px] text-genesis-text hover:underline">Próximos eventos</Link></li>
          </Col>

          <Col title="Legal">
            {LEGAL.map((l) => (
              <li key={l}><Link href="/legal" className="text-[13.5px] text-genesis-mist hover:text-genesis-text">{l}</Link></li>
            ))}
          </Col>
        </div>

        {/* cápsula de cumplimiento — un solo cristal curvo suave: respaldo + aviso
            juntos, en tono contenido (sin caja ámbar de alarma). Seguridad de la
            comunidad intacta, estética premium. */}
        <div
          className="relative mt-12 overflow-hidden rounded-[28px] border p-[clamp(20px,3vw,34px)]"
          style={{
            borderColor: `${G1.cyan}14`,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 24px 60px -40px rgba(0,0,0,0.9)',
          }}
        >
          {/* rayos de luz suaves detrás del cristal de aviso */}
          <SideRays />
          {/* brillo superior del cristal */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${G1.cyan}3a, transparent)` }} />
          <div className="relative grid gap-x-12 gap-y-8 md:grid-cols-[1.15fr_1px_1fr] md:items-stretch">
            {/* respaldo */}
            <CredentialStrip bare />
            {/* divisor hairline (solo desktop) */}
            <span aria-hidden className="hidden md:block" style={{ background: `linear-gradient(180deg, transparent, ${G1.cyan}1f, transparent)` }} />
            {/* aviso de riesgo — calmo, sin caja de alarma */}
            <div>
              <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-genesis-mist">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: G1.amber, boxShadow: `0 0 8px ${G1.amber}` }} />
                Aviso de riesgo
              </p>
              <p className="mt-4 max-w-[60ch] text-[13px] leading-relaxed text-genesis-mist">
                La información publicada tiene fines informativos y educativos. No es asesoría financiera,
                legal ni fiscal. Los mercados y los activos digitales implican riesgos y pueden generar
                pérdidas parciales o totales. G1 no administra el capital de las personas: cada quien revisa
                los términos oficiales de cada plataforma, analiza los riesgos y decide de forma independiente.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: `${G1.cyan}14` }}>
          <DisclaimerBar />
          <p className="font-mono text-[11px] tracking-[0.05em] text-genesis-mist">© {'2026'} G1 · Génesis. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
