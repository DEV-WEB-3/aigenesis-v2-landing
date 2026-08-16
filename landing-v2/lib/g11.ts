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

import { PRESS_V5 } from './official-links'

/** URL base de las descargas del sitio legacy — sólo para la tanda antigua. */
const DESCARGAS = 'https://aigenesis.io/downloads'

export interface PresentacionG11 {
  /** El idioma en su propia lengua: es como lo busca quien lo necesita. */
  nativo: string
  archivo: string
  mb: number
  rtl?: boolean
}

/**
 * PRESENTACIÓN OFICIAL — v5.0, ocho idiomas.
 *
 * Sale de `PRESS_V5`, que es la misma fuente que usa el «plan de marketing» de
 * la escena Roadmap. Un solo juego de archivos, una sola lista.
 *
 * Sustituye a la tanda v1 que tenía el portal. La mejora no es sólo que esté al
 * día: la v1 pesaba entre 5 y 9 MB por idioma —y 227 MB el serbio—, y ésta va a
 * 2,4-2,5 MB. Para alguien que la descarga con datos en el móvil para enseñarla,
 * eso es la diferencia entre poder y no poder.
 */
export const PRESENTACIONES_G11: readonly PresentacionG11[] = [
  PRESS_V5.es, PRESS_V5.en, PRESS_V5.pt, PRESS_V5.fr,
  PRESS_V5.ru, PRESS_V5.sv, PRESS_V5.hr, PRESS_V5.ar,
]

/**
 * Los tres idiomas que la v5.0 NO tiene todavía.
 *
 * La tanda v1 cubría alemán, serbio y urdu; la v5.0 no —comprobado probando
 * varias formas del nombre en el servidor, las tres dan 404— y en cambio gana
 * sueco, croata y árabe.
 *
 * Reemplazar sin más habría dejado a tres comunidades sin ningún material. Así
 * que se conservan, en su propio bloque y marcados como versión anterior. Un
 * material viejo en tu idioma sirve más que uno nuevo que no entiendes, pero
 * mezclarlos en la misma rejilla sería hacer pasar el v1 por v5.
 *
 * ATENCIÓN AL NOMBRE DE ARCHIVO: `É` acentuada en el alemán. Va porcentualmente
 * codificada (`G%C3%89NESIS`) como en el portal original: sin codificar devuelve
 * 404, y confiar en que cada navegador codifique un carácter no ASCII de la ruta
 * como UTF-8 es apostar.
 *
 * EL SERBIO PESA 227 MB. Es un archivo de la v1 y sigue siendo un obstáculo:
 * hasta que exista su v5.0 se queda, avisado en ámbar.
 */
export const PRESENTACIONES_G11_V1: readonly PresentacionG11[] = [
  { nativo: 'Deutsch', archivo: `${DESCARGAS}/G%C3%89NESIS_CORPORATE_PRESENTATION_V-DEU.pdf`, mb: 9.2 },
  { nativo: 'Српски', archivo: `${DESCARGAS}/GENESIS_CORPORATE_PRESENTATION_V-SRB.pdf`, mb: 227.3 },
  { nativo: 'اردو', archivo: `${DESCARGAS}/GENESIS_CORPORATE_PRESENTATION_V-urdu.pdf`, mb: 5.2, rtl: true },
]

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
