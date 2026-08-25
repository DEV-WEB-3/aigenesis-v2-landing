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

/*
 * EL CORS DE LOS VIDEOS, DESDE TODOS LOS ORÍGENES DONDE CORRE EL ASISTENTE.
 *
 * Esto existe por el fallo del 25-ago-2026. Comprobé el CORS de la videoteca
 * muchas veces y siempre salía perfecto — preguntando desde `g1.aigenesis.io`,
 * el host que yo tenía en la cabeza. El owner probaba en
 * `aigenesis-landing.vercel.app`, que es donde Vercel publica la misma landing,
 * y ahí no había ni una cabecera: ni un video cargaba, ni un póster.
 *
 * Una lista blanca sólo vale si se hizo enumerando dónde CORRE la aplicación.
 * Y una guarda que interroga un solo origen no comprueba una lista blanca:
 * comprueba una entrada de la lista.
 *
 * Los orígenes se declaran aquí y tienen que coincidir con
 * `deploy/media-aula.htaccess`. Si alguien añade un host allí y no aquí, esta
 * guarda deja de cubrirlo — por eso van juntos en el mismo commit siempre.
 */
const ORIGENES = [
  'https://g1.aigenesis.io',
  'https://aigenesis.io',
  'https://conect.aigenesis.io',
  'https://aigenesis-landing.vercel.app',
]

/*
 * SÓLO EL VIDEO LLEVA CORS, Y EL PÓSTER NO PUEDE LLEVARLO.
 *
 * La primera versión de esto probaba los dos y marcaba el .jpg como degradado en
 * los cuatro orígenes, con el remedio «subir el .htaccess». Era falso, y lo
 * demostré con un experimento en el servidor: copié los mismos 2048 bytes a
 * `_p.jpg`, `_p.txt`, `_p.mp4` y `_p.dat` en la misma carpeta. El `.txt`, el
 * `.mp4` y el `.dat` recibieron TODAS las cabeceras del `.htaccess`; el `.jpg`
 * no recibió NINGUNA —ni CORS, ni X-Robots-Tag, ni X-Frame-Options—.
 *
 * No es la configuración: el CDN de Hostinger intercepta las imágenes y reemite
 * un juego reducido de cabeceras. Ningún `.htaccess` lo cambia.
 *
 * Por eso el póster salió del atributo `poster` y es un `<img>` normal, que no
 * pide CORS. Aquí se comprueba lo que le corresponde a cada uno: al video, que
 * la cabecera esté; al póster, que el archivo se pueda descargar.
 */
const MEDIOS = ['acceso-cuenta/es.mp4?v1']
const POSTER = 'acceso-cuenta/es.jpg?v1'

/*
 * SEVERIDAD CALIBRADA, NO TOLERANCIA.
 *
 * Estas comprobaciones NO tumban el despliegue, y la razón es concreta: desde
 * que `FichaEdicion` reintenta sin `crossOrigin` cuando el medio falla, la falta
 * de CORS ya no impide ver el video — sólo apaga el borde que respira con la
 * voz. Es una degradación, no una avería.
 *
 * Marcarlo como fallo dejaría el CI en rojo permanente por algo que se arregla
 * en un `.htaccess` de OTRO servidor, que se sube a mano. Y una guarda siempre
 * roja se acaba ignorando entera — con ella, la que sí importaba.
 *
 * Así que se cuenta y se dice, con el remedio al lado. Lo que sí sería avería:
 * que NINGÚN origen tuviera CORS, porque entonces el archivo `.htaccess` no
 * estaría aplicándose en absoluto y el candado anti-hotlink tampoco. Eso sí para.
 */
