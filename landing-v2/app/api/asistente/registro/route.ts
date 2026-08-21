import { NextResponse } from 'next/server'
import { leerRegistro, REGISTRO_ACTIVO } from '../almacen'

/*
 * LECTURA DEL REGISTRO — el insumo del tablero (E2) y, en su día, del
 * destilador (E5, HOLD). Ruta de administración: exige la clave de env
 * `ASISTENTE_REGISTRO_CLAVE` en la cabecera `x-registro-clave`. Sin clave
 * configurada, la ruta no existe a efectos prácticos (403 siempre).
 *
 * Devuelve además el resumen que responde la pregunta del owner: cuántas
 * consultas atendió el corpus, cuántas la cortesía y cuántas se derivaron —
 * la semilla del tablero de convergencia.
 */

export async function GET(req: Request) {
  const clave = process.env.ASISTENTE_REGISTRO_CLAVE || ''
  const traida = req.headers.get('x-registro-clave') || ''
  if (!clave || traida !== clave) {
    return NextResponse.json({ error: 'no_autorizado' }, { status: 403 })
  }
  if (!REGISTRO_ACTIVO) {
    return NextResponse.json({ error: 'almacen_sin_configurar' }, { status: 503 })
  }

  const datos = await leerRegistro(1000)
  if (!datos) {
    return NextResponse.json({ error: 'almacen_no_responde' }, { status: 502 })
  }

  const conteo = { respuesta: 0, derivar: 0, cortesia: 0 }
  const misses = new Map<string, number>()
  for (const e of datos.registro as { resultado?: string; consulta?: string }[]) {
    if (e.resultado && e.resultado in conteo) conteo[e.resultado as keyof typeof conteo] += 1
    if (e.resultado === 'derivar' && e.consulta) {
      misses.set(e.consulta, (misses.get(e.consulta) ?? 0) + 1)
    }
  }
  const topMisses = Array.from(misses.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20)

  return NextResponse.json({ conteo, topMisses, ...datos })
}
