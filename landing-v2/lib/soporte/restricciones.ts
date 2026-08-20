/**
 * POR QUÉ NO PUEDO RECLAMAR — LA TABLA DE DIAGNÓSTICO.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * ESTE ARCHIVO CONVIERTE UN TICKET EN UNA RESPUESTA DE DIEZ SEGUNDOS.
 *
 * «No puedo reclamar» tiene al menos seis causas distintas, y el sistema YA
 * SABE cuál es la de cada cuenta: lleva un código interno de restricción.
 * Sin esta tabla, soporte adivina; con ella, pregunta una cosa y acierta.
 *
 * Y hay un hallazgo que ahorra una categoría entera de tickets. El propio
 * producto lo dice al usuario cuando está por debajo del mínimo:
 *
 *     «Al retener o adquirir +N AIG y alcanzar el 14% de holding, el
 *      protocolo reactiva beneficios de forma automática.
 *      NO REQUIERE SOPORTE NI APROBACIÓN MANUAL.»
 *
 * Es decir: la enorme mayoría de los «tengo la cuenta congelada, ayúdenme a
 * descongelarla» no necesitan que nadie haga nada. Necesitan saber esa frase.
 * En el canal de soporte hay 23 casos de cuenta congelada, y varios llevaban
 * días esperando una intervención que nunca hizo falta.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * FUENTE: `GenesisDashboardPage-Ddii3BV_.js`, leído el 19-ago-2026. Los
 * códigos son los internos del producto; los textos, literales de pantalla.
 */

/**
 * LOS TRES NIVELES DE HOLDING. El mínimo no es el objetivo: es el borde del
 * precipicio. Por eso el producto recomienda quedarse por encima.
 */
export const NIVELES_DE_HOLDING = {
  minimo: {
    pct: 14,
    queSignifica: 'Por debajo de aquí se detienen los beneficios. Es el borde, no la meta.',
    rotuloEnPantalla: 'AIG mínimo en wallet (14 % del minado histórico)',
  },
  recomendado: {
    pct: 19,
    queSignifica:
      'El margen que evita que un movimiento pequeño te deje por debajo. La pantalla lo aconseja expresamente para «reducir riesgo de nueva limitación».',
  },
  optimo: {
    pct: 24,
    queSignifica: 'Máxima estabilidad frente al crecimiento futuro del histórico minado.',
  },

  /**
   * EL DETALLE QUE MÁS CONFUNDE, Y HAY QUE DECIRLO SIEMPRE.
   *
   * El porcentaje se mide contra el AIG que hay EN LA WALLET on-chain (BSC).
   * No cuenta la bóveda interna. Alguien con la bóveda llena y la wallet
   * vacía está por debajo del mínimo y no entiende por qué.
   */
  seMideContra:
    'El AIG que hay en tu wallet on-chain (BSC). NO cuenta la bóveda interna del protocolo, ni la liquidez publicada en el P2P.',
  laBase: 'El total minado históricamente — no lo que tienes ahora.',
} as const

export interface Restriccion {
  /** Código interno del producto. Sirve para hablar con el equipo técnico. */
  codigo: string
  /** Cómo lo cuenta la persona cuando escribe. */
  comoLoDescribeElUsuario: string
  causa: string
  /** Qué hace que se levante. Literal de pantalla cuando existe. */
  comoSeResuelve: string
  /** Si hace falta que intervenga alguien del equipo. Casi nunca. */
  necesitaSoporte: boolean
}

export const RESTRICCIONES: readonly Restriccion[] = [
  {
    codigo: 'holding por debajo del mínimo',
    comoLoDescribeElUsuario:
      '«Tengo la cuenta congelada», «no me deja reclamar», «me pide AIG», «frozen».',
    causa:
      'El AIG en la wallet on-chain está por debajo del 14% del total minado histórico. Suele pasar justo después de retirar.',
    comoSeResuelve:
      'Reponer AIG en la wallet hasta alcanzar el mínimo. El protocolo reactiva los beneficios DE FORMA AUTOMÁTICA: no requiere soporte ni aprobación manual.',
    necesitaSoporte: false,
  },
  {
    codigo: 'ledger_min_not_met',
    comoLoDescribeElUsuario: '«Tengo saldo pero no me deja sacarlo», «no llega al mínimo».',
    causa: 'No se alcanza la liquidez mínima que el protocolo exige en el ledger.',
    comoSeResuelve:
      'Al mantener la liquidez mínima, los reclamos se habilitan en la siguiente sincronización — no al instante, pero solo.',
    necesitaSoporte: false,
  },
  {
    codigo: 'economically_inactive',
    comoLoDescribeElUsuario: '«No me aparece nada para reclamar», «mi cuenta no hace nada».',
    causa:
      'La cuenta no tiene minería, acelerador ni staking activos. Sin actividad, los reclamos globales ni se evalúan.',
    comoSeResuelve:
      'Al activar minería, acelerador o staking, la cuenta pasa a estado económicamente activo y los reclamos se evalúan de nuevo.',
    necesitaSoporte: false,
  },
  {
    codigo: 'zero_claimable',
    comoLoDescribeElUsuario: '«El botón está apagado», «no me deja darle a reclamar».',
    causa: 'No hay nada devengado todavía, o el sistema reporta cero reclamable en esa línea.',
    comoSeResuelve:
      'No hay nada que hacer: es que aún no hay importe. La pantalla lo dice — «Aún no hay devengo suficiente o el backend reporta 0 reclamable.»',
    necesitaSoporte: false,
  },
  {
    codigo: 'no_session',
    comoLoDescribeElUsuario: '«Se me apagan los botones», «me lo pide otra vez».',
    causa: 'La sesión caducó o no llegó a establecerse del todo.',
    comoSeResuelve: 'Volver a entrar. Tras iniciar sesión el protocolo reevalúa el estado y habilita lo que corresponda.',
    necesitaSoporte: false,
  },
  {
    codigo: 'permission_denied',
    comoLoDescribeElUsuario: '«Me dice que no tengo permiso».',
    causa: 'La cuenta no tiene habilitada esa acción.',
    comoSeResuelve: 'Esto sí es para el equipo: no hay nada que la persona pueda cambiar por su cuenta.',
    necesitaSoporte: true,
  },
  {
    codigo: 'simulation_mode',
    comoLoDescribeElUsuario: '«Reclamé y no me llegó nada».',
    causa: 'La cuenta o la pantalla están en modo simulación: los movimientos no son reales.',
    comoSeResuelve: 'Comprobar en qué modo está antes de tratarlo como pérdida de fondos.',
    necesitaSoporte: true,
  },
]

