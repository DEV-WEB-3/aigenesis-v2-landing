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
 *  1. TODA ENTRADA TRAE TODOS LOS IDIOMAS. Media fila traducida es peor que
 *     ninguna: pasa la revision visual en ingles y se cae en croata.
 *  2. NINGUNA CLAVE ESTA DUPLICADA. En un objeto literal la segunda gana en
 *     silencio, asi que un duplicado con distinta traduccion es una traduccion
 *     perdida sin ningun sintoma.
 *
 * Lo que NO comprueba —a proposito— es que el texto del codigo exista en el
 * diccionario: eso no se puede saber leyendo ficheros, porque `t()` recibe
 * valores que vienen de datos. Para eso esta el aviso de desarrollo, que informa
 * de lo que REALMENTE llega sin traducir mientras se navega.
 *
 * ── POR QUE CADA COMPROBACION MIRA DONDE MIRA (29-ago-2026) ─────────────────
 *
 * La comprobacion 1 IMPORTA EL MODULO y le pregunta al objeto. Antes leia el
 * fuente buscando lineas que terminaran en `: {`, y eso dejaba fuera las 117
 * entradas cuya clave es tan larga que el formateador baja la llave a la linea
 * siguiente. O sea: las entradas de PARRAFO —los avisos legales, la descripcion
 * de cada marca de la alianza— justo las que mas caro sale publicar a medias.
 * El script decia «622 entradas completas» y era verdad; y eran el 84 % del
 * diccionario. Ninguna estaba mal, pero nada lo garantizaba.
 *
 * Un patron sobre el fuente comprueba la REPRESENTACION del dato. El objeto es
 * el dato. Preguntarle a el no se puede escapar por como este escrito.
 *
 * La comprobacion 2 sigue leyendo el FUENTE, y tambien a proposito: un
 * duplicado desaparece al evaluar el literal —la segunda clave pisa a la
 * primera— asi que en el objeto ya no existe. Lo que hay que ver es
 * precisamente lo que el objeto no puede contar.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import jitiPkg from 'jiti'

const aqui = dirname(fileURLToPath(import.meta.url))
const RAIZ = resolve(aqui, '..')
const CARPETA = resolve(RAIZ, 'lib', 'i18n')

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

const crearJiti = jitiPkg.createJiti ?? jitiPkg.default?.createJiti ?? jitiPkg
const jiti = crearJiti(import.meta.url, { alias: { '@': RAIZ } })

/*
 * LOS IDIOMAS EXIGIDOS SALEN DE `idiomas.ts`, no de una lista escrita aqui.
 * Añadir un idioma al portal y olvidarse de esta linea dejaría el idioma nuevo
 * fuera de la unica comprobacion que lo cubre — y sin sintoma, porque la
 * pantalla saldria en español.
 */
const { IDIOMAS: CATALOGO } = await jiti.import(resolve(CARPETA, 'idiomas.ts'))
const IDIOMAS = CATALOGO.map((i) => i.codigo).filter((c) => c !== 'es')

/* El bloque base define y exporta; los demas se registran solos al importarse. */
const { DICCIONARIO } = await jiti.import(resolve(CARPETA, 'diccionario.ts'))
for (const f of ARCHIVOS) await jiti.import(resolve(CARPETA, f))

const problemas = []

/* 1 · toda entrada trae todos los idiomas — preguntandole al objeto */
for (const [clave, fila] of Object.entries(DICCIONARIO)) {
  const faltan = IDIOMAS.filter((c) => typeof fila?.[c] !== 'string' || !fila[c].trim())
  if (faltan.length) problemas.push(`sin ${faltan.join(', ')}: ${clave.slice(0, 64)}`)
}

/* 2 · ninguna clave duplicada — leyendo el fuente, que es donde aun se ven */
const vistas = new Map()
for (const f of ARCHIVOS) {
  const lineas = readFileSync(resolve(CARPETA, f), 'utf8').split('\n')
  for (let i = 0; i < lineas.length; i++) {
    /* Una entrada empieza en la columna 2; la llave puede quedar en la misma
       linea o en la siguiente si el formateador partio una clave larga. */
    const m = /^ {2}(?:'((?:[^'\\]|\\.)*)'|([A-Za-zÁÉÍÓÚÑ¿©][^\s:]*)):(?: \{)?$/.exec(lineas[i])
    if (!m) continue
    const clave = (m[1] ?? m[2]).replace(/\\'/g, "'")
    const donde = `${f}:${i + 1}`
    if (vistas.has(clave)) problemas.push(`clave duplicada (${donde} y ${vistas.get(clave)}): ${clave.slice(0, 64)}`)
    else vistas.set(clave, donde)
  }
}

/*
 * 3 · Y LA GUARDA SE MIDE A SI MISMA. Si el patron de arriba vuelve a dejar de
 * reconocer una forma de escribir la clave, el recuento de duplicados cubriria
 * menos de lo que dice sin fallar. Aqui se cruza contra el objeto: son las dos
 * caras del mismo diccionario y tienen que dar el mismo numero.
 */
const enElObjeto = Object.keys(DICCIONARIO).length
if (vistas.size !== enElObjeto) {
  problemas.push(
    `el patron de claves ve ${vistas.size} y el objeto tiene ${enElObjeto}: ` +
      `la comprobacion de duplicados esta cubriendo menos de lo que parece`
  )
}

if (problemas.length) {
  console.error(`diccionario: ${problemas.length} problema(s) en ${enElObjeto} entradas de ${ARCHIVOS.join(', ')}`)
  for (const p of problemas) console.error('  ·', p)
  process.exit(1)
}
console.log(
  `diccionario: ${enElObjeto} entradas completas en ${IDIOMAS.length + 1} idiomas` +
    ` (${IDIOMAS.join(' ')}) — ${ARCHIVOS.length} archivo${ARCHIVOS.length === 1 ? '' : 's'}: ${ARCHIVOS.join(', ')}`
)
