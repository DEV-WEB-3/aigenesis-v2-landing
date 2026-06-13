/** Particle role ids — leaf module (breaks Generator ↔ Morph circular import). */
export const TRUST_ROLE = {
  CORE: 0,
  HEX_INNER: 1,
  HEX_MID: 2,
  HEX_OUTER: 3,
  RADIAL: 4,
  NEURAL: 5,
  VALIDATION: 6,
  FLOW: 7,
  AURA: 8,
} as const

export type TrustRoleId = (typeof TRUST_ROLE)[keyof typeof TRUST_ROLE]
