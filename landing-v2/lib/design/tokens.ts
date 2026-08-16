/**
 * FUNDACIÓN — origen único de la identidad Genesis.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO
 * ---------------------------
 * Antes convivían TRES sistemas de color y el que mandaba no era el declarado:
 *
 *   tailwind.config.ts .... 17 nombres (4 sin usar, 5 alias del mismo color)
 *   componentes .tsx ...... hex a fuego
 *   globals.css ........... más hex + 564 literales rgba()
 *
 *   → 50 colores distintos en 372 apariciones.
 *
 * Y medido contra el logo de la marca, el color escrito a fuego resultó estar
 * MÁS alineado que el token declarado: `#FF00C8` (63 usos, a fuego) cae dentro
 * de la banda de tono del logo, mientras `#E91E8B` (el token oficial) queda 15°
 * fuera. El sistema documentaba a posteriori lo que el componente ya había
 * decidido por su cuenta.
 *
 * Este archivo invierte esa autoridad.
 *
 * EL PRINCIPIO: VACÍO INMENSO, ESTRELLAS DENTRO
 * ---------------------------------------------
 * El fondo oscuro no es un fondo: es el vacío. Los colores no son relleno: son
 * emisión. Medido sobre tres secciones renderizadas, esto ya se cumplía con una
 * constancia notable, y es la parte de la identidad que ya estaba resuelta:
 *
 *   vacío (luma < 0.14) ...... 89–91%
 *   neutro (texto, líneas) ....  2–5%
 *   color (la emisión) ....... 6,5–7,5%
 *
 * Cualquier superficie nueva se mide contra ese presupuesto ANTES de entrar.
 */

/* ────────────────────────  el vacío  ──────────────────────── */

/**
 * Neutros con sesgo azul, no grises puros. Un gris neutro se lee como
 * "sin decidir"; estos comparten familia con la marca y se leen como elegidos.
 */
export const VOID = {
  /** El vacío absoluto. Fondo de página. */
  black: '#02040A',
  /** Base de sección. */
  base: '#080A14',
  /** Superficie elevada (tarjetas, paneles). */
  surface: '#0F111C',
  /** Superficie sobre superficie. */
  raised: '#161A2B',
} as const

export const INK = {
  /** Texto principal. */
  base: '#F8FAFC',
  /** Texto secundario. */
  muted: '#AAB4C8',
  /** Texto terciario, metadatos. */
  faint: '#5C6B82',
} as const

/* ─────────────────────  la emisión  ───────────────────────── */

/**
 * Los seis colores de marca. Cada valor es el que YA se renderiza y que cae
 * dentro de la banda de tono del logo — no se han inventado colores nuevos:
 * se ha canonizado el que estaba funcionando y se han retirado sus derivas.
 *
 * Las derivas retiradas eran erratas, no decisiones:
 *   #9D4DFF vs #9B4DFF ... diferencia 0° de tono, 0% de luz, 0% de saturación
 *   #FF4DDB vs #FF2EDB ... 2° de tono
 *   #00F5FF vs #00E5FF ... 4° de tono
 */
export const EMISSION = {
  /** Azul base. Banda más pesada del logo (16,4%). Estructura. */
  blue: '#2962FF',
  /** Azul de realce. */
  blueHi: '#3D8BFF',
  /** Violeta puente. */
  violet: '#6E56CF',
  /** Violeta firma. */
  violetHi: '#9D4DFF',
  /** Magenta acento. Dentro de la banda del logo; sustituye a #E91E8B. */
  magenta: '#FF00C8',
  /** Magenta de realce. */
  magentaHi: '#FF4DDB',
  /**
   * Cian detalle. NO aparece en el degradado principal del logo, pero sí en su
   * conjunto (5,0% medido) y en el sitio (5,1%): es el único color que ya
   * estaba perfectamente alineado. Se conserva como DETALLE — nunca como
   * primario, nunca como fondo de superficie.
   */
  cyan: '#00F5FF',
} as const

