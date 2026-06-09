'use client'

import { useRef, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

// ─── Variants compartidos ─────────────────────────────────────────────────────
export const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
  exit:   { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}
export const slideLeft = {
  hidden:  { opacity: 0, x: -50, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0,   filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, x: -30, filter: 'blur(4px)', transition: { duration: 0.25 } },
}
export const wordV = {
  hidden:  { opacity: 0, y: 28, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      variants={slideLeft}
      className="text-sm tracking-[0.3em] uppercase font-medium"
      style={{ color: '#E91E8B', fontFamily: 'var(--font-space-grotesk)' }}
    >
      {children}
    </motion.span>
  )
}

// ─── GradientHeading — tornasol violeta→magenta→cyan ─────────────────────────
export function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      variants={wordV}
      style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, #8B5CF6, #E91E8B, #00E5FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </motion.span>
  )
}

// ─── GradientButton ───────────────────────────────────────────────────────────
export function GradientButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.button
      variants={slideLeft}
      className={`w-fit rounded-full px-6 py-3 text-sm font-semibold text-white ${className}`}
      style={{
        background: 'linear-gradient(135deg, #8B5CF6, #E91E8B)',
        fontFamily: 'var(--font-space-grotesk)',
        border: '1px solid rgba(233,30,139,0.3)',
        pointerEvents: 'auto',
      }}
      whileHover={{ boxShadow: '0 0 20px rgba(139,92,246,0.5)', y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}

// ─── Feature item "/01 Texto" ─────────────────────────────────────────────────
export function FeatureItem({ num, text }: { num: string; text: string }) {
  return (
    <motion.div variants={slideLeft} className="flex items-start gap-3">
      <span className="font-mono font-bold text-lg leading-tight" style={{ color: '#E91E8B' }}>
        {num}
      </span>
      <span className="text-sm text-gray-300 leading-tight pt-0.5">{text}</span>
    </motion.div>
  )
}

// ─── AnimatedCounter (GSAP) ───────────────────────────────────────────────────
export function AnimatedCounter({
  to, suffix = '', isActive, decimals = 0,
}: {
  to: number; suffix?: string; isActive: boolean; decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null!)
  const animated = useRef(false)

  useEffect(() => {
    if (!isActive || animated.current) return
    animated.current = true
    const obj = { val: 0 }
    gsap.to(obj, {
      val: to, duration: 1.8, delay: 0.4, ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = obj.val.toFixed(decimals) + suffix
      },
    })
  }, [isActive, to, suffix, decimals])

  useEffect(() => {
    if (!isActive) { animated.current = false; if (ref.current) ref.current.textContent = '0' + suffix }
  }, [isActive, suffix])

  return <span ref={ref}>0{suffix}</span>
}

// ─── StatBlock ────────────────────────────────────────────────────────────────
export function StatBlock({ to, suffix, label, isActive, decimals = 0 }: {
  to: number; suffix: string; label: string; isActive: boolean; decimals?: number
}) {
  return (
    <motion.div variants={slideLeft} className="flex flex-col gap-1">
      <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
        <AnimatedCounter to={to} suffix={suffix} isActive={isActive} decimals={decimals} />
      </span>
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
    </motion.div>
  )
}

// ─── SceneWrapper ─────────────────────────────────────────────────────────────
// Wrapper reutilizable para todas las escenas snap
interface SceneWrapperProps {
  isActive: boolean
  children: React.ReactNode
  motionKey: string
}
export const SceneWrapper = forwardRef<HTMLElement, SceneWrapperProps & { className?: string }>(
  function SceneWrapper({ isActive, children, motionKey, className = '' }, ref) {
    return (
      <section
        ref={ref}
        className={`relative h-screen w-full flex items-center overflow-hidden ${className}`}
        style={{ scrollSnapAlign: 'start', pointerEvents: 'auto' }}
      >
        <div className="w-full max-w-6xl mx-auto px-8 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key={motionKey}
                variants={containerV}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-5"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Columna derecha — vacía: partículas del canvas */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </section>
    )
  }
)
