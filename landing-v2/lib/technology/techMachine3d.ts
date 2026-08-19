import { EMISSION, INK, VOID } from '@/lib/design/tokens'
import type { TechStackLayerId } from '@/lib/technology/techStackLayout'

/**
 * LA MAQUINA GENESIS EN TRES DIMENSIONES.
 *
 * POR QUE SE MIGRA DE SVG A WEBGL
 * -------------------------------
 * La version SVG llego hasta donde llega el dibujo vectorial y ahi se paro. Lo
 * que le faltaba —y lo que separaba el resultado de la referencia— no era
 * detalle: era VOLUMEN. Y el volumen de la referencia viene de tres cosas que
 * un SVG no puede fingir sin dibujarlas a mano una por una:
 *
 *  1. EL AGUJERO. Cada anillo es un TUBO: se ve la pared interior a traves del
 *     hueco. Eso es oclusion real entre superficies curvas. En SVG hay que
 *     dibujar a mano que tapa a que, para cada anillo y para cada angulo, y
 *     cualquier cambio de camara lo invalida entero.
 *  2. LA LUZ QUE CAE. La referencia tiene el borde superior encendido y la cara
 *     interior en penumbra, con derrame sobre el anillo de al lado. Eso es un
 *     calculo de iluminacion, no un degradado: un `linearGradient` da la
 *     direccion pero no la CURVATURA, y por eso el SVG se leia plano.
 *  3. LA PERSPECTIVA. Cinco elipses aplanadas al mismo factor son cinco elipses;
 *     cinco tubos vistos con una camara son una pila. La diferencia se nota
 *     sobre todo en los anillos de arriba, que en perspectiva real se ven mas
 *     "de canto" que los de abajo.
 *
 * `three` y `@react-three/fiber` YA estan en el proyecto —los usa el hero—, asi
 * que esto no anade peso de bundle. Y el lienzo global esta apagado
 * (`PINTAR_PARTICULAS = false`), asi que tampoco hay un segundo contexto WebGL
 * compitiendo: hoy no hay ninguno vivo.
 *
 * QUE NO SE MIGRA, Y POR QUE
 * --------------------------
 * Rotulos, lecturas y modulos flotantes se quedan en DOM/SVG. Texto dentro de
 * una textura de WebGL pierde nitidez, no lo lee un lector de pantalla, no se
 * puede seleccionar y hay que rehacerlo para cada idioma. La regla es simple:
 * lo que tiene FORMA va al 3D; lo que tiene LETRAS se queda en el documento.
 */

export interface Capa3D {
  id: TechStackLayerId
  label: string
  lectura: string
  /*
   * UNA FRASE, NO DOS LINEAS.
   *
   * Antes eran dos cadenas con el corte puesto a mano para que la llamada
   * quedara equilibrada. Un corte a mano es una decision tomada sobre el
   * ESPAÑOL: en aleman la primera palabra ya no cabe y en arabe el corte cae
   * del lado que no es. Al traducir, un salto de linea fijo deja de ser
   * tipografia y pasa a ser un defecto.
   *
   * Ahora es una frase y el corte lo decide quien pinta: el rotulo del DOM
   * envuelve solo dentro de su ancho maximo, y el respaldo en SVG —donde el
   * texto no envuelve— la parte en dos mitades equilibradas en tiempo de
   * pintado, en el idioma que toque.
   */
  detalle: string
  /** 0 = el de mas abajo. */
  orden: number
  /** Altura del centro del tubo, en unidades de escena. */
  y: number
  /** Radio exterior. */
  re: number
  color: string
  colorAlt: string
  /** Reloj propio del subsistema (ver LATIDOS_ADMITIDOS en motion.ts). */
  latido: number
  /** De que lado sale su lectura. La referencia las reparte a los dos lados. */
  lado: 'izq' | 'der'
}

/**
 * PROPORCIONES DEL TUBO, leidas de la referencia.
 *
 * El hueco interior es el 56 % del radio exterior. Empece en 0,63 y la
 * comparacion EN GRISES —sin color, que es como se juzga el volumen— lo dejo
 * claro: la referencia tiene una corona superior ANCHA y luminosa, y con un
 * hueco de 0,63 esa corona se quedaba en un filo. El agujero sigue existiendo
 * —por el se ve pasar la columna— pero deja de comerse la superficie util.
 */
