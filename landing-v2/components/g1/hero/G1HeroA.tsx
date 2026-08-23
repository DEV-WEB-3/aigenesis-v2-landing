'use client'

import { G1HeroShell } from './G1HeroShell'
import { G1ParticleCore } from './G1ParticleCore'

function heroCount() {
  if (typeof window === 'undefined') return 9000
  const w = window.innerWidth
  return w < 640 ? 5000 : w < 1100 ? 9000 : 14000
}

/**
 * VARIANTE A — MASA VOLUMÉTRICA pura partícula (estilo qpaycard). UN solo sistema:
 * las mismas partículas se muestrean sobre una superficie 3D (`MeshSurfaceSampler`)
 * → orbe/gema con profundidad, se pulverizan al campo y se reconstruyen en «G1».
 * Sin cristal HTML: la masa ES el contenido (sin unión de componentes).
 */
export function G1HeroA() {
  return (
    <G1HeroShell
      label="Variante A · masa volumétrica (MeshSurfaceSampler)"
      smoke
      smokeIntensity={0.55}
      bloomIntensity={0.5}
    >
      <G1ParticleCore count={heroCount()} baseOpacity={0.82} />
    </G1HeroShell>
  )
}
