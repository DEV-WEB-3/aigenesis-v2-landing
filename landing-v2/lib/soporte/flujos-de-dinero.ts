/**
 * LOS FLUJOS DE DINERO, PASO A PASO — DEDUCIDOS DEL CÓDIGO.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA FORMA DE CADA FLUJO, QUE ES LO QUE HACE ÚTIL ESTE ARCHIVO.
 *
 * Toda función tiene la misma estructura, y escribirla siempre igual obliga a
 * no dejarse la mitad:
 *
 *   PASO 0        — qué tiene que ser cierto ANTES. Es donde falla la mayoría:
 *                   la gente no se atasca en el proceso, llega sin cumplirlo.
 *   PROCESO       — los pasos, en el orden real en que ocurren.
 *   PASO FINAL    — cuál es el punto sin retorno y cómo se sabe que terminó.
 *   CONSECUENCIA  — QUÉ QUEDA CAMBIADO después. Casi ninguna documentación lo
 *                   escribe, y es lo único que la persona quería saber.
 *
 * La consecuencia importa más de lo que parece: quien pregunta «¿ya está?»
 * no quiere la lista de pasos, quiere saber qué cambió en su cuenta y qué
 * puede hacer ahora que antes no podía.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALE ESTO Y HASTA DÓNDE LLEGA.
 *
 * Hay acciones que no ejecuto: depositar, retirar, tomar una oferta. Mueven
 * fondos de una persona real. Pero no ejecutar no es no saber — el código
 * dice qué se valida, qué mensaje sale y en qué ORDEN pasa cada cosa.
 *
 * Todo sale de `GenesisDashboardPage-Ddii3BV_.js`, el fragmento que sirve la
 * oficina virtual, leído el 19-ago-2026. Los textos entre comillas son
 * literales: si el usuario los cita, sabemos en qué punto exacto está.
 *
 * EL LÍMITE HONESTO, que no es «no sé los pasos» sino algo más preciso: el
 * código del navegador contiene lo que hace el NAVEGADOR. Lo que decide el
 * servidor —cuánto tarda en procesarse un retiro, si hay topes por operación,
 * qué hace con una petición a medias— no está aquí y no se deduce mirando.
 * Eso va marcado como pendiente en cada flujo, y se pregunta al equipo.
 * Y si un usuario reporta algo distinto de lo escrito, gana el usuario.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface Flujo {
  nombre: string
  donde: string
  /** Lo que tiene que ser cierto antes de empezar. Aquí falla la mayoría. */
  paso0: readonly string[]
  proceso: readonly { n: number; queHace: string; queVe: string }[]
  /** El punto sin retorno, dicho sin rodeos. */
  pasoFinal: string
  /** Qué queda cambiado. Lo que la persona realmente preguntaba. */
  consecuencia: readonly string[]
  /** Lo que se rompe aquí y cómo se atiende. */
  siFalla?: string
  /** Lo que el código del navegador NO puede contestar. */
  loQueDecideElServidor?: readonly string[]
}

export const FLUJO_DEPOSITAR_LIQUIDEZ: Flujo = {
  nombre: 'Depositar liquidez para poder vender en el libro',
  donde: 'P2P → Mi Perfil → Liquidez Marketplace',
  paso0: [
    'Sesión de Genesis activa.',
    'MetaMask conectada y en red BSC.',
    'Saldo real de USDT o de AIG en esa wallet: este paso mueve dinero de verdad.',
  ],
  proceso: [
    {
      n: 1,
      queHace: 'Abrir «Depositar liquidez marketplace».',
      queVe:
        '«Publica liquidez USDT o AIG en el libro PAI. Transfiere desde MetaMask (BSC) al receiver oficial.» Debajo, la wallet de la sesión.',
    },
    {
      n: 2,
      queHace: 'Elegir token e importe.',
      queVe: 'Sólo USDT o AIG. Con otra cosa: «Token inválido — usa USDT o AIG.»',
    },
    {
      n: 3,
      queHace: 'Pulsar «Depositar con MetaMask» y firmar.',
      queVe: 'El botón pasa a «Procesando…» y se abre la cartera.',
    },
    {
      n: 4,
      queHace: 'Esperar la confirmación en cadena.',
      queVe:
        '«Depósito registrado» — «Transfer on-chain confirmada y solicitud enviada a PAI. La liquidez publicada puede tardar unos segundos en reflejarse en el libro y en tu perfil.» Con el hash a la vista.',
    },
  ],
  pasoFinal:
    'Firmar en MetaMask. A partir de ahí el dinero ha salido de la wallet y no hay botón que lo deshaga.',
  consecuencia: [
    'El saldo aparece como «Liquidez Marketplace» en el perfil — que NO es la wallet on-chain ni el crédito interno: es un cuarto sitio donde puede estar el dinero.',
    'La persona pasa a salir publicada en el libro y otros pueden tomarle operaciones.',
    'Ese saldo deja de estar disponible en la wallet hasta que se retire.',
  ],
  siFalla:
    'El propio aviso de éxito advierte de la demora. Si pasado un rato no se ve, se reporta con el hash — nunca repitiendo el depósito, que movería el dinero otra vez.',
  loQueDecideElServidor: [
    'Cuánto tarda PAI en acreditar de verdad.',
    'Si hay importe mínimo o máximo por depósito.',
  ],
}

