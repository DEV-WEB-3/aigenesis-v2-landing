import type { Metadata } from 'next'
import { Eyebrow } from '@/components/g1/Eyebrow'
import { PillCTA } from '@/components/g1/PillCTA'
import { SectionReveal } from '@/components/g1/site/SectionReveal'
import { G1Aurora } from '@/components/g1/site/G1Aurora'
import { ProductCard, type Producto } from '@/components/g1/site/ProductCard'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

export const metadata: Metadata = {
  title: 'Ecosistema G1 — la trilogía y los productos',
  description:
    'El ecosistema G1: la trilogía de mercado de la alianza (Tag Markets, Bit1, BixCard) y los productos de la comunidad Génesis (G-Pulse, Gevy, AiG Token). Material informativo.',
}

const TRILOGIA: Producto[] = [
  { tag: 'TAG · trading', name: 'Tag Markets', accent: 'cyan', href: 'https://www.tagmarkets.com', desc: 'Bróker de trading sistemático: acceso a los mercados con herramientas profesionales de la alianza.' },
  { tag: 'TAG · exchange', name: 'Bit1', accent: 'blue', href: 'https://www.bit1.com', desc: 'Exchange de activos digitales para comprar, vender y custodiar cripto dentro del ecosistema.' },
  { tag: 'TAG · tarjeta', name: 'BixCard · BIX', accent: 'amber', desc: 'Tarjeta Visa respaldada por cripto para usar tus activos en el día a día.' },
]

const GENESIS: Producto[] = [
  { tag: 'Génesis · panel', name: 'G-Pulse', accent: 'violet', href: 'https://g-pulse.aigenesis.io', desc: 'El panel de la comunidad: membresías, actividad y el acceso a tu cuenta.' },
  { tag: 'Génesis · marca hija', name: 'Gevy', accent: 'magenta', desc: 'Marca hija de Génesis, con su propia identidad bilingüe dentro del ecosistema.' },
  { tag: 'Génesis · token', name: 'AiG Token', accent: 'cyan', desc: 'El token de utilidad del ecosistema, usado en formato DUAL (AIG + USDT) para dar liquidez y acceso.' },
]

export default function EcosistemaPage() {
  return (
    <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)]">
      {/* hero */}
      <section className="relative overflow-hidden py-[clamp(48px,9vw,110px)] text-center">
        <G1Aurora tint="eco" />
        <SectionReveal className="relative z-10">
          <Eyebrow>Ecosistema</Eyebrow>
          <h1 className="mx-auto mt-6 max-w-[20ch] font-display text-[clamp(34px,6.2vw,68px)] font-extrabold leading-[1.04] tracking-tight">
            Una comunidad,{' '}
            <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              herramientas reales.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[62ch] text-[clamp(15px,2vw,18px)] leading-relaxed text-genesis-mist">
            La alianza aporta el acceso a los mercados; Génesis aporta la comunidad y la usabilidad
            del AiG&nbsp;Token. Todo lo que integra el ecosistema, en un solo lugar.
          </p>
        </SectionReveal>
      </section>

      {/* trilogía */}
      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.cyan }}>
            La trilogía de mercado · TAG
          </p>
          <h2 className="mt-3 max-w-[24ch] font-display text-[clamp(23px,3.4vw,36px)] font-bold tracking-tight">
            Trading, exchange y tarjeta.
          </h2>
        </SectionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TRILOGIA.map((p, i) => (
            <SectionReveal key={p.name} delay={i * 0.08}>
              <ProductCard {...p} />
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* génesis */}
      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.amber }}>
            La comunidad · Génesis
          </p>
          <h2 className="mt-3 max-w-[24ch] font-display text-[clamp(23px,3.4vw,36px)] font-bold tracking-tight">
            El motor de la comunidad.
          </h2>
        </SectionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {GENESIS.map((p, i) => (
            <SectionReveal key={p.name} delay={i * 0.08}>
              <ProductCard {...p} />
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-[clamp(40px,7vw,90px)] text-center">
        <SectionReveal>
          <h2 className="mx-auto max-w-[20ch] font-display text-[clamp(24px,3.6vw,40px)] font-bold tracking-tight">
            ¿Cómo se participa?
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <PillCTA href="/g1/como-funciona" variant="primary">Cómo funciona →</PillCTA>
            <PillCTA href="/g1/comunidad" variant="ghost">La comunidad ↗</PillCTA>
          </div>
        </SectionReveal>
      </section>
    </div>
  )
}
