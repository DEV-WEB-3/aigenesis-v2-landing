/**
 * LINAJE — ninguna particula aparece de la nada.
 *
 * Antes de este archivo, once de doce transiciones empezaban tirando una
 * dispersion ALEATORIA sobre el buffer: `Math.random()` en una anilla, y de ahi
 * la materia viajaba a la figura nueva. Eso tiene dos consecuencias que se ven:
 *
 *   1. La seccion anterior se BORRA de golpe. Cada cambio de seccion es un
 *      corte, no una transicion — la materia teletransporta y despues viaja.
 *   2. La direccion de entrada no significa nada. Cinco secciones entraban
 *      «desde el exterior» y cuatro de las cinco eran literalmente la misma
 *      anilla con constantes movidas por debajo del umbral perceptible:
 *      r = 0,80+0,75 · 0,75+0,80 · 0,85+0,95, todas con y×0,88.
 *
 * La unica que sabia de donde venia era `scatterEcosystemFromTrust`. Una de doce.
 *
 * La observacion que hace innecesario inventar nada: en el instante del cambio
 * de seccion, el buffer de posiciones YA CONTIENE la salida de la seccion
 * anterior. El linaje no hay que construirlo — hay que dejar de descartarlo.
 *
 * Asi que la entrada no REEMPLAZA el estado anterior: lo TRANSFORMA segun el
 * gesto de la seccion que llega. Y como la seccion 1 es la esfera, todo el
 * portal desciende de ella por una cadena que nunca se corta:
 *
 *   esfera → trust → ecosistema → token → mining → booster → staking →
 *   gpulse → goracle → marketplace → comunidad → tecnologia → roadmap → portal
 *
 * Beneficio secundario, y no menor: partiendo del estado real anterior los
 * recorridos son CORTOS. La dispersion aleatoria obligaba a cada particula a
 * cruzar una distancia arbitraria, y por eso la llegada necesitaba tiempos
 * largos para no parecer un salto.
 */

import { MOVIMIENTO_POR_SECCION, type Movimiento } from '@/lib/design/motion'
import { SECTIONS } from '@/lib/routes'

/**
 * El gesto de cada seccion por su INDICE, que es lo que maneja el sistema de
 * particulas. Se deriva de SECTIONS, asi que reordenar el portal reordena los
 * gestos automaticamente y no hay una segunda lista que mantener de acuerdo.
 */
const MOVIMIENTO_POR_INDICE: readonly Movimiento[] = SECTIONS.map(
  (s) => MOVIMIENTO_POR_SECCION[s.id],
)

export function movimientoDeIndice(indice: number): Movimiento {
  return MOVIMIENTO_POR_INDICE[indice] ?? 'origen'
}

/**
 * Cuanto se aparta la materia de su sitio antes de entrar.
 *
 * Es el «impulso previo» del gesto: para que una condensacion se LEA como
 * condensacion, la materia tiene que estar mas abierta de lo que acabara. El
 * numero es un factor sobre el radio actual, no una posicion absoluta — por eso
 * no hace falta una constante por seccion, y por eso funciona igual viniendo de
 * cualquier sitio.
 */
const IMPULSO: Record<Movimiento, { radio: number; giro: number; empuje: number }> = {
  /** Abrir para poder cerrarse. */
  condensar: { radio: 1.9, giro: 0, empuje: 0 },
  /** Recogerse para poder abrirse en capas. */
  diferenciar: { radio: 0.28, giro: 0, empuje: 0 },
  /** No acercarse ni alejarse: llegar girando. */
  orbitar: { radio: 1.0, giro: -0.95, empuje: 0 },
  /** Recogerse al nucleo para poder salir despedido. */
  dispersar: { radio: 0.18, giro: 0, empuje: 0 },
  /** Abrirse mas que nadie, para que reunirse signifique algo. */
  converger: { radio: 2.15, giro: 0.3, empuje: 0 },
  /** No cambiar de radio: venir de detras y pasar de largo. */
  avanzar: { radio: 1.0, giro: 0, empuje: -1.45 },
  /** El hero no entra desde ningun sitio: es el sitio. */
  origen: { radio: 1.0, giro: 0, empuje: 0 },
}