/**
 * CUÁNTO TARDA UN RECLAMO EN LLEGAR. Dato del owner, 19-ago-2026.
 *
 * Va destacado porque es la causa de los tickets duplicados: la persona no ve
 * el dinero a los diez minutos, da por hecho que se perdió, y vuelve a
 * reclamar o abre tres tickets. Decir el plazo POR ADELANTADO —en la propia
 * confirmación, no cuando ya está nerviosa— evita casi todos.
 */
export const PLAZO_DE_UN_RECLAMO = {
  desde: '1 minuto',
  hasta: '72 horas',
  porQue: 'Procesos de verificación y seguridad. El plazo depende del caso.',
  queDecir:
    'Un reclamo puede tardar desde un minuto hasta 72 horas en llegar a tu wallet, según el caso, por procesos de verificación y seguridad. Que no aparezca al momento no significa que haya fallado.',
  cuandoEsUnCaso:
    'Pasadas 72 horas sin que llegue, sí es un caso: se reporta con el hash, la hora y el importe.',
} as const

/**
 * EL MÍNIMO PARA RECLAMAR, Y LO QUE DE VERDAD OCURRE AL RECLAMAR.
 *
 * Confirmado por el owner el 19-ago-2026, y es la pieza que faltaba para
 * entender la pantalla entera.
 *
 * Lo importante no es sólo la cifra: es que el reclamo NO ENTREGA USDT. El
 * protocolo lleva la cuenta de las recompensas en USDT —como unidad de
 * medida— y al reclamar convierte ese saldo en AIG, que es lo que realmente
 * se genera. El descargo que aparece en todas las pantallas ya lo dice, pero
 * está escrito en gris y pequeño debajo de una cifra grande con el símbolo
 * del dólar, así que casi nadie lo lee así.
 *
 * De ahí sale un malentendido caro: alguien ve «39,76 USDT disponible»,
 * reclama esperando dólares, y recibe AIG. Si soporte no lo aclara ANTES,
 * ese caso llega como «me pagaron en otra moneda».
 */
export const RECLAMO_MINIMO = {
  minimoUsdt: 10,
  queHaceRealmente: 'Convierte a AIG el saldo que el protocolo tiene contabilizado en USDT.',
  queDecir:
    'Puedes reclamar a partir de 10 USDT acumulados. Al reclamar, ese saldo se convierte en AIG: el USDT es la unidad en la que el protocolo lleva la cuenta, y lo que se libera es AIG.',
  porDebajoDelMinimo:
    'Con menos de 10 USDT el reclamo no se puede ejecutar. No es un fallo ni una cuenta bloqueada: hay que acumular hasta el mínimo.',
  /*
   * Esto explica un caso concreto del canal de soporte que quedó sin
   * respuesta: alguien terminó su paquete con 3,32 USDT pendientes y no podía
   * retirarlos. No era una avería — estaba por debajo del mínimo.
   */
  casoTipico:
    'Quien termina un ciclo con un resto pequeño puede quedarse por debajo de 10 USDT y no poder moverlo. Es el comportamiento esperado.',
  fuente: 'Owner, 19-ago-2026',
} as const

/**
 * LA REGLA QUE DEBERÍA ESTAR EN TODAS LAS RESPUESTAS DE ESTE BLOQUE.
 *
 * Cinco de las siete restricciones se resuelven solas. Un soporte que trate
 * todas como incidencias genera espera, ansiedad y tickets duplicados sobre
 * algo que la persona podía arreglar en dos minutos.
 */
export const REGLA_DE_ORO =
  'Antes de escalar un «no puedo reclamar», identifica cuál de las siete causas es. Cinco de las siete las resuelve la propia persona, y la más frecuente —el holding— se reactiva sola en cuanto se repone el AIG.'
