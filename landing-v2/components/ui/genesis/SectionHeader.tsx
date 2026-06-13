'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { GenesisHeadline, slideLeft } from '@/components/ui/SceneShared'

export type HighlightTone = 'strong' | 'brand' | 'signature' | 'intelligence'

export interface SectionHeaderProps {
  label?: string
  title: ReactNode
  eyebrow?: string
  description?: string
  highlight?: string
  highlightTone?: HighlightTone
  align?: 'left' | 'center'
  className?: string
  /** Optional label accent (e.g. G-Pulse fuchsia) */
  labelClassName?: string
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Canonical section header — label + GenesisHeadline + description.
 * Use inside SceneWrapper motion stacks for consistent stagger animation.
 */
export function SectionHeader({
  label,
  title,
  eyebrow,
  description,
  highlight,
  highlightTone: _highlightTone = 'strong',
  align = 'left',
  className,
  labelClassName,
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <header className={cn('scene-section-header flex flex-col gap-genesis-4 max-w-prose', alignClass, className)}>
      {eyebrow ? (
        <motion.span variants={slideLeft} className="text-caption text-genesis-ghost uppercase tracking-widest">
          {eyebrow}
        </motion.span>
      ) : null}
      {label ? (
        <motion.span variants={slideLeft} className={cn('label-section', labelClassName)}>
          {label}
        </motion.span>
      ) : null}
      {highlight ? (
        <GenesisHeadline lead={String(title)} highlight={highlight} />
      ) : (
        <motion.h2
          variants={slideLeft}
          className="font-display text-display text-genesis-text leading-tight"
        >
          {title}
        </motion.h2>
      )}
      {description ? (
        <motion.p variants={slideLeft} className="text-body-lg text-genesis-mist leading-relaxed">
          {description}
        </motion.p>
      ) : null}
    </header>
  )
}
