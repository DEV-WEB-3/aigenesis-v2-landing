/**
 * LA LANDING EN COREANO — datos puros, sin un solo import.
 *
 * POR QUÉ ESTE IDIOMA VIVE EN SU PROPIO ARCHIVO Y LOS OTROS DIEZ NO
 * ------------------------------------------------------------------
 * Los diez primeros nacieron dentro de cada fila del diccionario y ahí siguen:
 * moverlos ahora sería una reescritura de 863 kB a cambio de nada. El coreano
 * entra aparte por una razón que no tienen los otros: es el ÚNICO que todavía
 * no ha pasado revisión nativa, y quien la haga tiene que poder leer de una vez
 * todo lo que va a revisar. Buscar 690 frases sueltas dentro del diccionario
 * grande es la clase de tarea que se empieza y no se termina.
 *
 * ENTRA DENTRO DE LA FILA, NO ENCIMA. `diccionario.ts` lo funde con
 * `fundirIdioma`, que escribe `fila.ko` sin tocar el resto. Registrarlo con
 * `registrarEntradas` habría REEMPLAZADO la fila entera y borrado las diez
 * lenguas de estas 690 frases sin fallar: la pantalla saldría en español, que
 * es exactamente lo que hace invisible una pérdida así.
 *
 * DECISIONES DE TRADUCCIÓN QUE NO SE VEN LEYENDO EL RESULTADO
 * ------------------------------------------------------------
 * · LOS TITULARES PARTIDOS SE REORDENAN. En español la primera línea lleva el
 *   núcleo y la segunda lo remata —«Cerebro del» / «ecosistema.»—. El coreano
 *   pone el modificador delante del núcleo, así que el par sale invertido:
 *   «생태계의» / «두뇌.». Se comprobó una por una que cada mitad se usa en un
 *   solo sitio y siempre emparejada, así que no hay ninguna que aparezca suelta
 *   con el sentido cambiado. Vale para las diez parejas.
 * · LAS MARCAS NO SE TRADUCEN: Genesis, AiGenesis, AiG Token, G-Pulse,
 *   G-Oracle, Booster, Staking, Mining, Gevy, Tag Markets, Bit1, BixCard.
 *   «Génesis» con tilde es la grafía española de la marca; en coreano se
 *   escribe «Genesis», que es como la escribe la propia marca fuera del español.
 * · EL REGISTRO ES FORMAL (합니다체). La landing se dirige a alguien que está
 *   decidiendo si entra: el tuteo español se traduce al coreano cortés neutro,
 *   que es su equivalente de tono, no su equivalente literal.
 * · LO QUE NIEGA, NIEGA IGUAL DE FUERTE. Las frases que dicen que AIG no cotiza,
 *   que esto no es asesoría financiera o que no se promete rendimiento son las
 *   que más caro salen si se suavizan al traducir. Se han mantenido tan
 *   tajantes en coreano como en español, aunque el coreano tienda a atenuar.
 *
 * PENDIENTE: REVISIÓN NATIVA. Hasta que la haya, el coreano se ofrece con la
 * misma regla que el resto: un texto imperfecto en tu idioma comunica más que
 * uno perfecto que no entiendes, y aquí se corrige una frase sin tocar un solo
 * componente.
 */
