import { Eyebrow } from '../Eyebrow'
import { PillCTA } from '../PillCTA'
import { SectionReveal } from './SectionReveal'
import { G1Aurora } from './G1Aurora'
import { GlassMedia } from './GlassMedia'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

/**
 * Contenido de "Qué es G1" — compartido por la ruta /g1/que-es-g1 (con su propio
 * hero) y por la home /g1 (donde la narrativa hace de intro). `hero` controla si
 * se muestra el titular grande: en la home la narrativa ya es el hero, pero se
 * deja un eyebrow-título de sección para marcar el arranque del contenido.
 */
const ENTIDADES = [
  { k: 'La comunidad', n: 'Génesis', d: 'La comunidad que se une y aporta usabilidad y liquidez al AiG Token a través de sus productos (G-Pulse, marketplace y más).' },
  { k: 'La tecnología', n: 'Aitech', d: 'Comunidad y compañía internacional que aporta la infraestructura y las herramientas de la alianza Aitech One.' },
  { k: 'El mercado', n: 'TAG', d: 'El acceso a los mercados con la trilogía: Tag Markets (trading), Bit1 (exchange) y BixCard (tarjeta Visa cripto).' },
]

export function QueEsContent({ hero = true }: { hero?: boolean }) {
  return (
    <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)]">
      {/* arranque del contenido — con figura "fusión" en la ruta standalone */}
      <section className={`relative ${hero ? 'py-[clamp(48px,9vw,110px)]' : 'pt-[clamp(40px,7vw,90px)] pb-[clamp(24px,4vw,48px)]'} text-center`}>
        {hero ? <G1Aurora tint="brand" /> : null}
        <div className="relative z-10">
        <SectionReveal>
          <Eyebrow>Qué es G1</Eyebrow>
          {hero ? (
            <h1 className="mx-auto mt-6 max-w-[18ch] font-display text-[clamp(34px,6.2vw,68px)] font-extrabold leading-[1.04] tracking-tight">
              La marca de{' '}
              <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>la alianza.</span>
            </h1>
          ) : (
            <h2 className="mx-auto mt-5 max-w-[18ch] font-display text-[clamp(28px,4.6vw,52px)] font-extrabold leading-[1.05] tracking-tight">
              La marca de{' '}
              <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>la alianza.</span>
            </h2>
          )}
          <p className="mx-auto mt-6 max-w-[62ch] text-[clamp(15px,2vw,18px)] leading-relaxed text-genesis-mist">
            G1 es la puerta a un ecosistema donde una <b className="text-genesis-text">comunidad</b> se
            encuentra con <b className="text-genesis-text">herramientas financieras reales</b> —trading,
            exchange y tarjeta cripto— con la usabilidad del <b className="text-genesis-text">AiG&nbsp;Token</b>.
            Nace de la unión de tres movimientos.
          </p>
        </SectionReveal>
        </div>
      </section>

      {/* tres movimientos */}
      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <p className="text-center font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: G1.amber }}>
            Tres movimientos, una marca
          </p>
          <h2 className="mx-auto mt-4 max-w-[22ch] text-center font-display text-[clamp(24px,3.6vw,38px)] font-bold tracking-tight">
            Génesis △ Aitech △ TAG
          </h2>
        </SectionReveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {ENTIDADES.map((e, i) => (
            <SectionReveal key={e.n} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-genesis-ghost/50 bg-genesis-surface/40 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-genesis-mist">{e.k}</p>
                <h3 className="mt-2 font-display text-[22px] font-bold tracking-tight">{e.n}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-genesis-mist">{e.d}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* media destacada — la alianza, con presencia */}
      <section className="py-[clamp(24px,5vw,64px)]">
        <SectionReveal>
          <div className="mx-auto max-w-4xl">
            <GlassMedia motif="community" ratio="16 / 9" />
          </div>
          <p className="mx-auto mt-5 max-w-[56ch] text-center text-[14px] leading-relaxed text-genesis-mist">
            Una comunidad internacional unida por herramientas reales. Material informativo.
          </p>
        </SectionReveal>
      </section>

      {/* AiG Token */}
      <section className="py-[clamp(24px,5vw,56px)]">
        <SectionReveal>
          <div className="rounded-3xl border border-genesis-ghost/50 bg-genesis-surface/30 p-[clamp(24px,4vw,48px)]">
            <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
              <div>
                <Eyebrow>El AiG Token, con uso real</Eyebrow>
                <h2 className="mt-4 font-display text-[clamp(22px,3.2vw,34px)] font-bold tracking-tight">
                  Un token con usabilidad, no una promesa.
                </h2>
                <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-genesis-mist">
                  El AiG Token es el hilo que conecta la comunidad con las herramientas de la alianza.
                  Dentro del ecosistema se usa en formato <b className="text-genesis-text">DUAL (AIG + USDT)</b>,
                  para dar liquidez y acceso a los productos. Es material informativo: no es asesoría
                  financiera y la participación es voluntaria y con riesgos.
                </p>
              </div>
              <div className="grid gap-3">
                {['Comunidad que se une', 'Herramientas reales (trading · exchange · tarjeta)', 'Usabilidad DUAL del AiG Token'].map((t) => (
                  <div key={t} className="flex items-start gap-3 rounded-xl border border-genesis-ghost/40 bg-genesis-void/40 p-4">
                    <span className="mt-1 h-2 w-2 flex-none rounded-full" style={{ background: G1.cyan }} />
                    <span className="text-[14px] text-genesis-text">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* seguí explorando */}
      <section className="py-[clamp(40px,7vw,90px)] text-center">
        <SectionReveal>
          <h2 className="mx-auto max-w-[20ch] font-display text-[clamp(24px,3.6vw,40px)] font-bold tracking-tight">
            Explorá el ecosistema.
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <PillCTA href="/g1/ecosistema" variant="primary">Ver el ecosistema →</PillCTA>
            <PillCTA href="/g1/como-funciona" variant="ghost">Cómo funciona ↗</PillCTA>
            <PillCTA href="/g1/faq" variant="ghost">Preguntas frecuentes ↗</PillCTA>
          </div>
        </SectionReveal>
      </section>
    </div>
  )
}
