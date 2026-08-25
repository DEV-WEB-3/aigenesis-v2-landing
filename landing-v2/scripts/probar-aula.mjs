#!/usr/bin/env node
/**
 * PRUEBA DEL AULA — y la primera de esta SPA que MONTA un componente.
 *
 * POR QUÉ ESO IMPORTA
 * -------------------
 * Aquí no había una sola prueba que pintara un componente: todas importan
 * módulos y comprueban datos. Con eso, un panel que revienta al renderizarse
 * —un `undefined.map`, un hook mal puesto— pasa por delante de todas ellas y
 * sólo lo descubre quien abre el navegador.
 *
 * `FichaEdicion` es exactamente el tipo de componente donde eso pasa: lee un
 * diccionario por clave de idioma, y la mitad de las claves están vacías a
 * propósito. Comprobar que los DATOS son correctos no dice nada sobre si el
 * componente sobrevive a leerlos.
 *
 * QUÉ SE COMPRUEBA
 * ----------------
 *   1. El cortacircuitos: con `publicado: false` no sale ni una URL de video.
 *   2. Ningún enlace inventado: hoy no hay ni un solo `video` distinto de null.
 *   3. El componente se PINTA en los dos estados que importan: con material y sin él.
 *   4. Un idioma sin material se enseña apagado, no se oculta.
 *   5. El peso del PDF sale medido y no se duplica respecto a `PRESS_V5`.
 *   6. Control de instrumento: el asistente sigue montado en la web G1 y sigue
 *      usando esta ficha. Sin esto, la prueba seguiría verde el día que alguien
 *      desconecte el componente — que es el fallo que no avisa.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const salida = resolve(raiz, 'node_modules', '.cache', 'aula-prueba')
const require_ = createRequire(pathToFileURL(join(raiz, 'package.json')))
const ts = require_('typescript')

rmSync(salida, { recursive: true, force: true })
mkdirSync(salida, { recursive: true })

/**
 * Transpila un archivo del proyecto y reescribe los alias `@/…` a los módulos ya
 * compilados aquí al lado. Sin esto, `require('@/lib/…')` no resuelve fuera de
 * Next, que es quien normalmente traduce el alias.
 */
function compilar(rutaRelativa, nombreSalida, alias = {}) {
  const codigo = readFileSync(resolve(raiz, rutaRelativa), 'utf8')
  const { outputText } = ts.transpileModule(codigo, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      /* `ReactJSX`, no `React`: el emisor clásico produce `React.createElement`
         sin importar React, y el módulo compilado revienta con «React is not
         defined» aunque el componente esté perfecto. */
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  })
  let js = outputText
  for (const [de, a] of Object.entries(alias)) {
    js = js.split(`"${de}"`).join(`"${a}"`).split(`'${de}'`).join(`'${a}'`)
  }
  writeFileSync(join(salida, nombreSalida), js, 'utf8')
  return join(salida, nombreSalida)
}

/* El contexto de idioma, sustituido por lo mínimo: `t` devuelve el español tal
   cual. La prueba mira la ESTRUCTURA que se pinta, no la traducción — de eso ya
   se ocupa `verify:i18n`. */
writeFileSync(
  join(salida, 'stub-idioma.js'),
  `exports.useIdioma = () => ({ t: (s) => s, idioma: 'es', rtl: false, cambiar() {} })
   exports.useT = () => (s) => s\n`,
  'utf8'
)

compilar('lib/rutaPublica.ts', 'rutaPublica.js')
compilar('lib/official-links.ts', 'official-links.js', { '@/lib/rutaPublica': './rutaPublica' })
const modEdiciones = compilar('lib/soporte/ediciones.ts', 'ediciones.js', {
  '@/lib/official-links': './official-links',
})
/* `useCorpus` se compila también: la ficha traduce por él desde que el corpus
   del asistente dejó de estar fijo en español. */
compilar('hooks/useCorpus.tsx', 'useCorpus.js', { '@/context/IdiomaContext': './stub-idioma' })
const modFicha = compilar('components/soporte/FichaEdicion.tsx', 'FichaEdicion.js', {
  '@/context/IdiomaContext': './stub-idioma',
  '@/hooks/useCorpus': './useCorpus',
  '@/lib/soporte/ediciones': './ediciones',
})

