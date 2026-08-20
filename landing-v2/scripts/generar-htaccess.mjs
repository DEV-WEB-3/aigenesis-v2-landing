#!/usr/bin/env node
/**
 * GENERA EL `.htaccess` DE LA COPIA ESTÁTICA — desde `next.config.js`.
 *
 * POR QUÉ EXISTE. Vercel sirve este sitio con el servidor de Next, y ahí las
 * cabeceras de seguridad las pone `headers()`. En una exportación estática ese
 * bloque NO se aplica: Next lo avisa por consola y sigue. O sea que la copia
 * subida a un hosting clásico se queda, en silencio, sin X-Frame-Options, sin
 * nosniff, sin HSTS y sin CSP — y nada en el build lo delata.
 *
 * POR QUÉ SE GENERA Y NO SE ESCRIBE A MANO. Un `.htaccess` copiado a mano es una
 * SEGUNDA fuente de las mismas reglas. El día que alguien afine la CSP en
 * `next.config.js` —y se afinará: hoy va en modo informe y está previsto pasarla
 * a bloqueante— la copia de Hostinger seguiría con la vieja sin que nadie lo
 * note. Aquí se leen las cabeceras REALES llamando a `headers()` del propio
 * config, así que sólo hay una fuente y no pueden discrepar.
 *
 * Uso:  node scripts/generar-htaccess.mjs [carpeta]     (por defecto `out`)
 *
 * Hostinger sirve con LiteSpeed, que lee `.htaccess` con la sintaxis de Apache.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const destino = resolve(raiz, process.argv[2] ?? 'out')

if (!existsSync(destino)) {
  console.error(`No existe ${destino}. Ejecuta antes:  EXPORTAR_ESTATICO=1 npm run build`)
  process.exit(1)
}

const require = createRequire(import.meta.url)
const config = require(resolve(raiz, 'next.config.js'))

const bloques = await config.headers()
const cabeceras = bloques.flatMap((b) => b.headers)

if (!cabeceras.length) {
  console.error('`headers()` no devolvió ninguna cabecera. Algo cambió en next.config.js.')
  process.exit(1)
}

/* `Header always set` y no `Header set`: sin `always` la cabecera no se añade en
   respuestas de error (404, 500), que son exactamente las que un atacante busca
   provocar. */
const lineas = cabeceras.map(
  (h) => `  Header always set ${h.key} "${String(h.value).replace(/"/g, '\\"').replace(/\s+/g, ' ').trim()}"`
)

const contenido = `# ARCHIVO GENERADO — no editar a mano.
# Lo produce  node scripts/generar-htaccess.mjs  leyendo las cabeceras reales de
# next.config.js. Si hay que cambiar una cabecera, se cambia allí y se vuelve a
# generar: escribirla aquí crea una segunda verdad que un día dirá otra cosa.
#
# Generado a partir de ${cabeceras.length} cabeceras declaradas en \`headers()\`.

<IfModule mod_headers.c>
${lineas.join('\n')}
</IfModule>

# ── URLs sin .html ──────────────────────────────────────────────────────
# La exportación se hace con \`trailingSlash: true\`, así que cada ruta es una
# carpeta con su \`index.html\`. Apache/LiteSpeed lo resuelven solos con
# ── LA LÍNEA QUE HACE LA MIGRACIÓN — NO QUITAR ─────────────────────────
# En public_html convive el index.php del WordPress antiguo. Sin esta línea,
# el servidor lo prefiere y la portada vuelve a ser el WP viejo AUNQUE
# index.html esté recién subido — pasó el 20-ago-2026: el despliegue pisó el
# .htaccess con uno generado sin ella y el dominio retrocedió en silencio.
# Este generador es la única fuente del .htaccess, así que la línea vive AQUÍ.
DirectoryIndex index.html index.php

# ErrorDocument asegura el 404 propio del sitio en vez del del servidor, que
# es una pantalla blanca ajena a la marca.
ErrorDocument 404 /404.html

# ── Compresión ──────────────────────────────────────────────────────────
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# ── Caché ───────────────────────────────────────────────────────────────
# Los archivos de \`_next/static\` llevan una huella en el nombre: si cambia el
# contenido, cambia la URL. Por eso pueden cachearse un año sin riesgo de servir
# una versión vieja. El HTML NO: es lo que apunta a esas huellas.
<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch "\\.(js|css|woff2|png|jpg|jpeg|webp|avif|svg)$">
    ExpiresDefault "access plus 1 year"
    Header always set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    ExpiresDefault "access plus 0 seconds"
    Header always set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>
`

writeFileSync(resolve(destino, '.htaccess'), contenido, 'utf8')
console.log(`.htaccess escrito en ${destino} con ${cabeceras.length} cabeceras:`)
for (const h of cabeceras) console.log('  ·', h.key)
