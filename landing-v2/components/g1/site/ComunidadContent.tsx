'use client'

import { partir, useCorpus } from '@/hooks/useCorpus'
import { Eyebrow } from '../Eyebrow'
import { PillCTA } from '../PillCTA'
import { SectionReveal } from './SectionReveal'
import { G1Aurora } from './G1Aurora'
import { GlassMedia, type MediaMotif } from './GlassMedia'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

/**
 * CONTENIDO DE «COMUNIDAD» — extraído de la página para poder traducirlo.
 *
 * El porqué de la separación está en `EcosistemaContent`: `metadata` sólo existe
 * en un componente de servidor y el idioma vive en un contexto de cliente.
 *
 * LOS HORARIOS SE TRADUCEN, y no es un descuido. «13:00 · hora de Santo Domingo»
 * lleva dentro el nombre de un huso horario: la hora no cambia, pero «hora de
 * Santo Domingo» en español, para quien lee en croata, es ruido que no puede
 * interpretar. Lo que necesita entender es que hay un huso de referencia.
 */

type Evento = {
  motif: MediaMotif
  tag: string
  region: string
  title: string
  desc: string
  cuando: string
  hora: string
}

const EVENTOS: Evento[] = [
  { motif: 'markets', tag: 'Formación', region: 'Online · Latinoamérica', title: 'Formación sobre productos del ecosistema', desc: 'Sesión práctica sobre Tag Markets, Bit1 y BixCard: qué son y cómo se usan.', cuando: 'Cada lunes', hora: '13:00 · hora de Santo Domingo' },
  { motif: 'network', tag: 'Presentación', region: 'Online · Global', title: 'Presentación de la alianza', desc: 'Sesión informativa sobre G1 y la alianza Génesis × Aitech × TAG.', cuando: 'Martes y jueves', hora: '09:00 · hora de Santo Domingo' },
  { motif: 'community', tag: 'Comunidad', region: 'Online', title: 'Encuentro de la comunidad', desc: 'Novedades del ecosistema y espacio para conectar con la comunidad.', cuando: 'Cada miércoles', hora: '19:00 · hora de Santo Domingo' },
]

const PILARES = [
  { tag: 'Formación', name: 'SEED', accent: G1.violet, desc: 'El programa de formación de la comunidad: aprender el ecosistema y sus herramientas desde la base.' },
  { tag: 'Encuentro', name: 'Eventos', accent: G1.cyan, desc: 'Encuentros de la comunidad —presenciales y en línea— para conectar, compartir y crecer juntos.' },
  { tag: 'Comunidad', name: 'Liderazgo', accent: G1.amber, desc: 'La red de referentes que sostiene y acompaña a la comunidad en su recorrido.' },
]

export function ComunidadContent() {
  const c = useCorpus()
  const titular = c('La comunidad que|las une.')
  const [arriba, abajo] = partir(titular.texto)
  const entrada = c(
    'Génesis es el punto de entrada: la comunidad que reúne a las personas y les da un lugar para aprender, encontrarse y participar del ecosistema.'
  )
  const eventosIntro = c(
    'Conecta, aprende y crece junto a la comunidad del ecosistema. Sesiones informativas y de formación, en línea.'
  )
  return (
    <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)]">
      <section className="relative py-[clamp(48px,9vw,110px)] text-center">
        <G1Aurora tint="warm" />
        <SectionReveal className="relative z-10">
          <Eyebrow>{c('Comunidad').texto}</Eyebrow>
          <h1 lang={titular.lang} className="mx-auto mt-6 max-w-[18ch] font-display text-[clamp(34px,6.2vw,68px)] font-extrabold leading-[1.04] tracking-tight">
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
          {PILARES.map((p, i) => (
            <SectionReveal key={p.name} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-genesis-ghost/50 bg-genesis-surface/40 p-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.accent }} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-genesis-mist">{c(p.tag).texto}</p>
                </div>
                <h3 className="mt-3 font-display text-[21px] font-bold tracking-tight">{p.name}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-genesis-mist">{c(p.desc).texto}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* galería de eventos */}
      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.cyan }}>{c('Eventos').texto}</p>
          <h2 className="mt-3 max-w-[24ch] font-display text-[clamp(23px,3.4vw,36px)] font-bold tracking-tight">
            {c('Eventos que impulsan la comunidad.').texto}
          </h2>
          <p lang={eventosIntro.lang} className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-genesis-mist">
            {eventosIntro.texto}
          </p>
        </SectionReveal>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {EVENTOS.map((e, i) => (
            <SectionReveal key={e.title} delay={i * 0.08}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-genesis-ghost/50 bg-genesis-surface/40">
                <div className="relative p-3 pb-0">
                  <GlassMedia motif={e.motif} />
                  <span className="absolute left-5 top-5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ background: 'rgba(6,9,16,0.7)', border: `1px solid ${G1.cyan}33`, color: G1.cyan }}>
                    {c(e.tag).texto}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: G1.cyan }}>{c(e.region).texto}</p>
                  <h3 className="mt-2 font-display text-[18px] font-bold leading-tight tracking-tight">{c(e.title).texto}</h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-genesis-mist">{c(e.desc).texto}</p>
                  <div className="mt-4 space-y-1 font-mono text-[12px] text-genesis-mist">
                    <p>📅 {c(e.cuando).texto}</p>
                    <p>🕐 {c(e.hora).texto}</p>
                  </div>
                  <a
                    href="https://g-pulse.aigenesis.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 grid place-items-center rounded-full py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-genesis-void transition-transform hover:scale-[1.02]"
                    style={{ background: G1_GRADIENT }}
                  >
                    {c('Ingresar').texto} →
                  </a>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* momentos — fotos reales de la comunidad */}
      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.amber }}>{c('Momentos').texto}</p>
          <h2 className="mt-3 max-w-[24ch] font-display text-[clamp(23px,3.4vw,36px)] font-bold tracking-tight">{c('La comunidad, en persona.').texto}</h2>
        </SectionReveal>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {['02', '03', '04', '05'].map((n, i) => (
            <SectionReveal key={n} delay={i * 0.06}>
              <div className="relative overflow-hidden rounded-2xl" style={{ border: `1px solid ${G1.cyan}26`, aspectRatio: '4 / 3' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/g1/media/aitech/access/${n}.jpg`} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(160deg, ${G1.violet}1f 0%, transparent 45%, ${G1.cyan}12 100%)`, mixBlendMode: 'overlay' }} />
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="py-[clamp(40px,7vw,90px)] text-center">
        <SectionReveal>
          <h2 className="mx-auto max-w-[22ch] font-display text-[clamp(24px,3.6vw,40px)] font-bold tracking-tight">
            {c('Empieza por la comunidad.').texto}
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <PillCTA href="https://g-pulse.aigenesis.io" variant="primary">{c('Entrar a G-Pulse').texto} ↗</PillCTA>
            <PillCTA href="/g1/faq" variant="ghost">{c('Preguntas frecuentes').texto} ↗</PillCTA>
          </div>
        </SectionReveal>
      </section>
    </div>
  )
}
