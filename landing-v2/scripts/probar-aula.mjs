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
/* La señal que para las animaciones mientras hay un video. Se compila DE VERDAD
   y no se sustituye por un doble: la ficha la llama al reproducir, y un doble
   dejaría de comprobar justamente eso. */
compilar('lib/reproduccionActiva.ts', 'reproduccionActiva.js')
const modFicha = compilar('components/soporte/FichaEdicion.tsx', 'FichaEdicion.js', {
  '@/context/IdiomaContext': './stub-idioma',
  '@/hooks/useCorpus': './useCorpus',
  '@/lib/soporte/ediciones': './ediciones',
  '@/lib/reproduccionActiva': './reproduccionActiva',
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

/* El mensaje entero, no su primera línea: las guardas que listan hallazgos
   —direcciones de contrato repetidas, sugeridos con forma de queja— ponen el
   dato ÚTIL a partir de la segunda. Recortar en la primera deja un informe que
   sabe que algo falló y no sabe decir qué. El tope es para el diff automático
   de `assert` cuando la comprobación no trae mensaje propio. */
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
    console.log(`  ok   ${titulo}`)
  } catch (e) {
    fallos.push({ titulo, error: e.message })
    console.log(`  FALL ${titulo}`)
    console.log(detallar(e))
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
      /* `preguntas-token.ts` deriva la dirección del contrato de la fuente única
         desde el 25-ago-2026, así que arrastra este alias. */
      '@/lib/official-links': './official-links',
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
  assert.equal(u, 'https://aigenesis.io/media/aula/acceso-cuenta/720/es.mp4?v1')
  const p = E.urlDePoster(E.edicionPorId('edicion-acceso-cuenta').piezas.es)
  assert.equal(p, 'https://aigenesis.io/media/aula/acceso-cuenta/720/es.jpg?v1')
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
  /*
   * LA CARPETA NO SIEMPRE SE LLAMA COMO LA EDICIÓN, y aquí eso tiene historia:
   * `plan-de-negocio/` guarda el pitch de la ALIANZA. Se subió con ese nombre
   * cuando aún no existía la edición de la alianza, y renombrarla en el servidor
   * costaría re-subir 180 MB para no cambiar nada que se vea. El mapa es
   * explícito para que nadie tenga que adivinarlo.
   */
  const carpeta = {
    'edicion-acceso-cuenta': 'acceso-cuenta',
    'edicion-plan-de-negocio': 'plan-de-negocio',
    'edicion-plan-alianza': 'plan-de-negocio',
  }
  let declarados = 0
  for (const ed of E.EDICIONES) {
    for (const [l, pieza] of Object.entries(ed.piezas)) {
      if (!pieza.video) continue
      declarados++
      /*
       * LA CARPETA DE RESOLUCIÓN NO SE FIJA AQUÍ.
       *
       * Esto exigía `acceso-cuenta/es.mp4` exacto, y al pasar los videos a 720p
       * —`acceso-cuenta/720/es.mp4`— fallaron tres comprobaciones. Hicieron bien
       * su trabajo: la forma cambió. Pero lo que esta guarda existe para
       * proteger no es la carpeta, es la IDENTIDAD: que debajo de `en` no haya
       * quedado pegado el archivo español.
       *
       * Así que se comprueba la edición y el idioma, y se deja libre lo que hay
       * en medio. Si mañana aparece una carpeta `1080` o `av1`, esto sigue
       * midiendo lo que importa en vez de romperse por un cambio legítimo.
       */
      const esperado = new RegExp(`^${carpeta[ed.id]}/(?:[a-z0-9]+/)?${l}\.mp4$`)
      assert.match(
        pieza.video,
        esperado,
        `${ed.id}/${l} apunta a «${pieza.video}», que no es su archivo`
      )
      assert.ok(pieza.segundos > 0, `${ed.id}/${l} declara un video sin duración medida`)
    }
  }
  assert.equal(declarados, 6, `se esperaban 6 videos declarados y hay ${declarados}`)
})

