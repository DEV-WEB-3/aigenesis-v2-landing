'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  ATOMIC_ENERGY_COLORS,
  TOKEN_ATOMIC_ORBIT_COUNT,
  TOKEN_ATOMIC_ORBIT_POINTS,
  TOKEN_ORBIT_MAX_POINTS,
  TOKEN_ORBIT_MIN_POINTS,
  TOKEN_VALUE_CENTER,
  TOKEN_VALUE_NODES,
  atomicEnergyDotPhases,
  atomicNodeTravelDuration,
  atomicOrbitDuration,
  atomicOrbitReverse,
  atomicOrbitTier,
  clampOrbitPoint,
  defaultOrbitEditorState,
  legacyEllipseFromOrbitDraft,
  orbitEditorStateFromEllipse,
  orbitGradientAngle,
  orbitSmoothClosedPath,
  roundOrbitCoord,
  tokenValueMobileIndices,
  type OrbitControlPoint,
  type OrbitEditorOrbitState,
} from '@/lib/token/tokenOrbitalValueLayout'
import TokenAtomicNodeMark from '@/components/token/TokenAtomicNodeMark'
import TokenOrbitEditorHud from '@/components/token/TokenOrbitEditorHud'

const ORBIT_DRAFT_KEY = 'aigenesis-token-orbit-draft'
const HANDLE_COLORS = ['#FF00C8', '#00F5FF', '#9D4DFF', '#FF4DDB', '#2962FF'] as const

const GRAD_STOPS = [
  [
    { o: '0%', c: '#FF00C8', a: 0.22 },
    { o: '40%', c: '#FF4DDB', a: 0.88 },
    { o: '70%', c: '#00F5FF', a: 0.88 },
    { o: '100%', c: '#2962FF', a: 0.22 },
  ],
  [
    { o: '0%', c: '#9D4DFF', a: 0.18 },
    { o: '45%', c: '#FF00C8', a: 0.82 },
    { o: '75%', c: '#00F5FF', a: 0.82 },
    { o: '100%', c: '#2962FF', a: 0.18 },
  ],
  [
    { o: '0%', c: '#2962FF', a: 0.18 },
    { o: '35%', c: '#00F5FF', a: 0.82 },
    { o: '65%', c: '#FF4DDB', a: 0.82 },
    { o: '100%', c: '#9D4DFF', a: 0.18 },
  ],
  [
    { o: '0%', c: '#00F5FF', a: 0.2 },
    { o: '50%', c: '#FF00C8', a: 0.8 },
    { o: '100%', c: '#9D4DFF', a: 0.2 },
  ],
  [
    { o: '0%', c: '#FF4DDB', a: 0.2 },
    { o: '50%', c: '#2962FF', a: 0.78 },
    { o: '100%', c: '#00F5FF', a: 0.2 },
  ],
] as const

function normalizePoints(points: unknown): OrbitControlPoint[] | null {
  if (!Array.isArray(points) || points.length < TOKEN_ORBIT_MIN_POINTS) return null
  const mapped = points.map((p) => {
    const pt = p as { x?: number; y?: number }
    return clampOrbitPoint(Number(pt.x), Number(pt.y))
  })
  if (mapped.some((p) => Number.isNaN(p.x) || Number.isNaN(p.y))) return null
  return mapped.slice(0, TOKEN_ORBIT_MAX_POINTS)
}

function loadDraftOrbits(): OrbitEditorOrbitState[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(ORBIT_DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown

    if (parsed && typeof parsed === 'object' && 'orbits' in parsed) {
      const orbits = (parsed as { orbits: unknown[] }).orbits
      if (Array.isArray(orbits) && orbits.length === TOKEN_ATOMIC_ORBIT_COUNT) {
        const result = orbits.map((o, i) => {
          const item = o as { points?: unknown; rotationDeg?: number; rx?: number; ry?: number }
          if (item.points) {
            const pts = normalizePoints(item.points)
            if (pts) return { points: pts }
          }
          if ('rotationDeg' in item || 'rx' in item || 'ry' in item) {
            return legacyEllipseFromOrbitDraft(item, i)
          }
          return orbitEditorStateFromEllipse(i)
        })
        return result
      }
    }
  } catch {
    return null
  }
  return null
}

function midpoint(a: OrbitControlPoint, b: OrbitControlPoint): OrbitControlPoint {
  return clampOrbitPoint((a.x + b.x) / 2, (a.y + b.y) / 2)
}

