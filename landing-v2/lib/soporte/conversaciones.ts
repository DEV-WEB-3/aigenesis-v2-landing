import { TODAS_LAS_PREGUNTAS } from './buscar'
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
  /** 'r' = hubo respuesta del corpus · 'd' = derivación. */
  t: 'r' | 'd'
  /** ID de la pregunta del corpus que respondió (si t === 'r'). */
  id?: string
  /** IDs de relacionadas / sugerencias, para repintarlas. */
  rel?: readonly string[]
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
  tipo: 'respuesta' | 'derivar'
  pregunta?: Pregunta
  relacionadas: readonly Pregunta[]
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
    return { q: t.q, tipo: 'derivar', relacionadas }
  })
}

/* ── Feedback por respuesta: la semilla del aprendizaje ─────────────────
   Se guarda local (Fase B). En Fase C viaja también al endpoint y se agrega:
   es la primera telemetría real de QUÉ respuestas no sirven. */

export type Valoracion = 'no' | 'medio' | 'si'

export function guardarFeedback(preguntaId: string, valor: Valoracion): void {
  if (!hayVentana()) return
  try {
    const f = JSON.parse(localStorage.getItem(CLAVE_FEEDBACK) ?? '{}')
    f[preguntaId] = { v: valor, ts: Date.now() }
    localStorage.setItem(CLAVE_FEEDBACK, JSON.stringify(f))
  } catch {
    /* sin persistencia no se rompe nada */
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