comprobar('el PDF se deriva de PRESS_V5 y no se copia', () => {
  const { PRESS_V5 } = require_(join(salida, 'official-links.js'))
  /*
   * `ORDEN_IDIOMAS` YA NO ES LA LISTA DE ESTA EDICIÓN. Sirve a dos catálogos: el
   * mazo de AiGenesis existe en ocho idiomas y el de la alianza en cinco, y no
   * coinciden. Recorrerla entera aquí daba «Cannot read properties of undefined»
   * — el mismo fallo que tumbaba el módulo antes de arreglarlo.
   *
   * Se comprueban las dos direcciones, que juntas son la afirmación completa:
   * lo que PRESS_V5 tiene se copia exacto, y lo que NO tiene no se inventa.
   */
  for (const l of E.ORDEN_IDIOMAS) {
    const doc = PRESS_V5[l]
    if (doc) {
      assert.equal(plan.piezas[l].pdf, doc.archivo, `el PDF de ${l} no coincide con la fuente única`)
      assert.equal(plan.piezas[l].mb, doc.mb, `el peso de ${l} no coincide con la fuente única`)
    } else {
      assert.equal(plan.piezas[l].pdf, undefined, `${l} no está en PRESS_V5 y aun así declara un PDF`)
    }
  }
  assert.ok(Object.keys(PRESS_V5).length < E.ORDEN_IDIOMAS.length,
    'control: si PRESS_V5 pasa a tener todos los idiomas, la rama de arriba deja de probarse')
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
  assert.match(html, /media\/aula\/acceso-cuenta\/(?:[a-z0-9]+\/)?es\.mp4/, 'el src no apunta al archivo')
  /*
   * EL PÓSTER YA NO ES UN ATRIBUTO. Era `poster="…"` del propio `<video>`, y por
   * eso heredaba su `crossOrigin`: una imagen de la que nunca leemos un píxel
   * exigía `Access-Control-Allow-Origin`, y sin él el navegador la bloqueaba.
   * Ahora va como `<img>` suelto detrás del reproductor.
   *
   * Se comprueba lo que importa —que la URL con su versión llega a la pantalla—
   * y NO la etiqueta concreta, para que reordenar el marcado no rompa esto. Pero
   * sí se exige que NO vuelva como atributo: ese camino es el que estaba roto.
   */
  assert.match(html, /acceso-cuenta\/(?:[a-z0-9]+\/)?es\.jpg\?v\d+/, 'falta el póster o su versión')
  assert.doesNotMatch(
    html,
    /<video[^>]*poster=/,
    'el póster volvió a ser atributo del video: heredaría su crossOrigin y CORS lo bloquea',
  )
  assert.doesNotMatch(
    html,
    /<img[^>]*crossorigin/i,
    'el póster no debe pedir CORS: nunca se leen sus píxeles',
  )
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
  /*
   * EL ESTADO DE HOY, dicho en voz alta para que se vea cambiar — y corregido
   * cuando se descubrió que el video de `plan-de-negocio/` es el de la ALIANZA,
   * no el de AiGenesis. La edición de AiGenesis es documento puro; la de la
   * alianza tiene video en tres idiomas y documento en cinco.
   */
  const alianza = E.edicionPorId('edicion-plan-alianza')
  assert.equal(E.idiomasConPdf(plan).length, 8, 'el plan de AiGenesis debería tener 8 documentos')
  assert.equal(E.idiomasConVideo(plan).length, 0, 'el plan de AiGenesis no tiene video propio')
  assert.equal(E.idiomasConVideo(alianza).length, 3, 'la alianza debería tener 3 videos')
  assert.equal(E.idiomasConPdf(alianza).length, 5, 'la alianza debería tener 5 documentos')
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
  /*
   * SE MIRA LA EDICIÓN DE LA ALIANZA, no la de AiGenesis.
   *
   * Esto recorría `edicion-plan-de-negocio` en ru/sv/hr/ar, que entonces era la
   * única edición con video Y documento a la vez. Ya no lo es: sus videos eran
   * en realidad los de la alianza. Hoy la de AiGenesis es documento puro —donde
   * este caso no se puede distinguir de nada— y la mezcla vive en la alianza,
   * con video en es/en/pt y documento además en de/sr.
   *
   * Alemán y serbio son exactamente el caso: documento sí, video no.
   */
  const alianzaEd = E.edicionPorId('edicion-plan-alianza')
  for (const l of ['de', 'sr']) {
    assert.equal(alianzaEd.piezas[l].video, null, `control: ${l} ya tiene video, rehacer esta prueba`)
    assert.ok(alianzaEd.piezas[l].pdf, `control: ${l} no tiene documento, esto no prueba nada`)
    /* En el mundo ENCENDIDO, que es donde esto se puede distinguir de verdad: con
       la videoteca apagada estas fichas se ven igual que las que sí tienen
       video, y la prueba no probaría nada. */
    const html = pintarOn('edicion-plan-alianza', l)
    /* El texto cambió a propósito: una edición CON documento y sin video ya no
       dice «no hay edición en tu idioma» —que era falso teniendo el PDF ahí
       mismo— sino que es un documento. Se comprueba el mensaje que toca. */
    assert.match(html, /Esta edición es un documento/, `${l}: no explica que el material es un documento`)
    assert.doesNotMatch(html, /Todavía no hay edición en/, `${l}: dice que no hay material teniendo el PDF`)
    /* El enlace es el del deck de la ALIANZA, no el `_v5.0_` de AiGenesis: son
       dos documentos distintos y confundirlos aquí sería no comprobar nada. */
    assert.match(html, /media\/aula\/alianza\/de\.pdf|media\/aula\/alianza\/sr\.pdf/,
      `${l}: perdió el enlace de descarga por no tener video`)
    assert.doesNotMatch(html, /<video/, `${l}: pintó un reproductor sin archivo`)
  }
  /* Y el contraste, que es lo que convierte esto en una prueba: el español, en
     la MISMA edición, sí trae reproductor. Sin esta línea, un componente que
     nunca pintara video pasaría las cuatro comprobaciones de arriba. */
  assert.match(pintarOn('edicion-plan-alianza', 'es'), /<video/)
})

