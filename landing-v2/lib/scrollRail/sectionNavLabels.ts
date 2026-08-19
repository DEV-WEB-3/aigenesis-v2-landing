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
  /* El respaldo sale sin traducir a proposito: es una etiqueta que solo aparece
     si alguien añade una seccion sin darle nombre, y ahi el numero es lo unico
     que importa. Quien la llama la pasa igualmente por `t()`. */
  return SECTION_NAV_TOOLTIP_LABELS[index] ?? `Sección ${index + 1}`
}
