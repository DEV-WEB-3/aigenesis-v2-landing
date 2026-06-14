'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  SCROLL_RAIL_NODE,
  SCROLL_RAIL_PARALLAX_MAX_PX,
  SCROLL_RAIL_WAVE_MS,
} from '@/lib/scrollRail/genesisScrollRailLayout'
import { sectionNavTooltipLabel } from '@/lib/scrollRail/sectionNavLabels'

interface SectionProgressDotsProps {
  total: number
  current: number
  onDotClick: (index: number) => void
}

type NodeState = 'active' | 'nearby' | 'inactive'

function resolveNodeState(index: number, current: number): NodeState {
  if (index === current) return 'active'
  if (index === current - 1 || index === current + 1) return 'nearby'
  return 'inactive'
}

function baseNodeSizePx(state: NodeState): number {
  if (state === 'active') return SCROLL_RAIL_NODE.ACTIVE_SIZE_PX
  if (state === 'nearby') return SCROLL_RAIL_NODE.NEARBY_SIZE_PX
  return SCROLL_RAIL_NODE.INACTIVE_SIZE_PX
}

export default function SectionProgressDots({
  total,
  current,
  onDotClick,
}: SectionProgressDotsProps) {
  const navRef = useRef<HTMLElement>(null)
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [nodeCenters, setNodeCenters] = useState<number[]>([])
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltipShiftY, setTooltipShiftY] = useState(0)
  const reduceMotion = useReducedMotion()

  const measureCenters = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const navTop = nav.getBoundingClientRect().top
    const centers = Array.from({ length: total }, (_, i) => {
      const btn = nodeRefs.current[i]
      if (!btn) return 0
      const rect = btn.getBoundingClientRect()
      return rect.top - navTop + rect.height / 2
    })
    setNodeCenters(centers)
  }, [total])

  const clampTooltipPosition = useCallback((index: number) => {
    const btn = nodeRefs.current[index]
    if (!btn) return
    requestAnimationFrame(() => {
      const tooltip = btn.querySelector('.genesis-scroll-rail__tooltip')
      if (!tooltip) return
      const rect = tooltip.getBoundingClientRect()
      const pad = 10
      let shift = 0
      if (rect.top < pad) shift = pad - rect.top
      else if (rect.bottom > window.innerHeight - pad) {
        shift = window.innerHeight - pad - rect.bottom
      }
      setTooltipShiftY(shift)
    })
  }, [])

  useLayoutEffect(() => {
    measureCenters()
  }, [measureCenters, current, total])

  useEffect(() => {
    measureCenters()
    window.addEventListener('resize', measureCenters)
    return () => window.removeEventListener('resize', measureCenters)
  }, [measureCenters])

  useEffect(() => {
    if (hoveredIndex === null) return
    clampTooltipPosition(hoveredIndex)
  }, [hoveredIndex, clampTooltipPosition])

  useEffect(() => {
    if (reduceMotion) return
    const max = SCROLL_RAIL_PARALLAX_MAX_PX
    const onMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * max * 2
      const y = ((e.clientY / window.innerHeight) - 0.5) * max * 2
      setParallax({
        x: Math.max(-max, Math.min(max, x)),
        y: Math.max(-max, Math.min(max, y)),
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduceMotion])

  const waveY = nodeCenters[current] ?? 0
  const railTop = nodeCenters[0] ?? 10
  const railBottom =
    nodeCenters.length > 0 ? nodeCenters[nodeCenters.length - 1] ?? 10 : 10

  const tooltipTransition = {
    duration: reduceMotion ? 0 : SCROLL_RAIL_NODE.TOOLTIP_DURATION_MS / 1000,
    ease: [0.22, 1, 0.36, 1] as const,
  }

  return (
    <>
      <MobileScrollProgress total={total} current={current} onDotClick={onDotClick} />

      <nav
        ref={navRef}
        aria-label="Navegación de secciones"
        className="genesis-scroll-rail hidden xl:flex"
      style={
        reduceMotion
          ? undefined
          : ({
              '--scroll-rail-parallax-x': `${parallax.x}px`,
              '--scroll-rail-parallax-y': `${parallax.y}px`,
            } as React.CSSProperties)
      }
    >
      <div
        className="genesis-scroll-rail__energy-rail"
        aria-hidden="true"
        style={{
          top: railTop,
          height: Math.max(0, railBottom - railTop),
        }}
      />

      {nodeCenters.length > 0 && (
        <motion.div
          className="genesis-scroll-rail__wave"
          aria-hidden="true"
          animate={{
            top: waveY,
            opacity: [0.55, 1, 0.65],
            scale: [0.85, 1.15, 1],
          }}
          transition={{
            top: {
              duration: reduceMotion ? 0 : SCROLL_RAIL_WAVE_MS / 1000,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: {
              duration: reduceMotion ? 0 : SCROLL_RAIL_WAVE_MS / 1000,
              times: [0, 0.35, 1],
            },
            scale: {
              duration: reduceMotion ? 0 : SCROLL_RAIL_WAVE_MS / 1000,
              times: [0, 0.4, 1],
            },
          }}
        />
      )}

      {Array.from({ length: total }).map((_, i) => {
        const state = resolveNodeState(i, current)
        const isActive = state === 'active'
        const isHovered = hoveredIndex === i
        const baseSize = baseNodeSizePx(state)
        const lit = isActive || isHovered
        const scale = isHovered
          ? SCROLL_RAIL_NODE.HOVER_SCALE
          : isActive
            ? SCROLL_RAIL_NODE.ACTIVE_SCALE
            : 1

        return (
          <button
            key={i}
            ref={(el) => {
              nodeRefs.current[i] = el
            }}
            type="button"
            onClick={() => onDotClick(i)}
            onMouseEnter={() => {
              setTooltipShiftY(0)
              setHoveredIndex(i)
            }}
            onMouseLeave={() => {
              setHoveredIndex(null)
              setTooltipShiftY(0)
            }}
            onFocus={() => {
              setTooltipShiftY(0)
              setHoveredIndex(i)
            }}
            onBlur={() => {
              setHoveredIndex(null)
              setTooltipShiftY(0)
            }}
            aria-label={sectionNavTooltipLabel(i)}
            aria-current={isActive ? 'true' : undefined}
            className="genesis-scroll-rail__node-btn"
          >
            <AnimatePresence>
              {isHovered && (
                <span
                  className="genesis-scroll-rail__tooltip-anchor"
                  style={{ marginTop: tooltipShiftY }}
                >
                  <motion.span
                    role="tooltip"
                    className="genesis-scroll-rail__tooltip"
                    initial={{ opacity: 0, x: 10, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.96 }}
                    transition={tooltipTransition}
                  >
                    {sectionNavTooltipLabel(i)}
                  </motion.span>
                </span>
              )}
            </AnimatePresence>

            <motion.span
              className={`genesis-scroll-rail__node genesis-scroll-rail__node--${state}`}
              animate={{
                width: baseSize,
                height: baseSize,
                scale,
                backgroundColor: lit
                  ? SCROLL_RAIL_NODE.ACTIVE_COLOR
                  : SCROLL_RAIL_NODE.INACTIVE_COLOR,
                boxShadow: isHovered
                  ? SCROLL_RAIL_NODE.HOVER_GLOW
                  : isActive
                    ? SCROLL_RAIL_NODE.ACTIVE_GLOW
                    : 'none',
                opacity: lit
                  ? 1
                  : state === 'nearby'
                    ? SCROLL_RAIL_NODE.NEARBY_OPACITY
                    : SCROLL_RAIL_NODE.INACTIVE_OPACITY,
              }}
              transition={{
                duration: reduceMotion ? 0 : SCROLL_RAIL_NODE.TOOLTIP_DURATION_MS / 1000,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </button>
        )
      })}
    </nav>
    </>
  )
}

function MobileScrollProgress({
  total,
  current,
  onDotClick,
}: SectionProgressDotsProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <nav
      aria-label="Progreso de secciones"
      className="genesis-mobile-scroll-progress fixed bottom-[max(0.85rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/10 bg-[rgba(5,7,13,0.88)] px-3 py-2 shadow-[0_8px_28px_rgba(0,0,0,0.45)] backdrop-blur-md xl:hidden"
    >
      <span className="sr-only">
        Sección {current + 1} de {total}
      </span>
      <button
        type="button"
        aria-label="Sección anterior"
        disabled={current <= 0}
        onClick={() => onDotClick(Math.max(0, current - 1))}
        className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-genesis-mist transition-colors hover:text-genesis-text disabled:opacity-30"
      >
        ↑
      </button>
      <div
        className="h-1 w-[4.5rem] overflow-hidden rounded-full bg-white/10"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #ff00c8 0%, #00f5ff 100%)',
          }}
        />
      </div>
      <span
        className="min-w-[2.4rem] text-center font-mono text-[10px] tracking-wider text-genesis-ghost"
        aria-hidden="true"
      >
        {String(current + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
      <button
        type="button"
        aria-label="Sección siguiente"
        disabled={current >= total - 1}
        onClick={() => onDotClick(Math.min(total - 1, current + 1))}
        className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-genesis-mist transition-colors hover:text-genesis-text disabled:opacity-30"
      >
        ↓
      </button>
    </nav>
  )
}