export const FLUJO_RETIRAR_LIQUIDEZ: Flujo = {
  nombre: 'Retirar la liquidez publicada',
  donde: 'P2P → Mi Perfil → Liquidez Marketplace → Retirar',
  paso0: [
    'Tener liquidez publicada — se ve como «Disponible en PAI».',
    'Sesión activa.',
    'NO hace falta tener MetaMask abierta: este flujo no firma nada.',
  ],
  proceso: [
    {
      n: 1,
      queHace: 'Abrir «Retirar liquidez marketplace».',
      queVe: 'Pide elegir entre la liquidez en USDT y la de AIG.',
    },
    {
      n: 2,
      queHace: 'Confirmar cuál y cuánto.',
      queVe: '«Solicitarás el retiro de tu liquidez X publicada en PAI», con el saldo disponible.',
    },
    {
      n: 3,
      queHace: 'Pulsar «Confirmar retiro».',
      queVe: '«Enviando…» y después el aviso de que la solicitud se está enviando.',
    },
    {
      n: 4,
      queHace: 'Esperar.',
      queVe:
        '«Retiro solicitado» — «PAI procesará el retorno de la liquidez publicada a tu wallet registrada. El libro puede tardar unos segundos en actualizarse.»',
    },
  ],
  pasoFinal:
    'Pulsar «Confirmar retiro». Termina en una SOLICITUD, no en una transferencia hecha: el retorno lo procesa PAI después.',
  consecuencia: [
    'La liquidez deja de estar publicada, así que la persona sale del libro para ese token.',
    'Los fondos vuelven a la wallet registrada de la cuenta — no se elige destino.',
    'Entre la solicitud y la llegada hay una espera que no controla la interfaz.',
  ],
  /**
   * EL DATO QUE EVITA UN TICKET, y está escrito en la propia pantalla:
   * «No se requiere firma MetaMask para este paso.»
   *
   * Depositar SÍ pide firma; retirar NO. Quien espere la ventana de la
   * cartera y no la vea dará por hecho que no se envió, y lo repetirá.
   */
  siFalla:
    'Retirar NO abre MetaMask, y la pantalla lo dice expresamente. Que no aparezca la cartera no significa que no se haya enviado: comprobar el estado antes de repetir.',
  loQueDecideElServidor: [
    'Cuánto tarda PAI en devolver los fondos — la interfaz no da plazo.',
    'Qué pasa si se solicita dos veces seguidas.',
  ],
}

