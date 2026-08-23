'use client'

import { useState } from 'react'
import { G1HeroShell } from './G1HeroShell'
import { G1ParticleCore, type CorePhase } from './G1ParticleCore'
import { GlassLogo } from './GlassLogo'

function heroCount() {
  if (typeof window === 'undefined') return 3600
  const w = window.innerWidth
  return w < 640 ? 2200 : w < 1100 ? 3400 : 4800
}

/**
 * VARIANTE C — pulso dual cinematográfico + nebula. Holds de cristal largos
 * (2 s legibles), burst rápido a partículas, convergencia a «G1» cristal y túnel.
 * Nebula/humo de marca más intensa: la lectura más atmosférica y «qpay».
 */
const CINEMATIC: CorePhase[] = [
  { key: 'g-in', target: 'genesis', dur: 1.9, solid: null, bright: 1.0 },
  { key: 'g-hold', target: 'genesis', dur: 3.0, solid: 'genesis', bright: 0.2 },
  { key: 'burst', target: 'field', dur: 1.1, solid: null, bright: 1.0 },
  { key: 'g1-in', target: 'g1', dur: 1.9, solid: null, bright: 1.0 },
  { key: 'g1-hold', target: 'g1', dur: 3.0, solid: 'g1', bright: 0.2 },
  { key: 'tunnel', target: 'field', dur: 1.6, solid: null, bright: 1.0 },
]

export function G1HeroC() {
  const [solid, setSolid] = useState<'genesis' | 'g1' | null>(null)
  return (
    <G1HeroShell
      label="Variante C · cinematográfico + nebula"
      smoke
      smokeIntensity={1.35}
      bloomIntensity={0.6}
      glass={<GlassLogo active={solid} />}
    >
      <G1ParticleCore count={heroCount()} phases={CINEMATIC} onPhase={(p: CorePhase) => setSolid(p.solid)} />
    </G1HeroShell>
  )
}
