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

/*
 * RATE-LIMIT REAL — Tren C, pieza 1 (GO del auditor, 21-ago-2026). Es el
 * prerrequisito duro de E7, adelantado; NO habilita E7.
 *
 * Cuenta por IP y ventana en el KV con INCR + EXPIRE, así el tope vale
 * entre TODAS las instancias serverless — el de memoria muere con cada
 * instancia nueva y contra eso avisaba su propio comentario.
 *
 * FAIL-SOFT por contrato: si el KV no está configurado o no responde en
 * 600 ms, esto devuelve null y el llamador cae al tope en memoria de
 * siempre. La cortesía y el corpus JAMÁS se caen por culpa del contador.
 */
export async function contarPeticion(ip: string, ambito: string): Promise<number | null> {
  if (!REGISTRO_ACTIVO) return null
  const ventana = Math.floor(Date.now() / 60_000)
  const clave = `tope:${ambito}:${ventana}:${ip}`
  const r = (await pipeline([
    ['INCR', clave],
    /* 120 s y no 60: la clave debe sobrevivir su ventana entera aunque el
       INCR llegue al final del minuto. Expira sola; no se acumula basura. */
    ['EXPIRE', clave, 120],
  ])) as { result?: number }[] | null
  const n = Number(r?.[0]?.result)
  return Number.isFinite(n) && n > 0 ? n : null
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

/*
 * EL TRÁFICO SINTÉTICO NO ES MEMORIA (lección del 21-ago): los canarios del
 * rate-limit —míos y del auditor— metieron 70+ entradas de ruido en el
 * registro el primer día. Un miss inventado por una prueba se parece
 * demasiado a una pregunta real, y el destilador (E5) comería basura.
 * Contrato: toda sonda sintética empieza con «canario:» — ejercita el
 * responder y el tope igual, pero no queda en la memoria.
 */
const ES_TRAFICO_SINTETICO = /^\s*canario\s*:/i

export async function registrarConsulta(evento: EventoDeRegistro): Promise<void> {
  if (!REGISTRO_ACTIVO) return
  if (ES_TRAFICO_SINTETICO.test(evento.consulta)) return
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
