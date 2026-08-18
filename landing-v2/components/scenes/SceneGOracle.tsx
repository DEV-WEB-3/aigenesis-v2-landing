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
      sectionOverlay={<GoracleSectionBackdrop />}
      particleSlot={<GoracleQuantumBrain isActive={isActive} />}
    >
      <SectionHeader
        label="G-Oracle"
        title="Cerebro del"
        highlight="ecosistema."
        highlightTone="signature"
        description="G-Oracle es la capa de inteligencia que interpreta, conecta y gobierna el flujo de información. GPulse entrega señales; G-Oracle define la inteligencia estratégica del protocolo."
      />

      {/*
        APILADAS, no tres en fila — como Booster y Staking.

        Era `sm:grid-cols-3`, y eso dejaba cada tarjeta en 178 px de ancho dentro
        de una columna de 554. Con ~95 caracteres de descripción, 178 px obliga a
        envolver hasta los 351 px de alto: tres columnas altas y estrechas.

        Booster y Staking tienen tarjetas del mismo tipo —etiqueta, título y
        descripción— y las apilan a 408 y 476 px de ancho. G-Oracle era la única
        que las ponía en horizontal, y de ahí venía que se sintiera de otra
        familia.

        Medido: de 178 px de ancho se pasa a 554, y de 351 de alto a ~110 por
        tarjeta. Mismo contenido, sin recortar una palabra.
      */}
      <motion.div variants={containerV} className="flex flex-col gap-genesis-3">
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

      <motion.div variants={slideLeft} className="flex flex-wrap gap-8">
        <GenesisStatBlock value="IA" label="Motor propietario" />
        <GenesisStatBlock value="24/7" label="Procesamiento" mono />
        <GenesisStatBlock value="Core" label="Capa neurálgica" mono />
      </motion.div>

      <motion.div variants={slideLeft}>
        <Button variant="secondary" size="md" href={EXTERNAL_LINKS.GORACLE}>
          Conocer G-Oracle
        </Button>
      </motion.div>
    </SceneWrapper>
  )
})

export default SceneGOracle