comprobar('el árabe se pinta de derecha a izquierda', () => {
  assert.match(pintar(plan, 'ar'), /dir="rtl"/, 'el árabe no declaró la dirección')
  assert.doesNotMatch(pintar(plan, 'es'), /dir="rtl"/, 'el español se declaró RTL')
})

console.log('\nCONTROL DE INSTRUMENTO — ¿sigue en el camino vivo?\n')

comprobar('sólo existe UNA dirección de contrato del AiG en todo el proyecto', () => {
  /*
   * NACIDA DE UN FALLO VIVO (25-ago-2026).
   *
   * `preguntas-token.ts` daba `0x4b4594bfe661919a8e2373eb175004da2989a479` como
   * «el contrato oficial», y `official-links.ts` daba
   * `0xC1F0768587Dc889e494C171B155C60B4e9a13F08`. Las dos direcciones EXISTEN en
   * BSC, las dos se llaman «A.I. Genesis Official», las dos con símbolo AIG y
   * 111 millones de supply — comprobado preguntándole a la cadena.
   *
   * La que usa el dinero es la de `official-links.ts`: está en el `.env` de
   * producción del portal. La otra no aparecía en ninguna parte del backend.
   *
   * Y la respuesta equivocada estaba SERVIDA, diciendo «desconfía de cualquier
   * otra dirección» mientras daba la que el sistema no usa. Nada fallaba: dos
   * cadenas hexadecimales de 42 caracteres se leen igual de plausibles.
   *
   * Por eso la comprobación no es «que sea esta dirección» —eso sería fijar el
   * error si algún día cambia— sino «que no haya DOS». Una sola fuente no puede
   * contradecirse.
   */
  const dirs = new Map()
  const pila = [resolve(raiz, 'lib'), resolve(raiz, 'components'), resolve(raiz, 'app')]
  while (pila.length) {
    const d = pila.pop()
    for (const n of readdirSync(d, { withFileTypes: true })) {
      const ruta = join(d, n.name)
      if (n.isDirectory()) pila.push(ruta)
      else if (/\.tsx?$/.test(n.name)) {
        /* Los COMENTARIOS se descartan: este proyecto documenta a fondo, y la
           dirección vieja se cita a propósito en `whitepaper.ts` para explicar
           por qué NO se usa. Contarla como duplicado castigaría justo la nota
           que evita el error. */
        const src = readFileSync(ruta, 'utf8')
          .replace(/\/\*[\s\S]*?\*\//g, ' ')
          .replace(/^\s*\/\/.*$/gm, '')
        for (const m of src.matchAll(/0x[0-9a-fA-F]{40}/g)) {
          /* Sólo interesan las que se presentan como el contrato del AiG: una
             dirección de USDT o del router no es un duplicado. */
          const ventana = src.slice(Math.max(0, m.index - 220), m.index + 120)
          if (!/AIG|AiG|token oficial|contrato oficial|TOKEN_CONTRACT/i.test(ventana)) continue
          const dir = m[0].toLowerCase()
          if (!dirs.has(dir)) dirs.set(dir, [])
          dirs.get(dir).push(ruta.replace(raiz, '').replace(/\\/g, '/'))
        }
      }
    }
  }
  assert.equal(
    dirs.size,
    1,
    `hay ${dirs.size} direcciones distintas presentadas como el contrato del AiG:\n   ` +
      [...dirs.entries()].map(([d, f]) => `${d}\n     ${f.join('\n     ')}`).join('\n   ')
  )
})

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

comprobar('el texto de las ediciones existe en el diccionario', () => {
  /*
   * EL FALLO QUE ESTO ATRAPA, reportado por el owner el 25-ago-2026: «el idioma
   * no cambia en los títulos de los videos».
   *
   * El cableado estaba BIEN — `FichaEdicion` pasa el título por `c()`. Lo que
   * faltaba era la fila: sin clave en el diccionario, `c()` devuelve el español
   * y lo declara como español. No falla nada, no avisa nada, y la ficha entera
   * cambia de idioma menos su titular.
   *
   * Y era invisible por partida doble: `verify:i18n:g1` sólo miraba
   * `components/g1` y `app/g1`, y su regla es «¿llama a t()?», que aquí no
   * aplica porque estos textos se traducen por diccionario en el render. La
   * guarda no falló: miraba otro sitio con otra regla.
   *
   * Aquí la regla correcta es la de pertenencia: ¿está el texto en el
   * diccionario? Se comprueban título, resumen y rótulo de versión de cada
   * edición — todo lo de `ediciones.ts` que acaba en pantalla.
   */
  /* Las claves se leen en sus TRES sintaxis. Una clave que sea identificador
     válido va sin comillas (`Legal: {`), y buscar `'clave':` no la ve — eso me
     produjo un falso positivo el mismo día que escribí esto. */
  const fuente =
    readFileSync(resolve(raiz, 'lib/i18n/diccionario.ts'), 'utf8') +
    readFileSync(resolve(raiz, 'lib/i18n/diccionario-whitepaper.ts'), 'utf8')
  const CLAVES = new Set()
  for (const m of fuente.matchAll(/^\s{2}'((?:[^'\\]|\\.)+)':\s*\{/gm)) CLAVES.add(m[1])
  for (const m of fuente.matchAll(/^\s{2}"((?:[^"\\]|\\.)+)":\s*\{/gm)) CLAVES.add(m[1])
  for (const m of fuente.matchAll(/^\s{2}([A-Za-zÀ-ÿ_$][\w$À-ÿ]*):\s*\{/gm)) CLAVES.add(m[1])
  const enDicc = (s) => CLAVES.has(s)
  assert.ok(enDicc('Ecosistema'), 'control: no se leen las claves sin comillas')

  const faltan = []
  for (const ed of E.EDICIONES) {
    for (const campo of ['titulo', 'resumen', 'version']) {
      const txt = ed[campo]
      if (typeof txt === 'string' && txt && !enDicc(txt)) {
        faltan.push(`${ed.id} · ${campo}: «${txt.slice(0, 56)}»`)
      }
    }
  }
  assert.deepEqual(
    faltan,
    [],
    'texto de ediciones.ts que se pintará en español en los once idiomas:\n   · ' +
      faltan.join('\n   · '),
  )
  /* Control de instrumento: si la búsqueda no distingue, todo pasaría. */
  assert.ok(!enDicc('esto-no-existe-en-el-diccionario'), 'control: la búsqueda da positivo en todo')
  assert.ok(enDicc(E.EDICIONES[0].titulo), 'control: no encuentra un título que SÍ está')
})

