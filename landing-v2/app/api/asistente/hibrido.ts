import { buscar } from '@/lib/soporte/buscar'
import { revisarLenguaje } from '@/lib/soporte/lenguaje'
import type { Proyecto } from '@/lib/soporte/tipos'

/*
 * EL CEREBRO HÍBRIDO — E7 (GO total del owner, 21-ago-2026).
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SOLO corre cuando el corpus NO respondió (miss del determinista): el
 * camino barato y determinista SIEMPRE va primero. Y solo redacta ENCIMA
 * de las fichas que el retrieval le entrega — jamás de memoria: el criterio
 * del auditor («cita id o deriva») está cableado como validación dura, no
 * como esperanza.
 *
 * DOBLE PUERTA (como el destilador): env `ASISTENTE_HIBRIDO=1` + env
 * `ANTHROPIC_API_KEY`. Sin cualquiera de las dos, este módulo devuelve
 * null y el endpoint deriva como siempre — el despliegue de este código NO
 * enciende nada.
 *
 * TRES VALIDACIONES SOBRE LA SALIDA, en orden:
 *  1 · JSON con forma exacta { respuesta, citas[] } — o se descarta.
 *  2 · toda cita debe ser un id REAL de las fichas entregadas, y debe haber
 *      al menos una — o se descarta (la respuesta sin fuente no existe).
 *  3 · la guarda de lenguaje (las 12 reglas de siempre) sobre el texto —
 *      una promesa de activación del modelo muere aquí, no en producción.
 * Descartada por cualquiera de las tres → el endpoint deriva. Honesto.
 * ═════════════════════════════════════════════════════════════════════════
 */

const MODELO = process.env.ASISTENTE_HIBRIDO_MODELO || 'claude-haiku-4-5'

export const HIBRIDO_ACTIVO = Boolean(
  process.env.ASISTENTE_HIBRIDO === '1' && process.env.ANTHROPIC_API_KEY
)

const SISTEMA = `Eres el asistente de soporte de AiGenesis. Respondes en español, cálido y directo.

REGLAS INQUEBRANTABLES:
1. Respondes ÚNICAMENTE con información de las FICHAS que se te entregan. Nada de memoria propia.
2. Tu salida es JSON estricto: {"respuesta": "...", "citas": ["id-de-ficha", ...]} — las citas son los ids de las fichas que usaste, mínimo una.
3. Si las fichas NO alcanzan para responder con seguridad, tu salida es exactamente {"respuesta": "NO_SE", "citas": []}. Sobre dinero, una respuesta plausible y equivocada es peor que un «no lo sé».
4. Jamás prometas activaciones, plazos que no estén en una ficha, ni «un agente te contactará».
5. Máximo 120 palabras. Sin saludos (el protocolo de trato los pone aparte).`

export interface RespuestaHibrida {
  tipo: 'hibrida'
  mensaje: string
  citas: string[]
}

export async function consultarHibrido(
  consulta: string,
  proyecto?: Proyecto
): Promise<RespuestaHibrida | null> {
  if (!HIBRIDO_ACTIVO) return null

  /* El retrieval entrega candidatas AUNQUE estén bajo el umbral — para eso
     está el modelo: leer cinco fichas cercanas y decidir si alguna responde. */
  const candidatas = buscar(consulta, { proyecto, limite: 5 })
  if (candidatas.length === 0) return null

  const fichas = candidatas.map(({ pregunta }) => ({
    id: pregunta.id,
    pregunta: pregunta.pregunta,
    respuesta: pregunta.respuesta,
  }))
  const idsValidos = new Set(fichas.map((f) => f.id))

  const control = new AbortController()
  const t = setTimeout(() => control.abort(), 12_000)
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY as string,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 500,
        system: [{ type: 'text', text: SISTEMA, cache_control: { type: 'ephemeral' } }],
        messages: [
          {
            role: 'user',
            content: `FICHAS DISPONIBLES:\n${JSON.stringify(fichas)}\n\nPREGUNTA DE LA PERSONA:\n${consulta}`,
          },
        ],
      }),
      signal: control.signal,
    })
    if (!r.ok) return null
    const cuerpo = (await r.json()) as { content?: { type: string; text?: string }[] }
    const texto = cuerpo.content?.find((c) => c.type === 'text')?.text ?? ''

    /* Validación 1: JSON con la forma exacta. */
    const m = texto.match(/\{[\s\S]*\}/)
    if (!m) return null
    let salida: { respuesta?: unknown; citas?: unknown }
    try {
      salida = JSON.parse(m[0])
    } catch {
      return null
    }
    const respuesta = typeof salida.respuesta === 'string' ? salida.respuesta.trim() : ''
    if (!respuesta || respuesta === 'NO_SE') return null

    /* Validación 2: cita id o no existe. */
    const citas = Array.isArray(salida.citas)
      ? salida.citas.filter((c): c is string => typeof c === 'string' && idsValidos.has(c))
      : []
    if (citas.length === 0) return null

    /* Validación 3: la guarda de lenguaje sobre la SALIDA del modelo. */
    if (revisarLenguaje(respuesta).length > 0) return null

    return { tipo: 'hibrida', mensaje: respuesta.slice(0, 1200), citas }
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}
