'use client'

import { EMISSION, INK } from '@/lib/design/tokens'
import {
  ARQ_EJE_X,
  ARQ_NUCLEO_Y,
  ARQ_NUCLEO_R,
  ARQ_NUCLEO_S,
} from '@/lib/technology/techArchitecture'

/**
 * EL GENESIS CORE — la pieza central, y la unica que lleva la marca.
 *
 * POR QUE NO ES UN HEXAGONO CON UNA G
 * -----------------------------------
 * Un hexagono con una letra dentro es el remate por defecto de cualquier
 * diagrama tecnico: no dice Genesis, dice «aqui va un logo». La identidad real
 * de Genesis es RADIAL —un estallido de segmentos en el espectro de marca
 * alrededor de un centro—, y esa estructura es reconocible a 20 px mientras que
 * un hexagono generico no lo es a ningun tamano.
 *
 * TRES CAPAS, Y CADA UNA HACE UN TRABAJO DISTINTO
 * -----------------------------------------------
 *  1. CAMARA — un recinto octogonal de cristal con escuadras de sujecion. Da la
 *     lectura de «contencion»: esto no es un adorno flotando, es algo GUARDADO.
 *     Va a opacidad baja y sin relleno solido a proposito: un cristal que tapa
 *     lo que contiene deja de ser cristal.
 *  2. MARCA — la estructura radial Genesis con la G. Respira dentro de la
 *     camara, no la llena: el aire entre las dos es lo que hace que se lea como
 *     contenida y no como pegada.
 *  3. NUCLEO — un punto diminuto en el centro. Es la fuente: de el sale la
 *     columna que alimenta los cinco estratos, y por eso es el elemento mas
 *     brillante de todo el SVG pese a medir medio punto.
 *
 * Las particulas en orbita van con `animateMotion` sobre una elipse y NO con la
 * maquinaria de contrarrotacion del reloj de staking. Alli hacia falta porque
 * el cuerpo en orbita tenia que mantenerse REDONDO sobre una elipse muy
 * aplanada; aqui son puntos, y un punto no tiene orientacion que corregir.
 */
