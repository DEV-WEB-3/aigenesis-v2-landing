/**
 * Phase 4.3 — Runtime budget recovery.
 * Normalizes particle allocation so every tier fits exactly with guaranteed minimums.
 */
import { TRUST_PARTICLE_COUNTS, type TrustPerfTier } from './trust-performance'

/** Share caps / floors — identical ratios at every tier. */
export const TRUST_BUDGET_LOGO_MAX_RATIO = 0.65
export const TRUST_BUDGET_NEURAL_MIN_RATIO = 0.08
export const TRUST_BUDGET_VALIDATION_MIN_RATIO = 0.05
export const TRUST_BUDGET_FLOW_MIN_RATIO = 0.06
export const TRUST_BUDGET_BRIDGES_MIN_RATIO = 0.08
export const TRUST_BUDGET_AURA_MIN_RATIO = 0.03

/** Stardust logo slice — duplicated here to avoid circular imports with GenesisStardustEntity. */
const STARDUST_LOGO_SLICE = {
  MASK: 0.88,
  HALO: 0.06,
  FOG: 0.04,
  NUCLEUS_SHARE: 0.022,
} as const

function stardustNucleusCount(total: number): number {
  const logoMax = Math.floor(total * TRUST_BUDGET_LOGO_MAX_RATIO)
  return Math.max(8, Math.floor(logoMax * STARDUST_LOGO_SLICE.NUCLEUS_SHARE))
}

export interface TrustIdentityBudget {
  logoMask: number
  logoHalo: number
  logoFog: number
  logoNucleus: number
  coreVolume: number
  coreRing: number
  secondary: number
  volumetric: number
  hexInner: number
  hexMid: number
  hexOuter: number
  radial: number
  neural: number
  validation: number
  flow: number
  outerAura: number
  total: number
}

export type TrustBudgetSlot =
  | 'logoMask'
  | 'logoHalo'
  | 'logoFog'
  | 'logoNucleus'
  | 'coreVolume'
  | 'coreRing'
  | 'secondary'
  | 'hexInner'
  | 'hexMid'
  | 'hexOuter'
  | 'radial'
  | 'neural'
  | 'validation'
  | 'flow'
  | 'volumetric'
  | 'outerAura'

/** Generator fill order — matches layer priority (Phase 4.3). */
export const TRUST_BUDGET_FILL_ORDER: readonly TrustBudgetSlot[] = [
  'logoMask',
  'logoNucleus',
  'logoHalo',
  'logoFog',
  'coreVolume',
  'coreRing',
  'secondary',
  'hexInner',
  'hexMid',
  'hexOuter',
  'radial',
  'neural',
  'validation',
  'flow',
  'volumetric',
  'outerAura',
] as const

function computeLogoIdentitySlice(total: number): {
  logoMask: number
  logoHalo: number
  logoFog: number
} {
  if (total >= 1500) {
    return {
      logoMask: Math.max(900, Math.floor(total * 0.5)),
      logoHalo: Math.max(250, Math.floor(total * 0.14)),
      logoFog: Math.max(150, Math.floor(total * 0.083)),
    }
  }
  if (total >= 900) {
    return {
      logoMask: Math.max(550, Math.floor(total * 0.52)),
      logoHalo: Math.max(165, Math.floor(total * 0.16)),
      logoFog: Math.max(100, Math.floor(total * 0.085)),
    }
  }
  return {
    logoMask: Math.max(280, Math.floor(total * 0.55)),
    logoHalo: Math.max(80, Math.floor(total * 0.25)),
    logoFog: Math.max(50, Math.floor(total * 0.1)),
  }
}

function scaleLogoToCap(
  raw: { logoMask: number; logoHalo: number; logoFog: number },
  logoMax: number,
  total: number
): { logoMask: number; logoHalo: number; logoFog: number; nucleus: number } {
  const nucleus = Math.min(stardustNucleusCount(total), Math.floor(logoMax * STARDUST_LOGO_SLICE.NUCLEUS_SHARE))
  const bodyMax = logoMax - nucleus
  let logoMask = Math.floor(bodyMax * STARDUST_LOGO_SLICE.MASK)
  let logoHalo = Math.floor(bodyMax * STARDUST_LOGO_SLICE.HALO)
  let logoFog = bodyMax - logoMask - logoHalo
  if (logoFog < 0) {
    logoFog = 0
    logoHalo = Math.max(0, bodyMax - logoMask)
  }
  const rawSum = raw.logoMask + raw.logoHalo + raw.logoFog
  if (rawSum > bodyMax) {
    logoMask = Math.min(logoMask, Math.floor((raw.logoMask / rawSum) * bodyMax))
    logoHalo = Math.min(logoHalo, Math.floor((raw.logoHalo / rawSum) * bodyMax))
    logoFog = Math.max(0, bodyMax - logoMask - logoHalo)
  }
  return { logoMask, logoHalo, logoFog, nucleus }
}

