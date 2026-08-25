'use client'

import { useCallback, useEffect, useRef } from 'react'
import { hayReproduccion } from '@/lib/reproduccionActiva'
import { HERO_DEBUG, heroDebug } from '@/lib/hero-debug'
import {
  HERO_LOGO_FOCUS,
  HERO_PARALLAX_IDLE,
  HERO_TIER_FLAGS,
  type HeroPerfTier,
} from '@/lib/hero-performance'
import { HERO_VOID, HERO_VOID_EDGE, HERO_VOID_MID } from '@/lib/hero-palette'
import {
  OCEAN_WAVE_FILLS,
  createAmbientParticles,
  createLogoEnergyParticles,
  createNeuralNodes,
  createOceanMesh,
  createWaveParticles,
  layerOpacity,
  meshScreenPos,
  oceanParallax,
  neuralOpacityScale,
  particleOpacityScale,
  rgba,
  waveOpacityScale,
  type AmbientParticle,
  type LogoEnergyParticle,
  type NeuralNode,
  type OceanMeshPoint,
  type WaveBand,
  type WaveParticle,
} from '@/lib/neural-particle-ocean'

export interface HeroParallax {
  x: number
  y: number
  nx: number
  ny: number
}

interface HeroLivingFieldProps {
  tier?: HeroPerfTier
}

interface NodePosition {
  x: number
  y: number
  colorKey: NeuralNode['colorKey']
  phase: number
  glow: number
}

function initOceanState(tier: HeroPerfTier) {
  const { particles, bands } = createWaveParticles(tier)
  const mesh = createOceanMesh(tier)
  return {
    waveParticles: particles,
    bands,
    nodes: createNeuralNodes(tier),
    logoEnergy: createLogoEnergyParticles(tier),
    ambientParticles: createAmbientParticles(tier),
    meshPoints: mesh.points,
    meshCols: mesh.cols,
    meshRows: mesh.rows,
  }
}

function cellKey(cx: number, cy: number): string {
  return `${cx},${cy}`
}

function quadBezierPoint(
  t: number,
  x0: number,
  y0: number,
  cpx: number,
  cpy: number,
  x1: number,
  y1: number
) {
  const mt = 1 - t
  return {
    x: mt * mt * x0 + 2 * mt * t * cpx + t * t * x1,
    y: mt * mt * y0 + 2 * mt * t * cpy + t * t * y1,
  }
}

function logoZoneRadius(w: number, h: number): { rx: number; ry: number } {
  if (w >= 1536) return { rx: 0.22, ry: 0.2 }
  if (w >= 1280) return { rx: 0.2, ry: 0.18 }
  return { rx: 0.18, ry: 0.16 }
}

function logoZoneAttenuation(x: number, y: number, w: number, h: number): number {
  const cx = w * HERO_LOGO_FOCUS.x
  const cy = h * HERO_LOGO_FOCUS.y
  const { rx, ry } = logoZoneRadius(w, h)
  const dx = (x - cx) / (w * rx)
  const dy = (y - cy) / (h * ry)
  const d = Math.hypot(dx, dy)
  if (d >= 1) return 1
  return 0.9 + d * 0.1
}

/**
 * Neural Particle Ocean — canvas siempre montado, RAF único, sin desmontaje por isActive.
 */
