'use client'

import type { ReactNode } from 'react'
import { Heading, HeadingLevel } from './Heading'

export type CardVariant = 'product' | 'ecosystem' | 'marketplace' | 'trust' | 'community'

export interface CardProps {
  variant?: CardVariant
  label?: string
  title?: string
  description?: string
  children?: ReactNode
  className?: string
  hover?: boolean
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

const variantClasses: Record<CardVariant, string> = {
  product: 'surface-card rounded-2xl',
  ecosystem: 'surface-card rounded-[20px]',
  marketplace: 'surface-card rounded-[20px]',
  trust: 'surface-card rounded-2xl',
  community: 'surface-card rounded-2xl',
}

export function Card({
  variant = 'product',
  label,
  title,
  description,
  children,
  className,
  hover = true,
}: CardProps) {
  /*
   * Una tarjeta es una unidad subordinada a su sección: si la sección es h2, sus
   * tarjetas son h3. `HeadingLevel` baja ese escalón para todo lo de dentro, así
   * que el nivel sale del ANIDAMIENTO y no de un número escrito a mano.
   */
  return (
    <HeadingLevel>
      <article
        className={cn(
          'flex flex-col gap-genesis-4 p-genesis-6 text-genesis-text',
          variantClasses[variant],
          hover && 'card-genesis-hover',
          className
        )}
      >
        {label ? <span className="label-section">{label}</span> : null}
        {title ? (
          <Heading className="font-display text-heading text-genesis-text">{title}</Heading>
        ) : null}
        {description ? (
          <p className="text-body-lg text-genesis-mist max-w-prose">{description}</p>
        ) : null}
        {children}
      </article>
    </HeadingLevel>
  )
}