function sumBudget(b: Omit<TrustIdentityBudget, 'total'>): number {
  return (
    b.logoMask +
    b.logoHalo +
    b.logoFog +
    b.logoNucleus +
    b.coreVolume +
    b.coreRing +
    b.secondary +
    b.volumetric +
    b.hexInner +
    b.hexMid +
    b.hexOuter +
    b.radial +
    b.neural +
    b.validation +
    b.flow +
    b.outerAura
  )
}

function bumpField(b: TrustIdentityBudget, slot: TrustBudgetSlot, delta = 1): void {
  b[slot] += delta
}

function trimField(b: TrustIdentityBudget, slot: TrustBudgetSlot, delta = 1): boolean {
  if (b[slot] <= 0) return false
  b[slot] -= delta
  return true
}

/** Normalize to exactly `total` while respecting floors on dynamic layers. */
function normalizeBudget(b: TrustIdentityBudget, total: number): TrustIdentityBudget {
  const floors: Partial<Record<TrustBudgetSlot, number>> = {
    neural: Math.floor(total * TRUST_BUDGET_NEURAL_MIN_RATIO),
    validation: Math.floor(total * TRUST_BUDGET_VALIDATION_MIN_RATIO),
    flow: Math.floor(total * TRUST_BUDGET_FLOW_MIN_RATIO),
    radial: Math.floor(total * TRUST_BUDGET_BRIDGES_MIN_RATIO),
  }
  const auraFloor = Math.floor(total * TRUST_BUDGET_AURA_MIN_RATIO)

  let allocated = sumBudget(b)
  const trimOrder: TrustBudgetSlot[] = [
    'outerAura',
    'volumetric',
    'secondary',
    'coreRing',
    'hexOuter',
    'hexMid',
    'hexInner',
    'logoFog',
    'logoHalo',
  ]
  const bumpOrder: TrustBudgetSlot[] = [
    'hexOuter',
    'hexMid',
    'hexInner',
    'neural',
    'radial',
    'validation',
    'flow',
    'volumetric',
    'outerAura',
  ]

  while (allocated > total) {
    let trimmed = false
    for (const slot of trimOrder) {
      const floor =
        slot === 'neural' ||
        slot === 'validation' ||
        slot === 'flow' ||
        slot === 'radial'
          ? floors[slot] ?? 0
          : slot === 'volumetric' || slot === 'outerAura'
            ? 0
            : 0
      if (b[slot] > floor && trimField(b, slot)) {
        allocated--
        trimmed = true
        break
      }
    }
    if (!trimmed) break
  }

  while (allocated < total) {
    let bumped = false
    for (const slot of bumpOrder) {
      bumpField(b, slot)
      allocated++
      bumped = true
      break
    }
    if (!bumped) break
  }

  const auraTotal = b.volumetric + b.outerAura
  if (auraTotal < auraFloor) {
    const need = auraFloor - auraTotal
    b.volumetric += need
    allocated += need
    while (allocated > total && trimField(b, 'hexOuter')) allocated--
    while (allocated > total && trimField(b, 'hexMid')) allocated--
    while (allocated > total && trimField(b, 'hexInner')) allocated--
  }

  b.total = total
  return b
}

/**
 * Phase 5.2 — morph budget: logo + shield layers, no neural lattice.
 */
