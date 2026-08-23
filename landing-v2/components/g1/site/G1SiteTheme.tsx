import { G1 } from '@/lib/design/g1'
import { SmokeNebula } from '../hero/SmokeNebula'

/**
 * TEMA DE FONDO de la web G1 (Capa 1, persistente). Reemplaza el cielo de
 * partículas: aquí NO hay partículas sueltas. Es el "mundo" con contraste —
 * gradiente de marca + zonas de LUZ que respiran y derivan (luces/sombras) +
 * HUMO volumétrico (SmokeNebula) + viñeta (sombra). Todo CSS: liviano, sin coste
 * de canvas, persistente en el layout. Las partículas vuelven como MASAS con
 * forma por página (Capa 2), no como fondo.
 */
export function G1SiteTheme() {
  const lights = [
    { c: G1.violet, x: '16%', y: '10%', s: '72vw', dur: '26s', d: '0s' },
    { c: G1.cyan, x: '84%', y: '26%', s: '62vw', dur: '32s', d: '-8s' },
    { c: G1.amber, x: '62%', y: '92%', s: '56vw', dur: '38s', d: '-16s' },
    { c: G1.magenta, x: '28%', y: '72%', s: '50vw', dur: '34s', d: '-22s' },
  ]
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-genesis-void">
      {/* tinte base de marca */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(120% 90% at 50% -10%, ${G1.violet}14, transparent 55%),` +
            `radial-gradient(90% 80% at 88% 38%, ${G1.cyan}0e, transparent 60%)`,
        }}
      />
      {/* LUCES — zonas que respiran y derivan (luces/sombras) */}
      {lights.map((l, i) => (
        <span
          key={i}
          className="g1-light absolute rounded-full"
          style={{
            left: l.x,
            top: l.y,
            width: l.s,
            height: l.s,
            transform: 'translate(-50%,-50%)',
            background: `radial-gradient(circle, ${l.c}22 0%, ${l.c}0d 34%, transparent 66%)`,
            mixBlendMode: 'screen',
            filter: 'blur(60px)',
            animationDelay: l.d,
            animationDuration: l.dur,
          }}
        />
      ))}
      {/* HUMO */}
      <SmokeNebula intensity={0.7} />
      {/* SOMBRA — viñeta que da contraste al contenido */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 100% at 50% 34%, transparent 45%, rgba(2,4,10,.45) 78%, rgba(2,4,10,.82) 100%)' }}
      />
      <style>{`
        .g1-light{animation-name:g1LightDrift;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
        @keyframes g1LightDrift{
          0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}
          50%{opacity:.85;transform:translate(-44%,-56%) scale(1.18)}
        }
        @media (prefers-reduced-motion:reduce){.g1-light{animation:none}}
      `}</style>
    </div>
  )
}
