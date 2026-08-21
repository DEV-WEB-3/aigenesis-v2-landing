import { NextResponse } from 'next/server'
import { abrirContexto, opciones } from '../../../_lib/http'
import { guardarTicket, leerTicket } from '../../../_lib/almacen-tickets'

/* POST /api/soporte/tickets/:id/close — cerrar el ticket. */

export const OPTIONS = opciones

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await abrirContexto(req)
  if (!ctx.ok) return ctx.respuesta
  const { id } = await params

  const ticket = await leerTicket(ctx.identidad.userId, id)
  if (!ticket) {
    return NextResponse.json({ error: 'no_existe' }, { status: 404, headers: ctx.cors })
  }
  ticket.status = 'closed'
  const ok = await guardarTicket(ctx.identidad.userId, ticket)
  if (!ok) {
    return NextResponse.json({ error: 'almacen_no_responde' }, { status: 502, headers: ctx.cors })
  }
  return NextResponse.json({ ticket }, { headers: ctx.cors })
}
