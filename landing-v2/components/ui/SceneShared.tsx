'use client'

import { useRef, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Button } from '@/components/ui/genesis'

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

// ─── SectionLabel — prefer SectionHeader; kept for legacy one-off labels ───────
export function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.span variants={slideLeft} className={`label-section ${className}`.trim()}>
      {children}
    </motion.span>
  )
}

export type GradientTone = 'strong' | 'brand' | 'signature' | 'intelligence'

const gradientToneClass: Record<GradientTone, string> = {
  strong: 'text-gradient-genesis-strong',
  brand: 'text-gradient-genesis-strong',
  signature: 'text-gradient-genesis-strong',
  intelligence: 'text-gradient-genesis-strong',
}

// ─── GradientText — acento G-Pulse (referencia oficial Genesis) ───────────────
export function GradientText({
  children,
  tone = 'signature',
}: {
  children: React.ReactNode
  tone?: GradientTone
}) {
  return (
    <motion.span
      variants={wordV}
      className={`${gradientToneClass[tone]} block`}
    >
      {children}
    </motion.span>
  )
}

/** Headline estándar Genesis — mismo tratamiento que G-Pulse «tiempo real.» */
export function GenesisHeadline({
  lead,
  highlight,
  variant = 'default',
}: {
  lead: string
  highlight: string
  variant?: 'default' | 'cta'
}) {
  return (
    <motion.h2
      className={
        variant === 'cta'
          ? 'cta-final-headline text-[clamp(2.35rem,5.8vw,3.85rem)] font-bold leading-[1.08] font-display'
          : 'scene-headline text-5xl font-bold leading-tight font-display'
      }
      style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
    >
      <motion.span variants={wordV} className="block text-genesis-text">
        {lead}
      </motion.span>
      <GradientText tone="signature">{highlight}</GradientText>
    </motion.h2>
  )
}

// ─── GradientButton — delega al Button primario del Design System ─────────────
export function GradientButton({
  children,
  className = '',
  href,
}: {
  children: React.ReactNode
  className?: string
  href?: string
}) {
  return (
    <motion.div variants={slideLeft} className="w-fit">
      <Button variant="primary" size="md" className={className} href={href}>
        {children}
      </Button>
    </motion.div>
  )
}

// ─── Feature item "/01 Texto" ─────────────────────────────────────────────────
export function FeatureItem({
  num,
  text,
  glass = false,
}: {
  num: string
  text: string
  glass?: boolean
}) {
  return (
    <motion.div
      variants={slideLeft}
      className={glass ? 'glass-info-item flex items-start gap-3' : 'flex items-start gap-3'}
    >
      <span className="font-mono font-bold text-lg leading-tight text-gradient-genesis-strong">
        {num}
      </span>
      <span className="text-sm text-genesis-mist leading-tight pt-0.5">{text}</span>
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
    const tween = gsap.to(obj, {
      val: to, duration: 1.8, delay: 0.4, ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = obj.val.toFixed(decimals) + suffix
      },
    })
    return () => {
      tween.kill()
      animated.current = false
    }
  }, [isActive, to, suffix, decimals])

  useEffect(() => {
    if (!isActive) {
      gsap.killTweensOf(ref.current)
      animated.current = false
      if (ref.current) ref.current.textContent = '0' + suffix
    }
  }, [isActive, suffix])

  return <span ref={ref}>0{suffix}</span>
}

// ─── StatBlock (animado — API legacy para scenes) ─────────────────────────────
export function StatBlock({ to, suffix, label, isActive, decimals = 0 }: {
  to: number; suffix: string; label: string; isActive: boolean; decimals?: number
}) {
  return (
    <motion.div variants={slideLeft} className="flex flex-col gap-1">
      <span className="font-display text-2xl font-bold text-genesis-text">
        <AnimatedCounter to={to} suffix={suffix} isActive={isActive} decimals={decimals} />
      </span>
      <span className="text-caption text-genesis-ghost uppercase tracking-wider">{label}</span>
    </motion.div>
  )
}

// ─── SceneWrapper ─────────────────────────────────────────────────────────────
interface SceneWrapperProps {
  isActive: boolean
  children: React.ReactNode
  motionKey: string
  sectionId?: string
  /** Secciones con cards densas — ancho extra solo en xl+ */
  wideStack?: boolean
  /** Reserva columna derecha para star dust WebGL (Trust, Staking…) */
  particleColumn?: boolean
  /** Visual DOM en columna de partículas (canvas, símbolos) */
  particleSlot?: React.ReactNode
  /** Capas de fondo a nivel sección (detrás del grid) */
  sectionOverlay?: React.ReactNode
}
export const SceneWrapper = forwardRef<HTMLElement, SceneWrapperProps & { className?: string }>(
  function SceneWrapper(
    {
      isActive,
      children,
      motionKey,
      sectionId,
      wideStack = false,
      particleColumn = false,
      particleSlot,
      sectionOverlay,
      className = '',
    },
    ref
  ) {
    return (
      <section
        ref={ref}
        id={sectionId}
        className={`home-section-fit relative h-screen w-full flex items-center overflow-hidden ${className}`}
        style={{ scrollSnapAlign: 'start', pointerEvents: 'auto' }}
      >
        {sectionOverlay}
        <div className="scene-content-frame w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-center">
          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key={motionKey}
                variants={containerV}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`scene-content-stack flex flex-col gap-4 lg:max-w-[27rem] lg:justify-self-end lg:pr-1${wideStack ? ' scene-content-stack--wide' : ''}`}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className={`scene-particle-gutter ${particleColumn ? 'scene-particle-gutter--featured hidden md:block' : 'hidden lg:block'}`}
            aria-hidden="true"
          >
            {particleSlot}
          </div>
        </div>
      </section>
    )
  }
)
