'use client'

import { useT } from '@/context/IdiomaContext'
import { useEffect, useRef, forwardRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Card } from '@/components/ui/genesis'
import { GenesisHeadline, GradientButton } from '@/components/ui/SceneShared'
import { useSectionEnterAnimation } from '@/hooks/useSectionEnterAnimation'
import { SectionVisualProvider } from '@/hooks/useSectionVisualActive'
import EcosystemEnergyLinks from '@/components/ecosystem/EcosystemEnergyLinks'
import { sectionHref, type SectionId } from '@/lib/routes'
import { HeadingLevel } from '@/components/ui/genesis/Heading'
import { LLEGADA_CONTENIDO_S, LLEGADA_CIFRA_S } from '@/lib/design/motion'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

/* Mismos `exit` inalcanzables que en `SceneShared`, y por el mismo motivo:
   `shouldMountContent` es pegajoso y el contenido no se desmonta nunca. */
const ENTRADA = { duration: LLEGADA_CONTENIDO_S, ease: [0.4, 0, 0.2, 1] } as const

const slideInLeft = {
  hidden: { opacity: 0, x: -40, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: ENTRADA },
}

const slideInRight = {
  hidden: { opacity: 0, x: 40, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: ENTRADA },
}

function StackArrow() {
  return (
    <div className="flex justify-center py-1 text-genesis-ghost" aria-hidden="true">
      ↓
    </div>
  )
}

function MapCard({
  title,
  sectionId,
  compact = false,
  ecoRole = 'module',
}: {
  title: string
  sectionId: SectionId
  compact?: boolean
  ecoRole?: 'token' | 'module'
}) {
  const roleClass = ecoRole === 'token' ? 'eco-node-token' : 'eco-node-module'

  return (
    <a href={sectionHref(sectionId)} className={`no-underline block pointer-events-auto ${roleClass}`}>
      <Card
        variant="ecosystem"
        title={title}
        className={compact ? 'p-genesis-4' : undefined}
        hover
      />
    </a>
  )
}

function AnimatedCounter({
  to,
  suffix = '',
  isActive,
  className = '',
}: {
  to: number
  suffix?: string
  isActive: boolean
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null!)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true
    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: to,
      duration: LLEGADA_CIFRA_S,
      delay: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix
      },
    })
    return () => {
      tween.kill()
      hasAnimated.current = false
    }
  }, [isActive, to, suffix])

  useEffect(() => {
    if (!isActive) {
      gsap.killTweensOf(ref.current)
      hasAnimated.current = false
      if (ref.current) ref.current.textContent = '0' + suffix
    }
  }, [isActive, suffix])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}

const statGradientClass =
  'font-display text-2xl font-bold text-gradient-genesis-strong'

interface EcosystemSectionProps {
  isActive?: boolean
}

