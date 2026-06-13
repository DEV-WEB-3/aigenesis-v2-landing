/**
 * Fuente única de métricas mostradas en la landing.
 * Validar con producto / datos on-chain antes de producción en aigenesis.io.
 */
export const METRICS_REVIEW_STATUS = 'pending_product_validation' as const

export type CounterMetric = {
  kind: 'counter'
  to: number
  suffix: string
  label: string
  decimals?: number
}

export type StaticMetric = {
  kind: 'static'
  value: string
  label: string
}

export type InstitutionalMetric = CounterMetric | StaticMetric

/** Trust — InstitutionalMetrics.tsx */
export const TRUST_INSTITUTIONAL_METRICS: readonly InstitutionalMetric[] = [
  { kind: 'counter', to: 100, suffix: 'K+', label: 'Comunidad' },
  { kind: 'counter', to: 12, suffix: '+', label: 'Países' },
  { kind: 'static', value: '2019', label: 'Fundado' },
  { kind: 'counter', to: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
] as const

/** Token — Scene02_AigToken */
export type TokenDisplayMetric =
  | { key: string; label: string; static: string }
  | { key: string; label: string; to: number; suffix: string }

export const TOKEN_DISPLAY_METRICS: readonly TokenDisplayMetric[] = [
  { key: 'price', label: 'PRECIO', static: '$0.0042' },
  { key: 'supply', label: 'SUPPLY TOTAL', to: 111, suffix: 'M' },
  { key: 'holders', label: 'HOLDERS', to: 2847, suffix: '+' },
  { key: 'network', label: 'NETWORK', static: 'BSC' },
] as const

/** G-Pulse — Scene03_GPulse */
export const GPULSE_STATS = [
  { to: 847, suffix: ' /día', label: 'SEÑALES DIARIAS' },
  { to: 3, suffix: ' activas', label: 'MESAS' },
  { to: 94, suffix: '%', label: 'UPTIME' },
] as const

/** Marketplace — Scene04_GevyShop */
export const MARKETPLACE_STATS = [
  { to: 500, suffix: 'K+', label: 'PRODUCTOS' },
  { to: 190, suffix: '+', label: 'PAÍSES' },
  { to: 3, suffix: '', label: 'MÉTODOS DE PAGO' },
] as const

/** Community — Scene05_Community */
export const COMMUNITY_STATS = [
  { to: 5000, suffix: '+', label: 'MIEMBROS ACTIVOS' },
  { to: 12, suffix: 'M USDT', label: 'DISTRIBUIDOS' },
  { to: 12, suffix: '+', label: 'PAÍSES' },
] as const

/** Technology — Scene06_Technology */
export const TECHNOLOGY_STATS = [
  { value: '99.9%', label: 'UPTIME' },
  { value: '< 200ms', label: 'LATENCIA' },
  { value: '24/7', label: 'MONITOREO' },
] as const

/** Mining — Scene03_Mining (badges, no animated counters) */
export const MINING_BADGES = [
  { value: '24h', label: 'Ciclo de emisión', mono: true, icon: 'cycle' as const },
  { value: 'On-chain', label: 'Trazabilidad', mono: false, icon: 'chain' as const },
  { value: 'BSC', label: 'Red', mono: true, icon: 'network' as const },
] as const
