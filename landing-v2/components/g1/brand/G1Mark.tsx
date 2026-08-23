'use client'

/**
 * G1 MARK — el logo de marca G1 (monograma + órbitas + nodos + efectos), en SVG
 * vectorial sobre alfa transparente. Materiales black-chrome + vidrio + bisel de
 * marca (violeta→cian) y acento de energía ámbar. Fiel a la hoja técnica del
 * logo (docs/hoja-tecnica-logo-g1). El asset estático canónico vive en
 * `public/brand/g1-mark.svg`; este componente lo anima para hero/loaders.
 *
 * `animated` (def. true): las órbitas giran lento y los nodos laten. Respeta
 * prefers-reduced-motion. `size` en px. Los ids llevan sufijo para permitir
 * varias instancias sin colisión de <defs>.
 */
let uid = 0

export function G1Mark({
  size = 120,
  animated = true,
  className = '',
  title = 'G1',
}: {
  size?: number
  animated?: boolean
  className?: string
  title?: string
}) {
  const k = `g1m${(uid = (uid + 1) % 100000)}`
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={title}
      className={className}
    >
      {animated ? (
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .${k}-o { transform-box: fill-box; transform-origin: center; }
            .${k}-o1 { animation: ${k}spin 26s linear infinite; }
            .${k}-o2 { animation: ${k}spin 34s linear infinite reverse; }
            .${k}-o3 { animation: ${k}spin 44s linear infinite; }
            .${k}-n { animation: ${k}pulse 3.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
            .${k}-n2 { animation-delay: .8s } .${k}-n3 { animation-delay: 1.6s }
            .${k}-p { animation: ${k}twinkle 2.8s ease-in-out infinite; }
            @keyframes ${k}spin { to { transform: rotate(360deg) } }
            @keyframes ${k}pulse { 0%,100% { opacity:.85; transform:scale(1) } 50% { opacity:1; transform:scale(1.12) } }
            @keyframes ${k}twinkle { 0%,100% { opacity:.3 } 50% { opacity:.85 } }
          }
        `}</style>
      ) : null}
      <defs>
        <linearGradient id={`${k}Metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2B3050" /><stop offset="0.42" stopColor="#0C0F1C" /><stop offset="1" stopColor="#02040A" />
        </linearGradient>
        <linearGradient id={`${k}Rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9D4DFF" /><stop offset="0.55" stopColor="#00F5FF" /><stop offset="1" stopColor="#6E56CF" />
        </linearGradient>
        <linearGradient id={`${k}Chrome`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.45" stopColor="#DCE3F5" /><stop offset="0.55" stopColor="#AAB4D6" /><stop offset="1" stopColor="#EEF2FF" />
        </linearGradient>
        <linearGradient id={`${k}Orbit`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#00F5FF" stopOpacity="0" /><stop offset="0.5" stopColor="#00F5FF" stopOpacity="0.75" /><stop offset="1" stopColor="#9D4DFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${k}Sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.28" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${k}NC`} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.35" stopColor="#8FF6FF" /><stop offset="1" stopColor="#00A6C4" /></radialGradient>
        <radialGradient id={`${k}NV`} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.4" stopColor="#C4A6FF" /><stop offset="1" stopColor="#6E56CF" /></radialGradient>
        <radialGradient id={`${k}NA`} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.4" stopColor="#FFCB9A" /><stop offset="1" stopColor="#FF8A3D" /></radialGradient>
        <filter id={`${k}Glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <radialGradient id={`${k}Aura`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#6E56CF" stopOpacity="0.45" /><stop offset="0.5" stopColor="#00F5FF" stopOpacity="0.14" /><stop offset="1" stopColor="#00F5FF" stopOpacity="0" /></radialGradient>
      </defs>

      <ellipse cx="120" cy="205" rx="66" ry="12" fill="#02040A" opacity="0.55" filter={`url(#${k}Glow)`} />
      <circle cx="120" cy="118" r="92" fill={`url(#${k}Aura)`} />

      <g opacity="0.9" filter={`url(#${k}Glow)`}>
        <ellipse className={`${k}-o ${k}-o1`} cx="120" cy="120" rx="98" ry="40" stroke={`url(#${k}Orbit)`} strokeWidth="2.2" transform="rotate(-24 120 120)" />
        <ellipse className={`${k}-o ${k}-o2`} cx="120" cy="120" rx="94" ry="36" stroke={`url(#${k}Orbit)`} strokeWidth="1.8" transform="rotate(28 120 120)" opacity="0.8" />
        <ellipse className={`${k}-o ${k}-o3`} cx="120" cy="120" rx="86" ry="30" stroke={`url(#${k}Orbit)`} strokeWidth="1.5" transform="rotate(78 120 120)" opacity="0.6" />
      </g>

      <g filter={`url(#${k}Glow)`}>
        <circle className={`${k}-n`} cx="212" cy="104" r="6.5" fill={`url(#${k}NC)`} />
        <circle className={`${k}-n ${k}-n2`} cx="36" cy="150" r="7.5" fill={`url(#${k}NV)`} />
        <circle className={`${k}-n ${k}-n3`} cx="150" cy="46" r="5" fill={`url(#${k}NA)`} />
        <circle className={`${k}-n ${k}-n2`} cx="70" cy="66" r="3.6" fill={`url(#${k}NC)`} />
        <circle className={`${k}-n ${k}-n3`} cx="196" cy="176" r="4.2" fill={`url(#${k}NC)`} />
      </g>

      <g className={`${k}-p`} fill="#CFE9FF" opacity="0.7">
        <circle cx="98" cy="40" r="1.1" /><circle cx="180" cy="70" r="0.9" /><circle cx="52" cy="184" r="1.2" /><circle cx="168" cy="196" r="0.9" /><circle cx="220" cy="140" r="1" />
      </g>

      <g>
        <rect x="76" y="76" width="88" height="88" rx="22" fill={`url(#${k}Metal)`} stroke={`url(#${k}Rim)`} strokeWidth="2.4" />
        <rect x="80" y="80" width="80" height="40" rx="18" fill={`url(#${k}Sheen)`} />
        <path d="M88 86 q10 -4 24 -3" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
        <text x="120" y="134" textAnchor="middle" fontFamily="'Exo 2', 'Space Grotesk', system-ui, sans-serif" fontSize="46" fontWeight="800" letterSpacing="-1" fill={`url(#${k}Chrome)`}>G1</text>
      </g>
    </svg>
  )
}
