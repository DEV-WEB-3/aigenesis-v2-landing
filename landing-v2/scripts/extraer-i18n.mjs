#!/usr/bin/env node
/**
 * EXTRAE EL TEXTO VISIBLE QUE NO PASA POR EL SISTEMA DE TRADUCCIÓN.
 *
 * POR QUÉ HACE FALTA UNA HERRAMIENTA Y NO UNA BÚSQUEDA A MANO
 * -----------------------------------------------------------
 * `verify:i18n` comprueba que el DICCIONARIO esté completo en los once idiomas.
 * Eso es útil y no ve el agujero de verdad: **el texto que nunca llama a `t()`
 * es invisible para esa comprobación**. Un archivo entero en español pasa el
 * aviso en verde, porque no hay ninguna entrada a la que le falte un idioma.
 *
 * Medido el 25-ago-2026: 50 de los 51 archivos de la web G1 no llamaban a `t()`
 * ni una vez. El selector de idioma cambiaba la cabecera y dejaba el contenido
 * en español. Nada fallaba.
 *
 * Uso:
 *   node scripts/extraer-i18n.mjs              # resumen por archivo
 *   node scripts/extraer-i18n.mjs --cadenas    # las cadenas, listas para el diccionario
 *   node scripts/extraer-i18n.mjs --guarda     # sale 1 si hay texto sin traducir
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')

/**
 * LAS CARPETAS QUE SE AUDITAN.
 *
 * Empezó siendo sólo la web G1, y ese recorte dejó fuera justo lo que el owner
 * reportó el 25-ago-2026: «el idioma no cambia en los títulos de los videos».
 * Los títulos y resúmenes de las ediciones del Aula viven en `lib/soporte/`, y
 * la ficha que los pinta en `components/soporte/`. La guarda no falló — nunca
 * miró ahí. Un ámbito estrecho no avisa de lo que no cubre: se ve verde.
 *
 * `lib/` entra porque en este proyecto el CONTENIDO vive en `lib`, no sólo la
 * lógica: `ediciones.ts` es texto de pantalla con forma de módulo, y una
 * auditoría que sólo mire componentes lo pierde entero.
 */
const AMBITO = ['components/g1', 'app/g1', 'components/soporte', 'lib/soporte']

/**
 * FUERA DEL ÁMBITO, Y POR RAZONES DISTINTAS.
 *
 * Las páginas de previsualización y el sistema de diseño («Vacío (fondo)»,
 * «Variante C · cinematográfico») son herramientas internas: las mira quien
 * construye, no quien visita. Traducirlas a once idiomas sería trabajo entero
 * para nadie.
 */
const EXCLUIDOS = [
  /*
   * EL CORPUS NO PASA POR `t()`, Y NO ES UN OLVIDO: ES OTRO MECANISMO.
   *
   * Las preguntas y respuestas se traducen con `useCorpus()`, que busca en el
   * diccionario por el texto español EN TIEMPO DE RENDER. No hay ninguna llamada
   * a `t()` en el origen y no debe haberla. Auditarlas con esta regla marca 1136
   * cadenas correctas: una alarma que salta por todo se ignora entera, y con ella
   * se pierde la que sí importaba.
   *
   * NO QUEDAN SIN AUDITAR: las mide `npm run corpus:progreso`, que cuenta una
   * pregunta como hecha sólo si SU TEXTO y el de su respuesta son claves del
   * diccionario. Hoy: 99 de 99. Si esa guarda desapareciera, esta exclusión
   * pasaría a ser un agujero — por eso el control de abajo la exige viva.
   *
   * `ediciones.ts` sale por la MISMA razón y se audita en otro sitio: sus
   * títulos y resúmenes también se pintan con `c()`, así que exigirles `t()`
   * sería el mismo falso positivo. Los cuenta `verify:aula`, con la regla que
   * sí les corresponde —¿es clave del diccionario?— porque el Aula es la
   * superficie que esa guarda ya posee. Fue el agujero real del 25-ago-2026.
   */
  /^lib\/soporte\//,
  /^app\/g1\/estilo\//,
  /^app\/g1\/hero-preview/,
  /^app\/g1\/narrativa\//,
  /G1Hero[ABC]\.tsx$/,
  /G1HeroGpgpu\.tsx$/,
  /G1Act0\.tsx$/,
]

