'use client'

import { useRef, useEffect, forwardRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Button } from '@/components/ui/genesis'
import { useSectionEnterAnimation } from '@/hooks/useSectionEnterAnimation'
import { SectionVisualProvider } from '@/hooks/useSectionVisualActive'
import GenesisOrbSignature, { type GenesisOrbPlacement } from '@/components/brand/GenesisOrbSignature'

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
/** Text-safe entrance — no filter blur (mobile card readability) */
export const slideLeftCrisp = {
  hidden:  { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, x: -18, transition: { duration: 0.22 } },
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
  /** Genesis Orb reutilizado como firma visual de fondo */
  orbSignature?: GenesisOrbPlacement
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
      orbSignature,
      className = '',
    },
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

    const contentStack = (
      <motion.div
        key={motionKey}
        variants={containerV}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
        exit={isNaturalScroll ? undefined : 'exit'}
        className={`scene-content-stack flex flex-col gap-4 lg:max-w-[27rem] lg:justify-self-end lg:pr-1${wideStack ? ' scene-content-stack--wide' : ''}`}
      >
        {children}
      </motion.div>
    )

    return (
      <SectionVisualProvider visualActive={shouldAnimate}>
        <section
          ref={setSectionRef}
          id={sectionId}
          className={`home-section-fit relative w-full flex items-center overflow-visible lg:overflow-hidden lg:h-screen ${className}`}
          style={{ pointerEvents: 'auto' }}
        >
          {sectionOverlay}
          {orbSignature ? (
            <GenesisOrbSignature placement={orbSignature} isActive={isActive} />
          ) : null}
          <div className="scene-content-frame w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-center">
            {isNaturalScroll ? (
              shouldMountContent ? contentStack : null
            ) : (
              <AnimatePresence mode="wait">
                {shouldMountContent ? contentStack : null}
              </AnimatePresence>
            )}
            <div
              className={`scene-particle-gutter ${
                particleColumn
                  ? sectionId === 'trust'
                    ? 'scene-particle-gutter--featured scene-particle-gutter--trust-mobile md:block'
                    : 'scene-particle-gutter--featured hidden md:block'
                  : 'hidden lg:block'
              }`}
              aria-hidden="true"
            >
              {particleSlot}
            </div>
          </div>
        </section>
      </SectionVisualProvider>
    )
  }
)
