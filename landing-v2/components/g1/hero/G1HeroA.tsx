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
 * VARIANTE A — glassmorphism HTML + luz. El logo sólido es un panel frosted
 * (backdrop-blur, paleta de marca) con el símbolo Génesis / «G1» cristal; detrás,
 * las partículas + una nebula de luz suave. La más legible y la más liviana en
 * móvil (el cristal es HTML, no GPU).
 */
export function G1HeroA() {
  const [solid, setSolid] = useState<'genesis' | 'g1' | null>(null)
  return (
    <G1HeroShell
      label="Variante A · glassmorphism + luz"
      smoke
      smokeIntensity={0.7}
      bloomIntensity={0.5}
      glass={<GlassLogo active={solid} />}
    >
      <G1ParticleCore count={heroCount()} onPhase={(p: CorePhase) => setSolid(p.solid)} />
    </G1HeroShell>
  )
}
