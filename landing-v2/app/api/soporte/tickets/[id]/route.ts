import { NextResponse } from 'next/server'
import { abrirContexto, opciones } from '../../_lib/http'
import { leerTicket } from '../../_lib/almacen-tickets'

/* GET /api/soporte/tickets/:id — un ticket con todos sus mensajes.
   La propiedad la impone el almacén: se busca SOLO dentro del hash del
   userId autenticado — otra cuenta ni siquiera puede preguntar por él. */

export const OPTIONS = opciones

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await abrirContexto(req)
  if (!ctx.ok) return ctx.respuesta
  const { id } = await params
  const ticket = await leerTicket(ctx.identidad.userId, id)
  if (!ticket) {
    return NextResponse.json({ error: 'no_existe' }, { status: 404, headers: ctx.cors })
  }
  return NextResponse.json({ ticket }, { headers: ctx.cors })
}
