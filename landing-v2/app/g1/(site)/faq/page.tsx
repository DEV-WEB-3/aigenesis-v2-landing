import type { Metadata } from 'next'
import { TODAS_LAS_PREGUNTAS } from '@/lib/soporte/buscar'
import type { Pregunta } from '@/lib/soporte/tipos'
import { Eyebrow } from '@/components/g1/Eyebrow'
import { PillCTA } from '@/components/g1/PillCTA'
import { SectionReveal } from '@/components/g1/site/SectionReveal'
import { G1PageFigure } from '@/components/g1/site/G1PageFigure'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes — G1',
  description:
    'Preguntas frecuentes sobre G1, la alianza, el AiG Token, G-Pulse y las credenciales. Respuestas del corpus verificado. Material informativo.',
}

// Solo categorías PÚBLICAS del corpus (se excluye lo operativo interno: P2P, Hold,
// Pagar, Envío, Red y compensación, Casos históricos, etc.).
const PUBLICAS = [
  'Alianza Aitech',
  'Token AiG',
  'Sobre Genesis',
  'Sobre G-Pulse',
  'Membresía G-Pulse',
  'Sobre Gevy',
  'Credenciales',
  'Acceso',
]

function agrupar(): { categoria: string; items: Pregunta[] }[] {
  const set = new Set(PUBLICAS)
  const porCat = new Map<string, Pregunta[]>()
  for (const q of TODAS_LAS_PREGUNTAS) {
    if (!set.has(q.categoria)) continue
    const arr = porCat.get(q.categoria) ?? []
    arr.push(q)
    porCat.set(q.categoria, arr)
  }
  // orden estable según PUBLICAS
  return PUBLICAS.filter((c) => porCat.has(c)).map((c) => ({ categoria: c, items: porCat.get(c)! }))
}

export default function FaqPage() {
  const grupos = agrupar()
  return (
    <div className="mx-auto max-w-4xl px-[clamp(16px,4vw,40px)]">
      <section className="relative overflow-hidden py-[clamp(48px,9vw,100px)] text-center">
        <G1PageFigure variant="grid" />
        <SectionReveal className="relative z-10">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h1 className="mx-auto mt-6 max-w-[16ch] font-display text-[clamp(32px,5.6vw,60px)] font-extrabold leading-[1.04] tracking-tight">
            Lo que{' '}
            <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              conviene saber.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[56ch] text-[clamp(15px,2vw,18px)] leading-relaxed text-genesis-mist">
            Respuestas del corpus verificado de Génesis. Es material informativo: no es asesoría
            financiera. ¿No está tu pregunta? El asistente puede ayudarte.
          </p>
        </SectionReveal>
      </section>

      <section className="pb-[clamp(40px,7vw,90px)]">
        {grupos.map((g, gi) => (
          <SectionReveal key={g.categoria} delay={gi * 0.04}>
            <div className="mb-10">
              <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: G1.cyan }}>
                {g.categoria}
              </p>
              <div className="overflow-hidden rounded-2xl border border-genesis-ghost/50 bg-genesis-surface/30">
                {g.items.map((q) => (
                  <details key={q.id} className="group border-b border-genesis-ghost/30 last:border-b-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="text-[15px] font-medium text-genesis-text">{q.pregunta}</span>
                      <span
                        aria-hidden
                        className="flex-none font-mono text-[18px] leading-none text-genesis-mist transition-transform duration-300 group-open:rotate-45"
                        style={{ color: G1.cyan }}
                      >
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-genesis-mist">{q.respuesta}</p>
                  </details>
                ))}
              </div>
            </div>
          </SectionReveal>
        ))}

        <SectionReveal>
          <div className="mt-4 text-center">
            <PillCTA href="/g1/ecosistema" variant="ghost">Volver al ecosistema ↗</PillCTA>
          </div>
        </SectionReveal>
      </section>
    </div>
  )
}
