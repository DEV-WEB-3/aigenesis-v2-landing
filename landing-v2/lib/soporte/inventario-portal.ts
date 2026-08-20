/**
 * INVENTARIO DE LA OFICINA VIRTUAL — QUÉ HAY, DÓNDE, Y QUÉ HE VISTO YO.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PARA QUÉ SIRVE ESTE ARCHIVO.
 *
 * Un asistente de soporte que no sabe dónde está cada cosa manda a la gente a
 * pantallas que no existen. Esto es el mapa: cada página, su ruta real, y las
 * funciones que ofrece, con los pasos para llegar a cada una.
 *
 * Y LLEVA ESTADO POR FUNCIÓN, que es la parte que lo hace fiable:
 *
 *   'visto'     — lo he abierto con sesión real y lo he leído en pantalla.
 *   'parcial'   — he visto la pantalla, pero no toda su profundidad
 *                 (pestañas sin abrir, modales sin desplegar, listas largas).
 *   'pendiente' — no lo he abierto todavía. No se explica en soporte.
 *   'nolopuedo' — requiere ejecutar una acción con dinero real. No se toca.
 *
 * LA ÚLTIMA CATEGORÍA ES DELIBERADA Y NO VA A CAMBIAR. Publicar una orden,
 * depositar liquidez, retirar o confirmar un pago mueven fondos de una
 * persona real. Se documenta hasta el botón y ahí se para; el paso siguiente
 * lo describe quien lo haya hecho, o se deriva. Inventar el final de un flujo
 * de dinero es exactamente la clase de error que no se puede permitir.
 *
 * La cobertura se calcula abajo con `resumenDeCobertura()`. Es a propósito:
 * si el número lo escribo a mano, envejece el día que añada una función y se
 * me olvide. Que lo cuente el programa.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * DOMINIO: g-pulse.aigenesis.io — mismo build que conect.aigenesis.io
 * (`index-DscnE5mF.js` en ambos). No son dos productos.
 * RECORRIDO: 19-ago-2026, con sesión del owner.
 */

export type EstadoDeComprobacion = 'visto' | 'parcial' | 'pendiente' | 'nolopuedo'

export interface FuncionDePagina {
  nombre: string
  /** Cómo se llega, en pasos que un usuario puede seguir tal cual. */
  pasos: readonly string[]
  estado: EstadoDeComprobacion
  /** Lo que hay que saber para explicarlo sin meter la pata. */
  notas?: string
}

export interface PaginaDelPortal {
  ruta: string
  /**
   * EL TEXTO LITERAL DEL BOTÓN EN LA BARRA LATERAL. Se separa de `nombre` a
   * propósito: una guía tiene que poder decir «pulsa X» con la palabra exacta
   * que la persona ve, y varios rótulos del producto usan todavía vocabulario
   * que la landing retiró. Tener los dos campos deja esa diferencia a la vista
   * en vez de esconderla.
   */
  rotulo?: string
  nombre: string
  /** En una frase: para qué entra alguien aquí. */
  proposito: string
  funciones: readonly FuncionDePagina[]
}

