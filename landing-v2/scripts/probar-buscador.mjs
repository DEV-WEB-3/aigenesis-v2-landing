#!/usr/bin/env node
/**
 * PRUEBA DEL BUSCADOR DE SOPORTE CON PREGUNTAS REALES.
 *
 * Las consultas de abajo NO están inventadas: son frases textuales de los
 * canales de soporte, con sus faltas y su desorden. Probar un buscador con
 * preguntas escritas por quien hizo el buscador es hacer trampa — uno usa
 * sin darse cuenta las mismas palabras que indexó.
 *
 * Cada caso declara qué DEBE salir. Y varios declaran que debe DERIVAR: un
 * buscador que siempre responde algo es peor que uno que sabe callarse,
 * porque devuelve por parecido de palabras una respuesta que no venía a
 * cuento y la persona se va creyendo que le contestamos.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { createRequire } from 'node:module'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..')
const fuente = resolve(raiz, 'lib', 'soporte')
const salida = resolve(raiz, 'node_modules', '.cache', 'soporte-prueba')

const require_ = createRequire(pathToFileURL(join(raiz, 'package.json')))
const ts = require_('typescript')

rmSync(salida, { recursive: true, force: true })
mkdirSync(salida, { recursive: true })
for (const nombre of readdirSync(fuente).filter((n) => n.endsWith('.ts'))) {
  const codigo = readFileSync(join(fuente, nombre), 'utf8')
  const { outputText } = ts.transpileModule(codigo, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })
  writeFileSync(join(salida, nombre.replace(/\.ts$/, '.js')), outputText, 'utf8')
}

const { responder } = require_(join(salida, 'buscar.js'))

/* Frases textuales de los canales de soporte, tal cual se escribieron. */
const CASOS = [
  {
    consulta: 'Escribo porque tengo congelada mi cuenta de minado me pide 1.7420598279 AIG y ya tengo los 2 IAG en la Walter',
    espera: 'respuesta',
    categoria: 'Hold y estado de la cuenta',
  },
  {
    consulta: 'mi cuenta cuando no es que esta frozen es que tengo balamce en menos pero no estoy minando',
    espera: 'respuesta',
    categoria: 'Hold y estado de la cuenta',
  },
  {
    consulta: 'Tengo un 10% pendiente de minar pero el contador no se mueve',
    espera: 'respuesta',
    categoria: 'Hold y estado de la cuenta',
  },
  {
    consulta: 'No puedo iniciar sesión, me dice que no existe el email o la wallet',
    espera: 'respuesta',
    id: 'gen-no-reconoce',
  },
  {
    consulta: 'Necesito ayuda pues no puedo ingresar a la plataforma de AIG ya que no reconoce mi password',
    espera: 'respuesta',
    categoria: 'Acceso',
  },
  {
    consulta: 'envié aig del contrato viejo para tenerlas en el nuevo y no me an llegado aún',
    espera: 'derivar',
  },
  {
    consulta: 'Realice una compra por el P2P y los AIG No llegaron a mi billetera luego de aprobar el pago',
    espera: 'respuesta',
    categoria: 'P2P',
  },
  {
    consulta: 'yo iba a hacer la transacción a otra billetera y puse el contrato de Génesis',
    espera: 'derivar',
  },
  {
    consulta: 'quiero cambiar mi wallet por una nueva de metamask',
    espera: 'respuesta',
    id: 'gen-cambiar-wallet',
  },
  {
    consulta: 'necesito comprar aig para completar mi holdeo donde consigo',
    espera: 'respuesta',
    id: 'gen-hold-como-cubrir',
  },
  {
    /*
     * ESTA EXPECTATIVA ESTABA MAL Y SE CORRIGE EL TEST, NO EL CODIGO.
     * Yo esperaba el listado general de formas de pago; el buscador devuelve
     * la respuesta especifica sobre tarjeta, que es mejor: quien pregunta por
     * tarjeta quiere saber si puede pagar con tarjeta, no leer un catalogo.
     * Un caso en rojo no siempre significa que el codigo falle.
     */
    consulta: 'puedo pagar con tarjeta en la tienda',
    espera: 'respuesta',
    id: 'gevy-tarjeta',
  },
  {
    consulta: 'la senal me dice que compre ahora',
    espera: 'respuesta',
    id: 'gp-no-es-asesoramiento',
  },
  {
    consulta: 'frozen',
    espera: 'respuesta',
    categoria: 'Hold y estado de la cuenta',
  },
  {
    consulta: 'reclame ayer y todavia no me llega nada a la wallet',
    espera: 'respuesta',
    id: 'gen-cuanto-tarda-reclamo',
  },
  {
    consulta: 'tengo 3 usdt y no me deja reclamar',
    espera: 'respuesta',
    id: 'gen-reclamar-minimo',
  },
  {
    consulta: 'quien me puede descongelar la cuenta',
    espera: 'respuesta',
    id: 'gen-descongelar-automatico',
  },
  {
    /*
     * FRASE MEDIDA EN EL PORTAL VIVO (20-ago): con «aunque», «duda» y
     * «aparece» fuera de la puntuación, gana la ficha del hold y no la del
     * P2P. Si este caso vuelve a rojo, alguien sacó los conectores de VACIAS.
     */
    consulta: 'Hola, tengo una duda: mi hold aparece anclado y no baja aunque reclamo. ¿Por qué?',
    espera: 'respuesta',
    categoria: 'Hold y estado de la cuenta',
  },
  {
    consulta: 'Por qué mi hold del 14% sigue anclado y no baja',
    espera: 'respuesta',
    categoria: 'Hold y estado de la cuenta',
  },
  /* Seed E4 (20-ago): booster/staking documentados, compensación DECLARADA. */
  {
    consulta: 'compre el booster y no aparece en mi cuenta',
    espera: 'respuesta',
    id: 'gen-booster-tras-pagar',
  },
  {
    consulta: 'le di cancelar en metamask, se me cobro algo?',
    espera: 'respuesta',
    id: 'gen-cancelar-firma',
  },
  {
    /* porDefinir: el hueco declarado DERIVA — jamás inventa un porcentaje. */
    consulta: 'cuanto paga el binario por equipo',
    espera: 'derivar',
  },
  /* Tren C pieza 2: frases textuales del canal que ANTES derivaban. */
  {
    consulta: 'Tarda demasiado los retiros quiero hacer demostración al instante y no he podido',
    espera: 'respuesta',
    id: 'gen-cuanto-tarda-reclamo',
  },
  {
    consulta: 'Te abre el bacofis de Genesis?',
    espera: 'respuesta',
    id: 'gen-no-reconoce',
  },
  {
    consulta: 'Necesito blanquear la clave',
    espera: 'respuesta',
    id: 'gen-olvide-contrasena',
  },
  {
    consulta: 'el sistema está en mantenimiento???',
    espera: 'respuesta',
    id: 'gen-sistema-caido',
  },
  /* Del REGISTRO VIVO (primera tanda dirigida por datos reales, 21-ago). */
  {
    consulta: 'tengo mi mineria congelada',
    espera: 'respuesta',
    categoria: 'Hold y estado de la cuenta',
  },
  {
    consulta: 'quiero saber cual es la taza de holdeo para activar la mineria',
    espera: 'respuesta',
    id: 'gen-hold-cuanto',
  },
  {
    /* facturación: hueco DECLARADO — deriva con la ficha porDefinir. */
    consulta: 'quiero facturar con datos fiscales de mi empresa',
    espera: 'derivar',
  },
  /* Los que DEBEN callarse: sin relación con nada documentado. */
  {
    consulta: 'a que hora es la reunion de hoy con el equipo',
    espera: 'derivar',
  },
  /*
   * CORTESÍA (E1): la expectativa de «hola buenas tardes» CAMBIA de derivar a
   * cortesia — un saludo no es una pregunta que no entendimos. La condición
   * es estricta: saludo con contenido sigue yendo al corpus (control abajo).
   */
  {
    consulta: 'hola buenas tardes',
    espera: 'cortesia',
  },
  {
    consulta: 'Hola!!',
    espera: 'cortesia',
  },
  {
    consulta: 'muchas gracias muy amable',
    espera: 'cortesia',
  },
  {
    consulta: 'adios, hasta luego',
    espera: 'cortesia',
  },
  {
    consulta: 'como estas?',
    espera: 'cortesia',
  },
  {
    /* CONTROL: saludo + contenido NO es cortesía — va al corpus. */
    consulta: 'buenas, tengo 3 usdt y no me deja reclamar',
    espera: 'respuesta',
    id: 'gen-reclamar-minimo',
  },
]

let fallos = 0
for (const caso of CASOS) {
  const r = responder(caso.consulta)
  let ok = r.tipo === caso.espera
  let detalle = r.tipo === 'respuesta' ? r.pregunta.id : r.tipo

  if (ok && r.tipo === 'respuesta') {
    if (caso.id && r.pregunta.id !== caso.id) ok = false
    if (caso.categoria && r.pregunta.categoria !== caso.categoria) ok = false
    detalle = `${r.pregunta.id} · ${r.pregunta.categoria}`
  }
  if (!ok) fallos++
  console.log(`  ${ok ? 'ok  ' : 'MAL '} ${caso.consulta.slice(0, 62)}`)
  console.log(`        -> ${detalle}${ok ? '' : `   (esperaba ${caso.id ?? caso.categoria ?? caso.espera})`}`)
}

rmSync(salida, { recursive: true, force: true })
if (fallos) {
  console.error(`\nbuscador: ${fallos} de ${CASOS.length} casos mal.`)
  process.exit(1)
}
console.log(`\nbuscador: ${CASOS.length} preguntas reales, todas rutadas donde debían.`)
