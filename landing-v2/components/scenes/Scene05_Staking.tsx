'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Card, GenesisStatBlock, Button } from '@/components/ui/genesis'
import { SceneWrapper, slideLeft, slideLeftCrisp, containerV } from '@/components/ui/SceneShared'
import { EXTERNAL_LINKS } from '@/lib/routes'
import StakingSectionBackdrop from '@/components/staking/StakingSectionBackdrop'
import StakingTimeVault from '@/components/staking/StakingTimeVault'

interface Props {
  isActive?: boolean
}

const STAKING_PERIODS = [
  { title: 'Compromiso flexible', description: 'Periodos definidos con condiciones transparentes de participación y liberación.' },
  { title: 'Estabilidad del ecosistema', description: 'Staking fortalece la liquidez interna y la continuidad operativa del protocolo.' },
  { title: 'Participación sostenida', description: 'Incentivos alineados con permanencia — sin garantías de rendimiento financiero.' },
]

const Scene05_Staking = forwardRef<HTMLElement, Props>(function Scene05_Staking(
  { isActive = false },
  ref
) {
  return (
    <SceneWrapper
      ref={ref}
      isActive={isActive}
      motionKey="scene05-staking"
      sectionId="staking"
      wideStack
      particleColumn
      className="staking-section-layout"
      sectionOverlay={<StakingSectionBackdrop visible={isActive} />}
      particleSlot={<StakingTimeVault isActive={isActive} />}
    >
      <SectionHeader
        label="Staking"
        title="Compromiso a largo plazo"
        highlight="con el protocolo."
        description="Staking articula periodos de participación, estabilidad y alineación con el ecosistema AiGenesis. Un pilar independiente con reglas propias y trazabilidad on-chain."
      />

      <motion.div variants={containerV} className="staking-cards-grid mt-2">
        {STAKING_PERIODS.map((item) => (
          <motion.div key={item.title} variants={slideLeftCrisp}>
            <Card variant="trust" title={item.title} description={item.description} hover />
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={slideLeft} className="flex flex-wrap gap-8 mt-4">
        <GenesisStatBlock value="6+" label="Periodos" mono />
        <GenesisStatBlock value="On-chain" label="Verificación" mono />
        <GenesisStatBlock value="Deflacionario" label="Token base" />
      </motion.div>

      <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
        <StakingTimeVault isActive={isActive} />
      </motion.div>

      <motion.div variants={slideLeft} className="mt-4">
        <Button variant="primary" size="md" href={EXTERNAL_LINKS.STAKING}>
          Explorar Staking
        </Button>
      </motion.div>
    </SceneWrapper>
  )
})

export default Scene05_Staking