export const INVENTARIO_PORTAL: readonly PaginaDelPortal[] = [
  {
    ruta: '/login',
    nombre: 'Acceso',
    proposito: 'La única puerta del ecosistema. Todo lo demás cuelga de aquí.',
    funciones: [
      {
        nombre: 'Entrar con correo y contraseña',
        pasos: [
          'Abrir g-pulse.aigenesis.io (o conect.aigenesis.io: es la misma aplicación).',
          'CERRAR el diálogo de wallet que se abre encima — el formulario está detrás.',
          'Escribir correo y contraseña.',
          'Pulsar «Entrar».',
        ],
        estado: 'visto',
        notas:
          'El modal de WalletConnect se abre solo y tapa el formulario. Es el primer punto de abandono del ecosistema: quien no lo cierre cree que hace falta una cartera.',
      },
      {
        nombre: 'Entrar conectando la wallet',
        pasos: [
          'En el diálogo que ya aparece: MetaMask, Trust, WalletConnect o «todas las wallets».',
          'Firmar el mensaje que pide la aplicación.',
        ],
        estado: 'parcial',
        notas:
          'Se ve el diálogo y sus opciones. No he completado la firma: entrar con la wallet de otra persona no es algo que deba hacer yo.',
      },
      {
        nombre: 'Recuperar la contraseña',
        pasos: ['Pulsar «¿Olvidaste la contraseña?».', 'Seguir el correo que llega.'],
        estado: 'parcial',
        notas: 'El enlace lleva a /forgot-password. No he disparado el correo.',
      },
      {
        nombre: 'Enlace profundo',
        pasos: ['Abrir cualquier ruta interna sin sesión.'],
        estado: 'visto',
        notas:
          'COMPROBADO: pedí /dashboard/gpulse-lobby sin sesión, me mandó a /login y tras entrar volvió solo al lobby. Un enlace a una sección concreta no se pierde al iniciar sesión.',
      },
    ],
  },

  {
    ruta: '(modal, antes del lobby)',
    nombre: 'Acuerdo de Uso y Responsabilidad',
    proposito: 'Puerta legal obligatoria. Bloquea el portal hasta aceptarla.',
    funciones: [
      {
        nombre: 'Aceptar el acuerdo',
        pasos: [
          'Leer las ocho secciones del diálogo.',
          'Marcar la casilla «I have read and accept the terms».',
          'Pulsar «Continuar» — está deshabilitado hasta marcar la casilla.',
        ],
        estado: 'visto',
        notas:
          'Quien no vea la casilla piensa que la aplicación está rota, porque el botón no responde. El texto completo está en `acuerdo-de-uso.ts`; es lo único que TODOS los usuarios han aceptado.',
      },
    ],
  },

  {
    ruta: '/',
    nombre: 'VIP Lobby',
    proposito: 'Resumen esencial de la cuenta. Es la primera pantalla tras entrar.',
    funciones: [
      {
        nombre: 'Leer los cuatro saldos',
        pasos: ['Están en la tarjeta principal, uno al lado del otro.'],
        estado: 'visto',
        notas:
          'TOTAL MINED (base del 14%) · AIG EN WALLET (lo que se ve en MetaMask) · BÓVEDA INTERNA (dentro del protocolo) · y la tarjeta de USDT disponible, que la interfaz sigue rotulando con el término que la landing retiró en agosto. Son CUATRO cosas distintas y ninguna cuadra con otra: es el origen de los descuadres reportados en soporte.',
      },
      {
        nombre: 'Copiar enlace de referido (izquierdo / derecho)',
        pasos: ['Botones «Izq» y «Der» en la cabecera.'],
        estado: 'visto',
        notas:
          'Son DOS enlaces distintos, uno por pierna. Quien reparta siempre el mismo llena un solo lado y no genera emparejamiento.',
      },
      {
        nombre: 'Estado del protocolo',
        pasos: ['Botón de estado en la cabecera → «Abrir detalle».'],
        estado: 'parcial',
        notas:
          'La etiqueta coincide con el código: «Óptimo · Máxima estabilidad frente al crecimiento futuro». No he abierto el detalle.',
      },
      {
        nombre: 'Actividad reciente',
        pasos: ['Lista al final de la página.'],
        estado: 'visto',
        notas:
          'Cada entrada lleva tipo (referido, poolStaking1), fecha, importe en USDT y HASH de transacción. El hash es lo que pide soporte para reconstruir un caso.',
      },
    ],
  },

  {
    ruta: '/dashboard',
    nombre: 'Panel',
    proposito: 'Vista operativa con alertas, balance total y accesos rápidos.',
    funciones: [
      {
        nombre: 'Sistema de alertas en vivo',
        pasos: ['Aparecen arriba. Se cierran una a una o con «Descartar todas».'],
        estado: 'visto',
        notas:
          'ATENCIÓN: varias alertas dicen a la persona qué hacer con su dinero («considera componer reinvirtiendo», «redistribuir puede acelerar el retorno»). Está señalado al owner como riesgo de lenguaje.',
      },
      {
        nombre: 'Balance y minería',
        pasos: ['Tarjetas «TU BALANCE» y «G-ORACLE · MINING».'],
        estado: 'visto',
        notas: 'Muestra aporte total, generado, acumulado y número de packs activos.',
      },
      {
        nombre: 'Invitar y crecer la red',
        pasos: ['Sección al final: «Copiar Izquierdo» / «Copiar Derecho».'],
        estado: 'visto',
      },
    ],
  },

  {
    ruta: '/dashboard/mi-red',
    rotulo: 'Red Binaria',
    nombre: 'Estructura de referidos',
    proposito: 'La estructura de referidos y el cálculo de sus recompensas.',
    funciones: [
      {
        nombre: 'Ver volumen por pierna',
        pasos: ['Tarjetas «Equipo izquierdo» y «Equipo derecho».'],
        estado: 'visto',
        notas: 'Volumen del ciclo en puntos (USDT), acumulado histórico y número de unidades.',
      },
      {
        nombre: 'Entender la regla del 50%',
        pasos: ['Tabla «Puntos acumulados · regla 50%».'],
        estado: 'visto',
        notas:
          'Al cierre de mes se CONSERVA el 50% de los puntos como arrastre. La tabla separa arrastre, puntos nuevos, total del ciclo e histórico. Es la mecánica que el acuerdo legal llama «flash mensual».',
      },
      {
        nombre: 'Ver el acelerador pendiente',
        pasos: ['Tarjeta «Bono pendiente por cobrar · 11% pierna menor».'],
        estado: 'visto',
        notas:
          'La misma página usa dos vocabularios: arriba «acelerador binario», abajo «bono». Es la contradicción de terminología pendiente de decisión del owner.',
      },
      {
        nombre: 'Explorar la matriz',
        pasos: ['Visor de matriz: rueda para zoom, arrastrar para mover, selector de 3 o 5 niveles.'],
        estado: 'parcial',
        notas:
          'El zoom es SÓLO visual: para cargar más unidades hay que usar el selector de niveles, no acercarse. Es una confusión garantizada.',
      },
    ],
  },

  {
    ruta: '/dashboard/p2p',
    nombre: 'P2P',
    proposito: 'Comprar y vender AIG entre participantes.',
    funciones: [
      {
        nombre: 'Comprar AIG tomando una oferta',
        pasos: [
          'Pestaña «Comprar AIG».',
          'Filtrar por país, moneda e importe mínimo/máximo.',
          'Elegir una fila mirando alias, país y número de transacciones.',
          'Pulsar «Tomar» y firmar con MetaMask.',
        ],
        estado: 'nolopuedo',
        notas: 'Visto el libro y los filtros. «Tomar» mueve dinero: no se pulsa.',
      },
      {
        nombre: 'Publicar en el libro (ser comerciante)',
        pasos: [
          'Pestaña «Mi Perfil» → perfil de comerciante.',
          'Depositar liquidez con MetaMask, red BEP20, en USDT o AIG.',
          'PAI acredita el saldo y aparece tu fila en el libro.',
        ],
        estado: 'nolopuedo',
        notas:
          'La pantalla avisa: «El marketplace visible usa comerciantes PAI, no órdenes Mongo V2». No se puede publicar sin depositar antes.',
      },
      {
        nombre: 'Retirar liquidez de comerciante',
        pasos: ['Mi Perfil → Retirar USDT / AIG.'],
        estado: 'nolopuedo',
      },
      {
        nombre: 'Mis órdenes e historial',
        pasos: ['Pestañas «Mis órdenes» e «Historial».'],
        estado: 'pendiente',
      },
    ],
  },

  {
    ruta: '/dashboard/booster',
    nombre: 'Booster',
    proposito: 'Acelerar la velocidad de generación del protocolo.',
    funciones: [
      {
        nombre: 'Ver generación en tiempo real',
        pasos: ['Tarjeta superior: USDT/segundo y AIG/segundo.'],
        estado: 'visto',
        notas:
          'La propia página se distancia: «Participación en aceleración — no es un depósito ni un producto financiero». Conviene citarla tal cual.',
      },
      {
        nombre: 'Historial de aportes',
        pasos: ['Lista de boosters con su identificador, aporte y total generado.'],
        estado: 'visto',
        notas: 'Cada booster tiene estado ACTIVE y un progreso agregado con límite de ciclo.',
      },
      {
        nombre: 'Contratar un booster',
        pasos: ['No localizado en la pantalla recorrida.'],
        estado: 'pendiente',
      },
    ],
  },

  {
    ruta: '/dashboard/staking',
    nombre: 'Staking',
    proposito: 'Bloquear AIG para aumentar la participación en la distribución.',
    funciones: [
      {
        nombre: 'Mi Bóveda',
        pasos: ['Pestaña «Mi Bóveda».'],
        estado: 'visto',
        notas:
          'Muestra masa crítica activa, energía materializable y unidades vivas. Cada unidad lleva su identificador y su FECHA DE DESBLOQUEO — el dato que más se pregunta.',
      },
      { nombre: 'Forjar Energía (stakear)', pasos: ['Pestaña «Forjar Energía».'], estado: 'nolopuedo' },
      { nombre: 'La Red', pasos: ['Pestaña «La Red».'], estado: 'pendiente' },
    ],
  },

  {
    ruta: '/dashboard/nft',
    nombre: 'NFT',
    proposito: 'Los instrumentos tokenizados ligados a minería, booster y estatus.',
    funciones: [
      {
        nombre: 'Ver instrumentos por modo',
        pasos: ['Pestañas «Modo Mining», «Modo Booster», «Modo Staking».'],
        estado: 'visto',
        notas:
          'Cada NFT muestra aporte, total acumulado, progreso contra la «regla 250%» y días de vida. El estado puede ser ACTIVE o ENDED.',
      },
    ],
  },

  {
    ruta: '/dashboard/wallet',
    nombre: 'Portfolio',
    proposito: 'Las operaciones financieras de la cuenta interna.',
    funciones: [
      {
        nombre: 'Cambiar la vista entre USDT y AIG',
        pasos: ['Interruptor «Visualizar en: USDT / AIG».'],
        estado: 'visto',
        notas:
          'La misma cifra se enseña en dos monedas. Al leer una captura de un usuario hay que mirar primero en qué modo está, o se compara mal.',
      },
      { nombre: 'Reclamar (claim)', pasos: ['Acción de wallet: «Claim y retiros».'], estado: 'nolopuedo' },
      { nombre: 'Retirar a wallet externa', pasos: ['Acción de wallet: «Claim y retiros».'], estado: 'nolopuedo' },
    ],
  },

  {
    ruta: '/dashboard/promo',
    nombre: 'Promo',
    proposito: 'Incentivos, eventos y clasificaciones.',
    funciones: [
      {
        nombre: 'Ver campañas y progreso',
        pasos: ['Tarjetas de campaña con su barra de progreso.'],
        estado: 'visto',
        notas:
          'Hay campañas con premio en USD y con destino de viaje. El lenguaje de esta página es el más comercial del portal.',
      },
    ],
  },

  {
    ruta: '/dashboard/topg',
    nombre: 'Top G',
    proposito: 'Clasificación de líderes de la comunidad.',
    funciones: [
      {
        nombre: 'Ver el ranking',
        pasos: ['Podio y tabla de posiciones.'],
        estado: 'visto',
        notas:
          'OJO: los perfiles que muestra (@CryptoKing, @OracleNode, @AIGWhale) y los comentarios de comunidad tienen toda la pinta de ser datos de ejemplo. No se citan como reales en soporte hasta confirmarlo.',
      },
    ],
  },

  {
    ruta: '/dashboard/profile',
    nombre: 'Perfil',
    proposito: 'Identidad, rango y logros dentro del protocolo.',
    funciones: [
      {
        nombre: 'Ver rol, nivel y progreso de rango',
        pasos: ['Pantalla principal del perfil.'],
        estado: 'visto',
        notas: 'Muestra rol, volumen de red del mes, ledger neto y nivel.',
      },
    ],
  },

  {
    ruta: '/dashboard/history',
    nombre: 'Historial operativo',
    proposito: 'El registro de movimientos de la cuenta.',
    funciones: [{ nombre: 'Consultar movimientos', pasos: ['Pantalla principal.'], estado: 'pendiente' }],
  },

  {
    ruta: '/dashboard/support',
    nombre: 'Soporte VIP',
    proposito: 'Centro de ayuda: tickets, chat en vivo y asistencia con IA.',
    funciones: [
      {
        nombre: 'Abrir un ticket',
        pasos: ['Botón «Nuevo ticket».', 'Filtros: todos, abiertos, cerrados, alta prioridad.'],
        estado: 'parcial',
        notas:
          'ESTÁ MAQUETADO, NO CONECTADO. La propia pantalla dice «Señales operativas simuladas» y los tickets son de ejemplo. Uno se titula «Acceso cuenta / 2FA» y 2FA no existe en el producto: es contenido de relleno.',
      },
      {
        nombre: 'Alternar entre modo humano y modo IA',
        pasos: ['Dentro de un ticket: pestañas «HUMANO» e «IA».'],
        estado: 'visto',
        notas:
          'El modo humano se describe como «cola de agentes certificados L1 / L2». Al cablearlo, el «no lo sé» del buscador debe caer aquí y no en una respuesta inventada.',
      },
    ],
  },

  {
    ruta: '/dashboard/marketplace',
    nombre: 'Marketplace (Gevy)',
    proposito: 'La tienda del ecosistema.',
    funciones: [
      { nombre: 'Catálogo y ficha de producto', pasos: ['Desde la barra: Marketplace.'], estado: 'pendiente' },
      { nombre: 'Carrito y caja', pasos: ['Añadir al carrito → caja.'], estado: 'nolopuedo' },
    ],
  },

  {
    ruta: '(externo)',
    nombre: 'TAG Markets',
    proposito: 'Portal enlazado desde la cabecera. Sin explorar.',
    funciones: [{ nombre: 'Abrir el portal', pasos: ['Botón «TAG MARKETS» en la cabecera.'], estado: 'pendiente' }],
  },

  {
    ruta: '/gpulse',
    nombre: '⚠️ Pantalla antigua del Oracle',
    proposito: 'NO es la oficina virtual. Se documenta para saber distinguirla.',
    funciones: [
      {
        nombre: 'Reconocerla y no confundirla',
        pasos: ['Se llega por la ruta /gpulse, sin /dashboard.'],
        estado: 'visto',
        notas:
          'Se abre SIN sesión y se pinta entera. Es una pantalla vieja del mismo build, con mesa y escalera de apuestas. Si un usuario describe algo que no encaja con el portal, comprobar primero si está aquí.',
      },
    ],
  },
] as const

/**
 * COBERTURA, CALCULADA. Nunca a mano: un porcentaje escrito envejece el día
 * que se añade una función y se olvida actualizarlo, y entonces miente con
 * toda la autoridad de un número.
 */
export function resumenDeCobertura() {
  const todas = INVENTARIO_PORTAL.flatMap((p) => p.funciones)
  const porEstado = (e: EstadoDeComprobacion) => todas.filter((f) => f.estado === e).length
  return {
    paginas: INVENTARIO_PORTAL.length,
    funciones: todas.length,
    visto: porEstado('visto'),
    parcial: porEstado('parcial'),
    pendiente: porEstado('pendiente'),
    nolopuedo: porEstado('nolopuedo'),
    /** Lo que soporte puede explicar hoy sin arriesgarse. */
    explicables: porEstado('visto') + porEstado('parcial'),
  }
}
