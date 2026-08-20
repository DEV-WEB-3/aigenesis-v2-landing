/**
 * QUÉ SE PUEDE CAMBIAR DE UNA CUENTA, Y QUIÉN LO CAMBIA.
 *
 * Este archivo existe por una equivocación mía que conviene dejar escrita.
 *
 * Al leer el canal de WhatsApp de soporte conté trece peticiones de «cambio
 * de wallet» y se lo reporté al owner como un riesgo abierto: cualquiera que
 * escriba ahí podría pedir que se cambie la wallet de una cuenta. La
 * respuesta corrigió la premisa entera (19-ago-2026): **la wallet no se
 * cambia**, y aquel canal no era abierto — era el canal con líderes
 * concretos, y por ahí sólo se tramitaban casos de esos líderes.
 *
 * El error de método: leí un registro de conversaciones y deduje la política
 * a partir de lo que la gente PEDÍA. Lo que se pide no es lo que se concede.
 * Un canal donde entran trece peticiones puede haberlas rechazado todas.
 *
 * PARA QUÉ SIRVE ESTO EN SOPORTE: es la lista de lo que el asistente puede
 * prometer. Prometer un cambio que no se hace es peor que decir «eso no se
 * cambia», porque la persona espera y luego se enfada dos veces.
 */

export const POLITICA_CREDENCIALES = {
  /**
   * LO QUE LA PERSONA RESUELVE SOLA. Va primero a propósito: si hay camino
   * autoservicio y el asistente no lo ofrece, genera un ticket que sobraba.
   */
  autoservicio: [
    {
      que: 'Contraseña olvidada',
      como: 'Desde «¿Olvidaste la contraseña?» en la propia pantalla de acceso. Llega un correo de recuperación desde una dirección de aigenesis.io.',
      /*
       * Comprobado en el paquete de producción: existen tanto la pantalla
       * (`ForgotPasswordPage`) como su API (`genesisPasswordRecoveryApi`) y
       * la pantalla de restablecer (`ResetPasswordPage`). No es una promesa:
       * el camino está construido.
       */
      comprobado: '19-ago-2026, en el código que sirve conect.aigenesis.io',
    },
  ],

  /**
   * LO QUE NO SE CAMBIA. Una sola entrada, y es la más importante del
   * archivo.
   */
  noSeCambia: [
    {
      que: 'La wallet asociada a la cuenta',
      porque:
        'La wallet es la identidad económica de la cuenta: es donde se liquida lo que le corresponde. Cambiarla a petición convertiría un mensaje en una orden de pago a otra dirección.',
      queDecir:
        'La wallet de una cuenta no se cambia. Si perdiste el acceso a tu wallet, es un caso para el equipo y no se resuelve por chat: no hay ningún procedimiento que reasigne una cuenta a otra dirección a petición.',
      /*
       * Esta redacción evita la trampa clásica: decir «escribe a soporte para
       * cambiarla» sugiere que existe el trámite. No existe.
       */
    },
  ],

  /**
   * LO QUE EXISTIÓ Y NO ES UNA VÍA ABIERTA. Se documenta porque va a
   * aparecer: hay gente que recuerda que «eso se pedía por WhatsApp».
   */
  viaHistorica: {
    que: 'Cambios de credenciales tramitados por el canal de líderes',
    comoFue:
      'Los cambios de datos de una cuenta se tramitaban con líderes concretos, por el canal privado que el equipo tenía con ellos. Nunca fue un canal abierto al público.',
    queDecirHoy:
      'No es una vía que un usuario pueda usar por su cuenta. Quien recuerde ese procedimiento debe pasar por su líder o por los canales oficiales; el asistente no lo ofrece como opción.',
  },

  /**
   * REGLA PARA EL ASISTENTE. Se escribe como instrucción ejecutable, no como
   * principio: un principio se interpreta, una instrucción se cumple.
   */
  reglaDelAsistente:
    'Ante cualquier petición de cambiar wallet, correo o usuario: NO se promete el cambio, NO se pide la wallet nueva y NO se sugiere escribir a un canal privado. Se explica que la wallet no se cambia, se ofrece el autoservicio cuando aplica, y se deriva al equipo si el caso lo requiere.',

  /**
   * LO QUE NO SE PREGUNTA NUNCA. Aparece porque en los registros hay
   * contraseñas y direcciones pegadas en texto plano dentro de un chat.
   */
  nuncaSePide: [
    'La contraseña de la cuenta. Ni para «verificar», ni para «comprobar», ni por ningún motivo.',
    'La frase de recuperación de la wallet. Nadie del equipo la necesita jamás; quien la pida está robando.',
    'Una wallet nueva a la que reasignar la cuenta.',
  ],
} as const