export function computeTrustMorphBudget(total: number): TrustIdentityBudget {
  const logoMax = Math.floor(total * TRUST_BUDGET_LOGO_MAX_RATIO)
  const logo = scaleLogoToCap(computeLogoIdentitySlice(total), logoMax, total)

  const neural = 0
  const validation = Math.max(8, Math.floor(total * 0.02))
  const flow = Math.max(8, Math.floor(total * 0.02))
  const radial = Math.max(24, Math.floor(total * 0.1))
  const auraMin = Math.max(12, Math.floor(total * 0.025))

  const reserved =
    logo.logoMask +
    logo.logoHalo +
    logo.logoFog +
    logo.nucleus +
    neural +
    validation +
    flow +
    radial +
    auraMin

  let remaining = Math.max(0, total - reserved)

  let coreRing = Math.min(Math.floor(total * 0.008), Math.max(0, Math.floor(remaining * 0.05)))
  remaining -= coreRing
  let secondary = Math.min(Math.floor(total * 0.012), Math.max(0, Math.floor(remaining * 0.06)))
  remaining -= secondary

  const hexInner = Math.floor(remaining * 0.36)
  const hexMid = Math.floor(remaining * 0.34)
  const hexOuter = Math.max(0, remaining - hexInner - hexMid)

  const volumetric = Math.floor(auraMin * 0.65)
  const outerAura = auraMin - volumetric

  return normalizeBudget(
    {
      logoMask: logo.logoMask,
      logoHalo: logo.logoHalo,
      logoFog: logo.logoFog,
      logoNucleus: logo.nucleus,
      coreVolume: 0,
      coreRing,
      secondary,
      volumetric,
      hexInner,
      hexMid,
      hexOuter,
      radial,
      neural,
      validation,
      flow,
      outerAura,
      total,
    },
    total
  )
}

/**
 * Phase 4.3 normalized budget — sum always equals `total`.
 * Logo ≤ 65% · neural / validation / flow / bridges / aura guaranteed floors.
 */
export function computeTrustIdentityBudget(total: number): TrustIdentityBudget {
  const logoMax = Math.floor(total * TRUST_BUDGET_LOGO_MAX_RATIO)
  const logo = scaleLogoToCap(computeLogoIdentitySlice(total), logoMax, total)

  const neural = Math.floor(total * TRUST_BUDGET_NEURAL_MIN_RATIO)
  const validation = Math.floor(total * TRUST_BUDGET_VALIDATION_MIN_RATIO)
  const flow = Math.floor(total * TRUST_BUDGET_FLOW_MIN_RATIO)
  const radial = Math.floor(total * TRUST_BUDGET_BRIDGES_MIN_RATIO)
  const auraMin = Math.floor(total * TRUST_BUDGET_AURA_MIN_RATIO)

  const reserved =
    logo.logoMask +
    logo.logoHalo +
    logo.logoFog +
    logo.nucleus +
    neural +
    validation +
    flow +
    radial +
    auraMin

  let remaining = Math.max(0, total - reserved)

  let coreRing = Math.min(Math.floor(total * 0.008), Math.max(0, Math.floor(remaining * 0.05)))
  remaining -= coreRing
  let secondary = Math.min(Math.floor(total * 0.016), Math.max(0, Math.floor(remaining * 0.08)))
  remaining -= secondary

  const hexInner = Math.floor(remaining * 0.34)
  const hexMid = Math.floor(remaining * 0.33)
  const hexOuter = Math.max(0, remaining - hexInner - hexMid)

  const volumetric = Math.floor(auraMin * 0.72)
  const outerAura = auraMin - volumetric

  const budget = normalizeBudget(
    {
      logoMask: logo.logoMask,
      logoHalo: logo.logoHalo,
      logoFog: logo.logoFog,
      logoNucleus: logo.nucleus,
      coreVolume: 0,
      coreRing,
      secondary,
      volumetric,
      hexInner,
      hexMid,
      hexOuter,
      radial,
      neural,
      validation,
      flow,
      outerAura,
      total,
    },
    total
  )

  return budget
}

export interface TrustBudgetSlotReport {
  slot: TrustBudgetSlot
  allocated: number
  rendered: number
  dropped: number
}

export interface TrustTierAllocationReport {
  tier: TrustPerfTier
  total: number
  slots: TrustBudgetSlotReport[]
  logoTotal: number
  logoPercent: number
  dynamicTotal: number
  sumAllocated: number
  sumRendered: number
  sumDropped: number
}

