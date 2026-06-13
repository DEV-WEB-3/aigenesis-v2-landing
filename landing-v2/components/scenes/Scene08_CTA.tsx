'use client'

import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/genesis'
import { containerV, GenesisHeadline, slideLeft } from '@/components/ui/SceneShared'
import { ROUTES, EXTERNAL_LINKS } from '@/lib/routes'
import InstitutionalFooter from '@/components/layout/InstitutionalFooter'
import CtaBrandSignature from '@/components/cta/CtaBrandSignature'
import GenesisFinalPortal from '@/components/portal/GenesisFinalPortal'

interface Props {
  isActive?: boolean
}

const Scene08_CTA = forwardRef<HTMLElement, Props>(function Scene08_CTA(
  { isActive = false },
  ref
) {
  return (
    <section
      ref={ref}
      id="cta"
      className="home-section-fit cta-final-section relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ scrollSnapAlign: 'start', pointerEvents: 'auto' }}
    >
      <GenesisFinalPortal isActive={isActive} />

      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key="scene08"
            variants={containerV}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="cta-final-stack cta-final-stack--portal flex flex-col items-center gap-5 px-8 max-w-3xl"
          >
            <GenesisHeadline
              variant="cta"
              lead="¿Listo para ser parte"
              highlight="del futuro?"
            />

            <CtaBrandSignature />

            <motion.div
              variants={slideLeft}
              className="cta-final-actions cta-final-actions--portal-keys flex flex-wrap items-center justify-center gap-4"
            >
              <Button variant="signature" size="lg" href={ROUTES.REGISTER}>
                Crear Cuenta
              </Button>
              <Button variant="secondary" size="lg" href={EXTERNAL_LINKS.GPULSE_APP}>
                Explorar GPulse
              </Button>
            </motion.div>

            <motion.div variants={slideLeft} className="cta-final-footer-slot w-full mt-8">
              <InstitutionalFooter />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
})

export default Scene08_CTA