/**
 * Desorden minimo, para que el impulso no se lea como una figura geometrica.
 *
 * Sin esto, «abrir el radio ×1,9» convierte cualquier forma en una copia
 * escalada de si misma, y una copia escalada se percibe como un zoom, no como
 * materia. Con un 6 % de ruido deja de haber figura y vuelve a haber polvo.
 */
const DESORDEN = 0.06

/**
 * Techo del radio de entrada, en unidades de escena.
 *
 * La escena util mide unos ±2. Medido en el camino ANTIGUO —sin linaje— el
 * radio maximo se dispara a 169,7 al entrar en booster: ya habia un
 * desbordamiento ahi, tapado porque la dispersion aleatoria reescribia todas
 * las posiciones en cada transicion y lo borraba antes de que se acumulara.
 *
 * El linaje no puede permitirse ese borrado —es justo lo que vino a quitar—,
 * asi que el techo tiene que ser explicito. 6 deja sitio de sobra para el gesto
 * mas abierto (converger, ×2,15 sobre un radio normal de ~2) y corta cualquier
 * realimentacion antes de que crezca.
 */
const RADIO_MAXIMO = 6

/**
 * Radio medio al que se normaliza la nube de entrada.
 *
 * Trust no vive en la misma escala que las demas: sus particulas estan a radio
 * ~21 mientras el resto de la escena mide ~2. Medido: al entrar en ecosistema
 * desde Trust, incluso despues de encoger ×0,28, la nube salia a radio 6 y
 * chocaba con el techo.
 *
 * Recortar particula a particula arregla el numero y ROMPE LA FORMA: las que
 * pasan del techo se aplastan contra una esfera y las de dentro no se mueven,
 * asi que la figura se deforma justo en el borde. Y la forma es lo unico que el
 * linaje viene a conservar.
 *
 * Escalar la nube ENTERA por un mismo factor conserva la figura exacta y solo
 * cambia su tamano — que es lo correcto: el linaje hereda la forma de la
 * seccion anterior, no su sistema de coordenadas.
 */
const RADIO_NORMA = 2.6

/**
 * Recuperacion ante posiciones invalidas.
 *
 * Medido: el buffer de posiciones YA contenia NaN en cuatro transiciones del
 * camino antiguo (gpulse, marketplace, comunidad, technology). No se notaba
 * porque el siguiente `Math.random()` lo sobrescribia entero.
 *
 * Descender del estado anterior significa heredar tambien lo que este roto, y
 * con un centroide una sola particula invalida envenena las 600. Asi que las
 * invalidas no se propagan: se reincorporan cerca del centro, que es de donde
 * habrian salido si nunca se hubieran perdido.
 */
function finito(v: number | undefined): boolean {
  return typeof v === 'number' && Number.isFinite(v)
}

/**
 * APARCADAS — las particulas que este frame no deben verse.
 *
 * ParticleMorphSystem esconde una particula mandandola a (-120, -120, 0), en
 * doce sitios distintos. No es una posicion: es un estado, «esta apagada».
 *
 * Descubierto midiendo, y por poco: el radio de entrada salia 169,7 en varias
 * transiciones, que es exactamente hypot(120, 120). Sin esta comprobacion el
 * linaje arrastraba las aparcadas de vuelta al encuadre y el techo de radio las
 * dejaba a distancia 6 — o sea, HACIENDO VISIBLE lo que estaba apagado. El
 * gesto habria funcionado y la seccion habria salido con materia de sobra que
 * nadie pidio.
 *
 * El umbral es -100 porque la escena util mide ±2: no hay ambiguedad posible
 * entre una particula viva y una aparcada.
 */
const APARCADA_X = -100

function aparcada(x: number | undefined): boolean {
  return typeof x === 'number' && x <= APARCADA_X
}

/**
 * Rellena `morph` con el punto de partida de la entrada, derivado del estado
 * actual de las particulas y del gesto de la seccion que llega.
 *
 * @param pos    posiciones ACTUALES — la salida de la seccion anterior
 * @param morph  buffer a rellenar (se escribe en sitio)
 * @param mov    gesto de la seccion que entra
 * @param limite cuantas particulas estan activas
 */
