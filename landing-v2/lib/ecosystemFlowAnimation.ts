/**
 * Ecosistema — animación suave, sin figuras ni pulsos fuertes.
 */
import { GENESIS_RGB_NORM } from '@/lib/genesis-brand'
import {
  ECOSYSTEM_FLOW_ROLE,
  ECOSYSTEM_META_STRIDE,
  ECOSYSTEM_TOKEN_PULSE_PERIOD,
  ECOSYSTEM_INTENSITY,
  type EcosystemFlowRole,
} from './ecosystemEnergyFlow'

type Rgb = readonly [number, number, number]

export { ECOSYSTEM_META_STRIDE, ECOSYSTEM_TOKEN_PULSE_PERIOD }

export function ecosystemTokenWaveStrength(elapsed: number): number {
  const u = (elapsed % ECOSYSTEM_TOKEN_PULSE_PERIOD) / ECOSYSTEM_TOKEN_PULSE_PERIOD
  const attack = u < 0.12 ? u / 0.12 : 1
  const decay = Math.exp(-Math.pow((u - 0.08) / 0.4, 2) * 4.5)
  return Math.max(0, attack * decay * 0.35 * ECOSYSTEM_INTENSITY)
}

export function ecosystemFlowColor(
  _role: EcosystemFlowRole,
  _pathT: number,
  nodeKey: number,
  boost: number
): [number, number, number] {
  const fuchsiaSoft = GENESIS_RGB_NORM.fuchsiaSoft
  const core = GENESIS_RGB_NORM.core
  const ion = GENESIS_RGB_NORM.ion
  const cyan = GENESIS_RGB_NORM.cyan

  let base: Rgb = core
  if (nodeKey === 6) base = ion
  else if (nodeKey === 7) base = cyan
  else if (nodeKey === 0) base = fuchsiaSoft

  const b = 1 + boost * 0.22
  const dim = ECOSYSTEM_INTENSITY
  return [Math.min(1, base[0] * b * dim), Math.min(1, base[1] * b * dim), Math.min(1, base[2] * b * dim)]
}

export interface EcosystemParticleFrame {
  px: number
  py: number
  pz: number
  cr: number
  cg: number
  cb: number
}

export function computeEcosystemParticleFrame(
  morphX: number,
  morphY: number,
  morphZ: number,
  meta: Float32Array,
  particleIndex: number,
  t: number,
  elapsed: number,
  motion: number,
  organicOx: number,
  organicOy: number,
  organicOz: number,
  baseR: number,
  baseG: number,
  baseB: number
): EcosystemParticleFrame {
  const mi = particleIndex * ECOSYSTEM_META_STRIDE
  const phase = meta[mi + 4]!
  const nodeKey = meta[mi + 7]!
  const role = meta[mi + 5]! as EcosystemFlowRole

  const tokenWave = ecosystemTokenWaveStrength(elapsed)
  let px = morphX + organicOx * 0.45
  let py = morphY + organicOy * 0.45
  let pz = morphZ + organicOz * 0.35

  const driftX = Math.sin(t * 0.11 + phase) * 0.003 * motion
  const driftY = Math.cos(t * 0.09 + phase * 1.07) * 0.0025 * motion
  px += driftX
  py += driftY

  const boost = 0.06 + tokenWave * 0.18
  const [cr, cg, cb] = ecosystemFlowColor(role, 0, nodeKey, boost)
  const mix = Math.min(0.28, boost * 0.38)

  return {
    px,
    py,
    pz,
    cr: baseR * (1 - mix) + cr * mix,
    cg: baseG * (1 - mix) + cg * mix,
    cb: baseB * (1 - mix) + cb * mix,
  }
}