const E = require_(modEdiciones)
const React = require_('react')
const { renderToStaticMarkup } = require_('react-dom/server')
const FichaEdicion = require_(modFicha).default

/**
 * UN SEGUNDO MUNDO, CON LA VIDEOTECA ENCENDIDA.
 *
 * Hoy `publicado` es `false`, así que TODAS las fichas se pintan igual: sin
 * reproductor. Con eso, una prueba que dice «la ficha sin material lo avisa» pasa
 * aunque el material esté declarado — está midiendo el interruptor general, no el
 * caso. Es un cero sin medir: todo sale vacío y no se distingue por qué.
 *
 * Así que se compila una segunda copia del módulo con el interruptor al revés y
 * una ficha que lee de ella. Cuesta cuatro líneas y permite comprobar los dos
 * mundos: el de hoy y el que se va a publicar. Sin esto, el día del despliegue no
 * habría ni una prueba sobre el estado que de verdad ve la gente.
 */
const fuenteEd = readFileSync(join(salida, 'ediciones.js'), 'utf8')
assert.match(fuenteEd, /publicado: true/, 'control: cambió la forma del interruptor, rehacer esto')
writeFileSync(
  join(salida, 'ediciones-off.js'),
  fuenteEd.replace('publicado: true', 'publicado: false'),
  'utf8'
)
writeFileSync(
  join(salida, 'FichaEdicion-off.js'),
  readFileSync(join(salida, 'FichaEdicion.js'), 'utf8').split('./ediciones').join('./ediciones-off'),
  'utf8'
)
const EOff = require_(join(salida, 'ediciones-off.js'))
const FichaOff = require_(join(salida, 'FichaEdicion-off.js')).default
/* Desde que está publicado, el mundo por defecto es el ENCENDIDO. Los alias se
   dejan para no reescribir cada llamada, y para que se lea qué mundo mira cada
   comprobación. */
const EOn = E
const FichaOn = FichaEdicion

const fallos = []
const comprobar = (titulo, fn) => {
  try {
    fn()
    console.log(`  ok   ${titulo}`)
  } catch (e) {
    fallos.push({ titulo, error: e.message })
    console.log(`  FALL ${titulo}`)
    console.log(`       ${String(e.message).split('\n')[0]}`)
  }
}

/* El corpus, para comprobar que los sugeridos existen y cómo están redactados. */
compilar('lib/soporte/tipos.ts', 'tipos.js')
const PREGUNTAS = (() => {
  const mods = readdirSync(resolve(raiz, 'lib/soporte')).filter((n) => n.startsWith('preguntas-'))
  const todas = []
  for (const n of mods) {
    const js = compilar(`lib/soporte/${n}`, n.replace(/\.ts$/, '.js'), {
      '@/lib/soporte/tipos': './tipos',
      './tipos': './tipos',
    })
    for (const v of Object.values(require_(js))) {
      if (Array.isArray(v)) for (const p of v) if (p?.id && p?.pregunta) todas.push(p)
    }
  }
  return todas
})()

const acceso = E.edicionPorId('edicion-acceso-cuenta')
const plan = E.edicionPorId('edicion-plan-de-negocio')
const pintar = (edicion, idioma) =>
  renderToStaticMarkup(React.createElement(FichaEdicion, { edicion, idioma, onIdioma() {} }))

/** Lo mismo, pero en el mundo con la videoteca ya publicada. */
const pintarOn = (id, idioma) =>
  renderToStaticMarkup(
    React.createElement(FichaOn, { edicion: EOn.edicionPorId(id), idioma, onIdioma() {} })
  )

console.log('\nDATOS\n')

comprobar('el cortacircuitos sigue existiendo y corta', () => {
  /* Esta prueba corre SIN `NEXT_PUBLIC_AULA_BASE`, que es como corre en CI. Si
     alguien la lanza con el desvío local puesto, mide otra cosa y hay que saberlo. */
  assert.ok(
    !process.env.NEXT_PUBLIC_AULA_BASE,
    'esta prueba mide la base de producción: quita NEXT_PUBLIC_AULA_BASE del entorno'
  )
  assert.equal(E.VIDEOTECA.publicado, true, 'la videoteca está apagada: nadie vería los videos')
  /* El interruptor ya no está en `false`, pero tiene que SEGUIR cortando: es lo
     único que impide publicar reproductores rotos el día que se suba una edición
     nueva antes que sus archivos. Se comprueba contra el mundo apagado. */
  for (const ed of EOff.EDICIONES) {
    for (const [l, pieza] of Object.entries(ed.piezas)) {
      assert.equal(EOff.urlDeVideo(pieza), null, `${ed.id}/${l} da URL con la videoteca apagada`)
    }
  }
})

