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

/**
 * Secciones snap-scroll — orden narrativo (14 capítulos).
 *
 * El ORDEN de este array es la única definición del orden de la página. El
 * índice no se escribe: se deriva de la posición (ver `SECTIONS` abajo). Antes
 * venía anotado a mano junto a cada entrada, que es una segunda copia del mismo
 * dato — reordenar el array sin tocar los números dejaba todo desalineado en
 * silencio.
 */
const SECTION_DEFS = [
  { id: 'hero',        label: 'Hero',        navLabel: 'Inicio',      showInNav: false },
  { id: 'trust',       label: 'Trust',       navLabel: 'Confianza',   showInNav: true },
  { id: 'ecosistema',  label: 'Ecosistema',  navLabel: 'Ecosistema',  showInNav: true },
  { id: 'token',       label: 'Token',       navLabel: 'Token',       showInNav: true },
  { id: 'mining',      label: 'Mining',      navLabel: 'Mining',      showInNav: true },
  { id: 'booster',     label: 'Booster',     navLabel: 'Booster',     showInNav: true },
  { id: 'staking',     label: 'Staking',     navLabel: 'Staking',     showInNav: true },
  { id: 'gpulse',      label: 'G-Pulse',     navLabel: 'G-Pulse',     showInNav: true },
  { id: 'goracle',     label: 'G-Oracle',    navLabel: 'G-Oracle',    showInNav: true },
  { id: 'marketplace', label: 'Marketplace', navLabel: 'Marketplace', showInNav: true },
  { id: 'comunidad',   label: 'Comunidad',   navLabel: 'Comunidad',   showInNav: true },
  { id: 'technology',  label: 'Tech',        navLabel: 'Tecnología',  showInNav: true },
  { id: 'roadmap',     label: 'Roadmap',     navLabel: 'Roadmap',     showInNav: true },
  { id: 'cta',         label: 'CTA',         navLabel: 'Únete',       showInNav: false },
] as const

export type SectionId = (typeof SECTION_DEFS)[number]['id']

export type Section = {
  id: SectionId
  label: string
  navLabel: string
  showInNav: boolean
  index: number
}

export const SECTIONS: readonly Section[] = SECTION_DEFS.map((s, index) => ({
  ...s,
  index,
}))

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

/**
 * Las cinco cabezas del menú.
 *
 * POR QUE EXISTEN
 * El menú tenía DOCE entradas planas para catorce secciones, que es lo que pasa
 * cuando cada capítulo nuevo se añade al menú porque no hay dónde meterlo. La
 * página se escribió como siete capítulos y creció a catorce; los rótulos
 * «Sección 02/05/06/07» que quedaban en pantalla eran el fósil de esa versión.
 *
 * Recortar a cinco BORRANDO siete no arregla nada: esconde contenido que
 * existe. Lo que faltaba era un piso intermedio. Cada cabeza es un tema, salta
 * a su primera sección y despliega las suyas — se lee cinco, se llega a doce.
 *
 * Y este agrupamiento es además el contenedor de lo que viene: Mercados,
 * Utilidad y Tokenomics entran bajo `token`; G11 bajo `comunidad`. Sin estos
 * huecos volverían a ser tres entradas planas más, y el menú tendría quince.
 *
 * `Inteligencia` va aparte de `Ecosistema` a propósito: G-Pulse y G-Oracle son
 * la capa de IA, que es lo que separa este proyecto de cualquier otro con
 * mining y staking. Enterrarla entre los productos es regalar el argumento.
 * `Tecnología` y `Roadmap` van bajo `Confianza` porque su contenido real es
 * prueba —verificación del contrato, hitos cumplidos—, no producto.
 */
export const NAV_GROUPS = [
  {
    id: 'ecosistema',
    label: 'Ecosistema',
    ancla: 'ecosistema',
    hijos: ['ecosistema', 'mining', 'booster', 'staking', 'marketplace'],
  },
  { id: 'inteligencia', label: 'Inteligencia', ancla: 'gpulse', hijos: ['gpulse', 'goracle'] },
  { id: 'token', label: 'Token', ancla: 'token', hijos: ['token'] },
  { id: 'confianza', label: 'Confianza', ancla: 'trust', hijos: ['trust', 'technology', 'roadmap'] },
  { id: 'comunidad', label: 'Comunidad', ancla: 'comunidad', hijos: ['comunidad'] },
] as const satisfies readonly {
  id: string
  label: string
  ancla: SectionId
  hijos: readonly SectionId[]
}[]

/**
 * GUARDA: ninguna sección del menú puede quedarse fuera de una cabeza.
 *
 * Corre al evaluar el módulo, o sea durante el build. Si alguien añade una
 * sección con `showInNav: true` y no la mete en un grupo, el build FALLA
 * nombrándola — en vez de desplegarse con una sección inalcanzable desde el
 * menú, que es un fallo que nadie nota porque no rompe nada.
 *
 * Cubre los dos lados: la que falta y la que sobra o está repetida.
 *
 * Probada rompiéndola: al sacar `roadmap` de `confianza`, el build cae con
 * «sin cabeza: roadmap»; al ponerlo también en `token`, cae con «en dos
 * cabezas: roadmap».
 */
const _hijosDeclarados = NAV_GROUPS.flatMap((g) => g.hijos as readonly SectionId[])
const _repetidos = _hijosDeclarados.filter((id, i) => _hijosDeclarados.indexOf(id) !== i)
const _sinCabeza = NAV_LINKS.filter((s) => !_hijosDeclarados.includes(s.id)).map((s) => s.id)
const _sobran = _hijosDeclarados.filter((id) => !NAV_LINKS.some((s) => s.id === id))

if (_sinCabeza.length || _repetidos.length || _sobran.length) {
  throw new Error(
    [
      'NAV_GROUPS no cubre exactamente las secciones del menú.',
      _sinCabeza.length ? `  sin cabeza: ${_sinCabeza.join(', ')}` : '',
      // `[...new Set()]` necesita downlevelIteration con el target de este
      // proyecto; filtrar por índice hace lo mismo sin tocar el tsconfig.
      _repetidos.length
        ? `  en dos cabezas: ${_repetidos.filter((id, i) => _repetidos.indexOf(id) === i).join(', ')}`
        : '',
      _sobran.length ? `  no van en el menú: ${_sobran.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n')
  )
}

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
    note: 'PDF servido desde /docs — ya no depende de aigtoken.io',
  },
  legal: {
    value: PAGES.LEGAL,
    status: 'staging_page' as const,
    note: 'Contacto oficial tokenaig@aigenesis.io; revisión legal completa pendiente',
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
    status: 'centralized' as const,
    note: 'Valores en lib/institutionalMetrics.ts — validar con producto antes de producción',
    registry: 'lib/institutionalMetrics.ts',
    reviewFlag: 'METRICS_REVIEW_STATUS',
  },
  analytics: {
    status: 'vercel_analytics' as const,
    note: 'Vercel Analytics + Speed Insights activos; GA4 opcional vía NEXT_PUBLIC_GA_MEASUREMENT_ID',
  },
} as const
