import type { Recorrido } from './tipos'

/**
 * LOS RECORRIDOS DE ENTRADA — la puerta del ecosistema.
 *
 * Todo empieza aquí y no en otro sitio. Está comprobado en el código de la
 * landing: `MINING`, `BOOSTER`, `STAKING`, `GPULSE_APP`, `GORACLE` y
 * `MARKETPLACE` apuntan TODOS a la misma URL — `conect.aigenesis.io/login`. No
 * hay seis puertas, hay una.
 *
 * Y LA PRIMERA PREGUNTA DE UN USUARIO NUEVO NO ES «CÓMO ME REGISTRO».
 * Es «no me deja registrarme». Verificado el 19-ago-2026 abriendo la pantalla:
 * `/register` responde «ACCESO RESTRINGIDO — AiGenesis es solo por invitación.
 * Necesitas un enlace válido con referido para continuar». Sin enlace de
 * patrocinador no hay formulario que rellenar.
 *
 * Esto ordena el material entero: el recorrido cero no es rellenar datos, es
 * conseguir la invitación. Un soporte que empiece por «pulsa Crear cuenta»
 * manda a la gente contra un muro y luego le explica el muro.
 */
export const RECORRIDOS_ENTRADA: readonly Recorrido[] = [
  {
    id: 'obtener-invitacion',
    proyecto: 'genesis',
    titulo: 'Conseguir una invitación',
    objetivo:
      'Obtener el enlace con referido sin el cual no se puede crear cuenta. Es el paso cero de todo el ecosistema.',
    requisitos: ['Conocer a alguien que ya participe, o contactar por un canal oficial'],
    pasos: [
      {
        titulo: 'Pide el enlace a quien te habló del proyecto',
        detalle:
          'El enlace tiene la forma https://conect.aigenesis.io/…?ref=… — la parte «ref» identifica a tu patrocinador. Sin ella el registro no se abre.',
        siFalla:
          'Si te pasaron una dirección sin «?ref=», no sirve: pídela otra vez indicando que necesitas el enlace de referido completo.',
      },
      {
        titulo: 'Si no conoces a nadie, escribe por un canal oficial',
        detalle:
          'Telegram (t.me/AiGenesisComunity) y Discord son los canales de la comunidad G11. Ahí se puede pedir orientación sobre cómo entrar.',
        siFalla:
          'Desconfía de cualquiera que te ofrezca una invitación a cambio de dinero por adelantado o fuera de los canales oficiales.',
      },
      {
        titulo: 'Abre el enlace en el navegador que vayas a usar',
        detalle:
          'El referido viaja en la dirección. Copiarla a medias o abrirla desde una vista previa que la recorte hace perder esa parte.',
        siFalla:
          'Si al abrirlo sigue diciendo «ACCESO RESTRINGIDO», el enlace perdió el «?ref=» por el camino. Pide que te lo envíen como texto plano, no como botón.',
      },
    ],
    fuente: 'producto',
    verificadoHasta:
      'Pantalla de acceso restringido comprobada el 19-ago-2026 en conect.aigenesis.io/register. El formato exacto del enlace con ref lo tiene que confirmar el equipo.',
  },

  {
    id: 'registro',
    proyecto: 'genesis',
    titulo: 'Crear tu cuenta Genesis',
    objetivo:
      'Dar de alta la cuenta que sirve para TODO el ecosistema. No hay una cuenta por producto: la misma entra en G-Pulse, en el marketplace y en el resto.',
    requisitos: [
      'El enlace de invitación con «?ref=» de tu patrocinador',
      'Un correo electrónico al que tengas acceso ahora mismo',
      'Opcional: una cartera Web3 (por ejemplo MetaMask) si prefieres entrar con ella',
    ],
    pasos: [
      {
        titulo: 'Abre el enlace de invitación',
        detalle: 'Te lleva al registro con tu patrocinador ya asociado.',
        siFalla: 'Si ves «ACCESO RESTRINGIDO», el enlace no llevaba el referido. Ver el recorrido anterior.',
      },
      {
        titulo: 'Rellena correo y contraseña',
        detalle:
          'La pantalla de acceso pide «Correo y contraseña de Genesis». Usa un correo que revises: el ecosistema envía verificación y avisos a esa dirección.',
        siFalla:
          'Si el correo no llega, revisa la carpeta de no deseados. Los mensajes salen desde una dirección de aigenesis.io.',
      },
      {
        titulo: 'Valida el registro con el código que llega por correo',
        /*
         * AQUÍ ME EQUIVOQUÉ DOS VECES EN UN DÍA, Y LA SEGUNDA FUE PEOR.
         *
         * Primero escribí este paso sin comprobarlo. Luego «lo corregí»
         * diciendo que el código no existía, porque busqué «otp» y «2FA» en
         * el paquete de conect.aigenesis.io y no aparecían.
         *
         * El error de método: ese paquete es la SPA, y el ALTA no ocurre
         * ahí. Buscar el registro donde no vive y concluir que el registro
         * no manda código es leer un vacío como si fuera un hallazgo. La
         * ausencia sólo prueba algo si miraste donde la cosa estaría.
         *
         * CONFIRMADO POR EL OWNER (19-ago-2026): al registrarse SÍ se recibe
         * un código por correo para validar el alta.
         */
        detalle:
          'Al registrarte se envía un código a tu correo para validar el alta. Hasta que lo introduzcas, el registro no queda confirmado.',
        siFalla:
          'Si no llega, revisa la carpeta de no deseados antes de repetir el registro: crear una segunda cuenta no resuelve el correo que falta y deja dos altas a medias.',
      },
    ],
    fuente: 'producto',
    verificadoHasta:
      'Los campos de la pantalla de acceso están comprobados (correo, contraseña, conectar wallet). El formulario de alta completo está detrás de la invitación y NO se ha recorrido: los pasos de verificación los tiene que confirmar el equipo antes de publicar esta guía.',
  },

  {
    id: 'acceso',
    proyecto: 'genesis',
    titulo: 'Entrar en tu cuenta',
    objetivo: 'Acceder al panel desde el que se llega a todos los productos.',
    requisitos: ['Cuenta ya creada', 'Correo y contraseña, o la cartera con la que te registraste'],
    pasos: [
      {
        titulo: 'Abre conect.aigenesis.io/login',
        detalle:
          'Es la misma puerta para todo. Si llegaste desde un botón de la web —Mining, Staking, Booster, G-Pulse, Marketplace— acabas aquí igualmente.',
      },
      {
        titulo: 'Elige cómo entrar',
        detalle:
          'Dos formas: correo y contraseña, o «Conectar wallet» (WalletConnect y otras opciones). Usa la misma con la que creaste la cuenta.',
        siFalla:
          'Si te registraste con correo y ahora intentas entrar con cartera, el sistema no las asocia solo: entra como te diste de alta.',
      },
      {
        titulo: 'Si olvidaste la contraseña',
        detalle:
          'La propia pantalla tiene «¿Olvidaste la contraseña?». El correo de recuperación llega desde una dirección de aigenesis.io.',
        siFalla:
          'Si no llega, comprueba que escribiste el mismo correo del alta. El sistema no avisa cuando la dirección no existe — es a propósito, para no revelar quién tiene cuenta.',
      },
    ],
    fuente: 'producto',
    verificadoHasta:
      'Pantalla de acceso verificada el 19-ago-2026: campos de correo y contraseña, botón de conectar wallet, «Crear cuenta» y «¿Olvidaste la contraseña?». Lo que hay tras entrar no se ha visto.',
  },
]
