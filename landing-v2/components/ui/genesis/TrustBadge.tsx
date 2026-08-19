'use client'

import { useT } from '@/context/IdiomaContext'
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
  /*
    EL COLOR CODIFICA EL TIPO DE PRUEBA, NO «TODO BIEN».

    Los tres estados positivos usaban `state-success` — el MISMO verde para los
    tres. Verificado, auditado y en vivo se veian identicos, asi que el color no
    distinguia nada: era decoracion con disfraz de semantica. Y el verde no esta
    en la paleta de marca.

    Ahora cada uno toma un tramo de la rampa Genesis segun QUE clase de prueba
    ofrece, que es la distincion que la seccion necesita hacer:

      verificado  cian     — comprobable en cadena, ahora mismo
      auditado    violeta  — revisado por un tercero
      en vivo     magenta  — esta ocurriendo, y por eso late

    OJO: la clase es `genesis-fuchsia`, no `genesis-magenta`. Esa segunda NO
    existe en la escala, y usarla deja el punto SIN color de fondo — sin error
    de compilacion, sin aviso en consola y sin nada que lo delate salvo mirarlo.

    `pending` conserva el ambar: ese SI es un estado distinto de los otros tres,
    y ahi el color semantico esta haciendo su trabajo.
  */
  verified: {
    label: 'Verificado',
    dotClass: 'bg-genesis-cyan',
    textClass: 'text-genesis-cyan',
  },
  live: {
    label: 'En vivo',
    dotClass: 'bg-genesis-fuchsia animate-pulse',
    textClass: 'text-genesis-fuchsia',
  },
  audited: {
    label: 'Auditado',
    dotClass: 'bg-genesis-violet',
    textClass: 'text-genesis-violet',
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
  const t = useT()
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
          {t(config.label)}
        </span>
      </div>
      {/*
        SIN `text-heading`: es una tarjeta, no un titular.

        Es el mismo componente de cristal que el resto —lleva `surface-card`— y
        llevaba a mano la clase de titular de bloque. Medido junto al resto:
        26 px aqui contra 18,4 en booster, staking, goracle y ecosistema, con la
        tarjeta a 207 px de ancho. El tamano lo fija ahora el sistema de tarjeta
        en un solo sitio; aqui solo se declara la familia y el peso.
      */}
      <Heading className="font-display font-semibold text-genesis-text">{t(title)}</Heading>
      {/*
        Era `text-sm` (14px) mientras `Card` usa `text-body-lg` (17px) para lo
        mismo: la descripción de una tarjeta. Dos tamaños para un mismo papel
        dentro de la misma sección — medido en Trust, que muestra ambos tipos de
        tarjeta uno al lado del otro.
      */}
      {description ? (
        <p className="text-body-lg text-genesis-mist leading-relaxed">{description}</p>
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
