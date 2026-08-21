#!/usr/bin/env node
/*
 * PRUEBAS DEL BACKEND DE TICKETS (E6) — la parte pura: el filtro de secretos.
 *
 * La regla 3 del contrato con su matiz más fino: un TX HASH legítimo (0x +
 * 64 hex) es CONTENIDO de soporte y debe pasar; una clave privada (64 hex
 * SIN 0x) o una frase semilla deben morir antes de tocar el disco.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { createRequire } from 'node:module'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const fuente = resolve(raiz, 'app', 'api', 'soporte', '_lib')
const salida = resolve(raiz, 'node_modules', '.cache', 'tickets-prueba')

const require_ = createRequire(pathToFileURL(join(raiz, 'package.json')))
const ts = require_('typescript')

rmSync(salida, { recursive: true, force: true })
mkdirSync(salida, { recursive: true })
const codigo = readFileSync(join(fuente, 'almacen-tickets.ts'), 'utf8')
const { outputText } = ts.transpileModule(codigo, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
})
writeFileSync(join(salida, 'almacen-tickets.js'), outputText, 'utf8')
const { filtrarSecretos } = require_(join(salida, 'almacen-tickets.js'))

const HASH = '0x' + 'ab'.repeat(32)
const PRIVADA = 'cd'.repeat(32)
const SEMILLA = 'perro casa arbol fuego luna cielo mar piedra viento nube rio sol'

const CASOS = [
  { texto: `mi transaccion es ${HASH} y no llega`, pasa: true, nombre: 'tx hash con 0x PASA' },
  { texto: `mi clave es ${PRIVADA}`, pasa: false, nombre: 'clave privada sin 0x SE FILTRA' },
  { texto: SEMILLA, pasa: false, nombre: 'frase semilla de 12 SE FILTRA' },
  { texto: 'contraseña: SuperSecreta123', pasa: false, nombre: '«contraseña: x» SE FILTRA' },
  { texto: 'no puedo entrar a mi cuenta desde ayer por la tarde', pasa: true, nombre: 'frase normal en español PASA' },
  {
    texto: 'hola quiero saber por que mi reclamo de ayer todavia no me llega nada a la wallet gracias',
    pasa: true,
    nombre: 'frase larga normal NO es semilla (no cae en 12/15/18/21/24 exactas)',
  },
]

let fallos = 0
for (const c of CASOS) {
  const { texto, filtrado } = filtrarSecretos(c.texto)
  const ok = c.pasa ? !filtrado && texto === c.texto : filtrado && !texto.includes(c.pasa === false ? PRIVADA : '')
  if (!ok) fallos++
  console.log(`  ${ok ? 'ok  ' : 'MAL '} ${c.nombre}`)
  if (!ok) console.log(`        -> filtrado=${filtrado} · ${texto.slice(0, 80)}`)
}

/* Control duro: lo filtrado JAMÁS conserva el secreto. */
const { texto: t1 } = filtrarSecretos(`clave ${PRIVADA}`)
const { texto: t2 } = filtrarSecretos(SEMILLA)
if (t1.includes(PRIVADA) || t2.includes('perro casa arbol')) {
  fallos++
  console.log('  MAL  EL SECRETO SOBREVIVIO AL FILTRO')
}

rmSync(salida, { recursive: true, force: true })
if (fallos) {
  console.error(`\ntickets: ${fallos} casos mal.`)
  process.exit(1)
}
console.log(`\ntickets: filtro de secretos correcto — el hash pasa, la clave muere.`)
