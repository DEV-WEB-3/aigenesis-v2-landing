/**
 * EL WHITEPAPER EN COREANO — datos puros, sin un solo import.
 *
 * POR QUE ESTE IDIOMA VA EN SU PROPIO ARCHIVO Y LOS OTROS DIEZ NO: el motivo
 * completo está en `coreano.ts`. En resumen: el coreano es el primer idioma que
 * entra sin revisión nativa hecha, y un revisor tiene que poder leer TODO lo
 * que va a revisar en un sitio, no cazarlo fila por fila dentro de un archivo
 * de 863 kB.
 *
 * ESTE BLOQUE VIVE APARTE DEL COREANO COMÚN por la misma razón que el
 * whitepaper vive aparte del diccionario común: son párrafos largos que sólo se
 * leen en `/whitepaper`. Si el coreano del whitepaper viajara en el bloque
 * general, desharía a medias la partición que existe justamente para que la
 * portada no cargue texto que no usa.
 *
 * DE DÓNDE SE TRADUJO. El original del documento está en inglés y los `en` del
 * bloque son el texto exacto del PDF. El coreano se tradujo desde la clave
 * española —que es la que fija el sentido en este diccionario— cotejando el
 * inglés en los pasajes donde el PDF usa terminología propia. Los nombres
 * propios no se tocan: Genesis, AiG Token, PancakeSwap, Certik, Dextool.
 */
