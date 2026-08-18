/**
 * URLs oficiales escaneadas de https://aigenesis.io/ (Jun 2026).
 * Fuente única para producción — sincronizar si el sitio legacy cambia.
 */
export const OFFICIAL_SITE = 'https://aigenesis.io' as const

/** Portal de producto (Mining, Booster, Staking, GPulse, etc.) */
export const OFFICIAL_APP = {
  BASE: 'https://conect.aigenesis.io/',
  REGISTER: 'https://conect.aigenesis.io/SingUp',
  LOGIN: 'https://conect.aigenesis.io/login',
} as const

export const AIG_TOKEN_CONTRACT = '0xC1F0768587Dc889e494C171B155C60B4e9a13F08' as const

export const OFFICIAL_BSCSCAN = {
  TOKEN: `https://bscscan.com/token/${AIG_TOKEN_CONTRACT}`,
  CONTRACT: `https://bscscan.com/address/${AIG_TOKEN_CONTRACT}`,
} as const

export const OFFICIAL_DOWNLOADS = {
  /**
   * SERVIDO DESDE AQUÍ, no desde aigtoken.io.
   *
   * El PDF vivía en `aigtoken.io/wp-content/...`, y ese dominio está previsto
   * para retirarse. Enlazarlo desde aquí significaba que apagar aigtoken.io
   * mataba en silencio el whitepaper de `/whitepaper` y el botón de
   * documentación de la sección Tecnología — una dependencia que no se ve
   * hasta que rompe.
   *
   * Copia byte a byte del original (1.535.729 bytes, 8 páginas, v1.1 de
   * febrero de 2024). Que la versión sea de 2024 es un hecho a resolver aparte:
   * la hoja de ruta de la landing llega a 2026 Q3.
   */
  WHITEPAPER_PDF: '/docs/aigenesis-whitepaper-v1.1.pdf',
  // Compatibilidad: la escena Roadmap enlaza el plan de marketing por este
  // nombre. Es EL MISMO archivo que la presentación oficial en español — se
  // deriva de `PRESS_V5` para que no haya dos copias de la misma URL.
  get MARKETING_PLAN_ES() {
    return PRESS_V5.es.archivo
  },
} as const

/**
 * PRENSA / PRESENTACIÓN OFICIAL v5.0 — fuente única.
 *
 * El mismo juego de archivos sirve dos cosas: el «plan de marketing» que enlaza
 * la escena Roadmap y las «presentaciones oficiales» del portal G11. Antes eran
 * dos listas con las mismas URLs escritas dos veces, y sólo cuatro idiomas.
 *
 * VERIFICADO EL 16-AGO-2026: las ocho responden 200 desde aigenesis.io, con
 * pesos entre 2,41 y 2,55 MB. Se enlazan y no se copian al repositorio porque
 * viven en el dominio de destino —aigenesis.io no se retira, a diferencia de
 * aigtoken.io—; pero es una dependencia externa y por eso está escrita: si algún
 * día esta aplicación sustituye al WordPress, hay que preservar `wp-content`
 * o mover los archivos ANTES, no después.
 *
 * Los pesos van medidos, no estimados: el portal los muestra para que nadie
 * descargue a ciegas con datos móviles.
 */
const BASE_PRESS = 'https://aigenesis.io/wp-content/uploads/2026/06/AiGenesis_press_v5.0'

export interface ArchivoPrensa {
  /** El idioma en su propia lengua — es como lo busca quien lo necesita. */
  nativo: string
  archivo: string
  mb: number
  /** `rtl` para árabe: la ficha se alinea al otro lado. */
  rtl?: boolean
}

export const PRESS_V5 = {
  es: { nativo: 'Español', archivo: `${BASE_PRESS}_ES-es.pdf`, mb: 2.51 },
  en: { nativo: 'English', archivo: `${BASE_PRESS}_EN-en.pdf`, mb: 2.49 },
  pt: { nativo: 'Português (BR)', archivo: `${BASE_PRESS}_PT-br.pdf`, mb: 2.55 },
  fr: { nativo: 'Français', archivo: `${BASE_PRESS}_FR-fr.pdf`, mb: 2.54 },
  ru: { nativo: 'Русский', archivo: `${BASE_PRESS}_RU-ru.pdf`, mb: 2.47 },
  sv: { nativo: 'Svenska', archivo: `${BASE_PRESS}_SUE-sv.pdf`, mb: 2.5 },
  hr: { nativo: 'Hrvatski', archivo: `${BASE_PRESS}_CRO-hr.pdf`, mb: 2.51 },
  ar: { nativo: 'العربية', archivo: `${BASE_PRESS}_ARA-ar.pdf`, mb: 2.41, rtl: true },
} as const satisfies Record<string, ArchivoPrensa>

export const OFFICIAL_SOCIAL = {
  EMAIL: 'mailto:tokenaig@aigenesis.io',
  TELEGRAM: 'https://t.me/AiGenesisComunity',
  DISCORD: 'https://discord.gg/jmUyUWP7Eq',
  X: 'https://x.com/G11Community',
  FACEBOOK: 'https://www.facebook.com/G11Community/',
  INSTAGRAM: 'https://www.instagram.com/aigenesisofficial',
  YOUTUBE: 'https://www.youtube.com/@G11Community?sub_confirmation=1',
  TIKTOK: 'https://tiktok.com/@genesisg11_',
} as const
