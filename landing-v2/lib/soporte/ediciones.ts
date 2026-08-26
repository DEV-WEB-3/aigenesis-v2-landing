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
/*
 * ALEMÁN Y SERBIO ENTRARON CON EL PLAN DE LA ALIANZA.
 *
 * Los subí en cinco idiomas —es, en, de, pt, sr— y la ficha anunciaba «3
 * idiomas»: esta lista no los tenía, así que los dos PDF existían en el
 * servidor y la barra de idiomas no podía ni ofrecerlos. Publicado e
 * inalcanzable es lo mismo que no publicado, sólo que ocupa disco.
 *
 * El orden mezcla los dos catálogos a propósito: el material de AiGenesis vive
 * en ocho idiomas y el de la alianza en cinco, y no coinciden. Un idioma sin
 * material se enseña APAGADO en vez de ocultarse, así que ampliar la lista no
 * miente sobre ninguna edición: enseña el hueco, que es información.
 */
export const ORDEN_IDIOMAS = ['es', 'en', 'pt', 'de', 'fr', 'ru', 'sv', 'hr', 'sr', 'ar'] as const

/** El idioma en su propia lengua: es como lo busca quien lo necesita. */
export const NOMBRE_IDIOMA: Readonly<Record<string, string>> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  fr: 'Français',
  ru: 'Русский',
  sv: 'Svenska',
  hr: 'Hrvatski',
  de: 'Deutsch',
  sr: 'Српски',
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
    es: { video: 'acceso-cuenta/720/es.mp4', segundos: 123 },
    en: { video: 'acceso-cuenta/720/en.mp4', segundos: 114 },
    pt: { video: 'acceso-cuenta/720/pt.mp4', segundos: 116 },
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
/*
 * EL NOMBRE LO DECÍA Y NO LO LEÍ: `apps/aitech-one-pitch`. Este video es el
 * pitch de AITECH ONE —la alianza—, no la presentación de AiGenesis, y aun así
 * lo colgué de la edición de AiGenesis al crear la de la alianza. Lo confirmé
 * extrayendo fotogramas: logos AITECH/GENESIS, BixCard, la estructura de la red,
 * y `aitechone.io` al pie de cada lámina.
 *
 * Se renombra para que la próxima persona no tenga que abrir el video para saber
 * de qué edición es.
 */
const VIDEO_ALIANZA: Readonly<Record<string, { video: string; segundos: number }>> = {
  es: { video: 'plan-de-negocio/720/es.mp4', segundos: 881 },
  en: { video: 'plan-de-negocio/720/en.mp4', segundos: 852 },
  pt: { video: 'plan-de-negocio/720/pt.mp4', segundos: 875 },
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
      /*
       * `PRESS_V5` NO TIENE TODOS LOS IDIOMAS DE LA LISTA, y eso es normal desde
       * que la lista sirve a dos catálogos distintos: el mazo de AiGenesis
       * existe en ocho idiomas y el de la alianza en cinco, y no coinciden.
       *
       * Aquí se leía `PRESS_V5[codigo].archivo` a pelo. Al añadir alemán y
       * serbio —que la alianza sí tiene y AiGenesis no— el módulo reventaba
       * ENTERO al construirse: «Cannot read properties of undefined». No es un
       * hueco que se pinta mal, es el asistente que no carga.
       *
       * Un idioma sin documento devuelve una pieza vacía, que es exactamente lo
       * que la ficha sabe enseñar: apagado, y visible.
       */
      const doc: ArchivoPrensa | undefined = PRESS_V5[codigo as keyof typeof PRESS_V5]
      /*
       * ESTA EDICIÓN NO TIENE VIDEO, Y NUNCA LO TUVO.
       *
       * Aquí se leía `VIDEO_PLAN`, los tres archivos de `plan-de-negocio/`. Al
       * mirarlos —extrayendo fotogramas, no fiándome del nombre de la carpeta—
       * resultó que NO son la presentación de AiGenesis: son la de la ALIANZA.
       * Logos AITECH/GENESIS, BixCard, la estructura de Aitech One, y el pie de
       * cada lámina dice `aitechone.io`.
       *
       * O sea que durante días la edición de AiGenesis ofrecía un video que
       * hablaba de otra cosa, y la de la alianza —que es donde encaja— no tenía
       * ninguno. El nombre de la carpeta decía «plan-de-negocio» y yo asumí de
       * cuál. Los archivos se movieron a `ALIANZA`; esta edición es lo que
       * siempre fue: la presentación corporativa de AiGenesis, en PDF.
       */
      return [
        codigo,
        {
          video: null,
          segundos: null,
          pdf: doc?.archivo,
          mb: doc?.mb,
          rtl: doc?.rtl,
        },
      ]
    })
  ),
}

