import { PRESENTACIONES_G11, PRESENTACIONES_G11_V1 } from '@/lib/g11'
import { buscarIdioma, IDIOMA_POR_DEFECTO, type CodigoIdioma } from '@/lib/i18n/idiomas'

/**
 * LA PRESENTACIÓN QUE LE TOCA A CADA IDIOMA.
 *
 * El botón «Descargar plan de marketing» apuntaba al archivo ESPAÑOL, a secas.
 * Con la landing en un solo idioma eso era correcto por definición; en cuanto
 * la página habla once, deja de serlo sin que nada avise: alguien lee la
 * sección entera en alemán, pulsa un botón en alemán, y se descarga un PDF en
 * español. El texto está traducido y el enlace no, que es la peor mezcla —
 * porque el visitante confía en lo que acaba de leer.
 *
 * La lista existe ya: son los mismos archivos que enseña el portal G11. Aquí
 * sólo se resuelve CUÁL toca, y se hace derivando de esas listas para que no
 * haya una tercera copia de las URLs. Si mañana llega la v5.0 en alemán, se
 * añade en `lib/g11.ts` y este resolutor la coge solo.
 *
 * DEVUELVE LA VERSIÓN, no sólo el archivo. Alemán, serbio y urdu todavía van
 * con la v1 —más antigua y mucho más pesada: el serbio pesa 227 MB— y quien
 * pulsa merece saberlo ANTES, no descubrirlo con datos móviles. Por eso el
 * resultado trae `material` y `mb`, y quien pinta el botón decide cómo avisar.
 */
export interface PresentacionResuelta {
  archivo: string
  /** El idioma en su propia lengua. */
  nativo: string
  mb: number
  /**
   * `v5` es la presentación al día; `v1`, la anterior; `pendiente` significa
   * que ese idioma todavía no tiene material propio y se está entregando el de
   * otro — quien pinta el botón tiene que decirlo.
   */
  material: 'v5' | 'v1' | 'pendiente'
  /** El idioma que realmente se sirve — puede no ser el pedido. */
  codigo: string
}

/**
 * Resuelve la presentación de un idioma.
 *
 * SI NO HAY NINGUNA, CAE AL ESPAÑOL Y LO DICE en `codigo`. No devuelve `null`:
 * un botón de descarga que a veces desaparece es peor que uno que a veces
 * ofrece otro idioma, porque el hueco no se explica solo. Y como el resultado
 * lleva el idioma real, quien lo pinta puede decir cuál está entregando.
 *
 * Hoy los once idiomas del portal tienen archivo, así que el respaldo no llega
 * a usarse. Está por lo que pase mañana: añadir un idioma a la interfaz es una
 * línea, y conseguir su PDF es un trabajo aparte que puede tardar meses.
 */
export function presentacionParaIdioma(codigo: CodigoIdioma | string): PresentacionResuelta {
  const alDia = PRESENTACIONES_G11.find((p) => p.codigo === codigo)
  if (alDia) {
    return { ...alDia, material: 'v5' }
  }
  const anterior = PRESENTACIONES_G11_V1.find((p) => p.codigo === codigo)
  if (anterior) {
    return { ...anterior, material: 'v1' }
  }
  /*
   * UN IDIOMA PUEDE DECLARAR DE DÓNDE SALE SU MATERIAL MIENTRAS NO TIENE EL
   * SUYO. Coreano pide el inglés, no el español: quien lee la página en coreano
   * es muchísimo más probable que entienda un PDF en inglés.
   *
   * Se devuelve con `material: 'pendiente'` y con `codigo` apuntando al idioma
   * REAL del archivo, que es lo que permite al botón decir qué está entregando.
   * Sin eso el visitante se descarga un PDF en otro idioma sin aviso, que es
   * exactamente lo que este resolutor existe para impedir.
   */
  const declarado = buscarIdioma(String(codigo))?.materialDe
  if (declarado) {
    const prestado =
      PRESENTACIONES_G11.find((p) => p.codigo === declarado) ??
      PRESENTACIONES_G11_V1.find((p) => p.codigo === declarado)
    if (prestado) return { ...prestado, material: 'pendiente' }
  }
  const respaldo = PRESENTACIONES_G11.find((p) => p.codigo === IDIOMA_POR_DEFECTO)!
  return { ...respaldo, material: 'v5' }
}
