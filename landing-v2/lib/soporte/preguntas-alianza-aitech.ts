import type { Pregunta } from './tipos'

/**
 * ALIANZA AITECH ONE (Aitech + Genesis + TAG) — contexto para el asistente.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALE. De la presentación oficial `AITECHONE.ES.pdf` (Aitech One) y
 * de lo aportado por el owner, corroborado en parte con los sitios oficiales
 * (bit1.com). Documenta QUÉ ES la alianza y sus productos, y —lo importante
 * para Genesis— para qué sirve el AiG Token dentro de ella.
 *
 * REGLA DEL DESCARGO (heredada del propio deck, lámina «AVISO IMPORTANTE»):
 * esto es informativo, NO es asesoría financiera; la participación es
 * voluntaria y conlleva riesgos; los resultados varían y el desempeño pasado
 * no garantiza resultados futuros. Por eso NINGUNA ficha publica porcentajes
 * de resultado, apalancamiento, comisiones ni premios del plan: eso se ve solo
 * en los canales oficiales y bajo responsabilidad de cada quien.
 *
 * NOMBRES (corrigen confusiones de dictado): la alianza es «Aitech One»; el
 * exchange es «Bit1» (no «BTI1»); la tarjeta es «BIX / BixCard»; el bróker de
 * trading es «TAG / Tag Markets». «TagMarket» de la comunidad se refiere a
 * Tag Markets.
 */
