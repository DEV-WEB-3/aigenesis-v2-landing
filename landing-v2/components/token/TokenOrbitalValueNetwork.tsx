'use client'

import {
  TOKEN_VALUE_CENTER,
  TOKEN_VALUE_NODES,
  TOKEN_VALUE_PULSE_S,
  tokenValueMobileIndices,
} from '@/lib/token/tokenOrbitalValueLayout'
import { useTokenOrbitEditorMode } from '@/lib/token/useTokenOrbitEditorMode'
import TokenValueCore from '@/components/token/TokenValueCore'
import TokenAtomicOrbitals from '@/components/token/TokenAtomicOrbitals'

interface TokenOrbitalValueNetworkProps {
  isActive: boolean
  variant?: 'full' | 'compact'
}

export default function TokenOrbitalValueNetwork({
  isActive,
  variant = 'full',
}: TokenOrbitalValueNetworkProps) {
  const editorMode = useTokenOrbitEditorMode()

  if (!isActive) return null

  const isCompact = variant === 'compact'
  const visibleIndices = isCompact
    ? tokenValueMobileIndices()
    : TOKEN_VALUE_NODES.map((_, i) => i)

  const showEditor = editorMode && !isCompact

  return (
    <div
      className={`token-orbital-value-network token-atomic-network${isCompact ? ' token-orbital-value-network--compact' : ''}${showEditor ? ' token-orbital-value-network--editor' : ''}`}
      aria-label={showEditor ? 'Editor de órbitas Genesis Token' : 'Genesis Token Atomic Orbital'}
      style={{ '--token-value-pulse-s': `${TOKEN_VALUE_PULSE_S}s` } as React.CSSProperties}
    >
      <div className="token-orbital-value-network__layer token-orbital-value-network__layer--atomic">
        <TokenAtomicOrbitals visibleNodeIndices={visibleIndices} editorMode={showEditor} />
      </div>

      <div className="token-orbital-value-network__layer token-orbital-value-network__layer--core">
        <div className="token-orbital-value-network__stage">
          <div
            className="token-orbital-value-network__core-anchor"
            style={{
              left: `${TOKEN_VALUE_CENTER.x}%`,
              top: `${TOKEN_VALUE_CENTER.y}%`,
            }}
          >
            <TokenValueCore compact={isCompact} />
          </div>
        </div>
      </div>
    </div>
  )
}
