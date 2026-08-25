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
import { useIdioma } from '@/context/IdiomaContext'
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
import {
  COLECCION_AULA,
  edicionesDePortal,
  portalActual,
  type Portal,
  type Edicion,
  duracionLegible,
  idiomaInicial,
} from '@/lib/soporte/ediciones'
import { useAliento } from '@/hooks/useAliento'
import { useCorpus } from '@/hooks/useCorpus'
import AsistenteChat from './AsistenteChat'
import FichaEdicion from './FichaEdicion'
import ZonaDeslizable from './ZonaDeslizable'

const EQUIPO = [
  { nombre: 'Andrés', foto: '/soporte/andres.jpg' },
  { nombre: 'Valeria', foto: '/soporte/valeria.jpg' },
  { nombre: 'Marco', foto: '/soporte/marco.jpg' },
] as const

/**
 * LOS CUATRO SUGERIDOS DE LA WEB PÚBLICA.
 *
 * ANTES ERAN LOS MÁS FRECUENTES, MEDIDOS SOBRE 789 MENSAJES DE SOPORTE. Y por eso
 * mismo eran tres quejas y una pregunta:
 *
 *   «Retiré mis AIG y la cuenta se congeló. ¿Por qué no baja lo que me piden?»
 *   «Reclamé y no ha llegado nada»
 *   «Tengo AIG de sobra pero sigo por debajo del mínimo»
 *
 * El dato era correcto y la conclusión no. Esas frases son las más frecuentes en
 * el CANAL DE SOPORTE, donde escribe quien ya tiene un problema. En la web pública
 * las lee alguien que acaba de llegar, y lo primero que el asistente le ofrece es
 * un catálogo de cosas que se rompen. Es la peor carta de presentación posible, y
 * encima ni siquiera es su caso.
 *
 * Ahora se ofrece CAPACIDAD, no avería: qué se puede hacer y cómo se empieza. Las
 * de soporte no desaparecen —siguen en el buscador y en sus colecciones, que es
 * donde las busca quien las necesita— y siguen siendo las primeras en `/soporte`,
 * que es la puerta a la que se llama cuando algo falla.
 *
 * Ver `SUGERENCIAS_RAPIDAS` en `lib/soporte/adaptador-centro-de-ayuda.ts`: ahí
 * SIGUEN siendo problemas a propósito, y está bien que lo sean.
 */
const SUGERIDOS = [
  'man-como-unirse',
  'ali-tagmarkets',
  'man-activar-mineria',
  'tok-que-es',
] as const

type Vista = 'inicio' | 'mensajes' | 'ayuda' | 'chat' | 'lista' | 'articulo' | 'edicion'

/* Cada vista pertenece a una pestaña, aunque se llegue por automático. */
const PESTANA_DE: Record<Vista, 'inicio' | 'mensajes' | 'ayuda'> = {
  inicio: 'inicio',
  mensajes: 'mensajes',
  ayuda: 'ayuda',
  chat: 'mensajes',
  lista: 'ayuda',
  articulo: 'ayuda',
  edicion: 'ayuda',
}

/**
 * La marca ▶ de las filas que llevan a material grabado.
 *
 * Lleva la duración cuando se sabe, y sólo el triángulo cuando no. Un «0:00» de
 * relleno mentiría sobre algo que la persona usa para decidir si tiene tiempo
 * ahora; ausente es la verdad y no cuesta nada leerla.
 */
function MarcaVideo({ segundos }: { segundos: number | null }) {
  const d = duracionLegible(segundos)
  /* En cian, no en el ámbar de G1: este asistente también vive en superficies
     Génesis, y el ámbar pertenece a G1. El cian es «detalle» en el sistema de
     tokens, que es exactamente el papel de esta marca. */
  return (
    <span className="inline-flex flex-none items-center gap-1 rounded border border-genesis-cyan/40 px-1.5 py-px text-[10px] uppercase tracking-wider text-genesis-cyan">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-2 w-2" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
      {d ?? 'Video'}
    </span>
  )
}

