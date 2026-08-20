#!/usr/bin/env node
/**
 * GUARDA DE LENGUAJE DEL MATERIAL DE SOPORTE.
 *
 * Revisa `lib/soporte/**` buscando vocabulario que convierte una descripción de
 * producto en una promesa financiera: «rentabilidad», «inversión», «APY»,
 * «ingresos pasivos», «sin riesgo», «precio de AIG»…
 *
 * POR QUÉ UNA GUARDA Y NO UNA NORMA ESCRITA. La norma ya existe y se aplica: el
 * sitio dice «no es un esquema de captación» y en agosto de 2026 se cambió
 * «bono directo» por «acelerador» precisamente por esto. Pero una norma que
 * vive en la cabeza de quien escribe se pierde en cuanto escribe otro — o en
 * cuanto el mismo escribe con prisa seis meses después. Esto lo comprueba cada
 * vez, sin acordarse de nada.
 *
 * LO QUE NO HACE: entender el contexto. Marca la palabra y explica por qué,
 * pero la decisión es de quien escribe. Si en algún caso el término es correcto
 * —una cita literal de un documento legal, por ejemplo— se reformula o se
 * excluye ese archivo a conciencia. Una guarda que se puede silenciar sin
 * pensar no protege de nada; ésta obliga a mirar.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join, relative } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const CARPETA = resolve(raiz, 'lib', 'soporte')

/*
 * Los patrones se leen del propio módulo de lenguaje para que exista UNA lista.
 * Como es TypeScript y este script es JavaScript plano, se extraen del texto en
 * vez de importarse: menos elegante, pero sin cadena de compilación y sin una
 * segunda copia que un día diga otra cosa.
 */
const fuenteReglas = readFileSync(resolve(CARPETA, 'lenguaje.ts'), 'utf8')
/*
 * SE COMPARA SIN ACENTOS, Y LO APRENDI FALLANDO.
 *
 * La primera version declaraba «se compara sin distinguir acentos» y NO lo
 * hacia. Al probarla plantando cuatro terminos prohibidos cazo tres: se le
 * escapo «inversion» escrito sin tilde, porque el patron pedia la tilde.
 *
 * Y asi es como llega el problema real: nadie escribe con tildes cuando redacta
 * deprisa, y menos en un chat de soporte. Una guarda que solo detecta la
 * ortografia cuidada no protege del caso que importa.
 */
const sinAcentos = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '')

