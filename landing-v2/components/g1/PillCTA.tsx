import Link from 'next/link'
import type { ReactNode } from 'react'
import { G1_GRADIENT } from '@/lib/design/g1'

/**
 * PILL CTA — el botón cápsula de G1 (la firma de aitechone/qpaycard traducida
 * a la marca). Dos variantes: `primary` (gradiente firma) y `ghost` (contorno).
 * Usa `next/link`; `external` abre en pestaña nueva con rel seguro.
 */
type Props = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  external?: boolean
  className?: string
}

export function PillCTA({
  href,
  children,
  variant = 'ghost',
  external = false,
  className = '',
}: Props) {
  const base =
    'inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]'
  const skin =
    variant === 'primary'
      ? 'font-bold text-genesis-void'
      : 'border border-genesis-ghost bg-white/[0.04] text-genesis-text hover:border-genesis-cyan'

  return (
    <Link
      href={href}
      className={`${base} ${skin} ${className}`}
      style={variant === 'primary' ? { background: G1_GRADIENT } : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </Link>
  )
}
