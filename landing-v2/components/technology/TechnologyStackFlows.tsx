'use client'

import { EMISSION } from '@/lib/design/tokens'

import {
  TECH_STACK_FLOWS,
  TECH_STACK_LAYERS,
  TECH_STACK_PULSE_S,
  techStackFlowPath,
} from '@/lib/technology/techStackLayout'

export default function TechnologyStackFlows() {
  return (
    <svg
      className="technology-stack-flows"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--tech-pulse-s': `${TECH_STACK_PULSE_S}s` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id="tech-flow-grad" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="50" y2="100">
          <stop offset="0%" stopColor={EMISSION.violetHi} stopOpacity="0.55" />
          <stop offset="50%" stopColor={EMISSION.magenta} stopOpacity="0.45" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <line x1="50" y1="17" x2="50" y2="73" className="technology-stack-spine" stroke={EMISSION.magenta} strokeWidth="0.12" opacity="0.2" />

      {TECH_STACK_FLOWS.map((flow) => {
        const d = techStackFlowPath(flow.fromLayer, flow.toLayer)
        return (
          <g key={flow.id}>
            <path d={d} className="technology-stack-flow" fill="none" stroke="url(#tech-flow-grad)" />
            <circle r="0.42" className="technology-stack-flow__particle" fill={EMISSION.cyan}>
              <animateMotion dur={`${flow.duration}s`} repeatCount="indefinite" path={d} begin={`${flow.delay}s`} />
            </circle>
          </g>
        )
      })}
    </svg>
  )
}
