import { NextResponse } from 'next/server'
import { responder } from '@/lib/soporte/buscar'
import type { Proyecto } from '@/lib/soporte/tipos'
import { registrarConsulta } from './almacen'

/*
 * EL ENDPOINT DEL ASISTENTE — vive en Vercel, no en el servidor del dinero.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * POR QUÉ AQUÍ Y NO EN EL AWS DE GENESIS, aunque ese servidor ya esté pagado.
 *
 * Radio de explosión. El AWS lleva el camino del dinero (core-api, con su
 * gobernanza prod-aligned y su certificación). Un asistente es tráfico
 * público y ruidoso: si alguien lo martillea, tiene que caerse el asistente
 * — no la caja. Y ese disco ya llegó una vez al 100%.
 *
 * Además el corpus vive EN ESTE REPO: el endpoint lo importa directamente,
 * así que la página, este endpoint y el futuro chat del portal responden
 * desde una sola fuente. Sin copias que divergen.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * HOY ES DETERMINISTA Y ESO ES DELIBERADO.
 *
 * Responde con `responder()` — el mismo cerebro que la página. Cuando el
 * owner decida proveedor de modelo (S3), se cambia el interior de POST y
 * NADA más: la interfaz, el contrato y los guardarraíles quedan como están.
 * Así la tubería entera queda montada y probada antes de gastar un céntimo.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ESTE ARCHIVO NO EXISTE EN LA EXPORTACIÓN ESTÁTICA.
 *
 * La copia de Hostinger se genera con `output: 'export'`, que no admite
 * handlers POST — el build reventaría. `scripts/exportar.mjs` aparta `app/api`
 * durante la exportación y lo restaura al terminar. La página estática no lo
 * necesita: usa el cerebro local. Este endpoint es para el PORTAL (S2) y
 * para cuando llegue el modelo.
 * ═════════════════════════════════════════════════════════════════════════
 */

/*
 * CORS: lista cerrada. Un endpoint abierto a cualquier origen es un proxy
 * gratuito para terceros — hoy da igual (es determinista), pero el día que
 * detrás haya un modelo de pago, cada petición ajena quema crédito.
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

/*
 * TOPE DE USO, con su limitación DICHA: esto vive en la memoria de la
 * instancia serverless, así que protege contra el bucle tonto desde una IP,
 * no contra un ataque distribuido — cada instancia nueva arranca con el
 * contador a cero. Para el cerebro determinista alcanza de sobra; el día que
 * detrás haya un modelo de pago, este tope se sustituye por uno real (KV o
 * el rate-limit de la plataforma) ANTES de poner la clave. Está anotado en
 * el propio código para que nadie lo descubra en la factura.
 */
const ventana = new Map<string, { n: number; desde: number }>()
const TOPE = 30 // peticiones
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

const PROYECTOS: ReadonlySet<string> = new Set(['genesis', 'gpulse', 'gevy', 'ecosistema'])

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: cabecerasCors(req.headers.get('origin')) })
}

export async function POST(req: Request) {
  const cors = cabecerasCors(req.headers.get('origin'))
  const ip = (req.headers.get('x-forwarded-for') ?? 'sin-ip').split(',')[0].trim()

  if (!dentroDelTope(ip)) {
    return NextResponse.json(
      { error: 'demasiadas_peticiones' },
      { status: 429, headers: { ...cors, 'Retry-After': '60' } }
    )
  }

  let cuerpo: unknown
  try {
    cuerpo = await req.json()
  } catch {
    return NextResponse.json({ error: 'cuerpo_invalido' }, { status: 400, headers: cors })
  }

  const consulta = typeof (cuerpo as { consulta?: unknown })?.consulta === 'string'
    ? ((cuerpo as { consulta: string }).consulta || '').slice(0, 500)
    : ''
  if (consulta.trim().length < 3) {
    return NextResponse.json({ error: 'consulta_corta' }, { status: 400, headers: cors })
  }

  const proyectoCrudo = (cuerpo as { proyecto?: unknown })?.proyecto
  const proyecto =
    typeof proyectoCrudo === 'string' && PROYECTOS.has(proyectoCrudo)
      ? (proyectoCrudo as Proyecto)
      : undefined

  /*
   * La respuesta viaja con su tipo (`respuesta` | `derivar` | `cortesia`)
   * tal cual sale del cerebro. El cliente NO decide si se supo responder: lo
   * decide el corpus, igual que en la página. Un cliente que maquille el
   * `derivar` estaría rompiendo el contrato de honestidad en su lado.
   */
  const r = responder(consulta, proyecto)

  /*
   * R1 — LA MEMORIA (E2): cada consulta queda en el registro con su
   * resultado. Sin PII (ni la IP del tope entra aquí). Con tope de tiempo
   * interno y catch: registrar jamás puede romper ni demorar el responder.
   */
  await registrarConsulta({
    ts: Date.now(),
    proyecto,
    consulta,
    resultado: r.tipo,
    id: r.tipo === 'respuesta' ? r.pregunta.id : r.tipo === 'cortesia' ? r.clase : undefined,
  }).catch(() => {})

  return NextResponse.json(r, { headers: cors })
}
