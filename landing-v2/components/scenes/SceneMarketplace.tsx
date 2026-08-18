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

        {/*
          CADA DATO, UNA SOLA VEZ.

          Antes, «+190 países» aparecía TRES veces —descripción, ficha /04 y
          métrica— y «+500.000 productos» y los métodos de pago, dos cada uno.
          El mismo hecho en tres formatos visuales distintos no refuerza: hace
          que la sección se sienta recargada teniendo sólo 60 palabras.

          El reparto ahora:
            descripción  qué es y CÓMO se paga (nombra los tres medios)
            fichas       lo que no es un número: proveedor y capacidad
            métricas     los números, y sólo ellos

          Se retiró además la métrica «3 MÉTODOS DE PAGO»: contar tres cuando la
          frase de arriba ya los NOMBRA no añade nada — saber que son AIG, USDT
          o tarjeta vale más que saber que son tres.
        */}
        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg text-genesis-mist">
          Catálogo global con envío internacional. Se paga con AIG, USDT o tarjeta.
        </motion.p>

        <motion.div variants={containerV} className="grid grid-cols-2 gap-4">
          <FeatureItem glass text="Catálogo CJ Global" />
          <FeatureItem glass text="Seguimiento en vivo" />
        </motion.div>

        {/* Stats */}
        <motion.div variants={slideLeft} className="flex gap-10">
          {MARKETPLACE_STATS.map((stat) => (
            <StatBlock key={stat.label} {...stat} isActive={isActive} />
          ))}
        </motion.div>

        <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
          <MarketplaceGlobalCommerce isActive={isActive} />
        </motion.div>

        <GradientButton href={EXTERNAL_LINKS.MARKETPLACE}>Explorar Marketplace →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default SceneMarketplace