/**
 * LAS DOS MEDIDAS DEL PANEL — salen de medir, no de elegir un número redondo.
 *
 * Hoy el panel mide 400 px en escritorio y el reproductor queda en 368×207: el
 * MISMO en un monitor de 1920 que en uno de 1366. El modo ancho existe por eso.
 *
 * Se compararon 680, 760 y 860 px contra seis resoluciones. 760 y 860 dejan sin
 * sitio al texto en 1280×720 —un portátil muy común—: el reproductor se come el
 * alto y el título con los idiomas se van fuera. 680 aguanta en las seis, sube el
 * reproductor a 648×365 (3,1× de área) y nunca pasa del 57 % de la pantalla.
 *
 * TODO VA EN `sm:`. Por debajo de 640 px el panel YA ocupa 366×768, casi la
 * pantalla entera: no hay adónde expandir. Por eso el botón tampoco existe ahí —
 * en el móvil, el modo grande de un video es la pantalla completa del propio
 * reproductor, que ya viene con él.
 */
const MEDIDAS = {
  normal:
    'sm:h-[min(680px,calc(100dvh-8rem))] sm:max-h-[min(680px,calc(100dvh-8rem))] sm:w-[min(400px,calc(100vw-3rem))]',
  ancho:
    'sm:h-[min(760px,calc(100dvh-7rem))] sm:max-h-[min(760px,calc(100dvh-7rem))] sm:w-[min(680px,calc(100vw-3rem))]',
} as const

/**
 * LA PIEL VIVA. El borde y el halo leen `--g-aliento`, que escribe un único bucle
 * para todo el asistente (ver `hooks/useAliento.ts`).
 *
 * Va en `style` y no en clases porque Tailwind no puede interpolar una variable
 * que cambia sesenta veces por segundo dentro de un color: generaría una clase por
 * valor. Aquí el navegador resuelve el `calc()` sin volver a pasar por React.
 *
 * Los colores son los tokens `ink.faint` y `blueHi` en notación moderna, que es la
 * única que admite `calc()` en el canal alfa.
 */
const PIEL_VIVA: React.CSSProperties = {
  borderColor: 'rgb(107 122 148 / calc(0.35 + var(--g-aliento, 0) * 0.5))',
  boxShadow:
    '0 25px 50px -12px rgb(0 0 0 / 0.6), 0 0 calc(14px + var(--g-aliento, 0) * 26px) rgb(61 139 255 / calc(var(--g-aliento, 0) * 0.3))',
}

/**
 * El botón respira con el mismo latido que el panel.
 *
 * SÓLO EL HALO, NUNCA LA ESCALA. Probar a escalar el botón lo convierte en un
 * elemento que se mueve debajo del cursor: el objetivo se desplaza justo cuando
 * alguien va a pulsarlo. Un halo que late no estorba a nadie y dice lo mismo.
 */
