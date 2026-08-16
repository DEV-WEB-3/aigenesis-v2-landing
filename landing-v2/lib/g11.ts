/**
 * Datos de la Comunidad G11 — portal de habilitación de red.
 *
 * INVENTARIADO EL 16-AGO-2026 desde `aigenesis.io/g11/g11_es/`, que es el portal
 * que esto sustituye. Todo lo de aquí sale de allí; nada está inventado.
 *
 * G11 no es la landing con otro color: le habla a otra gente. La landing
 * convence a un visitante; esto capacita a alguien que YA está dentro y va a
 * usar el material para vender. Por eso vive en su propia ruta y no como una
 * sección más del recorrido.
 */

/** URL base de las descargas oficiales del sitio legacy. */
const DESCARGAS = 'https://aigenesis.io/downloads'

export interface PresentacionG11 {
  idioma: string
  /** Etiqueta corta para la ficha; el idioma en su propia lengua. */
  nativo: string
  archivo: string
  /** Peso real, medido. Se muestra: uno de estos archivos pesa 227 MB. */
  mb: number
}

/**
 * ATENCIÓN AL NOMBRE DE ARCHIVO: cinco de los ocho llevan `É` acentuada.
 *
 * Va porcentualmente codificada (`G%C3%89NESIS`) como en el portal original.
 * Sin codificar devuelven 404 —comprobado— y confiar en que cada navegador
 * codifique bien un carácter no ASCII en una ruta es apostar: los que lo
 * hacen en Latin-1 en vez de UTF-8 no encuentran el archivo.
 *
 * Los pesos están medidos uno a uno, no estimados.
 */
export const PRESENTACIONES_G11: readonly PresentacionG11[] = [
  { idioma: 'Español', nativo: 'Español', archivo: `${DESCARGAS}/G%C3%89NESIS_CORPORATE_PRESENTATION_V-ES.pdf`, mb: 9.3 },
  { idioma: 'Inglés', nativo: 'English', archivo: `${DESCARGAS}/GENESIS_CORPORATE_PRESENTATION_V-ENG.pdf`, mb: 8.8 },
  { idioma: 'Portugués', nativo: 'Português (BR)', archivo: `${DESCARGAS}/G%C3%89NESIS_CORPORATE_PRESENTATION_V-BR.pdf`, mb: 9.2 },
  { idioma: 'Francés', nativo: 'Français', archivo: `${DESCARGAS}/G%C3%89NESIS_CORPORATE_PRESENTATION_V-FR.pdf`, mb: 9.2 },
  { idioma: 'Alemán', nativo: 'Deutsch', archivo: `${DESCARGAS}/G%C3%89NESIS_CORPORATE_PRESENTATION_V-DEU.pdf`, mb: 9.2 },
  { idioma: 'Ruso', nativo: 'Русский', archivo: `${DESCARGAS}/G%C3%89NESIS_CORPORATE_PRESENTATION_V-RU.pdf`, mb: 9.2 },
  { idioma: 'Serbio', nativo: 'Српски', archivo: `${DESCARGAS}/GENESIS_CORPORATE_PRESENTATION_V-SRB.pdf`, mb: 227.3 },
  { idioma: 'Urdu', nativo: 'اردو', archivo: `${DESCARGAS}/GENESIS_CORPORATE_PRESENTATION_V-urdu.pdf`, mb: 5.2 },
] as const

/** Por encima de esto se avisa antes de que alguien lo pulse en el móvil. */
export const MB_PESADO = 50

/**
 * Las cuatro guías del portal original.
 *
 * EN EL PORTAL ACTUAL NO LLEVAN ENLACE. Ninguna de las cuatro: son títulos sin
 * destino, verificado sobre el HTML servido. O sea que la sección que enseña a
 * registrarse, comprar el paquete, referir y usar la oficina virtual —justo lo
 * que alguien nuevo necesita— no lleva a ninguna parte.
 *
 * Aquí NO se fabrican enlaces que no existen. Cada guía tiene su hueco `video`
 * a `null`, la ficha se muestra como pendiente, y la sección remite al canal
 * de YouTube, que sí existe. En cuanto haya URLs se rellenan aquí y la ficha
 * pasa a ser un enlace sola.
 */
export interface GuiaG11 {
  titulo: string
  descripcion: string
  video: string | null
}

export const GUIAS_G11: readonly GuiaG11[] = [
  {
    titulo: 'Cómo registrarte en Genesis',
    descripcion: 'Alta de cuenta con enlace de patrocinador y cartera Web3.',
    video: null,
  },
  {
    titulo: 'Cómo comprar tu paquete de minería',
    descripcion: 'Pago del paquete y activación de la participación.',
    video: null,
  },
  {
    titulo: 'Cómo referir y crecer tu comunidad',
    descripcion: 'Tu enlace de referido y cómo se construye la red.',
    video: null,
  },
  {
    titulo: 'Cómo funciona tu oficina virtual',
    descripcion: 'Panel de red, seguimiento y material para compartir.',
    video: null,
  },
] as const

export interface CanalG11 {
  nombre: string
  url: string
}

/**
 * Canales propios de G11, que NO son los de AiGenesis.
 *
 * Ojo: Instagram aquí es `g11community` y en el pie de la landing es
 * `aigenesisofficial`. Son cuentas distintas y está bien que lo sean —marca
 * madre y comunidad—, pero por eso esta lista vive aparte de `OFFICIAL_SOCIAL`
 * y no se reutiliza aquélla.
 */
export const CANALES_G11: readonly CanalG11[] = [
  { nombre: 'Telegram', url: 'https://t.me/AiGenesisComunity' },
  { nombre: 'YouTube', url: 'https://www.youtube.com/@G11Community?sub_confirmation=1' },
  { nombre: 'Instagram', url: 'https://www.instagram.com/g11community/' },
  { nombre: 'Discord', url: 'https://discord.gg/jmUyUWP7Eq' },
  { nombre: 'X', url: 'https://x.com/G11Community' },
  { nombre: 'Facebook', url: 'https://www.facebook.com/G11Community/' },
  // El portal original lo enlaza por `http://`. Aquí va en https: una descarga
  // o un perfil servido en claro es una advertencia del navegador de regalo.
  { nombre: 'TikTok', url: 'https://tiktok.com/@genesisg11_' },
] as const
