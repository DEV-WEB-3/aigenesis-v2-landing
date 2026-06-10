'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import {
  SceneWrapper, SectionLabel, GradientButton,
  StatBlock, FeatureItem, containerV, slideLeft, wordV,
} from '@/components/ui/SceneShared'

interface Props { isActive?: boolean }

const Scene05_Community = forwardRef<HTMLElement, Props>(
  function Scene05_Community({ isActive = false }, ref) {
    return (
      <SceneWrapper ref={ref} isActive={isActive} motionKey="scene05">

        <SectionLabel>Sección 05</SectionLabel>

        <motion.h2
          className="text-5xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-space-grotesk)', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          <motion.span variants={wordV} style={{ display: 'block', color: '#fff' }}>
            Crece con
          </motion.span>
          <motion.span variants={wordV} style={{ display: 'block', color: '#6B7280' }}>
            quienes crecen.
          </motion.span>
        </motion.h2>

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg" style={{ color: '#94A3B8' }}>
          Comunidad global G11 con plan de compensación transparente. Red binaria, bonos directos
          y pools globales para los rangos más activos.
        </motion.p>

        <motion.div variants={containerV} className="grid grid-cols-2 gap-4 mt-2">
          <FeatureItem num="/01" text="Bono Directo 8-11%" />
          <FeatureItem num="/02" text="Red Binaria Matching" />
          <FeatureItem num="/03" text="Global Pool Top Ranks" />
          <FeatureItem num="/04" text="Liderazgo Progresivo" />
        </motion.div>

        <motion.div variants={slideLeft} className="flex gap-10 mt-2">
          <StatBlock to={5000} suffix="+"      label="MIEMBROS ACTIVOS" isActive={isActive} />
          <StatBlock to={12}   suffix="M USDT" label="DISTRIBUIDOS"     isActive={isActive} />
          <StatBlock to={12}   suffix="+"      label="PAÍSES"           isActive={isActive} />
        </motion.div>

        <GradientButton className="mt-2">Únete a la Comunidad →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default Scene05_Community