export const TUBO_HUECO = 0.56
/**
 * ALTURA DEL TUBO — ABSOLUTA, no proporcional al radio.
 *
 * Este fue el error de modelo, no de valor. Lo tenia como una fraccion del radio
 * (`0,19 * re`), y eso hace los anillos de arriba mas BAJOS que los de abajo.
 * Medidos los cantos en recortes ampliados de la referencia:
 *
 *     aplicaciones  54 px  (diametro 330)   canto/radio 0,327
 *     blockchain    56 px  (diametro 367)   canto/radio 0,305
 *     backend       60 px  (diametro 429)   canto/radio 0,280
 *
 * El canto en pixeles es practicamente CONSTANTE —54, 56, 60— y la pequena
 * diferencia la explica la perspectiva: los de arriba estan mas lejos y se ven
 * un 5 % menores. O sea que son cinco plataformas de la MISMA altura y distinto
 * diametro, que es justo lo que uno esperaria de un sistema modular.
 *
 * Con la relacion proporcional que yo tenia, el de arriba salia un 19 % mas
 * bajo que el de abajo y la pila se leia como un cono achatado en vez de como
 * una pila de piezas iguales.
 *
 * 0,86 unidades de escena: con el backend en radio 3,15 da canto/radio 0,273
 * frente al 0,280 medido, y en aplicaciones 0,336 frente a 0,327.
 */
export const TUBO_CANTO = 0.86

/**
 * LOS CINCO ESTRATOS.
 *
 * DIAMETROS, medidos nivel por nivel en recortes ampliados de la referencia y
 * con la perspectiva descontada (los anillos de arriba estan mas lejos y se ven
 * ~5 % menores de lo que son):
 *
 *     aparente:  0,769 · 0,855 · 0,918 · 0,959 · 1,000   (apps -> backend)
 *     en escena: 0,811 · 0,890 · 0,944 · 0,972 · 1,000
 *
 * El salto grande esta entre APLICACIONES y BLOCKCHAIN; de IA hacia abajo el
 * escalon es pequeno. Eso es lo que hace que la pila se lea como una piramide
 * escalonada con una cabeza estrecha, y no como un cono uniforme.
 *
 * Historia de mis errores aqui, porque el patron importa: primero puse 0,63 de
 * estrechamiento (una torre), luego 0,857 uniforme (un cilindro), y solo al
 * medir CADA nivel por separado —en vez de los dos extremos— aparecio la forma
 * real. Medir los extremos e interpolar no es medir.
 *
 * SEPARACION: 119,5 px entre centros para 429 de diametro mayor = 0,279. Con
 * paso 1,76 y diametro 6,30 sale 0,279 exacto.
 *
 * (nota historica) LA SEPARACION fue 2,08 y no 1,80. Salio de 0,286 del diametro mayor, que es lo
 * medido en la referencia, pero ese numero se calculo con el canto a 0,30 del
 * radio. Al subirlo a 0,44 —que es el correcto— los anillos crecieron hacia
 * arriba y hacia abajo y se comieron el aire entre ellos: cada capa tiene que
 * poder leerse como una plataforma independiente, y pegadas dejan de poder.
 * El paso se ajusta al canto nuevo, no al viejo.
 */
export const CAPAS_3D: readonly Capa3D[] = [
  {
    id: 'backend',
    label: 'BACKEND',
    lectura: 'Servicios y APIs',
    detalle: 'APIs robustas, eventos en tiempo real y microservicios modulares.',
    orden: 0, y: 0, re: 3.15,
    color: EMISSION.violetHi, colorAlt: EMISSION.violet, latido: 5.6, lado: 'der',
  },
  {
    id: 'infraestructura',
    label: 'INFRAESTRUCTURA',
    lectura: 'Infraestructura distribuida',
    detalle: 'Escalable, redundante y preparada para millones de interacciones.',
    orden: 1, y: 1.76, re: 3.06,
    color: EMISSION.blueHi, colorAlt: EMISSION.blue, latido: 7.2, lado: 'izq',
  },
  {
    id: 'ia',
    label: 'IA',
    lectura: 'Inteligencia artificial',
    detalle: 'Motor propietario que aprende, predice y optimiza en tiempo real.',
    orden: 2, y: 3.52, re: 2.97,
    color: EMISSION.magenta, colorAlt: EMISSION.magentaHi, latido: 4.8, lado: 'der',
  },
  {
    id: 'blockchain',
    label: 'BLOCKCHAIN',
    lectura: 'Inmutable y descentralizado',
    detalle: 'Transacciones verificables, registros transparentes y sin puntos de falla.',
    orden: 3, y: 5.28, re: 2.80,
    color: EMISSION.violetHi, colorAlt: EMISSION.magenta, latido: 6.4, lado: 'izq',
  },
  {
    id: 'aplicaciones',
    label: 'APLICACIONES',
    lectura: 'Aplicaciones inteligentes',
    detalle: 'Interfaces descentralizadas, experiencias fluidas y seguras.',
    orden: 4, y: 7.04, re: 2.56,
    color: EMISSION.cyan, colorAlt: EMISSION.blueHi, latido: 8, lado: 'der',
  },
] as const

