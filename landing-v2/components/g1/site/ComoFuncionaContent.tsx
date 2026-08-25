'use client'

import { conEnfasis, partir, useCorpus } from '@/hooks/useCorpus'
import { Eyebrow } from '../Eyebrow'
import { PillCTA } from '../PillCTA'
import { SectionReveal } from './SectionReveal'
import { G1Aurora } from './G1Aurora'
import { GlassMedia } from './GlassMedia'
import { SideRays } from './fx'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

/**
 * CONTENIDO DE «CÓMO FUNCIONA» — extraído de la página para poder traducirlo.
 * El porqué de la separación está en `EcosistemaContent`: `metadata` sólo vive
 * en el servidor y el idioma sólo vive en el cliente.
 */

const PASOS = [
  {
    n: '01',
    t: 'Te unes por la comunidad',
    d: 'Génesis es la puerta de entrada. Desde G-Pulse accedes a la comunidad, las membresías y tu cuenta.',
    accent: G1.violet,
  },
  {
    n: '02',
    t: 'Accedes a las herramientas',
    d: 'La alianza aporta la trilogía de mercado: Tag Markets (trading), Bit1 (exchange) y BixCard (tarjeta cripto).',
    accent: G1.cyan,
  },
  {
    n: '03',
    t: 'El AiG Token conecta todo',
    d: 'El token de utilidad se usa en formato DUAL (AIG + USDT) para dar liquidez y acceso dentro del ecosistema.',
    accent: G1.amber,
  },
]

export function ComoFuncionaContent() {
  const c = useCorpus()
  const titular = c('Tu comunidad,|con herramientas reales.')
  const [arriba, abajo] = partir(titular.texto)
  const entrada = c(
    'Participar en G1 es un recorrido de tres pasos. Es material informativo: no es asesoría financiera y la participación es voluntaria y con riesgos.'
  )
  /* Con `**` para el énfasis: la frase entera es una sola clave y cada idioma
     decide qué destaca. Trocearla por los `<b>` la hacía intraducible. */
  const noDice = c(
    'G1 no publica porcentajes de resultado, comisiones, apalancamiento ni premios de ningún plan. Esa información vive solo en los canales oficiales de cada producto y bajo la responsabilidad de cada persona. Aquí contamos **qué es** y **cómo se participa**, no cuánto se obtiene.'
  )

  return (
    <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)]">
      <section className="relative py-[clamp(48px,9vw,110px)] text-center">
        <G1Aurora tint="flow" />
        <SectionReveal className="relative z-10">
          <Eyebrow>{c('Cómo funciona').texto}</Eyebrow>
          <h1 lang={titular.lang} className="mx-auto mt-6 max-w-[20ch] font-display text-[clamp(34px,6.2vw,68px)] font-extrabold leading-[1.04] tracking-tight">
            {arriba}{' '}
            <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              {abajo}
            </span>
          </h1>
          <p lang={entrada.lang} className="mx-auto mt-6 max-w-[60ch] text-[clamp(15px,2vw,18px)] leading-relaxed text-genesis-mist">
            {entrada.texto}
          </p>
        </SectionReveal>
      </section>

      <section className="pb-[clamp(24px,5vw,56px)]">
        <div className="grid gap-4 md:grid-cols-3">
          {PASOS.map((p, i) => (
            <SectionReveal key={p.n} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-genesis-ghost/50 bg-genesis-surface/40 p-6">
                <span className="font-mono text-[26px] font-bold" style={{ color: p.accent }}>{p.n}</span>
                <h3 lang={c(p.t).lang} className="mt-3 font-display text-[20px] font-bold tracking-tight">{c(p.t).texto}</h3>
                <p lang={c(p.d).lang} className="mt-3 text-[14.5px] leading-relaxed text-genesis-mist">{c(p.d).texto}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* media destacada — liberada, con presencia propia */}
      <section className="py-[clamp(32px,6vw,80px)]">
        <SectionReveal>
          <p lang={c('Las herramientas, en vivo').lang} className="text-center font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.cyan }}>
            {c('Las herramientas, en vivo').texto}
          </p>
          <h2 lang={c('Trading, exchange y tarjeta — reales.').lang} className="mx-auto mt-4 max-w-[22ch] text-center font-display text-[clamp(24px,3.6vw,40px)] font-bold tracking-tight">
            {c('Trading, exchange y tarjeta — reales.').texto}
          </h2>
          <div className="mx-auto mt-9 max-w-4xl">
            <GlassMedia motif="network" ratio="16 / 9" />
          </div>
          <p lang={c('La plataforma de la alianza en acción. Material informativo.').lang} className="mx-auto mt-5 max-w-[56ch] text-center text-[14px] leading-relaxed text-genesis-mist">
            {c('La plataforma de la alianza en acción. Material informativo.').texto}
          </p>
        </SectionReveal>
      </section>

      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-2xl border p-[clamp(20px,3vw,32px)]" style={{ borderColor: `${G1.amber}33`, background: `${G1.amber}0a` }}>
            <SideRays />
            <p lang={c('Lo que esta página no dice').lang} className="relative font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: G1.amber }}>
              {c('Lo que esta página no dice').texto}
            </p>
            <p lang={noDice.lang} className="relative mt-3 max-w-[70ch] text-[14.5px] leading-relaxed text-genesis-mist">
              {conEnfasis(noDice.texto)}
            </p>
          </div>
        </SectionReveal>
      </section>

      <section className="py-[clamp(40px,7vw,90px)] text-center">
        <SectionReveal>
          <div className="flex flex-wrap justify-center gap-3">
            <PillCTA href="/g1/ecosistema" variant="primary">{c('Ver el ecosistema').texto} →</PillCTA>
            <PillCTA href="/g1/faq" variant="ghost">{c('Preguntas frecuentes').texto} ↗</PillCTA>
          </div>
        </SectionReveal>
      </section>
    </div>
  )
}
