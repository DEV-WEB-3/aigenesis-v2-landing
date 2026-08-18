'use client'

import { forwardRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/genesis'
import { containerV, GenesisHeadline, slideLeft } from '@/components/ui/SceneShared'
import { ROUTES, EXTERNAL_LINKS } from '@/lib/routes'
import { useSectionEnterAnimation } from '@/hooks/useSectionEnterAnimation'
import { SectionVisualProvider } from '@/hooks/useSectionVisualActive'
import InstitutionalFooter from '@/components/layout/InstitutionalFooter'
import CtaBrandSignature from '@/components/cta/CtaBrandSignature'
import GenesisFinalPortal from '@/components/portal/GenesisFinalPortal'
import GenesisOrbSignature from '@/components/brand/GenesisOrbSignature'

interface Props {
  isActive?: boolean
}

const SceneCTA = forwardRef<HTMLElement, Props>(function SceneCTA(
  { isActive = false },
  ref
) {
  const {
    isNaturalScroll,
    sectionRef,
    shouldMountContent,
    shouldAnimate,
  } = useSectionEnterAnimation(isActive)

  const setSectionRef = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref, sectionRef]
  )

  const stack = (
    <motion.div
      key="scene08"
      variants={containerV}
      initial="hidden"
      animate={shouldAnimate ? 'visible' : 'hidden'}
      exit={isNaturalScroll ? undefined : 'exit'}
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

      <motion.div variants={slideLeft} className="cta-final-footer-slot w-full">
        <InstitutionalFooter />
      </motion.div>
    </motion.div>
  )

  return (
    /*
     * EL PROVEEDOR FALTABA AQUI, Y ESO DEJABA EL ARREGLO INERTE.
     *
     * Esta escena no usa `SceneWrapper` —se construye a mano—, asi que no
     * heredaba `SectionVisualProvider`. `useSectionVisualActive` devuelve
     * `contexto ?? respaldo`, y sin contexto el respaldo es el `isActive` CRUDO:
     * exactamente el valor cuyo uso este arreglo venia a eliminar. El portal
     * seguia desapareciendo con la seccion a la vista aunque el componente ya
     * llamara al hook.
     *
     * Es la trampa de siempre con el contexto: el consumidor parece correcto
     * leyendolo, y lo que falla esta en un ancestro que no existe.
     *
     * `shouldAnimate` es `entered || isActive` y ya se calculaba arriba; solo
     * faltaba publicarlo.
     */
    <SectionVisualProvider visualActive={shouldAnimate}>
      <section
        ref={setSectionRef}
        id="cta"
        className="home-section-fit cta-final-section relative w-full flex flex-col items-center justify-center text-center overflow-hidden lg:h-screen"
        style={{ pointerEvents: 'auto' }}
      >
        <GenesisFinalPortal isActive={isActive} />
        <GenesisOrbSignature placement="cta" isActive={isActive} />

        {isNaturalScroll ? (
          shouldMountContent ? stack : null
        ) : (
          <AnimatePresence mode="wait">
            {shouldMountContent ? stack : null}
          </AnimatePresence>
        )}
      </section>
    </SectionVisualProvider>
  )
})

export default SceneCTA