interface TokenAtomicOrbitalsProps {
  visibleNodeIndices: number[]
  editorMode?: boolean
}

export default function TokenAtomicOrbitals({
  visibleNodeIndices,
  editorMode = false,
}: TokenAtomicOrbitalsProps) {
  const { x: cx, y: cy } = TOKEN_VALUE_CENTER
  const uid = useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement>(null)
  const gradIds = TOKEN_ATOMIC_ORBIT_POINTS.map((_, i) => `${uid}-grad-${i}`)
  const dragRef = useRef<{ orbitIndex: number; pointIndex: number } | null>(null)

  const [orbits, setOrbits] = useState<OrbitEditorOrbitState[]>(
    () => loadDraftOrbits() ?? defaultOrbitEditorState()
  )
  const [activeOrbit, setActiveOrbit] = useState(0)
  const [activePoint, setActivePoint] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!editorMode) return
    window.localStorage.setItem(ORBIT_DRAFT_KEY, JSON.stringify({ orbits }))
  }, [editorMode, orbits])

  const getProductionPoints = (orbitIndex: number): OrbitControlPoint[] =>
    TOKEN_ATOMIC_ORBIT_POINTS[orbitIndex] ?? []

  const getPoints = (orbitIndex: number): OrbitControlPoint[] =>
    editorMode ? (orbits[orbitIndex]?.points ?? []) : getProductionPoints(orbitIndex)

  const clientToSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return { x: cx, y: cy }
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return { x: cx, y: cy }
    return pt.matrixTransform(ctm.inverse())
  }, [cx, cy])

  const patchPoint = useCallback((orbitIndex: number, pointIndex: number, x: number, y: number) => {
    setOrbits((prev) =>
      prev.map((orbit, oi) => {
        if (oi !== orbitIndex) return orbit
        return {
          points: orbit.points.map((p, pi) =>
            pi === pointIndex ? clampOrbitPoint(x, y) : p
          ),
        }
      })
    )
  }, [])

  const beginPointDrag = useCallback(
    (orbitIndex: number, pointIndex: number, e: React.PointerEvent) => {
      if (!editorMode) return
      e.preventDefault()
      e.stopPropagation()
      dragRef.current = { orbitIndex, pointIndex }
      setActiveOrbit(orbitIndex)
      setActivePoint(pointIndex)
      const { x, y } = clientToSvg(e.clientX, e.clientY)
      patchPoint(orbitIndex, pointIndex, x, y)
      ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    },
    [clientToSvg, editorMode, patchPoint]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current
      if (!editorMode || !drag) return
      const { x, y } = clientToSvg(e.clientX, e.clientY)
      patchPoint(drag.orbitIndex, drag.pointIndex, x, y)
    },
    [clientToSvg, editorMode, patchPoint]
  )

  const endDrag = useCallback((e: React.PointerEvent) => {
    if (!editorMode) return
    if ((e.currentTarget as Element).hasPointerCapture?.(e.pointerId)) {
      ;(e.currentTarget as Element).releasePointerCapture(e.pointerId)
    }
    dragRef.current = null
  }, [editorMode])

  const handlePointChange = useCallback(
    (orbitIndex: number, pointIndex: number, field: 'x' | 'y', value: number) => {
      const p = orbits[orbitIndex]?.points[pointIndex]
      if (!p) return
      patchPoint(orbitIndex, pointIndex, field === 'x' ? value : p.x, field === 'y' ? value : p.y)
    },
    [orbits, patchPoint]
  )

  const handleAddPoint = useCallback(() => {
    setOrbits((prev) =>
      prev.map((orbit, oi) => {
        if (oi !== activeOrbit || orbit.points.length >= TOKEN_ORBIT_MAX_POINTS) return orbit
        const a = orbit.points[activePoint]
        const b = orbit.points[(activePoint + 1) % orbit.points.length]
        if (!a || !b) return orbit
        const insert = midpoint(a, b)
        const next = [...orbit.points]
        next.splice(activePoint + 1, 0, insert)
        return { points: next }
      })
    )
    setActivePoint((p) => p + 1)
  }, [activeOrbit, activePoint])

  const handleDeletePoint = useCallback(() => {
    setOrbits((prev) =>
      prev.map((orbit, oi) => {
        if (oi !== activeOrbit || orbit.points.length <= TOKEN_ORBIT_MIN_POINTS) return orbit
        const next = orbit.points.filter((_, pi) => pi !== activePoint)
        return { points: next }
      })
    )
    setActivePoint((p) => Math.max(0, p - 1))
  }, [activeOrbit, activePoint])

  const handleResetOrbit = useCallback(() => {
    setOrbits((prev) =>
      prev.map((orbit, oi) => (oi === activeOrbit ? orbitEditorStateFromEllipse(oi) : orbit))
    )
  }, [activeOrbit])

  const handleResetAll = useCallback(() => {
    const next = defaultOrbitEditorState()
    setOrbits(next)
    window.localStorage.setItem(ORBIT_DRAFT_KEY, JSON.stringify({ orbits: next }))
  }, [])

  const handleCopy = useCallback(async () => {
    const payload = {
      orbits: orbits.map((o) => ({
        points: o.points.map((p) => ({ x: roundOrbitCoord(p.x), y: roundOrbitCoord(p.y) })),
      })),
    }
    const text = JSON.stringify(payload, null, 2)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.prompt('Copia estas formas:', text)
    }
  }, [orbits])

  const handlePathDblClick = useCallback(
    (orbitIndex: number, e: React.MouseEvent) => {
      if (!editorMode) return
      const orbit = orbits[orbitIndex]
      if (!orbit || orbit.points.length >= TOKEN_ORBIT_MAX_POINTS) return
      const { x, y } = clientToSvg(e.clientX, e.clientY)
      let best = 0
      let bestDist = Infinity
      for (let i = 0; i < orbit.points.length; i++) {
        const a = orbit.points[i]!
        const b = orbit.points[(i + 1) % orbit.points.length]!
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        const d = (mx - x) ** 2 + (my - y) ** 2
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      }
      const insertAt = best + 1
      setActiveOrbit(orbitIndex)
      setActivePoint(insertAt)
      setOrbits((prev) =>
        prev.map((o, oi) => {
          if (oi !== orbitIndex) return o
          const next = [...o.points]
          next.splice(insertAt, 0, clampOrbitPoint(x, y))
          return { points: next }
        })
      )
    },
    [clientToSvg, editorMode, orbits]
  )

  useEffect(() => {
    if (!editorMode) return

    const onKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 1 : 0.2
      const p = orbits[activeOrbit]?.points[activePoint]
      if (!p) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        handleDeletePoint()
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        patchPoint(activeOrbit, activePoint, p.x - step, p.y)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        patchPoint(activeOrbit, activePoint, p.x + step, p.y)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        patchPoint(activeOrbit, activePoint, p.x, p.y - step)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        patchPoint(activeOrbit, activePoint, p.x, p.y + step)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeOrbit, activePoint, editorMode, handleDeletePoint, orbits, patchPoint])

  return (
    <>
      <svg
        ref={svgRef}
        className={`token-atomic-orbitals${editorMode ? ' token-atomic-orbitals--editor' : ''}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden={!editorMode}
        onPointerMove={editorMode ? onPointerMove : undefined}
        onPointerUp={editorMode ? endDrag : undefined}
        onPointerCancel={editorMode ? endDrag : undefined}
      >
        <defs>
          <filter id={`${uid}-node-glow`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {gradIds.map((gid, i) => {
            const stops = GRAD_STOPS[i] ?? GRAD_STOPS[0]!
            const points = getPoints(i)
            const angle = orbitGradientAngle(points)
            const rad = (angle * Math.PI) / 180
            const span = 44
            const x1 = cx - Math.cos(rad) * span
            const y1 = cy - Math.sin(rad) * span
            const x2 = cx + Math.cos(rad) * span
            const y2 = cy + Math.sin(rad) * span
            return (
              <linearGradient key={gid} id={gid} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
                {stops.map((s) => (
                  <stop key={s.o} offset={s.o} stopColor={s.c} stopOpacity={s.a} />
                ))}
              </linearGradient>
            )
          })}
        </defs>

        {editorMode && (
          <>
            <circle cx={cx} cy={cy} r={0.35} className="token-orbit-editor-center" fill="#FF00C8" opacity={0.9} />
            <circle
              cx={cx}
              cy={cy}
              r={1.2}
              className="token-orbit-editor-center-ring"
              fill="none"
              stroke="rgba(0,245,255,0.35)"
              strokeWidth={0.08}
            />
          </>
        )}

        {Array.from({ length: TOKEN_ATOMIC_ORBIT_COUNT }, (_, orbitIndex) => {
          const points = getPoints(orbitIndex)
          const path = orbitSmoothClosedPath(points)
          if (!path) return null

          const dur = atomicOrbitDuration(orbitIndex)
          const reverse = atomicOrbitReverse(orbitIndex)
          const tier = atomicOrbitTier(orbitIndex)
          const gradId = gradIds[orbitIndex]!
          const dotPhases = atomicEnergyDotPhases(orbitIndex)
          const nodesOnOrbit = editorMode
            ? []
            : visibleNodeIndices.filter((ni) => TOKEN_VALUE_NODES[ni]?.orbitIndex === orbitIndex)
          const isActive = editorMode && activeOrbit === orbitIndex
          const color = HANDLE_COLORS[orbitIndex % HANDLE_COLORS.length]

          return (
            <g
              key={orbitIndex}
              className={`token-atomic-orbit-plane token-atomic-orbit-plane--${tier}${isActive ? ' is-dragging' : ''}`}
            >
              <path d={path} fill="none" stroke="none" className="token-atomic-orbit-motion" />

              {editorMode && (
                <path
                  d={path}
                  className="token-orbit-editor-hit"
                  fill="none"
                  stroke="transparent"
                  strokeWidth={3.5}
                  onDoubleClick={(e) => handlePathDblClick(orbitIndex, e)}
                />
              )}

              <path
                d={path}
                className={`token-atomic-orbit token-atomic-orbit--${orbitIndex} token-atomic-orbit--${tier}${editorMode ? ' token-atomic-orbit--editable' : ''}`}
                fill="none"
                stroke={`url(#${gradId})`}
              />

              {editorMode &&
                points.map((pt, pointIndex) => {
                  const isPointActive = isActive && activePoint === pointIndex
                  return (
                    <circle
                      key={`pt-${orbitIndex}-${pointIndex}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={isPointActive ? 1.55 : 1.15}
                      className={`token-orbit-editor-handle token-orbit-editor-handle--point${isPointActive ? ' is-active' : ''}`}
                      fill={color}
                      stroke={isPointActive ? '#fff' : 'rgba(255,255,255,0.65)'}
                      strokeWidth={isPointActive ? 0.2 : 0.12}
                      onPointerDown={(e) => beginPointDrag(orbitIndex, pointIndex, e)}
                    />
                  )
                })}

              {!editorMode &&
                dotPhases.map((phase, di) => {
                  const dotColor = ATOMIC_ENERGY_COLORS[di % ATOMIC_ENERGY_COLORS.length]!
                  return (
                    <circle key={`dot-${orbitIndex}-${di}`} r={0.22} className="token-atomic-energy-dot" fill={dotColor}>
                      <animateMotion
                        dur={`${dur * 1.2}s`}
                        repeatCount="indefinite"
                        path={path}
                        keyPoints={reverse ? '1;0' : '0;1'}
                        keyTimes="0;1"
                        calcMode="linear"
                        begin={`${phase * dur * 0.3}s`}
                      />
                    </circle>
                  )
                })}

              {!editorMode &&
                nodesOnOrbit.map((nodeIndex) => {
                  const node = TOKEN_VALUE_NODES[nodeIndex]
                  if (!node) return null
                  const travelDur = atomicNodeTravelDuration(nodeIndex)
                  return (
                    <g key={node.id} className="token-atomic-node-traveler">
                      <animateMotion
                        dur={`${travelDur}s`}
                        repeatCount="indefinite"
                        path={path}
                        keyPoints={reverse ? '1;0' : '0;1'}
                        keyTimes="0;1"
                        calcMode="linear"
                        begin={`${node.phase * dur}s`}
                      />
                      <TokenAtomicNodeMark node={node} nodeIndex={nodeIndex} glowFilterId={`${uid}-node-glow`} />
                    </g>
                  )
                })}
            </g>
          )
        })}
      </svg>

      {editorMode && (
        <TokenOrbitEditorHud
          orbits={orbits}
          activeOrbit={activeOrbit}
          activePoint={activePoint}
          copied={copied}
          onSelectOrbit={(i) => {
            setActiveOrbit(i)
            setActivePoint(0)
          }}
          onSelectPoint={setActivePoint}
          onPointChange={handlePointChange}
          onAddPoint={handleAddPoint}
          onDeletePoint={handleDeletePoint}
          onResetOrbit={handleResetOrbit}
          onCopy={handleCopy}
          onResetAll={handleResetAll}
        />
      )}
    </>
  )
}

export { tokenValueMobileIndices }