/** Simulate generator fill with buffer cap — rendered vs dropped per slot. */
export function simulateTrustBudgetRender(
  budget: TrustIdentityBudget,
  total: number
): TrustBudgetSlotReport[] {
  let idx = 0
  return TRUST_BUDGET_FILL_ORDER.map((slot) => {
    const allocated = budget[slot]
    const room = Math.max(0, total - idx)
    const rendered = Math.min(allocated, room)
    const dropped = allocated - rendered
    idx += allocated
    return { slot, allocated, rendered, dropped }
  })
}

export function buildTrustAllocationReport(
  totals: readonly number[] = [
    TRUST_PARTICLE_COUNTS.high,
    TRUST_PARTICLE_COUNTS.medium,
    TRUST_PARTICLE_COUNTS.low,
  ]
): TrustTierAllocationReport[] {
  const tierNames: TrustPerfTier[] = ['high', 'medium', 'low']
  return totals.map((total, i) => {
    const budget = computeTrustIdentityBudget(total)
    const slots = simulateTrustBudgetRender(budget, total)
    const logoTotal = budget.logoMask + budget.logoHalo + budget.logoFog
    const dynamicTotal =
      budget.radial + budget.neural + budget.validation + budget.flow
    return {
      tier: tierNames[i] ?? 'high',
      total,
      slots,
      logoTotal,
      logoPercent: (logoTotal / total) * 100,
      dynamicTotal,
      sumAllocated: slots.reduce((s, r) => s + r.allocated, 0),
      sumRendered: slots.reduce((s, r) => s + r.rendered, 0),
      sumDropped: slots.reduce((s, r) => s + r.dropped, 0),
    }
  })
}

/** Legacy Phase 4.2 overflow budget — for before/after reports only. */
export function computeLegacyOverflowBudget(total: number): TrustIdentityBudget {
  const logo = computeLogoIdentitySlice(total)
  let logoMask = logo.logoMask
  let logoHalo = logo.logoHalo
  let logoFog = logo.logoFog
  const coreVolume = 0
  const coreRing = Math.floor(total * 0.008)
  const secondary = Math.floor(total * 0.016)
  let volumetric = Math.floor(total * 0.058)
  const hexInner = Math.floor(total * 0.066)
  const hexMid = Math.floor(total * 0.07)
  let hexOuter = Math.floor(total * 0.074)
  let radial = Math.floor(total * 0.078)
  let neural = Math.floor(total * 0.102)
  let validation = Math.floor(total * 0.052)
  let flow = Math.floor(total * 0.092)

  let allocated =
    logoMask +
    logoHalo +
    logoFog +
    coreVolume +
    coreRing +
    secondary +
    volumetric +
    hexInner +
    hexMid +
    hexOuter +
    radial +
    neural +
    validation +
    flow

  const bump = [
    () => { neural++ },
    () => { flow++ },
    () => { radial++ },
    () => { validation++ },
    () => { volumetric++ },
    () => { hexOuter++ },
    () => { neural++ },
    () => { flow++ },
  ]
  let j = 0
  while (allocated < total) {
    bump[j++ % bump.length]()
    allocated++
  }

  return {
    logoMask,
    logoHalo,
    logoFog,
    logoNucleus: 0,
    coreVolume,
    coreRing,
    secondary,
    volumetric,
    hexInner,
    hexMid,
    hexOuter,
    radial,
    neural,
    validation,
    flow,
    outerAura: Math.max(0, total - allocated),
    total,
  }
}

export function formatTrustAllocationReport(reports: TrustTierAllocationReport[]): string {
  const lines: string[] = ['Trust Shield Allocation Report (Phase 4.3)', '']
  for (const r of reports) {
    lines.push(`=== ${r.tier.toUpperCase()} (${r.total}) ===`)
    lines.push(`Logo: ${r.logoTotal} (${r.logoPercent.toFixed(1)}%) · Dynamic: ${r.dynamicTotal}`)
    lines.push(`Allocated: ${r.sumAllocated} · Rendered: ${r.sumRendered} · Dropped: ${r.sumDropped}`)
    lines.push('')
    for (const s of r.slots) {
      if (s.allocated === 0 && s.rendered === 0) continue
      lines.push(
        `  ${s.slot.padEnd(12)} alloc=${String(s.allocated).padStart(4)}  rendered=${String(s.rendered).padStart(4)}  dropped=${String(s.dropped).padStart(4)}`
      )
    }
    lines.push('')
  }
  return lines.join('\n')
}
