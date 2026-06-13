'use client'

import type { ReactNode } from 'react'

export interface GenesisStatBlockProps {
  value: ReactNode
  label: string
  description?: string
  mono?: boolean
  animated?: boolean
  className?: string
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/**
 * StatBlock estático del Design System.
 * Para contadores animados GSAP, usar SceneShared.StatBlock.
 */
export function StatBlock({
  value,
  label,
  description,
  mono = false,
  className,
}: GenesisStatBlockProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span
        className={cn(
          'text-2xl font-bold text-genesis-text',
          mono ? 'font-mono text-mono' : 'font-display'
        )}
      >
        {value}
      </span>
      <span className="text-caption text-genesis-ghost uppercase tracking-wider">
        {label}
      </span>
      {description ? (
        <span className="text-sm text-genesis-mist">{description}</span>
      ) : null}
    </div>
  )
}
