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
 * LA MITIGACIÓN (E6 B', RESUELTA 21-ago): no verificar la firma aquí —
 * DELEGARLA a core-api. El Bearer se reenvía server-side a
 * `GET /api/auth/session-introspect`, que verifica la firma HS256 con el
 * SECRETKEY (que se queda en AWS) y devuelve el userId. Ese userId FIRMADO
 * es la identidad autoritativa; la landing no confía en el payload que
 * decodifica.
 *
 * Historia (por qué costó): el primer hop apuntaba a `/api/marketplace/orders`,
 * que valida por COOKIE httponly y daba 401 a un Bearer server-side (el 200
 * del navegador era la cookie same-origin, no el token). El smoke E2E lo
 * reveló y se abrió el introspect en prod-aligned (A' —copiar el secreto a
 * Vercel— fue rechazada). NO se degrada a «confiar en el payload sin
 * verificar»: cualquiera falsificaría un userId.
 * ═════════════════════════════════════════════════════════════════════════
 */

/*
 * EL HOP APUNTA AL INTROSPECT (E6 B', 21-ago — resuelto). core-api expone
 * `GET /api/auth/session-introspect`, que VERIFICA la firma HS256 con el
 * SECRETKEY (que se queda en AWS) y devuelve el userId. La identidad
 * autoritativa es la que ESE 200 devuelve —firmada—, no la que decodifica
 * la landing sin verificar. El endpoint viejo (marketplace/orders) validaba
 * por cookie httponly y daba 401 a un Bearer server-side: por eso E6 estuvo
 * bloqueado hasta este endpoint.
 */
const URL_DE_VALIDACION =
  process.env.SOPORTE_VALIDACION_URL ||
  'https://g-pulse.aigenesis.io/api/auth/session-introspect'

/** Caché en memoria de identidades ya validadas: hash del token → { userId, vence }. */
const validados = new Map<string, { userId: string; vence: number }>()
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

/*
 * Datos de DISPLAY (wallet, userName) del payload — NO se usan para
 * autorizar: el userId autoritativo llega firmado desde el introspect. Esto
 * es solo para poblar la ficha sin un ida y vuelta extra.
 */
function displayDelPayload(token: string): { wallet: string; userName: string } {
  try {
    const crudo = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const p = JSON.parse(Buffer.from(crudo, 'base64').toString('utf8'))
    return { wallet: String(p.wallet ?? ''), userName: String(p.userName ?? '') }
  } catch {
    return { wallet: '', userName: '' }
  }
}

/**
 * @returns la identidad (con el userId FIRMADO por core-api) si la sesión es
 * válida; 'invalida' si el introspect dijo 401; 'sin_respaldo' si no respondió
 * (el llamador devuelve 503 honesto, no un 401 falso).
 */
export async function validarSesion(
  authHeader: string | null
): Promise<Identidad | 'invalida' | 'sin_respaldo'> {
  const token = (authHeader ?? '').replace(/^Bearer\s+/i, '').trim()
  if (!token || token.split('.').length !== 3) return 'invalida'

  const display = displayDelPayload(token)
  const clave = await hashDelToken(token)
  const cacheada = validados.get(clave)
  if (cacheada && cacheada.vence > Date.now()) {
    return { userId: cacheada.userId, ...display }
  }

  const control = new AbortController()
  const t = setTimeout(() => control.abort(), 5000)
  try {
    const r = await fetch(URL_DE_VALIDACION, {
      headers: { Authorization: `Bearer ${token}` },
      signal: control.signal,
    })
    if (r.status === 401 || r.status === 403) return 'invalida'
    if (!r.ok) return 'sin_respaldo'
    const cuerpo = (await r.json().catch(() => null)) as { ok?: boolean; userId?: unknown } | null
    /* El userId autoritativo: el que el introspect VERIFICÓ por firma. Sin
       un userId válido en el 200, no hay identidad — jamás caer al payload. */
    const userId = typeof cuerpo?.userId === 'string' ? cuerpo.userId : ''
    if (!cuerpo?.ok || !/^[0-9a-f]{24}$/i.test(userId)) return 'invalida'

    validados.set(clave, { userId, vence: Date.now() + CACHE_MS })
    if (validados.size > 2000) {
      const ahora = Date.now()
      for (const [k, v] of Array.from(validados.entries())) if (v.vence < ahora) validados.delete(k)
    }
    return { userId, ...display }
  } catch {
    return 'sin_respaldo'
  } finally {
    clearTimeout(t)
  }
}
