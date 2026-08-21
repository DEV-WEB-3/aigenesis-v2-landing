import { NextResponse } from 'next/server'
import { registrarFeedback } from '../almacen'

/*
 * FEEDBACK DEL ASISTENTE — E2 (R1). Hasta hoy el 😞😐😍 moría en el
 * localStorage del usuario: nosotros nunca lo veíamos. Desde aquí viaja al
 * registro y se convierte en la señal que ordena qué fichas corregir.
 *
 * Mismo criterio de CORS que el endpoint principal, y fire-and-forget desde
 * las superficies: si esto falla, el chat ni se entera.
 */

const ORIGENES_PERMITIDOS = new Set([
  'https://aigenesis.io',
  'https://www.aigenesis.io',
  'https://conect.aigenesis.io',
  'https://g-pulse.aigenesis.io',
])

function cabecerasCors(origin: string | null): Record<string, string> {
  const permitido =
    origin && (ORIGENES_PERMITIDOS.has(origin) || origin.startsWith('http://localhost:'))
  return {
    'Access-Control-Allow-Origin': permitido ? origin : 'https://aigenesis.io',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

const ventana = new Map<string, { n: number; desde: number }>()
const TOPE = 20
const VENTANA_MS = 60_000

function dentroDelTope(ip: string): boolean {
  const ahora = Date.now()
  const v = ventana.get(ip)
  if (!v || ahora - v.desde > VENTANA_MS) {
    ventana.set(ip, { n: 1, desde: ahora })
    return true
  }
  v.n += 1
  return v.n <= TOPE
}

const VALORES: ReadonlySet<string> = new Set(['no', 'medio', 'si'])

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: cabecerasCors(req.headers.get('origin')) })
}

export async function POST(req: Request) {
  const cors = cabecerasCors(req.headers.get('origin'))
  const ip = (req.headers.get('x-forwarded-for') ?? 'sin-ip').split(',')[0].trim()
  if (!dentroDelTope(ip)) {
    return NextResponse.json({ error: 'demasiadas_peticiones' }, { status: 429, headers: cors })
  }

  let cuerpo: { preguntaId?: unknown; valor?: unknown }
  try {
    cuerpo = await req.json()
  } catch {
    return NextResponse.json({ error: 'cuerpo_invalido' }, { status: 400, headers: cors })
  }

  const preguntaId = typeof cuerpo.preguntaId === 'string' ? cuerpo.preguntaId.trim() : ''
  const valor = typeof cuerpo.valor === 'string' ? cuerpo.valor : ''
  if (!preguntaId || !VALORES.has(valor)) {
    return NextResponse.json({ error: 'datos_invalidos' }, { status: 400, headers: cors })
  }

  await registrarFeedback(preguntaId, valor).catch(() => {})
  return NextResponse.json({ ok: true }, { headers: cors })
}
