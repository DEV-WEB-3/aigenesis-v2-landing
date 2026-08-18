'use client'

import {
  ORACLE_ECOSYSTEM_SATELLITES,
  ORACLE_INFERENCE_PULSE_S,
  ORACLE_BRAIN_FORM_S,
  ORACLE_BRAIN_CENTER,
} from '@/lib/goracle/quantumBrainLayout'
import GoracleEcosystemIcon from '@/components/goracle/GoracleEcosystemIcon'

/**
 * Cuanto se aleja cada satelite del centro antes de converger, en porcentaje
 * del lienzo. Sale de FUERA del anillo (radio 38) para que el movimiento sea
 * inequivocamente hacia dentro.
 */
const SALIDA_EXTRA = 46

export default function GoracleEcosystemSatellites() {
  return (
    <div
      className="goracle-ecosystem-satellites"
      style={
        {
          '--oracle-pulse-s': `${ORACLE_INFERENCE_PULSE_S}s`,
          '--oracle-form-s': `${ORACLE_BRAIN_FORM_S}s`,
        } as React.CSSProperties
      }
    >
      {ORACLE_ECOSYSTEM_SATELLITES.map((sat, i) => {
        /**
         * Cada uno entra POR SU LADO, no todos desde el mismo sitio.
         *
         * El vector centro→satelite, alargado. Asi el movimiento de entrada es
         * radial para los cinco a la vez, que es lo que hace que se lea como
         * convergencia y no como cinco cosas apareciendo.
         */
        const vx = sat.x - ORACLE_BRAIN_CENTER.x
        const vy = sat.y - ORACLE_BRAIN_CENTER.y
        const largo = Math.hypot(vx, vy) || 1

        return (
          <div
            key={sat.id}
            className="goracle-ecosystem-satellite"
            data-satellite={sat.id}
            style={
              {
                left: `${sat.x.toFixed(2)}%`,
                top: `${sat.y.toFixed(2)}%`,
                /**
                 * En `cqw`, no en `%`.
                 *
                 * Un porcentaje dentro de `translate()` se resuelve contra el
                 * tamano DEL PROPIO ELEMENTO —2,4 rem—, no contra el
                 * contenedor: el desplazamiento habria sido de un pixel y
                 * pico, y la convergencia no se veria. `cqw` es el 1 % del
                 * contenedor, que aqui es el cuadrado del lienzo 0–100, asi
                 * que 46cqw son exactamente 46 unidades de lienzo.
                 */
                '--sat-dx': `${((vx / largo) * SALIDA_EXTRA).toFixed(2)}cqw`,
                '--sat-dy': `${((vy / largo) * SALIDA_EXTRA).toFixed(2)}cqw`,
                // La entrada se reparte dentro de la llegada; el pulso, dentro
                // de su propio ciclo. Dos escalonados, dos trabajos.
                '--sat-entrada': `${((i / ORACLE_ECOSYSTEM_SATELLITES.length) * ORACLE_BRAIN_FORM_S).toFixed(3)}s`,
                '--sat-pulso': `${(sat.pulseOffset * ORACLE_INFERENCE_PULSE_S).toFixed(3)}s`,
              } as React.CSSProperties
            }
          >
            <span className="goracle-ecosystem-satellite__halo" aria-hidden="true" />
            <span className="goracle-ecosystem-satellite__ring" aria-hidden="true" />
            <span className="goracle-ecosystem-satellite__icon">
              <GoracleEcosystemIcon id={sat.id} />
            </span>
          </div>
        )
      })}
    </div>
  )
}
