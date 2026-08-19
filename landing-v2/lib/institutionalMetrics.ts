/**
 * Fuente única de métricas mostradas en la landing.
 * Validar con producto / datos on-chain antes de producción en aigenesis.io.
 */
/**
 * Estado de revisión de las métricas.
 *
 * Estuvo en `pending_product_validation` desde el principio, y estaba bien
 * puesto: al revisarlas una era FALSA —un precio de $0.0042 para un token con
 * market cap $0.00 en cadena— y otra se quedaba corta cinco veces.
 *
 * Pasa a `validated_2026_08_16`. Las del token están comprobadas en cadena; las
 * de Trust y Marketplace, confirmadas por el owner como valores de alcance.
 * La fecha va en el nombre a propósito: una validación sin fecha no caduca, y
 * estas cifras sí.
 */
export const METRICS_REVIEW_STATUS = 'validated_2026_08_16' as const

export type CounterMetric = {
  kind: 'counter'
  to: number
  suffix: string
  label: string
  decimals?: number
}

export type StaticMetric = {
  kind: 'static'
  value: string
  label: string
}

export type InstitutionalMetric = CounterMetric | StaticMetric

/**
 * Trust — InstitutionalMetrics.tsx
 *
 * LA CONTRADICCIÓN ERA DE ETIQUETA, NO DE DATO. Resuelto el 16-ago-2026.
 *
 * Esta sección decía «12+ Países» y la de Marketplace «190+ PAÍSES»: misma
 * palabra, misma página, y un factor de dieciséis entre las dos. Parecía que una
 * estaba mal.
 *
 * No lo estaban. Miden cosas distintas: aquí, los países donde el proyecto tiene
 * PRESENCIA; allí, hasta dónde ALCANZA el catálogo de CJ. Confirmado por el
 * owner: son valores de alcance y están creciendo hacia ellos.
 *
 * Así que el arreglo no toca ningún número — toca la palabra. Dos métricas que
 * miden cosas distintas no pueden llamarse igual, y menos si una es de envío y
 * la otra de comunidad: el visitante las resta y decide que alguien miente.
 *
 * El calificador va en la de MARKETPLACE («Países de alcance»), que es la que
 * hace la afirmación grande. Ésta se queda en «Países» a secas por una razón
 * medida: «Países con presencia» envolvía a dos líneas en su celda —91 px— y
 * descuadraba la fila frente a las otras tres, que van a una. Un rótulo que
 * rompe la maquetación para explicar algo que ya explica el otro no compensa.
 *
 * «Comunidad» y «Uptime» quedan confirmados por el owner. La diferencia con las
 * métricas del token es que aquéllas se pueden comprobar en cadena y éstas se
 * sostienen en el dato interno: si cambian, hay que venir a este archivo.
 */