export interface DiagnosticoLinaje {
  /**
   * Cuanto del estado anterior sobrevive en la entrada, de 0 a 1.
   *
   * Es la correlacion de Pearson entre las posiciones de salida y las de
   * entrada. Con linaje tiene que ser ALTA: la entrada es una transformacion de
   * lo anterior, no una sustitucion. Con la dispersion aleatoria de antes es
   * indistinguible de cero, porque `Math.random()` no guarda relacion con nada.
   *
   * Este numero es la unica forma de comprobar el linaje sin creerselo: una
   * transicion puede PARECER continua por casualidad si las dos figuras se
   * parecen, y puede parecer un corte aunque el linaje funcione si el gesto es
   * grande. La correlacion no se deja enganar por ninguno de los dos casos.
   */
  correlacion: number
  /** Distancia media que recorre cada particula desde su sitio anterior. */
  desplazamiento: number
}

export function entradaDesde(
  pos: Float32Array,
  morph: Float32Array,
  mov: Movimiento,
  limite: number,
): DiagnosticoLinaje {
  const { radio, giro, empuje } = IMPULSO[mov]

  // ── PASADA 1 ── centroide y radio medio de lo que hay ahora.
  //
  // Centro = centroide, deliberadamente NO una constante por seccion: el gesto
  // tiene que funcionar viniendo de cualquier forma, y un centro fijo haria que
  // entrar desde una figura descentrada pareciera un desplazamiento lateral en
  // vez de una apertura.
  let cx = 0
  let cy = 0
  let cz = 0
  let validas = 0
  for (let i = 0; i < limite; i++) {
    const bi = i * 3
    if (aparcada(pos[bi])) continue
    if (!finito(pos[bi]) || !finito(pos[bi + 1]) || !finito(pos[bi + 2])) continue
    cx += pos[bi]!
    cy += pos[bi + 1]!
    cz += pos[bi + 2]!
    validas++
  }
  if (validas > 0) {
    cx /= validas
    cy /= validas
    cz /= validas
  }

  let radioEntrada = 0
  for (let i = 0; i < limite; i++) {
    const bi = i * 3
    if (aparcada(pos[bi])) continue
    if (!finito(pos[bi]) || !finito(pos[bi + 1]) || !finito(pos[bi + 2])) continue
    radioEntrada += Math.hypot(pos[bi]! - cx, pos[bi + 1]! - cy, pos[bi + 2]! - cz)
  }
  radioEntrada = validas > 0 ? radioEntrada / validas : 0

  /**
   * Escala, decidida ANTES de escribir nada.
   *
   * Aqui hubo un fallo que solo se ve midiendo: `pos` y `morph` son EL MISMO
   * array —el buffer de posiciones vivas—, asi que una segunda pasada que
   * releyera `pos` para normalizar estaria leyendo lo que la primera acaba de
   * escribir. Comparaba el resultado consigo mismo: desplazamiento 0 y una
   * correlacion falseada de 0,99 a 0,20.
   *
   * Con el factor calculado por adelantado hay una sola pasada de escritura, y
   * el problema no puede volver.
   *
   * Solo ENCOGE. Ampliar una nube que ya cabe la sacaria del encuadre para
   * cumplir un numero que nadie pidio.
   */
  const radioSalida = radio * radioEntrada
  const ajuste = radioSalida > RADIO_NORMA ? RADIO_NORMA / radioSalida : 1
  const radioEf = radio * ajuste
  const empujeEf = empuje * ajuste

  const cos = Math.cos(giro)
  const sen = Math.sin(giro)

  // acumuladores para la correlacion de Pearson entre salida y entrada
  let sa = 0
  let sb = 0
  let saa = 0
  let sbb = 0
  let sab = 0
  let sd = 0
  // Cuenta solo las particulas que el gesto TOCA. Las aparcadas se saltan, y
  // meterlas en la media diluiria la medida con valores que nadie movio.
  let medidas = 0

  // ── PASADA 2 ── la unica que escribe.
  for (let i = 0; i < limite; i++) {
    const bi = i * 3

    // Una aparcada sigue aparcada. El gesto no la toca y no entra en la medida:
    // arrastrarla al encuadre seria encender una particula que esta apagada.
    if (aparcada(pos[bi])) {
      morph[bi] = pos[bi]!
      morph[bi + 1] = pos[bi + 1]!
      morph[bi + 2] = pos[bi + 2]!
      continue
    }

    const valida = finito(pos[bi]) && finito(pos[bi + 1]) && finito(pos[bi + 2])

    // Una particula perdida vuelve cerca del centro. No arrastra su NaN al
    // resto ni desaparece del recuento: se reincorpora al cuerpo.
    const ox = valida ? pos[bi]! : cx
    const oy = valida ? pos[bi + 1]! : cy
    const oz = valida ? pos[bi + 2]! : cz

    let dx = ox - cx
    let dy = oy - cy
    const dz = oz - cz

    if (giro !== 0) {
      const rx = dx * cos - dy * sen
      const ry = dx * sen + dy * cos
      dx = rx
      dy = ry
    }

    let nx = cx + dx * radioEf + empujeEf + (Math.random() - 0.5) * DESORDEN
    let ny = cy + dy * radioEf + (Math.random() - 0.5) * DESORDEN
    // La profundidad se comprime siempre: el portal se lee de frente, y dejar
    // que z crezca con el radio manda materia por delante de la camara.
    let nz = cz + dz * Math.min(radioEf, 1.15) + (Math.random() - 0.5) * DESORDEN * 0.5

    // Techo duro, como ultima red. La normalizacion de arriba deberia haber
    // resuelto el tamano; esto corta un desbordamiento aguas arriba antes de
    // que se multiplique, porque el linaje —a proposito— ya no reescribe el
    // buffer desde cero en cada transicion.
    const r = Math.hypot(nx, ny, nz)
    if (r > RADIO_MAXIMO) {
      const k = RADIO_MAXIMO / r
      nx *= k
      ny *= k
      nz *= k
    }

    morph[bi] = nx
    morph[bi + 1] = ny
    morph[bi + 2] = nz

    sa += ox + oy + oz
    sb += nx + ny + nz
    saa += ox * ox + oy * oy + oz * oz
    sbb += nx * nx + ny * ny + nz * nz
    sab += ox * nx + oy * ny + oz * nz
    sd += Math.hypot(nx - ox, ny - oy, nz - oz)
    medidas++
  }

  const n = medidas * 3
  if (n === 0) return { correlacion: 0, desplazamiento: 0 }

  const cov = sab / n - (sa / n) * (sb / n)
  const va = saa / n - (sa / n) ** 2
  const vb = sbb / n - (sb / n) ** 2
  const den = Math.sqrt(va * vb)

  return {
    correlacion: den > 1e-9 ? cov / den : 0,
    desplazamiento: sd / medidas,
  }
}