export const CAPA_BASE = CAPAS_3D[0]!
export const CAPA_CIMA = CAPAS_3D[CAPAS_3D.length - 1]!

/**
 * Altura del Genesis Core.
 * Medido: en la referencia el centro del nucleo esta 135 px sobre el centro del
 * anillo de aplicaciones, para 418 px de diametro mayor — 0,32 del diametro.
 */
export const NUCLEO_Y = 9.1
/**
 * Semiancho del recinto hexagonal.
 * Medido: el hexagono ocupa 135 px de ancho contra los 358 del anillo que tiene
 * debajo — el 37,7 %. Con un anillo de radio 2,70 eso da 1,02. Tenia 1,5, que
 * es la mitad del anillo: por eso el nucleo pesaba mas que la cima de la pila.
 */
export const NUCLEO_R = 1.06
/** Altura de la placa base. */
export const SUELO_Y = -1.15

/**
 * LA CAMARA.
 *
 * ELEVACION 17,5°, y sale de una medicion, no del gusto: en la referencia la
 * relacion entre el eje menor y el mayor de los anillos es 0,30, y el seno de la
 * elevacion ES esa relacion. Cualquier otro angulo da una pila que se parece
 * pero no encaja.
 *
 * FOV 30 y no 50. Un objetivo corto exagera la perspectiva y curva la pila; la
 * referencia esta dibujada con un teleobjetivo suave, donde los cinco anillos
 * conservan casi la misma forma y solo cambia el tamano. Con 50° el anillo de
 * abajo saldria mucho mas abierto que el de arriba y la pila se leeria como un
 * embudo.
 */
export const CAMARA = {
  fov: 30,
  /*
   * 30 y no 25,5. MEDIDO sobre la captura: el dibujo ocupaba el 99,6 % del alto
   * del lienzo y 108 pixeles encendidos TOCABAN el borde inferior — o sea que la
   * placa base salia cortada. Una pieza que llega justo al borde no se lee como
   * grande: se lee como mal encuadrada.
   *
   * Alejando la camara a 30, el alto visible pasa de 13,7 a 16,1 unidades de
   * escena para un contenido de 13,7: queda un 15 % de aire repartido arriba y
   * abajo, y la maquina deja de pelearse con su marco.
   */
  distancia: 30,
  /*
   * 10°, NO 17,5°.
   *
   * El seno de la elevacion ES la relacion entre el eje menor y el mayor de las
   * elipses. Medido sobre el anillo de IA de la referencia —el mas legible—:
   * 67 px de alto para 390 de ancho, o sea 0,172, que es sen(9,9°).
   *
   * Yo tenia 0,30 = 17,5°, y esos 7,6 grados de mas son la diferencia entre ver
   * la maquina DE CANTO —con la pared frontal ancha y el interior visible por el
   * hueco, que es lo que la hace parecer hardware— y verla DESDE ARRIBA, donde
   * cada anillo se convierte en un disco y el conjunto en un diagrama.
   */
  elevacion: 10 * (Math.PI / 180),
  /** A que altura mira. Ni al centro geometrico ni al nucleo: al peso visual. */
  objetivoY: 4.05,
} as const

export function posicionCamara(): [number, number, number] {
  const { distancia, elevacion, objetivoY } = CAMARA
  return [0, objetivoY + Math.sin(elevacion) * distancia, Math.cos(elevacion) * distancia]
}

