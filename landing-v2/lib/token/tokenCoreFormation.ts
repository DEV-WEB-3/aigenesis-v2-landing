/**
 * Phase 20.5 — Genesis Token Economic Core formation.
 */
import { easeOutCubic } from '@/lib/trust/GenesisStardustFormation'
import { TOKEN_ROLE } from '@/lib/tokenGravityCore'

export const TOKEN_FORM_DURATION = 1.5

export function tokenCoreFormationProgress(elapsed: number): number {
  if (elapsed <= 0) return 0
  return Math.min(1, elapsed / TOKEN_FORM_DURATION)
}

export function tokenCoreActivation(formT: number): number {
  return easeOutCubic(Math.min(1, formT / 0.35))
}

export function tokenRingActivation(formT: number, ring: number, ringCount = 3): number {
  const start = 0.12 + ring * 0.12
  if (formT <= start) return 0
  return easeOutCubic(Math.min(1, (formT - start) / Math.max(0.24, 0.78 - start)))
}

export function tokenStreamActivation(formT: number, stream: number): number {
  const start = 0.22 + (stream % 5) * 0.05
  if (formT <= start) return 0
  return easeOutCubic(Math.min(1, (formT - start) / 0.38))
}

export function tokenHolderActivation(formT: number, node: number): number {
  const start = 0.38 + node * 0.06
  if (formT <= start) return 0
  return easeOutCubic(Math.min(1, (formT - start) / 0.34))
}

export function tokenFlowActivation(formT: number, link: number): number {
  const start = 0.48 + (link % 4) * 0.04
  if (formT <= start) return 0
  return easeOutCubic(Math.min(1, (formT - start) / 0.36))
}

export function tokenParticleFormationT(
  formT: number,
  role: number,
  ring: number,
  ringCount = 3
): number {
  if (role === TOKEN_ROLE.CORE || role === TOKEN_ROLE.AI) return tokenCoreActivation(formT)
  if (role === TOKEN_ROLE.STREAM) return tokenStreamActivation(formT, ring)
  if (role === TOKEN_ROLE.HOLDER) return tokenHolderActivation(formT, ring)
  if (role === TOKEN_ROLE.FLOW) return tokenFlowActivation(formT, ring)
  if (
    role === TOKEN_ROLE.ORBIT ||
    role === TOKEN_ROLE.INFALL ||
    role === TOKEN_ROLE.ESCAPE
  ) {
    return tokenRingActivation(formT, ring, ringCount)
  }
  return formT
}
