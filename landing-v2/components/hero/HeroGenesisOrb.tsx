'use client'

import { useCallback, useEffect, useRef } from 'react'
import { GenesisOfficialLogo } from '@/components/brand'
import type { LogoSize } from '@/components/brand/types'
import { HERO_RGB } from '@/lib/hero-palette'
import { BURST_PARTICLE_COUNTS, ORB_RING_PARTICLE_COUNTS, type HeroPerfTier } from '@/lib/hero-performance'
import { cn } from '@/lib/utils'

export type GenesisOrbVariant = 'hero' | 'signature'

interface HeroGenesisOrbProps {
  tier?: HeroPerfTier
  className?: string
  variant?: GenesisOrbVariant
  /** Hero defaults to true; signature defaults to false unless set */
  showLogo?: boolean
  logoSize?: LogoSize
  /** Pause canvas animation when section is off-screen */
  paused?: boolean
}

interface BurstParticle {
  angle: number
  dist: number
  speed: number
  size: number
  color: string
  opacity: number
  life: number
}

interface RingParticle {
  angle: number
  radius: number
  speed: number
  size: number
  color: string
  opacity: number
  wobble: number
}

const COLORS = [
  HERO_RGB.fuchsia.join(', '),
  HERO_RGB.cyan.join(', '),
  HERO_RGB.ion.join(', '),
]

function createBurstParticles(tier: HeroPerfTier, radius: number): BurstParticle[] {
  const count = BURST_PARTICLE_COUNTS[tier]
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + Math.random() * 0.5,
    dist: radius * (0.72 + Math.random() * 0.22),
    speed: 0.025 + Math.random() * 0.06,
    size: 0.7 + Math.random() * 2.2,
    color: COLORS[i % 3],
    opacity: 0.42 + Math.random() * 0.42,
    life: Math.random(),
  }))
}

function createRingParticles(tier: HeroPerfTier, radius: number): RingParticle[] {
  const count = ORB_RING_PARTICLE_COUNTS[tier]
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    radius: radius * (0.88 + (i % 5) * 0.025),
    speed: 0.0004 + (i % 7) * 0.00008,
    size: 1.2 + (i % 3) * 0.6,
    color: COLORS[i % 3],
    opacity: 0.48 + (i % 4) * 0.1,
    wobble: Math.random() * Math.PI * 2,
  }))
}

