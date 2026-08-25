#!/usr/bin/env node
/**
 * PRUEBA QUE LA WEB DE G1 CAMBIA DE VERDAD AL CAMBIAR DE IDIOMA.
 *
 * POR QUÉ NO BASTA CON LAS OTRAS DOS COMPROBACIONES
 * -------------------------------------------------
 * `verify:i18n` dice que el diccionario está completo. `verify:i18n:g1` dice que
 * ningún texto visible se salta el sistema. Las dos pueden estar en verde y la
 * pantalla seguir en español: bastaría con que `useCorpus` devolviera siempre la
 * clave, o con que alguien rellenara la casilla del ruso pegando el español.
 *
 * El detector honesto es comparar la MISMA pantalla en dos alfabetos. Si el ruso
 * y el español producen el mismo HTML, no hay traducción por muy lleno que esté
 * el diccionario.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const salida = resolve(raiz, 'node_modules', '.cache', 'idioma-prueba')
const require_ = createRequire(pathToFileURL(join(raiz, 'package.json')))
const ts = require_('typescript')

rmSync(salida, { recursive: true, force: true })
mkdirSync(salida, { recursive: true })

function compilar(rutaRel, nombre, alias = {}) {
  const codigo = readFileSync(resolve(raiz, rutaRel), 'utf8')
  const { outputText } = ts.transpileModule(codigo, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  })
  let js = outputText
  for (const [de, a] of Object.entries(alias)) {
    js = js.split("'" + de + "'").join("'" + a + "'")
    js = js.split('"' + de + '"').join('"' + a + '"')
  }
  writeFileSync(join(salida, nombre), js, 'utf8')
  return join(salida, nombre)
}

/* El diccionario REAL — no un stub. Es lo único que demuestra que la traducción
   llega de verdad. El del whitepaper se registra sobre éste en ejecución y no
   aporta claves a la web G1, así que se deja fuera. */
compilar('lib/i18n/diccionario.ts', 'diccionario.js')

/** El contexto de idioma, fijado a un idioma y montado sobre el diccionario real. */
function stubIdioma(idioma) {
  writeFileSync(
    join(salida, 'stub-' + idioma + '.js'),
    [
      "const D = require('./diccionario.js')",
      "const tabla = Object.assign({}, ...Object.values(D).filter((v) => v && typeof v === 'object'))",
      "const t = (s) => (tabla[s] && tabla[s]['" + idioma + "']) || s",
      "exports.useIdioma = () => ({ t, idioma: '" + idioma + "', rtl: " + (idioma === 'ar') + ", cambiar() {} })",
      'exports.useT = () => t',
      '',
    ].join('\n'),
    'utf8'
  )
  return './stub-' + idioma
}

const React = require_('react')
const { renderToStaticMarkup } = require_('react-dom/server')

const fallos = []
const comprobar = (titulo, fn) => {
  try {
    fn()
    console.log('  ok   ' + titulo)
  } catch (e) {
    fallos.push(titulo)
    console.log('  FALL ' + titulo)
    console.log('       ' + String(e.message).split('\n')[0])
  }
}

console.log('\nLA PANTALLA CAMBIA DE ALFABETO\n')

/*
 * SE MONTA UN SOLO COMPONENTE, Y BASTA PARA LA CAPA DE COMPONENTE.
 *
 * Montar `G1Footer` o `EcosistemaContent` obligaría a compilar su árbol entero
 * de dependencias —`SectionReveal`, `G1Aurora`, `ProductCard`, los tokens— y no
 * probaría nada más: lo que hay que demostrar es que la cadena diccionario →
 * useCorpus → JSX funciona, y un componente lo demuestra igual que cuatro.
 *
 * La cobertura ancha viene de la última comprobación, que barre TODAS las claves.
 */
const pintar = (idioma) => {
  const stub = stubIdioma(idioma)
  compilar('hooks/useCorpus.tsx', 'useCorpus-' + idioma + '.js', {
    '@/context/IdiomaContext': stub,
  })
  const mod = compilar('components/g1/DisclaimerBar.tsx', 'DisclaimerBar-' + idioma + '.js', {
    '@/context/IdiomaContext': stub,
    '@/hooks/useCorpus': './useCorpus-' + idioma,
  })
  return renderToStaticMarkup(React.createElement(require_(mod).DisclaimerBar))
}

