/**
 * EL AULA — el material oficial que el asistente entrega.
 *
 * QUÉ ES UNA «EDICIÓN»
 * --------------------
 * Una pieza de material terminada que existe en varios idiomas: un videotutorial,
 * una presentación. No es un artículo del corpus. La diferencia importa y decide
 * la forma de este archivo:
 *
 *   Un artículo lo escribimos nosotros y vive en el idioma del asistente.
 *   Una edición la GRABAMOS, y cada idioma es un archivo distinto.
 *
 * Por eso la unidad aquí no es «la edición», es «la edición EN un idioma»
 * (`PiezaEnIdioma`). Un idioma que no existe no es un texto sin traducir: es un
 * archivo que nadie ha grabado todavía, y la ficha tiene que decirlo.
 *
 * EL IDIOMA DEL MATERIAL NO ES EL IDIOMA DE LA INTERFAZ
 * -----------------------------------------------------
 * Ésta es la decisión estructural, tomada mirando cómo lo resuelve el Messenger
 * de Intercom: el selector de idioma vive DENTRO de la ficha, junto al voto, y no
 * toca la interfaz.
 *
 * No es un capricho de imitación. Quien usa este material casi nunca lo consume:
 * lo PRESENTA. Un promotor lee el asistente en español y necesita llevarse el PDF
 * en croata porque su prospecto es croata. Si el idioma del material colgara del
 * idioma de la aplicación —que habla menos idiomas que el material—, ese caso, que
 * es el caso normal, sería imposible.
 *
 * NO SE INVENTA NINGUNA URL
 * -------------------------
 * Los videos están grabados pero todavía no alojados: `video: null` en todas las
 * piezas. Es deliberado y es el mismo criterio que ya sigue `GUIAS_G11`, donde las
 * cuatro guías del portal original son títulos sin destino y así se muestran.
 * Una URL inventada no falla: responde 404 en la cara de quien confió en ella.
 *
 * Cuando exista el alojamiento se rellena `video` aquí y sólo aquí. Ni un
 * componente cambia.
 */

import { type ArchivoPrensa, PRESS_V5 } from '@/lib/official-links'

/* ─────────────────────────  la videoteca  ───────────────────────── */

/**
 * DÓNDE VIVEN LOS VIDEOS: en nuestro propio hosting.
 *
 * DECISIÓN DEL OWNER (24-ago-2026), con el dato medido delante: la cuenta de
 * Hostinger usa 17 GB y los videos comprimidos rondan las decenas de MB. Pagar un
 * proveedor de video para eso sería alquilar un almacén teniendo el garaje vacío.
 * Descartado YouTube explícitamente: al terminar sugiere videos de terceros.
 *
 * LA CARPETA VIVE FUERA DE `out/`, Y ESO ES LO IMPORTANTE.
 *
 * El despliegue sube el contenido de `out/` por FTP, archivo a archivo. Si los
 * videos estuvieran ahí, cada push volvería a subir cientos de MB —hoy ya son 64
 * MB y ~10 minutos— para republicar unos archivos que no cambiaron. Y como el
 * script sobrescribe pero nunca borra, `media/` sobrevive intacto a cada
 * despliegue sin que nadie tenga que acordarse de nada.
 *
 * Los videos se suben UNA VEZ, con `scripts/subir-video.mjs`, y no vuelven a
 * tocarse.
 */
export const VIDEOTECA = {
  proveedor: 'propio' as const,
  /**
   * Base absoluta y NO `rutaPublica()`: los videos no son parte de la exportación.
   * Viven en el dominio raíz y los sirve Apache, se publique la landing en
   * `g1.aigenesis.io`, en `aigenesis.io/g1` o donde sea.
   *
   * SE PUEDE DESVIAR EN LOCAL con `NEXT_PUBLIC_AULA_BASE=/media/aula`, apuntando a
   * una copia en `public/`. Es la única forma de ver el Aula funcionando antes de
   * subir nada — sin esto habría que editar el código para mirarlo y acordarse de
   * revertirlo, que es exactamente como se cuela una edición temporal a producción.
   */
  base: process.env.NEXT_PUBLIC_AULA_BASE || 'https://aigenesis.io/media/aula',
  /**
   * Interruptor general. En `false`, `urlDeVideo()` devuelve `null` pase lo que
   * pase y ninguna ficha puede mostrar un reproductor roto por un descuido de
   * datos.
   *
   * ENCENDIDO EL 25-AGO-2026: los seis archivos están subidos y comprobados —
   * responden 200 con `Content-Type: video/mp4`, aceptan rangos y traen la
   * cabecera de CORS que el analizador de voz necesita.
   */
  publicado: true,

  /**
   * VERSIÓN DE LA URL — y no es cosmética.
   *
   * Los archivos se subieron primero con `Cache-Control: public`, y la CDN de
   * Hostinger se quedó una copia en el borde... por un año. Esa copia se sirve sin
   * preguntarle a Apache, y la CDN no mira el referente: mientras exista, la regla
   * anti-hotlinking no se aplica a esas URL. Purgar el borde no se puede desde
   * aquí, y esperar un año no es un plan.
   *
   * Con el parámetro, la URL es otra para la CDN: llega a Apache, sale con
   * `private`, no se guarda en el borde y el candado vuelve a morder. Comprobado.
   *
   * Se sube este número si alguna vez hay que forzar una recarga. Renombrar los
   * archivos haría lo mismo, pero cuesta volver a subir 567 MB.
   */
  version: 'v1',
} as const