/* ─────────────────  estado, fuera de la marca  ────────────── */

/**
 * Señales de estado. Deliberadamente FUERA del espacio de marca.
 *
 * El verde estaba declarado como color de marca y no lo es: medido, aparece en
 * un 0,7% de la pantalla y sólo dentro de una insignia de "verificado". Nunca
 * fue identidad — era una señal. Aquí queda nombrado como lo que es, y así no
 * puede volver a colarse en una composición.
 */
export const STATE = {
  success: '#2FD07F',
  warning: '#E6B450',
  error: '#E85D5D',
  /** Informativo: reutiliza la marca a propósito, no inventa un azul nuevo. */
  info: EMISSION.blueHi,
} as const

/* ──────────────  presupuesto de presencia  ────────────────── */

/**
 * Cuánto de cada cosa puede haber en pantalla. Esto NO es una guía de estilo:
 * es un objetivo verificable. Se mide rasterizando la pantalla y agrupando los
 * píxeles por tono, igual que se midió el logo.
 *
 * `logo` es la referencia medida sobre el logo oficial.
 * `actual` es lo que daban las secciones antes de alinear.
 */
export const PRESENCE = {
  /** Proporción de la pantalla, no del color. */
  screen: { voidMin: 0.89, voidMax: 0.91, chroma: [0.065, 0.075] as const },
  /** Reparto DENTRO del color. Suma ≈ 1. */
  chroma: {
    blue: { logo: 0.588, actual: 0.423, action: 'subir' },
    violet: { logo: 0.272, actual: 0.489, action: 'bajar' },
    magenta: { logo: 0.089, actual: 0.030, action: 'subir' },
    cyan: { logo: 0.050, actual: 0.051, action: 'mantener' },
    green: { logo: 0.0, actual: 0.007, action: 'retirar' },
  },
} as const

/* ────────────────────  escala tipográfica  ────────────────── */

/**
 * Escala real y continua. La anterior tenía seis tamaños con nombre, unos
 * fluidos (`clamp`) y otros fijos en `rem`, con saltos sin nada en medio — y
 * `display-xl` no lo usaba nadie.
 *
 * Todos fluidos, misma razón entre pasos, para que no haya que elegir entre
 * "el que se pasa" y "el que se queda corto".
 */
export const TYPE = {
  scale: {
    xs: 'clamp(0.72rem, 0.70rem + 0.10vw, 0.78rem)',
    sm: 'clamp(0.84rem, 0.81rem + 0.14vw, 0.92rem)',
    base: 'clamp(1.00rem, 0.96rem + 0.18vw, 1.09rem)',
    md: 'clamp(1.19rem, 1.13rem + 0.28vw, 1.34rem)',
    lg: 'clamp(1.41rem, 1.32rem + 0.44vw, 1.66rem)',
    xl: 'clamp(1.68rem, 1.54rem + 0.68vw, 2.05rem)',
    '2xl': 'clamp(2.00rem, 1.79rem + 1.03vw, 2.53rem)',
    '3xl': 'clamp(2.38rem, 2.07rem + 1.53vw, 3.13rem)',
    '4xl': 'clamp(2.83rem, 2.39rem + 2.22vw, 3.87rem)',
    '5xl': 'clamp(3.36rem, 2.73rem + 3.17vw, 4.78rem)',
  },
  /** Interlineado por rango: los titulares se aprietan, el cuerpo respira. */
  leading: { tight: 1.06, snug: 1.18, normal: 1.6, relaxed: 1.72 },
  tracking: { tight: '-0.02em', normal: '0', wide: '0.08em', wider: '0.18em' },
} as const

/* ─────────────────  espacio y superficie  ─────────────────── */

/** Escala de espaciado. Índices, no píxeles sueltos por el código. */
export const SPACE = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const

export const RADIUS = { sm: 8, md: 12, lg: 18, xl: 26, pill: 999 } as const

