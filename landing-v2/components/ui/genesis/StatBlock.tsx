'use client'

import { useT } from '@/context/IdiomaContext'
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
  const t = useT()
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* `dir="ltr"`: ver la nota de `SceneTechnology`. Un signo neutro en RTL
          cambia de sentido, no solo de sitio. */}
      <span
        dir="ltr"
        className={cn(
          'text-2xl font-bold text-genesis-text',
          mono ? 'font-mono text-mono' : 'font-display'
        )}
      >
        {typeof value === 'string' ? t(value) : value}
      </span>
      <span className="text-caption text-genesis-ghost uppercase tracking-wider">
        {t(label)}
      </span>
      {description ? (
        <span className="text-sm text-genesis-mist">{t(description)}</span>
      ) : null}
    </div>
  )
}
