'use client'

import { STAKING_TIME_RINGS, STAKING_VAULT_PULSE_S } from '@/lib/staking/timeVaultLayout'

/**
 * LOS TRES PLANOS DE LA BOVEDA.
 *
 * Cada anillo es un plano fijo alrededor del candado, y lo que se mueve es un
 * satelite que lo recorre. Antes era al reves: el plano daba vueltas sobre si
 * mismo —y sobre un centro que no era el del candado— y no habia nada
 * recorriendolo. Por eso se leia como tres formas sueltas.
 *
 * El satelite usa las mismas cuatro capas que el cabezal del anillo de
 * registro, y por las mismas razones medidas:
 *
 *   orbit    aplana el cuadrado hasta la elipse. Estatico.
 *   spin     gira. Aparte, porque `transform` es UNA propiedad y declarar el
 *            giro junto al aplanado lo sustituiria: el satelite recorreria una
 *            circunferencia en vez de la elipse.
 *   anchor   CONTRAGIRA. Sin esto el satelite se pinta como una raya, porque la
 *            correccion de forma caeria antes de rotar y solo acertaria en los
 *            extremos del eje mayor.
 *   sat      deshace el aplanado, ya en el eje correcto.
 */
export default function StakingTimeRings() {
  return (
    <div
      className="staking-time-rings"
      style={{ '--vault-pulse-s': `${STAKING_VAULT_PULSE_S}s` } as React.CSSProperties}
    >
      {STAKING_TIME_RINGS.map((ring) => (
        <div
          key={ring.id}
          className="staking-time-ring"
          data-kpi={ring.label}
          style={
            {
              '--ring-y': `${ring.y}%`,
              '--ring-rx': `${ring.rx}%`,
              '--ring-aspecto': ring.aspecto.toFixed(4),
              '--ring-aplanado': ring.aplanado.toFixed(4),
              '--ring-tilt': `${ring.tilt}deg`,
              '--ring-orbita-s': `${ring.orbita}s`,
              '--ring-color': ring.color,
              '--ring-pulse-offset': ring.pulseOffset,
            } as React.CSSProperties
          }
        >
          <span className="staking-time-ring__track" aria-hidden="true" />
          <span className="staking-time-ring__glow" aria-hidden="true" />
          <span className="staking-time-ring__pulse" aria-hidden="true" />
          <span className="staking-time-ring__orbit" aria-hidden="true">
            <span className="staking-time-ring__spin">
              <span className="staking-time-ring__anchor">
                <span className="staking-time-ring__sat" />
              </span>
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}
