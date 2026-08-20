import type { Pregunta } from './tipos'

/**
 * PREGUNTAS FRECUENTES DE G-PULSE.
 *
 * ESTE ARCHIVO ES CORTO A PROPÓSITO, y la razón vale más que su contenido.
 *
 * De los tres productos, G-Pulse es el que menos puedo documentar por dentro
 * —el panel está tras el login— y el que MÁS daño hace si se documenta de
 * más. Un marketplace mal explicado provoca un carrito abandonado; una
 * herramienta de señales de mercado mal explicada provoca que alguien tome
 * una decisión con su dinero creyendo que se lo recomendó el sistema.
 *
 * Así que aquí no se rellena. Lo que domina no son los «cómo se hace» sino
 * los límites: qué es, qué no es, y qué NO significa una señal. Cuando el
 * equipo dé acceso, se añaden los recorridos operativos — no antes.
 */
export const PREGUNTAS_GPULSE: readonly Pregunta[] = [
  {
    id: 'gp-que-es',
    proyecto: 'gpulse',
    categoria: 'Sobre G-Pulse',
    pregunta: '¿Qué es G-Pulse?',
    respuesta:
      'Es la herramienta de análisis del ecosistema: procesa datos de mercados globales de forma continua y publica señales automatizadas y alertas, para que veas lo que está ocurriendo sin tener que mirar veinte pantallas.',
    sinonimos: ['que es gpulse', 'g pulse', 'para que sirve', 'las senales'],
    fuente: 'landing',
  },
  {
    id: 'gp-vs-goracle',
    proyecto: 'gpulse',
    categoria: 'Sobre G-Pulse',
    pregunta: '¿En qué se diferencia de G-Oracle?',
    respuesta:
      'G-Pulse es el pulso y G-Oracle es el criterio. G-Pulse entrega señales y alertas: qué está pasando ahora. G-Oracle interpreta, conecta y gobierna el flujo de información entre productos del protocolo: qué significa y cómo se orquesta.',
    sinonimos: ['goracle', 'g oracle', 'diferencia', 'cual uso'],
    fuente: 'landing',
  },
  {
    id: 'gp-acceso',
    proyecto: 'gpulse',
    categoria: 'Sobre G-Pulse',
    pregunta: '¿Cómo entro a G-Pulse?',
    respuesta:
      'Con tu cuenta de Genesis, desde conect.aigenesis.io. No hay registro aparte: es el mismo acceso que para el resto del ecosistema.',
    sinonimos: ['como entro', 'donde esta gpulse', 'acceso', 'link de gpulse'],
    fuente: 'codigo',
  },

  /* ════════════ LOS LÍMITES ════════════ */
  {
    id: 'gp-no-es-asesoramiento',
    proyecto: 'gpulse',
    categoria: 'Qué significa una señal',
    pregunta: '¿Una señal me está diciendo que compre o que venda?',
    respuesta:
      'No. Una señal describe una condición que se ha cumplido en el mercado — nada más. No es una recomendación, no conoce tu situación y no te dice qué hacer. La decisión y el riesgo son de quien opera, siempre.',
    sinonimos: ['me dice que compre', 'que hago con la senal', 'es una recomendacion', 'me aconseja'],
    /*
     * Es la pregunta más importante del archivo y por eso va la primera de la
     * sección. La respuesta empieza por «No» a propósito: cualquier matiz
     * antes de la negación se lee como un sí con condiciones.
     */
    fuente: 'landing',
  },
  {
    id: 'gp-no-predice',
    proyecto: 'gpulse',
    categoria: 'Qué significa una señal',
    pregunta: '¿G-Pulse predice lo que va a pasar?',
    respuesta:
      'No. Procesa lo que ya ocurrió y lo que está ocurriendo. Cualquier lectura de la herramienta como anticipación del futuro es un malentendido: ningún sistema puede sostener eso, y G-Pulse tampoco lo intenta.',
    sinonimos: ['predice', 'adivina', 'sabe lo que va a pasar', 'pronostico'],
    fuente: 'landing',
  },
  {
    id: 'gp-acierto',
    proyecto: 'gpulse',
    categoria: 'Qué significa una señal',
    pregunta: '¿Qué porcentaje de aciertos tienen las señales?',
    respuesta:
      'No se publica un porcentaje de aciertos, y no es una omisión: una cifra así convertiría la herramienta en algo con resultado esperado, que es justo lo que no es. Si algún día se publican métricas, irán con su método y su periodo, o no irán.',
    sinonimos: ['cuanto acierta', 'porcentaje de acierto', 'efectividad', 'funciona bien'],
    fuente: 'owner',
  },
  {
    id: 'gp-opera-por-mi',
    proyecto: 'gpulse',
    categoria: 'Qué significa una señal',
    pregunta: '¿G-Pulse opera por mí?',
    respuesta:
      'No. Informa. Quien decide y ejecuta es la persona, con su propio criterio.',
    sinonimos: ['opera solo', 'automatico', 'lo hace por mi', 'bot de trading'],
    fuente: 'owner',
  },

  /* ════════════ LO QUE FALTA ════════════ */
  {
    id: 'gp-operativa',
    proyecto: 'gpulse',
    categoria: 'Uso del panel',
    pregunta: '¿Cómo configuro mis alertas?',
    respuesta:
      'Todavía no está documentado paso a paso. El panel está detrás del acceso y esta guía no describe pantallas que no se han recorrido — antes que darte una ruta inventada, se te pasa con alguien que lo tenga delante.',
    sinonimos: ['configurar alertas', 'como uso el panel', 'crear alerta', 'ajustes'],
    /*
     * Una respuesta que admite el hueco es infinitamente mejor que una
     * verosímil: si el asistente describe botones que no existen, la persona
     * concluye que la plataforma está rota y el soporte queda desacreditado
     * justo cuando más falta hacía. Esto se completa con acceso, no con
     * suposiciones.
     */
    fuente: 'porDefinir',
  },
] as const
