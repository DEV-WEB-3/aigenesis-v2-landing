#!/usr/bin/env node
/*
 * MINERO DE SINÓNIMOS — Tren C, pieza 2 (E4 tanda 2).
 *
 * Pasa cada mensaje REAL de los canales de WhatsApp por el `responder()`
 * vigente y lista los que DERIVAN: esas frases, agrupadas, son la materia
 * prima de los sinónimos. La regla del auditor: preferir sinónimos hacia
 * fichas EXISTENTES; si el tema no existe, hueco declarado antes que ficha
 * inventada.
 *
 * Uso: node scripts/minar-sinonimos.mjs <carpeta-con-txts>
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { createRequire } from 'node:module'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const fuente = resolve(raiz, 'lib', 'soporte')
const salida = resolve(raiz, 'node_modules', '.cache', 'soporte-minero')

const require_ = createRequire(pathToFileURL(join(raiz, 'package.json')))
const ts = require_('typescript')

rmSync(salida, { recursive: true, force: true })
mkdirSync(salida, { recursive: true })
for (const nombre of readdirSync(fuente).filter((n) => n.endsWith('.ts'))) {
  const codigo = readFileSync(join(fuente, nombre), 'utf8')
  const { outputText } = ts.transpileModule(codigo, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })
  writeFileSync(join(salida, nombre.replace(/\.ts$/, '.js')), outputText, 'utf8')
}
const { responder } = require_(join(salida, 'buscar.js'))

const carpeta = process.argv[2]
if (!carpeta) {
  console.error('falta la carpeta con los .txt exportados')
  process.exit(1)
}

/* Formato WhatsApp: «d/m/aa, h:mm - Nombre: mensaje» (multilínea continúa). */
const RE_LINEA = /^\d{1,2}\/\d{1,2}\/\d{2,4},? \d{1,2}:\d{2}\s?(?:[ap]\.?\s?m\.?)?\s-\s([^:]{1,60}):\s(.*)$/i
const RUIDO = /multimedia omitido|se elimin[oó] este mensaje|cifrados de extremo|cambió el asunto|añadió|salió del grupo|cambió el ícono|uni[oó] usando|<multimedia|null$/i

const mensajes = []
for (const nombre of readdirSync(carpeta).filter((n) => n.endsWith('.txt'))) {
  let actual = null
  for (const cruda of readFileSync(join(carpeta, nombre), 'utf8').split(/\r?\n/)) {
    const linea = cruda.replace(/^‎|‎/g, '')
    const m = linea.match(RE_LINEA)
    if (m) {
      if (actual) mensajes.push(actual)
      actual = { quien: m[1].trim(), texto: m[2].trim() }
    } else if (actual && linea.trim()) {
      actual.texto += ' ' + linea.trim()
    }
  }
  if (actual) mensajes.push(actual)
}

/* Solo lo que parece una PREGUNTA o un problema con sustancia. */
const candidatos = mensajes
  .map((m) => m.texto)
  .filter((t) => t.length >= 18 && t.length <= 400 && !RUIDO.test(t))
  .filter((t) => /\?|no (puedo|me deja|llega|aparece|reconoce|entra|abre|carga|funciona|refleja)|ayuda|problema|error|congelad|frozen|pendiente|esperando|cuanto|como |donde|por que|porque|necesito|quisiera/i.test(t))

let hit = 0
const misses = new Map()
for (const c of candidatos) {
  const r = responder(c)
  if (r.tipo === 'respuesta' || r.tipo === 'cortesia') {
    hit += 1
  } else {
    const clave = c.toLowerCase().slice(0, 90)
    misses.set(clave, { texto: c, n: (misses.get(clave)?.n ?? 0) + 1 })
  }
}

console.log(`mensajes totales : ${mensajes.length}`)
console.log(`candidatos       : ${candidatos.length}`)
console.log(`ya responden     : ${hit}`)
console.log(`derivan (misses) : ${candidatos.length - hit}`)
console.log('--- misses, tal cual se escribieron ---')
for (const { texto } of misses.values()) console.log('  ·', texto.slice(0, 140))
