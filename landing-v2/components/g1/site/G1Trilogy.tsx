'use client'

import { G1, G1_GRADIENT } from '@/lib/design/g1'
import { SectionReveal } from './SectionReveal'
import { AllianceAccordion } from './AllianceAccordion'

/**
 * G1 TRILOGY — la alianza en glass premium, con GALERÍA ACORDEÓN.
 *
 * Cada miembro es un glassmorphy con su LOGO real (Génesis, Aitech, TAG) que se
 * expande al señalar (estilo React Bits "Accordion Gallery"), con glow de acento
 * por marca (Génesis→violeta, Aitech→cian, TAG→ámbar). Todo dentro del gran
 * cristal, que converge hacia un solo núcleo G1 (3 → 1).
 *
 * Mapeo HÍBRIDO (elegido por el owner): Génesis = comunidad + su propia
 * tecnología; Aitech = adopción y comunidad global; TAG = finanzas.
 */
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

      <div className="relative mt-10">
        <AllianceAccordion />
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
