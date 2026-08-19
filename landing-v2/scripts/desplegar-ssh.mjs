#!/usr/bin/env node
/**
 * DESPLIEGA LA COPIA ESTÁTICA POR SSH.
 *
 * POR QUÉ ESTE Y NO EL DE FTPS. Cuando se escribió `desplegar-hosting.mjs` la
 * única vía era FTP. Después el owner activó SSH con clave, que es mejor por
 * tres motivos medibles: no hay contraseña guardada en ninguna parte, el
 * transporte va cifrado de extremo a extremo, y se sube en UNA conexión en vez
 * de una por archivo —son ~200 archivos—. El de FTPS se conserva por si algún
 * día se despliega a un hosting sin SSH.
 *
 * CÓMO. `tar` local → tubería por `ssh` → `tar` remoto. Se eligió así porque
 * esta máquina NO tiene `rsync` (comprobado: sólo `scp` y `tar`) y el servidor
 * sí. Subir con `scp -r` haría una conexión por archivo; una tubería hace una.
 *
 * QUÉ NO HACE: no borra nada. En esa cuenta conviven el WordPress, la
 * plataforma Genesis y las dieciséis presentaciones que esta misma landing
 * enlaza. Si hay que vaciar algo, se vacía a mano y mirando qué había.
 *
 * Uso:
 *   node scripts/desplegar-ssh.mjs                    # a la carpeta por defecto
 *   node scripts/desplegar-ssh.mjs --destino nueva    # subcarpeta de aigenesis.io
 *   node scripts/desplegar-ssh.mjs --simular          # dice qué haría
 */
import { existsSync, readdirSync, statSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const ORIGEN = resolve(raiz, 'out')

const ALIAS = 'hostinger-aigenesis'
const BASE_REMOTA = 'domains/aigenesis.io/public_html'

const args = process.argv.slice(2)
const simular = args.includes('--simular')
const iDestino = args.indexOf('--destino')
const sub = iDestino >= 0 ? args[iDestino + 1]?.replace(/^\/+|\/+$/g, '') : 'nueva'
if (!sub) {
  console.error('Falta el valor de --destino')
  process.exit(1)
}
const DESTINO = `${BASE_REMOTA}/${sub}`

if (!existsSync(ORIGEN)) {
  console.error(`No existe ${ORIGEN}.`)
  console.error(`Ejecuta antes:  BASE_PATH=${sub} npm run exportar`)
  process.exit(1)
}

/*
 * COMPROBACIÓN QUE HA SALVADO UN DESPLIEGUE: que lo exportado corresponda al
 * destino. Si `out/` se construyó para la raíz y se sube a una subcarpeta —o al
 * revés— el sitio carga sin estilos ni JavaScript y parece roto sin ningún
 * error claro. El prefijo va escrito DENTRO de cada HTML, así que se puede
 * verificar antes de mover un solo byte.
 */
const indice = join(ORIGEN, 'index.html')
const html = existsSync(indice) ? execFileSync('node', ['-e', `process.stdout.write(require('fs').readFileSync(${JSON.stringify(indice)},'utf8'))`], { encoding: 'utf8', maxBuffer: 40e6 }) : ''
const tienePrefijo = html.includes(`"/${sub}/_next/`)
const tieneRaiz = html.includes('"/_next/')
if (!tienePrefijo || tieneRaiz) {
  console.error(`La exportación de out/ NO corresponde al destino "/${sub}".`)
  console.error(`  rutas con /${sub}/_next/: ${tienePrefijo ? 'sí' : 'NO'}`)
  console.error(`  rutas a la raíz /_next/:  ${tieneRaiz ? 'SÍ (mal)' : 'no'}`)
  console.error(`Vuelve a exportar:  BASE_PATH=${sub} npm run exportar`)
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
const bytes = archivos.reduce((s, f) => s + statSync(f).size, 0)

console.log(`origen   ${ORIGEN}`)
console.log(`destino  ${ALIAS}:~/${DESTINO}`)
console.log(`         ${archivos.length} archivos · ${(bytes / 1048576).toFixed(1)} MB · prefijo /${sub} verificado`)

if (simular) {
  console.log('\n(--simular) no se sube nada.')
  process.exit(0)
}

/* Copia de lo que hubiera en el destino, por si ya había algo. Va fuera de
   public_html: dentro sería descargable por cualquiera. */
const marca = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')
console.log('\n→ respaldando el destino si ya existe…')
const previo = spawnSync(
  'ssh',
  [ALIAS, `if [ -d ~/${DESTINO} ] && [ -n "$(ls -A ~/${DESTINO} 2>/dev/null)" ]; then mkdir -p ~/copias && tar czf ~/copias/${sub}-previo-${marca}.tar.gz -C ~/${BASE_REMOTA} ${sub} && echo "   respaldado en ~/copias/${sub}-previo-${marca}.tar.gz"; else echo "   destino vacío o inexistente: nada que respaldar"; fi`],
  { encoding: 'utf8', stdio: 'inherit' }
)
if (previo.status !== 0) process.exit(previo.status ?? 1)

console.log('\n→ subiendo…')
/* `tar` local a la salida estándar, `ssh` lo recibe y `tar` remoto lo extrae.
   `--no-same-owner` porque el usuario del hosting no puede fijar propietarios. */
const orden = `mkdir -p ~/${DESTINO} && tar xzf - --no-same-owner -C ~/${DESTINO} && echo OK`
const subida = spawnSync(
  process.platform === 'win32' ? 'bash' : 'sh',
  ['-c', `tar czf - -C "${ORIGEN}" . | ssh ${ALIAS} '${orden}'`],
  { stdio: 'inherit' }
)
if (subida.status !== 0) {
  console.error('La subida falló.')
  process.exit(subida.status ?? 1)
}

console.log('\n→ comprobando en el servidor…')
spawnSync('ssh', [ALIAS, `cd ~/${DESTINO} && echo "   archivos: $(find . -type f | wc -l)" && echo "   peso: $(du -sh . | cut -f1)" && echo "   .htaccess: $([ -f .htaccess ] && echo sí || echo NO)" && echo "   index.html: $([ -f index.html ] && echo sí || echo NO)"`], { stdio: 'inherit' })
