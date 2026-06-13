'use client'

import { tokenNodeSlotSize } from '@/lib/token/tokenOrbitalValueLayout'
import type { TokenValueNodeDef } from '@/lib/token/tokenOrbitalValueLayout'
import { TokenValueIconGlyph } from '@/components/token/TokenValueIcon'

interface TokenAtomicNodeMarkProps {
  node: TokenValueNodeDef
  nodeIndex: number
  glowFilterId?: string
}

/** Minimal satellite — thin ring + icon, no bubble halo. */
export default function TokenAtomicNodeMark({ node, nodeIndex, glowFilterId }: TokenAtomicNodeMarkProps) {
  const slot = tokenNodeSlotSize(nodeIndex)
  const r = slot * 0.44
  const iconScale = (slot * 0.5) / 24

  return (
    <g
      className="token-atomic-node-mark"
      data-node={node.id}
      filter={glowFilterId ? `url(#${glowFilterId})` : undefined}
    >
      <circle
        className="token-atomic-node-mark__ring"
        r={r}
        fill="rgba(5, 8, 20, 0.88)"
        stroke={node.color}
        strokeWidth={0.05}
        opacity={0.92}
      />
      <g
        className="token-atomic-node-mark__icon"
        transform={`translate(${-12 * iconScale}, ${-12 * iconScale}) scale(${iconScale})`}
        color="#E8F4FF"
        opacity={0.9}
      >
        <TokenValueIconGlyph id={node.id} />
      </g>
    </g>
  )
}
