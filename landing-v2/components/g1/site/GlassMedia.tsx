import { G1 } from '@/lib/design/g1'

/**
 * GLASS MEDIA — "cristal con media" (como aitechone, mejorado). Marco glass
 * (borde de marca + glow + brillo diagonal) con MEDIA GENERADA adentro: arte SVG
 * abstracto de marca por motivo (mercados, red, tarjeta, comunidad, token). Sin
 * fotos de stock: todo generado y en la paleta. Reutilizable en cards y galería.
 */
export type MediaMotif = 'markets' | 'network' | 'card' | 'community' | 'token'

function Art({ motif }: { motif: MediaMotif }) {
  const base = (
    <>
      <defs>
        <linearGradient id={`bg-${motif}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={G1.violet} stopOpacity="0.16" />
          <stop offset="0.5" stopColor={G1.cyan} stopOpacity="0.06" />
          <stop offset="1" stopColor={G1.amber} stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id={`glow-${motif}`} cx="0.7" cy="0.2" r="0.8">
          <stop offset="0" stopColor={G1.cyan} stopOpacity="0.35" />
          <stop offset="1" stopColor={G1.cyan} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="320" height="180" fill="rgb(6,10,18)" />
      <rect x="0" y="0" width="320" height="180" fill={`url(#bg-${motif})`} />
      <rect x="0" y="0" width="320" height="180" fill={`url(#glow-${motif})`} />
    </>
  )

  if (motif === 'markets') {
    const cols = [G1.cyan, G1.violet, G1.amber, G1.cyan, G1.magenta, G1.blue, G1.cyan, G1.amber]
    return (
      <svg viewBox="0 0 320 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {base}
        {cols.map((c, i) => {
          const x = 26 + i * 34
          const h = 30 + ((i * 37) % 70)
          const y = 150 - h
          return (
            <g key={i}>
              <line x1={x} y1={y - 12} x2={x} y2={y + h + 10} stroke={c} strokeWidth="1" opacity="0.5" />
              <rect x={x - 7} y={y} width="14" height={h} rx="2" fill={c} opacity="0.75" />
            </g>
          )
        })}
        <path d="M20 120 L54 96 L88 108 L122 70 L156 84 L190 52 L224 66 L258 40 L292 58" fill="none" stroke={G1.cyan} strokeWidth="2" opacity="0.9" />
      </svg>
    )
  }
  if (motif === 'network') {
    const nodes = [[70, 60], [150, 40], [240, 70], [110, 110], [200, 130], [60, 140], [280, 120], [170, 90]]
    return (
      <svg viewBox="0 0 320 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {base}
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((b, j) => {
            const d = Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!)
            return d < 100 ? <line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={G1.cyan} strokeWidth="1" opacity="0.28" /> : null
          })
        )}
        {nodes.map((n, i) => (
          <circle key={i} cx={n[0]} cy={n[1]} r={i % 3 === 0 ? 5 : 3} fill={i % 2 ? G1.cyan : G1.violet} opacity="0.95" />
        ))}
      </svg>
    )
  }
  if (motif === 'card') {
    return (
      <svg viewBox="0 0 320 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {base}
        <g transform="translate(90 46) rotate(-8)">
          <rect x="0" y="0" width="150" height="92" rx="12" fill="rgb(11,17,32)" stroke={G1.cyan} strokeOpacity="0.4" />
          <rect x="16" y="20" width="26" height="20" rx="4" fill={G1.amber} opacity="0.85" />
          <path d="M52 30 H130 M52 42 H110" stroke={G1.cyan} strokeWidth="2" opacity="0.5" />
          <rect x="16" y="60" width="70" height="8" rx="4" fill={G1.violet} opacity="0.7" />
          <circle cx="128" cy="66" r="10" fill={G1.magenta} opacity="0.5" />
          <circle cx="118" cy="66" r="10" fill={G1.cyan} opacity="0.5" />
        </g>
      </svg>
    )
  }
  if (motif === 'token') {
    return (
      <svg viewBox="0 0 320 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {base}
        <g transform="translate(160 90)">
          <polygon points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23" fill="none" stroke={G1.cyan} strokeWidth="2" opacity="0.7" />
          <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill={G1.violet} opacity="0.25" />
          <text x="0" y="10" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontWeight="800" fontSize="30" fill={G1.cyan}>G1</text>
        </g>
      </svg>
    )
  }
  // community
  const dots = Array.from({ length: 42 }, (_, i) => [40 + ((i * 53) % 240) + (i % 5) * 6, 40 + ((i * 29) % 100)])
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {base}
      {dots.map((d, i) => (
        <circle key={i} cx={d[0]} cy={d[1]} r={i % 7 === 0 ? 5 : 2.4} fill={i % 3 === 0 ? G1.amber : i % 3 === 1 ? G1.cyan : G1.violet} opacity="0.8" />
      ))}
    </svg>
  )
}

export function GlassMedia({ motif, className, ratio = '16 / 9' }: { motif: MediaMotif; className?: string; ratio?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className ?? ''}`}
      style={{ aspectRatio: ratio, border: `1px solid ${G1.cyan}26`, boxShadow: `0 20px 50px -30px ${G1.violet}, inset 0 1px 0 0 ${G1.cyan}1f` }}
    >
      <Art motif={motif} />
      {/* brillo diagonal de cristal */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(120deg, ${G1.cyan}14 0%, transparent 42%, transparent 70%, ${G1.violet}12 100%)` }}
      />
    </div>
  )
}