export default function ArqNucleo({
  idHalo, idOrbita,
}: { idHalo: string; idOrbita: string }) {
  const CX = ARQ_EJE_X
  const CY = ARQ_NUCLEO_Y
  const R = ARQ_NUCLEO_R

  /** Vertices de un recinto octogonal al radio pedido. */
  const octogonoA = (k: number) => Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8
    return `${(CX + Math.cos(a) * R * k).toFixed(2)},${(CY + Math.sin(a) * R * k * 0.94).toFixed(2)}`
  }).join(' ')
  const octogono = octogonoA(0.82)
  const octogonoExt = octogonoA(1)

  /**
   * ESPECTRO GENESIS. Cuatro colores repartidos por el giro completo, no un
   * degradado: los segmentos son piezas discretas y un degradado continuo los
   * fundiria en una mancha.
   */
  const ESPECTRO = [EMISSION.cyan, EMISSION.blueHi, EMISSION.violetHi, EMISSION.magenta]
  const RAYOS = 16

  return (
    <g className="arq__nucleo" aria-hidden="true">
      {/* halo: la luz que el nucleo derrama sobre lo que tiene cerca */}
      <circle
        cx={CX} cy={CY} r={R * 2.1}
        fill={`url(#${idHalo})`}
        className="arq__nucleo-halo"
      />

      {/* ── 1. CAMARA DE CONTENCION ────────────────────────────────── */}
      <g className="arq__camara">
        {/*
          DOS RECINTOS, no uno. Un solo poligono con una marca dentro es un
          icono; dos con aire entre ellos son una camara — el hueco es lo que
          comunica «esto contiene algo», y no cuesta mas que un nodo.
        */}
        <polygon
          points={octogonoExt}
          fill="none" stroke={EMISSION.violetHi} strokeWidth="0.16" opacity="0.35"
        />
        <polygon
          points={octogono}
          fill={EMISSION.cyan} fillOpacity="0.05"
          stroke={EMISSION.cyan} strokeWidth="0.22" opacity="0.55"
        />
        {/* aros de contencion: arriba y abajo, aplanados como todo lo demas */}
        {[-1, 1].map((s) => (
          <ellipse
            key={`aro${s}`}
            cx={CX} cy={CY + s * R * 0.82} rx={R * 0.66} ry={R * 0.2}
            fill="none" stroke={EMISSION.cyan} strokeWidth="0.18" opacity="0.4"
          />
        ))}
        {/*
          ESCUADRAS. Cuatro piezas de sujecion en las esquinas. Son el detalle
          que separa «forma geometrica» de «pieza montada»: un objeto real esta
          sujeto por algo, y ese algo se ve.
        */}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
          <path
            key={`esc-${i}`}
            d={`M${(CX + sx * R * 0.86).toFixed(2)},${(CY + sy * R * 0.5).toFixed(2)}
                L${(CX + sx * R * 0.86).toFixed(2)},${(CY + sy * R * 0.78).toFixed(2)}
                L${(CX + sx * R * 0.55).toFixed(2)},${(CY + sy * R * 0.78).toFixed(2)}`}
            fill="none" stroke={INK.muted} strokeWidth="0.26"
            opacity="0.5" strokeLinecap="round" strokeLinejoin="round"
          />
        ))}
        {/* brillo de cristal: una diagonal que recorre la camara */}
        <polygon points={octogono} className="arq__camara-brillo" fill={INK.base} />
      </g>

      {/* ── 2. LA MARCA ────────────────────────────────────────────── */}
      <g className="arq__marca">
        {Array.from({ length: RAYOS }, (_, i) => {
          const a = (i / RAYOS) * Math.PI * 2
          // segmentos de dos longitudes alternas: un estallido regular se lee
          // como una rueda dentada, no como una emision
          const largo = i % 2 === 0 ? 0.62 : 0.44
          const r0 = R * 0.26
          const r1 = R * largo
          return (
            <line
              key={`rayo-${i}`}
              x1={(CX + Math.cos(a) * r0).toFixed(2)}
              y1={(CY + Math.sin(a) * r0 * 0.94).toFixed(2)}
              x2={(CX + Math.cos(a) * r1).toFixed(2)}
              y2={(CY + Math.sin(a) * r1 * 0.94).toFixed(2)}
              stroke={ESPECTRO[i % ESPECTRO.length]}
              strokeWidth={i % 2 === 0 ? 0.5 : 0.3}
              strokeLinecap="round"
              opacity={i % 2 === 0 ? 0.9 : 0.55}
            />
          )
        })}
        {/*
          EL DISCO DE LA MARCA ES OPACO, no translucido.

          Con relleno al 4 % los rayos se veian a traves y la G quedaba sobre un
          fondo rayado, ilegible. La marca es lo unico del dibujo que tiene que
          leerse SIEMPRE: es la que dice de quien es la maquina.
        */}
        <circle
          cx={CX} cy={CY} r={R * 0.3}
          fill="rgba(2,4,10,0.92)"
          stroke={EMISSION.cyan} strokeWidth="0.22" opacity="0.85"
        />
        <text className="arq__nucleo-marca" x={CX} y={CY} fill={INK.base} textAnchor="middle">
          G
        </text>
      </g>

      {/*
        ── 3. EL NUCLEO ENERGETICO ─────────────────────────────────

        VA DEBAJO DE LA MARCA, no en el centro geometrico.

        Centrado tapaba la G: dos cosas distintas —la identidad y la fuente—
        peleando por el mismo pixel, y ganaba la que se dibujaba despues. Aqui
        ademas es mas cierto: este punto es de donde SALE la columna hacia el
        stack, asi que estar en la boca de salida no es un apano, es su sitio.
      */}
      <circle cx={CX} cy={CY + R * 0.46} r="0.62" fill={INK.base} className="arq__nucleo-punto" />

      {/*
        PARTICULAS EN ORBITA. Tres, sobre elipses de distinto tamano e
        inclinacion. Tres es el minimo que se lee como «orbitan» en vez de como
        «hay un punto girando», y el maximo antes de que la camara se vea
        poblada en vez de contenida.
      */}
      {[
        { rx: R * 1.35, ry: R * 0.34, dur: ARQ_NUCLEO_S, desde: 0 },
        { rx: R * 1.05, ry: R * 0.5, dur: ARQ_NUCLEO_S, desde: -ARQ_NUCLEO_S / 3 },
        { rx: R * 1.6, ry: R * 0.22, dur: ARQ_NUCLEO_S, desde: -(ARQ_NUCLEO_S * 2) / 3 },
      ].map((o, i) => (
        <circle key={`orb-${i}`} r="0.36" fill={ESPECTRO[i]} opacity="0.85">
          <animateMotion
            dur={`${o.dur}s`}
            repeatCount="indefinite"
            begin={`${o.desde}s`}
            calcMode="linear"
            path={`M${(CX - o.rx).toFixed(2)},${CY} a${o.rx.toFixed(2)},${o.ry.toFixed(2)} 0 1,0 ${(o.rx * 2).toFixed(2)},0 a${o.rx.toFixed(2)},${o.ry.toFixed(2)} 0 1,0 ${(-o.rx * 2).toFixed(2)},0`}
          />
        </circle>
      ))}

      {/*
        EL PULSO. Un aro que sale del nucleo cada 9,6 s y baja por el stack. Es
        el latido de la infraestructura: no una animacion continua, un evento
        que ocurre y se acaba. El 80 % del ciclo esto no existe.
      */}
      <ellipse
        cx={CX} cy={CY} rx={R} ry={R * 0.3}
        fill="none" stroke={EMISSION.cyan} strokeWidth="0.3"
        className="arq__nucleo-pulso"
      />
      <circle cx={CX} cy={CY} r={R * 1.9} fill={`url(#${idOrbita})`} className="arq__nucleo-emision" />
    </g>
  )
}
