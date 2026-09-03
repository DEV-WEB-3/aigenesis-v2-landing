/**
 * EL PUENTE `?lang=` SE PRUEBA, NO SE SUPONE.
 *
 * localStorage no cruza orígenes: cuando la oficina manda a alguien acá con
 * `?lang=ko`, ese parámetro es lo único que trae su idioma — y los CTA al
 * ibportal son el viaje de vuelta. Esta guarda prueba las dos direcciones
 * sobre el módulo REAL (`lib/i18n/idiomas.ts`, transpilado, no re-escrito) y
 * después muerde: una URL inválida no puede colarse, y el contexto tiene que
 * consultar la URL ANTES que lo guardado.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const require_ = createRequire(pathToFileURL(join(raiz, 'package.json')))

/* Transpilar el módulo real a CJS en caché — el instrumento apunta al código
   que corre en la página, no a una copia escrita en esta prueba. */
const ts = require_('typescript')
const fuente = readFileSync(join(raiz, 'lib', 'i18n', 'idiomas.ts'), 'utf8')
/* El módulo importa PRESS_V5 sólo para la lista de idiomas; se inyecta el real. */
const fuentePress = readFileSync(join(raiz, 'lib', 'official-links.ts'), 'utf8')
const cache = join(raiz, 'node_modules', '.cache', 'puente-lang')
mkdirSync(cache, { recursive: true })
const transpilar = (src) =>
  ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
const fuenteRuta = readFileSync(join(raiz, 'lib', 'rutaPublica.ts'), 'utf8')
writeFileSync(join(cache, 'rutaPublica.js'), transpilar(fuenteRuta))
writeFileSync(
  join(cache, 'official-links.js'),
  transpilar(fuentePress.replace('@/lib/rutaPublica', './rutaPublica.js')),
)
writeFileSync(
  join(cache, 'idiomas.js'),
  transpilar(fuente.replace("@/lib/official-links", './official-links.js')),
)
const { idiomaDeBusqueda, urlConIdioma } = require_(join(cache, 'idiomas.js'))

/* — ida: la URL trae el idioma — */
assert.equal(idiomaDeBusqueda('?lang=ko'), 'ko', 'lang=ko debe leerse')
assert.equal(idiomaDeBusqueda('?idioma=ru'), 'ru', 'idioma= es alias')
assert.equal(idiomaDeBusqueda('?hl=ar'), 'ar', 'hl= es alias')
assert.equal(idiomaDeBusqueda('?otra=1&lang=sr'), 'sr', 'convive con otros parámetros')

/* — mordidas de la ida: lo inválido NO pasa — */
assert.equal(idiomaDeBusqueda('?lang=xx'), null, 'un código inexistente no entra')
assert.equal(idiomaDeBusqueda('?lang='), null, 'vacío no entra')
assert.equal(idiomaDeBusqueda(''), null, 'sin parámetros no entra')

/* — vuelta: los CTA llevan el idioma — */
assert.equal(urlConIdioma('https://genesis.ibportal.io', 'ko'), 'https://genesis.ibportal.io/?lang=ko')
assert.ok(
  urlConIdioma('https://genesis.ibportal.io/auth/register?e=abc&a=1', 'ru').includes('lang=ru'),
  'con query previa, lang se suma sin romperla',
)
assert.ok(urlConIdioma('https://genesis.ibportal.io/auth/register?e=abc&a=1', 'ru').includes('e=abc'))

/* — el contexto consulta la URL ANTES que lo guardado (fuente, no fe) — */
const ctx = readFileSync(join(raiz, 'context', 'IdiomaContext.tsx'), 'utf8')
const posUrl = ctx.indexOf('idiomaDeBusqueda(')
const posGuardado = ctx.indexOf('localStorage.getItem(CLAVE)')
assert.ok(posUrl > -1, 'el contexto debe llamar a idiomaDeBusqueda')
assert.ok(posGuardado > -1, 'el contexto debe seguir leyendo lo guardado como respaldo')
assert.ok(posUrl < posGuardado, 'la URL manda: debe consultarse ANTES que localStorage')

/* — los CTA del header/footer no vuelven a quedarse sin idioma — */
for (const rel of ['components/g1/site/G1Header.tsx', 'components/g1/site/G1Footer.tsx']) {
  const src = readFileSync(join(raiz, rel), 'utf8')
  assert.ok(src.includes('urlConIdioma('), `${rel}: los CTA salientes deben pasar por urlConIdioma`)
  assert.ok(
    !/href=\{(IBO_URL|REGISTER_URL)\}/.test(src),
    `${rel}: ningún href puede usar la constante pelada (sin idioma)`,
  )
}

console.log('puente ?lang=: ida, vuelta, precedencia y mordidas — todo muerde y todo pasa')
