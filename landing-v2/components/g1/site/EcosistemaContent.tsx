'use client'

import { partir, pegarMarca, useCorpus } from '@/hooks/useCorpus'
import { Eyebrow } from '../Eyebrow'
import { PillCTA } from '../PillCTA'
import { SectionReveal } from './SectionReveal'
import { G1Aurora } from './G1Aurora'
import { ProductCard, type Producto } from './ProductCard'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

/**
 * CONTENIDO DE «ECOSISTEMA» — extraído de la página para poder traducirlo.
 *
 * POR QUÉ VIVE APARTE DE `app/g1/(site)/ecosistema/page.tsx`.
 * Esa página exporta `metadata`, y `metadata` sólo existe en un componente de
 * SERVIDOR. El sistema de traducción es un contexto de React que vive en el
 * cliente. Las dos cosas no caben en el mismo archivo: o hay metadatos para los
 * buscadores, o hay idioma para las personas.
 *
 * Se parte en dos: la página se queda como una cáscara de servidor con sus
 * metadatos, y todo lo que se lee vive aquí. Es el mismo patrón que ya seguía
 * `QueEsContent`.
 *
 * LOS NOMBRES DE PRODUCTO NO SE TRADUCEN —«Tag Markets», «Bit1», «BixCard»,
 * «G-Pulse», «Gevy», «AiG Token»—; sí su etiqueta y su descripción.
 */

const TRILOGIA: Producto[] = [
  { tag: 'TAG · trading', name: 'Tag Markets', accent: 'cyan', motif: 'markets', href: 'https://www.tagmarkets.com', desc: 'Bróker de trading sistemático: acceso a los mercados con herramientas profesionales de la alianza.' },
  { tag: 'TAG · exchange', name: 'Bit1', accent: 'blue', motif: 'network', href: 'https://www.bit1.com', desc: 'Exchange de activos digitales para comprar, vender y custodiar cripto dentro del ecosistema.' },
  { tag: 'TAG · tarjeta', name: 'BixCard · BIX', accent: 'amber', motif: 'card', desc: 'Tarjeta Visa respaldada por cripto para usar tus activos en el día a día.' },
]

const GENESIS: Producto[] = [
  { tag: 'Génesis · panel', name: 'G-Pulse', accent: 'violet', motif: 'community', href: 'https://g-pulse.aigenesis.io', desc: 'El panel de la comunidad: membresías, actividad y el acceso a tu cuenta.' },
  { tag: 'Génesis · marca hija', name: 'Gevy', accent: 'magenta', motif: 'community', desc: 'Marca hija de Génesis, con su propia identidad bilingüe dentro del ecosistema.' },
  { tag: 'Génesis · token', name: 'AiG Token', accent: 'cyan', motif: 'token', desc: 'El token de utilidad del ecosistema, usado en formato DUAL (AIG + USDT) para dar liquidez y acceso.' },
]

export function EcosistemaContent() {
  const c = useCorpus()
  const titular = c('Una comunidad,|herramientas reales.')
  const [arriba, abajo] = partir(titular.texto)
  const entrada = c(
    'La alianza aporta el acceso a los mercados; Génesis aporta la comunidad y la usabilidad del AiG Token. Todo lo que integra el ecosistema, en un solo lugar.'
  )
  /* Se traducen la etiqueta y la descripción; el nombre viaja tal cual. */
  const traducido = (p: Producto): Producto => ({ ...p, tag: c(p.tag).texto, desc: c(p.desc).texto })

  return (
    <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)]">
      {/* hero */}
      <section className="relative py-[clamp(48px,9vw,110px)] text-center">
        <G1Aurora tint="eco" />
        <SectionReveal className="relative z-10">
          <Eyebrow>{c('Ecosistema').texto}</Eyebrow>
          <h1 lang={titular.lang} className="mx-auto mt-6 max-w-[20ch] font-display text-[clamp(34px,6.2vw,68px)] font-extrabold leading-[1.04] tracking-tight">
            {arriba}{' '}
            <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              {abajo}
            </span>
          </h1>
          <p lang={entrada.lang} className="mx-auto mt-6 max-w-[62ch] text-[clamp(15px,2vw,18px)] leading-relaxed text-genesis-mist">
            {pegarMarca(entrada.texto)}
          </p>
        </SectionReveal>
      </section>

      {/* franja de logos de la alianza */}
      <section className="pb-[clamp(16px,3vw,32px)]">
        <SectionReveal>
          <div className="flex flex-wrap items-center justify-center gap-x-[clamp(28px,6vw,72px)] gap-y-6 rounded-2xl border py-7" style={{ borderColor: `${G1.cyan}1f`, background: 'rgba(255,255,255,0.02)' }}>
            {['tag-markets', 'bit1', 'bix'].map((l) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={l} src={`/g1/media/aitech-brand/partners/${l}.png`} alt="" className="h-7 w-auto opacity-70 transition-opacity hover:opacity-100 sm:h-8" />
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* trilogía */}
      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <p lang={c('La trilogía de mercado · TAG').lang} className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.cyan }}>
            {c('La trilogía de mercado · TAG').texto}
          </p>
          <h2 lang={c('Trading, exchange y tarjeta.').lang} className="mt-3 max-w-[24ch] font-display text-[clamp(23px,3.4vw,36px)] font-bold tracking-tight">
            {c('Trading, exchange y tarjeta.').texto}
          </h2>
        </SectionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TRILOGIA.map((p, i) => (
            <SectionReveal key={p.name} delay={i * 0.08}>
              <ProductCard {...traducido(p)} />
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* génesis */}
      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <p lang={c('La comunidad · Génesis').lang} className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.amber }}>
            {c('La comunidad · Génesis').texto}
          </p>
          <h2 lang={c('El motor de la comunidad.').lang} className="mt-3 max-w-[24ch] font-display text-[clamp(23px,3.4vw,36px)] font-bold tracking-tight">
            {c('El motor de la comunidad.').texto}
          </h2>
        </SectionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {GENESIS.map((p, i) => (
            <SectionReveal key={p.name} delay={i * 0.08}>
              <ProductCard {...traducido(p)} />
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-[clamp(40px,7vw,90px)] text-center">
        <SectionReveal>
          <h2 lang={c('¿Cómo se participa?').lang} className="mx-auto max-w-[20ch] font-display text-[clamp(24px,3.6vw,40px)] font-bold tracking-tight">
            {c('¿Cómo se participa?').texto}
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <PillCTA href="/g1/como-funciona" variant="primary">{c('Cómo funciona').texto} →</PillCTA>
            <PillCTA href="/g1/comunidad" variant="ghost">{c('La comunidad').texto} ↗</PillCTA>
          </div>
        </SectionReveal>
      </section>
    </div>
  )
}