const ALIENTO_BOTON: React.CSSProperties = {
  boxShadow:
    '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 0 calc(10px + var(--g-aliento, 0) * 22px) rgb(61 139 255 / calc(0.18 + var(--g-aliento, 0) * 0.42))',
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

export default function AsistenteFlotante({ sugeridos = SUGERIDOS }: { sugeridos?: readonly string[] } = {}) {
  const { t, idioma: idiomaUI } = useIdioma()
  const [abierto, setAbierto] = useState(false)
  const [cerrando, setCerrando] = useState(false)
  const [vista, setVista] = useState<Vista>('inicio')
  const [conv, setConv] = useState<Conversacion | null>(null)
  const [articulo, setArticulo] = useState<Pregunta | null>(null)
  const [coleccion, setColeccion] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [historial, setHistorial] = useState<readonly Conversacion[]>([])
  const [valorado, setValorado] = useState<Valoracion | null>(null)
  const [edicion, setEdicion] = useState<Edicion | null>(null)
  /** La última vista de pestaña por la que se pasó — el destino de «volver». */
  const [origen, setOrigen] = useState<Vista>('inicio')
  /**
   * Modo ancho. Existe POR el video: una ficha de texto se lee bien en 400 px,
   * un tutorial de pantalla no —el reproductor queda en 400×225 y lo que hay que
   * mirar es justo el detalle—. Es la misma salida que tiene la referencia
   * («Ampliar ventana»), y aquí tiene una razón concreta.
   */
  const [ancho, setAncho] = useState(false)
  /**
   * Esqueleto al abrir una ficha. No es decorativo: el encabezado aparece al
   * instante y el cuerpo pesado —el póster del video— llega después. Sin él, el
   * salto de vacío a completo se lee como un parpadeo de error.
   */
  const [cargando, setCargando] = useState(false)

  const aliento = useAliento(abierto)
  /* El corpus en el idioma de quien lee. Ver `hooks/useCorpus.tsx`: mientras
     una respuesta no esté traducida sale en español y se declara como tal. */
  const corp = useCorpus()

  /*
   * El ancho se recuerda. Quien lo amplía para ver un video no quiere volver a
   * pulsarlo en cada apertura — es una preferencia, no un estado de la sesión.
   * Se lee en un efecto y no en el `useState` inicial: leer `localStorage`
   * durante el primer render descuadra la hidratación (el servidor no lo tiene).
   */
  useEffect(() => {
    try {
      if (window.localStorage.getItem('genesis:asistente:ancho') === '1') setAncho(true)
    } catch {
      /* sin almacenamiento, el panel abre en su tamaño normal */
    }
  }, [])
  useEffect(() => {
    try {
      window.localStorage.setItem('genesis:asistente:ancho', ancho ? '1' : '0')
    } catch {
      /* nada que hacer: la preferencia dura lo que la pestaña */
    }
  }, [ancho])
  /* El idioma DEL MATERIAL, que no es el de la interfaz. Ver `ediciones.ts`. */
  const [idiomaMaterial, setIdiomaMaterial] = useState('es')

  /*
   * QUÉ MATERIAL LE TOCA A ESTE PORTAL.
   *
   * Instrucción del owner: el asistente enseña la presentación de AiGenesis en
   * aigenesis.io y el plan de la alianza en g1.aigenesis.io. La misma
   * exportación estática sirve a los dos, así que la decisión no puede hornearse
   * en el build: se toma en el navegador.
   *
   * Y por eso va en un efecto y no leyendo `window` durante el render. El primer
   * render lo hace el servidor, donde `window` no existe; leerlo ahí devolvería
   * `desconocido` y el cliente calcularía otra cosa, que es exactamente lo que
   * React llama error de hidratación. Con el efecto, el primer pintado coincide
   * con el del servidor —el juego completo— y se ajusta enseguida.
   */
  const [portal, setPortal] = useState<Portal>('desconocido')
  useEffect(() => setPortal(portalActual()), [])
  const ediciones = useMemo(() => edicionesDePortal(portal), [portal])

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
    /* Sólo las tres vistas de pestaña son destino de «volver»: las internas se
       apilarían unas sobre otras y el botón dejaría de salir nunca. */
    if (v === 'inicio' || v === 'mensajes' || v === 'ayuda' || v === 'lista') setOrigen(v)
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

  const abrirEdicion = (e: Edicion) => {
    setEdicion(e)
    /* El esqueleto dura lo justo para que el póster tenga tiempo de llegar. No es
       un retardo artificial para «parecer» que carga: sin él, la ficha aparece
       vacía y el póster entra de golpe medio segundo después, y ese salto se lee
       como un fallo. */
    setCargando(true)
    window.setTimeout(() => setCargando(false), 420)
    /* El idioma se recalcula en CADA apertura y no se hereda de la edición
       anterior: dos ediciones no tienen los mismos idiomas, y arrastrar el
       croata a una edición que no lo tiene abriría la ficha vacía. */
    setIdiomaMaterial(idiomaInicial(e, idiomaUI))
    setValorado(leerFeedback(e.id))
    irA('edicion')
  }

  const buscarEnAyuda = () => {
    const q = busqueda.trim()
    if (q.length < 3) return
    setBusqueda('')
    const r = responder(q)
    if (r.tipo === 'respuesta') {
      abrirArticulo(r.pregunta)
    } else if (r.tipo === 'cortesia') {
      /* Un saludo escrito en el buscador: al chat, saludado como se debe. */
      setConv(nuevaConversacion())
      irA('chat')
      alTurno({ q, t: 'c', clase: r.clase })
    } else {
      /* Sin acierto claro: al chat, que sabe derivar con honestidad. */
      setConv(nuevaConversacion())
      irA('chat')
      alTurno({ q, t: 'd', rel: r.sugerencias.map((p) => p.id) })
    }
  }

  /**
   * Volver lleva a DONDE SE VENÍA, no a un sitio fijo.
   *
   * Antes «volver» desde un artículo llevaba siempre a Ayuda, incluso si se había
   * entrado desde Inicio: la persona aterrizaba en una pestaña por la que no había
   * pasado. Con las ediciones eso empeoraba, porque su puerta principal es Inicio.
   * Una sola pieza de estado lo arregla.
   */
  const volver = () => irA(origen)

  const pestanaActiva = PESTANA_DE[vista]
  const turnosVivos = useMemo(() => rehidratar(conv?.turnos ?? []), [conv])

  return (
    <>
      {abierto ? (
        <section
          aria-label={t('Asistente de soporte')}
          className={`fixed inset-x-3 bottom-3 top-16 z-[80] flex flex-col overflow-hidden rounded-2xl border bg-genesis-base/95 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:inset-auto sm:bottom-24 sm:right-6 sm:top-auto ${MEDIDAS[ancho ? 'ancho' : 'normal']} ${
            cerrando ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
          }`}
          style={PIEL_VIVA}
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
            {/* Ampliar. Sólo desde `sm`: por debajo el panel ya es la pantalla. */}
            <button
              type="button"
              onClick={() => setAncho((a) => !a)}
              aria-pressed={ancho}
              aria-label={ancho ? t('Reducir la ventana') : t('Ampliar la ventana')}
              title={ancho ? t('Reducir la ventana') : t('Ampliar la ventana')}
              className="ml-auto hidden rounded-md p-1.5 text-genesis-mist transition-colors hover:text-genesis-text sm:block"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {ancho ? (
                  <path d="M9 3v6H3M15 21v-6h6M3 15h6v6M21 9h-6V3" />
                ) : (
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                )}
              </svg>
            </button>
            <button
              type="button"
              onClick={cerrar}
              aria-label={t('Cerrar el asistente')}
              className="ml-auto rounded-md p-1.5 text-genesis-mist transition-colors hover:text-genesis-text sm:ml-0"
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
                {/* Las ediciones van PRIMERO y fuera de la caja de sugeridos.
                    Quien acaba de llegar no tiene una duda todavía: tiene que
                    entrar a su cuenta. Ése es el paso 0 del onboarding, y una
                    fila más entre cuatro preguntas no lo parecería. */}
                <div className="mb-3 space-y-2">
                  {ediciones.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => abrirEdicion(e)}
                      className="flex w-full items-center gap-2.5 rounded-xl surface-card px-4 py-3 text-left transition-colors hover:border-genesis-ion"
                     
                    >
                      <MarcaVideo segundos={e.piezas[idiomaInicial(e, idiomaUI)]?.segundos ?? null} />
                      <span lang={corp(e.titulo).lang} className="min-w-0 text-[13px] text-genesis-text">{corp(e.titulo).texto}</span>
                      <span className="ml-auto text-genesis-ion">›</span>
                    </button>
                  ))}
                </div>
                <div className="overflow-hidden rounded-xl border border-genesis-ghost">
                  {sugeridos.map((id) => {
                    const p = porId.get(id)
                    if (!p) return null
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => abrirArticulo(p)}
                        className="flex w-full items-center justify-between gap-2 border-t border-genesis-ghost/50 px-4 py-3 text-left text-[13px] text-genesis-text first:border-t-0 hover:bg-genesis-surface/60"
                      >
                        <span lang={corp(p.pregunta).lang}>{corp(p.pregunta).texto}</span>{' '}
                        <span className="text-genesis-ion">›</span>
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
                   
                  />
                </form>
                <p className="mb-3 px-1 text-xs text-genesis-mist">
                  {colecciones.length + 1} {t('colecciones')} · {TODAS_LAS_PREGUNTAS.length}{' '}
                  {t('artículos')}
                </p>
                <div className="space-y-2.5">
                  {/* «Aprende» va primera y a mano, no derivada del corpus: no
                      agrupa preguntas, agrupa material grabado. Meterla en el
                      `useMemo` de las categorías habría obligado a inventarle una
                      categoría falsa a cada edición. */}
                  <button
                    type="button"
                    onClick={() => {
                      setColeccion(COLECCION_AULA)
                      irA('lista')
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-xl surface-card px-4 py-3 text-left transition-colors hover:border-genesis-ion"
                  >
                    <span>
                      <span className="block text-[13px] font-semibold text-genesis-text">
                        {COLECCION_AULA}
                      </span>
                      <span className="text-xs text-genesis-mist">
                        {ediciones.length} {t('ediciones')} · {t('video y documento en varios idiomas')}
                      </span>
                    </span>
                    <span className="text-genesis-ion">›</span>
                  </button>
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
                        <span lang={corp(nombre).lang} className="block text-[13px] font-semibold text-genesis-text">{corp(nombre).texto}</span>
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
                <p className="mb-3 px-1 text-xs text-genesis-mist">
                  {corp(coleccion).texto}
                </p>
                {coleccion === COLECCION_AULA ? (
                  <div className="space-y-2">
                    {ediciones.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => abrirEdicion(e)}
                        className="flex w-full items-center gap-2.5 rounded-xl surface-card px-4 py-3 text-left transition-colors hover:border-genesis-ion"
                      >
                        <MarcaVideo segundos={e.piezas[idiomaInicial(e, idiomaUI)]?.segundos ?? null} />
                        <span className="min-w-0">
                          <span lang={corp(e.titulo).lang} className="block text-[13px] text-genesis-text">{corp(e.titulo).texto}</span>
                          <span lang={corp(e.resumen).lang} className="text-xs text-genesis-mist">{corp(e.resumen).texto}</span>
                        </span>
                        <span className="ml-auto text-genesis-ion">›</span>
                      </button>
                    ))}
                  </div>
                ) : (
                <div className="overflow-hidden rounded-xl border border-genesis-ghost">
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
                )}
              </ZonaDeslizable>
            ) : null}

            {vista === 'edicion' && edicion && cargando ? (
              <ZonaDeslizable className="p-4">
                <div className="animate-pulse" aria-hidden>
                  <span className="block h-4 w-3/4 rounded bg-genesis-surface" />
                  <span className="mt-2 block h-2.5 w-1/3 rounded bg-genesis-surface/70" />
                  <span className="mt-4 block aspect-video w-full rounded-xl bg-genesis-surface" />
                  <span className="mt-3 block h-2.5 w-5/6 rounded bg-genesis-surface/70" />
                  <span className="mt-2 block h-2.5 w-2/3 rounded bg-genesis-surface/70" />
                </div>
                <p className="sr-only">{t('Cargando el material…')}</p>
              </ZonaDeslizable>
            ) : null}

            {vista === 'edicion' && edicion && !cargando ? (
              <ZonaDeslizable className="p-4">
                <FichaEdicion
                  edicion={edicion}
                  idioma={idiomaMaterial}
                  onIdioma={setIdiomaMaterial}
                  ancho={ancho}
                  onVoz={aliento}
                />
                {/* El voto es el MISMO mecanismo que el de los artículos, con la
                    misma clave: una edición que no sirve tiene que poder decirlo
                    igual que una respuesta que no sirve. */}
                <div className="mt-5 border-t border-genesis-ghost pt-4 text-center">
                  <p className="mb-2 text-xs text-genesis-mist">
                    {t('¿Te sirvió este material?')}
                  </p>
                  <div className="flex justify-center gap-3">
                    {(['no', 'medio', 'si'] as const).map((v, i) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={valorado === v}
                        onClick={() => {
                          guardarFeedback(edicion.id, v)
                          setValorado(v)
                        }}
                        className={`text-xl transition-transform ${
                          valorado === v
                            ? 'scale-125'
                            : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                        }`}
                      >
                        {['😞', '😐', '😍'][i]}
                      </button>
                    ))}
                  </div>
                  {valorado ? (
                    <p className="mt-2 text-xs text-genesis-ion">
                      {t('Gracias — esto afina el asistente.')}
                    </p>
                  ) : null}
                </div>
              </ZonaDeslizable>
            ) : null}

            {vista === 'articulo' && articulo ? (
              <ZonaDeslizable className="p-4">
                <article>
                  <h3 className="text-lg font-semibold leading-snug text-genesis-text">
                    {corp(articulo.pregunta).texto}
                  </h3>
                  {/* La trazabilidad que la referencia no tiene: de dónde sale. */}
                  <p className="mb-3 mt-1 text-[11px] text-genesis-mist">
                    {/* El rótulo se traducía y su VALOR no: «Источник: la web
                        oficial». Media línea en un idioma y media en otro es
                        peor que dejarla entera en español — parece un fallo de
                        datos, no una traducción que falta. */}
                    {t('Fuente')}: <span className="text-genesis-ion">{t(FUENTES[articulo.fuente])}</span>
                  </p>
                  <p lang={corp(articulo.respuesta).lang} className="text-sm leading-relaxed text-genesis-mist">
                    {corp(articulo.respuesta).texto}
                  </p>
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
        className={`fixed bottom-5 right-5 z-[80] h-14 w-14 place-items-center rounded-full bg-gradient-genesis-signature p-[3px] shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-90 sm:bottom-6 sm:right-6 sm:grid ${
          abierto ? 'hidden sm:grid' : 'grid'
        }`}
        style={ALIENTO_BOTON}
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
