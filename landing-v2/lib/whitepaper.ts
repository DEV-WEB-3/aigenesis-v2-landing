/**
 * EL WHITEPAPER, EN TEXTO — para poder leerlo en once idiomas.
 *
 * DE DÓNDE SALE: del PDF oficial `aigenesis-whitepaper-v1.1.pdf` (v1.1, febrero
 * de 2024, 8 páginas). Extraído con `pymupdf`: 5.380 caracteres de texto real.
 *
 *   (Corrección de un comentario anterior de `official-links.ts`, que afirmaba
 *   que el texto del PDF NO era extraíble. Sí lo es. La afirmación llevaba ahí
 *   sin comprobar, y sobre ella se había decidido meter los datos de cadena en
 *   HTML «porque el PDF es invisible». La decisión sigue siendo buena; el motivo
 *   que la sostenía era falso.)
 *
 * POR QUÉ EN HTML Y NO COMO DIEZ PDF NUEVOS:
 *
 *  1. El PDF original tiene 23 imágenes y un diseño de marca. Regenerarlo en
 *     diez idiomas no produce «el whitepaper en alemán»: produce OTRO documento
 *     con el mismo texto y sin el diseño, y con pinta de oficial. Un documento
 *     que parece oficial y no lo es hace más daño que no tenerlo.
 *  2. En HTML el texto SÍ lo lee un buscador, funciona con lector de pantalla,
 *     se adapta a RTL —árabe y urdu ya tienen sus reglas— y no cuesta 1,5 MB.
 *  3. El PDF se conserva y se sigue ofreciendo: es el artefacto original, en su
 *     idioma original (inglés), y así queda dicho en la página.
 *
 * EL ORIGINAL ESTÁ EN INGLÉS. Por eso, en el diccionario, la entrada `en` de
 * cada párrafo es el texto EXACTO del PDF, palabra por palabra: quien lee en
 * inglés lee el documento oficial sin intermediario. La clave en español es mi
 * traducción, y de ella salen las otras nueve.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TRES DEFECTOS DEL DOCUMENTO ORIGINAL, encontrados al leerlo para traducirlo.
 * Se listan aquí porque quien venga a actualizar el texto tiene que verlos:
 *
 *  1. EL CONTRATO DEL PDF ES VIEJO. El documento publica
 *     `0x4b4594bfe661919a8e2373eb175004da2989a479`; el token vigente es
 *     `0xC1F0768587Dc889e494C171B155C60B4e9a13F08`. Los dos existen en BSC y
 *     los dos dicen «A.I. Genesis Official / AIG / 111.000.000» —comprobado por
 *     RPC: mismo nombre, mismo símbolo, mismo suministro, bytecode distinto—,
 *     porque el contrato se migró varias veces después de febrero de 2024
 *     (confirmado por el owner el 19-ago-2026).
 *
 *     Por eso esta página NO copia la dirección del PDF: la toma de
 *     `AIG_TOKEN_CONTRACT`, que es la fuente única del sitio. Y por eso el
 *     visor del PDF lleva un aviso encima: el documento se conserva, pero no se
 *     sirve en silencio una dirección que ya no lleva al token.
 *  2. EL REPARTO SUMA 100,01 %. 50 + 20 + 10 + 15 + 5 + 0,01. Se reproduce tal
 *     cual —es lo que dice el documento oficial— y se deja anotado.
 *  3. LA HOJA DE RUTA DEL PDF SON 20 FASES de febrero de 2024, y la sección
 *     Roadmap del sitio tiene siete hitos hasta 2027. No son la misma hoja de
 *     ruta. Aquí va la del documento, fechada, para que nadie las confunda.
 * ─────────────────────────────────────────────────────────────────────────
 */

/*
 * SE TRADUCE LO QUE DICE, NO LO QUE CONVIENE.
 *
 * El documento dice «maintaining investor trust». Mi primera version puso «la
 * confianza de quien participa», que suena mejor con el registro del resto del
 * sitio —el portal evita deliberadamente el lenguaje de inversion— y NO es lo
 * que dice el original. Traducir no es corregir: si el documento habla de
 * inversores, la traduccion habla de inversores, y cambiar el registro de un
 * documento oficial al traducirlo es meterle una opinion sin firmarla.
 *
 * Si ese registro hay que cambiarlo, se cambia en el documento y en las once
 * versiones a la vez, con quien lo firma delante.
 */
export interface SeccionWhitepaper {
  /** Rótulo de la sección, tal como titula el documento. */
  titulo: string
  /** Párrafos, en orden. */
  parrafos: readonly string[]
}

