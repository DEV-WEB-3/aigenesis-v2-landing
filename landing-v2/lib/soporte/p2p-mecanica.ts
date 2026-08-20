/**
 * EL P2P DE GENESIS — CÓMO FUNCIONA DE VERDAD.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ ESTE ARCHIVO EXISTE, Y POR QUÉ SE ESCRIBIÓ MIRANDO CÓDIGO.
 *
 * Buscando «pasos del P2P de AiGenesis» en internet sale una guía detallada,
 * segura de sí misma y ENTERA FALSA. Dice cosas como «elige la contraparte»,
 * «introduce los datos del usuario destino» y «completa la verificación 2FA».
 * Comprobado contra el paquete que sirve conect.aigenesis.io el 19-ago-2026:
 *
 *   · «contraparte» / «counterparty» → 0 apariciones. No se elige a nadie:
 *     el sistema casa las órdenes solo.
 *   · «2FA» / «twoFactor» → 0 apariciones. Los únicos 3 aciertos de «otp»
 *     eran el trozo «otP» dentro de «ForgotPassword».
 *   · «verified community members» → no existe tal estado.
 *
 * Un usuario que siga esa guía busca botones que no están y concluye que la
 * plataforma falla. Peor: si el asistente de soporte repite eso, el proyecto
 * firma el error. De ahí la regla de este archivo — TODO LO QUE AFIRMA SALE
 * DE LEER EL CÓDIGO QUE SE EJECUTA EN EL NAVEGADOR DEL USUARIO, no de
 * documentación, no de memoria y desde luego no de un buscador.
 *
 * Lo que no se pudo comprobar está marcado como tal. No se rellena.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * ═════════════════════════════════════════════════════════════════════════
 * CORRECCIÓN GRAVE — 19-AGO-2026, TRAS ENTRAR CON SESIÓN REAL.
 *
 * Todo lo que hay debajo de este bloque describe un LIBRO DE ÓRDENES que
 * existe en el código y NO ES EL P2P QUE EL USUARIO USA. Lo dice la propia
 * pantalla de `/dashboard/p2p`, sin ambigüedad:
 *
 *     «El marketplace visible usa comerciantes PAI (PAI-{id}),
 *      NO órdenes Mongo V2.»
 *
 * Yo había leído `/api/p2p/orderbook`, `/api/p2p/orders`, `take` y `cancel`
 * en el paquete de producción y documenté eso como el P2P, con sus seis
 * pasos lógicos y su advertencia sobre el precio de ejecución. Las funciones
 * existen. El usuario no pasa por ellas.
 *
 * EL FALLO DE MÉTODO, que es lo que hay que recordar: leer el paquete prueba
 * qué PUEDE pedir la aplicación, jamás qué hace la pantalla que alguien
 * abre. Es la misma trampa que en Gevy, donde el catálogo tenía seis formas
 * de pago y la configuración viva dejaba dos. Para el camino del dinero, la
 * pantalla manda sobre el código.
 *
 * Se conserva lo de abajo, marcado, porque saber que ese camino existe evita
 * que alguien lo redescubra dentro de un año y lo tome por bueno.
 * ═════════════════════════════════════════════════════════════════════════
 */

/**
 * EL P2P QUE EL USUARIO USA DE VERDAD.
 *
 * No es un libro de órdenes anónimo: es un tablón de COMERCIANTES con
 * liquidez ya depositada. Quien quiera aparecer publicando tiene que meter
 * fondos antes; quien sólo compra, toma una oferta existente.
 */
