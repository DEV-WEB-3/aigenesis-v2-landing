'use client'

import { useT } from '@/context/IdiomaContext'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { GenesisHeadline, slideLeft } from '@/components/ui/SceneShared'
import { Heading } from './Heading'

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
 * SIN `gap-genesis-4`: el hueco lo pone `.scene-section-header` desde la hoja de
 * estilos, con la variable de ritmo.
 *
 * La utilidad de Tailwind ganaba a la variable —es una clase, no un selector
 * descendente— y dejaba la cabecera en 13.6 px mientras los bloques de la pila
 * iban a 8.8. Al reves de lo que pide la jerarquia: una cabecera es UN bloque
 * (rotulo, titular y descripcion se leen juntos) y debe ir mas apretada por
 * dentro que la distancia entre bloques distintos.
 *
 * Canonical section header — label + GenesisHeadline + description.
 * Use inside SceneWrapper motion stacks for consistent stagger animation.
 */
/*
 * TRADUCE EL COMPONENTE, NO CADA SECCION.
 *
 * Casi todo el texto visible del portal pasa por media docena de componentes
 * compartidos —cabecera de seccion, ficha, tarjeta, boton—. Traduciendo AQUI se
 * cubre esa mayoria con seis ediciones en vez de con catorce, y sobre todo: una
 * seccion nueva queda traducida sola, sin que nadie tenga que acordarse de
 * envolver sus textos. Lo que se olvida, no existe.
 *
 * `useT` fuera del proveedor devuelve el español tal cual, asi que estos
 * componentes siguen funcionando en las paginas sueltas que no lo montan.
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
  const t = useT()
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
        <header className={cn('scene-section-header flex flex-col max-w-prose', alignClass, className)}>
      {eyebrow ? (
        <motion.span variants={slideLeft} className="text-caption text-genesis-ghost uppercase tracking-widest">
          {t(String(eyebrow))}
        </motion.span>
      ) : null}
      {label ? (
        <motion.span variants={slideLeft} className={cn('label-section', labelClassName)}>
          {t(String(label))}
        </motion.span>
      ) : null}
      {highlight ? (
        <GenesisHeadline lead={String(title)} highlight={String(highlight)} />
      ) : (
        <motion.div variants={slideLeft}>
          <Heading className="font-display text-display text-genesis-text leading-tight">
            {t(String(title))}
          </Heading>
        </motion.div>
      )}
      {description ? (
        <motion.p variants={slideLeft} className="text-body-lg text-genesis-mist leading-relaxed">
          {t(description)}
        </motion.p>
      ) : null}
    </header>
  )
}
