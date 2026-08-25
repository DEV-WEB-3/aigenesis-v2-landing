#!/usr/bin/env node
/**
 * COMPRIME Y SUBE UN VIDEO DEL AULA AL HOSTING PROPIO.
 *
 * POR QUÉ NO PASA POR EL DESPLIEGUE NORMAL
 * ----------------------------------------
 * `desplegar-hosting.mjs` sube el contenido de `out/` entero en cada push: hoy son
 * 64 MB y unos diez minutos. Si los videos vivieran ahí, cada cambio de una coma
 * en un texto volvería a subir cientos de MB de archivos que no cambiaron.
 *
 * Por eso los videos van a `~/domains/aigenesis.io/public_html/media/aula/`, que
 * está FUERA de `out/`. Y como el despliegue sobrescribe pero nunca borra, esa
 * carpeta sobrevive intacta a cada publicación sin que nadie tenga que acordarse.
 *
 * SE SUBE UNA VEZ. Este script no se ejecuta en CI ni en cada despliegue.
 *
 * QUÉ HACE LA COMPRESIÓN Y POR QUÉ ASÍ
 * ------------------------------------
 * El material son grabaciones de pantalla: lo que hay que preservar es el TEXTO
 * del portal, no el color de una piel. Eso cambia las decisiones respecto a un
 * video normal:
 *
 *   - `-crf 23` con `-preset slow`. En captura de pantalla el ruido es casi nulo,
 *     así que x264 comprime muchísimo y un CRF que en cámara sería agresivo aquí
 *     deja el texto limpio. `slow` cuesta minutos de CPU una vez y ahorra MB para
 *     siempre.
 *   - Se mantiene la resolución de origen hasta 1080p y se REDUCE por encima. Bajar
 *     un tutorial a 720p emborrona precisamente lo que la persona tiene que leer.
 *   - `-movflags +faststart`. Sin esto el índice del MP4 queda al FINAL del
 *     archivo, y el navegador tiene que descargarlo entero antes de pintar el
 *     primer fotograma. Con un archivo de 60 MB eso son diez segundos de pantalla
 *     negra que se leen como «está roto». Es la opción más importante de todas.
 *   - Audio AAC a 96k mono si la fuente es mono. Es voz, no música.
 *   - `-pix_fmt yuv420p` para que reproduzca en todos los navegadores. x264 elige
 *     4:4:4 por su cuenta con algunas capturas de pantalla, y Safari no lo abre.
 *
 * Además saca el PÓSTER (un fotograma a los 2 s) para que la ficha enseñe algo
 * antes de que nadie pulse, sin descargar el video.
 *
 * NO BORRA NADA y avisa antes de sobrescribir.
 *
 * Uso:
 *   node scripts/subir-video.mjs <archivo> --edicion acceso-cuenta --idioma es
 *   node scripts/subir-video.mjs <archivo> --edicion acceso-cuenta --idioma es --solo-comprimir
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

/* Analiza los argumentos marcando los que ya se consumieron como VALOR de una
   opción. Buscar «el primero que no empieza por --» sin llevar esa cuenta toma
   `acceso-cuenta` por el nombre del archivo en cuanto alguien pone `--edicion`
   delante, que es justo el orden natural de escribirlo. */
const args = process.argv.slice(2)
const CON_VALOR = new Set(['--edicion', '--idioma'])
const consumido = new Set()
const opciones = {}
args.forEach((a, i) => {
  if (CON_VALOR.has(a)) {
    opciones[a.slice(2)] = args[i + 1]
    consumido.add(i).add(i + 1)
  } else if (a.startsWith('--')) {
    consumido.add(i)
  }
})
const entrada = args.find((_, i) => !consumido.has(i))
const edicion = opciones.edicion
const idioma = opciones.idioma
const soloComprimir = args.includes('--solo-comprimir')

/* El destino remoto. El alias `hostinger-aigenesis` vive en ~/.ssh/config: sin él
   habría que repetir puerto, usuario y clave en cada invocación, y ese es el tipo
   de detalle que alguien acaba escribiendo mal en el peor momento. */
const REMOTO = 'hostinger-aigenesis'
const BASE_REMOTA = 'domains/aigenesis.io/public_html/media/aula'

if (!entrada || !edicion || !idioma) {
  console.error('Uso: node scripts/subir-video.mjs <archivo> --edicion <slug> --idioma <cod>')
  console.error('Ejemplo: node scripts/subir-video.mjs grabacion.mp4 --edicion acceso-cuenta --idioma es')
  process.exit(1)
}
const origen = resolve(entrada)
if (!existsSync(origen)) {
  console.error(`No existe ${origen}`)
  process.exit(1)
}

