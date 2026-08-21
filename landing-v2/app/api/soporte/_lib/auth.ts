/*
 * IDENTIDAD PARA LOS TICKETS (E6, opción A) — el hop de validación.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * LA DESVIACIÓN MEDIDA (21-ago-2026): el auditor firmó «verify-only con
 * clave pública RS256». Se midió el token real de sesión del portal
 * (header del JWT, sin tocar el secreto): es **HS256** — simétrico. No
 * existe clave pública que verificar: verificar acá exigiría copiar el
 * SECRETKEY del legacy a Vercel, exactamente lo que la firma quería evitar.
 *
 * LA MITIGACIÓN PROPUESTA: no verificar la firma — DELEGARLA. El Bearer se
 * reenvía a un endpoint read-only de core-api; si el AWS dice 200, la
 * sesión es válida.
 *
 * ⚠️ HALLAZGO FORENSE (21-ago, smoke E2E con el token real de sesión): ESTE
 * HOP NO ALCANZA. Medido: `Authorization: Bearer <jwt>` con `credentials:
 * 'omit'` (server-side no tiene cookie) → **401** en `/api/marketplace/orders`
 * Y en `/api/genesis/me`. El portal valida por COOKIE de sesión httponly,
 * no por Bearer puro — el 200 del navegador venía de la cookie same-origin,
 * no del token. Una cookie httponly no la ve el JS ni la puede reenviar el
 * backend. El módulo queda como está (el ritual es correcto), pero E6 está
 * BLOQUEADO por identidad hasta una decisión de arriba — ver el handoff:
 *   A' · copiar el SECRETKEY (HS256) a Vercel y verificar aquí — es lo que
 *        la firma quería evitar; decisión del auditor/owner.
 *   B' · core-api expone un endpoint que acepte Bearer puro para validar
 *        (cambio en prod-aligned, otro linaje).
 * NO se degrada a «confiar en el payload sin verificar»: cualquiera
 * falsificaría un userId. Sin verificación real, no hay tickets por cuenta.
 * ═════════════════════════════════════════════════════════════════════════
 */

const URL_DE_VALIDACION =
  process.env.SOPORTE_VALIDACION_URL || 'https://g-pulse.aigenesis.io/api/marketplace/orders'

/** Caché en memoria de tokens ya validados: hash → vencimiento. */
const validados = new Map<string, number>()
const CACHE_MS = 5 * 60 * 1000

async function hashDelToken(token: string): Promise<string> {
  const datos = new TextEncoder().encode(token)
  const hash = await crypto.subtle.digest('SHA-256', datos)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export interface Identidad {
  userId: string
  wallet: string
  userName: string
}

/** Payload del JWT SIN verificar firma — sólo se usa tras el hop en 200. */
function leerPayload(token: string): Identidad | null {
  try {
    const crudo = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const p = JSON.parse(Buffer.from(crudo, 'base64').toString('utf8'))
    const userId = String(p._id ?? '')
    if (!/^[0-9a-f]{24}$/i.test(userId)) return null
    if (p.exp && Date.now() / 1000 > Number(p.exp)) return null
    return { userId, wallet: String(p.wallet ?? ''), userName: String(p.userName ?? '') }
  } catch {
    return null
  }
}

/**
 * @returns la identidad si la sesión es válida; 'invalida' si el AWS dijo
 * 401; 'sin_respaldo' si el AWS no respondió (el llamador devuelve 503 —
 * honesto, no un 401 falso).
 */
export async function validarSesion(
  authHeader: string | null
): Promise<Identidad | 'invalida' | 'sin_respaldo'> {
  const token = (authHeader ?? '').replace(/^Bearer\s+/i, '').trim()
  if (!token || token.split('.').length !== 3) return 'invalida'

  const identidad = leerPayload(token)
  if (!identidad) return 'invalida'

  const clave = await hashDelToken(token)
  const vence = validados.get(clave)
  if (vence && vence > Date.now()) return identidad

  const control = new AbortController()
  const t = setTimeout(() => control.abort(), 5000)
  try {
    const r = await fetch(URL_DE_VALIDACION, {
      headers: { Authorization: `Bearer ${token}` },
      signal: control.signal,
    })
    if (r.status === 401 || r.status === 403) return 'invalida'
    if (!r.ok) return 'sin_respaldo'
    validados.set(clave, Date.now() + CACHE_MS)
    /* la caché no crece sin fin */
    if (validados.size > 2000) {
      const ahora = Date.now()
      for (const [k, v] of Array.from(validados.entries())) if (v < ahora) validados.delete(k)
    }
    return identidad
  } catch {
    return 'sin_respaldo'
  } finally {
    clearTimeout(t)
  }
}