export const FLUJO_TOMAR_OFERTA: Flujo = {
  nombre: 'Tomar una oferta del libro',
  donde: 'P2P → Marketplace → «Tomar» en una fila',
  paso0: [
    'Sesión de Genesis activa — sin ella el botón no opera.',
    'MetaMask con fondos suficientes y en la red correcta.',
    'Haber mirado el alias, el país y el número de transacciones del anunciante: es la única señal de confianza que da la pantalla.',
  ],
  proceso: [
    {
      n: 1,
      queHace: 'Validación local de importe y precio.',
      queVe: 'Si algo no cuadra: «Cantidad AIG inválida.» o «Precio inválido.»',
    },
    {
      n: 2,
      queHace: 'El sistema identifica al comerciante de esa fila.',
      queVe:
        'Si no lo consigue: «No se pudo resolver el ID del comerciante para confirmar la operación. Recarga el libro P2P (sesión Genesis activa) e inténtalo de nuevo.» Se arregla recargando, no reintentando a ciegas.',
    },
    {
      n: 3,
      queHace: 'Se registra la operación en el servidor, que devuelve un identificador.',
      queVe: 'Si la rechaza, el mensaje lo dice. Sin identificador no se sigue adelante.',
    },
    {
      n: 4,
      queHace: 'AHORA sale el dinero: transferencia firmada en MetaMask.',
      queVe: 'La ventana de la cartera.',
    },
    {
      n: 5,
      queHace: 'Se confirma al servidor con el hash de la transferencia.',
      queVe: 'La operación queda cerrada.',
    },
  ],
  pasoFinal:
    'Firmar la transferencia (paso 4). Lo que viene después es sólo avisar al servidor de que ya se pagó.',
  consecuencia: [
    'El AIG o el USDT cambian de manos según el lado de la operación.',
    'La operación pasa a «Historial» y suma al contador de transacciones.',
    'Si se vendió AIG, el saldo baja — y si eso deja la cuenta por debajo del hold, se detienen minado y reclamo.',
  ],
  /**
   * EL HUECO ENTRE EL PASO 4 Y EL 5. No es hipotético: es la forma del código.
   * La orden se registra ANTES de pagar y se confirma DESPUÉS, así que existe
   * un intervalo en el que el dinero salió y el sistema puede no saberlo.
   */
  siFalla:
    'Si la transferencia salió pero la operación no aparece cerrada, NO se repite: el dinero ya se movió y repetir lo mueve otra vez. Se reporta con el hash, la hora y el alias del comerciante.',
  loQueDecideElServidor: [
    'Qué hace el servidor con una operación registrada que nunca se confirma.',
    'Si hay límites por operación y de cuánto son.',
  ],
}

/**
 * UN CAMBIO DE SENTIDO EN EL VOCABULARIO QUE HACE LEER MAL LOS CASOS.
 *
 * Lo que para el anunciante es una orden de venta, para quien la toma es una
 * compra: el sistema registra la operación desde el lado contrario al del
 * anuncio. Al leer un reporte hay que confirmar de qué lado habla la persona
 * antes de ponerse a buscar el movimiento, o se busca en el sitio equivocado.
 */
export const CUIDADO_CON_EL_LADO =
  'Tomar una oferta de venta es una compra para quien la toma. Confirma de qué lado habla la persona antes de buscar la operación.'

/**
 * POR QUÉ EL FORMULARIO DE PUBLICAR NO PUBLICA.
 *
 * Es la contradicción más visible del portal: hay un formulario que parece
 * servir para salir en el libro y en la práctica está cerrado.
 */
export const FLUJO_PUBLICAR_BLOQUEADO = {
  queOcurre:
    'Intentar publicar directamente devuelve: «El libro PAI no usa órdenes V2 (ORD-*). Ve a Mi Perfil → Depositar liquidez con MetaMask para aparecer en el marketplace.»',
  otrosAvisos: [
    'Sin sesión: «Inicia sesión para publicar órdenes.»',
    'Si ya hay una publicación en curso: «Ya hay una publicación en curso.» — no se pulsa dos veces.',
  ],
  comoExplicarlo:
    'No falta ningún permiso: para aparecer en el libro hay que depositar liquidez antes. El formulario de publicar pertenece a un mecanismo interno distinto del libro que se ve.',
  ojoConMisOrdenes:
    'En «Mis órdenes» pueden verse operaciones internas que NO salen en el libro público. Que alguien vea algo suyo ahí no significa que esté publicado para los demás.',
  fuente: 'codigo',
} as const

/**
 * QUÉ PREGUNTAR SIEMPRE. Va aquí y no repetido en cada flujo porque es
 * idéntico en todos, y porque un caso de dinero sin estos datos no se puede
 * reconstruir: se convierte en una conversación de ida y vuelta que enfada a
 * quien ya está preocupado.
 */
export const DATOS_MINIMOS_DE_UN_CASO = [
  'Usuario y correo de la cuenta.',
  'La wallet desde la que se operó.',
  'El hash de la transacción — sin él no hay nada que reconstruir.',
  'Fecha y hora aproximadas, con la zona horaria de quien escribe.',
  'Qué se esperaba que pasara y qué pasó en su lugar.',
  'Si se reintentó, cuántas veces: cambia por completo la búsqueda.',
] as const

export const TODOS_LOS_FLUJOS: readonly Flujo[] = [
  FLUJO_DEPOSITAR_LIQUIDEZ,
  FLUJO_RETIRAR_LIQUIDEZ,
  FLUJO_TOMAR_OFERTA,
]
