'use client'

import { G1HeroShell } from './G1HeroShell'
import { G1GpgpuField } from './G1GpgpuField'

/**
 * VARIANTE GPGPU — densidad tipo qpaycard (hasta 65k partículas simuladas en GPU).
 * Mismo relato (orbe volumétrico ⇄ pulverización ⇄ G1) pero movido en la tarjeta,
 * no en CPU. Es el motor para el cielo de partículas y la narrativa por scroll.
 */
export function G1HeroGpgpu() {
  return (
    <G1HeroShell
      label="Variante GPGPU · 65k partículas en GPU"
      smoke
      smokeIntensity={0.5}
      bloomIntensity={0.5}
    >
      <G1GpgpuField baseOpacity={0.82} />
    </G1HeroShell>
  )
}
