'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import {
  SceneWrapper, SectionLabel, GradientText, GradientButton,
  StatBlock, FeatureItem, containerV, slideLeft, wordV,
} from '@/components/ui/SceneShared'

interface Props { isActive?: boolean }

const Scene04_GevyShop = forwardRef<HTMLElement, Props>(
  function Scene04_GevyShop({ isActive = false }, ref) {
    return (
      <SceneWrapper ref={ref} isActive={isActive} motionKey="scene04">

        <SectionLabel>Sección 04</SectionLabel>

        <motion.h2
          className="text-5xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-space-grotesk)', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          <motion.span variants={wordV} style={{ display: 'block', color: '#fff' }}>
            Compra global.
          </motion.span>
          <GradientText>Paga en crypto.</GradientText>
        </motion.h2>

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg" style={{ color: '#94A3B8' }}>
          Marketplace con catálogo global de +500,000 productos. Paga con AIG, USDT, o tarjeta.
          Envío internacional a +190 países con tracking en tiempo real.
        </motion.p>

        {/* Features 2×2 */}
        <motion.div variants={containerV} className="grid grid-cols-2 gap-4 mt-2">
          <FeatureItem num="/01" text="Catálogo CJ Global" />
          <FeatureItem num="/02" text="Pago AIG + USDT + Fiat" />
          <FeatureItem num="/03" text="Tracking en vivo" />
          <FeatureItem num="/04" text="Envío a +190 países" />
        </motion.div>

        {/* Stats */}
        <motion.div variants={slideLeft} className="flex gap-10 mt-2">
          <StatBlock to={500} suffix="K+" label="PRODUCTOS"       isActive={isActive} />
          <StatBlock to={190} suffix="+"  label="PAÍSES"          isActive={isActive} />
          <StatBlock to={3}   suffix=""   label="MÉTODOS DE PAGO" isActive={isActive} />
        </motion.div>

        <GradientButton className="mt-2">Explorar Tienda →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default Scene04_GevyShop
