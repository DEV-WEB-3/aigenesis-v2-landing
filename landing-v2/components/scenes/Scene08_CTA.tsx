'use client'

import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { containerV, wordV, slideLeft } from '@/components/ui/SceneShared'

const FOOTER_LINKS = ['Whitepaper', 'Twitter', 'Telegram', 'Discord']

interface Props { isActive?: boolean }

const Scene08_CTA = forwardRef<HTMLElement, Props>(
  function Scene08_CTA({ isActive = false }, ref) {
    return (
      <section
        ref={ref}
        className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ scrollSnapAlign: 'start', pointerEvents: 'auto' }}
      >
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              key="scene08"
              variants={containerV}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-6 px-8 max-w-3xl"
            >
              {/* Heading */}
              <motion.h2
                className="text-5xl md:text-6xl font-bold leading-tight"
                style={{ fontFamily: 'var(--font-space-grotesk)', textShadow: '0 2px 40px rgba(0,0,0,0.9)' }}
              >
                {['¿Listo para ser parte'].map((line, i) => (
                  <motion.span key={i} variants={wordV} style={{ display: 'block', color: '#fff' }}>
                    {line}
                  </motion.span>
                ))}
                <motion.span
                  variants={wordV}
                  style={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #8B5CF6, #E91E8B, #00E5FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  del futuro?
                </motion.span>
              </motion.h2>

              {/* Botones */}
              <motion.div variants={slideLeft} className="flex flex-wrap items-center justify-center gap-4 mt-4">
                {/* Primary */}
                <motion.button
                  className="rounded-full px-8 py-4 text-lg font-semibold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #E91E8B)',
                    fontFamily: 'var(--font-space-grotesk)',
                    border: '1px solid rgba(233,30,139,0.3)',
                    pointerEvents: 'auto',
                  }}
                  whileHover={{ boxShadow: '0 0 28px rgba(233,30,139,0.5), 0 0 56px rgba(139,92,246,0.3)', y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Crear Cuenta
                </motion.button>

                {/* Outline */}
                <motion.button
                  className="rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-200"
                  style={{
                    border: '1px solid rgba(139,92,246,0.5)',
                    fontFamily: 'var(--font-space-grotesk)',
                    background: 'transparent',
                    pointerEvents: 'auto',
                  }}
                  whileHover={{
                    borderColor: 'rgba(233,30,139,0.7)',
                    backgroundColor: 'rgba(233,30,139,0.08)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Explorar GPulse
                </motion.button>
              </motion.div>

              {/* Footer mini */}
              <motion.div variants={slideLeft} className="flex flex-col items-center gap-3 mt-10">
                <p className="text-xs tracking-widest" style={{ color: '#374151' }}>
                  EST. 2019 · GENESIS AI · BSC · V2.0
                </p>
                <div className="flex gap-4">
                  {FOOTER_LINKS.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-xs transition-colors duration-200"
                      style={{ color: '#6B7280', pointerEvents: 'auto' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#E91E8B')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    )
  }
)

export default Scene08_CTA
