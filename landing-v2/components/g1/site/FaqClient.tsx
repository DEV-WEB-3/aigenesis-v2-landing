'use client'

import { useMemo, useState } from 'react'
import { TODAS_LAS_PREGUNTAS } from '@/lib/soporte/buscar'
import type { Pregunta } from '@/lib/soporte/tipos'
import { Eyebrow } from '../Eyebrow'
import { SectionReveal } from './SectionReveal'
import { G1Aurora } from './G1Aurora'
import { G1, G1_GRADIENT } from '@/lib/design/g1'

const PUBLICAS = ['Alianza Aitech', 'Token AiG', 'Sobre Genesis', 'Sobre G-Pulse', 'Membresía G-Pulse', 'Sobre Gevy', 'Credenciales', 'Acceso']
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function FaqClient() {
  const [q, setQ] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const grupos = useMemo(() => {
    const set = new Set(PUBLICAS)
    const map = new Map<string, Pregunta[]>()
    for (const p of TODAS_LAS_PREGUNTAS) {
      if (!set.has(p.categoria)) continue
      const a = map.get(p.categoria) ?? []
      a.push(p)
      map.set(p.categoria, a)
    }
    return PUBLICAS.filter((c) => map.has(c)).map((c) => ({ categoria: c, items: map.get(c)! }))
  }, [])

  const nq = norm(q.trim())
  const resultados = useMemo(() => {
    if (nq.length < 2) return null
    const out: Pregunta[] = []
    for (const g of grupos) for (const p of g.items) if (norm(p.pregunta + ' ' + p.respuesta).includes(nq)) out.push(p)
    return out
  }, [nq, grupos])

  return (
    <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)]">
      {/* hero + búsqueda */}
      <section className="relative py-[clamp(44px,8vw,90px)] text-center">
        <G1Aurora tint="calm" />
        <SectionReveal className="relative z-10">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h1 className="mx-auto mt-6 max-w-[16ch] font-display text-[clamp(32px,5.6vw,60px)] font-extrabold leading-[1.04] tracking-tight">
            Lo que{' '}
            <span style={{ background: G1_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>conviene saber.</span>
          </h1>
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-genesis-mist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca tu pregunta…"
                className="w-full rounded-full bg-genesis-surface/50 py-3.5 pl-12 pr-4 text-[15px] text-genesis-text outline-none transition-colors placeholder:text-genesis-mist"
                style={{ border: `1px solid ${G1.cyan}2e` }}
              />
            </div>
          </div>
        </SectionReveal>
      </section>

      {resultados ? (
        // resultados de búsqueda
        <section className="pb-[clamp(40px,7vw,90px)]">
          <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.18em] text-genesis-mist">
            {resultados.length} resultado{resultados.length === 1 ? '' : 's'} para “{q.trim()}”
          </p>
          <div className="overflow-hidden rounded-2xl border border-genesis-ghost/50 bg-genesis-surface/30">
            {resultados.map((p) => (
              <details key={p.id} className="group border-b border-genesis-ghost/30 last:border-b-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] font-medium text-genesis-text">{p.pregunta}</span>
                  <span className="flex-none font-mono text-[18px] leading-none transition-transform duration-300 group-open:rotate-45" style={{ color: G1.cyan }}>+</span>
                </summary>
                <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-genesis-mist">{p.respuesta}</p>
              </details>
            ))}
            {resultados.length === 0 ? <p className="px-5 py-8 text-center text-[14px] text-genesis-mist">Sin resultados. Prueba otras palabras o usa el asistente.</p> : null}
          </div>
        </section>
      ) : (
        <section className="pb-[clamp(40px,7vw,90px)]">
          <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
            {/* ÍNDICE — filtro (trae la categoría al usuario, no salta) */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: G1.amber }}>Índice</p>
              <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
                {grupos.map((g) => {
                  const on = (activeCat ?? grupos[0]?.categoria) === g.categoria
                  return (
                    <button
                      key={g.categoria}
                      type="button"
                      onClick={() => setActiveCat(g.categoria)}
                      className="group relative flex flex-none items-center justify-between gap-3 overflow-hidden rounded-xl px-4 py-3 text-left transition-transform hover:translate-x-0.5"
                      style={{ border: `1px solid ${on ? G1.cyan : `${G1.cyan}26`}`, background: on ? `${G1.cyan}12` : 'rgba(255,255,255,0.02)' }}
                    >
                      <span aria-hidden className="pointer-events-none absolute -right-5 -top-5 h-12 w-12 rounded-full blur-2xl transition-opacity" style={{ background: G1.cyan, opacity: on ? 0.55 : 0.2 }} />
                      <span className="whitespace-nowrap text-[13.5px] font-semibold lg:whitespace-normal" style={{ color: on ? G1.cyan : undefined }}>
                        <span className={on ? '' : 'text-genesis-text'}>{g.categoria}</span>
                      </span>
                      <span className="flex-none font-mono text-[11px] text-genesis-mist">{g.items.length}</span>
                    </button>
                  )
                })}
              </nav>
            </aside>

            {/* Q&A — solo la categoría activa (traída al usuario) */}
            <div className="min-w-0">
              {(() => {
                const g = grupos.find((x) => x.categoria === (activeCat ?? grupos[0]?.categoria)) ?? grupos[0]
                if (!g) return null
                return (
                  <div>
                    <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: G1.cyan }}>{g.categoria}</p>
                    <div className="overflow-hidden rounded-2xl border border-genesis-ghost/50 bg-genesis-surface/30">
                      {g.items.map((p) => (
                        <details key={p.id} className="group border-b border-genesis-ghost/30 last:border-b-0">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                            <span className="text-[15px] font-medium text-genesis-text">{p.pregunta}</span>
                            <span className="flex-none font-mono text-[18px] leading-none transition-transform duration-300 group-open:rotate-45" style={{ color: G1.cyan }}>+</span>
                          </summary>
                          <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-genesis-mist">{p.respuesta}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