export const COREANO: Record<string, string> = {

  /* ── NAVEGACION Y ACCESIBILIDAD ──────────────────────────────────────── */
  'Navegación principal': '주요 내비게이션',
  'Navegación de secciones': '섹션 내비게이션',
  'Menú de navegación': '내비게이션 메뉴',
  'Enlaces del menú': '메뉴 링크',
  'Cerrar menú': '메뉴 닫기',
  'Sección anterior': '이전 섹션',
  'Sección siguiente': '다음 섹션',
  'Progreso de secciones': '섹션 진행 상황',
  'Mapa del ecosistema': '생태계 지도',
  'Enlaces institucionales': '공식 링크',
  'Redes sociales AiGenesis': 'AiGenesis 소셜 미디어',
  'Pie de página institucional': '공식 푸터',
  'GENESIS — Inicio': 'GENESIS — 홈',

  /* ── ETIQUETAS DE SECCION ────────────────────────────────────────────── */
  Confianza: '신뢰',
  Comunidad: '커뮤니티',
  'Tecnología': '기술',
  Protocolo: '프로토콜',
  'Participación': '참여',
  'Distribución': '분배',
  Procesamiento: '처리',
  'Verificación': '검증',
  Gobernanza: '거버넌스',
  Modelo: '모델',
  Progresivo: '점진적',
  Deflacionario: '디플레이션형',
  Periodos: '기간',
  'Token base': '기반 토큰',
  'Capas activas': '활성 계층',
  'Métricas institucionales': '공식 지표',

  /* ── TITULARES PARTIDOS ──────────────────────────────────────────────── */
  'Ingeniería de': '최첨단',
  'vanguardia.': '엔지니어링.',
  'Crece con': '성장하는 이들과',
  'quienes crecen.': '함께 성장합니다.',
  'Acelerador de crecimiento': '생태계의',
  'del ecosistema.': '성장 가속기.',
  'Cerebro del': '생태계의',
  'ecosistema.': '두뇌.',
  'Señales en': '실시간',
  'tiempo real.': '신호.',
  Nuestro: '우리의',
  'horizonte.': '지평.',
  'Genesis Token.': 'Genesis Token.',
  'antes del producto.': '검증 가능한 인프라.',
  'con el protocolo.': '장기적 약속.',
  'del futuro?': '준비가 되셨나요?',
  'un universo en expansión': '확장하는 우주',

  /* ── PARRAFOS ────────────────────────────────────────────────────────── */
  'AiGenesis prioriza transparencia, seguridad técnica y trazabilidad on-chain. Conoce los pilares que sostienen el ecosistema antes de explorar sus productos.':
    'AiGenesis는 투명성, 기술적 보안, 그리고 온체인 추적 가능성을 최우선으로 삼습니다. 제품을 살펴보기 전에, 생태계를 떠받치는 기둥부터 확인해 보세요.',
  'Un universo de productos interconectados sobre Binance Smart Chain. Cada capítulo amplifica al siguiente en una arquitectura modular e institucional.':
    '바이낸스 스마트 체인 위에 서로 연결된 제품들의 우주입니다. 각 장이 다음 장을 증폭시키는 모듈형 기관 아키텍처로 이루어져 있습니다.',
  'Token BEP-20 deflacionario sobre BSC. El activo base que articula participación, utilidad y expansión del ecosistema Genesis.':
    'BSC 위에서 동작하는 디플레이션형 BEP-20 토큰입니다. Genesis 생태계의 참여와 유틸리티, 확장을 하나로 엮는 기반 자산입니다.',
  'Mining es la capa que articula emisión, participación y distribución dentro de AiGenesis. Un mecanismo de protocolo — no una promesa de rentabilidad.':
    'Mining은 AiGenesis 안에서 발행과 참여, 분배를 하나로 엮는 계층입니다. 프로토콜의 작동 방식이지 수익을 약속하는 것이 아닙니다.',
  'Capas y multiplicadores definidos que amplifican la participación en el protocolo. Progresión por permanencia — no un esquema de captación.':
    '프로토콜 참여를 증폭시키는, 미리 정해진 계층과 배수입니다. 지속 기간에 따른 단계이지 모집 구조가 아닙니다.',
  'Comunidad global G11 con reglas de participación publicadas. Dos aceleradores de minado —directo y de red— y fondos globales para los rangos más activos.':
    '참여 규칙이 공개된 글로벌 커뮤니티 G11입니다. 두 가지 마이닝 가속기(다이렉트와 네트워크)와, 가장 활발한 등급을 위한 글로벌 펀드를 갖추고 있습니다.',
  'GPulse entrega análisis operativo y señales automatizadas para mercados globales. Capa de ejecución táctica — complementaria al núcleo de inteligencia G-Oracle.':
    'GPulse는 글로벌 시장을 위한 운영 분석과 자동화 신호를 제공합니다. G-Oracle 인텔리전스 코어를 보완하는 전술 실행 계층입니다.',
  'Catálogo global con envío internacional. Se paga con AIG y USDT desde tu wallet.':
    '국제 배송이 가능한 글로벌 카탈로그입니다. 지갑에서 AIG와 USDT로 결제합니다.',
  'Stack tecnológico de clase enterprise. Smart contracts auditados, infraestructura distribuida, y motor de inteligencia artificial propietario.':
    '엔터프라이즈급 기술 스택입니다. 감사를 마친 스마트 컨트랙트, 분산 인프라, 그리고 자체 인공지능 엔진을 갖추고 있습니다.',
  'El valor interno es la referencia de intercambio entre miembros y mineros para productos y servicios. No es una cotización de mercado: AIG todavía no tiene un pool público de liquidez.':
    '내부 가치는 회원과 마이너 사이에서 제품과 서비스를 교환할 때 쓰는 기준입니다. 시장 시세가 아닙니다. AIG에는 아직 공개 유동성 풀이 없습니다.',

  /* ── FICHAS Y BOTONES ────────────────────────────────────────────────── */
  'Acelerador directo 8-11%': '다이렉트 가속기 8-11%',
  'Acelerador de red': '네트워크 가속기',
  'Catálogo premium verificado': '검증된 프리미엄 카탈로그',
  'Seguimiento en vivo': '실시간 추적',
  'Liderazgo Progresivo': '점진적 리더십',
  'Infraestructura verificable': '제품보다 먼저,',
  'Compromiso a largo plazo': '프로토콜과 함께하는',
  'Motor de participación': '참여 엔진',
  'Capa neurálgica': '신경 계층',
  'Motor propietario': '자체 엔진',
  'Análisis Real-Time': '실시간 분석',
  'Señales Automatizadas': '자동화 신호',
  'Alertas de Mercado': '시장 알림',
  'Indicadores de Mining': '마이닝 지표',
  'Integración G-BRIDGE': 'G-BRIDGE 연동',
  'Crear cuenta': '계정 만들기',
  'Crear Cuenta': '계정 만들기',
  'Explora el Universo': '우주를 탐험하세요',
  'Explorar el ecosistema →': '생태계 둘러보기 →',
  'Explorar Ecosistema →': '생태계 둘러보기 →',
  'Explorar participación': '참여 살펴보기',
  'Conocer Booster': 'Booster 알아보기',
  'Explorar Staking': 'Staking 살펴보기',
  'Conocer G-Oracle': 'G-Oracle 알아보기',
  'Explorar GPulse': 'GPulse 살펴보기',
  'Acceder a G-Pulse →': 'G-Pulse 접속 →',
  'Explorar Marketplace →': 'Marketplace 둘러보기 →',
  'Únete a la Comunidad →': '커뮤니티에 참여하기 →',
  'Ver Documentación →': '문서 보기 →',
  'Verificar en BSCScan ↗': 'BSCScan에서 확인 ↗',
  'Descargar plan de marketing': '마케팅 플랜 내려받기',

  /* ── EL PROPIO SELECTOR ──────────────────────────────────────────────── */
  Idioma: '언어',
  'La presentación oficial está disponible en cada idioma': '공식 프레젠테이션은 각 언어로 제공됩니다',
  'Presentación oficial v5.0': '공식 프레젠테이션 v5.0',
  'Presentación de la versión anterior': '이전 버전 프레젠테이션',
  Legal: '법적 고지',

  /* ── navegacion y sistema ────────────────────────────────────────────── */
  Ecosistema: '생태계',
  Inteligencia: '인텔리전스',
  'Comunidad G11': 'G11 커뮤니티',
  'Únete': '참여하기',
  'Abrir menú': '메뉴 열기',
  Hero: 'Hero',
  'Portal Final': '파이널 포털',
  'Sección': '섹션',
  de: '/',
  Ver: '보기',
  'Marcas del ecosistema': '생태계 브랜드',

  /* ── hero ────────────────────────────────────────────────────────────── */
  'Donde la Inteligencia Artificial y el Blockchain crean': '인공지능과 블록체인이 만들어 내는',

  /* ── token ───────────────────────────────────────────────────────────── */
  'VALOR INTERNO': '내부 가치',
  HOLDERS: '홀더',
  'SUPPLY TOTAL': '총 발행량',
  RED: '네트워크',
  Red: '네트워크',
  'Ver en BSCScan →': 'BSCScan에서 보기 →',

  /* ── mining ──────────────────────────────────────────────────────────── */
  'Ciclo de emisión': '발행 주기',
  Trazabilidad: '추적 가능성',
  'Red Genesis Mining': 'Genesis Mining 네트워크',

  /* ── confianza ───────────────────────────────────────────────────────── */
  'Red distribuida': '분산 네트워크',
  'Conectividad global segura, sin puntos únicos de falla.': '단일 장애 지점이 없는 안전한 글로벌 연결.',
  'Seguridad on-chain': '온체인 보안',
  'Protección criptográfica avanzada y validación descentralizada.': '고도의 암호화 보호와 탈중앙 검증.',
  Contratos: '컨트랙트',
  'Smart Contracts auditados y verificables. Ejecución justa y automática.':
    '감사를 마친 검증 가능한 스마트 컨트랙트. 공정하고 자동적인 실행.',
  'Auditoría continua': '상시 감사',
  'Monitoreo permanente en tiempo real. Detección y respuesta inmediata.': '실시간 상시 모니터링. 즉각적인 탐지와 대응.',
  'Nodos globales': '글로벌 노드',
  'Infraestructura distribuida en múltiples regiones para máxima disponibilidad.':
    '최대 가용성을 위해 여러 지역에 분산된 인프라.',
  'Registro inmutable de cada evento. Transparencia total en cada movimiento.':
    '모든 이벤트를 남기는 불변 기록. 모든 움직임이 완전히 투명합니다.',

  /* ── ecosistema ──────────────────────────────────────────────────────── */
  Pilares: '기둥',
  'El stack': '기술 스택',
  'Marketplace Global': '글로벌 마켓플레이스',

  /* ── booster ─────────────────────────────────────────────────────────── */
  'Capa I': '계층 I',
  'Capa II': '계층 II',
  'Capa III': '계층 III',
  'Activación': '활성화',
  Multiplicador: '배수',
  'Progresión': '단계 상승',
  'Entras cumpliendo requisitos publicados.': '공개된 요건을 충족하면 들어갑니다.',
  'El factor sube con la participación sostenida.': '지속적인 참여에 따라 계수가 올라갑니다.',
  'Niveles con umbrales y condiciones a la vista.': '기준과 조건이 공개된 등급입니다.',
  'Acelerador cuántico Genesis Booster': 'Genesis Booster 퀀텀 가속기',

  /* ── staking ─────────────────────────────────────────────────────────── */
  'Staking articula periodos de participación, estabilidad y alineación con el ecosistema AiGenesis. Un pilar independiente con reglas propias y trazabilidad on-chain.':
    'Staking은 AiGenesis 생태계와의 참여 기간과 안정성, 정렬을 하나로 엮습니다. 자체 규칙과 온체인 추적 가능성을 갖춘 독립된 기둥입니다.',
  'Compromiso flexible': '유연한 약정',
  'Periodos definidos con condiciones transparentes de participación y liberación.':
    '참여와 해제 조건이 투명하게 정해진 기간입니다.',
  'Estabilidad del ecosistema': '생태계의 안정성',
  'Staking fortalece la liquidez interna y la continuidad operativa del protocolo.':
    'Staking은 프로토콜의 내부 유동성과 운영 연속성을 강화합니다.',
  'Participación sostenida': '지속적인 참여',
  'Incentivos alineados con permanencia — sin garantías de rendimiento financiero.':
    '지속 기간에 맞춘 인센티브입니다. 금융 수익을 보장하지 않습니다.',

  /* ── g-pulse ─────────────────────────────────────────────────────────── */
  ' /día': '/일',
  ' activas': '개 활성',
  'SEÑALES DIARIAS': '일일 신호',
  MESAS: '데스크',

  /* ── g-oracle ────────────────────────────────────────────────────────── */
  'G-Oracle es la capa de inteligencia que interpreta, conecta y gobierna el flujo de información. GPulse entrega señales; G-Oracle define la inteligencia estratégica del protocolo.':
    'G-Oracle은 정보의 흐름을 해석하고 연결하며 다스리는 인텔리전스 계층입니다. GPulse가 신호를 내보낸다면, G-Oracle은 프로토콜의 전략적 지능을 정의합니다.',
  'Inteligencia central': '중앙 인텔리전스',
  'Procesa y correlaciona los datos del ecosistema.': '생태계의 데이터를 처리하고 상호 연관 짓습니다.',
  'Motor G-BRIDGE': 'G-BRIDGE 엔진',
  'IA propietaria para análisis profundo — no es el flujo de señales de GPulse.':
    '심층 분석을 위한 자체 AI입니다. GPulse의 신호 흐름과는 다릅니다.',
  'Centro neurálgico': '신경 중추',
  'Orquesta la información entre productos y protocolos.': '제품과 프로토콜 사이의 정보를 조율합니다.',

  /* ── marketplace y comunidad ─────────────────────────────────────────── */
  PRODUCTOS: '상품',
  'PAÍSES DE ALCANCE': '배송 가능 국가',
  'PAÍSES': '국가',
  'MIEMBROS ACTIVOS': '활성 회원',
  DISTRIBUIDOS: '배분됨',
  'Global Pool Top Ranks': 'Global Pool Top Ranks',

  /* ── tecnologia: rotulos y llamadas de la maquina ────────────────────── */
  IA: 'AI',
  BACKEND: '백엔드',
  INFRAESTRUCTURA: '인프라',
  APLICACIONES: '애플리케이션',
  LATENCIA: '지연 시간',
  MONITOREO: '모니터링',
  'Servicios y APIs': '서비스와 API',
  'APIs robustas, eventos en tiempo real y microservicios modulares.': '견고한 API, 실시간 이벤트, 그리고 모듈형 마이크로서비스.',
  'Infraestructura distribuida': '분산 인프라',
  'Escalable, redundante y preparada para millones de interacciones.':
    '확장 가능하고 이중화되어 있으며, 수백만 건의 상호작용에 대비되어 있습니다.',
  'Inteligencia artificial': '인공지능',
  'Motor propietario que aprende, predice y optimiza en tiempo real.': '실시간으로 배우고 예측하며 최적화하는 자체 엔진.',
  'Inmutable y descentralizado': '불변하고 탈중앙화된',
  'Transacciones verificables, registros transparentes y sin puntos de falla.':
    '검증 가능한 거래, 투명한 기록, 그리고 장애 지점 없는 구조.',
  'Aplicaciones inteligentes': '지능형 애플리케이션',
  'Interfaces descentralizadas, experiencias fluidas y seguras.': '탈중앙화된 인터페이스, 매끄럽고 안전한 경험.',

  /* ── roadmap ─────────────────────────────────────────────────────────── */
  'Hitos del recorrido': '여정의 이정표',
  'Lanzamiento AiGenesis': 'AiGenesis 출범',

  /* ── cierre y pie ────────────────────────────────────────────────────── */
  '¿Listo para ser parte': '미래의 일부가 될',
  Contact: '문의',
  Privacy: '개인정보',
  '© 2026 AiGenesis. All rights reserved.': '© 2026 AiGenesis. 모든 권리 보유.',
  'AiGenesis involucra activos digitales y tecnologías blockchain. La participación puede implicar riesgos tecnológicos, regulatorios y de mercado. Ningún contenido debe interpretarse como garantía de rendimiento financiero.':
    'AiGenesis는 디지털 자산과 블록체인 기술을 다룹니다. 참여에는 기술적·규제적·시장적 위험이 따를 수 있습니다. 어떤 내용도 금융 수익에 대한 보장으로 해석되어서는 안 됩니다.',

  /* ── mining: tarjetas del recorrido ──────────────────────────────────── */
  'Emisión': '발행',
  'Emisión programada': '예정된 발행',
  'Distribución on-chain con calendario transparente y reglas públicas de participación.':
    '투명한 일정과 공개된 참여 규칙에 따른 온체인 분배.',
  'Participación activa': '능동적 참여',
  'El motor de Mining conecta a los participantes con la capa de emisión del ecosistema.':
    'Mining 엔진은 참여자를 생태계의 발행 계층과 연결합니다.',
  'Distribución equitativa': '공평한 분배',
  'Asignación proporcional basada en reglas del protocolo, sin promesas de rendimiento fijo.':
    '프로토콜 규칙에 따른 비례 배분이며, 고정 수익을 약속하지 않습니다.',

  /* ── confianza: insignias y metricas institucionales ─────────────────── */
  'Saltar al contenido principal': '본문으로 건너뛰기',
  'Países': '국가',
  Fundado: '설립',
  Uptime: '가동률',
  Verificado: '검증됨',
  Auditado: '감사 완료',
  'En vivo': '실시간',
  'Ecosistema en BSC': 'BSC 위의 생태계',
  'Comunidad Global': '글로벌 커뮤니티',
  'Transparencia Operativa': '운영의 투명성',

  /* ── armazon compartido ──────────────────────────────────────────────── */
  'Volver al inicio': '처음으로 돌아가기',
  Inicio: '홈',
  'Información legal': '법적 정보',

  /* ── g11 ─────────────────────────────────────────────────────────────── */
  'El material con el que se crece: guías, presentaciones oficiales y los canales donde está la comunidad.':
    '함께 성장하는 데 쓰이는 자료입니다. 가이드와 공식 프레젠테이션, 그리고 커뮤니티가 모여 있는 채널을 담았습니다.',
  'Guías': '가이드',
  'Los cuatro pasos, de la cuenta nueva a la oficina virtual.': '새 계정에서 가상 오피스까지, 네 단계.',
  'Cómo registrarte en Genesis': 'Genesis 가입 방법',
  'Alta de cuenta con enlace de patrocinador y cartera Web3.': '추천인 링크와 Web3 지갑으로 계정을 만듭니다.',
  'Cómo comprar tu paquete de minería': '마이닝 패키지 구매 방법',
  'Pago del paquete y activación de la participación.': '패키지 결제와 참여 활성화.',
  'Cómo referir y crecer tu comunidad': '추천으로 커뮤니티를 키우는 방법',
  'Tu enlace de referido y cómo se construye la red.': '내 추천 링크와 네트워크가 만들어지는 방식.',
  'Cómo funciona tu oficina virtual': '가상 오피스 사용법',
  'Panel de red, seguimiento y material para compartir.': '네트워크 대시보드, 현황 확인, 공유용 자료.',
  'Disponible en el canal': '채널에서 볼 수 있습니다',
  'Ver las guías en YouTube': 'YouTube에서 가이드 보기',
  'Presentaciones oficiales': '공식 프레젠테이션',
  'Versión 5.0, en ocho idiomas. Cada ficha indica su peso: son unos 2,5 MB, pensadas para descargar y enseñar desde el móvil.':
    '8개 언어로 제공되는 5.0 버전입니다. 각 항목에 용량이 표시되어 있으며, 약 2.5 MB로 내려받아 휴대폰에서 바로 보여 주기 좋게 만들었습니다.',
  'Sólo en versión anterior (v1)': '이전 버전(v1)만 있음',
  'Estos idiomas todavía no tienen la 5.0. Son archivos antiguos y más pesados.':
    '이 언어들은 아직 5.0이 없습니다. 예전 파일이라 용량도 더 큽니다.',
  'Canales oficiales': '공식 채널',
  'Los canales de la comunidad G11. Son distintos de los de AiGenesis.':
    'G11 커뮤니티의 채널입니다. AiGenesis의 채널과는 다릅니다.',
  Empezar: '시작하기',
  'El alta necesita el enlace de tu patrocinador y una cartera Web3. Si aún no tienes patrocinador, escribe por cualquiera de los canales de arriba.':
    '가입하려면 추천인 링크와 Web3 지갑이 필요합니다. 아직 추천인이 없다면 위의 채널 중 아무 곳으로나 문의해 주세요.',

  /* ── legal ───────────────────────────────────────────────────────────── */
  Privacidad: '개인정보 보호',
  'AiGenesis trata los datos personales conforme a las prácticas descritas en esta documentación. Para consultas sobre privacidad, escríbenos a':
    'AiGenesis는 이 문서에 기술된 방침에 따라 개인정보를 처리합니다. 개인정보에 관한 문의는 다음으로 보내 주세요:',
  'Política de privacidad completa pendiente de revisión legal.': '전체 개인정보 처리방침은 법률 검토 대기 중입니다.',
  Riesgos: '위험 고지',
  'Los activos digitales pueden experimentar alta volatilidad. Los protocolos blockchain pueden contener vulnerabilidades tecnológicas. Los marcos regulatorios varían por jurisdicción y pueden cambiar sin previo aviso.':
    '디지털 자산은 변동성이 매우 클 수 있습니다. 블록체인 프로토콜에는 기술적 취약점이 있을 수 있습니다. 규제 체계는 관할 구역마다 다르며 예고 없이 바뀔 수 있습니다.',
  'AiGenesis no proporciona asesoramiento financiero, legal ni fiscal. Consulte profesionales calificados antes de participar.':
    'AiGenesis는 금융·법률·세무 자문을 제공하지 않습니다. 참여하기 전에 자격을 갖춘 전문가와 상담하십시오.',
  Contacto: '문의처',
  'Consultas legales o de cumplimiento:': '법률 또는 컴플라이언스 문의:',
  'Sitio institucional:': '공식 사이트:',
  'Documentación adicional en': '추가 문서는 다음에서',
  whitepaper: '백서',
  'Borrador operativo — revisión legal pendiente antes de producción en dominio principal.':
    '운영용 초안입니다. 메인 도메인에 게시하기 전 법률 검토가 필요합니다.',

  /* ── whitepaper ──────────────────────────────────────────────────────── */
  'Documentación oficial del ecosistema AiGenesis.': 'AiGenesis 생태계의 공식 문서입니다.',
  'El whitepaper AiG Token describe la arquitectura del protocolo, los tokenomics, los pilares del ecosistema y el marco de participación on-chain.':
    'AiG Token 백서는 프로토콜 아키텍처와 토크노믹스, 생태계의 기둥, 그리고 온체인 참여 체계를 설명합니다.',
  'Datos verificables en cadena': '온체인에서 확인 가능한 데이터',
  'Verificable en cadena': '온체인에서 확인 가능',
  'Suministro total AIG': 'AIG 총 발행량',
  'Holders en cadena': '온체인 홀더',
  'Código del contrato': '컨트랙트 코드',
  'Contrato:': '컨트랙트:',
  'Descargar Whitepaper (PDF)': '백서 내려받기 (PDF)',
  'Ver contrato en BSCScan': 'BSCScan에서 컨트랙트 보기',
  'Whitepaper AiG Token, documento PDF': 'AiG Token 백서, PDF 문서',
  'Tu navegador no puede mostrar el PDF aquí.': '이 브라우저에서는 PDF를 여기에 표시할 수 없습니다.',
  'Descárgalo para leerlo': '내려받아서 읽어 보세요',
  'AiG Token · Whitepaper oficial v1.1 · Febrero 2024': 'AiG Token · 공식 백서 v1.1 · 2024년 2월',

  /* ── pantallas de error ──────────────────────────────────────────────── */
  Error: '오류',
  'Algo se ha interrumpido': '무언가 중단되었습니다',
  'No hemos podido cargar esta parte del sitio. Suele resolverse reintentando; si persiste, vuelve al inicio.':
    '사이트의 이 부분을 불러오지 못했습니다. 다시 시도하면 대개 해결됩니다. 계속된다면 처음으로 돌아가 주세요.',
  Reintentar: '다시 시도',
  'Referencia:': '참조 번호:',
  'Esta dirección no existe': '존재하지 않는 주소입니다',
  'El enlace que has seguido apunta a un punto del universo que no está cartografiado. El ecosistema sigue donde lo dejaste.':
    '따라온 링크는 아직 지도에 없는 우주의 한 점을 가리킵니다. 생태계는 두고 온 그 자리에 그대로 있습니다.',
  'Ver el ecosistema': '생태계 보기',
  'Informativo · no es asesoría financiera · participación voluntaria y con riesgos.':
    '정보 제공용입니다 · 금융 자문이 아닙니다 · 참여는 자발적이며 위험이 따릅니다.',
  'La información publicada tiene fines informativos y educativos. No es asesoría financiera, legal ni fiscal. Los mercados y los activos digitales implican riesgos y pueden generar pérdidas parciales o totales. G1 no administra el capital de las personas: cada quien revisa los términos oficiales de cada plataforma, analiza los riesgos y decide de forma independiente.':
    '게시된 정보는 정보 제공과 교육을 목적으로 합니다. 금융·법률·세무 자문이 아닙니다. 시장과 디지털 자산에는 위험이 따르며 부분적 또는 전체적인 손실이 발생할 수 있습니다. G1은 개인의 자본을 운용하지 않습니다. 각자가 플랫폼별 공식 약관을 확인하고 위험을 분석하여 독립적으로 판단합니다.',
  'Respaldo — según la documentación oficial de cada entidad': '근거 — 각 기관의 공식 문서에 따름',
  'Génesis muestra estas credenciales de terceros tal como las declara cada entidad. No las certifica: verifícalas en el registro oficial correspondiente.':
    'Genesis는 제3자의 자격 정보를 각 기관이 밝힌 그대로 보여 줍니다. 이를 인증하지는 않으니, 해당 공식 등록부에서 직접 확인하시기 바랍니다.',
  'Credenciales de la alianza': '얼라이언스 자격 정보',
  'comunidad / ecosistema': '커뮤니티 / 생태계',
  'bróker': '브로커',
  'fondo de cobertura': '헤지 펀드',
  'exchange (Bit1)': '거래소 (Bit1)',
  'Tu comunidad,|con herramientas reales.': '당신의 커뮤니티,|진짜 도구와 함께.',
  'Tu comunidad, con herramientas reales.': '당신의 커뮤니티, 진짜 도구와 함께.',
  'Trading, exchange y tarjeta cripto de la alianza, con la usabilidad del AiG Token. Una comunidad global que se une al ecosistema.':
    '얼라이언스의 트레이딩과 거래소, 암호화폐 카드를 AiG Token의 사용성과 함께 제공합니다. 생태계에 합류하는 글로벌 커뮤니티입니다.',
  'Trading, exchange y tarjeta cripto de la alianza, con la usabilidad del AiG Token.':
    '얼라이언스의 트레이딩과 거래소, 암호화폐 카드를 AiG Token의 사용성과 함께.',
  'Conocer el ecosistema': '생태계 알아보기',
  'Explora el ecosistema.': '생태계를 둘러보세요.',
  'La comunidad': '커뮤니티',

  /* ── «Qué es G1» ─────────────────────────────────────────────────────── */
  'La marca de|la alianza.': '얼라이언스의|브랜드.',
  'G1 es la puerta a un ecosistema donde una **comunidad** se encuentra con **herramientas financieras reales** —trading, exchange y tarjeta cripto— con la usabilidad del **AiG Token**. Nace de la unión de tres fuerzas: **comunidad**, **tecnología** y **finanzas**.':
    'G1은 **커뮤니티**가 **진짜 금융 도구** —트레이딩, 거래소, 암호화폐 카드— 와 만나는 생태계로 들어가는 문이며, **AiG Token**의 사용성이 이를 뒷받침합니다. **커뮤니티**와 **기술**, **금융**이라는 세 힘의 결합에서 태어났습니다.',
  'Tres fuerzas que convergen en|un solo núcleo.': '세 개의 힘이 모이는|하나의 핵심.',
  'La alianza': '얼라이언스',
  'Una visión': '하나의 비전',
  'Una red': '하나의 네트워크',
  'Un ecosistema': '하나의 생태계',
  'Powered by': 'Powered by',
  'Comunidad + tecnología': '커뮤니티 + 기술',
  'Adopción y comunidad global': '확산과 글로벌 커뮤니티',
  Finanzas: '금융',
  'La comunidad que se une y aporta su propia tecnología: G-Pulse, marketplace, el AiG Token y blockchain. Es la que da usabilidad y liquidez al ecosistema.':
    '자체 기술을 들고 모이는 커뮤니티입니다. G-Pulse, 마켓플레이스, AiG Token 그리고 블록체인. 생태계에 사용성과 유동성을 부여하는 축입니다.',
  'La comunidad internacional de Aitech One: educación, liderazgo y expansión que acercan la tecnología a las personas.':
    'Aitech One의 국제 커뮤니티입니다. 교육과 리더십, 확장을 통해 기술을 사람들에게 가깝게 만듭니다.',
  'La infraestructura financiera de la alianza: Tag Markets (trading), Bit1 (exchange) y BixCard (tarjeta Visa cripto).':
    '얼라이언스의 금융 인프라입니다. Tag Markets(트레이딩), Bit1(거래소), BixCard(비자 암호화폐 카드).',
  'Una comunidad internacional unida por herramientas reales. Material informativo.':
    '진짜 도구로 하나가 된 국제 커뮤니티입니다. 정보 제공용 자료입니다.',
  'El AiG Token, con uso real': '실제로 쓰이는 AiG Token',
  'Un token con usabilidad, no una promesa.': '약속이 아니라 쓰임이 있는 토큰입니다.',
  'El AiG Token es el hilo que conecta la comunidad con las herramientas de la alianza. Dentro del ecosistema se usa en formato **DUAL (AIG + USDT)**, para dar liquidez y acceso a los productos. Es material informativo: no es asesoría financiera y la participación es voluntaria y con riesgos.':
    'AiG Token은 커뮤니티와 얼라이언스의 도구를 잇는 실입니다. 생태계 안에서는 **듀얼(AIG + USDT)** 방식으로 쓰이며, 유동성과 제품 접근을 제공합니다. 정보 제공용 자료입니다. 금융 자문이 아니며 참여는 자발적이고 위험이 따릅니다.',
  'Comunidad que se une': '함께 모이는 커뮤니티',
  'Herramientas reales (trading · exchange · tarjeta)': '진짜 도구 (트레이딩 · 거래소 · 카드)',
  'Usabilidad DUAL del AiG Token': 'AiG Token의 듀얼 사용성',

  /* ── la narrativa, los actos ─────────────────────────────────────────── */
  'Todo empieza con|una comunidad.': '모든 것은 하나의|커뮤니티에서 시작됩니다.',
  'Aitech △ · la tecnología': 'Aitech △ · 기술',
  'TAG △ · el mercado': 'TAG △ · 시장',
  'Génesis △ · la comunidad': 'Genesis △ · 커뮤니티',
  'Herramientas que ya funcionan.': '이미 작동하는 도구.',
  'Acceso real a los mercados.': '시장으로 가는 진짜 통로.',
  'La comunidad que las une.': '그것들을 잇는 커뮤니티.',
  'El nacimiento de G1': 'G1의 탄생',
  'Empieza con G1.': 'G1에서 시작하세요.',
  'Desplázate para vivir la experiencia': '스크롤하여 경험해 보세요',
  'La web continúa · sigue bajando': '페이지는 계속됩니다 · 아래로 내려가세요',

  /* ── «Cómo funciona» ─────────────────────────────────────────────────── */
  'Participar en G1 es un recorrido de tres pasos. Es material informativo: no es asesoría financiera y la participación es voluntaria y con riesgos.':
    'G1에 참여하는 과정은 세 단계입니다. 정보 제공용 자료입니다. 금융 자문이 아니며 참여는 자발적이고 위험이 따릅니다.',
  'Te unes por la comunidad': '커뮤니티로 합류합니다',
  'Génesis es la puerta de entrada. Desde G-Pulse accedes a la comunidad, las membresías y tu cuenta.':
    'Genesis가 입구입니다. G-Pulse에서 커뮤니티와 멤버십, 내 계정에 접근합니다.',
  'Accedes a las herramientas': '도구를 이용합니다',
  'La alianza aporta la trilogía de mercado: Tag Markets (trading), Bit1 (exchange) y BixCard (tarjeta cripto).':
    '얼라이언스는 시장 3종 세트를 제공합니다. Tag Markets(트레이딩), Bit1(거래소), BixCard(암호화폐 카드).',
  'El AiG Token conecta todo': 'AiG Token이 전부를 잇습니다',
  'El token de utilidad se usa en formato DUAL (AIG + USDT) para dar liquidez y acceso dentro del ecosistema.':
    '유틸리티 토큰은 생태계 안에서 유동성과 접근을 제공하기 위해 듀얼(AIG + USDT) 방식으로 쓰입니다.',
  'Las herramientas, en vivo': '실제로 움직이는 도구',
  'Trading, exchange y tarjeta — reales.': '트레이딩, 거래소, 카드 — 실제입니다.',
  'Trading, exchange y tarjeta.': '트레이딩, 거래소, 카드.',
  'La plataforma de la alianza en acción. Material informativo.': '실제로 작동하는 얼라이언스 플랫폼. 정보 제공용 자료입니다.',
  'Lo que esta página no dice': '이 페이지가 말하지 않는 것',
  'G1 no publica porcentajes de resultado, comisiones, apalancamiento ni premios de ningún plan. Esa información vive solo en los canales oficiales de cada producto y bajo la responsabilidad de cada persona. Aquí contamos **qué es** y **cómo se participa**, no cuánto se obtiene.':
    'G1은 어떤 플랜의 수익률이나 수수료, 레버리지, 보상도 게시하지 않습니다. 그런 정보는 각 제품의 공식 채널에만 있으며, 판단의 책임은 각자에게 있습니다. 여기서는 **무엇인지**와 **어떻게 참여하는지**를 이야기할 뿐, 얼마를 얻는지는 다루지 않습니다.',

  /* ── «Ecosistema» ────────────────────────────────────────────────────── */
  'Una comunidad,|herramientas reales.': '하나의 커뮤니티,|진짜 도구.',
  'La alianza aporta el acceso a los mercados; Génesis aporta la comunidad y la usabilidad del AiG Token. Todo lo que integra el ecosistema, en un solo lugar.':
    '얼라이언스는 시장으로 가는 통로를, Genesis는 커뮤니티와 AiG Token의 사용성을 제공합니다. 생태계를 이루는 모든 것을 한자리에서 봅니다.',
  'La trilogía de mercado · TAG': '시장 3종 세트 · TAG',
  'La comunidad · Génesis': '커뮤니티 · Genesis',
  'El motor de la comunidad.': '커뮤니티의 엔진.',
  '¿Cómo se participa?': '어떻게 참여하나요?',
  'TAG · trading': 'TAG · 트레이딩',
  'TAG · exchange': 'TAG · 거래소',
  'TAG · tarjeta': 'TAG · 카드',
  'Génesis · panel': 'Genesis · 패널',
  'Génesis · marca hija': 'Genesis · 하위 브랜드',
  'Génesis · token': 'Genesis · 토큰',
  'Bróker de trading sistemático: acceso a los mercados con herramientas profesionales de la alianza.':
    '체계적 트레이딩 브로커입니다. 얼라이언스의 전문 도구로 시장에 접근합니다.',
  'Exchange de activos digitales para comprar, vender y custodiar cripto dentro del ecosistema.':
    '생태계 안에서 암호화폐를 사고팔고 보관하는 디지털 자산 거래소입니다.',
  'Tarjeta Visa respaldada por cripto para usar tus activos en el día a día.':
    '암호화폐를 담보로 하는 비자 카드로, 보유 자산을 일상에서 사용합니다.',
  'El panel de la comunidad: membresías, actividad y el acceso a tu cuenta.':
    '커뮤니티의 패널입니다. 멤버십과 활동, 내 계정 접근을 담고 있습니다.',
  'Marca hija de Génesis, con su propia identidad bilingüe dentro del ecosistema.':
    'Genesis에서 나온 하위 브랜드로, 생태계 안에서 자체적인 이중 언어 정체성을 지닙니다.',
  'El token de utilidad del ecosistema, usado en formato DUAL (AIG + USDT) para dar liquidez y acceso.':
    '생태계의 유틸리티 토큰입니다. 유동성과 접근을 제공하기 위해 듀얼(AIG + USDT) 방식으로 쓰입니다.',

  /* ── «Comunidad» ─────────────────────────────────────────────────────── */
  'La comunidad que|las une.': '그것들을 잇는|커뮤니티.',
  'Génesis es el punto de entrada: la comunidad que reúne a las personas y les da un lugar para aprender, encontrarse y participar del ecosistema.':
    'Genesis가 입구입니다. 사람들을 한데 모으고, 배우고 만나고 생태계에 참여할 자리를 마련하는 커뮤니티입니다.',
  Encuentro: '만남',
  'El programa de formación de la comunidad: aprender el ecosistema y sus herramientas desde la base.':
    '커뮤니티의 교육 프로그램입니다. 생태계와 그 도구를 기초부터 배웁니다.',
  'Encuentros de la comunidad —presenciales y en línea— para conectar, compartir y crecer juntos.':
    '커뮤니티의 만남입니다. 오프라인과 온라인으로 연결하고, 나누고, 함께 성장합니다.',
  'La red de referentes que sostiene y acompaña a la comunidad en su recorrido.':
    '커뮤니티의 여정을 지탱하고 함께 걷는 리더들의 네트워크입니다.',
  Eventos: '행사',
  'Eventos que impulsan la comunidad.': '커뮤니티를 이끄는 행사.',
  'Conecta, aprende y crece junto a la comunidad del ecosistema. Sesiones informativas y de formación, en línea.':
    '생태계 커뮤니티와 함께 연결하고 배우고 성장하세요. 온라인 설명회와 교육 세션이 열립니다.',
  'Formación sobre productos del ecosistema': '생태계 제품 교육',
  'Sesión práctica sobre Tag Markets, Bit1 y BixCard: qué son y cómo se usan.':
    'Tag Markets와 Bit1, BixCard에 대한 실습 세션입니다. 무엇이고 어떻게 쓰는지 다룹니다.',
  'Presentación de la alianza': '얼라이언스 소개',
  'Sesión informativa sobre G1 y la alianza Génesis × Aitech × TAG.':
    'G1과 Genesis × Aitech × TAG 얼라이언스에 대한 설명회입니다.',
  'Encuentro de la comunidad': '커뮤니티 모임',
  'Novedades del ecosistema y espacio para conectar con la comunidad.': '생태계 소식과 커뮤니티와 만나는 자리.',
  Online: '온라인',
  'Online · Latinoamérica': '온라인 · 라틴아메리카',
  'Online · Global': '온라인 · 글로벌',
  'Cada lunes': '매주 월요일',
  'Martes y jueves': '화요일과 목요일',
  'Cada miércoles': '매주 수요일',
  '13:00 · hora de Santo Domingo': '13:00 · 산토도밍고 시간',
  '09:00 · hora de Santo Domingo': '09:00 · 산토도밍고 시간',
  '19:00 · hora de Santo Domingo': '19:00 · 산토도밍고 시간',
  Momentos: '순간들',
  'La comunidad, en persona.': '직접 만나는 커뮤니티.',
  'Empieza por la comunidad.': '커뮤니티에서 시작하세요.',
  'Entrar a G-Pulse': 'G-Pulse 들어가기',
  Ingresar: '로그인',

  /* ── las FAQ y el header ─────────────────────────────────────────────── */
  'Lo que|conviene saber.': '알아 두면|좋은 것들.',
  'Busca tu pregunta…': '궁금한 점을 검색하세요…',
  'Sin resultados. Prueba otras palabras o usa el asistente.': '결과가 없습니다. 다른 단어로 검색하거나 어시스턴트를 이용해 보세요.',
  'Índice': '목차',
  'Regístrate': '가입하기',
  'Regístrate en el Portal IBO de Génesis': 'Genesis IBO 포털에서 가입하기',
  'Ingresar al Portal IBO de Génesis': 'Genesis IBO 포털 로그인',
  'Educación': '교육',
  'Formación': '트레이닝',

  /* ── el pie de G1 ────────────────────────────────────────────────────── */
  'G1 conecta comunidad, mercados, activos digitales y herramientas de pago dentro de la alianza Génesis × Aitech × TAG.':
    'G1은 Genesis × Aitech × TAG 얼라이언스 안에서 커뮤니티와 시장, 디지털 자산, 결제 도구를 잇습니다.',
  'Trading · Exchange · Tarjeta cripto': '트레이딩 · 거래소 · 암호화폐 카드',
  'Sello G‑TAG · Génesis × Aitech × TAG': 'G‑TAG 인장 · Genesis × Aitech × TAG',
  'Navegación': '둘러보기',
  Acceso: '접속',
  'Qué es G1': 'G1이란',
  'Cómo funciona': '어떻게 작동하나',
  'Preguntas frecuentes': '자주 묻는 질문',
  'Únete / Ingresar': '가입 / 로그인',
  'Próximos eventos': '다가오는 행사',
  'Términos y condiciones': '이용약관',
  'Política de privacidad': '개인정보 처리방침',
  'Política de cookies': '쿠키 정책',
  'Aviso de riesgo': '위험 고지',
  'Descargo de responsabilidad': '면책 조항',
  'Todos los derechos reservados.': '모든 권리 보유.',

  /* ── la franja de esencia del pie ────────────────────────────────────── */
  Espacio: '공간',
  Conciencia: '의식',
  Presencia: '존재',
  Libertad: '자유',
  Prosperidad: '번영',
  Equilibrio: '균형',
  'Hold y estado de la cuenta': '홀드와 계정 상태',
  P2P: 'P2P',
  Pagar: '결제',
  'Token AiG': 'AiG 토큰',
  'Alianza Aitech': 'Aitech 얼라이언스',
  'Booster y staking': 'Booster와 스테이킹',
  'Membresía G-Pulse': 'G-Pulse 멤버십',
  'Envío y seguimiento': '배송과 배송 조회',
  'Qué significa una señal': '신호의 의미',
  'Casos históricos': '과거 사례',
  'Sobre Gevy': 'Gevy 소개',
  'Si algo sale mal': '문제가 생겼을 때',
  'Sobre G-Pulse': 'G-Pulse 소개',
  'Uso del panel': '패널 사용법',
  'Minería': '마이닝',
  'Red y compensación': '네트워크와 보상',
  Herramientas: '도구',
  'Uso de G-Pulse': 'G-Pulse 사용법',
  'Sobre Genesis': 'Genesis 소개',
  Seguridad: '보안',
  Credenciales: '자격 정보',
  '¿Cómo me uno al ecosistema? Paso a paso': '생태계에 어떻게 합류하나요? 단계별 안내',
  'Necesitas cuatro cosas y estos pasos: 1) Una wallet Web3 compatible con BEP-20 (SafePal, MetaMask u otra). 2) Fondearla con BNB para el gas y USDT (BEP-20) para tu aporte — desde 20 USDT. 3) Entrar con el enlace de referido de quien te invitó (sin ese enlace no se abre el registro). 4) Elegir AiG Mining, Booster o ambos, y seguir tu distribución diaria. Genesis es solo por invitación, así que el enlace del referido es imprescindible.':
    '네 가지가 필요하고 순서는 이렇습니다. 1) BEP-20을 지원하는 Web3 지갑(SafePal, MetaMask 등). 2) 가스비용 BNB와 참여금용 USDT(BEP-20)를 넣어 두기 — 최소 20 USDT부터. 3) 초대한 사람의 추천 링크로 접속하기(그 링크가 없으면 가입 화면이 열리지 않습니다). 4) AiG Mining이나 Booster, 또는 둘 다 선택하고 매일 분배를 확인하기. Genesis는 초대 전용이라 추천인 링크가 반드시 필요합니다.',
  '¿Qué es TAG o Tag Markets?': 'TAG 또는 Tag Markets란 무엇인가요?',
  'Tag Markets es el bróker de trading sistemático de la alianza Aitech One: estrategias automatizadas para operar sin depender de tu tiempo, experiencia o emociones. El capital operativo se maneja en formato DUAL (AIG-USDT). Su web oficial es tagmarkets.com y el portal de Genesis es genesis.ibportal.io. Punto clave: el trading conlleva riesgos, los resultados varían y el desempeño pasado no garantiza resultados futuros; esto es informativo, no asesoría financiera.':
    'Tag Markets는 Aitech One 얼라이언스의 체계적 트레이딩 브로커입니다. 시간이나 경험, 감정에 좌우되지 않고 운용할 수 있도록 자동화된 전략을 제공합니다. 운용 자본은 듀얼(AIG-USDT) 방식으로 관리됩니다. 공식 사이트는 tagmarkets.com이며 Genesis 포털은 genesis.ibportal.io입니다. 중요한 점: 트레이딩에는 위험이 따르고 결과는 저마다 다르며 과거의 성과가 미래를 보장하지 않습니다. 이는 정보 제공용이며 금융 자문이 아닙니다.',
  '¿Cómo activo la minería (AiG Mining)? Paso a paso': '마이닝(AiG Mining)은 어떻게 활성화하나요? 단계별 안내',
  '¿Qué es el AiG Token?': 'AiG Token이란 무엇인가요?',
  'Es el activo nativo del ecosistema AiGenesis, sobre la Binance Smart Chain (BSC). Está en cada operación: se genera a diario como recompensa de minería, se bloquea en staking para rendimientos, circula entre usuarios como medio de intercambio, y se recibe en referidos, binario y bonos de rango. Tiene un supply FIJO de 111 millones, sin emisión nueva ni quema.':
    '바이낸스 스마트 체인(BSC) 위에 있는 AiGenesis 생태계의 네이티브 자산입니다. 모든 활동에 관여합니다. 마이닝 보상으로 매일 생성되고, 스테이킹으로 잠겨 수익을 만들며, 사용자 사이에서 교환 수단으로 오가고, 추천과 바이너리, 등급 보너스로 지급됩니다. 발행량은 1억 1,100만 개로 고정되어 있으며 추가 발행도 소각도 없습니다.',
  '¿Cómo empiezo o me uno a la alianza (TagMarket) a través de la comunidad?':
    '커뮤니티를 통해 얼라이언스(TagMarket)에는 어떻게 시작하거나 합류하나요?',
  '¿Qué es Aitech / Aitech One y la alianza con Genesis?':
    'Aitech / Aitech One은 무엇이고 Genesis와의 얼라이언스는 무엇인가요?',
  '¿Para qué sirve el AiG Token en la alianza? ¿Dónde puedo usarlo?':
    '얼라이언스에서 AiG Token은 어디에 쓰나요? 어디서 사용할 수 있나요?',
  '¿Qué es BIX o BixCard?': 'BIX 또는 BixCard란 무엇인가요?',
  '¿Necesito una cuenta distinta para cada producto?': '제품마다 다른 계정이 필요한가요?',
  'No. Hay una sola cuenta para todo el ecosistema. Los botones de Mining, Staking, Booster, G-Pulse y el marketplace llevan todos al mismo sitio: conect.aigenesis.io. Si ya entraste una vez, estás dentro de todo.':
    '아닙니다. 생태계 전체에 계정은 하나뿐입니다. Mining, Staking, Booster, G-Pulse, 마켓플레이스 버튼은 모두 같은 곳으로 연결됩니다: conect.aigenesis.io. 한 번 들어갔다면 전부에 들어간 것입니다.',
  'Quiero registrarme y me dice «ACCESO RESTRINGIDO»': '가입하려는데 «접근 제한»이라고 나옵니다',
  'Genesis es solo por invitación. Para abrir el formulario de alta hace falta un enlace que lleve el referido de quien te invitó — la parte «?ref=» de la dirección. Sin esa parte no hay registro que rellenar. Si te pasaron el enlace como botón y se recortó, pide que te lo manden como texto plano.':
    'Genesis는 초대 전용입니다. 가입 양식을 열려면 초대한 사람의 추천 정보가 담긴 링크 — 주소의 «?ref=» 부분 — 가 필요합니다. 그 부분이 없으면 채울 가입 양식 자체가 없습니다. 링크를 버튼 형태로 받아 잘렸다면, 일반 텍스트로 다시 보내 달라고 요청하세요.',
  'Me registré, ¿y ahora?': '가입했습니다. 이제 뭘 하나요?',
  'Al registrarte llega un código a tu correo para validar el alta. Hasta que lo introduzcas, el registro no queda confirmado. Si no aparece, revisa la carpeta de no deseados antes de repetir el proceso: crear una segunda cuenta no arregla el correo que falta y deja dos altas a medias.':
    '가입하면 등록을 확인하는 코드가 메일로 옵니다. 그 코드를 입력하기 전까지 가입은 확정되지 않습니다. 메일이 보이지 않으면 다시 가입하기 전에 스팸함부터 확인하세요. 두 번째 계정을 만든다고 오지 않는 메일이 해결되지는 않고, 절반만 끝난 가입만 두 개 남습니다.',
  'Dice que no existe mi correo o mi wallet': '제 이메일이나 지갑이 없다고 나옵니다',
  'Entra por donde te diste de alta. Si te registraste con correo y contraseña, entrar conectando la wallet no funciona, y al revés tampoco: el sistema no asocia las dos formas por su cuenta. Comprueba también que el correo sea exactamente el del alta.':
    '가입할 때 쓴 방법으로 로그인하세요. 이메일과 비밀번호로 가입했다면 지갑을 연결해 들어갈 수 없고, 그 반대도 마찬가지입니다. 시스템이 두 방식을 알아서 연결해 주지 않습니다. 이메일이 가입할 때 쓴 주소와 정확히 같은지도 확인하세요.',
  'Olvidé mi contraseña': '비밀번호를 잊어버렸습니다',
  'Se resuelve sin ayuda de nadie: «¿Olvidaste la contraseña?» está en la propia pantalla de acceso y te manda un correo de recuperación desde una dirección de aigenesis.io. Si no llega, comprueba que escribiste el correo del alta — el sistema no avisa cuando una dirección no existe, y es a propósito, para no revelar quién tiene cuenta.':
    '혼자서 해결할 수 있습니다. 로그인 화면에 «비밀번호를 잊으셨나요?»가 있고, aigenesis.io 주소에서 재설정 메일을 보냅니다. 메일이 오지 않으면 가입할 때 쓴 이메일을 정확히 입력했는지 확인하세요. 존재하지 않는 주소라도 시스템은 알려 주지 않는데, 이는 누가 계정을 가졌는지 드러내지 않기 위한 의도된 동작입니다.',
  '¿Cómo sé qué es oficial? ¿Cuáles son las fuentes verificables?': '무엇이 공식인지 어떻게 알 수 있나요? 확인 가능한 출처는 무엇인가요?',
  '¿Qué datos me puede pedir el soporte?': '지원팀이 요구할 수 있는 정보는 무엇인가요?',
  'Tu usuario, tu correo, la wallet asociada y los hashes de las transacciones del caso. Nunca la contraseña, y nunca la frase de recuperación de tu wallet: nadie del equipo la necesita jamás, y quien te la pida está intentando robarte, aunque escriba desde un canal que parezca oficial.':
    '아이디와 이메일, 연결된 지갑, 그리고 해당 건의 트랜잭션 해시입니다. 비밀번호는 절대 요구하지 않으며, 지갑의 복구 문구도 절대 요구하지 않습니다. 팀의 그 누구도 그것을 필요로 하지 않습니다. 그것을 묻는 사람은 공식처럼 보이는 채널에서 연락했더라도 당신의 자산을 훔치려는 것입니다.',
  '¿Puedo cambiar la wallet de mi cuenta?': '계정의 지갑을 바꿀 수 있나요?',
  '¿Qué es el hold y por qué me lo piden?': '홀드란 무엇이며 왜 요구하나요?',
  'El hold es una cantidad de AIG que la cuenta debe mantener para conservar sus beneficios activos. No es un cobro ni un depósito que se pierda: sigue siendo tuyo, sólo tiene que estar ahí. La cuenta muestra en qué banda estás — desde «Cumple Requisito» hasta «Óptimo», y «Beneficios Congelados» cuando cae por debajo.':
    '홀드는 계정이 혜택을 유지하기 위해 보유하고 있어야 하는 AIG의 수량입니다. 부과금도 아니고 사라지는 예치금도 아닙니다. 여전히 당신의 것이며, 그 자리에 있기만 하면 됩니다. 계정에는 현재 어느 구간인지 표시됩니다 — «요건 충족»에서 «최적»까지, 그리고 최소치 아래로 내려가면 «혜택 동결»입니다.',
  '¿Cuánto AIG tengo que mantener exactamente?': '정확히 얼마의 AIG를 유지해야 하나요?',
  'El 14% de lo que has minado históricamente. Sobre ese mínimo hay bandas de margen —el sistema las llama Recomendado y Óptimo— que existen para que un movimiento pequeño no te deje por debajo del límite. La cifra exacta en AIG la calcula tu propia cuenta: mírala en el panel antes de mover nada, porque depende de tu histórico y no del de nadie más.':
    '지금까지 채굴한 누적량의 14 %입니다. 그 최소치 위로는 여유 구간이 있는데 — 시스템은 이를 권장과 최적이라고 부릅니다 — 작은 이동으로 한도 아래로 떨어지지 않게 하기 위한 것입니다. AIG로 환산한 정확한 수치는 각자의 계정이 계산합니다. 무엇이든 옮기기 전에 패널에서 확인하세요. 그 값은 다른 누구도 아닌 본인의 누적 기록에 따라 달라집니다.',
  'Si bajo del hold, ¿qué deja de funcionar exactamente?': '홀드 아래로 내려가면 정확히 무엇이 멈추나요?',
  'Se bloquean las recompensas: dejas de minar y no puedes reclamar. No es un bloqueo de la cuenta entera ni te quita nada de lo que ya tienes — lo que se detiene es la generación y el reclamo, hasta que vuelvas a cubrir el mínimo.':
    '보상이 잠깁니다. 채굴이 멈추고 청구를 할 수 없게 됩니다. 계정 전체가 잠기는 것도 아니고 이미 가진 것을 빼앗는 것도 아닙니다. 최소치를 다시 채울 때까지 생성과 청구만 멈춥니다.',
  '¿Alguien tiene que descongelarme la cuenta?': '계정을 풀어 주려면 누군가의 조치가 필요한가요?',
  'No. En cuanto repones AIG en tu wallet hasta alcanzar el mínimo, el protocolo reactiva los beneficios de forma automática: no requiere soporte ni aprobación manual. La propia pantalla te lo dice cuando estás por debajo, indicándote cuánto AIG te falta exactamente.':
    '아닙니다. 지갑에 AIG를 최소치까지 다시 채우면 프로토콜이 자동으로 혜택을 재개합니다. 지원 요청이나 수동 승인이 필요하지 않습니다. 최소치 아래일 때는 화면이 직접 알려 주며, AIG가 정확히 얼마나 모자라는지도 표시합니다.',
  '¿Desde cuánto puedo reclamar?': '얼마부터 청구할 수 있나요?',
  'Desde 10 USDT acumulados. Por debajo de esa cifra el reclamo no se puede ejecutar — no es una avería ni una cuenta bloqueada: hay que acumular hasta el mínimo. Es habitual quedarse con un resto pequeño al terminar un ciclo y no poder moverlo.':
    '누적 10 USDT부터입니다. 그 아래에서는 청구가 실행되지 않습니다. 고장도 아니고 잠긴 계정도 아니며, 최소치까지 쌓여야 합니다. 한 주기가 끝날 때 적은 잔액이 남아 옮기지 못하는 일은 흔합니다.',
  'Reclamé y no ha llegado nada': '청구했는데 아무것도 오지 않았습니다',
  'Un reclamo puede tardar desde un minuto hasta 72 horas en llegar a tu wallet, según el caso, por procesos de verificación y seguridad. Que no aparezca al momento no significa que haya fallado, y volver a reclamar no lo acelera. Pasadas 72 horas sí es un caso: escribe con el hash, la hora y el importe.':
    '청구는 검증과 보안 절차 때문에 사안에 따라 1분에서 72시간까지 걸려 지갑에 도착할 수 있습니다. 즉시 보이지 않는다고 실패한 것은 아니며, 다시 청구한다고 빨라지지도 않습니다. 72시간이 지났다면 그때는 문의 대상입니다. 해시와 시각, 금액을 함께 보내 주세요.',
  'Retiré mis AIG y la cuenta se congeló. ¿Por qué no baja lo que me piden?':
    'AIG를 출금했더니 계정이 동결됐습니다. 왜 요구치가 줄지 않나요?',
  'Porque el hold NO se calcula sobre lo que tienes ahora, sino sobre lo que has minado históricamente. Sacar monedas no reduce el requisito: reduce lo que tienes para cubrirlo, y por eso la cuenta pasa a congelada. La propia pantalla lo enseña con la frase «Históricamente has minado…». Para reactivarla hay que devolver AIG hasta cubrir de nuevo el mínimo.':
    '홀드는 지금 보유한 양이 아니라 지금까지 채굴한 누적량을 기준으로 계산되기 때문입니다. 코인을 빼내도 요건은 줄지 않고, 그것을 채울 보유량만 줄어들기 때문에 계정이 동결로 넘어갑니다. 화면에도 «지금까지 채굴한 누적량은…»이라는 문구로 표시됩니다. 되살리려면 최소치를 다시 채울 만큼 AIG를 되돌려 놓아야 합니다.',
  'Tengo AIG de sobra pero sigo por debajo del mínimo': 'AIG가 충분한데도 최소치 아래라고 나옵니다',
  'Mira DÓNDE lo tienes. El mínimo se calcula sobre el AIG que hay en tu wallet on-chain — no cuenta la bóveda interna del protocolo ni la liquidez que tengas publicada en el P2P. Con la bóveda llena y la wallet vacía se sigue estando por debajo.':
    '어디에 있는지 확인하세요. 최소치는 온체인 지갑에 있는 AIG를 기준으로 계산됩니다. 프로토콜 내부 금고나 P2P에 게시해 둔 유동성은 포함되지 않습니다. 금고가 가득해도 지갑이 비어 있으면 여전히 최소치 아래입니다.',
  'Reclamé y me llegó AIG, no USDT': '청구했더니 USDT가 아니라 AIG가 왔습니다',
  'Es lo correcto. El protocolo lleva la cuenta de las recompensas en USDT porque es una unidad cómoda de medir, pero lo que se genera y se libera es AIG. Al reclamar, ese saldo contabilizado se convierte en AIG. Todas las pantallas lo advierten: los valores en USDT son estimaciones, no una promesa de valor.':
    '정상입니다. 프로토콜은 측정하기 편한 단위라서 보상을 USDT로 집계하지만, 실제로 생성되고 지급되는 것은 AIG입니다. 청구하면 그 집계된 잔액이 AIG로 바뀝니다. 모든 화면이 이를 알립니다. USDT로 표시된 값은 추정치이며 가치를 약속하는 것이 아닙니다.',
  '¿Dónde está mi dinero? No cuadran mis saldos': '제 돈은 어디에 있나요? 잔액이 맞지 않습니다',
  'Tu dinero puede estar en cuatro sitios distintos, y confundirlos es la causa más común de «no cuadra»: 1) tu wallet on-chain (lo que controlas con MetaMask); 2) el crédito interno del sistema; 3) la Liquidez Marketplace (lo que publicaste en el P2P y aún no retiraste); y 4) el saldo de recompensas por reclamar. Cada uno se ve por separado en tu panel. Si publicaste liquidez, ese saldo deja de estar en la wallet hasta que lo retires — no desapareció, cambió de sitio.':
    '돈은 서로 다른 네 곳에 있을 수 있고, 이를 혼동하는 것이 «맞지 않는다»의 가장 흔한 원인입니다. 1) 온체인 지갑(MetaMask로 직접 관리하는 것), 2) 시스템 내부 크레딧, 3) 마켓플레이스 유동성(P2P에 게시했고 아직 회수하지 않은 것), 4) 청구 대기 중인 보상 잔액. 각각은 패널에서 따로 표시됩니다. 유동성을 게시했다면 그 잔액은 회수할 때까지 지갑에서 빠져 있습니다. 사라진 것이 아니라 자리를 옮긴 것입니다.',
  '¿Cómo funciona el P2P?': 'P2P는 어떻게 작동하나요?',
  'Es un tablón de comerciantes: cada fila es alguien que ya depositó liquidez, con su país, su rango de operación y cuántas transacciones lleva hechas. Filtras por país, moneda e importe, eliges la fila que te encaje y pulsas «Tomar». La operación se firma con MetaMask.':
    '상인들의 게시판입니다. 각 줄은 이미 유동성을 예치한 사람이며 국가와 취급 범위, 지금까지의 거래 건수가 표시됩니다. 국가와 통화, 금액으로 걸러 낸 뒤 맞는 줄을 골라 «수락»을 누릅니다. 거래는 MetaMask로 서명합니다.',
  '¿Cuánto vale un AIG?': 'AIG 하나의 가치는 얼마인가요?',
  'AIG tiene un valor interno de referencia dentro del sistema — hoy 23,50 USD — que es el que usan el protocolo y la comunidad para operar entre sí. No es un precio de mercado abierto: AIG no cotiza en ningún exchange público, así que nadie puede prometerte que ese valor se sostenga fuera del ecosistema. En el P2P, cada comerciante publica su oferta alrededor de esa referencia.':
    'AIG는 시스템 안에서 쓰는 내부 기준 가치를 가집니다 — 현재 23.50 USD — 프로토콜과 커뮤니티가 서로 거래할 때 쓰는 값입니다. 공개 시장 가격이 아닙니다. AIG는 어떤 공개 거래소에도 상장되어 있지 않으므로, 그 가치가 생태계 밖에서 유지된다고 약속할 수 있는 사람은 없습니다. P2P에서는 각 상인이 그 기준 근처로 자기 호가를 게시합니다.',
  '¿Cómo publico liquidez para vender en el P2P?': 'P2P에서 팔기 위해 유동성은 어떻게 게시하나요?',
  'En P2P → Mi Perfil → Liquidez Marketplace → «Depositar liquidez». Pasos: 1) Necesitas sesión activa, MetaMask en red BSC y saldo real de USDT o AIG (esto mueve dinero de verdad). 2) Elige token (solo USDT o AIG) e importe. 3) «Depositar con MetaMask» y firma. 4) Al confirmarse en cadena verás «Depósito registrado» con el hash. A partir de ahí sales publicado en el libro. Si no se refleja en un rato, repórtalo con el hash — nunca repitas el depósito, movería el dinero otra vez.':
    'P2P → 내 프로필 → 마켓플레이스 유동성 → «유동성 예치»입니다. 순서는 이렇습니다. 1) 활성 세션과 BSC 네트워크의 MetaMask, 그리고 실제 USDT 또는 AIG 잔액이 필요합니다(실제 돈이 움직입니다). 2) 토큰(USDT 또는 AIG만)과 금액을 고릅니다. 3) «MetaMask로 예치»를 누르고 서명합니다. 4) 체인에서 확정되면 해시와 함께 «예치 등록됨»이 표시됩니다. 그때부터 장부에 게시됩니다. 한참 지나도 반영되지 않으면 해시와 함께 알려 주세요. 예치를 반복하면 안 됩니다. 돈이 한 번 더 움직입니다.',
  '¿Cómo retiro mi liquidez del P2P? Retiré y no veo la wallet': 'P2P에서 유동성은 어떻게 회수하나요? 회수했는데 지갑이 열리지 않습니다',
  'En P2P → Mi Perfil → Liquidez Marketplace → «Retirar». Elige entre tu liquidez en USDT o en AIG, confirma cuál y cuánto, y pulsa «Confirmar retiro». DATO CLAVE: este paso NO abre MetaMask ni pide firma —la propia pantalla lo dice—. Que no aparezca la cartera no significa que no se envió: es una SOLICITUD que PAI procesa después, devolviendo los fondos a tu wallet registrada. Entre la solicitud y la llegada hay una espera que la interfaz no controla. No lo repitas: comprueba el estado antes.':
    'P2P → 내 프로필 → 마켓플레이스 유동성 → «회수»입니다. USDT 유동성과 AIG 유동성 중에서 고르고, 무엇을 얼마나 회수할지 확인한 뒤 «회수 확인»을 누릅니다. 핵심: 이 단계에서는 MetaMask가 열리지도, 서명을 요구하지도 않습니다 — 화면에도 그렇게 적혀 있습니다. 지갑이 뜨지 않는다고 전송되지 않은 것이 아닙니다. 이는 요청이며, PAI가 나중에 처리해 등록된 지갑으로 자금을 돌려보냅니다. 요청과 도착 사이에는 화면이 통제하지 못하는 대기 시간이 있습니다. 반복하지 말고 먼저 상태를 확인하세요.',
  'El P2P me pide iniciar sesión aunque ya estoy dentro': '이미 로그인했는데 P2P가 다시 로그인하라고 합니다',
  'Puede pasar: el P2P usa una credencial adicional a la de la aplicación, y si esa caduca aparece «Inicia sesión en Genesis para operar en el P2P.» aunque el resto funcione. Cerrar sesión y volver a entrar la regenera. Si en cambio ves que el servicio de libro no está disponible, eso es una caída del servicio y no hay nada que puedas arreglar desde tu cuenta.':
    '그럴 수 있습니다. P2P는 애플리케이션과 별개의 인증을 쓰기 때문에, 그것이 만료되면 나머지가 정상이어도 «P2P에서 거래하려면 Genesis에 로그인하세요.»가 나타납니다. 로그아웃 후 다시 로그인하면 새로 발급됩니다. 반대로 장부 서비스를 이용할 수 없다는 표시가 보인다면 그것은 서비스 장애이며 계정에서 할 수 있는 일은 없습니다.',
  'Quiero vender AIG en el P2P y no me deja publicar': 'P2P에서 AIG를 팔고 싶은데 게시가 되지 않습니다',
  'Para aparecer en el libro hay que ser comerciante, y para eso hay que depositar liquidez antes: Mi Perfil → activar perfil de comerciante → Depositar liquidez con MetaMask en red BEP20, en USDT o en AIG. Cuando el saldo queda acreditado, tu fila aparece en el libro. Para recuperar los fondos, mismo panel: Retirar.':
    '장부에 나오려면 상인이어야 하고, 그러려면 먼저 유동성을 예치해야 합니다. 내 프로필 → 상인 프로필 활성화 → BEP20 네트워크의 MetaMask로 USDT 또는 AIG 유동성 예치. 잔액이 반영되면 장부에 당신의 줄이 나타납니다. 자금을 되찾을 때도 같은 패널의 회수를 씁니다.',
  '¿Quién decide el precio en el P2P?': 'P2P의 가격은 누가 정하나요?',
  'Cada comerciante pone el suyo. La pantalla muestra un precio sugerido y una banda para que las ofertas sean comparables entre sí, y dentro de ese rango cada uno publica lo que quiere. No es una referencia de mercado abierto: es el rango que la propia interfaz propone.':
    '각 상인이 자기 가격을 정합니다. 화면에는 호가들이 서로 비교되도록 제안 가격과 허용 구간이 표시되고, 그 범위 안에서 각자 원하는 값을 게시합니다. 공개 시장 시세가 아니라 인터페이스가 제안하는 범위입니다.',
  '¿Cómo sé de quién comprar?': '누구에게서 사야 할지 어떻게 아나요?',
  'Cada fila muestra el alias del anunciante, su país y cuántas transacciones lleva hechas — ésa es la información con la que se elige. También puedes filtrar por país, por moneda y por importe mínimo y máximo, para ver sólo lo que te encaja.':
    '각 줄에는 게시자의 별칭과 국가, 지금까지의 거래 건수가 표시됩니다. 고를 때 참고하는 정보는 그것입니다. 국가와 통화, 최소·최대 금액으로 걸러서 맞는 것만 볼 수도 있습니다.',
  '¿Cómo compro o tomo una oferta en el P2P?': 'P2P에서 어떻게 사거나 호가를 수락하나요?',
  'En P2P → Marketplace, pulsa «Tomar» en la fila que te interese. Antes de operar, mira el alias, el país y el número de transacciones del anunciante: es la única señal de confianza que da la pantalla. Necesitas sesión activa y MetaMask con fondos en la red correcta. El paso final es firmar la transferencia; lo que viene después es solo avisar al servidor de que ya pagaste. Si sale «No se pudo resolver el ID del comerciante», recarga el libro P2P — se arregla recargando, no reintentando a ciegas.':
    'P2P → 마켓플레이스에서 원하는 줄의 «수락»을 누릅니다. 거래하기 전에 게시자의 별칭과 국가, 거래 건수를 확인하세요. 화면이 주는 유일한 신뢰 신호입니다. 활성 세션과 올바른 네트워크에 자금이 있는 MetaMask가 필요합니다. 마지막 단계는 송금에 서명하는 것이고, 그 뒤는 이미 지불했다고 서버에 알리는 절차입니다. «상인 ID를 확인할 수 없습니다»가 나오면 P2P 장부를 새로 고치세요. 무작정 재시도가 아니라 새로 고침으로 해결됩니다.',
  '¿Cómo puedo pagar?': '어떻게 결제할 수 있나요?',
  'Ahora mismo hay dos formas, las dos con wallet conectada: DUAL, que es una parte en AIG y el resto en USDT; y USDT solo, sin AIG. No hace falta elegir nada más — en la caja aparecen esas dos y se paga en la red BSC.':
    '현재 두 가지가 있으며 둘 다 지갑 연결이 필요합니다. 일부를 AIG로, 나머지를 USDT로 내는 듀얼과, AIG 없이 USDT만 내는 방식입니다. 그 밖에 고를 것은 없습니다. 결제 화면에 두 가지가 나타나며 BSC 네트워크에서 지불합니다.',
  '¿En qué red tengo que pagar?': '어느 네트워크로 결제해야 하나요?',
  'En BSC. Antes de confirmar, comprueba que tu wallet está en esa red: enviar desde otra cadena manda los fondos a un sitio del que no se recuperan.':
    'BSC입니다. 확정하기 전에 지갑이 그 네트워크에 있는지 확인하세요. 다른 체인에서 보내면 되찾을 수 없는 곳으로 자금이 갑니다.',
  '¿Puedo pagar con tarjeta?': '카드로 결제할 수 있나요?',
  'Esta temporada no se ofrece el pago con tarjeta. Se paga desde tu wallet: DUAL (AIG + USDT) o USDT solo, y sin wallet conectada no se puede completar la compra. Si en algún momento se habilita otra forma de pago, se anunciará por los canales oficiales.':
    '이번 시즌에는 카드 결제를 제공하지 않습니다. 결제는 지갑에서 합니다. 듀얼(AIG + USDT) 또는 USDT 단독이며, 지갑을 연결하지 않으면 구매를 끝낼 수 없습니다. 다른 결제 수단이 열리면 공식 채널로 알립니다.',
  'En DUAL, ¿cuánto AIG me van a cobrar?': '듀얼로 결제하면 AIG는 얼마나 청구되나요?',
  'Cada producto aporta su propia parte en AIG, así que la cantidad depende de lo que lleves en el carrito y no de un porcentaje único aplicado al total. La cifra exacta en AIG y en USDT se ve en la caja antes de confirmar: si algo no cuadra ahí, no confirmes.':
    '상품마다 AIG로 낼 수 있는 몫이 정해져 있어서, 수량은 장바구니에 담은 것에 따라 달라지며 총액에 일률적으로 적용되는 비율이 아닙니다. AIG와 USDT의 정확한 금액은 확정 전에 결제 화면에서 볼 수 있습니다. 거기서 무언가 맞지 않으면 확정하지 마세요.',
  'No me aparece la opción de pagar con AIG': 'AIG로 결제하는 선택지가 보이지 않습니다',
  'Comprueba primero que tienes la wallet conectada: sin ella no se muestra ninguna forma de pago. Si está conectada y aun así sólo ves USDT, es por el carrito — cuánto AIG admite cada artículo lo define el propio producto, no tu cuenta.':
    '먼저 지갑이 연결되어 있는지 확인하세요. 지갑이 없으면 어떤 결제 수단도 표시되지 않습니다. 연결되어 있는데도 USDT만 보인다면 장바구니 때문입니다. 각 상품이 AIG를 얼마나 받을지는 상품이 정하며 계정이 정하지 않습니다.',
  '¿El envío está incluido en el precio?': '배송비는 가격에 포함되어 있나요?',
  'El total que ves en la caja es el que se cobra, con el envío ya dentro. El envío internacional depende del destino, así que el importe puede cambiar según el país que indiques — pero se ve antes de pagar, no después.':
    '결제 화면에 보이는 총액이 실제 청구되는 금액이며 배송비가 이미 들어 있습니다. 국제 배송은 목적지에 따라 달라지므로 지정한 국가에 따라 금액이 바뀔 수 있지만, 결제 전에 보이지 결제 후에 붙지 않습니다.',
  '¿Cuántos pasos tiene la compra?': '구매는 몇 단계인가요?',
  'Dos. Primero la dirección de envío —queda guardada para próximas compras— y después la forma de pago. El envío ya va incluido en el total, así que no aparece ningún cargo extra al final.':
    '두 단계입니다. 먼저 배송 주소 — 다음 구매를 위해 저장됩니다 — 그다음 결제 수단입니다. 배송비는 이미 총액에 포함되어 있어 마지막에 추가 요금이 붙지 않습니다.',
  '¿Cuántos AiG hay en total? ¿Se pueden crear más?': 'AiG는 총 몇 개이며 더 만들 수 있나요?',
  'El supply es fijo: 111 millones de AiG, y no cambia. El contrato no tiene función de acuñar (mint) ni de quemar (burn), así que nadie puede crear tokens nuevos ni destruir los existentes. Esa permanencia es a propósito: da previsibilidad al ecosistema.':
    '발행량은 1억 1,100만 AiG로 고정되어 있고 바뀌지 않습니다. 컨트랙트에는 발행(mint)이나 소각(burn) 기능이 없어서 누구도 새 토큰을 만들거나 기존 토큰을 없앨 수 없습니다. 이 항구성은 의도된 것으로, 생태계에 예측 가능성을 줍니다.',
  '¿Cómo se distribuye el supply del AiG?': 'AiG 발행량은 어떻게 배분되나요?',
  'De los 111 millones: 50% bloqueado (locked), 20% recompensas, 15% staking, 10% tesorería (treasury), 5% equipo corporativo y 0.01% liquidez. La distribución está pensada para sostener las recompensas del ecosistema a largo plazo.':
    '1억 1,100만 개 가운데 50 % 락업(locked), 20 % 보상, 15 % 스테이킹, 10 % 트레저리(treasury), 5 % 기업 팀, 0.01 % 유동성입니다. 이 배분은 생태계의 보상을 장기간 지탱하도록 설계되었습니다.',
  '¿La emisión de AiG baja con el tiempo?': 'AiG 발행량은 시간이 지나면 줄어드나요?',
  'Sí, la emisión se reduce de forma programada año a año: 11% el año 1, 11% el año 2, 8% el año 3, 6% el año 4, 4% el año 5 y 2% el año 6 (tasas mensuales de emisión). Menor emisión significa mayor escasez con el tiempo. Es una tasa de emisión del protocolo, no una promesa de resultado.':
    '네, 발행은 해마다 정해진 대로 줄어듭니다. 1년 차 11 %, 2년 차 11 %, 3년 차 8 %, 4년 차 6 %, 5년 차 4 %, 6년 차 2 %입니다(월간 발행률). 발행이 줄면 시간이 갈수록 희소해집니다. 이는 프로토콜의 발행률이지 결과에 대한 약속이 아닙니다.',
  '¿El AiG sirve para votar o gobernar el ecosistema?': 'AiG로 생태계의 의사결정에 투표하거나 참여할 수 있나요?',
  'Sí. El AiG Token es una herramienta de gobernanza: quienes lo tienen pueden influir en decisiones que dan forma al ecosistema, con un enfoque descentralizado y guiado por la comunidad. Las novedades de gobernanza se comunican por los canales oficiales.':
    '네. AiG Token은 거버넌스 도구입니다. 보유자는 생태계의 모습을 결정하는 사안에 영향을 줄 수 있으며, 탈중앙화되고 커뮤니티가 이끄는 방식을 따릅니다. 거버넌스 관련 소식은 공식 채널로 전해집니다.',
  '¿En qué red está el AiG? ¿Qué necesito para operar?': 'AiG는 어느 네트워크에 있나요? 거래하려면 무엇이 필요한가요?',
  'El AiG vive en la Binance Smart Chain (BSC / BEP-20). Para operar necesitas una wallet Web3 compatible con BEP-20 (como SafePal, MetaMask u otra), un poco de BNB para las comisiones de red (gas fee) y USDT (BEP-20) para tu aporte. Todo es de auto-custodia: tú controlas tus claves privadas.':
    'AiG는 바이낸스 스마트 체인(BSC / BEP-20) 위에 있습니다. 거래하려면 BEP-20을 지원하는 Web3 지갑(SafePal, MetaMask 등)과 네트워크 수수료(가스비)용 BNB 약간, 그리고 참여금용 USDT(BEP-20)가 필요합니다. 모두 자기 보관 방식입니다. 개인 키는 본인이 관리합니다.',
  '¿AiGenesis es un banco o algo garantizado?': 'AiGenesis는 은행인가요, 아니면 보장되는 무언가인가요?',
  'No. AiGenesis es un ecosistema tecnológico basado en blockchain — no una institución financiera, bancaria ni casa de valores. Participar implica adquirir tecnología de minado e interactuar con contratos inteligentes que se ejecutan solos. Los porcentajes son tasas de emisión programada del token, no un producto bancario ni un resultado asegurado en dólares; los criptoactivos son volátiles por naturaleza.':
    '아닙니다. AiGenesis는 블록체인 기반의 기술 생태계이며 금융기관도, 은행도, 증권사도 아닙니다. 참여한다는 것은 채굴 기술을 취득하고 스스로 실행되는 스마트 컨트랙트와 상호작용한다는 뜻입니다. 표시된 비율은 토큰의 예정된 발행률이지 은행 상품도, 달러로 보장된 결과도 아닙니다. 암호자산은 본래 변동성이 큽니다.',
  'Pagué el booster y no se refleja en mi cuenta': '부스터 결제를 했는데 계정에 반영되지 않습니다',
  'Primero: no repitas la compra ni reenvíes fondos. El pago del booster tiene dos pasos — la transacción en la cadena y el registro en el servidor — y a veces la cadena confirma antes de que el registro termine. Si el registro llega a fallar, el propio portal abre una incidencia en Soporte VIP con el hash de tu transacción para que el equipo la revise contra la cadena. Ten a mano ese hash: con él se reconstruye todo; sin él, no.':
    '우선, 구매를 반복하거나 자금을 다시 보내지 마세요. 부스터 결제는 두 단계입니다 — 체인 위의 트랜잭션과 서버의 기록 — 그리고 때때로 기록이 끝나기 전에 체인이 먼저 확정됩니다. 기록이 실패하면 포털이 트랜잭션 해시와 함께 VIP 지원에 사건을 열어 팀이 체인과 대조해 검토합니다. 그 해시를 꼭 갖고 계세요. 그것으로 전부 복원할 수 있고, 없으면 할 수 없습니다.',
  'Cancelé la firma en la wallet — ¿se cobró algo?': '지갑에서 서명을 취소했습니다 — 뭔가 청구되었나요?',
  'No. Si cancelas la firma en tu wallet, la transacción nunca sale: no se mueve nada y no hay nada que revertir. Puedes intentarlo de nuevo cuando quieras. Solo si FIRMASTE y luego algo falló vale la pena revisar: en ese caso guarda el hash de la transacción y escribe a soporte con él.':
    '아닙니다. 지갑에서 서명을 취소하면 트랜잭션은 아예 나가지 않습니다. 아무것도 움직이지 않았고 되돌릴 것도 없습니다. 언제든 다시 시도할 수 있습니다. 서명을 했는데 그다음에 무언가 실패한 경우에만 확인할 가치가 있습니다. 그때는 트랜잭션 해시를 보관했다가 함께 문의하세요.',
  '¿Qué es el rebooster?': '리부스터란 무엇인가요?',
  'Es la reinversión desde tu saldo de booster: en lugar de traer fondos nuevos desde la wallet, usas lo ya generado para reforzar el paquete. Tras confirmar, el registro sigue el mismo camino que una compra de booster — así que si algo no se refleja, aplica lo mismo: no repitas la operación y guarda el detalle de la confirmación para soporte.':
    '부스터 잔액으로 하는 재투자입니다. 지갑에서 새 자금을 가져오는 대신, 이미 생성된 것으로 패키지를 보강합니다. 확정한 뒤의 기록 절차는 부스터 구매와 같습니다. 그러니 무언가 반영되지 않으면 같은 원칙이 적용됩니다. 작업을 반복하지 말고 확정 내역을 보관해 지원팀에 전달하세요.',
  '¿Cómo se calcula la compensación del binario y los equipos?': '바이너리와 팀 보상은 어떻게 계산되나요?',
  'Los porcentajes y condiciones exactos del plan de compensación los confirma el equipo por los canales oficiales — preferimos no publicarte una cifra aquí sin esa confirmación, porque un número equivocado sobre tu compensación es peor que pedirte un paso más. Escríbenos por el canal oficial con tu usuario y te lo detallan sobre tu caso.':
    '보상 플랜의 정확한 비율과 조건은 팀이 공식 채널로 확인해 드립니다. 그 확인 없이 여기에 수치를 적지 않으려 합니다. 보상에 관한 잘못된 숫자는 한 단계 더 거치게 하는 것보다 나쁘기 때문입니다. 공식 채널로 아이디와 함께 문의하시면 본인 사례에 맞춰 안내해 드립니다.',
  'Aitech One es una alianza entre Aitech —una comunidad y compañía internacional— y Genesis, presentada como una «trilogía financiera»: tres unidades dentro de un mismo ecosistema. Son: Tag Markets (trading sistemático), Bit1 (exchange de activos digitales) y BixCard/BIX (una tarjeta Visa respaldada por cripto). Genesis se une a esta alianza para sumar comunidad y dar usabilidad y liquidez al AiG Token a través de sus productos. Es material informativo: no es asesoría financiera y la participación es voluntaria y con riesgos.':
    'Aitech One은 국제적인 커뮤니티이자 기업인 Aitech와 Genesis 사이의 얼라이언스이며, «금융 3부작»으로 소개됩니다. 하나의 생태계 안에 있는 세 개의 단위입니다. Tag Markets(체계적 트레이딩), Bit1(디지털 자산 거래소), BixCard/BIX(암호화폐를 담보로 하는 비자 카드). Genesis는 커뮤니티를 더하고 자사 제품을 통해 AiG Token에 사용성과 유동성을 부여하기 위해 이 얼라이언스에 합류합니다. 정보 제공용 자료입니다. 금융 자문이 아니며 참여는 자발적이고 위험이 따릅니다.',
  'La idea de la alianza es dar usabilidad real al AiG Token. Dentro de los productos de Aitech One, el AiG se usa junto con USDT en formato DUAL (AIG-USDT) como capital operativo, y así el token gana demanda y liquidez por el uso de la comunidad. En resumen: el AiG pasa a ser uno de los medios aceptados para operar en la alianza, en lugar de quedarse quieto. Cuánto y cómo se aplica en cada producto se ve en los canales oficiales; esto es informativo, no una recomendación.':
    '얼라이언스의 취지는 AiG Token에 실제 사용성을 주는 것입니다. Aitech One의 제품 안에서 AiG는 USDT와 함께 듀얼(AIG-USDT) 방식으로 운용 자본으로 쓰이며, 그렇게 커뮤니티의 사용을 통해 토큰의 수요와 유동성이 생깁니다. 요컨대 AiG는 가만히 있는 대신 얼라이언스에서 거래에 쓰이는 수단 가운데 하나가 됩니다. 각 제품에 얼마나 어떻게 적용되는지는 공식 채널에서 확인할 수 있습니다. 이는 정보 제공용이며 권유가 아닙니다.',
  '¿Qué es Bit1?': 'Bit1은 무엇인가요?',
  'Bit1 es el exchange de la alianza Aitech One: una plataforma para comprar, intercambiar y operar activos digitales, con presencia internacional. Según su material, ofrece compra de cripto, intercambio rápido (swap), comercio P2P, futuros y copy trading, y funciones para gastar cripto en muchos comercios. Su web oficial es bit1.com. Como toda operación con activos digitales, conlleva riesgos y la decisión es de cada persona.':
    'Bit1은 Aitech One 얼라이언스의 거래소로, 디지털 자산을 사고 교환하고 운용하는 플랫폼이며 국제적으로 서비스합니다. 자체 자료에 따르면 암호화폐 구매와 빠른 교환(스왑), P2P 거래, 선물, 카피 트레이딩, 그리고 여러 가맹점에서 암호화폐를 쓰는 기능을 제공합니다. 공식 사이트는 bit1.com입니다. 디지털 자산을 다루는 모든 거래가 그렇듯 위험이 따르며 판단은 각자의 몫입니다.',
  'BixCard (BIX) es la tarjeta Visa de la alianza Aitech One: permite usar tus activos digitales en el mundo real, donde acepten Visa. Según su material, es no-custodial (tú mantienes el control de tus llaves y tu cripto), admite colateral en USDT y USDC en varias redes, es compatible con Apple Pay y Google Pay, y suma beneficios de la línea Visa Signature. Es una forma de dar uso cotidiano a la cripto; su disponibilidad por país se confirma en los canales oficiales.':
    'BixCard(BIX)는 Aitech One 얼라이언스의 비자 카드로, 비자를 받는 곳이라면 어디서든 디지털 자산을 현실에서 쓸 수 있게 해 줍니다. 자체 자료에 따르면 논커스터디얼 방식이고(키와 암호화폐의 통제권은 본인에게 있습니다), 여러 네트워크의 USDT와 USDC를 담보로 받으며, Apple Pay와 Google Pay를 지원하고, Visa Signature 라인의 혜택이 더해집니다. 암호화폐를 일상에서 쓰게 하는 방법이며, 국가별 이용 가능 여부는 공식 채널에서 확인됩니다.',
  'El acceso es a través de la comunidad: contacta a la persona que te invitó y te guía para registrarte en el portal oficial (genesis.ibportal.io) y conocer los productos. Antes de decidir, revisa la documentación oficial y, si lo consideras, consulta a un asesor: la participación es voluntaria y conlleva riesgos, y los resultados varían. Nadie oficial te va a pedir tu frase de recuperación ni tus claves privadas. Los detalles de cifras, planes y condiciones solo son válidos desde los canales oficiales.':
    '접근은 커뮤니티를 통해 이루어집니다. 초대한 사람에게 연락하면 공식 포털(genesis.ibportal.io) 가입과 제품 안내를 도와줍니다. 결정하기 전에 공식 문서를 확인하고, 필요하다면 전문가와 상담하세요. 참여는 자발적이며 위험이 따르고 결과는 저마다 다릅니다. 공식적인 그 누구도 복구 문구나 개인 키를 묻지 않습니다. 수치와 플랜, 조건에 대한 세부 내용은 공식 채널에서 온 것만 유효합니다.',
  '¿La alianza es confiable? ¿Qué respaldo y credenciales tiene?': '이 얼라이언스는 믿을 만한가요? 어떤 근거와 자격을 갖추고 있나요?',
  'Según la documentación oficial de Aitech One, la estructura declara respaldo y registros: un fondo de cobertura respaldado por Lloyd’s of London (sujeto a sus términos), y registros como FSC Mauritius, FSCA Sudáfrica y trámites ante otros reguladores; el exchange Bit1 declara registros DASP (El Salvador) y MSB (Canadá). Lo correcto es que verifiques estas credenciales directamente en las fuentes oficiales y en los registros públicos antes de tomar cualquier decisión: aquí solo repetimos lo que dice el material, no lo certificamos. La participación es voluntaria y con riesgos.':
    'Aitech One의 공식 문서에 따르면, 이 구조는 다음과 같은 근거와 등록을 밝히고 있습니다. Lloyd’s of London이 뒷받침하는 보장 펀드(해당 약관에 따름), 그리고 FSC 모리셔스, FSCA 남아프리카공화국 등록과 다른 규제기관에 대한 절차. 거래소 Bit1은 DASP(엘살바도르)와 MSB(캐나다) 등록을 밝히고 있습니다. 어떤 결정을 내리기 전에 이 자격들을 공식 출처와 공개 등록부에서 직접 확인하시는 것이 옳습니다. 여기서는 자료에 적힌 것을 옮길 뿐 인증하지 않습니다. 참여는 자발적이며 위험이 따릅니다.',
  '¿Cómo activo G-Pulse? ¿Necesito membresía?': 'G-Pulse는 어떻게 활성화하나요? 멤버십이 필요한가요?',
  'G-Pulse funciona por membresía: entras con tu cuenta de Genesis (el mismo acceso del ecosistema) y activas un plan desde el panel de G-Pulse. La activación se paga en modo dual —mitad en USDT y mitad en AiG Token, en una sola operación desde tu wallet—. Mientras la membresía esté vigente tienes acceso al plan que elegiste; cuando vence, el acceso se corta hasta que la reactivas.':
    'G-Pulse는 멤버십으로 운영됩니다. Genesis 계정(생태계와 같은 계정)으로 들어가 G-Pulse 패널에서 플랜을 활성화합니다. 활성화 결제는 듀얼 방식입니다 — 절반은 USDT로, 절반은 AiG Token으로, 지갑에서 한 번에 처리합니다. 멤버십이 유효한 동안 선택한 플랜을 이용할 수 있고, 만료되면 다시 활성화할 때까지 접근이 끊깁니다.',
  '¿Cuáles son las membresías de G-Pulse y qué cuestan?': 'G-Pulse의 멤버십에는 어떤 것이 있고 얼마인가요?',
  'Hay cinco planes, según el panel de activación: WEEKLY (1 semana, 7 días, 50 USD) · BASIC (1 mes, 30 días, 100 USD) · PRO (6 meses, 180 días, 500 USD, el más popular) · EXPERT (9 meses, 270 días, 750 USD) · ELITE (12 meses, 365 días, 1000 USD). El precio es un valor en dólares que se cubre en modo dual: mitad en USDT y mitad en AiG Token. Cada plan suma capacidades: WEEKLY y BASIC dan las señales y el bot; PRO desbloquea el Oracle Runtime (motor predictivo) y funciones avanzadas; EXPERT y ELITE añaden prioridad, más herramientas y soporte VIP.':
    '활성화 패널 기준으로 다섯 개 플랜이 있습니다. WEEKLY(1주, 7일, 50 USD) · BASIC(1개월, 30일, 100 USD) · PRO(6개월, 180일, 500 USD, 가장 인기) · EXPERT(9개월, 270일, 750 USD) · ELITE(12개월, 365일, 1000 USD). 가격은 달러로 표시된 값이며 듀얼 방식으로 지불합니다. 절반은 USDT, 절반은 AiG Token입니다. 플랜이 올라갈수록 기능이 더해집니다. WEEKLY와 BASIC은 신호와 봇을 제공하고, PRO는 Oracle Runtime(예측 엔진)과 고급 기능을 엽니다. EXPERT와 ELITE는 우선권과 더 많은 도구, VIP 지원을 더합니다.',
  '¿G-Pulse tiene referidos o plan de compensación?': 'G-Pulse에 추천 제도나 보상 플랜이 있나요?',
  'Por ahora no. G-Pulse todavía NO ofrece un plan de compensación: dentro de G-Pulse no hay comisiones por invitar ni por armar una red de niveles. Ese tipo de plan (con sus aceleradores directo y de red) pertenece al ecosistema Genesis y a sus packs de minería, que es otra cosa distinta de la membresía de G-Pulse. Si en el futuro G-Pulse suma algún esquema, se comunicará por los canales oficiales.':
    '지금은 없습니다. G-Pulse에는 아직 보상 플랜이 없습니다. G-Pulse 안에서는 초대나 단계형 네트워크 구성에 대한 수수료가 없습니다. 그런 형태의 플랜(다이렉트와 네트워크 가속기가 있는)은 Genesis 생태계와 그 마이닝 패키지에 속하며, G-Pulse 멤버십과는 별개입니다. 앞으로 G-Pulse에 어떤 제도가 더해진다면 공식 채널로 알립니다.',
  '¿Qué pasa cuando vence mi membresía de G-Pulse?': 'G-Pulse 멤버십이 만료되면 어떻게 되나요?',
  'La membresía tiene una fecha de vencimiento igual a los días del plan que activaste (por ejemplo, PRO son 180 días desde la activación). Al pasar esa fecha, el acceso al plan se corta automáticamente y el panel te ofrece reactivar. Pagar de nuevo mientras aún tienes una membresía activa no suma días encima: la reactivación cuenta cuando el plan ya venció. Puedes ver cuándo vence en tu propio panel de G-Pulse.':
    '멤버십의 만료일은 활성화한 플랜의 일수와 같습니다(예를 들어 PRO는 활성화일로부터 180일). 그 날짜가 지나면 플랜 접근이 자동으로 끊기고 패널이 재활성화를 안내합니다. 멤버십이 아직 유효한 상태에서 다시 결제해도 날짜가 더해지지는 않습니다. 재활성화는 플랜이 만료된 뒤에 적용됩니다. 만료일은 본인의 G-Pulse 패널에서 확인할 수 있습니다.',
  'Me falta AIG para llegar al hold. ¿De dónde lo saco?': '홀드를 채울 AIG가 모자랍니다. 어디서 구하나요?',
  'Se consigue en la comunidad, fuera de la herramienta. Genesis es una comunidad global: allá donde preguntes hay participantes con AIG, y ese intercambio se acuerda entre personas. Lo que la plataforma no hace es venderte el AIG que te falta.':
    '도구 밖, 커뮤니티에서 구합니다. Genesis는 글로벌 커뮤니티입니다. 어디에서 물어보든 AIG를 가진 참여자가 있고, 그 교환은 사람들 사이에서 합의합니다. 플랫폼이 하지 않는 일은 모자란 AIG를 당신에게 파는 것입니다.',
  'Mi minado no avanza': '채굴이 진행되지 않습니다',
  'Lo primero que hay que mirar es el hold: si la cuenta está por debajo del mínimo, los beneficios quedan congelados y el contador se detiene. Comprueba el estado en tu panel antes de reportarlo como avería. Si el hold está cubierto y aun así no avanza, es un caso para el equipo.':
    '가장 먼저 볼 것은 홀드입니다. 계정이 최소치 아래면 혜택이 동결되고 카운터가 멈춥니다. 고장으로 신고하기 전에 패널에서 상태를 확인하세요. 홀드가 채워져 있는데도 진행되지 않는다면 그때는 팀이 볼 사안입니다.',
  'Pagué y no veo el pedido': '결제했는데 주문이 보이지 않습니다',
  'No pagues otra vez. Entra en «Mis pedidos»: si el pedido quedó creado sin cobrar, puedes retomar el pago desde ahí, y el sistema no genera un segundo cargo. Si al fallar viste el aviso de que no se cobró nada, es literal: el cobro no llegó a producirse.':
    '다시 결제하지 마세요. «내 주문»에 들어가 보세요. 주문이 결제 없이 생성된 상태라면 거기서 결제를 이어서 할 수 있고, 시스템이 두 번 청구하지 않습니다. 실패했을 때 아무것도 청구되지 않았다는 안내를 보았다면 그것은 문자 그대로입니다. 청구는 일어나지 않았습니다.',
  'Mi pedido quedó a medias sin pagar': '주문이 결제되지 않은 채로 남았습니다',
  'Se puede retomar. El pedido queda creado y esperando el cobro, y desde «Mis pedidos» vuelves al mismo pago para confirmarlo. No se crea un pedido nuevo ni un cargo nuevo.':
    '이어서 진행할 수 있습니다. 주문은 생성된 채 결제를 기다리고 있으며, «내 주문»에서 같은 결제로 돌아가 확정합니다. 새 주문도, 새 청구도 생기지 않습니다.',
  '¿Quién me responde si hay un problema con el producto?': '상품에 문제가 있으면 누가 응대하나요?',
  'Gevy. Compras a Gevy y reclamas a Gevy, con tu número de pedido. No tienes que averiguar quién fabrica o quién surte: eso es asunto nuestro, no tuyo.':
    'Gevy입니다. Gevy에서 사고 Gevy에 주문 번호로 문의합니다. 누가 만들고 누가 공급하는지 알아낼 필요는 없습니다. 그것은 저희 일이지 고객의 일이 아닙니다.',
  '¿Qué es Gevy?': 'Gevy는 무엇인가요?',
  'Es la tienda de Genesis: un catálogo global con envío internacional donde compras productos reales y te llegan a casa, pagando desde tu wallet con AIG y USDT.':
    'Genesis의 상점입니다. 국제 배송이 되는 글로벌 카탈로그에서 실제 상품을 사고 집으로 받으며, 지갑에서 AIG와 USDT로 결제합니다.',
  '¿Tengo que registrarme en Gevy?': 'Gevy에 따로 가입해야 하나요?',
  'No. Es la misma cuenta de Genesis: si ya entras al ecosistema, ya estás dentro de la tienda. No hay un alta aparte ni una contraseña distinta.':
    '아닙니다. Genesis와 같은 계정입니다. 이미 생태계에 들어와 있다면 상점에도 들어와 있는 것입니다. 별도의 가입도, 다른 비밀번호도 없습니다.',
  '¿Qué pasó con AIGMarket?': 'AIGMarket은 어떻게 되었나요?',
  'Gevy lo sucede: es el marketplace único del ecosistema. AIGMarket pasa a ser una herramienta dentro de Gevy, en desarrollo futuro. Para comprar hoy no hay que elegir entre dos sitios — el sitio es Gevy.':
    'Gevy가 그 자리를 잇습니다. 생태계의 단일 마켓플레이스입니다. AIGMarket은 앞으로 Gevy 안의 한 기능이 됩니다. 오늘 구매하려고 두 사이트 중에 고를 필요는 없습니다. 사이트는 Gevy입니다.',
  '¿Una señal me está diciendo que compre o que venda?': '신호는 사라거나 팔라고 알려 주는 건가요?',
  'No. Una señal describe una condición que se ha cumplido en el mercado — nada más. No es una recomendación, no conoce tu situación y no te dice qué hacer. La decisión y el riesgo son de quien opera, siempre.':
    '아닙니다. 신호는 시장에서 어떤 조건이 충족되었음을 설명할 뿐입니다. 권유가 아니며, 당신의 상황을 알지 못하고, 무엇을 하라고 말하지 않습니다. 판단과 위험은 언제나 거래하는 사람의 몫입니다.',
  '¿G-Pulse predice lo que va a pasar?': 'G-Pulse가 앞일을 예측하나요?',
  'No. Procesa lo que ya ocurrió y lo que está ocurriendo. Cualquier lectura de la herramienta como anticipación del futuro es un malentendido: ningún sistema puede sostener eso, y G-Pulse tampoco lo intenta.':
    '아닙니다. 이미 일어난 일과 지금 일어나고 있는 일을 처리합니다. 이 도구를 미래를 앞서 보는 것으로 읽는 것은 오해입니다. 어떤 시스템도 그것을 감당할 수 없고, G-Pulse도 시도하지 않습니다.',
  '¿Qué porcentaje de aciertos tienen las señales?': '신호의 적중률은 몇 퍼센트인가요?',
  'No se publica un porcentaje de aciertos, y no es una omisión: una cifra así convertiría la herramienta en algo con resultado esperado, que es justo lo que no es. Si algún día se publican métricas, irán con su método y su periodo, o no irán.':
    '적중률은 공개하지 않으며, 빠뜨린 것이 아닙니다. 그런 수치는 이 도구를 기대 수익이 있는 무언가로 바꾸어 버리는데, 그것이야말로 이 도구가 아닌 바입니다. 언젠가 지표를 공개한다면 산출 방법과 기간을 함께 밝히거나, 아예 공개하지 않을 것입니다.',
  '¿G-Pulse opera por mí?': 'G-Pulse가 대신 거래해 주나요?',
  'No. Informa. Quien decide y ejecuta es la persona, con su propio criterio.':
    '아닙니다. 알려 줍니다. 판단하고 실행하는 것은 자신의 기준을 가진 사람입니다.',
  '¿Cómo sé en qué punto está mi pedido?': '제 주문이 어디까지 왔는지 어떻게 아나요?',
  'El pedido va contando su estado solo, y recibes aviso en los momentos que importan: pagado, enviado, en tránsito y entregado. No hace falta preguntar para saber dónde está.':
    '주문은 스스로 상태를 갱신하며, 중요한 순간마다 알림이 옵니다. 결제됨, 발송됨, 배송 중, 배달 완료. 어디에 있는지 알기 위해 물어볼 필요가 없습니다.',
  'Mi pedido lleva días en el mismo estado': '주문이 며칠째 같은 상태입니다',
  'En envío internacional es normal que el estado se quede quieto un tiempo, sobre todo entre que sale del almacén y entra en la red del país de destino. Si pasa de ahí sin moverse, escribe con tu número de pedido y se revisa.':
    '국제 배송에서는 상태가 한동안 멈춰 있는 것이 정상이며, 특히 창고를 떠난 뒤 도착 국가의 배송망에 들어가기까지 그렇습니다. 그 이상 움직이지 않으면 주문 번호와 함께 문의해 주세요. 확인해 드립니다.',
  '¿Enviáis a mi país?': '제 나라로 배송되나요?',
  'El catálogo sólo ofrece en cada país lo que se puede entregar allí: si un producto te aparece disponible, es porque hay envío a tu destino. Si no aparece, no es un fallo de la búsqueda — es que ese artículo no llega ahí.':
    '카탈로그는 각 나라에서 배달할 수 있는 것만 보여 줍니다. 어떤 상품이 구매 가능하게 보인다면 그곳으로 배송된다는 뜻입니다. 보이지 않는다면 검색의 오류가 아니라, 그 상품이 그곳까지 가지 않는다는 뜻입니다.',
  '¿Cuándo sale la próxima actualización o novedad?': '다음 업데이트나 소식은 언제 나오나요?',
  'Las fechas y novedades se anuncian únicamente por los canales oficiales del ecosistema. Si viste una fecha en otro lado, trátala con cautela: nadie fuera del equipo puede confirmarla. Cuando algo esté disponible, lo verás anunciado — y aquí se responde sobre lo que ya existe, no sobre promesas.':
    '일정과 소식은 오직 생태계의 공식 채널로만 알립니다. 다른 곳에서 날짜를 보았다면 신중하게 받아들이세요. 팀 밖의 누구도 그것을 확인해 줄 수 없습니다. 무언가 준비되면 공지로 보게 됩니다. 그리고 여기서는 이미 있는 것에 대해 답하지, 약속에 대해 답하지 않습니다.',
  '¿Cómo funciona un cambio de contrato?': '컨트랙트 변경은 어떻게 진행되나요?',
  'Cuando hay migración se anuncia por los canales oficiales, con los pasos y la dirección exacta a la que enviar. Envías tus monedas del contrato anterior y recibes las nuevas EN LA MISMA WALLET DESDE LA QUE ENVIASTE: no se entregan en otra dirección, así que la wallet que usas para enviar tiene que ser una a la que conserves el acceso.':
    '마이그레이션이 있을 때는 공식 채널로 절차와 정확한 전송 주소를 알립니다. 이전 컨트랙트의 코인을 보내면 «보낸 바로 그 지갑»으로 새 코인을 받습니다. 다른 주소로는 지급되지 않으므로, 보낼 때 쓰는 지갑은 계속 접근할 수 있는 지갑이어야 합니다.',
  '¿Todas las monedas entran en una migración?': '모든 코인이 마이그레이션 대상인가요?',
  'Entran las monedas legítimas, las que salieron de minar en el ecosistema. No entran las adquiridas en exchanges externos en vísperas de un cambio de contrato: la migración existe para acompañar a quien participa, no para que se acumule por fuera justo antes del canje.':
    '생태계에서 채굴로 나온 정당한 코인이 대상입니다. 컨트랙트 변경 직전에 외부 거래소에서 사들인 것은 대상이 아닙니다. 마이그레이션은 참여하는 사람과 함께 가기 위한 것이지, 교환 직전에 바깥에서 쌓아 두라고 있는 것이 아닙니다.',
  'Envié al contrato antiguo y no recibí nada': '옛 컨트랙트로 보냈는데 아무것도 받지 못했습니다',
  'Es un caso para el equipo y no se resuelve siguiendo instrucciones sueltas: las direcciones cambiaron varias veces y enviar a una dirección vieja no tiene vuelta atrás. Escribe con tu usuario, tu correo, la wallet desde la que enviaste y el hash de la transacción — sin el hash no se puede reconstruir lo que pasó. Y no repitas el envío mientras esperas respuesta.':
    '팀이 봐야 할 사안이며 단편적인 안내로는 해결되지 않습니다. 주소는 여러 번 바뀌었고 옛 주소로 보낸 것은 되돌릴 수 없습니다. 아이디와 이메일, 보낸 지갑, 그리고 트랜잭션 해시와 함께 문의해 주세요. 해시가 없으면 무슨 일이 있었는지 복원할 수 없습니다. 그리고 답을 기다리는 동안 다시 보내지 마세요.',
  'La página no carga — ¿el sistema está en mantenimiento?': '페이지가 열리지 않습니다 — 시스템 점검 중인가요?',
  'Primero descarta lo local: recarga con Ctrl+Mayús+R, prueba en una ventana de incógnito (eso descarta caché y cookies) y, si puedes, desde otra red o con datos móviles. Si desde varios lugares sigue sin cargar, probablemente sea del lado del sistema: los mantenimientos y las caídas se comunican por los canales oficiales, así que revisa ahí antes de rehacer operaciones. Y si estabas en medio de una operación de dinero, no la repitas — verifica primero en qué quedó.':
    '먼저 내 쪽 문제를 걸러 내세요. Ctrl+Shift+R로 새로 고치고, 시크릿 창에서 열어 보고(캐시와 쿠키를 걸러 냅니다), 가능하면 다른 네트워크나 모바일 데이터로 시도해 보세요. 여러 곳에서 계속 열리지 않는다면 시스템 쪽 문제일 가능성이 큽니다. 점검과 장애는 공식 채널로 알리니, 작업을 다시 하기 전에 그곳부터 확인하세요. 그리고 돈이 오가는 작업 중이었다면 반복하지 말고, 어디까지 진행됐는지부터 확인하세요.',
  '¿Qué es G-Pulse?': 'G-Pulse는 무엇인가요?',
  'Es la herramienta de análisis del ecosistema: procesa datos de mercados globales de forma continua y publica señales automatizadas y alertas, para que veas lo que está ocurriendo sin tener que mirar veinte pantallas.':
    '생태계의 분석 도구입니다. 글로벌 시장의 데이터를 끊임없이 처리해 자동화된 신호와 알림을 내보내므로, 스무 개의 화면을 들여다보지 않고도 지금 무슨 일이 일어나는지 볼 수 있습니다.',
  '¿En qué se diferencia de G-Oracle?': 'G-Oracle과는 무엇이 다른가요?',
  'G-Pulse es el pulso y G-Oracle es el criterio. G-Pulse entrega señales y alertas: qué está pasando ahora. G-Oracle interpreta, conecta y gobierna el flujo de información entre productos del protocolo: qué significa y cómo se orquesta.':
    'G-Pulse는 맥박이고 G-Oracle은 판단입니다. G-Pulse는 신호와 알림을 내보냅니다. 지금 무슨 일이 일어나고 있는가. G-Oracle은 프로토콜 제품들 사이의 정보 흐름을 해석하고 연결하며 다스립니다. 그것이 무엇을 뜻하고 어떻게 조율되는가.',
  '¿Cómo entro a G-Pulse?': 'G-Pulse에는 어떻게 들어가나요?',
  'Con tu cuenta de Genesis, desde conect.aigenesis.io. No hay registro aparte: es el mismo acceso que para el resto del ecosistema.':
    'Genesis 계정으로 conect.aigenesis.io에서 들어갑니다. 별도의 가입은 없습니다. 생태계의 나머지와 같은 접속입니다.',
  'Todavía no está documentado paso a paso. El panel está detrás del acceso y esta guía no describe pantallas que no se han recorrido — antes que darte una ruta inventada, se te pasa con alguien que lo tenga delante.':
    '아직 단계별로 문서화되어 있지 않습니다. 패널은 로그인 뒤에 있고, 이 안내서는 직접 확인하지 않은 화면을 설명하지 않습니다. 지어낸 경로를 알려 드리기보다, 그 화면을 앞에 두고 있는 사람에게 연결해 드립니다.',
  '¿Cómo funcionan el referido directo y el binario?': '다이렉트 추천과 바이너리는 어떻게 작동하나요?',
  'Son dos aceleradores de tu minería. Referido directo (AiG Start): por cada compra de minería de un invitado tuyo, tu minería acelera un 11% al instante, y vuelve a acelerar cada vez que recompra. Binario (AiG Binary): consigues un invitado en tu lado izquierdo y otro en el derecho, y el sistema acelera un 11% calculado sobre el volumen del lado con menor actividad — por eso conviene equilibrar ambos lados. No hay límite geográfico: tu comunidad puede estar en cualquier país.':
    '둘 다 채굴을 가속하는 장치입니다. 다이렉트 추천(AiG Start): 초대한 사람이 마이닝을 구매할 때마다 채굴이 즉시 11 % 빨라지고, 그 사람이 재구매할 때마다 다시 가속됩니다. 바이너리(AiG Binary): 왼쪽에 한 명, 오른쪽에 한 명을 두면 시스템이 활동이 적은 쪽의 물량을 기준으로 11 %를 가속합니다. 그래서 양쪽의 균형을 맞추는 편이 좋습니다. 지역 제한은 없습니다. 커뮤니티는 어느 나라에 있어도 됩니다.',
  '¿Qué son los rangos (del Start al G11)?': '등급(Start에서 G11까지)이란 무엇인가요?',
  'Son niveles que alcanzas acumulando puntos en tu red, y cada uno da un premio en USDT más un NFT. Van desde G1 Bronze (1.000 puntos, 50 USDT) subiendo por Silver, Gold, Zappire, Ruby, Emerald, Diamond, Blue Diamond, Black Diamond, Red Diamond, hasta G11 (5.000.000 de puntos, 500.000 USDT). Los premios de rango se comunican y entregan por los canales oficiales del ecosistema.':
    '네트워크에서 포인트를 쌓아 도달하는 단계이며, 각 단계마다 USDT 상금과 NFT가 주어집니다. G1 Bronze(1,000포인트, 50 USDT)에서 시작해 Silver, Gold, Zappire, Ruby, Emerald, Diamond, Blue Diamond, Black Diamond, Red Diamond를 거쳐 G11(500만 포인트, 500,000 USDT)까지 올라갑니다. 등급 상금은 생태계의 공식 채널을 통해 안내되고 지급됩니다.',
  '¿Qué es G-Oracle?': 'G-Oracle은 무엇인가요?',
  'G-Oracle es el espacio donde los usuarios consumen, ofrecen y generan ingresos dentro de la red: descubres negocios y servicios cerca de ti, accedes a comercios del ecosistema en segundos, y puedes ofrecer tus propios productos o servicios a la comunidad G11. Es la parte de comercios y servicios del ecosistema.':
    'G-Oracle은 네트워크 안에서 사용자가 소비하고, 제공하고, 수익을 만드는 공간입니다. 가까운 곳의 사업과 서비스를 발견하고, 생태계의 가맹점에 몇 초 만에 접근하며, 자신의 상품이나 서비스를 G11 커뮤니티에 제공할 수 있습니다. 생태계의 상업과 서비스 영역입니다.',
  '¿Va a haber tarjeta Visa/Mastercard o academia?': '비자/마스터카드 카드나 아카데미가 생기나요?',
  'El material oficial menciona en su roadmap tecnológico la integración con sistemas de pago Visa / Mastercard para uso cotidiano del AiG Token, y una plataforma educativa (academia) con servicios impulsados por IA, junto a la consolidación de la comunidad en tres continentes. Son planes del roadmap: las fechas y la disponibilidad se anuncian únicamente por los canales oficiales — trata con cautela cualquier fecha que veas por fuera.':
    '공식 자료의 기술 로드맵에는 AiG Token을 일상에서 쓰기 위한 Visa / Mastercard 결제 시스템 연동과, AI 기반 서비스를 갖춘 교육 플랫폼(아카데미), 그리고 3개 대륙에서의 커뮤니티 공고화가 언급되어 있습니다. 이는 로드맵의 계획입니다. 일정과 제공 여부는 오직 공식 채널로만 알리니, 바깥에서 본 날짜는 신중하게 받아들이세요.',
  'El total minado que muestra mi cuenta no me cuadra': '계정에 표시된 누적 채굴량이 맞지 않습니다',
  'Es un caso para el equipo y conviene reportarlo bien, porque esa cifra es la base sobre la que se calcula tu hold: si el total minado está mal, el mínimo que te piden también. Manda tu usuario, tu correo, la cantidad que muestra la plataforma, la que tú calculas y el hash de las transacciones que la sostienen. Sin los hashes no se puede reconstruir.':
    '팀이 봐야 할 사안이며 제대로 신고하는 것이 좋습니다. 그 수치가 홀드를 계산하는 기준이기 때문입니다. 누적 채굴량이 틀리면 요구되는 최소치도 틀립니다. 아이디와 이메일, 플랫폼에 표시된 수량, 본인이 계산한 수량, 그리고 그것을 뒷받침하는 트랜잭션 해시를 보내 주세요. 해시가 없으면 복원할 수 없습니다.',
  'No. La wallet de una cuenta no se cambia: es la dirección donde se liquida lo que le corresponde, y reasignarla a petición convertiría un mensaje en una orden de pago a otra dirección. Si perdiste el acceso a tu wallet, es un caso para el equipo, y no existe ningún trámite que reasigne la cuenta a otra dirección porque se pida.':
    '아닙니다. 계정의 지갑은 바꾸지 않습니다. 그 계정에 돌아갈 몫이 정산되는 주소이며, 요청만으로 재지정한다면 메시지 한 통이 다른 주소로의 지급 지시가 되어 버립니다. 지갑 접근을 잃었다면 팀이 봐야 할 사안이며, 요청했다는 이유로 계정을 다른 주소에 재지정하는 절차는 존재하지 않습니다.',
  '¿Cómo es la compra de principio a fin, paso a paso?': '구매는 처음부터 끝까지 어떻게 진행되나요? 단계별 안내',
  'De punta a punta: 1) Entras a la tienda con tu cuenta de Genesis y conectas tu wallet en la red BSC. 2) Buscas o navegas el catálogo y abres la ficha del producto. 3) Lo agregas al carrito (puedes seguir sumando artículos). 4) En la caja pones la dirección de envío —queda guardada— y eliges la forma de pago: DUAL (AIG + USDT) o USDT solo. 5) Revisas el total, que ya incluye el envío, y confirmas firmando desde tu wallet. 6) Ves la confirmación del pedido, y a partir de ahí lo sigues desde «Mis pedidos» con avisos en pagado, enviado, en tránsito y entregado. Si algo no cuadra en el total antes de firmar, no confirmes.':
    '처음부터 끝까지입니다. 1) Genesis 계정으로 상점에 들어가 BSC 네트워크에서 지갑을 연결합니다. 2) 검색하거나 카탈로그를 둘러보고 상품 페이지를 엽니다. 3) 장바구니에 담습니다(계속 더 담아도 됩니다). 4) 결제 화면에서 배송 주소를 입력하고 — 저장됩니다 — 결제 수단을 고릅니다. 듀얼(AIG + USDT) 또는 USDT 단독. 5) 배송비가 이미 포함된 총액을 확인하고 지갑에서 서명해 확정합니다. 6) 주문 확인을 본 뒤에는 «내 주문»에서 결제됨, 발송됨, 배송 중, 배달 완료 알림과 함께 추적합니다. 서명하기 전에 총액이 맞지 않으면 확정하지 마세요.',
  '¿Qué herramientas o portales tengo como comprador?': '구매자로서 어떤 도구나 포털을 쓸 수 있나요?',
  'Todo con tu misma cuenta de Genesis: el buscador y el catálogo por categorías para descubrir productos; la ficha de cada producto con su detalle; el carrito para juntar lo que vas a llevar; la lista de deseos para guardar lo que te interesa; y «Mis pedidos», donde ves cada compra, retomas un pago que quedó a medias y sigues el estado del envío paso a paso. No hay portales aparte ni contraseñas distintas: es la misma sesión del ecosistema.':
    '모두 같은 Genesis 계정으로 씁니다. 상품을 찾는 검색과 카테고리별 카탈로그, 상세 내용이 담긴 상품 페이지, 살 것을 모아 두는 장바구니, 관심 있는 것을 저장하는 위시리스트, 그리고 각 구매를 보고 중단된 결제를 이어서 하고 배송 상태를 단계별로 따라가는 «내 주문»입니다. 별도의 포털도, 다른 비밀번호도 없습니다. 생태계와 같은 세션입니다.',
  '¿Puedo facturar mi compra con datos fiscales?': '구매에 대해 세금 증빙을 받을 수 있나요?',
  'La facturación con datos fiscales todavía no está documentada aquí, y preferimos decírtelo a improvisarte un procedimiento. Escríbenos por el canal oficial con tu usuario y el número de pedido, y el equipo te confirma qué comprobantes puede emitir para tu caso y tu país.':
    '세금 정보를 담은 증빙 발행은 아직 여기에 문서화되어 있지 않으며, 절차를 즉석에서 지어내기보다 그렇게 말씀드리는 편을 택합니다. 공식 채널로 아이디와 주문 번호를 보내 주시면, 팀이 해당 사례와 국가에 어떤 증빙을 발행할 수 있는지 확인해 드립니다.',
  '¿Cómo configuro mis alertas?': '알림은 어떻게 설정하나요?',
  'La minería genera AiG Token a diario. Pasos: 1) Entra a tu cuenta y ve a AiG Mining. 2) Elige un pack (desde 20 USDT). 3) Confirma la compra desde tu wallet (necesitas BNB para el gas). 4) A partir de ahí recibes emisión mensual —desde 8%— acreditada diariamente en AiG Token, hasta completar el 250% del pack. Ejemplo del material: minas con 100 USDT y el pack finaliza al llegar a 250 en AiG Token. Cuando termina, puedes retirar tus AiG o recomprar en más packs para acelerar. El 8% es una tasa de emisión del protocolo, no un resultado asegurado en dólares.':
    '채굴은 매일 AiG Token을 생성합니다. 순서는 이렇습니다. 1) 계정에 들어가 AiG Mining으로 갑니다. 2) 팩을 고릅니다(20 USDT부터). 3) 지갑에서 구매를 확정합니다(가스비용 BNB가 필요합니다). 4) 그때부터 월 발행 — 8 %부터 — 이 AiG Token으로 매일 적립되며, 팩의 250 %에 도달할 때까지 이어집니다. 자료의 예: 100 USDT로 채굴을 시작하면 AiG Token으로 250에 도달할 때 팩이 종료됩니다. 끝나면 AiG를 인출하거나 더 많은 팩을 재구매해 가속할 수 있습니다. 8 %는 프로토콜의 발행률이지 달러로 보장된 결과가 아닙니다.',
  '¿Cómo activo el Booster? Paso a paso': 'Booster는 어떻게 활성화하나요? 단계별 안내',
  'El Booster acelera tu crecimiento con una emisión mayor. Pasos: 1) En tu cuenta ve a AiG Booster. 2) Se activa con una mezcla: 80% en USDT + 20% en AiG Token. 3) Confirma desde tu wallet (con BNB para el gas). 4) Las recompensas se acumulan a diario en AiG Token —hasta 14% mensual— hasta completar el 200% del pack, y se convierten a USDT para retiro por el P2P. Ejemplo del material: activas 100 y recibes hasta 200 en AiG Token. Si pagaste y no se refleja, no repitas la compra: guarda el hash y aplica el paso a paso del reclamo.':
    'Booster는 더 높은 발행률로 성장을 가속합니다. 순서는 이렇습니다. 1) 계정에서 AiG Booster로 갑니다. 2) 혼합 방식으로 활성화합니다. USDT 80 % + AiG Token 20 %. 3) 지갑에서 확정합니다(가스비용 BNB 필요). 4) 보상은 AiG Token으로 매일 쌓이며 — 월 최대 14 % — 팩의 200 %에 도달할 때까지 이어지고, P2P로 인출하기 위해 USDT로 전환됩니다. 자료의 예: 100을 활성화하면 AiG Token으로 최대 200을 받습니다. 결제했는데 반영되지 않으면 구매를 반복하지 마세요. 해시를 보관하고 청구 단계별 안내를 따르세요.',
  '¿Cómo hago staking de mis AiG? Paso a paso': 'AiG는 어떻게 스테이킹하나요? 단계별 안내',
  'El staking bloquea tus AiG Token por un período y genera beneficios en AiG mientras haces holding. Pasos: 1) En tu cuenta ve a Staking. 2) Elige el período: cuanto más largo, mayor la tasa mensual — 1 mes 6%, 3 meses 8%, 6 meses 10%, 9 meses 12%, 12 meses 15%. 3) Confirma el bloqueo desde tu wallet. 4) Recibes los beneficios generados en AiG Token durante el período. Es la estrategia para quien acumula a largo plazo. Las tasas son de emisión del protocolo, no un resultado asegurado en dólares.':
    '스테이킹은 AiG Token을 일정 기간 잠가 두고, 보유하는 동안 AiG로 수익을 만듭니다. 순서는 이렇습니다. 1) 계정에서 Staking으로 갑니다. 2) 기간을 고릅니다. 길수록 월 이율이 높습니다 — 1개월 6 %, 3개월 8 %, 6개월 10 %, 9개월 12 %, 12개월 15 %. 3) 지갑에서 잠금을 확정합니다. 4) 기간 동안 생성된 수익을 AiG Token으로 받습니다. 장기간 쌓아 가는 사람을 위한 방식입니다. 이율은 프로토콜의 발행률이지 달러로 보장된 결과가 아닙니다.',
  '¿Cómo reclamo mis recompensas? Paso a paso': '보상은 어떻게 청구하나요? 단계별 안내',
  'Las recompensas de minería y booster se acumulan a diario en AiG Token; reclamar las lleva a tu balance disponible. Pasos: 1) En tu cuenta, en la sección de recompensas, pulsa Reclamar. 2) Para pasar de USDT a AiG puedes reclamar desde 10 USDT acumulados en adelante. 3) Confirma. 4) El reclamo puede tardar de 1 minuto a hasta 72 horas en llegar a tu wallet, según los procesos de verificación y seguridad — si estás en ese plazo, está en curso; abrir otro reclamo no lo acelera. Guarda el detalle de la operación por si necesitas soporte.':
    '마이닝과 부스터의 보상은 AiG Token으로 매일 쌓이며, 청구하면 사용 가능 잔액으로 옮겨집니다. 순서는 이렇습니다. 1) 계정의 보상 영역에서 청구를 누릅니다. 2) USDT에서 AiG로 넘기려면 누적 10 USDT부터 청구할 수 있습니다. 3) 확정합니다. 4) 청구는 검증과 보안 절차에 따라 지갑에 도착하기까지 1분에서 최대 72시간이 걸릴 수 있습니다. 그 기간 안이라면 진행 중이며, 청구를 하나 더 여는 것으로 빨라지지 않습니다. 지원이 필요할 때를 대비해 작업 내역을 보관하세요.',
  '¿Con qué monedas pago la membresía de G-Pulse?': 'G-Pulse 멤버십은 어떤 통화로 결제하나요?',
  'El pago de la membresía es DUAL 50/50: se cubre mitad en USDT y mitad en AiG Token, y ambas partes viajan juntas en una sola transacción desde tu wallet (necesitas saldo de USDT y de AiG en la red BSC, más BNB para el gas). No es solo-USDT ni solo-AiG: el modo de activación de G-Pulse es el dual. Si la transacción no se refleja, no la repitas: guarda el hash y repórtalo.':
    '멤버십 결제는 듀얼 50/50입니다. 절반은 USDT로, 절반은 AiG Token으로 지불하며, 두 부분이 지갑에서 하나의 트랜잭션으로 함께 나갑니다(BSC 네트워크에 USDT와 AiG 잔액, 그리고 가스비용 BNB가 필요합니다). USDT 단독도, AiG 단독도 아닙니다. G-Pulse의 활성화 방식은 듀얼입니다. 트랜잭션이 반영되지 않으면 반복하지 말고 해시를 보관해 알려 주세요.',
  '¿Qué modos tiene G-Pulse: manual y automático?': 'G-Pulse에는 어떤 모드가 있나요? 수동과 자동인가요?',
  'G-Pulse tiene dos modos de trabajo. El modo MANUAL: la herramienta te muestra las señales y las decisiones las tomas y ejecutas tú, a tu criterio. El modo AUTOMÁTICO (auto IA): un bot ejecuta la estrategia que tú configuras, sin que tengas que estar delante. Ambos parten de la misma base: G-Pulse informa y ejecuta lo que tú defines; no es asesoramiento financiero, no adivina el futuro y el resultado y el riesgo son tuyos. El bot automático básico entra desde BASIC; el avanzado y el Oracle Runtime, desde PRO en adelante.':
    'G-Pulse에는 두 가지 작업 모드가 있습니다. 수동 모드: 도구가 신호를 보여 주고, 판단과 실행은 본인의 기준으로 직접 합니다. 자동 모드(auto IA): 본인이 설정한 전략을 봇이 실행하므로 화면 앞에 있지 않아도 됩니다. 두 모드의 전제는 같습니다. G-Pulse는 알려 주고 당신이 정한 것을 실행할 뿐, 금융 자문이 아니며 미래를 알아맞히지 않고 결과와 위험은 본인의 몫입니다. 기본 자동 봇은 BASIC부터, 고급 봇과 Oracle Runtime은 PRO부터 이용할 수 있습니다.',
  '¿Cómo configuro una jugada y cómo la detengo?': '설정은 어떻게 하고 어떻게 중지하나요?',
  'El recorrido exacto (configurar los parámetros, iniciar y detener) está dentro del panel, detrás del acceso, y esta guía no describe pantallas que no se han recorrido: antes que darte una ruta inventada, se te pasa con alguien que lo tenga delante. Lo que sí es firme: necesitas la membresía vigente, el modo automático ejecuta la estrategia que TÚ configuras y puedes detenerlo desde el mismo panel. Tú decides los parámetros y asumes el resultado; G-Pulse no garantiza ninguna ganancia.':
    '정확한 경로(매개변수 설정, 시작과 중지)는 로그인 뒤의 패널 안에 있고, 이 안내서는 직접 확인하지 않은 화면을 설명하지 않습니다. 지어낸 경로를 알려 드리기보다, 그 화면을 앞에 두고 있는 사람에게 연결해 드립니다. 확실한 것은 이렇습니다. 유효한 멤버십이 필요하고, 자동 모드는 «당신이» 설정한 전략을 실행하며, 같은 패널에서 중지할 수 있습니다. 매개변수는 본인이 정하고 결과도 본인이 감당합니다. G-Pulse는 어떤 수익도 보장하지 않습니다.',
  'Tres fuerzas. Un ecosistema.': '세 개의 힘. 하나의 생태계.',
  'Esta edición es un documento, no un video.': '이번 판은 영상이 아니라 문서입니다.',
  'Descárgalo abajo en el idioma que necesites.': '필요한 언어로 아래에서 내려받으세요.',
  'El navegador no pudo reproducirlo': '브라우저가 재생하지 못했습니다',
  'la web oficial': '공식 웹사이트',
  'el equipo': '팀',
  'el código del producto': '제품 코드',
  'el producto en vivo': '실제로 동작하는 제품',
  'pendiente de confirmar con el equipo': '팀 확인 대기 중',
  'Cómo vincular tu cuenta de TAG Markets desde Génesis': 'Genesis에서 TAG Markets 계정을 연결하는 방법',
  'Desde tu panel de AiGenesis: vincular la cuenta, verificar la identidad y activar el acceso.':
    'AiGenesis 패널에서 계정 연결, 신원 확인, 접근 활성화까지.',
  'El plan de negocio de la alianza': '얼라이언스의 사업 계획',
  'Aitech, Génesis y TAG presentados juntos: qué aporta cada uno y cómo encaja el AiG.':
    'Aitech와 Genesis, TAG를 함께 소개합니다. 각자가 무엇을 가져오고 AiG가 어디에 들어맞는지.',
  'Aitech One': 'Aitech One',
  'El plan de negocio': '사업 계획',
  'La presentación completa, para mostrársela a alguien.': '누군가에게 보여 주기 위한 전체 프레젠테이션.',
  'Edición 1': '1판',
  'Edición 2 · v5.0': '2판 · v5.0',
  '¿Cuál es el contrato oficial del AiG Token?': 'AiG Token의 공식 컨트랙트는 무엇인가요?',
  'El contrato oficial en BSC es 0xC1F0768587Dc889e494C171B155C60B4e9a13F08. Puedes verificarlo en BscScan: bscscan.com/token/0xC1F0768587Dc889e494C171B155C60B4e9a13F08. Desconfía de cualquier otra dirección — un contrato distinto NO es el AiG oficial, aunque se llame parecido y aunque tenga el mismo símbolo.':
    'BSC의 공식 컨트랙트는 0xC1F0768587Dc889e494C171B155C60B4e9a13F08입니다. BscScan에서 확인할 수 있습니다: bscscan.com/token/0xC1F0768587Dc889e494C171B155C60B4e9a13F08. 다른 주소는 의심하세요. 이름이 비슷하고 심볼이 같더라도 다른 컨트랙트는 공식 AiG가 아닙니다.',
  '¿Qué es Genesis y cuál es su visión?': 'Genesis는 무엇이고 어떤 비전을 갖고 있나요?',
  'Genesis es un ecosistema que une inteligencia artificial y blockchain para dar a su comunidad tecnología avanzada con transparencia y seguridad, apoyándose en contratos inteligentes públicos y en Web3 (donde tú controlas tus datos y decisiones). La IA es el cerebro que coordina los procesos; el blockchain aporta la transparencia. Alrededor del AiG Token, el ecosistema reúne varias piezas: minería (AiMining), staking, el plan de comunidad G11, la tienda, herramientas y proyectos anunciados en su hoja de ruta (academia, exchange, tarjeta, metaverso, NFTs). La idea de fondo: impulsar el desarrollo de la IA y el crecimiento de la comunidad con tecnología abierta y verificable.':
    'Genesis는 인공지능과 블록체인을 하나로 묶어, 공개된 스마트 컨트랙트와 Web3(데이터와 결정을 본인이 통제하는 방식)를 바탕으로 커뮤니티에 투명하고 안전한 첨단 기술을 제공하는 생태계입니다. AI는 과정을 조율하는 두뇌이고, 블록체인은 투명성을 담당합니다. AiG Token을 중심으로 생태계는 여러 조각을 모읍니다. 마이닝(AiMining), 스테이킹, 커뮤니티 플랜 G11, 상점, 도구, 그리고 로드맵에 발표된 프로젝트들(아카데미, 거래소, 카드, 메타버스, NFT). 바탕에 깔린 생각은 이렇습니다. 열려 있고 검증 가능한 기술로 AI의 발전과 커뮤니티의 성장을 밀어 올린다.',
  '¿Qué es el plan G11?': 'G11 플랜이란 무엇인가요?',
  'G11 es el plan de comunidad de Genesis: el marco por el que la actividad en la red se reconoce con recompensas, de forma transparente gracias a la IA y el blockchain. Se apoya en cuatro piezas que ya tienen su paso a paso propio: tu pack de AiMining (el motor que genera AiG Token a diario), el acelerador por referido directo (AiG Start) y por equipos izquierdo/derecho (AiG Binary), el staking para quien acumula a largo plazo, y los rangos, que premian los hitos de tu red. G11 no es un producto que se compre aparte: se activa al participar en el ecosistema con tu pack de minería.':
    'G11은 Genesis의 커뮤니티 플랜입니다. 네트워크에서의 활동이 보상으로 인정되는 틀이며, AI와 블록체인 덕분에 투명하게 이루어집니다. 각각 자체 단계별 안내가 있는 네 조각으로 이루어져 있습니다. AiMining 팩(매일 AiG Token을 생성하는 엔진), 다이렉트 추천 가속기(AiG Start)와 좌우 팀 가속기(AiG Binary), 장기간 쌓아 가는 사람을 위한 스테이킹, 그리고 네트워크의 이정표에 상을 주는 등급입니다. G11은 따로 사는 상품이 아닙니다. 마이닝 팩으로 생태계에 참여하면 활성화됩니다.',
  'Dos reglas que te protegen. Primera, lo verificable en cadena: el AiG Token y sus contratos inteligentes son públicos y se pueden consultar en BscScan (red BSC), y cada movimiento queda registrado — esa es la prueba real, no una captura de pantalla. Segunda, los canales: el sitio y la comunidad oficiales de Genesis son la única fuente de anuncios (fechas, promociones, novedades). Nadie del equipo te va a pedir tu frase de recuperación ni tus claves privadas: quien lo haga es una estafa. Si ves una fecha, un precio o una “oportunidad” fuera de los canales oficiales, trátalo con cautela y confírmalo antes de mover dinero.':
    '당신을 지켜 주는 두 가지 규칙이 있습니다. 첫째, 체인에서 확인 가능한 것. AiG Token과 그 스마트 컨트랙트는 공개되어 있어 BscScan(BSC 네트워크)에서 조회할 수 있고, 모든 움직임이 기록됩니다. 그것이 진짜 증거이지 화면 캡처가 아닙니다. 둘째, 채널. Genesis의 공식 사이트와 공식 커뮤니티가 공지(일정, 프로모션, 소식)의 유일한 출처입니다. 팀의 그 누구도 복구 문구나 개인 키를 묻지 않습니다. 그것을 묻는 사람은 사기입니다. 공식 채널 밖에서 날짜나 가격, “기회”를 보았다면 신중하게 받아들이고, 돈을 옮기기 전에 확인하세요.',
  'Idioma del material': '자료의 언어',
  'material oficial del ecosistema': '생태계 공식 자료',
  'Todavía no hay edición en': '아직 판이 없는 언어:',
  'Elige otro idioma abajo o descarga el documento.': '아래에서 다른 언어를 고르거나 문서를 내려받으세요.',
  Reproducir: '재생',
  idiomas: '개 언어',
  'Ampliar la ventana': '창 크게',
  'Reducir la ventana': '창 작게',
  'Cargando el material…': '자료를 불러오는 중…',
  'video en': '영상:',
  ediciones: '개 판',
  'video y documento en varios idiomas': '여러 언어의 영상과 문서',
  '¿Te sirvió este material?': '이 자료가 도움이 되었나요?',
  'Material informativo. No constituye una oferta de inversión ni promete rendimientos.':
    '정보 제공용 자료입니다. 투자 권유가 아니며 수익을 약속하지 않습니다.',

  /* ── descarga vinculada al idioma ────────────────────────────────────── */
  'Descargar la presentación': '프레젠테이션 내려받기',
  'Versión anterior (v1)': '이전 버전(v1)',
  'Centro de ayuda': '도움말 센터',
  'Las respuestas están verificadas en español. Su traducción llegará por los canales oficiales.':
    '답변은 스페인어로 검증되었습니다. 번역은 공식 채널을 통해 제공될 예정입니다.',
  'Buscar en las preguntas frecuentes': '자주 묻는 질문에서 검색',
  'Escribe tu pregunta — por ejemplo: no puedo reclamar': '질문을 입력하세요 — 예: 청구가 안 돼요',
  'Filtrar por producto': '제품으로 거르기',
  'También suele preguntarse:': '이런 질문도 많이 합니다:',

  /* ── el asistente flotante y el chat compartido ──────────────────────── */
  Preguntar: '질문하기',
  'Asistente Genesis': 'Genesis 어시스턴트',
  'Asistente de soporte': '지원 어시스턴트',
  'Respuestas verificadas · si no sabe, lo dice': '검증된 답변 · 모르면 모른다고 말합니다',
  'Abrir el asistente': '어시스턴트 열기',
  'Cerrar el asistente': '어시스턴트 닫기',
  'Soporte Genesis': 'Genesis 지원',
  'suele responder en minutos': '보통 몇 분 안에 답합니다',
  'Pregunta sobre tu cuenta, el hold, los reclamos, el P2P o la tienda. Si no lo sé, te lo digo.':
    '계정과 홀드, 청구, P2P, 상점에 대해 물어보세요. 모르면 모른다고 말씀드립니다.',

  /* ── el mensajero flotante (Fase B) ──────────────────────────────────── */
  Hola: '안녕하세요',
  '¿Cómo podemos ayudarte?': '무엇을 도와드릴까요?',
  'Hacer una pregunta': '질문 남기기',
  Mensajes: '메시지',
  Ayuda: '도움말',
  'No hay mensajes': '메시지가 없습니다',
  'Tus conversaciones se guardan en este navegador.': '대화는 이 브라우저에 저장됩니다.',
  'Buscar ayuda': '도움말 검색',
  colecciones: '개 모음',
  'artículo': '개 문서',
  'artículos': '개 문서',
  Fuente: '출처',
  '¿Respondió esto a tu pregunta?': '이 답변이 궁금증을 해결했나요?',
  'Gracias — esto afina el asistente.': '감사합니다 — 어시스턴트가 더 정확해집니다.',
  'Abrir en el centro de ayuda': '도움말 센터에서 열기',
  Volver: '돌아가기',
  'Ver como artículo': '문서로 보기',
  'No he entendido la pregunta lo bastante bien como para responderla con seguridad. Prefiero pasarte con alguien del equipo antes que darte algo que suene bien y esté mal.':
    '질문을 확실히 답할 만큼 잘 이해하지 못했습니다. 그럴듯하지만 틀린 답을 드리기보다, 팀의 담당자에게 연결해 드리는 편을 택하겠습니다.',
  'No promete activaciones ni resultados. Cuando no sabe, deriva a una persona.':
    '활성화나 결과를 약속하지 않습니다. 모를 때는 사람에게 넘깁니다.',
  'Escribiendo…': '입력 중…',

  /* ── dictado y voz (Tren D) ──────────────────────────────────────────── */
  Escuchar: '듣기',
  'Leer en voz alta': '소리 내어 읽기',
  'Dictar la pregunta': '질문 받아쓰기',
  'Detener el dictado': '받아쓰기 중지',
}
