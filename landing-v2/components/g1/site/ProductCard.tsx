import { G1 } from '@/lib/design/g1'
import { GlassMedia, type MediaMotif } from './GlassMedia'

export type Producto = {
  tag: string
  name: string
  desc: string
  href?: string
  accent?: 'violet' | 'cyan' | 'amber' | 'magenta' | 'blue'
  motif?: MediaMotif
}

const ACCENT: Record<NonNullable<Producto['accent']>, string> = {
  violet: G1.violet,
  cyan: G1.cyan,
  amber: G1.amber,
  magenta: G1.magenta,
  blue: G1.blue,
}

/** Tarjeta de producto/ecosistema. Acento por color, enlace externo opcional. */
export function ProductCard({ tag, name, desc, href, accent = 'cyan', motif }: Producto) {
  const color = ACCENT[accent]
  const inner = (
    <div
      className="group relative h-full overflow-hidden rounded-2xl border border-genesis-ghost/50 bg-genesis-surface/40 p-6 transition-colors"
      style={{ borderColor: `${color}22` }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
        style={{ background: color }}
      />
      {motif ? <GlassMedia motif={motif} className="mb-5" ratio="16 / 10" /> : null}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-genesis-mist">{tag}</p>
      </div>
      <h3 className="mt-3 font-display text-[21px] font-bold tracking-tight text-genesis-text">
        {name}
        {href ? <span className="ml-1.5 text-[14px] text-genesis-mist transition-colors group-hover:text-genesis-text">↗</span> : null}
      </h3>
      <p className="mt-3 text-[14.5px] leading-relaxed text-genesis-mist">{desc}</p>
    </div>
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    )
  }
  return inner
}
