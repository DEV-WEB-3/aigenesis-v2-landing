'use client'

/*
 * EL MENSAJERO FLOTANTE — Fase B completa.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * Botón «Núcleo» (M1, la base de bit1/Intercom traducida a la firma) que
 * abre una app en miniatura con tres pestañas:
 *
 *   INICIO    saludo + «Hacer una pregunta» + sugeridos MEDIDOS (los cuatro
 *             salen de los 789 mensajes reales de soporte, no de intuición).
 *             SIN buscador: con el cerebro actual, buscar y preguntar
 *             consultan lo mismo — sería el mismo botón dos veces (decisión
 *             del owner, 20-ago). El buscador vive en Ayuda.
 *   MENSAJES  conversaciones persistentes (localStorage hoy; cuenta en C).
 *   AYUDA     buscador + colecciones DERIVADAS del corpus → lista → artículo.
 *
 * Más dos vistas internas: CHAT y ARTÍCULO (con fuente declarada, feedback y
 * salida al centro de ayuda). Cada vista PERTENECE a una pestaña aunque se
 * llegue por automático — sin ese mapa, el CTA dejaba las tres apagadas y la
 * persona no sabía dónde estaba.
 *
 * El botón tiene dos fases con transición (burbuja ⇄ chevrón): pulsa y me
 * pliego. El panel entra y sale con animación — nada queda estático.
 *
 * Todo esto se decidió sobre la maqueta interactiva (artefacto «Asistente
 * Genesis») y el plan `docs/plan-asistente-mensajero.md`.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useT } from '@/context/IdiomaContext'
import { rutaPublica } from '@/lib/rutaPublica'
import { TODAS_LAS_PREGUNTAS, responder } from '@/lib/soporte/buscar'
import type { Pregunta } from '@/lib/soporte/tipos'
import {
  type Conversacion,
  type TurnoGuardado,
  conTurno,
  guardarConversacion,
  guardarFeedback,
  leerFeedback,
  listarConversaciones,
  nuevaConversacion,
  rehidratar,
  type Valoracion,
} from '@/lib/soporte/conversaciones'
import AsistenteChat from './AsistenteChat'
import ZonaDeslizable from './ZonaDeslizable'

const EQUIPO = [
  { nombre: 'Andrés', foto: '/soporte/andres.jpg' },
  { nombre: 'Valeria', foto: '/soporte/valeria.jpg' },
  { nombre: 'Marco', foto: '/soporte/marco.jpg' },
] as const

/* Los cuatro sugeridos: medidos sobre los canales reales, no elegidos a ojo. */
const SUGERIDOS = [
  'gen-hold-anclado',
  'gen-cuanto-tarda-reclamo',
  'gen-hold-donde-cuenta',
  'gen-p2p-que-es',
] as const

type Vista = 'inicio' | 'mensajes' | 'ayuda' | 'chat' | 'lista' | 'articulo'

/* Cada vista pertenece a una pestaña, aunque se llegue por automático. */
const PESTANA_DE: Record<Vista, 'inicio' | 'mensajes' | 'ayuda'> = {
  inicio: 'inicio',
  mensajes: 'mensajes',
  ayuda: 'ayuda',
  chat: 'mensajes',
  lista: 'ayuda',
  articulo: 'ayuda',
}

const porId = new Map(TODAS_LAS_PREGUNTAS.map((p) => [p.id, p]))

/* Rótulo humano de la fuente — la trazabilidad que la referencia no tiene. */
const FUENTES: Record<Pregunta['fuente'], string> = {
  landing: 'la web oficial',
  owner: 'el equipo',
  codigo: 'el código del producto',
  producto: 'el producto en vivo',
  porDefinir: 'pendiente de confirmar con el equipo',
}

