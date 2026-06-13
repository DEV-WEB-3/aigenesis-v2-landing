import { patchGenesisParticleControlConfig, getGenesisParticleControlConfig } from '../lib/trust/GenesisParticleControlStore'
import { applyTrustDevParticleControls } from '../lib/trust/GenesisParticleControlApply'
import { TRUST_ROLE } from '../lib/trust/trustShieldRoles'
import { TRUST_CORE_SLOT } from '../lib/trust/GenesisLogoLayout'

patchGenesisParticleControlConfig({ global: { intensity: 1.75 } })
const cfg = getGenesisParticleControlConfig()

const ctx = {
  role: TRUST_ROLE.CORE,
  slot: TRUST_CORE_SLOT.LOGO_MASK,
  param: 0.3,
  metaPhase: 1.2,
  speed: 0.5,
  poolIndex: 42,
  animT: 3.5,
  motion: 1,
}

const at175 = applyTrustDevParticleControls(0.1, 0.2, 0.03, 0.5, 0.4, 0.8, ctx)
patchGenesisParticleControlConfig({ global: { intensity: 1 } })
const at100 = applyTrustDevParticleControls(0.1, 0.2, 0.03, 0.5, 0.4, 0.8, ctx)

patchGenesisParticleControlConfig({ transform: { x: 2, y: 0, z: 0 } })
const moved = applyTrustDevParticleControls(0, 0, 0, 0.5, 0.5, 0.5, ctx)

console.log(
  JSON.stringify(
    {
      storeIntensity: cfg.global.intensity,
      colorAt175: [at175.r, at175.g, at175.b],
      colorAt100: [at100.r, at100.g, at100.b],
      colorDeltaR: at175.r - at100.r,
      positionWithTransformX2: [moved.px, moved.py],
      devActive: process.env.NODE_ENV !== 'production',
    },
    null,
    2
  )
)
