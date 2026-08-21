import type { Pregunta } from './tipos'

/**
 * PREGUNTAS FRECUENTES DE GENESIS.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CÓMO SE ELIGIÓ QUÉ ENTRA AQUÍ.
 *
 * No por intuición. Se midieron 789 mensajes de dos canales de soporte
 * reales (ago-2024 a ago-2026) y se contó de qué habla la gente:
 *
 *     migración de contrato viejo→nuevo ...... 26
 *     cuenta congelada / hold ................ 23
 *     no puedo entrar ........................ 13
 *     descuadre backoffice ↔ MetaMask ......... 8
 *     P2P ..................................... 5
 *     minado detenido ......................... 5
 *
 * Ese orden es el orden de este archivo. Una FAQ escrita desde la web
 * responde lo que uno cree que preguntan; ésta responde lo que preguntaron.
 *
 * Y una advertencia sobre el primer tema: la migración de contrato es
 * HISTÓRICA. Domina el recuento porque el periodo medido la incluye, no
 * porque siga pasando. Se responde para quien vuelva con un caso viejo, no
 * como si fuera un trámite vigente.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * LOS SINÓNIMOS SON LAS PALABRAS DE LA GENTE, NO LAS NUESTRAS. Nadie escribe
 * «acelerador de red»: escriben lo que oyeron hace dos años. Si el buscador
 * sólo conoce el vocabulario oficial, la pregunta correcta no encuentra su
 * respuesta y la persona concluye que no está documentada.
 */