comprobar('las URL de producción salen absolutas, versionadas y bajo el dominio', () => {
  /*
   * La versión NO es cosmética: sin ella la CDN sirve la copia que guardó con la
   * cabecera vieja y la protección anti-hotlink no se aplica. Si alguien la quita
   * pensando que sobra, esto lo para.
   */
  const u = E.urlDeVideo(E.edicionPorId('edicion-acceso-cuenta').piezas.es)
  assert.equal(u, 'https://aigenesis.io/media/aula/acceso-cuenta/es.mp4?v1')
  const p = E.urlDePoster(E.edicionPorId('edicion-acceso-cuenta').piezas.es)
  assert.equal(p, 'https://aigenesis.io/media/aula/acceso-cuenta/es.jpg?v1')
  for (const ed of E.EDICIONES) {
    for (const [l, pieza] of Object.entries(ed.piezas)) {
      const v = E.urlDeVideo(pieza)
      if (!v) continue
      assert.match(v, /^https:\/\/aigenesis\.io\/media\/aula\//, `${ed.id}/${l}: base equivocada`)
      assert.match(v, /\?v\d+$/, `${ed.id}/${l}: sin versión, la CDN serviría la copia vieja`)
    }
  }
})

comprobar('cada video declarado apunta a SU edición y SU idioma', () => {
  /*
   * Con seis entradas escritas a mano, el error probable no es inventarse un
   * archivo: es pegar `es.mp4` debajo de `en`. Eso no rompe nada —el reproductor
   * carga tan contento— y sirve el idioma equivocado a quien eligió el suyo. Un
   * fallo mudo, que sólo nota quien lo sufre.
   *
   * La ruta lleva la edición y el idioma dentro, así que se puede comprobar.
   */
  const carpeta = { 'edicion-acceso-cuenta': 'acceso-cuenta', 'edicion-plan-de-negocio': 'plan-de-negocio' }
  let declarados = 0
  for (const ed of E.EDICIONES) {
    for (const [l, pieza] of Object.entries(ed.piezas)) {
      if (!pieza.video) continue
      declarados++
      assert.equal(
        pieza.video,
        `${carpeta[ed.id]}/${l}.mp4`,
        `${ed.id}/${l} apunta a «${pieza.video}», que no es su archivo`
      )
      assert.ok(pieza.segundos > 0, `${ed.id}/${l} declara un video sin duración medida`)
    }
  }
  assert.equal(declarados, 6, `se esperaban 6 videos declarados y hay ${declarados}`)
})

comprobar('el PDF se deriva de PRESS_V5 y no se copia', () => {
  const { PRESS_V5 } = require_(join(salida, 'official-links.js'))
  for (const l of E.ORDEN_IDIOMAS) {
    assert.equal(plan.piezas[l].pdf, PRESS_V5[l].archivo, `el PDF de ${l} no coincide con la fuente única`)
    assert.equal(plan.piezas[l].mb, PRESS_V5[l].mb, `el peso de ${l} no coincide con la fuente única`)
  }
})

comprobar('duracionLegible no fabrica un 0:00 cuando no hay duración', () => {
  assert.equal(E.duracionLegible(null), null)
  assert.equal(E.duracionLegible(0), null)
  assert.equal(E.duracionLegible(192), '3:12')
  assert.equal(E.duracionLegible(65), '1:05')
})

comprobar('idiomaInicial nunca abre en un idioma vacío', () => {
  /* El croata tiene PDF pero no video: la ficha debe abrirse en croata igual,
     porque hay material que entregar. */
  assert.equal(E.idiomaInicial(plan, 'hr'), 'hr')
  /* El alemán no está en esta edición: cae al español, no a `undefined`. */
  assert.equal(E.idiomaInicial(plan, 'de'), 'es')
  /* La edición de acceso sólo declara español: cualquier idioma cae ahí. */
  assert.equal(E.idiomaInicial(acceso, 'ru'), 'es')
})

console.log('\nEL COMPONENTE SE PINTA\n')

comprobar('se pinta con material (plan/es) y enseña el peso medido', () => {
  const html = pintar(plan, 'es')
  assert.match(html, /2\.51 MB/, 'no salió el peso del PDF')
  assert.match(html, /AiGenesis_press_v5\.0_ES-es\.pdf/, 'no salió el enlace de descarga')
  assert.match(html, /oferta de inversión/, 'falta el aviso de riesgo en el plan de negocio')
})

comprobar('con la videoteca APAGADA no sale un reproductor roto', () => {
  /* El seguro: con el interruptor en `false` la ficha se comporta como si no
     hubiera material, aunque esté declarado. Es lo que impedirá publicar un
     reproductor apuntando a un archivo que todavía no se haya subido. */
  const off = EOff.edicionPorId('edicion-acceso-cuenta')
  assert.ok(off.piezas.es.video, 'control: acceso/es ya no declara video')
  const html = renderToStaticMarkup(
    React.createElement(FichaOff, { edicion: off, idioma: 'es', onIdioma() {} })
  )
  assert.match(html, /Todavía no hay edición en/, 'no avisa de que falta el material')
  assert.doesNotMatch(html, /<video/, 'pintó un reproductor con la videoteca apagada')
  assert.doesNotMatch(html, /oferta de inversión/, 'un tutorial de acceso no lleva aviso de riesgo')
})

comprobar('con la videoteca ENCENDIDA sale el reproductor, el póster y la duración', () => {
  const html = pintarOn('edicion-acceso-cuenta', 'es')
  assert.match(html, /<video/, 'no pintó el reproductor con la videoteca encendida')
  assert.match(html, /media\/aula\/acceso-cuenta\/es\.mp4/, 'el src no apunta al archivo')
  assert.match(html, /poster="[^"]*acceso-cuenta\/es\.jpg\?v\d+"/, 'falta el póster o su versión')
  assert.match(html, /preload="none"/, 'el video precargaría en cada apertura del panel')
  assert.match(html, /2:03/, 'no salió la duración medida')
  assert.doesNotMatch(html, /Todavía no hay edición/, 'dice que falta material y sí lo hay')
})

comprobar('un idioma sin material se enseña apagado, no se oculta', () => {
  /*
   * La cuenta se DERIVA de los datos, no se escribe a mano.
   *
   * Puse «7 apagados» a ojo y falló: la edición de acceso no tiene material en
   * NINGÚN idioma todavía, así que son 8. Un número escrito a mano habría que
   * corregirlo cada vez que suba un video, y el día que alguien lo corrija sin
   * mirar dejará de comprobar nada. La invariante de verdad es que la suma cierre:
   * todo idioma está, y está o encendido o apagado.
   */
  for (const ed of [acceso, plan]) {
    const html = pintar(ed, E.idiomaInicial(ed, 'es'))
    for (const l of E.ORDEN_IDIOMAS) {
      assert.match(html, new RegExp(`lang="${l}"`), `${ed.id}: el idioma ${l} desapareció del selector`)
    }
    const conMaterial = E.ORDEN_IDIOMAS.filter(
      (l) => ed.piezas[l]?.video ?? ed.piezas[l]?.pdf
    ).length
    const apagados = (html.match(/disabled=""/g) ?? []).length
    assert.equal(
      apagados + conMaterial,
      E.ORDEN_IDIOMAS.length,
      `${ed.id}: ${apagados} apagados + ${conMaterial} con material no suman ${E.ORDEN_IDIOMAS.length}`
    )
  }
  /* El estado de hoy, dicho en voz alta para que se vea cambiar. */
  assert.equal(E.idiomasConPdf(plan).length, 8, 'el plan debería tener 8 documentos')
  assert.equal(E.idiomasConVideo(plan).length, 3, 'el plan debería tener 3 videos')
  assert.equal(E.idiomasConVideo(acceso).length, 3, 'el tutorial debería tener 3 videos')
})

comprobar('un idioma con documento pero SIN video sigue entregando algo', () => {
  /*
   * EL CASO QUE JUSTIFICA TODO EL MODELO.
   *
   * El plan de negocio tiene video en 3 idiomas y documento en 8. El ruso, el
   * sueco, el croata y el árabe caen en medio: no hay video, sí hay PDF. Un modelo
   * que atara las dos cosas al mismo interruptor habría dejado esas cuatro fichas
   * inaccesibles —o peor, abiertas y vacías—. Aquí tienen que abrirse, decir que
   * no hay video, y ofrecer la descarga igual.
   */
  for (const l of ['ru', 'sv', 'hr', 'ar']) {
    assert.equal(plan.piezas[l].video, null, `control: ${l} ya tiene video, rehacer esta prueba`)
    /* En el mundo ENCENDIDO, que es donde esto se puede distinguir de verdad: con
       la videoteca apagada estas cuatro se ven igual que las tres que sí tienen
       video, y la prueba no probaría nada. */
    const html = pintarOn('edicion-plan-de-negocio', l)
    assert.match(html, /Todavía no hay edición en/, `${l}: no avisa de que falta el video`)
    assert.match(html, /_v5\.0_/, `${l}: perdió el enlace de descarga por no tener video`)
    assert.doesNotMatch(html, /<video/, `${l}: pintó un reproductor sin archivo`)
  }
  /* Y el contraste: el español, en la MISMA edición, sí trae reproductor. */
  assert.match(pintarOn('edicion-plan-de-negocio', 'es'), /<video/)
})

comprobar('el árabe se pinta de derecha a izquierda', () => {
  assert.match(pintar(plan, 'ar'), /dir="rtl"/, 'el árabe no declaró la dirección')
  assert.doesNotMatch(pintar(plan, 'es'), /dir="rtl"/, 'el español se declaró RTL')
})

console.log('\nCONTROL DE INSTRUMENTO — ¿sigue en el camino vivo?\n')

comprobar('la web G1 sigue montando el asistente', () => {
  const layout = readFileSync(resolve(raiz, 'app/g1/(site)/layout.tsx'), 'utf8')
  assert.match(layout, /<AsistenteFlotante/, 'el asistente ya no se monta en la web G1')
})

comprobar('lo primero que se ve NO es una avería', () => {
  /*
   * La regla: en las superficies de DESCUBRIMIENTO —la web pública y G1— ningún
   * sugerido puede estar redactado en primera persona de queja. Es lo primero que
   * lee alguien que acaba de llegar.
   *
   * NO se prohíben esas preguntas: siguen en el corpus, en el buscador y como
   * primeras en `/soporte`, que es donde se llama cuando algo falla. Lo que se
   * prohíbe es que sean la carta de presentación.
   *
   * Se detecta por la FORMA, no por una lista de ids: una lista habría que
   * mantenerla y el día que alguien añada una queja nueva no diría nada.
   */
  const QUEJA =
    /(no me |no ha |no puedo|no veo|no carga|no cuadra|no funciona|congel|reclam[éo]|se cay[óo]|olvid[ée]|error|falla|problema|por qué no|sigue sin|no llega)/i

  const superficies = [
    ['components/soporte/AsistenteFlotante.tsx', /const SUGERIDOS = \[([\s\S]*?)\]/],
    ['app/g1/(site)/layout.tsx', /sugeridos=\{\[([\s\S]*?)\]\}/],
  ]
  let revisados = 0
  for (const [ruta, patron] of superficies) {
    const bloque = readFileSync(resolve(raiz, ruta), 'utf8').match(patron)
    assert.ok(bloque, `${ruta}: no encontré la lista de sugeridos — ¿cambió la forma?`)
    const ids = [...bloque[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1])
    assert.ok(ids.length >= 4, `${ruta}: sólo ${ids.length} sugeridos`)
    for (const id of ids) {
      const p = PREGUNTAS.find((x) => x.id === id)
      assert.ok(p, `${ruta}: el sugerido «${id}» no existe en el corpus — saldría una fila vacía`)
      assert.doesNotMatch(
        p.pregunta,
        QUEJA,
        `${ruta}: «${p.pregunta}» es una avería y va de primera`
      )
      revisados++
    }
  }
  /* Control de instrumento: el detector tiene que morder de verdad. Si no,
     estaría dando el visto bueno a cualquier cosa. */
  assert.match('Reclamé y no ha llegado nada', QUEJA, 'control: el detector de quejas no muerde')
  assert.doesNotMatch('¿Qué es TAG o Tag Markets?', QUEJA, 'control: el detector marca las buenas')
  assert.equal(revisados, 9, `se esperaban 9 sugeridos entre las dos superficies y hay ${revisados}`)
})

comprobar('el modo ancho existe y NO aparece en móvil', () => {
  const f = readFileSync(resolve(raiz, 'components/soporte/AsistenteFlotante.tsx'), 'utf8')
  assert.match(f, /MEDIDAS\[ancho \? 'ancho' : 'normal'\]/, 'el panel ya no cambia de tamaño')
  assert.match(f, /sm:w-\[min\(680px/, 'cambió el ancho medido sin rehacer la medición')
  /* El botón entero va oculto por debajo de `sm`. Ahí el panel ya ocupa 366×768 y
     no hay adónde expandir: un botón que no hace nada visible es peor que ninguno. */
  const boton = f.slice(f.indexOf("aria-pressed={ancho}") - 400, f.indexOf('aria-pressed={ancho}') + 700)
  assert.match(boton, /hidden[^"]*sm:block/, 'el botón de ampliar se ve en móvil, donde no sirve')
})

comprobar('la consola respira, y la voz del video llega al aliento', () => {
  const f = readFileSync(resolve(raiz, 'components/soporte/AsistenteFlotante.tsx'), 'utf8')
  const g = readFileSync(resolve(raiz, 'components/soporte/FichaEdicion.tsx'), 'utf8')
  assert.match(f, /useAliento\(abierto\)/, 'el asistente ya no respira')
  assert.match(f, /--g-aliento/, 'el borde del panel no lee el aliento')
  assert.match(f, /ALIENTO_BOTON/, 'el botón flotante no respira')
  assert.match(g, /onVoz\?\.escuchar\(/, 'el video ya no alimenta el aliento')
  /* Las tres salidas: pausa, fin y cambio de idioma. Si falta una, la consola se
     queda «hablando» sobre una pantalla quieta. */
  const callares = (g.match(/onVoz\?\.callar\(\)/g) ?? []).length
  assert.ok(callares >= 3, `sólo hay ${callares} salidas del modo hablando, se esperaban 3`)
  /* Sin `crossOrigin` el analizador devuelve silencio Y el video no carga en
     producción, donde los archivos vienen de otro origen. */
  assert.match(g, /crossOrigin="anonymous"/, 'falta crossOrigin: en producción el video no cargaría')
  const ht = readFileSync(resolve(raiz, '..', 'deploy/media-aula.htaccess'), 'utf8')
  assert.match(ht, /Access-Control-Allow-Origin/, 'el servidor no permitiría analizar el audio')
  assert.doesNotMatch(ht, /Allow-Origin\s+"?\*/, 'CORS con comodín: cualquier web podría leer los videos')
})

comprobar('el asistente sigue usando esta ficha, y por sus dos caminos', () => {
  const f = readFileSync(resolve(raiz, 'components/soporte/AsistenteFlotante.tsx'), 'utf8')
  assert.match(f, /<FichaEdicion/, 'el asistente ya no pinta la ficha de edición')
  assert.match(f, /vista === 'edicion'/, 'la vista de edición no está cableada')
  /*
   * DOS puertas abren la ficha directamente —Inicio y la lista de la colección— y
   * Ayuda llega en dos saltos: su botón no abre una edición, abre la colección.
   *
   * Escribí primero «tres llamadas» y esta comprobación me corrigió: contar las
   * llamadas era contar mi idea del cableado, no el cableado. Van por separado
   * porque son mecanismos distintos y se rompen por separado.
   */
  const directas = (f.match(/abrirEdicion\(/g) ?? []).length
  assert.equal(directas, 2, `se esperaban 2 puertas directas a la ficha y hay ${directas}`)
  assert.match(f, /setColeccion\(COLECCION_AULA\)/, 'Ayuda ya no lleva a la colección del Aula')
  assert.match(f, /coleccion === COLECCION_AULA/, 'la lista ya no distingue la colección del Aula')
})

console.log('')
if (fallos.length) {
  console.error(`aula: ${fallos.length} comprobación(es) fallaron`)
  process.exit(1)
}
console.log(`aula: todo en orden · ${E.EDICIONES.length} ediciones · ${E.ORDEN_IDIOMAS.length} idiomas`)
console.log('      la videoteca está APAGADA a propósito: no hay ningún video subido todavía')
