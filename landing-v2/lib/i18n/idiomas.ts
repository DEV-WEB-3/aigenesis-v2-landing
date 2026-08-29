import { PRESS_V5 } from '@/lib/official-links'

/**
 * LOS IDIOMAS DEL PORTAL — y de dónde sale la lista.
 *
 * No se eligen: se HEREDAN. El material comercial de Genesis existe en once
 * idiomas —ocho con la presentación v5.0 y tres que todavía van con la v1— y
 * ésa es exactamente la lista que la landing tiene que hablar. Traducir a un
 * idioma sin material detrás deja a alguien leyendo la página en su lengua y
 * descargando un PDF que no entiende; y tener material en un idioma que la
 * página no habla es el mismo problema al revés.
 *
 * Por eso la lista no se escribe a mano aquí: los ocho de la v5.0 salen de
 * `PRESS_V5`, que ya es la fuente única de esos archivos. Si mañana se añade un
 * idioma a la presentación, aparece aquí solo.
 *
 * LOS TRES DE LA v1 SE MARCAN, NO SE ESCONDEN. Alemán, serbio y urdu tienen
 * material, pero de la versión anterior. El selector lo dice —no es un detalle
 * administrativo: quien elige su idioma está a un clic de descargar, y merece
 * saber si lo que va a bajar es lo último o no.
 */

export type CodigoIdioma =
  | 'es' | 'en' | 'pt' | 'fr' | 'ru' | 'sv' | 'hr' | 'ar' | 'de' | 'sr' | 'ur' | 'ko'

export interface Idioma {
  codigo: CodigoIdioma
  /** El nombre en su propia lengua: es como lo busca quien lo necesita. */
  nativo: string
  /** Cómo se llama en español, para lectores de pantalla y para el `title`. */
  enEspanol: string
  /** `rtl` cambia la dirección del documento entero, no solo la del texto. */
  rtl?: boolean
  /**
   * Versión de la presentación disponible en ese idioma.
   * `pendiente` = la interfaz ya habla ese idioma pero el material todavía no
   * existe, así que se entrega el de otro (ver `materialDe`).
   */
  material: 'v5' | 'v1' | 'pendiente'
  /**
   * De qué idioma sale el material mientras el propio no existe.
   *
   * SIN ESTO EL RESPALDO ES EL ESPAÑOL, y para un idioma nuevo eso casi nunca
   * es lo correcto: quien lee la página en coreano tiene muchísimas más
   * probabilidades de entender un PDF en inglés que uno en español. El respaldo
   * no es «el idioma de la casa», es «el que más probablemente entienda quien
   * está esperando el suyo», y eso se decide idioma por idioma.
   */
  materialDe?: CodigoIdioma
}

/** Los ocho con presentación al día. El orden es el de `PRESS_V5`. */
const CON_V5: readonly Idioma[] = [
  { codigo: 'es', nativo: PRESS_V5.es.nativo, enEspanol: 'Español', material: 'v5' },
  { codigo: 'en', nativo: PRESS_V5.en.nativo, enEspanol: 'Inglés', material: 'v5' },
  /*
   * El unico que NO hereda su nombre de `PRESS_V5`. Alli pone «Português (BR)»
   * porque en una lista de descargas hay que distinguir la variante; en el
   * selector, con 14 caracteres, la columna lo corta en «Portug…» — y un nombre
   * cortado no cumple lo unico que tiene que cumplir el nombre nativo, que es
   * que lo reconozca quien lo busca. La variante sigue dicha donde importa: en
   * el archivo y en el nombre en español.
   */
  { codigo: 'pt', nativo: 'Português', enEspanol: 'Portugués (Brasil)', material: 'v5' },
  { codigo: 'fr', nativo: PRESS_V5.fr.nativo, enEspanol: 'Francés', material: 'v5' },
  { codigo: 'ru', nativo: PRESS_V5.ru.nativo, enEspanol: 'Ruso', material: 'v5' },
  { codigo: 'sv', nativo: PRESS_V5.sv.nativo, enEspanol: 'Sueco', material: 'v5' },
  { codigo: 'hr', nativo: PRESS_V5.hr.nativo, enEspanol: 'Croata', material: 'v5' },
  { codigo: 'ar', nativo: PRESS_V5.ar.nativo, enEspanol: 'Árabe', rtl: true, material: 'v5' },
] as const

/** Los tres que todavía van con la presentación v1. */
const CON_V1: readonly Idioma[] = [
  { codigo: 'de', nativo: 'Deutsch', enEspanol: 'Alemán', material: 'v1' },
  { codigo: 'sr', nativo: 'Српски', enEspanol: 'Serbio', material: 'v1' },
  { codigo: 'ur', nativo: 'اردو', enEspanol: 'Urdu', rtl: true, material: 'v1' },
] as const

/**
 * Los que hablan la interfaz pero todavía no tienen material propio.
 *
 * COREANO ENTRA ASÍ POR DECISIÓN DEL OWNER (28-ago-2026). La regla de esta
 * lista era que los idiomas se HEREDAN del material comercial, para no dejar a
 * nadie leyendo en su lengua y descargando un PDF que no entiende. Coreano la
 * rompe: no hay presentación en coreano.
 *
 * Se resuelve sirviéndole el material en INGLÉS y diciéndolo, en vez de
 * esperar a que exista. Un portal que ya habla tu idioma vale aunque el PDF
 * todavía no; lo que no vale es el PDF sorpresa en otro idioma sin avisar.
 *
 * Cuando llegue la presentación en coreano: se añade a `PRESS_V5` en
 * `lib/official-links.ts` y se mueve esta entrada a `CON_V5`. Nada más — el
 * resolutor la coge sola.
 */
const SIN_MATERIAL_PROPIO: readonly Idioma[] = [
  { codigo: 'ko', nativo: '한국어', enEspanol: 'Coreano', material: 'pendiente', materialDe: 'en' },
] as const

export const IDIOMAS: readonly Idioma[] = [...CON_V5, ...CON_V1, ...SIN_MATERIAL_PROPIO]

export const IDIOMA_POR_DEFECTO: CodigoIdioma = 'es'

export function buscarIdioma(codigo: string): Idioma | undefined {
  return IDIOMAS.find((i) => i.codigo === codigo)
}

/**
 * Qué idioma proponerle a alguien que llega por primera vez.
 *
 * Se mira `navigator.languages` en orden y se coge el PRIMERO que el portal
 * hable. No se mira solo `navigator.language`: quien tiene el sistema en inglés
 * y el español como segunda preferencia prefiere el español, y `languages`
 * recoge eso mientras que `language` lo pierde.
 *
 * Se compara solo la parte de idioma —`pt` de `pt-BR`— porque la landing no
 * distingue variantes regionales y `pt-PT` debe caer en portugués, no en nada.
 */
export function idiomaDelNavegador(): CodigoIdioma {
  if (typeof navigator === 'undefined') return IDIOMA_POR_DEFECTO
  const preferidos = navigator.languages?.length
    ? navigator.languages
    : [navigator.language].filter(Boolean)
  for (const p of preferidos) {
    const base = String(p).toLowerCase().split('-')[0]
    const hallado = IDIOMAS.find((i) => i.codigo === base)
    if (hallado) return hallado.codigo
  }
  return IDIOMA_POR_DEFECTO
}