/**
 * EL `metadata` DE NEXT NO SE PUEDE TRADUCIR EN CLIENTE, y no es una carencia.
 *
 * Se resuelve en el servidor durante el build, una sola vez, y va al `<head>`
 * para buscadores y redes sociales — que leen la página antes de que exista un
 * idioma elegido. Cambiar de idioma en la interfaz no puede reescribirlo.
 *
 * Meterlo en esta lista lo haría parecer trabajo pendiente cuando en realidad
 * es otro problema (SEO multiidioma, que se resuelve con rutas por idioma y
 * `hreflang`, no con un diccionario en cliente).
 */
const bloqueMetadata = (s) => {
  const i = s.search(/export const metadata|export function generateMetadata/)
  if (i < 0) return null
  /* Hasta el cierre del objeto en la primera columna: basta y no requiere
     analizar sintaxis. */
  const fin = s.indexOf('\n}', i)
  return [i, fin < 0 ? s.length : fin]
}

/**
 * EXENCIONES DECLARADAS, cada una con su razón.
 *
 * Mismo criterio que `verify-lenguaje.mjs`: una exención sin motivo escrito es
 * una goma de borrar. Hay dos clases y conviene no mezclarlas.
 *
 * (a) NO SE TRADUCEN NUNCA — nombres propios. Traducir «MSB · Canadá» o
 *     «Lloyd's of London» rompe lo único que sirve de un dato así: poder
 *     buscarlo en el registro que lo emitió. Y la línea de marca «Génesis ×
 *     Aitech × TAG» son tres nombres y un signo.
 *
 * (b) LA HERRAMIENTA NO PUEDE VERLO. Son cadenas que sí pasan por el sistema,
 *     pero por un camino que un análisis por expresiones regulares no sigue:
 *     una variable intermedia, o un array de cadenas sueltas leído con
 *     `c(g.categoria)`. Escribir un analizador de verdad para cerrar este hueco
 *     cuesta más que las cuatro líneas que hay aquí.
 */
const EXENTAS = new Map([
  /* Los rótulos de procedencia. Se declaran sueltos en el mapa `FUENTES` y se
     traducen en el punto de uso —`t(FUENTES[articulo.fuente])`, AsistenteFlotante—
     que es un camino que este detector no sigue. Tienen fila en el diccionario;
     `verify:i18n` la exige completa en los once idiomas. */
  ['la web oficial', 'sí traducida — t(FUENTES[…]) en AsistenteFlotante'],
  ['el equipo', 'sí traducida — t(FUENTES[…]) en AsistenteFlotante'],
  ['el código del producto', 'sí traducida — t(FUENTES[…]) en AsistenteFlotante'],
  ['el producto en vivo', 'sí traducida — t(FUENTES[…]) en AsistenteFlotante'],
  ['pendiente de confirmar con el equipo', 'sí traducida — t(FUENTES[…]) en AsistenteFlotante'],
  ['DASP · El Salvador', 'licencia: el nombre es lo que permite verificarla'],
  ['MSB · Canadá', 'licencia: el nombre es lo que permite verificarla'],
  ['Génesis × Aitech × TAG', 'línea de marca: tres nombres propios'],
  ['Informativo · no es asesoría financiera · participación voluntaria y con riesgos.',
   'sí traducida — va por una variable (`const es`) y el detector no la sigue'],
  ['Sobre Genesis', 'sí traducida — categoría del corpus, se lee con c(g.categoria)'],
  ['Sobre G-Pulse', 'sí traducida — categoría del corpus, se lee con c(g.categoria)'],
  ['Membresía G-Pulse', 'sí traducida — categoría del corpus, se lee con c(g.categoria)'],
  ['Sobre Gevy', 'sí traducida — categoría del corpus, se lee con c(g.categoria)'],
  ['Navegación', 'sí traducida — llega como prop `title` y `Col` la pasa por c()'],
])