export default function AsistenteFlotante() {
  const t = useT()
  const [abierto, setAbierto] = useState(false)
  const [cerrando, setCerrando] = useState(false)
  const [vista, setVista] = useState<Vista>('inicio')
  const [conv, setConv] = useState<Conversacion | null>(null)
  const [articulo, setArticulo] = useState<Pregunta | null>(null)
  const [coleccion, setColeccion] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [historial, setHistorial] = useState<readonly Conversacion[]>([])
  const [valorado, setValorado] = useState<Valoracion | null>(null)

  /* Colecciones derivadas del corpus — jamás una lista a mano. */
  const colecciones = useMemo(() => {
    const m = new Map<string, Pregunta[]>()
    for (const p of TODAS_LAS_PREGUNTAS) {
      const lista = m.get(p.categoria) ?? []
      lista.push(p)
      m.set(p.categoria, lista)
    }
    return Array.from(m.entries())
  }, [])

  const cerrar = useCallback(() => {
    if (!abierto) return
    setCerrando(true)
    window.setTimeout(() => {
      setAbierto(false)
      setCerrando(false)
    }, 200)
  }, [abierto])

  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [abierto, cerrar])

  const irA = (v: Vista) => {
    if (v === 'mensajes') setHistorial(listarConversaciones())
    setVista(v)
  }

  const abrirChatNuevo = () => {
    setConv(nuevaConversacion())
    irA('chat')
  }

  const alTurno = (turno: TurnoGuardado) => {
    setConv((actual) => {
      const base = actual ?? nuevaConversacion()
      const siguiente = conTurno(base, turno)
      guardarConversacion(siguiente)
      return siguiente
    })
  }

  const abrirArticulo = (p: Pregunta) => {
    setArticulo(p)
    setValorado(leerFeedback(p.id))
    irA('articulo')
  }

  const buscarEnAyuda = () => {
    const q = busqueda.trim()
    if (q.length < 3) return
    setBusqueda('')
    const r = responder(q)
    if (r.tipo === 'respuesta') {
      abrirArticulo(r.pregunta)
    } else {
      /* Sin acierto claro: al chat, que sabe derivar con honestidad. */
      setConv(nuevaConversacion())
      irA('chat')
      alTurno({ q, t: 'd', rel: r.sugerencias.map((p) => p.id) })
    }
  }

  const volver = () => irA(vista === 'articulo' || vista === 'lista' ? 'ayuda' : 'inicio')

  const pestanaActiva = PESTANA_DE[vista]
  const turnosVivos = useMemo(() => rehidratar(conv?.turnos ?? []), [conv])

  return (
    <>
      {abierto ? (
        <section
          aria-label={t('Asistente de soporte')}
          className={`fixed inset-x-3 bottom-3 top-16 z-40 flex flex-col overflow-hidden rounded-2xl border border-genesis-ghost bg-genesis-base/95 shadow-2xl backdrop-blur-xl transition-all duration-200 sm:inset-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[min(680px,calc(100vh-8rem))] sm:w-[400px] ${
            cerrando ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          {/* ── Cabecera ── */}
          <header className="flex flex-none items-center gap-2 border-b border-genesis-ghost px-4 py-3">
            {vista !== 'inicio' && vista !== 'mensajes' && vista !== 'ayuda' ? (
              <button
                type="button"
                onClick={volver}
                aria-label={t('Volver')}
                className="rounded-md px-1.5 text-lg text-genesis-mist transition-colors hover:text-genesis-text"
              >
                ‹
              </button>
            ) : null}
            <span className="h-8 w-8 flex-none rounded-full bg-gradient-genesis-signature" aria-hidden />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-genesis-text">{t('Asistente Genesis')}</p>
              <p className="truncate text-xs text-genesis-mist">
                {t('Respuestas verificadas · si no sabe, lo dice')}
              </p>
            </div>
            <button
              type="button"
              onClick={cerrar}
              aria-label={t('Cerrar el asistente')}
              className="ml-auto rounded-md p-1.5 text-genesis-mist transition-colors hover:text-genesis-text"
            >
              ✕
            </button>
          </header>

          {/* ── Vistas ── */}
          <div className="flex min-h-0 flex-1 flex-col">
            {vista === 'inicio' ? (
              <ZonaDeslizable className="p-4">
                <div className="flex items-end gap-4 pb-2">
                  {EQUIPO.map((p) => (
                    <figure key={p.nombre} className="m-0 flex flex-col items-center gap-1">
                      <span className="block rounded-full bg-gradient-genesis-signature p-0.5">
                        <Image
                          src={rutaPublica(p.foto)}
                          alt={p.nombre}
                          width={44}
                          height={44}
                          className="block rounded-full object-cover"
                        />
                      </span>
                      <figcaption className="text-[10px] text-genesis-mist">{p.nombre}</figcaption>
                    </figure>
                  ))}
                </div>
                <h2 className="mb-4 mt-2 text-2xl font-semibold leading-tight text-genesis-text">
                  {t('Hola')} 👋
                  <br />
                  {t('¿Cómo podemos ayudarte?')}
                </h2>
                <button
                  type="button"
                  onClick={abrirChatNuevo}
                  className="mb-4 flex w-full items-center justify-between rounded-xl surface-card px-4 py-3.5 text-sm font-semibold text-genesis-text transition-colors hover:border-genesis-ion"
                >
                  {t('Hacer una pregunta')} <span className="text-genesis-ion">➤</span>
                </button>
                <div className="overflow-hidden rounded-xl border border-genesis-ghost" lang="es">
                  {SUGERIDOS.map((id) => {
                    const p = porId.get(id)
                    if (!p) return null
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => abrirArticulo(p)}
                        className="flex w-full items-center justify-between gap-2 border-t border-genesis-ghost/50 px-4 py-3 text-left text-[13px] text-genesis-text first:border-t-0 hover:bg-genesis-surface/60"
                      >
                        {p.pregunta} <span className="text-genesis-ion">›</span>
                      </button>
                    )
                  })}
                </div>
              </ZonaDeslizable>
            ) : null}

            {vista === 'mensajes' ? (
              <ZonaDeslizable className="p-4">
                {historial.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-genesis-mist">
                    <span className="text-2xl" aria-hidden>🗨</span>
                    {t('No hay mensajes')}
                    <small>{t('Tus conversaciones se guardan en este navegador.')}</small>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {[...historial].reverse().map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setConv(c)
                          irA('chat')
                        }}
                        className="flex w-full items-center justify-between gap-2 rounded-xl surface-card px-4 py-3 text-left"
                        lang="es"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-genesis-text">
                            {c.titulo}
                          </span>
                          <span className="text-xs text-genesis-mist">
                            {new Date(c.ts).toLocaleString()}
                          </span>
                        </span>
                        <span className="text-genesis-ion">›</span>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={abrirChatNuevo}
                  className="mt-4 flex w-full items-center justify-between rounded-xl surface-card px-4 py-3.5 text-sm font-semibold text-genesis-text transition-colors hover:border-genesis-ion"
                >
                  {t('Hacer una pregunta')} <span className="text-genesis-ion">➤</span>
                </button>
              </ZonaDeslizable>
            ) : null}

            {vista === 'ayuda' ? (
              <ZonaDeslizable className="p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    buscarEnAyuda()
                  }}
                  className="mb-3 flex items-center gap-2 rounded-xl surface-card px-4 py-2.5"
                >
                  <span aria-hidden>🔍</span>
                  <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={t('Buscar ayuda')}
                    className="w-full bg-transparent text-sm text-genesis-text placeholder:text-genesis-mist focus:outline-none"
                    lang="es"
                  />
                </form>
                <p className="mb-3 px-1 text-xs text-genesis-mist">
                  {colecciones.length} {t('colecciones')} · {TODAS_LAS_PREGUNTAS.length} {t('artículos')}
                </p>
                <div className="space-y-2.5" lang="es">
                  {colecciones.map(([nombre, preguntas]) => (
                    <button
                      key={nombre}
                      type="button"
                      onClick={() => {
                        setColeccion(nombre)
                        irA('lista')
                      }}
                      className="flex w-full items-center justify-between gap-2 rounded-xl surface-card px-4 py-3 text-left"
                    >
                      <span>
                        <span className="block text-[13px] font-semibold text-genesis-text">{nombre}</span>
                        <span className="text-xs text-genesis-mist">
                          {preguntas.length} {t(preguntas.length === 1 ? 'artículo' : 'artículos')}
                        </span>
                      </span>
                      <span className="text-genesis-ion">›</span>
                    </button>
                  ))}
                </div>
              </ZonaDeslizable>
            ) : null}

            {vista === 'lista' && coleccion ? (
              <ZonaDeslizable className="p-4">
                <p className="mb-3 px-1 text-xs text-genesis-mist" lang="es">
                  {coleccion}
                </p>
                <div className="overflow-hidden rounded-xl border border-genesis-ghost" lang="es">
                  {(colecciones.find(([n]) => n === coleccion)?.[1] ?? []).map((p: Pregunta) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => abrirArticulo(p)}
                      className="flex w-full items-center justify-between gap-2 border-t border-genesis-ghost/50 px-4 py-3 text-left text-[13px] text-genesis-text first:border-t-0 hover:bg-genesis-surface/60"
                    >
                      {p.pregunta} <span className="text-genesis-ion">›</span>
                    </button>
                  ))}
                </div>
              </ZonaDeslizable>
            ) : null}

            {vista === 'articulo' && articulo ? (
              <ZonaDeslizable className="p-4">
                <article lang="es">
                  <h3 className="text-lg font-semibold leading-snug text-genesis-text">
                    {articulo.pregunta}
                  </h3>
                  {/* La trazabilidad que la referencia no tiene: de dónde sale. */}
                  <p className="mb-3 mt-1 text-[11px] text-genesis-mist">
                    {t('Fuente')}: <span className="text-genesis-ion">{FUENTES[articulo.fuente]}</span>
                  </p>
                  <p className="text-sm leading-relaxed text-genesis-mist">{articulo.respuesta}</p>
                  {articulo.enlace ? (
                    <a
                      href={articulo.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-xs text-genesis-ion underline-offset-4 hover:underline"
                    >
                      {articulo.enlace.replace(/^https?:\/\//, '')}
                    </a>
                  ) : null}

                  {/* Feedback: la semilla del aprendizaje. Local en B; endpoint en C. */}
                  <div className="mt-5 border-t border-genesis-ghost pt-4 text-center">
                    <p className="mb-2 text-xs text-genesis-mist">{t('¿Respondió esto a tu pregunta?')}</p>
                    <div className="flex justify-center gap-3">
                      {(['no', 'medio', 'si'] as const).map((v, i) => (
                        <button
                          key={v}
                          type="button"
                          aria-pressed={valorado === v}
                          onClick={() => {
                            guardarFeedback(articulo.id, v)
                            setValorado(v)
                          }}
                          className={`text-xl transition-transform ${
                            valorado === v ? 'scale-125' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                          }`}
                        >
                          {['😞', '😐', '😍'][i]}
                        </button>
                      ))}
                    </div>
                    {valorado ? (
                      <p className="mt-2 text-xs text-genesis-ion">{t('Gracias — esto afina el asistente.')}</p>
                    ) : null}
                  </div>

                  <a
                    href={rutaPublica('/soporte')}
                    className="mt-4 inline-block text-xs text-genesis-ion underline-offset-4 hover:underline"
                  >
                    ⧉ {t('Abrir en el centro de ayuda')}
                  </a>
                </article>
              </ZonaDeslizable>
            ) : null}

            {vista === 'chat' ? (
              <div className="min-h-0 flex-1 p-3">
                <AsistenteChat
                  compacto
                  turnos={turnosVivos}
                  onTurno={alTurno}
                  onVerArticulo={abrirArticulo}
                />
              </div>
            ) : null}
          </div>

          {/* ── Pestañas ── */}
          <nav className="flex flex-none border-t border-genesis-ghost bg-genesis-void/60" role="tablist">
            {(
              [
                ['inicio', t('Inicio'), 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z'],
                ['mensajes', t('Mensajes'), 'M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z'],
                ['ayuda', t('Ayuda'), 'M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.8.3-.9 1-.9 1.7m0 3h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'],
              ] as const
            ).map(([id, rotulo, d]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={pestanaActiva === id}
                onClick={() => irA(id)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors duration-300 ${
                  pestanaActiva === id ? 'text-genesis-cyan' : 'text-genesis-mist hover:text-genesis-text'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d={d} />
                </svg>
                {rotulo}
              </button>
            ))}
          </nav>
          <p className="flex-none border-t border-genesis-ghost/50 px-4 py-2 text-[10px] text-genesis-mist">
            {t('No promete activaciones ni resultados. Cuando no sabe, deriva a una persona.')}
          </p>
        </section>
      ) : null}

      {/* ── El botón (M1 · Núcleo) con sus dos fases ── */}
      <button
        type="button"
        onClick={() => (abierto ? cerrar() : setAbierto(true))}
        aria-label={abierto ? t('Cerrar el asistente') : t('Abrir el asistente')}
        aria-expanded={abierto}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-genesis-signature p-[3px] shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-90 sm:bottom-6 sm:right-6"
      >
        <span className="grid h-full w-full place-items-center rounded-full bg-genesis-base">
          <span className="relative grid h-6 w-6 place-items-center">
            {/* Burbuja (plegado) ⇄ chevrón (desplegado): el botón dice lo que
                hará al pulsarlo — nunca queda estático sin reacción. */}
            <svg
              viewBox="0 0 24 24"
              className={`absolute h-6 w-6 text-genesis-text transition-all duration-300 ${
                abierto ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
            >
              <path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              className={`absolute h-6 w-6 text-genesis-text transition-all duration-300 ${
                abierto ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden
            >
              <path d="M5 9l7 7 7-7" />
            </svg>
          </span>
        </span>
      </button>
    </>
  )
}
