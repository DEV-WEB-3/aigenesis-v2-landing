'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper, GradientButton,
  StatBlock, FeatureItem, containerV, slideLeft,
} from '@/components/ui/SceneShared'
import { ROUTES } from '@/lib/routes'
import { COMMUNITY_STATS } from '@/lib/institutionalMetrics'
import CommunitySectionBackdrop from '@/components/community/CommunitySectionBackdrop'
import CommunityGenesisNetwork from '@/components/community/CommunityGenesisNetwork'

interface Props { isActive?: boolean }

const SceneCommunity = forwardRef<HTMLElement, Props>(
  function SceneCommunity({ isActive = false }, ref) {
    return (
      <SceneWrapper
        ref={ref}
        isActive={isActive}
        motionKey="scene05"
        sectionId="comunidad"
        particleColumn
        className="community-section-layout"
        sectionOverlay={<CommunitySectionBackdrop visible={isActive} />}
        particleSlot={<CommunityGenesisNetwork isActive={isActive} />}
      >

        <SectionHeader
          label="Comunidad"
          title="Crece con"
          highlight="quienes crecen."
        />

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg text-genesis-mist">
          Comunidad global G11 con plan de compensación transparente. Red binaria, bonos directos
          y pools globales para los rangos más activos.
        </motion.p>

        <motion.div variants={containerV} className="grid grid-cols-2 gap-4 mt-2">
          <FeatureItem glass text="Bono Directo 8-11%" />
          <FeatureItem glass text="Red Binaria Matching" />
          <FeatureItem glass text="Global Pool Top Ranks" />
          <FeatureItem glass text="Liderazgo Progresivo" />
        </motion.div>

        <motion.div variants={slideLeft} className="flex gap-10 mt-2">
          {COMMUNITY_STATS.map((stat) => (
            <StatBlock key={stat.label} {...stat} isActive={isActive} />
          ))}
        </motion.div>

        <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
          <CommunityGenesisNetwork isActive={isActive} />
        </motion.div>

        <GradientButton className="mt-2" href={ROUTES.REGISTER}>Únete a la Comunidad →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default SceneCommunity
