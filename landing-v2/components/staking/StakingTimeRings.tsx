'use client'

import { STAKING_TIME_RINGS, STAKING_VAULT_PULSE_S } from '@/lib/staking/timeVaultLayout'
import { PARALAJE, desfase } from '@/lib/design/motion'

/**
 * PRECESION — cada cuanto se inclina el plano de un anillo.
 *
 * Los tres anillos YA giraban (32 · 16 · 8 s) y aun asi se veian congelados. El
 * motivo no es la velocidad: una elipse de borde uniforme tiene simetria de 180
 * grados, asi que rotarla no produce NINGUN cambio perceptible. Estaba
 * animandose algo que, por construccion, no se puede ver.
 *
 * Se corrige por dos lados, los dos leves:
 *
 *   1. el borde deja de ser uniforme —arriba claro, abajo apagado—, con lo que
 *      el giro que ya existia se convierte en luz recorriendo el anillo;
 *   2. el plano se inclina despacio, que es lo que hace una orbita real vista
 *      de canto y lo que impide que los tres se lean como un dibujo plano.
 *
 * 16 s es el escalon medio del paralaje: mas lento que el anillo mas rapido y
 * mas rapido que el mas lento, asi que no se sincroniza con ninguno.
 */
const PRECESION_S = PARALAJE.medio

export default function StakingTimeRings() {
  return (
    <div className="staking-time-rings" style={{ '--vault-pulse-s': `${STAKING_VAULT_PULSE_S}s` } as React.CSSProperties}>
      {STAKING_TIME_RINGS.map((ring, index) => (
        <div
          key={ring.id}
          className="staking-time-ring"
          data-kpi={ring.label}
          style={
            {
              '--ring-y': `${ring.y}%`,
              '--ring-rx': `${ring.rx}%`,
              '--ring-ry': `${ring.ry}%`,
              '--ring-color': ring.color,
              '--ring-pulse-offset': ring.pulseOffset,
              '--ring-precesion-s': `${PRECESION_S}s`,
              /*
               * Antes era `index * 0.25` y no retrasaba NADA: `.staking-time-ring`
               * no tenia ninguna animacion propia, asi que el valor se computaba,
               * se escribia en el DOM y no lo leia nadie. Ahora gobierna la
               * precesion, y se reparte con `desfase` —misma duracion, distinto
               * arranque— para que los tres planos no se inclinen a la vez.
               */
              animationDelay: `${desfase(index, STAKING_TIME_RINGS.length, PRECESION_S)}s`,
            } as React.CSSProperties
          }
        >
          <span className="staking-time-ring__track" aria-hidden="true" />
          <span className="staking-time-ring__glow" aria-hidden="true" />
          <span className="staking-time-ring__pulse" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}