export const P2P_CAMINO_VIVO = {
  ruta: '/dashboard/p2p',
  modelo:
    'Tablón de comerciantes (PAI). Cada fila es una persona que ya depositó liquidez, con su país, su rango de operación y su número de transacciones a la vista.',

  /** Lo que ve quien sólo quiere comprar o vender sin ser comerciante. */
  paraOperar: [
    'Pestaña «Comprar AIG» o «Vender AIG» dentro del libro.',
    'Se filtra por país y por moneda, y por importe mínimo y máximo.',
    'Se pulsa «Tomar» en la fila elegida. La operación se firma con MetaMask.',
  ],

  /** Lo que hay que hacer para SALIR publicado en el libro. */
  paraPublicar: [
    'Mi Perfil → activar el perfil de comerciante.',
    'Depositar liquidez con MetaMask, red BEP20, en USDT o en AIG.',
    'PAI acredita el saldo y aparece tu fila en el libro.',
    'Para recuperar los fondos: mismo panel de Mi Perfil → Retirar USDT / AIG.',
  ],

  /**
   * EL PRECIO. La pantalla publica una referencia y una banda, y esto hay que
   * contarlo con cuidado: no es un valor de mercado abierto, es el rango que
   * la interfaz sugiere para que las ofertas sean comparables entre sí.
   */
  precio: {
    sugerido: '$23,50',
    banda: '$22 – $25',
    base: '$23',
    comoExplicarlo:
      'La pantalla sugiere un precio y una banda para que las ofertas sean comparables. Cada comerciante pone el suyo dentro de ese rango; no es una referencia de mercado abierto.',
  },

  /** Reputación visible: cada anunciante muestra su número de operaciones. */
  senalesDeConfianza:
    'Cada fila muestra el alias del anunciante, su país y cuántas transacciones lleva hechas. Es la información con la que se elige contraparte.',

  paises: ['AR', 'BR', 'CL', 'CO', 'DR', 'EC', 'ES', 'MX', 'PE', 'US', 'VE'],

  pestanas: ['Marketplace', 'Mis órdenes', 'Historial', 'Mi perfil'],

  verificado: '19-ago-2026, con sesión real en g-pulse.aigenesis.io/dashboard/p2p',
} as const

/**
 * ⚠️ LO QUE SIGUE NO ES EL CAMINO VIVO. Ver la corrección de arriba.
 *
 * EL MODELO. Ésta es la frase que hay que entender antes que ninguna otra,
 * porque casi todos los malentendidos vienen de imaginar el modelo contrario.
 *
 * El P2P de Genesis es un LIBRO DE ÓRDENES con casación automática, como el
 * de una bolsa. NO es el P2P de un exchange tipo Binance, donde eliges a una
 * persona, abres un chat, le pagas por fuera y esperas a que libere.
 *
 * Consecuencias prácticas, todas verificables en el código:
 *  · No hay contraparte que elegir ni con quien hablar.
 *  · No hay «liberar fondos» ni ventana de disputa: si casa, casó.
 *  · Una orden puede ejecutarse A TROZOS y a un precio distinto del que
 *    publicaste (mejor, nunca peor: así funciona un libro).
 *  · Mientras no case, tu orden queda publicada y la puedes cancelar.
 */
export const P2P_MODELO = {
  esUnLibroDeOrdenes: true,
  hayContraparteQueElegir: false,
  hayChatConLaOtraPersona: false,
  hayLiberacionManualDeFondos: false,
  hayDisputas: false,
  hay2FA: false,
  /**
   * Casación parcial: la respuesta del servidor trae `amountRemaining`, es
   * decir, lo que queda vivo de tu orden. Si no fuera parcial, ese campo no
   * tendría razón de existir.
   */
  admiteEjecucionParcial: true,
  comoExplicarloEnUnaFrase:
    'Publicas cuánto AIG quieres comprar o vender y a qué precio; el sistema busca en el libro la contraparte que encaje y ejecuta solo. No eliges persona ni hablas con nadie.',
} as const

/**
 * LOS PASOS LÓGICOS, en el orden en que ocurren de verdad.
 *
 * Cada paso lleva `endpoint` con la llamada exacta que hace la aplicación,
 * porque es lo que permite a un técnico reproducir o depurar el caso, y lo
 * que impide que alguien reescriba estos pasos «de memoria» dentro de un año.
 */
