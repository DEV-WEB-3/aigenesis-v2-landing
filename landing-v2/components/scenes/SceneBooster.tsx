'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Card, GenesisStatBlock, Button } from '@/components/ui/genesis'
import { SceneWrapper, slideLeft, containerV } from '@/components/ui/SceneShared'
import { EXTERNAL_LINKS } from '@/lib/routes'
import BoosterSectionBackdrop from '@/components/booster/BoosterSectionBackdrop'
import BoosterQuantumAccelerator from '@/components/booster/BoosterQuantumAccelerator'

interface Props {
  isActive?: boolean
}

const BOOSTER_LAYERS = [
  { label: 'Capa I', title: 'Activación', description: 'Punto de entrada al acelerador con requisitos de protocolo definidos.' },
  { label: 'Capa II', title: 'Multiplicador', description: 'Factores de amplificación progresivos según participación sostenida.' },
  { label: 'Capa III', title: 'Progresión', description: 'Avance por niveles con transparencia en condiciones y umbrales.' },
]

const SceneBooster = forwardRef<HTMLElement, Props>(function SceneBooster(
  { isActive = false },
  ref
) {
  return (
    <SceneWrapper
      ref={ref}
      isActive={isActive}
      motionKey="scene04-booster"
      sectionId="booster"
      wideStack
      particleColumn
      className="booster-section-layout"
      sectionOverlay={<BoosterSectionBackdrop visible={isActive} />}
      particleSlot={<BoosterQuantumAccelerator isActive={isActive} />}
    >
      <SectionHeader
        label="Booster"
        title="Acelerador de crecimiento"
        highlight="del ecosistema."
        description="Booster amplifica la participación dentro del protocolo mediante capas y multiplicadores estructurados. Diseñado para progresión — no para esquemas de captación."
      />

      <motion.div variants={containerV} className="flex flex-col gap-genesis-3">
        {BOOSTER_LAYERS.map((layer) => (
          <motion.div key={layer.title} variants={slideLeft}>
            <Card
              variant="product"
              label={layer.label}
              title={layer.title}
              description={layer.description}
            />
          </motion.div>
        ))}
      </motion.div>

        <motion.div variants={slideLeft} className="flex flex-wrap gap-8">
        <GenesisStatBlock value="3" label="Capas activas" mono />
        <GenesisStatBlock value="Progresivo" label="Modelo" />
        <GenesisStatBlock value="Protocolo" label="Gobernanza" />
      </motion.div>

      <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
        <BoosterQuantumAccelerator isActive={isActive} />
      </motion.div>

      <motion.div variants={slideLeft}>
        <Button variant="secondary" size="md" href={EXTERNAL_LINKS.BOOSTER}>
          Conocer Booster
        </Button>
      </motion.div>
    </SceneWrapper>
  )
})

export default SceneBooster
