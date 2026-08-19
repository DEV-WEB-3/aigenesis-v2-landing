'use client'

import { useT } from '@/context/IdiomaContext'
import {
  TECH_STACK_LAYERS,
  TECH_STACK_PULSE_S,
  TECH_STACK_FORM_S,
  ESTRATO_APLASTADO,
} from '@/lib/technology/techStackLayout'

/**
 * Los cinco estratos del stack, vistos en perspectiva.
 *
 * Antes eran cinco rectangulos planos apilados. El problema no era que fueran
 * feos: era que la columna IZQUIERDA de esta misma seccion ya muestra once
 * pastillas con las tecnologias concretas. Dibujar cinco pastillas mas a la
 * derecha repetia exactamente la misma forma, asi que el grafico no anadia
 * nada — decia lo mismo que el texto, mas grande.
 *
 * Un disco visto en angulo se lee como CAPA, y una pastilla no. Con eso solo,
 * el lado derecho pasa de repetir la lista a mostrar la estructura que la
 * sostiene, que es lo que la seccion dice con palabras.
 */
export default function TechnologyStackLayers() {
  const t = useT()
  return (
    <svg
      className="technology-stack-layers"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={
        {
          '--tech-pulse-s': `${TECH_STACK_PULSE_S}s`,
          '--tech-form-s': `${TECH_STACK_FORM_S}s`,
        } as React.CSSProperties
      }
    >
      <defs>
        <filter id="tech-layer-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.55" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/*
        EL EJE.

        Une los centros de los cinco discos y se dibuja DETRAS de ellos, asi que
        cada estrato lo tapa por donde pasa. Ese solape es lo que hace que la
        pila se lea como una sola pieza atravesada y no como cinco anillos
        sueltos que casualmente estan alineados.
      */}
      <line
        className="technology-stack-axis"
        x1="50"
        y1={TECH_STACK_LAYERS[0]!.y}
        x2="50"
        y2={TECH_STACK_LAYERS[TECH_STACK_LAYERS.length - 1]!.y}
        strokeWidth="0.3"
      />

      {[...TECH_STACK_LAYERS].reverse().map((layer) => {
        const rx = layer.width / 2
        const ry = rx * ESTRATO_APLASTADO

        /**
         * Dos escalonados distintos, y la diferencia importa.
         *
         * La ENTRADA se reparte dentro de la llegada (1,2 s): los cinco
         * estratos aparecen en 2,2 s contados desde que entras. Escalonarla
         * dentro de un ciclo de pulso —que es lo que hacia— dejaba el ultimo
         * estrato apareciendo a los 4,4 s, y a esa altura mucha gente ya ha
         * seguido bajando: la pila nunca se llegaba a ver entera.
         *
         * El PULSO si se reparte dentro de su ciclo, porque ahi el escalonado
         * es permanente y su unico trabajo es que las cinco capas no latan a la
         * vez.
         */
        const retardoEntrada = (layer.index / TECH_STACK_LAYERS.length) * TECH_STACK_FORM_S
        const retardoPulso = layer.pulseOffset * TECH_STACK_PULSE_S

        return (
          <g
            key={layer.id}
            className="technology-stack-layer"
            data-layer={layer.id}
            style={
              {
                '--estrato-entrada': `${retardoEntrada.toFixed(3)}s`,
                '--estrato-pulso': `${retardoPulso.toFixed(3)}s`,
                // El gesto de la seccion es DIFERENCIAR: los cinco parten
                // juntos del centro y se separan a su sitio. Cada uno guarda
                // cuanto tiene que recorrer.
                '--estrato-desde': `${50 - layer.y}`,
              } as React.CSSProperties
            }
          >
            {/*
              El canto. Da espesor al disco — sin el, un estrato es una linea y
              una linea no sostiene nada.
            */}
            <path
              className="technology-stack-layer__canto"
              d={`M ${50 - rx} ${layer.y} a ${rx} ${ry} 0 0 0 ${rx * 2} 0 l 0 2.2 a ${rx} ${ry} 0 0 1 ${-rx * 2} 0 Z`}
              fill={layer.color}
            />
            <ellipse
              className="technology-stack-layer__disco"
              cx="50"
              cy={layer.y}
              rx={rx}
              ry={ry}
              fill="rgba(6, 8, 20, 0.62)"
              stroke={layer.color}
              strokeWidth="0.4"
              filter="url(#tech-layer-glow)"
            />
            <text
              x="50"
              y={layer.y + 0.95}
              textAnchor="middle"
              className="technology-stack-layer__label"
              fill={layer.color}
              fontSize="2.7"
              fontFamily="var(--font-space-grotesk, system-ui)"
            >
              {t(layer.label)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