/* ─────────────────────────────────────────────────────────────────────────
   TEXTURAS PROCEDURALES

   Se dibujan en un `<canvas>` en el cliente y NO se cargan como imagen. Tres
   motivos: no anaden peticiones de red, escalan con el dispositivo, y —el que
   de verdad importa aqui— el color de cada capa sale de los tokens del portal,
   asi que no puede desviarse de la marca como si desviaria un PNG exportado.

   Todo lo que parece aleatorio usa SEMILLA. Con `Math.random()` el servidor y
   el cliente pintarian texturas distintas; ademas, un patron que cambia en cada
   recarga impide comparar dos capturas.
   ───────────────────────────────────────────────────────────────────────── */

function semilla(i: number, sal: number): number {
  const x = Math.sin(i * 91.7 + sal * 47.3) * 43758.5453
  return x - Math.floor(x)
}

/** Lienzo listo para usar, o `null` en servidor. */
function lienzo(w: number, h: number): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

/**
 * LA PARED DEL ANILLO — el mapa emisivo que le da densidad.
 *
 * Es lo que separa «un cilindro de color» de «un modulo de hardware». La
 * referencia tiene el canto lleno de ventanillas, canales y nervios, y eso
 * pintado como GEOMETRIA serian miles de nodos por anillo. Como textura son
 * cero nodos y un solo material.
 *
 * El lienzo es 2048 x 256 y se enrolla una vez alrededor del cilindro: a lo
 * ancho hay sitio para ~64 modulos, que es la densidad de la referencia.
 */
export function texturaPared(sal: number, color: string): HTMLCanvasElement | null {
  const W = 2048
  const H = 256
  const c = lienzo(W, H)
  if (!c) return null
  const g = c.getContext('2d')!

  g.fillStyle = VOID.black
  g.fillRect(0, 0, W, H)

  /*
   * DENSIDAD. 96 modulos y 5 filas, no 64 y 3.
   *
   * En la referencia el canto esta LLENO: no quedan tramos de color liso entre
   * pieza y pieza. Con 64 modulos de 3 filas el canto tenia mas hueco que
   * hardware y a distancia se leia como una banda de color con puntitos. La
   * textura es el sitio barato donde comprar densidad — son los mismos cero
   * nodos de geometria— asi que aqui se gasta sin miedo.
   *
   * Cuatro TIPOS de pieza, no uno: ventanilla ancha, ranura fina, punto de
   * conexion y barra de estado. Repetir un solo rectangulo 500 veces produce un
   * patron; mezclar cuatro produce un equipo.
   */
  const MOD = 96
  const anchoMod = W / MOD

  for (let i = 0; i < MOD; i++) {
    const x0 = i * anchoMod

    // nervio estructural entre modulos: la linea vertical que da ritmo
    g.fillStyle = 'rgba(120,140,190,0.34)'
    g.fillRect(x0, 0, 1.5, H)
    // y un segundo nervio mas tenue a mitad de modulo
    g.fillStyle = 'rgba(100,120,170,0.16)'
    g.fillRect(x0 + anchoMod * 0.5, H * 0.14, 1, H * 0.72)

    for (let f = 0; f < 5; f++) {
      const filas = 5
      const alto = H * (f === 2 ? 0.07 : 0.1)
      const y0 = H * 0.11 + f * ((H * 0.76) / filas)
      const n = 2 + Math.floor(semilla(i * 7 + f, sal) * 3)
      for (let k = 0; k < n; k++) {
        const tipo = Math.floor(semilla(i * 23 + f * 7 + k, sal + 31) * 4)
        const base = anchoMod * 0.12 + k * (anchoMod * 0.24)
        const x = x0 + base
        const viva = semilla(i * 17 + f * 5 + k, sal + 9) > 0.58
        g.fillStyle = viva ? color : 'rgba(92,112,162,0.4)'
        g.globalAlpha = viva ? 0.95 : 0.42
        if (tipo === 0) {
          // ventanilla ancha
          g.fillRect(x, y0, anchoMod * (0.16 + semilla(i + k, sal) * 0.2), alto)
        } else if (tipo === 1) {
          // ranura fina
          g.fillRect(x, y0 + alto * 0.3, anchoMod * 0.3, alto * 0.34)
        } else if (tipo === 2) {
          // punto de conexion
          g.beginPath()
          g.arc(x + anchoMod * 0.08, y0 + alto / 2, Math.max(1.4, alto * 0.24), 0, Math.PI * 2)
          g.fill()
        } else {
          // barra de estado: tres marcas seguidas
          for (let m = 0; m < 3; m++) {
            g.fillRect(x + m * anchoMod * 0.07, y0 + alto * 0.2, anchoMod * 0.045, alto * 0.6)
          }
        }
      }
    }
    g.globalAlpha = 1
  }

  // canales de luz horizontales: arriba y abajo, brillantes. Son los que en la
  // referencia hacen que el canto parezca tener labio metalico
  const canal = g.createLinearGradient(0, 0, 0, H)
  canal.addColorStop(0, color)
  canal.addColorStop(0.09, 'rgba(0,0,0,0)')
  canal.addColorStop(0.91, 'rgba(0,0,0,0)')
  canal.addColorStop(1, color)
  g.fillStyle = canal
  g.globalAlpha = 0.85
  g.fillRect(0, 0, W, H)
  g.globalAlpha = 1

  return c
}

