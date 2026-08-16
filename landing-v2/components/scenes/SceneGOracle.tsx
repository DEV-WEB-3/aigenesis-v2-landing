'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Card, GenesisStatBlock, Button } from '@/components/ui/genesis'
import { SceneWrapper, slideLeft, containerV } from '@/components/ui/SceneShared'
import { EXTERNAL_LINKS } from '@/lib/routes'
import GoracleSectionBackdrop from '@/components/goracle/GoracleSectionBackdrop'
import GoracleQuantumBrain from '@/components/goracle/GoracleQuantumBrain'

interface Props {
  isActive?: boolean
}

const ORACLE_PILLARS = [
  {
    title: 'Inteligencia central',
    description: 'G-Oracle procesa, correlaciona y sintetiza datos del ecosistema como núcleo de decisión.',
  },
  {
    title: 'Motor G-BRIDGE',
    description: 'Capa de IA propietaria que alimenta análisis profundo — distinto del flujo de señales de GPulse.',
  },
  {
    title: 'Centro neurálgico',
    description: 'Orquesta información entre productos, protocolos y capas de participación del universo Genesis.',
  },
]

const SceneGOracle = forwardRef<HTMLElement, Props>(function SceneGOracle(
  { isActive = false },
  ref
) {
  return (
    <SceneWrapper
      ref={ref}
      isActive={isActive}
      motionKey="scene08-goracle"
      sectionId="goracle"
      wideStack
      particleColumn
      className="goracle-section-layout"
      sectionOverlay={<GoracleSectionBackdrop visible={isActive} />}
      particleSlot={<GoracleQuantumBrain isActive={isActive} />}
    >
      <SectionHeader
        label="G-Oracle"
        title="Cerebro del"
        highlight="ecosistema."
        highlightTone="signature"
        description="G-Oracle es la capa de inteligencia que interpreta, conecta y gobierna el flujo de información. GPulse entrega señales; G-Oracle define la inteligencia estratégica del protocolo."
      />

      <motion.div variants={containerV} className="grid grid-cols-1 sm:grid-cols-3 gap-genesis-3 mt-2">
        {ORACLE_PILLARS.map((pillar) => (
          <motion.div key={pillar.title} variants={slideLeft}>
            {/*
              Era `variant="ecosystem"`, que es la de los NODOS DEL MAPA: rótulos
              de una palabra, radio 20 y título pequeño. Estas llevan título y
              descripción, así que son tarjetas de contenido. De ahí venía el
              radio 20 que desalineaba esta sección frente a las otras cuatro.
            */}
            <Card variant="product" title={pillar.title} description={pillar.description} hover />
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={slideLeft} className="flex flex-wrap gap-8 mt-4">
        <GenesisStatBlock value="IA" label="Motor propietario" />
        <GenesisStatBlock value="24/7" label="Procesamiento" mono />
        <GenesisStatBlock value="Core" label="Capa neurálgica" mono />
      </motion.div>

      <motion.div variants={slideLeft} className="mt-4">
        <Button variant="secondary" size="md" href={EXTERNAL_LINKS.GORACLE}>
          Conocer G-Oracle
        </Button>
      </motion.div>
    </SceneWrapper>
  )
})

export default SceneGOracle
