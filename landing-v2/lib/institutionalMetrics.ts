/**
 * Fuente única de métricas mostradas en la landing.
 * Validar con producto / datos on-chain antes de producción en aigenesis.io.
 */
export const METRICS_REVIEW_STATUS = 'pending_product_validation' as const

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
 * ⚠ SIN VERIFICAR, Y CON UNA CONTRADICCIÓN INTERNA.
 *
 * Esta sección dice «12+ Países» y la de Marketplace dice «190+ PAÍSES», en la
 * misma página y sobre el mismo concepto. Una de las dos está mal y no se puede
 * decidir cuál desde este repositorio: el listado real de países lo fija el
 * backend del marketplace según el flete disponible.
 *
 * Se deja como está a propósito. Cambiar una cifra de alcance comercial sin
 * poder medirla sería sustituir un número equivocado por otro. Queda anotado
 * aquí y reportado; lo mismo vale para «100K+ Comunidad» y «99.9% Uptime», que
 * tampoco tienen fuente en el repo.
 *
 * Referencia de lo que SÍ está medido: las métricas del token de más abajo,
 * comprobadas en cadena el 16-ago-2026.
 */
export const TRUST_INSTITUTIONAL_METRICS: readonly InstitutionalMetric[] = [
  { kind: 'counter', to: 100, suffix: 'K+', label: 'Comunidad' },
  { kind: 'counter', to: 12, suffix: '+', label: 'Países' },
  { kind: 'static', value: '2019', label: 'Fundado' },
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
  // general no vale — convertiría el «2019» de Trust en «2.019».
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
export const MARKETPLACE_STATS = [
  { to: 500, suffix: 'K+', label: 'PRODUCTOS' },
  { to: 190, suffix: '+', label: 'PAÍSES' },
  { to: 3, suffix: '', label: 'MÉTODOS DE PAGO' },
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