/**
 * La URL de reproducción de una pieza, o `null` si todavía no se puede reproducir.
 *
 * Devuelve `null` en dos casos que la ficha trata igual pero que conviene no
 * confundir al leer el código: la videoteca no está publicada todavía, o esa pieza
 * concreta no está grabada en ese idioma.
 */
export function urlDeVideo(pieza: PiezaEnIdioma | undefined): string | null {
  if (!pieza?.video || !VIDEOTECA.publicado) return null
  return `${VIDEOTECA.base}/${pieza.video}?${VIDEOTECA.version}`
}

/** El póster que se ve antes de pulsar. Mismo nombre, extensión distinta. */
export function urlDePoster(pieza: PiezaEnIdioma | undefined): string | null {
  const v = urlDeVideo(pieza)
  return v ? v.replace(/\.mp4\?/, '.jpg?') : null
}

/* ─────────────────────────  los tipos  ───────────────────────── */

export interface PiezaEnIdioma {
  /**
   * Ruta del archivo dentro de la videoteca, p. ej. `acceso-cuenta/es.mp4`.
   * `null` = no grabado en este idioma. No se pone una cadena vacía: vacío y
   * ausente se confunden al leer, y el hueco tiene que ser visible de un vistazo.
   */
  video: string | null
  /** Duración real en segundos. `null` mientras no haya archivo que medir. */
  segundos: number | null
  /** URL absoluta del documento descargable, si esta edición tiene uno. */
  pdf?: string
  /** Peso del PDF en MB — MEDIDO, nunca estimado: se enseña antes de pulsar. */
  mb?: number
  /** Árabe y urdu se alinean al otro lado. */
  rtl?: boolean
}

export interface Edicion {
  /**
   * Estable. Es lo que enlaza el chat cuando devuelve la ficha y lo que agrupa el
   * voto: si cambia, el historial de feedback deja de sumar sin que nada falle.
   */
  id: string
  titulo: string
  resumen: string
  /** Rótulo de versión visible. La referencia lo muestra y separa vivo de viejo. */
  version: string
  /**
   * El aviso de riesgo va DENTRO de la ficha, no en una página aparte.
   * Sólo el material que describe el negocio lo lleva; un tutorial de acceso a la
   * cuenta no promete nada y no lo necesita.
   */
  avisoRiesgo?: boolean
  piezas: Readonly<Record<string, PiezaEnIdioma>>
}

/* ─────────────────────────  las ediciones  ───────────────────────── */

/** Orden de presentación de los idiomas. El español primero porque es el origen. */
export const ORDEN_IDIOMAS = ['es', 'en', 'pt', 'fr', 'ru', 'sv', 'hr', 'ar'] as const

/** El idioma en su propia lengua: es como lo busca quien lo necesita. */
export const NOMBRE_IDIOMA: Readonly<Record<string, string>> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  fr: 'Français',
  ru: 'Русский',
  sv: 'Svenska',
  hr: 'Hrvatski',
  ar: 'العربية',
}

/**
 * Edición 1 — el tutorial de acceso.
 *
 * ORIGEN: `apps/web3-kyc-tutorial` del monorepo `g-pulse-oracle` (Remotion). Las
 * duraciones salen de `ffprobe` sobre los másteres, no del guion.
 *
 * SÓLO LA VERSIÓN HORIZONTAL, por decisión del owner (24-ago-2026). Existe también
 * una vertical 9:16 de cada idioma —la de Instagram— y NO se sube: quien quiera
 * verlo más grande en el móvil que lo gire. Una orientación por idioma es la mitad
 * de archivos que mantener y ni una decisión que tomar en el reproductor.
 */
const ACCESO: Edicion = {
  id: 'edicion-acceso-cuenta',
  /*
   * EL TÍTULO SALE DEL GUION, NO DE LO QUE YO CREÍA QUE ERA.
   *
   * Lo tenía como «Cómo acceder a tu cuenta desde Génesis», que no dice de qué
   * cuenta habla. El guion (`storyboard.ts`) es explícito: se entra al panel de
   * AiGenesis, se pulsa TAG MARKETS arriba a la derecha, se confirma «Sync
   * Account» y se termina con KYC, código por correo y biometría. Es la
   * VINCULACIÓN de una cuenta de TAG Markets, no un acceso genérico.
   */
  titulo: 'Cómo vincular tu cuenta de TAG Markets desde Génesis',
  resumen:
    'Desde tu panel de AiGenesis: vincular la cuenta, verificar la identidad y activar el acceso.',
  version: 'Edición 1',
  piezas: {
    es: { video: 'acceso-cuenta/es.mp4', segundos: 123 },
    en: { video: 'acceso-cuenta/en.mp4', segundos: 114 },
    pt: { video: 'acceso-cuenta/pt.mp4', segundos: 116 },
  },
}