const mb = (bytes) => (bytes / 1048576).toFixed(1)
const correr = (cmd, argv) =>
  execFileSync(cmd, argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

/* ── medir el original ─────────────────────────────────────────────────────── */
let info
try {
  info = JSON.parse(
    correr('ffprobe', [
      '-v', 'quiet', '-print_format', 'json',
      '-show_streams', '-show_format', origen,
    ])
  )
} catch (e) {
  console.error('No pude leer el video. ¿Está ffprobe en el PATH?')
  process.exit(1)
}
const vs = info.streams.find((s) => s.codec_type === 'video')
const as = info.streams.find((s) => s.codec_type === 'audio')
if (!vs) {
  console.error('El archivo no tiene pista de video.')
  process.exit(1)
}
const segundos = Math.round(Number(info.format.duration) || 0)
const pesoOriginal = statSync(origen).size

console.log(`\n${basename(origen)}`)
console.log(`  ${vs.width}×${vs.height} · ${segundos}s · ${mb(pesoOriginal)} MB · ${vs.codec_name}`)
console.log(`  audio: ${as ? `${as.codec_name}, ${as.channels} canal(es)` : 'sin audio'}`)

/* ── comprimir ─────────────────────────────────────────────────────────────── */
const salida = join(tmpdir(), `aula-${edicion}-${idioma}.mp4`)
const poster = join(tmpdir(), `aula-${edicion}-${idioma}.jpg`)

/*
 * SE LIMITA EL LADO CORTO, NO LA ALTURA.
 *
 * La primera versión decía `if (alto > 1080) escalar a 1080 de alto`. Con un
 * video horizontal funciona. Con uno VERTICAL —y los tutoriales tienen versión
 * 9:16 de 1080×1920— el alto es 1920, así que entraba por la condición y lo
 * reducía a 607×1080: le quitaba casi la mitad de la resolución a un video que ya
 * estaba en el tamaño correcto.
 *
 * Lo que hay que acotar es el lado CORTO, que es el que define el detalle real.
 * Y nunca se amplía: escalar hacia arriba no añade detalle, sólo peso.
 */
const ladoCorto = Math.min(vs.width, vs.height)
const escala =
  ladoCorto > 1080
    ? ['-vf', vs.width < vs.height ? 'scale=1080:-2' : 'scale=-2:1080']
    : []

const ffargs = [
  '-y', '-i', origen,
  ...escala,
  '-c:v', 'libx264', '-crf', '23', '-preset', 'slow',
  '-profile:v', 'high', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
]
if (as) {
  ffargs.push('-c:a', 'aac', '-b:a', as.channels === 1 ? '96k' : '128k')
} else {
  ffargs.push('-an')
}
ffargs.push(salida)

console.log('\nComprimiendo (preset slow — tarda, y se nota en el resultado)…')
try {
  execFileSync('ffmpeg', ffargs, { stdio: ['ignore', 'ignore', 'inherit'] })
} catch {
  console.error('Falló la compresión.')
  process.exit(1)
}

/* El póster a los 2 s: en el segundo 0 casi siempre hay un fundido a negro, y un
   póster negro se lee como un video roto. */
try {
  execFileSync(
    'ffmpeg',
    ['-y', '-ss', '2', '-i', salida, '-frames:v', '1', '-q:v', '4', poster],
    { stdio: ['ignore', 'ignore', 'ignore'] }
  )
} catch {
  console.log('  (sin póster: el video dura menos de 2 s)')
}

const pesoFinal = statSync(salida).size
const ahorro = Math.round((1 - pesoFinal / pesoOriginal) * 100)
console.log(`\n  ${mb(pesoOriginal)} MB → ${mb(pesoFinal)} MB  (${ahorro > 0 ? '−' : '+'}${Math.abs(ahorro)}%)`)
console.log(`  ${(pesoFinal * 8) / segundos / 1000 | 0} kbps`)
console.log(`\n  Para lib/soporte/ediciones.ts:`)
console.log(`    ${idioma}: { video: '${edicion}/${idioma}.mp4', segundos: ${segundos} },`)

if (soloComprimir) {
  console.log(`\nArchivo listo en:\n  ${salida}`)
  console.log('Míralo antes de subir. Cuando te convenza, repite sin --solo-comprimir.')
  process.exit(0)
}

/* ── subir ─────────────────────────────────────────────────────────────────── */
const destino = `${BASE_REMOTA}/${edicion}`
console.log(`\nSubiendo a ${REMOTO}:${destino}/ …`)
try {
  /* Se avisa si ya existe, y no se sobrescribe a ciegas: un video subido es un
     enlace que alguien puede haber compartido ya. */
  const yaHay = correr('ssh', [REMOTO, `ls ${destino}/${idioma}.mp4 2>/dev/null || true`]).trim()
  if (yaHay) {
    console.log(`  AVISO: ${idioma}.mp4 ya existe en el servidor y se va a reemplazar.`)
  }
  correr('ssh', [REMOTO, `mkdir -p ${destino}`])
  execFileSync('scp', [salida, `${REMOTO}:${destino}/${idioma}.mp4`], { stdio: 'inherit' })
  if (existsSync(poster)) {
    execFileSync('scp', [poster, `${REMOTO}:${destino}/${idioma}.jpg`], { stdio: 'inherit' })
  }
} catch (e) {
  console.error('Falló la subida:', e.message)
  process.exit(1)
}

const url = `https://aigenesis.io/media/aula/${edicion}/${idioma}.mp4`
console.log(`\nSubido. Comprobando que el servidor lo sirve…`)
try {
  const codigo = correr('curl', ['-sI', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '30', url]).trim()
  console.log(`  ${url} → ${codigo}`)
  if (codigo !== '200') {
    console.error('  El archivo está arriba pero el servidor no lo sirve. Revisa el .htaccess.')
    process.exit(1)
  }
} catch {
  console.log('  (no pude comprobarlo desde aquí)')
}

console.log('\nFalta un paso a mano, y es a propósito:')
console.log('  1. Pega la línea de arriba en lib/soporte/ediciones.ts')
console.log('  2. Pon VIDEOTECA.publicado = true cuando haya al menos un video')
