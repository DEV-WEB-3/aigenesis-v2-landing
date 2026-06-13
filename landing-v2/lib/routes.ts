/**
 * Rutas y navegación — AiGenesis V2
 * Enlaces de producto alineados con https://aigenesis.io/ (escaneo oficial).
 */
import {
  AIG_TOKEN_CONTRACT,
  OFFICIAL_APP,
  OFFICIAL_BSCSCAN,
  OFFICIAL_DOWNLOADS,
  OFFICIAL_SITE,
  OFFICIAL_SOCIAL,
} from './official-links'

/** URL canónica — definir NEXT_PUBLIC_SITE_URL en Vercel producción */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? OFFICIAL_SITE

/** Rutas de página estáticas (App Router) */
export const PAGES = {
  HOME: '/',
  LEGAL: '/legal',
  WHITEPAPER: '/whitepaper',
} as const

/**
 * CTAs principales → portal oficial conect.aigenesis.io
 */
export const ROUTES = {
  HOME: PAGES.HOME,
  REGISTER: OFFICIAL_APP.REGISTER,
  LOGIN: OFFICIAL_APP.LOGIN,
  APP: OFFICIAL_APP.BASE,
  WHITEPAPER: PAGES.WHITEPAPER,
  LEGAL: PAGES.LEGAL,
  CONTACT: OFFICIAL_SOCIAL.EMAIL,
  LEGAL_ANCHOR: '#legal',
  BSCSCAN: OFFICIAL_BSCSCAN.TOKEN,
} as const

/** Secciones snap-scroll — orden narrativo (14 capítulos) */
export const SECTIONS = [
  { id: 'hero',        label: 'Hero',        navLabel: 'Inicio',      index: 0,  showInNav: false },
  { id: 'trust',       label: 'Trust',       navLabel: 'Confianza',   index: 1,  showInNav: true },
  { id: 'ecosistema',  label: 'Ecosistema',  navLabel: 'Ecosistema',  index: 2,  showInNav: true },
  { id: 'token',       label: 'Token',       navLabel: 'Token',       index: 3,  showInNav: true },
  { id: 'mining',      label: 'Mining',      navLabel: 'Mining',      index: 4,  showInNav: true },
  { id: 'booster',     label: 'Booster',     navLabel: 'Booster',     index: 5,  showInNav: true },
  { id: 'staking',     label: 'Staking',     navLabel: 'Staking',     index: 6,  showInNav: true },
  { id: 'gpulse',      label: 'G-Pulse',     navLabel: 'G-Pulse',     index: 7,  showInNav: true },
  { id: 'goracle',     label: 'G-Oracle',    navLabel: 'G-Oracle',    index: 8,  showInNav: true },
  { id: 'marketplace', label: 'Marketplace', navLabel: 'Marketplace', index: 9,  showInNav: true },
  { id: 'comunidad',   label: 'Comunidad',   navLabel: 'Comunidad',   index: 10, showInNav: true },
  { id: 'technology',  label: 'Tech',        navLabel: 'Tecnología',  index: 11, showInNav: true },
  { id: 'roadmap',     label: 'Roadmap',     navLabel: 'Roadmap',     index: 12, showInNav: true },
  { id: 'cta',         label: 'CTA',         navLabel: 'Únete',       index: 13, showInNav: false },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const TOTAL_SECTIONS = SECTIONS.length

/**
 * Enlaces externos oficiales.
 * Productos sin URL pública propia → login conect (como aigenesis.io).
 */
export const EXTERNAL_LINKS = {
  ...OFFICIAL_DOWNLOADS,
  BSCSCAN_CONTRACT: OFFICIAL_BSCSCAN.CONTRACT,
  BSCSCAN_TOKEN: OFFICIAL_BSCSCAN.TOKEN,
  AIG_TOKEN_CONTRACT,
  DOCS: OFFICIAL_DOWNLOADS.WHITEPAPER_PDF,
  APP: OFFICIAL_APP.BASE,
  MINING: OFFICIAL_APP.LOGIN,
  BOOSTER: OFFICIAL_APP.LOGIN,
  STAKING: OFFICIAL_APP.LOGIN,
  GPULSE_APP: OFFICIAL_APP.LOGIN,
  GORACLE: OFFICIAL_APP.LOGIN,
  MARKETPLACE: OFFICIAL_APP.LOGIN,
  ...OFFICIAL_SOCIAL,
} as const

export const NAV_LINKS = SECTIONS.filter((s) => s.showInNav)

export function getSectionIndex(id: string): number {
  const section = SECTIONS.find((s) => s.id === id)
  return section?.index ?? -1
}

export function getSectionId(index: number): SectionId | undefined {
  return SECTIONS[index]?.id
}

export function sectionHref(id: SectionId): string {
  return `#${id}`
}

export const IN_PAGE_ANCHORS = ['legal'] as const

export function resolveNavigationTarget(
  id: string
): { sectionIndex: number; anchorId?: string } | null {
  if (id === 'legal') {
    return { sectionIndex: getSectionIndex('cta'), anchorId: 'legal' }
  }
  const index = getSectionIndex(id)
  if (index >= 0) return { sectionIndex: index }
  return null
}

/** true para URLs absolutas que deben abrir en nueva pestaña */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith('mailto:')
}

export const PLACEHOLDERS = {
  siteUrl: {
    value: SITE_URL,
    env: 'NEXT_PUBLIC_SITE_URL',
    status: 'live' as const,
    note: 'Producción: https://aigenesis.io',
  },
  register: {
    value: ROUTES.REGISTER,
    status: 'live' as const,
    note: 'conect.aigenesis.io/SingUp',
  },
  login: {
    value: ROUTES.LOGIN,
    status: 'live' as const,
    note: 'conect.aigenesis.io/login',
  },
  contact: {
    value: ROUTES.CONTACT,
    status: 'live' as const,
    note: 'tokenaig@aigenesis.io',
  },
  whitepaper: {
    value: OFFICIAL_DOWNLOADS.WHITEPAPER_PDF,
    status: 'live' as const,
    note: 'PDF oficial aigtoken.io',
  },
  legal: {
    value: PAGES.LEGAL,
    status: 'staging_page' as const,
    note: 'Copy mínimo; legal review pendiente antes de producción',
  },
  bscscan: {
    value: OFFICIAL_BSCSCAN.TOKEN,
    status: 'live' as const,
    note: AIG_TOKEN_CONTRACT,
  },
  gpulseApp: {
    value: EXTERNAL_LINKS.GPULSE_APP,
    status: 'live' as const,
    note: 'Sin URL pública separada; acceso vía conect login',
  },
  social: {
    value: OFFICIAL_SOCIAL,
    status: 'live' as const,
    note: 'Handles oficiales G11 / AiGenesis',
  },
  metrics: {
    status: 'hardcoded' as const,
    note: 'Validar métricas con producto antes de producción',
    locations: [
      'Scene02_AigToken.tsx',
      'Scene03_GPulse.tsx',
      'Scene04_GevyShop.tsx',
      'Scene05_Community.tsx',
      'Scene06_Technology.tsx',
      'EcosystemSection.tsx',
    ],
  },
  analytics: {
    status: 'not_implemented' as const,
    note: 'Sin GA4 / Plausible / Vercel Analytics configurado',
  },
} as const