export const COREANO_WHITEPAPER: Record<string, string> = {
  /* ── rótulos de la página ──────────────────────────────────────── */
  'El documento, en tu idioma': '당신의 언어로 읽는 문서',
  'Traducción del whitepaper oficial v1.1. El PDF descargable está en inglés.':
    '공식 백서 v1.1의 번역본입니다. 내려받을 수 있는 PDF는 영문입니다.',
  'El PDF es la versión 1.1 de febrero de 2024 y la dirección de contrato que aparece dentro ya no está vigente. El contrato válido es el que figura arriba en esta página.':
    '이 PDF는 2024년 2월에 나온 1.1 버전이며, 문서 안에 적힌 컨트랙트 주소는 더 이상 유효하지 않습니다. 유효한 컨트랙트는 이 페이지 위쪽에 표시된 주소입니다.',
  'El reparto publicado en el documento suma 100,01 %.':
    '문서에 실린 배분 비율의 합계는 100.01 %입니다.',
  'Hoja de ruta del documento (v1.1, febrero de 2024)': '문서의 로드맵 (v1.1, 2024년 2월)',
  'No es la hoja de ruta vigente: la sección Roadmap del sitio está actualizada.':
    '현재 유효한 로드맵이 아닙니다. 사이트의 로드맵 섹션이 최신 내용입니다.',

  /* ── secciones del documento ───────────────────────────────────── */
  Resumen: '요약',
  Introducción: '서론',
  Tokenomics: '토크노믹스',
  'Versatilidad en operaciones virtuales': '가상 활동에서의 다재다능함',
  'Tender el puente': '다리를 놓다',
  'Facilitar las transacciones': '거래를 원활하게',
  Conclusión: '결론',

  /* ── reparto del suministro ────────────────────────────────────── */
  Bloqueado: '락업',
  Recompensas: '보상',
  Tesorería: '트레저리',
  'Equipo corporativo': '기업 팀',
  Liquidez: '유동성',

  /* ── cuerpo del documento ──────────────────────────────────────── */
  'En una época en la que la tecnología sigue transformando el paisaje de nuestra vida diaria, el A.I. Genesis Official Token surge como un faro de innovación, conexión y capacidad de acción. Con un suministro fijo de 111 millones de tokens y alojado con seguridad en la Binance Smart Chain, este token se sostiene como un pilar de gobernanza digital.':
    '기술이 우리 일상의 풍경을 계속해서 바꾸어 놓는 시대에, A.I. Genesis Official Token은 혁신과 연결, 그리고 실행 역량의 등대로 떠오릅니다. 1억 1,100만 개로 고정된 발행량을 갖추고 바이낸스 스마트 체인 위에 안전하게 자리 잡은 이 토큰은 디지털 거버넌스의 기둥으로 서 있습니다.',
  'El Genesis Official Token sirve de cauce para multitud de operaciones virtuales: loterías cripto, participación en el metaverso, ecosistemas NFT, actividades de minería, videojuegos, plataformas de apuestas, servicios de intercambio y una cartera cripto nativa basada en EVM.':
    'Genesis Official Token은 수많은 가상 활동의 통로가 됩니다. 암호화폐 복권, 메타버스 참여, NFT 생태계, 채굴 활동, 비디오 게임, 베팅 플랫폼, 교환 서비스, 그리고 EVM 기반의 자체 암호화폐 지갑까지 아우릅니다.',
  'En este whitepaper profundizamos en el potencial transformador del A.I. Genesis Official Token, y exploramos cómo tiende un puente entre el terreno de la inteligencia artificial y la experiencia humana, revolucionando las transacciones a través de la cadena de bloques.':
    '이 백서에서는 A.I. Genesis Official Token이 지닌 변화의 잠재력을 깊이 들여다보고, 이 토큰이 인공지능의 영역과 인간의 경험 사이에 어떻게 다리를 놓으며 블록체인을 통해 거래를 혁신하는지 살펴봅니다.',
  'El A.I. Genesis Official Token representa la culminación de tecnología de vanguardia y ofrece una vía singular para fundir la inteligencia artificial con la interacción humana. En un mundo donde el paisaje digital se expande a un ritmo sin precedentes, este token se presenta como el pegamento que une esos dos mundos.':
    'A.I. Genesis Official Token은 최첨단 기술의 결정체로서, 인공지능과 인간의 상호작용을 융합하는 독특한 길을 제시합니다. 디지털 환경이 유례없는 속도로 넓어지는 세상에서, 이 토큰은 그 두 세계를 이어 붙이는 접착제로 나섭니다.',
  'El Genesis Token tiene un suministro total de 111 millones de tokens. Su permanencia queda subrayada por la ausencia de mecanismos de emisión o quema, lo que asegura la integridad del ecosistema y mantiene la confianza del inversor.':
    'Genesis Token의 총 발행량은 1억 1,100만 개입니다. 추가 발행이나 소각 장치가 없다는 점이 그 항구성을 뒷받침하며, 이는 생태계의 무결성을 보장하고 투자자의 신뢰를 지켜 줍니다.',
  'Este token es una herramienta de gobernanza. Quienes poseen el A.I. Genesis Official Token ejercen influencia sobre las decisiones que dan forma al ecosistema, lo que favorece un desarrollo descentralizado y guiado por la comunidad.':
    '이 토큰은 거버넌스 도구입니다. A.I. Genesis Official Token을 보유한 사람은 생태계의 모습을 결정하는 사안에 영향력을 행사하며, 이는 탈중앙화되고 커뮤니티가 이끄는 발전을 촉진합니다.',
  'El A.I. Genesis Official Token permite participar en multitud de operaciones virtuales: desde entrar en loterías cripto y sumergirse en el metaverso hasta adquirir NFT, contribuir a labores de minería, disfrutar de experiencias de juego, realizar apuestas y facilitar intercambios en la cartera cripto nativa basada en EVM.':
    'A.I. Genesis Official Token으로는 수많은 가상 활동에 참여할 수 있습니다. 암호화폐 복권에 응모하고 메타버스에 빠져드는 일에서부터, NFT를 취득하고 채굴에 기여하며 게임을 즐기고 베팅을 하고 EVM 기반의 자체 암호화폐 지갑에서 교환을 수행하는 일까지 가능합니다.',
  'En su núcleo, el A.I. Genesis Official Token sirve de puente entre las capacidades ilimitadas de la inteligencia artificial y el deseo humano de transacciones fluidas, seguras y eficientes. Al aprovechar la potencia de la tecnología blockchain, crea un ecosistema donde los servicios guiados por IA interactúan sin fricción con las personas.':
    '본질적으로 A.I. Genesis Official Token은 인공지능의 무한한 역량과 매끄럽고 안전하며 효율적인 거래를 향한 인간의 바람 사이를 잇는 다리 역할을 합니다. 블록체인 기술의 힘을 활용하여, AI가 이끄는 서비스가 사람과 마찰 없이 어우러지는 생태계를 만들어 냅니다.',
  'En un mundo donde la confianza es primordial, el A.I. Genesis Official Token establece un entorno en el que las transacciones se realizan con transparencia y seguridad. La cadena de bloques asegura la integridad de todas las interacciones, mientras que los servicios potenciados por IA las hacen más eficientes y fáciles de usar.':
    '신뢰가 무엇보다 중요한 세상에서, A.I. Genesis Official Token은 거래가 투명하고 안전하게 이루어지는 환경을 세웁니다. 블록체인은 모든 상호작용의 무결성을 보장하고, AI로 강화된 서비스는 그 상호작용을 더 효율적이고 사용하기 쉽게 만듭니다.',
  'Situados en el cruce entre la tecnología y la experiencia humana, el A.I. Genesis Official Token simboliza una nueva era de innovación. Con su suministro fijo, sus capacidades de gobernanza y su versatilidad en operaciones virtuales, está preparado para transformar la forma en que nos relacionamos con la inteligencia artificial y realizamos transacciones. No es meramente un token: es un cauce hacia el futuro, donde las fronteras entre el mundo digital y el físico se difuminan y el potencial humano se amplifica con la fuerza de la IA.':
    '기술과 인간 경험이 교차하는 지점에 선 A.I. Genesis Official Token은 새로운 혁신의 시대를 상징합니다. 고정된 발행량과 거버넌스 기능, 그리고 가상 활동에서의 다재다능함을 갖춘 이 토큰은 우리가 인공지능과 관계 맺고 거래하는 방식을 바꾸어 놓을 준비가 되어 있습니다. 단순한 토큰이 아니라, 디지털 세계와 물리적 세계의 경계가 흐려지고 인간의 잠재력이 AI의 힘으로 증폭되는 미래로 향하는 통로입니다.',
  'Bienvenido al génesis de una nueva era.': '새로운 시대의 창세에 오신 것을 환영합니다.',

  /* ── hoja de ruta del documento ────────────────────────────────── */
  'Desarrollo del Genesis Core': 'Genesis Core 개발',
  'Desarrollo del AiG Token': 'AiG Token 개발',
  'Integración con PancakeSwap': 'PancakeSwap 연동',
  'Integración con P2B': 'P2B 연동',
  'Alta en Bitcoin Talk': 'Bitcoin Talk 등록',
  'AiG disponible en Dextool': 'Dextool에 AiG 등재',
  'AiG se une a Dexgroup': 'AiG, Dexgroup 합류',
  'Auditoría de Certik aprobada': 'Certik 감사 통과',
  'Lanzamiento de la G11 Wallet': 'G11 Wallet 출시',
  'Desarrollo de la AiG Academy': 'AiG Academy 개발',
  'Desarrollo del metaverso': '메타버스 개발',
  'Minería de NFT': 'NFT 채굴',
  'Desarrollo de Trasy': 'Trasy 개발',
  'Lanzamiento del portal AiG News': 'AiG News 포털 출시',
  'Evento en Dubái y Latinoamérica': '두바이 및 라틴아메리카 행사',
  'Lanzamiento de la tarjeta y los cajeros': '카드 및 ATM 출시',
  'Génesis Exchange': 'Genesis Exchange',
  'Red social AIG AiLink': 'AIG AiLink 소셜 네트워크',
  'Blockchain propia': '자체 블록체인',
  'Segunda capa de contratos inteligentes': '스마트 컨트랙트 2계층',
}
