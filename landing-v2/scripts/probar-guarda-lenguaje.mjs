#!/usr/bin/env node
/**
 * PRUEBA DE LA GUARDA DE LENGUAJE — se comprueba rompiéndola.
 *
 * Una guarda en verde no prueba nada: puede estar en verde porque no mira.
 * Esto planta términos prohibidos a propósito y exige que los cace, y planta
 * contraejemplos legítimos y exige que los deje pasar.
 *
 * EL CASO QUE JUSTIFICA EL ARCHIVO ENTERO es «misma línea, mal: tapado pero
 * bien: sucio». El material de soporte escribe los pares así:
 *
 *     { mal: 'Adquiere productos premium…', bien: 'Elige y te llega' }
 *
 * La primera versión de la exención saltaba la LÍNEA COMPLETA, lo que dejaba
 * `bien` —la mitad que sí hay que vigilar— sin revisar. En verde, y ciega.
 * Ahora se tapa sólo el valor del contraejemplo. Este caso lo demuestra.
 */
import { writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const objetivo = resolve(raiz, 'lib', 'soporte', '_prueba_guarda.ts')

const CASOS = [
  {
    nombre: 'término prohibido en prosa normal',
    debeFallar: true,
    cuerpo: `export const A = { texto: 'Una gran rentabilidad para ti' } as const\n`,
  },
  {
    nombre: 'contraejemplo dentro de una lista incorrecto:',
    debeFallar: false,
    cuerpo: `export const B = {\n  incorrecto: [\n    'la cotización de AIG',\n  ],\n} as const\n`,
  },
  {
    nombre: 'contraejemplo en un campo mal:',
    debeFallar: false,
    cuerpo: `export const C = { mal: 'ingresos pasivos garantizados' } as const\n`,
  },
  {
    nombre: 'término prohibido DESPUÉS de cerrar la lista (el estado se cierra)',
    debeFallar: true,
    cuerpo:
      `export const D = {\n  incorrecto: [\n    'la cotización de AIG',\n  ],\n` +
      `  bueno: 'esto promete rentabilidad y hay que cazarlo',\n} as const\n`,
  },
  {
    nombre: 'un campo bien: NO está exento',
    debeFallar: true,
    cuerpo: `export const E = { bien: 'te damos rentabilidad asegurada' } as const\n`,
  },
  {
    nombre: 'misma línea, mal: tapado pero bien: sucio',
    debeFallar: true,
    cuerpo: `export const F = { mal: 'ingresos pasivos', bien: 'tu rentabilidad sube' } as const\n`,
  },
  {
    nombre: 'misma línea, mal: sucio y bien: limpio',
    debeFallar: false,
    cuerpo: `export const G = { mal: 'ingresos pasivos', bien: 'describe la actividad' } as const\n`,
  },
  {
    nombre: 'sinónimo corto con vocabulario del usuario',
    debeFallar: false,
    cuerpo: `export const H = {\n  sinonimos: [\n    'bono binario',\n  ],\n} as const\n`,
  },
  {
    nombre: 'EL DECISIVO del tope: frase larga escondida en sinonimos',
    debeFallar: true,
    cuerpo:
      `export const I = {\n  sinonimos: [\n` +
      `    'consigue rentabilidad estable mes a mes sin apenas esfuerzo',\n  ],\n} as const\n`,
  },
  {
    nombre: 'sinónimos EN UNA LÍNEA (el formato que usa el repositorio)',
    debeFallar: false,
    cuerpo: `export const K = { sinonimos: ['bono binario', 'red binaria'] } as const\n`,
  },
  {
    nombre: 'en línea: frase larga dentro de sinonimos NO está exenta',
    debeFallar: true,
    cuerpo:
      `export const L = { sinonimos: ['consigue rentabilidad estable mes a mes sin esfuerzo'] } as const\n`,
  },
  {
    nombre: 'en línea: sinonimos limpio pero respuesta sucia en la MISMA línea',
    debeFallar: true,
    cuerpo: `export const M = { sinonimos: ['bono binario'], respuesta: 'damos rentabilidad' } as const\n`,
  },
  {
    nombre: 'rótulo literal de pantalla con vocabulario retirado',
    debeFallar: false,
    cuerpo: `export const N = { rotulo: 'Red Binaria', nombre: 'Estructura de referidos' } as const
`,
  },
  {
    nombre: 'EL DECISIVO: rotulo limpio pero nombre sucio en la MISMA línea',
    debeFallar: true,
    cuerpo: `export const O = { rotulo: 'Red Binaria', nombre: 'tu red binaria' } as const
`,
  },
  {
    nombre: 'párrafo largo escondido en rotulo NO está exento',
    debeFallar: true,
    cuerpo: `export const P = { rotulo: 'entra en tu red binaria y multiplica lo que ganas cada mes' } as const
`,
  },
  {
    nombre: 'término prohibido DESPUÉS de cerrar sinonimos',
    debeFallar: true,
    cuerpo:
      `export const J = {\n  sinonimos: [\n    'bono binario',\n  ],\n` +
      `  respuesta: 'te garantiza rentabilidad',\n} as const\n`,
  },
]

/* Si el repositorio ya está sucio, el arnés no puede atribuir los fallos. */
try {
  execFileSync('node', ['scripts/verify-lenguaje.mjs'], { cwd: raiz, stdio: 'pipe' })
} catch {
  console.error('prueba: el material de soporte YA falla la guarda. Arregla eso primero:')
  console.error('        node scripts/verify-lenguaje.mjs')
  process.exit(1)
}

let fallos = 0
for (const caso of CASOS) {
  writeFileSync(objetivo, caso.cuerpo, 'utf8')
  let fallo = false
  try {
    execFileSync('node', ['scripts/verify-lenguaje.mjs'], { cwd: raiz, stdio: 'pipe' })
  } catch {
    fallo = true
  }
  const ok = fallo === caso.debeFallar
  if (!ok) fallos++
  console.log(`  ${ok ? 'ok  ' : 'MAL '} ${caso.nombre}`)
}
if (existsSync(objetivo)) unlinkSync(objetivo)

if (fallos) {
  console.error(`\nprueba: ${fallos} caso(s) mal — la guarda NO se comporta como dice.`)
  process.exit(1)
}
console.log(`\nprueba: ${CASOS.length} casos — la guarda muerde donde debe y calla donde debe.`)
