'use client'

import { useEffect, useRef, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

// ─── Variants ────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
  exit:   { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}

const slideInLeft = {
  hidden:  { opacity: 0, x: -50, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0,   filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, x: -30, filter: 'blur(4px)', transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
}

const wordReveal = {
  hidden:  { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

// ─── Animated Counter (GSAP) ─────────────────────────────────────────────────
function AnimatedCounter({
  to,
  suffix = '',
  isActive,
}: {
  to: number
  suffix?: string
  isActive: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null!)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true
    const obj = { val: 0 }
    gsap.to(obj, {
      val: to,
      duration: 1.8,
      delay: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix
      },
    })
  }, [isActive, to, suffix])

  // Reset cuando la sección deja de estar activa
  useEffect(() => {
    if (!isActive) {
      hasAnimated.current = false
      if (ref.current) ref.current.textContent = '0' + suffix
    }
  }, [isActive, suffix])

  return <span ref={ref}>0{suffix}</span>
}

// ─── EcosystemSection ────────────────────────────────────────────────────────
interface EcosystemSectionProps {
  isActive?: boolean
}

const EcosystemSection = forwardRef<HTMLElement, EcosystemSectionProps>(
  function EcosystemSection({ isActive = false }, ref) {
    return (
      <section
        ref={ref}
        className="relative flex h-screen w-full items-center px-12"
        style={{
          scrollSnapAlign: 'start',
          pointerEvents: 'auto',
          overflow: 'hidden',
        }}
      >
        <div className="flex w-full items-center justify-between gap-8 max-w-7xl mx-auto">

          {/* Columna izquierda — texto */}
          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key="ecosystem-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-6 max-w-lg"
              >
                {/* Número de sección */}
                <motion.span
                  variants={slideInLeft}
                  className="text-xs tracking-[0.3em] uppercase"
                  style={{ color: '#E91E8B', fontFamily: 'var(--font-space-grotesk)' }}
                >
                  Sección 01
                </motion.span>

                {/* Título — word reveal */}
                <motion.h2
                  className="text-5xl font-bold leading-tight text-white"
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                  }}
                >
                  {['El', 'Ecosistema'].map((word, i) => (
                    <motion.span
                      key={i}
                      variants={wordReveal}
                      style={{ display: 'inline-block', marginRight: '0.3em' }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  <motion.span
                    variants={wordReveal}
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
                </motion.h2>

                {/* Descripción */}
                <motion.p
                  variants={slideInLeft}
                  className="text-lg leading-relaxed"
                  style={{
                    color: '#94A3B8',
                    fontFamily: 'var(--font-inter)',
                    textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  }}
                >
                  Un universo de productos interconectados construidos sobre Binance Smart Chain.
                  Cada componente amplifica al siguiente, creando un ecosistema autosuficiente.
                </motion.p>

                {/* Stats con GSAP counters */}
                <motion.div variants={slideInLeft} className="flex gap-8 mt-2">
                  {/* Stats — "Fundado" es estático para no contar 0→2019 */}
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold" style={{ color: '#8B5CF6', fontFamily: 'var(--font-space-grotesk)' }}>
                      <AnimatedCounter to={5} suffix="+" isActive={isActive} />
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Productos activos</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold" style={{ color: '#8B5CF6', fontFamily: 'var(--font-space-grotesk)' }}>
                      2019
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Fundado</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold" style={{ color: '#8B5CF6', fontFamily: 'var(--font-space-grotesk)' }}>
                      <AnimatedCounter to={100} suffix="K+" isActive={isActive} />
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Comunidad</span>
                  </div>
                </motion.div>

                {/* CTA — aparece último */}
                <motion.button
                  variants={slideInLeft}
                  className="mt-2 w-fit rounded-full px-6 py-3 text-sm font-semibold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #E91E8B)',
                    fontFamily: 'var(--font-space-grotesk)',
                    pointerEvents: 'auto',
                  }}
                  whileHover={{
                    boxShadow: '0 0 20px rgba(139,92,246,0.5)',
                    y: -2,
                  }}
                >
                  Explorar Ecosistema →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Columna derecha — espacio para las partículas del canvas */}
          <div className="hidden md:block flex-1" aria-hidden="true" />
        </div>
      </section>
    )
  }
)

export default EcosystemSection