export default function HeroGenesisOrb({
  tier = 'high',
  className,
  variant = 'hero',
  showLogo,
  logoSize = 'xl',
  paused = false,
}: HeroGenesisOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const burstRef = useRef<BurstParticle[]>([])
  const ringRef = useRef<RingParticle[]>([])
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const radiusRef = useRef(180)
  const logicalSizeRef = useRef(480)
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  const renderLogo = showLogo ?? variant === 'hero'

  const drawOrb = useCallback((ctx: CanvasRenderingContext2D, size: number, t: number) => {
    const cx = size / 2
    const cy = size / 2
    const baseR = radiusRef.current
    ctx.clearRect(0, 0, size, size)

    const hGrad = ctx.createLinearGradient(cx - baseR, cy, cx + baseR, cy)
    hGrad.addColorStop(0, `rgba(${HERO_RGB.fuchsia.join(',')}, 0.22)`)
    hGrad.addColorStop(0.5, `rgba(${HERO_RGB.core.join(',')}, 0.06)`)
    hGrad.addColorStop(1, `rgba(${HERO_RGB.cyan.join(',')}, 0.24)`)

    const innerDepth = ctx.createRadialGradient(cx, cy, baseR * 0.2, cx, cy, baseR * 1.05)
    innerDepth.addColorStop(0, 'rgba(2, 4, 10, 0.55)')
    innerDepth.addColorStop(0.55, 'rgba(3, 7, 17, 0.22)')
    innerDepth.addColorStop(1, 'transparent')
    ctx.fillStyle = innerDepth
    ctx.beginPath()
    ctx.arc(cx, cy, baseR * 1.05, 0, Math.PI * 2)
    ctx.fill()

    const outerGlow = ctx.createRadialGradient(cx, cy, baseR * 0.72, cx, cy, baseR * 1.58)
    outerGlow.addColorStop(0, `rgba(${HERO_RGB.fuchsia.join(',')}, 0.14)`)
    outerGlow.addColorStop(0.38, `rgba(${HERO_RGB.core.join(',')}, 0.05)`)
    outerGlow.addColorStop(0.62, `rgba(${HERO_RGB.cyan.join(',')}, 0.08)`)
    outerGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = outerGlow
    ctx.beginPath()
    ctx.arc(cx, cy, baseR * 1.58, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = hGrad
    ctx.lineWidth = 2.2
    ctx.globalAlpha = 0.32
    ctx.beginPath()
    ctx.arc(cx, cy, baseR * 0.95, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1

    for (const p of ringRef.current) {
      p.angle += p.speed
      const wobble = Math.sin(t * 0.0016 + p.wobble) * 8
      const r = p.radius + wobble
      const x = cx + Math.cos(p.angle) * r
      const y = cy + Math.sin(p.angle) * r * 0.96
      const pulse = 0.8 + Math.sin(t * 0.002 + p.wobble) * 0.2

      ctx.beginPath()
      ctx.arc(x, y, p.size * pulse, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${p.color}, ${p.opacity * pulse})`
      ctx.fill()
    }

    for (const p of burstRef.current) {
      p.dist += p.speed
      p.life += 0.005
      if (p.dist > baseR * 1.75 || p.life > 1) {
        p.angle = Math.random() * Math.PI * 2
        p.dist = baseR * (0.78 + Math.random() * 0.12)
        p.speed = 0.025 + Math.random() * 0.055
        p.life = 0
      }

      const wobble = Math.sin(t * 0.0014 + p.angle * 3) * 6
      const x = cx + Math.cos(p.angle) * (p.dist + wobble)
      const y = cy + Math.sin(p.angle) * (p.dist + wobble) * 0.94
      const fade = 1 - (p.dist - baseR * 0.7) / (baseR * 1.05)
      const alpha = Math.max(0, p.opacity * fade)

      ctx.beginPath()
      ctx.arc(x, y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`
      ctx.fill()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const measure = () => {
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, tier === 'low' ? 1 : 2)
      const side = Math.min(rect.width, rect.height)
      logicalSizeRef.current = side
      radiusRef.current = side * 0.4
      canvas.width = side * dpr
      canvas.height = side * dpr
      canvas.style.width = `${side}px`
      canvas.style.height = `${side}px`
      const ctx = canvas.getContext('2d')
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
      burstRef.current = createBurstParticles(tier, radiusRef.current)
      ringRef.current = createRingParticles(tier, radiusRef.current)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(parent)

    let last = performance.now()
    const loop = (now: number) => {
      if (!pausedRef.current) {
        const dt = now - last
        timeRef.current += tier === 'low' ? dt * 0.4 : dt
        const ctx = canvas.getContext('2d')
        if (ctx) drawOrb(ctx, logicalSizeRef.current, timeRef.current)
      }
      last = now
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [drawOrb, tier])

  return (
    <div className={cn('hero-nucleus', variant === 'signature' && 'hero-nucleus--signature', className)}>
      <canvas ref={canvasRef} className="hero-burst-canvas" aria-hidden="true" />
      <div className="hero-energy-aura" aria-hidden="true" />
      <div className="hero-energy-ring" aria-hidden="true" />
      <div className="hero-energy-ring hero-energy-ring--ion" aria-hidden="true" />

      {renderLogo ? (
        variant === 'hero' ? (
          <h1 className="hero-official-logo hero-logo-breathe">
            <GenesisOfficialLogo size={logoSize} markScale={1} layout="vertical" tone="color" imageClassName="hero-logo-fill" />
          </h1>
        ) : (
          <div className="hero-official-logo hero-official-logo--signature hero-logo-breathe" aria-hidden="true">
            <GenesisOfficialLogo size={logoSize} markScale={1} layout="vertical" tone="color" imageClassName="hero-logo-fill" />
          </div>
        )
      ) : null}
    </div>
  )
}
