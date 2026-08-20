/**
 * EL CRONOGRAMA — LA BRÚJULA DEL PROYECTO.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * QUÉ ES ESTO Y PARA QUÉ SIRVE MÁS ALLÁ DE HOY.
 *
 * Un catálogo de TODO lo que una persona puede hacer en el ecosistema,
 * escrito siempre con la misma forma:
 *
 *     PASO 0        qué tiene que ser cierto antes de empezar
 *     PROCESO       los pasos, en el orden real
 *     PASO FINAL    el punto sin retorno y cómo se sabe que terminó
 *     CONSECUENCIA  qué queda cambiado después
 *
 * Sirve para tres cosas a la vez, y por eso vive en un solo sitio:
 *
 *   1. SOPORTE — para guiar a alguien sin inventar pantallas.
 *   2. GUIONES — cada recorrido es un vídeo tutorial: el paso 0 es la
 *      introducción, el proceso es la grabación, la consecuencia es el cierre.
 *   3. DIAGNÓSTICO — cuando alguien dice «no me funciona», el paso 0 dice
 *      dónde mirar primero, que es donde falla la mayoría.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA CONSECUENCIA ES LA PARTE QUE CASI NADIE ESCRIBE.
 *
 * Quien pregunta «¿ya está?» no quiere la lista de pasos: quiere saber qué
 * cambió en su cuenta y qué puede hacer ahora que antes no podía. Un manual
 * que termina en «pulsa Confirmar» deja a la persona mirando la pantalla sin
 * saber si aquello funcionó.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EL ESTADO DE CADA RECORRIDO NO ES DECORACIÓN.
 *
 *   'verificado' — lo he recorrido con sesión real y lo he visto.
 *   'deducido'   — sale de leer el código que sirve esa pantalla. Los textos
 *                  entre comillas son literales, así que se puede contrastar.
 *   'pendiente'  — ni visto ni leído. NO se guía; se deriva.
 *
 * La diferencia entre 'verificado' y 'deducido' hay que respetarla al grabar
 * un tutorial: lo deducido se comprueba delante de la cámara antes de narrar.
 * Ya me equivoqué una vez documentando un P2P que el usuario no usa, por leer
 * el fragmento de código equivocado.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * RECORRIDO: 19-ago-2026, con sesión real en g-pulse.aigenesis.io.
 */

export type EstadoRecorrido = 'verificado' | 'deducido' | 'pendiente'

export interface PasoDelRecorrido {
  n: number
  queHace: string
  /** El rótulo LITERAL del botón o sección, cuando hay que nombrarlo para llegar. */
  rotulo?: string
  /** Lo que aparece en pantalla. Entre comillas, literal. */
  queVe?: string
  /** El error concreto de ESTE paso. Un paso sin su trampa es media instrucción. */
  trampa?: string
}

export interface Recorrido {
  id: string
  titulo: string
  /** Para quién es, en una frase. Si no se puede escribir, el recorrido sobra. */
  paraQuien: string
  /** La ruta, que es estable. El nombre visible va en `rotulo`. */
  donde: string
  /** El rótulo LITERAL de la sección en el menú. */
  rotulo?: string
  estado: EstadoRecorrido
  paso0: readonly string[]
  proceso: readonly PasoDelRecorrido[]
  pasoFinal: string
  consecuencia: readonly string[]
  /** Lo que el código del navegador no puede contestar. Se pregunta al equipo. */
  loQueFaltaConfirmar?: readonly string[]
}

