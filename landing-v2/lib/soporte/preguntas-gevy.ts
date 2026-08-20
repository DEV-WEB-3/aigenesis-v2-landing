import type { Pregunta } from './tipos'

/**
 * PREGUNTAS FRECUENTES DE GEVY — la tienda.
 *
 * SIN HISTORIAL DE SOPORTE. A diferencia de Genesis, aquí no hay 789
 * mensajes que digan qué pregunta la gente: Gevy todavía no se ha publicado.
 * Así que el criterio de selección es otro y conviene decirlo — se cubren:
 *
 *   1. Las decisiones que el comprador tiene que tomar en la caja (cómo
 *      pagar), porque ahí es donde se abandona un carrito.
 *   2. Lo que pasa DESPUÉS de pagar, porque un pedido que no informa genera
 *      un ticket por cada día de silencio.
 *   3. Las dos confusiones estructurales garantizadas: la cuenta es la de
 *      Genesis, y Gevy sucede a AIGMarket.
 *
 * Cuando haya consultas reales, este archivo se reordena según ellas. Que
 * hoy vaya por criterio y no por medición es una limitación declarada, no
 * una equivalencia con el de Genesis.
 */
export const PREGUNTAS_GEVY: readonly Pregunta[] = [
  /* ════════════ QUÉ ES ════════════ */
  {
    id: 'gevy-que-es',
    proyecto: 'gevy',
    categoria: 'Sobre Gevy',
    pregunta: '¿Qué es Gevy?',
    respuesta:
      'Es la tienda de Genesis: un catálogo global con envío internacional donde compras productos reales y te llegan a casa, pagando desde tu wallet con AIG y USDT.',
    sinonimos: ['que es gevy', 'la tienda', 'marketplace', 'donde compro'],
    /*
     * SE APARTA DE LA LANDING A PROPÓSITO, Y ES LA ÚNICA VEZ.
     *
     * La landing menciona la tarjeta entre las formas de pago. En el producto
     * hoy NO existe: la configuración viva la tiene apagada. La landing manda
     * sobre lo que el proyecto ES; sobre lo que el producto HACE hoy manda el
     * producto — y prometer una forma de pago que no aparece en la caja
     * genera exactamente el ticket que este material existe para evitar.
     *
     * CONFIRMADO POR EL OWNER (19-ago-2026): la tarjeta NO se ofrece esta
     * temporada. No es una configuración apagada por descuido ni algo que
     * vaya a volver mañana — es una decisión. Por eso la respuesta se escribe
     * en firme y no como «por ahora no está disponible», que suena a avería.
     */
    fuente: 'owner',
  },
  {
    id: 'gevy-cuenta',
    proyecto: 'gevy',
    categoria: 'Sobre Gevy',
    pregunta: '¿Tengo que registrarme en Gevy?',
    respuesta:
      'No. Es la misma cuenta de Genesis: si ya entras al ecosistema, ya estás dentro de la tienda. No hay un alta aparte ni una contraseña distinta.',
    sinonimos: ['registrarme en gevy', 'cuenta de la tienda', 'otra contrasena'],
    fuente: 'codigo',
  },
  {
    id: 'gevy-vs-aigmarket',
    proyecto: 'gevy',
    categoria: 'Sobre Gevy',
    pregunta: '¿Qué pasó con AIGMarket?',
    respuesta:
      'Gevy lo sucede: es el marketplace único del ecosistema. AIGMarket pasa a ser una herramienta dentro de Gevy, en desarrollo futuro. Para comprar hoy no hay que elegir entre dos sitios — el sitio es Gevy.',
    sinonimos: ['aigmarket', 'aig market', 'la tienda vieja', 'dos tiendas'],
    fuente: 'owner',
  },

  /* ════════════ PAGO ════════════ */
  {
    id: 'gevy-formas-de-pago',
    proyecto: 'gevy',
    categoria: 'Pagar',
    categoriaIncidencia: 'deposito',
    pregunta: '¿Cómo puedo pagar?',
    respuesta:
      'Ahora mismo hay dos formas, las dos con wallet conectada: DUAL, que es una parte en AIG y el resto en USDT; y USDT solo, sin AIG. No hace falta elegir nada más — en la caja aparecen esas dos y se paga en la red BSC.',
    sinonimos: ['formas de pago', 'como pago', 'pagar con aig', 'metodos de pago', 'dual', 'pagar con usdt'],
    /*
     * ESTA RESPUESTA ESTUVO MAL Y EL ERROR MERECE QUEDARSE ESCRITO.
     *
     * Decía «hasta seis formas», porque leí el catálogo de opciones del
     * código y lo tomé por la realidad. El catálogo tiene seis, sí, pero
     * quien decide cuáles se muestran es la configuración viva:
     *
     *     GET /api/marketplace/payment-config  (19-ago-2026)
     *     { stripeEnabled: false, web3Enabled: true, perLineAig: true }
     *
     * `stripeEnabled:false` elimina las tres opciones con tarjeta, y
     * `perLineAig:true` fusiona los tramos del 20% y el 40% en una sola.
     * Quedan dos, exactamente las que dijo el owner.
     *
     * La lección: leer código enseña QUÉ PUEDE hacer el programa, no qué
     * hace. Entre el catálogo y la pantalla hay una configuración, y esa
     * configuración es la que ve el usuario.
     */
    fuente: 'codigo',
  },
  {
    id: 'gevy-tarjeta',
    proyecto: 'gevy',
    categoria: 'Pagar',
    categoriaIncidencia: 'deposito',
    pregunta: '¿Puedo pagar con tarjeta?',
    respuesta:
      'Esta temporada no se ofrece el pago con tarjeta. Se paga desde tu wallet: DUAL (AIG + USDT) o USDT solo, y sin wallet conectada no se puede completar la compra. Si en algún momento se habilita otra forma de pago, se anunciará por los canales oficiales.',
    sinonimos: ['pagar con tarjeta', 'tarjeta de credito', 'visa', 'stripe', 'no tengo wallet', 'cuando habra tarjeta'],
    /*
     * LA ÚLTIMA FRASE ESTÁ MEDIDA, PALABRA POR PALABRA.
     *
     * Dice «si en algún momento se habilita» y no «pronto», ni «próximamente»,
     * ni «estamos trabajando en ello». La diferencia importa: un plazo vago se
     * lee como un compromiso, y quien lo escuche volverá a preguntar en dos
     * semanas y se irá molesto la tercera. Sin fecha no hay promesa que
     * incumplir, y el aviso llega igual cuando toque.
     *
     * Tampoco dice que «volverá»: eso daría por hecha una decisión que no está
     * tomada.
     */
    fuente: 'owner',
  },
  {
    id: 'gevy-cuanto-aig',
    proyecto: 'gevy',
    categoria: 'Pagar',
    categoriaIncidencia: 'deposito',
    pregunta: 'En DUAL, ¿cuánto AIG me van a cobrar?',
    respuesta:
      'Cada producto aporta su propia parte en AIG, así que la cantidad depende de lo que lleves en el carrito y no de un porcentaje único aplicado al total. La cifra exacta en AIG y en USDT se ve en la caja antes de confirmar: si algo no cuadra ahí, no confirmes.',
    sinonimos: ['cuanto aig me cobran', 'cuanto pago en aig', 'precio final', 'cuanto usdt'],
    fuente: 'codigo',
  },
  {
    id: 'gevy-no-veo-opcion-aig',
    proyecto: 'gevy',
    categoria: 'Pagar',
    categoriaIncidencia: 'deposito',
    pregunta: 'No me aparece la opción de pagar con AIG',
    respuesta:
      'Comprueba primero que tienes la wallet conectada: sin ella no se muestra ninguna forma de pago. Si está conectada y aun así sólo ves USDT, es por el carrito — cuánto AIG admite cada artículo lo define el propio producto, no tu cuenta.',
    sinonimos: ['no puedo pagar con aig', 'no sale la opcion', 'solo me deja usdt', 'no aparece dual'],
    /*
     * Separa las dos causas a propósito: la persona asume que le falta algo a
     * SU cuenta, y muchas veces es un atributo del producto. Revisar lo que
     * no es cuesta un ticket.
     */
    fuente: 'codigo',
  },
  {
    id: 'gevy-precio-final',
    proyecto: 'gevy',
    categoria: 'Pagar',
    pregunta: '¿El envío está incluido en el precio?',
    respuesta:
      'El total que ves en la caja es el que se cobra, con el envío ya dentro. El envío internacional depende del destino, así que el importe puede cambiar según el país que indiques — pero se ve antes de pagar, no después.',
    sinonimos: ['envio incluido', 'gastos de envio', 'cuanto cuesta el envio', 'costo de envio'],
    fuente: 'landing',
  },
  {
    id: 'gevy-red',
    proyecto: 'gevy',
    categoria: 'Pagar',
    categoriaIncidencia: 'deposito',
    pregunta: '¿En qué red tengo que pagar?',
    respuesta:
      'En BSC. Antes de confirmar, comprueba que tu wallet está en esa red: enviar desde otra cadena manda los fondos a un sitio del que no se recuperan.',
    sinonimos: ['que red', 'bsc', 'binance smart chain', 'cadena', 'network'],
    /*
     * El aviso va en la respuesta y no en una nota al pie porque el error se
     * comete en el segundo en que se lee, y no tiene marcha atrás.
     */
    fuente: 'codigo',
  },

  /* ════════════ ENVÍO Y SEGUIMIENTO ════════════ */
  {
    id: 'gevy-estados',
    proyecto: 'gevy',
    categoria: 'Envío y seguimiento',
    pregunta: '¿Cómo sé en qué punto está mi pedido?',
    respuesta:
      'El pedido va contando su estado solo, y recibes aviso en los momentos que importan: pagado, enviado, en tránsito y entregado. No hace falta preguntar para saber dónde está.',
    sinonimos: ['donde esta mi pedido', 'seguimiento', 'estado del pedido', 'tracking'],
    /*
     * Al usuario se le cuentan CUATRO etapas, que son las que tienen
     * significado para quien espera un paquete. Por dentro el sistema maneja
     * bastantes más —confirmado, preparando, enviado al proveedor, en
     * proceso, saliendo a reparto…— y enumerárselas no ayudaría: convierte
     * una espera en una pantalla de diagnóstico.
     */
    fuente: 'codigo',
  },
  {
    id: 'gevy-sin-movimiento',
    proyecto: 'gevy',
    categoria: 'Envío y seguimiento',
    pregunta: 'Mi pedido lleva días en el mismo estado',
    respuesta:
      'En envío internacional es normal que el estado se quede quieto un tiempo, sobre todo entre que sale del almacén y entra en la red del país de destino. Si pasa de ahí sin moverse, escribe con tu número de pedido y se revisa.',
    sinonimos: ['no se mueve', 'lleva dias igual', 'pedido parado', 'no avanza'],
    fuente: 'porDefinir',
  },
  {
    id: 'gevy-pais',
    proyecto: 'gevy',
    categoria: 'Envío y seguimiento',
    pregunta: '¿Enviáis a mi país?',
    respuesta:
      'El catálogo sólo ofrece en cada país lo que se puede entregar allí: si un producto te aparece disponible, es porque hay envío a tu destino. Si no aparece, no es un fallo de la búsqueda — es que ese artículo no llega ahí.',
    sinonimos: ['envian a mi pais', 'hacen envios', 'llega a', 'paises disponibles'],
    fuente: 'owner',
  },

  /* ════════════ PROBLEMAS ════════════ */
  {
    id: 'gevy-pague-sin-pedido',
    proyecto: 'gevy',
    categoria: 'Si algo sale mal',
    categoriaIncidencia: 'deposito',
    pregunta: 'Pagué y no veo el pedido',
    respuesta:
      'No pagues otra vez. Entra en «Mis pedidos»: si el pedido quedó creado sin cobrar, puedes retomar el pago desde ahí, y el sistema no genera un segundo cargo. Si al fallar viste el aviso de que no se cobró nada, es literal: el cobro no llegó a producirse.',
    sinonimos: ['pague y no aparece', 'me cobraron', 'no veo mi pedido', 'pago duplicado', 'pagar dos veces'],
    /*
     * Es el miedo más caro del comercio, y aquí la respuesta es buena: el
     * producto tiene mecanismo de retomar el pago y promete por escrito que
     * no cobra dos veces. Decirlo con seguridad evita el segundo cargo que la
     * persona está a punto de hacer mientras lee.
     */
    fuente: 'codigo',
  },
  {
    id: 'gevy-pedido-pendiente',
    proyecto: 'gevy',
    categoria: 'Si algo sale mal',
    categoriaIncidencia: 'deposito',
    pregunta: 'Mi pedido quedó a medias sin pagar',
    respuesta:
      'Se puede retomar. El pedido queda creado y esperando el cobro, y desde «Mis pedidos» vuelves al mismo pago para confirmarlo. No se crea un pedido nuevo ni un cargo nuevo.',
    sinonimos: ['pedido pendiente', 'retomar pago', 'quedo a medias', 'no complete el pago'],
    fuente: 'codigo',
  },
  {
    id: 'gevy-pasos-caja',
    proyecto: 'gevy',
    categoria: 'Pagar',
    categoriaIncidencia: 'deposito',
    pregunta: '¿Cuántos pasos tiene la compra?',
    respuesta:
      'Dos. Primero la dirección de envío —queda guardada para próximas compras— y después la forma de pago. El envío ya va incluido en el total, así que no aparece ningún cargo extra al final.',
    sinonimos: ['pasos de la compra', 'como compro', 'checkout', 'proceso de compra'],
    fuente: 'codigo',
  },
  {
    id: 'gevy-proveedor',
    proyecto: 'gevy',
    categoria: 'Si algo sale mal',
    pregunta: '¿Quién me responde si hay un problema con el producto?',
    respuesta:
      'Gevy. Compras a Gevy y reclamas a Gevy, con tu número de pedido. No tienes que averiguar quién fabrica o quién surte: eso es asunto nuestro, no tuyo.',
    sinonimos: ['a quien reclamo', 'quien vende', 'garantia', 'devolucion'],
    fuente: 'owner',
  },
] as const