const REGLAS = []
const bloque = /patron:\s*(\/(?:[^/\\]|\\.)+\/[gimsuy]*),\s*\n\s*motivo:\s*\n?\s*'((?:[^'\\]|\\.)*)',\s*\n\s*enSuLugar:\s*\n?\s*'((?:[^'\\]|\\.)*)'/g
let m
while ((m = bloque.exec(fuenteReglas))) {
  const [, patron, motivo, enSuLugar] = m
  const cuerpo = patron.slice(1, patron.lastIndexOf('/'))
  const banderas = patron.slice(patron.lastIndexOf('/') + 1)
  /* El patron tambien se normaliza: escrito con tilde o sin ella, encuentra ambas. */
  REGLAS.push({ re: new RegExp(sinAcentos(cuerpo), banderas.includes('i') ? 'gi' : 'g'), motivo, enSuLugar })
}

if (!REGLAS.length) {
  console.error('No se pudo leer ninguna regla de lib/soporte/lenguaje.ts.')
  console.error('Si cambió el formato del archivo, hay que ajustar este script — NO seguir sin comprobar.')
  process.exit(1)
}

/*
 * ARCHIVOS EXCLUIDOS, UNO A UNO Y CON MOTIVO.
 *
 * Es la salida que esta guarda documenta para el caso de la cita literal, y
 * la única forma legítima de silenciarla. Va como lista corta y explícita
 * —nunca un patrón amplio— porque una exclusión que crece sola deja de ser
 * una excepción y pasa a ser un agujero. Se imprimen en cada ejecución para
 * que nadie descubra dentro de un año que media carpeta no se revisaba.
 */
const EXCLUIDOS = [
  /* Define los términos prohibidos: los contiene por necesidad. */
  'lenguaje.ts',
  /* Cita literal del acuerdo que el usuario acepta. Reescribirlo lo
     invalidaría como prueba de qué se le mostró. */
  'acuerdo-de-uso.ts',
]

const archivos = []
;(function recorrer(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) recorrer(p)
    /* `lenguaje.ts` se salta: contiene los términos prohibidos por definición. */
    else if (p.endsWith('.ts') && !EXCLUIDOS.some((e) => p.endsWith(e))) archivos.push(p)
  }
})(CARPETA)

/*
 * CONTRAEJEMPLOS: las únicas líneas exentas, y por qué.
 *
 * El material de soporte enseña a escribir con pares «esto mal / esto bien».
 * Un bloque `incorrecto:` o un campo `mal:` contienen, POR DISEÑO, justo lo
 * que no hay que decir. Marcarlos es un falso positivo garantizado, y la
 * salida sería reformular el contraejemplo hasta que deje de serlo — es
 * decir, romper la enseñanza para complacer al comprobador.
 *
 * La exención es deliberadamente estrecha: sólo el valor de esas dos claves.
 * Todo lo demás del archivo —comentarios incluidos— se revisa igual. Y las
 * líneas exentas SE CUENTAN Y SE INFORMAN: una exención silenciosa es una
 * puerta que alguien acaba cruzando sin darse cuenta.
 */
const ABRE_CONTRAEJEMPLO = /^\s*(incorrecto|mal)\s*:\s*\[\s*$/
const CIERRA_LISTA = /^\s*\]/
/*
 * El caso de una sola línea es el que de verdad aparece en el material:
 *   { mal: 'Adquiere productos premium…', bien: 'Elige, paga y te llega' }
 * Exentar la línea entera dejaría `bien` SIN REVISAR, que es justo la mitad
 * que sí hay que vigilar. Así que no se exenta la línea: se tapa únicamente
 * el valor del contraejemplo y se revisa todo lo demás de esa misma línea.
 */
const VALOR_CONTRAEJEMPLO = /\b(incorrecto|mal)\s*:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g

/*
 * VOCABULARIO DEL USUARIO: la segunda exención, y la más delicada.
 *
 * El buscador sólo encuentra una respuesta si conoce las palabras que la
 * gente TECLEA, y la gente teclea lo que el proyecto ya no dice: «bono
 * binario», «cuánto gano por invitar». Sin esas claves, la pregunta correcta
 * no encuentra su respuesta y el usuario se va pensando que no está.
 *
 * El riesgo es evidente: `sinonimos` no puede convertirse en el sitio donde
 * se cuela prosa promocional. Por eso la exención lleva TOPE DE LONGITUD.
 * Un sinónimo es una clave de búsqueda de tres palabras; en cuanto una
 * entrada crece hasta parecer una frase, deja de estar exenta y se revisa
 * como cualquier otra. La barrera no es la confianza, es el tamaño.
 */
const ABRE_VOCABULARIO = /^\s*sinonimos\s*:\s*\[\s*$/
const TOPE_SINONIMO = 40

/*
 * RÓTULOS DE PANTALLA: la tercera y última exención.
 *
 * Una guía de soporte tiene que poder decir «pulsa Red Binaria». Si no puede
 * nombrar el botón al que manda a la persona, no sirve para nada. Y varios
 * rótulos del producto usan todavía el vocabulario que la landing retiró en
 * agosto de 2026 — precisamente el hecho que hay que documentar.
 *
 * Por eso existe la clave `rotulo`: se reserva para EL TEXTO LITERAL que
 * aparece en la interfaz, y sólo eso. Nuestra descripción de la página va en
 * `nombre`, que se revisa como todo lo demás. Separar los dos campos hace la
 * diferencia visible en los datos en vez de dejarla al criterio de quien
 * escribe, y de paso deja localizable dónde producto y web no coinciden.
 *
 * Lleva el mismo tope que los sinónimos: un rótulo es un texto de botón, no
 * un párrafo. En cuanto crece, se revisa.
 */
const VALOR_ROTULO = /\brotulo\s*:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g
/*
 * Y LA MISMA LISTA ESCRITA EN UNA LÍNEA, que resultó ser la forma que de
 * verdad se usa:  sinonimos: ['bono binario', 'cuanto gano por invitar'],
 *
 * La primera versión sólo entendía la forma multilínea. Pasaba en verde —
 * porque ningún sinónimo tenía todavía un término vetado— mientras la
 * exención NUNCA se activaba sobre el archivo real. El día que alguien
 * añadiera el sinónimo que hace falta, la guarda lo habría bloqueado sin
 * que exista manera legítima de escribirlo. Una exención que no encaja con
 * el formato que usa el repositorio no protege: espera.
 */
const LISTA_VOCABULARIO_EN_LINEA = /\bsinonimos\s*:\s*\[([^\]]*)\]/g
const CADENA = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g

const problemas = []
let exentas = 0
for (const f of archivos) {
  const lineas = readFileSync(f, 'utf8').split('\n')
  let enContraejemplo = false
  let enVocabulario = false
  lineas.forEach((linea, i) => {
    if (enContraejemplo) {
      if (CIERRA_LISTA.test(linea)) enContraejemplo = false
      else exentas++
      return
    }
    if (enVocabulario) {
      if (CIERRA_LISTA.test(linea)) {
        enVocabulario = false
        return
      }
      /* Corto: es una clave de búsqueda, pasa. Largo: es una frase, se revisa. */
      const contenido = linea.trim().replace(/^['"`]|['"`],?$/g, '')
      if (contenido.length <= TOPE_SINONIMO) {
        exentas++
        return
      }
    }
    if (ABRE_CONTRAEJEMPLO.test(linea)) {
      enContraejemplo = true
      return
    }
    if (ABRE_VOCABULARIO.test(linea)) {
      enVocabulario = true
      return
    }
    const revisable = linea
      .replace(VALOR_CONTRAEJEMPLO, (_, clave) => {
        exentas++
        return `${clave}: ''`
      })
      .replace(VALOR_ROTULO, (todo, cadena) => {
        if (cadena.length - 2 > TOPE_SINONIMO) return todo
        exentas++
        return "rotulo: ''"
      })
      /* Dentro de una lista de sinónimos en línea, se tapa cada entrada corta
         y se dejan a la vista las largas — el mismo tope que en multilínea. */
      .replace(LISTA_VOCABULARIO_EN_LINEA, (todo, dentro) =>
        `sinonimos: [${dentro.replace(CADENA, (cadena) => {
          if (cadena.length - 2 > TOPE_SINONIMO) return cadena
          exentas++
          return "''"
        })}]`
      )
    /* Los comentarios se revisan igual: hoy son notas y mañana alguien los
       copia a una respuesta. */
    for (const r of REGLAS) {
      r.re.lastIndex = 0
      let hallazgo
      while ((hallazgo = r.re.exec(sinAcentos(revisable)))) {
        problemas.push({
          archivo: relative(raiz, f),
          linea: i + 1,
          termino: hallazgo[0],
          motivo: r.motivo,
          enSuLugar: r.enSuLugar,
        })
      }
    }
  })
}

if (problemas.length) {
  console.error(`lenguaje: ${problemas.length} término(s) que prometen resultado financiero\n`)
  for (const p of problemas) {
    console.error(`  ${p.archivo}:${p.linea}  «${p.termino}»`)
    console.error(`      ${p.motivo}`)
    console.error(`      en su lugar: ${p.enSuLugar}\n`)
  }
  process.exit(1)
}
console.log(
  `lenguaje: ${archivos.length} archivo(s) de soporte limpios contra ${REGLAS.length} reglas` +
    (exentas
      ? ` · ${exentas} exención(es) declaradas (contraejemplos, sinónimos y rótulos de pantalla)`
      : '') +
    `\n           archivos excluidos a conciencia: ${EXCLUIDOS.join(', ')}`
)