export const WHITEPAPER_SECCIONES: readonly SeccionWhitepaper[] = [
  {
    titulo: 'Resumen',
    parrafos: [
      'En una época en la que la tecnología sigue transformando el paisaje de nuestra vida diaria, el A.I. Genesis Official Token surge como un faro de innovación, conexión y capacidad de acción. Con un suministro fijo de 111 millones de tokens y alojado con seguridad en la Binance Smart Chain, este token se sostiene como un pilar de gobernanza digital.',
      'El Genesis Official Token sirve de cauce para multitud de operaciones virtuales: loterías cripto, participación en el metaverso, ecosistemas NFT, actividades de minería, videojuegos, plataformas de apuestas, servicios de intercambio y una cartera cripto nativa basada en EVM.',
      'En este whitepaper profundizamos en el potencial transformador del A.I. Genesis Official Token, y exploramos cómo tiende un puente entre el terreno de la inteligencia artificial y la experiencia humana, revolucionando las transacciones a través de la cadena de bloques.',
    ],
  },
  {
    titulo: 'Introducción',
    parrafos: [
      'El A.I. Genesis Official Token representa la culminación de tecnología de vanguardia y ofrece una vía singular para fundir la inteligencia artificial con la interacción humana. En un mundo donde el paisaje digital se expande a un ritmo sin precedentes, este token se presenta como el pegamento que une esos dos mundos.',
    ],
  },
  {
    titulo: 'Tokenomics',
    parrafos: [
      'El Genesis Token tiene un suministro total de 111 millones de tokens. Su permanencia queda subrayada por la ausencia de mecanismos de emisión o quema, lo que asegura la integridad del ecosistema y mantiene la confianza del inversor.',
    ],
  },
  {
    titulo: 'Gobernanza',
    parrafos: [
      'Este token es una herramienta de gobernanza. Quienes poseen el A.I. Genesis Official Token ejercen influencia sobre las decisiones que dan forma al ecosistema, lo que favorece un desarrollo descentralizado y guiado por la comunidad.',
    ],
  },
  {
    titulo: 'Versatilidad en operaciones virtuales',
    parrafos: [
      'El A.I. Genesis Official Token permite participar en multitud de operaciones virtuales: desde entrar en loterías cripto y sumergirse en el metaverso hasta adquirir NFT, contribuir a labores de minería, disfrutar de experiencias de juego, realizar apuestas y facilitar intercambios en la cartera cripto nativa basada en EVM.',
    ],
  },
  {
    titulo: 'Tender el puente',
    parrafos: [
      'En su núcleo, el A.I. Genesis Official Token sirve de puente entre las capacidades ilimitadas de la inteligencia artificial y el deseo humano de transacciones fluidas, seguras y eficientes. Al aprovechar la potencia de la tecnología blockchain, crea un ecosistema donde los servicios guiados por IA interactúan sin fricción con las personas.',
    ],
  },
  {
    titulo: 'Facilitar las transacciones',
    parrafos: [
      'En un mundo donde la confianza es primordial, el A.I. Genesis Official Token establece un entorno en el que las transacciones se realizan con transparencia y seguridad. La cadena de bloques asegura la integridad de todas las interacciones, mientras que los servicios potenciados por IA las hacen más eficientes y fáciles de usar.',
    ],
  },
  {
    titulo: 'Conclusión',
    parrafos: [
      'Situados en el cruce entre la tecnología y la experiencia humana, el A.I. Genesis Official Token simboliza una nueva era de innovación. Con su suministro fijo, sus capacidades de gobernanza y su versatilidad en operaciones virtuales, está preparado para transformar la forma en que nos relacionamos con la inteligencia artificial y realizamos transacciones. No es meramente un token: es un cauce hacia el futuro, donde las fronteras entre el mundo digital y el físico se difuminan y el potencial humano se amplifica con la fuerza de la IA.',
      'Bienvenido al génesis de una nueva era.',
    ],
  },
] as const

/**
 * REPARTO DEL SUMINISTRO, tal como lo publica el documento.
 *
 * SUMA 100,01 %. No es un error de transcripción: es lo que dice el whitepaper
 * oficial. Se reproduce sin corregir —cambiar una cifra de un documento oficial
 * no es tarea de quien lo traduce— y la página lo advierte en voz alta, porque
 * lo contrario sería esconderlo.
 */
export const WHITEPAPER_REPARTO = [
  { pct: '50%', etiqueta: 'Bloqueado' },
  { pct: '20%', etiqueta: 'Recompensas' },
  { pct: '15%', etiqueta: 'Staking' },
  { pct: '10%', etiqueta: 'Tesorería' },
  { pct: '5%', etiqueta: 'Equipo corporativo' },
  { pct: '0,01%', etiqueta: 'Liquidez' },
] as const

/**
 * LAS VEINTE FASES del documento v1.1 (febrero de 2024).
 *
 * NO son la hoja de ruta vigente: la sección Roadmap del sitio tiene siete
 * hitos que llegan a 2027 y ésta se quedó en 2024. Va aquí, fechada y en su
 * sitio, porque forma parte del documento que se está publicando — y ocultar
 * media página de un documento oficial al traducirlo no es traducir.
 *
 * Los nombres propios (PancakeSwap, P2B, Certik, Dextool) no se traducen.
 */
export const WHITEPAPER_FASES: readonly string[] = [
  'Desarrollo del Genesis Core',
  'Desarrollo del AiG Token',
  'Integración con PancakeSwap',
  'Integración con P2B',
  'Alta en Bitcoin Talk',
  'AiG disponible en Dextool',
  'AiG se une a Dexgroup',
  'Auditoría de Certik aprobada',
  'Lanzamiento de la G11 Wallet',
  'Desarrollo de la AiG Academy',
  'Desarrollo del metaverso',
  'Minería de NFT',
  'Desarrollo de Trasy',
  'Lanzamiento del portal AiG News',
  'Evento en Dubái y Latinoamérica',
  'Lanzamiento de la tarjeta y los cajeros',
  'Génesis Exchange',
  'Red social AIG AiLink',
  'Blockchain propia',
  'Segunda capa de contratos inteligentes',
] as const
