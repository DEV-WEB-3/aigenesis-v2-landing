/**
 * Phase 9.0 — Genesis Time Vault layout (viewBox 0–100).
 */

export const STAKING_VAULT_PULSE_S = 5
export const STAKING_VAULT_FORM_S = 1.4
export const STAKING_VAULT_CENTER = { x: 50, y: 52 } as const

export const STAKING_TIME_RINGS = [
  { id: 'period-6', y: 68, rx: 18, ry: 6.8, color: '#9D4DFF', pulseOffset: 0.12, label: '6+' },
  { id: 'permanence', y: 50, rx: 21, ry: 7.6, color: '#9D4DFF', pulseOffset: 0.28, label: 'On-chain' },
  { id: 'stability', y: 32, rx: 24, ry: 8.4, color: '#9D4DFF', pulseOffset: 0.44, label: 'Deflacionario' },
] as const

export function stakingLockStreamPath(index: number, total = 5): string {
  const cx = STAKING_VAULT_CENTER.x
  const spread = 11
  const x = cx + (index - (total - 1) / 2) * (spread / (total - 1))
  const yTop = 8
  const yCore = STAKING_VAULT_CENTER.y
  const bulge = (index % 2 === 0 ? 1 : -1) * 2.5
  const mx = (x + cx) / 2 + bulge
  const my = (yTop + yCore) / 2
  return `M${x},${yTop} Q${mx},${my} ${cx},${yCore}`
}

export function stakingOutflowPath(index: number): string {
  const cx = STAKING_VAULT_CENTER.x
  const x = cx + (index - 1) * 4.5
  return `M${cx},${STAKING_VAULT_CENTER.y + 6} Q${x},${78} ${x},${92}`
}

/** Shield contour — subtle protection outline. */
export function stakingShieldContourPath(): string {
  const cx = STAKING_VAULT_CENTER.x
  const cy = STAKING_VAULT_CENTER.y - 2
  return [
    `M${cx},${cy - 22}`,
    `Q${cx + 26},${cy - 18} ${cx + 24},${cy + 4}`,
    `Q${cx + 20},${cy + 26} ${cx},${cy + 32}`,
    `Q${cx - 20},${cy + 26} ${cx - 24},${cy + 4}`,
    `Q${cx - 26},${cy - 18} ${cx},${cy - 22}`,
    'Z',
  ].join(' ')
}