/*
 * UNA EXENCIÓN QUE AFIRMA «SÍ TRADUCIDA» TIENE QUE PODER DEMOSTRARLO.
 *
 * La mitad de esta lista no dice «esto no se traduce», dice «esto SÍ se traduce
 * pero por un camino que no sé seguir». Esa segunda forma es una promesa mía, y
 * una promesa escrita en un comentario no la comprueba nadie: el día que alguien
 * borre la fila del diccionario, la cadena vuelve al español y la exención la
 * tapa. Sería un agujero con aspecto de decisión.
 *
 * Así que se exige: toda exención que se justifique diciendo «sí traducida»
 * tiene que estar en el diccionario. Las que dicen otra cosa —licencias, líneas
 * de marca— no, porque ésas afirman lo contrario y son verificables leyéndolas.
 */
/**
 * LAS CLAVES DEL DICCIONARIO, EN SUS TRES SINTAXIS.
 *
 * Buscar `'clave':` en el texto parece suficiente y no lo es: una clave que sea
 * un identificador válido de JavaScript se escribe SIN comillas —`Legal: {`,
 * `Ecosistema: {`, `Navegación: {`— y esa búsqueda no la ve.
 *
 * Me costó un falso positivo inmediato: la primera versión de la comprobación
 * de abajo denunció «Navegación» como exención mentirosa. Su fila existe desde
 * hace tiempo; lo que no existía era comillas. De haberme creído el informe,
 * habría añadido una clave duplicada — y ésas rompen el build entero.
 *
 * El acento no salva: en JavaScript `Navegación` es un identificador válido.
 */
function clavesDelDiccionario() {
  const fuente =
    readFileSync(resolve(raiz, 'lib/i18n/diccionario.ts'), 'utf8') +
    readFileSync(resolve(raiz, 'lib/i18n/diccionario-whitepaper.ts'), 'utf8')
  const claves = new Set()
  for (const m of fuente.matchAll(/^\s{2}'((?:[^'\\]|\\.)+)':\s*\{/gm)) claves.add(m[1])
  for (const m of fuente.matchAll(/^\s{2}"((?:[^"\\]|\\.)+)":\s*\{/gm)) claves.add(m[1])
  for (const m of fuente.matchAll(/^\s{2}([A-Za-zÀ-ÿ_$][\w$À-ÿ]*):\s*\{/gm)) claves.add(m[1])
  return claves
}

/*
 * UNA EXENCIÓN QUE AFIRMA «SÍ TRADUCIDA» TIENE QUE PODER DEMOSTRARLO.
 *
 * La mitad de esta lista no dice «esto no se traduce», dice «esto SÍ se traduce
 * pero por un camino que no sé seguir». Esa segunda forma es una promesa mía, y
 * una promesa escrita en un comentario no la comprueba nadie: el día que alguien
 * borre la fila del diccionario, la cadena vuelve al español y la exención la
 * tapa. Sería un agujero con aspecto de decisión.
 */
{
  const CLAVES = clavesDelDiccionario()
  /* Control de instrumento — una clave de cada sintaxis. Sin esto, un detector
     que no encuentre NADA daría todas las exenciones por mentirosas, y uno que
     lo encuentre todo las daría todas por buenas. */
  for (const [muestra, forma] of [
    ['Ecosistema', 'sin comillas'],
    ['Navegación', 'sin comillas, con acento'],
    ['la web oficial', 'entre comillas simples'],
  ]) {
    if (!CLAVES.has(muestra)) {
      console.error(`control: no se detectan las claves ${forma} («${muestra}»). Detector roto.`)
      process.exit(1)
    }
  }
  if (CLAVES.has('esta-clave-no-existe')) {
    console.error('control: el detector de claves da positivo en todo.')
    process.exit(1)
  }

  const rotas = []
  for (const [cadena, razon] of EXENTAS) {
    if (!razon.startsWith('sí traducida')) continue
    if (!CLAVES.has(cadena)) {
      rotas.push(`«${cadena}» — la exención dice que se traduce y NO tiene fila`)
    }
  }
  if (rotas.length) {
    console.error('\nEXENCIONES QUE MIENTEN:\n  · ' + rotas.join('\n  · ') + '\n')
    process.exit(1)
  }
}

/**
 * Señales de que una cadena es español para una persona, no para la máquina.
 * Un acento o un signo de apertura bastan; si no, una palabra funcional suelta
 * entre espacios, que es lo que distingue una frase de un nombre de clase.
 */
