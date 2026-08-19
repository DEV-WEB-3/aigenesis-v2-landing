'use client'

import { EMISSION } from '@/lib/design/tokens'
import { ARQ_EJE_X, ARQ_SUELO, arqTrazas } from '@/lib/technology/techArchitecture'

/**
 * LA PLACA BASE — lo que ancla la maquina.
 *
 * Sin ella el conjunto flota en la nada y se lee como un diagrama; con ella se
 * lee como hardware MONTADO sobre algo. Es la pieza que convierte «cinco capas»
 * en «un equipo».
 *
 * TODO AQUI ES ESTATICO salvo un barrido. Son ~50 nodos, y animar cincuenta
 * elementos para un piso que vive al fondo y a opacidad baja seria pagar
 * cuadros por algo que nadie mira directamente. La vida de la maquina esta
 * arriba; esto solo tiene que estar y sostener.
 */
export default function ArqSuelo({ idBarrido }: { idBarrido: string }) {
  const { y: CY, rx: RX, ry: RY } = ARQ_SUELO
  const trazas = arqTrazas()

  /** Un punto de la placa, en radio normalizado y angulo. */
  const pt = (r: number, a: number) => ({
    x: ARQ_EJE_X + Math.cos(a) * RX * r,
    y: CY + Math.sin(a) * RY * r,
  })

  return (
    <g className="arq__placa-base" aria-hidden="true">
      {/* anillos concentricos: las capas de la placa */}
      {[1, 0.74, 0.46].map((r, i) => (
        <ellipse
          key={`aro-${i}`}
          cx={ARQ_EJE_X} cy={CY} rx={RX * r} ry={RY * r}
          fill="none" stroke={EMISSION.violetHi}
          strokeWidth={i === 0 ? 0.22 : 0.13}
          opacity={i === 0 ? 0.34 : 0.18}
        />
      ))}

      {/*
        LAS TRAZAS LLEVAN UN QUIEBRO, no son diagonales libres.

        Una diagonal recta entre dos radios se lee como un grafico de
        dispersion. El quiebro —radial, giro, radial— es lo que el ojo reconoce
        como circuito impreso, y cuesta exactamente los mismos nodos: es una
        regla de colocacion, no material adicional.
      */}
      {trazas.map((t, i) => {
        const a0 = pt(t.r0, t.a)
        const q0 = pt(t.quiebro, t.a)
        const q1 = pt(t.quiebro, t.a + t.giro)
        const a1 = pt(t.r1, t.a + t.giro)
        return (
          <g key={`traza-${i}`}>
            <polyline
              points={`${a0.x.toFixed(2)},${a0.y.toFixed(2)} ${q0.x.toFixed(2)},${q0.y.toFixed(2)} ${q1.x.toFixed(2)},${q1.y.toFixed(2)} ${a1.x.toFixed(2)},${a1.y.toFixed(2)}`}
              fill="none"
              stroke={i % 3 === 0 ? EMISSION.cyan : EMISSION.violetHi}
              strokeWidth="0.14"
              opacity="0.3"
              strokeLinejoin="round"
            />
            {t.pad && (
              <rect
                x={a1.x - 0.42} y={a1.y - 0.28} width="0.84" height="0.56" rx="0.12"
                fill={i % 3 === 0 ? EMISSION.cyan : EMISSION.violetHi}
                opacity="0.42"
              />
            )}
          </g>
        )
      })}

      {/*
        Un solo barrido recorre la placa. Es el unico elemento animado del piso
        y basta: un plano de fondo con actividad constante compite con la
        maquina, que es donde tiene que mirar el ojo.
      */}
      <ellipse
        cx={ARQ_EJE_X} cy={CY} rx={RX} ry={RY}
        fill={`url(#${idBarrido})`}
        className="arq__suelo-barrido"
      />
    </g>
  )
}
