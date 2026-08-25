#!/usr/bin/env node
/**
 * LO QUE EL NAVEGADOR RECIBE DE g1.aigenesis.io.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ EXISTE. Todas las demás guardas leen el repositorio: el diccionario
 * está completo, el build compila, el corpus está al 100%. Ninguna de ellas
 * puede distinguir «traducido» de «traducido Y servido». Entre las dos cosas
 * hay un export estático, un rsync, una CDN y un caché de borde que ya me
 * mintió una vez sirviendo copias viejas durante un año.
 *
 * Esta guarda baja los chunks REALES del dominio vivo y busca dentro. Es la
 * única que responde a la pregunta que importa: ¿la persona que abre la página
 * en árabe ve árabe?
 *
 * CUIDADO CON EL COSTE. Estas peticiones salen de la IP del owner. Una vez ya
 * le tiré un catálogo con un 429 por verificar en bucle. Aquí se baja el HTML y
 * como mucho los chunks que lo componen, UNA vez, sin reintentos automáticos.
 * No se pone esto en un `while`.
 *
 * Uso:  node scripts/probar-vivo-g1.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.argv[2] || 'https://g1.aigenesis.io'

/* La dirección se LEE de la fuente única en vez de escribirse aquí. Importar el
   módulo no vale: `official-links.ts` importa por el alias `@/`, que fuera de
   Next no resuelve. Se extrae del texto, y si el nombre de la constante cambia
   la guarda para en vez de comparar contra `undefined` — que se parecería
   demasiado a «no está», y eso es justo lo que esta guarda tiene que detectar. */
const fuenteEnlaces = readFileSync(resolve(raiz, 'lib/official-links.ts'), 'utf8')
const mDir = fuenteEnlaces.match(/AIG_TOKEN_CONTRACT\s*=\s*'(0x[a-fA-F0-9]{40})'/)
if (!mDir) {
  console.error('no se pudo leer AIG_TOKEN_CONTRACT de lib/official-links.ts — ¿cambió de forma?')
  process.exit(1)
}
const AIG_TOKEN_CONTRACT = mDir[1]

/*
 * LAS SONDAS SE ELIGEN POR SER IMPOSIBLES DE ACERTAR POR CASUALIDAD.
 *
 * Una cadena corta («Ecosistema», «Token») aparece en cualquier bundle por mil
 * motivos y su presencia no prueba nada. Estas son fragmentos largos de
 * traducciones concretas de esta tanda: si están, es que este diccionario, y no
 * otro, es el que se está sirviendo.
 *
 * Van sin la primera palabra y sin la última a propósito: el minificador puede
 * partir una cadena en concatenaciones, pero no parte por dentro de un
 * fragmento de 40 caracteres sin espacios raros.
 */
const SONDAS = [
  /* La primera sonda rusa que puse aquí era «сид-фразу или приватные ключи», y
     PASÓ contra el sitio de antes del despliegue: esa advertencia ya estaba en
     otra respuesta de seguridad traducida hace tandas. Una sonda que también
     puede acertar con el bundle viejo no distingue nada. Ésta es del acelerador
     por referido, que no existía en ningún otro sitio. */
  { que: 'ruso · el acelerador por referido', txt: 'мгновенно ускоряется на 11' },
  { que: 'árabe · el modo dual de G-Pulse', txt: 'وضع تفعيل G-Pulse هو الثنائي' },
  { que: 'serbio · la wallet no se cambia', txt: 'Новчаник налога се не мења' },
  { que: 'alemán · las tasas son de emisión', txt: 'Emissionsrate des Protokolls' },
  { que: 'urdu · el paso a paso del staking', txt: 'ایک مدت کے لیے لاک کرتا ہے' },
  { que: 'croata · los rangos hasta G11', txt: 'nagradu u USDT-u plus NFT' },
]

/* La dirección que estuvo viva diciendo «desconfía de cualquier otra». */
const CONTRATO_VIEJO = '0x4b4594bfe661919a8e2373eb175004da2989a479'

const bajar = async (url) => {
  const r = await fetch(url, { headers: { 'User-Agent': 'guarda-g1/1.0' } })
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} en ${url}`)
  return r.text()
}

console.log(`\nLO QUE SE SIRVE EN ${BASE}\n`)

const html = await bajar(`${BASE}/g1/`)

/* Los chunks que el HTML declara. Se bajan TODOS los del bundle de la app,
   porque cuál de ellos lleva el diccionario es un detalle del empaquetador y
   fijarlo aquí congelaría la guarda al primer cambio de versión de Next. */
const rutas = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\s]+?\.js/g)].map((m) => m[0]))]
if (rutas.length === 0) {
  console.error('  FALL el HTML vivo no declara ni un chunk: ¿esto es la página de G1?')
  process.exit(1)
}
console.log(`  ${rutas.length} chunk(s) declarados por el HTML`)

const cuerpos = await Promise.all(rutas.map((r) => bajar(BASE + r).catch(() => '')))
const todo = html + cuerpos.join('\n')
const kb = Math.round(todo.length / 1024)
console.log(`  ${kb} kB de JavaScript leídos\n`)

const fallos = []
const comprobar = (titulo, ok, detalle) => {
  console.log(`  ${ok ? 'ok  ' : 'FALL'} ${titulo}`)
  if (!ok) {
    fallos.push(titulo)
    if (detalle) console.log('       ' + detalle)
  }
}

/* CONTROL DE INSTRUMENTO, primero. Si el bundle no contiene ni siquiera el
   español de origen, la búsqueda está mirando el sitio equivocado y todos los
   «FALL» de abajo serían por eso, no por la traducción. */
comprobar(
  'control: el corpus en español SÍ está en lo que se sirve',
  todo.includes('frase de recuperación') || todo.includes('claves privadas'),
  'no se encontró ni el corpus original — la sonda apunta a otra parte',
)

for (const s of SONDAS) {
  comprobar(`se sirve ${s.que}`, todo.includes(s.txt), `no aparece: «${s.txt}»`)
}

comprobar(
  'la dirección del contrato es la que usa el dinero',
  todo.includes(AIG_TOKEN_CONTRACT),
  `no aparece ${AIG_TOKEN_CONTRACT}`,
)
comprobar(
  'la dirección VIEJA del contrato no volvió',
  !todo.toLowerCase().includes(CONTRATO_VIEJO),
  `¡${CONTRATO_VIEJO} está vivo otra vez!`,
)

console.log('')
if (fallos.length) {
  console.error(`vivo: ${fallos.length} comprobación(es) fallaron en ${BASE}`)
  process.exit(1)
}
console.log(`vivo: ${BASE} sirve el corpus traducido y el contrato correcto`)
