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

/*
 * UN SOLO RADIO PARA TODOS LOS CRISTALES.
 *
 * Habia dos —16 px en product/trust/community y 20 px en ecosystem/marketplace—
 * sin ningun motivo detras: dos variantes se escribieron en momentos distintos y
 * nadie las comparo. Cuatro pixeles de radio no se ven de uno en uno, pero
 * puestas dos tarjetas cerca la discrepancia si se percibe, y no se sabe de
 * donde viene. Un sistema de cristal con dos radios no es un sistema.
 */
const variantClasses: Record<CardVariant, string> = {
  product: 'surface-card rounded-2xl',
  ecosystem: 'surface-card rounded-2xl',
  marketplace: 'surface-card rounded-2xl',
  trust: 'surface-card rounded-2xl',
  community: 'surface-card rounded-2xl',
}

/**
 * EL TAMAÑO DEL TÍTULO SIGUE AL PAPEL DE LA TARJETA, no es uno para todas.
 *
 * Todas usaban `text-heading` (32px). Funciona para una tarjeta de producto, que
 * encabeza un bloque con descripción y datos. No funciona para un nodo del mapa
 * de ecosistema, que es un ROTULO NAVEGABLE de una palabra: «Mining», «Booster».
 *
 * Medido: esos rótulos a 32px dejaban la caja con un 44% de aire, y competían en
 * peso visual con el titular real de la sección — ocho titulares donde debía
 * haber un titular y ocho enlaces.
 *
 * El aire no era culpa de la caja. Era culpa de meter texto de titular en algo
 * que no es un titular.
 */
/*
 * EL TAMANO YA NO LO ELIGE LA VARIANTE.
 *
 * Habia dos clases —`text-heading` para cuatro variantes y `text-body-lg` para
 * ecosystem— y ademas una regla global las pisaba con 1,625 rem. Resultado
 * medido: el mismo tipo de tarjeta con 26 px en trust, staking y goracle, y con
 * 17,9 en booster.
 *
 * El razonamiento que ya estaba escrito aqui para ecosystem —«un rotulo
 * navegable no es un titular»— vale para TODAS: un titulo de tarjeta nombra un
 * elemento de una lista, no encabeza un bloque. Asi que el tamano lo fija el
 * sistema de tarjeta en un solo sitio (1,15 rem, en globals) y la variante ya no
 * opina. La `font-family` y el peso si siguen siendo cosa de cada una.
 */
const variantTitleClass: Record<CardVariant, string> = {
  product: 'font-semibold',
  trust: 'font-semibold',
  community: 'font-semibold',
  marketplace: 'font-semibold',
  ecosystem: 'font-semibold',
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
          /*
           * `h-full`: la tarjeta llena su celda de rejilla.
           *
           * El envoltorio de animación SÍ se estiraba —una celda de rejilla lo
           * hace por defecto— pero la tarjeta de dentro conservaba su altura
           * automática. Resultado medido en G-Oracle: tres tarjetas contiguas de
           * 300, 326 y 351 px, con el borde inferior en escalera de 51 px.
           *
           * Es la última desalineación que quedaba: Trust, Booster, Staking y
           * Ecosistema ya daban 0 tras el trabajo anterior.
           */
          'flex flex-col text-genesis-text h-full',
          soloRotulo ? 'gap-0 px-genesis-6 py-genesis-3' : 'gap-genesis-4 p-genesis-6',
          variantClasses[variant],
          hover && 'card-genesis-hover',
          className
        )}
      >
        {label ? <span className="label-section">{label}</span> : null}
        {title ? (
          <Heading className={cn('font-display text-genesis-text', variantTitleClass[variant])}>
            {title}
          </Heading>
        ) : null}
        {description ? (
          <p className="text-body-lg text-genesis-mist max-w-prose">{description}</p>
        ) : null}
        {children}
      </article>
    </HeadingLevel>
  )
}
