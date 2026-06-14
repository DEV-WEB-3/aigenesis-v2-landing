'use client'

import { useEffect, useState, useCallback, useRef, forwardRef } from 'react'
import { motion } from 'framer-motion'
import HeroGenesisOrb from '@/components/hero/HeroGenesisOrb'
import HeroLivingField from '@/components/hero/HeroLivingField'
import HeroPremiumTagline from '@/components/hero/HeroPremiumTagline'
import { detectHeroPerfTier, type HeroPerfTier } from '@/lib/hero-performance'
import { sectionHref } from '@/lib/routes'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
}

const fadeSlideUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
  }),
}

function UtcClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const n = new Date()
      setTime(
        `${n.getUTCHours().toString().padStart(2,'0')}:${n.getUTCMinutes().toString().padStart(2,'0')}:${n.getUTCSeconds().toString().padStart(2,'0')} UTC`
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return <span suppressHydrationWarning>{time}</span>
}

interface HeroSectionProps {
  isActive?: boolean
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  function HeroSection({ isActive: _isActive = true }, ref) {
    const [tier, setTier] = useState<HeroPerfTier>('medium')
    const tierLockedRef = useRef(false)

    useEffect(() => {
      if (tierLockedRef.current) return
      tierLockedRef.current = true
      setTier(detectHeroPerfTier())
    }, [])

    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    return (
      <section
        ref={setRefs}
        id="hero"
        className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 text-center lg:h-screen"
        style={{
          pointerEvents: 'auto',
          overflow: 'hidden',
        }}
      >
        <HeroLivingField tier={tier} />

        {/* UI siempre montado — evita desmontar logo/orb por flicker de isActive */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hero-content-shell relative z-[2] flex w-full flex-col items-center"
        >
          <motion.div variants={fadeSlideUp} custom={0} className="hero-status-bar">
            <span>EST. 2019</span>
            <span className="text-genesis-core opacity-50">·</span>
            <span>GENESIS AI</span>
            <span className="text-genesis-core opacity-50">·</span>
            <UtcClock />
            <span className="text-genesis-core opacity-50">·</span>
            <span>BSC</span>
            <span className="text-genesis-core opacity-50">·</span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse bg-genesis-fuchsia" />
              LIVE
            </span>
            <span className="text-genesis-core opacity-50">·</span>
            <span>V2.0</span>
          </motion.div>

          <motion.div variants={fadeSlideUp} custom={0.06} className="hero-nucleus-stage">
            <HeroGenesisOrb tier={tier} />
          </motion.div>

          <HeroPremiumTagline delay={0.12} />

          <motion.div variants={fadeSlideUp} custom={0.14} className="hero-ui-stack">
            <p className="hero-subtitle font-body">
              Donde la Inteligencia Artificial y el Blockchain crean{' '}
              <span className="text-white font-medium">un universo en expansión</span>
            </p>

            <motion.a
              href={sectionHref('trust')}
              variants={fadeSlideUp}
              custom={0.28}
              className="cta-signature focus-ring-signature hero-cta inline-flex min-h-11 items-center justify-center rounded-full px-7 sm:px-8 py-3.5 text-sm sm:text-base font-semibold text-white no-underline font-display pointer-events-auto"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Explora el Universo
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2"
        >
          <div className="hero-scroll-mouse" aria-hidden="true">
            <motion.span
              className="hero-scroll-dot"
              animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>
    )
  }
)

export default HeroSection
