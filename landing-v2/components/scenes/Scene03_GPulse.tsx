'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import {
  SceneWrapper, SectionLabel, GradientText, GradientButton,
  StatBlock, FeatureItem, containerV, slideLeft, wordV,
} from '@/components/ui/SceneShared'

interface Props { isActive?: boolean }

const Scene03_GPulse = forwardRef<HTMLElement, Props>(
  function Scene03_GPulse({ isActive = false }, ref) {
    return (
      <SceneWrapper ref={ref} isActive={isActive} motionKey="scene03">

        <SectionLabel>Sección 03</SectionLabel>

        <motion.h2
          className="text-5xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-space-grotesk)', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          <motion.span variants={wordV} style={{ display: 'block', color: '#fff' }}>
            El oráculo
          </motion.span>
          <motion.span variants={wordV} style={{ display: 'block', color: '#6B7280' }}>
            que observa el futuro.
          </motion.span>
        </motion.h2>

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg" style={{ color: '#94A3B8' }}>
          GPulse Oracle analiza patrones en tiempo real usando el motor G-BRIDGE. Inteligencia artificial
          predictiva con señales automatizadas para mercados globales.
        </motion.p>

        {/* Features grid 2×2 */}
        <motion.div variants={containerV} className="grid grid-cols-2 gap-4 mt-2">
          <FeatureItem num="/01" text="Análisis Real-Time" />
          <FeatureItem num="/02" text="Martingala MG6" />
          <FeatureItem num="/03" text="Señales Automatizadas" />
          <FeatureItem num="/04" text="Motor G-BRIDGE" />
        </motion.div>

        {/* Stats row */}
        <motion.div variants={slideLeft} className="flex gap-10 mt-2">
          <StatBlock to={847}  suffix=" /día" label="SEÑALES DIARIAS" isActive={isActive} />
          <StatBlock to={3}    suffix=" activas" label="MESAS"        isActive={isActive} />
          <StatBlock to={94}   suffix="%"        label="UPTIME"       isActive={isActive} />
        </motion.div>

        <GradientButton className="mt-2">Acceder a GPulse →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default Scene03_GPulse