const ES =
  /[áéíóúñÁÉÍÓÚÑ¿¡]|(^|\s)(el|la|los|las|de|del|que|con|para|una|un|tu|su|es|son|por|en|se|más|cómo|sin|sobre|desde|entre)(\s|$)/i

/**
 * RUIDO QUE PARECE TEXTO. Sin este filtro, la herramienta devuelve cientos de
 * clases de Tailwind y rutas, y una lista que hay que limpiar a mano nadie la
 * usa dos veces.
 */
const RUIDO = [
  /[{}$<>/\\]/,
  /^\./,
  /(^|\s)(px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|text|bg|border|rounded|flex|grid|gap|w|h|min|max|absolute|relative|z|opacity|hover|sm|md|lg|xl)-/,
  /https?:/,
  /^@\//,
  /\.(tsx?|jsx?|css|png|jpe?g|webp|svg|mp4)$/i,
  /^[a-z][a-zA-Z0-9]*$/, // identificadores sueltos
  /^#[0-9a-fA-F]{3,8}$/,
]

const archivos = []
for (const base of AMBITO) {
  const dir = join(raiz, base)
  try {
    ;(function recorrer(d) {
      for (const n of readdirSync(d)) {
        const p = join(d, n)
        if (statSync(p).isDirectory()) recorrer(p)
        else if (/\.(tsx|ts)$/.test(n)) archivos.push(p)
      }
    })(dir)
  } catch {
    /* la carpeta puede no existir en un recorte del repositorio */
  }
}

const porArchivo = []
const todas = new Map()

