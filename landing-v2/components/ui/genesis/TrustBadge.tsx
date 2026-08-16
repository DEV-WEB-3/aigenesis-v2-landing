'use client'

import { Heading, HeadingLevel } from './Heading'

export type TrustStatus = 'verified' | 'live' | 'audited' | 'pending'

export interface TrustBadgeProps {
  title: string
  description?: string
  status?: TrustStatus
  href?: string
  className?: string
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

const statusConfig: Record<
  TrustStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  verified: {
    label: 'Verificado',
    dotClass: 'bg-state-success',
    textClass: 'text-state-success',
  },
  live: {
    label: 'En vivo',
    dotClass: 'bg-state-success animate-pulse',
    textClass: 'text-state-success',
  },
  audited: {
    label: 'Auditado',
    dotClass: 'bg-state-success',
    textClass: 'text-state-success',
  },
  pending: {
    label: 'Pendiente',
    dotClass: 'bg-state-warning',
    textClass: 'text-state-warning',
  },
}

export function TrustBadge({
  title,
  description,
  status = 'verified',
  href,
  className,
}: TrustBadgeProps) {
  const config = statusConfig[status]

  const inner = (
    /*
     * Era <h4> mientras Card era <h3>, y las dos son tarjetas hermanas bajo la
     * misma sección: de ahí el salto H2 → H4 que marcaba la auditoría. Ahora las
     * dos bajan el mismo escalón porque ocupan el mismo sitio en el árbol.
     */
    <HeadingLevel>
      <div className="flex items-center gap-2">
        <span
          className={cn('inline-block h-2 w-2 rounded-full shrink-0', config.dotClass)}
          aria-hidden="true"
        />
        <span className={cn('text-caption uppercase tracking-wider', config.textClass)}>
          {config.label}
        </span>
      </div>
      <Heading className="font-display text-heading text-genesis-text">{title}</Heading>
      {description ? (
        <p className="text-sm text-genesis-mist leading-relaxed">{description}</p>
      ) : null}
    </HeadingLevel>
  )

  const baseClass = cn(
    'surface-card rounded-2xl p-genesis-6 flex flex-col gap-genesis-3',
    'transition-base ease-in-out-smooth',
    href && 'card-genesis-hover focus-ring-genesis',
    className
  )

  if (href) {
    const external = /^https?:\/\//i.test(href)
    return (
      <a
        href={href}
        className={baseClass}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }

  return <div className={baseClass}>{inner}</div>
}