comprobar('lo que anima suelta el hilo mientras se reproduce un video', () => {
  /*
   * EL FALLO: «los videos se quedan colgados a los 2 segundos». Dos hipótesis
   * mías fallaron antes de medir. Lo que lo resolvió fue reproducirlo con un
   * navegador de verdad y perfilarlo:
   *
   *   página                fotograma (mediana)
   *   ───────────────────   ───────────────────
   *   portada                    98,7 ms   ← 10 fps
   *   /soporte (sólo texto)       8,3 ms   ← 120 fps
   *
   * El mismo video, del mismo servidor. El perfilador señaló `stroke` y `fill`:
   * Canvas 2D. Son los dos lienzos del héroe, que pintan cada fotograma y no le
   * dejan turno al decodificador. Ninguno de los dos miraba si había un video.
   *
   * Verificado tras el arreglo, en la misma sesión: 94,5 ms antes de pulsar,
   * 8,4 ms mientras reproduce, y el video avanza 1 s por segundo sin que
   * `readyState` baje de 4 ni una vez.
   *
   * Se comprueban las DOS mitades otra vez, porque una sola no sirve: que el
   * reproductor AVISE y que cada animación ESCUCHE. Si mañana aparece otro
   * lienzo animado en la portada, esta lista hay que ampliarla — y el
   * comentario está aquí para que se sepa por qué.
   */
  const ficha = readFileSync(resolve(raiz, 'components/soporte/FichaEdicion.tsx'), 'utf8')
  assert.match(ficha, /marcarReproduccion\(videoRef\.current, true\)/, 'el reproductor no avisa de que empieza')
  assert.match(ficha, /marcarReproduccion\(videoRef\.current, false\)/, 'el reproductor no avisa de que termina')

  const ANIMAN = [
    'components/hero/HeroLivingField.tsx',
    'components/hero/HeroGenesisOrb.tsx',
    'components/webgl/WorldCanvasInner.tsx',
  ]
  const sordas = ANIMAN.filter((rel) => {
    const src = readFileSync(resolve(raiz, rel), 'utf8')
    return !/hayReproduccion\(\)|alCambiarReproduccion/.test(src)
  })
  assert.deepEqual(
    sordas,
    [],
    'animaciones que NO se paran con un video en marcha (se lo comerán el hilo):\n   · ' +
      sordas.join('\n   · '),
  )

  /* Y que el reanudado exista: si el bucle se cancelara en vez de saltarse el
     dibujo, el fondo se quedaría congelado para siempre al acabar el video. */
  for (const rel of ['components/hero/HeroLivingField.tsx', 'components/hero/HeroGenesisOrb.tsx']) {
    const src = readFileSync(resolve(raiz, rel), 'utf8')
    assert.match(
      src,
      /if \(hayReproduccion\(\)\) \{\s*rafRef\.current = requestAnimationFrame\(loop\)/,
      `${rel}: la guarda no vuelve a programar el bucle; el fondo quedaría congelado`,
    )
  }
})

comprobar('el analizador de audio no puede congelar el video', () => {
  /*
   * EL FALLO: los videos arrancaban y se quedaban clavados a los dos segundos.
   *
   * `createMediaElementSource(el)` no «escucha» un elemento: le ARRANCA la
   * salida de audio y la mete en el grafo. Si ese grafo pertenece a un
   * AudioContext SUSPENDIDO, el elemento deja de avanzar — sin error, sin
   * excepción, sin nada en la consola. Y nacía suspendido casi siempre, porque
   * se llamaba desde `onPlay`, que es un evento de medio y no un gesto.
   *
   * Se exigen las TRES condiciones que lo impiden, porque quitar cualquiera
   * devuelve el cuelgue:
   *   1. El contexto se prepara en el CLIC (donde el navegador lo concede).
   *   2. `escuchar` no engancha nada si el contexto no está corriendo.
   *   3. No se engancha en el camino sin CORS: ahí el elemento está contaminado
   *      y el grafo silenciaría el ALTAVOZ, no sólo el analizador.
   */
  const hook = readFileSync(resolve(raiz, 'hooks/useAliento.ts'), 'utf8')
  const ficha = readFileSync(resolve(raiz, 'components/soporte/FichaEdicion.tsx'), 'utf8')

  assert.match(ficha, /onVoz\?\.preparar\(\)/, 'el clic no prepara el audio: nacerá suspendido')
  assert.match(
    hook,
    /if \(ctx\.state !== 'running'\)[\s\S]{0,200}?return/,
    'falta la guarda: engancharía el video a un contexto suspendido y lo congelaría',
  )
  assert.match(
    ficha,
    /if \(conCors && videoRef\.current\) onVoz\?\.escuchar/,
    'se engancharía el analizador en el camino sin CORS y el video quedaría mudo',
  )

  /*
   * Y EL ORDEN IMPORTA: la guarda tiene que estar ANTES de crear la fuente.
   *
   * Se compara sobre el CÓDIGO, con los comentarios fuera. La primera versión
   * de esto buscaba en el archivo entero y falló nada más escribirla: el
   * comentario que explica el fallo NOMBRA `createMediaElementSource`, y esa
   * mención aparece antes que la guarda. Mi propia explicación disparaba la
   * alarma sobre el código que explicaba.
   */
  const codigo = hook.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
  const iGuarda = codigo.indexOf("ctx.state !== 'running'")
  const iFuente = codigo.indexOf('createMediaElementSource')
  assert.ok(iGuarda !== -1 && iFuente !== -1, 'control: cambió la forma, rehacer esta comprobación')
  assert.ok(iGuarda < iFuente, 'la guarda quedó DESPUÉS de crear la fuente: no protege nada')
})

comprobar('la etiqueta de la lista no promete un video que no existe', () => {
  /*
   * EL FALLO: la lista mostraba «Video» junto a «El plan de negocio de la
   * alianza», que es un PDF y no tiene ni un archivo de video en ningún idioma.
   * Quien pulsa esperando un video encuentra un documento — la etiqueta le
   * prometió otra cosa antes de entrar.
   *
   * Venía de que `MarcaVideo` sólo recibía `segundos` y, sin duración, caía a la
   * palabra «Video» como relleno. Un valor por defecto que AFIRMA algo es peor
   * que no poner nada: parece un dato.
   *
   * Ahora recibe la EDICIÓN y decide mirando si existe algún video. Se exige que
   * siga siendo así, porque volver a pasarle sólo la duración devolvería el
   * fallo sin romper nada.
   */
  const f = readFileSync(resolve(raiz, 'components/soporte/AsistenteFlotante.tsx'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
  assert.doesNotMatch(
    f,
    /<MarcaVideo\s+segundos=/,
    'la etiqueta vuelve a recibir sólo la duración: dirá «Video» en una edición sin videos',
  )
  assert.match(f, /<MarcaVideo\s+edicion=/, 'la etiqueta no recibe la edición y no puede saber qué es')
  assert.match(f, /hayAlgunVideo \? \(d \?\? 'Video'\) : 'PDF'/, 'la etiqueta ya no distingue video de documento')

  /* Y el dato de fondo: que exista al menos una edición de cada clase. Sin eso
     esta comprobación pasaría por no tener nada que distinguir. */
  const conVideo = E.EDICIONES.filter((ed) => Object.values(ed.piezas).some((p) => p?.video))
  const soloDoc = E.EDICIONES.filter((ed) => !Object.values(ed.piezas).some((p) => p?.video))
  assert.ok(conVideo.length > 0, 'control: ninguna edición tiene video, esto no prueba nada')
  assert.ok(soloDoc.length > 0, 'control: ninguna edición es sólo documento, esto no prueba nada')
})

comprobar('NINGÚN camino pinta el título de una edición sin traducir', () => {
  /*
   * EL FALLO QUE ESTO ATRAPA, y que ya cometí con esta misma tanda.
   *
   * Añadí las filas al diccionario, comprobé que existían, comprobé que la
   * FICHA las usaba, y di el asunto por cerrado. El owner abrió el asistente en
   * portugués y los dos títulos seguían en español — porque la LISTA es otro
   * camino, y ahí se pintaba `{e.titulo}` en crudo. Tres veces, en dos
   * pantallas distintas.
   *
   * Que la traducción exista no significa que alguien la pida. Una fila de
   * diccionario que nadie consulta y una fila que no existe se ven EXACTAMENTE
   * igual en pantalla, y la guarda anterior sólo miraba la primera mitad.
   *
   * Aquí se exige lo otro: que en el asistente no quede ni un `{e.titulo}` o
   * `{e.resumen}` suelto. Si aparece una pantalla nueva que los pinte en crudo,
   * esto lo dice antes de que lo diga el owner.
   */
  const f = readFileSync(resolve(raiz, 'components/soporte/AsistenteFlotante.tsx'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
  const crudos = [...f.matchAll(/\{\s*(e\.(?:titulo|resumen))\s*\}/g)].map((m) => m[1])
  assert.deepEqual(
    crudos,
    [],
    'se pintan en crudo, sin pasar por el traductor del corpus:\n   · ' + crudos.join('\n   · '),
  )
  /* Control de instrumento: el detector tiene que morder de verdad. */
  const detecta = (s) => /\{\s*e\.(?:titulo|resumen)\s*\}/.test(s)
  assert.ok(detecta('<span>{e.titulo}</span>'), 'control: no detecta el render en crudo')
  assert.ok(detecta('{ e.resumen }'), 'control: no detecta con espacios')
  assert.ok(!detecta('{corp(e.titulo).texto}'), 'control: marca el render ya traducido')

  /* Y que la ficha siga traduciendo el suyo, que es el otro camino. */
  const ficha = readFileSync(resolve(raiz, 'components/soporte/FichaEdicion.tsx'), 'utf8')
  assert.match(ficha, /c\(edicion\.titulo\)\.texto/, 'la ficha dejó de traducir el título')
})

comprobar('cada portal enseña SU plan de negocio, y el asistente lo usa', () => {
  /*
   * LA REGLA DEL OWNER (25-ago-2026): en aigenesis.io se enseña la presentación
   * de AiGenesis; en g1.aigenesis.io, el plan de la alianza. Enseñar el
   * equivocado deja a quien lo abre explicando otra empresa.
   *
   * SE COMPRUEBAN LAS DOS MITADES, porque una sola no vale de nada:
   *
   *   1. Que la FUNCIÓN reparta bien. Trivial, pero si se rompe, se rompe entero.
   *   2. Que el ASISTENTE la llame. Una función perfecta que nadie invoca es
   *      indistinguible de no haberla escrito: el componente seguiría pintando
   *      `EDICIONES` —las tres— y el fallo sería invisible en el repositorio.
   *
   * La segunda es la que de verdad protege. Se exige que `EDICIONES` no aparezca
   * ya en el componente: mientras siga ahí, hay un camino que ignora el portal.
   */
  const g1 = E.edicionesDePortal('g1').map((e) => e.id)
  const gen = E.edicionesDePortal('genesis').map((e) => e.id)
  assert.ok(g1.includes('edicion-plan-alianza'), 'g1 no enseña el plan de la alianza')
  assert.ok(!g1.includes('edicion-plan-de-negocio'), 'g1 enseña el plan de AiGenesis, que no le toca')
  assert.ok(gen.includes('edicion-plan-de-negocio'), 'genesis no enseña su propio plan')
  assert.ok(!gen.includes('edicion-plan-alianza'), 'genesis enseña el plan de la alianza, que no le toca')
  assert.ok(
    g1.includes('edicion-acceso-cuenta') && gen.includes('edicion-acceso-cuenta'),
    'el tutorial de vinculación sirve a los dos portales y debe estar en ambos',
  )
  /* Sin portal —el primer render, antes de que exista `window`— se da el juego
     completo: esconder material hasta saber dónde estamos haría creer que un
     documento no existe, y ése es el peor de los dos errores posibles. */
  assert.equal(
    E.edicionesDePortal('desconocido').length,
    E.EDICIONES.length,
    'sin portar conocido debe darse el catálogo entero, no un subconjunto',
  )

  const f = readFileSync(resolve(raiz, 'components/soporte/AsistenteFlotante.tsx'), 'utf8')
  assert.match(f, /edicionesDePortal\(portal\)/, 'el asistente no pide las ediciones de su portal')
  assert.match(f, /setPortal\(portalActual\(\)\)/, 'el asistente nunca averigua en qué portal está')
  assert.doesNotMatch(
    f.replace(/\/\*[\s\S]*?\*\//g, ' '),
    /\bEDICIONES\b/,
    'queda un uso de EDICIONES: ese camino pinta las tres ediciones y se salta el portal',
  )
})

console.log('')
if (fallos.length) {
  console.error(`aula: ${fallos.length} comprobación(es) fallaron`)
  process.exit(1)
}
console.log(`aula: todo en orden · ${E.EDICIONES.length} ediciones · ${E.ORDEN_IDIOMAS.length} idiomas`)

/*
 * ESTE RESUMEN SE DERIVA, PORQUE EL FIJO SE QUEDÓ MINTIENDO.
 *
 * Aquí había escrito a mano «la videoteca está APAGADA a propósito: no hay
 * ningún video subido todavía». Era cierto el día que lo escribí. Los videos se
 * subieron, `publicado` pasó a `true`, y la comprobación de la línea 200 empezó
 * a EXIGIR que estuviera encendida — mientras el resumen de la última línea
 * seguía anunciando lo contrario, en la misma ejecución y sin que nada fallara.
 *
 * Un informe que afirma algo que no mide es peor que no decir nada: se lee como
 * medición. Ahora las tres cifras salen del módulo, y si mañana se apaga la
 * videoteca la línea lo dirá sola.
 */
/* El campo se llama `piezas`. Escribí `idiomas` de memoria y la línea salió
   diciendo «0 de 2 ediciones con video» sin que nada fallara: `undefined?.[i]`
   es `undefined`, `urlDeVideo(undefined)` es `null`, y un cero así se lee igual
   que un cero medido. Se cuenta desde el módulo y se exige que no sea cero. */
const videos = E.EDICIONES.flatMap((ed) =>
  Object.values(ed.piezas).filter((p) => E.urlDeVideo(p)),
).length
const conVideo = E.EDICIONES.filter((ed) =>
  Object.values(ed.piezas).some((p) => E.urlDeVideo(p)),
).length
if (E.VIDEOTECA.publicado && videos === 0) {
  console.error('aula: la videoteca dice estar publicada y no produce NI UNA url de video')
  process.exit(1)
}
console.log(
  `      videoteca ${E.VIDEOTECA.publicado ? 'ENCENDIDA' : 'APAGADA'} · ` +
    `${conVideo} de ${E.EDICIONES.length} ediciones con video · ${videos} archivos · ` +
    E.VIDEOTECA.base,
)