export const P2P_PASOS_LOGICOS = [
  {
    orden: 1,
    titulo: 'Tener sesión de Genesis',
    detalle:
      'El P2P no es una aplicación aparte: vive dentro de conect.aigenesis.io, en la ruta /p2p, con la misma sesión que el resto del ecosistema.',
    endpoint: null,
    /**
     * La aplicación manda TRES credenciales a la vez, y esto explica un fallo
     * real: puedes estar «dentro» y aun así recibir 401 del P2P si falta la
     * legacy. El propio código lo dice — «Sin JWT legacy — inicia sesión con
     * el mismo flujo que genesisfront».
     */
    autenticacion: [
      'Authorization: Bearer <JWT>',
      'X-Legacy-Token: <token del backoffice antiguo>',
      'X-P2P-Onchain-Wallet: <wallet>, sólo si la operación es on-chain',
    ],
    siFalla:
      'Un 401 o 403 en el P2P muestra literalmente «Inicia sesión en Genesis para operar en el P2P.». Si el resto de la aplicación va bien pero el P2P no, lo que falta suele ser el token legacy: cerrar sesión y volver a entrar lo regenera.',
  },
  {
    orden: 2,
    titulo: 'Consultar el libro',
    detalle:
      'La pantalla pide el libro de órdenes vivas. Se puede filtrar por lado (compra o venta) y por proyecto; el proyecto por defecto es «genesis».',
    endpoint: 'GET /api/p2p/orderbook?projectId=genesis&side=buy|sell',
    autenticacion: null,
    siFalla:
      'Si el servicio de libro está caído la aplicación dice «El servicio de libro P2P no está disponible. Intenta más tarde o contacta soporte.» — es un 503 con la causa `core_api_unreachable`. No es un problema de la cuenta de nadie: no hay nada que el usuario pueda arreglar.',
  },
  {
    orden: 3,
    titulo: 'Publicar una orden, o tomar una que ya está',
    detalle:
      'Son dos caminos distintos con dos llamadas distintas. Publicar deja la orden en el libro esperando; tomar ejecuta contra una orden concreta que ya está publicada.',
    endpoint:
      'POST /api/p2p/orders  ·  cuerpo { side, price, amount, projectId }   —   o bien   POST /api/p2p/orders/{id}/take',
    autenticacion: null,
    siFalla:
      'Publicar no garantiza ejecutar. Una orden publicada que nadie cruza se queda viva indefinidamente hasta que se cancela: no caduca sola que se haya podido comprobar.',
  },
  {
    orden: 4,
    titulo: 'La casación ocurre en el servidor, sin intervención de nadie',
    detalle:
      'La respuesta puede traer ya una casación. Cada cruce ejecutado viene con su precio real (`execPrice`) y su cantidad (`qty`), y la orden con lo que le queda vivo (`amountRemaining`).',
    endpoint: null,
    autenticacion: null,
    /**
     * ESTE ES EL PUNTO QUE MÁS CONSULTAS VA A GENERAR y conviene decirlo sin
     * rodeos: el precio al que se ejecuta puede no ser el que escribiste.
     */
    siFalla:
      'Si el usuario dice «puse un precio y se ejecutó a otro», normalmente NO es un error: en un libro, tu orden cruza contra la mejor disponible del otro lado. El dato que manda es `execPrice` de cada cruce, no el precio que se tecleó.',
  },
  {
    orden: 5,
    titulo: 'Aviso del resultado',
    detalle:
      'El sistema emite tres eventos —orden creada, orden ejecutada y orden cancelada— y los convierte en avisos dentro de la aplicación.',
    endpoint: null,
    autenticacion: null,
    siFalla:
      'Los textos exactos que ve el usuario son «Orden publicada: N AIG a $P», «Orden ejecutada: N AIG a $P» y «Orden cancelada: N AIG a $P». Cuando faltan cantidad o precio caen a la versión corta: «Tu orden está activa en el mercado P2P.», «Tu operación P2P se ejecutó correctamente.» y «Tu orden P2P fue cancelada.». Que el usuario cite una de las versiones cortas indica que el aviso llegó sin los números, no que la operación fallara.',
  },
  {
    orden: 6,
    titulo: 'Revisar o cancelar lo propio',
    detalle:
      'Cada persona puede listar sus propias órdenes y cancelar las que sigan vivas.',
    endpoint:
      'GET /api/p2p/orders?mine=1&projectId=genesis   ·   POST /api/p2p/orders/{id}/cancel',
    autenticacion: null,
    siFalla:
      'Cancelar una orden ya ejecutada no deshace la ejecución: no hay marcha atrás una vez casada.',
  },
] as const

