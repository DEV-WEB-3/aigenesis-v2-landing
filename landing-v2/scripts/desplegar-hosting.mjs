#!/usr/bin/env node
/**
 * SUBE LA COPIA ESTÁTICA A UN HOSTING CLÁSICO (Hostinger) POR FTPS.
 *
 * POR QUÉ FTPS Y NO LA API. La API pública de Hostinger cubre VPS, dominios,
 * DNS y facturación — NO sube archivos a hosting compartido. Ahí sólo hay File
 * Manager (a mano) o FTP/SFTP. Se comprobó antes de escribir esto, porque
 * montar un despliegue sobre una capacidad que no existe se descubre tarde.
 *
 * POR QUÉ `curl` Y NO UNA LIBRERÍA. `curl` ya está en la máquina y habla FTPS
 * con TLS. Añadir una dependencia de FTP a un proyecto de front sólo para
 * desplegar es superficie nueva —y actualizaciones, y auditorías— a cambio de
 * nada que `curl` no haga.
 *
 * LAS CREDENCIALES NO VIVEN AQUÍ ni en el repositorio. Se leen de un archivo
 * fuera del proyecto (ver `RUTA_CREDENCIALES`), que además está en
 * `.gitignore` por si alguien lo copia dentro. El script NUNCA imprime la
 * contraseña, ni siquiera en los errores: los mensajes de `curl` se filtran.
 *
 * Uso:
 *   node scripts/desplegar-hosting.mjs            # sube
 *   node scripts/desplegar-hosting.mjs --probar   # sólo comprueba el acceso
 *   node scripts/desplegar-hosting.mjs --simular  # lista qué subiría, sin subir
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join, relative, posix } from 'node:path'
import { homedir } from 'node:os'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const ORIGEN = resolve(raiz, 'out')
const RUTA_CREDENCIALES = resolve(homedir(), '.hostinger', 'credenciales.json')

const soloProbar = process.argv.includes('--probar')
const simular = process.argv.includes('--simular')

/* ── credenciales ──────────────────────────────────────────────────────────
 * Dos orígenes, en este orden:
 *   1. El archivo local del operador (uso a mano en su máquina).
 *   2. Variables de entorno (uso en CI, donde no hay carpeta de usuario y el
 *      secreto lo inyecta GitHub Actions).
 * El entorno NO pisa al archivo: quien está sentado en la máquina manda.
 */
const desdeEntorno = () => {
  const { HOSTINGER_FTP_HOST, HOSTINGER_FTP_USER, HOSTINGER_FTP_PASS, HOSTINGER_FTP_DIR } = process.env
  if (!HOSTINGER_FTP_HOST || !HOSTINGER_FTP_USER || !HOSTINGER_FTP_PASS) return null
  return { host: HOSTINGER_FTP_HOST, usuario: HOSTINGER_FTP_USER, clave: HOSTINGER_FTP_PASS, carpeta: HOSTINGER_FTP_DIR || '/' }
}
const cred = existsSync(RUTA_CREDENCIALES)
  ? JSON.parse(readFileSync(RUTA_CREDENCIALES, 'utf8'))
  : desdeEntorno()
/*
 * SE LIMPIAN LOS VALORES. Un secreto de CI con un salto de línea al final —el
 * accidente más común al copiarlo— llega intacto hasta `curl`, que responde
 * «URL rejected: Malformed input to a URL function»: un mensaje que no menciona
 * el espacio en blanco y manda a buscar el error donde no está. Pasó aquí.
 */
if (cred) for (const k of Object.keys(cred)) if (typeof cred[k] === 'string') cred[k] = cred[k].trim()
if (!cred) {
  console.error(`No hay credenciales en ${RUTA_CREDENCIALES} ni en el entorno`)
  console.error('Formato del archivo (crear a mano, nunca en el repositorio):')
  console.error(
    JSON.stringify(
      { host: 'ftp.tudominio.com', usuario: 'u123456789.despliegue', clave: '…', carpeta: '/public_html' },
      null,
      2
    )
  )
  console.error('En CI: HOSTINGER_FTP_HOST, HOSTINGER_FTP_USER, HOSTINGER_FTP_PASS, HOSTINGER_FTP_DIR')
  process.exit(1)
}
for (const campo of ['host', 'usuario', 'clave', 'carpeta']) {
  if (!cred[campo]) {
    console.error(`Falta "${campo}" en ${RUTA_CREDENCIALES}`)
    process.exit(1)
  }
}

