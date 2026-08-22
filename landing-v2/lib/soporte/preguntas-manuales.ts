import type { Pregunta } from './tipos'

/**
 * MANUALES PASO A PASO — registro, acceso, minería, booster, staking, reclamo.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALE. Del material oficial `AiGenesis_press_v5.0` (22-ago-2026) más
 * lo ya verificado en el corpus. Son los procedimientos que la gente pide en
 * el canal como «paso a paso».
 *
 * REGLA DEL DESCARGO, al pie: los porcentajes son tasas de EMISIÓN programada
 * del AiG Token, no un resultado en dólares. Cada
 * manual informa el procedimiento y la tasa; jamás promete un resultado.
 * Las cifras de ejemplo son las del propio material («activas $100 → recibes
 * hasta $X en AiG»), presentadas como ejemplo del material, no como promesa.
 */
export const PREGUNTAS_MANUALES: readonly Pregunta[] = [
  /* ════════════ UNIRSE / REGISTRO ════════════ */
  {
    id: 'man-como-unirse',
    proyecto: 'genesis',
    categoria: 'Empezar',
    pregunta: '¿Cómo me uno al ecosistema? Paso a paso',
    respuesta:
      'Necesitas cuatro cosas y estos pasos: 1) Una wallet Web3 compatible con BEP-20 (SafePal, MetaMask u otra). 2) Fondearla con BNB para el gas y USDT (BEP-20) para tu aporte — desde 20 USDT. 3) Entrar con el enlace de referido de quien te invitó (sin ese enlace no se abre el registro). 4) Elegir AiG Mining, Booster o ambos, y seguir tu distribución diaria. Genesis es solo por invitación, así que el enlace del referido es imprescindible.',
    sinonimos: [
      'como me uno', 'como empiezo', 'como me registro', 'primeros pasos',
      'como me uno al ecosistema',
      'como entro al ecosistema',
      'unirme al ecosistema',
      'quiero unirme al ecosistema',
      'ingresar al ecosistema',
      'como empezar', 'que necesito para empezar', 'como ingreso', 'quiero unirme', 'como participo',
      'desde cuanto puedo empezar', 'desde 20 usdt',
      'inversion minima',
    ],
    fuente: 'landing',
    enlace: 'https://conect.aigenesis.io/login',
  },

  /* ════════════ MINERÍA ════════════ */
  {
    id: 'man-activar-mineria',
    proyecto: 'genesis',
    categoria: 'Minería',
    categoriaIncidencia: 'mining',
    pregunta: '¿Cómo activo la minería (AiG Mining)? Paso a paso',
    respuesta:
      'La minería genera AiG Token a diario. Pasos: 1) Entra a tu cuenta y ve a AiG Mining. 2) Elige un pack (desde 20 USDT). 3) Confirma la compra desde tu wallet (necesitas BNB para el gas). 4) A partir de ahí recibes emisión mensual —desde 8%— acreditada diariamente en AiG Token, hasta completar el 250% del pack. Ejemplo del material: minas con 100 USDT y el pack finaliza al llegar a 250 en AiG Token. Cuando termina, puedes retirar tus AiG o recomprar en más packs para acelerar. El 8% es una tasa de emisión del protocolo, no un resultado asegurado en dólares.',
    sinonimos: [
      'como activo la mineria', 'activar mineria', 'como mino', 'como empiezo a minar', 'comprar pack',
      'como funciona la mineria', 'aig mining', 'paso a paso mineria', 'como se activa el minado',
      'cuanto rinde la mineria', 'el 250%', 'hasta cuanto mina',
    ],
    fuente: 'landing',
  },

  /* ════════════ BOOSTER ════════════ */
  {
    id: 'man-activar-booster',
    proyecto: 'genesis',
    categoria: 'Booster y staking',
    categoriaIncidencia: 'booster',
    pregunta: '¿Cómo activo el Booster? Paso a paso',
    respuesta:
      'El Booster acelera tu crecimiento con una emisión mayor. Pasos: 1) En tu cuenta ve a AiG Booster. 2) Se activa con una mezcla: 80% en USDT + 20% en AiG Token. 3) Confirma desde tu wallet (con BNB para el gas). 4) Las recompensas se acumulan a diario en AiG Token —hasta 14% mensual— hasta completar el 200% del pack, y se convierten a USDT para retiro por el P2P. Ejemplo del material: activas 100 y recibes hasta 200 en AiG Token. Si pagaste y no se refleja, no repitas la compra: guarda el hash y aplica el paso a paso del reclamo.',
    sinonimos: [
      'como activo el booster', 'activar booster', 'como funciona el booster', 'aig booster',
      'paso a paso booster', '80/20', '80% usdt 20% aig', 'como se activa el booster',
      'cuanto rinde el booster', 'el 200%', 'rebooster', 'reinvertir booster',
    ],
    fuente: 'landing',
  },

  /* ════════════ STAKING ════════════ */
  {
    id: 'man-activar-staking',
    proyecto: 'genesis',
    categoria: 'Booster y staking',
    pregunta: '¿Cómo hago staking de mis AiG? Paso a paso',
    respuesta:
      'El staking bloquea tus AiG Token por un período y genera beneficios en AiG mientras haces holding. Pasos: 1) En tu cuenta ve a Staking. 2) Elige el período: cuanto más largo, mayor la tasa mensual — 1 mes 6%, 3 meses 8%, 6 meses 10%, 9 meses 12%, 12 meses 15%. 3) Confirma el bloqueo desde tu wallet. 4) Recibes los beneficios generados en AiG Token durante el período. Es la estrategia para quien acumula a largo plazo. Las tasas son de emisión del protocolo, no un resultado asegurado en dólares.',
    sinonimos: [
      'como hago staking', 'activar staking', 'como funciona el staking', 'bloquear mis aig',
      'aig staking', 'paso a paso staking', 'cuanto paga el staking', 'periodos de staking',
      'holding', 'stakear', 'cuanto rinde el staking', 'unstaking', 'sacar del staking',
    ],
    fuente: 'landing',
  },

  /* ════════════ RECLAMO ════════════ */
  {
    id: 'man-reclamar',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'claim',
    pregunta: '¿Cómo reclamo mis recompensas? Paso a paso',
    respuesta:
      'Las recompensas de minería y booster se acumulan a diario en AiG Token; reclamar las lleva a tu balance disponible. Pasos: 1) En tu cuenta, en la sección de recompensas, pulsa Reclamar. 2) Para pasar de USDT a AiG puedes reclamar desde 10 USDT acumulados en adelante. 3) Confirma. 4) El reclamo puede tardar de 1 minuto a hasta 72 horas en llegar a tu wallet, según los procesos de verificación y seguridad — si estás en ese plazo, está en curso; abrir otro reclamo no lo acelera. Guarda el detalle de la operación por si necesitas soporte.',
    sinonimos: [
      'como reclamo', 'como reclamar', 'reclamar recompensas', 'paso a paso reclamo', 'como retiro',
      'reclamar mis aig', 'claim', 'reclamar balance', 'desde cuanto puedo reclamar', 'minimo para reclamar',
      'cuanto tarda el reclamo', '72 horas', 'como saco mis recompensas',
    ],
    fuente: 'owner',
  },

  /* ════════════ RED: REFERIDO / BINARIO / RANGOS ════════════ */
  {
    id: 'man-referido-binario',
    proyecto: 'genesis',
    categoria: 'Red y compensación',
    pregunta: '¿Cómo funcionan el referido directo y el binario?',
    respuesta:
      'Son dos aceleradores de tu minería. Referido directo (AiG Start): por cada compra de minería de un invitado tuyo, tu minería acelera un 11% al instante, y vuelve a acelerar cada vez que recompra. Binario (AiG Binary): consigues un invitado en tu lado izquierdo y otro en el derecho, y el sistema acelera un 11% calculado sobre el volumen del lado con menor actividad — por eso conviene equilibrar ambos lados. No hay límite geográfico: tu comunidad puede estar en cualquier país.',
    sinonimos: [
      'como funciona el referido', 'referido directo', 'binario', 'como funciona el binario',
      'aig start', 'aig binary', 'el 11%', 'lado izquierdo derecho', 'red de referidos',
      'como invito', 'plan de referidos', 'pierna izquierda derecha',
    ],
    fuente: 'landing',
  },
  {
    id: 'man-rangos',
    proyecto: 'genesis',
    categoria: 'Red y compensación',
    pregunta: '¿Qué son los rangos (del Start al G11)?',
    respuesta:
      'Son niveles que alcanzas acumulando puntos en tu red, y cada uno da un premio en USDT más un NFT. Van desde G1 Bronze (1.000 puntos, 50 USDT) subiendo por Silver, Gold, Zappire, Ruby, Emerald, Diamond, Blue Diamond, Black Diamond, Red Diamond, hasta G11 (5.000.000 de puntos, 500.000 USDT). Los premios de rango se comunican y entregan por los canales oficiales del ecosistema.',
    sinonimos: [
      'que son los rangos', 'rangos', 'del start al g11', 'g11', 'niveles', 'como subo de rango',
      'premios de rango', 'rank bonus', 'diamond', 'cuanto dan por rango', 'puntos para g11',
    ],
    fuente: 'landing',
  },
]