/**
 * SUPERFICIE COMPLETA DEL P2P.
 *
 * Se lista entera —incluido lo que no se entiende— porque un inventario con
 * huecos declarados es útil y uno recortado a lo cómodo engaña. Las tres
 * últimas entradas son justamente las que el equipo tiene que explicar.
 */
export const P2P_ENDPOINTS = [
  { ruta: 'GET  /api/p2p/orderbook', queHace: 'Libro de órdenes vivas. Filtra por projectId y side.', claro: true },
  { ruta: 'GET  /api/p2p/orders?mine=1', queHace: 'Las órdenes propias.', claro: true },
  { ruta: 'POST /api/p2p/orders', queHace: 'Publicar una orden: { side, price, amount, projectId }.', claro: true },
  { ruta: 'POST /api/p2p/orders/{id}/take', queHace: 'Ejecutar contra una orden publicada.', claro: true },
  { ruta: 'POST /api/p2p/orders/{id}/cancel', queHace: 'Retirar del libro una orden viva.', claro: true },
  {
    ruta: 'GET  /api/p2p/buster-balance',
    queHace: 'PENDIENTE DE EXPLICAR. El nombre sugiere «booster» mal escrito, pero eso es una suposición y no se documenta una suposición.',
    claro: false,
  },
  {
    ruta: 'GET  /api/p2p/admin/trading-limits',
    queHace: 'Límites de operación. Es un endpoint de administración: se desconoce si el usuario final los ve y qué pasa al superarlos.',
    claro: false,
  },
  {
    ruta: 'POST /api/p2p/merchant/profile/update',
    queHace: 'Perfil de comerciante. Se desconoce qué habilita frente a una cuenta normal.',
    claro: false,
  },
] as const

/**
 * EL P2P ANTIGUO, QUE NO ES ÉSTE.
 *
 * Importa para soporte porque los casos de 2025 que llegan por WhatsApp
 * describen otro sistema: pagos que se aprobaban a mano, AIG que «no llegaban
 * después de aprobar el pago», ingresos de USDT «en el apartado p2p» que no
 * se acreditaban. Ese comportamiento no se corresponde con un libro de
 * órdenes, así que casi con seguridad son dos sistemas distintos.
 *
 * Lo único del P2P antiguo que sigue vivo en la aplicación actual es una
 * petición de retiro contra el backend legacy: POST p2p/solicitud-retiro con
 * { moneda }, y exige el JWT legacy.
 *
 * QUÉ HACER CON UN CASO VIEJO: no se contesta con las reglas nuevas. Se pasa
 * al equipo. Aplicar el manual de hoy a una operación de 2025 da una
 * respuesta coherente y equivocada, que es la peor clase de respuesta.
 */
export const P2P_LEGADO = {
  endpointVivo: 'POST p2p/solicitud-retiro  ·  cuerpo { moneda }  ·  requiere JWT legacy',
  sonElMismoSistema: false,
  comoTratarCasosViejos:
    'Los casos anteriores a la versión actual se derivan al equipo con su hash de transacción. No se responden con las reglas del libro de órdenes.',
} as const

/**
 * CÓMO HABLAR DEL PRECIO SIN CONVERTIRLO EN OTRA COSA.
 *
 * Aquí hay una tensión real y conviene dejarla resuelta por escrito, porque
 * la guarda de lenguaje de este proyecto prohíbe la expresión «precio de
 * AIG» — y sin embargo el P2P tiene precios. Las dos cosas son ciertas:
 *
 *  · AIG no cotiza en mercado abierto. No hay un precio de referencia
 *    público, y publicar uno sería inventarlo.
 *  · Dentro del libro, cada orden lleva el precio que le puso quien la
 *    publicó. Es el precio DE ESA ORDEN, y nada más.
 *
 * La diferencia no es cosmética: el precio de una orden lo fija una persona
 * para una operación concreta; una referencia de mercado afirmaría cuánto
 * vale la cosa en general. Decir lo segundo cuando sólo es verdad lo primero
 * es exactamente el error que la guarda existe para evitar.
 */