export const CRONOGRAMA: readonly Recorrido[] = [
  /* ═══════════ 1 · ENTRAR ═══════════ */
  {
    id: 'entrar-primera-vez',
    titulo: 'Entrar por primera vez',
    paraQuien: 'Alguien que acaba de recibir una invitación y todavía no tiene cuenta.',
    donde: 'g-pulse.aigenesis.io — o conect.aigenesis.io, que es la misma aplicación',
    estado: 'verificado',
    paso0: [
      'Un enlace de invitación que lleve la parte «?ref=» — sin ella el registro NI SIQUIERA SE ABRE.',
      'Un correo al que se tenga acceso ahora mismo.',
    ],
    proceso: [
      {
        n: 1,
        queHace: 'Abrir el enlace de invitación en el navegador que se vaya a usar.',
        trampa:
          'Si lo mandaron como botón y se recortó, el «?ref=» se pierde y sale «ACCESO RESTRINGIDO». Se pide de nuevo como texto plano.',
      },
      {
        n: 2,
        queHace: 'Cerrar el diálogo de carteras que se abre encima.',
        queVe: 'Un panel con Email, Google, MetaMask, Trust y «380+ wallets».',
        trampa:
          'ES EL PRIMER PUNTO DE ABANDONO DEL ECOSISTEMA. El formulario de correo está DETRÁS de ese diálogo. Quien no lo cierre concluye que hace falta una cartera.',
      },
      { n: 3, queHace: 'Rellenar correo y contraseña.' },
      {
        n: 4,
        queHace: 'Introducir el código que llega al correo para validar el alta.',
        trampa:
          'Si no llega, mirar en no deseados. Crear una segunda cuenta no arregla el correo que falta y deja dos altas a medias.',
      },
      {
        n: 5,
        queHace: 'Aceptar el Acuerdo de Uso y Responsabilidad.',
        queVe: 'Ocho secciones, una casilla, y «Continuar» apagado hasta marcarla.',
        trampa: 'Quien no vea la casilla cree que la aplicación está rota, porque el botón no responde.',
      },
    ],
    pasoFinal: 'Aceptar el acuerdo. A partir de ahí se entra al lobby.',
    consecuencia: [
      'La cuenta queda creada y sirve para TODO el ecosistema: no hay un alta por producto.',
      'Queda registrado el patrocinador que venía en el enlace, y eso no se cambia después.',
      'Queda aceptado un documento con las reglas de holding, red y rendimientos.',
    ],
  },

  {
    id: 'volver-a-entrar',
    titulo: 'Volver a entrar y recuperar el acceso',
    paraQuien: 'Quien ya tiene cuenta.',
    donde: '/login',
    estado: 'verificado',
    paso0: ['Saber CÓMO se dio de alta: con correo o con cartera. El sistema no asocia las dos por su cuenta.'],
    proceso: [
      { n: 1, queHace: 'Cerrar el diálogo de carteras si se va a entrar con correo.' },
      {
        n: 2,
        queHace: 'Entrar por la misma vía del alta.',
        trampa: 'Registrarse con correo e intentar entrar con cartera falla, y al revés también.',
      },
      {
        n: 3,
        queHace: 'Si no se recuerda la contraseña: «¿Olvidaste la contraseña?».',
        trampa:
          'El sistema NO avisa cuando una dirección no existe — es a propósito, para no revelar quién tiene cuenta. Si no llega el correo, revisar que sea el del alta.',
      },
    ],
    pasoFinal: 'Entrar al lobby.',
    consecuencia: [
      'Si se venía de un enlace a una sección concreta, la aplicación vuelve sola a esa sección: el enlace no se pierde.',
    ],
  },

  /* ═══════════ 2 · ENTENDER LA CUENTA ═══════════ */
  {
    id: 'entender-mis-saldos',
    titulo: 'Entender por qué tengo cuatro cifras distintas',
    paraQuien:
      'Cualquiera que compare su cartera con el panel y crea que hay un error. Es la consulta más repetida del canal.',
    donde: 'VIP Lobby',
    estado: 'verificado',
    paso0: ['Aceptar de entrada que NO son la misma cifra vista de cuatro maneras: son cuatro cosas distintas.'],
    proceso: [
      {
        n: 1,
        queHace: 'Leer «TOTAL MINED · AIG HISTÓRICO».',
        queVe: 'Todo lo minado desde siempre.',
        trampa: 'No es dinero disponible. Es la BASE sobre la que se calcula el 14% del hold.',
      },
      {
        n: 2,
        queHace: 'Leer «AIG EN WALLET (CADENA)».',
        queVe: 'Marcado «EXTERNO · BSC» — es exactamente lo que se ve en MetaMask.',
      },
      {
        n: 3,
        queHace: 'Leer «BÓVEDA INTERNA».',
        queVe: 'AIG dentro del protocolo, pendiente de sacar.',
        trampa: 'La propia pantalla avisa: «No es la Bóveda Interna del protocolo» bajo la cifra de la cartera.',
      },
      { n: 4, queHace: 'Leer la tarjeta de USDT disponible.' },
    ],
    pasoFinal: 'Comparar cada cifra sólo con la que le corresponde.',
    consecuencia: [
      'Deja de tener sentido decir «no me cuadra con MetaMask»: nunca va a cuadrar, porque son sitios distintos.',
      'Si además hay liquidez publicada en el P2P, hay un QUINTO sitio donde puede estar el dinero.',
    ],
  },

  {
    id: 'cubrir-el-hold',
    titulo: 'Salir de «congelado» y volver a minar',
    paraQuien: 'Quien retiró AIG y vio pararse su minería. 23 casos medidos en el canal.',
    donde: 'Cabecera → estado del protocolo',
    estado: 'verificado',
    paso0: [
      'Entender la regla: el hold es el 14% de lo MINADO HISTÓRICAMENTE, no de lo que se tiene ahora.',
      'Por eso retirar no baja el requisito: baja lo que hay para cubrirlo.',
    ],
    proceso: [
      {
        n: 1,
        queHace: 'Mirar el indicador de holding en la cabecera.',
        queVe: 'Dos cifras: lo que se tiene y lo que hace falta.',
      },
      {
        n: 2,
        queHace: 'Conseguir el AIG que falta entre participantes de la comunidad.',
        trampa: 'La plataforma no vende el AIG que falta. Se consigue en la comunidad.',
      },
      { n: 3, queHace: 'Dejarlo donde el protocolo lo cuente para el holding.' },
    ],
    pasoFinal: 'Volver a estar por encima del mínimo.',
    consecuencia: [
      'Se reactivan minar y reclamar. La cuenta nunca dejó de ser accesible: lo que estaba parado eran las recompensas.',
      'Por encima del mínimo hay bandas de margen para que un movimiento pequeño no vuelva a dejar por debajo.',
    ],
    loQueFaltaConfirmar: ['Si la reactivación es inmediata o espera a un recálculo.'],
  },

  /* ═══════════ 3 · LA RED ═══════════ */
  {
    id: 'construir-la-red',
    titulo: 'Invitar y entender lo que genera la red',
    paraQuien: 'Quien quiere traer gente y no entiende por qué no recibe nada.',
    donde: 'VIP Lobby (cabecera) y /dashboard/mi-red',
    rotulo: 'Red Binaria',
    estado: 'verificado',
    paso0: [
      'Saber que hay DOS enlaces de invitación, uno por lado — no uno solo.',
      'La recompensa se calcula sobre el lado MENOR: un lado lleno y el otro vacío no genera nada.',
    ],
    proceso: [
      {
        n: 1,
        queHace: 'Copiar el enlace del lado que se quiera reforzar.',
        queVe: 'Botones «Izq» y «Der».',
        trampa: 'Repartir siempre el mismo llena un lado y bloquea el emparejamiento.',
      },
      { n: 2, queHace: 'Abrir la sección de la red y ver el volumen de cada lado.', rotulo: 'Red Binaria' },
      {
        n: 3,
        queHace: 'Leer la tabla de puntos.',
        queVe: 'Arrastre del mes anterior, puntos nuevos, total del ciclo e histórico.',
        trampa:
          'Al cierre de mes se CONSERVA el 50% de los puntos como arrastre. Quien espere conservarlo todo creerá que le han quitado la mitad.',
      },
      {
        n: 4,
        queHace: 'Explorar la matriz.',
        trampa:
          'El zoom es SÓLO visual: para ver más gente hay que cambiar el selector de niveles, no acercarse con la rueda.',
      },
    ],
    pasoFinal: 'Que haya volumen emparejable en los dos lados.',
    consecuencia: [
      'Se genera el acelerador correspondiente al lado menor.',
      'Tras el emparejamiento, ambos lados se reducen en la cantidad emparejada.',
      'Lo que sobra al cierre de mes se conserva a la mitad para el ciclo siguiente.',
    ],
  },

  /* ═══════════ 4 · P2P ═══════════ */
  {
    id: 'comprar-aig-p2p',
    titulo: 'Comprar AIG en el P2P',
    paraQuien: 'Quien necesita AIG — para cubrir su hold, normalmente.',
    donde: '/dashboard/p2p → Marketplace',
    estado: 'deducido',
    paso0: [
      'Sesión activa: sin ella el botón de tomar no opera.',
      'MetaMask con fondos y en la red correcta.',
      'Haber mirado alias, país y número de transacciones del anunciante — es la única señal de confianza que da la pantalla.',
    ],
    proceso: [
      { n: 1, queHace: 'Filtrar por país, moneda e importe mínimo y máximo.' },
      { n: 2, queHace: 'Elegir una fila y pulsar «Tomar».' },
      {
        n: 3,
        queHace: 'El sistema valida y localiza al comerciante.',
        queVe:
          'Si no lo localiza: «No se pudo resolver el ID del comerciante… Recarga el libro P2P… e inténtalo de nuevo.»',
        trampa: 'Eso se arregla RECARGANDO, no reintentando a ciegas.',
      },
      {
        n: 4,
        queHace: 'Se registra la operación en el servidor ANTES de pagar.',
      },
      {
        n: 5,
        queHace: 'Firmar la transferencia en MetaMask.',
        trampa: 'Aquí sale el dinero. Lo que viene después sólo avisa al servidor de que ya se pagó.',
      },
      { n: 6, queHace: 'Se confirma al servidor con el hash.' },
    ],
    pasoFinal: 'Firmar en MetaMask, en el paso 5.',
    consecuencia: [
      'El AIG llega y la operación pasa al historial.',
      'Suma al contador de transacciones, que es lo que otros miran para fiarse.',
      'SI SE VENDIÓ en lugar de comprar y el saldo baja del hold, se detienen minado y reclamo.',
    ],
    loQueFaltaConfirmar: [
      'Qué hace el servidor con una operación registrada que nunca llega a confirmarse.',
      'Si hay límites por operación.',
    ],
  },

  {
    id: 'vender-aig-p2p',
    titulo: 'Vender AIG: hay que depositar liquidez antes',
    paraQuien: 'Quien intenta publicar una oferta y no lo consigue.',
    donde: '/dashboard/p2p → Mi Perfil',
    estado: 'deducido',
    paso0: [
      'Entender que NO se publica una orden: se deposita liquidez y eso es lo que sale en el libro.',
      'MetaMask en red BSC con saldo real de USDT o AIG.',
    ],
    proceso: [
      {
        n: 1,
        queHace: 'Intentar publicar directamente — para entender por qué no funciona.',
        queVe:
          '«El libro PAI no usa órdenes V2 (ORD-*). Ve a Mi Perfil → Depositar liquidez con MetaMask para aparecer en el marketplace.»',
        trampa: 'No falta ningún permiso. El formulario de publicar pertenece a otro mecanismo interno.',
      },
      { n: 2, queHace: 'Ir a Mi Perfil y activar el perfil de comerciante.' },
      {
        n: 3,
        queHace: 'Abrir «Depositar liquidez marketplace» y elegir token e importe.',
        queVe: 'Sólo USDT o AIG. Con otra cosa: «Token inválido — usa USDT o AIG.»',
      },
      {
        n: 4,
        queHace: 'Pulsar «Depositar con MetaMask» y firmar.',
        queVe: 'El botón pasa a «Procesando…».',
      },
      {
        n: 5,
        queHace: 'Esperar la confirmación.',
        queVe:
          '«Depósito registrado» — «…puede tardar unos segundos en reflejarse en el libro y en tu perfil.» Con el hash.',
        trampa: 'Si tarda, NO se repite el depósito: se reporta con el hash. Repetir mueve el dinero otra vez.',
      },
    ],
    pasoFinal: 'Firmar en MetaMask. El dinero sale de la cartera y no hay botón que lo deshaga.',
    consecuencia: [
      'Aparece un saldo nuevo, «Liquidez Marketplace», que no es la cartera ni el crédito interno: es otro sitio donde está el dinero.',
      'La persona sale publicada en el libro y otros pueden tomarle operaciones.',
      'Ese saldo deja de estar en la cartera hasta que se retire.',
    ],
    loQueFaltaConfirmar: ['Cuánto tarda en acreditarse de verdad.', 'Si hay mínimo o máximo por depósito.'],
  },

  {
    id: 'retirar-liquidez-p2p',
    titulo: 'Recuperar la liquidez publicada',
    paraQuien: 'Quien quiere dejar de ser comerciante o necesita ese dinero.',
    donde: '/dashboard/p2p → Mi Perfil → Retirar',
    estado: 'deducido',
    paso0: [
      'Tener liquidez publicada.',
      'NO hace falta MetaMask: este flujo no firma nada. La pantalla lo dice: «No se requiere firma MetaMask para este paso.»',
    ],
    proceso: [
      { n: 1, queHace: 'Abrir «Retirar liquidez marketplace» y elegir si USDT o AIG.' },
      { n: 2, queHace: 'Confirmar el importe contra el saldo «Disponible en PAI».' },
      {
        n: 3,
        queHace: 'Pulsar «Confirmar retiro».',
        queVe: '«Enviando…».',
        trampa:
          'NO se abre MetaMask. Quien espere la ventana de la cartera dará por hecho que no se envió y lo repetirá.',
      },
      {
        n: 4,
        queHace: 'Esperar.',
        queVe: '«Retiro solicitado» — «PAI procesará el retorno… a tu wallet registrada.»',
      },
    ],
    pasoFinal:
      'Pulsar «Confirmar retiro». Termina en una SOLICITUD, no en una transferencia hecha: el retorno se procesa después.',
    consecuencia: [
      'La liquidez deja de estar publicada: la persona sale del libro para ese token.',
      'Los fondos vuelven a la wallet registrada de la cuenta — no se elige destino.',
      'Entre la solicitud y la llegada hay una espera que la interfaz no controla ni acota.',
    ],
    loQueFaltaConfirmar: ['Cuánto tarda PAI en devolver.', 'Qué pasa si se solicita dos veces seguidas.'],
  },

  /* ═══════════ 5 · PENDIENTES ═══════════ */
  {
    id: 'reclamar-y-retirar',
    titulo: 'Reclamar recompensas y sacarlas a tu wallet',
    paraQuien: 'Todo el mundo. Es el recorrido que más consultas genera y el que más malentendidos acumula.',
    donde: '/dashboard/wallet',
    rotulo: 'Portfolio',
    estado: 'deducido',
    paso0: [
      'HOLDING CUBIERTO: el mínimo es el 14% del total minado histórico, y se mide contra el AIG que tienes EN LA WALLET (BSC) — no contra la bóveda interna. Es la confusión número uno: alguien con la bóveda llena y la wallet vacía sigue por debajo del mínimo.',
      'CUENTA ECONÓMICAMENTE ACTIVA: con minería, acelerador o staking. Sin nada activo, los reclamos ni se evalúan.',
      'TENER AL MENOS 10 USDT ACUMULADOS: por debajo de esa cifra el reclamo no se puede ejecutar. Es el mismo mínimo que aparece en conversiones, y explica los casos de gente que se quedó con unos pocos USDT sin poder moverlos.',
    ],
    proceso: [
      {
        n: 0,
        queHace:
          'Entender QUÉ es un reclamo, porque no es lo que la mayoría cree: no saca USDT, CONVIERTE a AIG el saldo que el protocolo lleva contabilizado en USDT.',
        queVe:
          'El descargo lo dice en todas las pantallas: «Todas las recompensas se generan en AIG. Los valores en USDT son estimaciones y no representan una promesa de valor.»',
        trampa:
          'Quien espere recibir USDT en su wallet se va a llevar una sorpresa. El USDT es la unidad en la que se cuenta; lo que se libera es AIG.',
      },
      {
        n: 1,
        queHace: 'Abrir el portafolio y mirar qué hay reclamable, que viene separado por origen.',
        queVe: 'Cinco líneas: minería, acelerador, volumen de red, acelerador directo y staking.',
        trampa:
          'Cada línea se reclama por su lado. Ver saldo en una no significa poder reclamar en otra.',
      },
      {
        n: 2,
        queHace: 'Comprobar que no hay una restricción activa.',
        queVe:
          'Si la hay, la pantalla dice cuál y qué hacer. Si no hay nada devengado: «Aún no hay devengo suficiente o el backend reporta 0 reclamable.»',
      },
      {
        n: 3,
        queHace: 'Confirmar el reclamo.',
        queVe: '«Confirmar reclamo» — «Vas a liberar AIG generado por tu participación en el protocolo.»',
      },
      {
        n: 4,
        queHace: 'Esperar el resultado.',
        queVe: '«Reclamo procesado correctamente» — «AIG liberado a tu núcleo personal.»',
        trampa:
          'Si se reclama todo de golpe puede salir «Claim parcial: revisa el mensaje de error»: unas líneas pasan y otras no. NO es un fallo total, y repetir sólo reintenta las que quedaron.',
      },
      {
        n: 5,
        queHace: 'Para sacarlo a la wallet, indicar la cantidad.',
        queVe: 'Hay un botón MAX. Si se pide de más: «Balance on-chain insuficiente: tienes N AIG y solicitas M AIG.»',
      },
    ],
    pasoFinal: 'Confirmar el retiro. La pantalla responde con el importe solicitado y el hash de la operación.',
    consecuencia: [
      'PUEDE TARDAR DESDE UN MINUTO HASTA 72 HORAS en llegar a la wallet, según el caso, por procesos de verificación y seguridad. Que no aparezca al momento NO significa que haya fallado.',
      'Sacar AIG de la wallet baja tu holding: si te deja por debajo del 14%, se detienen minado y reclamo. Conviene mirar el margen ANTES de retirar.',
      'El movimiento queda en el historial con su hash, que es lo que permite reconstruirlo si algo se tuerce.',
      'Lo que llega es AIG, no USDT: el saldo contabilizado en USDT baja y sube el AIG.',
    ],
    loQueFaltaConfirmar: [
      'Si el importe convertido usa el valor de referencia del momento del reclamo o el de la acreditación.',
    ],
  },

  {
    id: 'comprar-en-la-tienda',
    titulo: 'Comprar en el marketplace',
    paraQuien: 'Quien quiere usar su AIG en productos reales.',
    donde: '/dashboard/marketplace',
    rotulo: 'Marketplace',
    estado: 'deducido',
    paso0: [
      'Sesión iniciada: la propia caja lo pide — «Iniciá sesión para guardar tu dirección y continuar la compra».',
      'Wallet conectada: hoy sólo hay dos formas de pago y las dos la necesitan.',
      'Saldo suficiente en la wallet para el importe que corresponda a cada token.',
    ],
    proceso: [
      {
        n: 1,
        queHace: 'Elegir productos y abrir la caja.',
        queVe: 'La caja va en dos pasos y lo dice en la cabecera.',
      },
      {
        n: 2,
        queHace: 'Paso 1 de 2 — indicar la dirección de envío.',
        queVe: '«¿A dónde lo enviamos?» Se puede añadir una dirección nueva y queda guardada para próximas compras.',
      },
      {
        n: 3,
        queHace: 'Paso 2 de 2 — elegir cómo pagar.',
        queVe: '«Pago seguro · con AIG + USDT, o sólo USDT.» El envío ya va incluido: «Sin cargos de envío al pagar».',
      },
      {
        n: 4,
        queHace: 'Se crea el pedido ANTES de cobrar nada.',
        trampa:
          'Si algo falla aquí: «Algo falló antes de cobrar, así que no se cobró nada.» El pedido no llegó a existir y no hay cargo que reclamar.',
      },
      {
        n: 5,
        queHace: 'Firmar el pago en la wallet.',
        queVe:
          'La pantalla va marcando en qué punto está: firmando, validando y registrando. En pago DUAL se firma por cada token.',
        trampa:
          'Si el pago no llega a abrirse: «Tu pedido quedó creado y nada se cobró. Abrilo desde Mis pedidos y retomá el pago desde ahí.» El carrito NO se vacía.',
      },
      {
        n: 6,
        queHace: 'El sistema registra el pago con el hash y el pedido pasa a pagado.',
      },
    ],
    pasoFinal: 'Firmar el pago. Antes de eso no hay cobro; después, el pedido queda pagado y entra en preparación.',
    consecuencia: [
      'El pedido queda creado y visible en «Mis pedidos», con su estado propio.',
      'El estado se va contando solo por las cuatro etapas que importan: pagado, enviado, en tránsito y entregado.',
      'La dirección usada queda guardada para próximas compras.',
    ],
    /*
     * LO MEJOR DISEÑADO DEL ECOSISTEMA, Y HAY QUE SABERLO PARA NO ROMPERLO:
     * un pedido creado sin pagar se puede RETOMAR, y el sistema promete por
     * escrito que no genera un segundo cargo. Es la respuesta exacta al miedo
     * más caro del comercio — «pagué y no aparece, ¿pago otra vez?».
     */
    loQueFaltaConfirmar: [
      'Cuánto tiempo se puede retomar un pedido pendiente antes de que caduque.',
      'Qué pasa si se firma el pago pero se cierra la pestaña antes del registro.',
    ],
  },

  {
    id: 'abrir-un-ticket',
    titulo: 'Pedir ayuda desde el portal',
    paraQuien: 'Quien ya no puede resolverlo solo.',
    donde: '/dashboard/support',
    rotulo: 'Soporte VIP',
    estado: 'deducido',
    paso0: [
      'ANTES DE ABRIR NADA: comprobar si el caso es de los que se resuelven solos. De las siete causas de «no puedo reclamar», cinco las arregla la propia persona — y la más frecuente, el holding, se reactiva automáticamente al reponer AIG.',
      'Si el caso es de dinero: tener el hash de la transacción. Sin él no hay nada que reconstruir.',
      'Si han pasado menos de 72 horas desde un reclamo, todavía no es un caso.',
    ],
    proceso: [
      {
        n: 1,
        queHace: 'Mirar el estado del sistema, arriba del todo.',
        trampa:
          'Hoy esos indicadores son simulados: la pantalla lo dice. No sirven para descartar una incidencia real.',
      },
      {
        n: 2,
        queHace: 'Pulsar «Nuevo ticket» y rellenar cuatro campos.',
        queVe: 'Título, categoría (Reclamo, Depósito, Red o Seguridad), prioridad (baja, media o alta) y el mensaje.',
      },
      {
        n: 3,
        queHace: 'Escribir el caso con los datos mínimos: usuario, wallet, hash, hora y qué esperabas que pasara.',
        trampa:
          'NUNCA se pone la contraseña ni la frase de recuperación de la wallet. Nadie del equipo las necesita, y quien las pida está robando.',
      },
      {
        n: 4,
        queHace: 'Seguir el hilo, que tiene dos modos: humano e IA.',
        queVe: 'El estado del ticket va cambiando entre abierto, esperando tu respuesta y cerrado.',
      },
    ],
    pasoFinal:
      'Enviar el ticket. Hoy termina ahí y no llega al backoffice — la propia pantalla lo advierte y remite a los canales oficiales.',
    consecuencia: [
      'HOY: el ticket vive sólo en el navegador y desaparece al recargar. No es un ticket todavía.',
      'CUANDO SE CABLEE: quedará asociado a la cuenta, con su historial y su estado.',
    ],
    /*
     * ES EL ÚNICO RECORRIDO QUE NO SE PUEDE ARREGLAR DOCUMENTÁNDOLO. Los pasos
     * son reales —la interfaz existe y funciona— pero no persisten nada. Se
     * describe para poder avisar con precisión, no para guiar a alguien hacia
     * una vía que no lleva a ningún sitio.
     */
    loQueFaltaConfirmar: [
      'Dónde vivirán los tickets: el contrato está especificado en docs/contrato-tickets-soporte.md, sin implementar.',
    ],
  },
] as const

/**
 * COBERTURA CALCULADA. Nunca escrita a mano: un porcentaje a mano envejece el
 * día que se añade un recorrido y se olvida actualizarlo, y entonces miente
 * con toda la autoridad de un número.
 */
export function coberturaDelCronograma() {
  const cuenta = (e: EstadoRecorrido) => CRONOGRAMA.filter((r) => r.estado === e).length
  const pasos = CRONOGRAMA.reduce((n, r) => n + r.proceso.length, 0)
  return {
    recorridos: CRONOGRAMA.length,
    pasosDocumentados: pasos,
    verificado: cuenta('verificado'),
    deducido: cuenta('deducido'),
    pendiente: cuenta('pendiente'),
    /** Los que se pueden guiar hoy sin arriesgarse. */
    guiables: cuenta('verificado') + cuenta('deducido'),
    /** Lo que hay que preguntarle al equipo, sumado. */
    preguntasAbiertas: CRONOGRAMA.reduce((n, r) => n + (r.loQueFaltaConfirmar?.length ?? 0), 0),
  }
}