const EcosystemSection = forwardRef<HTMLElement, EcosystemSectionProps>(
  function EcosystemSection({ isActive = false }, ref) {
    const t = useT()
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

    return (
      <SectionVisualProvider visualActive={shouldAnimate}>
      <section
        ref={setSectionRef}
        id="ecosistema"
        /*
          SIN `lg:h-screen`. La utilidad fija `height: 100dvh` y GANA a
          `.home-section-fit`, que declara `min-height: calc(100dvh - 76px)`:
          Tailwind vive en una capa posterior, asi que se le gana quitandola, no
          peleando con la especificidad. Es la misma correccion que ya llevan las
          otras doce y que `SceneShared` documenta.

          Medido: esta seccion sobraba exactamente 76 px —el alto de la barra—
          en cualquier ventana. Un exceso constante e igual al enganche es la
          firma de un fallo estructural, no de contenido.
        */
        className="home-section-fit relative flex w-full items-stretch justify-start px-6 md:px-12 lg:items-center"
        style={{ pointerEvents: 'auto' }}
      >
        {/*
          Esta sección no pasa por `SceneWrapper`, así que no heredaba el nivel
          de encabezado que las demás reciben de él: sus tarjetas salían como h2
          en vez de h3, medido en el DOM. El nivel se establece aquí igual que
          allí, para que la jerarquía no dependa de qué envoltorio usó cada
          sección.
        */}
        <HeadingLevel>
        <div className="scene-content-frame ecosystem-content-frame flex w-full flex-col items-center gap-6 max-w-7xl mx-auto px-2 sm:px-0 lg:grid lg:grid-cols-2 lg:items-center lg:gap-6">
          {isNaturalScroll ? (
            shouldMountContent ? (
              <motion.div
                key="ecosystem-content"
                variants={containerVariants}
                initial="hidden"
                animate={shouldAnimate ? 'visible' : 'hidden'}
                className="scene-content-stack ecosystem-content-stack flex flex-col gap-4 max-w-lg lg:max-w-[27rem] lg:justify-self-end lg:pr-1"
              >
                <motion.span variants={slideInLeft} className="label-section text-genesis-fuchsia">
                  Ecosistema
                </motion.span>

                <GenesisHeadline lead="El stack" highlight="Genesis" />

                <motion.p variants={slideInLeft} className="text-body-lg text-genesis-mist leading-relaxed">
                  Un universo de productos interconectados sobre Binance Smart Chain.
                  Cada capítulo amplifica al siguiente en una arquitectura modular e institucional.
                </motion.p>

                <motion.div variants={slideInLeft} className="flex gap-8 mt-1">
                  <div className="flex flex-col gap-1">
                    <AnimatedCounter
                      to={15}
                      suffix="+"
                      isActive={isActive}
                      className={statGradientClass}
                    />
                    <span className="text-caption text-genesis-ghost uppercase tracking-wider">{t('Pilares')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={statGradientClass}>2023</span>
                    <span className="text-caption text-genesis-ghost uppercase tracking-wider">Fundado</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <AnimatedCounter
                      to={100}
                      suffix="K+"
                      isActive={isActive}
                      className={statGradientClass}
                    />
                    <span className="text-caption text-genesis-ghost uppercase tracking-wider">Comunidad</span>
                  </div>
                </motion.div>

                <GradientButton className="mt-1" href={sectionHref('token')}>
                  Explorar Ecosistema →
                </GradientButton>
              </motion.div>
            ) : null
          ) : (
            <AnimatePresence mode="wait">
              {shouldMountContent && (
                <motion.div
                  key="ecosystem-content"
                  variants={containerVariants}
                  initial="hidden"
                  animate={shouldAnimate ? 'visible' : 'hidden'}
                  exit="exit"
                  className="scene-content-stack ecosystem-content-stack flex flex-col gap-4 max-w-lg lg:max-w-[27rem] lg:justify-self-end lg:pr-1"
                >
                <motion.span variants={slideInLeft} className="label-section text-genesis-fuchsia">
                  Ecosistema
                </motion.span>

                <GenesisHeadline lead="El stack" highlight="Genesis" />

                <motion.p variants={slideInLeft} className="text-body-lg text-genesis-mist leading-relaxed">
                  Un universo de productos interconectados sobre Binance Smart Chain.
                  Cada capítulo amplifica al siguiente en una arquitectura modular e institucional.
                </motion.p>

                <motion.div variants={slideInLeft} className="flex gap-8 mt-1">
                  <div className="flex flex-col gap-1">
                    <AnimatedCounter
                      to={15}
                      suffix="+"
                      isActive={isActive}
                      className={statGradientClass}
                    />
                    <span className="text-caption text-genesis-ghost uppercase tracking-wider">{t('Pilares')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={statGradientClass}>2023</span>
                    <span className="text-caption text-genesis-ghost uppercase tracking-wider">Fundado</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <AnimatedCounter
                      to={100}
                      suffix="K+"
                      isActive={isActive}
                      className={statGradientClass}
                    />
                    <span className="text-caption text-genesis-ghost uppercase tracking-wider">Comunidad</span>
                  </div>
                </motion.div>

                <GradientButton className="mt-1" href={sectionHref('token')}>
                  Explorar Ecosistema →
                </GradientButton>
              </motion.div>
              )}
            </AnimatePresence>
          )}

          <AnimatePresence mode="wait">
            {shouldMountContent && (
              <motion.div
                key="ecosystem-map"
                variants={containerVariants}
                initial="hidden"
                animate={shouldAnimate ? 'visible' : 'hidden'}
                exit="exit"
                className="ecosystem-map-column flex w-full max-w-md flex-col pointer-events-auto lg:max-w-md lg:justify-self-start"
                aria-label="Mapa del ecosistema"
              >
                <div className="ecosystem-map-visual relative">
                  <EcosystemEnergyLinks isActive={isActive} />
                  <div className="ecosystem-map-nodes relative z-[1] flex flex-col">
                <motion.div variants={slideInRight}>
                  <MapCard title="AiG Token" sectionId="token" ecoRole="token" />
                </motion.div>
                <StackArrow />
                <motion.div variants={slideInRight} className="grid grid-cols-3 gap-2">
                  <MapCard title="Mining" sectionId="mining" compact />
                  <MapCard title="Booster" sectionId="booster" compact />
                  <MapCard title="Staking" sectionId="staking" compact />
                </motion.div>
                <StackArrow />
                <motion.div variants={slideInRight} className="grid grid-cols-2 gap-2">
                  <MapCard title="G-Pulse" sectionId="gpulse" compact />
                  <MapCard title="G-Oracle" sectionId="goracle" compact />
                </motion.div>
                <StackArrow />
                <motion.div variants={slideInRight}>
                  <MapCard title="Marketplace Global" sectionId="marketplace" compact />
                </motion.div>
                <StackArrow />
                <motion.div variants={slideInRight}>
                  <MapCard title="Comunidad G11" sectionId="comunidad" compact />
                </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </HeadingLevel>
      </section>
      </SectionVisualProvider>
    )
  }
)

export default EcosystemSection