export const P2P_COMO_HABLAR_DEL_PRECIO = {
  correcto: [
    'el precio que fija cada orden',
    'el precio al que se ejecutó tu operación',
    'la mejor orden disponible del otro lado',
  ],
  incorrecto: [
    'la cotización de AIG',
    'lo que vale AIG hoy',
    'el precio de mercado',
  ],
  porque:
    'AIG no cotiza en mercado abierto. Un precio dentro del libro describe una orden concreta entre dos participantes; no es una referencia de valor ni sirve para prometer nada.',
} as const

/**
 * LO QUE NO SE PUDO COMPROBAR. Se escribe con el mismo cuidado que lo demás:
 * un hueco declarado se puede cerrar, uno tapado no.
 *
 * Todo esto está detrás del login y no hay cuenta de prueba. El asistente
 * debe contestar «no lo sé con certeza, te paso con el equipo» en estos
 * puntos, que sobre el camino del dinero es la respuesta correcta.
 */
export const P2P_SIN_VERIFICAR = [
  'Si existe un importe mínimo o máximo por orden, y qué mensaje se ve al superarlo.',
  'Si el saldo se descuenta al publicar la orden o sólo al ejecutarse.',
  'Si hay comisión, cuánto es y a quién se le cobra.',
  'Cuánto tarda en verse el AIG o el USDT en el saldo tras una ejecución.',
  'Qué es exactamente el perfil de comerciante y qué habilita.',
] as const

/**
 * EL CRUCE CON EL HOLD — resuelto por el owner el 19-ago-2026.
 *
 * Era la pregunta abierta más importante, porque de la respuesta dependía si
 * el P2P podía dejar a alguien con la cuenta bloqueada sin avisar.
 *
 * La respuesta es que el hold NO cierra el P2P. Lo que se bloquea al caer por
 * debajo del mínimo son las recompensas: minar y reclamar. El P2P sigue
 * disponible — y de hecho hace falta que lo esté, porque el AIG que le falta
 * a alguien para cubrir su hold se consigue entre participantes.
 *
 * ESO SÍ, LA CONSECUENCIA HAY QUE DECIRLA: vender AIG en el P2P puede dejarte
 * por debajo del mínimo, y entonces el minado se detiene. No es que el P2P
 * esté bloqueado; es que vender tiene ese efecto y conviene mirar el hold
 * antes de publicar una orden de venta. Es exactamente el mismo mecanismo que
 * congeló decenas de cuentas por retirar, sólo que por otra puerta.
 */
export const P2P_FRENTE_AL_HOLD = {
  elHoldBloqueaElP2P: false,
  loQueBloqueaElHold: ['minar', 'reclamar recompensas'],
  advertenciaAlUsuario:
    'Vender AIG puede dejarte por debajo de tu hold, y en ese momento el minado y el reclamo se detienen hasta que lo cubras de nuevo. Mira tu hold antes de publicar una orden de venta.',
  dondeSeConsigueAigParaElHold:
    'Entre participantes de la comunidad. La plataforma no vende el AIG que falta para cubrir el hold.',
  fuente: 'Confirmado por el owner, 19-ago-2026',
} as const

/**
 * VERIFICACIÓN. Sin esto, dentro de seis meses nadie sabe si lo de arriba
 * sigue siendo verdad ni cómo volver a comprobarlo.
 */
export const P2P_VERIFICACION = {
  fecha: '19-ago-2026',
  metodo:
    'Lectura del paquete JavaScript que sirve conect.aigenesis.io en producción (assets/index-DscnE5mF.js). Es el código que se ejecuta en el navegador del usuario, así que describe el comportamiento real y no la intención.',
  comoRepetirlo:
    'Descargar el index.html de conect.aigenesis.io, sacar la ruta del bundle principal y buscar «/api/p2p». Si el nombre del fichero cambió, hubo despliegue: toca releer.',
  advertencia:
    'La lectura del paquete prueba QUÉ PIDE la aplicación, no qué responde el servidor. Las reglas que vivan sólo en el backend —límites, comisiones, validaciones— no se ven desde aquí.',
} as const