/**
 * Edición 3 — el plan de negocio de la ALIANZA (Aitech One: Aitech + Genesis + TAG).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ EXISTE APARTE DEL PLAN DE NEGOCIO DE AiGENESIS.
 *
 * Instrucción del owner (25-ago-2026): el material que enseña el asistente
 * depende del portal donde se abre. En aigenesis.io, la presentación de
 * AiGenesis; en g1.aigenesis.io —que es la marca de la alianza— el plan que
 * presenta a Aitech, Génesis y TAG juntos. No son dos versiones del mismo
 * documento: son dos documentos que hablan de cosas distintas, y enseñar el
 * equivocado deja a quien lo abre explicando otra empresa.
 *
 * DE DÓNDE SALEN LOS ARCHIVOS. De los mazos `AITECHONE.*` que entregó el owner.
 * Estaban SIN PUBLICAR y pesaban de 12,7 a 45,4 MB. Se comprimieron con
 * `scripts/comprimir-pdf.py` a 4,1-4,6 MB y se subieron a `/media/aula/alianza/`.
 * El peso importa: esto se abre en el móvil para enseñárselo a alguien delante.
 *
 * CINCO IDIOMAS, NO OCHO. Existen es, en, de, pt y sr. Los otros tres de
 * `ORDEN_IDIOMAS` no están grabados, y la ficha los enseña APAGADOS en vez de
 * ocultarlos: quien busca el suyo tiene que poder ver que no está, no creer que
 * no existe la edición.
 *
 * EL ESPAÑOL TIENE DOS ORIGINALES y difieren en la página 12: uno denomina el
 * ejemplo de apalancamiento en DUAL AIG-USDT y el otro en dólares. Elegido por
 * el owner el 25-ago-2026: el de DUAL AIG-USDT. Las otras 18 páginas son iguales.
 * ─────────────────────────────────────────────────────────────────────────
 */
const PDF_ALIANZA = 'https://aigenesis.io/media/aula/alianza'

const ALIANZA: Edicion = {
  id: 'edicion-plan-alianza',
  titulo: 'El plan de negocio de la alianza',
  resumen: 'Aitech, Génesis y TAG presentados juntos: qué aporta cada uno y cómo encaja el AiG.',
  version: 'Aitech One',
  /* Habla de apalancamiento, de resultados y de capital operativo. El aviso de
     riesgo no es opcional en una ficha así. */
  avisoRiesgo: true,
  /*
   * VIDEO EN TRES IDIOMAS Y DOCUMENTO EN CINCO, y no coinciden a propósito: el
   * video existe grabado en es/en/pt y el deck está maquetado además en alemán y
   * serbio. Los dos huecos se enseñan apagados en vez de ocultarse.
   *
   * Los archivos de video son los que estaban en `plan-de-negocio/`: comprobado
   * fotograma a fotograma que son ESTE deck —Aitech One— y no el de AiGenesis.
   */
  piezas: {
    es: { ...VIDEO_ALIANZA.es, pdf: `${PDF_ALIANZA}/es.pdf`, mb: 4.1 },
    en: { ...VIDEO_ALIANZA.en, pdf: `${PDF_ALIANZA}/en.pdf`, mb: 4.3 },
    pt: { ...VIDEO_ALIANZA.pt, pdf: `${PDF_ALIANZA}/pt.pdf`, mb: 4.4 },
    de: { video: null, segundos: null, pdf: `${PDF_ALIANZA}/de.pdf`, mb: 4.4 },
    sr: { video: null, segundos: null, pdf: `${PDF_ALIANZA}/sr.pdf`, mb: 4.4 },
  },
}

export const EDICIONES: readonly Edicion[] = [ACCESO, PLAN, ALIANZA] as const

/* ───────────────────  qué se enseña en cada portal  ─────────────────── */

/**
 * EL MATERIAL DEPENDE DEL PORTAL, Y ESO NO SE PUEDE DECIDIR EN EL SERVIDOR.
 *
 * La misma exportación estática sirve aigenesis.io y g1.aigenesis.io: es un solo
 * build, así que no hay forma de hornear la decisión. Se toma en el navegador,
 * con lo único que distingue de verdad a los dos sitios — el host— y con la ruta
 * como respaldo para el caso en que la landing de Genesis y la de G1 convivan
 * bajo el mismo dominio (que es lo que pasa hoy en Vercel: `/` y `/g1`).
 *
 * `desconocido` NO es un caso raro: es lo que vale durante el primer render del
 * servidor, antes de que exista `window`. Se le da el juego COMPLETO a propósito.
 * Esconder material hasta saber dónde estamos produciría un parpadeo en el que
 * la lista se encoge, y de los dos errores posibles —enseñar de más un instante,
 * o esconder algo que sí toca— el segundo es el que hace que alguien concluya
 * que su documento no existe.
 */
export type Portal = 'genesis' | 'g1' | 'desconocido'

export function portalActual(): Portal {
  if (typeof window === 'undefined') return 'desconocido'
  /* El subdominio manda: en g1.aigenesis.io la raíz YA es G1 (lo redirige el
     .htaccess), así que ahí la ruta no distingue nada. */
  if (window.location.hostname.startsWith('g1.')) return 'g1'
  /* Y donde los dos sitios conviven bajo un mismo dominio —Vercel sirve la
     landing de Genesis en `/` y la de G1 en `/g1`— decide la ruta. */
  if (window.location.pathname.startsWith('/g1')) return 'g1'
  return 'genesis'
}

/**
 * Las ediciones que le tocan a un portal.
 *
 * El tutorial de vinculación va en LOS DOS: enseña a conectar una cuenta de TAG
 * Markets desde el panel de AiGenesis, así que le sirve igual a quien llega por
 * cualquiera de las dos puertas. Lo que se separa son los planes de negocio.
 */
export function edicionesDePortal(portal: Portal): readonly Edicion[] {
  if (portal === 'g1') return [ACCESO, ALIANZA]
  if (portal === 'genesis') return [ACCESO, PLAN]
  return EDICIONES
}

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
