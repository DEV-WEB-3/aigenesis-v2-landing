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
/*
 * NORMALIZAR `BASE_PATH`, Y RECHAZARLO SI VIENE DESTROZADO.
 *
 * Git Bash en Windows convierte los argumentos que parecen rutas POSIX: pasar
 * `BASE_PATH=/nueva` llega al proceso como `C:/Program Files/Git/nueva`. El
 * build entonces construye con ESE prefijo y —si no se mira— se sube un sitio
 * cuyos archivos apuntan a una carpeta que no existe en ningun servidor. Se ve
 * bien en el listado y esta roto en el navegador.
 *
 * Aqui se acepta con barra o sin ella —`nueva` y `/nueva` valen— y se ABORTA si
 * llega convertido, en vez de construir algo inservible en silencio.
 */
const crudo = (process.env.BASE_PATH ?? '').trim()
/* Un `:` no aparece nunca en una subcarpeta web; sí en `C:\…`. Es la señal más
   simple de que la ruta llegó traducida, y una comprobación simple es una que
   no se rompe al copiarla. */
if (crudo.includes(':')) {
  console.error(`BASE_PATH llegó convertido a ruta de Windows: ${crudo}`)
  console.error('Es Git Bash traduciendo rutas. Pásalo SIN barra inicial:  BASE_PATH=nueva npm run exportar')
  process.exit(1)
}
const base = crudo ? '/' + crudo.replace(/^\/+|\/+$/g, '') : ''
/* `NEXT_PUBLIC_` para que la variable llegue tambien al codigo del navegador:
   `rutaPublica` la lee desde componentes que se pintan en el cliente. */
const entorno = {
  ...process.env,
  EXPORTAR_ESTATICO: '1',
  BASE_PATH: base,
  NEXT_PUBLIC_BASE_PATH: base,
  /* `NEXT_PUBLIC_` tambien aqui: la analitica de Vercel se decide en un
     componente de cliente, y alli las variables sin ese prefijo no existen. */
  NEXT_PUBLIC_EXPORTACION_ESTATICA: '1',
}
console.log(base ? `   destino: subcarpeta ${base}` : '   destino: raiz del dominio')

/*
 * EL ENDPOINT DEL ASISTENTE NO PUEDE ENTRAR EN LA COPIA ESTÁTICA.
 *
 * `app/api/asistente` es un handler POST, y `output: 'export'` no los admite:
 * el build entero revienta. Ese endpoint es para el despliegue de Vercel —la
 * página estática de Hostinger usa el cerebro local y no lo necesita.
 *
 * Así que se APARTA la carpeta durante la exportación y se restaura SIEMPRE,
 * salga bien o mal el build (de ahí el try/finally). El nombre del refugio
 * empieza por punto para que ningún glob de despliegue lo arrastre.
 *
 * Si el build muere a mitad y este proceso también, la carpeta queda en
 * `.api-apartada-durante-export/` — moverla de vuelta a `app/api` a mano.
 */
import { renameSync, existsSync as hay } from 'node:fs'
const carpetaApi = resolve(raiz, 'app', 'api')
const refugioApi = resolve(raiz, '.api-apartada-durante-export')
const hayApi = hay(carpetaApi)

console.log('→ construyendo la copia estática (EXPORTAR_ESTATICO=1)…')
if (hayApi) {
  console.log('   apartando app/api (los handlers POST no existen en la copia estática)…')
  renameSync(carpetaApi, refugioApi)
}
let build
try {
  build = spawnSync('npx', ['next', 'build'], {
    cwd: raiz,
    env: entorno,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
} finally {
  if (hayApi) {
    renameSync(refugioApi, carpetaApi)
    console.log('   app/api restaurada.')
  }
}
if (build.status !== 0) process.exit(build.status ?? 1)

console.log('\n→ reponiendo las cabeceras de seguridad en .htaccess…')
const htaccess = spawnSync('node', [resolve(aqui, 'generar-htaccess.mjs')], {
  cwd: raiz,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
process.exit(htaccess.status ?? 1)
