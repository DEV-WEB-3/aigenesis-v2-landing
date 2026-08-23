'use client'

import { G1 } from '@/lib/design/g1'

/**
 * GLASS LOGO — la fase SÓLIDA legible (variantes A y C).
 *
 * Dos capas cristal que hacen crossfade según la fase del núcleo:
 *  - `genesis`: el símbolo Génesis real (`/brand/genesis-symbol-512.png`) con glow.
 *  - `g1`: el wordmark «G1» con borde cristal (text-stroke) + relleno semitransparente.
 * `null` → ambas invisibles (fase partícula). El crossfade CSS (900ms) es el morph.
 *
 * Se posiciona sobre la región donde el núcleo forma la figura (arriba-centro).
 */
export function GlassLogo({ active }: { active: 'genesis' | 'g1' | null }) {
  const on = active !== null
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-[min(46vh,380px)] w-[min(46vh,380px)]">
        {/* panel glassmorphism (frosted) sobre las partículas — paleta de marca */}
        <div
          className="absolute inset-[-8%] rounded-[32%] transition-all duration-[900ms] ease-out"
          style={{
            opacity: on ? 1 : 0,
            transform: `scale(${on ? 1 : 0.8})`,
            backdropFilter: 'blur(9px) saturate(1.25)',
            WebkitBackdropFilter: 'blur(9px) saturate(1.25)',
            background: `radial-gradient(60% 60% at 50% 42%, ${G1.violet}1f, ${G1.cyan}12 55%, transparent 78%)`,
            border: `1px solid ${G1.cyan}33`,
            boxShadow: `0 0 60px -12px ${G1.violet}66, inset 0 0 40px -20px ${G1.cyan}55`,
          }}
        />
        {/* símbolo Génesis — rebrandeado a la paleta G1 (hue de marca, facetas 3D intactas) */}
        <div
          aria-hidden
          className="absolute inset-0 transition-all duration-[900ms] ease-out"
          style={{
            isolation: 'isolate',
            opacity: active === 'genesis' ? 1 : 0,
            transform: `scale(${active === 'genesis' ? 1 : 0.82})`,
            filter: `drop-shadow(0 0 26px ${G1.cyan}88) drop-shadow(0 0 60px ${G1.violet}55)`,
          }}
        >
          <img
            src="/brand/genesis-symbol-512.png"
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
          />
          {/* capa de recolor: degradado de marca teñido sobre la silueta */}
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from 205deg at 50% 50%, ${G1.violet}, ${G1.cyan} 34%, ${G1.amber} 62%, ${G1.violet} 100%)`,
              WebkitMaskImage: 'url(/brand/genesis-symbol-512.png)',
              maskImage: 'url(/brand/genesis-symbol-512.png)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              mixBlendMode: 'color',
              opacity: 0.92,
            }}
          />
        </div>
        {/* wordmark G1 cristal */}
        <div
          className="absolute inset-0 grid place-items-center transition-all duration-[900ms] ease-out"
          style={{ opacity: active === 'g1' ? 1 : 0, transform: `scale(${active === 'g1' ? 1 : 0.82})` }}
        >
          <span
            className="font-display font-extrabold leading-none tracking-tight"
            style={{
              fontSize: 'clamp(88px, 22vh, 210px)',
              background: `linear-gradient(120deg, ${G1.violet}cc, ${G1.cyan}cc 60%, ${G1.amber}cc)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: `1.5px ${G1.cyan}aa`,
              filter: `drop-shadow(0 0 22px ${G1.cyan}66)`,
            }}
          >
            G1
          </span>
        </div>
      </div>
    </div>
  )
}