/**
 * La misma medida, aplicada a DOS buffers cualesquiera.
 *
 * Existe para poder medir el camino viejo con la misma vara que el nuevo. Una
 * correlacion alta no dice nada si no se sabe cuanto daba antes: podria estar
 * midiendo que las dos figuras se parecen, no que hay linaje.
 */
export function correlacionEntre(
  a: Float32Array,
  b: Float32Array,
  limite: number,
): DiagnosticoLinaje {
  let sa = 0
  let sb = 0
  let saa = 0
  let sbb = 0
  let sab = 0
  let sd = 0
  const n = limite * 3
  for (let i = 0; i < limite; i++) {
    const bi = i * 3
    for (let k = 0; k < 3; k++) {
      const x = a[bi + k]!
      const y = b[bi + k]!
      sa += x
      sb += y
      saa += x * x
      sbb += y * y
      sab += x * y
    }
    sd += Math.hypot(b[bi]! - a[bi]!, b[bi + 1]! - a[bi + 1]!, b[bi + 2]! - a[bi + 2]!)
  }
  const cov = sab / n - (sa / n) * (sb / n)
  const den = Math.sqrt((saa / n - (sa / n) ** 2) * (sbb / n - (sb / n) ** 2))
  return {
    correlacion: den > 1e-9 ? cov / den : 0,
    desplazamiento: limite > 0 ? sd / limite : 0,
  }
}

/**
 * La reversa de la fase, en una linea.
 *
 * En `false`, ParticleMorphSystem vuelve a las dispersiones aleatorias de
 * antes, que siguen en el archivo. Esta aqui y no en una variable de entorno a
 * proposito: una bandera de entorno se auto-perpetua y acabas sin saber que
 * camino corre en produccion.
 */
export const USAR_LINAJE = true
