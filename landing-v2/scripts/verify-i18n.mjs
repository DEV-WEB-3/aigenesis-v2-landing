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
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const CARPETA = resolve(aqui, '..', 'lib', 'i18n')
const IDIOMAS = ['en', 'pt', 'fr', 'ru', 'sv', 'hr', 'ar', 'de', 'sr', 'ur']

/*
 * SE MIRAN TODOS LOS `diccionario*.ts`, NO SOLO UNO.
 *
 * El diccionario se partió para que el whitepaper —35 kB de párrafos— no
 * viajara en el trozo de la portada. La partición sacó 49 entradas de esta
 * guarda sin que nada avisara: el script seguía diciendo «261 entradas
 * completas» y era verdad, y era exactamente la mitad del trabajo.
 *
 * Por eso la lista de archivos se DESCUBRE en vez de escribirse: un bloque
 * nuevo entra en la comprobación por existir, no por acordarse de anotarlo.
 * Una guarda que hay que actualizar a mano deja de cubrir en cuanto alguien
 * olvida hacerlo, que es siempre.
 */
const ARCHIVOS = readdirSync(CARPETA)
  .filter((f) => /^diccionario.*\.ts$/.test(f))
  .sort()

const lineas = ARCHIVOS.flatMap((f) => readFileSync(resolve(CARPETA, f), 'utf8').split('\n'))
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
  console.error(
    `diccionario: ${problemas.length} problema(s) en ${entradas} entradas de ${ARCHIVOS.join(', ')}`
  )
  for (const p of problemas) console.error('  ·', p)
  process.exit(1)
}
console.log(
  `diccionario: ${entradas} entradas completas en ${IDIOMAS.length + 1} idiomas` +
    ` (${ARCHIVOS.length} archivo${ARCHIVOS.length === 1 ? '' : 's'}: ${ARCHIVOS.join(', ')})`
)
