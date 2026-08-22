import type { Pregunta } from './tipos'

/**
 * OPERACIONES DE DINERO Y HERRAMIENTAS — segunda tanda de la base ampliada.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALE. De los flujos DEDUCIDOS DEL CÓDIGO (`flujos-de-dinero.ts`,
 * `p2p-mecanica.ts`) y del material oficial `press_v5.0` (G-Oracle, G-Pulse,
 * roadmap). Son los procedimientos y datos que más ticket ahorran porque hoy
 * la gente los repite por no saber qué pasa después de pulsar.
 */
export const PREGUNTAS_OPERACIONES: readonly Pregunta[] = [
  /* ════════════ LIQUIDEZ / P2P ════════════ */
  {
    id: 'op-depositar-liquidez',
    proyecto: 'genesis',
    categoria: 'P2P',
    categoriaIncidencia: 'deposito',
    pregunta: '¿Cómo publico liquidez para vender en el P2P?',
    respuesta:
      'En P2P → Mi Perfil → Liquidez Marketplace → «Depositar liquidez». Pasos: 1) Necesitas sesión activa, MetaMask en red BSC y saldo real de USDT o AIG (esto mueve dinero de verdad). 2) Elige token (solo USDT o AIG) e importe. 3) «Depositar con MetaMask» y firma. 4) Al confirmarse en cadena verás «Depósito registrado» con el hash. A partir de ahí sales publicado en el libro. Si no se refleja en un rato, repórtalo con el hash — nunca repitas el depósito, movería el dinero otra vez.',
    sinonimos: [
      'publicar liquidez', 'depositar liquidez', 'como vendo en el p2p', 'poner liquidez',
      'como pongo a la venta', 'liquidez marketplace', 'depositar en el libro', 'como publico para vender',
    ],
    fuente: 'codigo',
  },
  {
    id: 'op-retirar-liquidez',
    proyecto: 'genesis',
    categoria: 'P2P',
    categoriaIncidencia: 'retiro',
    pregunta: '¿Cómo retiro mi liquidez del P2P? Retiré y no veo la wallet',
    respuesta:
      'En P2P → Mi Perfil → Liquidez Marketplace → «Retirar». Elige entre tu liquidez en USDT o en AIG, confirma cuál y cuánto, y pulsa «Confirmar retiro». DATO CLAVE: este paso NO abre MetaMask ni pide firma —la propia pantalla lo dice—. Que no aparezca la cartera no significa que no se envió: es una SOLICITUD que PAI procesa después, devolviendo los fondos a tu wallet registrada. Entre la solicitud y la llegada hay una espera que la interfaz no controla. No lo repitas: comprueba el estado antes.',
    sinonimos: [
      'retirar liquidez', 'como retiro mi liquidez', 'sacar liquidez', 'retirar del p2p',
      'retire y no llega', 'no me abrio metamask al retirar', 'no pide firma el retiro',
      'como saco mi liquidez', 'retirar del libro', 'recuperar mi liquidez',
    ],
    fuente: 'codigo',
  },
  {
    id: 'op-tomar-oferta',
    proyecto: 'genesis',
    categoria: 'P2P',
    categoriaIncidencia: 'p2p',
    pregunta: '¿Cómo compro o tomo una oferta en el P2P?',
    respuesta:
      'En P2P → Marketplace, pulsa «Tomar» en la fila que te interese. Antes de operar, mira el alias, el país y el número de transacciones del anunciante: es la única señal de confianza que da la pantalla. Necesitas sesión activa y MetaMask con fondos en la red correcta. El paso final es firmar la transferencia; lo que viene después es solo avisar al servidor de que ya pagaste. Si sale «No se pudo resolver el ID del comerciante», recarga el libro P2P — se arregla recargando, no reintentando a ciegas.',
    sinonimos: [
      'como compro en el p2p', 'tomar una oferta', 'como tomo una oferta', 'comprar aig p2p',
      'como opero en el p2p', 'tomar oferta', 'comprar en el libro', 'como pago una oferta',
    ],
    fuente: 'codigo',
  },
  {
    id: 'op-donde-esta-mi-dinero',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    pregunta: '¿Dónde está mi dinero? No cuadran mis saldos',
    respuesta:
      'Tu dinero puede estar en cuatro sitios distintos, y confundirlos es la causa más común de «no cuadra»: 1) tu wallet on-chain (lo que controlas con MetaMask); 2) el crédito interno del sistema; 3) la Liquidez Marketplace (lo que publicaste en el P2P y aún no retiraste); y 4) el saldo de recompensas por reclamar. Cada uno se ve por separado en tu panel. Si publicaste liquidez, ese saldo deja de estar en la wallet hasta que lo retires — no desapareció, cambió de sitio.',
    sinonimos: [
      'donde esta mi dinero', 'no cuadran mis saldos', 'no me coincide el saldo', 'me falta dinero',
      'donde esta mi saldo', 'mi balance no coincide', 'saldos no cuadran', 'donde estan mis fondos',
    ],
    fuente: 'codigo',
  },

  /* ════════════ HERRAMIENTAS DEL ECOSISTEMA ════════════ */
  {
    id: 'op-goracle',
    proyecto: 'ecosistema',
    categoria: 'Herramientas',
    pregunta: '¿Qué es G-Oracle?',
    respuesta:
      'G-Oracle es el espacio donde los usuarios consumen, ofrecen y generan ingresos dentro de la red: descubres negocios y servicios cerca de ti, accedes a comercios del ecosistema en segundos, y puedes ofrecer tus propios productos o servicios a la comunidad G11. Es la parte de comercios y servicios del ecosistema.',
    sinonimos: [
      'que es g-oracle', 'goracle', 'g oracle', 'comercios del ecosistema', 'negocios cerca',
      'ofrecer mis servicios', 'vender en la red', 'marketplace de servicios',
    ],
    fuente: 'landing',
  },
  {
    id: 'op-roadmap-tecnologico',
    proyecto: 'ecosistema',
    categoria: 'Novedades',
    pregunta: '¿Va a haber tarjeta Visa/Mastercard o academia?',
    respuesta:
      'El material oficial menciona en su roadmap tecnológico la integración con sistemas de pago Visa / Mastercard para uso cotidiano del AiG Token, y una plataforma educativa (academia) con servicios impulsados por IA, junto a la consolidación de la comunidad en tres continentes. Son planes del roadmap: las fechas y la disponibilidad se anuncian únicamente por los canales oficiales — trata con cautela cualquier fecha que veas por fuera.',
    sinonimos: [
      'tarjeta visa', 'visa mastercard', 'mastercard', 'tarjeta del ecosistema',
      'habra tarjeta', 'va a haber tarjeta', 'cuando la tarjeta', 'tarjeta visa mastercard',
      'academia', 'plataforma educativa', 'atm', 'cajeros', 'roadmap tecnologico',
    ],
    fuente: 'porDefinir',
  },
]
