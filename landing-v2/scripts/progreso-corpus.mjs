#!/usr/bin/env node
/**
 * CUÁNTO DEL CORPUS DEL ASISTENTE ESTÁ TRADUCIDO.
 *
 * Existe porque la traducción del corpus se hace por tandas y hace falta saber
 * dónde se quedó una sin abrir el diccionario a ojo. Cuenta las preguntas cuya
 * clave YA está en el diccionario y mide lo que queda en caracteres, que es la
 * única unidad honesta para estimar el trabajo restante.
 *
 * Uso:  node scripts/progreso-corpus.mjs
 *       node scripts/progreso-corpus.mjs --faltan   # los textos que quedan
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { createRequire } from 'node:module'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const salida = resolve(raiz, 'node_modules', '.cache', 'progreso-corpus')
const require_ = createRequire(pathToFileURL(join(raiz, 'package.json')))
const ts = require_('typescript')

rmSync(salida, { recursive: true, force: true })
mkdirSync(salida, { recursive: true })
const fuente = resolve(raiz, 'lib', 'soporte')
for (const n of readdirSync(fuente).filter((x) => x.endsWith('.ts'))) {
  const { outputText } = ts.transpileModule(readFileSync(join(fuente, n), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })
  writeFileSync(join(salida, n.replace(/\.ts$/, '.js')), outputText, 'utf8')
}

const { TODAS_LAS_PREGUNTAS } = require_(join(salida, 'buscar.js'))
const dicc = readFileSync(resolve(raiz, 'lib/i18n/diccionario.ts'), 'utf8')

/* Una pregunta cuenta como hecha cuando SU TEXTO es una clave del diccionario.
   Se comprueba la pregunta y la respuesta por separado: traducir el titular y
   dejar el cuerpo en español es exactamente el medio trabajo que hay que ver. */
const tiene = (s) => dicc.includes("'" + s + "':") || dicc.includes('"' + s + '":')

const hechas = []
const faltan = []
for (const p of TODAS_LAS_PREGUNTAS) {
  if (tiene(p.pregunta) && tiene(p.respuesta)) hechas.push(p)
  else faltan.push(p)
}

if (process.argv.includes('--faltan')) {
  const cat = process.argv[process.argv.indexOf('--faltan') + 1]
  for (const p of faltan) {
    if (cat && p.categoria !== cat) continue
    console.log('P: ' + p.pregunta)
    console.log('R: ' + p.respuesta)
    console.log()
  }
  process.exit(0)
}

const chars = faltan.reduce((a, p) => a + p.pregunta.length + p.respuesta.length, 0)
const pct = Math.round((hechas.length / TODAS_LAS_PREGUNTAS.length) * 100)
console.log(`\ncorpus: ${hechas.length} de ${TODAS_LAS_PREGUNTAS.length} preguntas traducidas (${pct}%)`)
console.log(`        quedan ${(chars / 1000).toFixed(1)}k caracteres por idioma\n`)

const porCat = {}
for (const p of faltan) (porCat[p.categoria] = porCat[p.categoria] ?? []).push(p)
for (const [c, ps] of Object.entries(porCat).sort((a, b) => b[1].length - a[1].length)) {
  const k = ps.reduce((a, p) => a + p.pregunta.length + p.respuesta.length, 0)
  console.log(`  ${String(ps.length).padStart(3)}  ${String((k / 1000).toFixed(1) + 'k').padStart(6)}  ${c}`)
}
