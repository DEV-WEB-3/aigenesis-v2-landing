'use client'

import { TOKEN_VALUE_NODES } from '@/lib/token/tokenOrbitalValueLayout'
import { TokenValueIcon } from '@/components/token/TokenValueIcon'

interface TokenValueNodeMarkProps {
  index: number
}

/** Minimal orbital node — icon, thin ring, soft glow only. */
export function TokenValueNodeMark({ index }: TokenValueNodeMarkProps) {
  const node = TOKEN_VALUE_NODES[index]
  if (!node) return null

  return (
    <div
      className="token-value-node token-value-node--atomic"
      data-node={node.id}
      style={{ '--node-color': node.color } as React.CSSProperties}
    >
      <span className="token-value-node__ring" aria-hidden="true" />
      <span className="token-value-node__icon">
        <TokenValueIcon id={node.id} size={9} />
      </span>
    </div>
  )
}
