import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/g1/Eyebrow'
import { PillCTA } from '@/components/g1/PillCTA'
import { DisclaimerBar } from '@/components/g1/DisclaimerBar'
import { CredentialStrip } from '@/components/g1/CredentialStrip'
import { G1, VOID, INK } from '@/lib/design/g1'

/*
 * PÁGINA DE ESTILO G1 (F1) — el "storybook simple" revisable.
 *
 * No es una ruta de marketing: es la referencia viva de tokens y componentes
 * base de G1, para que el auditor y el equipo vean la fundación antes de F2.
 * `noindex`: no debe aparecer en buscadores.
 */
export const metadata: Metadata = {
  title: 'G1 · Sistema de diseño',
  robots: { index: false, follow: false },
}

const SWATCHES: { name: string; value: string; note?: string }[] = [
  { name: 'Vacío (fondo)', value: VOID.black },
  { name: 'Base sección', value: VOID.base },
  { name: 'Superficie', value: VOID.surface },
  { name: 'Violeta (firma)', value: G1.violet },
  { name: 'Cian (acento)', value: G1.cyan },
  { name: 'Magenta', value: G1.magenta },
  { name: 'Ámbar (energía G1)', value: G1.amber, note: 'único color propio de G1' },
  { name: 'Texto', value: INK.base },
  { name: 'Texto tenue', value: INK.muted },
]

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-genesis-ghost/40 py-10">
      <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-genesis-mist">{title}</h2>
      {children}
    </section>
  )
}

export default function G1StylePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-genesis-text">
      <Eyebrow>Génesis · G1 — sistema de diseño · F1</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
        Fundación visual G1
      </h1>
      <p className="mt-3 max-w-2xl text-genesis-mist">
        Tokens y componentes base sobre la identidad Génesis. Referencia para el auditor antes de F2 (hero WebGL).
      </p>

      <Block title="Paleta">
        <div className="flex flex-wrap gap-3">
          {SWATCHES.map((s) => (
            <div key={s.name} className="w-40 rounded-xl border border-genesis-ghost/50 bg-genesis-surface/40 p-3">
              <span className="block h-10 w-full rounded-md" style={{ background: s.value }} />
              <span className="mt-2 block text-[13px] font-semibold">{s.name}</span>
              <code className="font-mono text-[11px] text-genesis-mist">{s.value}</code>
              {s.note ? <span className="mt-1 block font-mono text-[9.5px] text-genesis-ghost">{s.note}</span> : null}
            </div>
          ))}
        </div>
      </Block>

      <Block title="Tipografía">
        <div className="space-y-4">
          <p className="font-display text-3xl font-extrabold tracking-tight">Space Grotesk — display</p>
          <p className="font-body text-lg">Inter — cuerpo. El texto legible de las secciones.</p>
          <p className="font-mono text-sm text-genesis-mist">IBM Plex Mono — etiquetas, datos, eyebrows.</p>
        </div>
      </Block>

      <Block title="Botones (PillCTA)">
        <div className="flex flex-wrap gap-3">
          <PillCTA href="#" variant="primary">Conocer el ecosistema →</PillCTA>
          <PillCTA href="#" variant="ghost">Cómo funciona ↗</PillCTA>
        </div>
      </Block>

      <Block title="Eyebrow">
        <Eyebrow>Génesis × Aitech × TAG</Eyebrow>
      </Block>

      <Block title="CredentialStrip — atribuir, no certificar">
        <CredentialStrip />
      </Block>

      <Block title="DisclaimerBar">
        <DisclaimerBar />
      </Block>

      <p className="mt-12 font-mono text-[11px] text-genesis-ghost">
        F1 · fundación · sobre aigenesis-v2-landing · siguiente: F2 (hero WebGL con R3F + ParticleMorphSystem).
      </p>
    </main>
  )
}
