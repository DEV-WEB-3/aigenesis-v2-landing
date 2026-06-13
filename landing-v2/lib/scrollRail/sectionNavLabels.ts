/** Phase 18.0 — Premium section nav tooltip labels (orden snap 0–13). */
export const SECTION_NAV_TOOLTIP_LABELS = [
  'Hero',
  'Confianza',
  'Ecosistema',
  'Token',
  'Mining',
  'Booster',
  'Staking',
  'G-Pulse',
  'G-Oracle',
  'Marketplace',
  'Comunidad',
  'Tecnología',
  'Roadmap',
  'Portal Final',
] as const

export function sectionNavTooltipLabel(index: number): string {
  return SECTION_NAV_TOOLTIP_LABELS[index] ?? `Sección ${index + 1}`
}
