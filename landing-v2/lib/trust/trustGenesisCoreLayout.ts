/** Phase 17.0 — Trust Genesis Core timing + DOM layout. */

export const TRUST_CORE_PULSE_S = 4
export const TRUST_GENESIS_WAVE_S = 6
export const TRUST_FLOW_ORBIT_S = 28

export const TRUST_CORE_COLOR = '#FF00C8'

export const TRUST_CORE_SPHERE = {
  SIZE_PERCENT: 72,
  SIZE_MAX_PX: 170,
  OFFSET_X_PX: -28,
  OFFSET_Y_PX: -217,
} as const

export const TRUST_QUANTUM_RING = {
  outer: { radius: 46, duration: 52, opacity: 0.12 },
  middle: { radius: 36, duration: 40, opacity: 0.07 },
  inner: { radius: 26, duration: 32, opacity: 0.04 },
} as const

export const TRUST_DEPTH_TIER = {
  SMALL: 0,
  MEDIUM: 1,
  BRIGHT: 2,
  SMALL_SHARE: 0.7,
  MEDIUM_SHARE: 0.2,
  BRIGHT_SHARE: 0.1,
} as const
