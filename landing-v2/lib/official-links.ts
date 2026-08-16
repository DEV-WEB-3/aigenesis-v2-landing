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
  MARKETING_PLAN_ES:
    'https://aigenesis.io/wp-content/uploads/2026/06/AiGenesis_press_v5.0_ES-es.pdf',
  MARKETING_PLAN_EN:
    'https://aigenesis.io/wp-content/uploads/2026/06/AiGenesis_press_v5.0_EN-en.pdf',
  MARKETING_PLAN_PT:
    'https://aigenesis.io/wp-content/uploads/2026/06/AiGenesis_press_v5.0_PT-br.pdf',
  MARKETING_PLAN_FR:
    'https://aigenesis.io/wp-content/uploads/2026/06/AiGenesis_press_v5.0_FR-fr.pdf',
} as const

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
