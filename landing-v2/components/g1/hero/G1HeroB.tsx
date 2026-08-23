'use client'

import { useState } from 'react'
import { G1HeroShell } from './G1HeroShell'
import { G1ParticleCore, type CorePhase } from './G1ParticleCore'
import { GlassLogo } from './GlassLogo'
import { G1GlassCrystal } from './G1GlassCrystal'

function heroCount() {
  if (typeof window === 'undefined') return 3200
  const w = window.innerWidth
  return w < 640 ? 1800 : w < 1100 ? 3000 : 4200
}

/**
 * VARIANTE B — cristal 3D real (MeshTransmission). La más premium en GPU: un
 * cristal facetado que refracta las partículas + el logo cristal legible encima.
 * Fallback a póster obligatorio (transmission es cara); menos partículas que A/C.
 */
export function G1HeroB() {
  const [solid, setSolid] = useState<'genesis' | 'g1' | null>(null)
  return (
    <G1HeroShell
      label="Variante B · cristal 3D (transmission)"
      bloomIntensity={0.62}
      glass={<GlassLogo active={solid} />}
    >
      <G1ParticleCore count={heroCount()} onPhase={(p: CorePhase) => setSolid(p.solid)} baseOpacity={0.8} />
      <G1GlassCrystal active={solid} />
    </G1HeroShell>
  )
}
