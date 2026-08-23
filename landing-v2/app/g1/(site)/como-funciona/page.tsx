import type { Metadata } from 'next'
import { Eyebrow } from '@/components/g1/Eyebrow'
import { PillCTA } from '@/components/g1/PillCTA'
import { SectionReveal } from '@/components/g1/site/SectionReveal'
import { G1Aurora } from '@/components/g1/site/G1Aurora'
import { GlassMedia } from '@/components/g1/site/GlassMedia'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

export const metadata: Metadata = {
  title: 'Cómo funciona G1',
  description:
    'Cómo se participa en G1: te unís por la comunidad, accedés a las herramientas de la alianza y el AiG Token conecta todo. Material informativo, sin promesas de resultado.',
}

const PASOS = [
  {
    n: '01',
    t: 'Te unís por la comunidad',
    d: 'Génesis es la puerta de entrada. Desde G-Pulse accedés a la comunidad, las membresías y tu cuenta.',
    accent: G1.violet,
  },
  {
    n: '02',
    t: 'Accedés a las herramientas',
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

export default function ComoFuncionaPage() {
  return (
    <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)]">
      <section className="relative overflow-hidden py-[clamp(48px,9vw,110px)] text-center">
        <G1Aurora tint="flow" />
        <SectionReveal className="relative z-10">
          <Eyebrow>Cómo funciona</Eyebrow>
          <h1 className="mx-auto mt-6 max-w-[20ch] font-display text-[clamp(34px,6.2vw,68px)] font-extrabold leading-[1.04] tracking-tight">
            Tu comunidad,{' '}
            <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              con herramientas reales.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[60ch] text-[clamp(15px,2vw,18px)] leading-relaxed text-genesis-mist">
            Participar en G1 es un recorrido de tres pasos. Es material informativo: no es asesoría
            financiera y la participación es voluntaria y con riesgos.
          </p>
        </SectionReveal>
      </section>

      <section className="pb-[clamp(24px,5vw,56px)]">
        <div className="grid gap-4 md:grid-cols-3">
          {PASOS.map((p, i) => (
            <SectionReveal key={p.n} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-genesis-ghost/50 bg-genesis-surface/40 p-6">
                <span className="font-mono text-[26px] font-bold" style={{ color: p.accent }}>{p.n}</span>
                <h3 className="mt-3 font-display text-[20px] font-bold tracking-tight">{p.t}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-genesis-mist">{p.d}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* media destacada — liberada, con presencia propia */}
      <section className="py-[clamp(32px,6vw,80px)]">
        <SectionReveal>
          <p className="text-center font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.cyan }}>Las herramientas, en vivo</p>
          <h2 className="mx-auto mt-4 max-w-[22ch] text-center font-display text-[clamp(24px,3.6vw,40px)] font-bold tracking-tight">
            Trading, exchange y tarjeta — reales.
          </h2>
          <div className="mx-auto mt-9 max-w-4xl">
            <GlassMedia motif="network" ratio="16 / 9" />
          </div>
          <p className="mx-auto mt-5 max-w-[56ch] text-center text-[14px] leading-relaxed text-genesis-mist">
            La plataforma de la alianza en acción. Material informativo.
          </p>
        </SectionReveal>
      </section>

      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <div className="rounded-2xl border p-[clamp(20px,3vw,32px)]" style={{ borderColor: `${G1.amber}33`, background: `${G1.amber}0a` }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: G1.amber }}>Lo que esta página no dice</p>
            <p className="mt-3 max-w-[70ch] text-[14.5px] leading-relaxed text-genesis-mist">
              G1 no publica porcentajes de resultado, comisiones, apalancamiento ni premios de ningún
              plan. Esa información vive solo en los canales oficiales de cada producto y bajo la
              responsabilidad de cada persona. Acá contamos <b className="text-genesis-text">qué es</b> y
              <b className="text-genesis-text"> cómo se participa</b>, no cuánto se obtiene.
            </p>
          </div>
        </SectionReveal>
      </section>

      <section className="py-[clamp(40px,7vw,90px)] text-center">
        <SectionReveal>
          <div className="flex flex-wrap justify-center gap-3">
            <PillCTA href="/g1/ecosistema" variant="primary">Ver el ecosistema →</PillCTA>
            <PillCTA href="/g1/faq" variant="ghost">Preguntas frecuentes ↗</PillCTA>
          </div>
        </SectionReveal>
      </section>
    </div>
  )
}
