/*
 * EL ALMACÉN DE TICKETS (E6, opción A firmada: Vercel + Upstash).
 *
 * Forma: un hash de Redis por usuario — `soporte:tickets:<userId>` con
 * campo = ticketId y valor = el ticket completo en JSON (contrato de
 * docs/contrato-tickets-soporte.md: la MISMA forma que la pantalla ya usa;
 * si esto devuelve otra cosa, deja de ser «conectar un cable»).
 *
 * Reglas no opcionales del contrato implementadas aquí:
 *  1 · el ID lo asigna el servidor (`vip-` + aleatorio del server)
 *  2 · crear es idempotente (clave del cliente → SET NX 24 h)
 *  3 · jamás se guarda un secreto (filtro ANTES de persistir)
 */

const URL_KV = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const TOKEN_KV = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''

export const TICKETS_ACTIVOS = Boolean(URL_KV && TOKEN_KV)

const MAX_TICKETS_POR_USUARIO = 50
const MAX_MENSAJES_POR_TICKET = 200

async function pipeline(comandos: (string | number)[][]): Promise<{ result?: unknown }[] | null> {
  const control = new AbortController()
  const t = setTimeout(() => control.abort(), 4000)
  try {
    const r = await fetch(`${URL_KV}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN_KV}` },
      body: JSON.stringify(comandos),
      signal: control.signal,
    })
    if (!r.ok) return null
    return (await r.json()) as { result?: unknown }[]
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

/*
 * EL FILTRO DE SECRETOS (regla 3). En los canales reales HAY contraseñas
 * pegadas en texto plano — esto no es teórico. Se filtra:
 *  · clave privada: 64 hex SIN «0x» (un tx hash legítimo VIAJA con 0x —
 *    distinguirlos importa: el hash es contenido de soporte, la clave no)
 *  · frase semilla: 12/15/18/21/24 palabras minúsculas seguidas sin signos
 *  · «contraseña/clave/password: x»
 */
const AVISO_SECRETO =
  '[Se retiró un dato con forma de credencial. Nunca compartas contraseñas, claves privadas ni frases de recuperación — soporte JAMÁS las necesita para ayudarte.]'

export function filtrarSecretos(texto: string): { texto: string; filtrado: boolean } {
  let filtrado = false
  let limpio = String(texto ?? '')

  limpio = limpio.replace(/(?<!0x)(?<![0-9a-fA-F])[0-9a-fA-F]{64}(?![0-9a-fA-F])/g, () => {
    filtrado = true
    return AVISO_SECRETO
  })

  limpio = limpio.replace(/\b(?:[a-z]{3,9}\s+){11,23}[a-z]{3,9}\b/g, (m) => {
    const palabras = m.trim().split(/\s+/)
    if (![12, 15, 18, 21, 24].includes(palabras.length)) return m
    filtrado = true
    return AVISO_SECRETO
  })

  limpio = limpio.replace(/\b(contrase[nñ]a|password|clave)\s*[:=]\s*\S+/gi, () => {
    filtrado = true
    return AVISO_SECRETO
  })

  return { texto: limpio, filtrado }
}

export interface MensajeTicket {
  id: string
  body: string
  sender: 'user' | 'agent'
  ts: number
  seen?: boolean
  agent?: { name: string; level: string }
  tarjeta?: unknown
  hold?: unknown
}

export interface TicketSoporte {
  id: string
  title: string
  category: string
  priority: string
  status: string
  unread: boolean
  createdAt: number
  messages: MensajeTicket[]
  kind?: string
  incident?: unknown
  incidentKey?: string
}

const claveDe = (userId: string) => `soporte:tickets:${userId}`

export async function listarTickets(userId: string): Promise<TicketSoporte[] | null> {
  const r = await pipeline([['HVALS', claveDe(userId)]])
  if (!r) return null
  const crudos = Array.isArray(r[0]?.result) ? (r[0].result as string[]) : []
  const tickets: TicketSoporte[] = []
  for (const c of crudos) {
    try {
      tickets.push(JSON.parse(c))
    } catch {
      /* un ticket corrupto no tumba la lista */
    }
  }
  return tickets.sort((a, b) => b.createdAt - a.createdAt)
}

export async function leerTicket(userId: string, ticketId: string): Promise<TicketSoporte | null> {
  const r = await pipeline([['HGET', claveDe(userId), ticketId]])
  const crudo = r?.[0]?.result
  if (typeof crudo !== 'string') return null
  try {
    return JSON.parse(crudo)
  } catch {
    return null
  }
}

export async function guardarTicket(userId: string, ticket: TicketSoporte): Promise<boolean> {
  if (ticket.messages.length > MAX_MENSAJES_POR_TICKET) {
    ticket.messages = ticket.messages.slice(-MAX_MENSAJES_POR_TICKET)
  }
  const r = await pipeline([['HSET', claveDe(userId), ticket.id, JSON.stringify(ticket)]])
  return r !== null
}

/** Idempotencia de creación: misma clave del cliente → mismo ticket (24 h). */
export async function reclamarIdempotencia(
  userId: string,
  claveCliente: string,
  ticketId: string
): Promise<string> {
  const clave = `soporte:idem:${userId}:${claveCliente.slice(0, 80)}`
  const r = await pipeline([
    ['SET', clave, ticketId, 'NX', 'EX', 86_400],
    ['GET', clave],
  ])
  const existente = r?.[1]?.result
  return typeof existente === 'string' && existente ? existente : ticketId
}

export async function contarTickets(userId: string): Promise<number> {
  const r = await pipeline([['HLEN', claveDe(userId)]])
  const n = Number(r?.[0]?.result)
  return Number.isFinite(n) ? n : 0
}

export const LIMITE_TICKETS = MAX_TICKETS_POR_USUARIO