/**
 * EL REALCE ESPECULAR del borde superior — una banda de luz que NO da la vuelta.
 *
 * Es el detalle que mas separa «cilindro de color» de «pieza metalica». Un
 * reflejo especular no rodea el objeto: aparece donde la superficie devuelve la
 * luz clave hacia la camara, o sea en un arco corto, y se apaga en el resto. Un
 * borde brillante uniforme se lee como un tubo de neon; un arco brillante se lee
 * como metal bajo un foco.
 *
 * La textura es una tira que se enrolla una vez alrededor del anillo: dos
 * maximos —el principal hacia la luz clave de arriba-izquierda, y uno menor y
 * mas frio del relleno magenta de la derecha— y negro en el resto.
 */
export function texturaEspecular(): HTMLCanvasElement | null {
  const W = 1024
  const H = 8
  const c = lienzo(W, H)
  if (!c) return null
  const g = c.getContext('2d')!
  g.fillStyle = VOID.black
  g.fillRect(0, 0, W, H)

  const brillo = (centro: number, ancho: number, fuerza: number, col: string) => {
    const grad = g.createLinearGradient((centro - ancho) * W, 0, (centro + ancho) * W, 0)
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(0.5, col)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    g.globalAlpha = fuerza
    g.fillStyle = grad
    g.fillRect((centro - ancho) * W, 0, ancho * 2 * W, H)
    g.globalAlpha = 1
  }
  // clave: arriba-izquierda de la escena cae en ~0,32 del giro de la textura
  brillo(0.32, 0.1, 1, INK.base)
  // relleno magenta de la derecha
  brillo(0.78, 0.07, 0.55, EMISSION.magentaHi)

  return c
}

/**
 * LA CORONA SUPERIOR — el anillo visto desde arriba.
 *
 * Radial, porque lo es: los sectores salen del centro. La referencia tiene la
 * corona mas encendida cerca de los dos bordes y apagada en medio, que es como
 * se comporta una superficie curva bajo una luz cenital.
 */
export function texturaCorona(sal: number, color: string): HTMLCanvasElement | null {
  const S = 1024
  const c = lienzo(S, S)
  if (!c) return null
  const g = c.getContext('2d')!
  const cx = S / 2
  const R = S / 2

  g.fillStyle = VOID.black
  g.fillRect(0, 0, S, S)

  // sectores radiales
  const N = 72
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2
    const a1 = ((i + 0.62) / N) * Math.PI * 2
    const viva = semilla(i, sal + 3) > 0.55
    g.beginPath()
    g.arc(cx, cx, R * 0.98, a0, a1)
    g.arc(cx, cx, R * 0.66, a1, a0, true)
    g.closePath()
    g.fillStyle = viva ? color : 'rgba(80,100,150,0.5)'
    g.globalAlpha = viva ? 0.72 : 0.3
    g.fill()
  }
  g.globalAlpha = 1

  // labio brillante en los dos bordes de la corona
  for (const [r, ancho, alfa] of [[0.985, 5, 1], [0.655, 4, 0.8]] as const) {
    g.beginPath()
    g.arc(cx, cx, R * r, 0, Math.PI * 2)
    g.strokeStyle = color
    g.lineWidth = ancho
    g.globalAlpha = alfa
    g.stroke()
  }
  g.globalAlpha = 1

  return c
}

/**
 * LA PLACA BASE — circuiteria radial que ancla la maquina.
 *
 * Recorridos con QUIEBRO, nunca diagonales libres: es exactamente lo que
 * distingue una placa impresa de un grafico de dispersion, y cuesta los mismos
 * pixeles.
 */