export const PREGUNTAS_GENESIS: readonly Pregunta[] = [
  /* ════════════ ACCESO ════════════ */
  {
    id: 'gen-entrada-unica',
    proyecto: 'genesis',
    categoria: 'Acceso',
    pregunta: '¿Necesito una cuenta distinta para cada producto?',
    respuesta:
      'No. Hay una sola cuenta para todo el ecosistema. Los botones de Mining, Staking, Booster, G-Pulse y el marketplace llevan todos al mismo sitio: conect.aigenesis.io. Si ya entraste una vez, estás dentro de todo.',
    sinonimos: ['otra cuenta', 'me registro otra vez', 'cuenta para staking', 'una cuenta por producto'],
    fuente: 'codigo',
    enlace: 'https://conect.aigenesis.io/login',
  },
  {
    id: 'gen-solo-invitacion',
    proyecto: 'genesis',
    categoria: 'Acceso',
    pregunta: 'Quiero registrarme y me dice «ACCESO RESTRINGIDO»',
    respuesta:
      'Genesis es solo por invitación. Para abrir el formulario de alta hace falta un enlace que lleve el referido de quien te invitó — la parte «?ref=» de la dirección. Sin esa parte no hay registro que rellenar. Si te pasaron el enlace como botón y se recortó, pide que te lo manden como texto plano.',
    sinonimos: ['no me deja registrarme', 'acceso restringido', 'necesito invitacion', 'link de referido'],
    fuente: 'producto',
  },
  {
    id: 'gen-codigo-correo',
    proyecto: 'genesis',
    categoria: 'Acceso',
    pregunta: 'Me registré, ¿y ahora?',
    respuesta:
      'Al registrarte llega un código a tu correo para validar el alta. Hasta que lo introduzcas, el registro no queda confirmado. Si no aparece, revisa la carpeta de no deseados antes de repetir el proceso: crear una segunda cuenta no arregla el correo que falta y deja dos altas a medias.',
    sinonimos: ['codigo de verificacion', 'no me llega el correo', 'validar registro', 'confirmar cuenta'],
    fuente: 'owner',
  },
  {
    id: 'gen-no-reconoce',
    proyecto: 'genesis',
    categoria: 'Acceso',
    pregunta: 'Dice que no existe mi correo o mi wallet',
    respuesta:
      'Entra por donde te diste de alta. Si te registraste con correo y contraseña, entrar conectando la wallet no funciona, y al revés tampoco: el sistema no asocia las dos formas por su cuenta. Comprueba también que el correo sea exactamente el del alta.',
    sinonimos: ['no existe el email', 'no reconoce mi wallet', 'no puedo iniciar sesion', 'no me deja entrar'],
    fuente: 'producto',
  },
  {
    id: 'gen-olvide-contrasena',
    proyecto: 'genesis',
    categoria: 'Acceso',
    pregunta: 'Olvidé mi contraseña',
    respuesta:
      'Se resuelve sin ayuda de nadie: «¿Olvidaste la contraseña?» está en la propia pantalla de acceso y te manda un correo de recuperación desde una dirección de aigenesis.io. Si no llega, comprueba que escribiste el correo del alta — el sistema no avisa cuando una dirección no existe, y es a propósito, para no revelar quién tiene cuenta.',
    sinonimos: ['recuperar contrasena', 'cambiar clave', 'perdi mi password', 'resetear contrasena'],
    fuente: 'codigo',
  },

  /* ════════════ HOLD Y CUENTA CONGELADA ════════════ */
  {
    id: 'gen-que-es-hold',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'mining',
    pregunta: '¿Qué es el hold y por qué me lo piden?',
    respuesta:
      'El hold es una cantidad de AIG que la cuenta debe mantener para conservar sus beneficios activos. No es un cobro ni un depósito que se pierda: sigue siendo tuyo, sólo tiene que estar ahí. La cuenta muestra en qué banda estás — desde «Cumple Requisito» hasta «Óptimo», y «Beneficios Congelados» cuando cae por debajo.',
    sinonimos: ['que es el hold', 'porque me piden aig', 'retencion', 'holdeo'],
    fuente: 'codigo',
  },
  {
    id: 'gen-hold-anclado',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'mining',
    pregunta: 'Retiré mis AIG y la cuenta se congeló. ¿Por qué no baja lo que me piden?',
    respuesta:
      'Porque el hold NO se calcula sobre lo que tienes ahora, sino sobre lo que has minado históricamente. Sacar monedas no reduce el requisito: reduce lo que tienes para cubrirlo, y por eso la cuenta pasa a congelada. La propia pantalla lo enseña con la frase «Históricamente has minado…». Para reactivarla hay que devolver AIG hasta cubrir de nuevo el mínimo.',
    sinonimos: ['retire y se congelo', 'saque mis aig', 'cuenta frozen', 'porque sigo congelado'],
    /*
     * ES LA RESPUESTA MÁS IMPORTANTE DEL ARCHIVO. Explica de una vez los 23
     * casos de cuenta congelada: casi todos son la misma persona haciendo lo
     * mismo —retirar todo— y sin entender que el requisito no se mueve.
     * La política se identifica a sí misma «anclada a lo minado».
     */
    fuente: 'codigo',
  },
  {
    id: 'gen-hold-cuanto',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'mining',
    pregunta: '¿Cuánto AIG tengo que mantener exactamente?',
    respuesta:
      'El 14% de lo que has minado históricamente. Sobre ese mínimo hay bandas de margen —el sistema las llama Recomendado y Óptimo— que existen para que un movimiento pequeño no te deje por debajo del límite. La cifra exacta en AIG la calcula tu propia cuenta: mírala en el panel antes de mover nada, porque depende de tu histórico y no del de nadie más.',
    sinonimos: ['cuanto hold', 'que porcentaje', 'cuanto debo dejar', 'minimo de aig', '14%'],
    /*
     * EL PORCENTAJE SE ESCRIBE PORQUE EL OWNER LO CONFIRMÓ (19-ago-2026), no
     * porque lo leyera en el código. La distinción importa: en el código
     * está el valor que se ejecuta hoy; en la confirmación del owner está la
     * regla. Un valor puede cambiar por despliegue sin que cambie la regla.
     *
     * Y se mantiene la remisión al panel, que no es redundante: el 14% es el
     * porcentaje, pero la cantidad concreta depende del histórico de cada
     * cuenta. Dar sólo el porcentaje deja a la persona haciendo cuentas
     * sobre un número —lo minado— que casi nadie sabe de memoria.
     */
    fuente: 'owner',
  },
  {
    id: 'gen-hold-que-bloquea',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'mining',
    pregunta: 'Si bajo del hold, ¿qué deja de funcionar exactamente?',
    respuesta:
      'Se bloquean las recompensas: dejas de minar y no puedes reclamar. No es un bloqueo de la cuenta entera ni te quita nada de lo que ya tienes — lo que se detiene es la generación y el reclamo, hasta que vuelvas a cubrir el mínimo.',
    sinonimos: ['que se bloquea', 'que pierdo', 'puedo entrar si estoy congelado', 'me quitan mis aig'],
    /*
     * Esta pregunta existe porque «congelado» suena a confiscación. Decir con
     * precisión qué se detiene —y qué NO— evita el pánico que llena el canal
     * de soporte de gente convencida de que ha perdido sus monedas.
     */
    fuente: 'owner',
  },
  {
    id: 'gen-hold-como-cubrir',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'mining',
    pregunta: 'Me falta AIG para llegar al hold. ¿De dónde lo saco?',
    respuesta:
      'Se consigue en la comunidad, fuera de la herramienta. Genesis es una comunidad global: allá donde preguntes hay participantes con AIG, y ese intercambio se acuerda entre personas. Lo que la plataforma no hace es venderte el AIG que te falta.',
    sinonimos: [
      'donde compro aig', 'donde consigo aig', 'me falta aig para el hold',
      'como cubro el hold', 'completar mi holdeo', 'comprar aig',
    ],
    fuente: 'owner',
  },
  {
    id: 'gen-minado-no-corre',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'mining',
    pregunta: 'Mi minado no avanza',
    respuesta:
      'Lo primero que hay que mirar es el hold: si la cuenta está por debajo del mínimo, los beneficios quedan congelados y el contador se detiene. Comprueba el estado en tu panel antes de reportarlo como avería. Si el hold está cubierto y aun así no avanza, es un caso para el equipo.',
    sinonimos: ['minado detenido', 'no estoy minando', 'contador no se mueve', 'mineria parada'],
    fuente: 'codigo',
  },
  {
    id: 'gen-total-minado-erroneo',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'mining',
    pregunta: 'El total minado que muestra mi cuenta no me cuadra',
    respuesta:
      'Es un caso para el equipo y conviene reportarlo bien, porque esa cifra es la base sobre la que se calcula tu hold: si el total minado está mal, el mínimo que te piden también. Manda tu usuario, tu correo, la cantidad que muestra la plataforma, la que tú calculas y el hash de las transacciones que la sostienen. Sin los hashes no se puede reconstruir.',
    sinonimos: ['descuadre', 'no coincide con metamask', 'total minado erroneo', 'me sale el doble'],
    fuente: 'porDefinir',
  },

  {
    id: 'gen-reclamar-minimo',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'claim',
    pregunta: '¿Desde cuánto puedo reclamar?',
    respuesta:
      'Desde 10 USDT acumulados. Por debajo de esa cifra el reclamo no se puede ejecutar — no es una avería ni una cuenta bloqueada: hay que acumular hasta el mínimo. Es habitual quedarse con un resto pequeño al terminar un ciclo y no poder moverlo.',
    sinonimos: ['minimo para reclamar', 'no puedo retirar', 'me quedan pocos usdt', 'resto pendiente', '10 usdt'],
    fuente: 'owner',
  },
  {
    id: 'gen-reclamo-da-aig',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'claim',
    pregunta: 'Reclamé y me llegó AIG, no USDT',
    respuesta:
      'Es lo correcto. El protocolo lleva la cuenta de las recompensas en USDT porque es una unidad cómoda de medir, pero lo que se genera y se libera es AIG. Al reclamar, ese saldo contabilizado se convierte en AIG. Todas las pantallas lo advierten: los valores en USDT son estimaciones, no una promesa de valor.',
    sinonimos: ['me llego aig', 'esperaba usdt', 'porque no me dan dolares', 'me pagaron en otra moneda'],
    /*
     * El malentendido nace de la propia pantalla: la cifra grande lleva
     * símbolo de dólar y el descargo va en gris pequeño debajo. Quien mira
     * rápido lee «39,76 USDT disponible» y espera dólares.
     */
    fuente: 'owner',
  },
  {
    id: 'gen-cuanto-tarda-reclamo',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'claim',
    pregunta: 'Reclamé y no ha llegado nada',
    respuesta:
      'Un reclamo puede tardar desde un minuto hasta 72 horas en llegar a tu wallet, según el caso, por procesos de verificación y seguridad. Que no aparezca al momento no significa que haya fallado, y volver a reclamar no lo acelera. Pasadas 72 horas sí es un caso: escribe con el hash, la hora y el importe.',
    sinonimos: ['no me ha llegado', 'cuanto tarda', 'reclame y nada', 'sigue en proceso', '72 horas'],
    fuente: 'owner',
  },
  {
    id: 'gen-hold-donde-cuenta',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'mining',
    pregunta: 'Tengo AIG de sobra pero sigo por debajo del mínimo',
    respuesta:
      'Mira DÓNDE lo tienes. El mínimo se calcula sobre el AIG que hay en tu wallet on-chain — no cuenta la bóveda interna del protocolo ni la liquidez que tengas publicada en el P2P. Con la bóveda llena y la wallet vacía se sigue estando por debajo.',
    sinonimos: ['tengo aig y sigo congelado', 'no me cuenta el aig', 'boveda interna', 'donde cuenta el hold'],
    fuente: 'codigo',
  },
  {
    id: 'gen-descongelar-automatico',
    proyecto: 'genesis',
    categoria: 'Hold y estado de la cuenta',
    categoriaIncidencia: 'mining',
    pregunta: '¿Alguien tiene que descongelarme la cuenta?',
    respuesta:
      'No. En cuanto repones AIG en tu wallet hasta alcanzar el mínimo, el protocolo reactiva los beneficios de forma automática: no requiere soporte ni aprobación manual. La propia pantalla te lo dice cuando estás por debajo, indicándote cuánto AIG te falta exactamente.',
    sinonimos: ['descongelar mi cuenta', 'quien me activa', 'necesito soporte', 'me pueden activar'],
    fuente: 'codigo',
  },

  /* ════════════ P2P ════════════ */
  {
    id: 'gen-p2p-que-es',
    proyecto: 'genesis',
    categoria: 'P2P',
    categoriaIncidencia: 'p2p',
    pregunta: '¿Cómo funciona el P2P?',
    respuesta:
      'Es un tablón de comerciantes: cada fila es alguien que ya depositó liquidez, con su país, su rango de operación y cuántas transacciones lleva hechas. Filtras por país, moneda e importe, eliges la fila que te encaje y pulsas «Tomar». La operación se firma con MetaMask.',
    sinonimos: ['como vender aig', 'comprar aig', 'p2p pasos', 'como funciona el p2p', 'tomar oferta'],
    fuente: 'producto',
    enlace: 'https://g-pulse.aigenesis.io/dashboard/p2p',
  },
  {
    id: 'gen-p2p-401',
    proyecto: 'genesis',
    categoria: 'P2P',
    categoriaIncidencia: 'p2p',
    pregunta: 'El P2P me pide iniciar sesión aunque ya estoy dentro',
    respuesta:
      'Puede pasar: el P2P usa una credencial adicional a la de la aplicación, y si esa caduca aparece «Inicia sesión en Genesis para operar en el P2P.» aunque el resto funcione. Cerrar sesión y volver a entrar la regenera. Si en cambio ves que el servicio de libro no está disponible, eso es una caída del servicio y no hay nada que puedas arreglar desde tu cuenta.',
    sinonimos: ['inicia sesion en genesis', 'me saca del p2p', 'error 401', 'libro no disponible'],
    fuente: 'codigo',
  },

  {
    id: 'gen-p2p-publicar',
    proyecto: 'genesis',
    categoria: 'P2P',
    categoriaIncidencia: 'p2p',
    pregunta: 'Quiero vender AIG en el P2P y no me deja publicar',
    respuesta:
      'Para aparecer en el libro hay que ser comerciante, y para eso hay que depositar liquidez antes: Mi Perfil → activar perfil de comerciante → Depositar liquidez con MetaMask en red BEP20, en USDT o en AIG. Cuando el saldo queda acreditado, tu fila aparece en el libro. Para recuperar los fondos, mismo panel: Retirar.',
    sinonimos: ['no puedo publicar', 'como vendo', 'ser comerciante', 'depositar liquidez', 'publicar oferta'],
    fuente: 'producto',
    enlace: 'https://g-pulse.aigenesis.io/dashboard/p2p',
  },
  {
    id: 'gen-p2p-precio',
    proyecto: 'genesis',
    categoria: 'P2P',
    categoriaIncidencia: 'p2p',
    pregunta: '¿Quién decide el precio en el P2P?',
    respuesta:
      'Cada comerciante pone el suyo. La pantalla muestra un precio sugerido y una banda para que las ofertas sean comparables entre sí, y dentro de ese rango cada uno publica lo que quiere. No es una referencia de mercado abierto: es el rango que la propia interfaz propone.',
    sinonimos: ['quien pone el precio', 'precio sugerido', 'banda de precio', 'porque cuesta'],
    fuente: 'producto',
  },
  {
    id: 'gen-p2p-elegir',
    proyecto: 'genesis',
    categoria: 'P2P',
    categoriaIncidencia: 'p2p',
    pregunta: '¿Cómo sé de quién comprar?',
    respuesta:
      'Cada fila muestra el alias del anunciante, su país y cuántas transacciones lleva hechas — ésa es la información con la que se elige. También puedes filtrar por país, por moneda y por importe mínimo y máximo, para ver sólo lo que te encaja.',
    sinonimos: ['de quien compro', 'es confiable', 'reputacion', 'filtrar por pais'],
    fuente: 'producto',
  },

  {
    id: 'gen-valor-aig',
    proyecto: 'genesis',
    categoria: 'P2P',
    categoriaIncidencia: 'p2p',
    pregunta: '¿Cuánto vale un AIG?',
    respuesta:
      'AIG tiene un valor interno de referencia dentro del sistema — hoy 23,50 USD — que es el que usan el protocolo y la comunidad para operar entre sí. No es un precio de mercado abierto: AIG no cotiza en ningún exchange público, así que nadie puede prometerte que ese valor se sostenga fuera del ecosistema. En el P2P, cada comerciante publica su oferta alrededor de esa referencia.',
    sinonimos: ['cuanto vale aig', 'valor del aig', 'a cuanto esta', 'cuanto cuesta un aig', '23.5'],
    /*
     * LA CIFRA VIENE DEL OWNER (20-ago-2026) Y CUADRA CON DOS MEDICIONES
     * INDEPENDIENTES: la barra del portal muestra «AIG $23.5» y el libro P2P
     * publica sugerido $23,50 con banda $22–$25. Tres fuentes que coinciden.
     *
     * Y LA REDACCIÓN ESTÁ MEDIDA para pasar la guarda de lenguaje sin hacerle
     * trampa: dice «valor interno de referencia» —el término que la propia
     * guarda propone— y aclara en la misma frase que NO es precio de mercado.
     * Es la diferencia entre informar el número que el usuario ya ve en su
     * pantalla y afirmar un precio de mercado que no existe. La landing aprendió
     * esta lección en agosto: publicaba un precio y hubo que cambiar la
     * etiqueta, no el número.
     *
     * SI LA CIFRA CAMBIA: actualizar aquí y nada más — el resto del corpus
     * remite a «la referencia que muestra la pantalla» a propósito.
     */
    fuente: 'owner',
  },

  /* ════════════ CREDENCIALES ════════════ */
  {
    id: 'gen-cambiar-wallet',
    proyecto: 'genesis',
    categoria: 'Credenciales',
    pregunta: '¿Puedo cambiar la wallet de mi cuenta?',
    respuesta:
      'No. La wallet de una cuenta no se cambia: es la dirección donde se liquida lo que le corresponde, y reasignarla a petición convertiría un mensaje en una orden de pago a otra dirección. Si perdiste el acceso a tu wallet, es un caso para el equipo, y no existe ningún trámite que reasigne la cuenta a otra dirección porque se pida.',
    sinonimos: ['cambiar wallet', 'wallet nueva', 'perdi mi metamask', 'cambiar billetera'],
    fuente: 'owner',
  },
  {
    id: 'gen-nunca-se-pide',
    proyecto: 'genesis',
    categoria: 'Credenciales',
    pregunta: '¿Qué datos me puede pedir el soporte?',
    respuesta:
      'Tu usuario, tu correo, la wallet asociada y los hashes de las transacciones del caso. Nunca la contraseña, y nunca la frase de recuperación de tu wallet: nadie del equipo la necesita jamás, y quien te la pida está intentando robarte, aunque escriba desde un canal que parezca oficial.',
    sinonimos: ['me piden la clave', 'frase semilla', 'es seguro dar mi contrasena', 'estafa'],
    fuente: 'owner',
  },

  /* ════════════ HISTÓRICO ════════════ */
  {
    id: 'gen-contrato-viejo',
    proyecto: 'genesis',
    categoria: 'Casos históricos',
    categoriaIncidencia: 'retiro',
    pregunta: '¿Cómo funciona un cambio de contrato?',
    respuesta:
      'Cuando hay migración se anuncia por los canales oficiales, con los pasos y la dirección exacta a la que enviar. Envías tus monedas del contrato anterior y recibes las nuevas EN LA MISMA WALLET DESDE LA QUE ENVIASTE: no se entregan en otra dirección, así que la wallet que usas para enviar tiene que ser una a la que conserves el acceso.',
    sinonimos: ['contrato viejo', 'token antiguo', 'migrar mis aig', 'contrato nuevo', 'cambio de contrato'],
    /*
     * «La misma wallet que envía es la que recibe» va en mayúsculas porque es
     * donde se pierde el dinero. Quien envíe desde una wallet a la que ya no
     * tiene acceso —o desde la de otra persona— recibe en un sitio donde no
     * puede entrar, y eso no se deshace.
     */
    fuente: 'owner',
  },
  {
    id: 'gen-migracion-elegibles',
    proyecto: 'genesis',
    categoria: 'Casos históricos',
    categoriaIncidencia: 'retiro',
    pregunta: '¿Todas las monedas entran en una migración?',
    respuesta:
      'Entran las monedas legítimas, las que salieron de minar en el ecosistema. No entran las adquiridas en exchanges externos en vísperas de un cambio de contrato: la migración existe para acompañar a quien participa, no para que se acumule por fuera justo antes del canje.',
    sinonimos: ['monedas compradas', 'compre en exchange', 'entran todas', 'no me migraron'],
    /*
     * Se redacta como criterio y no como sospecha. Es una regla de
     * elegibilidad, y quien pregunta suele estar de buena fe: mucha gente
     * compró AIG por fuera sin saber que existía esta distinción. La
     * respuesta explica el porqué en lugar de sonar a acusación.
     */
    fuente: 'owner',
  },
  {
    id: 'gen-migracion-caso-viejo',
    proyecto: 'genesis',
    categoria: 'Casos históricos',
    categoriaIncidencia: 'retiro',
    pregunta: 'Envié al contrato antiguo y no recibí nada',
    respuesta:
      'Es un caso para el equipo y no se resuelve siguiendo instrucciones sueltas: las direcciones cambiaron varias veces y enviar a una dirección vieja no tiene vuelta atrás. Escribe con tu usuario, tu correo, la wallet desde la que enviaste y el hash de la transacción — sin el hash no se puede reconstruir lo que pasó. Y no repitas el envío mientras esperas respuesta.',
    sinonimos: [
      'no me llegaron', 'no me an llegado', 'no me han llegado', 'no llegaron',
      'envie y no recibi', 'envie al contrato viejo', 'perdi mis aig', 'hash de transaccion',
    ],
    fuente: 'porDefinir',
  },

  /* ════════════ BOOSTER Y STAKING (seed E4, 20-ago-2026) ════════════
   *
   * Lo que se puede afirmar con fuente: el CAMINO (tx on-chain → registro en
   * el servidor, con la vía de incidencias detrás). Lo que NO se afirma:
   * porcentajes y condiciones de compensación — eso es hueco DECLARADO
   * (`porDefinir`) hasta que el owner confirme cifras. La regla de siempre:
   * el hueco declarado vence a la respuesta verosímil.
   */
  {
    id: 'gen-booster-tras-pagar',
    proyecto: 'genesis',
    categoria: 'Booster y staking',
    categoriaIncidencia: 'booster',
    pregunta: 'Pagué el booster y no se refleja en mi cuenta',
    respuesta:
      'Primero: no repitas la compra ni reenvíes fondos. El pago del booster tiene dos pasos — la transacción en la cadena y el registro en el servidor — y a veces la cadena confirma antes de que el registro termine. Si el registro llega a fallar, el propio portal abre una incidencia en Soporte VIP con el hash de tu transacción para que el equipo la revise contra la cadena. Ten a mano ese hash: con él se reconstruye todo; sin él, no.',
    sinonimos: [
      'compre el booster y nada', 'el booster no aparece', 'pague y no se activo el paquete',
      'compre un pack y no sale', 'booster pendiente',
    ],
    fuente: 'producto',
  },
  {
    id: 'gen-cancelar-firma',
    proyecto: 'genesis',
    categoria: 'Booster y staking',
    pregunta: 'Cancelé la firma en la wallet — ¿se cobró algo?',
    respuesta:
      'No. Si cancelas la firma en tu wallet, la transacción nunca sale: no se mueve nada y no hay nada que revertir. Puedes intentarlo de nuevo cuando quieras. Solo si FIRMASTE y luego algo falló vale la pena revisar: en ese caso guarda el hash de la transacción y escribe a soporte con él.',
    sinonimos: [
      'rechace la transaccion', 'le di cancelar en metamask', 'user rejected',
      'cancele la firma', 'no firme al final',
    ],
    fuente: 'codigo',
  },
  {
    id: 'gen-rebooster-que-es',
    proyecto: 'genesis',
    categoria: 'Booster y staking',
    pregunta: '¿Qué es el rebooster?',
    respuesta:
      'Es la reinversión desde tu saldo de booster: en lugar de traer fondos nuevos desde la wallet, usas lo ya generado para reforzar el paquete. Tras confirmar, el registro sigue el mismo camino que una compra de booster — así que si algo no se refleja, aplica lo mismo: no repitas la operación y guarda el detalle de la confirmación para soporte.',
    sinonimos: ['rebooster', 'reinvertir booster', 'reinversion del saldo', 'volver a meter lo ganado'],
    fuente: 'codigo',
  },
  {
    id: 'gen-compensacion-binario',
    proyecto: 'genesis',
    categoria: 'Booster y staking',
    pregunta: '¿Cómo se calcula la compensación del binario y los equipos?',
    respuesta:
      'Los porcentajes y condiciones exactos del plan de compensación los confirma el equipo por los canales oficiales — preferimos no publicarte una cifra aquí sin esa confirmación, porque un número equivocado sobre tu compensación es peor que pedirte un paso más. Escríbenos por el canal oficial con tu usuario y te lo detallan sobre tu caso.',
    sinonimos: [
      'cuanto paga el binario', 'porcentaje de referidos', 'plan de compensacion',
      'cuanto gano por equipo', 'comision del binario', 'pierna izquierda derecha',
    ],
    fuente: 'porDefinir',
  },
  {
    id: 'gen-novedades',
    proyecto: 'ecosistema',
    categoria: 'Novedades',
    pregunta: '¿Cuándo sale la próxima actualización o novedad?',
    respuesta:
      'Las fechas y novedades se anuncian únicamente por los canales oficiales del ecosistema. Si viste una fecha en otro lado, trátala con cautela: nadie fuera del equipo puede confirmarla. Cuando algo esté disponible, lo verás anunciado — y aquí se responde sobre lo que ya existe, no sobre promesas.',
    sinonimos: [
      'cuando sale', 'fecha de lanzamiento', 'proxima actualizacion', 'que viene ahora',
      'nuevo proyecto', 'roadmap',
    ],
    fuente: 'porDefinir',
  },
] as const
