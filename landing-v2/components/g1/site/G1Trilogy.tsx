'use client'

import { G1, G1_GRADIENT } from '@/lib/design/g1'
import { SectionReveal } from './SectionReveal'

/**
 * G1 TRILOGY — el emblema de la alianza en glass premium.
 *
 * Decisión (documento del owner): NO se usan los logos corporativos de cada
 * organización —eso mezclaría tres lenguajes visuales distintos y falsificaría
 * marcas de terceros—. Se crea un SÍMBOLO DE ALIANZA propio: tres emblemas △
 * unificados en la paleta G1, cada miembro en su acento (Génesis→violeta,
 * Aitech→cian, TAG→ámbar), que convergen hacia un solo núcleo G1 (3 → 1).
 *
 * Mapeo HÍBRIDO (elegido por el owner): Génesis = comunidad + su propia
 * tecnología; Aitech = adopción y comunidad global; TAG = finanzas.
 */
const MIEMBROS = [
  { n: 'Génesis', rol: 'Comunidad + tecnología', letra: 'G', color: G1.violet },
  { n: 'Aitech', rol: 'Adopción global', letra: 'A', color: G1.cyan },
  { n: 'TAG', rol: 'Finanzas', letra: 'T', color: G1.amber },
]

export function G1Trilogy() {
  return (
    <div
      className="relative overflow-hidden rounded-[28px] border p-[clamp(24px,4vw,52px)]"
      style={{
        borderColor: `${G1.cyan}16`,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 34px 90px -55px rgba(0,0,0,0.95)',
      }}
    >
      {/* brillo superior del cristal */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${G1.cyan}42, transparent)` }} />
      {/* glow de convergencia al núcleo */}
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" style={{ background: `radial-gradient(circle, ${G1.violet}26, ${G1.cyan}14 45%, transparent 72%)` }} />

      <SectionReveal>
        <p className="relative text-center font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.amber }}>La alianza</p>
        <h3 className="relative mx-auto mt-3 max-w-[26ch] text-center font-display text-[clamp(22px,3.4vw,34px)] font-bold tracking-tight">
          Tres fuerzas que convergen en{' '}
          <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>un solo núcleo</span>.
        </h3>
      </SectionReveal>

      <div className="relative mt-11 grid gap-8 sm:grid-cols-3">
        {MIEMBROS.map((m, i) => (
          <SectionReveal key={m.n} delay={i * 0.1}>
            <div className="group flex flex-col items-center text-center">
              <div className="relative grid h-24 w-24 place-items-center">
                {/* halo del acento */}
                <span aria-hidden className="absolute inset-2 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-90" style={{ background: m.color, opacity: 0.24 }} />
                <svg viewBox="0 0 100 100" className="relative h-24 w-24 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden="true">
                  <defs>
                    <linearGradient id={`g1tri-${m.letra}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor={m.color} />
                      <stop offset="1" stopColor={m.color} stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* triángulo redondeado — el motivo △ de la trilogía */}
                  <path d="M50 15 L83 74 Q86 80 79 80 L21 80 Q14 80 17 74 Z" fill="none" stroke={`url(#g1tri-${m.letra})`} strokeWidth="2.4" strokeLinejoin="round" />
                  <text x="50" y="64" textAnchor="middle" fontFamily="var(--font-display), system-ui, sans-serif" fontSize="30" fontWeight="800" fill={m.color}>{m.letra}</text>
                </svg>
              </div>
              <p className="mt-4 font-display text-[19px] font-bold tracking-tight text-genesis-text">{m.n}</p>
              <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: m.color }}>{m.rol}</p>
            </div>
          </SectionReveal>
        ))}
      </div>

      <p className="relative mt-11 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-genesis-mist">
        <span style={{ color: G1.cyan }}>G1</span>
        <span className="mx-2 text-genesis-ghost">·</span>Una visión
        <span className="mx-2 text-genesis-ghost">·</span>Una red
        <span className="mx-2 text-genesis-ghost">·</span>Un ecosistema
      </p>
      <p className="relative mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-genesis-ghost">
        Powered by Génesis × Aitech × TAG
      </p>
    </div>
  )
}
