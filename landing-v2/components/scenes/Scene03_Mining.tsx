'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Button } from '@/components/ui/genesis'
import { SceneWrapper, slideLeft, containerV } from '@/components/ui/SceneShared'
import { EXTERNAL_LINKS } from '@/lib/routes'
import { MINING_BADGES } from '@/lib/institutionalMetrics'
import MiningSectionBackdrop from '@/components/mining/MiningSectionBackdrop'
import { MiningStoryIcon } from '@/components/mining/MiningStoryIcons'
import MiningConstellation from '@/components/mining/MiningConstellation'
import { MiningKpiIcon } from '@/components/mining/MiningNetworkIcons'

interface Props {
  isActive?: boolean
}

const MINING_FLOW = [
  {
    step: '01',
    kind: 'emission' as const,
    track: 'Emisión',
    title: 'Emisión programada',
    description:
      'Distribución on-chain con calendario transparente y reglas públicas de participación.',
  },
  {
    step: '02',
    kind: 'participation' as const,
    track: 'Participación',
    title: 'Participación activa',
    description:
      'El motor de Mining conecta a los participantes con la capa de emisión del ecosistema.',
  },
  {
    step: '03',
    kind: 'distribution' as const,
    track: 'Distribución',
    title: 'Distribución equitativa',
    description:
      'Asignación proporcional basada en reglas del protocolo, sin promesas de rendimiento fijo.',
  },
]

const MINING_KPIS = MINING_BADGES

const Scene03_Mining = forwardRef<HTMLElement, Props>(function Scene03_Mining(
  { isActive = false },
  ref
) {
  return (
    <SceneWrapper
      ref={ref}
      isActive={isActive}
      motionKey="scene03-mining"
      sectionId="mining"
      wideStack
      particleColumn
      className="mining-section-layout"
      sectionOverlay={<MiningSectionBackdrop visible={isActive} />}
      particleSlot={<MiningConstellation isActive={isActive} variant="full" />}
    >
      <SectionHeader
        label="Mining"
        title="Motor de participación"
        highlight="del ecosistema."
        description="Mining es la capa que articula emisión, participación y distribución dentro de AiGenesis. Un mecanismo de protocolo — no una promesa de rentabilidad."
      />

      <motion.div variants={slideLeft} className="mining-story-track" aria-hidden="true">
        <span className="mining-story-track__node">Emisión</span>
        <span className="mining-story-track__arrow" />
        <span className="mining-story-track__node">Participación</span>
        <span className="mining-story-track__arrow" />
        <span className="mining-story-track__node">Distribución</span>
      </motion.div>

      <motion.div variants={containerV} className="mining-flow-grid mt-1">
        {MINING_FLOW.map((item) => (
          <motion.article key={item.step} variants={slideLeft} className="mining-flow-card">
            <div className="mining-flow-card__head">
              <span className="mining-flow-card__icon" data-kind={item.kind}>
                <MiningStoryIcon kind={item.kind} />
              </span>
              <span className="mining-flow-card__step">{item.step}</span>
            </div>
            <span className="mining-flow-card__track">{item.track}</span>
            <h3 className="mining-flow-card__title">{item.title}</h3>
            <p className="mining-flow-card__desc">{item.description}</p>
          </motion.article>
        ))}
      </motion.div>

      <motion.div variants={slideLeft} className="mining-constellation-mobile md:hidden" aria-hidden="true">
        <MiningConstellation isActive={isActive} variant="compact" />
      </motion.div>

      <motion.div variants={slideLeft} className="mining-kpi-grid mt-2" aria-label="Indicadores de Mining">
        {MINING_KPIS.map((kpi) => (
          <div key={kpi.label} className="mining-kpi-card">
            <span className="mining-kpi-card__icon" aria-hidden="true">
              <MiningKpiIcon kind={kpi.icon} />
            </span>
            <span className={`mining-kpi-card__value${kpi.mono ? ' font-mono' : ''}`}>{kpi.value}</span>
            <span className="mining-kpi-card__label">{kpi.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div variants={slideLeft} className="mt-2">
        <Button variant="primary" size="md" href={EXTERNAL_LINKS.MINING}>
          Explorar participación
        </Button>
      </motion.div>
    </SceneWrapper>
  )
})

export default Scene03_Mining
