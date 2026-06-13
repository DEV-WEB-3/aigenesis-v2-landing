/**
 * Generadores simbólicos — star dust structures por capítulo.
 * Misma PARTICLE_COUNT; densidad focal en bordes/nodos (sin subir recuento).
 */
import { PARTICLE_COUNT } from './particleConstants'

type Vec3 = [number, number, number]

function randomOnSphere(r: number): Vec3 {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ]
}

function randomInSphere(r: number): Vec3 {
  return randomOnSphere(r * Math.cbrt(Math.random()))
}

function write(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number,
  jitter = 0.035
): void {
  out[idx * 3] = x + (Math.random() - 0.5) * jitter
  out[idx * 3 + 1] = y + (Math.random() - 0.5) * jitter
  out[idx * 3 + 2] = z + (Math.random() - 0.5) * jitter
}

function line(
  out: Float32Array,
  idx: number,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  n: number,
  jitter = 0.03
): number {
  for (let i = 0; i < n && idx < out.length / 3; i++) {
    const t = n <= 1 ? 0 : i / (n - 1)
    write(out, idx++, ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t, jitter)
  }
  return idx
}

function ring(
  out: Float32Array,
  idx: number,
  radius: number,
  n: number,
  y = 0,
  tilt = 0,
  jitter = 0.04
): number {
  for (let i = 0; i < n && idx < out.length / 3; i++) {
    const a = (i / n) * Math.PI * 2
    const x = Math.cos(a) * radius
    const rawY = Math.sin(a) * radius
    write(out, idx++, x, y + rawY * Math.cos(tilt), rawY * Math.sin(tilt), jitter)
  }
  return idx
}

/** @deprecated Usar genTrustQuantumShield — re-export por compatibilidad */
export { genTrustQuantumShield as genTrustShield } from './trust/TrustShieldGenerator'

/** @deprecated Usar genEcosystemEnergyFlow — re-export por compatibilidad */
export { genEcosystemEnergyFlow as genEcosystemNetwork } from './ecosystemEnergyFlow'

/** @deprecated Usar genTokenGravityCore */
export { genTokenGravityCore as genTokenOrbits } from './tokenGravityCore'

/** @deprecated Usar genMiningGenesisTokenMark */
export { genGenesisTokenMark as genMiningStrata } from './miningDistributedFlow'

/** @deprecated Usar genBoosterAscendingStack */
export { genBoosterAscendingStack as genBoosterStair } from './boosterAscendingStack'

/** @deprecated Usar genStakingSecurityShield */
export { genStakingSecurityShield as genStakingLock } from './stakingSecurityShield'

/** @deprecated Usar genGpulseSignalWaves */
export { genGpulseSignalWaves as genPulseSignal } from './gpulseSignalWaves'

/** @deprecated Usar genGoracleGenesisBrain */
export { genGoracleGenesisBrain as genOracleBrain } from './goracleGenesisBrain'

/** @deprecated Usar genMarketplaceGlobalNetwork */
export { genMarketplaceGlobalNetwork as genMarketplaceGrid } from './marketplaceGlobalNetwork'

/** @deprecated Usar genCommunityNetwork */
export { genCommunityNetwork as genCommunityConstellation } from './communityNetwork'

/** @deprecated Usar genTechnologyStackNetwork */
export { genTechnologyStackNetwork as genTechCircuit } from './technologyStackNetwork'

/** @deprecated — use genRoadmapEvolutionPath */
export { genRoadmapEvolutionPath as genRoadmapAscent } from './roadmapEvolutionPath'

/** @deprecated — use genGenesisPortalNetwork from genesisPortalNetwork */
export { genPortalOrb, genGenesisPortalNetwork } from './genesisPortalNetwork'

export function applyStructureTransform(
  positions: Float32Array,
  bias: { x: number; y: number; z: number },
  scale: number
): Float32Array {
  const out = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i += 3) {
    out[i] = positions[i] * scale + bias.x
    out[i + 1] = positions[i + 1] * scale + bias.y
    out[i + 2] = positions[i + 2] * scale + bias.z
  }
  return out
}

export { PARTICLE_COUNT }