export function texturaSuelo(): HTMLCanvasElement | null {
  const S = 2048
  const c = lienzo(S, S)
  if (!c) return null
  const g = c.getContext('2d')!
  const cx = S / 2
  const R = S / 2

  g.clearRect(0, 0, S, S)
  g.lineCap = 'round'
  g.lineJoin = 'round'

  const pt = (r: number, a: number) => [cx + Math.cos(a) * R * r, cx + Math.sin(a) * R * r] as const

  // anillos concentricos: las capas de la placa
  for (const [r, w, alfa] of [[0.96, 3, 0.5], [0.74, 2, 0.3], [0.5, 2, 0.26], [0.3, 2, 0.22]] as const) {
    g.beginPath()
    g.arc(cx, cx, R * r, 0, Math.PI * 2)
    g.strokeStyle = EMISSION.violetHi
    g.lineWidth = w
    g.globalAlpha = alfa
    g.stroke()
  }

  // trazas
  const N = 72
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const r0 = 0.2 + semilla(i, 31) * 0.14
    const r1 = 0.62 + semilla(i, 37) * 0.34
    const q = 0.4 + semilla(i, 41) * 0.24
    const giro = (semilla(i, 47) - 0.5) * 0.32
    const [x0, y0] = pt(r0, a)
    const [x1, y1] = pt(q, a)
    const [x2, y2] = pt(q, a + giro)
    const [x3, y3] = pt(r1, a + giro)
    g.beginPath()
    g.moveTo(x0, y0)
    g.lineTo(x1, y1)
    g.lineTo(x2, y2)
    g.lineTo(x3, y3)
    g.strokeStyle = i % 4 === 0 ? EMISSION.cyan : EMISSION.violetHi
    g.lineWidth = 2
    g.globalAlpha = 0.42
    g.stroke()

    if (semilla(i, 43) > 0.4) {
      g.beginPath()
      g.arc(x3, y3, 4.5, 0, Math.PI * 2)
      g.fillStyle = i % 4 === 0 ? EMISSION.cyan : EMISSION.violetHi
      g.globalAlpha = 0.75
      g.fill()
    }
  }
  g.globalAlpha = 1

  // el centro se apaga: ahi se apoya la maquina y la textura solo seria ruido
  const centro = g.createRadialGradient(cx, cx, 0, cx, cx, R)
  centro.addColorStop(0, 'rgba(0,0,0,1)')
  centro.addColorStop(0.24, 'rgba(0,0,0,0.75)')
  centro.addColorStop(0.42, 'rgba(0,0,0,0)')
  g.globalCompositeOperation = 'destination-out'
  g.fillStyle = centro
  g.fillRect(0, 0, S, S)

  // y el borde se desvanece, para que la placa no acabe en un corte
  const borde = g.createRadialGradient(cx, cx, R * 0.72, cx, cx, R)
  borde.addColorStop(0, 'rgba(0,0,0,0)')
  borde.addColorStop(1, 'rgba(0,0,0,1)')
  g.fillStyle = borde
  g.fillRect(0, 0, S, S)
  g.globalCompositeOperation = 'source-over'

  return c
}

/**
 * LA MARCA GENESIS — el estallido radial con la G.
 *
 * ESTE ES EL ELEMENTO MAS RECONOCIBLE DE LA PIEZA y por eso se dibuja de
 * verdad, no se sugiere. La identidad de Genesis no es «un hexagono con una
 * letra»: es un ESTALLIDO RADIAL de decenas de segmentos que recorren el
 * espectro de marca, con la G encima. Con 16 lineas parecia una rueda dentada;
 * con 72 segmentos de longitud variable parece una emision.
 *
 * El degradado va por ANGULO —cian arriba, azul, violeta, magenta y vuelta—
 * porque asi esta en el logo: es un giro por el espectro, no un degradado
 * lineal cruzando la figura.
 */
