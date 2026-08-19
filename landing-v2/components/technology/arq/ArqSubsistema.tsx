'use client'

import { INK } from '@/lib/design/tokens'
import {
  type ArqEstrato,
  ARQ_EJE_X,
  ARQ_RADIO_MAQ,
  arqEscalaMaq,
  arqTapaY,
  arqRy,
  arqSobre,
  arqServicios,
  arqRacks,
  arqNodosIa,
  arqBloques,
  arqPaneles,
} from '@/lib/technology/techArchitecture'

/**
 * LA MAQUINARIA DE CADA ESTRATO.
 *
 * LA PRUEBA QUE TIENE QUE PASAR: tapar el rotulo y seguir sabiendo cual es cual.
 * Si hace falta leer «IA» para saber que esa capa piensa, el dibujo no ha hecho
 * su trabajo y lo esta haciendo la tipografia.
 *
 * Por eso cada subsistema usa un LENGUAJE DE FORMA distinto, no el mismo motivo
 * en cinco colores:
 *
 *   backend         cubos sobre un rail       — servicios discretos que responden
 *   infraestructura racks y DOS rutas         — redundancia, dicha con geometria
 *   ia              grafo de nodos            — relaciones, no piezas
 *   blockchain      cadena de bloques         — orden y encadenamiento
 *   aplicaciones    paneles con barras        — interfaz, lo unico que se toca
 *
 * El color refuerza la identidad; no la sostiene. Alguien con daltonismo tiene
 * que poder distinguirlas igual, y con formas distintas puede.
 *
 * TODO SE DIBUJA SOBRE LA SUPERFICIE, con las coordenadas ya aplanadas por
 * `arqSobre`. No hay un `scale(1, 0.3)` envolviendo el grupo porque eso
 * deformaria tambien el grosor del trazo.
 */

