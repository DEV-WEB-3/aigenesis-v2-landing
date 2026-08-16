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
   * LA CAJA SE AJUSTA A LO QUE LLEVA DENTRO.
   *
   * Antes el padding y el hueco entre hijos eran fijos, dimensionados para el
   * caso completo (etiqueta + título + descripción + contenido). Una tarjeta que
   * sólo lleva un título recibía el mismo espacio reservado para tres elementos
   * que no existían.
   *
   * Medido en la sección Ecosistema, donde las tarjetas son sólo un rótulo
   * navegable: caja de 89 px de alto para 50 px de texto — un 44% de aire —, con
   * un `gap` de 16 px declarado que no hacía nada porque no había segundo hijo.
   *
   * El objetivo de llenado es ~0,85, que es lo que ya daba la sección mejor
   * ajustada del sitio y por eso se lee bien. Y es verificable: se mide como
   * alto del contenido entre alto de la caja.
   */
  const soloRotulo = !description && !children && !label

  return (
    <HeadingLevel>
      <article
        className={cn(
          'flex flex-col text-genesis-text',
          soloRotulo ? 'gap-0 px-genesis-6 py-genesis-3' : 'gap-genesis-4 p-genesis-6',
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
