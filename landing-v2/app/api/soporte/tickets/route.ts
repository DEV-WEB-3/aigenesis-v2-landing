import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { abrirContexto, opciones } from '../_lib/http'
import {
  contarTickets,
  filtrarSecretos,
  guardarTicket,
  LIMITE_TICKETS,
  listarTickets,
  reclamarIdempotencia,
  type TicketSoporte,
} from '../_lib/almacen-tickets'

/*
 * TICKETS DE SOPORTE POR CUENTA — E6 v1 (contrato:
 * docs/contrato-tickets-soporte.md; opción A firmada: Vercel + Upstash;
 * identidad por hop de validación contra core-api — ver _lib/auth.ts).
 *
 * GET  → los tickets de la cuenta autenticada
 * POST → crear uno (id del SERVIDOR, idempotente, secretos filtrados,
 *        y en categoría retiro el plazo 1 min–72 h dicho AL ABRIR)
 */

export const OPTIONS = opciones

export async function GET(req: Request) {
  const ctx = await abrirContexto(req)
  if (!ctx.ok) return ctx.respuesta
  const tickets = await listarTickets(ctx.identidad.userId)
  if (tickets === null) {
    return NextResponse.json({ error: 'almacen_no_responde' }, { status: 502, headers: ctx.cors })
  }
  return NextResponse.json({ tickets }, { headers: ctx.cors })
}

const CATEGORIAS: ReadonlySet<string> = new Set(['retiro', 'deposito', 'red', 'seguridad'])
const PRIORIDADES: ReadonlySet<string> = new Set(['low', 'medium', 'high'])

/* Regla 5 del contrato: el plazo se dice al abrir, no cuando ya hay enfado. */
const AVISO_PLAZO_RETIRO =
  'Sobre los reclamos: pueden tardar de 1 minuto a 72 horas según las verificaciones de seguridad. Si aún está en ese plazo, está en curso — abrir otro ticket por el mismo reclamo no lo acelera.'

export async function POST(req: Request) {
  const ctx = await abrirContexto(req)
  if (!ctx.ok) return ctx.respuesta

  let cuerpo: Record<string, unknown>
  try {
    cuerpo = await req.json()
  } catch {
    return NextResponse.json({ error: 'cuerpo_invalido' }, { status: 400, headers: ctx.cors })
  }

  const title = String(cuerpo.title ?? '').trim().slice(0, 120)
  const category = String(cuerpo.category ?? '')
  const priority = String(cuerpo.priority ?? 'medium')
  const mensaje = String(cuerpo.mensaje ?? '').trim().slice(0, 4000)
  if (!title || !CATEGORIAS.has(category) || !PRIORIDADES.has(priority) || mensaje.length < 3) {
    return NextResponse.json({ error: 'datos_invalidos' }, { status: 400, headers: ctx.cors })
  }

  const existentes = await contarTickets(ctx.identidad.userId)
  if (existentes >= LIMITE_TICKETS) {
    return NextResponse.json({ error: 'limite_de_tickets' }, { status: 409, headers: ctx.cors })
  }

  /* Regla 1: el ID lo asigna el servidor. */
  const idNuevo = `vip-${randomUUID().slice(0, 13)}`

  /* Regla 2: idempotencia — misma clave del cliente, mismo ticket. */
  const claveIdem = String(req.headers.get('x-idempotencia') ?? '').trim()
  if (claveIdem) {
    const idFinal = await reclamarIdempotencia(ctx.identidad.userId, claveIdem, idNuevo)
    if (idFinal !== idNuevo) {
      return NextResponse.json({ ticketId: idFinal, repetido: true }, { headers: ctx.cors })
    }
  }

  /* Regla 3: jamás se guarda un secreto. */
  const { texto: cuerpoLimpio, filtrado } = filtrarSecretos(mensaje)

  const ahora = Date.now()
  const mensajes: TicketSoporte['messages'] = [
    { id: `m-${ahora}`, body: cuerpoLimpio, sender: 'user', ts: ahora, seen: true },
  ]
  if (category === 'retiro') {
    mensajes.push({
      id: `m-${ahora + 1}`,
      body: AVISO_PLAZO_RETIRO,
      sender: 'agent',
      ts: ahora + 1,
      agent: { name: 'Asistente Genesis', level: 'IA' },
    })
  }

  const ticket: TicketSoporte = {
    id: idNuevo,
    title,
    category,
    priority,
    status: 'open',
    unread: false,
    createdAt: ahora,
    messages: mensajes,
    ...(cuerpo.incident && typeof cuerpo.incident === 'object'
      ? { kind: 'incident', incident: cuerpo.incident }
      : {}),
  }

  const guardado = await guardarTicket(ctx.identidad.userId, ticket)
  if (!guardado) {
    return NextResponse.json({ error: 'almacen_no_responde' }, { status: 502, headers: ctx.cors })
  }
  return NextResponse.json({ ticket, secretoFiltrado: filtrado }, { status: 201, headers: ctx.cors })
}
