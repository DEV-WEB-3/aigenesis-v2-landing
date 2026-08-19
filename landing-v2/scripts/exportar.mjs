#!/usr/bin/env node
/**
 * EXPORTACIÓN ESTÁTICA, EN UN SOLO COMANDO Y EN CUALQUIER SISTEMA.
 *
 * Existe por algo tonto y real: `EXPORTAR_ESTATICO=1 next build` funciona en un
 * shell POSIX y NO en cmd de Windows, que es donde se trabaja este proyecto.
 * La alternativa habitual es añadir `cross-env` como dependencia; esto hace lo
 * mismo en quince líneas y sin ampliar el árbol de paquetes de un front por una
 * variable de entorno.
 *
 * Encadena las dos mitades que siempre van juntas —construir y reponer las
 * cabeceras en `.htaccess`— porque separarlas es ofrecer la posibilidad de
 * subir la copia sin ellas, en silencio.
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const entorno = { ...process.env, EXPORTAR_ESTATICO: '1' }

console.log('→ construyendo la copia estática (EXPORTAR_ESTATICO=1)…')
const build = spawnSync('npx', ['next', 'build'], {
  cwd: raiz,
  env: entorno,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
if (build.status !== 0) process.exit(build.status ?? 1)

console.log('\n→ reponiendo las cabeceras de seguridad en .htaccess…')
const htaccess = spawnSync('node', [resolve(aqui, 'generar-htaccess.mjs')], {
  cwd: raiz,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
process.exit(htaccess.status ?? 1)
