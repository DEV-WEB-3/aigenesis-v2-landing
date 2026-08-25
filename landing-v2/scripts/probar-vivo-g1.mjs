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
 * LAS SONDAS SE DERIVAN DEL DICCIONARIO, NO SE ESCRIBEN AQUÍ.
 *
 * La primera versión las llevaba a mano: seis fragmentos de traducciones de la
 * tanda que acababa de escribir. Funcionaban, y estaban condenadas — el día que
 * alguien corrija una de esas seis respuestas, la guarda falla sin que nada esté
 * mal, y una guarda que grita por un cambio legítimo se acaba desactivando.
 *
 * Ahora se calculan: para cada idioma se toma la traducción MÁS LARGA del
 * diccionario y se busca un fragmento de su interior. Eso hace dos cosas a la
 * vez — nunca caduca, y siempre mide el diccionario de ESTE commit, que es la
 * pregunta real («¿el servidor sirve lo que acabo de construir?»).
 *
 * TRES DECISIONES QUE PARECEN DETALLES:
 *
 * · La MÁS LARGA, no una cualquiera. Una cadena corta («Ecosistema», «Token»)
 *   aparece en cualquier bundle por mil motivos y encontrarla no prueba nada.
 *
 * · Un fragmento del MEDIO, no la cadena entera. El minificador puede partir un
 *   literal largo en concatenaciones; por el interior de 60 caracteres no parte.
 *
 * · Determinista. Nada de elegir al azar: una guarda que mide algo distinto en
 *   cada ejecución no permite comparar dos ejecuciones.
 */
const IDIOMAS_SONDA = ['ru', 'ar', 'sr', 'de', 'ur', 'hr']

const fuenteDicc = readFileSync(resolve(raiz, 'lib/i18n/diccionario.ts'), 'utf8')
const SONDAS = IDIOMAS_SONDA.map((idioma) => {
  let mejor = ''
  const re = new RegExp("\\n\\s*" + idioma + ":\\s*'((?:[^'\\\\]|\\\\.)*)',", 'g')
  for (const m of fuenteDicc.matchAll(re)) {
    if (m[1].length > mejor.length) mejor = m[1]
  }
  /* Del medio, y una longitud que ningún empaquetador parte por dentro. */
  const desde = Math.floor((mejor.length - 60) / 2)
  return { que: `${idioma} · la traducción más larga del diccionario`, txt: mejor.slice(desde, desde + 60) }
})

/* Si el diccionario cambiara de forma, `mejor` quedaría vacío y las sondas
   buscarían la cadena vacía — que SIEMPRE se encuentra. Un verde así es peor
   que un rojo: parece una medición y no lo es. */
for (const s of SONDAS) {
  if (s.txt.length < 40) {
    console.error(`no se pudo derivar una sonda para «${s.que}»: ¿cambió la forma del diccionario?`)
    process.exit(1)
  }
}

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

/*
 * ¿ES ESTE BUILD, O UNO QUE SE LE PARECE?
 *
 * Todo lo de arriba comprueba que lo servido CONTIENE este diccionario. No es lo
 * mismo que ser este build, y la diferencia no es teórica: el primer despliegue
 * que corrió esta guarda en CI sólo cambiaba scripts, así que el bundle anterior
 * —que también lleva el corpus entero— habría pasado las seis sondas sin que se
 * hubiera subido nada. Verde honesto midiendo la pregunta equivocada.
 *
 * El sello lo cierra: el export escribe el SHA del commit en `version.txt` y
 * aquí se exige que el dominio devuelva ESE. Ya no hay forma de que un artefacto
 * viejo pase.
 *
 * LA CONSULTA LLEVA EL SHA COMO PARÁMETRO a propósito. El borde de Hostinger
 * guarda copias por URL y no pregunta a Apache mientras la tenga; con el SHA
 * dentro, cada despliegue estrena URL y la copia vieja no puede contestar. Es la
 * misma técnica que desbloqueó el candado de los videos del Aula.
 *
 * Y SI NO HAY SHA QUE ESPERAR, SE DICE. En local casi nunca lo hay. Callarlo
 * dejaría un informe que parece completo y comprobó una cosa menos.
 */
const SHA = process.env.SHA_ESPERADO || process.env.GITHUB_SHA || ''
if (!SHA) {
  console.log('  --   sin SHA esperado: NO se comprobó QUÉ build está servido, sólo qué contiene')
} else {
  let sello = ''
  try {
    sello = (await bajar(`${BASE}/version.txt?${SHA}`)).trim()
  } catch (e) {
    sello = `(no se pudo leer version.txt: ${e.message})`
  }
  comprobar(
    'el sello del sitio es el de este commit',
    sello === SHA,
    `esperado ${SHA.slice(0, 12)} · servido ${sello.slice(0, 60)}`,
  )
}

console.log('')
if (fallos.length) {
  console.error(`vivo: ${fallos.length} comprobación(es) fallaron en ${BASE}`)
  process.exit(1)
}
console.log(`vivo: ${BASE} sirve el corpus traducido y el contrato correcto`)
