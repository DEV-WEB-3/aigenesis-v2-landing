import { NextResponse } from 'next/server'
import { contarPeticion } from '../../asistente/almacen'
import { validarSesion, type Identidad } from './auth'
import { TICKETS_ACTIVOS } from './almacen-tickets'

/*
 * PLOMERÍA COMÚN de las rutas de tickets (E6): CORS de lista cerrada (los
 * mismos orígenes del cerebro), tope por IP en KV, y el ritual de sesión —
 * en UN lugar, para que cinco rutas no repitan cinco veces lo mismo con
 * cuatro variantes.
 */

const ORIGENES_PERMITIDOS = new Set([
  'https://aigenesis.io',
  'https://www.aigenesis.io',
  'https://conect.aigenesis.io',
  'https://g-pulse.aigenesis.io',
])

export function cabecerasCors(origin: string | null): Record<string, string> {
  const permitido =
    origin && (ORIGENES_PERMITIDOS.has(origin) || origin.startsWith('http://localhost:'))
  return {
    'Access-Control-Allow-Origin': permitido ? origin : 'https://aigenesis.io',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Idempotencia',
    Vary: 'Origin',
  }
}

export function opciones(req: Request) {
  return new NextResponse(null, { status: 204, headers: cabecerasCors(req.headers.get('origin')) })
}

const ventana = new Map<string, { n: number; desde: number }>()
const TOPE = 40
const VENTANA_MS = 60_000

function topeEnMemoria(ip: string): boolean {
  const ahora = Date.now()
  const v = ventana.get(ip)
  if (!v || ahora - v.desde > VENTANA_MS) {
    ventana.set(ip, { n: 1, desde: ahora })
    return true
  }
  v.n += 1
  return v.n <= TOPE
}

export type Contexto =
  | { ok: true; identidad: Identidad; cors: Record<string, string> }
  | { ok: false; respuesta: NextResponse }

/** El ritual completo: CORS + tope + almacén + sesión. */
export async function abrirContexto(req: Request): Promise<Contexto> {
  const cors = cabecerasCors(req.headers.get('origin'))
  const ip = (req.headers.get('x-forwarded-for') ?? 'sin-ip').split(',')[0].trim()

  const enKv = await contarPeticion(ip, 'tickets').catch(() => null)
  const pasa = enKv !== null ? enKv <= TOPE : topeEnMemoria(ip)
  if (!pasa) {
    return {
      ok: false,
      respuesta: NextResponse.json(
        { error: 'demasiadas_peticiones' },
        { status: 429, headers: { ...cors, 'Retry-After': '60' } }
      ),
    }
  }

  if (!TICKETS_ACTIVOS) {
    return {
      ok: false,
      respuesta: NextResponse.json({ error: 'almacen_sin_configurar' }, { status: 503, headers: cors }),
    }
  }

  const sesion = await validarSesion(req.headers.get('authorization'))
  if (sesion === 'invalida') {
    return {
      ok: false,
      respuesta: NextResponse.json({ error: 'sesion_invalida' }, { status: 401, headers: cors }),
    }
  }
  if (sesion === 'sin_respaldo') {
    /* El AWS no respondió: 503 honesto, no un 401 falso que confunda. */
    return {
      ok: false,
      respuesta: NextResponse.json({ error: 'validacion_no_disponible' }, { status: 503, headers: cors }),
    }
  }

  return { ok: true, identidad: sesion, cors }
}
