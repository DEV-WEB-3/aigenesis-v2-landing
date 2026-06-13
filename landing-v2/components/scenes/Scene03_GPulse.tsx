'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper, GradientButton,
  StatBlock, FeatureItem, containerV, slideLeft,
} from '@/components/ui/SceneShared'
import { EXTERNAL_LINKS } from '@/lib/routes'
import GpulseSectionBackdrop from '@/components/gpulse/GpulseSectionBackdrop'
import GpulseSignalNetwork from '@/components/gpulse/GpulseSignalNetwork'

interface Props { isActive?: boolean }

const Scene03_GPulse = forwardRef<HTMLElement, Props>(
  function Scene03_GPulse({ isActive = false }, ref) {
    return (
      <SceneWrapper
        ref={ref}
        isActive={isActive}
        motionKey="scene03-gpulse"
        sectionId="gpulse"
        particleColumn
        className="gpulse-section-layout"
        sectionOverlay={<GpulseSectionBackdrop visible={isActive} />}
        particleSlot={<GpulseSignalNetwork isActive={isActive} />}
      >

        <SectionHeader
          label="G-Pulse"
          labelClassName="text-genesis-fuchsia"
          title="Señales en"
          highlight="tiempo real."
        />

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg text-genesis-mist">
          GPulse entrega análisis operativo y señales automatizadas para mercados globales.
          Capa de ejecución táctica — complementaria al núcleo de inteligencia G-Oracle.
        </motion.p>

        <motion.div variants={containerV} className="grid grid-cols-2 gap-4 mt-2">
          <FeatureItem num="/01" text="Análisis Real-Time" />
          <FeatureItem num="/02" text="Señales Automatizadas" />
          <FeatureItem num="/03" text="Alertas de Mercado" />
          <FeatureItem num="/04" text="Integración G-BRIDGE" />
        </motion.div>

        <motion.div variants={slideLeft} className="flex gap-10 mt-2">
          <StatBlock to={847} suffix=" /día" label="SEÑALES DIARIAS" isActive={isActive} />
          <StatBlock to={3}   suffix=" activas" label="MESAS" isActive={isActive} />
          <StatBlock to={94}  suffix="%" label="UPTIME" isActive={isActive} />
        </motion.div>

        <GradientButton className="mt-2" href={EXTERNAL_LINKS.GPULSE_APP}>
          Acceder a G-Pulse →
        </GradientButton>

      </SceneWrapper>
    )
  }
)

export default Scene03_GPulse
