#!/usr/bin/env node
/**
 * GUARDA DEL DICCIONARIO.
 *
 * Comprueba dos cosas, y las dos por el mismo motivo: una traduccion que falta
 * NO se ve. El mecanismo devuelve el español cuando no encuentra la entrada, que
 * es lo correcto en produccion y justo lo que hace invisible el hueco. Sin una
 * guarda, la unica forma de detectar que a una frase le falta el sueco es que un
 * sueco lo diga.
 *
 *  1. TODA ENTRADA TRAE LOS DIEZ IDIOMAS. Media fila traducida es peor que
 *     ninguna: pasa la revision visual en ingles y se cae en croata.
 *  2. NINGUNA CLAVE ESTA DUPLICADA. En un objeto literal la segunda gana en
 *     silencio, asi que un duplicado con distinta traduccion es una traduccion
 *     perdida sin ningun sintoma.
 *
 * Lo que NO comprueba —a proposito— es que el texto del codigo exista en el
 * diccionario: eso no se puede saber leyendo ficheros, porque `t()` recibe
 * valores que vienen de datos. Para eso esta el aviso de desarrollo, que informa
 * de lo que REALMENTE llega sin traducir mientras se navega.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const RUTA = resolve(aqui, '..', 'lib', 'i18n', 'diccionario.ts')
const IDIOMAS = ['en', 'pt', 'fr', 'ru', 'sv', 'hr', 'ar', 'de', 'sr', 'ur']

const lineas = readFileSync(RUTA, 'utf8').split('\n')
const problemas = []
const vistas = new Map()
let entradas = 0

for (let i = 0; i < lineas.length; i++) {
  /* Una entrada empieza en la columna 2 y abre llave al final de la linea. */
  const m = /^ {2}(?:'((?:[^'\\]|\\.)*)'|([A-Za-zÁÉÍÓÚÑ¿©][^\s:]*)): \{$/.exec(lineas[i])
  if (!m) continue
  const clave = (m[1] ?? m[2]).replace(/\\'/g, "'")
  entradas++

  if (vistas.has(clave)) {
    problemas.push(`clave duplicada (linea ${i + 1} y ${vistas.get(clave)}): ${clave}`)
  } else {
    vistas.set(clave, i + 1)
  }

  let j = i + 1
  const cuerpo = []
  while (j < lineas.length && !/^ {2}\},?$/.test(lineas[j])) {
    cuerpo.push(lineas[j])
    j++
  }
  const texto = cuerpo.join('\n')
  const faltan = IDIOMAS.filter((k) => !new RegExp(`(?:^|[\\s{,])${k}:`).test(texto))
  if (faltan.length) {
    problemas.push(`linea ${i + 1} — sin ${faltan.join(', ')}: ${clave.slice(0, 64)}`)
  }
  i = j
}

if (problemas.length) {
  console.error(`diccionario: ${problemas.length} problema(s) en ${entradas} entradas`)
  for (const p of problemas) console.error('  ·', p)
  process.exit(1)
}
console.log(`diccionario: ${entradas} entradas completas en ${IDIOMAS.length + 1} idiomas`)
