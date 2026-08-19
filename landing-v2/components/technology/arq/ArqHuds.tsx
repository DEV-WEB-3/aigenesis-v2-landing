'use client'

import { EMISSION, INK } from '@/lib/design/tokens'
import { ARQ_HUDS, ARQ_BOOT } from '@/lib/technology/techArchitecture'

/**
 * LOS MODULOS FLOTANTES — lo que la capa de aplicaciones PRODUCE.
 *
 * El anillo de APLICACIONES dice «aqui hay interfaces». Estos tres dicen CUALES:
 * un panel de metricas, una app movil y una tarjeta de wallet. Es la unica
 * parte del dibujo que representa algo que el visitante ya ha usado, y por eso
 * flota fuera de la maquina en vez de vivir sobre un anillo: no es
 * infraestructura, es producto.
 *
 * NADA DE TEXTO. Un rotulo de 1,5 unidades son 4,5 px reales: ilegible, y ademas
 * pediria traduccion. Barras, filas y un chip comunican «panel», «movil» y
 * «wallet» sin una sola palabra y sin idioma.
 *
 * CADA UNO CON SU PROPIA DERIVA. Si los tres flotaran igual se leerian como un
 * bloque; con signos y relojes distintos se leen como tres objetos sueltos en
 * el mismo espacio.
 */
export default function ArqHuds() {
  const RELOJ = [7.2, 4.8, 6.4]

  return (
    <g className="arq__huds" aria-hidden="true">
      {ARQ_HUDS.map((h, i) => (
        <g
          key={h.id}
          className={`arq__hud arq__hud--${h.id}`}
          style={
            {
              '--hud-retardo': `${(ARQ_BOOT.huds + h.retardo).toFixed(2)}s`,
              '--hud-reloj': `${RELOJ[i]}s`,
              '--hud-deriva': `${h.deriva}`,
            } as React.CSSProperties
          }
        >
          <rect
            x={h.x} y={h.y} width={h.w} height={h.h} rx="1"
            fill={EMISSION.cyan} fillOpacity="0.06"
            stroke={EMISSION.cyan} strokeWidth="0.18" opacity="0.75"
          />
          {/* barra de titulo: la pieza que hace que un rectangulo sea una ventana */}
          <line
            x1={h.x} y1={h.y + 2} x2={h.x + h.w} y2={h.y + 2}
            stroke={EMISSION.cyan} strokeWidth="0.14" opacity="0.5"
          />
          <circle cx={h.x + 1.2} cy={h.y + 1} r="0.32" fill={EMISSION.magenta} opacity="0.9" />

          {h.id === 'panel' && (
            <>
              {/*
                Grafica de area. La linea sola se lee como un garabato; con el
                relleno debajo se lee como una metrica — es el mismo numero de
                nodos y cambia por completo lo que significa.
              */}
              <polyline
                points={[0, 1, 2, 3, 4, 5, 6].map((k) => {
                  const alturas = [0.35, 0.6, 0.45, 0.8, 0.62, 0.9, 0.72]
                  return `${(h.x + 1.4 + k * ((h.w - 2.8) / 6)).toFixed(2)},${(h.y + h.h - 3.4 - alturas[k]! * 4.6).toFixed(2)}`
                }).join(' ')}
                fill="none" stroke={EMISSION.cyan} strokeWidth="0.24" strokeLinejoin="round"
                className="arq__hud-linea"
              />
              {[0, 1].map((k) => (
                <rect
                  key={k}
                  x={h.x + 1.4 + k * 9} y={h.y + h.h - 2.2}
                  width={k === 0 ? 6.4 : 4.2} height="0.7" rx="0.35"
                  fill={k === 0 ? EMISSION.cyan : EMISSION.violetHi} opacity="0.6"
                />
              ))}
              {/* la marca: pequena, pero es lo que lo hace de Genesis */}
              <circle cx={h.x + h.w - 2} cy={h.y + 1} r="0.7"
                      fill="none" stroke={EMISSION.violetHi} strokeWidth="0.16" opacity="0.8" />
            </>
          )}

          {h.id === 'movil' && (
            <>
              <rect x={h.x + h.w / 2 - 1.4} y={h.y + 0.5} width="2.8" height="0.5" rx="0.25"
                    fill={EMISSION.cyan} opacity="0.5" />
              {[0, 1, 2].map((k) => (
                <rect
                  key={k}
                  x={h.x + 1} y={h.y + 3.6 + k * 2.6}
                  width={h.w - 2} height="1.8" rx="0.35"
                  fill={EMISSION.cyan} fillOpacity="0.12"
                  stroke={EMISSION.cyan} strokeWidth="0.1" opacity="0.7"
                />
              ))}
            </>
          )}

          {h.id === 'wallet' && (
            <>
              {/* chip: la pieza que convierte una tarjeta en una tarjeta */}
              <rect x={h.x + 1.4} y={h.y + 3.4} width="2.6" height="2" rx="0.3"
                    fill={EMISSION.violetHi} fillOpacity="0.4"
                    stroke={EMISSION.violetHi} strokeWidth="0.12" />
              <rect x={h.x + 5.2} y={h.y + 3.8} width="7.4" height="0.8" rx="0.4"
                    fill={INK.base} opacity="0.55" />
              <rect x={h.x + 5.2} y={h.y + 5.4} width="4.6" height="0.6" rx="0.3"
                    fill={EMISSION.cyan} opacity="0.6" />
            </>
          )}
        </g>
      ))}
    </g>
  )
}
