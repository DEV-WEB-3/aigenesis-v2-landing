import type { Pregunta } from './tipos'

/**
 * ECOSISTEMA · VISIÓN, PLAN G11 Y FUENTES OFICIALES — plan de negocio.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALE. Del material corporativo oficial de Genesis
 * (`AIGENESIS_CORPORATE_PRESENTATION_V-ES.pdf`) y de lo ya verificado en el
 * corpus. Cubre lo que hoy no estaba: la VISIÓN del proyecto, el marco general
 * del plan G11 y —lo más pedido por soporte— CÓMO VERIFICAR que algo es
 * oficial (defensa anti-estafa).
 *
 * REGLA DEL DESCARGO: los porcentajes son tasas de emisión programada del
 * protocolo o aceleradores de la red, no un resultado en dólares ni una
 * promesa. El detalle paso a paso de minería, booster, staking, referido y
 * rangos vive en `preguntas-manuales.ts`; aquí va el MARCO, sin re-prometer.
 */
export const PREGUNTAS_ECOSISTEMA_PLAN: readonly Pregunta[] = [
  /* ════════════ VISIÓN ════════════ */
  {
    id: 'eco-vision-genesis',
    proyecto: 'ecosistema',
    categoria: 'Sobre Genesis',
    pregunta: '¿Qué es Genesis y cuál es su visión?',
    respuesta:
      'Genesis es un ecosistema que une inteligencia artificial y blockchain para dar a su comunidad tecnología avanzada con transparencia y seguridad, apoyándose en contratos inteligentes públicos y en Web3 (donde tú controlas tus datos y decisiones). La IA es el cerebro que coordina los procesos; el blockchain aporta la transparencia. Alrededor del AiG Token, el ecosistema reúne varias piezas: minería (AiMining), staking, el plan de comunidad G11, la tienda, herramientas y proyectos anunciados en su hoja de ruta (academia, exchange, tarjeta, metaverso, NFTs). La idea de fondo: impulsar el desarrollo de la IA y el crecimiento de la comunidad con tecnología abierta y verificable.',
    sinonimos: [
      'que es genesis', 'vision de genesis', 'que es aigenesis', 'de que trata genesis',
      'que es el ecosistema', 'para que sirve genesis', 'mision de genesis', 'de que va el proyecto',
      'ecosistema genesis', 'ia y blockchain',
    ],
    fuente: 'landing',
  },

  /* ════════════ PLAN G11 (MARCO) ════════════ */
  {
    id: 'eco-plan-g11',
    proyecto: 'genesis',
    categoria: 'Red y compensación',
    pregunta: '¿Qué es el plan G11?',
    respuesta:
      'G11 es el plan de comunidad de Genesis: el marco por el que la actividad en la red se reconoce con recompensas, de forma transparente gracias a la IA y el blockchain. Se apoya en cuatro piezas que ya tienen su paso a paso propio: tu pack de AiMining (el motor que genera AiG Token a diario), el acelerador por referido directo (AiG Start) y por equipos izquierdo/derecho (AiG Binary), el staking para quien acumula a largo plazo, y los rangos, que premian los hitos de tu red. G11 no es un producto que se compre aparte: se activa al participar en el ecosistema con tu pack de minería.',
    sinonimos: [
      'que es el plan g11', 'plan g11', 'plan de comunidad', 'plan de mercadeo', 'como funciona g11',
      'plan de negocio genesis', 'que es g11 community', 'el plan de genesis', 'como gano en genesis',
    ],
    fuente: 'landing',
  },

  /* ════════════ FUENTES DE VERACIDAD / ANTI-ESTAFA ════════════ */
  {
    id: 'eco-canales-oficiales',
    proyecto: 'ecosistema',
    categoria: 'Seguridad',
    pregunta: '¿Cómo sé qué es oficial? ¿Cuáles son las fuentes verificables?',
    respuesta:
      'Dos reglas que te protegen. Primera, lo verificable en cadena: el AiG Token y sus contratos inteligentes son públicos y se pueden consultar en BscScan (red BSC), y cada movimiento queda registrado — esa es la prueba real, no una captura de pantalla. Segunda, los canales: el sitio y la comunidad oficiales de Genesis son la única fuente de anuncios (fechas, promociones, novedades). Nadie del equipo te va a pedir tu frase de recuperación ni tus claves privadas: quien lo haga es una estafa. Si ves una fecha, un precio o una “oportunidad” fuera de los canales oficiales, trátalo con cautela y confírmalo antes de mover dinero.',
    sinonimos: [
      'es una estafa', 'como se que es real', 'canales oficiales', 'fuentes oficiales', 'como verifico',
      'esto es legitimo', 'me estan estafando', 'pagina oficial', 'grupo oficial', 'como confirmo que es genesis',
      'me piden mi frase', 'es confiable', 'como reviso el contrato',
    ],
    fuente: 'landing',
  },
] as const