export function texturaMarca(): HTMLCanvasElement | null {
  const S = 1024
  const c = lienzo(S, S)
  if (!c) return null
  const g = c.getContext('2d')!
  const cx = S / 2
  const R = S / 2

  g.clearRect(0, 0, S, S)

  const ESPECTRO = [EMISSION.cyan, EMISSION.blueHi, EMISSION.violetHi, EMISSION.magenta, EMISSION.magentaHi]
  const N = 72

  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2
    // tres longitudes alternas: un estallido de segmentos iguales vuelve a ser
    // una rueda; la variacion es lo que lo hace leer como energia
    const largo = [0.94, 0.7, 0.82, 0.6][i % 4]!
    const r0 = R * 0.3
    const r1 = R * largo
    const col = ESPECTRO[Math.floor(((i / N) * ESPECTRO.length * 2) % ESPECTRO.length)]!
    g.beginPath()
    g.moveTo(cx + Math.cos(a) * r0, cx + Math.sin(a) * r0)
    g.lineTo(cx + Math.cos(a) * r1, cx + Math.sin(a) * r1)
    g.strokeStyle = col
    g.lineWidth = i % 2 === 0 ? 11 : 6
    g.globalAlpha = i % 2 === 0 ? 0.95 : 0.6
    g.lineCap = 'round'
    g.stroke()
  }
  g.globalAlpha = 1

  return c
}

/**
 * EL DISCO CON LA G — en una textura APARTE, y no por orden.
 *
 * Los rayos van en un plano ADITIVO: la luz se suma, que es lo que hace que el
 * estallido se vea encendido. Una G blanca dentro de esa misma textura se suma
 * tambien, sobre un disco ya brillante y con el bloom encima — y deja de ser
 * una letra para ser una mancha. Es exactamente lo que se vio en la primera
 * captura del nucleo.
 *
 * Separada, el disco se pinta con mezcla normal y opaco: la G va oscura sobre
 * claro o clara sobre oscuro, pero nunca sumada. La marca es lo unico de la
 * pieza que tiene que leerse SIEMPRE.
 */
export function texturaDisco(): HTMLCanvasElement | null {
  const S = 512
  const c = lienzo(S, S)
  if (!c) return null
  const g = c.getContext('2d')!
  const cx = S / 2
  const R = S / 2

  g.clearRect(0, 0, S, S)

  g.beginPath()
  g.arc(cx, cx, R * 0.9, 0, Math.PI * 2)
  g.fillStyle = 'rgba(3,5,14,0.96)'
  g.fill()
  g.strokeStyle = EMISSION.cyan
  g.lineWidth = 9
  g.globalAlpha = 0.9
  g.stroke()
  g.globalAlpha = 1

  /*
   * LA G SE DIBUJA, NO SE ESCRIBE.
   *
   * `fillText` depende de que la fuente este cargada en el momento de generar
   * la textura. JetBrains Mono se carga como webfont y el lienzo se genera al
   * montar: la carrera se pierde a menudo, y cuando se pierde no falla nada —
   * sale otra letra, en otra fuente, y ya esta. Un trazo es siempre el mismo
   * en todos los navegadores y no espera a nadie.
   */
  const r = R * 0.5
  const w = R * 0.19
  g.strokeStyle = INK.base
  g.lineWidth = w
  g.lineCap = 'butt'
  g.lineJoin = 'miter'

  // el arco de la G: abierto por la derecha
  g.beginPath()
  g.arc(cx, cx, r, -0.32 * Math.PI, 0.16 * Math.PI, true)
  g.stroke()

  // el travesano y la barra que lo remata
  g.beginPath()
  g.moveTo(cx + r * Math.cos(0.16 * Math.PI), cx + r * Math.sin(0.16 * Math.PI))
  g.lineTo(cx + r * 1.02, cx + r * 0.3)
  g.lineTo(cx + r * 0.12, cx + r * 0.3)
  g.stroke()

  return c
}

/**
 * GRADIENTE VERTICAL DE LA COLUMNA — violeta abajo, cian arriba.
 *
 * Va como textura y no como material por capa porque la columna es UNA pieza:
 * partirla en cinco tramos de color plano deshace justo lo que tiene que
 * comunicar, que es continuidad.
 */
export function texturaColumna(): HTMLCanvasElement | null {
  const c = lienzo(8, 512)
  if (!c) return null
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 512, 0, 0)
  grad.addColorStop(0, EMISSION.violet)
  grad.addColorStop(0.38, EMISSION.magenta)
  grad.addColorStop(0.72, EMISSION.violetHi)
  grad.addColorStop(1, EMISSION.cyan)
  g.fillStyle = grad
  g.fillRect(0, 0, 8, 512)
  return c
}