/**
 * Presupuesto de cristal por pantalla.
 *
 * `backdrop-filter` obliga a recomponer todo lo que hay detrás en cada pintado.
 * No es una preferencia estética: es coste de pintado medible. Pocas
 * superficies, grandes; el resto opaco.
 */
export const GLASS = { blur: { soft: 12, base: 18, heavy: 32 }, budgetPerScreen: 6 } as const

/* ─────────────────  mapa de migración  ────────────────────── */

/**
 * Los 50 colores sueltos y su destino. Lo consume el barrido automático: hacerlo
 * a mano garantiza olvidarse de alguno, y ya pasó — así aparecieron #9B4DFF y
 * #FF2EDB, que son erratas de copiar y pegar, no decisiones de diseño.
 *
 * `null` = no se sustituye (ya es correcto, o es un neutro fuera de la marca).
 */
export const HEX_TO_TOKEN: Record<string, string | null> = {
  // magenta — se canoniza el que ya se renderiza y está en banda
  '#FF00C8': 'EMISSION.magenta',
  '#E91E8B': 'EMISSION.magenta', // token viejo, 15° fuera de la banda del logo
  '#FF4DDB': 'EMISSION.magentaHi',
  '#FF2EDB': 'EMISSION.magentaHi', // deriva: 2° de diferencia
  '#FF4FB8': 'EMISSION.magentaHi',
  '#C4187A': 'EMISSION.magenta',
  // violeta
  '#9D4DFF': 'EMISSION.violetHi',
  '#9B4DFF': 'EMISSION.violetHi', // deriva: diferencia CERO
  '#7C3AED': 'EMISSION.violet',
  '#6E56CF': 'EMISSION.violet',
  // azul
  '#2962FF': 'EMISSION.blue',
  '#3D8BFF': 'EMISSION.blueHi',
  '#3B82F6': 'EMISSION.blueHi',
  '#2D70E0': 'EMISSION.blueHi',
  '#5B6CFF': 'EMISSION.blue',
  '#7B9CFF': 'EMISSION.blueHi',
  '#1E4A8A': 'EMISSION.blue',
  '#1A2744': 'VOID.raised',
  // cian — se consolidan seis valores en uno
  '#00F5FF': 'EMISSION.cyan',
  '#22D3EE': 'EMISSION.cyan',
  '#00E5FF': 'EMISSION.cyan',
  '#00D1FF': 'EMISSION.cyan',
  '#00BCD4': 'EMISSION.cyan',
  '#A5F3FC': 'EMISSION.cyan',
  // fuera de la marca
  '#2FD07F': 'STATE.success',
  '#5CE1A0': 'STATE.success',
  '#E6B450': 'STATE.warning',
  '#E8C547': 'STATE.warning',
  '#FFB347': 'STATE.warning',
  '#E85D5D': 'STATE.error',
  // vacío y tinta
  '#02040A': 'VOID.black',
  '#05070D': 'VOID.black',
  '#030711': 'VOID.black',
  '#050510': 'VOID.black',
  '#080A14': 'VOID.base',
  '#0F111C': 'VOID.surface',
  '#0F172A': 'VOID.surface',
  '#F8FAFC': 'INK.base',
  '#FFFFFF': 'INK.base',
  '#F8FBFF': 'INK.base',
  '#AAB4C8': 'INK.muted',
  '#8B97AD': 'INK.muted',
  '#94A3B8': 'INK.muted',
  '#CBD5E1': 'INK.muted',
  '#E2E8F0': 'INK.muted',
  '#5C6B82': 'INK.faint',
  // sin destino: revisar caso por caso antes de tocarlos
  '#DCE6FF': null,
  '#E8F0FF': null,
  '#E8F4FF': null,
  '#FFF5F0': null,
}

export const BRAND = { VOID, INK, EMISSION, STATE, PRESENCE, TYPE, SPACE, RADIUS, GLASS } as const
