'use client'

import { useEffect, useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Variants cinematográficos ───────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit:   { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const wordVariants = {
  hidden:  { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
}

const fadeSlideUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] } }),
  exit:    { opacity: 0, y: -16, transition: { duration: 0.2 } },
}

// ─── UTC Clock ───────────────────────────────────────────────────────────────
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
  return <span>{time}</span>
}

// ─── Word-by-word split text ─────────────────────────────────────────────────
function SplitWords({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.span className={className} style={{ display: 'inline', ...style }} variants={containerVariants}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
interface HeroSectionProps {
  isActive?: boolean
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  function HeroSection({ isActive = true }, ref) {
    return (
      <section
        ref={ref}
        className="relative flex h-screen w-full flex-col items-center justify-center px-6 text-center"
        style={{
          scrollSnapAlign: 'start',
          pointerEvents: 'auto',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              key="hero-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-6"
            >
              {/* Status bar */}
              <motion.div
                variants={fadeSlideUp}
                custom={0}
                className="flex items-center gap-3 text-xs tracking-widest text-gray-500 uppercase"
              >
                <span>EST. 2019</span>
                <span style={{ color: '#8B5CF6', opacity: 0.5 }}>·</span>
                <span>GENESIS AI</span>
                <span style={{ color: '#8B5CF6', opacity: 0.5 }}>·</span>
                <UtcClock />
                <span style={{ color: '#8B5CF6', opacity: 0.5 }}>·</span>
                <span>BSC</span>
                <span style={{ color: '#8B5CF6', opacity: 0.5 }}>·</span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#E91E8B' }} />
                  LIVE
                </span>
                <span style={{ color: '#8B5CF6', opacity: 0.5 }}>·</span>
                <span>V2.0</span>
              </motion.div>

              {/* Título — word by word reveal */}
              <h1
                className="font-display leading-none tracking-tight text-white"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: 'clamp(4rem, 10vw, 7rem)',
                  fontWeight: 700,
                  textShadow: '0 2px 40px rgba(0,0,0,0.9)',
                }}
              >
                <SplitWords text="Ai" />
                <motion.span
                  variants={wordVariants}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #8B5CF6, #E91E8B)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Genesis
                </motion.span>
              </h1>

              {/* Subtítulo */}
              <motion.p
                variants={fadeSlideUp}
                custom={0.3}
                className="max-w-2xl text-xl leading-relaxed"
                style={{
                  color: '#94A3B8',
                  fontFamily: 'var(--font-inter)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                }}
              >
                Donde la Inteligencia Artificial y el Blockchain crean{' '}
                <span className="text-white font-medium">un universo en expansión</span>
              </motion.p>

              {/* CTA */}
              <motion.button
                variants={fadeSlideUp}
                custom={0.5}
                className="mt-2 rounded-full px-8 py-4 text-base font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #E91E8B)',
                  fontFamily: 'var(--font-space-grotesk)',
                  pointerEvents: 'auto',
                }}
                whileHover={{
                  boxShadow: '0 0 24px rgba(139,92,246,0.5), 0 0 48px rgba(233,30,139,0.3)',
                  y: -2,
                }}
                transition={{ duration: 0.2 }}
              >
                Explora el Universo
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="text-xs tracking-widest text-gray-600 uppercase">scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ color: '#8B5CF6', fontSize: '1.25rem', opacity: 0.7 }}
              >
                ↓
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    )
  }
)

export default HeroSection
