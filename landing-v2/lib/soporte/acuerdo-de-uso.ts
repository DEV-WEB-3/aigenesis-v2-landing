/**
 * ACUERDO DE USO Y RESPONSABILIDAD — TEXTO LITERAL.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ESTE ARCHIVO ESTÁ EXCLUIDO DE LA GUARDA DE LENGUAJE, A CONCIENCIA.
 *
 * Contiene términos que el proyecto dejó de usar en agosto de 2026 —«bono
 * binario» entre ellos— y que la guarda bloquea en todo el material de
 * soporte. Aquí se conservan porque son LA CITA LITERAL de un documento que
 * el usuario acepta con una casilla: si lo reescribo «mejor», deja de ser
 * el texto que firmó y ya no sirve para comprobar nada.
 *
 * La exclusión es por nombre de archivo, está declarada en
 * `scripts/verify-lenguaje.mjs` y se informa en cada ejecución. Es la salida
 * que la propia guarda documenta para este caso; lo que no se puede es
 * apagarla sin dejar rastro.
 *
 * REGLA DE USO: de aquí se CITA, no se redacta. Ninguna respuesta de soporte
 * copia estas palabras como si fueran nuestro vocabulario; se usan para
 * saber qué aceptó la persona y para detectar dónde el producto y la web
 * dicen cosas distintas.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * CAPTURADO: 19-ago-2026, en g-pulse.aigenesis.io/dashboard/gpulse-lobby.
 * Aparece como diálogo modal ANTES de poder entrar al lobby, con una casilla
 * de aceptación y un botón «Continuar» deshabilitado hasta marcarla.
 *
 * POR QUÉ IMPORTA PARA SOPORTE: es lo único que TODO usuario ha leído (o al
 * menos aceptado). Cuando alguien discute una regla, esto es lo que se le
 * mostró. Y cuando la web dice otra cosa, hay que saberlo antes que él.
 */

export const ACUERDO_DE_USO = {
  titulo: 'Acuerdo de Uso y Responsabilidad — AiGenesis',
  entradilla:
    'Debe leer y aceptar para continuar. Este resumen no sustituye documentos legales que su jurisdicción o el protocolo publiquen aparte.',
  donde: 'Diálogo modal previo al lobby de G-Pulse. Bloquea el acceso hasta aceptar.',
  capturado: '19-ago-2026',

  secciones: [
    {
      titulo: 'PARTICIPACIÓN',
      texto:
        'Requiere participación activa según productos del protocolo (minería, staking u otros vigentes). Sin posiciones elegibles, pueden aplicarse limitaciones a devengos y reclamos.',
    },
    {
      titulo: 'RENDIMIENTOS',
      texto:
        'No hay ingresos garantizados. Las cantidades mostradas son estimaciones o contabilidad del sistema; el resultado real depende de la actividad de la red, contratos y políticas vigentes.',
    },
    {
      titulo: 'SISTEMA BINARIO',
      texto:
        'El emparejamiento usa el volumen del lado menor (match). Tras cada match, ambas piernas se reducen en esa cantidad. El bono binario aplicable se calcula sobre el volumen emparejado según la tasa del plan (p. ej. 11%).',
    },
    {
      titulo: 'FLASH MENSUAL',
      texto:
        'A cierre de período puede aplicarse una reducción del volumen remanente en cada pierna (p. ej. factor 0,5 por lado, de forma independiente). Revise el panel binario y el historial operativo para transparencia.',
    },
    {
      titulo: 'STAKING Y ECONOMÍA ACTIVA',
      texto:
        'Para desbloquear el flujo completo de ingresos del protocolo suele exigirse staking activo y condiciones de cuenta según reglas publicadas en la interfaz.',
    },
    {
      titulo: 'HOLDING AIG (REFERENCIA)',
      texto:
        'Puede existir un requisito mínimo de participación en AIG respecto al portafolio (p. ej. 14% en la interfaz). Incumplirlo puede congelar o limitar reclamos hasta regularizar.',
    },
    {
      titulo: 'TOKEN AIG',
      texto:
        'AIG es el activo de recompensa/unidad de cuenta mostrada en el ecosistema. Conversiones y precios siguen mecanismos del protocolo; no constituye asesoramiento financiero.',
    },
    {
      titulo: 'RESPONSABILIDAD DEL USUARIO',
      texto:
        'Usted es responsable de la seguridad de su wallet, de la veracidad de los datos que envíe y de cumplir la normativa aplicable en su jurisdicción. La información de la app es orientativa.',
    },
  ],
} as const

/**
 * DONDE EL ACUERDO Y EL RESTO DEL PROYECTO NO DICEN LO MISMO.
 *
 * Se listan aquí en vez de arreglarse por mi cuenta, porque cada una es una
 * decisión del owner y no un error de redacción. Un asistente que resuelva
 * estas contradicciones improvisando dará respuestas distintas cada vez.
 */
export const CONTRADICCIONES_DETECTADAS = [
  {
    tema: 'Vocabulario del sistema de referidos',
    elAcuerdoDice: 'Usa «sistema binario» y «bono binario» como términos propios.',
    elProyectoDice:
      'En agosto de 2026 se sustituyeron esos términos por «recompensa» y «acelerador», y la guarda de lenguaje los bloquea en todo el material de soporte.',
    porQueImporta:
      'El usuario acepta un texto con unas palabras y luego el soporte le habla con otras. No puede saber si le están explicando lo mismo o algo distinto.',
    decisionPendiente:
      'O el soporte adopta el vocabulario del acuerdo, o el acuerdo se actualiza al vocabulario nuevo. Mientras no se decida, el asistente no debe usar ninguno de los dos por su cuenta: deriva.',
  },
  {
    tema: 'Qué bloquea exactamente el holding',
    elAcuerdoDice: 'Que incumplirlo «puede congelar o limitar reclamos».',
    elProyectoDice:
      'El owner precisó que se bloquean minar y reclamar recompensas, y que la cuenta sigue accesible.',
    porQueImporta:
      'Coinciden, y eso es una buena noticia: la respuesta de soporte sobre el hold está respaldada por el documento que el usuario aceptó. Se registra por eso, no por conflicto.',
    decisionPendiente: null,
  },
  {
    tema: 'La cifra del holding',
    elAcuerdoDice: '«p. ej. 14% en la interfaz» — con el «p. ej.» y remitiendo a la interfaz.',
    elProyectoDice: 'El owner confirmó 14%.',
    porQueImporta:
      'El acuerdo evita comprometerse con la cifra a propósito. Soporte puede decir 14% porque el owner lo confirmó, pero conviene mantener la remisión al panel: si algún día cambia, el acuerdo no habrá mentido y nuestra FAQ sí.',
    decisionPendiente: null,
  },
] as const