for (const f of archivos) {
  const rel = relative(raiz, f).split('\\').join('/')
  if (EXCLUIDOS.some((r) => r.test(rel))) continue
  let s = readFileSync(f, 'utf8')
  /* El bloque de metadata se recorta ANTES de buscar: si no, sus descripciones
     aparecen como trabajo pendiente y no lo son. */
  const meta = bloqueMetadata(s)
  if (meta) s = s.slice(0, meta[0]) + s.slice(meta[1])
  /*
   * LOS COMENTARIOS SE QUITAN ANTES DE BUSCAR.
   *
   * Este código está muy comentado y en español, así que la herramienta señalaba
   * como texto pendiente frases de las propias explicaciones —«cristal con
   * media», «la página Qué es G1»— que no las lee ningún visitante. Dos falsos
   * positivos bastan para que la lista deje de creerse.
   *
   * Se sustituyen por espacios en vez de borrarse, para no pegar dos trozos de
   * código y fabricar una cadena que no existía.
   */
  s = s.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length)).replace(/^\s*\/\/.*$/gm, '')
  /*
   * SE MIDE CADENA A CADENA, NO ARCHIVO A ARCHIVO.
   *
   * La primera versión daba por atendido cualquier archivo que llamara UNA vez a
   * `useCorpus`. Con eso, `QueEsContent` desapareció del informe teniendo seis
   * descripciones todavía a fuego: la herramienta decía «hecho» sobre un archivo
   * a medias, que es exactamente el tipo de medición que hace perder el trabajo.
   *
   * Ahora una cadena cuenta como atendida sólo si aparece DENTRO de una llamada
   * —`c('…')` o `t('…')`— en ese mismo archivo.
   */
  const enLlamada = new Set(
    [...s.matchAll(/\b(?:c|t)\(\s*'([^'\\]*)'/g), ...s.matchAll(/\b(?:c|t)\(\s*"([^"\\]*)"/g)].map(
      (m) => m[1].replace(/\s+/g, ' ').trim()
    )
  )

  /*
   * TAMBIÉN SE SIGUEN LAS CADENAS QUE VIAJAN EN UN ARRAY.
   *
   * Media web guarda su contenido en constantes —`PASOS`, `ENTIDADES`,
   * `EVENTOS`— y lo traduce en el punto de pintado con `c(p.titulo)`. Sin
   * entender eso, la herramienta señalaba como pendiente TODO lo que ya estaba
   * hecho, y una lista que da falsos positivos deja de leerse a la semana. Peor:
   * nunca podría llegar a cero, así que jamás serviría como guarda en CI.
   *
   * Dos formas, las dos precisas:
   *   `c(algo.PROP)`  → toda cadena declarada como `PROP: '…'` está atendida.
   *   `c(x)` a secas  → las cadenas de los arrays de cadenas sueltas lo están.
   */
  for (const m of s.matchAll(/\b(?:c|t)\(\s*[A-Za-z_$][\w$]*\.([\w$]+)\s*\)/g)) {
    const prop = m[1]
    for (const v of s.matchAll(new RegExp(`\\b${prop}\\s*:\\s*'([^'\\\\]*)'`, 'g')))
      enLlamada.add(v[1].replace(/\s+/g, ' ').trim())
    for (const v of s.matchAll(new RegExp(`\\b${prop}\\s*:\\s*"([^"\\\\]*)"`, 'g')))
      enLlamada.add(v[1].replace(/\s+/g, ' ').trim())
  }
  if (/\b(?:c|t)\(\s*[A-Za-z_$][\w$]*\s*\)/.test(s)) {
    for (const arr of s.matchAll(/\[\s*((?:'[^'\\]*'\s*,?\s*)+)\]/g))
      for (const v of arr[1].matchAll(/'([^'\\]*)'/g))
        enLlamada.add(v[1].replace(/\s+/g, ' ').trim())
  }
  const cands = [
    ...[...s.matchAll(/>\s*([^<>{}\n][^<>{}]{6,})\s*</g)].map((x) => x[1]),
    ...[...s.matchAll(/'([^'\\\n]{8,})'/g)].map((x) => x[1]),
    ...[...s.matchAll(/"([^"\\\n]{8,})"/g)].map((x) => x[1]),
  ]
  const encontradas = new Set()
  for (let c of cands) {
    c = c.replace(/\s+/g, ' ').trim()
    if (!ES.test(c)) continue
    if (RUIDO.some((r) => r.test(c))) continue
    if (!/[a-záéíóúñ]{3,}/i.test(c)) continue
    /* Ya envuelta en `c('…')` o `t('…')`: está atendida. */
    if (enLlamada.has(c)) continue
    if (EXENTAS.has(c)) continue
    /* La forma partida («arriba|abajo») y la de énfasis («**x**») no aparecen
       literales en el JSX, así que se comprueba también contra ellas. */
    if ([...enLlamada].some((k) => k.replace(/\*\*/g, '').replace(/\|/g, ' ').includes(c))) continue
    encontradas.add(c)
  }
  if (!encontradas.size) continue
  for (const c of encontradas) todas.set(c, (todas.get(c) ?? 0) + 1)
  porArchivo.push({ archivo: rel, traduce: false, cadenas: [...encontradas] })
}

const sinTraducir = porArchivo.filter((a) => !a.traduce)
const caracteres = [...todas.keys()].reduce((a, s) => a + s.length, 0)

if (process.argv.includes('--cadenas')) {
  /* Ordenadas de más larga a más corta: las largas son las que de verdad se
     leen, y traducirlas primero es lo que cambia la experiencia. */
  for (const c of [...todas.keys()].sort((a, b) => b.length - a.length)) {
    console.log(JSON.stringify(c))
  }
  process.exit(0)
}

if (process.argv.includes('--detalle')) {
  for (const a of sinTraducir.sort((x, y) => y.cadenas.length - x.cadenas.length)) {
    console.log(`\n══ ${a.archivo}`)
    for (const c of a.cadenas) console.log('   · ' + c.slice(0, 92))
  }
  process.exit(0)
}

console.log(`\nÁMBITO: ${AMBITO.join(', ')} — ${archivos.length} archivos\n`)
console.log(
  `  sin pasar por t(): ${sinTraducir.length} archivo(s) · ${todas.size} cadenas distintas · ` +
    `${(caracteres / 1000).toFixed(1)}k caracteres por idioma\n`
)
for (const a of sinTraducir.sort((x, y) => y.cadenas.length - x.cadenas.length).slice(0, 20)) {
  console.log(`  ${String(a.cadenas.length).padStart(3)}  ${a.archivo}`)
}
if (sinTraducir.length > 20) console.log(`  … y ${sinTraducir.length - 20} archivo(s) más`)

if (process.argv.includes('--guarda') && todas.size > 0) {
  console.error(`\ni18n: ${todas.size} cadena(s) visibles no pasan por t()`)
  process.exit(1)
}
