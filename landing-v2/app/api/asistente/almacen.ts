/*
 * EL ALMACÉN DEL REGISTRO — E2 (R1) de la ruta unificada. Decisión del
 * auditor (20-ago-2026): Upstash / Vercel KV, no Blob.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * QUÉ ES: la memoria del asistente. Cada consulta que llega al endpoint se
 * registra con su resultado (hit del corpus / derivación / cortesía), y el
 * feedback de las superficies deja de morir en el localStorage del usuario.
 * Este registro es el ALIMENTO del destilador (E5, en HOLD) y del tablero de
 * convergencia: la máquina no puede aprender de lo que no ve.
 *
 * QUÉ NO ES: telemetría de personas. No se guarda IP, ni usuario, ni nada
 * que identifique a quien pregunta — sólo la pregunta y cómo se respondió.
 *
 * ENV-GATED A PROPÓSITO: sin las variables de KV configuradas, todo aquí es
 * un no-op silencioso y el asistente funciona exactamente igual que ayer.
 * Acepta los dos juegos de nombres (Vercel KV y Upstash directo).
 * ═════════════════════════════════════════════════════════════════════════
 */

const URL_KV =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const TOKEN_KV =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''

export const REGISTRO_ACTIVO = Boolean(URL_KV && TOKEN_KV)

const CLAVE_REGISTRO = 'asistente:registro'
const CLAVE_FEEDBACK = 'asistente:feedback'
/* Tope de la lista: suficiente para semanas de análisis sin crecer sin fin. */
const MAX_ENTRADAS = 20_000

/**
 * Un comando pipeline a Upstash, con tope de tiempo corto: el registro jamás
 * puede volver lento al asistente. Si no llega en 600 ms, se pierde una
 * entrada — no una respuesta.
 */
async function pipeline(comandos: (string | number)[][]): Promise<unknown> {
  const control = new AbortController()
  const t = setTimeout(() => control.abort(), 600)
  try {
    const r = await fetch(`${URL_KV}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN_KV}` },
      body: JSON.stringify(comandos),
      signal: control.signal,
    })
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

export interface EventoDeRegistro {
  ts: number
  proyecto?: string
  consulta: string
  resultado: 'respuesta' | 'derivar' | 'cortesia'
  /** id de la ficha (hit) o clase de cortesía. */
  id?: string
  puntos?: number
}

export async function registrarConsulta(evento: EventoDeRegistro): Promise<void> {
  if (!REGISTRO_ACTIVO) return
  const entrada = JSON.stringify({ ...evento, consulta: evento.consulta.slice(0, 200) })
  await pipeline([
    ['LPUSH', CLAVE_REGISTRO, entrada],
    ['LTRIM', CLAVE_REGISTRO, 0, MAX_ENTRADAS - 1],
  ])
}

export async function registrarFeedback(preguntaId: string, valor: string): Promise<void> {
  if (!REGISTRO_ACTIVO) return
  const entrada = JSON.stringify({ ts: Date.now(), preguntaId: preguntaId.slice(0, 80), valor })
  await pipeline([
    ['LPUSH', CLAVE_FEEDBACK, entrada],
    ['LTRIM', CLAVE_FEEDBACK, 0, MAX_ENTRADAS - 1],
  ])
}

/** Lectura para el tablero (ruta admin). Devuelve las últimas `n` de cada lista. */
export async function leerRegistro(n = 500): Promise<{ registro: unknown[]; feedback: unknown[] } | null> {
  if (!REGISTRO_ACTIVO) return null
  const r = (await pipeline([
    ['LRANGE', CLAVE_REGISTRO, 0, n - 1],
    ['LRANGE', CLAVE_FEEDBACK, 0, n - 1],
  ])) as { result?: string[] }[] | null
  if (!r) return null
  const parsear = (xs: unknown): unknown[] =>
    Array.isArray(xs)
      ? xs.map((x) => {
          try {
            return JSON.parse(String(x))
          } catch {
            return null
          }
        }).filter(Boolean)
      : []
  return { registro: parsear(r[0]?.result), feedback: parsear(r[1]?.result) }
}
