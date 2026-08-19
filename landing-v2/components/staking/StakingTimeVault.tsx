'use client'

import { useT } from '@/context/IdiomaContext'
import {
  STAKING_VAULT_PULSE_S,
  STAKING_VAULT_FORM_S,
  STAKING_LEDGER_LAP_S,
} from '@/lib/staking/timeVaultLayout'
import StakingVaultCore from '@/components/staking/StakingVaultCore'
import StakingTimeRings from '@/components/staking/StakingTimeRings'
import StakingLockStreams from '@/components/staking/StakingLockStreams'
import StakingLedgerRing from '@/components/staking/StakingLedgerRing'
import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

interface StakingTimeVaultProps {
  isActive: boolean
}

export default function StakingTimeVault({ isActive }: StakingTimeVaultProps) {

  const t = useT()
  const visible = useSectionVisualActive(isActive)
  if (!visible) return null

  return (
    <div
      className="staking-time-vault staking-time-vault--enter"
      aria-label={t('Genesis Time Vault')}
      style={{
        '--vault-pulse-s': `${STAKING_VAULT_PULSE_S}s`,
        // Era '1.4s' a mano, y STAKING_VAULT_FORM_S estaba exportado sin que
        // nadie lo leyera: la constante parecia la fuente de verdad y el valor
        // real vivia aqui. El respaldo del CSS —var(--vault-form-s, 1.4s)— hacia
        // que no se notara nunca.
        '--vault-form-s': `${STAKING_VAULT_FORM_S}s`,
        /*
         * LA VUELTA SE DECLARA AQUI, EN EL PADRE, NO EN EL REGISTRO.
         *
         * La usan DOS piezas: el registro —donde el cabezal completa el
         * recorrido— y el candado, que se abre justo cuando esa vuelta termina.
         * Declarandola solo en el registro, el candado la leia de un `var()`
         * con respaldo: daba 32 s por casualidad, y el dia que alguien cambiara
         * la vuelta el candado se quedaria en 32 sin que nada avisara. Los dos
         * relojes de la boveda tienen que contar lo mismo por construccion.
         */
        '--ledger-lap-s': `${STAKING_LEDGER_LAP_S}s`,
      } as React.CSSProperties}
    >
      <div className="staking-time-vault__layer staking-time-vault__layer--back">
        <div className="staking-time-vault__ambient" aria-hidden="true" />
      </div>

      <div className="staking-time-vault__layer staking-time-vault__layer--mid">
        <StakingLockStreams />
      </div>

      <div className="staking-time-vault__layer staking-time-vault__layer--front">
        <div className="staking-time-vault__stage">
          {/* El registro va por fuera de los anillos de tiempo y por debajo de
              ellos: es el sustrato donde queda constancia, no una capa mas. */}
          <StakingLedgerRing />
          <StakingTimeRings />
          <StakingVaultCore />
        </div>
      </div>
    </div>
  )
}
