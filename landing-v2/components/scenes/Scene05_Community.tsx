'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper, GradientButton,
  StatBlock, FeatureItem, containerV, slideLeft,
} from '@/components/ui/SceneShared'
import { ROUTES } from '@/lib/routes'
import CommunitySectionBackdrop from '@/components/community/CommunitySectionBackdrop'
import CommunityGenesisNetwork from '@/components/community/CommunityGenesisNetwork'

interface Props { isActive?: boolean }

const Scene05_Community = forwardRef<HTMLElement, Props>(
  function Scene05_Community({ isActive = false }, ref) {
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
          label="Sección 05"
          title="Crece con"
          highlight="quienes crecen."
        />

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg text-genesis-mist">
          Comunidad global G11 con plan de compensación transparente. Red binaria, bonos directos
          y pools globales para los rangos más activos.
        </motion.p>

        <motion.div variants={containerV} className="grid grid-cols-2 gap-4 mt-2">
          <FeatureItem glass num="/01" text="Bono Directo 8-11%" />
          <FeatureItem glass num="/02" text="Red Binaria Matching" />
          <FeatureItem glass num="/03" text="Global Pool Top Ranks" />
          <FeatureItem glass num="/04" text="Liderazgo Progresivo" />
        </motion.div>

        <motion.div variants={slideLeft} className="flex gap-10 mt-2">
          <StatBlock to={5000} suffix="+"      label="MIEMBROS ACTIVOS" isActive={isActive} />
          <StatBlock to={12}   suffix="M USDT" label="DISTRIBUIDOS"     isActive={isActive} />
          <StatBlock to={12}   suffix="+"      label="PAÍSES"           isActive={isActive} />
        </motion.div>

        <GradientButton className="mt-2" href={ROUTES.REGISTER}>Únete a la Comunidad →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default Scene05_Community
