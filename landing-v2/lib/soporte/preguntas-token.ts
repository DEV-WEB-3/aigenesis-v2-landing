import { AIG_TOKEN_CONTRACT, OFFICIAL_BSCSCAN } from '@/lib/official-links'
import type { Pregunta } from './tipos'

/**
 * PREGUNTAS DEL AiG TOKEN Y LA TOKENOMICS.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALE ESTE CONTENIDO. Del material OFICIAL publicado (22-ago-2026):
 *   · `AiGenesis_Token_OFFICIAL_WHITE_PAPER_V1` (supply, contrato, gobernanza)
 *   · `AiGenesis_press_v5.0` (emisión decreciente, mining/booster/staking, rangos)
 *
 * Regla del descargo técnico del propio material, que se respeta al pie:
 * AiGénesis es un ECOSISTEMA TECNOLÓGICO basado en blockchain, NO una entidad
 * financiera. Los porcentajes son TASAS DE EMISIÓN PROGRAMADA de AiG Token, no
 * un resultado en dólares ni un producto bancario. No se presenta
 * ninguna cifra como resultado seguro. Cada ficha informa la tasa,
 * jamás promete un resultado en dólares.
 */
export const PREGUNTAS_TOKEN: readonly Pregunta[] = [
  /* ════════════ EL TOKEN ════════════ */
  {
    id: 'tok-que-es',
    proyecto: 'ecosistema',
    categoria: 'Token AiG',
    pregunta: '¿Qué es el AiG Token?',
    respuesta:
      'Es el activo nativo del ecosistema AiGenesis, sobre la Binance Smart Chain (BSC). Está en cada operación: se genera a diario como recompensa de minería, se bloquea en staking para rendimientos, circula entre usuarios como medio de intercambio, y se recibe en referidos, binario y bonos de rango. Tiene un supply FIJO de 111 millones, sin emisión nueva ni quema.',
    sinonimos: [
      'que es el aig', 'que es el token', 'moneda de genesis', 'token nativo',
      'que es el aig token',
      'que es aigenesis token',
      'para que sirve el aig',
    ],
    fuente: 'landing',
  },
  {
    id: 'tok-supply',
    proyecto: 'ecosistema',
    categoria: 'Token AiG',
    pregunta: '¿Cuántos AiG hay en total? ¿Se pueden crear más?',
    respuesta:
      'El supply es fijo: 111 millones de AiG, y no cambia. El contrato no tiene función de acuñar (mint) ni de quemar (burn), así que nadie puede crear tokens nuevos ni destruir los existentes. Esa permanencia es a propósito: da previsibilidad al ecosistema.',
    sinonimos: [
      'cuantos aig hay', 'supply', 'cuanto es el supply', 'total supply', 'se pueden crear mas aig',
      'hay mas tokens', '111 millones', 'mint', 'burn', 'quema de tokens',
    ],
    fuente: 'landing',
  },
  {
    id: 'tok-contrato',
    proyecto: 'ecosistema',
    categoria: 'Token AiG',
    pregunta: '¿Cuál es el contrato oficial del AiG Token?',
    /*
     * LA DIRECCIÓN SE DERIVA, NO SE ESCRIBE.
     *
     * Aquí había otra: `0x4b4594bfe661919a8e2373eb175004da2989a479`, distinta de
     * la de `official-links.ts`. Las DOS existen en BSC, las dos se llaman
     * «A.I. Genesis Official», las dos con símbolo AIG y 111 millones de supply
     * — comprobado preguntándole a la cadena, no a un explorador.
     *
     * Lo que las separa es cuál usa el dinero: el `.env` de producción del
     * portal lleva la de `official-links.ts`, y la otra NO APARECE en ninguna
     * parte del backend. Sólo estaba aquí.
     *
     * Y estaba viva, diciendo «desconfía de cualquier otra dirección» mientras
     * daba una que el sistema no usa: o sea, mandando a desconfiar de la buena.
     *
     * Derivarla de la fuente única hace que la contradicción no pueda volver.
     * Dos copias de una dirección de contrato se desincronizan igual que dos
     * listas de URLs, sólo que aquí el coste es que alguien compre otro token.
     */
    respuesta:
      `El contrato oficial en BSC es ${AIG_TOKEN_CONTRACT}. Puedes verificarlo en BscScan: ${OFFICIAL_BSCSCAN.TOKEN.replace('https://', '')}. Desconfía de cualquier otra dirección — un contrato distinto NO es el AiG oficial, aunque se llame parecido y aunque tenga el mismo símbolo.`,
    sinonimos: [
      'contrato del aig', 'contrato oficial', 'direccion del token', 'contract address',
      'cual es el contrato', 'token address', 'bscscan', 'donde veo el contrato',
      'como agrego el aig a metamask', 'importar token',
    ],
    fuente: 'landing',
    enlace: OFFICIAL_BSCSCAN.TOKEN,
  },
  {
    id: 'tok-distribucion',
    proyecto: 'ecosistema',
    categoria: 'Token AiG',
    pregunta: '¿Cómo se distribuye el supply del AiG?',
    respuesta:
      'De los 111 millones: 50% bloqueado (locked), 20% recompensas, 15% staking, 10% tesorería (treasury), 5% equipo corporativo y 0.01% liquidez. La distribución está pensada para sostener las recompensas del ecosistema a largo plazo.',
    sinonimos: [
      'distribucion del supply', 'como se reparte el aig', 'tokenomics', 'cuanto esta bloqueado',
      'locked', 'treasury', 'reparto de tokens', 'asignacion',
    ],
    fuente: 'landing',
  },
  {
    id: 'tok-emision-decreciente',
    proyecto: 'ecosistema',
    categoria: 'Token AiG',
    pregunta: '¿La emisión de AiG baja con el tiempo?',
    respuesta:
      'Sí, la emisión se reduce de forma programada año a año: 11% el año 1, 11% el año 2, 8% el año 3, 6% el año 4, 4% el año 5 y 2% el año 6 (tasas mensuales de emisión). Menor emisión significa mayor escasez con el tiempo. Es una tasa de emisión del protocolo, no una promesa de resultado.',
    sinonimos: [
      'la emision baja', 'reduccion de emision', 'cuanto emite por ano', 'inflacion del aig',
      'emision decreciente', 'protocolo de emision', 'escasez',
    ],
    fuente: 'landing',
  },
  {
    id: 'tok-gobernanza',
    proyecto: 'ecosistema',
    categoria: 'Token AiG',
    pregunta: '¿El AiG sirve para votar o gobernar el ecosistema?',
    respuesta:
      'Sí. El AiG Token es una herramienta de gobernanza: quienes lo tienen pueden influir en decisiones que dan forma al ecosistema, con un enfoque descentralizado y guiado por la comunidad. Las novedades de gobernanza se comunican por los canales oficiales.',
    sinonimos: [
      'gobernanza', 'votar', 'governance', 'decidir en genesis', 'dao', 'gobernar',
    ],
    fuente: 'landing',
  },
  {
    id: 'tok-red-bsc',
    proyecto: 'ecosistema',
    categoria: 'Token AiG',
    pregunta: '¿En qué red está el AiG? ¿Qué necesito para operar?',
    respuesta:
      'El AiG vive en la Binance Smart Chain (BSC / BEP-20). Para operar necesitas una wallet Web3 compatible con BEP-20 (como SafePal, MetaMask u otra), un poco de BNB para las comisiones de red (gas fee) y USDT (BEP-20) para tu aporte. Todo es de auto-custodia: tú controlas tus claves privadas.',
    sinonimos: [
      'en que red esta', 'que red es', 'bsc', 'bep20', 'binance smart chain', 'que wallet uso',
      'safepal', 'metamask', 'que necesito para operar', 'gas fee', 'bnb para comisiones',
      'red del token', 'cadena',
    ],
    fuente: 'landing',
  },
  {
    id: 'tok-no-es-financiera',
    proyecto: 'ecosistema',
    categoria: 'Token AiG',
    pregunta: '¿AiGenesis es un banco o algo garantizado?',
    respuesta:
      'No. AiGenesis es un ecosistema tecnológico basado en blockchain — no una institución financiera, bancaria ni casa de valores. Participar implica adquirir tecnología de minado e interactuar con contratos inteligentes que se ejecutan solos. Los porcentajes son tasas de emisión programada del token, no un producto bancario ni un resultado asegurado en dólares; los criptoactivos son volátiles por naturaleza.',
    sinonimos: [
      'es un banco', 'es un negocio', 'es legal', 'es una estafa', 'es confiable',
      'esta garantizado', 'es rentable',
      'es una inversion',
      'es seguro invertir',
      'me garantizan ganancia',
    ],
    fuente: 'landing',
  },
]
