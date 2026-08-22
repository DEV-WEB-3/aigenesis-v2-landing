import type { ReactNode } from 'react'

/**
 * EYEBROW — el rótulo mono en versalitas sobre cada titular G1.
 * Presentacional puro (sin estado ni i18n): recibe su texto ya resuelto.
 */
export function Eyebrow({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-genesis-cyan ${className}`}
    >
      {children}
    </p>
  )
}
