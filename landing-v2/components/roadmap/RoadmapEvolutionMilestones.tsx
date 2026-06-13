'use client'

import {
  ROADMAP_EVOLUTION_MILESTONES,
  ROADMAP_EVOLUTION_PULSE_S,
  evolutionCurvePath,
  milestoneColor,
  roadmapMilestonePosition,
} from '@/lib/roadmap/evolutionPathLayout'

export default function RoadmapEvolutionMilestones() {
  const d = evolutionCurvePath()

  return (
    <svg
      className="roadmap-evolution-milestones"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--roadmap-pulse-s': `${ROADMAP_EVOLUTION_PULSE_S}s` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id="roadmap-curve-grad" gradientUnits="userSpaceOnUse" x1="14" y1="76" x2="86" y2="12">
          <stop offset="0%" stopColor="#9D4DFF" stopOpacity="0.65" />
          <stop offset="45%" stopColor="#FF00C8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.7" />
        </linearGradient>
        <filter id="roadmap-node-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="roadmap-future-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0, 245, 255, 0.45)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <path d={d} className="roadmap-evolution-curve" fill="none" stroke="url(#roadmap-curve-grad)" strokeWidth="0.35" />

      <circle r="0.55" className="roadmap-evolution-pulse" fill="#00F5FF">
        <animateMotion dur={`${ROADMAP_EVOLUTION_PULSE_S}s`} repeatCount="indefinite" path={d} />
      </circle>

      {ROADMAP_EVOLUTION_MILESTONES.map((m) => {
        const { x, y } = roadmapMilestonePosition(m.index)
        const r = m.isFuture ? 2.4 : 1.15 + m.index * 0.12
        const coreR = m.isFuture ? 1.05 : 0.52 + m.index * 0.06
        return (
          <g
            key={m.year}
            className={`roadmap-evolution-node${m.isFuture ? ' roadmap-evolution-node--future' : ''}`}
            style={{ animationDelay: `${m.index * 0.35}s` } as React.CSSProperties}
          >
            {m.isFuture && (
              <circle cx={x} cy={y} r={r * 2.2} fill="url(#roadmap-future-glow)" className="roadmap-evolution-node__future-aura" />
            )}
            <circle
              cx={x}
              cy={y}
              r={r}
              className="roadmap-evolution-node__halo"
              fill="none"
              stroke={milestoneColor(m.index)}
              strokeWidth="0.28"
              opacity="0.45"
            />
            <circle
              cx={x}
              cy={y}
              r={coreR}
              className="roadmap-evolution-node__core"
              fill={milestoneColor(m.index)}
              filter="url(#roadmap-node-glow)"
            />
            <text
              x={x}
              y={y + (m.isFuture ? 4.2 : 3.4)}
              textAnchor="middle"
              className="roadmap-evolution-node__year"
              fill={milestoneColor(m.index)}
              fontSize={m.isFuture ? '3.2' : '2.6'}
            >
              {m.year}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
