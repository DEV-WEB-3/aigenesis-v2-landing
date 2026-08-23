import type { Metadata } from 'next'
import { G1Narrative } from '@/components/g1/scenes/G1Narrative'
import { Eyebrow } from '@/components/g1/Eyebrow'
import { PillCTA } from '@/components/g1/PillCTA'
import { SectionReveal } from '@/components/g1/site/SectionReveal'
import { ProductCard, type Producto } from '@/components/g1/site/ProductCard'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

export const metadata: Metadata = {
  title: 'G1 — tu comunidad, con herramientas reales',
  description:
    'G1 es la marca de la alianza Génesis × Aitech × TAG: comunidad con herramientas financieras reales (trading, exchange, tarjeta cripto) y la usabilidad del AiG Token. Material informativo.',
}

const TEASER: Producto[] = [
  { tag: 'La comunidad', name: 'Génesis', accent: 'violet', desc: 'La comunidad que se une y da usabilidad al AiG Token.' },
  { tag: 'La tecnología', name: 'Aitech', accent: 'cyan', desc: 'La infraestructura y las herramientas de la alianza Aitech One.' },
  { tag: 'El mercado', name: 'TAG', accent: 'amber', desc: 'Tag Markets, Bit1 y BixCard: trading, exchange y tarjeta cripto.' },
]

export default function G1Home() {
  return (
    <>
      {/* ENTRADA — la narrativa (stage fijo). El contenido de abajo scrollea por encima. */}
      <G1Narrative />

      {/* CONTENIDO — sobre el fondo ambiente persistente (z-10, semi-transparente) */}
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)]">
          {/* qué es */}
          <section className="py-[clamp(56px,10vw,120px)] text-center">
            <SectionReveal>
              <Eyebrow>Qué es G1</Eyebrow>
              <h2 className="mx-auto mt-6 max-w-[20ch] font-display text-[clamp(30px,5.4vw,58px)] font-extrabold leading-[1.05] tracking-tight">
                La marca de{' '}
                <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  la alianza.
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-[62ch] text-[clamp(15px,2vw,18px)] leading-relaxed text-genesis-mist">
                Una comunidad se encuentra con herramientas financieras reales —trading, exchange y
                tarjeta cripto— con la usabilidad del AiG&nbsp;Token. Nace de la unión de tres movimientos.
              </p>
            </SectionReveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {TEASER.map((p, i) => (
                <SectionReveal key={p.name} delay={i * 0.08}>
                  <ProductCard {...p} />
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* ecosistema teaser */}
          <section className="py-[clamp(32px,6vw,80px)]">
            <SectionReveal>
              <div className="rounded-3xl border border-genesis-ghost/50 bg-genesis-surface/30 p-[clamp(24px,4vw,52px)] text-center">
                <p className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.cyan }}>
                  El ecosistema
                </p>
                <h2 className="mx-auto mt-4 max-w-[24ch] font-display text-[clamp(24px,3.6vw,40px)] font-bold tracking-tight">
                  Trading, exchange, tarjeta — y una comunidad.
                </h2>
                <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-relaxed text-genesis-mist">
                  Tag Markets · Bit1 · BixCard de la alianza; G-Pulse, Gevy y el AiG&nbsp;Token de Génesis.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <PillCTA href="/g1/ecosistema" variant="primary">Ver el ecosistema →</PillCTA>
                  <PillCTA href="/g1/como-funciona" variant="ghost">Cómo funciona ↗</PillCTA>
                </div>
              </div>
            </SectionReveal>
          </section>

          {/* accesos finales */}
          <section className="py-[clamp(40px,7vw,90px)] text-center">
            <SectionReveal>
              <h2 className="mx-auto max-w-[20ch] font-display text-[clamp(26px,4vw,44px)] font-extrabold tracking-tight">
                Empezá por la comunidad.
              </h2>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <PillCTA href="/g1/que-es-g1" variant="ghost">Qué es G1 ↗</PillCTA>
                <PillCTA href="/g1/faq" variant="ghost">Preguntas frecuentes ↗</PillCTA>
                <PillCTA href="https://g-pulse.aigenesis.io" variant="primary">Entrar a G-Pulse ↗</PillCTA>
              </div>
            </SectionReveal>
          </section>
        </div>
      </div>
    </>
  )
}
