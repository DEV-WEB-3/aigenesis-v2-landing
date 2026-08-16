'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import {
  SceneWrapper, SectionLabel, GradientText, GradientButton,
  StatBlock, FeatureItem, containerV, slideLeft, wordV,
} from '@/components/ui/SceneShared'
import { EXTERNAL_LINKS } from '@/lib/routes'
import { MARKETPLACE_STATS } from '@/lib/institutionalMetrics'
import MarketplaceSectionBackdrop from '@/components/marketplace/MarketplaceSectionBackdrop'
import MarketplaceGlobalCommerce from '@/components/marketplace/MarketplaceGlobalCommerce'

interface Props { isActive?: boolean }

const SceneMarketplace = forwardRef<HTMLElement, Props>(
  function SceneMarketplace({ isActive = false }, ref) {
    return (
      <SceneWrapper
        ref={ref}
        isActive={isActive}
        motionKey="scene04"
        sectionId="marketplace"
        wideStack
        particleColumn
        className="marketplace-section-layout"
        sectionOverlay={<MarketplaceSectionBackdrop visible={isActive} />}
        particleSlot={<MarketplaceGlobalCommerce isActive={isActive} />}
      >

        <SectionLabel>Marketplace</SectionLabel>

        <motion.h2
          className="text-5xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-space-grotesk)', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          <motion.span variants={wordV} className="block text-genesis-text">
            Marketplace Global
          </motion.span>
          <GradientText tone="signature">AiGenesis.</GradientText>
        </motion.h2>

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg text-genesis-mist">
          Marketplace con catálogo global de +500,000 productos. Paga con AIG, USDT, o tarjeta.
          Envío internacional a +190 países con tracking en tiempo real.
        </motion.p>

        {/* Features 2×2 */}
        <motion.div variants={containerV} className="grid grid-cols-2 gap-4 mt-2">
          <FeatureItem glass num="/01" text="Catálogo CJ Global" />
          <FeatureItem glass num="/02" text="Pago AIG + USDT + Fiat" />
          <FeatureItem glass num="/03" text="Tracking en vivo" />
          <FeatureItem glass num="/04" text="Envío a +190 países" />
        </motion.div>

        {/* Stats */}
        <motion.div variants={slideLeft} className="flex gap-10 mt-2">
          {MARKETPLACE_STATS.map((stat) => (
            <StatBlock key={stat.label} {...stat} isActive={isActive} />
          ))}
        </motion.div>

        <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
          <MarketplaceGlobalCommerce isActive={isActive} />
        </motion.div>

        <GradientButton className="mt-2" href={EXTERNAL_LINKS.MARKETPLACE}>Explorar Marketplace →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default SceneMarketplace