export const PREGUNTAS_ALIANZA_AITECH: readonly Pregunta[] = [
  {
    id: 'ali-aitech-one',
    proyecto: 'ecosistema',
    categoria: 'Alianza Aitech',
    pregunta: '¿Qué es Aitech / Aitech One y la alianza con Genesis?',
    respuesta:
      'Aitech One es una alianza entre Aitech —una comunidad y compañía internacional— y Genesis, presentada como una «trilogía financiera»: tres unidades dentro de un mismo ecosistema. Son: Tag Markets (trading sistemático), Bit1 (exchange de activos digitales) y BixCard/BIX (una tarjeta Visa respaldada por cripto). Genesis se une a esta alianza para sumar comunidad y dar usabilidad y liquidez al AiG Token a través de sus productos. Es material informativo: no es asesoría financiera y la participación es voluntaria y con riesgos.',
    sinonimos: [
      'que es aitech', 'que es aitech one', 'alianza aitech', 'aitech y genesis', 'que es tag',
      'trilogia financiera', 'que es la alianza', 'genesis con tag', 'aitech genesis',
      'gtag', 'aitechone',
    ],
    fuente: 'owner',
    enlace: 'https://aitechone.io',
  },
  {
    id: 'ali-aig-usabilidad',
    proyecto: 'ecosistema',
    categoria: 'Alianza Aitech',
    pregunta: '¿Para qué sirve el AiG Token en la alianza? ¿Dónde puedo usarlo?',
    respuesta:
      'La idea de la alianza es dar usabilidad real al AiG Token. Dentro de los productos de Aitech One, el AiG se usa junto con USDT en formato DUAL (AIG-USDT) como capital operativo, y así el token gana demanda y liquidez por el uso de la comunidad. En resumen: el AiG pasa a ser uno de los medios aceptados para operar en la alianza, en lugar de quedarse quieto. Cuánto y cómo se aplica en cada producto se ve en los canales oficiales; esto es informativo, no una recomendación.',
    sinonimos: [
      'para que sirve el aig en la alianza', 'donde uso el aig', 'usabilidad del aig', 'aig dual usdt',
      'el aig en aitech', 'donde puedo usar mi aig', 'liquidez del aig', 'aceptan el aig',
      'medio de pago aig', 'aig como capital',
    ],
    fuente: 'owner',
  },
  {
    id: 'ali-bit1',
    proyecto: 'ecosistema',
    categoria: 'Alianza Aitech',
    pregunta: '¿Qué es Bit1?',
    respuesta:
      'Bit1 es el exchange de la alianza Aitech One: una plataforma para comprar, intercambiar y operar activos digitales, con presencia internacional. Según su material, ofrece compra de cripto, intercambio rápido (swap), comercio P2P, futuros y copy trading, y funciones para gastar cripto en muchos comercios. Su web oficial es bit1.com. Como toda operación con activos digitales, conlleva riesgos y la decisión es de cada persona.',
    sinonimos: [
      'que es bit1', 'bit one', 'bti1', 'exchange de la alianza', 'el exchange de aitech',
      'que es el exchange', 'donde intercambio cripto', 'plataforma bit1', 'bit 1',
    ],
    fuente: 'owner',
    enlace: 'https://www.bit1.com',
  },
  {
    id: 'ali-bixcard',
    proyecto: 'ecosistema',
    categoria: 'Alianza Aitech',
    pregunta: '¿Qué es BIX o BixCard?',
    respuesta:
      'BixCard (BIX) es la tarjeta Visa de la alianza Aitech One: permite usar tus activos digitales en el mundo real, donde acepten Visa. Según su material, es no-custodial (tú mantienes el control de tus llaves y tu cripto), admite colateral en USDT y USDC en varias redes, es compatible con Apple Pay y Google Pay, y suma beneficios de la línea Visa Signature. Es una forma de dar uso cotidiano a la cripto; su disponibilidad por país se confirma en los canales oficiales.',
    sinonimos: [
      'que es bix', 'que es bixcard', 'la tarjeta cripto', 'tarjeta visa cripto', 'bix card',
      'tarjeta de la alianza', 'la tarjeta de aitech', 'tarjeta visa aig', 'cashback visa',
    ],
    fuente: 'owner',
  },
  {
    id: 'ali-tagmarkets',
    proyecto: 'ecosistema',
    categoria: 'Alianza Aitech',
    pregunta: '¿Qué es TAG o Tag Markets?',
    respuesta:
      'Tag Markets es el bróker de trading sistemático de la alianza Aitech One: estrategias automatizadas para operar sin depender de tu tiempo, experiencia o emociones. El capital operativo se maneja en formato DUAL (AIG-USDT). Su web oficial es tagmarkets.com y el portal de Genesis es genesis.ibportal.io. Punto clave: el trading conlleva riesgos, los resultados varían y el desempeño pasado no garantiza resultados futuros; esto es informativo, no asesoría financiera.',
    sinonimos: [
      'que es tag markets', 'que es tagmarket', 'que es tagmarkets', 'el broker', 'trading sistematico',
      'tag markets', 'el broker de la alianza', 'trading de aitech', 'portal de tag', 'ib portal',
    ],
    fuente: 'owner',
    enlace: 'https://genesis.ibportal.io',
  },
  {
    id: 'ali-como-empezar',
    proyecto: 'ecosistema',
    categoria: 'Alianza Aitech',
    pregunta: '¿Cómo empiezo o me uno a la alianza (TagMarket) a través de la comunidad?',
    respuesta:
      'El acceso es a través de la comunidad: contacta a la persona que te invitó y te guía para registrarte en el portal oficial (genesis.ibportal.io) y conocer los productos. Antes de decidir, revisa la documentación oficial y, si lo consideras, consulta a un asesor: la participación es voluntaria y conlleva riesgos, y los resultados varían. Nadie oficial te va a pedir tu frase de recuperación ni tus claves privadas. Los detalles de cifras, planes y condiciones solo son válidos desde los canales oficiales.',
    sinonimos: [
      'como me uno a la alianza', 'como empiezo en tagmarket', 'como entro a tag markets',
      'como inicio en la alianza', 'como participo en aitech', 'como me registro en el portal',
      'quiero unirme a tag', 'como empezar en aitech one', 'como accedo al portal',
    ],
    fuente: 'owner',
    enlace: 'https://genesis.ibportal.io',
  },
  {
    id: 'ali-credenciales',
    proyecto: 'ecosistema',
    categoria: 'Alianza Aitech',
    pregunta: '¿La alianza es confiable? ¿Qué respaldo y credenciales tiene?',
    respuesta:
      'Según la documentación oficial de Aitech One, la estructura declara respaldo y registros: un fondo de cobertura respaldado por Lloyd’s of London (sujeto a sus términos), y registros como FSC Mauritius, FSCA Sudáfrica y trámites ante otros reguladores; el exchange Bit1 declara registros DASP (El Salvador) y MSB (Canadá). Lo correcto es que verifiques estas credenciales directamente en las fuentes oficiales y en los registros públicos antes de tomar cualquier decisión: aquí solo repetimos lo que dice el material, no lo certificamos. La participación es voluntaria y con riesgos.',
    sinonimos: [
      'la alianza es confiable', 'aitech es seguro', 'esto es una estafa', 'tiene regulacion',
      'credenciales de aitech', 'respaldo de la alianza', 'es legal tag markets', 'esta regulado bit1',
      'es seguro invertir en aitech',
      'licencias de aitech', 'es una estafa aitech',
    ],
    fuente: 'owner',
  },
] as const