const sinCors = []
for (const origen of ORIGENES) {
  for (const medio of MEDIOS) {
    let acao = ''
    let estado = 0
    try {
      const r = await fetch(`https://aigenesis.io/media/aula/${medio}`, {
        headers: { Origin: origen, Range: 'bytes=0-1' },
      })
      estado = r.status
      acao = r.headers.get('access-control-allow-origin') ?? ''
    } catch (e) {
      acao = `(fallo de red: ${e.message})`
    }
    const tipo = medio.split('?')[0].split('.').pop()
    if (acao === origen) {
      console.log(`  ok   ${tipo} con CORS desde ${origen.replace('https://', '')}`)
    } else {
      sinCors.push(`${tipo} desde ${origen.replace('https://', '')} (estado ${estado})`)
      console.log(`  deg  ${tipo} SIN CORS desde ${origen.replace('https://', '')}`)
    }
  }
}
if (sinCors.length === ORIGENES.length * MEDIOS.length) {
  comprobar(
    'la videoteca aplica su .htaccess',
    false,
    'NINGÚN origen recibe CORS: el .htaccess no se está aplicando y el candado ' +
      'anti-hotlink tampoco estará activo.',
  )
} else if (sinCors.length) {
  console.log('')
  console.log(`  AVISO · ${sinCors.length} origen(es) sin CORS — el video se ve, el borde no respira:`)
  for (const s of sinCors) console.log(`         · ${s}`)
  console.log('         Remedio: subir `deploy/media-aula.htaccess` a /media/aula/ en aigenesis.io')
  console.log('         (scp deploy/media-aula.htaccess hostinger-aigenesis:~/domains/…/media/aula/.htaccess)')
}

/*
 * ¿Y aigenesis.io? PORQUE NADIE LO MIRABA.
 *
 * El workflow subía sólo a la carpeta del subdominio. aigenesis.io se quedó con
 * una copia subida a mano el 22-ago-2026 y siguió sirviéndola tres días y siete
 * commits, sin los títulos traducidos ni el arreglo del video. No hubo ningún
 * fallo: nadie le había pedido nunca a nada que mirara ahí.
 *
 * Ésa es la forma de rotura más cara que conozco — la que no rompe nada. Un
 * despliegue que sale verde y un sitio que se queda quieto.
 *
 * Se compara el sello de los dos hosts. NO tumba el despliegue: la raíz depende
 * de un secreto que puede no estar configurado, y hacer fallar el despliegue de
 * g1 por eso lo dejaría todo parado. Pero se DICE, con el número de commits de
 * distancia, para que la deriva sea visible desde el primer día y no desde el
 * tercero.
 */
{
  let selloRaiz = ''
  try {
    const r = await fetch(`https://aigenesis.io/version.txt?${SHA || Date.now()}`)
    /* Sin `version.txt`, el servidor devuelve la página 404 con estado 200. Un
       sello es 40 caracteres hexadecimales; cualquier otra cosa es «no hay». */
    const cuerpo = r.ok ? (await r.text()).trim() : ''
    selloRaiz = /^[0-9a-f]{40}$/.test(cuerpo) ? cuerpo : ''
  } catch {
    selloRaiz = ''
  }
  const selloG1 = SHA || (await bajar(`${BASE}/version.txt?${Date.now()}`).catch(() => '')).trim()
  if (!selloRaiz) {
    console.log('  AVISO · aigenesis.io no publica sello: no se puede saber qué build sirve')
  } else if (selloG1 && selloRaiz !== selloG1) {
    console.log(`  AVISO · aigenesis.io sirve OTRO build: ${selloRaiz.slice(0, 8)} (g1: ${selloG1.slice(0, 8)})`)
    console.log('         Falta el secreto HOSTINGER_FTP_USER_RAIZ, o la subida a la raíz falló.')
  } else if (selloG1) {
    console.log('  ok   aigenesis.io sirve el mismo build que g1')
  }
}

/* El póster no necesita CORS; necesita EXISTIR. Se comprueba lo único que puede
   fallar de él, que es que no esté o que el candado lo bloquee. */
{
  let estado = 0
  try {
    const r = await fetch(`https://aigenesis.io/media/aula/${POSTER}`, {
      headers: { Referer: `${BASE}/g1/`, Range: 'bytes=0-1' },
    })
    estado = r.status
  } catch {
    estado = 0
  }
  comprobar(
    'el póster se descarga (sin CORS: el CDN se lo quita a las imágenes)',
    estado === 200 || estado === 206,
    `estado ${estado}`,
  )
}

console.log('')
if (fallos.length) {
  console.error(`vivo: ${fallos.length} comprobación(es) fallaron en ${BASE}`)
  process.exit(1)
}
console.log(`vivo: ${BASE} sirve el corpus traducido y el contrato correcto`)
