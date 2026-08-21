#!/usr/bin/env node
/*
 * TABLERO v0 DEL ASISTENTE — protocolo de operación de la pista (21-ago-2026).
 *
 * Lee el registro R1 (Upstash vía el endpoint admin) y produce el informe
 * semanal: % corpus / % derivar / % cortesía, top-misses accionables y
 * feedback por ficha. Es el insumo del hito del ~28-ago (posible GO de E5)
 * y de cada tanda E4. Read-only, cero API de pago.
 *
 * RUIDO EXCLUIDO, y por qué dos filtros:
 *  1. Todo lo ANTERIOR al corte (por defecto 21-ago-2026 08:00Z, cuando se
 *     desplegó el filtro `canario:`) puede traer sondas sin marcar — el
 *     primer día metió 70+ entradas sintéticas. Se excluye por timestamp.
 *  2. Después del corte, las sondas llevan `canario:` y ya ni se graban.
 *
 * Uso:
 *   ASISTENTE_REGISTRO_CLAVE=... node scripts/tablero-soporte.mjs
 *   node scripts/tablero-soporte.mjs --clave <clave> [--desde 2026-08-21T08:00:00Z] [--md salida.md]
 *
 * La clave JAMÁS se escribe en el repo: viene por env o argumento.
 */

const arg = (nombre) => {
  const i = process.argv.indexOf(`--${nombre}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

const CLAVE = arg('clave') ?? process.env.ASISTENTE_REGISTRO_CLAVE
if (!CLAVE) {
  console.error('falta la clave: --clave <...> o env ASISTENTE_REGISTRO_CLAVE')
  process.exit(1)
}

/* Corte por defecto: el despliegue del filtro de canarios. */
const DESDE = Date.parse(arg('desde') ?? '2026-08-21T08:00:00Z')
const URL = arg('url') ?? 'https://aigenesis-landing.vercel.app/api/asistente/registro'

const r = await fetch(URL, { headers: { 'x-registro-clave': CLAVE } })
if (!r.ok) {
  console.error(`el registro respondió ${r.status} — sin datos no hay tablero`)
  process.exit(1)
}
const datos = await r.json()

const limpio = (datos.registro ?? []).filter((e) => Number(e.ts) >= DESDE)
const excluidas = (datos.registro ?? []).length - limpio.length

const conteo = { respuesta: 0, derivar: 0, cortesia: 0, hibrida: 0 }
const misses = new Map()
const hits = new Map()
for (const e of limpio) {
  if (e.resultado in conteo) conteo[e.resultado] += 1
  if (e.resultado === 'derivar') {
    const clave = String(e.consulta ?? '').toLowerCase().trim()
    misses.set(clave, { texto: e.consulta, n: (misses.get(clave)?.n ?? 0) + 1 })
  }
  if (e.resultado === 'respuesta' && e.id) hits.set(e.id, (hits.get(e.id) ?? 0) + 1)
}
const total = conteo.respuesta + conteo.derivar + conteo.cortesia + conteo.hibrida
const pct = (n) => (total ? `${((100 * n) / total).toFixed(1)}%` : '—')

const feedback = new Map()
for (const f of datos.feedback ?? []) {
  if (Number(f.ts) < DESDE) continue
  const porFicha = feedback.get(f.preguntaId) ?? { no: 0, medio: 0, si: 0 }
  if (f.valor in porFicha) porFicha[f.valor] += 1
  feedback.set(f.preguntaId, porFicha)
}

const topMisses = [...misses.values()].sort((a, b) => b.n - a.n).slice(0, 15)
const topHits = [...hits.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)

const lineas = []
const w = (s = '') => lineas.push(s)
w(`# Tablero del asistente · ${new Date().toISOString().slice(0, 10)}`)
w()
w(`Ventana: desde ${new Date(DESDE).toISOString()} · ${total} consultas limpias (${excluidas} excluidas como ruido pre-corte)`)
w()
w(`| Resultado | N | % |`)
w(`|---|---|---|`)
w(`| Corpus (respuesta) | ${conteo.respuesta} | ${pct(conteo.respuesta)} |`)
w(`| Derivar | ${conteo.derivar} | ${pct(conteo.derivar)} |`)
w(`| Cortesía | ${conteo.cortesia} | ${pct(conteo.cortesia)} |`)
w(`| Híbrida (API) | ${conteo.hibrida} | ${pct(conteo.hibrida)} |`)
w()
/* E9 — LA LÍNEA DE CONVERGENCIA: el compilado debe crecer y la API decrecer.
   Meta de régimen estable (plan del owner): corpus ≥ 85%. */
const compilado = conteo.respuesta + conteo.cortesia
w(`**Convergencia (E9):** compilado ${pct(compilado)} · API ${pct(conteo.hibrida)} · derivar ${pct(conteo.derivar)} — meta: compilado ≥ 85%`)
w()
w(`## Top misses (la lista de la próxima tanda E4 / insumo E5)`)
if (topMisses.length === 0) w(`_Sin misses en la ventana — nada que accionar._`)
for (const { texto, n } of topMisses) w(`- ${n}× · ${String(texto).slice(0, 120)}`)
w()
w(`## Fichas más consultadas`)
for (const [id, n] of topHits) w(`- ${n}× · ${id}`)
w()
w(`## Feedback por ficha (😞 no · 😐 medio · 😍 sí)`)
if (feedback.size === 0) w(`_Sin feedback en la ventana._`)
for (const [id, f] of feedback) w(`- ${id}: ${f.no} no · ${f.medio} medio · ${f.si} sí`)

const informe = lineas.join('\n')
console.log(informe)

const salidaMd = arg('md')
if (salidaMd) {
  const { writeFileSync } = await import('node:fs')
  writeFileSync(salidaMd, informe + '\n', 'utf8')
  console.log(`\n(guardado en ${salidaMd})`)
}
