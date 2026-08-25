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
/**
 * IMPRIMIR EL FALLO ENTERO, NO SU PRIMERA LÍNEA.
 *
 * Aquí había `String(e.message).split('\n')[0]`, puesto para que el diff
 * automático de `assert` no llenara la pantalla. El precio se cobró hoy: la
 * guarda de mezcla de alfabetos detectó la palabra mala y el informe imprimió
 * «palabras que mezclan alfabetos:» seguido de NADA — el titular del mensaje sin
 * la lista, que es justamente el dato. Tuve que reconstruir el detector en un
 * script aparte para saber cuál era la palabra.
 *
 * Un informe que dice que algo falló pero no dice qué obliga a rehacer el
 * trabajo del instrumento a mano. Ahora se imprime el mensaje completo, con un
 * tope: los `assert` SIN mensaje propio traen el diff de node detrás, y ése sí
 * conviene recortar.
 */
const detallar = (e) => {
  const lineas = String(e.message).split('\n')
  const cortadas = lineas.length > 14
  return (
    lineas
      .slice(0, 14)
      .map((l) => '       ' + l)
      .join('\n') + (cortadas ? `\n       … y ${lineas.length - 14} línea(s) más` : '')
  )
}

const comprobar = (titulo, fn) => {
  try {
    fn()
    console.log('  ok   ' + titulo)
  } catch (e) {
    fallos.push(titulo)
    console.log('  FALL ' + titulo)
    console.log(detallar(e))
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

comprobar('ninguna traducción tiene caracteres de un alfabeto ajeno', () => {
  /*
   * EL FALLO QUE ESTO ATRAPA, Y ME PASÓ.
   *
   * Escribiendo la respuesta rusa de «¿cuánto AIG me van a cobrar?» se me coló
   * un ideograma chino en medio de una frase cirílica: «от单 итога». Compilaba,
   * el diccionario estaba completo, las once casillas llenas, y ninguna
   * comprobación lo veía. Sólo lo habría notado alguien que lee ruso.
   *
   * La forma de detectarlo sin saber los once idiomas es preguntar por el
   * alfabeto: una frase en ruso no puede llevar un ideograma CJK, ni una en
   * árabe puede llevar cirílico. Se comprueban los bloques que NO deberían
   * aparecer nunca en ninguna de las once lenguas del diccionario.
   */
  const D = require_(join(salida, 'diccionario.js'))
  const tabla = Object.assign({}, ...Object.values(D).filter((v) => v && typeof v === 'object'))
  /* CJK, hangul, hiragana y katakana: ninguno de los once idiomas los usa. */
  const AJENO = /[぀-ヿ㐀-䶿一-鿿가-힯]/
  const sucias = []
  for (const [clave, fila] of Object.entries(tabla)) {
    if (!fila || typeof fila !== 'object') continue
    for (const [idioma, texto] of Object.entries(fila)) {
      if (typeof texto !== 'string') continue
      const m = texto.match(AJENO)
      if (m) sucias.push(`${idioma} «${m[0]}» en: ${clave.slice(0, 40)}`)
    }
  }
  assert.deepEqual(sucias, [], 'caracteres de otro alfabeto:\n   ' + sucias.join('\n   '))
  /* Control de instrumento: el detector tiene que morder de verdad. */
  assert.match('от单 итога', AJENO, 'control: el detector de alfabetos ajenos no muerde')
  assert.doesNotMatch('от общей суммы', AJENO, 'control: el detector marca el ruso legítimo')
})

comprobar('ninguna palabra mezcla cirílico con latín', () => {
  /*
   * EL SEGUNDO FALLO DEL MISMO TIPO, y el anterior no lo veía.
   *
   * Escribí «закașало» en serbio: una `ș` rumana (latina, con coma abajo) dentro
   * de una palabra cirílica. La comprobación de arriba no la vio porque sólo
   * buscaba CJK — y esto es alfabeto latino, que en un diccionario de once
   * idiomas es perfectamente legítimo... salvo DENTRO de una palabra cirílica.
   *
   * Ésta es la trampa de verdad: los teclados y los correctores meten letras
   * latinas de aspecto idéntico —`а`/`a`, `е`/`e`, `о`/`o`, `с`/`c`— y la
   * palabra queda visualmente perfecta y textualmente rota. Nadie la encuentra
   * leyendo; sólo falla al buscar.
   *
   * Se comprueban sólo el ruso y el serbio, que son los dos idiomas cirílicos
   * del diccionario. Se permiten palabras enteramente latinas —los nombres
   * propios como `MetaMask` o `AiG` no se traducen— y se marca únicamente la
   * MEZCLA dentro de una misma palabra.
   */
  const D = require_(join(salida, 'diccionario.js'))
  const tabla = Object.assign({}, ...Object.values(D).filter((v) => v && typeof v === 'object'))
  const mezcladas = []
  for (const [clave, fila] of Object.entries(tabla)) {
    if (!fila || typeof fila !== 'object') continue
    for (const idioma of ['ru', 'sr']) {
      const texto = fila[idioma]
      if (typeof texto !== 'string') continue
      for (const palabra of texto.split(/[\s.,;:!?()«»"'—–\-/]+/)) {
        if (!palabra) continue
        const cir = /[Ѐ-ӿ]/.test(palabra)
        const lat = /[A-Za-zÀ-ÖØ-öø-ÿĀ-ſ]/.test(palabra)
        if (cir && lat) mezcladas.push(`${idioma} «${palabra}» en: ${clave.slice(0, 36)}`)
      }
    }
  }
  assert.deepEqual(mezcladas, [], 'palabras que mezclan alfabetos:\n   ' + mezcladas.join('\n   '))
  /* Control de instrumento sobre el caso real que lo motivó. */
  const mezcla = (p) => /[Ѐ-ӿ]/.test(p) && /[A-Za-zÀ-ÖØ-öø-ÿĀ-ſ]/.test(p)
  assert.ok(mezcla('закașало'), 'control: el detector de mezcla no muerde')
  assert.ok(!mezcla('пошло'), 'control: marca cirílico limpio')
  assert.ok(!mezcla('MetaMask'), 'control: marca un nombre propio latino')
})

comprobar('el serbio no usa letras que sólo existen en ruso', () => {
  /*
   * LA TERCERA VEZ QUE EL SERBIO SE ME CONTAMINA — y las dos guardas anteriores
   * no podían verla.
   *
   * El detector de alfabeto ajeno mira bloques Unicode: ruso y serbio están los
   * dos en cirílico, así que para él son el mismo. El detector de mezcla busca
   * cirílico junto a latín dentro de una palabra: escribí `помериш` como
   * `померишь` — todo cirílico, ninguna mezcla, verde.
   *
   * Lo que separa a los dos idiomas no es el bloque, es el INVENTARIO. El
   * alfabeto serbio tiene exactamente 30 letras y NO incluye ninguna de éstas:
   *
   *     ё  й  щ  ъ  ы  ь  э  ю  я
   *
   * Cualquiera de ellas en una fila `sr` es ruso filtrándose, no una variante
   * ortográfica: el serbio escribe њ donde el ruso escribe нь, ј donde escribe
   * й, y ја donde escribe я. No hay palabra serbia correcta que las lleve.
   *
   * Lo mismo al revés no sirve como guarda: el ruso no tiene ђ ћ љ њ џ ј, pero
   * ésas son letras raras que no aparecen por error de tecleo desde el español.
   * La contaminación siempre va en la dirección del idioma que más he escrito.
   */
  const SOLO_RUSAS = /[ёйщъыьэЁЙЩЪЫЬЭюяЮЯ]/
  const D = require_(join(salida, 'diccionario.js'))
  const tabla = Object.assign({}, ...Object.values(D).filter((v) => v && typeof v === 'object'))
  const contaminadas = []
  for (const [clave, fila] of Object.entries(tabla)) {
    if (!fila || typeof fila !== 'object' || typeof fila.sr !== 'string') continue
    for (const palabra of fila.sr.split(/[\s.,;:!?()«»"'—–\-/]+/)) {
      if (palabra && SOLO_RUSAS.test(palabra)) {
        contaminadas.push(`«${palabra}» en: ${clave.slice(0, 44)}`)
      }
    }
  }
  assert.deepEqual(
    contaminadas,
    [],
    'serbio con letras que sólo existen en ruso:\n   ' + contaminadas.join('\n   '),
  )
  /* Control de instrumento: el caso real de hoy y dos que NO deben morder. */
  assert.ok(SOLO_RUSAS.test('померишь'), 'control: no detecta el signo blando ruso')
  assert.ok(SOLO_RUSAS.test('который'), 'control: no detecta la и breve rusa')
  assert.ok(!SOLO_RUSAS.test('помериш'), 'control: marca serbio correcto')
  assert.ok(!SOLO_RUSAS.test('њихов'), 'control: marca una letra propia del serbio')
})

console.log('')
if (fallos.length) {
  console.error('idioma: ' + fallos.length + ' comprobación(es) fallaron')
  process.exit(1)
}
console.log('idioma: la web G1 cambia de idioma de verdad')