/* Nunca se imprime la clave: si aparece en un mensaje de curl, se tapa. */
const ocultar = (texto) => String(texto).split(cred.clave).join('«clave oculta»')

const base = `ftp://${cred.host}${cred.carpeta.startsWith('/') ? '' : '/'}${cred.carpeta}`

function curl(args) {
  return execFileSync(
    'curl',
    ['--ssl-reqd', '--user', `${cred.usuario}:${cred.clave}`, '--connect-timeout', '25', '--max-time', '180', ...args],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  )
}

/* ── comprobar acceso ──────────────────────────────────────────────────── */
try {
  const listado = curl(['--list-only', `${base}/`])
  console.log(`Acceso correcto a ${cred.host}${cred.carpeta}`)
  const entradas = listado.split('\n').filter(Boolean)
  console.log(`  la carpeta contiene ${entradas.length} entrada(s)`)
  /*
   * SE AVISA SI LA CARPETA NO ESTÁ VACÍA, y no se borra nada.
   *
   * Este script sube y sobrescribe; NO limpia. Es deliberado: un despliegue que
   * borra lo que encuentra es un despliegue que puede llevarse por delante algo
   * que no puso él —y en esta cuenta viven el WordPress de aigenesis.io y los
   * PDF de las presentaciones que la propia landing enlaza—. Si hay que vaciar
   * una carpeta, se vacía a conciencia y a mano, mirando qué había.
   */
  if (entradas.length) {
    console.log('  AVISO: no está vacía. Este script sobrescribe, nunca borra.')
    for (const e of entradas.slice(0, 12)) console.log('    -', e)
  }
} catch (e) {
  console.error('No se pudo acceder:', ocultar(e.stderr || e.message))
  process.exit(1)
}
if (soloProbar) process.exit(0)

/* ── recorrer la exportación ───────────────────────────────────────────── */
if (!existsSync(ORIGEN)) {
  console.error(`No existe ${ORIGEN}. Ejecuta antes:  EXPORTAR_ESTATICO=1 npm run build`)
  process.exit(1)
}
const archivos = []
;(function recorrer(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) recorrer(p)
    else archivos.push(p)
  }
})(ORIGEN)

const total = archivos.reduce((s, f) => s + statSync(f).size, 0)
console.log(`\n${archivos.length} archivos, ${(total / 1048576).toFixed(1)} MB`)

if (simular) {
  for (const f of archivos.slice(0, 25)) console.log('  subiría', relative(ORIGEN, f))
  if (archivos.length > 25) console.log(`  … y ${archivos.length - 25} más`)
  process.exit(0)
}

/* ── subir ─────────────────────────────────────────────────────────────── */
let hechos = 0
const fallos = []
for (const f of archivos) {
  const rel = relative(ORIGEN, f).split('\\').join('/')
  try {
    /* `--ftp-create-dirs` crea el árbol de carpetas por el camino. */
    curl(['--ftp-create-dirs', '--upload-file', f, `${base}/${posix.normalize(rel)}`])
    hechos++
    if (hechos % 25 === 0) console.log(`  ${hechos}/${archivos.length}`)
  } catch (e) {
    fallos.push({ rel, error: ocultar(e.stderr || e.message).slice(0, 120) })
  }
}

console.log(`\nSubidos ${hechos}/${archivos.length}`)
if (fallos.length) {
  console.error(`FALLARON ${fallos.length}:`)
  for (const f of fallos.slice(0, 15)) console.error('  ·', f.rel, '→', f.error)
  process.exit(1)
}
