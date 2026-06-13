import { TRUST_CORE_SPHERE } from './trustGenesisCoreLayout'

export interface TrustCoreLogoLayout {
  sizePercent: number
  sizeMaxPx: number
  offsetXPx: number
  offsetYPx: number
}

export const DEFAULT_TRUST_CORE_LOGO_LAYOUT: TrustCoreLogoLayout = {
  sizePercent: TRUST_CORE_SPHERE.SIZE_PERCENT,
  sizeMaxPx: TRUST_CORE_SPHERE.SIZE_MAX_PX,
  offsetXPx: TRUST_CORE_SPHERE.OFFSET_X_PX,
  offsetYPx: TRUST_CORE_SPHERE.OFFSET_Y_PX,
}

const STORAGE_KEY = 'aigenesis-v2-trust-core-logo-layout'

type Listener = () => void

let layout: TrustCoreLogoLayout = { ...DEFAULT_TRUST_CORE_LOGO_LAYOUT }
const listeners = new Set<Listener>()
let hydrated = false

function loadFromStorage(): TrustCoreLogoLayout | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<TrustCoreLogoLayout>
    return {
      sizePercent: clampNum(parsed.sizePercent, 8, 80, DEFAULT_TRUST_CORE_LOGO_LAYOUT.sizePercent),
      sizeMaxPx: clampNum(parsed.sizeMaxPx, 40, 400, DEFAULT_TRUST_CORE_LOGO_LAYOUT.sizeMaxPx),
      offsetXPx: clampNum(parsed.offsetXPx, -600, 600, DEFAULT_TRUST_CORE_LOGO_LAYOUT.offsetXPx),
      offsetYPx: clampNum(parsed.offsetYPx, -600, 600, DEFAULT_TRUST_CORE_LOGO_LAYOUT.offsetYPx),
    }
  } catch {
    return null
  }
}

function clampNum(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return Math.min(max, Math.max(min, value))
}

function persistLayout(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout))
  } catch {
    /* ignore quota */
  }
}

function notify(): void {
  listeners.forEach((fn) => fn())
}

export function hydrateTrustCoreLogoLayout(): void {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  const stored = loadFromStorage()
  if (stored) layout = stored
}

export function subscribeTrustCoreLogoLayout(listener: Listener): () => void {
  hydrateTrustCoreLogoLayout()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getTrustCoreLogoLayout(): TrustCoreLogoLayout {
  hydrateTrustCoreLogoLayout()
  return layout
}

export function patchTrustCoreLogoLayout(patch: Partial<TrustCoreLogoLayout>): void {
  layout = {
    sizePercent: patch.sizePercent ?? layout.sizePercent,
    sizeMaxPx: patch.sizeMaxPx ?? layout.sizeMaxPx,
    offsetXPx: patch.offsetXPx ?? layout.offsetXPx,
    offsetYPx: patch.offsetYPx ?? layout.offsetYPx,
  }
  persistLayout()
  notify()
}

export function resetTrustCoreLogoLayout(): void {
  layout = { ...DEFAULT_TRUST_CORE_LOGO_LAYOUT }
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }
  notify()
}

export function exportTrustCoreLogoLayoutSnippet(): string {
  const l = getTrustCoreLogoLayout()
  return `export const TRUST_CORE_SPHERE = {
  SIZE_PERCENT: ${Math.round(l.sizePercent * 100) / 100},
  SIZE_MAX_PX: ${Math.round(l.sizeMaxPx)},
  OFFSET_X_PX: ${Math.round(l.offsetXPx)},
  OFFSET_Y_PX: ${Math.round(l.offsetYPx)},
} as const`
}