export default function HeroLivingField({ tier = 'high' }: HeroLivingFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef(initOceanState(tier))
  const rafRef = useRef(0)
  const resizeRafRef = useRef(0)
  const timeRef = useRef(0)
  const tierRef = useRef(tier)
  const lastCanvasSizeRef = useRef({ w: 0, h: 0 })
  const loopGenerationRef = useRef(0)

  const drawAtmosphere = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const focusX = w * 0.5
    const focusY = h * 0.42

    ctx.fillStyle = HERO_VOID
    ctx.fillRect(0, 0, w, h)

    const depthMid = ctx.createRadialGradient(focusX, focusY + h * 0.04, 0, focusX, focusY + h * 0.04, Math.max(w, h) * 0.72)
    depthMid.addColorStop(0, `${HERO_VOID_MID}55`)
    depthMid.addColorStop(0.55, `${HERO_VOID}22`)
    depthMid.addColorStop(1, 'transparent')
    ctx.fillStyle = depthMid
    ctx.fillRect(0, 0, w, h)

    const leftField = ctx.createRadialGradient(w * 0.05, h * 0.5, 0, w * 0.05, h * 0.5, w * 0.38)
    leftField.addColorStop(0, 'rgba(233, 30, 139, 0.1)')
    leftField.addColorStop(0.42, 'rgba(233, 30, 139, 0.035)')
    leftField.addColorStop(1, 'transparent')
    ctx.fillStyle = leftField
    ctx.fillRect(0, 0, w, h)

    const rightField = ctx.createRadialGradient(w * 0.95, h * 0.5, 0, w * 0.95, h * 0.5, w * 0.38)
    rightField.addColorStop(0, 'rgba(61, 139, 255, 0.09)')
    rightField.addColorStop(0.42, 'rgba(61, 139, 255, 0.03)')
    rightField.addColorStop(1, 'transparent')
    ctx.fillStyle = rightField
    ctx.fillRect(0, 0, w, h)

    const coreHalo = ctx.createRadialGradient(focusX, focusY, w * 0.14, focusX, focusY, w * 0.46)
    coreHalo.addColorStop(0, 'rgba(233, 30, 139, 0.09)')
    coreHalo.addColorStop(0.42, 'rgba(110, 86, 207, 0.05)')
    coreHalo.addColorStop(0.68, 'rgba(61, 139, 255, 0.07)')
    coreHalo.addColorStop(1, 'transparent')
    ctx.fillStyle = coreHalo
    ctx.fillRect(0, 0, w, h)
  }, [])

  const drawDepthOverlay = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const topShadow = ctx.createLinearGradient(0, 0, 0, h * 0.38)
    topShadow.addColorStop(0, `${HERO_VOID}d9`)
    topShadow.addColorStop(0.55, `${HERO_VOID_MID}66`)
    topShadow.addColorStop(1, 'transparent')
    ctx.fillStyle = topShadow
    ctx.fillRect(0, 0, w, h)

    const bottomShadow = ctx.createLinearGradient(0, h * 0.62, 0, h)
    bottomShadow.addColorStop(0, 'transparent')
    bottomShadow.addColorStop(0.45, `${HERO_VOID_MID}55`)
    bottomShadow.addColorStop(1, `${HERO_VOID}e6`)
    ctx.fillStyle = bottomShadow
    ctx.fillRect(0, 0, w, h)

    const leftLateral = ctx.createLinearGradient(0, 0, w * 0.24, 0)
    leftLateral.addColorStop(0, `${HERO_VOID_EDGE}aa`)
    leftLateral.addColorStop(1, 'transparent')
    ctx.fillStyle = leftLateral
    ctx.fillRect(0, 0, w, h)

    const rightLateral = ctx.createLinearGradient(w, 0, w * 0.76, 0)
    rightLateral.addColorStop(0, `${HERO_VOID_EDGE}aa`)
    rightLateral.addColorStop(1, 'transparent')
    ctx.fillStyle = rightLateral
    ctx.fillRect(0, 0, w, h)

    const vignette = ctx.createRadialGradient(w * 0.5, h * 0.48, w * 0.22, w * 0.5, h * 0.48, Math.max(w, h) * 0.82)
    vignette.addColorStop(0, 'transparent')
    vignette.addColorStop(0.58, `${HERO_VOID_MID}33`)
    vignette.addColorStop(0.82, `${HERO_VOID_EDGE}88`)
    vignette.addColorStop(1, `${HERO_VOID}f2`)
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, w, h)
  }, [])

  const drawOceanMesh = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
      px: HeroParallax,
      points: OceanMeshPoint[],
      cols: number,
      rows: number,
      waveScale: number
    ) => {
      const grid: Array<Array<ReturnType<typeof meshScreenPos> | null>> = Array.from({ length: rows }, () =>
        Array(cols).fill(null)
      )

      for (const p of points) {
        grid[p.row][p.col] = meshScreenPos(p.col, p.row, cols, rows, w, h, t, px)
      }

      const lineWidth = tierRef.current === 'high' ? 0.72 : tierRef.current === 'medium' ? 0.62 : 0.52
      ctx.lineWidth = lineWidth
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const a = grid[row][col]
          if (!a) continue

          const right = col < cols - 1 ? grid[row][col + 1] : null
          const down = row < rows - 1 ? grid[row + 1][col] : null
          const zone = logoZoneAttenuation(a.x, a.y, w, h)

          if (right) {
            const alpha = Math.min(a.alpha, right.alpha) * waveScale * zone
            ctx.strokeStyle = rgba(a.colorKey, Math.min(alpha, 0.42))
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(right.x, right.y)
            ctx.stroke()
          }
          if (down) {
            const alpha = Math.min(a.alpha, down.alpha) * waveScale * 0.82 * zone
            ctx.strokeStyle = rgba(a.colorKey, Math.min(alpha, 0.36))
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(down.x, down.y)
            ctx.stroke()
          }

          const phase = points[row * cols + col]?.phase ?? 0
          const pulse = 0.72 + Math.sin(t * 0.0012 + phase) * 0.28
          ctx.beginPath()
          ctx.arc(a.x, a.y, a.size * pulse, 0, Math.PI * 2)
          ctx.fillStyle = rgba(a.colorKey, Math.min(a.alpha * pulse * waveScale * zone, 0.38))
          ctx.fill()

          if (a.v > 0.5 && Math.sin(t * 0.0015 + phase) > 0.88) {
            ctx.beginPath()
            ctx.arc(a.x, a.y, a.size * 3.8, 0, Math.PI * 2)
            ctx.fillStyle = rgba(a.colorKey, 0.18 * zone)
            ctx.fill()
          }
        }
      }
    },
    []
  )

  const drawParticleWaves = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
      px: HeroParallax,
      particles: WaveParticle[],
      bands: WaveBand[],
      opacityScale: number
    ) => {
      for (const p of particles) {
        const band = bands.find((b) => b.id === p.bandId)
        if (!band) continue

        const pp = oceanParallax(band.depth, px, w, h)
        const phase = t * band.speed * band.direction
        const u = (p.u + phase + p.phase * 0.00008) % 1.08 - 0.04
        const nx = u + p.drift
        const x = nx * w + pp.x
        const waveY =
          band.baseY * h +
          Math.sin(nx * Math.PI * band.frequency + t * band.speed * 2.2 + p.phase) * band.amplitude * h +
          Math.sin(nx * Math.PI * (band.frequency * 0.45) + phase * 1.4) * band.amplitude * h * 0.35
        const y = waveY + pp.y
        const pulse = 0.78 + Math.sin(t * 0.00055 + p.phase) * 0.22
        const size = p.size * (band.depth === 1 ? 0.9 : band.depth === 4 ? 1.5 : 1.2) * pulse
        const zone = logoZoneAttenuation(x, y, w, h)
        const alpha = p.alpha * pulse * opacityScale * zone

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = rgba(p.colorKey, Math.min(alpha, 0.38))
        ctx.fill()
      }
    },
    []
  )

  const drawOceanFills = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, px: HeroParallax, opacityScale: number) => {
      for (const layer of OCEAN_WAVE_FILLS) {
        const pp = oceanParallax(layer.depth, px, w, h)
        const phase = t * layer.speed * layer.dir
        const baseY = layer.baseY * h
        const amp = layer.amp * h
        const fillAlpha = layer.alpha * layerOpacity(layer.depth) * opacityScale

        ctx.beginPath()
        ctx.moveTo(0, h)
        for (let x = 0; x <= w; x += 3) {
          const nx = x / w
          const cross =
            Math.sin(nx * Math.PI * (layer.freq * 0.7) + phase * 0.85) * amp * 0.25
          const y =
            baseY +
            Math.sin(nx * Math.PI * layer.freq + phase) * amp +
            Math.sin(nx * Math.PI * (layer.freq * 0.55) + phase * 1.25) * amp * 0.45 +
            cross
          ctx.lineTo(x + pp.x, y + pp.y * 0.55)
        }
        ctx.lineTo(w, h)
        ctx.closePath()
        ctx.fillStyle = rgba(layer.colorKey, Math.min(fillAlpha, 0.12))
        ctx.fill()
      }
    },
    []
  )

  const drawNeuralNetwork = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
      px: HeroParallax,
      nodes: NeuralNode[],
      neuralScale: number
    ) => {
      if (nodes.length < 2) return

      const pp = oceanParallax(2, px, w, h)
      const positions: NodePosition[] = nodes.map((n) => {
        const breatheX = Math.sin(t * 0.00027 + n.phase) * 0.014 + Math.cos(t * 0.00018 + n.phase2) * 0.01
        const breatheY = Math.cos(t * 0.00024 + n.phase2) * 0.012 + Math.sin(t * 0.00021 + n.phase) * 0.009
        return {
          x: (n.bx + breatheX) * w + pp.x,
          y: (n.by + breatheY) * h + pp.y,
          colorKey: n.colorKey,
          phase: n.phase,
          glow: n.glow,
        }
      })

      const cellSize = tierRef.current === 'high' ? w * 0.07 : w * 0.09
      const grid = new Map<string, number[]>()

      for (let i = 0; i < positions.length; i++) {
        const cx = Math.floor(positions[i].x / cellSize)
        const cy = Math.floor(positions[i].y / cellSize)
        const key = cellKey(cx, cy)
        const bucket = grid.get(key) ?? []
        bucket.push(i)
        grid.set(key, bucket)
      }

      const linkDist = tierRef.current === 'high' ? cellSize * 1.6 : cellSize * 1.3
      const drawn = new Set<string>()

      ctx.lineWidth = tierRef.current === 'high' ? 0.8 : 0.65
      for (let i = 0; i < positions.length; i++) {
        const cx = Math.floor(positions[i].x / cellSize)
        const cy = Math.floor(positions[i].y / cellSize)

        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const neighbors = grid.get(cellKey(cx + ox, cy + oy))
            if (!neighbors) continue

            for (const j of neighbors) {
              if (j <= i) continue
              const pair = `${i}-${j}`
              if (drawn.has(pair)) continue

              const a = positions[i]
              const b = positions[j]
              const d = Math.hypot(a.x - b.x, a.y - b.y)
              if (d > linkDist) continue

              drawn.add(pair)
              const zone = Math.min(logoZoneAttenuation(a.x, a.y, w, h), logoZoneAttenuation(b.x, b.y, w, h))
              const alpha =
                (1 - d / linkDist) *
                (tierRef.current === 'high' ? 0.76 : tierRef.current === 'medium' ? 0.54 : 0.34) *
                zone *
                neuralScale
              const midPulse = Math.sin(t * 0.00135 + (a.phase + b.phase) * 0.5) * 16
              const cpx = (a.x + b.x) / 2 + midPulse
              const cpy = (a.y + b.y) / 2 + Math.cos(t * 0.00128 + a.phase) * 12

              const linkColor = a.colorKey === b.colorKey ? a.colorKey : 'core'
              ctx.strokeStyle = rgba(linkColor, Math.min(alpha, 0.84))
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.quadraticCurveTo(cpx, cpy, b.x, b.y)
              ctx.stroke()

              const travel = (t * 0.00009 + a.phase * 0.17) % 1
              const imp = quadBezierPoint(travel, a.x, a.y, cpx, cpy, b.x, b.y)
              const impAlpha = (0.55 + Math.sin(t * 0.002 + a.phase) * 0.25) * zone
              ctx.beginPath()
              ctx.arc(imp.x, imp.y, tierRef.current === 'high' ? 2.2 : 1.6, 0, Math.PI * 2)
              ctx.fillStyle = rgba(linkColor, Math.min(impAlpha, 0.85))
              ctx.fill()
              ctx.beginPath()
              ctx.arc(imp.x, imp.y, tierRef.current === 'high' ? 5 : 3.5, 0, Math.PI * 2)
              ctx.fillStyle = rgba(linkColor, impAlpha * 0.22)
              ctx.fill()
            }
          }
        }
      }

      for (const p of positions) {
        const zone = logoZoneAttenuation(p.x, p.y, w, h)
        const pulse = p.glow * (0.72 + Math.sin(t * 0.0011 + p.phase) * 0.28)
        const r = 1.75 * pulse

        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2)
        ctx.fillStyle = rgba(p.colorKey, 0.3 * pulse * zone * neuralScale)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = rgba(p.colorKey, Math.min(0.9 * pulse * zone * neuralScale, 0.94))
        ctx.fill()
      }
    },
    []
  )

  const drawLogoEnergy = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
      px: HeroParallax,
      particles: LogoEnergyParticle[]
    ) => {
      const pp = oceanParallax(5, px, w, h)
      const cx = w * HERO_LOGO_FOCUS.x + pp.x
      const cy = h * HERO_LOGO_FOCUS.y + pp.y

      for (const p of particles) {
        const angle = p.angle + t * p.speed * p.direction
        const radius = p.radius + Math.sin(t * 0.0003 + p.phase) * 10
        const x = cx + Math.cos(angle) * radius + p.repelX
        const y = cy + Math.sin(angle) * radius * 0.92 + p.repelY

        const pulse = 0.85 + Math.sin(t * 0.0005 + p.phase) * 0.15
        ctx.beginPath()
        ctx.arc(x, y, p.size * pulse, 0, Math.PI * 2)
        const zone = logoZoneAttenuation(x, y, w, h)
        ctx.fillStyle = rgba(p.colorKey, p.opacity * pulse * zone)
        ctx.fill()
      }
    },
    []
  )

  const drawAmbientParticles = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
      px: HeroParallax,
      particles: AmbientParticle[],
      opacityScale: number
    ) => {
      const hFlow = Math.sin(t * 0.00012) * 0.018
      const step = tierRef.current === 'low' ? 2 : 1

      for (let i = 0; i < particles.length; i += step) {
        const p = particles[i]
        const pp = oceanParallax(3, px, w, h)
        let nx = p.x + t * p.drift + hFlow * (p.x < 0.5 ? 1 : -1)
        nx = ((nx % 1) + 1) % 1
        let ny = p.y + Math.sin(t * 0.00025 + p.phase) * 0.009 + t * p.rise
        ny = ((ny % 1) + 1) % 1
        const x = nx * w + pp.x
        const y = ny * h + pp.y
        const zone = logoZoneAttenuation(x, y, w, h)
        const twinkle = 0.62 + Math.sin(t * 0.0018 + p.phase) * 0.38
        const alpha = p.baseOpacity * twinkle * opacityScale * zone * 0.72

        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = rgba(p.colorKey, Math.min(alpha, 0.9))
        ctx.fill()
      }
    },
    []
  )

  const drawFrameRef = useRef<(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void>(
    () => {}
  )

  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const { waveParticles, bands, nodes, logoEnergy, ambientParticles, meshPoints, meshCols, meshRows } =
      stateRef.current
    const px = HERO_PARALLAX_IDLE
    const flags = HERO_TIER_FLAGS[tierRef.current]
    const waveScale = waveOpacityScale(tierRef.current)
    const particleScale = particleOpacityScale(tierRef.current)
    const neuralScale = neuralOpacityScale(tierRef.current)

    ctx.clearRect(0, 0, w, h)
    drawAtmosphere(ctx, w, h)

    if (flags.oceanCanvas) {
      drawOceanMesh(ctx, w, h, t, px, meshPoints, meshCols, meshRows, waveScale)
      drawOceanFills(ctx, w, h, t, px, waveScale)
    }
    drawAmbientParticles(ctx, w, h, t, px, ambientParticles, particleScale)
    drawParticleWaves(ctx, w, h, t, px, waveParticles.filter((p) => p.depth === 1), bands, waveScale)
    drawNeuralNetwork(ctx, w, h, t, px, nodes, neuralScale)
    drawParticleWaves(ctx, w, h, t, px, waveParticles.filter((p) => p.depth === 3), bands, waveScale)
    drawParticleWaves(ctx, w, h, t, px, waveParticles.filter((p) => p.depth === 4), bands, waveScale)
    drawLogoEnergy(ctx, w, h, t, px, logoEnergy)
    drawDepthOverlay(ctx, w, h)
  }, [
    drawAmbientParticles,
    drawAtmosphere,
    drawDepthOverlay,
    drawLogoEnergy,
    drawNeuralNetwork,
    drawOceanFills,
    drawOceanMesh,
    drawParticleWaves,
  ])

  drawFrameRef.current = drawFrame

  useEffect(() => {
    const prev = tierRef.current
    tierRef.current = tier
    stateRef.current = initOceanState(tier)
    heroDebug('tier-change', { from: prev, to: tier, loopRestart: false })
  }, [tier])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const generation = ++loopGenerationRef.current
    heroDebug('loop-start', { generation })

    const applyCanvasSize = (cssW: number, cssH: number) => {
      const w = Math.round(cssW)
      const h = Math.round(cssH)
      if (w < 2 || h < 2) {
        heroDebug('resize-skip-zero', { w, h })
        return false
      }
      const last = lastCanvasSizeRef.current
      if (last.w === w && last.h === h) return false

      const dpr = Math.min(window.devicePixelRatio || 1, tierRef.current === 'low' ? 1 : 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lastCanvasSizeRef.current = { w, h }
      heroDebug('resize-applied', { w, h, dpr })
      return true
    }

    const resize = () => {
      const rect = container.getBoundingClientRect()
      applyCanvasSize(rect.width, rect.height)
    }

    const scheduleResize = () => {
      cancelAnimationFrame(resizeRafRef.current)
      resizeRafRef.current = requestAnimationFrame(resize)
    }

    resize()

    const ro = new ResizeObserver(() => scheduleResize())
    ro.observe(container)

    let last = performance.now()
    let frameCount = 0
    let lastCenterLum = -1

    const loop = (now: number) => {
      /*
       * MIENTRAS SE REPRODUCE UN VIDEO, ESTE LIENZO NO DIBUJA.
       *
       * Medido con el perfilador del navegador sobre la portada: este bucle y su
       * hermano se llevan el hilo principal —`stroke` y `fill` de Canvas 2D— y
       * el fotograma pasa de 8 ms en una pagina de texto a 99 ms aqui. A 10 fps
       * el decodificador de video no consigue turno y se queda clavado, que es
       * exactamente lo que reporto el owner.
       *
       * El bucle SIGUE programandose (por eso no se cancela): asi vuelve solo en
       * cuanto el video termina. Lo que se salta es el dibujo, que es el coste.
       */
      if (hayReproduccion()) {
        rafRef.current = requestAnimationFrame(loop)
        return
      }
      if (loopGenerationRef.current !== generation) return

      const dt = now - last
      last = now
      timeRef.current += tierRef.current === 'low' ? dt * 0.45 : dt

      const rect = container.getBoundingClientRect()
      const w = Math.round(rect.width)
      const h = Math.round(rect.height)

      if (w >= 2 && h >= 2) {
        if (lastCanvasSizeRef.current.w !== w || lastCanvasSizeRef.current.h !== h) {
          applyCanvasSize(w, h)
        }
        drawFrameRef.current(ctx, w, h, timeRef.current)
        frameCount++

        if (HERO_DEBUG && frameCount % 4 === 0) {
          const sx = Math.floor(w * 0.5)
          const sy = Math.floor(h * 0.42)
          const sample = ctx.getImageData(sx, sy, 1, 1).data
          const lum = (sample[0] + sample[1] + sample[2]) / 3
          if (lastCenterLum >= 0 && lastCenterLum > 18 && lum < 10) {
            heroDebug('flicker-dark-frame', {
              generation,
              frameCount,
              lastCenterLum: Number(lastCenterLum.toFixed(1)),
              lum: Number(lum.toFixed(1)),
              rgb: [sample[0], sample[1], sample[2]],
            })
          }
          lastCenterLum = lum
        }

        if (HERO_DEBUG && frameCount % 120 === 0) {
          heroDebug('loop-tick', { generation, frameCount, w, h, tier: tierRef.current })
        }
      } else {
        heroDebug('draw-skip-zero', { w, h })
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      heroDebug('loop-stop', { generation })
      loopGenerationRef.current++
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(resizeRafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="hero-living-field hero-neural-ocean"
      aria-hidden="true"
      data-hero-tier={tier}
      data-ocean-system="neural-particle-ocean"
    >
      <canvas ref={canvasRef} className="hero-ocean-canvas" />
    </div>
  )
}
