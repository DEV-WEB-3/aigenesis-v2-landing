import { TODAS_LAS_PREGUNTAS } from './buscar'
import { RESPUESTAS_DE_CORTESIA, type ClaseDeCortesia } from './cortesia'
import type { Pregunta } from './tipos'

/*
 * CONVERSACIONES PERSISTENTES — Fase B del mensajero.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * DÓNDE VIVEN Y POR QUÉ.
 *
 * En `localStorage` del navegador de la persona. Sin backend ya se puede dar
 * historial: la pestaña «Mensajes» del mensajero lista lo hablado y permite
 * retomarlo. Cuando llegue la Fase C (tickets en la cuenta), este módulo es
 * el único sitio que cambia — las superficies no se enteran.
 *
 * La clave es COMPARTIDA entre el flotante de la portada y la página
 * /soporte: si empiezas una conversación en un sitio, la retomas en el otro.
 * Dos memorias separadas serían la divergencia de siempre.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * QUÉ SE GUARDA: REFERENCIAS, NO COPIAS.
 *
 * Un turno guarda la pregunta tecleada y el ID de la respuesta del corpus —
 * no el texto. Al rehidratar se busca el ID en el corpus vivo. Así, si una
 * respuesta se corrige mañana, el historial muestra la versión corregida en
 * vez de servir para siempre la que ya estaba mal. Guardar el texto habría
 * sido crear copias congeladas de un corpus que jura tener una sola fuente.
 *
 * El precio, dicho: si un ID desaparece del corpus, ese turno se muestra como
 * derivación. Es el comportamiento correcto — mejor «no lo sé» que un texto
 * huérfano sin fuente.
 * ═════════════════════════════════════════════════════════════════════════
 */

const CLAVE = 'genesis:soporte:conversaciones'
const CLAVE_FEEDBACK = 'genesis:soporte:feedback'
const MAX_CONVERSACIONES = 20

/** Un turno serializado: la pregunta y la referencia a lo respondido. */
export interface TurnoGuardado {
  /** Lo que tecleó la persona. */
  q: string
  /** 'r' = respuesta del corpus · 'd' = derivación · 'c' = cortesía (E1). */
  t: 'r' | 'd' | 'c'
  /** ID de la pregunta del corpus que respondió (si t === 'r'). */
  id?: string
  /** IDs de relacionadas / sugerencias, para repintarlas. */
  rel?: readonly string[]
  /** Clase de cortesía (si t === 'c') — el texto se rehidrata, no se copia. */
  clase?: ClaseDeCortesia
}

export interface Conversacion {
  id: number
  titulo: string
  ts: number
  turnos: readonly TurnoGuardado[]
}

/** Turno listo para pintar: con la Pregunta real del corpus, rehidratada. */
export interface TurnoVivo {
  q: string
  tipo: 'respuesta' | 'derivar' | 'cortesia'
  pregunta?: Pregunta
  relacionadas: readonly Pregunta[]
  /** Texto de cortesía rehidratado desde `cortesia.ts` (si tipo === 'cortesia'). */
  mensaje?: string
}

const porId = new Map(TODAS_LAS_PREGUNTAS.map((p) => [p.id, p]))

const hayVentana = () => typeof window !== 'undefined'

export function listarConversaciones(): readonly Conversacion[] {
  if (!hayVentana()) return []
  try {
    const crudo = JSON.parse(localStorage.getItem(CLAVE) ?? '[]')
    return Array.isArray(crudo) ? crudo : []
  } catch {
    return []
  }
}

export function guardarConversacion(conv: Conversacion): void {
  if (!hayVentana()) return
  try {
    const resto = listarConversaciones().filter((c) => c.id !== conv.id)
    localStorage.setItem(CLAVE, JSON.stringify([...resto, conv].slice(-MAX_CONVERSACIONES)))
  } catch {
    /* cuota llena o modo privado: el chat sigue, solo sin historial */
  }
}

export function nuevaConversacion(): Conversacion {
  return { id: Date.now(), titulo: '', ts: Date.now(), turnos: [] }
}

/** Añade un turno y devuelve la conversación actualizada (inmutable). */
export function conTurno(conv: Conversacion, turno: TurnoGuardado): Conversacion {
  const titulo = conv.titulo || turno.q.slice(0, 60)
  return { ...conv, titulo, ts: Date.now(), turnos: [...conv.turnos, turno] }
}

/**
 * Rehidratar: de referencias a contenido vivo del corpus. Un ID que ya no
 * existe se degrada a derivación — nunca a texto inventado.
 */
export function rehidratar(turnos: readonly TurnoGuardado[]): TurnoVivo[] {
  return turnos.map((t) => {
    const pregunta = t.id ? porId.get(t.id) : undefined
    const relacionadas = (t.rel ?? [])
      .map((id) => porId.get(id))
      .filter((p): p is Pregunta => Boolean(p))
    if (t.t === 'r' && pregunta) return { q: t.q, tipo: 'respuesta', pregunta, relacionadas }
    /* Cortesía: mismo principio que el corpus — se guarda la clase y el texto
       se rehidrata del módulo vivo. Una clase desconocida degrada a derivación. */
    if (t.t === 'c' && t.clase && RESPUESTAS_DE_CORTESIA[t.clase]) {
      return { q: t.q, tipo: 'cortesia', mensaje: RESPUESTAS_DE_CORTESIA[t.clase], relacionadas: [] }
    }
    return { q: t.q, tipo: 'derivar', relacionadas }
  })
}

/* ── Feedback por respuesta: la semilla del aprendizaje ─────────────────
   Se guarda local (Fase B). En Fase C viaja también al endpoint y se agrega:
   es la primera telemetría real de QUÉ respuestas no sirven. */

export type Valoracion = 'no' | 'medio' | 'si'

/*
 * E2 (R1): además del localStorage, el feedback viaja al registro del
 * ecosistema — fire-and-forget: si la red falla, la persona ni se entera y
 * lo local queda igual. La copia de Hostinger es estática, así que la URL es
 * absoluta al despliegue de Vercel (el mismo que sirve al portal).
 */
const URL_FEEDBACK = 'https://aigenesis-landing.vercel.app/api/asistente/feedback'

export function guardarFeedback(preguntaId: string, valor: Valoracion): void {
  if (!hayVentana()) return
  try {
    const f = JSON.parse(localStorage.getItem(CLAVE_FEEDBACK) ?? '{}')
    f[preguntaId] = { v: valor, ts: Date.now() }
    localStorage.setItem(CLAVE_FEEDBACK, JSON.stringify(f))
  } catch {
    /* sin persistencia no se rompe nada */
  }
  try {
    void fetch(URL_FEEDBACK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preguntaId, valor }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* fire-and-forget de verdad */
  }
}

export function leerFeedback(preguntaId: string): Valoracion | null {
  if (!hayVentana()) return null
  try {
    const f = JSON.parse(localStorage.getItem(CLAVE_FEEDBACK) ?? '{}')
    return f[preguntaId]?.v ?? null
  } catch {
    return null
  }
}