const CIRILICO = /[\u0400-\u04FF]{4,}/
const ARABE = /[\u0600-\u06FF]{4,}/

comprobar('el descargo se pinta distinto en ruso que en español', () => {
  const es = pintar('es')
  const ru = pintar('ru')
  assert.notEqual(es, ru, 'el ruso y el español producen el MISMO html')
  assert.match(ru, CIRILICO, 'el ruso no trae ni una palabra en cirílico')
  assert.match(ru, /lang="ru"/, 'no declaró el idioma del texto')
})

comprobar('el árabe sale en árabe y se declara', () => {
  const ar = pintar('ar')
  assert.match(ar, ARABE, 'el descargo no salió en árabe')
  assert.match(ar, /lang="ar"/, 'no declaró el idioma del texto')
})

comprobar('sin traducción, el texto se declara como español', () => {
  /* La otra mitad de la honestidad: cuando NO hay traducción, `lang` tiene que
     decir `es`. Un lector de pantalla en ruso leyendo español sin marcar no se
     entiende. Se usa una clave que a propósito no está en el diccionario. */
  const stub = stubIdioma('ru')
  const mod = compilar('hooks/useCorpus.tsx', 'useCorpus-solo.js', {
    '@/context/IdiomaContext': stub,
  })
  const { useCorpus } = require_(mod)
  let visto = null
  const Sonda = () => {
    visto = useCorpus()('esta frase no existe en el diccionario, a propósito')
    return null
  }
  renderToStaticMarkup(React.createElement(Sonda))
  assert.equal(visto.lang, 'es', 'un texto sin traducir no se declaró como español')
  assert.equal(visto.sinTraducir, true)
})

comprobar('todas las claves de G1 traducen de verdad, no son copias', () => {
  /*
   * EL FALLO QUE ESTO ATRAPA: rellenar la casilla del ruso pegando el español
   * «para completarla». `verify:i18n` lo da por bueno —la entrada está llena— y
   * la pantalla sigue en español. Aquí se exige que el resultado sea DISTINTO.
   *
   * Los nombres propios no entran: «Tag Markets» es igual en los once idiomas y
   * debe serlo. Como no tienen entrada en el diccionario, se saltan solos.
   */
  const D = require_(join(salida, 'diccionario.js'))
  const tabla = Object.assign({}, ...Object.values(D).filter((v) => v && typeof v === 'object'))

  const usadas = new Set()
  for (const base of ['components/g1', 'app/g1']) {
    const pila = [resolve(raiz, base)]
    while (pila.length) {
      const d = pila.pop()
      for (const n of readdirSync(d, { withFileTypes: true })) {
        const ruta = join(d, n.name)
        if (n.isDirectory()) pila.push(ruta)
        else if (/\.tsx?$/.test(n.name)) {
          const src = readFileSync(ruta, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ')
          for (const m of src.matchAll(/\b(?:c|t)\(\s*'([^'\\]{6,})'\s*\)/g)) usadas.add(m[1])
        }
      }
    }
  }
  assert.ok(usadas.size > 40, 'sólo se hallaron ' + usadas.size + ' claves en uso: ¿cambió la forma?')

  const malas = []
  let conTraduccion = 0
  for (const k of usadas) {
    const fila = tabla[k]
    if (!fila) continue
    conTraduccion++
    for (const idioma of ['ru', 'ar']) {
      if (!fila[idioma]) malas.push('falta ' + idioma + ': ' + k.slice(0, 44))
      else if (fila[idioma] === k) malas.push(idioma + ' es copia del español: ' + k.slice(0, 44))
    }
  }
  assert.deepEqual(malas, [], 'traducciones que no traducen:\n   ' + malas.join('\n   '))
  console.log(
    '       ' + conTraduccion + ' de ' + usadas.size + ' claves con traducción, comprobadas en ruso y árabe'
  )
})

console.log('')
if (fallos.length) {
  console.error('idioma: ' + fallos.length + ' comprobación(es) fallaron')
  process.exit(1)
}
console.log('idioma: la web G1 cambia de idioma de verdad')
