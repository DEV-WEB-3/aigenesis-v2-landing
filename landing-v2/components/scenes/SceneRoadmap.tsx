'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import OfficialDownloadButton from '@/components/cta/OfficialDownloadButton'
import RoadmapSectionBackdrop from '@/components/roadmap/RoadmapSectionBackdrop'
import RoadmapEvolutionPath from '@/components/roadmap/RoadmapEvolutionPath'
import RoadmapMilestoneList from '@/components/roadmap/RoadmapMilestoneList'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper,
  slideLeft,
} from '@/components/ui/SceneShared'
import { EXTERNAL_LINKS } from '@/lib/routes'

interface Props { isActive?: boolean }

const SceneRoadmap = forwardRef<HTMLElement, Props>(
  function SceneRoadmap({ isActive = false }, ref) {
    return (
      <SceneWrapper
        ref={ref}
        isActive={isActive}
        motionKey="scene07"
        sectionId="roadmap"
        particleColumn
        className="roadmap-section-layout"
        sectionOverlay={<RoadmapSectionBackdrop />}
        particleSlot={<RoadmapEvolutionPath isActive={isActive} />}
      >

        <SectionHeader
          label="Roadmap"
          title="Nuestro"
          highlight="horizonte."
        />

        <motion.div variants={slideLeft} className="scene-roadmap-timeline">
          <RoadmapMilestoneList />
        </motion.div>

        <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
          <RoadmapEvolutionPath isActive={isActive} />
        </motion.div>

        <motion.div variants={slideLeft}>
          <OfficialDownloadButton href={EXTERNAL_LINKS.MARKETING_PLAN_ES}>
            Descargar plan de marketing
          </OfficialDownloadButton>
        </motion.div>

      </SceneWrapper>
    )
  }
)

export default SceneRoadmap
