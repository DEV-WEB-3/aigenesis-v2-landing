import { NextResponse } from 'next/server'
import { abrirContexto, opciones } from '../../../_lib/http'
import { filtrarSecretos, guardarTicket, leerTicket } from '../../../_lib/almacen-tickets'

/* POST /api/soporte/tickets/:id/messages — añadir un mensaje al hilo.
   Acepta sender 'user' (la persona) y 'agent' (el asistente del cliente
   guarda su propia respuesta para que el hilo viaje completo al humano).
   Los secretos se filtran SIEMPRE, venga de quien venga. */

export const OPTIONS = opciones

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await abrirContexto(req)
  if (!ctx.ok) return ctx.respuesta
  const { id } = await params

  let cuerpo: Record<string, unknown>
  try {
    cuerpo = await req.json()
  } catch {
    return NextResponse.json({ error: 'cuerpo_invalido' }, { status: 400, headers: ctx.cors })
  }

  const body = String(cuerpo.body ?? '').trim().slice(0, 4000)
  const sender = cuerpo.sender === 'agent' ? 'agent' : 'user'
  if (body.length < 1) {
    return NextResponse.json({ error: 'datos_invalidos' }, { status: 400, headers: ctx.cors })
  }

  const ticket = await leerTicket(ctx.identidad.userId, id)
  if (!ticket) {
    return NextResponse.json({ error: 'no_existe' }, { status: 404, headers: ctx.cors })
  }
  if (ticket.status === 'closed') {
    return NextResponse.json({ error: 'ticket_cerrado' }, { status: 409, headers: ctx.cors })
  }

  const { texto, filtrado } = filtrarSecretos(body)
  const ahora = Date.now()
  const mensaje = {
    id: `m-${ahora}-${Math.floor(Math.random() * 1e6)}`,
    body: texto,
    sender: sender as 'user' | 'agent',
    ts: ahora,
    ...(sender === 'user' ? { seen: true } : {}),
    ...(sender === 'agent' && cuerpo.agent && typeof cuerpo.agent === 'object'
      ? { agent: cuerpo.agent as { name: string; level: string } }
      : {}),
    ...(cuerpo.tarjeta && typeof cuerpo.tarjeta === 'object' ? { tarjeta: cuerpo.tarjeta } : {}),
    ...(cuerpo.hold && typeof cuerpo.hold === 'object' ? { hold: cuerpo.hold } : {}),
  }

  ticket.messages.push(mensaje)
  ticket.status = sender === 'agent' ? 'waiting_user' : 'open'

  const ok = await guardarTicket(ctx.identidad.userId, ticket)
  if (!ok) {
    return NextResponse.json({ error: 'almacen_no_responde' }, { status: 502, headers: ctx.cors })
  }
  return NextResponse.json({ mensaje, secretoFiltrado: filtrado }, { status: 201, headers: ctx.cors })
}