/**
 * Edición 2 — el plan de negocio.
 *
 * El PDF NO se copia: se deriva de `PRESS_V5`, que ya es fuente única del «plan de
 * marketing» de la escena Roadmap y de las presentaciones del portal G11. Tres
 * listas con las mismas URLs se desincronizan en cuanto alguien añade un idioma a
 * una y se olvida de las otras; una sola, no.
 *
 * Las ocho URLs se comprobaron contra el servidor el 24-ago-2026: las ocho
 * responden 200.
 */
/**
 * El video del plan de negocio existe en TRES idiomas y el documento en OCHO.
 *
 * Ésta es exactamente la asimetría para la que se diseñó la ficha: el ruso, el
 * sueco, el croata y el árabe tienen documento y no tienen video, y se abren igual
 * porque hay algo que entregar. Un modelo que atara el video y el PDF al mismo
 * interruptor habría dejado esas cuatro fichas inaccesibles o mintiendo.
 *
 * ORIGEN DEL VIDEO: `apps/aitech-one-pitch` (Remotion). El máster ES está
 * CONGELADO por decisión del owner — no se vuelve a renderizar; sólo se comprime
 * para la web, que no toca el original.
 */
const VIDEO_PLAN: Readonly<Record<string, { video: string; segundos: number }>> = {
  es: { video: 'plan-de-negocio/es.mp4', segundos: 881 },
  en: { video: 'plan-de-negocio/en.mp4', segundos: 852 },
  pt: { video: 'plan-de-negocio/pt.mp4', segundos: 875 },
}

const PLAN: Edicion = {
  id: 'edicion-plan-de-negocio',
  titulo: 'El plan de negocio',
  resumen: 'La presentación completa, para mostrársela a alguien.',
  version: 'Edición 2 · v5.0',
  avisoRiesgo: true,
  piezas: Object.fromEntries(
    ORDEN_IDIOMAS.map((codigo) => {
      /* Anotado como `ArchivoPrensa` a propósito: `PRESS_V5` es `as const`, así que
         cada entrada tiene su tipo literal y sólo la árabe declara `rtl`. Leerlo
         sin ensanchar da un error de compilación en las otras siete. */
      const doc: ArchivoPrensa = PRESS_V5[codigo]
      const v = VIDEO_PLAN[codigo]
      return [
        codigo,
        {
          video: v?.video ?? null,
          segundos: v?.segundos ?? null,
          pdf: doc.archivo,
          mb: doc.mb,
          rtl: doc.rtl,
        },
      ]
    })
  ),
}

export const EDICIONES: readonly Edicion[] = [ACCESO, PLAN] as const

/** El nombre de la colección en Ayuda. Vive aquí para que no se escriba dos veces. */
export const COLECCION_AULA = 'Aprende'

/* ─────────────────────────  consultas  ───────────────────────── */

export const edicionPorId = (id: string): Edicion | undefined =>
  EDICIONES.find((e) => e.id === id)

/** Los idiomas en que esta edición se puede REPRODUCIR (no los que tienen ficha). */
export const idiomasConVideo = (e: Edicion): readonly string[] =>
  ORDEN_IDIOMAS.filter((l) => Boolean(e.piezas[l]?.video))

/** Los idiomas en que esta edición se puede DESCARGAR. */
export const idiomasConPdf = (e: Edicion): readonly string[] =>
  ORDEN_IDIOMAS.filter((l) => Boolean(e.piezas[l]?.pdf))

/**
 * Con qué idioma abrir la ficha.
 *
 * El de la interfaz si esa edición lo tiene; si no, el español; y si tampoco, el
 * primero que exista. Nunca se abre en un idioma vacío: una ficha que arranca en
 * blanco se lee como un error del sitio, no como material que falta.
 */
export function idiomaInicial(e: Edicion, idiomaUI: string): string {
  const utiles = ORDEN_IDIOMAS.filter((l) => Boolean(e.piezas[l]?.video ?? e.piezas[l]?.pdf))
  if (utiles.includes(idiomaUI as (typeof ORDEN_IDIOMAS)[number])) return idiomaUI
  if (utiles.includes('es')) return 'es'
  return utiles[0] ?? 'es'
}

/** `192` → `3:12`. `null` → `null`, porque no hay duración que redondear. */
export function duracionLegible(segundos: number | null): string | null {
  if (segundos === null || !Number.isFinite(segundos) || segundos <= 0) return null
  const m = Math.floor(segundos / 60)
  const s = Math.floor(segundos % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