export const TRUST_INSTITUTIONAL_METRICS: readonly InstitutionalMetric[] = [
  { kind: 'counter', to: 100, suffix: 'K+', label: 'Comunidad' },
  { kind: 'counter', to: 12, suffix: '+', label: 'Países' },
  /*
   * 2023, NO 2019. Correccion del owner (19-ago-2026): la empresa y la vision
   * arrancan en 2023.
   *
   * El roadmap ya se habia corregido en su momento y este dato se quedo atras,
   * asi que durante un tiempo la misma pagina afirmaba dos fundaciones
   * distintas: la linea de tiempo abria en 2023 y la metrica decia 2019. Un dato
   * institucional que se contradice consigo mismo cuesta mas credibilidad que no
   * ponerlo.
   */
  { kind: 'static', value: '2023', label: 'Fundado' },
  { kind: 'counter', to: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
] as const

/** Token — SceneToken */
export type TokenDisplayMetric =
  | { key: string; label: string; static: string }
  | { key: string; label: string; to: number; suffix: string }

/**
 * Métricas del token — TODAS comprobables en cadena.
 *
 * MEDIDO EL 16-AGO-2026 en bscscan.com/token/0xC1F0768587Dc889e494C171B155C60B4e9a13F08
 * y contrastado con la API de Dexscreener. Estos números están A FUEGO: si el
 * contrato se mueve, hay que volver a medirlos aquí. La fecha está escrita a
 * propósito para que se vea cuándo caducan.
 *
 * QUÉ SE CORRIGIÓ Y POR QUÉ
 *
 * 1. `PRECIO: $0.0042` — el número era falso y la etiqueta también.
 *
 *    BSCScan da «Onchain Market Cap: $0.00» y sin precio; la API de Dexscreener
 *    devuelve `pairs: null` para el contrato. El instrumento se validó contra
 *    CAKE, que sí devuelve 30 pares, así que el vacío es un resultado y no un
 *    fallo de la sonda. Y lo peor: ESTA MISMA SECCIÓN lleva un botón «Ver en
 *    BSCScan», o sea que se desmentía sola en un clic.
 *
 *    El valor correcto lo confirmó el owner: **1 AIG = 23,50 USD**, que es la
 *    referencia de uso interno entre miembros y mineros para intercambiar
 *    productos y servicios. NO es una cotización: no hay pool público de
 *    liquidez.
 *
 *    Por eso la etiqueta es «VALOR INTERNO» y no «PRECIO», y por eso la escena
 *    lleva una línea que lo dice con todas las letras. Un número de 23,50 sin
 *    ese contexto, junto a un botón que verifica mercado, se lee como una
 *    cotización — y esa lectura sería falsa aunque el número sea correcto.
 *
 * 2. `HOLDERS: 2847+` — eran 15.174. Se quedaba corto CINCO VECES en el mejor
 *    número que tiene el proyecto. Se deja en «15.000+» y no en la cifra exacta
 *    porque los holders sólo crecen: así el número envejece hacia la verdad en
 *    vez de contra ella.
 *
 * 3. `SUPPLY 111M` y `NETWORK BSC` — correctos, verificados sin cambios.
 *
 * Que el contrato está verificado no ocupa un hueco propio: lo comprueba el
 * botón «Ver en BSCScan» que ya está justo debajo.
 */
export const TOKEN_DISPLAY_METRICS: readonly TokenDisplayMetric[] = [
  { key: 'internal', label: 'VALOR INTERNO', static: '$23.50' },
  // `15` + `K+`, y no `15000`, porque el contador imprime con `toFixed()` y no
  // pone separador de millares: saldría «15000+». Poner un `toLocaleString`
  // general no vale — convertiría el «2023» de Trust en «2.023».
  { key: 'holders', label: 'HOLDERS', to: 15, suffix: 'K+' },
  { key: 'supply', label: 'SUPPLY TOTAL', to: 111, suffix: 'M' },
  { key: 'network', label: 'RED', static: 'BSC' },
] as const

/** G-Pulse — SceneGPulse */
export const GPULSE_STATS = [
  { to: 847, suffix: ' /día', label: 'SEÑALES DIARIAS' },
  { to: 3, suffix: ' activas', label: 'MESAS' },
  { to: 94, suffix: '%', label: 'UPTIME' },
] as const

/** Marketplace — SceneMarketplace */
/**
 * Marketplace — SceneMarketplace
 *
 * `PAÍSES DE ALCANCE` y no `PAÍSES`: son hasta dónde llega el catálogo de CJ,
 * no la lista habilitada hoy. La palabra importa en una tienda — un cliente que
 * lee «190 países» y no puede pedir en el suyo no piensa que está creciendo,
 * piensa que le mintieron. Ver la nota de Trust: allí «Países» son otra cosa.
 */
export const MARKETPLACE_STATS = [
  { to: 500, suffix: 'K+', label: 'PRODUCTOS' },
  { to: 190, suffix: '+', label: 'PAÍSES DE ALCANCE' },
  // Se retiró «3 · MÉTODOS DE PAGO». La descripción de la sección ya NOMBRA los
  // tres —AIG, USDT o tarjeta—, y saber cuáles vale más que saber cuántos.
  // Contar lo que la frase de al lado ya enumera es decir dos veces lo mismo.
] as const

/** Community — SceneCommunity */
export const COMMUNITY_STATS = [
  { to: 5000, suffix: '+', label: 'MIEMBROS ACTIVOS' },
  { to: 12, suffix: 'M USDT', label: 'DISTRIBUIDOS' },
  { to: 12, suffix: '+', label: 'PAÍSES' },
] as const

/** Technology — SceneTechnology */
export const TECHNOLOGY_STATS = [
  { value: '99.9%', label: 'UPTIME' },
  { value: '< 200ms', label: 'LATENCIA' },
  { value: '24/7', label: 'MONITOREO' },
] as const

/** Mining — SceneMining (badges, no animated counters) */
export const MINING_BADGES = [
  { value: '24h', label: 'Ciclo de emisión', mono: true, icon: 'cycle' as const },
  { value: 'On-chain', label: 'Trazabilidad', mono: false, icon: 'chain' as const },
  { value: 'BSC', label: 'Red', mono: true, icon: 'network' as const },
] as const