/** Muestrea un arco de la superficie y devuelve la cadena de un `path`. */
function arco(cy: number, rx: number, radio: number, a0: number, a1: number, n = 18): string {
  return Array.from({ length: n }, (_, i) => {
    const p = arqSobre(cy, rx, radio, a0 + ((a1 - a0) * i) / (n - 1))
    return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' ')
}

interface Props {
  e: ArqEstrato
  idBrillo: string
}

export default function ArqSubsistema({ e, idBrillo }: Props) {
  const cy = arqTapaY(e)
  const dur = `${e.latido}s`
  /* La maquinaria escala con el anillo que la sostiene: una plataforma mas
     pequena no aloja piezas del mismo tamano. */
  const k = arqEscalaMaq(e.rx)
  const R = ARQ_RADIO_MAQ

  switch (e.id) {
    /* ── BACKEND — servicios discretos que responden a peticiones ────────── */
    case 'backend': {
      const servicios = arqServicios()
      const rail = arco(cy, e.rx, R, servicios[0]!.a, servicios[servicios.length - 1]!.a)
      return (
        <g className="arq__sub arq__sub--backend">
          <path d={rail} fill="none" stroke={e.colorAlt} strokeWidth="0.16" opacity="0.45" />
          {servicios.map((s, i) => {
            const p = arqSobre(cy, e.rx, R, s.a)
            const w = 2.5 * s.escala * k
            const h = 2.2 * s.escala * k
            const d = 0.62 * s.escala * k
            return (
              <g
                key={`svc-${i}`}
                className="arq__servicio"
                style={{ animationDelay: `${s.retardo.toFixed(2)}s`, animationDuration: dur }}
              >
                {/* cara superior: el rombo es lo que convierte un cuadrado en un cubo */}
                <polygon
                  points={`${(p.x - w / 2).toFixed(2)},${(p.y - h).toFixed(2)} ${p.x.toFixed(2)},${(p.y - h - d).toFixed(2)} ${(p.x + w / 2).toFixed(2)},${(p.y - h).toFixed(2)} ${p.x.toFixed(2)},${(p.y - h + d).toFixed(2)}`}
                  fill={e.colorAlt} fillOpacity="0.45" stroke={e.colorAlt} strokeWidth="0.16"
                />
                <rect
                  x={p.x - w / 2} y={p.y - h} width={w} height={h}
                  fill={e.color} fillOpacity="0.3" stroke={e.color} strokeWidth="0.18"
                />
                <line
                  x1={p.x - w / 2 + 0.3} y1={p.y - h * 0.45}
                  x2={p.x + w / 2 - 0.3} y2={p.y - h * 0.45}
                  stroke={e.colorAlt} strokeWidth="0.1" opacity="0.6"
                />
              </g>
            )
          })}
          {/* la peticion recorre el rail; los cubos responden a su paso */}
          <circle r="0.42" fill={INK.base} filter={`url(#${idBrillo})`} className="arq__paquete">
            <animateMotion dur={dur} repeatCount="indefinite" path={rail} calcMode="linear" />
          </circle>
        </g>
      )
    }

    /* ── INFRAESTRUCTURA — la redundancia se DIBUJA, no se afirma ────────── */
    case 'infraestructura': {
      const racks = arqRacks()
      /*
       * EL CENTRO DE ENRUTADO NO VA EN EL CENTRO GEOMETRICO.
       *
       * Medido: en el eje del anillo cae exactamente bajo la placa del rotulo y
       * quedaba invisible al 100 %. Adelantado al frente sigue leyendose como
       * origen —las dos rutas salen de el— y ademas se ve. El centro «correcto»
       * de una elipse en perspectiva no es el sitio util.
       */
      const centro = arqSobre(cy, e.rx, 0.42, Math.PI / 2)
      /*
       * DOS rutas al mismo destino, no una. Es el argumento entero de la capa:
       * un dato que solo puede llegar por un camino no es redundante. Se
       * dibujan con quiebro para que se lean como enrutado y no como radios.
       */
      const rutas = [racks[0]!, racks[racks.length - 1]!].map((r) => {
        const dest = arqSobre(cy, e.rx, R, r.a)
        const codo = { x: centro.x + (dest.x - centro.x) * 0.55, y: centro.y }
        return `M${centro.x.toFixed(2)},${centro.y.toFixed(2)} L${codo.x.toFixed(2)},${codo.y.toFixed(2)} L${dest.x.toFixed(2)},${dest.y.toFixed(2)}`
      })
      return (
        <g className="arq__sub arq__sub--infra">
          {rutas.map((d, i) => (
            <path key={`ruta-${i}`} d={d} fill="none" stroke={e.colorAlt} strokeWidth="0.16" opacity="0.42" />
          ))}
          {racks.map((r, i) => {
            const p = arqSobre(cy, e.rx, R, r.a)
            const w = 3.3 * k
            const h = 4.2 * k
            return (
              <g key={`rack-${i}`}>
                <rect
                  x={p.x - w / 2} y={p.y - h} width={w} height={h} rx="0.24"
                  fill={e.color} fillOpacity="0.26" stroke={e.color} strokeWidth="0.18"
                />
                {r.alturas.map((a, j) => (
                  <rect
                    key={j}
                    x={p.x - w / 2 + 0.34 * k} y={p.y - h + (0.5 + j * 1.15) * k}
                    width={(w - 0.68 * k) * a} height={0.62 * k} rx="0.12"
                    fill={e.colorAlt} opacity={j === 1 ? 0.85 : 0.45}
                  />
                ))}
              </g>
            )
          })}
          {/* el mismo dato viaja por las dos rutas A LA VEZ: eso es redundancia */}
          {rutas.map((d, i) => (
            <circle key={`dup-${i}`} r="0.4" fill={e.colorAlt} className="arq__paquete">
              <animateMotion dur={dur} repeatCount="indefinite" path={d} calcMode="linear" />
            </circle>
          ))}
          <circle cx={centro.x} cy={centro.y} r="0.62" fill={e.color} className="arq__nodo-vivo"
                  style={{ animationDuration: dur }} />
        </g>
      )
    }

    /* ── IA — relaciones, no piezas ──────────────────────────────────────── */
    case 'ia': {
      const { nodos, enlaces } = arqNodosIa()
      const pts = nodos.map((n) => arqSobre(cy, e.rx, n.r, n.a))
      /* Mismo motivo que en infraestructura: el eje del anillo esta bajo la
         placa, y el punto de convergencia es justo el que hay que ver. */
      const centro = arqSobre(cy, e.rx, 0.42, Math.PI / 2)
      return (
        <g className="arq__sub arq__sub--ia">
          {enlaces.map(([a, b], i) => (
            <line
              key={`enl-${i}`}
              x1={pts[a]!.x} y1={pts[a]!.y - 0.6} x2={pts[b]!.x} y2={pts[b]!.y - 0.6}
              stroke={e.color} strokeWidth="0.14" opacity="0.45"
            />
          ))}
          {nodos.map((n, i) => (
            <circle
              key={`nodo-${i}`}
              cx={pts[i]!.x} cy={pts[i]!.y - 0.6} r={n.vivo ? 0.68 : 0.44}
              fill={n.vivo ? e.colorAlt : e.color}
              opacity={n.vivo ? 0.9 : 0.4}
              className={n.vivo ? 'arq__nodo-vivo' : undefined}
              style={n.vivo ? { animationDelay: `${n.retardo.toFixed(2)}s`, animationDuration: dur } : undefined}
            />
          ))}
          {/*
            INFERENCIA: entra, converge, sale. Cuatro particulas de los bordes
            hacia el centro y UNA de vuelta hacia arriba. La asimetria —cuatro
            entran, una sale— es lo que lo lee como «procesa» y no como
            «circula»: si saliera lo mismo que entra, no habria calculo.
          */}
          {[0, 2, 4, 6].map((k, i) => {
            const o = arqSobre(cy, e.rx, 0.92, (k / 8) * Math.PI * 2)
            return (
              <circle key={`in-${i}`} r="0.3" fill={e.colorAlt} className="arq__ia-entrada"
                      style={{ animationDelay: `${(i * 0.12).toFixed(2)}s`, animationDuration: dur }}>
                <animateMotion
                  dur={dur} repeatCount="indefinite" calcMode="linear"
                  keyTimes="0;0.34;1" keyPoints="0;1;1"
                  begin={`${(i * 0.12).toFixed(2)}s`}
                  path={`M${o.x.toFixed(2)},${(o.y - 0.6).toFixed(2)} L${centro.x.toFixed(2)},${(centro.y - 0.6).toFixed(2)}`}
                />
              </circle>
            )
          })}
          <circle
            cx={centro.x} cy={centro.y - 0.6} r="1.4"
            fill="none" stroke={e.colorAlt} strokeWidth="0.24"
            className="arq__ia-pulso" style={{ animationDuration: dur }}
          />
          <circle r="0.36" fill={INK.base} className="arq__ia-salida" style={{ animationDuration: dur }}>
            <animateMotion
              dur={dur} repeatCount="indefinite" calcMode="linear"
              keyTimes="0;0.5;0.8;1" keyPoints="0;0;1;1"
              path={`M${centro.x.toFixed(2)},${(centro.y - 0.6).toFixed(2)} L${centro.x.toFixed(2)},${(centro.y - 5.4).toFixed(2)}`}
            />
          </circle>
        </g>
      )
    }

    /* ── BLOCKCHAIN — orden y encadenamiento ─────────────────────────────── */
    case 'blockchain': {
      const bloques = arqBloques()
      const cadena = arco(cy, e.rx, R, bloques[0]!.a, bloques[bloques.length - 1]!.a)
      return (
        <g className="arq__sub arq__sub--blockchain">
          <path d={cadena} fill="none" stroke={e.colorAlt} strokeWidth="0.14"
                strokeDasharray="0.8 0.7" opacity="0.5" />
          {bloques.map((b, i) => {
            const p = arqSobre(cy, e.rx, R, b.a)
            const s = (b.consenso ? 2.6 : 2) * k
            return (
              <g key={`blq-${i}`}>
                <rect
                  x={p.x - s / 2} y={p.y - s - 0.4} width={s} height={s} rx="0.2"
                  fill={e.color} fillOpacity={b.consenso ? 0.42 : 0.24}
                  stroke={e.color} strokeWidth="0.14"
                  className={b.consenso ? 'arq__consenso' : undefined}
                  style={b.consenso ? { animationDelay: `${b.retardo.toFixed(2)}s`, animationDuration: dur } : undefined}
                />
                {b.consenso && (
                  <circle cx={p.x} cy={p.y - s / 2 - 0.4} r="0.34" fill={e.colorAlt} opacity="0.9" />
                )}
              </g>
            )
          })}
          {/* una transaccion recorre la cadena y el arco la confirma al llegar */}
          <circle r="0.44" fill={INK.base} filter={`url(#${idBrillo})`} className="arq__paquete">
            <animateMotion dur={dur} repeatCount="indefinite" calcMode="linear"
                           keyTimes="0;0.55;1" keyPoints="0;1;1" path={cadena} />
          </circle>
          <path
            d={arco(cy, e.rx, 0.86, bloques[0]!.a, bloques[bloques.length - 1]!.a)}
            fill="none" stroke={e.colorAlt} strokeWidth="0.5" strokeLinecap="round"
            className="arq__confirmacion" style={{ animationDuration: dur }}
          />
        </g>
      )
    }

    /* ── APLICACIONES — lo unico que el usuario toca ─────────────────────── */
    case 'aplicaciones': {
      const paneles = arqPaneles()
      return (
        <g className="arq__sub arq__sub--apps">
          {paneles.map((pa, i) => {
            const p = arqSobre(cy, e.rx, R, pa.a)
            return (
              <g key={`pan-${i}`} className="arq__panel"
                 style={{ animationDelay: `${pa.retardo.toFixed(2)}s`, animationDuration: dur }}>
                <rect
                  x={p.x - (pa.w * k) / 2} y={p.y - pa.h * k} width={pa.w * k} height={pa.h * k} rx="0.3"
                  fill={e.color} fillOpacity="0.24" stroke={e.color} strokeWidth="0.18"
                />
                <line
                  x1={p.x - (pa.w * k) / 2} y1={p.y - pa.h * k + 0.5}
                  x2={p.x + (pa.w * k) / 2} y2={p.y - pa.h * k + 0.5}
                  stroke={e.color} strokeWidth="0.1" opacity="0.6"
                />
                {pa.barras.map((b, j) => (
                  <rect
                    key={j}
                    x={p.x - (pa.w * k) / 2 + 0.35 + j * ((pa.w * k - 0.7) / 3)}
                    y={p.y - 0.3 - (pa.h * k - 1.2) * b}
                    width={(pa.w * k - 0.7) / 3 - 0.25}
                    height={(pa.h * k - 1.2) * b}
                    fill={e.colorAlt} opacity="0.7"
                    className="arq__barra"
                    style={{ animationDelay: `${(pa.retardo + j * 0.3).toFixed(2)}s`, animationDuration: dur }}
                  />
                ))}
              </g>
            )
          })}
        </g>
      )
    }

    default:
      return null
  }
}

/** Radio menor del estrato, expuesto para quien componga por encima. */
export { arqRy, ARQ_EJE_X }
