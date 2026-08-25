import type { CodigoIdioma } from '@/lib/i18n/idiomas'

/**
 * EL DICCIONARIO — la clave es el texto en español.
 *
 * COMO SE USA: se busca la frase española tal cual aparece en el componente. Si
 * no está, o si no está ese idioma, sale el español. Nunca sale una clave ni un
 * hueco. El porqué de esta decisión está explicado en `IdiomaContext`.
 *
 * QUE NO ESTA AQUI, Y ES DELIBERADO
 * ---------------------------------
 * Los nombres propios no se traducen y por eso no aparecen: Genesis, AiGenesis,
 * AiG Token, G-Pulse, G-Oracle, Booster, Staking, Mining, Marketplace, Roadmap,
 * Smart Contract, BSC, BEP-20, on-chain. Meterlos con su propio valor seria
 * ruido, y ademas invitaria a que alguien «tradujera» una marca.
 *
 * Tampoco estan las cifras: 8-11 %, 99.9 %, BEP-20. Un numero no cambia de
 * idioma.
 *
 * REVISION NATIVA PENDIENTE
 * -------------------------
 * Ingles, portugues, frances, aleman y sueco los doy por buenos. Ruso, croata y
 * serbio son correctos pero se benefician de una lectura nativa —sobre todo en
 * los titulares partidos, donde la sintaxis manda—. Arabe y urdu NECESITAN
 * revision nativa antes de considerarse publicables: no por el vocabulario, sino
 * porque en RTL la puntuacion, los guiones largos y la mezcla con nombres
 * latinos se comportan distinto y eso no se juzga sin leerlo en pantalla.
 *
 * Mientras no se revisen, la funcion ya sirve: un texto imperfecto en tu idioma
 * comunica mas que uno perfecto que no entiendes, y el mecanismo permite
 * corregir una frase sin tocar un solo componente.
 */

type Fila = Partial<Record<Exclude<CodigoIdioma, 'es'>, string>>

/**
 * SE PUEDEN AÑADIR BLOQUES, y por eso no es `const` cerrado.
 *
 * Motivo medido: al meter aqui el whitepaper entero —cincuenta entradas de
 * parrafo largo por once lenguas— la PORTADA paso de 274 a 309 kB de primera
 * carga. Treinta y cinco kilobytes de texto que la portada no usa, viajando a
 * todo el que entra, porque un solo modulo compartido no se puede partir.
 *
 * Ahora cada pagina pesada trae su propio bloque y lo REGISTRA al importarse.
 * Como el import vive dentro del componente de esa pagina, el empaquetador lo
 * mete en el trozo de esa pagina y no en el comun: quien no entra a
 * `/whitepaper` no descarga el whitepaper.
 *
 * El registro ocurre al evaluar el modulo, o sea ANTES de que su componente se
 * pinte por primera vez. Por eso no hace falta avisar a React de nada: cuando
 * el primer `t()` pregunta, las entradas ya estan.
 */
export function registrarEntradas(extra: Record<string, Partial<Record<Exclude<CodigoIdioma, 'es'>, string>>>) {
  Object.assign(DICCIONARIO, extra)
}

export const DICCIONARIO: Record<string, Fila> = {
  /* ── NAVEGACION Y ACCESIBILIDAD ─────────────────────────────────── */
  'Navegación principal': {
    en: 'Main navigation', pt: 'Navegação principal', fr: 'Navigation principale',
    ru: 'Основная навигация', sv: 'Huvudnavigering', hr: 'Glavna navigacija',
    ar: 'التنقل الرئيسي', de: 'Hauptnavigation', sr: 'Главна навигација', ur: 'مرکزی نیویگیشن',
  },
  'Navegación de secciones': {
    en: 'Section navigation', pt: 'Navegação de seções', fr: 'Navigation des sections',
    ru: 'Навигация по разделам', sv: 'Sektionsnavigering', hr: 'Navigacija odjeljcima',
    ar: 'التنقل بين الأقسام', de: 'Abschnittsnavigation', sr: 'Навигација одељцима', ur: 'سیکشن نیویگیشن',
  },
  'Menú de navegación': {
    en: 'Navigation menu', pt: 'Menu de navegação', fr: 'Menu de navigation',
    ru: 'Меню навигации', sv: 'Navigeringsmeny', hr: 'Izbornik navigacije',
    ar: 'قائمة التنقل', de: 'Navigationsmenü', sr: 'Мени навигације', ur: 'نیویگیشن مینو',
  },
  'Enlaces del menú': {
    en: 'Menu links', pt: 'Links do menu', fr: 'Liens du menu',
    ru: 'Ссылки меню', sv: 'Menylänkar', hr: 'Poveznice izbornika',
    ar: 'روابط القائمة', de: 'Menülinks', sr: 'Везе менија', ur: 'مینو لنکس',
  },
  'Cerrar menú': {
    en: 'Close menu', pt: 'Fechar menu', fr: 'Fermer le menu',
    ru: 'Закрыть меню', sv: 'Stäng menyn', hr: 'Zatvori izbornik',
    ar: 'إغلاق القائمة', de: 'Menü schließen', sr: 'Затвори мени', ur: 'مینو بند کریں',
  },
  'Sección anterior': {
    en: 'Previous section', pt: 'Seção anterior', fr: 'Section précédente',
    ru: 'Предыдущий раздел', sv: 'Föregående avsnitt', hr: 'Prethodni odjeljak',
    ar: 'القسم السابق', de: 'Vorheriger Abschnitt', sr: 'Претходни одељак', ur: 'پچھلا سیکشن',
  },
  'Sección siguiente': {
    en: 'Next section', pt: 'Seção seguinte', fr: 'Section suivante',
    ru: 'Следующий раздел', sv: 'Nästa avsnitt', hr: 'Sljedeći odjeljak',
    ar: 'القسم التالي', de: 'Nächster Abschnitt', sr: 'Следећи одељак', ur: 'اگلا سیکشن',
  },
  'Progreso de secciones': {
    en: 'Section progress', pt: 'Progresso das seções', fr: 'Progression des sections',
    ru: 'Прогресс по разделам', sv: 'Avsnittsförlopp', hr: 'Napredak odjeljaka',
    ar: 'تقدّم الأقسام', de: 'Abschnittsfortschritt', sr: 'Напредак одељака', ur: 'سیکشن پیش رفت',
  },
  'Mapa del ecosistema': {
    en: 'Ecosystem map', pt: 'Mapa do ecossistema', fr: "Carte de l'écosystème",
    ru: 'Карта экосистемы', sv: 'Ekosystemkarta', hr: 'Karta ekosustava',
    ar: 'خريطة المنظومة', de: 'Ökosystem-Karte', sr: 'Мапа екосистема', ur: 'ایکو سسٹم کا نقشہ',
  },
  'Enlaces institucionales': {
    en: 'Institutional links', pt: 'Links institucionais', fr: 'Liens institutionnels',
    ru: 'Официальные ссылки', sv: 'Institutionella länkar', hr: 'Institucionalne poveznice',
    ar: 'روابط مؤسسية', de: 'Institutionelle Links', sr: 'Институционалне везе', ur: 'ادارہ جاتی لنکس',
  },
  'Redes sociales AiGenesis': {
    en: 'AiGenesis social media', pt: 'Redes sociais AiGenesis', fr: 'Réseaux sociaux AiGenesis',
    ru: 'Соцсети AiGenesis', sv: 'AiGenesis sociala medier', hr: 'AiGenesis društvene mreže',
    ar: 'شبكات AiGenesis الاجتماعية', de: 'AiGenesis Social Media', sr: 'AiGenesis друштвене мреже', ur: 'AiGenesis سوشل میڈیا',
  },
  'Pie de página institucional': {
    en: 'Institutional footer', pt: 'Rodapé institucional', fr: 'Pied de page institutionnel',
    ru: 'Официальный подвал', sv: 'Institutionell sidfot', hr: 'Institucionalno podnožje',
    ar: 'تذييل مؤسسي', de: 'Institutionelle Fußzeile', sr: 'Институционално подножје', ur: 'ادارہ جاتی فوٹر',
  },
  'GENESIS — Inicio': {
    en: 'GENESIS — Home', pt: 'GENESIS — Início', fr: 'GENESIS — Accueil',
    ru: 'GENESIS — Главная', sv: 'GENESIS — Start', hr: 'GENESIS — Početna',
    ar: 'GENESIS — الرئيسية', de: 'GENESIS — Start', sr: 'GENESIS — Почетна', ur: 'GENESIS — ہوم',
  },

  /* ── ETIQUETAS DE SECCION ──────────────────────────────────────── */
  Confianza: {
    en: 'Trust', pt: 'Confiança', fr: 'Confiance', ru: 'Доверие', sv: 'Förtroende',
    hr: 'Povjerenje', ar: 'الثقة', de: 'Vertrauen', sr: 'Поверење', ur: 'اعتماد',
  },
  Comunidad: {
    en: 'Community', pt: 'Comunidade', fr: 'Communauté', ru: 'Сообщество', sv: 'Gemenskap',
    hr: 'Zajednica', ar: 'المجتمع', de: 'Gemeinschaft', sr: 'Заједница', ur: 'کمیونٹی',
  },
  Tecnología: {
    en: 'Technology', pt: 'Tecnologia', fr: 'Technologie', ru: 'Технология', sv: 'Teknik',
    hr: 'Tehnologija', ar: 'التقنية', de: 'Technologie', sr: 'Технологија', ur: 'ٹیکنالوجی',
  },
  Protocolo: {
    en: 'Protocol', pt: 'Protocolo', fr: 'Protocole', ru: 'Протокол', sv: 'Protokoll',
    hr: 'Protokol', ar: 'البروتوكول', de: 'Protokoll', sr: 'Протокол', ur: 'پروٹوکول',
  },
  Participación: {
    en: 'Participation', pt: 'Participação', fr: 'Participation', ru: 'Участие', sv: 'Deltagande',
    hr: 'Sudjelovanje', ar: 'المشاركة', de: 'Teilnahme', sr: 'Учешће', ur: 'شرکت',
  },
  Distribución: {
    en: 'Distribution', pt: 'Distribuição', fr: 'Distribution', ru: 'Распределение', sv: 'Distribution',
    hr: 'Distribucija', ar: 'التوزيع', de: 'Verteilung', sr: 'Дистрибуција', ur: 'تقسیم',
  },
  Procesamiento: {
    en: 'Processing', pt: 'Processamento', fr: 'Traitement', ru: 'Обработка', sv: 'Bearbetning',
    hr: 'Obrada', ar: 'المعالجة', de: 'Verarbeitung', sr: 'Обрада', ur: 'پروسیسنگ',
  },
  Verificación: {
    en: 'Verification', pt: 'Verificação', fr: 'Vérification', ru: 'Проверка', sv: 'Verifiering',
    hr: 'Provjera', ar: 'التحقّق', de: 'Verifizierung', sr: 'Провера', ur: 'تصدیق',
  },
  Gobernanza: {
    en: 'Governance', pt: 'Governança', fr: 'Gouvernance', ru: 'Управление', sv: 'Styrning',
    hr: 'Upravljanje', ar: 'الحوكمة', de: 'Governance', sr: 'Управљање', ur: 'گورننس',
  },
  Modelo: {
    en: 'Model', pt: 'Modelo', fr: 'Modèle', ru: 'Модель', sv: 'Modell',
    hr: 'Model', ar: 'النموذج', de: 'Modell', sr: 'Модел', ur: 'ماڈل',
  },
  Progresivo: {
    en: 'Progressive', pt: 'Progressivo', fr: 'Progressif', ru: 'Прогрессивная', sv: 'Progressiv',
    hr: 'Progresivan', ar: 'تدريجي', de: 'Progressiv', sr: 'Прогресиван', ur: 'تدریجی',
  },
  Deflacionario: {
    en: 'Deflationary', pt: 'Deflacionário', fr: 'Déflationniste', ru: 'Дефляционный', sv: 'Deflationär',
    hr: 'Deflacijski', ar: 'انكماشي', de: 'Deflationär', sr: 'Дефлаторни', ur: 'ڈیفلیشنری',
  },
  Periodos: {
    en: 'Periods', pt: 'Períodos', fr: 'Périodes', ru: 'Периоды', sv: 'Perioder',
    hr: 'Razdoblja', ar: 'الفترات', de: 'Zeiträume', sr: 'Периоди', ur: 'مدتیں',
  },
  'Token base': {
    en: 'Base token', pt: 'Token base', fr: 'Jeton de base', ru: 'Базовый токен', sv: 'Bastoken',
    hr: 'Osnovni token', ar: 'الرمز الأساسي', de: 'Basis-Token', sr: 'Основни токен', ur: 'بنیادی ٹوکن',
  },
  'Capas activas': {
    en: 'Active layers', pt: 'Camadas ativas', fr: 'Couches actives', ru: 'Активные слои', sv: 'Aktiva lager',
    hr: 'Aktivni slojevi', ar: 'الطبقات النشطة', de: 'Aktive Ebenen', sr: 'Активни слојеви', ur: 'فعال تہیں',
  },
  'Métricas institucionales': {
    en: 'Institutional metrics', pt: 'Métricas institucionais', fr: 'Indicateurs institutionnels',
    ru: 'Официальные показатели', sv: 'Institutionella mätvärden', hr: 'Institucionalni pokazatelji',
    ar: 'مؤشرات مؤسسية', de: 'Institutionelle Kennzahlen', sr: 'Институционални показатељи', ur: 'ادارہ جاتی میٹرکس',
  },

  /* ── TITULARES PARTIDOS ────────────────────────────────────────── */
  'Ingeniería de': {
    en: 'Engineering of', pt: 'Engenharia de', fr: 'Ingénierie de',
    ru: 'Инженерия', sv: 'Teknik i', hr: 'Inženjerstvo',
    ar: 'هندسة', de: 'Technik der', sr: 'Инжењерство', ur: 'انجینئرنگ',
  },
  'vanguardia.': {
    en: 'the vanguard.', pt: 'vanguarda.', fr: 'pointe.',
    ru: 'переднего края.', sv: 'framkant.', hr: 'vrhunska.',
    ar: 'الطليعة.', de: 'Spitzenklasse.', sr: 'врхунско.', ur: 'اعلیٰ درجے کی۔',
  },
  'Crece con': {
    en: 'Grow with', pt: 'Cresça com', fr: 'Grandissez avec',
    ru: 'Расти вместе с', sv: 'Väx med', hr: 'Rasti s',
    ar: 'انمُ مع', de: 'Wachse mit', sr: 'Расти са', ur: 'ساتھ بڑھیں',
  },
  'quienes crecen.': {
    en: 'those who grow.', pt: 'quem cresce.', fr: 'ceux qui grandissent.',
    ru: 'теми, кто растёт.', sv: 'dem som växer.', hr: 'onima koji rastu.',
    ar: 'من ينمو.', de: 'denen, die wachsen.', sr: 'онима који расту.', ur: 'ان کے جو بڑھتے ہیں۔',
  },
  'Acelerador de crecimiento': {
    en: 'Growth accelerator', pt: 'Acelerador de crescimento', fr: 'Accélérateur de croissance',
    ru: 'Ускоритель роста', sv: 'Tillväxtaccelerator', hr: 'Ubrzivač rasta',
    ar: 'مُسرّع النمو', de: 'Wachstumsbeschleuniger', sr: 'Убрзивач раста', ur: 'گروتھ ایکسیلریٹر',
  },
  'del ecosistema.': {
    en: 'of the ecosystem.', pt: 'do ecossistema.', fr: "de l'écosystème.",
    ru: 'экосистемы.', sv: 'för ekosystemet.', hr: 'ekosustava.',
    ar: 'للمنظومة.', de: 'des Ökosystems.', sr: 'екосистема.', ur: 'ایکو سسٹم کا۔',
  },
  'Cerebro del': {
    en: 'Brain of the', pt: 'Cérebro do', fr: 'Cerveau du',
    ru: 'Мозг', sv: 'Hjärnan i', hr: 'Mozak',
    ar: 'عقل', de: 'Gehirn des', sr: 'Мозак', ur: 'دماغ',
  },
  'ecosistema.': {
    en: 'ecosystem.', pt: 'ecossistema.', fr: 'écosystème.',
    ru: 'экосистемы.', sv: 'ekosystemet.', hr: 'ekosustava.',
    ar: 'المنظومة.', de: 'Ökosystems.', sr: 'екосистема.', ur: 'ایکو سسٹم۔',
  },
  'Señales en': {
    en: 'Signals in', pt: 'Sinais em', fr: 'Signaux en',
    ru: 'Сигналы в', sv: 'Signaler i', hr: 'Signali u',
    ar: 'إشارات في', de: 'Signale in', sr: 'Сигнали у', ur: 'سگنلز',
  },
  'tiempo real.': {
    en: 'real time.', pt: 'tempo real.', fr: 'temps réel.',
    ru: 'реальном времени.', sv: 'realtid.', hr: 'stvarnom vremenu.',
    ar: 'الوقت الفعلي.', de: 'Echtzeit.', sr: 'реалном времену.', ur: 'حقیقی وقت میں۔',
  },
  Nuestro: {
    en: 'Our', pt: 'Nosso', fr: 'Notre', ru: 'Наш', sv: 'Vår',
    hr: 'Naš', ar: 'أفقنا', de: 'Unser', sr: 'Наш', ur: 'ہمارا',
  },
  'horizonte.': {
    en: 'horizon.', pt: 'horizonte.', fr: 'horizon.', ru: 'горизонт.', sv: 'horisont.',
    hr: 'horizont.', ar: 'المستقبلي.', de: 'Horizont.', sr: 'хоризонт.', ur: 'افق۔',
  },
  'Genesis Token.': {
    en: 'Genesis Token.', pt: 'Genesis Token.', fr: 'Genesis Token.',
    ru: 'Genesis Token.', sv: 'Genesis Token.', hr: 'Genesis Token.',
    ar: 'Genesis Token.', de: 'Genesis Token.', sr: 'Genesis Token.', ur: 'Genesis Token.',
  },
  'antes del producto.': {
    en: 'before the product.', pt: 'antes do produto.', fr: 'avant le produit.',
    ru: 'прежде продукта.', sv: 'före produkten.', hr: 'prije proizvoda.',
    ar: 'قبل المنتج.', de: 'vor dem Produkt.', sr: 'пре производа.', ur: 'پروڈکٹ سے پہلے۔',
  },
  'con el protocolo.': {
    en: 'with the protocol.', pt: 'com o protocolo.', fr: 'avec le protocole.',
    ru: 'с протоколом.', sv: 'med protokollet.', hr: 's protokolom.',
    ar: 'مع البروتوكول.', de: 'mit dem Protokoll.', sr: 'са протоколом.', ur: 'پروٹوکول کے ساتھ۔',
  },
  'del futuro?': {
    en: 'of the future?', pt: 'do futuro?', fr: "de l'avenir ?",
    ru: 'будущего?', sv: 'framtidens?', hr: 'budućnosti?',
    ar: 'المستقبل؟', de: 'der Zukunft?', sr: 'будућности?', ur: 'مستقبل کا؟',
  },
  'un universo en expansión': {
    en: 'an expanding universe', pt: 'um universo em expansão', fr: 'un univers en expansion',
    ru: 'расширяющуюся вселенную', sv: 'ett universum i expansion', hr: 'svemir koji se širi',
    ar: 'كوناً يتوسّع', de: 'ein expandierendes Universum', sr: 'свемир који се шири', ur: 'ایک پھیلتی ہوئی کائنات',
  },

  /* ── PARRAFOS ──────────────────────────────────────────────────── */
  'AiGenesis prioriza transparencia, seguridad técnica y trazabilidad on-chain. Conoce los pilares que sostienen el ecosistema antes de explorar sus productos.': {
    en: 'AiGenesis puts transparency, technical security and on-chain traceability first. Get to know the pillars that hold up the ecosystem before exploring its products.',
    pt: 'A AiGenesis prioriza transparência, segurança técnica e rastreabilidade on-chain. Conheça os pilares que sustentam o ecossistema antes de explorar seus produtos.',
    fr: "AiGenesis privilégie la transparence, la sécurité technique et la traçabilité on-chain. Découvrez les piliers qui soutiennent l'écosystème avant d'explorer ses produits.",
    ru: 'AiGenesis ставит на первое место прозрачность, техническую безопасность и прослеживаемость в блокчейне. Познакомьтесь с опорами экосистемы, прежде чем изучать её продукты.',
    sv: 'AiGenesis prioriterar transparens, teknisk säkerhet och spårbarhet on-chain. Lär känna pelarna som bär upp ekosystemet innan du utforskar dess produkter.',
    hr: 'AiGenesis na prvo mjesto stavlja transparentnost, tehničku sigurnost i on-chain sljedivost. Upoznajte stupove koji drže ekosustav prije nego istražite njegove proizvode.',
    ar: 'تضع AiGenesis الشفافية والأمان التقني وإمكانية التتبّع على السلسلة في المقدّمة. تعرّف على الركائز التي تحمل المنظومة قبل استكشاف منتجاتها.',
    de: 'AiGenesis stellt Transparenz, technische Sicherheit und On-Chain-Nachvollziehbarkeit an erste Stelle. Lernen Sie die Säulen kennen, die das Ökosystem tragen, bevor Sie seine Produkte erkunden.',
    sr: 'AiGenesis на прво место ставља транспарентност, техничку безбедност и следивост на ланцу. Упознајте стубове који држе екосистем пре него што истражите његове производе.',
    ur: 'AiGenesis شفافیت، تکنیکی سیکیورٹی اور آن چین قابلِ سراغ ہونے کو مقدم رکھتا ہے۔ مصنوعات دیکھنے سے پہلے ان ستونوں کو جانیں جو ایکو سسٹم کو سنبھالتے ہیں۔',
  },
  'Un universo de productos interconectados sobre Binance Smart Chain. Cada capítulo amplifica al siguiente en una arquitectura modular e institucional.': {
    en: 'A universe of interconnected products on Binance Smart Chain. Each chapter amplifies the next in a modular, institutional architecture.',
    pt: 'Um universo de produtos interligados sobre a Binance Smart Chain. Cada capítulo amplifica o seguinte numa arquitetura modular e institucional.',
    fr: 'Un univers de produits interconnectés sur Binance Smart Chain. Chaque chapitre amplifie le suivant dans une architecture modulaire et institutionnelle.',
    ru: 'Вселенная связанных продуктов на Binance Smart Chain. Каждая глава усиливает следующую в модульной институциональной архитектуре.',
    sv: 'Ett universum av sammankopplade produkter på Binance Smart Chain. Varje kapitel förstärker nästa i en modulär, institutionell arkitektur.',
    hr: 'Svemir međusobno povezanih proizvoda na Binance Smart Chainu. Svako poglavlje pojačava sljedeće u modularnoj, institucionalnoj arhitekturi.',
    ar: 'كون من المنتجات المترابطة على Binance Smart Chain. كل فصل يضاعف أثر الذي يليه ضمن بنية معيارية ومؤسسية.',
    de: 'Ein Universum vernetzter Produkte auf der Binance Smart Chain. Jedes Kapitel verstärkt das nächste in einer modularen, institutionellen Architektur.',
    sr: 'Свемир међусобно повезаних производа на Binance Smart Chain-у. Свако поглавље појачава следеће у модуларној, институционалној архитектури.',
    ur: 'Binance Smart Chain پر باہم مربوط مصنوعات کی ایک کائنات۔ ہر باب اگلے کو ایک ماڈیولر، ادارہ جاتی فن تعمیر میں بڑھاتا ہے۔',
  },
  'Token BEP-20 deflacionario sobre BSC. El activo base que articula participación, utilidad y expansión del ecosistema Genesis.': {
    en: 'Deflationary BEP-20 token on BSC. The base asset that ties together participation, utility and expansion of the Genesis ecosystem.',
    pt: 'Token BEP-20 deflacionário na BSC. O ativo base que articula participação, utilidade e expansão do ecossistema Genesis.',
    fr: 'Jeton BEP-20 déflationniste sur BSC. L’actif de base qui articule participation, utilité et expansion de l’écosystème Genesis.',
    ru: 'Дефляционный токен BEP-20 в сети BSC. Базовый актив, связывающий участие, полезность и расширение экосистемы Genesis.',
    sv: 'Deflationär BEP-20-token på BSC. Bastillgången som binder samman deltagande, nytta och expansion i Genesis-ekosystemet.',
    hr: 'Deflacijski BEP-20 token na BSC-u. Osnovna imovina koja povezuje sudjelovanje, korisnost i širenje Genesis ekosustava.',
    ar: 'رمز BEP-20 انكماشي على شبكة BSC. الأصل الأساسي الذي يربط المشاركة والمنفعة وتوسّع منظومة Genesis.',
    de: 'Deflationärer BEP-20-Token auf BSC. Der Basiswert, der Teilnahme, Nutzen und Expansion des Genesis-Ökosystems verbindet.',
    sr: 'Дефлаторни BEP-20 токен на BSC-у. Основна имовина која повезује учешће, корисност и ширење Genesis екосистема.',
    ur: 'BSC پر ڈیفلیشنری BEP-20 ٹوکن۔ بنیادی اثاثہ جو Genesis ایکو سسٹم کی شرکت، افادیت اور توسیع کو جوڑتا ہے۔',
  },
  'Mining es la capa que articula emisión, participación y distribución dentro de AiGenesis. Un mecanismo de protocolo — no una promesa de rentabilidad.': {
    en: 'Mining is the layer that ties together issuance, participation and distribution inside AiGenesis. A protocol mechanism — not a promise of returns.',
    pt: 'Mining é a camada que articula emissão, participação e distribuição dentro da AiGenesis. Um mecanismo de protocolo — não uma promessa de rentabilidade.',
    fr: "Mining est la couche qui articule émission, participation et distribution au sein d'AiGenesis. Un mécanisme de protocole — pas une promesse de rendement.",
    ru: 'Mining — это слой, связывающий эмиссию, участие и распределение внутри AiGenesis. Механизм протокола, а не обещание доходности.',
    sv: 'Mining är lagret som binder samman utgivning, deltagande och distribution inom AiGenesis. En protokollmekanism — inte ett löfte om avkastning.',
    hr: 'Mining je sloj koji povezuje izdavanje, sudjelovanje i distribuciju unutar AiGenesisa. Mehanizam protokola — ne obećanje prinosa.',
    ar: 'Mining هي الطبقة التي تربط الإصدار والمشاركة والتوزيع داخل AiGenesis. آلية بروتوكول — لا وعد بعائد.',
    de: 'Mining ist die Ebene, die Ausgabe, Teilnahme und Verteilung innerhalb von AiGenesis verbindet. Ein Protokollmechanismus — kein Renditeversprechen.',
    sr: 'Mining је слој који повезује издавање, учешће и дистрибуцију унутар AiGenesis-а. Механизам протокола — не обећање приноса.',
    ur: 'Mining وہ تہہ ہے جو AiGenesis کے اندر اجرا، شرکت اور تقسیم کو جوڑتی ہے۔ ایک پروٹوکول میکانزم — منافع کا وعدہ نہیں۔',
  },
  'Capas y multiplicadores definidos que amplifican la participación en el protocolo. Progresión por permanencia — no un esquema de captación.': {
    en: 'Defined layers and multipliers that amplify participation in the protocol. Progression through commitment — not a recruitment scheme.',
    pt: 'Camadas e multiplicadores definidos que amplificam a participação no protocolo. Progressão por permanência — não um esquema de captação.',
    fr: 'Des couches et des multiplicateurs définis qui amplifient la participation au protocole. Progression par la durée — pas un système de recrutement.',
    ru: 'Заданные слои и множители, усиливающие участие в протоколе. Продвижение за счёт постоянства, а не схема привлечения.',
    sv: 'Definierade lager och multiplikatorer som förstärker deltagandet i protokollet. Progression genom uthållighet — inte ett värvningsupplägg.',
    hr: 'Definirani slojevi i množitelji koji pojačavaju sudjelovanje u protokolu. Napredovanje ustrajnošću — ne shema regrutiranja.',
    ar: 'طبقات ومضاعفات محدّدة تُعزّز المشاركة في البروتوكول. تقدّم بالاستمرارية — لا مخطّط استقطاب.',
    de: 'Definierte Ebenen und Multiplikatoren, die die Teilnahme am Protokoll verstärken. Fortschritt durch Beständigkeit — kein Anwerbesystem.',
    sr: 'Дефинисани слојеви и множитељи који појачавају учешће у протоколу. Напредак истрајношћу — не шема регрутовања.',
    ur: 'متعین تہیں اور ضرب دینے والے عوامل جو پروٹوکول میں شرکت کو بڑھاتے ہیں۔ استقامت سے ترقی — بھرتی کا منصوبہ نہیں۔',
  },
  'Comunidad global G11 con reglas de participación publicadas. Dos aceleradores de minado —directo y de red— y fondos globales para los rangos más activos.': {
    en: 'Global G11 community with published participation rules. Two mining accelerators — direct and network — plus global funds for the most active ranks.',
    pt: 'Comunidade global G11 com regras de participação publicadas. Dois aceleradores de mineração — direto e de rede — e fundos globais para os níveis mais ativos.',
    fr: 'Communauté mondiale G11 avec des règles de participation publiées. Deux accélérateurs de minage — direct et réseau — et des fonds mondiaux pour les rangs les plus actifs.',
    ru: 'Глобальное сообщество G11 с опубликованными правилами участия. Два ускорителя майнинга — прямой и сетевой — и глобальные фонды для самых активных рангов.',
    sv: 'Global G11-gemenskap med publicerade deltagarregler. Två brytningsacceleratorer — direkt och nätverk — samt globala fonder för de mest aktiva nivåerna.',
    hr: 'Globalna zajednica G11 s objavljenim pravilima sudjelovanja. Dva ubrzivača rudarenja — izravni i mrežni — te globalni fondovi za najaktivnije razine.',
    ar: 'مجتمع G11 العالمي بقواعد مشاركة معلنة. مُسرّعان للتعدين — مباشر وشبكي — وصناديق عالمية للمراتب الأكثر نشاطاً.',
    de: 'Globale G11-Gemeinschaft mit veröffentlichten Teilnahmeregeln. Zwei Mining-Beschleuniger — direkt und Netzwerk — sowie globale Fonds für die aktivsten Ränge.',
    sr: 'Глобална заједница G11 са објављеним правилима учешћа. Два убрзивача рударења — директни и мрежни — и глобални фондови за најактивније рангове.',
    ur: 'شائع شدہ شرکت کے قواعد کے ساتھ عالمی G11 کمیونٹی۔ کان کنی کے دو ایکسیلریٹر — براہِ راست اور نیٹ ورک — اور سب سے فعال درجات کے لیے عالمی فنڈز۔',
  },
  'GPulse entrega análisis operativo y señales automatizadas para mercados globales. Capa de ejecución táctica — complementaria al núcleo de inteligencia G-Oracle.': {
    en: 'GPulse delivers operational analysis and automated signals for global markets. A tactical execution layer — complementary to the G-Oracle intelligence core.',
    pt: 'O GPulse entrega análise operacional e sinais automatizados para mercados globais. Camada de execução tática — complementar ao núcleo de inteligência G-Oracle.',
    fr: 'GPulse fournit une analyse opérationnelle et des signaux automatisés pour les marchés mondiaux. Couche d’exécution tactique — complémentaire au cœur d’intelligence G-Oracle.',
    ru: 'GPulse даёт операционную аналитику и автоматические сигналы для мировых рынков. Слой тактического исполнения, дополняющий интеллектуальное ядро G-Oracle.',
    sv: 'GPulse levererar operativ analys och automatiserade signaler för globala marknader. Ett taktiskt exekveringslager — komplement till intelligenskärnan G-Oracle.',
    hr: 'GPulse donosi operativnu analizu i automatizirane signale za globalna tržišta. Sloj taktičkog izvršenja — dopuna obavještajnoj jezgri G-Oracle.',
    ar: 'يقدّم GPulse تحليلاً تشغيلياً وإشارات آلية للأسواق العالمية. طبقة تنفيذ تكتيكي — مكمّلة لنواة الذكاء G-Oracle.',
    de: 'GPulse liefert operative Analysen und automatisierte Signale für globale Märkte. Eine taktische Ausführungsebene — ergänzend zum Intelligenzkern G-Oracle.',
    sr: 'GPulse доноси оперативну анализу и аутоматизоване сигнале за глобална тржишта. Слој тактичког извршења — допуна обавештајном језгру G-Oracle.',
    ur: 'GPulse عالمی منڈیوں کے لیے آپریشنل تجزیہ اور خودکار سگنلز فراہم کرتا ہے۔ حکمتِ عملی پر مبنی عمل درآمد کی تہہ — G-Oracle انٹیلیجنس کور کی تکمیل۔',
  },
  'Catálogo global con envío internacional. Se paga con AIG y USDT desde tu wallet.': {
    en: 'Global catalogue with international shipping. Pay with AIG and USDT from your wallet.',
    pt: 'Catálogo global com envio internacional. Pague com AIG e USDT a partir da sua carteira.',
    fr: 'Catalogue mondial avec expédition internationale. Paiement en AIG et USDT depuis votre portefeuille.',
    ru: 'Глобальный каталог с международной доставкой. Оплата в AIG и USDT из вашего кошелька.',
    sv: 'Global katalog med internationell frakt. Betala med AIG och USDT från din plånbok.',
    hr: 'Globalni katalog s međunarodnom dostavom. Plaćanje u AIG-u i USDT-u iz vašeg novčanika.',
    ar: 'كتالوج عالمي مع شحن دولي. الدفع بـ AIG وUSDT من محفظتك.',
    de: 'Globaler Katalog mit internationalem Versand. Zahlung mit AIG und USDT aus deiner Wallet.',
    sr: 'Глобални каталог са међународном доставом. Плаћање у AIG-у и USDT-у из вашег новчаника.',
    ur: 'بین الاقوامی ترسیل کے ساتھ عالمی کیٹلاگ۔ اپنے والٹ سے AIG اور USDT سے ادائیگی۔',
  },
  'Stack tecnológico de clase enterprise. Smart contracts auditados, infraestructura distribuida, y motor de inteligencia artificial propietario.': {
    en: 'Enterprise-class technology stack. Audited smart contracts, distributed infrastructure and a proprietary artificial-intelligence engine.',
    pt: 'Stack tecnológico de classe enterprise. Smart contracts auditados, infraestrutura distribuída e motor de inteligência artificial proprietário.',
    fr: "Pile technologique de classe entreprise. Smart contracts audités, infrastructure distribuée et moteur d'intelligence artificielle propriétaire.",
    ru: 'Технологический стек корпоративного класса. Проверенные смарт-контракты, распределённая инфраструктура и собственный движок искусственного интеллекта.',
    sv: 'Teknikstack i företagsklass. Granskade smarta kontrakt, distribuerad infrastruktur och en egen AI-motor.',
    hr: 'Tehnološki stog poslovne klase. Revidirani pametni ugovori, distribuirana infrastruktura i vlastiti motor umjetne inteligencije.',
    ar: 'حزمة تقنية بمستوى المؤسسات. عقود ذكية مُدقّقة وبنية موزّعة ومحرّك ذكاء اصطناعي خاص.',
    de: 'Technologie-Stack in Enterprise-Qualität. Geprüfte Smart Contracts, verteilte Infrastruktur und eine eigene KI-Engine.',
    sr: 'Технолошки стек пословне класе. Ревидирани паметни уговори, дистрибуирана инфраструктура и сопствени мотор вештачке интелигенције.',
    ur: 'انٹرپرائز درجے کا ٹیکنالوجی اسٹیک۔ آڈٹ شدہ اسمارٹ کنٹریکٹس، تقسیم شدہ انفراسٹرکچر اور اپنا مصنوعی ذہانت انجن۔',
  },
  'El valor interno es la referencia de intercambio entre miembros y mineros para productos y servicios. No es una cotización de mercado: AIG todavía no tiene un pool público de liquidez.': {
    en: 'The internal value is the exchange reference between members and miners for products and services. It is not a market price: AIG does not yet have a public liquidity pool.',
    pt: 'O valor interno é a referência de troca entre membros e mineradores para produtos e serviços. Não é uma cotação de mercado: o AIG ainda não tem um pool público de liquidez.',
    fr: "La valeur interne est la référence d'échange entre membres et mineurs pour les produits et services. Ce n'est pas un cours de marché : AIG n'a pas encore de pool de liquidité public.",
    ru: 'Внутренняя стоимость — это ориентир обмена между участниками и майнерами за товары и услуги. Это не рыночная котировка: у AIG пока нет публичного пула ликвидности.',
    sv: 'Det interna värdet är växelreferensen mellan medlemmar och brytare för produkter och tjänster. Det är inte en marknadskurs: AIG har ännu ingen offentlig likviditetspool.',
    hr: 'Interna vrijednost je referenca razmjene između članova i rudara za proizvode i usluge. Nije tržišna kotacija: AIG još nema javni skup likvidnosti.',
    ar: 'القيمة الداخلية هي مرجع التبادل بين الأعضاء والمعدّنين مقابل المنتجات والخدمات. ليست سعراً سوقياً: لا يملك AIG بعد مجمّع سيولة عاماً.',
    de: 'Der interne Wert ist die Tauschreferenz zwischen Mitgliedern und Minern für Produkte und Dienstleistungen. Es ist kein Marktkurs: AIG hat noch keinen öffentlichen Liquiditätspool.',
    sr: 'Интерна вредност је референца размене између чланова и рудара за производе и услуге. Није тржишна котација: AIG још нема јавни базен ликвидности.',
    ur: 'اندرونی قدر اراکین اور کان کنوں کے درمیان مصنوعات و خدمات کے تبادلے کا حوالہ ہے۔ یہ مارکیٹ کی قیمت نہیں: AIG کے پاس ابھی عوامی لیکویڈیٹی پول نہیں ہے۔',
  },

  /* ── FICHAS Y BOTONES ──────────────────────────────────────────── */
  'Acelerador directo 8-11%': {
    en: 'Direct accelerator 8-11%', pt: 'Acelerador direto 8-11%', fr: 'Accélérateur direct 8-11 %',
    ru: 'Прямой ускоритель 8-11 %', sv: 'Direkt accelerator 8-11 %', hr: 'Izravni ubrzivač 8-11 %',
    ar: 'مُسرّع مباشر 8-11٪', de: 'Direkter Beschleuniger 8-11 %', sr: 'Директни убрзивач 8-11 %', ur: 'براہِ راست ایکسیلریٹر 8-11%',
  },
  'Acelerador de red': {
    en: 'Network accelerator', pt: 'Acelerador de rede', fr: 'Accélérateur de réseau',
    ru: 'Сетевой ускоритель', sv: 'Nätverksaccelerator', hr: 'Mrežni ubrzivač',
    ar: 'مُسرّع الشبكة', de: 'Netzwerk-Beschleuniger', sr: 'Мрежни убрзивач', ur: 'نیٹ ورک ایکسیلریٹر',
  },
  'Catálogo premium verificado': {
    en: 'Verified premium catalogue', pt: 'Catálogo premium verificado', fr: 'Catalogue premium vérifié',
    ru: 'Проверенный премиум-каталог', sv: 'Verifierad premiumkatalog', hr: 'Provjereni premium katalog',
    ar: 'كتالوج مميّز موثّق', de: 'Geprüfter Premium-Katalog', sr: 'Проверени премијум каталог', ur: 'تصدیق شدہ پریمیم کیٹلاگ',
  },
  'Seguimiento en vivo': {
    en: 'Live tracking', pt: 'Rastreamento ao vivo', fr: 'Suivi en direct',
    ru: 'Отслеживание в реальном времени', sv: 'Spårning i realtid', hr: 'Praćenje uživo',
    ar: 'تتبّع مباشر', de: 'Live-Verfolgung', sr: 'Праћење уживо', ur: 'براہِ راست ٹریکنگ',
  },
  'Liderazgo Progresivo': {
    en: 'Progressive leadership', pt: 'Liderança progressiva', fr: 'Leadership progressif',
    ru: 'Прогрессивное лидерство', sv: 'Progressivt ledarskap', hr: 'Progresivno vodstvo',
    ar: 'قيادة تدريجية', de: 'Progressive Führung', sr: 'Прогресивно вођство', ur: 'تدریجی قیادت',
  },
  'Infraestructura verificable': {
    en: 'Verifiable infrastructure', pt: 'Infraestrutura verificável', fr: 'Infrastructure vérifiable',
    ru: 'Проверяемая инфраструктура', sv: 'Verifierbar infrastruktur', hr: 'Provjerljiva infrastruktura',
    ar: 'بنية قابلة للتحقّق', de: 'Überprüfbare Infrastruktur', sr: 'Проверљива инфраструктура', ur: 'قابلِ تصدیق انفراسٹرکچر',
  },
  'Compromiso a largo plazo': {
    en: 'Long-term commitment', pt: 'Compromisso de longo prazo', fr: 'Engagement à long terme',
    ru: 'Долгосрочные обязательства', sv: 'Långsiktigt åtagande', hr: 'Dugoročna predanost',
    ar: 'التزام طويل الأمد', de: 'Langfristiges Engagement', sr: 'Дугорочна посвећеност', ur: 'طویل مدتی وابستگی',
  },
  'Motor de participación': {
    en: 'Participation engine', pt: 'Motor de participação', fr: 'Moteur de participation',
    ru: 'Механизм участия', sv: 'Deltagandemotor', hr: 'Motor sudjelovanja',
    ar: 'محرّك المشاركة', de: 'Beteiligungsmotor', sr: 'Мотор учешћа', ur: 'شرکت کا انجن',
  },
  'Capa neurálgica': {
    en: 'Nerve layer', pt: 'Camada neurálgica', fr: 'Couche névralgique',
    ru: 'Нервный слой', sv: 'Nervlager', hr: 'Živčani sloj',
    ar: 'الطبقة العصبية', de: 'Nervenschicht', sr: 'Нервни слој', ur: 'اعصابی تہہ',
  },
  'Motor propietario': {
    en: 'Proprietary engine', pt: 'Motor proprietário', fr: 'Moteur propriétaire',
    ru: 'Собственный движок', sv: 'Egen motor', hr: 'Vlastiti motor',
    ar: 'محرّك خاص', de: 'Eigene Engine', sr: 'Сопствени мотор', ur: 'اپنا انجن',
  },
  'Análisis Real-Time': {
    en: 'Real-time analysis', pt: 'Análise em tempo real', fr: 'Analyse en temps réel',
    ru: 'Анализ в реальном времени', sv: 'Realtidsanalys', hr: 'Analiza u stvarnom vremenu',
    ar: 'تحليل فوري', de: 'Echtzeit-Analyse', sr: 'Анализа у реалном времену', ur: 'حقیقی وقت میں تجزیہ',
  },
  'Señales Automatizadas': {
    en: 'Automated signals', pt: 'Sinais automatizados', fr: 'Signaux automatisés',
    ru: 'Автоматические сигналы', sv: 'Automatiserade signaler', hr: 'Automatizirani signali',
    ar: 'إشارات آلية', de: 'Automatisierte Signale', sr: 'Аутоматизовани сигнали', ur: 'خودکار سگنلز',
  },
  'Alertas de Mercado': {
    en: 'Market alerts', pt: 'Alertas de mercado', fr: 'Alertes de marché',
    ru: 'Рыночные оповещения', sv: 'Marknadsvarningar', hr: 'Tržišna upozorenja',
    ar: 'تنبيهات السوق', de: 'Marktwarnungen', sr: 'Тржишна упозорења', ur: 'مارکیٹ الرٹس',
  },
  'Indicadores de Mining': {
    en: 'Mining indicators', pt: 'Indicadores de mineração', fr: 'Indicateurs de minage',
    ru: 'Показатели майнинга', sv: 'Brytningsindikatorer', hr: 'Pokazatelji rudarenja',
    ar: 'مؤشّرات التعدين', de: 'Mining-Indikatoren', sr: 'Показатељи рударења', ur: 'مائننگ انڈیکیٹرز',
  },
  'Integración G-BRIDGE': {
    en: 'G-BRIDGE integration', pt: 'Integração G-BRIDGE', fr: 'Intégration G-BRIDGE',
    ru: 'Интеграция G-BRIDGE', sv: 'G-BRIDGE-integration', hr: 'G-BRIDGE integracija',
    ar: 'تكامل G-BRIDGE', de: 'G-BRIDGE-Integration', sr: 'G-BRIDGE интеграција', ur: 'G-BRIDGE انضمام',
  },

  'Crear cuenta': {
    en: 'Create account', pt: 'Criar conta', fr: 'Créer un compte',
    ru: 'Создать аккаунт', sv: 'Skapa konto', hr: 'Otvori račun',
    ar: 'إنشاء حساب', de: 'Konto erstellen', sr: 'Отвори налог', ur: 'اکاؤنٹ بنائیں',
  },
  'Crear Cuenta': {
    en: 'Create account', pt: 'Criar conta', fr: 'Créer un compte',
    ru: 'Создать аккаунт', sv: 'Skapa konto', hr: 'Otvori račun',
    ar: 'إنشاء حساب', de: 'Konto erstellen', sr: 'Отвори налог', ur: 'اکاؤنٹ بنائیں',
  },
  'Explora el Universo': {
    en: 'Explore the universe', pt: 'Explore o universo', fr: "Explorez l'univers",
    ru: 'Исследовать вселенную', sv: 'Utforska universum', hr: 'Istraži svemir',
    ar: 'استكشف الكون', de: 'Das Universum erkunden', sr: 'Истражи свемир', ur: 'کائنات دریافت کریں',
  },
  'Explorar el ecosistema →': {
    en: 'Explore the ecosystem →', pt: 'Explorar o ecossistema →', fr: "Explorer l'écosystème →",
    ru: 'Изучить экосистему →', sv: 'Utforska ekosystemet →', hr: 'Istraži ekosustav →',
    ar: '← استكشاف المنظومة', de: 'Ökosystem erkunden →', sr: 'Истражи екосистем →', ur: '← ایکو سسٹم دریافت کریں',
  },
  'Explorar Ecosistema →': {
    en: 'Explore ecosystem →', pt: 'Explorar ecossistema →', fr: "Explorer l'écosystème →",
    ru: 'Изучить экосистему →', sv: 'Utforska ekosystemet →', hr: 'Istraži ekosustav →',
    ar: '← استكشاف المنظومة', de: 'Ökosystem erkunden →', sr: 'Истражи екосистем →', ur: '← ایکو سسٹم دریافت کریں',
  },
  'Explorar participación': {
    en: 'Explore participation', pt: 'Explorar participação', fr: 'Explorer la participation',
    ru: 'Изучить участие', sv: 'Utforska deltagande', hr: 'Istraži sudjelovanje',
    ar: 'استكشاف المشاركة', de: 'Teilnahme erkunden', sr: 'Истражи учешће', ur: 'شرکت دریافت کریں',
  },
  'Conocer Booster': {
    en: 'Discover Booster', pt: 'Conhecer o Booster', fr: 'Découvrir Booster',
    ru: 'Узнать о Booster', sv: 'Lär känna Booster', hr: 'Upoznaj Booster',
    ar: 'تعرّف على Booster', de: 'Booster kennenlernen', sr: 'Упознај Booster', ur: 'Booster جانیں',
  },
  'Explorar Staking': {
    en: 'Explore Staking', pt: 'Explorar Staking', fr: 'Explorer le Staking',
    ru: 'Изучить стейкинг', sv: 'Utforska Staking', hr: 'Istraži Staking',
    ar: 'استكشاف Staking', de: 'Staking erkunden', sr: 'Истражи Staking', ur: 'Staking دریافت کریں',
  },
  'Conocer G-Oracle': {
    en: 'Discover G-Oracle', pt: 'Conhecer o G-Oracle', fr: 'Découvrir G-Oracle',
    ru: 'Узнать о G-Oracle', sv: 'Lär känna G-Oracle', hr: 'Upoznaj G-Oracle',
    ar: 'تعرّف على G-Oracle', de: 'G-Oracle kennenlernen', sr: 'Упознај G-Oracle', ur: 'G-Oracle جانیں',
  },
  'Explorar GPulse': {
    en: 'Explore GPulse', pt: 'Explorar o GPulse', fr: 'Explorer GPulse',
    ru: 'Изучить GPulse', sv: 'Utforska GPulse', hr: 'Istraži GPulse',
    ar: 'استكشاف GPulse', de: 'GPulse erkunden', sr: 'Истражи GPulse', ur: 'GPulse دریافت کریں',
  },
  'Acceder a G-Pulse →': {
    en: 'Go to G-Pulse →', pt: 'Acessar o G-Pulse →', fr: 'Accéder à G-Pulse →',
    ru: 'Перейти в G-Pulse →', sv: 'Gå till G-Pulse →', hr: 'Otvori G-Pulse →',
    ar: '← الانتقال إلى G-Pulse', de: 'Zu G-Pulse →', sr: 'Отвори G-Pulse →', ur: '← G-Pulse پر جائیں',
  },
  'Explorar Marketplace →': {
    en: 'Explore Marketplace →', pt: 'Explorar o Marketplace →', fr: 'Explorer le Marketplace →',
    ru: 'Открыть Marketplace →', sv: 'Utforska Marketplace →', hr: 'Istraži Marketplace →',
    ar: '← استكشاف Marketplace', de: 'Marketplace erkunden →', sr: 'Истражи Marketplace →', ur: '← Marketplace دریافت کریں',
  },
  'Únete a la Comunidad →': {
    en: 'Join the community →', pt: 'Junte-se à comunidade →', fr: 'Rejoindre la communauté →',
    ru: 'Вступить в сообщество →', sv: 'Gå med i gemenskapen →', hr: 'Pridruži se zajednici →',
    ar: '← انضمّ إلى المجتمع', de: 'Der Gemeinschaft beitreten →', sr: 'Придружи се заједници →', ur: '← کمیونٹی میں شامل ہوں',
  },
  'Ver Documentación →': {
    en: 'View documentation →', pt: 'Ver documentação →', fr: 'Voir la documentation →',
    ru: 'Открыть документацию →', sv: 'Se dokumentationen →', hr: 'Pogledaj dokumentaciju →',
    ar: '← عرض الوثائق', de: 'Dokumentation ansehen →', sr: 'Погледај документацију →', ur: '← دستاویزات دیکھیں',
  },
  'Verificar en BSCScan ↗': {
    en: 'Verify on BSCScan ↗', pt: 'Verificar no BSCScan ↗', fr: 'Vérifier sur BSCScan ↗',
    ru: 'Проверить в BSCScan ↗', sv: 'Verifiera på BSCScan ↗', hr: 'Provjeri na BSCScanu ↗',
    ar: '↗ التحقّق على BSCScan', de: 'Auf BSCScan prüfen ↗', sr: 'Провери на BSCScan-у ↗', ur: '↗ BSCScan پر تصدیق کریں',
  },
  'Descargar plan de marketing': {
    en: 'Download the marketing plan', pt: 'Baixar o plano de marketing', fr: 'Télécharger le plan marketing',
    ru: 'Скачать маркетинговый план', sv: 'Ladda ner marknadsplanen', hr: 'Preuzmi marketinški plan',
    ar: 'تنزيل الخطة التسويقية', de: 'Marketingplan herunterladen', sr: 'Преузми маркетиншки план', ur: 'مارکیٹنگ پلان ڈاؤن لوڈ کریں',
  },
  /* ── EL PROPIO SELECTOR ────────────────────────────────────────── */
  Idioma: {
    en: 'Language', pt: 'Idioma', fr: 'Langue', ru: 'Язык', sv: 'Språk',
    hr: 'Jezik', ar: 'اللغة', de: 'Sprache', sr: 'Језик', ur: 'زبان',
  },
  'La presentación oficial está disponible en cada idioma': {
    en: 'The official presentation is available in each language',
    pt: 'A apresentação oficial está disponível em cada idioma',
    fr: 'La présentation officielle est disponible dans chaque langue',
    ru: 'Официальная презентация доступна на каждом языке',
    sv: 'Den officiella presentationen finns på varje språk',
    hr: 'Službena prezentacija dostupna je na svakom jeziku',
    ar: 'العرض الرسمي متاح بكل لغة',
    de: 'Die offizielle Präsentation ist in jeder Sprache verfügbar',
    sr: 'Званична презентација доступна је на сваком језику',
    ur: 'سرکاری پریزنٹیشن ہر زبان میں دستیاب ہے',
  },
  'Presentación oficial v5.0': {
    en: 'Official presentation v5.0', pt: 'Apresentação oficial v5.0', fr: 'Présentation officielle v5.0',
    ru: 'Официальная презентация v5.0', sv: 'Officiell presentation v5.0', hr: 'Službena prezentacija v5.0',
    ar: 'العرض الرسمي v5.0', de: 'Offizielle Präsentation v5.0', sr: 'Званична презентација v5.0', ur: 'سرکاری پریزنٹیشن v5.0',
  },
  'Presentación de la versión anterior': {
    en: 'Presentation from the previous version', pt: 'Apresentação da versão anterior',
    fr: 'Présentation de la version précédente', ru: 'Презентация предыдущей версии',
    sv: 'Presentation från föregående version', hr: 'Prezentacija prethodne verzije',
    ar: 'عرض النسخة السابقة', de: 'Präsentation der vorherigen Version',
    sr: 'Презентација претходне верзије', ur: 'پچھلے ورژن کی پریزنٹیشن',
  },

  Legal: {
    en: 'Legal', pt: 'Jurídico', fr: 'Mentions légales', ru: 'Правовая информация', sv: 'Juridik',
    hr: 'Pravno', ar: 'قانوني', de: 'Rechtliches', sr: 'Правно', ur: 'قانونی',
  },

  /* ═══ SEGUNDA TANDA ═══════════════════════════════════════════════
     Salio de MEDIR, no de leer el codigo: se recorrieron las catorce
     secciones con el idioma cambiado y se recogio cada cadena que llegaba
     a `t()` sin traduccion. Por eso incluye lo que estaba dentro de los
     artefactos visuales —rotulos de la maquina, llamadas de los anillos,
     etiquetas de los indicadores— que leyendo las escenas no se ve.
     ═════════════════════════════════════════════════════════════════ */

  /* ── navegacion y sistema ──────────────────────────────────────── */
  Ecosistema: {
    en: 'Ecosystem', pt: 'Ecossistema', fr: 'Écosystème', ru: 'Экосистема',
    sv: 'Ekosystem', hr: 'Ekosustav', ar: 'المنظومة', de: 'Ökosystem',
    sr: 'Екосистем', ur: 'ایکو سسٹم',
  },
  Inteligencia: {
    en: 'Intelligence', pt: 'Inteligência', fr: 'Intelligence', ru: 'Интеллект',
    sv: 'Intelligens', hr: 'Inteligencija', ar: 'الذكاء', de: 'Intelligenz',
    sr: 'Интелигенција', ur: 'انٹیلیجنس',
  },
  'Comunidad G11': {
    en: 'G11 Community', pt: 'Comunidade G11', fr: 'Communauté G11', ru: 'Сообщество G11',
    sv: 'G11-gemenskapen', hr: 'Zajednica G11', ar: 'مجتمع G11', de: 'G11-Community',
    sr: 'Заједница G11', ur: 'G11 کمیونٹی',
  },
  'Únete': {
    en: 'Join', pt: 'Participar', fr: 'Rejoindre', ru: 'Присоединиться',
    sv: 'Gå med', hr: 'Pridruži se', ar: 'انضم', de: 'Mitmachen',
    sr: 'Придружи се', ur: 'شامل ہوں',
  },
  'Abrir menú': {
    en: 'Open menu', pt: 'Abrir menu', fr: 'Ouvrir le menu', ru: 'Открыть меню',
    sv: 'Öppna menyn', hr: 'Otvori izbornik', ar: 'فتح القائمة', de: 'Menü öffnen',
    sr: 'Отвори мени', ur: 'مینو کھولیں',
  },
  Hero: {
    en: 'Home', pt: 'Início', fr: 'Accueil', ru: 'Главная',
    sv: 'Start', hr: 'Početak', ar: 'الرئيسية', de: 'Start',
    sr: 'Почетна', ur: 'ہوم',
  },
  'Portal Final': {
    en: 'Final Portal', pt: 'Portal Final', fr: 'Portail final', ru: 'Финальный портал',
    sv: 'Slutportal', hr: 'Završni portal', ar: 'البوابة النهائية', de: 'Abschlussportal',
    sr: 'Завршни портал', ur: 'حتمی پورٹل',
  },
  'Sección': {
    en: 'Section', pt: 'Seção', fr: 'Section', ru: 'Раздел',
    sv: 'Avsnitt', hr: 'Odjeljak', ar: 'القسم', de: 'Abschnitt',
    sr: 'Одељак', ur: 'سیکشن',
  },
  de: {
    en: 'of', pt: 'de', fr: 'sur', ru: 'из',
    sv: 'av', hr: 'od', ar: 'من', de: 'von',
    sr: 'од', ur: 'میں سے',
  },
  Ver: {
    en: 'View', pt: 'Ver', fr: 'Voir', ru: 'Смотреть',
    sv: 'Visa', hr: 'Prikaži', ar: 'عرض', de: 'Ansehen',
    sr: 'Прикажи', ur: 'دیکھیں',
  },
  'Marcas del ecosistema': {
    en: 'Ecosystem brands', pt: 'Marcas do ecossistema', fr: "Marques de l'écosystème",
    ru: 'Бренды экосистемы', sv: 'Ekosystemets varumärken', hr: 'Marke ekosustava',
    ar: 'علامات المنظومة', de: 'Marken des Ökosystems', sr: 'Брендови екосистема',
    ur: 'ایکو سسٹم برانڈز',
  },

  /* ── hero ──────────────────────────────────────────────────────── */
  'Donde la Inteligencia Artificial y el Blockchain crean': {
    en: 'Where Artificial Intelligence and Blockchain create',
    pt: 'Onde a Inteligência Artificial e o Blockchain criam',
    fr: "Où l'intelligence artificielle et la blockchain créent",
    ru: 'Где искусственный интеллект и блокчейн создают',
    sv: 'Där artificiell intelligens och blockkedjan skapar',
    hr: 'Gdje umjetna inteligencija i blockchain stvaraju',
    ar: 'حيث يصنع الذكاء الاصطناعي والبلوكشين',
    de: 'Wo künstliche Intelligenz und Blockchain',
    sr: 'Где вештачка интелигенција и блокчејн стварају',
    ur: 'جہاں مصنوعی ذہانت اور بلاک چین تخلیق کرتے ہیں',
  },

  /* ── token ─────────────────────────────────────────────────────── */
  'VALOR INTERNO': {
    en: 'INTERNAL VALUE', pt: 'VALOR INTERNO', fr: 'VALEUR INTERNE', ru: 'ВНУТРЕННЯЯ СТОИМОСТЬ',
    sv: 'INTERNT VÄRDE', hr: 'INTERNA VRIJEDNOST', ar: 'القيمة الداخلية', de: 'INTERNER WERT',
    sr: 'ИНТЕРНА ВРЕДНОСТ', ur: 'اندرونی قدر',
  },
  HOLDERS: {
    en: 'HOLDERS', pt: 'DETENTORES', fr: 'DÉTENTEURS', ru: 'ДЕРЖАТЕЛИ',
    sv: 'INNEHAVARE', hr: 'IMATELJI', ar: 'الحائزون', de: 'INHABER',
    sr: 'ВЛАСНИЦИ', ur: 'ہولڈرز',
  },
  'SUPPLY TOTAL': {
    en: 'TOTAL SUPPLY', pt: 'FORNECIMENTO TOTAL', fr: 'OFFRE TOTALE', ru: 'ОБЩАЯ ЭМИССИЯ',
    sv: 'TOTALT UTBUD', hr: 'UKUPNA PONUDA', ar: 'المعروض الكلي', de: 'GESAMTMENGE',
    sr: 'УКУПНА ПОНУДА', ur: 'کل سپلائی',
  },
  RED: {
    en: 'NETWORK', pt: 'REDE', fr: 'RÉSEAU', ru: 'СЕТЬ',
    sv: 'NÄTVERK', hr: 'MREŽA', ar: 'الشبكة', de: 'NETZWERK',
    sr: 'МРЕЖА', ur: 'نیٹ ورک',
  },
  Red: {
    en: 'Network', pt: 'Rede', fr: 'Réseau', ru: 'Сеть',
    sv: 'Nätverk', hr: 'Mreža', ar: 'الشبكة', de: 'Netzwerk',
    sr: 'Мрежа', ur: 'نیٹ ورک',
  },
  'Ver en BSCScan →': {
    en: 'View on BSCScan →', pt: 'Ver na BSCScan →', fr: 'Voir sur BSCScan →',
    ru: 'Смотреть в BSCScan →', sv: 'Visa på BSCScan →', hr: 'Pogledaj na BSCScanu →',
    ar: '→ عرض على BSCScan', de: 'Auf BSCScan ansehen →', sr: 'Погледај на BSCScan-у →',
    ur: 'BSCScan پر دیکھیں ←',
  },

  /* ── mining ────────────────────────────────────────────────────── */
  'Ciclo de emisión': {
    en: 'Emission cycle', pt: 'Ciclo de emissão', fr: "Cycle d'émission", ru: 'Цикл эмиссии',
    sv: 'Emissionscykel', hr: 'Ciklus emisije', ar: 'دورة الإصدار', de: 'Emissionszyklus',
    sr: 'Циклус емисије', ur: 'اجرا کا دور',
  },
  Trazabilidad: {
    en: 'Traceability', pt: 'Rastreabilidade', fr: 'Traçabilité', ru: 'Прослеживаемость',
    sv: 'Spårbarhet', hr: 'Sljedivost', ar: 'إمكانية التتبّع', de: 'Nachverfolgbarkeit',
    sr: 'Следљивост', ur: 'قابلِ سراغ',
  },
  'Red Genesis Mining': {
    en: 'Genesis Mining network', pt: 'Rede Genesis Mining', fr: 'Réseau Genesis Mining',
    ru: 'Сеть Genesis Mining', sv: 'Genesis Mining-nätverket', hr: 'Mreža Genesis Mining',
    ar: 'شبكة Genesis Mining', de: 'Genesis-Mining-Netzwerk', sr: 'Мрежа Genesis Mining',
    ur: 'Genesis Mining نیٹ ورک',
  },

  /* ── confianza ─────────────────────────────────────────────────── */
  'Red distribuida': {
    en: 'Distributed network', pt: 'Rede distribuída', fr: 'Réseau distribué',
    ru: 'Распределённая сеть', sv: 'Distribuerat nätverk', hr: 'Distribuirana mreža',
    ar: 'شبكة موزّعة', de: 'Verteiltes Netzwerk', sr: 'Дистрибуирана мрежа',
    ur: 'تقسیم شدہ نیٹ ورک',
  },
  'Conectividad global segura, sin puntos únicos de falla.': {
    en: 'Secure global connectivity, with no single points of failure.',
    pt: 'Conectividade global segura, sem pontos únicos de falha.',
    fr: 'Connectivité mondiale sécurisée, sans point unique de défaillance.',
    ru: 'Безопасная глобальная связность без единых точек отказа.',
    sv: 'Säker global uppkoppling, utan enskilda felkällor.',
    hr: 'Sigurna globalna povezanost, bez jedinstvenih točaka kvara.',
    ar: 'اتصال عالمي آمن، دون نقاط فشل منفردة.',
    de: 'Sichere globale Konnektivität, ohne einzelne Ausfallpunkte.',
    sr: 'Безбедна глобална повезаност, без јединствених тачака отказа.',
    ur: 'محفوظ عالمی رابطہ، بغیر کسی واحد نقطۂ ناکامی کے۔',
  },
  'Seguridad on-chain': {
    en: 'On-chain security', pt: 'Segurança on-chain', fr: 'Sécurité on-chain',
    ru: 'Безопасность on-chain', sv: 'On-chain-säkerhet', hr: 'On-chain sigurnost',
    ar: 'أمان على السلسلة', de: 'On-Chain-Sicherheit', sr: 'On-chain безбедност',
    ur: 'آن چین سیکیورٹی',
  },
  'Protección criptográfica avanzada y validación descentralizada.': {
    en: 'Advanced cryptographic protection and decentralised validation.',
    pt: 'Proteção criptográfica avançada e validação descentralizada.',
    fr: 'Protection cryptographique avancée et validation décentralisée.',
    ru: 'Продвинутая криптографическая защита и децентрализованная валидация.',
    sv: 'Avancerat kryptografiskt skydd och decentraliserad validering.',
    hr: 'Napredna kriptografska zaštita i decentralizirana validacija.',
    ar: 'حماية تشفيرية متقدّمة وتحقّق لامركزي.',
    de: 'Fortgeschrittener kryptografischer Schutz und dezentrale Validierung.',
    sr: 'Напредна криптографска заштита и децентрализована валидација.',
    ur: 'جدید خفیہ کاری تحفظ اور غیر مرکزی توثیق۔',
  },
  Contratos: {
    en: 'Contracts', pt: 'Contratos', fr: 'Contrats', ru: 'Контракты',
    sv: 'Kontrakt', hr: 'Ugovori', ar: 'العقود', de: 'Verträge',
    sr: 'Уговори', ur: 'کنٹریکٹس',
  },
  'Smart Contracts auditados y verificables. Ejecución justa y automática.': {
    en: 'Audited, verifiable smart contracts. Fair, automatic execution.',
    pt: 'Smart Contracts auditados e verificáveis. Execução justa e automática.',
    fr: 'Smart contracts audités et vérifiables. Exécution équitable et automatique.',
    ru: 'Проверенные и верифицируемые смарт-контракты. Честное автоматическое исполнение.',
    sv: 'Granskade och verifierbara smarta kontrakt. Rättvis och automatisk exekvering.',
    hr: 'Revidirani i provjerljivi pametni ugovori. Pravedno i automatsko izvršavanje.',
    ar: 'عقود ذكية مدقّقة وقابلة للتحقّق. تنفيذ عادل وتلقائي.',
    de: 'Geprüfte und verifizierbare Smart Contracts. Faire, automatische Ausführung.',
    sr: 'Ревидирани и проверљиви паметни уговори. Правично и аутоматско извршење.',
    ur: 'آڈٹ شدہ اور قابلِ تصدیق سمارٹ کنٹریکٹس۔ منصفانہ اور خودکار عمل درآمد۔',
  },
  'Auditoría continua': {
    en: 'Continuous auditing', pt: 'Auditoria contínua', fr: 'Audit continu',
    ru: 'Непрерывный аудит', sv: 'Löpande granskning', hr: 'Kontinuirana revizija',
    ar: 'تدقيق مستمر', de: 'Laufende Prüfung', sr: 'Континуирана ревизија',
    ur: 'مسلسل آڈٹ',
  },
  'Monitoreo permanente en tiempo real. Detección y respuesta inmediata.': {
    en: 'Permanent real-time monitoring. Immediate detection and response.',
    pt: 'Monitoramento permanente em tempo real. Detecção e resposta imediatas.',
    fr: 'Surveillance permanente en temps réel. Détection et réponse immédiates.',
    ru: 'Постоянный мониторинг в реальном времени. Мгновенное обнаружение и реакция.',
    sv: 'Ständig övervakning i realtid. Omedelbar upptäckt och åtgärd.',
    hr: 'Stalni nadzor u stvarnom vremenu. Trenutačno otkrivanje i odgovor.',
    ar: 'مراقبة دائمة في الوقت الحقيقي. كشف واستجابة فوريان.',
    de: 'Permanente Echtzeitüberwachung. Sofortige Erkennung und Reaktion.',
    sr: 'Стални надзор у реалном времену. Тренутно откривање и одговор.',
    ur: 'حقیقی وقت میں مسلسل نگرانی۔ فوری شناخت اور ردِعمل۔',
  },
  'Nodos globales': {
    en: 'Global nodes', pt: 'Nós globais', fr: 'Nœuds mondiaux', ru: 'Глобальные узлы',
    sv: 'Globala noder', hr: 'Globalni čvorovi', ar: 'عُقد عالمية', de: 'Globale Knoten',
    sr: 'Глобални чворови', ur: 'عالمی نوڈز',
  },
  'Infraestructura distribuida en múltiples regiones para máxima disponibilidad.': {
    en: 'Infrastructure distributed across multiple regions for maximum availability.',
    pt: 'Infraestrutura distribuída em várias regiões para máxima disponibilidade.',
    fr: 'Infrastructure répartie sur plusieurs régions pour une disponibilité maximale.',
    ru: 'Инфраструктура распределена по нескольким регионам для максимальной доступности.',
    sv: 'Infrastruktur fördelad över flera regioner för högsta tillgänglighet.',
    hr: 'Infrastruktura raspoređena u više regija za najveću dostupnost.',
    ar: 'بنية تحتية موزّعة على مناطق متعدّدة لأقصى قدر من التوافر.',
    de: 'Infrastruktur über mehrere Regionen verteilt für maximale Verfügbarkeit.',
    sr: 'Инфраструктура распоређена у више региона за максималну доступност.',
    ur: 'زیادہ سے زیادہ دستیابی کے لیے متعدد خطوں میں تقسیم شدہ انفراسٹرکچر۔',
  },
  'Registro inmutable de cada evento. Transparencia total en cada movimiento.': {
    en: 'An immutable record of every event. Full transparency on every movement.',
    pt: 'Registro imutável de cada evento. Transparência total em cada movimento.',
    fr: 'Registre immuable de chaque événement. Transparence totale sur chaque mouvement.',
    ru: 'Неизменяемая запись каждого события. Полная прозрачность каждого движения.',
    sv: 'Oföränderlig registrering av varje händelse. Full insyn i varje rörelse.',
    hr: 'Nepromjenjiv zapis svakog događaja. Potpuna transparentnost svakog kretanja.',
    ar: 'سجلّ غير قابل للتغيير لكل حدث. شفافية كاملة في كل حركة.',
    de: 'Unveränderliche Aufzeichnung jedes Ereignisses. Volle Transparenz bei jeder Bewegung.',
    sr: 'Непроменљив запис сваког догађаја. Потпуна транспарентност сваког кретања.',
    ur: 'ہر واقعے کا ناقابلِ تبدیل ریکارڈ۔ ہر حرکت میں مکمل شفافیت۔',
  },

  /* ── ecosistema ────────────────────────────────────────────────── */
  Pilares: {
    en: 'Pillars', pt: 'Pilares', fr: 'Piliers', ru: 'Основы',
    sv: 'Pelare', hr: 'Stupovi', ar: 'الركائز', de: 'Säulen',
    sr: 'Стубови', ur: 'ستون',
  },
  'El stack': {
    en: 'The stack', pt: 'A stack', fr: 'La stack', ru: 'Стек',
    sv: 'Stacken', hr: 'Stack', ar: 'المنظومة التقنية', de: 'Der Stack',
    sr: 'Стек', ur: 'اسٹیک',
  },
  'Marketplace Global': {
    en: 'Global Marketplace', pt: 'Marketplace Global', fr: 'Marketplace mondial',
    ru: 'Глобальный маркетплейс', sv: 'Global marknadsplats', hr: 'Globalni marketplace',
    ar: 'المتجر العالمي', de: 'Globaler Marketplace', sr: 'Глобални маркетплејс',
    ur: 'عالمی مارکیٹ پلیس',
  },

  /* ── booster ───────────────────────────────────────────────────── */
  'Capa I': {
    en: 'Layer I', pt: 'Camada I', fr: 'Couche I', ru: 'Слой I',
    sv: 'Lager I', hr: 'Sloj I', ar: 'الطبقة I', de: 'Ebene I',
    sr: 'Слој I', ur: 'پرت I',
  },
  'Capa II': {
    en: 'Layer II', pt: 'Camada II', fr: 'Couche II', ru: 'Слой II',
    sv: 'Lager II', hr: 'Sloj II', ar: 'الطبقة II', de: 'Ebene II',
    sr: 'Слој II', ur: 'پرت II',
  },
  'Capa III': {
    en: 'Layer III', pt: 'Camada III', fr: 'Couche III', ru: 'Слой III',
    sv: 'Lager III', hr: 'Sloj III', ar: 'الطبقة III', de: 'Ebene III',
    sr: 'Слој III', ur: 'پرت III',
  },
  'Activación': {
    en: 'Activation', pt: 'Ativação', fr: 'Activation', ru: 'Активация',
    sv: 'Aktivering', hr: 'Aktivacija', ar: 'التفعيل', de: 'Aktivierung',
    sr: 'Активација', ur: 'ایکٹیویشن',
  },
  Multiplicador: {
    en: 'Multiplier', pt: 'Multiplicador', fr: 'Multiplicateur', ru: 'Множитель',
    sv: 'Multiplikator', hr: 'Množitelj', ar: 'المضاعِف', de: 'Multiplikator',
    sr: 'Множилац', ur: 'ضرب کنندہ',
  },
  'Progresión': {
    en: 'Progression', pt: 'Progressão', fr: 'Progression', ru: 'Прогрессия',
    sv: 'Progression', hr: 'Progresija', ar: 'التدرّج', de: 'Progression',
    sr: 'Прогресија', ur: 'پیش رفت',
  },
  'Entras cumpliendo requisitos publicados.': {
    en: 'You enter by meeting published requirements.',
    pt: 'Você entra cumprindo requisitos publicados.',
    fr: 'Vous entrez en remplissant des conditions publiées.',
    ru: 'Вход — при выполнении опубликованных требований.',
    sv: 'Du kommer in genom att uppfylla publicerade krav.',
    hr: 'Ulazite ispunjavanjem objavljenih uvjeta.',
    ar: 'تدخل باستيفاء متطلّبات منشورة.',
    de: 'Der Einstieg erfolgt über veröffentlichte Voraussetzungen.',
    sr: 'Улазите испуњавањем објављених услова.',
    ur: 'شائع شدہ شرائط پوری کر کے داخل ہوتے ہیں۔',
  },
  'El factor sube con la participación sostenida.': {
    en: 'The factor rises with sustained participation.',
    pt: 'O fator sobe com a participação sustentada.',
    fr: 'Le facteur augmente avec une participation soutenue.',
    ru: 'Коэффициент растёт при устойчивом участии.',
    sv: 'Faktorn stiger med uthålligt deltagande.',
    hr: 'Faktor raste s postojanim sudjelovanjem.',
    ar: 'يرتفع المعامل مع المشاركة المستمرّة.',
    de: 'Der Faktor steigt mit anhaltender Teilnahme.',
    sr: 'Фактор расте уз постојано учешће.',
    ur: 'مسلسل شرکت کے ساتھ عنصر بڑھتا ہے۔',
  },
  'Niveles con umbrales y condiciones a la vista.': {
    en: 'Levels with thresholds and conditions in plain sight.',
    pt: 'Níveis com limiares e condições à vista.',
    fr: 'Des niveaux aux seuils et conditions visibles.',
    ru: 'Уровни с открытыми порогами и условиями.',
    sv: 'Nivåer med trösklar och villkor i öppen dager.',
    hr: 'Razine s vidljivim pragovima i uvjetima.',
    ar: 'مستويات بعتبات وشروط ظاهرة.',
    de: 'Stufen mit offen einsehbaren Schwellen und Bedingungen.',
    sr: 'Нивои с видљивим праговима и условима.',
    ur: 'حدود اور شرائط کے ساتھ کھلے درجے۔',
  },
  'Acelerador cuántico Genesis Booster': {
    en: 'Genesis Booster quantum accelerator',
    pt: 'Acelerador quântico Genesis Booster',
    fr: 'Accélérateur quantique Genesis Booster',
    ru: 'Квантовый ускоритель Genesis Booster',
    sv: 'Genesis Booster kvantaccelerator',
    hr: 'Kvantni akcelerator Genesis Booster',
    ar: 'مسرّع Genesis Booster الكمّي',
    de: 'Genesis-Booster-Quantenbeschleuniger',
    sr: 'Квантни акцелератор Genesis Booster',
    ur: 'Genesis Booster کوانٹم ایکسیلریٹر',
  },

  /* ── staking ───────────────────────────────────────────────────── */
  'Staking articula periodos de participación, estabilidad y alineación con el ecosistema AiGenesis. Un pilar independiente con reglas propias y trazabilidad on-chain.': {
    en: 'Staking articulates periods of participation, stability and alignment with the AiGenesis ecosystem. An independent pillar with its own rules and on-chain traceability.',
    pt: 'O Staking articula períodos de participação, estabilidade e alinhamento com o ecossistema AiGenesis. Um pilar independente com regras próprias e rastreabilidade on-chain.',
    fr: "Le staking articule des périodes de participation, de stabilité et d'alignement avec l'écosystème AiGenesis. Un pilier indépendant doté de ses propres règles et d'une traçabilité on-chain.",
    ru: 'Стейкинг задаёт периоды участия, стабильности и согласованности с экосистемой AiGenesis. Самостоятельная опора с собственными правилами и прослеживаемостью on-chain.',
    sv: 'Staking strukturerar perioder av deltagande, stabilitet och samspel med AiGenesis ekosystem. En fristående pelare med egna regler och spårbarhet on-chain.',
    hr: 'Staking uređuje razdoblja sudjelovanja, stabilnosti i usklađenosti s ekosustavom AiGenesis. Samostalan stup s vlastitim pravilima i on-chain sljedivošću.',
    ar: 'يُنظّم الستيكينغ فترات المشاركة والاستقرار والتوافق مع منظومة AiGenesis. ركيزة مستقلّة بقواعد خاصّة وتتبّع على السلسلة.',
    de: 'Staking strukturiert Zeiträume der Teilnahme, Stabilität und Ausrichtung am AiGenesis-Ökosystem. Eine eigenständige Säule mit eigenen Regeln und On-Chain-Nachverfolgbarkeit.',
    sr: 'Стејкинг уређује периоде учешћа, стабилности и усклађености с екосистемом AiGenesis. Самосталан стуб са сопственим правилима и on-chain следљивошћу.',
    ur: 'اسٹیکنگ شرکت، استحکام اور AiGenesis ایکو سسٹم کے ساتھ ہم آہنگی کے ادوار کو ترتیب دیتی ہے۔ اپنے قواعد اور آن چین قابلِ سراغ کے ساتھ ایک خودمختار ستون۔',
  },
  'Compromiso flexible': {
    en: 'Flexible commitment', pt: 'Compromisso flexível', fr: 'Engagement flexible',
    ru: 'Гибкое обязательство', sv: 'Flexibelt åtagande', hr: 'Fleksibilna obveza',
    ar: 'التزام مرن', de: 'Flexible Bindung', sr: 'Флексибилна обавеза',
    ur: 'لچکدار وابستگی',
  },
  'Periodos definidos con condiciones transparentes de participación y liberación.': {
    en: 'Defined periods with transparent participation and release conditions.',
    pt: 'Períodos definidos com condições transparentes de participação e liberação.',
    fr: 'Des périodes définies avec des conditions transparentes de participation et de libération.',
    ru: 'Определённые периоды с прозрачными условиями участия и разблокировки.',
    sv: 'Definierade perioder med transparenta villkor för deltagande och frisläppning.',
    hr: 'Definirana razdoblja s transparentnim uvjetima sudjelovanja i oslobađanja.',
    ar: 'فترات محدّدة بشروط شفافة للمشاركة والإفراج.',
    de: 'Definierte Zeiträume mit transparenten Teilnahme- und Freigabebedingungen.',
    sr: 'Дефинисани периоди с транспарентним условима учешћа и ослобађања.',
    ur: 'شرکت اور رہائی کی شفاف شرائط کے ساتھ متعین ادوار۔',
  },
  'Estabilidad del ecosistema': {
    en: 'Ecosystem stability', pt: 'Estabilidade do ecossistema', fr: "Stabilité de l'écosystème",
    ru: 'Стабильность экосистемы', sv: 'Ekosystemets stabilitet', hr: 'Stabilnost ekosustava',
    ar: 'استقرار المنظومة', de: 'Stabilität des Ökosystems', sr: 'Стабилност екосистема',
    ur: 'ایکو سسٹم کا استحکام',
  },
  'Staking fortalece la liquidez interna y la continuidad operativa del protocolo.': {
    en: "Staking strengthens the protocol's internal liquidity and operational continuity.",
    pt: 'O Staking fortalece a liquidez interna e a continuidade operacional do protocolo.',
    fr: "Le staking renforce la liquidité interne et la continuité opérationnelle du protocole.",
    ru: 'Стейкинг укрепляет внутреннюю ликвидность и операционную непрерывность протокола.',
    sv: 'Staking stärker protokollets interna likviditet och operativa kontinuitet.',
    hr: 'Staking jača internu likvidnost i operativni kontinuitet protokola.',
    ar: 'يعزّز الستيكينغ السيولة الداخلية والاستمرارية التشغيلية للبروتوكول.',
    de: 'Staking stärkt die interne Liquidität und die operative Kontinuität des Protokolls.',
    sr: 'Стејкинг јача интерну ликвидност и оперативни континуитет протокола.',
    ur: 'اسٹیکنگ پروٹوکول کی اندرونی لیکویڈیٹی اور عملی تسلسل کو مضبوط کرتی ہے۔',
  },
  'Participación sostenida': {
    en: 'Sustained participation', pt: 'Participação sustentada', fr: 'Participation soutenue',
    ru: 'Устойчивое участие', sv: 'Uthålligt deltagande', hr: 'Postojano sudjelovanje',
    ar: 'مشاركة مستمرّة', de: 'Anhaltende Teilnahme', sr: 'Постојано учешће',
    ur: 'مسلسل شرکت',
  },
  'Incentivos alineados con permanencia — sin garantías de rendimiento financiero.': {
    en: 'Incentives aligned with permanence — no guarantees of financial return.',
    pt: 'Incentivos alinhados à permanência — sem garantias de rendimento financeiro.',
    fr: "Des incitations alignées sur la durée — sans garantie de rendement financier.",
    ru: 'Стимулы согласованы с длительностью участия — без гарантий финансовой доходности.',
    sv: 'Incitament i linje med varaktighet — utan garantier om finansiell avkastning.',
    hr: 'Poticaji usklađeni s trajnošću — bez jamstva financijskog prinosa.',
    ar: 'حوافز متوائمة مع الاستمرارية — دون ضمانات لعائد مالي.',
    de: 'Anreize im Einklang mit Beständigkeit — ohne Garantie auf finanzielle Rendite.',
    sr: 'Подстицаји усклађени с трајношћу — без гаранција финансијског приноса.',
    ur: 'دوام سے ہم آہنگ ترغیبات — مالی منافع کی کوئی ضمانت نہیں۔',
  },

  /* ── g-pulse ───────────────────────────────────────────────────── */
  ' /día': {
    en: ' /day', pt: ' /dia', fr: ' /jour', ru: ' /день',
    sv: ' /dag', hr: ' /dan', ar: ' /يوم', de: ' /Tag',
    sr: ' /дан', ur: ' /یومیہ',
  },
  ' activas': {
    en: ' active', pt: ' ativas', fr: ' actives', ru: ' активных',
    sv: ' aktiva', hr: ' aktivnih', ar: ' نشِطة', de: ' aktiv',
    sr: ' активних', ur: ' فعال',
  },
  'SEÑALES DIARIAS': {
    en: 'DAILY SIGNALS', pt: 'SINAIS DIÁRIOS', fr: 'SIGNAUX QUOTIDIENS', ru: 'СИГНАЛОВ В ДЕНЬ',
    sv: 'DAGLIGA SIGNALER', hr: 'DNEVNI SIGNALI', ar: 'إشارات يومية', de: 'TÄGLICHE SIGNALE',
    sr: 'ДНЕВНИ СИГНАЛИ', ur: 'روزانہ سگنلز',
  },
  MESAS: {
    en: 'DESKS', pt: 'MESAS', fr: 'PUPITRES', ru: 'ТОРГОВЫЕ СТОЛЫ',
    sv: 'BORD', hr: 'STOLOVI', ar: 'المكاتب', de: 'DESKS',
    sr: 'СТОЛОВИ', ur: 'ڈیسکس',
  },

  /* ── g-oracle ──────────────────────────────────────────────────── */
  'G-Oracle es la capa de inteligencia que interpreta, conecta y gobierna el flujo de información. GPulse entrega señales; G-Oracle define la inteligencia estratégica del protocolo.': {
    en: 'G-Oracle is the intelligence layer that interprets, connects and governs the flow of information. GPulse delivers signals; G-Oracle defines the protocol’s strategic intelligence.',
    pt: 'O G-Oracle é a camada de inteligência que interpreta, conecta e governa o fluxo de informação. O GPulse entrega sinais; o G-Oracle define a inteligência estratégica do protocolo.',
    fr: "G-Oracle est la couche d'intelligence qui interprète, relie et gouverne le flux d'information. GPulse fournit les signaux ; G-Oracle définit l'intelligence stratégique du protocole.",
    ru: 'G-Oracle — это интеллектуальный слой, который интерпретирует, связывает и управляет потоком информации. GPulse выдаёт сигналы; G-Oracle определяет стратегический интеллект протокола.',
    sv: 'G-Oracle är intelligenslagret som tolkar, kopplar samman och styr informationsflödet. GPulse levererar signaler; G-Oracle definierar protokollets strategiska intelligens.',
    hr: 'G-Oracle je sloj inteligencije koji tumači, povezuje i upravlja tokom informacija. GPulse isporučuje signale; G-Oracle definira stratešku inteligenciju protokola.',
    ar: 'G-Oracle هو طبقة الذكاء التي تفسّر تدفّق المعلومات وتربطه وتحكمه. يقدّم GPulse الإشارات؛ ويحدّد G-Oracle الذكاء الاستراتيجي للبروتوكول.',
    de: 'G-Oracle ist die Intelligenzschicht, die den Informationsfluss deutet, verbindet und steuert. GPulse liefert Signale; G-Oracle bestimmt die strategische Intelligenz des Protokolls.',
    sr: 'G-Oracle је слој интелигенције који тумачи, повезује и управља током информација. GPulse испоручује сигнале; G-Oracle дефинише стратешку интелигенцију протокола.',
    ur: 'G-Oracle وہ انٹیلیجنس پرت ہے جو معلومات کے بہاؤ کی تشریح، ربط اور نگرانی کرتی ہے۔ GPulse سگنلز دیتا ہے؛ G-Oracle پروٹوکول کی حکمتِ عملی طے کرتا ہے۔',
  },
  'Inteligencia central': {
    en: 'Central intelligence', pt: 'Inteligência central', fr: 'Intelligence centrale',
    ru: 'Центральный интеллект', sv: 'Central intelligens', hr: 'Središnja inteligencija',
    ar: 'الذكاء المركزي', de: 'Zentrale Intelligenz', sr: 'Централна интелигенција',
    ur: 'مرکزی انٹیلیجنس',
  },
  'Procesa y correlaciona los datos del ecosistema.': {
    en: 'It processes and correlates the ecosystem’s data.',
    pt: 'Processa e correlaciona os dados do ecossistema.',
    fr: "Il traite et met en corrélation les données de l'écosystème.",
    ru: 'Обрабатывает и сопоставляет данные экосистемы.',
    sv: 'Bearbetar och korrelerar ekosystemets data.',
    hr: 'Obrađuje i povezuje podatke ekosustava.',
    ar: 'يعالج بيانات المنظومة ويربط بينها.',
    de: 'Verarbeitet und korreliert die Daten des Ökosystems.',
    sr: 'Обрађује и повезује податке екосистема.',
    ur: 'ایکو سسٹم کے ڈیٹا کو پروسیس اور مربوط کرتا ہے۔',
  },
  'Motor G-BRIDGE': {
    en: 'G-BRIDGE engine', pt: 'Motor G-BRIDGE', fr: 'Moteur G-BRIDGE',
    ru: 'Движок G-BRIDGE', sv: 'G-BRIDGE-motor', hr: 'G-BRIDGE motor',
    ar: 'محرّك G-BRIDGE', de: 'G-BRIDGE-Engine', sr: 'G-BRIDGE мотор',
    ur: 'G-BRIDGE انجن',
  },
  'IA propietaria para análisis profundo — no es el flujo de señales de GPulse.': {
    en: 'Proprietary AI for deep analysis — not the GPulse signal feed.',
    pt: 'IA proprietária para análise profunda — não é o fluxo de sinais do GPulse.',
    fr: "IA propriétaire pour l'analyse approfondie — ce n'est pas le flux de signaux de GPulse.",
    ru: 'Собственный ИИ для глубокого анализа — это не поток сигналов GPulse.',
    sv: 'Egenutvecklad AI för djupanalys — inte GPulse signalflöde.',
    hr: 'Vlastita umjetna inteligencija za dubinsku analizu — nije tok signala GPulsea.',
    ar: 'ذكاء اصطناعي خاص للتحليل العميق — وليس تدفّق إشارات GPulse.',
    de: 'Eigene KI für Tiefenanalysen — nicht der Signalstrom von GPulse.',
    sr: 'Сопствена вештачка интелигенција за дубинску анализу — није ток сигнала GPulsea.',
    ur: 'گہرے تجزیے کے لیے اپنی AI — یہ GPulse کا سگنل بہاؤ نہیں۔',
  },
  'Centro neurálgico': {
    en: 'Nerve centre', pt: 'Centro nevrálgico', fr: 'Centre névralgique',
    ru: 'Нервный центр', sv: 'Nervcentrum', hr: 'Živčano središte',
    ar: 'مركز الأعصاب', de: 'Nervenzentrum', sr: 'Нервно средиште',
    ur: 'اعصابی مرکز',
  },
  'Orquesta la información entre productos y protocolos.': {
    en: 'It orchestrates information across products and protocols.',
    pt: 'Orquestra a informação entre produtos e protocolos.',
    fr: "Il orchestre l'information entre produits et protocoles.",
    ru: 'Оркеструет информацию между продуктами и протоколами.',
    sv: 'Orkestrerar information mellan produkter och protokoll.',
    hr: 'Orkestrira informacije među proizvodima i protokolima.',
    ar: 'ينسّق المعلومات بين المنتجات والبروتوكولات.',
    de: 'Orchestriert Informationen zwischen Produkten und Protokollen.',
    sr: 'Оркестрира информације међу производима и протоколима.',
    ur: 'مصنوعات اور پروٹوکولز کے درمیان معلومات کو مربوط کرتا ہے۔',
  },

  /* ── marketplace y comunidad ───────────────────────────────────── */
  PRODUCTOS: {
    en: 'PRODUCTS', pt: 'PRODUTOS', fr: 'PRODUITS', ru: 'ТОВАРЫ',
    sv: 'PRODUKTER', hr: 'PROIZVODI', ar: 'المنتجات', de: 'PRODUKTE',
    sr: 'ПРОИЗВОДИ', ur: 'مصنوعات',
  },
  'PAÍSES DE ALCANCE': {
    en: 'COUNTRIES REACHED', pt: 'PAÍSES DE ALCANCE', fr: 'PAYS COUVERTS',
    ru: 'СТРАН ОХВАТА', sv: 'LÄNDER SOM NÅS', hr: 'OBUHVAĆENE ZEMLJE',
    ar: 'الدول المشمولة', de: 'ERREICHTE LÄNDER', sr: 'ОБУХВАЋЕНЕ ЗЕМЉЕ',
    ur: 'رسائی والے ممالک',
  },
  'PAÍSES': {
    en: 'COUNTRIES', pt: 'PAÍSES', fr: 'PAYS', ru: 'СТРАНЫ',
    sv: 'LÄNDER', hr: 'ZEMLJE', ar: 'الدول', de: 'LÄNDER',
    sr: 'ЗЕМЉЕ', ur: 'ممالک',
  },
  'MIEMBROS ACTIVOS': {
    en: 'ACTIVE MEMBERS', pt: 'MEMBROS ATIVOS', fr: 'MEMBRES ACTIFS', ru: 'АКТИВНЫХ УЧАСТНИКОВ',
    sv: 'AKTIVA MEDLEMMAR', hr: 'AKTIVNI ČLANOVI', ar: 'الأعضاء النشطون', de: 'AKTIVE MITGLIEDER',
    sr: 'АКТИВНИ ЧЛАНОВИ', ur: 'فعال ارکان',
  },
  DISTRIBUIDOS: {
    en: 'DISTRIBUTED', pt: 'DISTRIBUÍDOS', fr: 'DISTRIBUÉS', ru: 'РАСПРЕДЕЛЕНО',
    sv: 'UTDELAT', hr: 'RASPODIJELJENO', ar: 'موزّعة', de: 'AUSGESCHÜTTET',
    sr: 'РАСПОДЕЉЕНО', ur: 'تقسیم شدہ',
  },
  'Global Pool Top Ranks': {
    en: 'Global Top Ranks pool', pt: 'Fundo global dos rangos mais altos',
    fr: 'Fonds mondial des rangs supérieurs', ru: 'Глобальный фонд высших рангов',
    sv: 'Global pool för toppnivåer', hr: 'Globalni fond najviših rangova',
    ar: 'الصندوق العالمي لأعلى الرتب', de: 'Globaler Pool der Spitzenränge',
    sr: 'Глобални фонд највиших рангова', ur: 'اعلیٰ درجات کا عالمی پول',
  },

  /* ── tecnologia: rotulos y llamadas de la maquina ──────────────── */
  /* El rotulo del anillo de la maquina: acronimo, uno por lengua. */
  IA: {
    en: 'AI', pt: 'IA', fr: 'IA', ru: 'ИИ',
    sv: 'AI', hr: 'UI', ar: 'ذكاء اصطناعي', de: 'KI',
    sr: 'ВИ', ur: 'AI',
  },
  BACKEND: {
    en: 'BACKEND', pt: 'BACKEND', fr: 'BACKEND', ru: 'БЭКЕНД',
    sv: 'BACKEND', hr: 'BACKEND', ar: 'الواجهة الخلفية', de: 'BACKEND',
    sr: 'БЕКЕНД', ur: 'بیک اینڈ',
  },
  INFRAESTRUCTURA: {
    en: 'INFRASTRUCTURE', pt: 'INFRAESTRUTURA', fr: 'INFRASTRUCTURE', ru: 'ИНФРАСТРУКТУРА',
    sv: 'INFRASTRUKTUR', hr: 'INFRASTRUKTURA', ar: 'البنية التحتية', de: 'INFRASTRUKTUR',
    sr: 'ИНФРАСТРУКТУРА', ur: 'انفراسٹرکچر',
  },
  APLICACIONES: {
    en: 'APPLICATIONS', pt: 'APLICAÇÕES', fr: 'APPLICATIONS', ru: 'ПРИЛОЖЕНИЯ',
    sv: 'APPLIKATIONER', hr: 'APLIKACIJE', ar: 'التطبيقات', de: 'ANWENDUNGEN',
    sr: 'АПЛИКАЦИЈЕ', ur: 'ایپلیکیشنز',
  },
  LATENCIA: {
    en: 'LATENCY', pt: 'LATÊNCIA', fr: 'LATENCE', ru: 'ЗАДЕРЖКА',
    sv: 'LATENS', hr: 'LATENCIJA', ar: 'زمن الاستجابة', de: 'LATENZ',
    sr: 'ЛАТЕНЦИЈА', ur: 'تاخیر',
  },
  MONITOREO: {
    en: 'MONITORING', pt: 'MONITORAMENTO', fr: 'SURVEILLANCE', ru: 'МОНИТОРИНГ',
    sv: 'ÖVERVAKNING', hr: 'NADZOR', ar: 'المراقبة', de: 'ÜBERWACHUNG',
    sr: 'НАДЗОР', ur: 'نگرانی',
  },
  'Servicios y APIs': {
    en: 'Services and APIs', pt: 'Serviços e APIs', fr: 'Services et API',
    ru: 'Сервисы и API', sv: 'Tjänster och API:er', hr: 'Usluge i API-ji',
    ar: 'الخدمات وواجهات البرمجة', de: 'Dienste und APIs', sr: 'Услуге и API-ји',
    ur: 'سروسز اور APIs',
  },
  'APIs robustas, eventos en tiempo real y microservicios modulares.': {
    en: 'Robust APIs, real-time events and modular microservices.',
    pt: 'APIs robustas, eventos em tempo real e microsserviços modulares.',
    fr: 'Des API robustes, des événements en temps réel et des microservices modulaires.',
    ru: 'Надёжные API, события в реальном времени и модульные микросервисы.',
    sv: 'Robusta API:er, händelser i realtid och modulära mikrotjänster.',
    hr: 'Robusni API-ji, događaji u stvarnom vremenu i modularni mikroservisi.',
    ar: 'واجهات برمجة متينة وأحداث فورية وخدمات مصغّرة معيارية.',
    de: 'Robuste APIs, Echtzeit-Events und modulare Microservices.',
    sr: 'Робусни API-ји, догађаји у реалном времену и модуларни микросервиси.',
    ur: 'مضبوط APIs، حقیقی وقت کے ایونٹس اور ماڈیولر مائیکرو سروسز۔',
  },
  'Infraestructura distribuida': {
    en: 'Distributed infrastructure', pt: 'Infraestrutura distribuída',
    fr: 'Infrastructure distribuée', ru: 'Распределённая инфраструктура',
    sv: 'Distribuerad infrastruktur', hr: 'Distribuirana infrastruktura',
    ar: 'بنية تحتية موزّعة', de: 'Verteilte Infrastruktur',
    sr: 'Дистрибуирана инфраструктура', ur: 'تقسیم شدہ انفراسٹرکچر',
  },
  'Escalable, redundante y preparada para millones de interacciones.': {
    en: 'Scalable, redundant and ready for millions of interactions.',
    pt: 'Escalável, redundante e preparada para milhões de interações.',
    fr: "Évolutive, redondante et prête pour des millions d'interactions.",
    ru: 'Масштабируемая, отказоустойчивая и готовая к миллионам взаимодействий.',
    sv: 'Skalbar, redundant och redo för miljontals interaktioner.',
    hr: 'Skalabilna, redundantna i spremna za milijune interakcija.',
    ar: 'قابلة للتوسّع وزائدة التكرار وجاهزة لملايين التفاعلات.',
    de: 'Skalierbar, redundant und bereit für Millionen von Interaktionen.',
    sr: 'Скалабилна, редундантна и спремна за милионе интеракција.',
    ur: 'قابلِ توسیع، اضافی اور لاکھوں تعاملات کے لیے تیار۔',
  },
  'Inteligencia artificial': {
    en: 'Artificial intelligence', pt: 'Inteligência artificial', fr: 'Intelligence artificielle',
    ru: 'Искусственный интеллект', sv: 'Artificiell intelligens', hr: 'Umjetna inteligencija',
    ar: 'الذكاء الاصطناعي', de: 'Künstliche Intelligenz', sr: 'Вештачка интелигенција',
    ur: 'مصنوعی ذہانت',
  },
  'Motor propietario que aprende, predice y optimiza en tiempo real.': {
    en: 'A proprietary engine that learns, predicts and optimises in real time.',
    pt: 'Motor proprietário que aprende, prevê e otimiza em tempo real.',
    fr: 'Un moteur propriétaire qui apprend, prédit et optimise en temps réel.',
    ru: 'Собственный движок, который учится, прогнозирует и оптимизирует в реальном времени.',
    sv: 'En egenutvecklad motor som lär sig, förutsäger och optimerar i realtid.',
    hr: 'Vlastiti motor koji uči, predviđa i optimizira u stvarnom vremenu.',
    ar: 'محرّك خاص يتعلّم ويتنبّأ ويحسّن في الوقت الحقيقي.',
    de: 'Eine eigene Engine, die in Echtzeit lernt, vorhersagt und optimiert.',
    sr: 'Сопствени мотор који учи, предвиђа и оптимизује у реалном времену.',
    ur: 'ایک اپنا انجن جو حقیقی وقت میں سیکھتا، پیش گوئی اور بہتری کرتا ہے۔',
  },
  'Inmutable y descentralizado': {
    en: 'Immutable and decentralised', pt: 'Imutável e descentralizado',
    fr: 'Immuable et décentralisé', ru: 'Неизменяемый и децентрализованный',
    sv: 'Oföränderlig och decentraliserad', hr: 'Nepromjenjiv i decentraliziran',
    ar: 'غير قابل للتغيير ولامركزي', de: 'Unveränderlich und dezentral',
    sr: 'Непроменљив и децентрализован', ur: 'ناقابلِ تبدیل اور غیر مرکزی',
  },
  'Transacciones verificables, registros transparentes y sin puntos de falla.': {
    en: 'Verifiable transactions, transparent records and no points of failure.',
    pt: 'Transações verificáveis, registros transparentes e sem pontos de falha.',
    fr: 'Des transactions vérifiables, des registres transparents et aucun point de défaillance.',
    ru: 'Проверяемые транзакции, прозрачные записи и отсутствие точек отказа.',
    sv: 'Verifierbara transaktioner, transparenta register och inga felkällor.',
    hr: 'Provjerljive transakcije, transparentni zapisi i bez točaka kvara.',
    ar: 'معاملات قابلة للتحقّق وسجلّات شفافة ودون نقاط فشل.',
    de: 'Überprüfbare Transaktionen, transparente Aufzeichnungen und keine Ausfallpunkte.',
    sr: 'Проверљиве трансакције, транспарентни записи и без тачака отказа.',
    ur: 'قابلِ تصدیق لین دین، شفاف ریکارڈ اور بغیر نقطۂ ناکامی۔',
  },
  'Aplicaciones inteligentes': {
    en: 'Intelligent applications', pt: 'Aplicações inteligentes', fr: 'Applications intelligentes',
    ru: 'Умные приложения', sv: 'Intelligenta applikationer', hr: 'Inteligentne aplikacije',
    ar: 'تطبيقات ذكية', de: 'Intelligente Anwendungen', sr: 'Интелигентне апликације',
    ur: 'ذہین ایپلیکیشنز',
  },
  'Interfaces descentralizadas, experiencias fluidas y seguras.': {
    en: 'Decentralised interfaces, fluid and secure experiences.',
    pt: 'Interfaces descentralizadas, experiências fluidas e seguras.',
    fr: 'Des interfaces décentralisées, des expériences fluides et sûres.',
    ru: 'Децентрализованные интерфейсы, плавный и безопасный опыт.',
    sv: 'Decentraliserade gränssnitt, smidiga och säkra upplevelser.',
    hr: 'Decentralizirana sučelja, tečna i sigurna iskustva.',
    ar: 'واجهات لامركزية وتجارب سلسة وآمنة.',
    de: 'Dezentrale Schnittstellen, flüssige und sichere Erlebnisse.',
    sr: 'Децентрализовани интерфејси, течна и безбедна искуства.',
    ur: 'غیر مرکزی انٹرفیسز، رواں اور محفوظ تجربات۔',
  },

  /* ── roadmap ───────────────────────────────────────────────────── */
  'Hitos del recorrido': {
    en: 'Milestones along the way', pt: 'Marcos do percurso', fr: 'Jalons du parcours',
    ru: 'Вехи пути', sv: 'Milstolpar längs vägen', hr: 'Prekretnice puta',
    ar: 'محطّات المسار', de: 'Meilensteine des Wegs', sr: 'Прекретнице пута',
    ur: 'سفر کے سنگِ میل',
  },
  'Lanzamiento AiGenesis': {
    en: 'AiGenesis launch', pt: 'Lançamento AiGenesis', fr: 'Lancement AiGenesis',
    ru: 'Запуск AiGenesis', sv: 'AiGenesis-lansering', hr: 'Lansiranje AiGenesisa',
    ar: 'إطلاق AiGenesis', de: 'AiGenesis-Start', sr: 'Лансирање AiGenesisa',
    ur: 'AiGenesis کا آغاز',
  },

  /* ── cierre y pie ──────────────────────────────────────────────── */
  '¿Listo para ser parte': {
    en: 'Ready to be part', pt: 'Pronto para fazer parte', fr: 'Prêt à faire partie',
    ru: 'Готовы стать частью', sv: 'Redo att bli en del', hr: 'Spremni biti dio',
    ar: 'هل أنت مستعدّ لتكون جزءاً', de: 'Bereit, Teil zu sein',
    sr: 'Спремни да будете део', ur: 'حصہ بننے کو تیار',
  },
  Contact: {
    en: 'Contact', pt: 'Contato', fr: 'Contact', ru: 'Контакты',
    sv: 'Kontakt', hr: 'Kontakt', ar: 'اتصل بنا', de: 'Kontakt',
    sr: 'Контакт', ur: 'رابطہ',
  },
  Privacy: {
    en: 'Privacy', pt: 'Privacidade', fr: 'Confidentialité', ru: 'Конфиденциальность',
    sv: 'Integritet', hr: 'Privatnost', ar: 'الخصوصية', de: 'Datenschutz',
    sr: 'Приватност', ur: 'رازداری',
  },
  '© 2026 AiGenesis. All rights reserved.': {
    en: '© 2026 AiGenesis. All rights reserved.',
    pt: '© 2026 AiGenesis. Todos os direitos reservados.',
    fr: '© 2026 AiGenesis. Tous droits réservés.',
    ru: '© 2026 AiGenesis. Все права защищены.',
    sv: '© 2026 AiGenesis. Alla rättigheter förbehållna.',
    hr: '© 2026 AiGenesis. Sva prava pridržana.',
    ar: '© 2026 AiGenesis. جميع الحقوق محفوظة.',
    de: '© 2026 AiGenesis. Alle Rechte vorbehalten.',
    sr: '© 2026 AiGenesis. Сва права задржана.',
    ur: '© 2026 AiGenesis۔ جملہ حقوق محفوظ ہیں۔',
  },
  'AiGenesis involucra activos digitales y tecnologías blockchain. La participación puede implicar riesgos tecnológicos, regulatorios y de mercado. Ningún contenido debe interpretarse como garantía de rendimiento financiero.': {
    en: 'AiGenesis involves digital assets and blockchain technologies. Participation may carry technological, regulatory and market risks. No content should be read as a guarantee of financial return.',
    pt: 'A AiGenesis envolve ativos digitais e tecnologias blockchain. A participação pode implicar riscos tecnológicos, regulatórios e de mercado. Nenhum conteúdo deve ser interpretado como garantia de rendimento financeiro.',
    fr: "AiGenesis fait intervenir des actifs numériques et des technologies blockchain. La participation peut comporter des risques technologiques, réglementaires et de marché. Aucun contenu ne doit être interprété comme une garantie de rendement financier.",
    ru: 'AiGenesis связан с цифровыми активами и блокчейн-технологиями. Участие может нести технологические, регуляторные и рыночные риски. Никакое содержание не следует толковать как гарантию финансовой доходности.',
    sv: 'AiGenesis omfattar digitala tillgångar och blockkedjeteknik. Deltagande kan innebära tekniska, regulatoriska och marknadsmässiga risker. Inget innehåll ska tolkas som en garanti för finansiell avkastning.',
    hr: 'AiGenesis uključuje digitalnu imovinu i blockchain tehnologije. Sudjelovanje može nositi tehnološke, regulatorne i tržišne rizike. Nijedan sadržaj ne smije se tumačiti kao jamstvo financijskog prinosa.',
    ar: 'تتضمّن AiGenesis أصولاً رقمية وتقنيات بلوكشين. قد تنطوي المشاركة على مخاطر تقنية وتنظيمية وسوقية. لا يجوز تفسير أي محتوى على أنه ضمان لعائد مالي.',
    de: 'AiGenesis umfasst digitale Vermögenswerte und Blockchain-Technologien. Die Teilnahme kann technologische, regulatorische und Marktrisiken bergen. Kein Inhalt ist als Garantie für eine finanzielle Rendite zu verstehen.',
    sr: 'AiGenesis укључује дигиталну имовину и блокчејн технологије. Учешће може носити технолошке, регулаторне и тржишне ризике. Ниједан садржај не сме се тумачити као гаранција финансијског приноса.',
    ur: 'AiGenesis ڈیجیٹل اثاثوں اور بلاک چین ٹیکنالوجیز پر مشتمل ہے۔ شرکت میں تکنیکی، ضابطہ جاتی اور مارکیٹ کے خطرات ہو سکتے ہیں۔ کسی مواد کو مالی منافع کی ضمانت نہ سمجھا جائے۔',
  },

  /* ── mining: tarjetas del recorrido ────────────────────────────── */
  'Emisión': {
    en: 'Emission', pt: 'Emissão', fr: 'Émission', ru: 'Эмиссия',
    sv: 'Emission', hr: 'Emisija', ar: 'الإصدار', de: 'Emission',
    sr: 'Емисија', ur: 'اجرا',
  },
  'Emisión programada': {
    en: 'Scheduled emission', pt: 'Emissão programada', fr: 'Émission programmée',
    ru: 'Плановая эмиссия', sv: 'Schemalagd emission', hr: 'Planirana emisija',
    ar: 'إصدار مُجدوَل', de: 'Geplante Emission', sr: 'Планирана емисија',
    ur: 'شیڈول شدہ اجرا',
  },
  'Distribución on-chain con calendario transparente y reglas públicas de participación.': {
    en: 'On-chain distribution with a transparent calendar and public participation rules.',
    pt: 'Distribuição on-chain com calendário transparente e regras públicas de participação.',
    fr: "Distribution on-chain avec un calendrier transparent et des règles de participation publiques.",
    ru: 'Распределение on-chain с прозрачным календарём и публичными правилами участия.',
    sv: 'On-chain-distribution med transparent kalender och offentliga deltagarregler.',
    hr: 'On-chain distribucija s transparentnim kalendarom i javnim pravilima sudjelovanja.',
    ar: 'توزيع على السلسلة بجدول شفّاف وقواعد مشاركة معلنة.',
    de: 'On-Chain-Verteilung mit transparentem Kalender und öffentlichen Teilnahmeregeln.',
    sr: 'On-chain дистрибуција с транспарентним календаром и јавним правилима учешћа.',
    ur: 'شفاف کیلنڈر اور عوامی شرکت کے قواعد کے ساتھ آن چین تقسیم۔',
  },
  'Participación activa': {
    en: 'Active participation', pt: 'Participação ativa', fr: 'Participation active',
    ru: 'Активное участие', sv: 'Aktivt deltagande', hr: 'Aktivno sudjelovanje',
    ar: 'مشاركة نشِطة', de: 'Aktive Teilnahme', sr: 'Активно учешће',
    ur: 'فعال شرکت',
  },
  'El motor de Mining conecta a los participantes con la capa de emisión del ecosistema.': {
    en: 'The Mining engine connects participants with the ecosystem’s emission layer.',
    pt: 'O motor de Mining conecta os participantes à camada de emissão do ecossistema.',
    fr: "Le moteur de Mining relie les participants à la couche d'émission de l'écosystème.",
    ru: 'Движок Mining связывает участников с эмиссионным слоем экосистемы.',
    sv: 'Mining-motorn kopplar deltagarna till ekosystemets emissionslager.',
    hr: 'Mining motor povezuje sudionike s emisijskim slojem ekosustava.',
    ar: 'يربط محرّك Mining المشاركين بطبقة الإصدار في المنظومة.',
    de: 'Die Mining-Engine verbindet Teilnehmende mit der Emissionsschicht des Ökosystems.',
    sr: 'Mining мотор повезује учеснике с емисионим слојем екосистема.',
    ur: 'Mining انجن شرکاء کو ایکو سسٹم کی اجرا پرت سے جوڑتا ہے۔',
  },
  'Distribución equitativa': {
    en: 'Equitable distribution', pt: 'Distribuição equitativa', fr: 'Distribution équitable',
    ru: 'Справедливое распределение', sv: 'Rättvis fördelning', hr: 'Pravedna raspodjela',
    ar: 'توزيع عادل', de: 'Gerechte Verteilung', sr: 'Правична расподела',
    ur: 'منصفانہ تقسیم',
  },
  'Asignación proporcional basada en reglas del protocolo, sin promesas de rendimiento fijo.': {
    en: 'Proportional allocation based on protocol rules, with no promise of fixed returns.',
    pt: 'Alocação proporcional baseada nas regras do protocolo, sem promessas de rendimento fixo.',
    fr: "Attribution proportionnelle fondée sur les règles du protocole, sans promesse de rendement fixe.",
    ru: 'Пропорциональное распределение по правилам протокола, без обещаний фиксированной доходности.',
    sv: 'Proportionell tilldelning enligt protokollets regler, utan löften om fast avkastning.',
    hr: 'Proporcionalna raspodjela prema pravilima protokola, bez obećanja fiksnog prinosa.',
    ar: 'تخصيص تناسبي وفق قواعد البروتوكول، دون وعد بعائد ثابت.',
    de: 'Proportionale Zuteilung nach Protokollregeln, ohne Zusage fester Renditen.',
    sr: 'Пропорционална расподела по правилима протокола, без обећања фиксног приноса.',
    ur: 'پروٹوکول کے قواعد پر مبنی متناسب تقسیم، مقررہ منافع کے وعدے کے بغیر۔',
  },

  /* ── confianza: insignias y metricas institucionales ───────────── */
  'Saltar al contenido principal': {
    en: 'Skip to main content', pt: 'Ir para o conteúdo principal',
    fr: 'Aller au contenu principal', ru: 'Перейти к основному содержанию',
    sv: 'Hoppa till huvudinnehållet', hr: 'Prijeđi na glavni sadržaj',
    ar: 'تخطَّ إلى المحتوى الرئيسي', de: 'Zum Hauptinhalt springen',
    sr: 'Пређи на главни садржај', ur: 'مرکزی مواد پر جائیں',
  },
  'Países': {
    en: 'Countries', pt: 'Países', fr: 'Pays', ru: 'Страны',
    sv: 'Länder', hr: 'Zemlje', ar: 'الدول', de: 'Länder',
    sr: 'Земље', ur: 'ممالک',
  },
  Fundado: {
    en: 'Founded', pt: 'Fundada', fr: 'Fondée', ru: 'Основана',
    sv: 'Grundat', hr: 'Osnovano', ar: 'تأسّست', de: 'Gegründet',
    sr: 'Основано', ur: 'قیام',
  },
  Uptime: {
    en: 'Uptime', pt: 'Disponibilidade', fr: 'Disponibilité', ru: 'Аптайм',
    sv: 'Drifttid', hr: 'Dostupnost', ar: 'زمن التشغيل', de: 'Verfügbarkeit',
    sr: 'Доступност', ur: 'اپ ٹائم',
  },
  Verificado: {
    en: 'Verified', pt: 'Verificado', fr: 'Vérifié', ru: 'Проверено',
    sv: 'Verifierad', hr: 'Provjereno', ar: 'موثّق', de: 'Verifiziert',
    sr: 'Проверено', ur: 'تصدیق شدہ',
  },
  Auditado: {
    en: 'Audited', pt: 'Auditado', fr: 'Audité', ru: 'Проверено аудитом',
    sv: 'Granskad', hr: 'Revidirano', ar: 'مُدقَّق', de: 'Geprüft',
    sr: 'Ревидирано', ur: 'آڈٹ شدہ',
  },
  'En vivo': {
    en: 'Live', pt: 'Ao vivo', fr: 'En direct', ru: 'В эфире',
    sv: 'Direkt', hr: 'Uživo', ar: 'مباشر', de: 'Live',
    sr: 'Уживо', ur: 'براہِ راست',
  },
  'Ecosistema en BSC': {
    en: 'Ecosystem on BSC', pt: 'Ecossistema na BSC', fr: 'Écosystème sur BSC',
    ru: 'Экосистема в BSC', sv: 'Ekosystem på BSC', hr: 'Ekosustav na BSC-u',
    ar: 'المنظومة على BSC', de: 'Ökosystem auf BSC', sr: 'Екосистем на BSC-у',
    ur: 'BSC پر ایکو سسٹم',
  },
  'Comunidad Global': {
    en: 'Global Community', pt: 'Comunidade Global', fr: 'Communauté mondiale',
    ru: 'Глобальное сообщество', sv: 'Global gemenskap', hr: 'Globalna zajednica',
    ar: 'مجتمع عالمي', de: 'Globale Community', sr: 'Глобална заједница',
    ur: 'عالمی کمیونٹی',
  },
  'Transparencia Operativa': {
    en: 'Operational Transparency', pt: 'Transparência Operacional',
    fr: 'Transparence opérationnelle', ru: 'Операционная прозрачность',
    sv: 'Operativ transparens', hr: 'Operativna transparentnost',
    ar: 'الشفافية التشغيلية', de: 'Operative Transparenz',
    sr: 'Оперативна транспарентност', ur: 'عملی شفافیت',
  },

  /* ═══ PAGINAS PROPIAS ═════════════════════════════════════════════
     g11, legal, whitepaper y las dos pantallas de error. Se quedaron fuera
     del primer barrido porque aquel recorrio las catorce secciones de `/`
     y estas paginas no aparecen en ninguna: lo que no entra en la medicion
     no existe para la medicion.
     ═════════════════════════════════════════════════════════════════ */

  /* ── armazon compartido ────────────────────────────────────────── */
  'Volver al inicio': {
    en: 'Back to home', pt: 'Voltar ao início', fr: "Retour à l'accueil",
    ru: 'Вернуться на главную', sv: 'Tillbaka till startsidan', hr: 'Natrag na početnu',
    ar: 'العودة إلى الرئيسية', de: 'Zurück zur Startseite', sr: 'Назад на почетну',
    ur: 'ہوم پر واپس',
  },
  Inicio: {
    en: 'Home', pt: 'Início', fr: 'Accueil', ru: 'Главная',
    sv: 'Start', hr: 'Početna', ar: 'الرئيسية', de: 'Start',
    sr: 'Почетна', ur: 'ہوم',
  },
  'Información legal': {
    en: 'Legal information', pt: 'Informação legal', fr: 'Informations légales',
    ru: 'Правовая информация', sv: 'Juridisk information', hr: 'Pravne informacije',
    ar: 'معلومات قانونية', de: 'Rechtliche Hinweise', sr: 'Правне информације',
    ur: 'قانونی معلومات',
  },

  /* ── g11 ───────────────────────────────────────────────────────── */
  'El material con el que se crece: guías, presentaciones oficiales y los canales donde está la comunidad.': {
    en: 'The material you grow with: guides, official presentations and the channels where the community lives.',
    pt: 'O material com o qual se cresce: guias, apresentações oficiais e os canais onde está a comunidade.',
    fr: "Le matériel avec lequel on progresse : guides, présentations officielles et les canaux où vit la communauté.",
    ru: 'Материалы для роста: руководства, официальные презентации и каналы, где живёт сообщество.',
    sv: 'Materialet du växer med: guider, officiella presentationer och kanalerna där gemenskapen finns.',
    hr: 'Materijal s kojim se raste: vodiči, službene prezentacije i kanali na kojima je zajednica.',
    ar: 'المواد التي تنمو بها: أدلّة وعروض رسمية والقنوات التي يوجد فيها المجتمع.',
    de: 'Das Material, mit dem man wächst: Leitfäden, offizielle Präsentationen und die Kanäle, in denen die Community lebt.',
    sr: 'Материјал с којим се расте: водичи, званичне презентације и канали на којима је заједница.',
    ur: 'وہ مواد جس سے ترقی ہوتی ہے: گائیڈز، سرکاری پریزنٹیشنز اور وہ چینلز جہاں کمیونٹی ہے۔',
  },
  'Guías': {
    en: 'Guides', pt: 'Guias', fr: 'Guides', ru: 'Руководства',
    sv: 'Guider', hr: 'Vodiči', ar: 'الأدلّة', de: 'Leitfäden',
    sr: 'Водичи', ur: 'گائیڈز',
  },
  'Los cuatro pasos, de la cuenta nueva a la oficina virtual.': {
    en: 'The four steps, from a new account to the virtual office.',
    pt: 'Os quatro passos, da conta nova ao escritório virtual.',
    fr: "Les quatre étapes, du nouveau compte au bureau virtuel.",
    ru: 'Четыре шага: от новой учётной записи до виртуального офиса.',
    sv: 'De fyra stegen, från nytt konto till det virtuella kontoret.',
    hr: 'Četiri koraka, od novog računa do virtualnog ureda.',
    ar: 'الخطوات الأربع، من الحساب الجديد إلى المكتب الافتراضي.',
    de: 'Die vier Schritte, vom neuen Konto bis zum virtuellen Büro.',
    sr: 'Четири корака, од новог налога до виртуелне канцеларије.',
    ur: 'چار مراحل، نئے اکاؤنٹ سے ورچوئل آفس تک۔',
  },
  'Cómo registrarte en Genesis': {
    en: 'How to register on Genesis', pt: 'Como se registrar na Genesis',
    fr: "Comment s'inscrire sur Genesis", ru: 'Как зарегистрироваться в Genesis',
    sv: 'Så registrerar du dig på Genesis', hr: 'Kako se registrirati na Genesis',
    ar: 'كيف تسجّل في Genesis', de: 'So registrierst du dich bei Genesis',
    sr: 'Како се регистровати на Genesis', ur: 'Genesis پر رجسٹر کیسے کریں',
  },
  'Alta de cuenta con enlace de patrocinador y cartera Web3.': {
    en: 'Account sign-up with a sponsor link and a Web3 wallet.',
    pt: 'Abertura de conta com link de patrocinador e carteira Web3.',
    fr: "Création de compte avec lien de parrainage et portefeuille Web3.",
    ru: 'Регистрация с реферальной ссылкой и Web3-кошельком.',
    sv: 'Kontoregistrering med sponsorlänk och Web3-plånbok.',
    hr: 'Otvaranje računa uz sponzorsku poveznicu i Web3 novčanik.',
    ar: 'فتح حساب برابط الراعي ومحفظة Web3.',
    de: 'Kontoeröffnung mit Sponsorenlink und Web3-Wallet.',
    sr: 'Отварање налога уз спонзорски линк и Web3 новчаник.',
    ur: 'اسپانسر لنک اور Web3 والٹ کے ساتھ اکاؤنٹ کھولنا۔',
  },
  'Cómo comprar tu paquete de minería': {
    en: 'How to buy your mining package', pt: 'Como comprar seu pacote de mineração',
    fr: 'Comment acheter votre pack de minage', ru: 'Как купить майнинг-пакет',
    sv: 'Så köper du ditt mining-paket', hr: 'Kako kupiti svoj rudarski paket',
    ar: 'كيف تشتري باقة التعدين', de: 'So kaufst du dein Mining-Paket',
    sr: 'Како купити свој рударски пакет', ur: 'اپنا مائننگ پیکج کیسے خریدیں',
  },
  'Pago del paquete y activación de la participación.': {
    en: 'Paying for the package and activating participation.',
    pt: 'Pagamento do pacote e ativação da participação.',
    fr: 'Paiement du pack et activation de la participation.',
    ru: 'Оплата пакета и активация участия.',
    sv: 'Betalning av paketet och aktivering av deltagandet.',
    hr: 'Plaćanje paketa i aktivacija sudjelovanja.',
    ar: 'دفع الباقة وتفعيل المشاركة.',
    de: 'Bezahlung des Pakets und Aktivierung der Teilnahme.',
    sr: 'Плаћање пакета и активација учешћа.',
    ur: 'پیکج کی ادائیگی اور شرکت کی فعالیت۔',
  },
  'Cómo referir y crecer tu comunidad': {
    en: 'How to refer and grow your community', pt: 'Como indicar e crescer sua comunidade',
    fr: 'Comment parrainer et faire grandir votre communauté', ru: 'Как приглашать и растить сообщество',
    sv: 'Så värvar du och får din gemenskap att växa', hr: 'Kako preporučiti i razviti svoju zajednicu',
    ar: 'كيف تُحيل وتنمّي مجتمعك', de: 'So wirbst du und lässt deine Community wachsen',
    sr: 'Како препоручити и развити своју заједницу', ur: 'ریفر کیسے کریں اور کمیونٹی کیسے بڑھائیں',
  },
  'Tu enlace de referido y cómo se construye la red.': {
    en: 'Your referral link and how the network is built.',
    pt: 'Seu link de indicação e como a rede é construída.',
    fr: 'Votre lien de parrainage et la construction du réseau.',
    ru: 'Ваша реферальная ссылка и как строится сеть.',
    sv: 'Din värvningslänk och hur nätverket byggs.',
    hr: 'Vaša preporučna poveznica i kako se gradi mreža.',
    ar: 'رابط الإحالة الخاص بك وكيف تُبنى الشبكة.',
    de: 'Dein Empfehlungslink und wie das Netzwerk entsteht.',
    sr: 'Ваш препоручни линк и како се гради мрежа.',
    ur: 'آپ کا ریفرل لنک اور نیٹ ورک کیسے بنتا ہے۔',
  },
  'Cómo funciona tu oficina virtual': {
    en: 'How your virtual office works', pt: 'Como funciona seu escritório virtual',
    fr: 'Comment fonctionne votre bureau virtuel', ru: 'Как работает виртуальный офис',
    sv: 'Så fungerar ditt virtuella kontor', hr: 'Kako radi vaš virtualni ured',
    ar: 'كيف يعمل مكتبك الافتراضي', de: 'So funktioniert dein virtuelles Büro',
    sr: 'Како ради ваша виртуелна канцеларија', ur: 'آپ کا ورچوئل آفس کیسے کام کرتا ہے',
  },
  'Panel de red, seguimiento y material para compartir.': {
    en: 'Network dashboard, tracking and material to share.',
    pt: 'Painel de rede, acompanhamento e material para compartilhar.',
    fr: 'Tableau de bord réseau, suivi et supports à partager.',
    ru: 'Панель сети, отслеживание и материалы для распространения.',
    sv: 'Nätverkspanel, uppföljning och material att dela.',
    hr: 'Nadzorna ploča mreže, praćenje i materijali za dijeljenje.',
    ar: 'لوحة الشبكة والمتابعة ومواد للمشاركة.',
    de: 'Netzwerk-Dashboard, Tracking und Material zum Teilen.',
    sr: 'Контролна табла мреже, праћење и материјали за дељење.',
    ur: 'نیٹ ورک ڈیش بورڈ، ٹریکنگ اور شیئر کرنے کا مواد۔',
  },
  'Disponible en el canal': {
    en: 'Available on the channel', pt: 'Disponível no canal', fr: 'Disponible sur la chaîne',
    ru: 'Доступно на канале', sv: 'Finns på kanalen', hr: 'Dostupno na kanalu',
    ar: 'متاح على القناة', de: 'Auf dem Kanal verfügbar', sr: 'Доступно на каналу',
    ur: 'چینل پر دستیاب',
  },
  'Ver las guías en YouTube': {
    en: 'Watch the guides on YouTube', pt: 'Ver os guias no YouTube',
    fr: 'Voir les guides sur YouTube', ru: 'Смотреть руководства на YouTube',
    sv: 'Se guiderna på YouTube', hr: 'Pogledaj vodiče na YouTubeu',
    ar: 'شاهد الأدلّة على YouTube', de: 'Die Leitfäden auf YouTube ansehen',
    sr: 'Погледај водиче на YouTube-у', ur: 'گائیڈز YouTube پر دیکھیں',
  },
  'Presentaciones oficiales': {
    en: 'Official presentations', pt: 'Apresentações oficiais', fr: 'Présentations officielles',
    ru: 'Официальные презентации', sv: 'Officiella presentationer', hr: 'Službene prezentacije',
    ar: 'العروض الرسمية', de: 'Offizielle Präsentationen', sr: 'Званичне презентације',
    ur: 'سرکاری پریزنٹیشنز',
  },
  'Versión 5.0, en ocho idiomas. Cada ficha indica su peso: son unos 2,5 MB, pensadas para descargar y enseñar desde el móvil.': {
    en: 'Version 5.0, in eight languages. Each card shows its size: around 2.5 MB, made to download and show from a phone.',
    pt: 'Versão 5.0, em oito idiomas. Cada ficha indica o peso: cerca de 2,5 MB, pensadas para baixar e mostrar do celular.',
    fr: "Version 5.0, en huit langues. Chaque fiche indique son poids : environ 2,5 Mo, conçues pour être téléchargées et montrées depuis un mobile.",
    ru: 'Версия 5.0 на восьми языках. На каждой карточке указан размер: около 2,5 МБ — чтобы скачать и показывать с телефона.',
    sv: 'Version 5.0, på åtta språk. Varje kort visar storleken: cirka 2,5 MB, gjorda för att laddas ner och visas från mobilen.',
    hr: 'Verzija 5.0, na osam jezika. Svaka kartica pokazuje veličinu: oko 2,5 MB, namijenjene preuzimanju i prikazu s mobitela.',
    ar: 'الإصدار 5.0 بثماني لغات. تُظهر كل بطاقة حجمها: نحو 2.5 ميغابايت، مُعدّة للتنزيل والعرض من الهاتف.',
    de: 'Version 5.0, in acht Sprachen. Jede Karte zeigt ihre Größe: rund 2,5 MB, zum Herunterladen und Zeigen vom Handy.',
    sr: 'Верзија 5.0, на осам језика. Свака картица показује величину: око 2,5 MB, намењене преузимању и приказу с мобилног.',
    ur: 'ورژن 5.0، آٹھ زبانوں میں۔ ہر کارڈ اپنا حجم دکھاتا ہے: تقریباً 2.5 MB، موبائل سے ڈاؤن لوڈ اور دکھانے کے لیے۔',
  },
  'Sólo en versión anterior (v1)': {
    en: 'Previous version only (v1)', pt: 'Somente na versão anterior (v1)',
    fr: 'Uniquement en version précédente (v1)', ru: 'Только предыдущая версия (v1)',
    sv: 'Endast i tidigare version (v1)', hr: 'Samo u prethodnoj verziji (v1)',
    ar: 'بالإصدار السابق فقط (v1)', de: 'Nur in der Vorversion (v1)',
    sr: 'Само у претходној верзији (v1)', ur: 'صرف پچھلے ورژن میں (v1)',
  },
  'Estos idiomas todavía no tienen la 5.0. Son archivos antiguos y más pesados.': {
    en: 'These languages do not have 5.0 yet. They are older, heavier files.',
    pt: 'Estes idiomas ainda não têm a 5.0. São arquivos antigos e mais pesados.',
    fr: "Ces langues n'ont pas encore la 5.0. Ce sont des fichiers anciens et plus lourds.",
    ru: 'Для этих языков версии 5.0 пока нет. Это старые и более тяжёлые файлы.',
    sv: 'Dessa språk har ännu inte 5.0. Det är äldre och tyngre filer.',
    hr: 'Ovi jezici još nemaju 5.0. Riječ je o starijim i težim datotekama.',
    ar: 'هذه اللغات لا تملك الإصدار 5.0 بعد. ملفات أقدم وأثقل.',
    de: 'Für diese Sprachen gibt es die 5.0 noch nicht. Es sind ältere, schwerere Dateien.',
    sr: 'Ови језици још немају 5.0. Реч је о старијим и тежим датотекама.',
    ur: 'ان زبانوں میں 5.0 ابھی نہیں ہے۔ یہ پرانی اور بھاری فائلیں ہیں۔',
  },
  'Canales oficiales': {
    en: 'Official channels', pt: 'Canais oficiais', fr: 'Canaux officiels',
    ru: 'Официальные каналы', sv: 'Officiella kanaler', hr: 'Službeni kanali',
    ar: 'القنوات الرسمية', de: 'Offizielle Kanäle', sr: 'Званични канали',
    ur: 'سرکاری چینلز',
  },
  'Los canales de la comunidad G11. Son distintos de los de AiGenesis.': {
    en: 'The G11 community channels. They are separate from the AiGenesis ones.',
    pt: 'Os canais da comunidade G11. São diferentes dos da AiGenesis.',
    fr: "Les canaux de la communauté G11. Ils sont distincts de ceux d'AiGenesis.",
    ru: 'Каналы сообщества G11. Они отличаются от каналов AiGenesis.',
    sv: 'G11-gemenskapens kanaler. De är skilda från AiGenesis kanaler.',
    hr: 'Kanali zajednice G11. Razlikuju se od AiGenesisovih.',
    ar: 'قنوات مجتمع G11. وهي مختلفة عن قنوات AiGenesis.',
    de: 'Die Kanäle der G11-Community. Sie sind getrennt von denen von AiGenesis.',
    sr: 'Канали заједнице G11. Разликују се од AiGenesis-ових.',
    ur: 'G11 کمیونٹی کے چینلز۔ یہ AiGenesis کے چینلز سے مختلف ہیں۔',
  },
  Empezar: {
    en: 'Get started', pt: 'Começar', fr: 'Commencer', ru: 'Начать',
    sv: 'Kom igång', hr: 'Započni', ar: 'ابدأ', de: 'Loslegen',
    sr: 'Почни', ur: 'شروع کریں',
  },
  'El alta necesita el enlace de tu patrocinador y una cartera Web3. Si aún no tienes patrocinador, escribe por cualquiera de los canales de arriba.': {
    en: 'Signing up needs your sponsor’s link and a Web3 wallet. If you do not have a sponsor yet, write to any of the channels above.',
    pt: 'O cadastro precisa do link do seu patrocinador e de uma carteira Web3. Se ainda não tem patrocinador, escreva por qualquer um dos canais acima.',
    fr: "L'inscription nécessite le lien de votre parrain et un portefeuille Web3. Si vous n'avez pas encore de parrain, écrivez sur l'un des canaux ci-dessus.",
    ru: 'Для регистрации нужны ссылка вашего спонсора и Web3-кошелёк. Если спонсора пока нет, напишите в любой из каналов выше.',
    sv: 'Registreringen kräver din sponsors länk och en Web3-plånbok. Har du ingen sponsor än, skriv i någon av kanalerna ovan.',
    hr: 'Za prijavu trebate poveznicu svog sponzora i Web3 novčanik. Ako još nemate sponzora, javite se na bilo koji od gornjih kanala.',
    ar: 'يتطلّب التسجيل رابط راعيك ومحفظة Web3. إن لم يكن لديك راعٍ بعد، راسلنا عبر أي من القنوات أعلاه.',
    de: 'Für die Anmeldung brauchst du den Link deines Sponsors und eine Web3-Wallet. Hast du noch keinen Sponsor, schreib über einen der Kanäle oben.',
    sr: 'За пријаву су потребни линк вашег спонзора и Web3 новчаник. Ако још немате спонзора, јавите се на било који од горњих канала.',
    ur: 'رجسٹریشن کے لیے آپ کے اسپانسر کا لنک اور Web3 والٹ درکار ہے۔ اگر ابھی اسپانسر نہیں، تو اوپر کے کسی بھی چینل پر لکھیں۔',
  },

  /* ── legal ─────────────────────────────────────────────────────── */
  Privacidad: {
    en: 'Privacy', pt: 'Privacidade', fr: 'Confidentialité', ru: 'Конфиденциальность',
    sv: 'Integritet', hr: 'Privatnost', ar: 'الخصوصية', de: 'Datenschutz',
    sr: 'Приватност', ur: 'رازداری',
  },
  'AiGenesis trata los datos personales conforme a las prácticas descritas en esta documentación. Para consultas sobre privacidad, escríbenos a': {
    en: 'AiGenesis handles personal data according to the practices described in this documentation. For privacy enquiries, write to us at',
    pt: 'A AiGenesis trata os dados pessoais conforme as práticas descritas nesta documentação. Para consultas sobre privacidade, escreva para',
    fr: "AiGenesis traite les données personnelles selon les pratiques décrites dans cette documentation. Pour toute question de confidentialité, écrivez-nous à",
    ru: 'AiGenesis обрабатывает персональные данные в соответствии с практиками, описанными в этой документации. По вопросам конфиденциальности пишите на',
    sv: 'AiGenesis behandlar personuppgifter enligt de rutiner som beskrivs i denna dokumentation. För frågor om integritet, skriv till oss på',
    hr: 'AiGenesis obrađuje osobne podatke u skladu s praksama opisanima u ovoj dokumentaciji. Za upite o privatnosti pišite nam na',
    ar: 'تعالج AiGenesis البيانات الشخصية وفق الممارسات الموصوفة في هذه الوثائق. للاستفسارات المتعلّقة بالخصوصية راسلنا على',
    de: 'AiGenesis verarbeitet personenbezogene Daten gemäß den in dieser Dokumentation beschriebenen Verfahren. Bei Datenschutzfragen schreiben Sie an',
    sr: 'AiGenesis обрађује личне податке у складу с праксама описаним у овој документацији. За упите о приватности пишите нам на',
    ur: 'AiGenesis ذاتی ڈیٹا کو اس دستاویز میں بیان کردہ طریقوں کے مطابق سنبھالتی ہے۔ رازداری کے سوالات کے لیے ہمیں لکھیں',
  },
  'Política de privacidad completa pendiente de revisión legal.': {
    en: 'Full privacy policy pending legal review.',
    pt: 'Política de privacidade completa pendente de revisão jurídica.',
    fr: 'Politique de confidentialité complète en attente de révision juridique.',
    ru: 'Полная политика конфиденциальности ожидает юридической проверки.',
    sv: 'Fullständig integritetspolicy inväntar juridisk granskning.',
    hr: 'Potpuna politika privatnosti čeka pravnu reviziju.',
    ar: 'سياسة الخصوصية الكاملة قيد المراجعة القانونية.',
    de: 'Vollständige Datenschutzerklärung steht noch unter rechtlicher Prüfung.',
    sr: 'Потпуна политика приватности чека правну ревизију.',
    ur: 'مکمل رازداری پالیسی قانونی جائزے کی منتظر ہے۔',
  },
  Riesgos: {
    en: 'Risks', pt: 'Riscos', fr: 'Risques', ru: 'Риски',
    sv: 'Risker', hr: 'Rizici', ar: 'المخاطر', de: 'Risiken',
    sr: 'Ризици', ur: 'خطرات',
  },
  'Los activos digitales pueden experimentar alta volatilidad. Los protocolos blockchain pueden contener vulnerabilidades tecnológicas. Los marcos regulatorios varían por jurisdicción y pueden cambiar sin previo aviso.': {
    en: 'Digital assets can be highly volatile. Blockchain protocols may contain technological vulnerabilities. Regulatory frameworks vary by jurisdiction and can change without notice.',
    pt: 'Os ativos digitais podem apresentar alta volatilidade. Os protocolos blockchain podem conter vulnerabilidades tecnológicas. Os marcos regulatórios variam por jurisdição e podem mudar sem aviso prévio.',
    fr: "Les actifs numériques peuvent connaître une forte volatilité. Les protocoles blockchain peuvent comporter des vulnérabilités technologiques. Les cadres réglementaires varient selon la juridiction et peuvent changer sans préavis.",
    ru: 'Цифровые активы могут отличаться высокой волатильностью. Блокчейн-протоколы могут содержать технологические уязвимости. Нормативные требования различаются по юрисдикциям и могут меняться без предупреждения.',
    sv: 'Digitala tillgångar kan uppvisa hög volatilitet. Blockkedjeprotokoll kan innehålla tekniska sårbarheter. Regelverk varierar mellan jurisdiktioner och kan ändras utan förvarning.',
    hr: 'Digitalna imovina može biti vrlo volatilna. Blockchain protokoli mogu sadržavati tehnološke ranjivosti. Regulatorni okviri razlikuju se po jurisdikcijama i mogu se promijeniti bez prethodne najave.',
    ar: 'قد تشهد الأصول الرقمية تقلّبات عالية. وقد تحتوي بروتوكولات البلوكشين على ثغرات تقنية. وتختلف الأطر التنظيمية باختلاف الولاية القضائية وقد تتغيّر دون إشعار مسبق.',
    de: 'Digitale Vermögenswerte können stark schwanken. Blockchain-Protokolle können technische Schwachstellen enthalten. Regulatorische Rahmen unterscheiden sich je nach Rechtsraum und können sich ohne Vorankündigung ändern.',
    sr: 'Дигитална имовина може бити веома волатилна. Блокчејн протоколи могу садржати технолошке рањивости. Регулаторни оквири разликују се по јурисдикцијама и могу се променити без претходне најаве.',
    ur: 'ڈیجیٹل اثاثے شدید اتار چڑھاؤ کا شکار ہو سکتے ہیں۔ بلاک چین پروٹوکولز میں تکنیکی کمزوریاں ہو سکتی ہیں۔ ضابطہ جاتی فریم ورک دائرۂ اختیار کے مطابق مختلف ہیں اور بغیر اطلاع بدل سکتے ہیں۔',
  },
  'AiGenesis no proporciona asesoramiento financiero, legal ni fiscal. Consulte profesionales calificados antes de participar.': {
    en: 'AiGenesis does not provide financial, legal or tax advice. Consult qualified professionals before participating.',
    pt: 'A AiGenesis não fornece assessoria financeira, jurídica ou fiscal. Consulte profissionais qualificados antes de participar.',
    fr: "AiGenesis ne fournit aucun conseil financier, juridique ou fiscal. Consultez des professionnels qualifiés avant de participer.",
    ru: 'AiGenesis не предоставляет финансовых, юридических или налоговых консультаций. Перед участием обратитесь к квалифицированным специалистам.',
    sv: 'AiGenesis ger inte finansiell, juridisk eller skatterådgivning. Rådfråga kvalificerade yrkespersoner innan du deltar.',
    hr: 'AiGenesis ne pruža financijske, pravne ni porezne savjete. Prije sudjelovanja posavjetujte se s kvalificiranim stručnjacima.',
    ar: 'لا تقدّم AiGenesis مشورة مالية أو قانونية أو ضريبية. استشر مختصّين مؤهّلين قبل المشاركة.',
    de: 'AiGenesis erteilt keine Finanz-, Rechts- oder Steuerberatung. Ziehen Sie vor einer Teilnahme qualifizierte Fachleute hinzu.',
    sr: 'AiGenesis не пружа финансијске, правне ни пореске савете. Пре учешћа консултујте квалификоване стручњаке.',
    ur: 'AiGenesis مالی، قانونی یا ٹیکس مشورہ فراہم نہیں کرتی۔ شرکت سے پہلے اہل ماہرین سے رجوع کریں۔',
  },
  Contacto: {
    en: 'Contact', pt: 'Contato', fr: 'Contact', ru: 'Контакты',
    sv: 'Kontakt', hr: 'Kontakt', ar: 'اتصل بنا', de: 'Kontakt',
    sr: 'Контакт', ur: 'رابطہ',
  },
  'Consultas legales o de cumplimiento:': {
    en: 'Legal or compliance enquiries:', pt: 'Consultas jurídicas ou de compliance:',
    fr: 'Questions juridiques ou de conformité :', ru: 'Юридические вопросы и комплаенс:',
    sv: 'Juridiska frågor eller efterlevnadsfrågor:', hr: 'Pravni upiti ili upiti o usklađenosti:',
    ar: 'استفسارات قانونية أو تتعلّق بالامتثال:', de: 'Rechts- oder Compliance-Anfragen:',
    sr: 'Правни упити или упити о усклађености:', ur: 'قانونی یا تعمیل سے متعلق سوالات:',
  },
  'Sitio institucional:': {
    en: 'Institutional site:', pt: 'Site institucional:', fr: 'Site institutionnel :',
    ru: 'Официальный сайт:', sv: 'Institutionell webbplats:', hr: 'Institucionalna stranica:',
    ar: 'الموقع المؤسسي:', de: 'Institutionelle Website:', sr: 'Институционални сајт:',
    ur: 'ادارہ جاتی سائٹ:',
  },
  'Documentación adicional en': {
    en: 'Further documentation in', pt: 'Documentação adicional em',
    fr: 'Documentation complémentaire dans', ru: 'Дополнительная документация в',
    sv: 'Ytterligare dokumentation i', hr: 'Dodatna dokumentacija u',
    ar: 'وثائق إضافية في', de: 'Weitere Dokumentation im',
    sr: 'Додатна документација у', ur: 'مزید دستاویزات میں',
  },
  whitepaper: {
    en: 'whitepaper', pt: 'whitepaper', fr: 'whitepaper', ru: 'вайтпейпере',
    sv: 'whitepaper', hr: 'whitepaperu', ar: 'الورقة البيضاء', de: 'Whitepaper',
    sr: 'вајтпејперу', ur: 'وائٹ پیپر',
  },
  'Borrador operativo — revisión legal pendiente antes de producción en dominio principal.': {
    en: 'Working draft — legal review pending before production on the main domain.',
    pt: 'Rascunho operacional — revisão jurídica pendente antes da produção no domínio principal.',
    fr: "Version de travail — révision juridique en attente avant mise en production sur le domaine principal.",
    ru: 'Рабочий черновик — юридическая проверка не завершена до запуска на основном домене.',
    sv: 'Arbetsutkast — juridisk granskning återstår före produktion på huvuddomänen.',
    hr: 'Radna verzija — pravna revizija u tijeku prije produkcije na glavnoj domeni.',
    ar: 'مسودّة عمل — المراجعة القانونية معلّقة قبل الإطلاق على النطاق الرئيسي.',
    de: 'Arbeitsentwurf — rechtliche Prüfung steht vor dem Produktivbetrieb auf der Hauptdomain noch aus.',
    sr: 'Радна верзија — правна ревизија у току пре продукције на главном домену.',
    ur: 'ورکنگ ڈرافٹ — مرکزی ڈومین پر اجرا سے پہلے قانونی جائزہ باقی ہے۔',
  },

  /* ── whitepaper ────────────────────────────────────────────────── */
  'Documentación oficial del ecosistema AiGenesis.': {
    en: 'Official documentation of the AiGenesis ecosystem.',
    pt: 'Documentação oficial do ecossistema AiGenesis.',
    fr: "Documentation officielle de l'écosystème AiGenesis.",
    ru: 'Официальная документация экосистемы AiGenesis.',
    sv: 'Officiell dokumentation för AiGenesis ekosystem.',
    hr: 'Službena dokumentacija ekosustava AiGenesis.',
    ar: 'الوثائق الرسمية لمنظومة AiGenesis.',
    de: 'Offizielle Dokumentation des AiGenesis-Ökosystems.',
    sr: 'Званична документација екосистема AiGenesis.',
    ur: 'AiGenesis ایکو سسٹم کی سرکاری دستاویزات۔',
  },
  'El whitepaper AiG Token describe la arquitectura del protocolo, los tokenomics, los pilares del ecosistema y el marco de participación on-chain.': {
    en: 'The AiG Token whitepaper describes the protocol architecture, the tokenomics, the ecosystem pillars and the on-chain participation framework.',
    pt: 'O whitepaper AiG Token descreve a arquitetura do protocolo, os tokenomics, os pilares do ecossistema e o marco de participação on-chain.',
    fr: "Le whitepaper AiG Token décrit l'architecture du protocole, la tokenomique, les piliers de l'écosystème et le cadre de participation on-chain.",
    ru: 'Вайтпейпер AiG Token описывает архитектуру протокола, токеномику, опоры экосистемы и рамки участия on-chain.',
    sv: 'AiG Token-whitepapret beskriver protokollets arkitektur, tokenomiken, ekosystemets pelare och ramverket för deltagande on-chain.',
    hr: 'Whitepaper AiG Token opisuje arhitekturu protokola, tokenomiju, stupove ekosustava i okvir sudjelovanja on-chain.',
    ar: 'تصف الورقة البيضاء لـ AiG Token بنية البروتوكول واقتصاد الرمز وركائز المنظومة وإطار المشاركة على السلسلة.',
    de: 'Das AiG-Token-Whitepaper beschreibt die Protokollarchitektur, die Tokenomics, die Säulen des Ökosystems und den Rahmen der On-Chain-Teilnahme.',
    sr: 'Whitepaper AiG Token описује архитектуру протокола, токеномију, стубове екосистема и оквир учешћа on-chain.',
    ur: 'AiG Token وائٹ پیپر پروٹوکول کے فن تعمیر، ٹوکنومکس، ایکو سسٹم کے ستونوں اور آن چین شرکت کے ڈھانچے کو بیان کرتا ہے۔',
  },
  'Datos verificables en cadena': {
    en: 'On-chain verifiable data', pt: 'Dados verificáveis em cadeia',
    fr: 'Données vérifiables on-chain', ru: 'Проверяемые данные в цепочке',
    sv: 'Verifierbara data on-chain', hr: 'Podaci provjerljivi na lancu',
    ar: 'بيانات قابلة للتحقّق على السلسلة', de: 'On-Chain überprüfbare Daten',
    sr: 'Подаци проверљиви на ланцу', ur: 'آن چین قابلِ تصدیق ڈیٹا',
  },
  'Verificable en cadena': {
    en: 'Verifiable on-chain', pt: 'Verificável em cadeia', fr: 'Vérifiable on-chain',
    ru: 'Проверяемо в цепочке', sv: 'Verifierbart on-chain', hr: 'Provjerljivo na lancu',
    ar: 'قابل للتحقّق على السلسلة', de: 'On-Chain überprüfbar',
    sr: 'Проверљиво на ланцу', ur: 'آن چین قابلِ تصدیق',
  },
  'Suministro total AIG': {
    en: 'Total AIG supply', pt: 'Fornecimento total AIG', fr: 'Offre totale AIG',
    ru: 'Общая эмиссия AIG', sv: 'Totalt AIG-utbud', hr: 'Ukupna ponuda AIG',
    ar: 'المعروض الكلي لـ AIG', de: 'AIG-Gesamtmenge', sr: 'Укупна понуда AIG',
    ur: 'AIG کی کل سپلائی',
  },
  'Holders en cadena': {
    en: 'On-chain holders', pt: 'Detentores em cadeia', fr: 'Détenteurs on-chain',
    ru: 'Держатели в цепочке', sv: 'Innehavare on-chain', hr: 'Imatelji na lancu',
    ar: 'الحائزون على السلسلة', de: 'On-Chain-Inhaber', sr: 'Власници на ланцу',
    ur: 'آن چین ہولڈرز',
  },
  'Código del contrato': {
    en: 'Contract code', pt: 'Código do contrato', fr: 'Code du contrat',
    ru: 'Код контракта', sv: 'Kontraktskod', hr: 'Kod ugovora',
    ar: 'شيفرة العقد', de: 'Vertragscode', sr: 'Код уговора',
    ur: 'کنٹریکٹ کوڈ',
  },
  'Contrato:': {
    en: 'Contract:', pt: 'Contrato:', fr: 'Contrat :', ru: 'Контракт:',
    sv: 'Kontrakt:', hr: 'Ugovor:', ar: 'العقد:', de: 'Vertrag:',
    sr: 'Уговор:', ur: 'کنٹریکٹ:',
  },
  'Descargar Whitepaper (PDF)': {
    en: 'Download whitepaper (PDF)', pt: 'Baixar whitepaper (PDF)',
    fr: 'Télécharger le whitepaper (PDF)', ru: 'Скачать вайтпейпер (PDF)',
    sv: 'Ladda ner whitepapret (PDF)', hr: 'Preuzmi whitepaper (PDF)',
    ar: 'تنزيل الورقة البيضاء (PDF)', de: 'Whitepaper herunterladen (PDF)',
    sr: 'Преузми whitepaper (PDF)', ur: 'وائٹ پیپر ڈاؤن لوڈ کریں (PDF)',
  },
  'Ver contrato en BSCScan': {
    en: 'View contract on BSCScan', pt: 'Ver contrato na BSCScan',
    fr: 'Voir le contrat sur BSCScan', ru: 'Смотреть контракт в BSCScan',
    sv: 'Visa kontraktet på BSCScan', hr: 'Pogledaj ugovor na BSCScanu',
    ar: 'عرض العقد على BSCScan', de: 'Vertrag auf BSCScan ansehen',
    sr: 'Погледај уговор на BSCScan-у', ur: 'BSCScan پر کنٹریکٹ دیکھیں',
  },
  'Whitepaper AiG Token, documento PDF': {
    en: 'AiG Token whitepaper, PDF document', pt: 'Whitepaper AiG Token, documento PDF',
    fr: 'Whitepaper AiG Token, document PDF', ru: 'Вайтпейпер AiG Token, документ PDF',
    sv: 'AiG Token-whitepaper, PDF-dokument', hr: 'Whitepaper AiG Token, PDF dokument',
    ar: 'الورقة البيضاء لـ AiG Token، مستند PDF', de: 'AiG-Token-Whitepaper, PDF-Dokument',
    sr: 'Whitepaper AiG Token, PDF документ', ur: 'AiG Token وائٹ پیپر، PDF دستاویز',
  },
  'Tu navegador no puede mostrar el PDF aquí.': {
    en: 'Your browser cannot display the PDF here.',
    pt: 'Seu navegador não consegue exibir o PDF aqui.',
    fr: "Votre navigateur ne peut pas afficher le PDF ici.",
    ru: 'Ваш браузер не может показать PDF здесь.',
    sv: 'Din webbläsare kan inte visa PDF:en här.',
    hr: 'Vaš preglednik ne može ovdje prikazati PDF.',
    ar: 'لا يستطيع متصفّحك عرض ملف PDF هنا.',
    de: 'Dein Browser kann das PDF hier nicht anzeigen.',
    sr: 'Ваш прегледач не може овде приказати PDF.',
    ur: 'آپ کا براؤزر یہاں PDF نہیں دکھا سکتا۔',
  },
  'Descárgalo para leerlo': {
    en: 'Download it to read', pt: 'Baixe para ler', fr: 'Téléchargez-le pour le lire',
    ru: 'Скачайте, чтобы прочитать', sv: 'Ladda ner för att läsa', hr: 'Preuzmi za čitanje',
    ar: 'نزّله لقراءته', de: 'Zum Lesen herunterladen', sr: 'Преузми да прочиташ',
    ur: 'پڑھنے کے لیے ڈاؤن لوڈ کریں',
  },
  'AiG Token · Whitepaper oficial v1.1 · Febrero 2024': {
    en: 'AiG Token · Official whitepaper v1.1 · February 2024',
    pt: 'AiG Token · Whitepaper oficial v1.1 · Fevereiro de 2024',
    fr: 'AiG Token · Whitepaper officiel v1.1 · Février 2024',
    ru: 'AiG Token · Официальный вайтпейпер v1.1 · Февраль 2024',
    sv: 'AiG Token · Officiellt whitepaper v1.1 · Februari 2024',
    hr: 'AiG Token · Službeni whitepaper v1.1 · Veljača 2024.',
    ar: 'AiG Token · الورقة البيضاء الرسمية v1.1 · فبراير 2024',
    de: 'AiG Token · Offizielles Whitepaper v1.1 · Februar 2024',
    sr: 'AiG Token · Званични whitepaper v1.1 · Фебруар 2024.',
    ur: 'AiG Token · سرکاری وائٹ پیپر v1.1 · فروری 2024',
  },

  /* ── pantallas de error ────────────────────────────────────────── */
  Error: {
    en: 'Error', pt: 'Erro', fr: 'Erreur', ru: 'Ошибка',
    sv: 'Fel', hr: 'Greška', ar: 'خطأ', de: 'Fehler',
    sr: 'Грешка', ur: 'خرابی',
  },
  'Algo se ha interrumpido': {
    en: 'Something was interrupted', pt: 'Algo foi interrompido',
    fr: "Quelque chose s'est interrompu", ru: 'Что-то прервалось',
    sv: 'Något avbröts', hr: 'Nešto je prekinuto', ar: 'حدث انقطاع ما',
    de: 'Etwas wurde unterbrochen', sr: 'Нешто је прекинуто', ur: 'کچھ رک گیا',
  },
  'No hemos podido cargar esta parte del sitio. Suele resolverse reintentando; si persiste, vuelve al inicio.': {
    en: 'We could not load this part of the site. Retrying usually fixes it; if it persists, go back home.',
    pt: 'Não conseguimos carregar esta parte do site. Tentar de novo costuma resolver; se persistir, volte ao início.',
    fr: "Nous n'avons pas pu charger cette partie du site. Réessayer suffit en général ; si cela persiste, revenez à l'accueil.",
    ru: 'Не удалось загрузить эту часть сайта. Обычно помогает повтор; если не проходит, вернитесь на главную.',
    sv: 'Vi kunde inte ladda den här delen av webbplatsen. Att försöka igen brukar räcka; om det kvarstår, gå till startsidan.',
    hr: 'Nismo mogli učitati ovaj dio stranice. Ponovni pokušaj obično pomaže; ako se nastavi, vratite se na početnu.',
    ar: 'تعذّر تحميل هذا الجزء من الموقع. غالباً ما تحلّ إعادة المحاولة المشكلة؛ وإن استمرّت فعُد إلى الرئيسية.',
    de: 'Dieser Teil der Seite konnte nicht geladen werden. Ein erneuter Versuch hilft meist; bleibt es bestehen, kehre zur Startseite zurück.',
    sr: 'Нисмо могли да учитамо овај део сајта. Поновни покушај обично помаже; ако се настави, вратите се на почетну.',
    ur: 'ہم سائٹ کا یہ حصہ لوڈ نہیں کر سکے۔ دوبارہ کوشش عموماً کافی ہوتی ہے؛ اگر برقرار رہے تو ہوم پر واپس جائیں۔',
  },
  Reintentar: {
    en: 'Retry', pt: 'Tentar de novo', fr: 'Réessayer', ru: 'Повторить',
    sv: 'Försök igen', hr: 'Pokušaj ponovno', ar: 'أعد المحاولة', de: 'Erneut versuchen',
    sr: 'Покушај поново', ur: 'دوبارہ کوشش',
  },
  'Referencia:': {
    en: 'Reference:', pt: 'Referência:', fr: 'Référence :', ru: 'Ссылка:',
    sv: 'Referens:', hr: 'Referenca:', ar: 'المرجع:', de: 'Referenz:',
    sr: 'Референца:', ur: 'حوالہ:',
  },
  'Esta dirección no existe': {
    en: 'This address does not exist', pt: 'Este endereço não existe',
    fr: "Cette adresse n'existe pas", ru: 'Такого адреса не существует',
    sv: 'Den här adressen finns inte', hr: 'Ova adresa ne postoji',
    ar: 'هذا العنوان غير موجود', de: 'Diese Adresse existiert nicht',
    sr: 'Ова адреса не постоји', ur: 'یہ پتہ موجود نہیں',
  },
  'El enlace que has seguido apunta a un punto del universo que no está cartografiado. El ecosistema sigue donde lo dejaste.': {
    en: 'The link you followed points to a part of the universe that is not mapped. The ecosystem is still where you left it.',
    pt: 'O link que você seguiu aponta para um ponto do universo que não está mapeado. O ecossistema continua onde você o deixou.',
    fr: "Le lien que vous avez suivi pointe vers un point de l'univers qui n'est pas cartographié. L'écosystème est resté là où vous l'avez laissé.",
    ru: 'Ссылка, по которой вы перешли, ведёт в неотмеченную точку вселенной. Экосистема осталась там, где вы её оставили.',
    sv: 'Länken du följde pekar mot en punkt i universum som inte är kartlagd. Ekosystemet finns kvar där du lämnade det.',
    hr: 'Poveznica koju ste slijedili vodi na točku svemira koja nije kartirana. Ekosustav je i dalje ondje gdje ste ga ostavili.',
    ar: 'يشير الرابط الذي اتّبعته إلى نقطة من الكون غير مرسومة على الخريطة. المنظومة ما زالت حيث تركتها.',
    de: 'Der Link, dem du gefolgt bist, zeigt auf einen nicht kartierten Punkt des Universums. Das Ökosystem ist noch dort, wo du es verlassen hast.',
    sr: 'Веза коју сте пратили води на тачку свемира која није мапирана. Екосистем је и даље тамо где сте га оставили.',
    ur: 'آپ نے جو لنک کھولا وہ کائنات کے ایک غیر نقشہ بند مقام کی طرف جاتا ہے۔ ایکو سسٹم وہیں ہے جہاں آپ نے چھوڑا تھا۔',
  },
  'Ver el ecosistema': {
    en: 'See the ecosystem', pt: 'Ver o ecossistema', fr: "Voir l'écosystème",
    ru: 'Посмотреть экосистему', sv: 'Se ekosystemet', hr: 'Pogledaj ekosustav',
    ar: 'استعرض المنظومة', de: 'Das Ökosystem ansehen', sr: 'Погледај екосистем',
    ur: 'ایکو سسٹم دیکھیں',
  },

  /* ══════════════════════════════════════════════════════════════════
     LA WEB DE G1 — el pie, el descargo y las credenciales.

     Presentes en TODAS las páginas, así que es la tanda que más cambia por
     cadena traducida.

     LOS NOMBRES PROPIOS NO ESTÁN AQUÍ Y ES DELIBERADO: «Tag Markets»,
     «Bit1», «BixCard», «G-Pulse», «Gevy», «AiG Token», «Lloyd's of London»,
     «FSC Mauritius» identifican entidades y productos. Un nombre traducido
     deja de ser el nombre, y quien quiera verificar una licencia en su
     registro ya no la encuentra. Se traduce lo que DESCRIBE, no lo que
     IDENTIFICA.

     AVISO SOBRE LAS LÍNEAS DE RIESGO: «no es asesoría financiera» y el
     descargo de credenciales tienen peso jurídico. Están traducidas con
     cuidado y conviene que alguien las revise por idioma antes de darlas
     por definitivas. Se dejan traducidas y no en español porque un aviso
     que quien lo lee no entiende no protege a nadie.
     ══════════════════════════════════════════════════════════════════ */
  'Informativo · no es asesoría financiera · participación voluntaria y con riesgos.': {
    en: 'Informational · not financial advice · voluntary participation, with risks.',
    pt: 'Informativo · não é assessoria financeira · participação voluntária e com riscos.',
    fr: 'À titre informatif · pas un conseil financier · participation volontaire et à risques.',
    ru: 'Информационно · не финансовая консультация · участие добровольное и сопряжено с рисками.',
    sv: 'Informativt · inte finansiell rådgivning · frivilligt deltagande, med risker.',
    hr: 'Informativno · nije financijski savjet · sudjelovanje je dobrovoljno i nosi rizike.',
    ar: 'لأغراض إعلامية · ليست استشارة مالية · المشاركة طوعية وتنطوي على مخاطر.',
    de: 'Informativ · keine Finanzberatung · freiwillige Teilnahme, mit Risiken.',
    sr: 'Информативно · није финансијски савет · учешће је добровољно и носи ризике.',
    ur: 'معلوماتی · مالی مشورہ نہیں · شرکت رضاکارانہ اور خطرات کے ساتھ۔',
  },
  'La información publicada tiene fines informativos y educativos. No es asesoría financiera, legal ni fiscal. Los mercados y los activos digitales implican riesgos y pueden generar pérdidas parciales o totales. G1 no administra el capital de las personas: cada quien revisa los términos oficiales de cada plataforma, analiza los riesgos y decide de forma independiente.':
    {
      en: 'The information published here is for informational and educational purposes. It is not financial, legal or tax advice. Markets and digital assets carry risk and may lead to partial or total loss. G1 does not manage anyone’s capital: each person reviews the official terms of each platform, weighs the risks and decides independently.',
      pt: 'As informações publicadas têm fins informativos e educativos. Não são assessoria financeira, jurídica nem fiscal. Os mercados e os ativos digitais implicam riscos e podem gerar perdas parciais ou totais. A G1 não administra o capital das pessoas: cada um revisa os termos oficiais de cada plataforma, analisa os riscos e decide de forma independente.',
      fr: 'Les informations publiées ont une finalité informative et éducative. Elles ne constituent ni un conseil financier, ni juridique, ni fiscal. Les marchés et les actifs numériques comportent des risques et peuvent entraîner des pertes partielles ou totales. G1 ne gère pas le capital des personnes : chacun consulte les conditions officielles de chaque plateforme, évalue les risques et décide de façon indépendante.',
      ru: 'Опубликованная информация носит информационный и образовательный характер. Это не финансовая, юридическая или налоговая консультация. Рынки и цифровые активы сопряжены с рисками и могут привести к частичным или полным потерям. G1 не управляет капиталом людей: каждый сам изучает официальные условия каждой платформы, оценивает риски и принимает решение самостоятельно.',
      sv: 'Informationen som publiceras här är av informativ och utbildande karaktär. Den utgör inte finansiell, juridisk eller skatterådgivning. Marknader och digitala tillgångar innebär risker och kan leda till partiella eller totala förluster. G1 förvaltar inte någons kapital: var och en läser de officiella villkoren för varje plattform, bedömer riskerna och beslutar självständigt.',
      hr: 'Objavljene informacije služe u informativne i obrazovne svrhe. Nisu financijski, pravni ni porezni savjet. Tržišta i digitalna imovina nose rizike i mogu dovesti do djelomičnih ili potpunih gubitaka. G1 ne upravlja ničijim kapitalom: svatko pregledava službene uvjete svake platforme, procjenjuje rizike i odlučuje samostalno.',
      ar: 'المعلومات المنشورة لأغراض إعلامية وتعليمية. وهي ليست استشارة مالية أو قانونية أو ضريبية. تنطوي الأسواق والأصول الرقمية على مخاطر وقد تؤدي إلى خسائر جزئية أو كاملة. لا تدير G1 رأس مال الأشخاص: كل شخص يراجع الشروط الرسمية لكل منصة، ويقيّم المخاطر، ويقرر باستقلالية.',
      de: 'Die hier veröffentlichten Informationen dienen der Information und Bildung. Sie sind keine Finanz-, Rechts- oder Steuerberatung. Märkte und digitale Vermögenswerte bergen Risiken und können zu teilweisen oder vollständigen Verlusten führen. G1 verwaltet kein Kapital von Personen: Jede Person prüft die offiziellen Bedingungen jeder Plattform, wägt die Risiken ab und entscheidet eigenständig.',
      sr: 'Објављене информације служе у информативне и образовне сврхе. Нису финансијски, правни ни порески савет. Тржишта и дигитална имовина носе ризике и могу довести до делимичних или потпуних губитака. G1 не управља ничијим капиталом: свако прегледа званичне услове сваке платформе, процењује ризике и одлучује самостално.',
      ur: 'شائع کردہ معلومات معلوماتی اور تعلیمی مقاصد کے لیے ہیں۔ یہ مالی، قانونی یا ٹیکس مشورہ نہیں ہیں۔ مارکیٹیں اور ڈیجیٹل اثاثے خطرات رکھتے ہیں اور جزوی یا مکمل نقصان کا سبب بن سکتے ہیں۔ G1 کسی کے سرمائے کا انتظام نہیں کرتا: ہر شخص خود ہر پلیٹ فارم کی سرکاری شرائط دیکھتا ہے، خطرات کا جائزہ لیتا ہے اور آزادانہ فیصلہ کرتا ہے۔',
    },
  'Respaldo — según la documentación oficial de cada entidad': {
    en: 'Backing — per each entity’s official documentation',
    pt: 'Respaldo — conforme a documentação oficial de cada entidade',
    fr: 'Garanties — selon la documentation officielle de chaque entité',
    ru: 'Обеспечение — согласно официальной документации каждой организации',
    sv: 'Stöd — enligt varje enhets officiella dokumentation',
    hr: 'Podrška — prema službenoj dokumentaciji svakog subjekta',
    ar: 'الدعم — وفقًا للوثائق الرسمية لكل جهة',
    de: 'Absicherung — laut offizieller Dokumentation der jeweiligen Stelle',
    sr: 'Подршка — према званичној документацији сваког субјекта',
    ur: 'پشت پناہی — ہر ادارے کی سرکاری دستاویزات کے مطابق',
  },
  'Génesis muestra estas credenciales de terceros y enlaza a su fuente. No las certifica.': {
    en: 'Génesis displays these third-party credentials and links to their source. It does not certify them.',
    pt: 'A Génesis exibe estas credenciais de terceiros e remete à sua fonte. Não as certifica.',
    fr: 'Génesis présente ces accréditations de tiers et renvoie à leur source. Elle ne les certifie pas.',
    ru: 'Génesis показывает эти сторонние документы и ссылается на их источник. Она их не заверяет.',
    sv: 'Génesis visar dessa tredjepartsintyg och länkar till källan. Vi intygar dem inte.',
    hr: 'Génesis prikazuje ove vjerodajnice trećih strana i povezuje na njihov izvor. Ne potvrđuje ih.',
    ar: 'تعرض Génesis اعتمادات الأطراف الثالثة هذه وتحيل إلى مصدرها. وهي لا تصادق عليها.',
    de: 'Génesis zeigt diese Nachweise Dritter und verlinkt auf deren Quelle. Sie zertifiziert sie nicht.',
    sr: 'Génesis приказује ове акредитиве трећих страна и повезује на њихов извор. Не потврђује их.',
    ur: 'Génesis یہ فریقِ ثالث کی اسناد دکھاتا ہے اور ان کے ماخذ سے منسلک کرتا ہے۔ ان کی تصدیق نہیں کرتا۔',
  },
  'Credenciales de la alianza': {
    en: 'Alliance credentials', pt: 'Credenciais da aliança', fr: 'Accréditations de l’alliance',
    ru: 'Документы альянса', sv: 'Alliansens meriter', hr: 'Vjerodajnice saveza',
    ar: 'اعتمادات التحالف', de: 'Nachweise der Allianz',
    sr: 'Акредитиви савеза', ur: 'اتحاد کی اسناد',
  },
  'comunidad / ecosistema': {
    en: 'community / ecosystem', pt: 'comunidade / ecossistema', fr: 'communauté / écosystème',
    ru: 'сообщество / экосистема', sv: 'gemenskap / ekosystem', hr: 'zajednica / ekosustav',
    ar: 'مجتمع / نظام بيئي', de: 'Community / Ökosystem',
    sr: 'заједница / екосистем', ur: 'کمیونٹی / ایکو سسٹم',
  },
  bróker: {
    en: 'broker', pt: 'corretora', fr: 'courtier', ru: 'брокер', sv: 'mäklare',
    hr: 'broker', ar: 'وسيط', de: 'Broker', sr: 'брокер', ur: 'بروکر',
  },
  'fondo de cobertura': {
    en: 'coverage fund', pt: 'fundo de cobertura', fr: 'fonds de couverture',
    ru: 'фонд покрытия', sv: 'täckningsfond', hr: 'fond pokrića',
    ar: 'صندوق تغطية', de: 'Deckungsfonds', sr: 'фонд покрића', ur: 'کوریج فنڈ',
  },
  'exchange (Bit1)': {
    en: 'exchange (Bit1)', pt: 'exchange (Bit1)', fr: 'plateforme d’échange (Bit1)',
    ru: 'биржа (Bit1)', sv: 'börs (Bit1)', hr: 'burza (Bit1)',
    ar: 'منصة تداول (Bit1)', de: 'Börse (Bit1)', sr: 'берза (Bit1)', ur: 'ایکسچینج (Bit1)',
  },

  /* ══════════════════════════════════════════════════════════════════
     LA WEB DE G1 — titulares, secciones y contenido de página.

     LA BARRA `|` PARTE EL TITULAR y cada idioma decide dónde. En español el
     énfasis del degradado cae al final; en alemán o en árabe no tiene por qué.
     Guardar dos claves —una por trozo— habría pintado el degradado sobre la
     palabra equivocada.

     LOS `**` MARCAN EL ÉNFASIS dentro de una frase. La alternativa era trocear
     el párrafo por cada `<b>`, y nadie puede traducir «se encuentra con» sin
     ver el resto de la oración.

     LOS NOMBRES PROPIOS NO ESTÁN AQUÍ: «Tag Markets», «Bit1», «BixCard»,
     «G-Pulse», «Gevy», «AiG Token», «Génesis», «Aitech», «Lloyd's of London»,
     «FSC Mauritius». Al no tener entrada, `t()` devuelve el original — que es
     exactamente lo que debe verse.
     ══════════════════════════════════════════════════════════════════ */
  'Tu comunidad,|con herramientas reales.': {
    en: 'Your community,|with real tools.', pt: 'Sua comunidade,|com ferramentas reais.',
    fr: 'Ta communauté,|avec de vrais outils.', ru: 'Твоё сообщество,|с реальными инструментами.',
    sv: 'Din gemenskap,|med riktiga verktyg.', hr: 'Tvoja zajednica,|sa stvarnim alatima.',
    ar: 'مجتمعك،|بأدوات حقيقية.', de: 'Deine Community,|mit echten Werkzeugen.',
    sr: 'Твоја заједница,|са стварним алатима.', ur: 'آپ کی کمیونٹی،|حقیقی اوزاروں کے ساتھ۔',
  },
  'Tu comunidad, con herramientas reales.': {
    en: 'Your community, with real tools.', pt: 'Sua comunidade, com ferramentas reais.',
    fr: 'Ta communauté, avec de vrais outils.', ru: 'Твоё сообщество, с реальными инструментами.',
    sv: 'Din gemenskap, med riktiga verktyg.', hr: 'Tvoja zajednica, sa stvarnim alatima.',
    ar: 'مجتمعك، بأدوات حقيقية.', de: 'Deine Community, mit echten Werkzeugen.',
    sr: 'Твоја заједница, са стварним алатима.', ur: 'آپ کی کمیونٹی، حقیقی اوزاروں کے ساتھ۔',
  },
  'Trading, exchange y tarjeta cripto de la alianza, con la usabilidad del AiG Token. Una comunidad global que se une al ecosistema.':
    {
      en: 'Trading, exchange and crypto card from the alliance, with the AiG Token’s usability. A global community joining the ecosystem.',
      pt: 'Trading, exchange e cartão cripto da aliança, com a usabilidade do AiG Token. Uma comunidade global que se une ao ecossistema.',
      fr: 'Trading, échange et carte crypto de l’alliance, avec l’utilité du AiG Token. Une communauté mondiale qui rejoint l’écosystème.',
      ru: 'Трейдинг, биржа и криптокарта альянса — с применимостью AiG Token. Глобальное сообщество, присоединяющееся к экосистеме.',
      sv: 'Handel, börs och kryptokort från alliansen, med AiG Tokens användbarhet. En global gemenskap som ansluter sig till ekosystemet.',
      hr: 'Trgovanje, burza i kripto kartica saveza, uz upotrebljivost AiG Tokena. Globalna zajednica koja se pridružuje ekosustavu.',
      ar: 'التداول والمنصة وبطاقة التشفير من التحالف، مع قابلية استخدام AiG Token. مجتمع عالمي ينضم إلى النظام البيئي.',
      de: 'Trading, Börse und Krypto-Karte der Allianz, mit der Nutzbarkeit des AiG Token. Eine globale Community, die sich dem Ökosystem anschließt.',
      sr: 'Трговање, берза и крипто картица савеза, уз употребљивост AiG Token-а. Глобална заједница која се придружује екосистему.',
      ur: 'اتحاد کی ٹریڈنگ، ایکسچینج اور کرپٹو کارڈ، AiG Token کی افادیت کے ساتھ۔ ایک عالمی کمیونٹی جو ایکو سسٹم میں شامل ہو رہی ہے۔',
    },
  'Trading, exchange y tarjeta cripto de la alianza, con la usabilidad del AiG Token.': {
    en: 'Trading, exchange and crypto card from the alliance, with the AiG Token’s usability.',
    pt: 'Trading, exchange e cartão cripto da aliança, com a usabilidade do AiG Token.',
    fr: 'Trading, échange et carte crypto de l’alliance, avec l’utilité du AiG Token.',
    ru: 'Трейдинг, биржа и криптокарта альянса — с применимостью AiG Token.',
    sv: 'Handel, börs och kryptokort från alliansen, med AiG Tokens användbarhet.',
    hr: 'Trgovanje, burza i kripto kartica saveza, uz upotrebljivost AiG Tokena.',
    ar: 'التداول والمنصة وبطاقة التشفير من التحالف، مع قابلية استخدام AiG Token.',
    de: 'Trading, Börse und Krypto-Karte der Allianz, mit der Nutzbarkeit des AiG Token.',
    sr: 'Трговање, берза и крипто картица савеза, уз употребљивост AiG Token-а.',
    ur: 'اتحاد کی ٹریڈنگ، ایکسچینج اور کرپٹو کارڈ، AiG Token کی افادیت کے ساتھ۔',
  },
  'Conocer el ecosistema': {
    en: 'Explore the ecosystem', pt: 'Conhecer o ecossistema', fr: 'Découvrir l’écosystème',
    ru: 'Узнать об экосистеме', sv: 'Utforska ekosystemet', hr: 'Upoznaj ekosustav',
    ar: 'تعرّف على النظام البيئي', de: 'Das Ökosystem entdecken',
    sr: 'Упознај екосистем', ur: 'ایکو سسٹم جانیں',
  },
  /* `Ver el ecosistema` ya existe más arriba (línea ~1901). */
  'Explora el ecosistema.': {
    en: 'Explore the ecosystem.', pt: 'Explore o ecossistema.', fr: 'Explore l’écosystème.',
    ru: 'Исследуй экосистему.', sv: 'Utforska ekosystemet.', hr: 'Istraži ekosustav.',
    ar: 'استكشف النظام البيئي.', de: 'Erkunde das Ökosystem.',
    sr: 'Истражи екосистем.', ur: 'ایکو سسٹم دریافت کریں۔',
  },
  'La comunidad': {
    en: 'The community', pt: 'A comunidade', fr: 'La communauté', ru: 'Сообщество',
    sv: 'Gemenskapen', hr: 'Zajednica', ar: 'المجتمع', de: 'Die Community',
    sr: 'Заједница', ur: 'کمیونٹی',
  },

  /* ── «Qué es G1» ─────────────────────────────────────────────────── */
  'La marca de|la alianza.': {
    en: 'The brand of|the alliance.', pt: 'A marca da|aliança.', fr: 'La marque de|l’alliance.',
    ru: 'Бренд|альянса.', sv: 'Alliansens|varumärke.', hr: 'Brand|saveza.',
    ar: 'علامة|التحالف.', de: 'Die Marke der|Allianz.', sr: 'Бренд|савеза.', ur: 'اتحاد کا|برانڈ۔',
  },
  'G1 es la puerta a un ecosistema donde una **comunidad** se encuentra con **herramientas financieras reales** —trading, exchange y tarjeta cripto— con la usabilidad del **AiG Token**. Nace de la unión de tres fuerzas: **comunidad**, **tecnología** y **finanzas**.':
    {
      en: 'G1 is the door to an ecosystem where a **community** meets **real financial tools** — trading, exchange and a crypto card — with the usability of the **AiG Token**. It is born from three forces coming together: **community**, **technology** and **finance**.',
      pt: 'A G1 é a porta para um ecossistema onde uma **comunidade** encontra **ferramentas financeiras reais** — trading, exchange e cartão cripto — com a usabilidade do **AiG Token**. Nasce da união de três forças: **comunidade**, **tecnologia** e **finanças**.',
      fr: 'G1 est la porte d’un écosystème où une **communauté** rencontre de **vrais outils financiers** — trading, échange et carte crypto — avec l’utilité du **AiG Token**. Elle naît de l’union de trois forces : **communauté**, **technologie** et **finance**.',
      ru: 'G1 — это дверь в экосистему, где **сообщество** встречается с **реальными финансовыми инструментами** — трейдингом, биржей и криптокартой — при применимости **AiG Token**. Она рождается из союза трёх сил: **сообщества**, **технологии** и **финансов**.',
      sv: 'G1 är dörren till ett ekosystem där en **gemenskap** möter **riktiga finansiella verktyg** — handel, börs och kryptokort — med **AiG Tokens** användbarhet. Den föds ur tre krafter som förenas: **gemenskap**, **teknik** och **finans**.',
      hr: 'G1 su vrata u ekosustav u kojem **zajednica** susreće **stvarne financijske alate** — trgovanje, burzu i kripto karticu — uz upotrebljivost **AiG Tokena**. Rađa se iz spoja triju sila: **zajednice**, **tehnologije** i **financija**.',
      ar: 'G1 هي البوابة إلى نظام بيئي يلتقي فيه **مجتمع** بـ**أدوات مالية حقيقية** — تداول ومنصة وبطاقة تشفير — مع قابلية استخدام **AiG Token**. تولد من اتحاد ثلاث قوى: **المجتمع** و**التقنية** و**التمويل**.',
      de: 'G1 ist die Tür zu einem Ökosystem, in dem eine **Community** auf **echte Finanzwerkzeuge** trifft — Trading, Börse und Krypto-Karte — mit der Nutzbarkeit des **AiG Token**. Sie entsteht aus dem Zusammenschluss dreier Kräfte: **Community**, **Technologie** und **Finanzen**.',
      sr: 'G1 су врата у екосистем у којем **заједница** сусреће **стварне финансијске алате** — трговање, берзу и крипто картицу — уз употребљивост **AiG Token-а**. Рађа се из споја три силе: **заједнице**, **технологије** и **финансија**.',
      ur: 'G1 ایک ایکو سسٹم کا دروازہ ہے جہاں ایک **کمیونٹی** **حقیقی مالیاتی اوزاروں** سے ملتی ہے — ٹریڈنگ، ایکسچینج اور کرپٹو کارڈ — **AiG Token** کی افادیت کے ساتھ۔ یہ تین قوتوں کے اتحاد سے جنم لیتا ہے: **کمیونٹی**، **ٹیکنالوجی** اور **فنانس**۔',
    },
  'Tres fuerzas que convergen en|un solo núcleo.': {
    en: 'Three forces converging into|a single core.', pt: 'Três forças que convergem em|um só núcleo.',
    fr: 'Trois forces qui convergent en|un seul noyau.', ru: 'Три силы, сходящиеся в|одно ядро.',
    sv: 'Tre krafter som möts i|en enda kärna.', hr: 'Tri sile koje se spajaju u|jednu jezgru.',
    ar: 'ثلاث قوى تلتقي في|نواة واحدة.', de: 'Drei Kräfte, die zu|einem Kern zusammenfinden.',
    sr: 'Три силе које се спајају у|једно језгро.', ur: 'تین قوتیں جو|ایک مرکز میں ملتی ہیں۔',
  },
  'La alianza': {
    en: 'The alliance', pt: 'A aliança', fr: 'L’alliance', ru: 'Альянс', sv: 'Alliansen',
    hr: 'Savez', ar: 'التحالف', de: 'Die Allianz', sr: 'Савез', ur: 'اتحاد',
  },
  'Una visión': {
    en: 'One vision', pt: 'Uma visão', fr: 'Une vision', ru: 'Одно видение', sv: 'En vision',
    hr: 'Jedna vizija', ar: 'رؤية واحدة', de: 'Eine Vision', sr: 'Једна визија', ur: 'ایک وژن',
  },
  'Una red': {
    en: 'One network', pt: 'Uma rede', fr: 'Un réseau', ru: 'Одна сеть', sv: 'Ett nätverk',
    hr: 'Jedna mreža', ar: 'شبكة واحدة', de: 'Ein Netzwerk', sr: 'Једна мрежа', ur: 'ایک نیٹ ورک',
  },
  'Un ecosistema': {
    en: 'One ecosystem', pt: 'Um ecossistema', fr: 'Un écosystème', ru: 'Одна экосистема',
    sv: 'Ett ekosystem', hr: 'Jedan ekosustav', ar: 'نظام بيئي واحد', de: 'Ein Ökosystem',
    sr: 'Један екосистем', ur: 'ایک ایکو سسٹم',
  },
  'Powered by': {
    en: 'Powered by', pt: 'Powered by', fr: 'Propulsé par', ru: 'При поддержке',
    sv: 'Drivs av', hr: 'Pokreće', ar: 'مدعوم من', de: 'Ermöglicht durch',
    sr: 'Покреће', ur: 'تعاون سے',
  },
  'Comunidad + tecnología': {
    en: 'Community + technology', pt: 'Comunidade + tecnologia', fr: 'Communauté + technologie',
    ru: 'Сообщество + технологии', sv: 'Gemenskap + teknik', hr: 'Zajednica + tehnologija',
    ar: 'مجتمع + تقنية', de: 'Community + Technologie',
    sr: 'Заједница + технологија', ur: 'کمیونٹی + ٹیکنالوجی',
  },
  'Adopción y comunidad global': {
    en: 'Adoption and global community', pt: 'Adoção e comunidade global',
    fr: 'Adoption et communauté mondiale', ru: 'Внедрение и глобальное сообщество',
    sv: 'Spridning och global gemenskap', hr: 'Prihvaćanje i globalna zajednica',
    ar: 'التبني والمجتمع العالمي', de: 'Verbreitung und globale Community',
    sr: 'Прихватање и глобална заједница', ur: 'اپنانا اور عالمی کمیونٹی',
  },
  Finanzas: {
    en: 'Finance', pt: 'Finanças', fr: 'Finance', ru: 'Финансы', sv: 'Finans',
    hr: 'Financije', ar: 'التمويل', de: 'Finanzen', sr: 'Финансије', ur: 'فنانس',
  },
  'La comunidad que se une y aporta su propia tecnología: G-Pulse, marketplace, el AiG Token y blockchain. Es la que da usabilidad y liquidez al ecosistema.':
    {
      en: 'The community that joins and brings its own technology: G-Pulse, marketplace, the AiG Token and blockchain. It is what gives the ecosystem usability and liquidity.',
      pt: 'A comunidade que se une e traz sua própria tecnologia: G-Pulse, marketplace, o AiG Token e blockchain. É ela que dá usabilidade e liquidez ao ecossistema.',
      fr: 'La communauté qui rejoint et apporte sa propre technologie : G-Pulse, marketplace, le AiG Token et la blockchain. C’est elle qui donne à l’écosystème son utilité et sa liquidité.',
      ru: 'Сообщество, которое присоединяется и приносит собственную технологию: G-Pulse, маркетплейс, AiG Token и блокчейн. Именно оно даёт экосистеме применимость и ликвидность.',
      sv: 'Gemenskapen som ansluter sig och bidrar med egen teknik: G-Pulse, marknadsplats, AiG Token och blockkedja. Det är den som ger ekosystemet användbarhet och likviditet.',
      hr: 'Zajednica koja se pridružuje i donosi vlastitu tehnologiju: G-Pulse, tržnicu, AiG Token i blockchain. Ona daje ekosustavu upotrebljivost i likvidnost.',
      ar: 'المجتمع الذي ينضم ويقدّم تقنيته الخاصة: G-Pulse والسوق و AiG Token والبلوكشين. وهو ما يمنح النظام البيئي قابلية الاستخدام والسيولة.',
      de: 'Die Community, die sich anschließt und ihre eigene Technologie einbringt: G-Pulse, Marktplatz, den AiG Token und Blockchain. Sie verleiht dem Ökosystem Nutzbarkeit und Liquidität.',
      sr: 'Заједница која се придружује и доноси властиту технологију: G-Pulse, маркетплејс, AiG Token и блокчејн. Она даје екосистему употребљивост и ликвидност.',
      ur: 'وہ کمیونٹی جو شامل ہوتی ہے اور اپنی ٹیکنالوجی لاتی ہے: G-Pulse، مارکیٹ پلیس، AiG Token اور بلاک چین۔ یہی ایکو سسٹم کو افادیت اور لیکویڈیٹی دیتی ہے۔',
    },
  'La comunidad internacional de Aitech One: educación, liderazgo y expansión que acercan la tecnología a las personas.':
    {
      en: 'The international Aitech One community: education, leadership and outreach that bring technology closer to people.',
      pt: 'A comunidade internacional da Aitech One: educação, liderança e expansão que aproximam a tecnologia das pessoas.',
      fr: 'La communauté internationale d’Aitech One : formation, leadership et expansion qui rapprochent la technologie des gens.',
      ru: 'Международное сообщество Aitech One: обучение, лидерство и расширение, которые приближают технологию к людям.',
      sv: 'Aitech Ones internationella gemenskap: utbildning, ledarskap och expansion som för tekniken närmare människor.',
      hr: 'Međunarodna zajednica Aitech One: edukacija, vodstvo i širenje koji približavaju tehnologiju ljudima.',
      ar: 'مجتمع Aitech One الدولي: التعليم والقيادة والتوسّع التي تقرّب التقنية من الناس.',
      de: 'Die internationale Aitech-One-Community: Bildung, Führung und Expansion, die Technologie näher zu den Menschen bringen.',
      sr: 'Међународна заједница Aitech One: едукација, вођство и ширење који приближавају технологију људима.',
      ur: 'Aitech One کی بین الاقوامی کمیونٹی: تعلیم، قیادت اور توسیع جو ٹیکنالوجی کو لوگوں کے قریب لاتی ہے۔',
    },
  'La infraestructura financiera de la alianza: Tag Markets (trading), Bit1 (exchange) y BixCard (tarjeta Visa cripto).':
    {
      en: 'The alliance’s financial infrastructure: Tag Markets (trading), Bit1 (exchange) and BixCard (crypto Visa card).',
      pt: 'A infraestrutura financeira da aliança: Tag Markets (trading), Bit1 (exchange) e BixCard (cartão Visa cripto).',
      fr: 'L’infrastructure financière de l’alliance : Tag Markets (trading), Bit1 (échange) et BixCard (carte Visa crypto).',
      ru: 'Финансовая инфраструктура альянса: Tag Markets (трейдинг), Bit1 (биржа) и BixCard (криптокарта Visa).',
      sv: 'Alliansens finansiella infrastruktur: Tag Markets (handel), Bit1 (börs) och BixCard (krypto-Visakort).',
      hr: 'Financijska infrastruktura saveza: Tag Markets (trgovanje), Bit1 (burza) i BixCard (kripto Visa kartica).',
      ar: 'البنية المالية للتحالف: Tag Markets (تداول) و Bit1 (منصة) و BixCard (بطاقة Visa للتشفير).',
      de: 'Die Finanzinfrastruktur der Allianz: Tag Markets (Trading), Bit1 (Börse) und BixCard (Krypto-Visa-Karte).',
      sr: 'Финансијска инфраструктура савеза: Tag Markets (трговање), Bit1 (берза) и BixCard (крипто Visa картица).',
      ur: 'اتحاد کا مالیاتی ڈھانچہ: Tag Markets (ٹریڈنگ)، Bit1 (ایکسچینج) اور BixCard (کرپٹو ویزا کارڈ)۔',
    },
  'Una comunidad internacional unida por herramientas reales. Material informativo.': {
    en: 'An international community united by real tools. Informational material.',
    pt: 'Uma comunidade internacional unida por ferramentas reais. Material informativo.',
    fr: 'Une communauté internationale unie par de vrais outils. Document d’information.',
    ru: 'Международное сообщество, объединённое реальными инструментами. Информационный материал.',
    sv: 'En internationell gemenskap förenad av riktiga verktyg. Informationsmaterial.',
    hr: 'Međunarodna zajednica ujedinjena stvarnim alatima. Informativni materijal.',
    ar: 'مجتمع دولي يوحّده امتلاك أدوات حقيقية. مادة إعلامية.',
    de: 'Eine internationale Community, vereint durch echte Werkzeuge. Informationsmaterial.',
    sr: 'Међународна заједница уједињена стварним алатима. Информативни материјал.',
    ur: 'ایک بین الاقوامی کمیونٹی جو حقیقی اوزاروں سے جڑی ہے۔ معلوماتی مواد۔',
  },
  'El AiG Token, con uso real': {
    en: 'The AiG Token, with real use', pt: 'O AiG Token, com uso real',
    fr: 'Le AiG Token, avec un usage réel', ru: 'AiG Token — с реальным применением',
    sv: 'AiG Token, med verklig användning', hr: 'AiG Token, sa stvarnom primjenom',
    ar: 'AiG Token باستخدام حقيقي', de: 'Der AiG Token, mit echtem Nutzen',
    sr: 'AiG Token, са стварном применом', ur: 'AiG Token، حقیقی استعمال کے ساتھ',
  },
  'Un token con usabilidad, no una promesa.': {
    en: 'A token with usability, not a promise.', pt: 'Um token com usabilidade, não uma promessa.',
    fr: 'Un jeton avec une utilité, pas une promesse.', ru: 'Токен с применимостью, а не обещание.',
    sv: 'En token med användbarhet, inte ett löfte.', hr: 'Token s upotrebljivošću, a ne obećanje.',
    ar: 'رمز بقابلية استخدام، لا وعد.', de: 'Ein Token mit Nutzbarkeit, kein Versprechen.',
    sr: 'Токен са употребљивошћу, а не обећање.', ur: 'ایک ٹوکن جو افادیت رکھتا ہے، وعدہ نہیں۔',
  },
  'El AiG Token es el hilo que conecta la comunidad con las herramientas de la alianza. Dentro del ecosistema se usa en formato **DUAL (AIG + USDT)**, para dar liquidez y acceso a los productos. Es material informativo: no es asesoría financiera y la participación es voluntaria y con riesgos.':
    {
      en: 'The AiG Token is the thread that connects the community to the alliance’s tools. Inside the ecosystem it is used in **DUAL (AIG + USDT)** format, to provide liquidity and access to the products. This is informational material: it is not financial advice, and participation is voluntary and carries risk.',
      pt: 'O AiG Token é o fio que conecta a comunidade às ferramentas da aliança. Dentro do ecossistema é usado no formato **DUAL (AIG + USDT)**, para dar liquidez e acesso aos produtos. É material informativo: não é assessoria financeira e a participação é voluntária e com riscos.',
      fr: 'Le AiG Token est le fil qui relie la communauté aux outils de l’alliance. Dans l’écosystème, il s’utilise au format **DUAL (AIG + USDT)**, pour apporter liquidité et accès aux produits. Document d’information : ce n’est pas un conseil financier et la participation est volontaire et comporte des risques.',
      ru: 'AiG Token — нить, связывающая сообщество с инструментами альянса. Внутри экосистемы он используется в формате **DUAL (AIG + USDT)**, чтобы давать ликвидность и доступ к продуктам. Это информационный материал: не финансовая консультация; участие добровольное и сопряжено с рисками.',
      sv: 'AiG Token är tråden som kopplar gemenskapen till alliansens verktyg. Inom ekosystemet används den i **DUAL-format (AIG + USDT)**, för att ge likviditet och tillgång till produkterna. Detta är informationsmaterial: inte finansiell rådgivning, och deltagandet är frivilligt och innebär risker.',
      hr: 'AiG Token je nit koja povezuje zajednicu s alatima saveza. Unutar ekosustava koristi se u **DUAL formatu (AIG + USDT)**, kako bi dao likvidnost i pristup proizvodima. Ovo je informativni materijal: nije financijski savjet, a sudjelovanje je dobrovoljno i nosi rizike.',
      ar: 'AiG Token هو الخيط الذي يربط المجتمع بأدوات التحالف. داخل النظام البيئي يُستخدم بصيغة **DUAL ‏(AIG + USDT)** لتوفير السيولة والوصول إلى المنتجات. هذه مادة إعلامية: ليست استشارة مالية، والمشاركة طوعية وتنطوي على مخاطر.',
      de: 'Der AiG Token ist der Faden, der die Community mit den Werkzeugen der Allianz verbindet. Im Ökosystem wird er im **DUAL-Format (AIG + USDT)** verwendet, um Liquidität und Zugang zu den Produkten zu schaffen. Dies ist Informationsmaterial: keine Finanzberatung; die Teilnahme ist freiwillig und mit Risiken verbunden.',
      sr: 'AiG Token је нит која повезује заједницу са алатима савеза. Унутар екосистема користи се у **DUAL формату (AIG + USDT)**, да би дао ликвидност и приступ производима. Ово је информативни материјал: није финансијски савет, а учешће је добровољно и носи ризике.',
      ur: 'AiG Token وہ دھاگہ ہے جو کمیونٹی کو اتحاد کے اوزاروں سے جوڑتا ہے۔ ایکو سسٹم کے اندر یہ **DUAL (AIG + USDT)** فارمیٹ میں استعمال ہوتا ہے تاکہ لیکویڈیٹی اور مصنوعات تک رسائی ملے۔ یہ معلوماتی مواد ہے: مالی مشورہ نہیں، اور شرکت رضاکارانہ اور خطرات کے ساتھ ہے۔',
    },
  'Comunidad que se une': {
    en: 'A community that joins', pt: 'Comunidade que se une', fr: 'Une communauté qui se rassemble',
    ru: 'Сообщество, которое объединяется', sv: 'En gemenskap som förenas',
    hr: 'Zajednica koja se okuplja', ar: 'مجتمع يتّحد', de: 'Eine Community, die sich verbindet',
    sr: 'Заједница која се окупља', ur: 'ایک کمیونٹی جو جڑتی ہے',
  },
  'Herramientas reales (trading · exchange · tarjeta)': {
    en: 'Real tools (trading · exchange · card)', pt: 'Ferramentas reais (trading · exchange · cartão)',
    fr: 'De vrais outils (trading · échange · carte)', ru: 'Реальные инструменты (трейдинг · биржа · карта)',
    sv: 'Riktiga verktyg (handel · börs · kort)', hr: 'Stvarni alati (trgovanje · burza · kartica)',
    ar: 'أدوات حقيقية (تداول · منصة · بطاقة)', de: 'Echte Werkzeuge (Trading · Börse · Karte)',
    sr: 'Стварни алати (трговање · берза · картица)', ur: 'حقیقی اوزار (ٹریڈنگ · ایکسچینج · کارڈ)',
  },
  'Usabilidad DUAL del AiG Token': {
    en: 'DUAL usability of the AiG Token', pt: 'Usabilidade DUAL do AiG Token',
    fr: 'Utilité DUAL du AiG Token', ru: 'DUAL-применимость AiG Token',
    sv: 'DUAL-användbarhet för AiG Token', hr: 'DUAL upotrebljivost AiG Tokena',
    ar: 'استخدام DUAL لـ AiG Token', de: 'DUAL-Nutzbarkeit des AiG Token',
    sr: 'DUAL употребљивост AiG Token-а', ur: 'AiG Token کی DUAL افادیت',
  },

  /* ── la narrativa, los actos ─────────────────────────────────────── */
  'Todo empieza con|una comunidad.': {
    en: 'It all begins with|a community.', pt: 'Tudo começa com|uma comunidade.',
    fr: 'Tout commence par|une communauté.', ru: 'Всё начинается с|сообщества.',
    sv: 'Allt börjar med|en gemenskap.', hr: 'Sve počinje sa|zajednicom.',
    ar: 'كل شيء يبدأ من|مجتمع.', de: 'Alles beginnt mit|einer Community.',
    sr: 'Све почиње са|заједницом.', ur: 'سب کچھ شروع ہوتا ہے|ایک کمیونٹی سے۔',
  },
  'Aitech △ · la tecnología': {
    en: 'Aitech △ · technology', pt: 'Aitech △ · a tecnologia', fr: 'Aitech △ · la technologie',
    ru: 'Aitech △ · технология', sv: 'Aitech △ · tekniken', hr: 'Aitech △ · tehnologija',
    ar: 'Aitech △ · التقنية', de: 'Aitech △ · die Technologie',
    sr: 'Aitech △ · технологија', ur: 'Aitech △ · ٹیکنالوجی',
  },
  'TAG △ · el mercado': {
    en: 'TAG △ · the market', pt: 'TAG △ · o mercado', fr: 'TAG △ · le marché',
    ru: 'TAG △ · рынок', sv: 'TAG △ · marknaden', hr: 'TAG △ · tržište',
    ar: 'TAG △ · السوق', de: 'TAG △ · der Markt', sr: 'TAG △ · тржиште', ur: 'TAG △ · مارکیٹ',
  },
  'Génesis △ · la comunidad': {
    en: 'Génesis △ · the community', pt: 'Génesis △ · a comunidade', fr: 'Génesis △ · la communauté',
    ru: 'Génesis △ · сообщество', sv: 'Génesis △ · gemenskapen', hr: 'Génesis △ · zajednica',
    ar: 'Génesis △ · المجتمع', de: 'Génesis △ · die Community',
    sr: 'Génesis △ · заједница', ur: 'Génesis △ · کمیونٹی',
  },
  'Herramientas que ya funcionan.': {
    en: 'Tools that already work.', pt: 'Ferramentas que já funcionam.',
    fr: 'Des outils qui fonctionnent déjà.', ru: 'Инструменты, которые уже работают.',
    sv: 'Verktyg som redan fungerar.', hr: 'Alati koji već rade.',
    ar: 'أدوات تعمل بالفعل.', de: 'Werkzeuge, die bereits funktionieren.',
    sr: 'Алати који већ раде.', ur: 'وہ اوزار جو پہلے سے کام کرتے ہیں۔',
  },
  'Acceso real a los mercados.': {
    en: 'Real access to the markets.', pt: 'Acesso real aos mercados.',
    fr: 'Un accès réel aux marchés.', ru: 'Реальный доступ к рынкам.',
    sv: 'Verklig tillgång till marknaderna.', hr: 'Stvaran pristup tržištima.',
    ar: 'وصول حقيقي إلى الأسواق.', de: 'Echter Zugang zu den Märkten.',
    sr: 'Стваран приступ тржиштима.', ur: 'مارکیٹوں تک حقیقی رسائی۔',
  },
  'La comunidad que las une.': {
    en: 'The community that unites them.', pt: 'A comunidade que as une.',
    fr: 'La communauté qui les réunit.', ru: 'Сообщество, которое их объединяет.',
    sv: 'Gemenskapen som förenar dem.', hr: 'Zajednica koja ih spaja.',
    ar: 'المجتمع الذي يجمعها.', de: 'Die Community, die sie verbindet.',
    sr: 'Заједница која их спаја.', ur: 'وہ کمیونٹی جو انہیں جوڑتی ہے۔',
  },
  'El nacimiento de G1': {
    en: 'The birth of G1', pt: 'O nascimento da G1', fr: 'La naissance de G1',
    ru: 'Рождение G1', sv: 'G1:s födelse', hr: 'Rođenje G1', ar: 'ولادة G1',
    de: 'Die Geburt von G1', sr: 'Рођење G1', ur: 'G1 کی پیدائش',
  },
  'Empieza con G1.': {
    en: 'Start with G1.', pt: 'Comece com a G1.', fr: 'Commence avec G1.',
    ru: 'Начни с G1.', sv: 'Börja med G1.', hr: 'Počni s G1.', ar: 'ابدأ مع G1.',
    de: 'Fang mit G1 an.', sr: 'Почни са G1.', ur: 'G1 سے شروع کریں۔',
  },
  'Desplázate para vivir la experiencia': {
    en: 'Scroll to live the experience', pt: 'Role para viver a experiência',
    fr: 'Fais défiler pour vivre l’expérience', ru: 'Прокрути, чтобы прожить этот опыт',
    sv: 'Skrolla för att uppleva det', hr: 'Pomiči se da doživiš iskustvo',
    ar: 'مرّر لتعيش التجربة', de: 'Scrolle, um es zu erleben',
    sr: 'Померај да доживиш искуство', ur: 'تجربہ محسوس کرنے کے لیے سکرول کریں',
  },
  'La web continúa · sigue bajando': {
    en: 'The site continues · keep scrolling', pt: 'O site continua · continue rolando',
    fr: 'Le site continue · continue de défiler', ru: 'Сайт продолжается · листай дальше',
    sv: 'Sidan fortsätter · fortsätt skrolla', hr: 'Stranica se nastavlja · nastavi listati',
    ar: 'الموقع يستمر · تابع التمرير', de: 'Die Seite geht weiter · weiter scrollen',
    sr: 'Страница се наставља · настави да листаш', ur: 'ویب سائٹ جاری ہے · سکرول کرتے رہیں',
  },

  /* ── «Cómo funciona» ─────────────────────────────────────────────── */
  'Participar en G1 es un recorrido de tres pasos. Es material informativo: no es asesoría financiera y la participación es voluntaria y con riesgos.':
    {
      en: 'Taking part in G1 is a three-step path. This is informational material: it is not financial advice, and participation is voluntary and carries risk.',
      pt: 'Participar da G1 é um percurso de três passos. É material informativo: não é assessoria financeira e a participação é voluntária e com riscos.',
      fr: 'Participer à G1 se fait en trois étapes. Document d’information : ce n’est pas un conseil financier et la participation est volontaire et comporte des risques.',
      ru: 'Участие в G1 — это путь из трёх шагов. Информационный материал: не финансовая консультация; участие добровольное и сопряжено с рисками.',
      sv: 'Att delta i G1 är en resa i tre steg. Detta är informationsmaterial: inte finansiell rådgivning, och deltagandet är frivilligt och innebär risker.',
      hr: 'Sudjelovanje u G1 put je od tri koraka. Ovo je informativni materijal: nije financijski savjet, a sudjelovanje je dobrovoljno i nosi rizike.',
      ar: 'المشاركة في G1 مسار من ثلاث خطوات. هذه مادة إعلامية: ليست استشارة مالية، والمشاركة طوعية وتنطوي على مخاطر.',
      de: 'Bei G1 mitzumachen ist ein Weg in drei Schritten. Dies ist Informationsmaterial: keine Finanzberatung; die Teilnahme ist freiwillig und mit Risiken verbunden.',
      sr: 'Учешће у G1 је пут од три корака. Ово је информативни материјал: није финансијски савет, а учешће је добровољно и носи ризике.',
      ur: 'G1 میں شرکت تین مراحل کا سفر ہے۔ یہ معلوماتی مواد ہے: مالی مشورہ نہیں، اور شرکت رضاکارانہ اور خطرات کے ساتھ ہے۔',
    },
  'Te unes por la comunidad': {
    en: 'You join through the community', pt: 'Você entra pela comunidade',
    fr: 'Tu rejoins par la communauté', ru: 'Ты присоединяешься через сообщество',
    sv: 'Du ansluter via gemenskapen', hr: 'Pridružuješ se preko zajednice',
    ar: 'تنضم عبر المجتمع', de: 'Du kommst über die Community dazu',
    sr: 'Придружујеш се преко заједнице', ur: 'آپ کمیونٹی کے ذریعے شامل ہوتے ہیں',
  },
  'Génesis es la puerta de entrada. Desde G-Pulse accedes a la comunidad, las membresías y tu cuenta.':
    {
      en: 'Génesis is the way in. From G-Pulse you reach the community, the memberships and your account.',
      pt: 'A Génesis é a porta de entrada. A partir do G-Pulse você acessa a comunidade, as assinaturas e sua conta.',
      fr: 'Génesis est la porte d’entrée. Depuis G-Pulse tu accèdes à la communauté, aux abonnements et à ton compte.',
      ru: 'Génesis — это вход. Из G-Pulse ты попадаешь в сообщество, к подпискам и своему аккаунту.',
      sv: 'Génesis är ingången. Från G-Pulse når du gemenskapen, medlemskapen och ditt konto.',
      hr: 'Génesis su ulazna vrata. Iz G-Pulsea pristupaš zajednici, članstvima i svom računu.',
      ar: 'Génesis هي بوابة الدخول. من G-Pulse تصل إلى المجتمع والعضويات وحسابك.',
      de: 'Génesis ist der Eingang. Von G-Pulse aus erreichst du die Community, die Mitgliedschaften und dein Konto.',
      sr: 'Génesis су улазна врата. Из G-Pulse-а приступаш заједници, чланствима и свом налогу.',
      ur: 'Génesis داخلے کا دروازہ ہے۔ G-Pulse سے آپ کمیونٹی، ممبرشپس اور اپنے اکاؤنٹ تک پہنچتے ہیں۔',
    },
  'Accedes a las herramientas': {
    en: 'You get access to the tools', pt: 'Você acessa as ferramentas',
    fr: 'Tu accèdes aux outils', ru: 'Ты получаешь доступ к инструментам',
    sv: 'Du får tillgång till verktygen', hr: 'Pristupaš alatima',
    ar: 'تصل إلى الأدوات', de: 'Du erhältst Zugang zu den Werkzeugen',
    sr: 'Приступаш алатима', ur: 'آپ اوزاروں تک رسائی پاتے ہیں',
  },
  'La alianza aporta la trilogía de mercado: Tag Markets (trading), Bit1 (exchange) y BixCard (tarjeta cripto).':
    {
      en: 'The alliance brings the market trilogy: Tag Markets (trading), Bit1 (exchange) and BixCard (crypto card).',
      pt: 'A aliança traz a trilogia de mercado: Tag Markets (trading), Bit1 (exchange) e BixCard (cartão cripto).',
      fr: 'L’alliance apporte la trilogie de marché : Tag Markets (trading), Bit1 (échange) et BixCard (carte crypto).',
      ru: 'Альянс приносит рыночную трилогию: Tag Markets (трейдинг), Bit1 (биржа) и BixCard (криптокарта).',
      sv: 'Alliansen bidrar med marknadstrilogin: Tag Markets (handel), Bit1 (börs) och BixCard (kryptokort).',
      hr: 'Savez donosi tržišnu trilogiju: Tag Markets (trgovanje), Bit1 (burza) i BixCard (kripto kartica).',
      ar: 'يقدّم التحالف ثلاثية السوق: Tag Markets (تداول) و Bit1 (منصة) و BixCard (بطاقة تشفير).',
      de: 'Die Allianz bringt die Markt-Trilogie: Tag Markets (Trading), Bit1 (Börse) und BixCard (Krypto-Karte).',
      sr: 'Савез доноси тржишну трилогију: Tag Markets (трговање), Bit1 (берза) и BixCard (крипто картица).',
      ur: 'اتحاد مارکیٹ کی تینوں پیشکشیں لاتا ہے: Tag Markets (ٹریڈنگ)، Bit1 (ایکسچینج) اور BixCard (کرپٹو کارڈ)۔',
    },
  'El AiG Token conecta todo': {
    en: 'The AiG Token connects it all', pt: 'O AiG Token conecta tudo',
    fr: 'Le AiG Token relie le tout', ru: 'AiG Token связывает всё',
    sv: 'AiG Token kopplar ihop allt', hr: 'AiG Token povezuje sve',
    ar: 'AiG Token يربط كل شيء', de: 'Der AiG Token verbindet alles',
    sr: 'AiG Token повезује све', ur: 'AiG Token سب کچھ جوڑتا ہے',
  },
  'El token de utilidad se usa en formato DUAL (AIG + USDT) para dar liquidez y acceso dentro del ecosistema.':
    {
      en: 'The utility token is used in DUAL format (AIG + USDT) to provide liquidity and access inside the ecosystem.',
      pt: 'O token de utilidade é usado no formato DUAL (AIG + USDT) para dar liquidez e acesso dentro do ecossistema.',
      fr: 'Le jeton d’utilité s’utilise au format DUAL (AIG + USDT) pour apporter liquidité et accès au sein de l’écosystème.',
      ru: 'Утилитарный токен используется в формате DUAL (AIG + USDT), чтобы давать ликвидность и доступ внутри экосистемы.',
      sv: 'Nyttotoken används i DUAL-format (AIG + USDT) för att ge likviditet och tillgång inom ekosystemet.',
      hr: 'Uporabni token koristi se u DUAL formatu (AIG + USDT) kako bi dao likvidnost i pristup unutar ekosustava.',
      ar: 'يُستخدم رمز المنفعة بصيغة DUAL ‏(AIG + USDT) لتوفير السيولة والوصول داخل النظام البيئي.',
      de: 'Der Utility-Token wird im DUAL-Format (AIG + USDT) genutzt, um innerhalb des Ökosystems Liquidität und Zugang zu schaffen.',
      sr: 'Употребни токен користи се у DUAL формату (AIG + USDT) да би дао ликвидност и приступ унутар екосистема.',
      ur: 'یوٹیلیٹی ٹوکن DUAL فارمیٹ (AIG + USDT) میں استعمال ہوتا ہے تاکہ ایکو سسٹم کے اندر لیکویڈیٹی اور رسائی ملے۔',
    },
  'Las herramientas, en vivo': {
    en: 'The tools, live', pt: 'As ferramentas, ao vivo', fr: 'Les outils, en direct',
    ru: 'Инструменты, вживую', sv: 'Verktygen, live', hr: 'Alati, uživo',
    ar: 'الأدوات، مباشرة', de: 'Die Werkzeuge, live', sr: 'Алати, уживо', ur: 'اوزار، براہِ راست',
  },
  'Trading, exchange y tarjeta — reales.': {
    en: 'Trading, exchange and card — real.', pt: 'Trading, exchange e cartão — reais.',
    fr: 'Trading, échange et carte — réels.', ru: 'Трейдинг, биржа и карта — настоящие.',
    sv: 'Handel, börs och kort — på riktigt.', hr: 'Trgovanje, burza i kartica — stvarni.',
    ar: 'تداول ومنصة وبطاقة — حقيقية.', de: 'Trading, Börse und Karte — echt.',
    sr: 'Трговање, берза и картица — стварни.', ur: 'ٹریڈنگ، ایکسچینج اور کارڈ — حقیقی۔',
  },
  'Trading, exchange y tarjeta.': {
    en: 'Trading, exchange and card.', pt: 'Trading, exchange e cartão.',
    fr: 'Trading, échange et carte.', ru: 'Трейдинг, биржа и карта.',
    sv: 'Handel, börs och kort.', hr: 'Trgovanje, burza i kartica.',
    ar: 'تداول ومنصة وبطاقة.', de: 'Trading, Börse und Karte.',
    sr: 'Трговање, берза и картица.', ur: 'ٹریڈنگ، ایکسچینج اور کارڈ۔',
  },
  'La plataforma de la alianza en acción. Material informativo.': {
    en: 'The alliance’s platform in action. Informational material.',
    pt: 'A plataforma da aliança em ação. Material informativo.',
    fr: 'La plateforme de l’alliance en action. Document d’information.',
    ru: 'Платформа альянса в действии. Информационный материал.',
    sv: 'Alliansens plattform i praktiken. Informationsmaterial.',
    hr: 'Platforma saveza na djelu. Informativni materijal.',
    ar: 'منصة التحالف أثناء العمل. مادة إعلامية.',
    de: 'Die Plattform der Allianz in Aktion. Informationsmaterial.',
    sr: 'Платформа савеза на делу. Информативни материјал.',
    ur: 'اتحاد کا پلیٹ فارم عمل میں۔ معلوماتی مواد۔',
  },
  'Lo que esta página no dice': {
    en: 'What this page does not say', pt: 'O que esta página não diz',
    fr: 'Ce que cette page ne dit pas', ru: 'Чего эта страница не говорит',
    sv: 'Vad den här sidan inte säger', hr: 'Što ova stranica ne govori',
    ar: 'ما لا تقوله هذه الصفحة', de: 'Was diese Seite nicht sagt',
    sr: 'Шта ова страница не говори', ur: 'یہ صفحہ کیا نہیں کہتا',
  },
  'G1 no publica porcentajes de resultado, comisiones, apalancamiento ni premios de ningún plan. Esa información vive solo en los canales oficiales de cada producto y bajo la responsabilidad de cada persona. Aquí contamos **qué es** y **cómo se participa**, no cuánto se obtiene.':
    {
      en: 'G1 does not publish performance percentages, fees, leverage or rewards of any plan. That information lives only in each product’s official channels, under each person’s own responsibility. Here we tell **what it is** and **how to take part**, not how much you get.',
      pt: 'A G1 não publica percentuais de resultado, comissões, alavancagem nem prêmios de nenhum plano. Essa informação existe apenas nos canais oficiais de cada produto e sob a responsabilidade de cada pessoa. Aqui contamos **o que é** e **como se participa**, não quanto se obtém.',
      fr: 'G1 ne publie ni pourcentages de résultat, ni commissions, ni effet de levier, ni primes d’aucun plan. Cette information n’existe que dans les canaux officiels de chaque produit, sous la responsabilité de chacun. Ici nous disons **ce que c’est** et **comment participer**, pas combien on obtient.',
      ru: 'G1 не публикует проценты доходности, комиссии, кредитное плечо или бонусы какого-либо плана. Эта информация есть только в официальных каналах каждого продукта и под ответственность каждого. Здесь мы рассказываем, **что это** и **как участвовать**, а не сколько получишь.',
      sv: 'G1 publicerar inga resultatprocent, avgifter, hävstång eller belöningar för någon plan. Den informationen finns endast i varje produkts officiella kanaler och under var och ens eget ansvar. Här berättar vi **vad det är** och **hur man deltar**, inte hur mycket man får.',
      hr: 'G1 ne objavljuje postotke prinosa, naknade, polugu ni nagrade bilo kojeg plana. Te informacije postoje samo u službenim kanalima svakog proizvoda i na odgovornost svake osobe. Ovdje govorimo **što je to** i **kako se sudjeluje**, a ne koliko se dobiva.',
      ar: 'لا تنشر G1 نسب نتائج أو عمولات أو رافعة مالية أو مكافآت لأي خطة. تلك المعلومات موجودة فقط في القنوات الرسمية لكل منتج وعلى مسؤولية كل شخص. هنا نوضّح **ما هو** و**كيف تُشارك**، لا كم تحصل.',
      de: 'G1 veröffentlicht keine Ergebnisprozente, Gebühren, Hebel oder Prämien irgendeines Plans. Diese Informationen gibt es nur in den offiziellen Kanälen jedes Produkts und in der Verantwortung jeder Person. Hier erzählen wir, **was es ist** und **wie man teilnimmt**, nicht wie viel man bekommt.',
      sr: 'G1 не објављује проценте приноса, накнаде, полугу ни награде било ког плана. Те информације постоје само у званичним каналима сваког производа и на одговорност сваке особе. Овде говоримо **шта је то** и **како се учествује**, а не колико се добија.',
      ur: 'G1 کسی بھی پلان کے نتائج کے فیصد، فیس، لیوریج یا انعامات شائع نہیں کرتا۔ یہ معلومات صرف ہر پروڈکٹ کے سرکاری چینلز میں ہیں اور ہر شخص کی اپنی ذمہ داری پر۔ یہاں ہم بتاتے ہیں کہ **یہ کیا ہے** اور **شرکت کیسے ہوتی ہے**، یہ نہیں کہ کتنا ملتا ہے۔',
    },

  /* ── «Ecosistema» ────────────────────────────────────────────────── */
  'Una comunidad,|herramientas reales.': {
    en: 'One community,|real tools.', pt: 'Uma comunidade,|ferramentas reais.',
    fr: 'Une communauté,|de vrais outils.', ru: 'Одно сообщество,|реальные инструменты.',
    sv: 'En gemenskap,|riktiga verktyg.', hr: 'Jedna zajednica,|stvarni alati.',
    ar: 'مجتمع واحد،|أدوات حقيقية.', de: 'Eine Community,|echte Werkzeuge.',
    sr: 'Једна заједница,|стварни алати.', ur: 'ایک کمیونٹی،|حقیقی اوزار۔',
  },
  'La alianza aporta el acceso a los mercados; Génesis aporta la comunidad y la usabilidad del AiG Token. Todo lo que integra el ecosistema, en un solo lugar.':
    {
      en: 'The alliance brings access to the markets; Génesis brings the community and the AiG Token’s usability. Everything the ecosystem holds, in one place.',
      pt: 'A aliança traz o acesso aos mercados; a Génesis traz a comunidade e a usabilidade do AiG Token. Tudo o que integra o ecossistema, em um só lugar.',
      fr: 'L’alliance apporte l’accès aux marchés ; Génesis apporte la communauté et l’utilité du AiG Token. Tout ce qui compose l’écosystème, au même endroit.',
      ru: 'Альянс даёт доступ к рынкам; Génesis даёт сообщество и применимость AiG Token. Всё, из чего состоит экосистема, в одном месте.',
      sv: 'Alliansen ger tillgång till marknaderna; Génesis ger gemenskapen och AiG Tokens användbarhet. Allt som ekosystemet rymmer, på ett ställe.',
      hr: 'Savez donosi pristup tržištima; Génesis donosi zajednicu i upotrebljivost AiG Tokena. Sve što čini ekosustav, na jednom mjestu.',
      ar: 'يوفّر التحالف الوصول إلى الأسواق؛ وتوفّر Génesis المجتمع وقابلية استخدام AiG Token. كل ما يتكوّن منه النظام البيئي، في مكان واحد.',
      de: 'Die Allianz bringt den Zugang zu den Märkten; Génesis bringt die Community und die Nutzbarkeit des AiG Token. Alles, was das Ökosystem ausmacht, an einem Ort.',
      sr: 'Савез доноси приступ тржиштима; Génesis доноси заједницу и употребљивост AiG Token-а. Све што чини екосистем, на једном месту.',
      ur: 'اتحاد مارکیٹوں تک رسائی دیتا ہے؛ Génesis کمیونٹی اور AiG Token کی افادیت دیتا ہے۔ ایکو سسٹم کا سب کچھ، ایک ہی جگہ۔',
    },
  'La trilogía de mercado · TAG': {
    en: 'The market trilogy · TAG', pt: 'A trilogia de mercado · TAG',
    fr: 'La trilogie de marché · TAG', ru: 'Рыночная трилогия · TAG',
    sv: 'Marknadstrilogin · TAG', hr: 'Tržišna trilogija · TAG',
    ar: 'ثلاثية السوق · TAG', de: 'Die Markt-Trilogie · TAG',
    sr: 'Тржишна трилогија · TAG', ur: 'مارکیٹ کی تینوں · TAG',
  },
  'La comunidad · Génesis': {
    en: 'The community · Génesis', pt: 'A comunidade · Génesis', fr: 'La communauté · Génesis',
    ru: 'Сообщество · Génesis', sv: 'Gemenskapen · Génesis', hr: 'Zajednica · Génesis',
    ar: 'المجتمع · Génesis', de: 'Die Community · Génesis',
    sr: 'Заједница · Génesis', ur: 'کمیونٹی · Génesis',
  },
  'El motor de la comunidad.': {
    en: 'The community’s engine.', pt: 'O motor da comunidade.', fr: 'Le moteur de la communauté.',
    ru: 'Двигатель сообщества.', sv: 'Gemenskapens motor.', hr: 'Motor zajednice.',
    ar: 'محرّك المجتمع.', de: 'Der Motor der Community.',
    sr: 'Мотор заједнице.', ur: 'کمیونٹی کا انجن۔',
  },
  '¿Cómo se participa?': {
    en: 'How do you take part?', pt: 'Como se participa?', fr: 'Comment participer ?',
    ru: 'Как принять участие?', sv: 'Hur deltar man?', hr: 'Kako se sudjeluje?',
    ar: 'كيف تُشارك؟', de: 'Wie nimmt man teil?', sr: 'Како се учествује?', ur: 'شرکت کیسے کی جائے؟',
  },
  'TAG · trading': {
    en: 'TAG · trading', pt: 'TAG · trading', fr: 'TAG · trading', ru: 'TAG · трейдинг',
    sv: 'TAG · handel', hr: 'TAG · trgovanje', ar: 'TAG · تداول', de: 'TAG · Trading',
    sr: 'TAG · трговање', ur: 'TAG · ٹریڈنگ',
  },
  'TAG · exchange': {
    en: 'TAG · exchange', pt: 'TAG · exchange', fr: 'TAG · échange', ru: 'TAG · биржа',
    sv: 'TAG · börs', hr: 'TAG · burza', ar: 'TAG · منصة', de: 'TAG · Börse',
    sr: 'TAG · берза', ur: 'TAG · ایکسچینج',
  },
  'TAG · tarjeta': {
    en: 'TAG · card', pt: 'TAG · cartão', fr: 'TAG · carte', ru: 'TAG · карта',
    sv: 'TAG · kort', hr: 'TAG · kartica', ar: 'TAG · بطاقة', de: 'TAG · Karte',
    sr: 'TAG · картица', ur: 'TAG · کارڈ',
  },
  'Génesis · panel': {
    en: 'Génesis · dashboard', pt: 'Génesis · painel', fr: 'Génesis · tableau de bord',
    ru: 'Génesis · панель', sv: 'Génesis · panel', hr: 'Génesis · ploča',
    ar: 'Génesis · لوحة', de: 'Génesis · Panel', sr: 'Génesis · табла', ur: 'Génesis · پینل',
  },
  'Génesis · marca hija': {
    en: 'Génesis · sister brand', pt: 'Génesis · marca filha', fr: 'Génesis · marque sœur',
    ru: 'Génesis · дочерний бренд', sv: 'Génesis · systervarumärke', hr: 'Génesis · sestrinski brand',
    ar: 'Génesis · علامة فرعية', de: 'Génesis · Tochtermarke',
    sr: 'Génesis · сестрински бренд', ur: 'Génesis · ذیلی برانڈ',
  },
  'Génesis · token': {
    en: 'Génesis · token', pt: 'Génesis · token', fr: 'Génesis · jeton', ru: 'Génesis · токен',
    sv: 'Génesis · token', hr: 'Génesis · token', ar: 'Génesis · رمز', de: 'Génesis · Token',
    sr: 'Génesis · токен', ur: 'Génesis · ٹوکن',
  },
  'Bróker de trading sistemático: acceso a los mercados con herramientas profesionales de la alianza.':
    {
      en: 'Systematic trading broker: access to the markets with the alliance’s professional tools.',
      pt: 'Corretora de trading sistemático: acesso aos mercados com ferramentas profissionais da aliança.',
      fr: 'Courtier de trading systématique : accès aux marchés avec les outils professionnels de l’alliance.',
      ru: 'Брокер системного трейдинга: доступ к рынкам с профессиональными инструментами альянса.',
      sv: 'Mäklare för systematisk handel: tillgång till marknaderna med alliansens professionella verktyg.',
      hr: 'Broker sustavnog trgovanja: pristup tržištima uz profesionalne alate saveza.',
      ar: 'وسيط تداول منهجي: وصول إلى الأسواق بأدوات التحالف الاحترافية.',
      de: 'Broker für systematisches Trading: Zugang zu den Märkten mit den professionellen Werkzeugen der Allianz.',
      sr: 'Брокер системског трговања: приступ тржиштима уз професионалне алате савеза.',
      ur: 'سسٹمیٹک ٹریڈنگ بروکر: اتحاد کے پیشہ ورانہ اوزاروں کے ساتھ مارکیٹوں تک رسائی۔',
    },
  'Exchange de activos digitales para comprar, vender y custodiar cripto dentro del ecosistema.': {
    en: 'Digital asset exchange to buy, sell and hold crypto inside the ecosystem.',
    pt: 'Exchange de ativos digitais para comprar, vender e custodiar cripto dentro do ecossistema.',
    fr: 'Plateforme d’actifs numériques pour acheter, vendre et conserver des cryptos dans l’écosystème.',
    ru: 'Биржа цифровых активов, чтобы покупать, продавать и хранить крипто внутри экосистемы.',
    sv: 'Börs för digitala tillgångar där du köper, säljer och förvarar krypto inom ekosystemet.',
    hr: 'Burza digitalne imovine za kupnju, prodaju i čuvanje kripta unutar ekosustava.',
    ar: 'منصة أصول رقمية لشراء العملات المشفّرة وبيعها وحفظها داخل النظام البيئي.',
    de: 'Börse für digitale Vermögenswerte zum Kaufen, Verkaufen und Verwahren von Krypto im Ökosystem.',
    sr: 'Берза дигиталне имовине за куповину, продају и чување крипта унутар екосистема.',
    ur: 'ڈیجیٹل اثاثوں کا ایکسچینج تاکہ ایکو سسٹم کے اندر کرپٹو خریدیں، بیچیں اور محفوظ رکھیں۔',
  },
  'Tarjeta Visa respaldada por cripto para usar tus activos en el día a día.': {
    en: 'A crypto-backed Visa card to use your assets day to day.',
    pt: 'Cartão Visa lastreado em cripto para usar seus ativos no dia a dia.',
    fr: 'Carte Visa adossée à la crypto pour utiliser tes actifs au quotidien.',
    ru: 'Карта Visa с криптообеспечением, чтобы пользоваться активами каждый день.',
    sv: 'Ett Visakort med kryptotäckning för att använda dina tillgångar i vardagen.',
    hr: 'Visa kartica pokrivena kriptom za svakodnevnu upotrebu tvoje imovine.',
    ar: 'بطاقة Visa مدعومة بالعملات المشفّرة لاستخدام أصولك يوميًا.',
    de: 'Eine krypto-gedeckte Visa-Karte, um deine Werte im Alltag zu nutzen.',
    sr: 'Visa картица покривена криптом за свакодневну употребу твоје имовине.',
    ur: 'کرپٹو سے سپورٹ شدہ ویزا کارڈ تاکہ روزمرہ میں اپنے اثاثے استعمال کریں۔',
  },
  'El panel de la comunidad: membresías, actividad y el acceso a tu cuenta.': {
    en: 'The community dashboard: memberships, activity and access to your account.',
    pt: 'O painel da comunidade: assinaturas, atividade e o acesso à sua conta.',
    fr: 'Le tableau de bord de la communauté : abonnements, activité et accès à ton compte.',
    ru: 'Панель сообщества: подписки, активность и доступ к твоему аккаунту.',
    sv: 'Gemenskapens panel: medlemskap, aktivitet och åtkomst till ditt konto.',
    hr: 'Ploča zajednice: članstva, aktivnost i pristup tvom računu.',
    ar: 'لوحة المجتمع: العضويات والنشاط والوصول إلى حسابك.',
    de: 'Das Community-Panel: Mitgliedschaften, Aktivität und Zugang zu deinem Konto.',
    sr: 'Табла заједнице: чланства, активност и приступ твом налогу.',
    ur: 'کمیونٹی کا پینل: ممبرشپس، سرگرمی اور آپ کے اکاؤنٹ تک رسائی۔',
  },
  'Marca hija de Génesis, con su propia identidad bilingüe dentro del ecosistema.': {
    en: 'A Génesis sister brand, with its own bilingual identity inside the ecosystem.',
    pt: 'Marca filha da Génesis, com sua própria identidade bilíngue dentro do ecossistema.',
    fr: 'Marque sœur de Génesis, avec sa propre identité bilingue au sein de l’écosystème.',
    ru: 'Дочерний бренд Génesis со своей двуязычной идентичностью внутри экосистемы.',
    sv: 'Systervarumärke till Génesis, med en egen tvåspråkig identitet inom ekosystemet.',
    hr: 'Sestrinski brand Génesisa, s vlastitim dvojezičnim identitetom unutar ekosustava.',
    ar: 'علامة فرعية من Génesis، بهوية ثنائية اللغة خاصة بها داخل النظام البيئي.',
    de: 'Tochtermarke von Génesis, mit eigener zweisprachiger Identität im Ökosystem.',
    sr: 'Сестрински бренд Génesis-а, са сопственим двојезичним идентитетом унутар екосистема.',
    ur: 'Génesis کا ذیلی برانڈ، ایکو سسٹم کے اندر اپنی دو لسانی شناخت کے ساتھ۔',
  },
  'El token de utilidad del ecosistema, usado en formato DUAL (AIG + USDT) para dar liquidez y acceso.':
    {
      en: 'The ecosystem’s utility token, used in DUAL format (AIG + USDT) to provide liquidity and access.',
      pt: 'O token de utilidade do ecossistema, usado no formato DUAL (AIG + USDT) para dar liquidez e acesso.',
      fr: 'Le jeton d’utilité de l’écosystème, utilisé au format DUAL (AIG + USDT) pour apporter liquidité et accès.',
      ru: 'Утилитарный токен экосистемы, используемый в формате DUAL (AIG + USDT) для ликвидности и доступа.',
      sv: 'Ekosystemets nyttotoken, använd i DUAL-format (AIG + USDT) för att ge likviditet och tillgång.',
      hr: 'Uporabni token ekosustava, korišten u DUAL formatu (AIG + USDT) za likvidnost i pristup.',
      ar: 'رمز المنفعة للنظام البيئي، يُستخدم بصيغة DUAL ‏(AIG + USDT) لتوفير السيولة والوصول.',
      de: 'Der Utility-Token des Ökosystems, im DUAL-Format (AIG + USDT) für Liquidität und Zugang.',
      sr: 'Употребни токен екосистема, коришћен у DUAL формату (AIG + USDT) за ликвидност и приступ.',
      ur: 'ایکو سسٹم کا یوٹیلیٹی ٹوکن، DUAL فارمیٹ (AIG + USDT) میں لیکویڈیٹی اور رسائی کے لیے۔',
    },

  /* ── «Comunidad» ─────────────────────────────────────────────────── */
  'La comunidad que|las une.': {
    en: 'The community that|unites them.', pt: 'A comunidade que|as une.',
    fr: 'La communauté qui|les réunit.', ru: 'Сообщество, которое|их объединяет.',
    sv: 'Gemenskapen som|förenar dem.', hr: 'Zajednica koja|ih spaja.',
    ar: 'المجتمع الذي|يجمعها.', de: 'Die Community, die|sie verbindet.',
    sr: 'Заједница која|их спаја.', ur: 'وہ کمیونٹی جو|انہیں جوڑتی ہے۔',
  },
  'Génesis es el punto de entrada: la comunidad que reúne a las personas y les da un lugar para aprender, encontrarse y participar del ecosistema.':
    {
      en: 'Génesis is the entry point: the community that brings people together and gives them a place to learn, meet and take part in the ecosystem.',
      pt: 'A Génesis é o ponto de entrada: a comunidade que reúne as pessoas e lhes dá um lugar para aprender, encontrar-se e participar do ecossistema.',
      fr: 'Génesis est le point d’entrée : la communauté qui rassemble les gens et leur offre un lieu pour apprendre, se rencontrer et participer à l’écosystème.',
      ru: 'Génesis — точка входа: сообщество, которое собирает людей и даёт им место, чтобы учиться, встречаться и участвовать в экосистеме.',
      sv: 'Génesis är ingångspunkten: gemenskapen som samlar människor och ger dem en plats att lära, mötas och delta i ekosystemet.',
      hr: 'Génesis je ulazna točka: zajednica koja okuplja ljude i daje im mjesto za učenje, susrete i sudjelovanje u ekosustavu.',
      ar: 'Génesis هي نقطة الدخول: المجتمع الذي يجمع الناس ويمنحهم مكانًا للتعلّم واللقاء والمشاركة في النظام البيئي.',
      de: 'Génesis ist der Einstiegspunkt: die Community, die Menschen zusammenbringt und ihnen einen Ort gibt, zu lernen, sich zu treffen und am Ökosystem teilzuhaben.',
      sr: 'Génesis је улазна тачка: заједница која окупља људе и даје им место за учење, сусрете и учешће у екосистему.',
      ur: 'Génesis داخلے کا مقام ہے: وہ کمیونٹی جو لوگوں کو اکٹھا کرتی ہے اور انہیں سیکھنے، ملنے اور ایکو سسٹم میں شریک ہونے کی جگہ دیتی ہے۔',
    },
  Encuentro: {
    en: 'Gathering', pt: 'Encontro', fr: 'Rencontre', ru: 'Встреча', sv: 'Träff',
    hr: 'Susret', ar: 'لقاء', de: 'Treffen', sr: 'Сусрет', ur: 'اجتماع',
  },
  'El programa de formación de la comunidad: aprender el ecosistema y sus herramientas desde la base.':
    {
      en: 'The community’s training programme: learning the ecosystem and its tools from the ground up.',
      pt: 'O programa de formação da comunidade: aprender o ecossistema e suas ferramentas desde a base.',
      fr: 'Le programme de formation de la communauté : apprendre l’écosystème et ses outils depuis la base.',
      ru: 'Обучающая программа сообщества: изучение экосистемы и её инструментов с основ.',
      sv: 'Gemenskapens utbildningsprogram: lär dig ekosystemet och dess verktyg från grunden.',
      hr: 'Program obrazovanja zajednice: učenje ekosustava i njegovih alata od temelja.',
      ar: 'برنامج تدريب المجتمع: تعلّم النظام البيئي وأدواته من الأساس.',
      de: 'Das Ausbildungsprogramm der Community: das Ökosystem und seine Werkzeuge von Grund auf lernen.',
      sr: 'Програм образовања заједнице: учење екосистема и његових алата од темеља.',
      ur: 'کمیونٹی کا تربیتی پروگرام: ایکو سسٹم اور اس کے اوزار بنیاد سے سیکھنا۔',
    },
  'Encuentros de la comunidad —presenciales y en línea— para conectar, compartir y crecer juntos.': {
    en: 'Community gatherings — in person and online — to connect, share and grow together.',
    pt: 'Encontros da comunidade — presenciais e on-line — para conectar, compartilhar e crescer juntos.',
    fr: 'Rencontres de la communauté — en présentiel et en ligne — pour se connecter, partager et grandir ensemble.',
    ru: 'Встречи сообщества — очные и онлайн — чтобы знакомиться, делиться и расти вместе.',
    sv: 'Gemenskapens träffar — på plats och online — för att knyta kontakter, dela och växa tillsammans.',
    hr: 'Susreti zajednice — uživo i online — za povezivanje, dijeljenje i zajednički rast.',
    ar: 'لقاءات المجتمع — حضوريًا وعبر الإنترنت — للتواصل والمشاركة والنمو معًا.',
    de: 'Community-Treffen — vor Ort und online — um sich zu vernetzen, zu teilen und gemeinsam zu wachsen.',
    sr: 'Сусрети заједнице — уживо и онлајн — за повезивање, дељење и заједнички раст.',
    ur: 'کمیونٹی کے اجتماعات — بالمشافہ اور آن لائن — جڑنے، بانٹنے اور مل کر بڑھنے کے لیے۔',
  },
  'La red de referentes que sostiene y acompaña a la comunidad en su recorrido.': {
    en: 'The network of mentors that supports and accompanies the community along the way.',
    pt: 'A rede de referências que sustenta e acompanha a comunidade em seu percurso.',
    fr: 'Le réseau de référents qui soutient et accompagne la communauté tout au long du parcours.',
    ru: 'Сеть наставников, которая поддерживает и сопровождает сообщество на пути.',
    sv: 'Nätverket av förebilder som stöttar och följer gemenskapen på vägen.',
    hr: 'Mreža mentora koja podupire i prati zajednicu na njezinu putu.',
    ar: 'شبكة المرشدين التي تسند المجتمع وترافقه في مساره.',
    de: 'Das Netzwerk von Mentoren, das die Community auf ihrem Weg trägt und begleitet.',
    sr: 'Мрежа ментора која подржава и прати заједницу на њеном путу.',
    ur: 'رہنماؤں کا وہ نیٹ ورک جو کمیونٹی کو سہارا دیتا اور ساتھ چلتا ہے۔',
  },
  Eventos: {
    en: 'Events', pt: 'Eventos', fr: 'Événements', ru: 'События', sv: 'Evenemang',
    hr: 'Događaji', ar: 'الفعاليات', de: 'Veranstaltungen', sr: 'Догађаји', ur: 'ایونٹس',
  },
  'Eventos que impulsan la comunidad.': {
    en: 'Events that move the community forward.', pt: 'Eventos que impulsionam a comunidade.',
    fr: 'Des événements qui font avancer la communauté.', ru: 'События, которые двигают сообщество.',
    sv: 'Evenemang som driver gemenskapen framåt.', hr: 'Događaji koji pokreću zajednicu.',
    ar: 'فعاليات تدفع المجتمع إلى الأمام.', de: 'Veranstaltungen, die die Community voranbringen.',
    sr: 'Догађаји који покрећу заједницу.', ur: 'وہ ایونٹس جو کمیونٹی کو آگے بڑھاتے ہیں۔',
  },
  'Conecta, aprende y crece junto a la comunidad del ecosistema. Sesiones informativas y de formación, en línea.':
    {
      en: 'Connect, learn and grow alongside the ecosystem’s community. Informational and training sessions, online.',
      pt: 'Conecte-se, aprenda e cresça junto com a comunidade do ecossistema. Sessões informativas e de formação, on-line.',
      fr: 'Connecte-toi, apprends et grandis avec la communauté de l’écosystème. Sessions d’information et de formation, en ligne.',
      ru: 'Знакомься, учись и расти вместе с сообществом экосистемы. Информационные и обучающие сессии, онлайн.',
      sv: 'Knyt kontakter, lär dig och väx tillsammans med ekosystemets gemenskap. Informations- och utbildningspass, online.',
      hr: 'Poveži se, uči i rasti zajedno sa zajednicom ekosustava. Informativne i edukativne sesije, online.',
      ar: 'تواصل وتعلّم وانمُ مع مجتمع النظام البيئي. جلسات إعلامية وتدريبية عبر الإنترنت.',
      de: 'Vernetze dich, lerne und wachse gemeinsam mit der Community des Ökosystems. Info- und Schulungssitzungen, online.',
      sr: 'Повежи се, учи и расти заједно са заједницом екосистема. Информативне и едукативне сесије, онлајн.',
      ur: 'ایکو سسٹم کی کمیونٹی کے ساتھ جڑیں، سیکھیں اور بڑھیں۔ آن لائن معلوماتی اور تربیتی سیشنز۔',
    },
  'Formación sobre productos del ecosistema': {
    en: 'Training on the ecosystem’s products', pt: 'Formação sobre produtos do ecossistema',
    fr: 'Formation sur les produits de l’écosystème', ru: 'Обучение по продуктам экосистемы',
    sv: 'Utbildning om ekosystemets produkter', hr: 'Edukacija o proizvodima ekosustava',
    ar: 'تدريب على منتجات النظام البيئي', de: 'Schulung zu den Produkten des Ökosystems',
    sr: 'Едукација о производима екосистема', ur: 'ایکو سسٹم کی مصنوعات پر تربیت',
  },
  'Sesión práctica sobre Tag Markets, Bit1 y BixCard: qué son y cómo se usan.': {
    en: 'Hands-on session on Tag Markets, Bit1 and BixCard: what they are and how to use them.',
    pt: 'Sessão prática sobre Tag Markets, Bit1 e BixCard: o que são e como se usam.',
    fr: 'Session pratique sur Tag Markets, Bit1 et BixCard : ce que c’est et comment s’en servir.',
    ru: 'Практическая сессия по Tag Markets, Bit1 и BixCard: что это и как этим пользоваться.',
    sv: 'Praktiskt pass om Tag Markets, Bit1 och BixCard: vad de är och hur de används.',
    hr: 'Praktična sesija o Tag Marketsu, Bit1 i BixCardu: što su i kako se koriste.',
    ar: 'جلسة عملية حول Tag Markets و Bit1 و BixCard: ما هي وكيف تُستخدم.',
    de: 'Praxissitzung zu Tag Markets, Bit1 und BixCard: was sie sind und wie man sie nutzt.',
    sr: 'Практична сесија о Tag Markets-у, Bit1 и BixCard-у: шта су и како се користе.',
    ur: 'Tag Markets، Bit1 اور BixCard پر عملی سیشن: یہ کیا ہیں اور کیسے استعمال ہوتے ہیں۔',
  },
  'Presentación de la alianza': {
    en: 'Introducing the alliance', pt: 'Apresentação da aliança', fr: 'Présentation de l’alliance',
    ru: 'Презентация альянса', sv: 'Presentation av alliansen', hr: 'Predstavljanje saveza',
    ar: 'التعريف بالتحالف', de: 'Vorstellung der Allianz', sr: 'Представљање савеза', ur: 'اتحاد کا تعارف',
  },
  'Sesión informativa sobre G1 y la alianza Génesis × Aitech × TAG.': {
    en: 'Information session on G1 and the Génesis × Aitech × TAG alliance.',
    pt: 'Sessão informativa sobre a G1 e a aliança Génesis × Aitech × TAG.',
    fr: 'Session d’information sur G1 et l’alliance Génesis × Aitech × TAG.',
    ru: 'Информационная сессия о G1 и альянсе Génesis × Aitech × TAG.',
    sv: 'Informationspass om G1 och alliansen Génesis × Aitech × TAG.',
    hr: 'Informativna sesija o G1 i savezu Génesis × Aitech × TAG.',
    ar: 'جلسة تعريفية حول G1 وتحالف Génesis × Aitech × TAG.',
    de: 'Infositzung zu G1 und der Allianz Génesis × Aitech × TAG.',
    sr: 'Информативна сесија о G1 и савезу Génesis × Aitech × TAG.',
    ur: 'G1 اور Génesis × Aitech × TAG اتحاد پر معلوماتی سیشن۔',
  },
  'Encuentro de la comunidad': {
    en: 'Community gathering', pt: 'Encontro da comunidade', fr: 'Rencontre de la communauté',
    ru: 'Встреча сообщества', sv: 'Gemenskapsträff', hr: 'Susret zajednice',
    ar: 'لقاء المجتمع', de: 'Community-Treffen', sr: 'Сусрет заједнице', ur: 'کمیونٹی اجتماع',
  },
  'Novedades del ecosistema y espacio para conectar con la comunidad.': {
    en: 'Ecosystem news and space to connect with the community.',
    pt: 'Novidades do ecossistema e espaço para conectar-se com a comunidade.',
    fr: 'Actualités de l’écosystème et espace pour échanger avec la communauté.',
    ru: 'Новости экосистемы и пространство для общения с сообществом.',
    sv: 'Nyheter från ekosystemet och utrymme att knyta kontakt med gemenskapen.',
    hr: 'Novosti ekosustava i prostor za povezivanje sa zajednicom.',
    ar: 'مستجدات النظام البيئي ومساحة للتواصل مع المجتمع.',
    de: 'Neuigkeiten aus dem Ökosystem und Raum, um sich mit der Community zu vernetzen.',
    sr: 'Новости екосистема и простор за повезивање са заједницом.',
    ur: 'ایکو سسٹم کی خبریں اور کمیونٹی سے جڑنے کی جگہ۔',
  },
  Online: {
    en: 'Online', pt: 'On-line', fr: 'En ligne', ru: 'Онлайн', sv: 'Online',
    hr: 'Online', ar: 'عبر الإنترنت', de: 'Online', sr: 'Онлајн', ur: 'آن لائن',
  },
  'Online · Latinoamérica': {
    en: 'Online · Latin America', pt: 'On-line · América Latina', fr: 'En ligne · Amérique latine',
    ru: 'Онлайн · Латинская Америка', sv: 'Online · Latinamerika', hr: 'Online · Latinska Amerika',
    ar: 'عبر الإنترنت · أمريكا اللاتينية', de: 'Online · Lateinamerika',
    sr: 'Онлајн · Латинска Америка', ur: 'آن لائن · لاطینی امریکہ',
  },
  'Online · Global': {
    en: 'Online · Global', pt: 'On-line · Global', fr: 'En ligne · Mondial',
    ru: 'Онлайн · Глобально', sv: 'Online · Globalt', hr: 'Online · Globalno',
    ar: 'عبر الإنترنت · عالميًا', de: 'Online · Weltweit', sr: 'Онлајн · Глобално', ur: 'آن لائن · عالمی',
  },
  'Cada lunes': {
    en: 'Every Monday', pt: 'Toda segunda-feira', fr: 'Chaque lundi', ru: 'Каждый понедельник',
    sv: 'Varje måndag', hr: 'Svakog ponedjeljka', ar: 'كل يوم اثنين', de: 'Jeden Montag',
    sr: 'Сваког понедељка', ur: 'ہر پیر',
  },
  'Martes y jueves': {
    en: 'Tuesdays and Thursdays', pt: 'Terças e quintas', fr: 'Mardis et jeudis',
    ru: 'Вторник и четверг', sv: 'Tisdagar och torsdagar', hr: 'Utorkom i četvrtkom',
    ar: 'الثلاثاء والخميس', de: 'Dienstags und donnerstags',
    sr: 'Уторком и четвртком', ur: 'منگل اور جمعرات',
  },
  'Cada miércoles': {
    en: 'Every Wednesday', pt: 'Toda quarta-feira', fr: 'Chaque mercredi', ru: 'Каждую среду',
    sv: 'Varje onsdag', hr: 'Svake srijede', ar: 'كل يوم أربعاء', de: 'Jeden Mittwoch',
    sr: 'Сваке среде', ur: 'ہر بدھ',
  },
  '13:00 · hora de Santo Domingo': {
    en: '13:00 · Santo Domingo time', pt: '13:00 · horário de Santo Domingo',
    fr: '13h00 · heure de Saint-Domingue', ru: '13:00 · время Санто-Доминго',
    sv: '13:00 · Santo Domingo-tid', hr: '13:00 · po vremenu Santo Dominga',
    ar: '13:00 · بتوقيت سانتو دومينغو', de: '13:00 Uhr · Zeit von Santo Domingo',
    sr: '13:00 · по времену Санто Доминга', ur: '13:00 · سانتو ڈومنگو کا وقت',
  },
  '09:00 · hora de Santo Domingo': {
    en: '09:00 · Santo Domingo time', pt: '09:00 · horário de Santo Domingo',
    fr: '09h00 · heure de Saint-Domingue', ru: '09:00 · время Санто-Доминго',
    sv: '09:00 · Santo Domingo-tid', hr: '09:00 · po vremenu Santo Dominga',
    ar: '09:00 · بتوقيت سانتو دومينغو', de: '09:00 Uhr · Zeit von Santo Domingo',
    sr: '09:00 · по времену Санто Доминга', ur: '09:00 · سانتو ڈومنگو کا وقت',
  },
  '19:00 · hora de Santo Domingo': {
    en: '19:00 · Santo Domingo time', pt: '19:00 · horário de Santo Domingo',
    fr: '19h00 · heure de Saint-Domingue', ru: '19:00 · время Санто-Доминго',
    sv: '19:00 · Santo Domingo-tid', hr: '19:00 · po vremenu Santo Dominga',
    ar: '19:00 · بتوقيت سانتو دومينغو', de: '19:00 Uhr · Zeit von Santo Domingo',
    sr: '19:00 · по времену Санто Доминга', ur: '19:00 · سانتو ڈومنگو کا وقت',
  },
  Momentos: {
    en: 'Moments', pt: 'Momentos', fr: 'Moments', ru: 'Моменты', sv: 'Ögonblick',
    hr: 'Trenuci', ar: 'لحظات', de: 'Momente', sr: 'Тренуци', ur: 'لمحات',
  },
  'La comunidad, en persona.': {
    en: 'The community, in person.', pt: 'A comunidade, presencialmente.',
    fr: 'La communauté, en personne.', ru: 'Сообщество, вживую.',
    sv: 'Gemenskapen, på plats.', hr: 'Zajednica, uživo.',
    ar: 'المجتمع، وجهًا لوجه.', de: 'Die Community, persönlich.',
    sr: 'Заједница, уживо.', ur: 'کمیونٹی، بالمشافہ۔',
  },
  'Empieza por la comunidad.': {
    en: 'Start with the community.', pt: 'Comece pela comunidade.',
    fr: 'Commence par la communauté.', ru: 'Начни с сообщества.',
    sv: 'Börja med gemenskapen.', hr: 'Počni od zajednice.',
    ar: 'ابدأ من المجتمع.', de: 'Fang bei der Community an.',
    sr: 'Почни од заједнице.', ur: 'کمیونٹی سے شروع کریں۔',
  },
  'Entrar a G-Pulse': {
    en: 'Enter G-Pulse', pt: 'Entrar no G-Pulse', fr: 'Entrer dans G-Pulse',
    ru: 'Войти в G-Pulse', sv: 'Gå in i G-Pulse', hr: 'Uđi u G-Pulse',
    ar: 'الدخول إلى G-Pulse', de: 'Zu G-Pulse', sr: 'Уђи у G-Pulse', ur: 'G-Pulse میں جائیں',
  },
  Ingresar: {
    en: 'Sign in', pt: 'Entrar', fr: 'Se connecter', ru: 'Войти', sv: 'Logga in',
    hr: 'Prijava', ar: 'تسجيل الدخول', de: 'Anmelden', sr: 'Пријава', ur: 'سائن ان',
  },

  /* ── las FAQ y el header ─────────────────────────────────────────── */
  'Lo que|conviene saber.': {
    en: 'What you|should know.', pt: 'O que|convém saber.', fr: 'Ce qu’il|faut savoir.',
    ru: 'Что стоит|знать.', sv: 'Vad du|bör veta.', hr: 'Što je|dobro znati.',
    ar: 'ما|يجدر معرفته.', de: 'Was man|wissen sollte.',
    sr: 'Шта је|добро знати.', ur: 'جو جاننا|چاہیے۔',
  },
  'Busca tu pregunta…': {
    en: 'Search your question…', pt: 'Busque sua pergunta…', fr: 'Cherche ta question…',
    ru: 'Найди свой вопрос…', sv: 'Sök din fråga…', hr: 'Potraži svoje pitanje…',
    ar: '…ابحث عن سؤالك', de: 'Suche deine Frage…', sr: 'Потражи своје питање…', ur: '…اپنا سوال تلاش کریں',
  },
  'Sin resultados. Prueba otras palabras o usa el asistente.': {
    en: 'No results. Try other words, or use the assistant.',
    pt: 'Sem resultados. Tente outras palavras ou use o assistente.',
    fr: 'Aucun résultat. Essaie d’autres mots ou utilise l’assistant.',
    ru: 'Ничего не найдено. Попробуй другие слова или спроси ассистента.',
    sv: 'Inga träffar. Prova andra ord eller använd assistenten.',
    hr: 'Nema rezultata. Probaj druge riječi ili koristi asistenta.',
    ar: 'لا نتائج. جرّب كلمات أخرى أو استخدم المساعد.',
    de: 'Keine Ergebnisse. Probiere andere Wörter oder nutze den Assistenten.',
    sr: 'Нема резултата. Пробај друге речи или користи асистента.',
    ur: 'کوئی نتیجہ نہیں۔ دوسرے الفاظ آزمائیں یا اسسٹنٹ استعمال کریں۔',
  },
  Índice: {
    en: 'Index', pt: 'Índice', fr: 'Sommaire', ru: 'Указатель', sv: 'Index',
    hr: 'Kazalo', ar: 'الفهرس', de: 'Index', sr: 'Садржај', ur: 'فہرست',
  },
  'Regístrate': {
    en: 'Sign up', pt: 'Cadastre-se', fr: 'Inscris-toi', ru: 'Регистрация',
    sv: 'Registrera dig', hr: 'Registriraj se', ar: 'سجّل', de: 'Registrieren',
    sr: 'Региструј се', ur: 'رجسٹر کریں',
  },
  'Regístrate en el Portal IBO de Génesis': {
    en: 'Sign up in the Génesis IBO Portal', pt: 'Cadastre-se no Portal IBO da Génesis',
    fr: 'Inscris-toi sur le portail IBO de Génesis', ru: 'Зарегистрируйся в IBO-портале Génesis',
    sv: 'Registrera dig i Génesis IBO-portal', hr: 'Registriraj se na Génesis IBO portalu',
    ar: 'سجّل في بوابة Génesis IBO', de: 'Registriere dich im IBO-Portal von Génesis',
    sr: 'Региструј се на Génesis IBO порталу', ur: 'Génesis IBO پورٹل پر رجسٹر کریں',
  },
  'Ingresar al Portal IBO de Génesis': {
    en: 'Sign in to the Génesis IBO Portal', pt: 'Entrar no Portal IBO da Génesis',
    fr: 'Se connecter au portail IBO de Génesis', ru: 'Войти в IBO-портал Génesis',
    sv: 'Logga in i Génesis IBO-portal', hr: 'Prijavi se na Génesis IBO portal',
    ar: 'تسجيل الدخول إلى بوابة Génesis IBO', de: 'Im IBO-Portal von Génesis anmelden',
    sr: 'Пријави се на Génesis IBO портал', ur: 'Génesis IBO پورٹل میں سائن ان کریں',
  },
  Educación: {
    en: 'Education', pt: 'Educação', fr: 'Éducation', ru: 'Образование', sv: 'Utbildning',
    hr: 'Obrazovanje', ar: 'التعليم', de: 'Bildung', sr: 'Образовање', ur: 'تعلیم',
  },
  Formación: {
    en: 'Training', pt: 'Formação', fr: 'Formation', ru: 'Обучение', sv: 'Utbildning',
    hr: 'Edukacija', ar: 'التدريب', de: 'Ausbildung', sr: 'Едукација', ur: 'تربیت',
  },
  /* `Tecnología` ya existe arriba (línea ~134). */

  /* ── el pie de G1 ────────────────────────────────────────────────── */
  'G1 conecta comunidad, mercados, activos digitales y herramientas de pago dentro de la alianza Génesis × Aitech × TAG.':
    {
      en: 'G1 connects community, markets, digital assets and payment tools within the Génesis × Aitech × TAG alliance.',
      pt: 'A G1 conecta comunidade, mercados, ativos digitais e ferramentas de pagamento dentro da aliança Génesis × Aitech × TAG.',
      fr: 'G1 relie communauté, marchés, actifs numériques et outils de paiement au sein de l’alliance Génesis × Aitech × TAG.',
      ru: 'G1 объединяет сообщество, рынки, цифровые активы и платёжные инструменты в рамках альянса Génesis × Aitech × TAG.',
      sv: 'G1 kopplar samman gemenskap, marknader, digitala tillgångar och betalverktyg inom alliansen Génesis × Aitech × TAG.',
      hr: 'G1 povezuje zajednicu, tržišta, digitalnu imovinu i alate za plaćanje unutar saveza Génesis × Aitech × TAG.',
      ar: 'يربط G1 المجتمع والأسواق والأصول الرقمية وأدوات الدفع ضمن تحالف Génesis × Aitech × TAG.',
      de: 'G1 verbindet Community, Märkte, digitale Vermögenswerte und Zahlungswerkzeuge innerhalb der Allianz Génesis × Aitech × TAG.',
      sr: 'G1 повезује заједницу, тржишта, дигиталну имовину и алате за плаћање унутар савеза Génesis × Aitech × TAG.',
      ur: 'G1 کمیونٹی، مارکیٹوں، ڈیجیٹل اثاثوں اور ادائیگی کے آلات کو Génesis × Aitech × TAG اتحاد کے اندر جوڑتا ہے۔',
    },
  'Trading · Exchange · Tarjeta cripto': {
    en: 'Trading · Exchange · Crypto card', pt: 'Trading · Exchange · Cartão cripto',
    fr: 'Trading · Échange · Carte crypto', ru: 'Трейдинг · Биржа · Криптокарта',
    sv: 'Handel · Börs · Kryptokort', hr: 'Trgovanje · Burza · Kripto kartica',
    ar: 'تداول · منصة · بطاقة تشفير', de: 'Trading · Börse · Krypto-Karte',
    sr: 'Трговање · Берза · Крипто картица', ur: 'ٹریڈنگ · ایکسچینج · کرپٹو کارڈ',
  },
  'Sello G‑TAG · Génesis × Aitech × TAG': {
    en: 'G‑TAG seal · Génesis × Aitech × TAG', pt: 'Selo G‑TAG · Génesis × Aitech × TAG',
    fr: 'Sceau G‑TAG · Génesis × Aitech × TAG', ru: 'Печать G‑TAG · Génesis × Aitech × TAG',
    sv: 'G‑TAG-sigill · Génesis × Aitech × TAG', hr: 'Pečat G‑TAG · Génesis × Aitech × TAG',
    ar: 'ختم G‑TAG · Génesis × Aitech × TAG', de: 'G‑TAG-Siegel · Génesis × Aitech × TAG',
    sr: 'Печат G‑TAG · Génesis × Aitech × TAG', ur: 'G‑TAG مہر · Génesis × Aitech × TAG',
  },
  Navegación: {
    en: 'Navigation', pt: 'Navegação', fr: 'Navigation', ru: 'Навигация', sv: 'Navigering',
    hr: 'Navigacija', ar: 'التنقل', de: 'Navigation', sr: 'Навигација', ur: 'نیویگیشن',
  },
  /* `Ecosistema`, `Legal`, `Inicio` y `Comunidad` ya viven arriba en este mismo
     diccionario (líneas ~130, ~586, ~600 y ~1429). Volver a declararlas aquí no
     era añadir nada: era romper el archivo, porque un objeto no admite la misma
     clave dos veces. El compilador lo dijo antes que nadie. */
  Acceso: {
    en: 'Access', pt: 'Acesso', fr: 'Accès', ru: 'Доступ', sv: 'Åtkomst',
    hr: 'Pristup', ar: 'الدخول', de: 'Zugang', sr: 'Приступ', ur: 'رسائی',
  },
  'Qué es G1': {
    en: 'What G1 is', pt: 'O que é a G1', fr: 'Qu’est-ce que G1', ru: 'Что такое G1',
    sv: 'Vad G1 är', hr: 'Što je G1', ar: 'ما هو G1', de: 'Was G1 ist',
    sr: 'Шта је G1', ur: 'G1 کیا ہے',
  },
  'Cómo funciona': {
    en: 'How it works', pt: 'Como funciona', fr: 'Comment ça marche', ru: 'Как это работает',
    sv: 'Så fungerar det', hr: 'Kako funkcionira', ar: 'كيف يعمل', de: 'So funktioniert es',
    sr: 'Како функционише', ur: 'یہ کیسے کام کرتا ہے',
  },
  'Preguntas frecuentes': {
    en: 'FAQ', pt: 'Perguntas frequentes', fr: 'Questions fréquentes', ru: 'Частые вопросы',
    sv: 'Vanliga frågor', hr: 'Česta pitanja', ar: 'الأسئلة الشائعة', de: 'Häufige Fragen',
    sr: 'Честа питања', ur: 'عمومی سوالات',
  },
  'Únete / Ingresar': {
    en: 'Join / Sign in', pt: 'Junte-se / Entrar', fr: 'Rejoindre / Se connecter',
    ru: 'Присоединиться / Войти', sv: 'Gå med / Logga in', hr: 'Pridruži se / Prijava',
    ar: 'انضم / تسجيل الدخول', de: 'Beitreten / Anmelden',
    sr: 'Придружи се / Пријава', ur: 'شامل ہوں / سائن ان',
  },
  'Próximos eventos': {
    en: 'Upcoming events', pt: 'Próximos eventos', fr: 'Prochains événements',
    ru: 'Ближайшие события', sv: 'Kommande evenemang', hr: 'Nadolazeći događaji',
    ar: 'الفعاليات القادمة', de: 'Kommende Veranstaltungen',
    sr: 'Предстојећи догађаји', ur: 'آنے والے ایونٹس',
  },
  'Términos y condiciones': {
    en: 'Terms and conditions', pt: 'Termos e condições', fr: 'Conditions générales',
    ru: 'Условия использования', sv: 'Villkor', hr: 'Uvjeti i odredbe',
    ar: 'الشروط والأحكام', de: 'Allgemeine Geschäftsbedingungen',
    sr: 'Услови коришћења', ur: 'شرائط و ضوابط',
  },
  'Política de privacidad': {
    en: 'Privacy policy', pt: 'Política de privacidade', fr: 'Politique de confidentialité',
    ru: 'Политика конфиденциальности', sv: 'Integritetspolicy', hr: 'Pravila privatnosti',
    ar: 'سياسة الخصوصية', de: 'Datenschutzerklärung',
    sr: 'Политика приватности', ur: 'رازداری کی پالیسی',
  },
  'Política de cookies': {
    en: 'Cookie policy', pt: 'Política de cookies', fr: 'Politique de cookies',
    ru: 'Политика использования файлов cookie', sv: 'Cookiepolicy', hr: 'Pravila o kolačićima',
    ar: 'سياسة ملفات تعريف الارتباط', de: 'Cookie-Richtlinie',
    sr: 'Политика колачића', ur: 'کوکی پالیسی',
  },
  'Aviso de riesgo': {
    en: 'Risk notice', pt: 'Aviso de risco', fr: 'Avertissement sur les risques',
    ru: 'Уведомление о рисках', sv: 'Riskinformation', hr: 'Obavijest o riziku',
    ar: 'إشعار المخاطر', de: 'Risikohinweis', sr: 'Обавештење о ризику', ur: 'خطرے کا نوٹس',
  },
  'Descargo de responsabilidad': {
    en: 'Disclaimer', pt: 'Isenção de responsabilidade', fr: 'Clause de non-responsabilité',
    ru: 'Отказ от ответственности', sv: 'Ansvarsfriskrivning', hr: 'Odricanje od odgovornosti',
    ar: 'إخلاء المسؤولية', de: 'Haftungsausschluss',
    sr: 'Одрицање од одговорности', ur: 'ذمہ داری سے دستبرداری',
  },
  'Todos los derechos reservados.': {
    en: 'All rights reserved.', pt: 'Todos os direitos reservados.',
    fr: 'Tous droits réservés.', ru: 'Все права защищены.',
    sv: 'Med ensamrätt.', hr: 'Sva prava pridržana.',
    ar: 'جميع الحقوق محفوظة.', de: 'Alle Rechte vorbehalten.',
    sr: 'Сва права задржана.', ur: 'جملہ حقوق محفوظ ہیں۔',
  },

  /* ── la franja de esencia del pie ────────────────────────────────── */
  Espacio: {
    en: 'Space', pt: 'Espaço', fr: 'Espace', ru: 'Пространство', sv: 'Rymd',
    hr: 'Prostor', ar: 'فضاء', de: 'Raum', sr: 'Простор', ur: 'خلا',
  },
  Conciencia: {
    en: 'Awareness', pt: 'Consciência', fr: 'Conscience', ru: 'Осознанность', sv: 'Medvetenhet',
    hr: 'Svijest', ar: 'وعي', de: 'Bewusstsein', sr: 'Свест', ur: 'شعور',
  },
  Presencia: {
    en: 'Presence', pt: 'Presença', fr: 'Présence', ru: 'Присутствие', sv: 'Närvaro',
    hr: 'Prisutnost', ar: 'حضور', de: 'Präsenz', sr: 'Присуство', ur: 'موجودگی',
  },
  Libertad: {
    en: 'Freedom', pt: 'Liberdade', fr: 'Liberté', ru: 'Свобода', sv: 'Frihet',
    hr: 'Sloboda', ar: 'حرية', de: 'Freiheit', sr: 'Слобода', ur: 'آزادی',
  },
  Prosperidad: {
    en: 'Prosperity', pt: 'Prosperidade', fr: 'Prospérité', ru: 'Процветание', sv: 'Välstånd',
    hr: 'Blagostanje', ar: 'ازدهار', de: 'Wohlstand', sr: 'Просперитет', ur: 'خوشحالی',
  },
  Equilibrio: {
    en: 'Balance', pt: 'Equilíbrio', fr: 'Équilibre', ru: 'Равновесие', sv: 'Balans',
    hr: 'Ravnoteža', ar: 'توازن', de: 'Gleichgewicht', sr: 'Равнотежа', ur: 'توازن',
  },

  /* ══════════════════════════════════════════════════════════════════
     LAS COLECCIONES DEL CORPUS.

     Son los nombres de categoría de las 99 preguntas, y sirven en DOS sitios
     con una sola entrada: la pestaña «Ayuda» del asistente y el índice de las
     preguntas frecuentes de la web. Es lo primero que se ve al abrir Ayuda, y
     por eso van antes que las respuestas.

     Los nombres de producto viajan dentro —«Sobre G-Pulse», «Membresía
     G-Pulse», «Sobre Gevy»— y NO se traducen: sólo la palabra que los rodea.
     ══════════════════════════════════════════════════════════════════ */
  'Hold y estado de la cuenta': {
    en: 'Hold and account status', pt: 'Hold e status da conta',
    fr: 'Blocage et état du compte', ru: 'Удержание и состояние счёта',
    sv: 'Spärr och kontostatus', hr: 'Zadržavanje i status računa',
    ar: 'التجميد وحالة الحساب', de: 'Sperre und Kontostatus',
    sr: 'Задржавање и статус налога', ur: 'ہولڈ اور اکاؤنٹ کی حالت',
  },
  P2P: {
    en: 'P2P', pt: 'P2P', fr: 'P2P', ru: 'P2P', sv: 'P2P', hr: 'P2P',
    ar: 'P2P', de: 'P2P', sr: 'P2P', ur: 'P2P',
  },
  Pagar: {
    en: 'Paying', pt: 'Pagar', fr: 'Payer', ru: 'Оплата', sv: 'Betala',
    hr: 'Plaćanje', ar: 'الدفع', de: 'Bezahlen', sr: 'Плаћање', ur: 'ادائیگی',
  },
  'Token AiG': {
    en: 'AiG Token', pt: 'Token AiG', fr: 'Jeton AiG', ru: 'Токен AiG',
    sv: 'AiG-token', hr: 'AiG token', ar: 'رمز AiG', de: 'AiG-Token',
    sr: 'AiG токен', ur: 'AiG ٹوکن',
  },
  'Alianza Aitech': {
    en: 'Aitech alliance', pt: 'Aliança Aitech', fr: 'Alliance Aitech',
    ru: 'Альянс Aitech', sv: 'Aitech-alliansen', hr: 'Savez Aitech',
    ar: 'تحالف Aitech', de: 'Aitech-Allianz', sr: 'Савез Aitech', ur: 'Aitech اتحاد',
  },
  'Booster y staking': {
    en: 'Booster and staking', pt: 'Booster e staking', fr: 'Booster et staking',
    ru: 'Booster и стейкинг', sv: 'Booster och staking', hr: 'Booster i staking',
    ar: 'Booster والتخزين', de: 'Booster und Staking',
    sr: 'Booster и стејкинг', ur: 'Booster اور اسٹیکنگ',
  },
  'Membresía G-Pulse': {
    en: 'G-Pulse membership', pt: 'Assinatura G-Pulse', fr: 'Abonnement G-Pulse',
    ru: 'Подписка G-Pulse', sv: 'G-Pulse-medlemskap', hr: 'Članstvo G-Pulse',
    ar: 'عضوية G-Pulse', de: 'G-Pulse-Mitgliedschaft',
    sr: 'Чланство G-Pulse', ur: 'G-Pulse ممبرشپ',
  },
  'Envío y seguimiento': {
    en: 'Shipping and tracking', pt: 'Envio e rastreamento',
    fr: 'Expédition et suivi', ru: 'Доставка и отслеживание',
    sv: 'Frakt och spårning', hr: 'Dostava i praćenje',
    ar: 'الشحن والتتبّع', de: 'Versand und Sendungsverfolgung',
    sr: 'Достава и праћење', ur: 'ترسیل اور ٹریکنگ',
  },
  'Qué significa una señal': {
    en: 'What a signal means', pt: 'O que significa um sinal',
    fr: 'Ce que signifie un signal', ru: 'Что означает сигнал',
    sv: 'Vad en signal betyder', hr: 'Što znači signal',
    ar: 'ماذا تعني الإشارة', de: 'Was ein Signal bedeutet',
    sr: 'Шта значи сигнал', ur: 'سگنل کا مطلب کیا ہے',
  },
  'Casos históricos': {
    en: 'Past cases', pt: 'Casos históricos', fr: 'Cas historiques',
    ru: 'Исторические случаи', sv: 'Historiska fall', hr: 'Povijesni slučajevi',
    ar: 'حالات سابقة', de: 'Vergangene Fälle', sr: 'Историјски случајеви', ur: 'ماضی کے واقعات',
  },
  'Sobre Gevy': {
    en: 'About Gevy', pt: 'Sobre a Gevy', fr: 'À propos de Gevy',
    ru: 'О Gevy', sv: 'Om Gevy', hr: 'O Gevyju', ar: 'عن Gevy',
    de: 'Über Gevy', sr: 'О Gevy-ју', ur: 'Gevy کے بارے میں',
  },
  'Si algo sale mal': {
    en: 'If something goes wrong', pt: 'Se algo der errado',
    fr: 'Si quelque chose ne va pas', ru: 'Если что-то пошло не так',
    sv: 'Om något går fel', hr: 'Ako nešto pođe po zlu',
    ar: 'إذا حدث خطأ ما', de: 'Wenn etwas schiefgeht',
    sr: 'Ако нешто пође по злу', ur: 'اگر کچھ غلط ہو جائے',
  },
  'Sobre G-Pulse': {
    en: 'About G-Pulse', pt: 'Sobre o G-Pulse', fr: 'À propos de G-Pulse',
    ru: 'О G-Pulse', sv: 'Om G-Pulse', hr: 'O G-Pulseu', ar: 'عن G-Pulse',
    de: 'Über G-Pulse', sr: 'О G-Pulse-у', ur: 'G-Pulse کے بارے میں',
  },
  'Uso del panel': {
    en: 'Using the dashboard', pt: 'Uso do painel', fr: 'Utiliser le tableau de bord',
    ru: 'Работа с панелью', sv: 'Använda panelen', hr: 'Korištenje ploče',
    ar: 'استخدام اللوحة', de: 'Das Panel nutzen',
    sr: 'Коришћење табле', ur: 'پینل کا استعمال',
  },
  /* `Empezar` ya existe arriba (línea ~1615). */
  Minería: {
    en: 'Mining', pt: 'Mineração', fr: 'Minage', ru: 'Майнинг', sv: 'Mining',
    hr: 'Rudarenje', ar: 'التعدين', de: 'Mining', sr: 'Рударење', ur: 'مائننگ',
  },
  'Red y compensación': {
    en: 'Network and compensation', pt: 'Rede e compensação',
    fr: 'Réseau et rémunération', ru: 'Сеть и вознаграждение',
    sv: 'Nätverk och ersättning', hr: 'Mreža i naknade',
    ar: 'الشبكة والمكافآت', de: 'Netzwerk und Vergütung',
    sr: 'Мрежа и накнаде', ur: 'نیٹ ورک اور معاوضہ',
  },
  Herramientas: {
    en: 'Tools', pt: 'Ferramentas', fr: 'Outils', ru: 'Инструменты',
    sv: 'Verktyg', hr: 'Alati', ar: 'الأدوات', de: 'Werkzeuge',
    sr: 'Алати', ur: 'اوزار',
  },
  'Uso de G-Pulse': {
    en: 'Using G-Pulse', pt: 'Uso do G-Pulse', fr: 'Utiliser G-Pulse',
    ru: 'Использование G-Pulse', sv: 'Använda G-Pulse', hr: 'Korištenje G-Pulsea',
    ar: 'استخدام G-Pulse', de: 'G-Pulse nutzen',
    sr: 'Коришћење G-Pulse-а', ur: 'G-Pulse کا استعمال',
  },
  'Sobre Genesis': {
    en: 'About Genesis', pt: 'Sobre a Genesis', fr: 'À propos de Genesis',
    ru: 'О Genesis', sv: 'Om Genesis', hr: 'O Genesisu', ar: 'عن Genesis',
    de: 'Über Genesis', sr: 'О Genesis-у', ur: 'Genesis کے بارے میں',
  },
  Seguridad: {
    en: 'Security', pt: 'Segurança', fr: 'Sécurité', ru: 'Безопасность',
    sv: 'Säkerhet', hr: 'Sigurnost', ar: 'الأمان', de: 'Sicherheit',
    sr: 'Безбедност', ur: 'سیکیورٹی',
  },
  Credenciales: {
    en: 'Credentials', pt: 'Credenciais', fr: 'Accréditations', ru: 'Документы',
    sv: 'Meriter', hr: 'Vjerodajnice', ar: 'الاعتمادات', de: 'Nachweise',
    sr: 'Акредитиви', ur: 'اسناد',
  },

  /* ══════════════════════════════════════════════════════════════════
     LAS PREGUNTAS SUGERIDAS — pregunta Y respuesta.

     Son las ocho que el asistente ofrece al abrirse, en la web pública y en
     G1. Se traducen ANTES que las otras 91 porque son las únicas que alguien
     lee sin buscarlas.

     LAS DEMÁS SIGUEN EN ESPAÑOL, y eso se ve: `useCorpus` devuelve el original
     y lo declara con `lang="es"`, así que un lector de pantalla en árabe lo
     pronuncia con fonética española en vez de convertirlo en ruido. El hueco
     es visible, no disimulado.

     LAS CIFRAS Y LOS AVISOS DE RIESGO viajan dentro de estas respuestas —«desde
     20 USDT», «el 8% es una tasa de emisión, no un resultado asegurado»—.
     Están traducidos literalmente y conviene revisarlos por idioma, igual que
     el descargo del pie.
     ══════════════════════════════════════════════════════════════════ */
  '¿Cómo me uno al ecosistema? Paso a paso': {
    en: 'How do I join the ecosystem? Step by step',
    pt: 'Como me junto ao ecossistema? Passo a passo',
    fr: 'Comment rejoindre l’écosystème ? Étape par étape',
    ru: 'Как присоединиться к экосистеме? Шаг за шагом',
    sv: 'Hur går jag med i ekosystemet? Steg för steg',
    hr: 'Kako se pridružiti ekosustavu? Korak po korak',
    ar: 'كيف أنضم إلى النظام البيئي؟ خطوة بخطوة',
    de: 'Wie trete ich dem Ökosystem bei? Schritt für Schritt',
    sr: 'Како да се придружим екосистему? Корак по корак',
    ur: 'میں ایکو سسٹم میں کیسے شامل ہوں؟ مرحلہ وار',
  },
  'Necesitas cuatro cosas y estos pasos: 1) Una wallet Web3 compatible con BEP-20 (SafePal, MetaMask u otra). 2) Fondearla con BNB para el gas y USDT (BEP-20) para tu aporte — desde 20 USDT. 3) Entrar con el enlace de referido de quien te invitó (sin ese enlace no se abre el registro). 4) Elegir AiG Mining, Booster o ambos, y seguir tu distribución diaria. Genesis es solo por invitación, así que el enlace del referido es imprescindible.':
    {
      en: 'You need four things and these steps: 1) A Web3 wallet compatible with BEP-20 (SafePal, MetaMask or another). 2) Fund it with BNB for gas and USDT (BEP-20) for your contribution — from 20 USDT. 3) Enter through the referral link of whoever invited you (without that link, registration does not open). 4) Choose AiG Mining, Booster or both, and follow your daily distribution. Genesis is invitation-only, so the referral link is essential.',
      pt: 'Você precisa de quatro coisas e destes passos: 1) Uma carteira Web3 compatível com BEP-20 (SafePal, MetaMask ou outra). 2) Abastecê-la com BNB para o gas e USDT (BEP-20) para seu aporte — a partir de 20 USDT. 3) Entrar com o link de indicação de quem lhe convidou (sem esse link o cadastro não abre). 4) Escolher AiG Mining, Booster ou ambos, e acompanhar sua distribuição diária. A Genesis é apenas por convite, então o link de indicação é imprescindível.',
      fr: 'Il te faut quatre choses et ces étapes : 1) Un portefeuille Web3 compatible BEP-20 (SafePal, MetaMask ou autre). 2) L’alimenter en BNB pour le gas et en USDT (BEP-20) pour ton apport — à partir de 20 USDT. 3) Entrer par le lien de parrainage de la personne qui t’a invité (sans ce lien, l’inscription ne s’ouvre pas). 4) Choisir AiG Mining, Booster ou les deux, et suivre ta distribution quotidienne. Genesis est uniquement sur invitation : le lien de parrainage est indispensable.',
      ru: 'Нужны четыре вещи и эти шаги: 1) Web3-кошелёк с поддержкой BEP-20 (SafePal, MetaMask или другой). 2) Пополнить его BNB на газ и USDT (BEP-20) для взноса — от 20 USDT. 3) Войти по реферальной ссылке того, кто тебя пригласил (без неё регистрация не откроется). 4) Выбрать AiG Mining, Booster или оба и следить за ежедневным распределением. Genesis работает только по приглашению, поэтому реферальная ссылка обязательна.',
      sv: 'Du behöver fyra saker och dessa steg: 1) En Web3-plånbok som stöder BEP-20 (SafePal, MetaMask eller annan). 2) Fylla på den med BNB för gas och USDT (BEP-20) för ditt bidrag — från 20 USDT. 3) Gå in via inbjudarens hänvisningslänk (utan den öppnas ingen registrering). 4) Välja AiG Mining, Booster eller båda, och följa din dagliga fördelning. Genesis är endast för inbjudna, så hänvisningslänken är nödvändig.',
      hr: 'Trebaš četiri stvari i ove korake: 1) Web3 novčanik kompatibilan s BEP-20 (SafePal, MetaMask ili drugi). 2) Napuniti ga s BNB za gas i USDT (BEP-20) za svoj ulog — od 20 USDT. 3) Ući putem preporuke osobe koja te pozvala (bez te poveznice registracija se ne otvara). 4) Odabrati AiG Mining, Booster ili oboje i pratiti svoju dnevnu raspodjelu. Genesis je samo na poziv, pa je poveznica preporuke nužna.',
      ar: 'تحتاج أربعة أشياء وهذه الخطوات: ١) محفظة Web3 متوافقة مع BEP-20 (SafePal أو MetaMask أو غيرها). ٢) تمويلها بـ BNB للرسوم و USDT (BEP-20) لمساهمتك — ابتداءً من 20 USDT. ٣) الدخول عبر رابط الإحالة لمن دعاك (بدون ذلك الرابط لا يُفتح التسجيل). ٤) اختيار AiG Mining أو Booster أو كليهما، ومتابعة توزيعك اليومي. Genesis بالدعوة فقط، لذا رابط الإحالة ضروري.',
      de: 'Du brauchst vier Dinge und diese Schritte: 1) Eine Web3-Wallet mit BEP-20-Unterstützung (SafePal, MetaMask oder eine andere). 2) Sie mit BNB für Gas und USDT (BEP-20) für deinen Beitrag füllen — ab 20 USDT. 3) Über den Empfehlungslink der Person eintreten, die dich eingeladen hat (ohne diesen Link öffnet sich keine Registrierung). 4) AiG Mining, Booster oder beides wählen und deine tägliche Verteilung verfolgen. Genesis ist nur auf Einladung, der Empfehlungslink ist also unerlässlich.',
      sr: 'Потребне су ти четири ствари и ови кораци: 1) Web3 новчаник компатибилан са BEP-20 (SafePal, MetaMask или други). 2) Напунити га са BNB за гас и USDT (BEP-20) за твој улог — од 20 USDT. 3) Ући преко препоруке особе која те позвала (без те везе регистрација се не отвара). 4) Изабрати AiG Mining, Booster или обоје и пратити своју дневну расподелу. Genesis је само на позив, па је веза препоруке неопходна.',
      ur: 'آپ کو چار چیزیں اور یہ مراحل چاہییں: ۱) BEP-20 کے موافق ایک Web3 والٹ (SafePal، MetaMask یا کوئی اور)۔ ۲) اسے گیس کے لیے BNB اور اپنے حصے کے لیے USDT (BEP-20) سے بھریں — 20 USDT سے۔ ۳) اُس شخص کے ریفرل لنک سے داخل ہوں جس نے آپ کو مدعو کیا (اُس لنک کے بغیر رجسٹریشن نہیں کھلتی)۔ ۴) AiG Mining، Booster یا دونوں منتخب کریں اور اپنی روزانہ تقسیم دیکھیں۔ Genesis صرف دعوت پر ہے، اس لیے ریفرل لنک ضروری ہے۔',
    },
  '¿Qué es TAG o Tag Markets?': {
    en: 'What is TAG or Tag Markets?', pt: 'O que é TAG ou Tag Markets?',
    fr: 'Qu’est-ce que TAG ou Tag Markets ?', ru: 'Что такое TAG или Tag Markets?',
    sv: 'Vad är TAG eller Tag Markets?', hr: 'Što je TAG ili Tag Markets?',
    ar: 'ما هو TAG أو Tag Markets؟', de: 'Was ist TAG oder Tag Markets?',
    sr: 'Шта је TAG или Tag Markets?', ur: 'TAG یا Tag Markets کیا ہے؟',
  },
  'Tag Markets es el bróker de trading sistemático de la alianza Aitech One: estrategias automatizadas para operar sin depender de tu tiempo, experiencia o emociones. El capital operativo se maneja en formato DUAL (AIG-USDT). Su web oficial es tagmarkets.com y el portal de Genesis es genesis.ibportal.io. Punto clave: el trading conlleva riesgos, los resultados varían y el desempeño pasado no garantiza resultados futuros; esto es informativo, no asesoría financiera.':
    {
      en: 'Tag Markets is the systematic trading broker of the Aitech One alliance: automated strategies to operate without depending on your time, experience or emotions. Operating capital is handled in DUAL format (AIG-USDT). Its official site is tagmarkets.com and the Genesis portal is genesis.ibportal.io. Key point: trading carries risk, results vary and past performance does not guarantee future results; this is informational, not financial advice.',
      pt: 'A Tag Markets é a corretora de trading sistemático da aliança Aitech One: estratégias automatizadas para operar sem depender do seu tempo, experiência ou emoções. O capital operacional é gerido no formato DUAL (AIG-USDT). O site oficial é tagmarkets.com e o portal da Genesis é genesis.ibportal.io. Ponto-chave: o trading envolve riscos, os resultados variam e o desempenho passado não garante resultados futuros; isto é informativo, não assessoria financeira.',
      fr: 'Tag Markets est le courtier de trading systématique de l’alliance Aitech One : des stratégies automatisées pour opérer sans dépendre de ton temps, de ton expérience ou de tes émotions. Le capital opérationnel est géré au format DUAL (AIG-USDT). Son site officiel est tagmarkets.com et le portail Genesis est genesis.ibportal.io. Point clé : le trading comporte des risques, les résultats varient et les performances passées ne garantissent pas les résultats futurs ; ceci est informatif, pas un conseil financier.',
      ru: 'Tag Markets — брокер системного трейдинга альянса Aitech One: автоматизированные стратегии, чтобы торговать, не завися от твоего времени, опыта или эмоций. Операционный капитал ведётся в формате DUAL (AIG-USDT). Официальный сайт — tagmarkets.com, портал Genesis — genesis.ibportal.io. Ключевое: трейдинг сопряжён с рисками, результаты бывают разными, а прошлые показатели не гарантируют будущих; это информация, а не финансовая консультация.',
      sv: 'Tag Markets är Aitech One-alliansens mäklare för systematisk handel: automatiserade strategier för att handla utan att bero på din tid, erfarenhet eller dina känslor. Handelskapitalet hanteras i DUAL-format (AIG-USDT). Officiell webbplats är tagmarkets.com och Genesis-portalen är genesis.ibportal.io. Viktigt: handel innebär risk, resultaten varierar och tidigare utfall garanterar inte framtida; detta är information, inte finansiell rådgivning.',
      hr: 'Tag Markets je broker sustavnog trgovanja saveza Aitech One: automatizirane strategije za trgovanje bez ovisnosti o tvom vremenu, iskustvu ili emocijama. Operativni kapital vodi se u DUAL formatu (AIG-USDT). Službena stranica je tagmarkets.com, a Genesisov portal genesis.ibportal.io. Ključno: trgovanje nosi rizike, rezultati variraju i prošli učinak ne jamči buduće rezultate; ovo je informativno, nije financijski savjet.',
      ar: 'Tag Markets هو وسيط التداول المنهجي لتحالف Aitech One: استراتيجيات آلية للتداول دون الاعتماد على وقتك أو خبرتك أو مشاعرك. يُدار رأس المال التشغيلي بصيغة DUAL ‏(AIG-USDT). موقعه الرسمي tagmarkets.com وبوابة Genesis هي genesis.ibportal.io. نقطة أساسية: التداول ينطوي على مخاطر، والنتائج تتفاوت، والأداء السابق لا يضمن نتائج مستقبلية؛ هذا للإعلام لا للاستشارة المالية.',
      de: 'Tag Markets ist der Broker für systematisches Trading der Aitech-One-Allianz: automatisierte Strategien, um zu handeln, ohne von deiner Zeit, Erfahrung oder deinen Emotionen abzuhängen. Das Handelskapital wird im DUAL-Format (AIG-USDT) geführt. Die offizielle Seite ist tagmarkets.com und das Genesis-Portal genesis.ibportal.io. Wichtig: Trading birgt Risiken, Ergebnisse schwanken und vergangene Performance garantiert keine künftigen Ergebnisse; dies ist Information, keine Finanzberatung.',
      sr: 'Tag Markets је брокер системског трговања савеза Aitech One: аутоматизоване стратегије за трговање без зависности од твог времена, искуства или емоција. Оперативни капитал води се у DUAL формату (AIG-USDT). Званични сајт је tagmarkets.com, а Genesis портал genesis.ibportal.io. Кључно: трговање носи ризике, резултати варирају, а прошли учинак не гарантује будуће резултате; ово је информативно, није финансијски савет.',
      ur: 'Tag Markets، Aitech One اتحاد کا سسٹمیٹک ٹریڈنگ بروکر ہے: خودکار حکمتِ عملیاں تاکہ آپ کے وقت، تجربے یا جذبات پر انحصار کیے بغیر ٹریڈ ہو۔ آپریٹنگ سرمایہ DUAL فارمیٹ (AIG-USDT) میں چلایا جاتا ہے۔ سرکاری سائٹ tagmarkets.com اور Genesis پورٹل genesis.ibportal.io ہے۔ اہم بات: ٹریڈنگ میں خطرات ہیں، نتائج مختلف ہوتے ہیں اور ماضی کی کارکردگی مستقبل کی ضمانت نہیں؛ یہ معلوماتی ہے، مالی مشورہ نہیں۔',
    },
  '¿Cómo activo la minería (AiG Mining)? Paso a paso': {
    en: 'How do I activate mining (AiG Mining)? Step by step',
    pt: 'Como ativo a mineração (AiG Mining)? Passo a passo',
    fr: 'Comment activer le minage (AiG Mining) ? Étape par étape',
    ru: 'Как включить майнинг (AiG Mining)? Шаг за шагом',
    sv: 'Hur aktiverar jag mining (AiG Mining)? Steg för steg',
    hr: 'Kako aktivirati rudarenje (AiG Mining)? Korak po korak',
    ar: 'كيف أُفعّل التعدين (AiG Mining)؟ خطوة بخطوة',
    de: 'Wie aktiviere ich das Mining (AiG Mining)? Schritt für Schritt',
    sr: 'Како да активирам рударење (AiG Mining)? Корак по корак',
    ur: 'میں مائننگ (AiG Mining) کیسے فعال کروں؟ مرحلہ وار',
  },
  '¿Qué es el AiG Token?': {
    en: 'What is the AiG Token?', pt: 'O que é o AiG Token?',
    fr: 'Qu’est-ce que le AiG Token ?', ru: 'Что такое AiG Token?',
    sv: 'Vad är AiG Token?', hr: 'Što je AiG Token?',
    ar: 'ما هو AiG Token؟', de: 'Was ist der AiG Token?',
    sr: 'Шта је AiG Token?', ur: 'AiG Token کیا ہے؟',
  },
  'Es el activo nativo del ecosistema AiGenesis, sobre la Binance Smart Chain (BSC). Está en cada operación: se genera a diario como recompensa de minería, se bloquea en staking para rendimientos, circula entre usuarios como medio de intercambio, y se recibe en referidos, binario y bonos de rango. Tiene un supply FIJO de 111 millones, sin emisión nueva ni quema.':
    {
      en: 'It is the native asset of the AiGenesis ecosystem, on the Binance Smart Chain (BSC). It is present in every operation: generated daily as a mining reward, locked in staking for yield, circulating between users as a means of exchange, and received through referrals, binary and rank bonuses. It has a FIXED supply of 111 million, with no new issuance and no burning.',
      pt: 'É o ativo nativo do ecossistema AiGenesis, na Binance Smart Chain (BSC). Está em cada operação: é gerado diariamente como recompensa de mineração, é bloqueado em staking para rendimentos, circula entre usuários como meio de troca e é recebido em indicações, binário e bônus de rank. Tem supply FIXO de 111 milhões, sem nova emissão nem queima.',
      fr: 'C’est l’actif natif de l’écosystème AiGenesis, sur la Binance Smart Chain (BSC). Il est dans chaque opération : généré chaque jour comme récompense de minage, bloqué en staking pour du rendement, il circule entre utilisateurs comme moyen d’échange et se reçoit via les parrainages, le binaire et les bonus de rang. Son offre est FIXE à 111 millions, sans nouvelle émission ni destruction.',
      ru: 'Это нативный актив экосистемы AiGenesis в сети Binance Smart Chain (BSC). Он присутствует в каждой операции: ежедневно начисляется как награда за майнинг, блокируется в стейкинге ради доходности, обращается между пользователями как средство обмена и приходит по рефералам, бинару и ранговым бонусам. Эмиссия ФИКСИРОВАНА — 111 миллионов, без допвыпуска и без сжигания.',
      sv: 'Det är AiGenesis-ekosystemets egen tillgång, på Binance Smart Chain (BSC). Den finns i varje operation: den skapas dagligen som miningbelöning, låses i staking för avkastning, cirkulerar mellan användare som bytesmedel och tas emot via hänvisningar, binär och rangbonusar. Utbudet är FAST på 111 miljoner, utan nyemission och utan bränning.',
      hr: 'To je nativna imovina ekosustava AiGenesis, na Binance Smart Chainu (BSC). Prisutna je u svakoj operaciji: stvara se svakodnevno kao nagrada za rudarenje, zaključava se u staking radi prinosa, kruži među korisnicima kao sredstvo razmjene i dobiva se kroz preporuke, binarni sustav i bonuse ranga. Ponuda je FIKSNA — 111 milijuna, bez novog izdavanja i bez spaljivanja.',
      ar: 'هو الأصل الأصلي لنظام AiGenesis البيئي، على شبكة Binance Smart Chain ‏(BSC). يوجد في كل عملية: يُولَّد يوميًا كمكافأة تعدين، ويُقفل في التخزين لتحقيق عائد، ويتداول بين المستخدمين كوسيلة تبادل، ويُستلم عبر الإحالات والنظام الثنائي ومكافآت الرتب. المعروض ثابت عند 111 مليونًا، بلا إصدار جديد ولا حرق.',
      de: 'Es ist der native Vermögenswert des AiGenesis-Ökosystems auf der Binance Smart Chain (BSC). Er steckt in jeder Operation: täglich als Mining-Belohnung erzeugt, im Staking für Erträge gebunden, zwischen Nutzern als Tauschmittel im Umlauf und über Empfehlungen, Binär und Rangboni erhalten. Das Angebot ist FEST bei 111 Millionen, ohne Neuausgabe und ohne Verbrennung.',
      sr: 'То је нативна имовина екосистема AiGenesis, на Binance Smart Chain-у (BSC). Присутна је у свакој операцији: ствара се свакодневно као награда за рударење, закључава се у стејкинг ради приноса, кружи међу корисницима као средство размене и добија се кроз препоруке, бинарни систем и бонусе ранга. Понуда је ФИКСНА — 111 милиона, без новог издавања и без спаљивања.',
      ur: 'یہ AiGenesis ایکو سسٹم کا مقامی اثاثہ ہے، Binance Smart Chain (BSC) پر۔ یہ ہر عمل میں موجود ہے: روزانہ مائننگ انعام کے طور پر بنتا ہے، منافع کے لیے اسٹیکنگ میں بند ہوتا ہے، صارفین کے درمیان تبادلے کے ذریعے کے طور پر چلتا ہے، اور ریفرل، بائنری اور رینک بونس سے ملتا ہے۔ سپلائی مقررہ ہے — 111 ملین، نہ نئی اجرا نہ جلانا۔',
    },
  '¿Cómo empiezo o me uno a la alianza (TagMarket) a través de la comunidad?': {
    en: 'How do I start or join the alliance (TagMarket) through the community?',
    pt: 'Como começo ou me junto à aliança (TagMarket) pela comunidade?',
    fr: 'Comment démarrer ou rejoindre l’alliance (TagMarket) via la communauté ?',
    ru: 'Как начать или присоединиться к альянсу (TagMarket) через сообщество?',
    sv: 'Hur börjar jag eller går med i alliansen (TagMarket) via gemenskapen?',
    hr: 'Kako početi ili se pridružiti savezu (TagMarket) preko zajednice?',
    ar: 'كيف أبدأ أو أنضم إلى التحالف (TagMarket) عبر المجتمع؟',
    de: 'Wie fange ich an oder trete der Allianz (TagMarket) über die Community bei?',
    sr: 'Како да почнем или се придружим савезу (TagMarket) преко заједнице?',
    ur: 'میں کمیونٹی کے ذریعے اتحاد (TagMarket) میں کیسے شروع یا شامل ہوں؟',
  },
  '¿Qué es Aitech / Aitech One y la alianza con Genesis?': {
    en: 'What is Aitech / Aitech One and the alliance with Genesis?',
    pt: 'O que é Aitech / Aitech One e a aliança com a Genesis?',
    fr: 'Qu’est-ce qu’Aitech / Aitech One et l’alliance avec Genesis ?',
    ru: 'Что такое Aitech / Aitech One и альянс с Genesis?',
    sv: 'Vad är Aitech / Aitech One och alliansen med Genesis?',
    hr: 'Što je Aitech / Aitech One i savez s Genesisom?',
    ar: 'ما هو Aitech / Aitech One والتحالف مع Genesis؟',
    de: 'Was ist Aitech / Aitech One und die Allianz mit Genesis?',
    sr: 'Шта је Aitech / Aitech One и савез са Genesis-ом?',
    ur: 'Aitech / Aitech One اور Genesis کے ساتھ اتحاد کیا ہے؟',
  },
  '¿Para qué sirve el AiG Token en la alianza? ¿Dónde puedo usarlo?': {
    en: 'What is the AiG Token for within the alliance? Where can I use it?',
    pt: 'Para que serve o AiG Token na aliança? Onde posso usá-lo?',
    fr: 'À quoi sert le AiG Token dans l’alliance ? Où puis-je l’utiliser ?',
    ru: 'Для чего нужен AiG Token в альянсе? Где им можно пользоваться?',
    sv: 'Vad används AiG Token till i alliansen? Var kan jag använda den?',
    hr: 'Čemu služi AiG Token u savezu? Gdje ga mogu koristiti?',
    ar: 'ما فائدة AiG Token في التحالف؟ وأين يمكنني استخدامه؟',
    de: 'Wofür ist der AiG Token in der Allianz da? Wo kann ich ihn nutzen?',
    sr: 'Чему служи AiG Token у савезу? Где могу да га користим?',
    ur: 'اتحاد میں AiG Token کس کام آتا ہے؟ میں اسے کہاں استعمال کر سکتا ہوں؟',
  },
  '¿Qué es BIX o BixCard?': {
    en: 'What is BIX or BixCard?', pt: 'O que é BIX ou BixCard?',
    fr: 'Qu’est-ce que BIX ou BixCard ?', ru: 'Что такое BIX или BixCard?',
    sv: 'Vad är BIX eller BixCard?', hr: 'Što je BIX ili BixCard?',
    ar: 'ما هو BIX أو BixCard؟', de: 'Was ist BIX oder BixCard?',
    sr: 'Шта је BIX или BixCard?', ur: 'BIX یا BixCard کیا ہے؟',
  },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · ACCESO, SEGURIDAD Y PROBLEMAS

     La primera tanda de las 91 que faltaban, y va primera por una razón: son
     las que busca alguien que NO PUEDE ENTRAR. Quien tiene un problema y no lee
     español es exactamente a quien más le duele que esto esté sin traducir.

     TRES COSAS QUE NO SE TRADUCEN Y ESTÁN A PROPÓSITO:
       · Las direcciones —`conect.aigenesis.io`, `aigenesis.io`, `BscScan`—.
         Traducir una dirección la vuelve inservible.
       · `?ref=`, que es literal y hay que reconocerlo en la barra del navegador.
       · Los atajos de teclado SÍ se localizan: «Ctrl+Mayús+R» es «Ctrl+Shift+R»
         en un teclado inglés, y decirle «Mayús» a alguien que ve «Shift» es
         mandarlo a buscar una tecla que no existe.

     LA ADVERTENCIA DE LA FRASE DE RECUPERACIÓN es la línea más importante del
     corpus entero: nadie del equipo la pide jamás. Traducida floja no protege.
     ══════════════════════════════════════════════════════════════════ */
  '¿Necesito una cuenta distinta para cada producto?': {
    en: 'Do I need a separate account for each product?',
    pt: 'Preciso de uma conta diferente para cada produto?',
    fr: 'Ai-je besoin d’un compte différent pour chaque produit ?',
    ru: 'Нужен ли отдельный аккаунт для каждого продукта?',
    sv: 'Behöver jag ett separat konto för varje produkt?',
    hr: 'Trebam li poseban račun za svaki proizvod?',
    ar: 'هل أحتاج حسابًا منفصلًا لكل منتج؟',
    de: 'Brauche ich für jedes Produkt ein eigenes Konto?',
    sr: 'Треба ли ми посебан налог за сваки производ?',
    ur: 'کیا مجھے ہر پروڈکٹ کے لیے الگ اکاؤنٹ چاہیے؟',
  },
  'No. Hay una sola cuenta para todo el ecosistema. Los botones de Mining, Staking, Booster, G-Pulse y el marketplace llevan todos al mismo sitio: conect.aigenesis.io. Si ya entraste una vez, estás dentro de todo.':
    {
      en: 'No. There is a single account for the whole ecosystem. The Mining, Staking, Booster, G-Pulse and marketplace buttons all lead to the same place: conect.aigenesis.io. If you have signed in once, you are in everywhere.',
      pt: 'Não. Existe uma única conta para todo o ecossistema. Os botões de Mining, Staking, Booster, G-Pulse e do marketplace levam todos ao mesmo lugar: conect.aigenesis.io. Se você já entrou uma vez, está dentro de tudo.',
      fr: 'Non. Il n’y a qu’un seul compte pour tout l’écosystème. Les boutons Mining, Staking, Booster, G-Pulse et la marketplace mènent tous au même endroit : conect.aigenesis.io. Si tu t’es connecté une fois, tu as accès à tout.',
      ru: 'Нет. На всю экосистему — один аккаунт. Кнопки Mining, Staking, Booster, G-Pulse и маркетплейса ведут в одно и то же место: conect.aigenesis.io. Если ты вошёл один раз, ты внутри всего.',
      sv: 'Nej. Det finns ett enda konto för hela ekosystemet. Knapparna för Mining, Staking, Booster, G-Pulse och marknadsplatsen leder alla till samma ställe: conect.aigenesis.io. Har du loggat in en gång är du inne överallt.',
      hr: 'Ne. Postoji jedan račun za cijeli ekosustav. Gumbi Mining, Staking, Booster, G-Pulse i tržnica vode na isto mjesto: conect.aigenesis.io. Ako si se jednom prijavio, unutra si svugdje.',
      ar: 'لا. هناك حساب واحد للنظام البيئي كله. أزرار Mining و Staking و Booster و G-Pulse والسوق تؤدي جميعها إلى المكان نفسه: conect.aigenesis.io. إذا دخلت مرة واحدة، فأنت داخل كل شيء.',
      de: 'Nein. Es gibt ein einziges Konto für das gesamte Ökosystem. Die Buttons für Mining, Staking, Booster, G-Pulse und den Marktplatz führen alle an denselben Ort: conect.aigenesis.io. Wenn du dich einmal angemeldet hast, bist du überall drin.',
      sr: 'Не. Постоји један налог за цео екосистем. Дугмад Mining, Staking, Booster, G-Pulse и маркетплејс воде на исто место: conect.aigenesis.io. Ако си се једном пријавио, унутра си свуда.',
      ur: 'نہیں۔ پورے ایکو سسٹم کے لیے ایک ہی اکاؤنٹ ہے۔ Mining، Staking، Booster، G-Pulse اور مارکیٹ پلیس کے بٹن سب ایک ہی جگہ لے جاتے ہیں: conect.aigenesis.io۔ اگر آپ ایک بار داخل ہو چکے ہیں تو آپ ہر جگہ اندر ہیں۔',
    },
  'Quiero registrarme y me dice «ACCESO RESTRINGIDO»': {
    en: 'I want to register and it says “RESTRICTED ACCESS”',
    pt: 'Quero me cadastrar e aparece «ACESSO RESTRITO»',
    fr: 'Je veux m’inscrire et il affiche « ACCÈS RESTREINT »',
    ru: 'Хочу зарегистрироваться, а пишет «ДОСТУП ОГРАНИЧЕН»',
    sv: 'Jag vill registrera mig och det står ”BEGRÄNSAD ÅTKOMST”',
    hr: 'Želim se registrirati, a piše «OGRANIČEN PRISTUP»',
    ar: 'أريد التسجيل ويظهر لي «الوصول مقيّد»',
    de: 'Ich will mich registrieren und es steht „ZUGANG BESCHRÄNKT“',
    sr: 'Желим да се региструјем, а пише «ОГРАНИЧЕН ПРИСТУП»',
    ur: 'میں رجسٹر کرنا چاہتا ہوں اور لکھا آتا ہے «رسائی محدود»',
  },
  'Genesis es solo por invitación. Para abrir el formulario de alta hace falta un enlace que lleve el referido de quien te invitó — la parte «?ref=» de la dirección. Sin esa parte no hay registro que rellenar. Si te pasaron el enlace como botón y se recortó, pide que te lo manden como texto plano.':
    {
      en: 'Genesis is invitation-only. To open the sign-up form you need a link carrying the referral of whoever invited you — the “?ref=” part of the address. Without that part there is no form to fill in. If the link was sent to you as a button and got cut off, ask for it as plain text.',
      pt: 'A Genesis é apenas por convite. Para abrir o formulário de cadastro é preciso um link que leve a indicação de quem lhe convidou — a parte «?ref=» do endereço. Sem essa parte não há cadastro para preencher. Se lhe enviaram o link como botão e ele foi cortado, peça que lhe mandem como texto simples.',
      fr: 'Genesis est uniquement sur invitation. Pour ouvrir le formulaire d’inscription, il faut un lien portant le parrainage de la personne qui t’a invité — la partie « ?ref= » de l’adresse. Sans cette partie, il n’y a pas de formulaire à remplir. Si le lien t’a été envoyé sous forme de bouton et qu’il a été tronqué, demande-le en texte brut.',
      ru: 'Genesis работает только по приглашению. Чтобы открылась форма регистрации, нужна ссылка с рефералом того, кто тебя пригласил — часть «?ref=» в адресе. Без неё заполнять нечего. Если ссылку прислали кнопкой и она обрезалась, попроси прислать её обычным текстом.',
      sv: 'Genesis är endast för inbjudna. För att öppna registreringsformuläret krävs en länk som bär inbjudarens hänvisning — delen ”?ref=” i adressen. Utan den finns inget formulär att fylla i. Om länken skickades som en knapp och klipptes av, be att få den som ren text.',
      hr: 'Genesis je samo na poziv. Za otvaranje obrasca za registraciju potrebna je poveznica koja nosi preporuku osobe koja te pozvala — dio «?ref=» u adresi. Bez tog dijela nema obrasca za ispuniti. Ako su ti poveznicu poslali kao gumb pa se skratila, zatraži je kao običan tekst.',
      ar: 'Genesis بالدعوة فقط. لفتح نموذج التسجيل تحتاج رابطًا يحمل إحالة من دعاك — الجزء «‎?ref=‎» من العنوان. بدون ذلك الجزء لا يوجد نموذج تملؤه. إذا أُرسل لك الرابط كزرّ وتم اقتطاعه، اطلبه كنص عادي.',
      de: 'Genesis ist nur auf Einladung. Um das Anmeldeformular zu öffnen, brauchst du einen Link mit der Empfehlung der Person, die dich eingeladen hat — den Teil „?ref=“ in der Adresse. Ohne diesen Teil gibt es kein Formular zum Ausfüllen. Wurde dir der Link als Button geschickt und dabei abgeschnitten, bitte um die Zusendung als reinen Text.',
      sr: 'Genesis је само на позив. За отварање обрасца за регистрацију потребна је веза која носи препоруку особе која те позвала — део «?ref=» у адреси. Без тог дела нема обрасца за попуњавање. Ако су ти везу послали као дугме па се скратила, затражи је као обичан текст.',
      ur: 'Genesis صرف دعوت پر ہے۔ رجسٹریشن فارم کھولنے کے لیے ایسا لنک چاہیے جس میں دعوت دینے والے کا ریفرل ہو — پتے کا «?ref=» والا حصہ۔ اُس حصے کے بغیر بھرنے کو کوئی فارم نہیں۔ اگر لنک بٹن کی صورت بھیجا گیا اور کٹ گیا، تو اسے سادہ متن میں بھیجنے کو کہیں۔',
    },
  'Me registré, ¿y ahora?': {
    en: 'I registered — now what?', pt: 'Me cadastrei, e agora?',
    fr: 'Je me suis inscrit, et maintenant ?', ru: 'Я зарегистрировался — что дальше?',
    sv: 'Jag har registrerat mig — vad nu?', hr: 'Registrirao sam se, i sad?',
    ar: 'سجّلت، وماذا الآن؟', de: 'Ich habe mich registriert — und jetzt?',
    sr: 'Регистровао сам се, и сад?', ur: 'میں نے رجسٹر کر لیا، اب کیا؟',
  },
  'Al registrarte llega un código a tu correo para validar el alta. Hasta que lo introduzcas, el registro no queda confirmado. Si no aparece, revisa la carpeta de no deseados antes de repetir el proceso: crear una segunda cuenta no arregla el correo que falta y deja dos altas a medias.':
    {
      en: 'When you register, a code arrives by email to validate the sign-up. Until you enter it, the registration is not confirmed. If it does not show up, check your spam folder before repeating the process: creating a second account does not fix the missing email and leaves two half-finished sign-ups.',
      pt: 'Ao se cadastrar, chega um código ao seu e-mail para validar a inscrição. Até você inseri-lo, o cadastro não fica confirmado. Se não aparecer, verifique a pasta de spam antes de repetir o processo: criar uma segunda conta não resolve o e-mail que falta e deixa dois cadastros pela metade.',
      fr: 'À l’inscription, un code arrive par e-mail pour valider ton compte. Tant que tu ne le saisis pas, l’inscription n’est pas confirmée. S’il n’apparaît pas, vérifie le dossier indésirables avant de recommencer : créer un second compte ne répare pas l’e-mail manquant et laisse deux inscriptions à moitié faites.',
      ru: 'При регистрации на почту приходит код для подтверждения. Пока ты его не введёшь, регистрация не подтверждена. Если письма нет, проверь папку «Спам», прежде чем повторять: создание второго аккаунта не вернёт пропавшее письмо и оставит две недоделанные регистрации.',
      sv: 'När du registrerar dig kommer en kod till din e-post för att bekräfta kontot. Tills du anger den är registreringen inte bekräftad. Om den inte dyker upp, kolla skräpposten innan du gör om processen: att skapa ett andra konto löser inte det uteblivna mejlet och lämnar två halvfärdiga registreringar.',
      hr: 'Pri registraciji na e-poštu stiže kôd za potvrdu. Dok ga ne upišeš, registracija nije potvrđena. Ako se ne pojavi, provjeri mapu neželjene pošte prije nego ponoviš postupak: otvaranje drugog računa neće riješiti e-poštu koja nije stigla i ostavit će dvije nedovršene registracije.',
      ar: 'عند التسجيل يصلك رمز على بريدك لتأكيد الحساب. وحتى تُدخله، لا يُعدّ التسجيل مؤكدًا. إذا لم يظهر، تحقّق من مجلد الرسائل غير المرغوبة قبل تكرار العملية: إنشاء حساب ثانٍ لا يُصلح البريد المفقود ويترك تسجيلين ناقصين.',
      de: 'Bei der Registrierung kommt ein Code per E-Mail, um die Anmeldung zu bestätigen. Bis du ihn eingibst, ist die Registrierung nicht bestätigt. Erscheint er nicht, prüfe den Spam-Ordner, bevor du den Vorgang wiederholst: ein zweites Konto behebt die fehlende E-Mail nicht und hinterlässt zwei halbfertige Anmeldungen.',
      sr: 'При регистрацији на е-пошту стиже код за потврду. Док га не унесеш, регистрација није потврђена. Ако се не појави, провери фасциклу нежељене поште пре него што поновиш поступак: отварање другог налога неће решити е-пошту која није стигла и оставиће две недовршене регистрације.',
      ur: 'رجسٹر کرنے پر آپ کے ای میل پر تصدیق کا کوڈ آتا ہے۔ جب تک آپ اسے درج نہ کریں، رجسٹریشن مکمل نہیں ہوتی۔ اگر نہ آئے تو عمل دہرانے سے پہلے اسپیم فولڈر دیکھیں: دوسرا اکاؤنٹ بنانے سے گمشدہ ای میل ٹھیک نہیں ہوتی اور دو ادھورے اندراج رہ جاتے ہیں۔',
    },
  'Dice que no existe mi correo o mi wallet': {
    en: 'It says my email or my wallet does not exist',
    pt: 'Diz que meu e-mail ou minha carteira não existe',
    fr: 'Il dit que mon e-mail ou mon portefeuille n’existe pas',
    ru: 'Пишет, что моей почты или кошелька не существует',
    sv: 'Det står att min e-post eller plånbok inte finns',
    hr: 'Piše da moja e-pošta ili novčanik ne postoji',
    ar: 'يقول إن بريدي أو محفظتي غير موجودة',
    de: 'Es sagt, meine E-Mail oder meine Wallet existiere nicht',
    sr: 'Пише да моја е-пошта или новчаник не постоји',
    ur: 'کہتا ہے کہ میرا ای میل یا والٹ موجود نہیں',
  },
  'Entra por donde te diste de alta. Si te registraste con correo y contraseña, entrar conectando la wallet no funciona, y al revés tampoco: el sistema no asocia las dos formas por su cuenta. Comprueba también que el correo sea exactamente el del alta.':
    {
      en: 'Sign in the same way you signed up. If you registered with email and password, signing in by connecting the wallet will not work, and the other way round neither: the system does not link the two methods on its own. Also check that the email is exactly the one used at sign-up.',
      pt: 'Entre pelo mesmo caminho pelo qual se cadastrou. Se você se registrou com e-mail e senha, entrar conectando a carteira não funciona, e o inverso também não: o sistema não associa as duas formas por conta própria. Verifique também se o e-mail é exatamente o do cadastro.',
      fr: 'Connecte-toi par où tu t’es inscrit. Si tu t’es enregistré avec e-mail et mot de passe, te connecter en reliant le portefeuille ne marchera pas, et l’inverse non plus : le système n’associe pas les deux méthodes tout seul. Vérifie aussi que l’e-mail est exactement celui de l’inscription.',
      ru: 'Входи тем же способом, каким регистрировался. Если ты зарегистрировался с почтой и паролем, вход через подключение кошелька не сработает — и наоборот тоже: система сама два способа не связывает. Проверь также, что почта в точности та, что при регистрации.',
      sv: 'Logga in på samma sätt som du registrerade dig. Registrerade du dig med e-post och lösenord fungerar det inte att logga in genom att koppla plånboken, och tvärtom heller inte: systemet kopplar inte ihop de två sätten själv. Kontrollera också att e-posten är exakt den från registreringen.',
      hr: 'Prijavi se onako kako si se registrirao. Ako si se registrirao e-poštom i lozinkom, prijava povezivanjem novčanika neće raditi, ni obrnuto: sustav sam ne povezuje ta dva načina. Provjeri i je li e-pošta točno ona s registracije.',
      ar: 'ادخل من حيث سجّلت. إذا سجّلت ببريد وكلمة مرور، فالدخول بربط المحفظة لن يعمل، والعكس كذلك: النظام لا يربط الطريقتين من تلقاء نفسه. تحقّق أيضًا أن البريد هو نفسه المستخدم عند التسجيل تمامًا.',
      de: 'Melde dich so an, wie du dich registriert hast. Hast du dich mit E-Mail und Passwort registriert, funktioniert die Anmeldung über die Wallet nicht — und umgekehrt ebenso wenig: Das System verknüpft die beiden Wege nicht von selbst. Prüfe außerdem, ob die E-Mail exakt die der Registrierung ist.',
      sr: 'Пријави се онако како си се регистровао. Ако си се регистровао е-поштом и лозинком, пријава повезивањем новчаника неће радити, ни обрнуто: систем сам не повезује та два начина. Провери и да ли је е-пошта тачно она са регистрације.',
      ur: 'اُسی طریقے سے داخل ہوں جس سے رجسٹر ہوئے تھے۔ اگر ای میل اور پاس ورڈ سے رجسٹر ہوئے تھے تو والٹ جوڑ کر داخل ہونا کام نہیں کرے گا، اور اس کے برعکس بھی نہیں: نظام خود دونوں طریقے نہیں جوڑتا۔ یہ بھی دیکھیں کہ ای میل بالکل وہی ہے جو رجسٹریشن میں تھی۔',
    },
  'Olvidé mi contraseña': {
    en: 'I forgot my password', pt: 'Esqueci minha senha',
    fr: 'J’ai oublié mon mot de passe', ru: 'Я забыл пароль',
    sv: 'Jag har glömt mitt lösenord', hr: 'Zaboravio sam lozinku',
    ar: 'نسيت كلمة المرور', de: 'Ich habe mein Passwort vergessen',
    sr: 'Заборавио сам лозинку', ur: 'میں اپنا پاس ورڈ بھول گیا',
  },
  'Se resuelve sin ayuda de nadie: «¿Olvidaste la contraseña?» está en la propia pantalla de acceso y te manda un correo de recuperación desde una dirección de aigenesis.io. Si no llega, comprueba que escribiste el correo del alta — el sistema no avisa cuando una dirección no existe, y es a propósito, para no revelar quién tiene cuenta.':
    {
      en: 'You can solve it on your own: “Forgot your password?” is on the sign-in screen itself and sends you a recovery email from an aigenesis.io address. If it does not arrive, check that you typed the email used at sign-up — the system does not warn you when an address does not exist, and that is deliberate, so as not to reveal who has an account.',
      pt: 'Resolve-se sem ajuda de ninguém: «Esqueceu a senha?» está na própria tela de acesso e envia um e-mail de recuperação de um endereço aigenesis.io. Se não chegar, verifique se escreveu o e-mail do cadastro — o sistema não avisa quando um endereço não existe, e isso é proposital, para não revelar quem tem conta.',
      fr: 'Cela se règle sans aide : « Mot de passe oublié ? » se trouve sur l’écran de connexion et t’envoie un e-mail de récupération depuis une adresse aigenesis.io. S’il n’arrive pas, vérifie que tu as saisi l’e-mail de l’inscription — le système ne prévient pas quand une adresse n’existe pas, et c’est volontaire, pour ne pas révéler qui possède un compte.',
      ru: 'Это решается без чьей-либо помощи: «Забыли пароль?» есть на самом экране входа и присылает письмо для восстановления с адреса aigenesis.io. Если письма нет, проверь, что ввёл почту, указанную при регистрации — система не сообщает, что адреса не существует, и это сделано намеренно, чтобы не выдавать, у кого есть аккаунт.',
      sv: 'Det löser du själv: ”Glömt lösenordet?” finns på inloggningsskärmen och skickar ett återställningsmejl från en aigenesis.io-adress. Kommer det inte fram, kontrollera att du skrev e-posten från registreringen — systemet varnar inte när en adress inte finns, och det är avsiktligt, för att inte avslöja vem som har konto.',
      hr: 'Rješava se bez ičije pomoći: «Zaboravljena lozinka?» nalazi se na samom zaslonu prijave i šalje ti e-poštu za oporavak s adrese aigenesis.io. Ako ne stigne, provjeri jesi li upisao e-poštu s registracije — sustav ne upozorava kad adresa ne postoji, i to je namjerno, kako se ne bi otkrilo tko ima račun.',
      ar: 'يُحلّ دون مساعدة أحد: «هل نسيت كلمة المرور؟» موجود في شاشة الدخول نفسها ويرسل لك بريد استرداد من عنوان aigenesis.io. إذا لم يصل، تأكّد أنك كتبت بريد التسجيل — النظام لا ينبّه عندما لا يوجد عنوان، وذلك عن قصد، حتى لا يكشف مَن لديه حساب.',
      de: 'Das löst du ohne fremde Hilfe: „Passwort vergessen?“ steht auf dem Anmeldebildschirm und schickt dir eine Wiederherstellungs-E-Mail von einer aigenesis.io-Adresse. Kommt sie nicht an, prüfe, ob du die E-Mail der Registrierung eingegeben hast — das System meldet nicht, wenn eine Adresse nicht existiert, und das ist Absicht, um nicht preiszugeben, wer ein Konto hat.',
      sr: 'Решава се без ичије помоћи: «Заборављена лозинка?» налази се на самом екрану пријаве и шаље ти е-пошту за опоравак са адресе aigenesis.io. Ако не стигне, провери да ли си уписао е-пошту са регистрације — систем не упозорава када адреса не постоји, и то је намерно, како се не би открило ко има налог.',
      ur: 'یہ آپ خود حل کر سکتے ہیں: «پاس ورڈ بھول گئے؟» لاگ اِن اسکرین پر ہی ہے اور aigenesis.io کے پتے سے بحالی کی ای میل بھیجتا ہے۔ اگر نہ آئے تو دیکھیں کہ آپ نے رجسٹریشن والا ای میل لکھا ہے — نظام یہ نہیں بتاتا کہ پتہ موجود نہیں، اور یہ جان بوجھ کر ہے، تاکہ یہ ظاہر نہ ہو کہ کس کا اکاؤنٹ ہے۔',
    },
  '¿Cómo sé qué es oficial? ¿Cuáles son las fuentes verificables?': {
    en: 'How do I know what is official? What are the verifiable sources?',
    pt: 'Como sei o que é oficial? Quais são as fontes verificáveis?',
    fr: 'Comment savoir ce qui est officiel ? Quelles sont les sources vérifiables ?',
    ru: 'Как понять, что официально? Какие источники можно проверить?',
    sv: 'Hur vet jag vad som är officiellt? Vilka källor går att verifiera?',
    hr: 'Kako znam što je službeno? Koji su izvori provjerljivi?',
    ar: 'كيف أعرف ما هو رسمي؟ وما المصادر القابلة للتحقق؟',
    de: 'Woran erkenne ich, was offiziell ist? Welche Quellen sind überprüfbar?',
    sr: 'Како да знам шта је званично? Који су извори проверљиви?',
    ur: 'مجھے کیسے پتہ چلے کہ کیا سرکاری ہے؟ قابلِ تصدیق ذرائع کون سے ہیں؟',
  },
  '¿Qué datos me puede pedir el soporte?': {
    en: 'What information can support ask me for?',
    pt: 'Quais dados o suporte pode me pedir?',
    fr: 'Quelles informations le support peut-il me demander ?',
    ru: 'Какие данные может запросить поддержка?',
    sv: 'Vilka uppgifter får supporten be om?',
    hr: 'Koje podatke podrška smije tražiti?',
    ar: 'ما البيانات التي يمكن للدعم أن يطلبها مني؟',
    de: 'Welche Daten darf der Support von mir verlangen?',
    sr: 'Које податке подршка сме да тражи?',
    ur: 'سپورٹ مجھ سے کون سی معلومات مانگ سکتی ہے؟',
  },
  'Tu usuario, tu correo, la wallet asociada y los hashes de las transacciones del caso. Nunca la contraseña, y nunca la frase de recuperación de tu wallet: nadie del equipo la necesita jamás, y quien te la pida está intentando robarte, aunque escriba desde un canal que parezca oficial.':
    {
      en: 'Your username, your email, the associated wallet and the transaction hashes for the case. Never your password, and never your wallet’s recovery phrase: nobody on the team ever needs it, and anyone who asks for it is trying to rob you — even if they write from a channel that looks official.',
      pt: 'Seu usuário, seu e-mail, a carteira associada e os hashes das transações do caso. Nunca a senha, e nunca a frase de recuperação da sua carteira: ninguém da equipe precisa dela jamais, e quem a pedir está tentando roubá-lo, mesmo que escreva de um canal que pareça oficial.',
      fr: 'Ton identifiant, ton e-mail, le portefeuille associé et les hachages des transactions concernées. Jamais le mot de passe, et jamais la phrase de récupération de ton portefeuille : personne dans l’équipe n’en a jamais besoin, et quiconque te la demande cherche à te voler, même s’il écrit depuis un canal qui a l’air officiel.',
      ru: 'Твой логин, почту, привязанный кошелёк и хеши транзакций по делу. Никогда пароль и никогда сид-фразу кошелька: она не нужна никому из команды, и тот, кто её просит, пытается тебя обокрасть — даже если пишет из канала, который выглядит официальным.',
      sv: 'Ditt användarnamn, din e-post, den kopplade plånboken och transaktionernas hashar i ärendet. Aldrig lösenordet, och aldrig plånbokens återställningsfras: ingen i teamet behöver den någonsin, och den som ber om den försöker bestjäla dig — även om hen skriver från en kanal som ser officiell ut.',
      hr: 'Tvoje korisničko ime, e-poštu, povezani novčanik i hasheve transakcija iz slučaja. Nikad lozinku, i nikad frazu za oporavak novčanika: nikome iz tima nikada ne treba, a tko je traži pokušava te opljačkati, čak i ako piše s kanala koji izgleda službeno.',
      ar: 'اسم المستخدم وبريدك والمحفظة المرتبطة وبصمات (hashes) معاملات الحالة. لا كلمة المرور أبدًا، ولا عبارة استرداد محفظتك أبدًا: لا أحد في الفريق يحتاجها إطلاقًا، ومن يطلبها يحاول سرقتك، حتى لو كتب من قناة تبدو رسمية.',
      de: 'Deinen Benutzernamen, deine E-Mail, die zugehörige Wallet und die Transaktions-Hashes des Falls. Niemals das Passwort und niemals die Wiederherstellungsphrase deiner Wallet: Niemand im Team braucht sie je, und wer danach fragt, will dich bestehlen — auch wenn er aus einem Kanal schreibt, der offiziell wirkt.',
      sr: 'Твоје корисничко име, е-пошту, повезани новчаник и хешеве трансакција из случаја. Никад лозинку, и никад фразу за опоравак новчаника: никоме из тима никада не треба, а ко је тражи покушава да те покраде, чак и ако пише са канала који изгледа званично.',
      ur: 'آپ کا صارف نام، ای میل، منسلک والٹ اور کیس کی ٹرانزیکشنز کے hashes۔ کبھی پاس ورڈ نہیں، اور کبھی آپ کے والٹ کا ریکوری فقرہ نہیں: ٹیم کے کسی فرد کو یہ کبھی درکار نہیں، اور جو مانگے وہ آپ کو لوٹنے کی کوشش کر رہا ہے، چاہے وہ ایسے چینل سے لکھے جو سرکاری لگے۔',
    },
  '¿Puedo cambiar la wallet de mi cuenta?': {
    en: 'Can I change my account’s wallet?', pt: 'Posso mudar a carteira da minha conta?',
    fr: 'Puis-je changer le portefeuille de mon compte ?', ru: 'Могу ли я сменить кошелёк аккаунта?',
    sv: 'Kan jag byta plånbok på mitt konto?', hr: 'Mogu li promijeniti novčanik svog računa?',
    ar: 'هل يمكنني تغيير محفظة حسابي؟', de: 'Kann ich die Wallet meines Kontos ändern?',
    sr: 'Могу ли да променим новчаник свог налога?', ur: 'کیا میں اپنے اکاؤنٹ کا والٹ بدل سکتا ہوں؟',
  },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · HOLD Y ESTADO DE LA CUENTA (1 de 2)

     La categoría con más consultas reales del corpus. Y la más delicada de
     traducir, porque lleva CIFRAS dentro: el 14 % del histórico minado, los
     10 USDT mínimos para reclamar, las 72 horas de plazo.

     ESAS CIFRAS SE COPIAN, NO SE ADAPTAN. Ni se redondean, ni se convierten a
     otra moneda, ni se cambia el formato del porcentaje. Una respuesta sobre
     dinero que dice un número distinto del original no es una traducción
     imprecisa: es información falsa.
     ══════════════════════════════════════════════════════════════════ */
  '¿Qué es el hold y por qué me lo piden?': {
    en: 'What is the hold and why is it required?',
    pt: 'O que é o hold e por que me pedem?',
    fr: 'Qu’est-ce que le hold et pourquoi me le demande-t-on ?',
    ru: 'Что такое hold и почему его требуют?',
    sv: 'Vad är hold och varför krävs det?',
    hr: 'Što je hold i zašto se traži?',
    ar: 'ما هو الـ hold ولماذا يُطلب مني؟',
    de: 'Was ist der Hold und warum wird er verlangt?',
    sr: 'Шта је hold и зашто се тражи?',
    ur: 'hold کیا ہے اور مجھ سے کیوں مانگا جاتا ہے؟',
  },
  'El hold es una cantidad de AIG que la cuenta debe mantener para conservar sus beneficios activos. No es un cobro ni un depósito que se pierda: sigue siendo tuyo, sólo tiene que estar ahí. La cuenta muestra en qué banda estás — desde «Cumple Requisito» hasta «Óptimo», y «Beneficios Congelados» cuando cae por debajo.':
    {
      en: 'The hold is an amount of AIG the account must keep in order to preserve its active benefits. It is not a charge nor a deposit you lose: it remains yours, it just has to be there. The account shows which band you are in — from “Requirement Met” to “Optimal”, and “Benefits Frozen” when it drops below.',
      pt: 'O hold é uma quantidade de AIG que a conta deve manter para conservar seus benefícios ativos. Não é uma cobrança nem um depósito que se perca: continua sendo seu, só precisa estar ali. A conta mostra em que faixa você está — de «Requisito Cumprido» até «Ótimo», e «Benefícios Congelados» quando cai abaixo.',
      fr: 'Le hold est une quantité d’AIG que le compte doit conserver pour garder ses avantages actifs. Ce n’est ni un frais ni un dépôt perdu : il reste à toi, il doit simplement être là. Le compte indique dans quelle tranche tu te situes — de « Exigence remplie » à « Optimal », et « Avantages gelés » quand il passe en dessous.',
      ru: 'Hold — это количество AIG, которое аккаунт должен держать, чтобы сохранить активные преимущества. Это не комиссия и не депозит, который пропадает: он остаётся твоим, просто должен быть на месте. Аккаунт показывает, в какой ты полосе — от «Требование выполнено» до «Оптимально», и «Преимущества заморожены», когда опускаешься ниже.',
      sv: 'Hold är en mängd AIG som kontot måste behålla för att bevara sina aktiva förmåner. Det är varken en avgift eller en insats du förlorar: den förblir din, den måste bara finnas där. Kontot visar vilket band du ligger i — från ”Krav uppfyllt” till ”Optimalt”, och ”Förmåner frysta” när du hamnar under.',
      hr: 'Hold je količina AIG-a koju račun mora držati da bi zadržao aktivne pogodnosti. Nije naplata ni polog koji se gubi: ostaje tvoj, samo mora biti ondje. Račun pokazuje u kojem si pojasu — od «Uvjet ispunjen» do «Optimalno», i «Pogodnosti zamrznute» kad padneš ispod.',
      ar: 'الـ hold هو مقدار من AIG يجب أن يحتفظ به الحساب للحفاظ على مزاياه نشطة. ليس رسمًا ولا وديعة تُفقد: يبقى ملكك، عليه فقط أن يكون موجودًا. يعرض الحساب في أي نطاق أنت — من «الشرط مُستوفى» إلى «الأمثل»، و«المزايا مجمّدة» عند النزول تحته.',
      de: 'Der Hold ist eine Menge AIG, die das Konto halten muss, um seine aktiven Vorteile zu bewahren. Es ist weder eine Gebühr noch eine Einlage, die verloren geht: Sie bleibt dein, sie muss nur da sein. Das Konto zeigt, in welchem Band du bist — von „Anforderung erfüllt“ bis „Optimal“, und „Vorteile eingefroren“, wenn es darunter fällt.',
      sr: 'Hold је количина AIG-а коју налог мора држати да би задржао активне погодности. Није наплата ни депозит који се губи: остаје твој, само мора бити ту. Налог показује у ком си појасу — од «Услов испуњен» до «Оптимално», и «Погодности замрзнуте» кад паднеш испод.',
      ur: 'hold وہ AIG کی مقدار ہے جو اکاؤنٹ کو اپنے فعال فوائد برقرار رکھنے کے لیے رکھنی ہوتی ہے۔ یہ کوئی فیس یا ضائع ہونے والا ڈپازٹ نہیں: یہ آپ ہی کا رہتا ہے، بس وہاں ہونا چاہیے۔ اکاؤنٹ دکھاتا ہے کہ آپ کس درجے میں ہیں — «شرط پوری» سے «بہترین» تک، اور نیچے آنے پر «فوائد منجمد»۔',
    },
  '¿Cuánto AIG tengo que mantener exactamente?': {
    en: 'Exactly how much AIG do I have to keep?',
    pt: 'Quanto AIG tenho que manter exatamente?',
    fr: 'Combien d’AIG dois-je conserver exactement ?',
    ru: 'Сколько именно AIG нужно держать?',
    sv: 'Exakt hur mycket AIG måste jag behålla?',
    hr: 'Koliko točno AIG-a moram držati?',
    ar: 'كم مقدار AIG الذي عليّ الاحتفاظ به بالضبط؟',
    de: 'Wie viel AIG muss ich genau halten?',
    sr: 'Колико тачно AIG-а морам да држим?',
    ur: 'مجھے بالکل کتنا AIG رکھنا ہوگا؟',
  },
  'El 14% de lo que has minado históricamente. Sobre ese mínimo hay bandas de margen —el sistema las llama Recomendado y Óptimo— que existen para que un movimiento pequeño no te deje por debajo del límite. La cifra exacta en AIG la calcula tu propia cuenta: mírala en el panel antes de mover nada, porque depende de tu histórico y no del de nadie más.':
    {
      en: '14% of what you have mined historically. Above that minimum there are margin bands — the system calls them Recommended and Optimal — which exist so a small movement does not push you below the limit. The exact figure in AIG is calculated by your own account: check it in the dashboard before moving anything, because it depends on your history and nobody else’s.',
      pt: '14% do que você minerou historicamente. Acima desse mínimo há faixas de margem — o sistema as chama de Recomendado e Ótimo — que existem para que um movimento pequeno não o deixe abaixo do limite. A cifra exata em AIG é calculada pela sua própria conta: veja no painel antes de mover qualquer coisa, porque depende do seu histórico e de mais ninguém.',
      fr: '14 % de ce que tu as miné historiquement. Au-dessus de ce minimum, il existe des tranches de marge — le système les appelle Recommandé et Optimal — qui évitent qu’un petit mouvement te fasse passer sous la limite. Le chiffre exact en AIG est calculé par ton propre compte : regarde-le dans le tableau de bord avant de bouger quoi que ce soit, car il dépend de ton historique et de celui de personne d’autre.',
      ru: '14 % от того, что ты добыл за всю историю. Над этим минимумом есть полосы запаса — система называет их «Рекомендуемо» и «Оптимально» — они нужны, чтобы небольшое движение не увело тебя за предел. Точную цифру в AIG считает твой аккаунт: посмотри её в панели, прежде чем что-то двигать, потому что она зависит от твоей истории и ничьей больше.',
      sv: '14 % av det du historiskt har minat. Ovanför det minimum finns marginalband — systemet kallar dem Rekommenderat och Optimalt — som finns till för att en liten rörelse inte ska lämna dig under gränsen. Den exakta siffran i AIG räknas ut av ditt eget konto: titta i panelen innan du flyttar något, eftersom den beror på din historik och ingen annans.',
      hr: '14 % onoga što si povijesno iskopao. Iznad tog minimuma postoje pojasevi margine — sustav ih zove Preporučeno i Optimalno — koji postoje da te mali pomak ne ostavi ispod granice. Točan iznos u AIG-u računa tvoj vlastiti račun: pogledaj ga na ploči prije nego išta pomakneš, jer ovisi o tvojoj povijesti, a ne o tuđoj.',
      ar: '14 % مما عدّنته تاريخيًا. فوق هذا الحد الأدنى توجد نطاقات هامش — يسمّيها النظام «موصى به» و«الأمثل» — وُجدت كي لا تُنزلك حركة صغيرة تحت الحد. الرقم الدقيق بالـ AIG يحسبه حسابك أنت: انظره في اللوحة قبل أن تحرّك شيئًا، لأنه يعتمد على سجلّك أنت لا على سجل أحد آخر.',
      de: '14 % dessen, was du historisch geschürft hast. Über diesem Minimum gibt es Margenbänder — das System nennt sie Empfohlen und Optimal —, damit eine kleine Bewegung dich nicht unter die Grenze bringt. Den genauen AIG-Wert berechnet dein eigenes Konto: sieh ihn im Panel nach, bevor du etwas bewegst, denn er hängt von deiner Historie ab und von keiner anderen.',
      sr: '14 % од онога што си историјски ископао. Изнад тог минимума постоје појасеви маргине — систем их зове Препоручено и Оптимално — који постоје да те мали помак не остави испод границе. Тачан износ у AIG-у рачуна твој сопствени налог: погледај га на табли пре него што било шта помериш, јер зависи од твоје историје, а не од туђе.',
      ur: 'جو آپ نے تاریخی طور پر مائن کیا اس کا 14%۔ اُس کم از کم سے اوپر مارجن کے درجے ہیں — نظام انہیں «تجویز کردہ» اور «بہترین» کہتا ہے — تاکہ ایک چھوٹی حرکت آپ کو حد سے نیچے نہ لے جائے۔ AIG میں درست عدد آپ کا اپنا اکاؤنٹ نکالتا ہے: کچھ بھی ہلانے سے پہلے پینل میں دیکھیں، کیونکہ یہ آپ کی اپنی تاریخ پر منحصر ہے، کسی اور کی نہیں۔',
    },
  'Si bajo del hold, ¿qué deja de funcionar exactamente?': {
    en: 'If I fall below the hold, what exactly stops working?',
    pt: 'Se eu ficar abaixo do hold, o que exatamente deixa de funcionar?',
    fr: 'Si je passe sous le hold, qu’est-ce qui cesse de fonctionner exactement ?',
    ru: 'Если я опущусь ниже hold, что именно перестанет работать?',
    sv: 'Om jag hamnar under hold — vad slutar exakt fungera?',
    hr: 'Ako padnem ispod holda, što točno prestaje raditi?',
    ar: 'إذا نزلت تحت الـ hold، ما الذي يتوقف بالضبط؟',
    de: 'Wenn ich unter den Hold falle, was funktioniert dann genau nicht mehr?',
    sr: 'Ако паднем испод hold-а, шта тачно престаје да ради?',
    ur: 'اگر میں hold سے نیچے آ جاؤں تو بالکل کیا بند ہو جاتا ہے؟',
  },
  'Se bloquean las recompensas: dejas de minar y no puedes reclamar. No es un bloqueo de la cuenta entera ni te quita nada de lo que ya tienes — lo que se detiene es la generación y el reclamo, hasta que vuelvas a cubrir el mínimo.':
    {
      en: 'Rewards are blocked: you stop mining and cannot claim. It is not a lock on the whole account and it does not take away anything you already hold — what stops is generation and claiming, until you cover the minimum again.',
      pt: 'As recompensas ficam bloqueadas: você para de minerar e não pode reclamar. Não é um bloqueio da conta inteira nem lhe tira nada do que já tem — o que para é a geração e o resgate, até você voltar a cobrir o mínimo.',
      fr: 'Les récompenses sont bloquées : tu cesses de miner et tu ne peux pas réclamer. Ce n’est pas un blocage du compte entier et cela ne t’enlève rien de ce que tu détiens déjà — ce qui s’arrête, c’est la génération et la réclamation, jusqu’à ce que tu couvres à nouveau le minimum.',
      ru: 'Награды блокируются: майнинг останавливается и запросить выплату нельзя. Это не блокировка всего аккаунта и у тебя ничего не забирают — останавливается начисление и возможность запросить, пока ты снова не покроешь минимум.',
      sv: 'Belöningarna blockeras: du slutar mina och kan inte begära uttag. Det är ingen spärr av hela kontot och inget tas ifrån dig av det du redan har — det som stannar är genereringen och uttaget, tills du täcker minimum igen.',
      hr: 'Nagrade se blokiraju: prestaješ rudariti i ne možeš zatražiti isplatu. To nije blokada cijelog računa niti ti oduzima išta što već imaš — staje generiranje i zahtjev, dok ponovno ne pokriješ minimum.',
      ar: 'تُحجب المكافآت: يتوقف التعدين ولا يمكنك المطالبة. ليس حظرًا للحساب كله ولا يسلبك شيئًا مما تملكه — ما يتوقف هو التوليد والمطالبة، حتى تغطّي الحد الأدنى مجددًا.',
      de: 'Die Belohnungen werden gesperrt: Du schürfst nicht mehr und kannst nicht auszahlen. Es ist keine Sperre des ganzen Kontos und es wird dir nichts weggenommen, was du bereits hast — gestoppt werden Erzeugung und Auszahlung, bis du das Minimum wieder deckst.',
      sr: 'Награде се блокирају: престајеш да рудариш и не можеш да затражиш исплату. То није блокада целог налога нити ти одузима ишта што већ имаш — стаје генерисање и захтев, док поново не покријеш минимум.',
      ur: 'انعامات بند ہو جاتے ہیں: مائننگ رک جاتی ہے اور آپ کلیم نہیں کر سکتے۔ یہ پورے اکاؤنٹ کی بندش نہیں اور جو آپ کے پاس پہلے سے ہے وہ نہیں لیا جاتا — جو رکتا ہے وہ پیداوار اور کلیم ہے، جب تک آپ دوبارہ کم از کم پورا نہ کریں۔',
    },
  '¿Alguien tiene que descongelarme la cuenta?': {
    en: 'Does someone have to unfreeze my account?',
    pt: 'Alguém precisa descongelar minha conta?',
    fr: 'Est-ce que quelqu’un doit dégeler mon compte ?',
    ru: 'Должен ли кто-то разморозить мой аккаунт?',
    sv: 'Måste någon frysa upp mitt konto?',
    hr: 'Mora li mi netko odmrznuti račun?',
    ar: 'هل يجب أن يقوم أحد بإلغاء تجميد حسابي؟',
    de: 'Muss jemand mein Konto entsperren?',
    sr: 'Мора ли неко да ми одмрзне налог?',
    ur: 'کیا کسی کو میرا اکاؤنٹ کھولنا ہوگا؟',
  },
  'No. En cuanto repones AIG en tu wallet hasta alcanzar el mínimo, el protocolo reactiva los beneficios de forma automática: no requiere soporte ni aprobación manual. La propia pantalla te lo dice cuando estás por debajo, indicándote cuánto AIG te falta exactamente.':
    {
      en: 'No. As soon as you top your wallet back up to the minimum, the protocol reactivates the benefits automatically: no support ticket and no manual approval needed. The screen itself tells you when you are below, showing exactly how much AIG you are missing.',
      pt: 'Não. Assim que você repõe AIG na sua carteira até atingir o mínimo, o protocolo reativa os benefícios automaticamente: não requer suporte nem aprovação manual. A própria tela lhe diz quando está abaixo, indicando exatamente quanto AIG falta.',
      fr: 'Non. Dès que tu remets de l’AIG dans ton portefeuille jusqu’au minimum, le protocole réactive les avantages automatiquement : ni support ni validation manuelle. L’écran lui-même te le dit quand tu es en dessous, en indiquant exactement combien d’AIG il te manque.',
      ru: 'Нет. Как только ты пополнишь кошелёк до минимума, протокол включит преимущества автоматически: ни поддержки, ни ручного подтверждения не нужно. Экран сам сообщает, когда ты ниже, и показывает, сколько именно AIG не хватает.',
      sv: 'Nej. Så snart du fyller på AIG i din plånbok upp till minimum återaktiverar protokollet förmånerna automatiskt: varken support eller manuellt godkännande behövs. Skärmen själv säger till när du ligger under och visar exakt hur mycket AIG som saknas.',
      hr: 'Ne. Čim nadopuniš AIG u novčaniku do minimuma, protokol automatski ponovno aktivira pogodnosti: ne treba ni podrška ni ručno odobrenje. Sam zaslon ti kaže kad si ispod i pokazuje točno koliko ti AIG-a nedostaje.',
      ar: 'لا. بمجرد أن تعيد AIG إلى محفظتك حتى بلوغ الحد الأدنى، يعيد البروتوكول تفعيل المزايا تلقائيًا: لا يحتاج دعمًا ولا موافقة يدوية. الشاشة نفسها تخبرك عندما تكون تحته، وتبيّن كم AIG ينقصك بالضبط.',
      de: 'Nein. Sobald du deine Wallet wieder bis zum Minimum auffüllst, aktiviert das Protokoll die Vorteile automatisch: kein Support, keine manuelle Freigabe nötig. Der Bildschirm sagt dir selbst, wenn du darunter bist, und zeigt genau, wie viel AIG dir fehlt.',
      sr: 'Не. Чим допуниш AIG у новчанику до минимума, протокол аутоматски поново активира погодности: не треба ни подршка ни ручно одобрење. Сам екран ти каже кад си испод и показује тачно колико ти AIG-а недостаје.',
      ur: 'نہیں۔ جیسے ہی آپ اپنے والٹ میں AIG کم از کم تک بھر دیتے ہیں، پروٹوکول خودکار طور پر فوائد بحال کر دیتا ہے: نہ سپورٹ چاہیے نہ دستی منظوری۔ اسکرین خود بتاتی ہے کہ آپ نیچے ہیں، اور دکھاتی ہے کہ بالکل کتنا AIG کم ہے۔',
    },
  '¿Desde cuánto puedo reclamar?': {
    en: 'What is the minimum I can claim from?',
    pt: 'A partir de quanto posso resgatar?',
    fr: 'À partir de quel montant puis-je réclamer ?',
    ru: 'С какой суммы можно запросить выплату?',
    sv: 'Från vilket belopp kan jag begära uttag?',
    hr: 'Od kojeg iznosa mogu zatražiti isplatu?',
    ar: 'من أي مبلغ يمكنني المطالبة؟',
    de: 'Ab welchem Betrag kann ich auszahlen?',
    sr: 'Од ког износа могу да затражим исплату?',
    ur: 'میں کتنی رقم سے کلیم کر سکتا ہوں؟',
  },
  'Desde 10 USDT acumulados. Por debajo de esa cifra el reclamo no se puede ejecutar — no es una avería ni una cuenta bloqueada: hay que acumular hasta el mínimo. Es habitual quedarse con un resto pequeño al terminar un ciclo y no poder moverlo.':
    {
      en: 'From 10 USDT accumulated. Below that figure the claim cannot be executed — it is not a fault nor a blocked account: you have to accumulate up to the minimum. It is common to be left with a small remainder at the end of a cycle and not be able to move it.',
      pt: 'A partir de 10 USDT acumulados. Abaixo dessa cifra o resgate não pode ser executado — não é uma falha nem uma conta bloqueada: é preciso acumular até o mínimo. É comum ficar com um resto pequeno ao terminar um ciclo e não poder movê-lo.',
      fr: 'À partir de 10 USDT accumulés. En dessous de ce montant, la réclamation ne peut pas s’exécuter — ce n’est ni une panne ni un compte bloqué : il faut accumuler jusqu’au minimum. Il est fréquent de se retrouver avec un petit reliquat en fin de cycle sans pouvoir le déplacer.',
      ru: 'От 10 USDT накопленных. Ниже этой суммы запрос выполнить нельзя — это не сбой и не блокировка аккаунта: нужно накопить до минимума. Часто в конце цикла остаётся небольшой остаток, который нельзя сдвинуть.',
      sv: 'Från 10 USDT samlade. Under det beloppet går uttaget inte att genomföra — det är varken ett fel eller ett spärrat konto: du måste samla ihop till minimum. Det är vanligt att bli kvar med en liten rest när en cykel tar slut, utan att kunna flytta den.',
      hr: 'Od 10 USDT prikupljenih. Ispod tog iznosa zahtjev se ne može izvršiti — nije kvar ni blokiran račun: treba prikupiti do minimuma. Uobičajeno je ostati s malim ostatkom na kraju ciklusa i ne moći ga pomaknuti.',
      ar: 'ابتداءً من 10 USDT متراكمة. تحت هذا الرقم لا يمكن تنفيذ المطالبة — ليس عطلًا ولا حسابًا محظورًا: عليك التراكم حتى الحد الأدنى. من المعتاد أن يتبقّى مبلغ صغير عند انتهاء الدورة دون إمكانية تحريكه.',
      de: 'Ab 10 USDT angesammelt. Unter diesem Betrag lässt sich die Auszahlung nicht ausführen — es ist weder ein Fehler noch ein gesperrtes Konto: Du musst bis zum Minimum ansammeln. Es kommt häufig vor, dass am Ende eines Zyklus ein kleiner Rest bleibt, der sich nicht bewegen lässt.',
      sr: 'Од 10 USDT прикупљених. Испод тог износа захтев се не може извршити — није квар ни блокиран налог: треба прикупити до минимума. Уобичајено је остати са малим остатком на крају циклуса и не моћи га померити.',
      ur: '10 USDT جمع ہونے سے۔ اُس عدد سے کم پر کلیم نہیں چل سکتا — یہ خرابی یا بند اکاؤنٹ نہیں: کم از کم تک جمع کرنا ہوتا ہے۔ سائیکل کے آخر میں تھوڑی رقم بچ جانا اور اسے نہ ہلا سکنا عام بات ہے۔',
    },
  'Reclamé y no ha llegado nada': {
    en: 'I claimed and nothing has arrived',
    pt: 'Resgatei e não chegou nada',
    fr: 'J’ai réclamé et rien n’est arrivé',
    ru: 'Я запросил выплату, и ничего не пришло',
    sv: 'Jag begärde uttag och inget har kommit',
    hr: 'Zatražio sam isplatu i ništa nije stiglo',
    ar: 'طالبت ولم يصل شيء',
    de: 'Ich habe ausgezahlt und es ist nichts angekommen',
    sr: 'Затражио сам исплату и ништа није стигло',
    ur: 'میں نے کلیم کیا اور کچھ نہیں آیا',
  },
  'Un reclamo puede tardar desde un minuto hasta 72 horas en llegar a tu wallet, según el caso, por procesos de verificación y seguridad. Que no aparezca al momento no significa que haya fallado, y volver a reclamar no lo acelera. Pasadas 72 horas sí es un caso: escribe con el hash, la hora y el importe.':
    {
      en: 'A claim can take from one minute up to 72 hours to reach your wallet, depending on the case, due to verification and security processes. Not appearing immediately does not mean it failed, and claiming again does not speed it up. After 72 hours it is a case: write in with the hash, the time and the amount.',
      pt: 'Um resgate pode levar de um minuto até 72 horas para chegar à sua carteira, conforme o caso, por processos de verificação e segurança. Não aparecer na hora não significa que falhou, e resgatar de novo não acelera. Passadas 72 horas, aí sim é um caso: escreva com o hash, a hora e o valor.',
      fr: 'Une réclamation peut mettre d’une minute à 72 heures pour arriver dans ton portefeuille, selon le cas, en raison des processus de vérification et de sécurité. Qu’elle n’apparaisse pas tout de suite ne veut pas dire qu’elle a échoué, et réclamer à nouveau n’accélère rien. Passé 72 heures, c’est un cas : écris avec le hachage, l’heure et le montant.',
      ru: 'Выплата может идти в кошелёк от минуты до 72 часов, в зависимости от случая, из-за проверок и процедур безопасности. Если её не видно сразу, это не значит, что она не прошла, а повторный запрос ничего не ускорит. После 72 часов — это уже случай: напиши с хешем, временем и суммой.',
      sv: 'Ett uttag kan ta från en minut upp till 72 timmar innan det når din plånbok, beroende på fallet, på grund av verifierings- och säkerhetsprocesser. Att det inte syns direkt betyder inte att det misslyckats, och att begära igen snabbar inte på det. Efter 72 timmar är det ett ärende: skriv med hash, tidpunkt och belopp.',
      hr: 'Isplata može trajati od jedne minute do 72 sata dok stigne u tvoj novčanik, ovisno o slučaju, zbog provjera i sigurnosnih postupaka. To što se ne pojavi odmah ne znači da je propala, a ponovni zahtjev je ne ubrzava. Nakon 72 sata to jest slučaj: javi se s hashom, vremenom i iznosom.',
      ar: 'قد تستغرق المطالبة من دقيقة واحدة إلى 72 ساعة لتصل إلى محفظتك، بحسب الحالة، بسبب إجراءات التحقّق والأمان. عدم ظهورها فورًا لا يعني فشلها، وإعادة المطالبة لا تُسرّعها. بعد 72 ساعة تصبح حالة: راسلنا بالـ hash والوقت والمبلغ.',
      de: 'Eine Auszahlung kann je nach Fall zwischen einer Minute und 72 Stunden brauchen, bis sie in deiner Wallet ankommt — wegen Prüf- und Sicherheitsprozessen. Dass sie nicht sofort erscheint, heißt nicht, dass sie fehlgeschlagen ist, und erneutes Auszahlen beschleunigt nichts. Nach 72 Stunden ist es ein Fall: schreib mit Hash, Uhrzeit und Betrag.',
      sr: 'Исплата може трајати од једног минута до 72 сата док стигне у твој новчаник, зависно од случаја, због провера и безбедносних поступака. То што се не појави одмах не значи да је пропала, а поновни захтев је не убрзава. После 72 сата то јесте случај: јави се са hash-ом, временом и износом.',
      ur: 'کلیم آپ کے والٹ تک پہنچنے میں ایک منٹ سے 72 گھنٹے تک لے سکتا ہے، معاملے کے مطابق، تصدیق اور سیکیورٹی کے مراحل کی وجہ سے۔ فوراً نہ دکھنے کا مطلب ناکامی نہیں، اور دوبارہ کلیم کرنے سے تیز نہیں ہوتا۔ 72 گھنٹے کے بعد یہ واقعی ایک کیس ہے: hash، وقت اور رقم کے ساتھ لکھیں۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · HOLD Y ESTADO DE LA CUENTA (2 de 2)

     Aquí están las tres respuestas que más malentendidos deshacen, y las tres
     dicen algo contraintuitivo. Traducirlas flojo devuelve a la persona al
     malentendido del que venía:

       · El hold NO se calcula sobre lo que tienes, sino sobre lo que MINASTE.
         Sacar monedas no baja el requisito: baja lo que tienes para cubrirlo.
       · Se reclama en USDT y llega AIG. No es un error, es la unidad de medida.
       · «Tengo de sobra» suele ser «lo tengo en otro sitio»: sólo cuenta el AIG
         de la wallet on-chain, no la bóveda interna ni la liquidez del P2P.
     ══════════════════════════════════════════════════════════════════ */
  'Retiré mis AIG y la cuenta se congeló. ¿Por qué no baja lo que me piden?': {
    en: 'I withdrew my AIG and the account froze. Why doesn’t the requirement go down?',
    pt: 'Retirei meus AIG e a conta congelou. Por que o que me pedem não diminui?',
    fr: 'J’ai retiré mes AIG et le compte a gelé. Pourquoi l’exigence ne baisse-t-elle pas ?',
    ru: 'Я вывел свои AIG, и аккаунт заморозился. Почему требование не снижается?',
    sv: 'Jag tog ut mina AIG och kontot frystes. Varför sjunker inte kravet?',
    hr: 'Povukao sam svoje AIG i račun se zamrznuo. Zašto se zahtjev ne smanjuje?',
    ar: 'سحبت AIG وتجمّد الحساب. لماذا لا ينخفض المطلوب مني؟',
    de: 'Ich habe meine AIG abgehoben und das Konto ist eingefroren. Warum sinkt die Anforderung nicht?',
    sr: 'Повукао сам своје AIG и налог се замрзнуо. Зашто се захтев не смањује?',
    ur: 'میں نے اپنے AIG نکالے اور اکاؤنٹ منجمد ہو گیا۔ مطالبہ کم کیوں نہیں ہوتا؟',
  },
  'Porque el hold NO se calcula sobre lo que tienes ahora, sino sobre lo que has minado históricamente. Sacar monedas no reduce el requisito: reduce lo que tienes para cubrirlo, y por eso la cuenta pasa a congelada. La propia pantalla lo enseña con la frase «Históricamente has minado…». Para reactivarla hay que devolver AIG hasta cubrir de nuevo el mínimo.':
    {
      en: 'Because the hold is NOT calculated on what you hold now, but on what you have mined historically. Withdrawing coins does not reduce the requirement: it reduces what you have to cover it with, and that is why the account becomes frozen. The screen itself shows this with the line “Historically you have mined…”. To reactivate it you must put AIG back until you cover the minimum again.',
      pt: 'Porque o hold NÃO é calculado sobre o que você tem agora, e sim sobre o que minerou historicamente. Retirar moedas não reduz o requisito: reduz o que você tem para cobri-lo, e por isso a conta fica congelada. A própria tela mostra isso com a frase «Historicamente você minerou…». Para reativá-la é preciso devolver AIG até cobrir novamente o mínimo.',
      fr: 'Parce que le hold n’est PAS calculé sur ce que tu détiens maintenant, mais sur ce que tu as miné historiquement. Retirer des pièces ne réduit pas l’exigence : cela réduit ce dont tu disposes pour la couvrir, et c’est pourquoi le compte passe en gelé. L’écran lui-même l’indique avec la phrase « Historiquement, tu as miné… ». Pour le réactiver, il faut remettre de l’AIG jusqu’à couvrir de nouveau le minimum.',
      ru: 'Потому что hold считается НЕ от того, сколько у тебя сейчас, а от того, сколько ты добыл за всю историю. Вывод монет не снижает требование: он снижает то, чем ты его покрываешь, — поэтому аккаунт и замораживается. Экран сам показывает это фразой «Исторически вы добыли…». Чтобы включить обратно, нужно вернуть AIG до минимума.',
      sv: 'Eftersom hold INTE räknas på vad du har nu, utan på vad du historiskt har minat. Att ta ut mynt minskar inte kravet: det minskar det du har att täcka med, och därför fryses kontot. Skärmen visar det med raden ”Historiskt har du minat…”. För att återaktivera måste du föra tillbaka AIG tills du täcker minimum igen.',
      hr: 'Zato što se hold NE računa na ono što sada imaš, nego na ono što si povijesno iskopao. Povlačenje novčića ne smanjuje zahtjev: smanjuje ono čime ga pokrivaš, i zato se račun zamrzne. Sam zaslon to pokazuje rečenicom «Povijesno si iskopao…». Za ponovnu aktivaciju treba vratiti AIG dok ponovno ne pokriješ minimum.',
      ar: 'لأن الـ hold لا يُحسب على ما تملكه الآن، بل على ما عدّنته تاريخيًا. سحب العملات لا يخفّض المطلوب: يخفّض ما لديك لتغطيته، ولذلك يتجمّد الحساب. الشاشة نفسها تبيّن ذلك بعبارة «تاريخيًا عدّنت…». لإعادة تفعيله يجب إرجاع AIG حتى تغطية الحد الأدنى مجددًا.',
      de: 'Weil der Hold NICHT auf dem berechnet wird, was du jetzt hast, sondern auf dem, was du historisch geschürft hast. Münzen abzuheben senkt die Anforderung nicht: Es senkt das, womit du sie deckst — deshalb wird das Konto eingefroren. Der Bildschirm zeigt das mit dem Satz „Historisch hast du geschürft…“. Zum Reaktivieren musst du AIG zurückführen, bis das Minimum wieder gedeckt ist.',
      sr: 'Зато што се hold НЕ рачуна на оно што сада имаш, него на оно што си историјски ископао. Повлачење новчића не смањује захтев: смањује оно чиме га покриваш, и зато се налог замрзне. Сам екран то показује реченицом «Историјски си ископао…». За поновну активацију треба вратити AIG док поново не покријеш минимум.',
      ur: 'کیونکہ hold اُس پر نہیں لگتا جو اِس وقت آپ کے پاس ہے، بلکہ اُس پر جو آپ نے تاریخی طور پر مائن کیا۔ سکے نکالنے سے مطالبہ کم نہیں ہوتا: وہ کم ہوتا ہے جس سے آپ اسے پورا کرتے ہیں، اسی لیے اکاؤنٹ منجمد ہو جاتا ہے۔ اسکرین خود یہ «تاریخی طور پر آپ نے مائن کیا…» کے جملے سے دکھاتی ہے۔ دوبارہ چالو کرنے کے لیے AIG واپس ڈالنا ہوگا۔',
    },
  'Tengo AIG de sobra pero sigo por debajo del mínimo': {
    en: 'I have plenty of AIG but I am still below the minimum',
    pt: 'Tenho AIG de sobra mas continuo abaixo do mínimo',
    fr: 'J’ai largement assez d’AIG mais je suis toujours sous le minimum',
    ru: 'У меня AIG с запасом, но я всё равно ниже минимума',
    sv: 'Jag har gott om AIG men ligger ändå under minimum',
    hr: 'Imam AIG-a napretek, ali i dalje sam ispod minimuma',
    ar: 'لديّ AIG بوفرة لكنني ما زلت تحت الحد الأدنى',
    de: 'Ich habe reichlich AIG, liege aber weiter unter dem Minimum',
    sr: 'Имам AIG-а напретек, али сам и даље испод минимума',
    ur: 'میرے پاس AIG وافر ہے مگر پھر بھی کم از کم سے نیچے ہوں',
  },
  'Mira DÓNDE lo tienes. El mínimo se calcula sobre el AIG que hay en tu wallet on-chain — no cuenta la bóveda interna del protocolo ni la liquidez que tengas publicada en el P2P. Con la bóveda llena y la wallet vacía se sigue estando por debajo.':
    {
      en: 'Look at WHERE you are holding it. The minimum is calculated on the AIG in your on-chain wallet — the protocol’s internal vault does not count, nor does liquidity you have published on the P2P. With a full vault and an empty wallet you are still below.',
      pt: 'Veja ONDE você o tem. O mínimo é calculado sobre o AIG que está na sua carteira on-chain — não conta o cofre interno do protocolo nem a liquidez publicada no P2P. Com o cofre cheio e a carteira vazia, você continua abaixo.',
      fr: 'Regarde OÙ tu le détiens. Le minimum se calcule sur l’AIG présent dans ton portefeuille on-chain — le coffre interne du protocole ne compte pas, ni la liquidité publiée sur le P2P. Avec un coffre plein et un portefeuille vide, tu restes en dessous.',
      ru: 'Посмотри, ГДЕ он у тебя. Минимум считается по AIG в твоём on-chain кошельке — внутреннее хранилище протокола не считается, как и ликвидность, выставленная в P2P. С полным хранилищем и пустым кошельком ты по-прежнему ниже.',
      sv: 'Kolla VAR du har den. Minimum räknas på den AIG som finns i din on-chain-plånbok — protokollets interna valv räknas inte, och inte heller likviditet du lagt ut på P2P. Med fullt valv och tom plånbok ligger du fortfarande under.',
      hr: 'Pogledaj GDJE ga držiš. Minimum se računa na AIG koji je u tvom on-chain novčaniku — interni trezor protokola se ne broji, ni likvidnost objavljena na P2P-u. S punim trezorom i praznim novčanikom i dalje si ispod.',
      ar: 'انظر أين تحتفظ به. يُحسب الحد الأدنى على AIG الموجود في محفظتك على السلسلة — الخزنة الداخلية للبروتوكول لا تُحتسب، ولا السيولة المنشورة في P2P. مع خزنة ممتلئة ومحفظة فارغة تبقى تحت الحد.',
      de: 'Schau, WO du sie hältst. Das Minimum wird auf die AIG in deiner On-Chain-Wallet berechnet — der interne Tresor des Protokolls zählt nicht, ebenso wenig Liquidität, die du im P2P eingestellt hast. Mit vollem Tresor und leerer Wallet bleibst du darunter.',
      sr: 'Погледај ГДЕ га држиш. Минимум се рачуна на AIG који је у твом on-chain новчанику — интерни трезор протокола се не броји, ни ликвидност објављена на P2P-у. Са пуним трезором и празним новчаником и даље си испод.',
      ur: 'دیکھیں کہ وہ کہاں ہے۔ کم از کم آپ کے on-chain والٹ میں موجود AIG پر لگتا ہے — پروٹوکول کا اندرونی والٹ شمار نہیں ہوتا، اور نہ P2P پر شائع کردہ لیکویڈیٹی۔ بھرے والٹ اور خالی wallet کے ساتھ آپ اب بھی نیچے ہیں۔',
    },
  'Reclamé y me llegó AIG, no USDT': {
    en: 'I claimed and received AIG, not USDT',
    pt: 'Resgatei e me chegou AIG, não USDT',
    fr: 'J’ai réclamé et j’ai reçu de l’AIG, pas de l’USDT',
    ru: 'Я запросил выплату и получил AIG, а не USDT',
    sv: 'Jag begärde uttag och fick AIG, inte USDT',
    hr: 'Zatražio sam isplatu i stigao mi je AIG, ne USDT',
    ar: 'طالبت ووصلني AIG وليس USDT',
    de: 'Ich habe ausgezahlt und AIG erhalten, nicht USDT',
    sr: 'Затражио сам исплату и стигао ми је AIG, не USDT',
    ur: 'میں نے کلیم کیا اور مجھے AIG ملا، USDT نہیں',
  },
  'Es lo correcto. El protocolo lleva la cuenta de las recompensas en USDT porque es una unidad cómoda de medir, pero lo que se genera y se libera es AIG. Al reclamar, ese saldo contabilizado se convierte en AIG. Todas las pantallas lo advierten: los valores en USDT son estimaciones, no una promesa de valor.':
    {
      en: 'That is correct. The protocol accounts for rewards in USDT because it is a convenient unit of measure, but what is generated and released is AIG. When you claim, that accounted balance is converted into AIG. Every screen warns of this: USDT values are estimates, not a promise of value.',
      pt: 'É o correto. O protocolo contabiliza as recompensas em USDT porque é uma unidade cômoda de medir, mas o que se gera e se libera é AIG. Ao resgatar, esse saldo contabilizado se converte em AIG. Todas as telas advertem: os valores em USDT são estimativas, não uma promessa de valor.',
      fr: 'C’est normal. Le protocole comptabilise les récompenses en USDT parce que c’est une unité de mesure pratique, mais ce qui est généré et libéré, c’est de l’AIG. À la réclamation, ce solde comptabilisé se convertit en AIG. Tous les écrans le signalent : les valeurs en USDT sont des estimations, pas une promesse de valeur.',
      ru: 'Так и должно быть. Протокол ведёт учёт наград в USDT, потому что это удобная единица измерения, но генерируется и выдаётся AIG. При запросе выплаты этот учтённый баланс конвертируется в AIG. Все экраны об этом предупреждают: значения в USDT — оценка, а не обещание стоимости.',
      sv: 'Det är korrekt. Protokollet bokför belöningarna i USDT för att det är en bekväm måttenhet, men det som genereras och frigörs är AIG. Vid uttag omvandlas det bokförda saldot till AIG. Alla skärmar varnar för detta: USDT-värdena är uppskattningar, inte ett löfte om värde.',
      hr: 'To je ispravno. Protokol vodi nagrade u USDT-u jer je to zgodna mjerna jedinica, ali ono što se stvara i oslobađa jest AIG. Pri zahtjevu se taj evidentirani saldo pretvara u AIG. Svi zasloni na to upozoravaju: vrijednosti u USDT-u su procjene, a ne obećanje vrijednosti.',
      ar: 'هذا هو الصحيح. يحتسب البروتوكول المكافآت بالـ USDT لأنها وحدة قياس مريحة، لكن ما يُولَّد ويُحرَّر هو AIG. عند المطالبة يتحوّل ذلك الرصيد المحتسب إلى AIG. جميع الشاشات تنبّه إلى ذلك: قيم الـ USDT تقديرات، وليست وعدًا بقيمة.',
      de: 'Das ist richtig so. Das Protokoll verbucht die Belohnungen in USDT, weil das eine bequeme Maßeinheit ist, erzeugt und freigegeben wird aber AIG. Bei der Auszahlung wird dieser verbuchte Saldo in AIG umgewandelt. Alle Bildschirme weisen darauf hin: USDT-Werte sind Schätzungen, kein Wertversprechen.',
      sr: 'То је исправно. Протокол води награде у USDT-у јер је то згодна мерна јединица, али оно што се ствара и ослобађа јесте AIG. При захтеву се тај евидентирани салдо претвара у AIG. Сви екрани на то упозоравају: вредности у USDT-у су процене, а не обећање вредности.',
      ur: 'یہی درست ہے۔ پروٹوکول انعامات کا حساب USDT میں رکھتا ہے کیونکہ یہ ماپنے کی آسان اکائی ہے، مگر جو بنتا اور جاری ہوتا ہے وہ AIG ہے۔ کلیم پر وہ حساب شدہ بیلنس AIG میں بدل جاتا ہے۔ ہر اسکرین خبردار کرتی ہے: USDT کی قیمتیں تخمینہ ہیں، قیمت کا وعدہ نہیں۔',
    },
  '¿Dónde está mi dinero? No cuadran mis saldos': {
    en: 'Where is my money? My balances do not add up',
    pt: 'Onde está meu dinheiro? Meus saldos não batem',
    fr: 'Où est mon argent ? Mes soldes ne correspondent pas',
    ru: 'Где мои деньги? Балансы не сходятся',
    sv: 'Var är mina pengar? Mina saldon stämmer inte',
    hr: 'Gdje je moj novac? Stanja mi se ne slažu',
    ar: 'أين أموالي؟ أرصدتي لا تتطابق',
    de: 'Wo ist mein Geld? Meine Salden stimmen nicht',
    sr: 'Где је мој новац? Стања ми се не слажу',
    ur: 'میرا پیسہ کہاں ہے؟ میرے بیلنس نہیں ملتے',
  },
  'Tu dinero puede estar en cuatro sitios distintos, y confundirlos es la causa más común de «no cuadra»: 1) tu wallet on-chain (lo que controlas con MetaMask); 2) el crédito interno del sistema; 3) la Liquidez Marketplace (lo que publicaste en el P2P y aún no retiraste); y 4) el saldo de recompensas por reclamar. Cada uno se ve por separado en tu panel. Si publicaste liquidez, ese saldo deja de estar en la wallet hasta que lo retires — no desapareció, cambió de sitio.':
    {
      en: 'Your money can be in four different places, and mixing them up is the most common cause of “it does not add up”: 1) your on-chain wallet (what you control with MetaMask); 2) the system’s internal credit; 3) Marketplace Liquidity (what you published on the P2P and have not withdrawn yet); and 4) the rewards balance pending claim. Each one is shown separately in your dashboard. If you published liquidity, that balance leaves the wallet until you withdraw it — it did not vanish, it moved.',
      pt: 'Seu dinheiro pode estar em quatro lugares diferentes, e confundi-los é a causa mais comum de «não bate»: 1) sua carteira on-chain (o que você controla com a MetaMask); 2) o crédito interno do sistema; 3) a Liquidez Marketplace (o que você publicou no P2P e ainda não retirou); e 4) o saldo de recompensas a resgatar. Cada um aparece separado no seu painel. Se você publicou liquidez, esse saldo deixa de estar na carteira até você retirá-lo — não sumiu, mudou de lugar.',
      fr: 'Ton argent peut se trouver à quatre endroits différents, et les confondre est la cause la plus fréquente du « ça ne correspond pas » : 1) ton portefeuille on-chain (ce que tu contrôles avec MetaMask) ; 2) le crédit interne du système ; 3) la Liquidité Marketplace (ce que tu as publié sur le P2P et pas encore retiré) ; et 4) le solde de récompenses à réclamer. Chacun s’affiche séparément dans ton tableau de bord. Si tu as publié de la liquidité, ce solde quitte le portefeuille jusqu’à ce que tu le retires — il n’a pas disparu, il a changé de place.',
      ru: 'Твои деньги могут быть в четырёх разных местах, и путаница между ними — самая частая причина «не сходится»: 1) твой on-chain кошелёк (то, чем ты управляешь через MetaMask); 2) внутренний кредит системы; 3) Ликвидность маркетплейса (то, что ты выставил в P2P и ещё не забрал); и 4) баланс наград к получению. Каждое видно в панели отдельно. Если ты выставил ликвидность, этот баланс уходит из кошелька, пока ты его не заберёшь — он не исчез, он сменил место.',
      sv: 'Dina pengar kan finnas på fyra olika ställen, och att blanda ihop dem är den vanligaste orsaken till att ”det inte stämmer”: 1) din on-chain-plånbok (det du styr med MetaMask); 2) systemets interna kredit; 3) Marketplace-likviditet (det du lagt ut på P2P och ännu inte tagit ut); och 4) belöningssaldot som väntar på uttag. Var och en visas separat i panelen. Har du lagt ut likviditet lämnar det saldot plånboken tills du tar ut det — det försvann inte, det bytte plats.',
      hr: 'Tvoj novac može biti na četiri različita mjesta, a njihovo miješanje najčešći je uzrok «ne slaže se»: 1) tvoj on-chain novčanik (ono čime upravljaš MetaMaskom); 2) interni kredit sustava; 3) Likvidnost tržnice (ono što si objavio na P2P-u i još nisi povukao); i 4) stanje nagrada za preuzimanje. Svako se zasebno vidi na ploči. Ako si objavio likvidnost, to stanje izlazi iz novčanika dok ga ne povučeš — nije nestalo, promijenilo je mjesto.',
      ar: 'قد تكون أموالك في أربعة أماكن مختلفة، والخلط بينها هو أشيع سبب لـ«لا يتطابق»: ١) محفظتك على السلسلة (ما تتحكم به عبر MetaMask)؛ ٢) الرصيد الداخلي للنظام؛ ٣) سيولة السوق (ما نشرته في P2P ولم تسحبه بعد)؛ ٤) رصيد المكافآت المنتظر المطالبة. كلٌّ منها يظهر منفصلًا في لوحتك. إذا نشرت سيولة، فذلك الرصيد يغادر المحفظة حتى تسحبه — لم يختفِ، بل غيّر مكانه.',
      de: 'Dein Geld kann an vier verschiedenen Orten liegen, und sie zu verwechseln ist die häufigste Ursache für „es stimmt nicht“: 1) deine On-Chain-Wallet (was du mit MetaMask steuerst); 2) das interne Guthaben des Systems; 3) die Marketplace-Liquidität (was du im P2P eingestellt und noch nicht abgezogen hast); und 4) der Belohnungssaldo zur Auszahlung. Jeder wird im Panel getrennt angezeigt. Hast du Liquidität eingestellt, verlässt dieser Saldo die Wallet, bis du ihn abziehst — er ist nicht verschwunden, er hat den Ort gewechselt.',
      sr: 'Твој новац може бити на четири различита места, а њихово мешање најчешћи је узрок «не слаже се»: 1) твој on-chain новчаник (оно чиме управљаш преко MetaMask-а); 2) интерни кредит система; 3) Ликвидност маркетплејса (оно што си објавио на P2P-у и још ниси повукао); и 4) стање награда за преузимање. Свако се засебно види на табли. Ако си објавио ликвидност, то стање излази из новчаника док га не повучеш — није нестало, променило је место.',
      ur: 'آپ کا پیسہ چار مختلف جگہوں پر ہو سکتا ہے، اور انہیں گڈمڈ کرنا «نہیں ملتا» کی سب سے عام وجہ ہے: ۱) آپ کا on-chain والٹ (جو آپ MetaMask سے چلاتے ہیں)؛ ۲) نظام کا اندرونی کریڈٹ؛ ۳) مارکیٹ پلیس لیکویڈیٹی (جو آپ نے P2P پر رکھی اور ابھی نکالی نہیں)؛ اور ۴) کلیم کے منتظر انعامات کا بیلنس۔ ہر ایک پینل میں الگ دکھتا ہے۔ اگر آپ نے لیکویڈیٹی رکھی تو وہ بیلنس والٹ سے نکل جاتا ہے جب تک آپ اسے واپس نہ لیں — یہ غائب نہیں ہوا، جگہ بدل گئی۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · P2P (1 de 2)

     Camino de dinero real: aquí alguien firma con MetaMask y mueve fondos. Dos
     cosas se cuidaron por encima del resto:

       · «NUNCA REPITAS EL DEPÓSITO» es la línea que evita perder dinero dos
         veces. Traducida como una sugerencia deja de servir; va como lo que es,
         una instrucción.
       · Los 23,50 USD del valor interno del AIG se copian tal cual, y con su
         contexto entero: NO es un precio de mercado y AIG no cotiza en ningún
         exchange público. Recortar esa segunda mitad convertiría un dato en una
         promesa.
     ══════════════════════════════════════════════════════════════════ */
  '¿Cómo funciona el P2P?': {
    en: 'How does the P2P work?', pt: 'Como funciona o P2P?',
    fr: 'Comment fonctionne le P2P ?', ru: 'Как работает P2P?',
    sv: 'Hur fungerar P2P?', hr: 'Kako funkcionira P2P?',
    ar: 'كيف يعمل الـ P2P؟', de: 'Wie funktioniert das P2P?',
    sr: 'Како функционише P2P?', ur: 'P2P کیسے کام کرتا ہے؟',
  },
  'Es un tablón de comerciantes: cada fila es alguien que ya depositó liquidez, con su país, su rango de operación y cuántas transacciones lleva hechas. Filtras por país, moneda e importe, eliges la fila que te encaje y pulsas «Tomar». La operación se firma con MetaMask.':
    {
      en: 'It is a board of merchants: each row is someone who has already deposited liquidity, with their country, their operating range and how many transactions they have completed. You filter by country, currency and amount, pick the row that suits you and press “Take”. The operation is signed with MetaMask.',
      pt: 'É um mural de comerciantes: cada linha é alguém que já depositou liquidez, com seu país, sua faixa de operação e quantas transações já fez. Você filtra por país, moeda e valor, escolhe a linha que lhe encaixa e clica em «Tomar». A operação é assinada com a MetaMask.',
      fr: 'C’est un tableau de commerçants : chaque ligne est quelqu’un qui a déjà déposé de la liquidité, avec son pays, sa fourchette d’opération et le nombre de transactions réalisées. Tu filtres par pays, devise et montant, tu choisis la ligne qui te convient et tu appuies sur « Prendre ». L’opération se signe avec MetaMask.',
      ru: 'Это доска торговцев: каждая строка — тот, кто уже внёс ликвидность, с его страной, диапазоном операций и количеством совершённых сделок. Ты фильтруешь по стране, валюте и сумме, выбираешь подходящую строку и жмёшь «Взять». Операция подписывается через MetaMask.',
      sv: 'Det är en anslagstavla med handlare: varje rad är någon som redan lagt in likviditet, med land, handelsintervall och antal genomförda transaktioner. Du filtrerar på land, valuta och belopp, väljer den rad som passar och trycker ”Ta”. Transaktionen signeras med MetaMask.',
      hr: 'To je ploča trgovaca: svaki redak je netko tko je već položio likvidnost, sa svojom zemljom, rasponom poslovanja i brojem obavljenih transakcija. Filtriraš po zemlji, valuti i iznosu, odabereš redak koji ti odgovara i pritisneš «Uzmi». Transakcija se potpisuje MetaMaskom.',
      ar: 'إنها لوحة تجّار: كل صف هو شخص أودع سيولة بالفعل، مع بلده ونطاق تعاملاته وعدد المعاملات التي أنجزها. تُرشّح حسب البلد والعملة والمبلغ، تختار الصف المناسب وتضغط «أخذ». تُوقَّع العملية عبر MetaMask.',
      de: 'Es ist ein Brett von Händlern: Jede Zeile ist jemand, der bereits Liquidität hinterlegt hat — mit Land, Handelsspanne und Anzahl abgeschlossener Transaktionen. Du filterst nach Land, Währung und Betrag, wählst die passende Zeile und drückst „Nehmen“. Der Vorgang wird mit MetaMask signiert.',
      sr: 'То је табла трговаца: сваки ред је неко ко је већ положио ликвидност, са својом земљом, распоном пословања и бројем обављених трансакција. Филтрираш по земљи, валути и износу, одабереш ред који ти одговара и притиснеш «Узми». Трансакција се потписује MetaMask-ом.',
      ur: 'یہ تاجروں کا بورڈ ہے: ہر قطار کوئی ایسا شخص ہے جس نے پہلے ہی لیکویڈیٹی جمع کی، اُس کے ملک، کاروبار کی حد اور کی گئی ٹرانزیکشنز کی تعداد کے ساتھ۔ آپ ملک، کرنسی اور رقم سے چھانتے ہیں، مناسب قطار چنتے ہیں اور «لیں» دباتے ہیں۔ عمل MetaMask سے دستخط ہوتا ہے۔',
    },
  '¿Cuánto vale un AIG?': {
    en: 'How much is one AIG worth?', pt: 'Quanto vale um AIG?',
    fr: 'Combien vaut un AIG ?', ru: 'Сколько стоит один AIG?',
    sv: 'Vad är en AIG värd?', hr: 'Koliko vrijedi jedan AIG?',
    ar: 'كم يساوي AIG واحد؟', de: 'Wie viel ist ein AIG wert?',
    sr: 'Колико вреди један AIG?', ur: 'ایک AIG کی قیمت کیا ہے؟',
  },
  'AIG tiene un valor interno de referencia dentro del sistema — hoy 23,50 USD — que es el que usan el protocolo y la comunidad para operar entre sí. No es un precio de mercado abierto: AIG no cotiza en ningún exchange público, así que nadie puede prometerte que ese valor se sostenga fuera del ecosistema. En el P2P, cada comerciante publica su oferta alrededor de esa referencia.':
    {
      en: 'AIG has an internal reference value inside the system — currently 23.50 USD — which is what the protocol and the community use to operate among themselves. It is not an open-market price: AIG is not listed on any public exchange, so nobody can promise you that this value holds outside the ecosystem. On the P2P, each merchant publishes their offer around that reference.',
      pt: 'O AIG tem um valor interno de referência dentro do sistema — hoje 23,50 USD — que é o usado pelo protocolo e pela comunidade para operar entre si. Não é um preço de mercado aberto: o AIG não é negociado em nenhuma exchange pública, então ninguém pode lhe prometer que esse valor se sustente fora do ecossistema. No P2P, cada comerciante publica sua oferta em torno dessa referência.',
      fr: 'L’AIG a une valeur de référence interne au système — aujourd’hui 23,50 USD — utilisée par le protocole et la communauté pour opérer entre eux. Ce n’est pas un prix de marché ouvert : l’AIG n’est coté sur aucune plateforme publique, donc personne ne peut te promettre que cette valeur tienne en dehors de l’écosystème. Sur le P2P, chaque commerçant publie son offre autour de cette référence.',
      ru: 'У AIG есть внутренняя справочная стоимость в системе — сегодня 23,50 USD — которую протокол и сообщество используют для операций между собой. Это не цена открытого рынка: AIG не торгуется ни на одной публичной бирже, поэтому никто не может обещать, что эта стоимость сохранится за пределами экосистемы. В P2P каждый торговец публикует своё предложение вокруг этого ориентира.',
      sv: 'AIG har ett internt referensvärde i systemet — i dag 23,50 USD — som protokollet och gemenskapen använder sinsemellan. Det är inget öppet marknadspris: AIG är inte noterad på någon publik börs, så ingen kan lova dig att värdet håller utanför ekosystemet. På P2P publicerar varje handlare sitt erbjudande kring den referensen.',
      hr: 'AIG ima internu referentnu vrijednost unutar sustava — danas 23,50 USD — koju protokol i zajednica koriste za međusobno poslovanje. To nije cijena otvorenog tržišta: AIG nije uvršten ni na jednoj javnoj burzi, pa ti nitko ne može obećati da će se ta vrijednost održati izvan ekosustava. Na P2P-u svaki trgovac objavljuje svoju ponudu oko te reference.',
      ar: 'لـ AIG قيمة مرجعية داخلية ضمن النظام — اليوم 23.50 دولارًا — يستخدمها البروتوكول والمجتمع للتعامل فيما بينهم. ليست سعر سوق مفتوح: AIG غير مُدرج في أي منصة عامة، لذا لا يستطيع أحد أن يعدك بأن تصمد هذه القيمة خارج النظام البيئي. في الـ P2P ينشر كل تاجر عرضه حول تلك المرجعية.',
      de: 'AIG hat einen internen Referenzwert im System — heute 23,50 USD —, den Protokoll und Community nutzen, um untereinander zu handeln. Es ist kein offener Marktpreis: AIG ist an keiner öffentlichen Börse gelistet, also kann dir niemand versprechen, dass dieser Wert außerhalb des Ökosystems hält. Im P2P veröffentlicht jeder Händler sein Angebot rund um diese Referenz.',
      sr: 'AIG има интерну референтну вредност унутар система — данас 23,50 USD — коју протокол и заједница користе за међусобно пословање. То није цена отвореног тржишта: AIG није уврштен ни на једној јавној берзи, па ти нико не може обећати да ће се та вредност одржати изван екосистема. На P2P-у сваки трговац објављује своју понуду око те референце.',
      ur: 'AIG کی نظام کے اندر ایک اندرونی حوالہ قیمت ہے — آج 23.50 USD — جسے پروٹوکول اور کمیونٹی آپس میں لین دین کے لیے استعمال کرتے ہیں۔ یہ کھلی منڈی کی قیمت نہیں: AIG کسی عوامی ایکسچینج پر درج نہیں، اس لیے کوئی آپ سے وعدہ نہیں کر سکتا کہ یہ قیمت ایکو سسٹم سے باہر قائم رہے گی۔ P2P پر ہر تاجر اپنی پیشکش اسی حوالے کے گرد شائع کرتا ہے۔',
    },
  '¿Cómo publico liquidez para vender en el P2P?': {
    en: 'How do I publish liquidity to sell on the P2P?',
    pt: 'Como publico liquidez para vender no P2P?',
    fr: 'Comment publier de la liquidité pour vendre sur le P2P ?',
    ru: 'Как выставить ликвидность, чтобы продавать в P2P?',
    sv: 'Hur publicerar jag likviditet för att sälja på P2P?',
    hr: 'Kako objaviti likvidnost za prodaju na P2P-u?',
    ar: 'كيف أنشر سيولة للبيع في الـ P2P؟',
    de: 'Wie stelle ich Liquidität ein, um im P2P zu verkaufen?',
    sr: 'Како да објавим ликвидност за продају на P2P-у?',
    ur: 'P2P پر بیچنے کے لیے لیکویڈیٹی کیسے شائع کروں؟',
  },
  'En P2P → Mi Perfil → Liquidez Marketplace → «Depositar liquidez». Pasos: 1) Necesitas sesión activa, MetaMask en red BSC y saldo real de USDT o AIG (esto mueve dinero de verdad). 2) Elige token (solo USDT o AIG) e importe. 3) «Depositar con MetaMask» y firma. 4) Al confirmarse en cadena verás «Depósito registrado» con el hash. A partir de ahí sales publicado en el libro. Si no se refleja en un rato, repórtalo con el hash — nunca repitas el depósito, movería el dinero otra vez.':
    {
      en: 'Go to P2P → My Profile → Marketplace Liquidity → “Deposit liquidity”. Steps: 1) You need an active session, MetaMask on the BSC network and real USDT or AIG balance (this moves real money). 2) Choose the token (only USDT or AIG) and the amount. 3) “Deposit with MetaMask” and sign. 4) Once confirmed on chain you will see “Deposit registered” with the hash. From then on you appear in the book. If it does not show up after a while, report it with the hash — never repeat the deposit, it would move the money again.',
      pt: 'Em P2P → Meu Perfil → Liquidez Marketplace → «Depositar liquidez». Passos: 1) Você precisa de sessão ativa, MetaMask na rede BSC e saldo real de USDT ou AIG (isto move dinheiro de verdade). 2) Escolha o token (apenas USDT ou AIG) e o valor. 3) «Depositar com MetaMask» e assine. 4) Ao confirmar em cadeia verá «Depósito registrado» com o hash. A partir daí você sai publicado no livro. Se não refletir em algum tempo, reporte com o hash — nunca repita o depósito, moveria o dinheiro outra vez.',
      fr: 'Dans P2P → Mon Profil → Liquidité Marketplace → « Déposer de la liquidité ». Étapes : 1) Il te faut une session active, MetaMask sur le réseau BSC et un solde réel d’USDT ou d’AIG (cela déplace de l’argent réel). 2) Choisis le jeton (uniquement USDT ou AIG) et le montant. 3) « Déposer avec MetaMask » et signe. 4) Une fois confirmé en chaîne, tu verras « Dépôt enregistré » avec le hachage. À partir de là, tu es publié dans le carnet. Si rien ne s’affiche au bout d’un moment, signale-le avec le hachage — ne répète jamais le dépôt, cela déplacerait l’argent une seconde fois.',
      ru: 'P2P → Мой профиль → Ликвидность маркетплейса → «Внести ликвидность». Шаги: 1) Нужна активная сессия, MetaMask в сети BSC и реальный баланс USDT или AIG (это двигает настоящие деньги). 2) Выбери токен (только USDT или AIG) и сумму. 3) «Внести через MetaMask» и подпиши. 4) После подтверждения в сети увидишь «Депозит зарегистрирован» с хешем. С этого момента ты в книге заявок. Если через время ничего не появилось, сообщи с хешем — никогда не повторяй депозит, деньги уйдут второй раз.',
      sv: 'Gå till P2P → Min Profil → Marketplace-likviditet → ”Sätt in likviditet”. Steg: 1) Du behöver aktiv session, MetaMask på BSC-nätet och verkligt saldo i USDT eller AIG (detta flyttar riktiga pengar). 2) Välj token (endast USDT eller AIG) och belopp. 3) ”Sätt in med MetaMask” och signera. 4) När det bekräftats på kedjan ser du ”Insättning registrerad” med hashen. Därefter syns du i orderboken. Syns inget efter en stund, rapportera med hashen — upprepa aldrig insättningen, det skulle flytta pengarna igen.',
      hr: 'U P2P → Moj profil → Likvidnost tržnice → «Položi likvidnost». Koraci: 1) Trebaš aktivnu sesiju, MetaMask na BSC mreži i stvarno stanje USDT-a ili AIG-a (ovo pomiče pravi novac). 2) Odaberi token (samo USDT ili AIG) i iznos. 3) «Položi s MetaMaskom» i potpiši. 4) Kad se potvrdi na lancu vidjet ćeš «Polog zabilježen» s hashom. Od tada si objavljen u knjizi. Ako se ne prikaže nakon nekog vremena, prijavi s hashom — nikad ne ponavljaj polog, novac bi otišao ponovno.',
      ar: 'من P2P ← ملفي ← سيولة السوق ← «إيداع سيولة». الخطوات: ١) تحتاج جلسة نشطة، و MetaMask على شبكة BSC، ورصيدًا حقيقيًا من USDT أو AIG (هذا يحرّك مالًا حقيقيًا). ٢) اختر الرمز (USDT أو AIG فقط) والمبلغ. ٣) «إيداع عبر MetaMask» ووقّع. ٤) عند التأكيد على السلسلة سترى «تم تسجيل الإيداع» مع الـ hash. من حينها تظهر في السجل. إذا لم ينعكس بعد فترة، أبلغ مع الـ hash — لا تكرّر الإيداع أبدًا، فذلك يحرّك المال مرة أخرى.',
      de: 'Unter P2P → Mein Profil → Marketplace-Liquidität → „Liquidität einzahlen“. Schritte: 1) Du brauchst eine aktive Sitzung, MetaMask im BSC-Netz und echtes USDT- oder AIG-Guthaben (das bewegt echtes Geld). 2) Wähle den Token (nur USDT oder AIG) und den Betrag. 3) „Mit MetaMask einzahlen“ und signieren. 4) Nach der Bestätigung on chain siehst du „Einzahlung registriert“ mit dem Hash. Ab da erscheinst du im Orderbuch. Zeigt sich nach einer Weile nichts, melde es mit dem Hash — wiederhole die Einzahlung niemals, das würde das Geld erneut bewegen.',
      sr: 'У P2P → Мој профил → Ликвидност маркетплејса → «Положи ликвидност». Кораци: 1) Треба ти активна сесија, MetaMask на BSC мрежи и стварно стање USDT-а или AIG-а (ово помера прави новац). 2) Одабери токен (само USDT или AIG) и износ. 3) «Положи са MetaMask-ом» и потпиши. 4) Кад се потврди на ланцу видећеш «Полог забележен» са hash-ом. Од тада си објављен у књизи. Ако се не прикаже након неког времена, пријави са hash-ом — никад не понављај полог, новац би отишао поново.',
      ur: 'P2P ← میرا پروفائل ← مارکیٹ پلیس لیکویڈیٹی ← «لیکویڈیٹی جمع کریں»۔ مراحل: ۱) فعال سیشن، BSC نیٹ ورک پر MetaMask اور USDT یا AIG کا حقیقی بیلنس چاہیے (یہ اصل پیسہ ہلاتا ہے)۔ ۲) ٹوکن (صرف USDT یا AIG) اور رقم چنیں۔ ۳) «MetaMask سے جمع کریں» اور دستخط کریں۔ ۴) چین پر تصدیق ہونے پر «ڈپازٹ درج ہوا» hash کے ساتھ نظر آئے گا۔ اس کے بعد آپ بُک میں شائع ہو جاتے ہیں۔ اگر کچھ دیر بعد ظاہر نہ ہو تو hash کے ساتھ اطلاع دیں — ڈپازٹ کبھی نہ دہرائیں، پیسہ دوبارہ نکل جائے گا۔',
    },
  '¿Cómo retiro mi liquidez del P2P? Retiré y no veo la wallet': {
    en: 'How do I withdraw my P2P liquidity? I withdrew and the wallet did not open',
    pt: 'Como retiro minha liquidez do P2P? Retirei e não vejo a carteira',
    fr: 'Comment retirer ma liquidité du P2P ? J’ai retiré et le portefeuille ne s’ouvre pas',
    ru: 'Как вывести ликвидность из P2P? Я вывел, а кошелёк не открылся',
    sv: 'Hur tar jag ut min P2P-likviditet? Jag tog ut och plånboken öppnades inte',
    hr: 'Kako povući svoju likvidnost s P2P-a? Povukao sam i novčanik se nije otvorio',
    ar: 'كيف أسحب سيولتي من الـ P2P؟ سحبت ولم تظهر المحفظة',
    de: 'Wie hebe ich meine P2P-Liquidität ab? Ich habe abgehoben und die Wallet ging nicht auf',
    sr: 'Како да повучем своју ликвидност са P2P-а? Повукао сам и новчаник се није отворио',
    ur: 'میں اپنی P2P لیکویڈیٹی کیسے نکالوں؟ میں نے نکالی اور والٹ نہیں کھلا',
  },
  'En P2P → Mi Perfil → Liquidez Marketplace → «Retirar». Elige entre tu liquidez en USDT o en AIG, confirma cuál y cuánto, y pulsa «Confirmar retiro». DATO CLAVE: este paso NO abre MetaMask ni pide firma —la propia pantalla lo dice—. Que no aparezca la cartera no significa que no se envió: es una SOLICITUD que PAI procesa después, devolviendo los fondos a tu wallet registrada. Entre la solicitud y la llegada hay una espera que la interfaz no controla. No lo repitas: comprueba el estado antes.':
    {
      en: 'Go to P2P → My Profile → Marketplace Liquidity → “Withdraw”. Choose between your USDT or AIG liquidity, confirm which and how much, and press “Confirm withdrawal”. KEY POINT: this step does NOT open MetaMask and does not ask for a signature — the screen itself says so. The wallet not appearing does not mean it was not sent: it is a REQUEST that PAI processes afterwards, returning the funds to your registered wallet. Between the request and the arrival there is a wait the interface does not control. Do not repeat it: check the status first.',
      pt: 'Em P2P → Meu Perfil → Liquidez Marketplace → «Retirar». Escolha entre sua liquidez em USDT ou em AIG, confirme qual e quanto, e clique em «Confirmar retirada». DADO-CHAVE: este passo NÃO abre a MetaMask nem pede assinatura — a própria tela diz isso. A carteira não aparecer não significa que não foi enviado: é uma SOLICITAÇÃO que a PAI processa depois, devolvendo os fundos à sua carteira registrada. Entre a solicitação e a chegada há uma espera que a interface não controla. Não repita: verifique o estado antes.',
      fr: 'Dans P2P → Mon Profil → Liquidité Marketplace → « Retirer ». Choisis entre ta liquidité en USDT ou en AIG, confirme laquelle et combien, puis appuie sur « Confirmer le retrait ». POINT CLÉ : cette étape n’ouvre PAS MetaMask et ne demande pas de signature — l’écran le dit lui-même. Que le portefeuille n’apparaisse pas ne veut pas dire que ça n’a pas été envoyé : c’est une DEMANDE que PAI traite ensuite, en renvoyant les fonds vers ton portefeuille enregistré. Entre la demande et l’arrivée, il y a une attente que l’interface ne contrôle pas. Ne recommence pas : vérifie d’abord l’état.',
      ru: 'P2P → Мой профиль → Ликвидность маркетплейса → «Вывести». Выбери ликвидность в USDT или в AIG, подтверди что и сколько, и нажми «Подтвердить вывод». ВАЖНО: этот шаг НЕ открывает MetaMask и не просит подписи — экран сам об этом пишет. То, что кошелёк не появился, не значит, что вывод не отправлен: это ЗАЯВКА, которую PAI обрабатывает потом, возвращая средства на твой зарегистрированный кошелёк. Между заявкой и поступлением есть ожидание, которое интерфейс не контролирует. Не повторяй: сначала проверь статус.',
      sv: 'Gå till P2P → Min Profil → Marketplace-likviditet → ”Ta ut”. Välj mellan din likviditet i USDT eller AIG, bekräfta vilken och hur mycket, och tryck ”Bekräfta uttag”. VIKTIGT: det här steget öppnar INTE MetaMask och begär ingen signatur — skärmen säger det själv. Att plånboken inte dyker upp betyder inte att det inte skickades: det är en BEGÄRAN som PAI behandlar efteråt och skickar tillbaka medlen till din registrerade plånbok. Mellan begäran och ankomst finns en väntan som gränssnittet inte styr. Upprepa inte: kolla statusen först.',
      hr: 'U P2P → Moj profil → Likvidnost tržnice → «Povuci». Odaberi između svoje likvidnosti u USDT-u ili AIG-u, potvrdi koju i koliko, pa pritisni «Potvrdi povlačenje». KLJUČNO: ovaj korak NE otvara MetaMask i ne traži potpis — sam zaslon to kaže. To što se novčanik ne pojavi ne znači da nije poslano: to je ZAHTJEV koji PAI obrađuje poslije, vraćajući sredstva na tvoj registrirani novčanik. Između zahtjeva i dolaska postoji čekanje koje sučelje ne kontrolira. Nemoj ponavljati: prvo provjeri status.',
      ar: 'من P2P ← ملفي ← سيولة السوق ← «سحب». اختر بين سيولتك بالـ USDT أو AIG، أكّد أيها وكم، ثم اضغط «تأكيد السحب». نقطة أساسية: هذه الخطوة لا تفتح MetaMask ولا تطلب توقيعًا — الشاشة نفسها تقول ذلك. عدم ظهور المحفظة لا يعني أنه لم يُرسل: إنه طلب تعالجه PAI لاحقًا، مُعيدةً الأموال إلى محفظتك المسجّلة. بين الطلب والوصول انتظار لا تتحكم به الواجهة. لا تكرّره: تحقّق من الحالة أولًا.',
      de: 'Unter P2P → Mein Profil → Marketplace-Liquidität → „Abheben“. Wähle zwischen deiner Liquidität in USDT oder AIG, bestätige welche und wie viel, und drücke „Abhebung bestätigen“. WICHTIG: Dieser Schritt öffnet MetaMask NICHT und verlangt keine Signatur — der Bildschirm sagt es selbst. Dass die Wallet nicht erscheint, heißt nicht, dass nichts gesendet wurde: Es ist ein ANTRAG, den PAI danach bearbeitet und die Mittel an deine registrierte Wallet zurückschickt. Zwischen Antrag und Eingang liegt eine Wartezeit, die die Oberfläche nicht steuert. Wiederhole es nicht: prüfe zuerst den Status.',
      sr: 'У P2P → Мој профил → Ликвидност маркетплејса → «Повуци». Одабери између своје ликвидности у USDT-у или AIG-у, потврди коју и колико, па притисни «Потврди повлачење». КЉУЧНО: овај корак НЕ отвара MetaMask и не тражи потпис — сам екран то каже. То што се новчаник не појави не значи да није послато: то је ЗАХТЕВ који PAI обрађује после, враћајући средства на твој регистровани новчаник. Између захтева и доласка постоји чекање које интерфејс не контролише. Немој понављати: прво провери статус.',
      ur: 'P2P ← میرا پروفائل ← مارکیٹ پلیس لیکویڈیٹی ← «نکالیں»۔ اپنی USDT یا AIG لیکویڈیٹی میں سے چنیں، تصدیق کریں کون سی اور کتنی، پھر «نکالنے کی تصدیق» دبائیں۔ اہم بات: یہ مرحلہ MetaMask نہیں کھولتا اور نہ دستخط مانگتا ہے — اسکرین خود یہ کہتی ہے۔ والٹ کا نہ کھلنا اس کا مطلب نہیں کہ بھیجا نہیں گیا: یہ ایک درخواست ہے جسے PAI بعد میں پروسیس کرتی ہے اور رقم آپ کے رجسٹرڈ والٹ میں واپس بھیجتی ہے۔ درخواست اور آمد کے درمیان انتظار ہے جو انٹرفیس کے قابو میں نہیں۔ دہرائیں نہیں: پہلے حالت دیکھیں۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · P2P (2 de 2)

     La distinción que hay que preservar aquí es entre «lo arreglas tú» y «no
     hay nada que puedas hacer». El P2P las confunde con facilidad: una sesión
     caducada se resuelve saliendo y volviendo a entrar; una caída del servicio
     de libro, no. Traducirlas igual manda a alguien a repetir un gesto inútil
     durante media hora.
     ══════════════════════════════════════════════════════════════════ */
  'El P2P me pide iniciar sesión aunque ya estoy dentro': {
    en: 'The P2P asks me to sign in although I am already logged in',
    pt: 'O P2P me pede para entrar mesmo eu já estando dentro',
    fr: 'Le P2P me demande de me connecter alors que je le suis déjà',
    ru: 'P2P просит войти, хотя я уже внутри',
    sv: 'P2P ber mig logga in fast jag redan är inloggad',
    hr: 'P2P traži prijavu iako sam već unutra',
    ar: 'الـ P2P يطلب مني تسجيل الدخول رغم أنني داخل بالفعل',
    de: 'Das P2P verlangt eine Anmeldung, obwohl ich schon drin bin',
    sr: 'P2P тражи пријаву иако сам већ унутра',
    ur: 'P2P مجھ سے لاگ اِن مانگتا ہے حالانکہ میں پہلے ہی اندر ہوں',
  },
  'Puede pasar: el P2P usa una credencial adicional a la de la aplicación, y si esa caduca aparece «Inicia sesión en Genesis para operar en el P2P.» aunque el resto funcione. Cerrar sesión y volver a entrar la regenera. Si en cambio ves que el servicio de libro no está disponible, eso es una caída del servicio y no hay nada que puedas arreglar desde tu cuenta.':
    {
      en: 'It can happen: the P2P uses a credential additional to the app’s, and if that one expires you see “Sign in to Genesis to trade on the P2P.” even though everything else works. Signing out and back in regenerates it. If instead you see that the order-book service is unavailable, that is a service outage and there is nothing you can fix from your account.',
      pt: 'Pode acontecer: o P2P usa uma credencial adicional à do aplicativo, e se ela expira aparece «Entre na Genesis para operar no P2P.» mesmo que o resto funcione. Sair e entrar de novo a regenera. Se, em vez disso, você vir que o serviço de livro não está disponível, isso é uma queda do serviço e não há nada que você possa consertar pela sua conta.',
      fr: 'Cela peut arriver : le P2P utilise un identifiant supplémentaire à celui de l’application, et s’il expire, tu vois « Connecte-toi à Genesis pour opérer sur le P2P. » même si le reste fonctionne. Se déconnecter puis se reconnecter le régénère. Si en revanche tu vois que le service de carnet est indisponible, c’est une panne du service et il n’y a rien que tu puisses corriger depuis ton compte.',
      ru: 'Так бывает: P2P использует дополнительный к приложению доступ, и если он истёк, появляется «Войдите в Genesis, чтобы торговать в P2P», хотя остальное работает. Выход и повторный вход его обновляет. Если же видишь, что сервис книги заявок недоступен, это сбой сервиса, и со своей стороны исправить нечего.',
      sv: 'Det kan hända: P2P använder en extra inloggning utöver appens, och om den går ut visas ”Logga in på Genesis för att handla på P2P.” trots att allt annat fungerar. Logga ut och in igen så förnyas den. Ser du i stället att orderbokstjänsten inte är tillgänglig är det ett driftavbrott, och det finns inget du kan åtgärda från ditt konto.',
      hr: 'Može se dogoditi: P2P koristi dodatnu vjerodajnicu uz onu aplikacije, i ako ona istekne pojavi se «Prijavi se u Genesis za trgovanje na P2P-u.» iako sve ostalo radi. Odjava i ponovna prijava je obnavlja. Ako pak vidiš da usluga knjige nije dostupna, to je pad usluge i sa svog računa ne možeš ništa popraviti.',
      ar: 'قد يحدث: يستخدم الـ P2P بيانات اعتماد إضافية غير الخاصة بالتطبيق، وإذا انتهت صلاحيتها يظهر «سجّل الدخول إلى Genesis للتداول في P2P.» رغم أن الباقي يعمل. تسجيل الخروج ثم الدخول يجدّدها. أما إن رأيت أن خدمة السجل غير متاحة، فذلك انقطاع في الخدمة ولا يوجد ما يمكنك إصلاحه من حسابك.',
      de: 'Das kann passieren: Das P2P nutzt eine zusätzliche Berechtigung zur App-Anmeldung, und läuft diese ab, erscheint „Melde dich bei Genesis an, um im P2P zu handeln.“, obwohl der Rest funktioniert. Abmelden und wieder anmelden erneuert sie. Siehst du dagegen, dass der Orderbuch-Dienst nicht verfügbar ist, ist das ein Ausfall des Dienstes und von deinem Konto aus gibt es nichts zu reparieren.',
      sr: 'Може се догодити: P2P користи додатну акредитацију уз ону апликације, и ако она истекне појави се «Пријави се у Genesis за трговање на P2P-у.» иако све остало ради. Одјава и поновна пријава је обнавља. Ако пак видиш да услуга књиге није доступна, то је пад услуге и са свог налога не можеш ништа поправити.',
      ur: 'ایسا ہو سکتا ہے: P2P ایپ کے علاوہ ایک اضافی کریڈنشل استعمال کرتا ہے، اور اگر وہ ختم ہو جائے تو «P2P پر لین دین کے لیے Genesis میں لاگ اِن کریں۔» آتا ہے حالانکہ باقی سب چلتا ہے۔ لاگ آؤٹ کر کے دوبارہ لاگ اِن کرنے سے وہ بن جاتا ہے۔ لیکن اگر آپ دیکھیں کہ بُک سروس دستیاب نہیں، تو یہ سروس کی بندش ہے اور آپ اپنے اکاؤنٹ سے کچھ ٹھیک نہیں کر سکتے۔',
    },
  'Quiero vender AIG en el P2P y no me deja publicar': {
    en: 'I want to sell AIG on the P2P and it will not let me publish',
    pt: 'Quero vender AIG no P2P e não me deixa publicar',
    fr: 'Je veux vendre de l’AIG sur le P2P et il ne me laisse pas publier',
    ru: 'Хочу продать AIG в P2P, но публиковать не даёт',
    sv: 'Jag vill sälja AIG på P2P men får inte publicera',
    hr: 'Želim prodati AIG na P2P-u, a ne da mi objaviti',
    ar: 'أريد بيع AIG في الـ P2P ولا يسمح لي بالنشر',
    de: 'Ich will AIG im P2P verkaufen und es lässt mich nicht veröffentlichen',
    sr: 'Желим да продам AIG на P2P-у, а не да ми да објавим',
    ur: 'میں P2P پر AIG بیچنا چاہتا ہوں اور شائع نہیں کرنے دیتا',
  },
  'Para aparecer en el libro hay que ser comerciante, y para eso hay que depositar liquidez antes: Mi Perfil → activar perfil de comerciante → Depositar liquidez con MetaMask en red BEP20, en USDT o en AIG. Cuando el saldo queda acreditado, tu fila aparece en el libro. Para recuperar los fondos, mismo panel: Retirar.':
    {
      en: 'To appear in the book you have to be a merchant, and for that you must deposit liquidity first: My Profile → activate merchant profile → Deposit liquidity with MetaMask on the BEP20 network, in USDT or AIG. Once the balance is credited, your row appears in the book. To get the funds back, same panel: Withdraw.',
      pt: 'Para aparecer no livro é preciso ser comerciante, e para isso é preciso depositar liquidez antes: Meu Perfil → ativar perfil de comerciante → Depositar liquidez com MetaMask na rede BEP20, em USDT ou em AIG. Quando o saldo é creditado, sua linha aparece no livro. Para recuperar os fundos, mesmo painel: Retirar.',
      fr: 'Pour apparaître dans le carnet, il faut être commerçant, et pour cela il faut d’abord déposer de la liquidité : Mon Profil → activer le profil commerçant → Déposer de la liquidité avec MetaMask sur le réseau BEP20, en USDT ou en AIG. Une fois le solde crédité, ta ligne apparaît dans le carnet. Pour récupérer les fonds, même panneau : Retirer.',
      ru: 'Чтобы попасть в книгу заявок, нужно быть торговцем, а для этого сначала внести ликвидность: Мой профиль → включить профиль торговца → Внести ликвидность через MetaMask в сети BEP20, в USDT или AIG. Как только баланс зачислен, твоя строка появляется в книге. Чтобы вернуть средства — та же панель: Вывести.',
      sv: 'För att synas i orderboken måste du vara handlare, och för det måste du först sätta in likviditet: Min Profil → aktivera handlarprofil → Sätt in likviditet med MetaMask på BEP20-nätet, i USDT eller AIG. När saldot är krediterat syns din rad i boken. För att få tillbaka medlen, samma panel: Ta ut.',
      hr: 'Da bi se pojavio u knjizi treba biti trgovac, a za to treba prije položiti likvidnost: Moj profil → aktiviraj profil trgovca → Položi likvidnost s MetaMaskom na BEP20 mreži, u USDT-u ili AIG-u. Kad se stanje pripiše, tvoj redak se pojavi u knjizi. Za povrat sredstava, ista ploča: Povuci.',
      ar: 'لتظهر في السجل يجب أن تكون تاجرًا، ولذلك عليك إيداع سيولة أولًا: ملفي ← تفعيل ملف التاجر ← إيداع سيولة عبر MetaMask على شبكة BEP20، بالـ USDT أو AIG. عندما يُقيَّد الرصيد، يظهر صفّك في السجل. لاسترجاع الأموال، اللوحة نفسها: سحب.',
      de: 'Um im Orderbuch zu erscheinen, musst du Händler sein — und dafür zuerst Liquidität einzahlen: Mein Profil → Händlerprofil aktivieren → Liquidität mit MetaMask im BEP20-Netz einzahlen, in USDT oder AIG. Sobald das Guthaben gutgeschrieben ist, erscheint deine Zeile im Buch. Zum Zurückholen der Mittel dasselbe Panel: Abheben.',
      sr: 'Да би се појавио у књизи треба бити трговац, а за то треба пре тога положити ликвидност: Мој профил → активирај профил трговца → Положи ликвидност са MetaMask-ом на BEP20 мрежи, у USDT-у или AIG-у. Кад се стање припише, твој ред се појави у књизи. За повраћај средстава, иста табла: Повуци.',
      ur: 'بُک میں آنے کے لیے تاجر ہونا ضروری ہے، اور اس کے لیے پہلے لیکویڈیٹی جمع کرنی ہوتی ہے: میرا پروفائل ← تاجر پروفائل فعال کریں ← BEP20 نیٹ ورک پر MetaMask سے USDT یا AIG میں لیکویڈیٹی جمع کریں۔ جب بیلنس درج ہو جائے، آپ کی قطار بُک میں آ جاتی ہے۔ رقم واپس لینے کے لیے وہی پینل: نکالیں۔',
    },
  '¿Quién decide el precio en el P2P?': {
    en: 'Who decides the price on the P2P?', pt: 'Quem decide o preço no P2P?',
    fr: 'Qui décide le prix sur le P2P ?', ru: 'Кто определяет цену в P2P?',
    sv: 'Vem bestämmer priset på P2P?', hr: 'Tko određuje cijenu na P2P-u?',
    ar: 'من يحدّد السعر في الـ P2P؟', de: 'Wer bestimmt den Preis im P2P?',
    sr: 'Ко одређује цену на P2P-у?', ur: 'P2P پر قیمت کون طے کرتا ہے؟',
  },
  'Cada comerciante pone el suyo. La pantalla muestra un precio sugerido y una banda para que las ofertas sean comparables entre sí, y dentro de ese rango cada uno publica lo que quiere. No es una referencia de mercado abierto: es el rango que la propia interfaz propone.':
    {
      en: 'Each merchant sets their own. The screen shows a suggested price and a band so that offers are comparable with each other, and within that range each one publishes what they want. It is not an open-market reference: it is the range the interface itself proposes.',
      pt: 'Cada comerciante põe o seu. A tela mostra um preço sugerido e uma faixa para que as ofertas sejam comparáveis entre si, e dentro desse intervalo cada um publica o que quiser. Não é uma referência de mercado aberto: é a faixa que a própria interface propõe.',
      fr: 'Chaque commerçant fixe le sien. L’écran affiche un prix suggéré et une fourchette pour que les offres soient comparables entre elles, et dans cette plage chacun publie ce qu’il veut. Ce n’est pas une référence de marché ouvert : c’est la plage que l’interface elle-même propose.',
      ru: 'Каждый торговец ставит свою. Экран показывает рекомендуемую цену и диапазон, чтобы предложения можно было сравнивать между собой, и внутри этого диапазона каждый публикует что хочет. Это не ориентир открытого рынка: это диапазон, который предлагает сам интерфейс.',
      sv: 'Varje handlare sätter sitt eget. Skärmen visar ett föreslaget pris och ett intervall så att erbjudandena går att jämföra, och inom det intervallet publicerar var och en vad hen vill. Det är ingen referens från en öppen marknad: det är intervallet som gränssnittet självt föreslår.',
      hr: 'Svaki trgovac postavlja svoju. Zaslon prikazuje predloženu cijenu i raspon kako bi ponude bile usporedive, a unutar tog raspona svatko objavljuje što želi. To nije referenca otvorenog tržišta: to je raspon koji predlaže samo sučelje.',
      ar: 'كل تاجر يضع سعره. تعرض الشاشة سعرًا مقترحًا ونطاقًا كي تكون العروض قابلة للمقارنة، وضمن ذلك النطاق ينشر كل واحد ما يشاء. ليست مرجعية سوق مفتوح: إنه النطاق الذي تقترحه الواجهة نفسها.',
      de: 'Jeder Händler setzt seinen eigenen. Der Bildschirm zeigt einen Vorschlagspreis und ein Band, damit die Angebote untereinander vergleichbar sind, und innerhalb dieser Spanne veröffentlicht jeder, was er will. Es ist keine Referenz eines offenen Marktes: Es ist die Spanne, die die Oberfläche selbst vorschlägt.',
      sr: 'Сваки трговац поставља своју. Екран приказује предложену цену и распон како би понуде биле упоредиве, а унутар тог распона свако објављује шта жели. То није референца отвореног тржишта: то је распон који предлаже само сучеље.',
      ur: 'ہر تاجر اپنی قیمت رکھتا ہے۔ اسکرین ایک تجویز کردہ قیمت اور ایک حد دکھاتی ہے تاکہ پیشکشیں آپس میں موازنے کے قابل ہوں، اور اُس حد کے اندر ہر کوئی جو چاہے شائع کرتا ہے۔ یہ کھلی منڈی کا حوالہ نہیں: یہ وہ حد ہے جو خود انٹرفیس تجویز کرتا ہے۔',
    },
  '¿Cómo sé de quién comprar?': {
    en: 'How do I know who to buy from?', pt: 'Como sei de quem comprar?',
    fr: 'Comment savoir à qui acheter ?', ru: 'Как понять, у кого покупать?',
    sv: 'Hur vet jag av vem jag ska köpa?', hr: 'Kako znam od koga kupiti?',
    ar: 'كيف أعرف ممّن أشتري؟', de: 'Woher weiß ich, bei wem ich kaufe?',
    sr: 'Како да знам од кога да купим?', ur: 'مجھے کیسے پتہ چلے کہ کس سے خریدوں؟',
  },
  'Cada fila muestra el alias del anunciante, su país y cuántas transacciones lleva hechas — ésa es la información con la que se elige. También puedes filtrar por país, por moneda y por importe mínimo y máximo, para ver sólo lo que te encaja.':
    {
      en: 'Each row shows the advertiser’s alias, their country and how many transactions they have completed — that is the information you choose with. You can also filter by country, by currency and by minimum and maximum amount, to see only what suits you.',
      pt: 'Cada linha mostra o apelido do anunciante, seu país e quantas transações já fez — essa é a informação com a qual se escolhe. Você também pode filtrar por país, por moeda e por valor mínimo e máximo, para ver só o que lhe encaixa.',
      fr: 'Chaque ligne affiche l’alias de l’annonceur, son pays et le nombre de transactions réalisées — c’est l’information sur laquelle on choisit. Tu peux aussi filtrer par pays, par devise et par montant minimum et maximum, pour ne voir que ce qui te convient.',
      ru: 'В каждой строке видно псевдоним объявителя, его страну и сколько сделок он совершил — по этому и выбирают. Ещё можно фильтровать по стране, валюте и минимальной и максимальной сумме, чтобы видеть только подходящее.',
      sv: 'Varje rad visar annonsörens alias, land och antal genomförda transaktioner — det är informationen man väljer utifrån. Du kan också filtrera på land, valuta och minsta och största belopp, för att bara se det som passar.',
      hr: 'Svaki redak prikazuje nadimak oglašivača, njegovu zemlju i broj obavljenih transakcija — to je podatak po kojem se bira. Možeš i filtrirati po zemlji, valuti te najmanjem i najvećem iznosu, da vidiš samo ono što ti odgovara.',
      ar: 'يعرض كل صف اسم المعلن المستعار وبلده وعدد المعاملات التي أنجزها — وهذه هي المعلومة التي يُختار على أساسها. يمكنك أيضًا الترشيح حسب البلد والعملة والحد الأدنى والأقصى للمبلغ، لترى ما يناسبك فقط.',
      de: 'Jede Zeile zeigt das Pseudonym des Anbieters, sein Land und wie viele Transaktionen er abgeschlossen hat — danach wählt man aus. Du kannst außerdem nach Land, Währung sowie Mindest- und Höchstbetrag filtern, um nur das zu sehen, was zu dir passt.',
      sr: 'Сваки ред приказује надимак оглашивача, његову земљу и број обављених трансакција — то је податак по коме се бира. Можеш и филтрирати по земљи, валути те најмањем и највећем износу, да видиш само оно што ти одговара.',
      ur: 'ہر قطار مشتہر کا عرف، اُس کا ملک اور کی گئی ٹرانزیکشنز کی تعداد دکھاتی ہے — اسی معلومات پر انتخاب ہوتا ہے۔ آپ ملک، کرنسی اور کم سے کم و زیادہ سے زیادہ رقم سے بھی چھان سکتے ہیں تاکہ صرف اپنے مطابق دیکھیں۔',
    },
  '¿Cómo compro o tomo una oferta en el P2P?': {
    en: 'How do I buy or take an offer on the P2P?',
    pt: 'Como compro ou tomo uma oferta no P2P?',
    fr: 'Comment acheter ou prendre une offre sur le P2P ?',
    ru: 'Как купить или взять предложение в P2P?',
    sv: 'Hur köper eller tar jag ett erbjudande på P2P?',
    hr: 'Kako kupiti ili uzeti ponudu na P2P-u?',
    ar: 'كيف أشتري أو آخذ عرضًا في الـ P2P؟',
    de: 'Wie kaufe oder nehme ich ein Angebot im P2P?',
    sr: 'Како да купим или узмем понуду на P2P-у?',
    ur: 'میں P2P پر کیسے خریدوں یا پیشکش لوں؟',
  },
  'En P2P → Marketplace, pulsa «Tomar» en la fila que te interese. Antes de operar, mira el alias, el país y el número de transacciones del anunciante: es la única señal de confianza que da la pantalla. Necesitas sesión activa y MetaMask con fondos en la red correcta. El paso final es firmar la transferencia; lo que viene después es solo avisar al servidor de que ya pagaste. Si sale «No se pudo resolver el ID del comerciante», recarga el libro P2P — se arregla recargando, no reintentando a ciegas.':
    {
      en: 'Go to P2P → Marketplace and press “Take” on the row you want. Before trading, look at the advertiser’s alias, country and number of transactions: it is the only trust signal the screen gives. You need an active session and MetaMask with funds on the correct network. The final step is signing the transfer; what comes after is just telling the server that you have paid. If “Could not resolve the merchant ID” appears, reload the P2P book — it is fixed by reloading, not by retrying blindly.',
      pt: 'Em P2P → Marketplace, clique em «Tomar» na linha que lhe interessa. Antes de operar, veja o apelido, o país e o número de transações do anunciante: é o único sinal de confiança que a tela oferece. Você precisa de sessão ativa e MetaMask com fundos na rede correta. O passo final é assinar a transferência; o que vem depois é só avisar ao servidor de que você já pagou. Se aparecer «Não foi possível resolver o ID do comerciante», recarregue o livro P2P — resolve-se recarregando, não tentando às cegas.',
      fr: 'Dans P2P → Marketplace, appuie sur « Prendre » sur la ligne qui t’intéresse. Avant d’opérer, regarde l’alias, le pays et le nombre de transactions de l’annonceur : c’est le seul signal de confiance que donne l’écran. Il te faut une session active et MetaMask avec des fonds sur le bon réseau. La dernière étape est de signer le transfert ; ce qui suit consiste seulement à prévenir le serveur que tu as payé. Si « Impossible de résoudre l’ID du commerçant » apparaît, recharge le carnet P2P — cela se corrige en rechargeant, pas en réessayant à l’aveugle.',
      ru: 'P2P → Marketplace, нажми «Взять» на нужной строке. Перед сделкой посмотри псевдоним, страну и число сделок объявителя: это единственный сигнал доверия, который даёт экран. Нужна активная сессия и MetaMask со средствами в правильной сети. Последний шаг — подписать перевод; дальше только уведомление сервера, что ты заплатил. Если появится «Не удалось определить ID торговца», перезагрузи книгу P2P — это лечится перезагрузкой, а не слепыми повторами.',
      sv: 'Gå till P2P → Marketplace och tryck ”Ta” på raden du vill ha. Innan du handlar, titta på annonsörens alias, land och antal transaktioner: det är den enda förtroendesignal skärmen ger. Du behöver aktiv session och MetaMask med medel på rätt nätverk. Sista steget är att signera överföringen; det som kommer sedan är bara att meddela servern att du betalat. Om ”Kunde inte hitta handlarens ID” visas, ladda om P2P-boken — det löses genom omladdning, inte genom blinda omförsök.',
      hr: 'U P2P → Marketplace pritisni «Uzmi» na retku koji te zanima. Prije trgovanja pogledaj nadimak, zemlju i broj transakcija oglašivača: to je jedini signal povjerenja koji zaslon daje. Trebaš aktivnu sesiju i MetaMask sa sredstvima na ispravnoj mreži. Zadnji korak je potpisati prijenos; ono što slijedi samo je obavijest poslužitelju da si platio. Ako se pojavi «Nije bilo moguće razriješiti ID trgovca», ponovno učitaj P2P knjigu — rješava se osvježavanjem, ne slijepim pokušajima.',
      ar: 'من P2P ← Marketplace اضغط «أخذ» على الصف الذي يهمك. قبل التعامل، انظر إلى اسم المعلن المستعار وبلده وعدد معاملاته: هذه هي إشارة الثقة الوحيدة التي تعطيها الشاشة. تحتاج جلسة نشطة و MetaMask برصيد على الشبكة الصحيحة. الخطوة الأخيرة هي توقيع التحويل؛ وما يليها مجرد إبلاغ الخادم بأنك دفعت. إذا ظهر «تعذّر تحديد معرّف التاجر»، أعد تحميل سجل الـ P2P — يُحلّ بإعادة التحميل، لا بإعادة المحاولة عشوائيًا.',
      de: 'Unter P2P → Marketplace drückst du „Nehmen“ in der Zeile, die dich interessiert. Sieh dir vor dem Handeln Pseudonym, Land und Transaktionszahl des Anbieters an: Das ist das einzige Vertrauenssignal, das der Bildschirm liefert. Du brauchst eine aktive Sitzung und MetaMask mit Guthaben im richtigen Netz. Der letzte Schritt ist die Signatur der Überweisung; danach wird dem Server nur mitgeteilt, dass du bezahlt hast. Erscheint „Händler-ID konnte nicht aufgelöst werden“, lade das P2P-Buch neu — das behebt man durch Neuladen, nicht durch blindes Wiederholen.',
      sr: 'У P2P → Marketplace притисни «Узми» на реду који те занима. Пре трговања погледај надимак, земљу и број трансакција оглашивача: то је једини сигнал поверења који екран даје. Треба ти активна сесија и MetaMask са средствима на исправној мрежи. Последњи корак је потписати пренос; оно што следи само је обавештење серверу да си платио. Ако се појави «Није било могуће разрешити ID трговца», поново учитај P2P књигу — решава се освежавањем, не слепим покушајима.',
      ur: 'P2P ← Marketplace میں، جس قطار میں دلچسپی ہو اُس پر «لیں» دبائیں۔ لین دین سے پہلے مشتہر کا عرف، ملک اور ٹرانزیکشنز کی تعداد دیکھیں: اسکرین کا یہی واحد اعتماد کا اشارہ ہے۔ فعال سیشن اور درست نیٹ ورک پر رقم کے ساتھ MetaMask چاہیے۔ آخری مرحلہ ٹرانسفر پر دستخط ہے؛ اس کے بعد صرف سرور کو بتانا ہے کہ آپ نے ادائیگی کر دی۔ اگر «تاجر کی ID حل نہ ہو سکی» آئے تو P2P بُک دوبارہ لوڈ کریں — یہ ری لوڈ سے ٹھیک ہوتا ہے، اندھا دھند دوبارہ کوشش سے نہیں۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · PAGAR

     La frase que más dinero salva de esta categoría es la de la red: «enviar
     desde otra cadena manda los fondos a un sitio del que no se recuperan». No
     admite suavizarse al traducir — no es un aviso, es una advertencia, y la
     diferencia son fondos perdidos.

     `BSC` y `DUAL (AIG + USDT)` van tal cual: son el nombre de una red y el de
     un modo de pago que la persona tiene que reconocer en la caja.
     ══════════════════════════════════════════════════════════════════ */
  '¿Cómo puedo pagar?': {
    en: 'How can I pay?', pt: 'Como posso pagar?', fr: 'Comment puis-je payer ?',
    ru: 'Как я могу оплатить?', sv: 'Hur kan jag betala?', hr: 'Kako mogu platiti?',
    ar: 'كيف يمكنني الدفع؟', de: 'Wie kann ich bezahlen?',
    sr: 'Како могу да платим?', ur: 'میں کیسے ادائیگی کر سکتا ہوں؟',
  },
  'Ahora mismo hay dos formas, las dos con wallet conectada: DUAL, que es una parte en AIG y el resto en USDT; y USDT solo, sin AIG. No hace falta elegir nada más — en la caja aparecen esas dos y se paga en la red BSC.':
    {
      en: 'Right now there are two ways, both with a connected wallet: DUAL, which is part in AIG and the rest in USDT; and USDT only, without AIG. Nothing else to choose — those two appear at checkout and payment happens on the BSC network.',
      pt: 'Agora mesmo há duas formas, ambas com carteira conectada: DUAL, que é uma parte em AIG e o resto em USDT; e USDT sozinho, sem AIG. Não é preciso escolher mais nada — no caixa aparecem essas duas e se paga na rede BSC.',
      fr: 'Actuellement il y a deux façons, toutes deux avec portefeuille connecté : DUAL, une partie en AIG et le reste en USDT ; et USDT seul, sans AIG. Rien d’autre à choisir — ces deux options apparaissent au paiement et se règlent sur le réseau BSC.',
      ru: 'Сейчас есть два способа, оба с подключённым кошельком: DUAL — часть в AIG, остальное в USDT; и только USDT, без AIG. Больше ничего выбирать не нужно — эти два варианта появляются на кассе, оплата идёт в сети BSC.',
      sv: 'Just nu finns två sätt, båda med ansluten plånbok: DUAL, som är en del i AIG och resten i USDT; och enbart USDT, utan AIG. Inget mer att välja — de två visas i kassan och betalningen sker på BSC-nätet.',
      hr: 'Trenutačno postoje dva načina, oba s povezanim novčanikom: DUAL, dio u AIG-u a ostatak u USDT-u; i samo USDT, bez AIG-a. Ništa se više ne bira — ta se dva pojavljuju na blagajni i plaća se na BSC mreži.',
      ar: 'حاليًا هناك طريقتان، كلتاهما بمحفظة متصلة: DUAL، أي جزء بالـ AIG والباقي بالـ USDT؛ و USDT فقط، دون AIG. لا شيء آخر تختاره — تظهر هاتان في صفحة الدفع والسداد يتم على شبكة BSC.',
      de: 'Derzeit gibt es zwei Wege, beide mit verbundener Wallet: DUAL — ein Teil in AIG, der Rest in USDT; und nur USDT, ohne AIG. Mehr ist nicht zu wählen — diese beiden erscheinen an der Kasse und bezahlt wird im BSC-Netz.',
      sr: 'Тренутно постоје два начина, оба са повезаним новчаником: DUAL, део у AIG-у а остатак у USDT-у; и само USDT, без AIG-а. Ништа се више не бира — та два се појављују на каси и плаћа се на BSC мрежи.',
      ur: 'اِس وقت دو طریقے ہیں، دونوں جُڑے ہوئے والٹ کے ساتھ: DUAL، جس میں کچھ حصہ AIG اور باقی USDT؛ اور صرف USDT، بغیر AIG کے۔ اور کچھ نہیں چننا — یہی دو چیک آؤٹ پر آتے ہیں اور ادائیگی BSC نیٹ ورک پر ہوتی ہے۔',
    },
  '¿En qué red tengo que pagar?': {
    en: 'Which network do I have to pay on?', pt: 'Em que rede tenho que pagar?',
    fr: 'Sur quel réseau dois-je payer ?', ru: 'В какой сети нужно платить?',
    sv: 'Vilket nätverk ska jag betala på?', hr: 'Na kojoj mreži moram platiti?',
    ar: 'على أي شبكة يجب أن أدفع؟', de: 'In welchem Netzwerk muss ich bezahlen?',
    sr: 'На којој мрежи морам да платим?', ur: 'مجھے کس نیٹ ورک پر ادائیگی کرنی ہے؟',
  },
  'En BSC. Antes de confirmar, comprueba que tu wallet está en esa red: enviar desde otra cadena manda los fondos a un sitio del que no se recuperan.':
    {
      en: 'On BSC. Before confirming, check that your wallet is on that network: sending from another chain sends the funds somewhere they cannot be recovered from.',
      pt: 'Na BSC. Antes de confirmar, verifique se sua carteira está nessa rede: enviar de outra cadeia manda os fundos para um lugar de onde não se recuperam.',
      fr: 'Sur BSC. Avant de confirmer, vérifie que ton portefeuille est sur ce réseau : envoyer depuis une autre chaîne expédie les fonds là d’où on ne les récupère pas.',
      ru: 'В BSC. Перед подтверждением проверь, что кошелёк в этой сети: отправка из другой цепочки уводит средства туда, откуда их не вернуть.',
      sv: 'På BSC. Innan du bekräftar, kontrollera att din plånbok är på det nätverket: att skicka från en annan kedja skickar medlen dit de inte går att få tillbaka från.',
      hr: 'Na BSC-u. Prije potvrde provjeri je li tvoj novčanik na toj mreži: slanje s drugog lanca šalje sredstva na mjesto odakle se ne mogu vratiti.',
      ar: 'على BSC. قبل التأكيد، تأكّد أن محفظتك على تلك الشبكة: الإرسال من سلسلة أخرى يُرسل الأموال إلى مكان لا تُسترجع منه.',
      de: 'Auf BSC. Prüfe vor dem Bestätigen, ob deine Wallet in diesem Netz ist: von einer anderen Chain zu senden schickt die Mittel an einen Ort, von dem sie nicht zurückzuholen sind.',
      sr: 'На BSC-у. Пре потврде провери да ли је твој новчаник на тој мрежи: слање са другог ланца шаље средства на место одакле се не могу вратити.',
      ur: 'BSC پر۔ تصدیق سے پہلے دیکھیں کہ آپ کا والٹ اُسی نیٹ ورک پر ہے: کسی اور چین سے بھیجنا رقم ایسی جگہ بھیج دیتا ہے جہاں سے واپس نہیں آتی۔',
    },
  '¿Puedo pagar con tarjeta?': {
    en: 'Can I pay by card?', pt: 'Posso pagar com cartão?',
    fr: 'Puis-je payer par carte ?', ru: 'Можно ли заплатить картой?',
    sv: 'Kan jag betala med kort?', hr: 'Mogu li platiti karticom?',
    ar: 'هل يمكنني الدفع بالبطاقة؟', de: 'Kann ich mit Karte bezahlen?',
    sr: 'Могу ли да платим картицом?', ur: 'کیا میں کارڈ سے ادائیگی کر سکتا ہوں؟',
  },
  'Esta temporada no se ofrece el pago con tarjeta. Se paga desde tu wallet: DUAL (AIG + USDT) o USDT solo, y sin wallet conectada no se puede completar la compra. Si en algún momento se habilita otra forma de pago, se anunciará por los canales oficiales.':
    {
      en: 'Card payment is not offered this season. You pay from your wallet: DUAL (AIG + USDT) or USDT only, and without a connected wallet the purchase cannot be completed. If another payment method is enabled at some point, it will be announced through the official channels.',
      pt: 'Nesta temporada não se oferece pagamento com cartão. Paga-se pela sua carteira: DUAL (AIG + USDT) ou USDT sozinho, e sem carteira conectada não é possível concluir a compra. Se em algum momento outra forma de pagamento for habilitada, será anunciada pelos canais oficiais.',
      fr: 'Le paiement par carte n’est pas proposé cette saison. On paie depuis ton portefeuille : DUAL (AIG + USDT) ou USDT seul, et sans portefeuille connecté l’achat ne peut pas être finalisé. Si un autre moyen de paiement est activé un jour, il sera annoncé par les canaux officiels.',
      ru: 'В этом сезоне оплата картой не предлагается. Платят из кошелька: DUAL (AIG + USDT) или только USDT, а без подключённого кошелька покупку завершить нельзя. Если когда-нибудь появится другой способ оплаты, об этом объявят по официальным каналам.',
      sv: 'Kortbetalning erbjuds inte den här säsongen. Du betalar från din plånbok: DUAL (AIG + USDT) eller enbart USDT, och utan ansluten plånbok går köpet inte att slutföra. Om ett annat betalsätt aktiveras vid något tillfälle meddelas det via de officiella kanalerna.',
      hr: 'Ove sezone plaćanje karticom nije dostupno. Plaća se iz tvog novčanika: DUAL (AIG + USDT) ili samo USDT, a bez povezanog novčanika kupnja se ne može dovršiti. Ako se nekad omogući drugi način plaćanja, objavit će se putem službenih kanala.',
      ar: 'الدفع بالبطاقة غير متاح هذا الموسم. الدفع يتم من محفظتك: DUAL ‏(AIG + USDT) أو USDT فقط، وبدون محفظة متصلة لا يمكن إتمام الشراء. إذا فُعِّلت طريقة دفع أخرى في وقت ما، سيُعلن عنها عبر القنوات الرسمية.',
      de: 'In dieser Saison wird keine Kartenzahlung angeboten. Bezahlt wird aus deiner Wallet: DUAL (AIG + USDT) oder nur USDT — ohne verbundene Wallet lässt sich der Kauf nicht abschließen. Wenn irgendwann eine andere Zahlungsart freigeschaltet wird, wird das über die offiziellen Kanäle angekündigt.',
      sr: 'Ове сезоне плаћање картицом није доступно. Плаћа се из твог новчаника: DUAL (AIG + USDT) или само USDT, а без повезаног новчаника куповина се не може довршити. Ако се некад омогући други начин плаћања, објавиће се путем званичних канала.',
      ur: 'اس سیزن میں کارڈ سے ادائیگی دستیاب نہیں۔ ادائیگی آپ کے والٹ سے ہوتی ہے: DUAL (AIG + USDT) یا صرف USDT، اور جُڑے والٹ کے بغیر خریداری مکمل نہیں ہو سکتی۔ اگر کبھی کوئی اور طریقہ فعال ہوا تو سرکاری چینلز پر اعلان ہوگا۔',
    },
  'En DUAL, ¿cuánto AIG me van a cobrar?': {
    en: 'With DUAL, how much AIG will I be charged?',
    pt: 'No DUAL, quanto AIG vão me cobrar?',
    fr: 'En DUAL, combien d’AIG vais-je payer ?',
    ru: 'В DUAL сколько с меня спишут AIG?',
    sv: 'Med DUAL, hur mycket AIG dras det?',
    hr: 'Kod DUAL-a, koliko AIG-a će mi naplatiti?',
    ar: 'في DUAL، كم AIG سيُخصم مني؟',
    de: 'Wie viel AIG wird mir bei DUAL berechnet?',
    sr: 'Код DUAL-а, колико AIG-а ће ми наплатити?',
    ur: 'DUAL میں مجھ سے کتنا AIG لیا جائے گا؟',
  },
  'Cada producto aporta su propia parte en AIG, así que la cantidad depende de lo que lleves en el carrito y no de un porcentaje único aplicado al total. La cifra exacta en AIG y en USDT se ve en la caja antes de confirmar: si algo no cuadra ahí, no confirmes.':
    {
      en: 'Each product contributes its own AIG share, so the amount depends on what you have in the cart and not on a single percentage applied to the total. The exact figure in AIG and in USDT is shown at checkout before you confirm: if something does not add up there, do not confirm.',
      pt: 'Cada produto aporta sua própria parte em AIG, então a quantidade depende do que você levar no carrinho e não de uma porcentagem única aplicada ao total. A cifra exata em AIG e em USDT aparece no caixa antes de confirmar: se algo não bater ali, não confirme.',
      fr: 'Chaque produit apporte sa propre part en AIG, donc le montant dépend de ce que tu as dans le panier et non d’un pourcentage unique appliqué au total. Le chiffre exact en AIG et en USDT s’affiche au paiement avant de confirmer : si quelque chose ne colle pas là, ne confirme pas.',
      ru: 'Каждый товар даёт свою долю в AIG, поэтому сумма зависит от содержимого корзины, а не от единого процента от общей суммы. Точная цифра в AIG и в USDT видна на кассе до подтверждения: если там что-то не сходится — не подтверждай.',
      sv: 'Varje produkt bidrar med sin egen AIG-andel, så beloppet beror på vad du har i varukorgen och inte på en enda procentsats av totalen. Den exakta siffran i AIG och USDT visas i kassan innan du bekräftar: stämmer något inte där, bekräfta inte.',
      hr: 'Svaki proizvod donosi svoj udio u AIG-u, pa iznos ovisi o tome što nosiš u košarici, a ne o jedinstvenom postotku na ukupno. Točan iznos u AIG-u i USDT-u vidi se na blagajni prije potvrde: ako se ondje nešto ne slaže, nemoj potvrditi.',
      ar: 'كل منتج يساهم بحصته من AIG، فالمقدار يعتمد على ما في سلّتك لا على نسبة واحدة تُطبَّق على الإجمالي. الرقم الدقيق بالـ AIG وبالـ USDT يظهر في صفحة الدفع قبل التأكيد: إن لم يتطابق شيء هناك، فلا تؤكّد.',
      de: 'Jedes Produkt steuert seinen eigenen AIG-Anteil bei, der Betrag hängt also davon ab, was im Warenkorb liegt, und nicht von einem einzigen Prozentsatz auf die Summe. Die genaue Zahl in AIG und in USDT steht vor dem Bestätigen an der Kasse: Wenn dort etwas nicht stimmt, bestätige nicht.',
      sr: 'Сваки производ доноси свој удео у AIG-у, па износ зависи од тога шта носиш у корпи, а не од јединственог процента на укупно. Тачан износ у AIG-у и USDT-у види се на каси пре потврде: ако се тамо нешто не слаже, немој потврдити.',
      ur: 'ہر پروڈکٹ اپنا AIG حصہ ڈالتا ہے، اس لیے مقدار اس پر منحصر ہے کہ کارٹ میں کیا ہے، نہ کہ کل پر لگنے والے ایک فیصد پر۔ AIG اور USDT میں درست عدد تصدیق سے پہلے چیک آؤٹ پر نظر آتا ہے: اگر وہاں کچھ نہ ملے تو تصدیق نہ کریں۔',
    },
  'No me aparece la opción de pagar con AIG': {
    en: 'The option to pay with AIG does not appear',
    pt: 'Não aparece a opção de pagar com AIG',
    fr: 'L’option de payer en AIG n’apparaît pas',
    ru: 'Не появляется опция оплаты в AIG',
    sv: 'Alternativet att betala med AIG visas inte',
    hr: 'Ne pojavljuje mi se opcija plaćanja AIG-om',
    ar: 'لا يظهر لي خيار الدفع بالـ AIG',
    de: 'Die Option, mit AIG zu bezahlen, erscheint nicht',
    sr: 'Не појављује ми се опција плаћања AIG-ом',
    ur: 'مجھے AIG سے ادائیگی کا آپشن نظر نہیں آتا',
  },
  'Comprueba primero que tienes la wallet conectada: sin ella no se muestra ninguna forma de pago. Si está conectada y aun así sólo ves USDT, es por el carrito — cuánto AIG admite cada artículo lo define el propio producto, no tu cuenta.':
    {
      en: 'First check that your wallet is connected: without it no payment method is shown at all. If it is connected and you still only see USDT, it is because of the cart — how much AIG each item accepts is defined by the product itself, not by your account.',
      pt: 'Verifique primeiro se a carteira está conectada: sem ela não se mostra nenhuma forma de pagamento. Se estiver conectada e mesmo assim você só vir USDT, é pelo carrinho — quanto AIG cada item admite é definido pelo próprio produto, não pela sua conta.',
      fr: 'Vérifie d’abord que ton portefeuille est connecté : sans lui, aucun moyen de paiement ne s’affiche. S’il est connecté et que tu ne vois que de l’USDT, c’est à cause du panier — la part d’AIG que chaque article accepte est définie par le produit lui-même, pas par ton compte.',
      ru: 'Сначала проверь, подключён ли кошелёк: без него не показывается ни один способ оплаты. Если подключён, а ты всё равно видишь только USDT, дело в корзине — сколько AIG принимает каждый товар, определяет сам товар, а не твой аккаунт.',
      sv: 'Kontrollera först att plånboken är ansluten: utan den visas inget betalsätt alls. Är den ansluten och du ändå bara ser USDT beror det på varukorgen — hur mycket AIG varje artikel tar emot bestäms av produkten själv, inte av ditt konto.',
      hr: 'Prvo provjeri je li novčanik povezan: bez njega se ne prikazuje nijedan način plaćanja. Ako jest povezan, a i dalje vidiš samo USDT, razlog je košarica — koliko AIG-a prihvaća svaki artikl određuje sam proizvod, ne tvoj račun.',
      ar: 'تحقّق أولًا من أن محفظتك متصلة: بدونها لا تظهر أي طريقة دفع. وإذا كانت متصلة وما زلت ترى USDT فقط، فالسبب السلّة — مقدار AIG الذي يقبله كل صنف يحدّده المنتج نفسه، لا حسابك.',
      de: 'Prüfe zuerst, ob deine Wallet verbunden ist: ohne sie wird gar keine Zahlungsart angezeigt. Ist sie verbunden und du siehst trotzdem nur USDT, liegt es am Warenkorb — wie viel AIG jeder Artikel akzeptiert, legt das Produkt selbst fest, nicht dein Konto.',
      sr: 'Прво провери да ли је новчаник повезан: без њега се не приказује ниједан начин плаћања. Ако јесте повезан, а и даље видиш само USDT, разлог је корпа — колико AIG-а прихвата сваки артикал одређује сам производ, не твој налог.',
      ur: 'پہلے دیکھیں کہ آپ کا والٹ جُڑا ہے: اُس کے بغیر کوئی طریقۂ ادائیگی نہیں دکھتا۔ اگر جُڑا ہے اور پھر بھی صرف USDT نظر آتا ہے تو وجہ کارٹ ہے — ہر شے کتنا AIG قبول کرتی ہے یہ خود پروڈکٹ طے کرتا ہے، آپ کا اکاؤنٹ نہیں۔',
    },
  '¿El envío está incluido en el precio?': {
    en: 'Is shipping included in the price?', pt: 'O frete está incluído no preço?',
    fr: 'La livraison est-elle incluse dans le prix ?', ru: 'Доставка включена в цену?',
    sv: 'Ingår frakten i priset?', hr: 'Je li dostava uključena u cijenu?',
    ar: 'هل الشحن مشمول في السعر؟', de: 'Ist der Versand im Preis enthalten?',
    sr: 'Да ли је достава укључена у цену?', ur: 'کیا ترسیل قیمت میں شامل ہے؟',
  },
  'El total que ves en la caja es el que se cobra, con el envío ya dentro. El envío internacional depende del destino, así que el importe puede cambiar según el país que indiques — pero se ve antes de pagar, no después.':
    {
      en: 'The total you see at checkout is what gets charged, with shipping already included. International shipping depends on the destination, so the amount can change according to the country you enter — but you see it before paying, not after.',
      pt: 'O total que você vê no caixa é o que se cobra, com o frete já incluído. O frete internacional depende do destino, então o valor pode mudar conforme o país que você indicar — mas se vê antes de pagar, não depois.',
      fr: 'Le total que tu vois au paiement est celui qui est débité, livraison comprise. La livraison internationale dépend de la destination, le montant peut donc changer selon le pays indiqué — mais tu le vois avant de payer, pas après.',
      ru: 'Итог, который ты видишь на кассе, — это то, что спишется, доставка уже внутри. Международная доставка зависит от направления, поэтому сумма может меняться в зависимости от указанной страны — но её видно до оплаты, а не после.',
      sv: 'Totalen du ser i kassan är den som dras, med frakten redan inräknad. Internationell frakt beror på destinationen, så beloppet kan ändras efter vilket land du anger — men du ser det före betalning, inte efter.',
      hr: 'Ukupno što vidiš na blagajni je ono što se naplaćuje, s dostavom već uključenom. Međunarodna dostava ovisi o odredištu, pa se iznos može mijenjati prema zemlji koju navedeš — ali vidi se prije plaćanja, ne poslije.',
      ar: 'الإجمالي الذي تراه في صفحة الدفع هو ما يُخصم، والشحن مشمول فيه. الشحن الدولي يعتمد على الوجهة، فقد يتغيّر المبلغ حسب البلد الذي تحدّده — لكنه يظهر قبل الدفع لا بعده.',
      de: 'Die Summe, die du an der Kasse siehst, wird abgebucht — der Versand ist bereits enthalten. Internationaler Versand hängt vom Ziel ab, der Betrag kann sich also je nach angegebenem Land ändern — aber du siehst ihn vor dem Bezahlen, nicht danach.',
      sr: 'Укупно што видиш на каси је оно што се наплаћује, са доставом већ укљученом. Међународна достава зависи од одредишта, па се износ може мењати према земљи коју наведеш — али види се пре плаћања, не после.',
      ur: 'چیک آؤٹ پر جو کل نظر آتا ہے وہی وصول ہوتا ہے، ترسیل اُس میں شامل ہے۔ بین الاقوامی ترسیل منزل پر منحصر ہے، اس لیے رقم آپ کے بتائے ملک کے مطابق بدل سکتی ہے — مگر یہ ادائیگی سے پہلے دکھتی ہے، بعد میں نہیں۔',
    },
  '¿Cuántos pasos tiene la compra?': {
    en: 'How many steps does the purchase take?', pt: 'Quantos passos tem a compra?',
    fr: 'Combien d’étapes comporte l’achat ?', ru: 'Сколько шагов в покупке?',
    sv: 'Hur många steg har köpet?', hr: 'Koliko koraka ima kupnja?',
    ar: 'كم خطوة تستغرق عملية الشراء؟', de: 'Wie viele Schritte hat der Kauf?',
    sr: 'Колико корака има куповина?', ur: 'خریداری کے کتنے مراحل ہیں؟',
  },
  'Dos. Primero la dirección de envío —queda guardada para próximas compras— y después la forma de pago. El envío ya va incluido en el total, así que no aparece ningún cargo extra al final.':
    {
      en: 'Two. First the shipping address — it is saved for future purchases — and then the payment method. Shipping is already included in the total, so no extra charge appears at the end.',
      pt: 'Dois. Primeiro o endereço de entrega — fica salvo para próximas compras — e depois a forma de pagamento. O frete já vai incluído no total, então não aparece nenhum encargo extra no final.',
      fr: 'Deux. D’abord l’adresse de livraison — elle est enregistrée pour les prochains achats — puis le moyen de paiement. La livraison est déjà incluse dans le total, donc aucun frais supplémentaire n’apparaît à la fin.',
      ru: 'Два. Сначала адрес доставки — он сохраняется для следующих покупок — потом способ оплаты. Доставка уже включена в итог, поэтому в конце никаких дополнительных списаний не появляется.',
      sv: 'Två. Först leveransadressen — den sparas till kommande köp — och sedan betalsättet. Frakten ingår redan i totalen, så ingen extra avgift dyker upp på slutet.',
      hr: 'Dva. Prvo adresa dostave — sprema se za sljedeće kupnje — a zatim način plaćanja. Dostava je već uključena u ukupno, pa se na kraju ne pojavljuje nikakav dodatni trošak.',
      ar: 'خطوتان. أولًا عنوان الشحن — يُحفظ للمشتريات القادمة — ثم طريقة الدفع. الشحن مشمول أصلًا في الإجمالي، فلا تظهر أي رسوم إضافية في النهاية.',
      de: 'Zwei. Zuerst die Lieferadresse — sie wird für künftige Käufe gespeichert — und dann die Zahlungsart. Der Versand ist bereits in der Summe enthalten, am Ende kommt also keine Zusatzgebühr dazu.',
      sr: 'Два. Прво адреса доставе — чува се за следеће куповине — а затим начин плаћања. Достава је већ укључена у укупно, па се на крају не појављује никакав додатни трошак.',
      ur: 'دو۔ پہلے ترسیل کا پتہ — یہ اگلی خریداریوں کے لیے محفوظ ہو جاتا ہے — اور پھر ادائیگی کا طریقہ۔ ترسیل کل میں شامل ہے، اس لیے آخر میں کوئی اضافی چارج نہیں آتا۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · TOKEN AiG

     LA RESPUESTA DEL CONTRATO NO ESTÁ AQUÍ, y es deliberado. Esa respuesta se
     construye en `preguntas-token.ts` a partir de `AIG_TOKEN_CONTRACT`, así que
     su texto cambia si cambia la dirección — y una clave de diccionario fija no
     podría seguirlo. Meterla congelaría una dirección en once idiomas, que es
     exactamente el fallo que se acaba de arreglar.

     LOS PORCENTAJES SE COPIAN TAL CUAL, incluido que el reparto suma 100,01 %.
     Está así en el documento oficial y ya queda anotado en `whitepaper.ts`:
     «corregirlo» al traducir sería inventar una cifra que nadie publicó.
     ══════════════════════════════════════════════════════════════════ */
  '¿Cuántos AiG hay en total? ¿Se pueden crear más?': {
    en: 'How many AiG are there in total? Can more be created?',
    pt: 'Quantos AiG existem no total? Podem ser criados mais?',
    fr: 'Combien d’AiG existe-t-il au total ? Peut-on en créer d’autres ?',
    ru: 'Сколько всего AiG? Можно ли создать ещё?',
    sv: 'Hur många AiG finns totalt? Kan fler skapas?',
    hr: 'Koliko ukupno ima AiG-a? Može li se stvoriti još?',
    ar: 'كم عدد AiG إجمالًا؟ وهل يمكن إنشاء المزيد؟',
    de: 'Wie viele AiG gibt es insgesamt? Können mehr erzeugt werden?',
    sr: 'Колико укупно има AiG-а? Може ли се створити још?',
    ur: 'کل کتنے AiG ہیں؟ کیا مزید بنائے جا سکتے ہیں؟',
  },
  'El supply es fijo: 111 millones de AiG, y no cambia. El contrato no tiene función de acuñar (mint) ni de quemar (burn), así que nadie puede crear tokens nuevos ni destruir los existentes. Esa permanencia es a propósito: da previsibilidad al ecosistema.':
    {
      en: 'The supply is fixed: 111 million AiG, and it does not change. The contract has no mint and no burn function, so nobody can create new tokens or destroy existing ones. That permanence is deliberate: it gives the ecosystem predictability.',
      pt: 'O supply é fixo: 111 milhões de AiG, e não muda. O contrato não tem função de cunhar (mint) nem de queimar (burn), então ninguém pode criar tokens novos nem destruir os existentes. Essa permanência é proposital: dá previsibilidade ao ecossistema.',
      fr: 'L’offre est fixe : 111 millions d’AiG, et elle ne change pas. Le contrat n’a ni fonction de frappe (mint) ni de destruction (burn), donc personne ne peut créer de nouveaux jetons ni détruire ceux qui existent. Cette permanence est volontaire : elle donne de la prévisibilité à l’écosystème.',
      ru: 'Эмиссия фиксирована: 111 миллионов AiG, и она не меняется. В контракте нет функций выпуска (mint) и сжигания (burn), поэтому никто не может создать новые токены или уничтожить существующие. Эта неизменность — намеренная: она даёт экосистеме предсказуемость.',
      sv: 'Utbudet är fast: 111 miljoner AiG, och det ändras inte. Kontraktet har varken mint- eller burn-funktion, så ingen kan skapa nya tokens eller förstöra befintliga. Den beständigheten är avsiktlig: den ger ekosystemet förutsägbarhet.',
      hr: 'Ponuda je fiksna: 111 milijuna AiG-a i ne mijenja se. Ugovor nema funkciju kovanja (mint) ni spaljivanja (burn), pa nitko ne može stvoriti nove tokene niti uništiti postojeće. Ta je trajnost namjerna: daje ekosustavu predvidljivost.',
      ar: 'المعروض ثابت: 111 مليون AiG، ولا يتغيّر. لا يملك العقد وظيفة سكّ (mint) ولا حرق (burn)، لذا لا يستطيع أحد إنشاء رموز جديدة ولا إتلاف الموجودة. هذا الثبات مقصود: يمنح النظام البيئي قابلية للتنبؤ.',
      de: 'Das Angebot ist fix: 111 Millionen AiG, und es ändert sich nicht. Der Vertrag hat weder eine Mint- noch eine Burn-Funktion, also kann niemand neue Token erzeugen oder bestehende vernichten. Diese Beständigkeit ist Absicht: Sie gibt dem Ökosystem Vorhersehbarkeit.',
      sr: 'Понуда је фиксна: 111 милиона AiG-а и не мења се. Уговор нема функцију ковања (mint) ни спаљивања (burn), па нико не може створити нове токене нити уништити постојеће. Та трајност је намерна: даје екосистему предвидивост.',
      ur: 'سپلائی مقررہ ہے: 111 ملین AiG، اور یہ نہیں بدلتی۔ کنٹریکٹ میں نہ mint کا فنکشن ہے نہ burn کا، اس لیے کوئی نئے ٹوکن نہیں بنا سکتا اور نہ موجودہ ختم کر سکتا ہے۔ یہ ثبات جان بوجھ کر ہے: یہ ایکو سسٹم کو پیش بینی دیتا ہے۔',
    },
  '¿Cómo se distribuye el supply del AiG?': {
    en: 'How is the AiG supply distributed?', pt: 'Como se distribui o supply do AiG?',
    fr: 'Comment l’offre d’AiG est-elle répartie ?', ru: 'Как распределена эмиссия AiG?',
    sv: 'Hur fördelas AiG-utbudet?', hr: 'Kako se raspodjeljuje ponuda AiG-a?',
    ar: 'كيف يُوزَّع معروض AiG؟', de: 'Wie ist das AiG-Angebot verteilt?',
    sr: 'Како се распоређује понуда AiG-а?', ur: 'AiG کی سپلائی کیسے تقسیم ہوتی ہے؟',
  },
  'De los 111 millones: 50% bloqueado (locked), 20% recompensas, 15% staking, 10% tesorería (treasury), 5% equipo corporativo y 0.01% liquidez. La distribución está pensada para sostener las recompensas del ecosistema a largo plazo.':
    {
      en: 'Of the 111 million: 50% locked, 20% rewards, 15% staking, 10% treasury, 5% corporate team and 0.01% liquidity. The distribution is designed to sustain the ecosystem’s rewards over the long term.',
      pt: 'Dos 111 milhões: 50% bloqueado (locked), 20% recompensas, 15% staking, 10% tesouraria (treasury), 5% equipe corporativa e 0,01% liquidez. A distribuição foi pensada para sustentar as recompensas do ecossistema a longo prazo.',
      fr: 'Sur les 111 millions : 50 % bloqués (locked), 20 % récompenses, 15 % staking, 10 % trésorerie (treasury), 5 % équipe corporative et 0,01 % liquidité. La répartition est pensée pour soutenir les récompenses de l’écosystème sur le long terme.',
      ru: 'Из 111 миллионов: 50 % заблокировано (locked), 20 % награды, 15 % стейкинг, 10 % казна (treasury), 5 % корпоративная команда и 0,01 % ликвидность. Распределение рассчитано на то, чтобы поддерживать награды экосистемы в долгую.',
      sv: 'Av de 111 miljonerna: 50 % låsta (locked), 20 % belöningar, 15 % staking, 10 % kassa (treasury), 5 % företagsteam och 0,01 % likviditet. Fördelningen är utformad för att bära ekosystemets belöningar på lång sikt.',
      hr: 'Od 111 milijuna: 50 % zaključano (locked), 20 % nagrade, 15 % staking, 10 % riznica (treasury), 5 % korporativni tim i 0,01 % likvidnost. Raspodjela je zamišljena da dugoročno održi nagrade ekosustava.',
      ar: 'من الـ 111 مليونًا: 50٪ مقفلة (locked)، و20٪ مكافآت، و15٪ تخزين (staking)، و10٪ خزينة (treasury)، و5٪ الفريق المؤسسي، و0.01٪ سيولة. التوزيع مصمَّم لدعم مكافآت النظام البيئي على المدى الطويل.',
      de: 'Von den 111 Millionen: 50 % gesperrt (locked), 20 % Belohnungen, 15 % Staking, 10 % Treasury, 5 % Unternehmensteam und 0,01 % Liquidität. Die Verteilung ist darauf ausgelegt, die Belohnungen des Ökosystems langfristig zu tragen.',
      sr: 'Од 111 милиона: 50 % закључано (locked), 20 % награде, 15 % стејкинг, 10 % ризница (treasury), 5 % корпоративни тим и 0,01 % ликвидност. Расподела је замишљена да дугорочно одржи награде екосистема.',
      ur: '111 ملین میں سے: 50٪ مقفل (locked)، 20٪ انعامات، 15٪ اسٹیکنگ، 10٪ خزانہ (treasury)، 5٪ کارپوریٹ ٹیم اور 0.01٪ لیکویڈیٹی۔ یہ تقسیم ایکو سسٹم کے انعامات کو طویل مدت تک سہارا دینے کے لیے بنائی گئی ہے۔',
    },
  '¿La emisión de AiG baja con el tiempo?': {
    en: 'Does AiG issuance decrease over time?',
    pt: 'A emissão de AiG diminui com o tempo?',
    fr: 'L’émission d’AiG diminue-t-elle avec le temps ?',
    ru: 'Снижается ли эмиссия AiG со временем?',
    sv: 'Minskar AiG-utgivningen över tid?',
    hr: 'Smanjuje li se izdavanje AiG-a s vremenom?',
    ar: 'هل ينخفض إصدار AiG مع الوقت؟',
    de: 'Sinkt die AiG-Ausgabe mit der Zeit?',
    sr: 'Смањује ли се издавање AiG-а с временом?',
    ur: 'کیا AiG کا اجرا وقت کے ساتھ کم ہوتا ہے؟',
  },
  'Sí, la emisión se reduce de forma programada año a año: 11% el año 1, 11% el año 2, 8% el año 3, 6% el año 4, 4% el año 5 y 2% el año 6 (tasas mensuales de emisión). Menor emisión significa mayor escasez con el tiempo. Es una tasa de emisión del protocolo, no una promesa de resultado.':
    {
      en: 'Yes, issuance decreases on a programmed schedule year by year: 11% in year 1, 11% in year 2, 8% in year 3, 6% in year 4, 4% in year 5 and 2% in year 6 (monthly issuance rates). Lower issuance means greater scarcity over time. It is a protocol issuance rate, not a promise of results.',
      pt: 'Sim, a emissão se reduz de forma programada ano a ano: 11% no ano 1, 11% no ano 2, 8% no ano 3, 6% no ano 4, 4% no ano 5 e 2% no ano 6 (taxas mensais de emissão). Menor emissão significa maior escassez com o tempo. É uma taxa de emissão do protocolo, não uma promessa de resultado.',
      fr: 'Oui, l’émission se réduit de façon programmée année après année : 11 % l’année 1, 11 % l’année 2, 8 % l’année 3, 6 % l’année 4, 4 % l’année 5 et 2 % l’année 6 (taux mensuels d’émission). Moins d’émission signifie plus de rareté avec le temps. C’est un taux d’émission du protocole, pas une promesse de résultat.',
      ru: 'Да, эмиссия снижается по заданному графику год за годом: 11 % в 1-й год, 11 % во 2-й, 8 % в 3-й, 6 % в 4-й, 4 % в 5-й и 2 % в 6-й (месячные ставки эмиссии). Меньшая эмиссия означает большую редкость со временем. Это ставка эмиссии протокола, а не обещание результата.',
      sv: 'Ja, utgivningen minskar enligt ett programmerat schema år för år: 11 % år 1, 11 % år 2, 8 % år 3, 6 % år 4, 4 % år 5 och 2 % år 6 (månatliga utgivningstakter). Lägre utgivning betyder större knapphet över tid. Det är protokollets utgivningstakt, inte ett löfte om resultat.',
      hr: 'Da, izdavanje se programirano smanjuje iz godine u godinu: 11 % 1. godine, 11 % 2. godine, 8 % 3. godine, 6 % 4. godine, 4 % 5. godine i 2 % 6. godine (mjesečne stope izdavanja). Manje izdavanje znači veću rijetkost s vremenom. To je stopa izdavanja protokola, a ne obećanje rezultata.',
      ar: 'نعم، ينخفض الإصدار وفق جدول مبرمج عامًا بعد عام: 11٪ في السنة 1، و11٪ في السنة 2، و8٪ في السنة 3، و6٪ في السنة 4، و4٪ في السنة 5، و2٪ في السنة 6 (معدلات إصدار شهرية). إصدار أقل يعني ندرة أكبر مع الوقت. إنها نسبة إصدار للبروتوكول، لا وعدًا بنتيجة.',
      de: 'Ja, die Ausgabe sinkt programmiert Jahr für Jahr: 11 % im Jahr 1, 11 % im Jahr 2, 8 % im Jahr 3, 6 % im Jahr 4, 4 % im Jahr 5 und 2 % im Jahr 6 (monatliche Ausgaberaten). Weniger Ausgabe bedeutet mit der Zeit größere Knappheit. Es ist eine Ausgaberate des Protokolls, kein Ergebnisversprechen.',
      sr: 'Да, издавање се програмирано смањује из године у годину: 11 % 1. године, 11 % 2. године, 8 % 3. године, 6 % 4. године, 4 % 5. године и 2 % 6. године (месечне стопе издавања). Мање издавање значи већу реткост с временом. То је стопа издавања протокола, а не обећање резултата.',
      ur: 'ہاں، اجرا سال بہ سال طے شدہ طریقے سے کم ہوتا ہے: سال 1 میں 11٪، سال 2 میں 11٪، سال 3 میں 8٪، سال 4 میں 6٪، سال 5 میں 4٪ اور سال 6 میں 2٪ (ماہانہ اجرا کی شرحیں)۔ کم اجرا کا مطلب وقت کے ساتھ زیادہ نایابی۔ یہ پروٹوکول کی اجرا کی شرح ہے، نتیجے کا وعدہ نہیں۔',
    },
  '¿El AiG sirve para votar o gobernar el ecosistema?': {
    en: 'Is AiG used to vote or govern the ecosystem?',
    pt: 'O AiG serve para votar ou governar o ecossistema?',
    fr: 'L’AiG sert-il à voter ou à gouverner l’écosystème ?',
    ru: 'Служит ли AiG для голосования или управления экосистемой?',
    sv: 'Används AiG för att rösta eller styra ekosystemet?',
    hr: 'Služi li AiG za glasanje ili upravljanje ekosustavom?',
    ar: 'هل يُستخدم AiG للتصويت أو حوكمة النظام البيئي؟',
    de: 'Dient AiG zum Abstimmen oder zur Steuerung des Ökosystems?',
    sr: 'Служи ли AiG за гласање или управљање екосистемом?',
    ur: 'کیا AiG ووٹ دینے یا ایکو سسٹم چلانے کے کام آتا ہے؟',
  },
  'Sí. El AiG Token es una herramienta de gobernanza: quienes lo tienen pueden influir en decisiones que dan forma al ecosistema, con un enfoque descentralizado y guiado por la comunidad. Las novedades de gobernanza se comunican por los canales oficiales.':
    {
      en: 'Yes. The AiG Token is a governance tool: those who hold it can influence decisions that shape the ecosystem, with a decentralised, community-led approach. Governance updates are communicated through the official channels.',
      pt: 'Sim. O AiG Token é uma ferramenta de governança: quem o tem pode influenciar decisões que dão forma ao ecossistema, com um enfoque descentralizado e guiado pela comunidade. As novidades de governança são comunicadas pelos canais oficiais.',
      fr: 'Oui. Le AiG Token est un outil de gouvernance : ceux qui le détiennent peuvent influencer les décisions qui façonnent l’écosystème, dans une approche décentralisée et guidée par la communauté. Les nouveautés de gouvernance sont communiquées par les canaux officiels.',
      ru: 'Да. AiG Token — инструмент управления: те, кто им владеет, могут влиять на решения, формирующие экосистему, в децентрализованном подходе, который ведёт сообщество. Новости управления сообщаются по официальным каналам.',
      sv: 'Ja. AiG Token är ett styrningsverktyg: de som innehar den kan påverka beslut som formar ekosystemet, med ett decentraliserat och gemenskapslett upplägg. Nyheter om styrningen meddelas via de officiella kanalerna.',
      hr: 'Da. AiG Token je alat upravljanja: oni koji ga imaju mogu utjecati na odluke koje oblikuju ekosustav, uz decentraliziran pristup koji vodi zajednica. Novosti o upravljanju objavljuju se putem službenih kanala.',
      ar: 'نعم. AiG Token أداة حوكمة: من يملكه يمكنه التأثير في القرارات التي تُشكّل النظام البيئي، بنهج لا مركزي يقوده المجتمع. تُعلَن مستجدات الحوكمة عبر القنوات الرسمية.',
      de: 'Ja. Der AiG Token ist ein Governance-Werkzeug: Wer ihn hält, kann Entscheidungen beeinflussen, die das Ökosystem prägen — dezentral und von der Community geführt. Neuigkeiten zur Governance werden über die offiziellen Kanäle mitgeteilt.',
      sr: 'Да. AiG Token је алат управљања: они који га имају могу утицати на одлуке које обликују екосистем, уз децентрализован приступ који води заједница. Новости о управљању објављују се путем званичних канала.',
      ur: 'ہاں۔ AiG Token گورننس کا آلہ ہے: جن کے پاس یہ ہے وہ ایکو سسٹم کو شکل دینے والے فیصلوں پر اثر ڈال سکتے ہیں، ایک غیر مرکزی اور کمیونٹی کی رہنمائی والے انداز میں۔ گورننس کی خبریں سرکاری چینلز پر دی جاتی ہیں۔',
    },
  '¿En qué red está el AiG? ¿Qué necesito para operar?': {
    en: 'Which network is AiG on? What do I need to operate?',
    pt: 'Em que rede está o AiG? O que preciso para operar?',
    fr: 'Sur quel réseau est l’AiG ? Que me faut-il pour opérer ?',
    ru: 'В какой сети AiG? Что нужно, чтобы работать с ним?',
    sv: 'Vilket nätverk ligger AiG på? Vad behöver jag för att handla?',
    hr: 'Na kojoj je mreži AiG? Što mi treba za poslovanje?',
    ar: 'على أي شبكة يوجد AiG؟ وما الذي أحتاجه للتعامل؟',
    de: 'In welchem Netzwerk ist AiG? Was brauche ich zum Handeln?',
    sr: 'На којој је мрежи AiG? Шта ми треба за пословање?',
    ur: 'AiG کس نیٹ ورک پر ہے؟ کام کرنے کے لیے مجھے کیا چاہیے؟',
  },
  'El AiG vive en la Binance Smart Chain (BSC / BEP-20). Para operar necesitas una wallet Web3 compatible con BEP-20 (como SafePal, MetaMask u otra), un poco de BNB para las comisiones de red (gas fee) y USDT (BEP-20) para tu aporte. Todo es de auto-custodia: tú controlas tus claves privadas.':
    {
      en: 'AiG lives on the Binance Smart Chain (BSC / BEP-20). To operate you need a Web3 wallet compatible with BEP-20 (such as SafePal, MetaMask or another), a little BNB for network fees (gas fee) and USDT (BEP-20) for your contribution. Everything is self-custody: you control your private keys.',
      pt: 'O AiG vive na Binance Smart Chain (BSC / BEP-20). Para operar você precisa de uma carteira Web3 compatível com BEP-20 (como SafePal, MetaMask ou outra), um pouco de BNB para as taxas de rede (gas fee) e USDT (BEP-20) para seu aporte. Tudo é de autocustódia: você controla suas chaves privadas.',
      fr: 'L’AiG vit sur la Binance Smart Chain (BSC / BEP-20). Pour opérer, il te faut un portefeuille Web3 compatible BEP-20 (comme SafePal, MetaMask ou un autre), un peu de BNB pour les frais de réseau (gas fee) et de l’USDT (BEP-20) pour ton apport. Tout est en auto-conservation : tu contrôles tes clés privées.',
      ru: 'AiG живёт в Binance Smart Chain (BSC / BEP-20). Чтобы работать, нужен Web3-кошелёк с поддержкой BEP-20 (например SafePal, MetaMask или другой), немного BNB на комиссии сети (gas fee) и USDT (BEP-20) для взноса. Всё на самостоятельном хранении: приватные ключи у тебя.',
      sv: 'AiG lever på Binance Smart Chain (BSC / BEP-20). För att handla behöver du en Web3-plånbok som stöder BEP-20 (som SafePal, MetaMask eller annan), lite BNB till nätverksavgifter (gas fee) och USDT (BEP-20) till ditt bidrag. Allt är självförvaring: du styr dina privata nycklar.',
      hr: 'AiG živi na Binance Smart Chainu (BSC / BEP-20). Za poslovanje trebaš Web3 novčanik kompatibilan s BEP-20 (poput SafePala, MetaMaska ili drugog), nešto BNB-a za mrežne naknade (gas fee) i USDT (BEP-20) za svoj ulog. Sve je samostalno skrbništvo: ti kontroliraš svoje privatne ključeve.',
      ar: 'يعيش AiG على Binance Smart Chain ‏(BSC / BEP-20). للتعامل تحتاج محفظة Web3 متوافقة مع BEP-20 (مثل SafePal أو MetaMask أو غيرها)، وقليلًا من BNB لرسوم الشبكة (gas fee)، و USDT ‏(BEP-20) لمساهمتك. كل شيء بحفظ ذاتي: أنت تتحكم بمفاتيحك الخاصة.',
      de: 'AiG lebt auf der Binance Smart Chain (BSC / BEP-20). Zum Handeln brauchst du eine Web3-Wallet mit BEP-20-Unterstützung (etwa SafePal, MetaMask oder eine andere), etwas BNB für die Netzgebühren (Gas Fee) und USDT (BEP-20) für deinen Beitrag. Alles ist Selbstverwahrung: Du kontrollierst deine privaten Schlüssel.',
      sr: 'AiG живи на Binance Smart Chain-у (BSC / BEP-20). За пословање треба ти Web3 новчаник компатибилан са BEP-20 (попут SafePal-а, MetaMask-а или другог), нешто BNB-а за мрежне накнаде (gas fee) и USDT (BEP-20) за твој улог. Све је самостално чување: ти контролишеш своје приватне кључеве.',
      ur: 'AiG کا گھر Binance Smart Chain (BSC / BEP-20) ہے۔ کام کرنے کے لیے BEP-20 کے موافق Web3 والٹ (جیسے SafePal، MetaMask یا کوئی اور)، نیٹ ورک فیس (gas fee) کے لیے تھوڑا BNB، اور اپنے حصے کے لیے USDT (BEP-20) چاہیے۔ سب کچھ خود حفاظتی ہے: نجی کلیدیں آپ کے پاس ہیں۔',
    },
  '¿AiGenesis es un banco o algo garantizado?': {
    en: 'Is AiGenesis a bank or something guaranteed?',
    pt: 'A AiGenesis é um banco ou algo garantido?',
    fr: 'AiGenesis est-elle une banque ou quelque chose de garanti ?',
    ru: 'AiGenesis — это банк или что-то гарантированное?',
    sv: 'Är AiGenesis en bank eller något garanterat?',
    hr: 'Je li AiGenesis banka ili nešto zajamčeno?',
    ar: 'هل AiGenesis بنك أو شيء مضمون؟',
    de: 'Ist AiGenesis eine Bank oder etwas Garantiertes?',
    sr: 'Да ли је AiGenesis банка или нешто загарантовано?',
    ur: 'کیا AiGenesis کوئی بینک یا ضمانت شدہ چیز ہے؟',
  },
  'No. AiGenesis es un ecosistema tecnológico basado en blockchain — no una institución financiera, bancaria ni casa de valores. Participar implica adquirir tecnología de minado e interactuar con contratos inteligentes que se ejecutan solos. Los porcentajes son tasas de emisión programada del token, no un producto bancario ni un resultado asegurado en dólares; los criptoactivos son volátiles por naturaleza.':
    {
      en: 'No. AiGenesis is a blockchain-based technology ecosystem — not a financial institution, a bank or a securities firm. Taking part means acquiring mining technology and interacting with smart contracts that execute on their own. The percentages are programmed token issuance rates, not a banking product nor an assured result in dollars; crypto-assets are volatile by nature.',
      pt: 'Não. A AiGenesis é um ecossistema tecnológico baseado em blockchain — não uma instituição financeira, bancária nem corretora de valores. Participar implica adquirir tecnologia de mineração e interagir com contratos inteligentes que se executam sozinhos. As porcentagens são taxas de emissão programada do token, não um produto bancário nem um resultado assegurado em dólares; os criptoativos são voláteis por natureza.',
      fr: 'Non. AiGenesis est un écosystème technologique basé sur la blockchain — pas une institution financière, ni une banque, ni une société de bourse. Participer implique d’acquérir une technologie de minage et d’interagir avec des contrats intelligents qui s’exécutent seuls. Les pourcentages sont des taux d’émission programmée du jeton, pas un produit bancaire ni un résultat assuré en dollars ; les cryptoactifs sont volatils par nature.',
      ru: 'Нет. AiGenesis — это технологическая экосистема на блокчейне, а не финансовое учреждение, банк или брокерская компания. Участие означает приобретение технологии майнинга и взаимодействие со смарт-контрактами, которые исполняются сами. Проценты — это запрограммированные ставки эмиссии токена, а не банковский продукт и не гарантированный результат в долларах; криптоактивы по своей природе волатильны.',
      sv: 'Nej. AiGenesis är ett teknikekosystem byggt på blockkedja — inte en finansiell institution, en bank eller ett värdepappersbolag. Att delta innebär att skaffa miningteknik och interagera med smarta kontrakt som körs av sig själva. Procenttalen är programmerade utgivningstakter för token, inte en bankprodukt och inget garanterat resultat i dollar; kryptotillgångar är volatila till sin natur.',
      hr: 'Ne. AiGenesis je tehnološki ekosustav na blockchainu — nije financijska institucija, banka ni brokerska kuća. Sudjelovanje znači nabaviti tehnologiju rudarenja i komunicirati s pametnim ugovorima koji se izvršavaju sami. Postoci su programirane stope izdavanja tokena, a ne bankovni proizvod ni zajamčen rezultat u dolarima; kriptoimovina je po prirodi volatilna.',
      ar: 'لا. AiGenesis نظام بيئي تقني قائم على البلوكشين — وليس مؤسسة مالية ولا مصرفية ولا شركة أوراق مالية. المشاركة تعني اقتناء تقنية تعدين والتفاعل مع عقود ذكية تُنفَّذ ذاتيًا. النِّسب هي معدلات إصدار مبرمجة للرمز، لا منتجًا مصرفيًا ولا نتيجة مضمونة بالدولار؛ والأصول المشفّرة متقلّبة بطبيعتها.',
      de: 'Nein. AiGenesis ist ein technologisches Ökosystem auf Blockchain-Basis — keine Finanzinstitution, keine Bank und kein Wertpapierhaus. Teilnehmen heißt, Mining-Technologie zu erwerben und mit Smart Contracts zu interagieren, die von selbst ausgeführt werden. Die Prozentsätze sind programmierte Ausgaberaten des Tokens, kein Bankprodukt und kein zugesichertes Ergebnis in Dollar; Krypto-Assets sind von Natur aus volatil.',
      sr: 'Не. AiGenesis је технолошки екосистем на блокчејну — није финансијска институција, банка ни брокерска кућа. Учешће значи набавити технологију рударења и комуницирати са паметним уговорима који се извршавају сами. Проценти су програмиране стопе издавања токена, а не банкарски производ ни загарантован резултат у доларима; криптоимовина је по природи волатилна.',
      ur: 'نہیں۔ AiGenesis بلاک چین پر مبنی ایک ٹیکنالوجی ایکو سسٹم ہے — کوئی مالیاتی ادارہ، بینک یا سیکیورٹیز فرم نہیں۔ شرکت کا مطلب ہے مائننگ ٹیکنالوجی حاصل کرنا اور خود چلنے والے سمارٹ کنٹریکٹس سے تعامل۔ فیصد پروٹوکول کے طے شدہ اجرا کی شرحیں ہیں، نہ بینکنگ پروڈکٹ نہ ڈالر میں یقینی نتیجہ؛ کرپٹو اثاثے فطرتاً غیر مستحکم ہیں۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · BOOSTER Y STAKING

     TRES INSTRUCCIONES QUE SALVAN DINERO, y las tres se dicen igual de firme en
     los once idiomas: «no repitas la compra», «guarda el hash» y «si cancelaste
     la firma, no se movió nada». La tercera es la que más tranquiliza y la que
     más se malinterpreta: cancelar en la wallet NO cobra.

     UNA RESPUESTA QUE DICE «NO LO SÉ», y se traduce tal cual. La del binario
     remite al equipo en vez de dar cifras, porque «un número equivocado sobre tu
     compensación es peor que pedirte un paso más». Rellenar ese hueco al
     traducir sería inventar un plan de compensación.
     ══════════════════════════════════════════════════════════════════ */
  'Pagué el booster y no se refleja en mi cuenta': {
    en: 'I paid for the booster and it is not showing in my account',
    pt: 'Paguei o booster e não se reflete na minha conta',
    fr: 'J’ai payé le booster et il n’apparaît pas sur mon compte',
    ru: 'Я оплатил booster, а в аккаунте он не отражается',
    sv: 'Jag betalade boostern och den syns inte på mitt konto',
    hr: 'Platio sam booster i ne vidi se na računu',
    ar: 'دفعت الـ booster ولا يظهر في حسابي',
    de: 'Ich habe den Booster bezahlt und er erscheint nicht in meinem Konto',
    sr: 'Платио сам booster и не види се на налогу',
    ur: 'میں نے booster کی ادائیگی کی اور یہ میرے اکاؤنٹ میں نہیں دکھتا',
  },
  'Primero: no repitas la compra ni reenvíes fondos. El pago del booster tiene dos pasos — la transacción en la cadena y el registro en el servidor — y a veces la cadena confirma antes de que el registro termine. Si el registro llega a fallar, el propio portal abre una incidencia en Soporte VIP con el hash de tu transacción para que el equipo la revise contra la cadena. Ten a mano ese hash: con él se reconstruye todo; sin él, no.':
    {
      en: 'First: do not repeat the purchase and do not resend funds. Paying for the booster has two steps — the on-chain transaction and the record on the server — and sometimes the chain confirms before the record finishes. If the record does fail, the portal itself opens a VIP Support case with your transaction hash so the team can check it against the chain. Keep that hash to hand: with it everything can be reconstructed; without it, nothing.',
      pt: 'Primeiro: não repita a compra nem reenvie fundos. O pagamento do booster tem dois passos — a transação na cadeia e o registro no servidor — e às vezes a cadeia confirma antes de o registro terminar. Se o registro chegar a falhar, o próprio portal abre um chamado no Suporte VIP com o hash da sua transação para que a equipe o verifique contra a cadeia. Tenha esse hash à mão: com ele se reconstrói tudo; sem ele, não.',
      fr: 'D’abord : ne répète pas l’achat et ne renvoie pas de fonds. Le paiement du booster comporte deux étapes — la transaction en chaîne et l’enregistrement sur le serveur — et parfois la chaîne confirme avant que l’enregistrement ne se termine. Si l’enregistrement échoue, le portail ouvre lui-même un ticket au Support VIP avec le hachage de ta transaction pour que l’équipe le vérifie face à la chaîne. Garde ce hachage sous la main : avec lui, tout se reconstitue ; sans lui, non.',
      ru: 'Первое: не повторяй покупку и не отправляй средства снова. Оплата booster состоит из двух шагов — транзакция в сети и запись на сервере, — и иногда сеть подтверждает раньше, чем запись завершится. Если запись всё же не прошла, портал сам открывает обращение в VIP-поддержку с хешем твоей транзакции, чтобы команда сверила его с цепочкой. Держи этот хеш под рукой: с ним восстанавливается всё; без него — ничего.',
      sv: 'Först: upprepa inte köpet och skicka inte pengar igen. Betalningen av boostern har två steg — transaktionen på kedjan och registreringen på servern — och ibland bekräftar kedjan innan registreringen hunnit klart. Om registreringen faktiskt misslyckas öppnar portalen själv ett ärende hos VIP-supporten med din transaktionshash, så teamet kan stämma av mot kedjan. Ha den hashen till hands: med den går allt att rekonstruera; utan den, inget.',
      hr: 'Prvo: nemoj ponavljati kupnju ni ponovno slati sredstva. Plaćanje boostera ima dva koraka — transakciju na lancu i zapis na poslužitelju — i ponekad lanac potvrdi prije nego zapis završi. Ako zapis ipak zakaže, sam portal otvara slučaj u VIP podršci s hashom tvoje transakcije kako bi ga tim provjerio prema lancu. Drži taj hash pri ruci: s njim se sve rekonstruira; bez njega, ništa.',
      ar: 'أولًا: لا تُكرّر الشراء ولا تُعِد إرسال الأموال. دفع الـ booster يتكوّن من خطوتين — المعاملة على السلسلة والتسجيل في الخادم — وأحيانًا تؤكّد السلسلة قبل أن ينتهي التسجيل. وإذا فشل التسجيل فعلًا، تفتح البوابة نفسها بلاغًا في دعم VIP مع hash معاملتك ليراجعه الفريق مقابل السلسلة. احتفظ بذلك الـ hash: به يُعاد بناء كل شيء؛ وبدونه، لا شيء.',
      de: 'Zuerst: wiederhole den Kauf nicht und sende keine Mittel erneut. Die Booster-Zahlung hat zwei Schritte — die Transaktion auf der Chain und die Erfassung auf dem Server — und manchmal bestätigt die Chain, bevor die Erfassung fertig ist. Scheitert die Erfassung tatsächlich, öffnet das Portal selbst einen Vorgang im VIP-Support mit dem Hash deiner Transaktion, damit das Team ihn gegen die Chain prüft. Halte diesen Hash bereit: mit ihm lässt sich alles rekonstruieren; ohne ihn nichts.',
      sr: 'Прво: немој понављати куповину ни поново слати средства. Плаћање boostera има два корака — трансакцију на ланцу и запис на серверу — и понекад ланац потврди пре него што запис заврши. Ако запис ипак закаже, сам портал отвара случај у VIP подршци са hash-ом твоје трансакције како би га тим проверио према ланцу. Држи тај hash при руци: с њим се све реконструише; без њега, ништа.',
      ur: 'پہلے: خریداری نہ دہرائیں اور نہ دوبارہ رقم بھیجیں۔ booster کی ادائیگی کے دو مرحلے ہیں — چین پر ٹرانزیکشن اور سرور پر اندراج — اور کبھی چین اندراج مکمل ہونے سے پہلے تصدیق کر دیتی ہے۔ اگر اندراج واقعی ناکام ہو تو پورٹل خود VIP سپورٹ میں آپ کی ٹرانزیکشن کے hash کے ساتھ کیس کھول دیتا ہے تاکہ ٹیم اسے چین سے ملا کر دیکھے۔ وہ hash پاس رکھیں: اُس سے سب کچھ دوبارہ بنایا جا سکتا ہے؛ اُس کے بغیر کچھ نہیں۔',
    },
  'Cancelé la firma en la wallet — ¿se cobró algo?': {
    en: 'I cancelled the signature in my wallet — was I charged anything?',
    pt: 'Cancelei a assinatura na carteira — foi cobrado algo?',
    fr: 'J’ai annulé la signature dans le portefeuille — ai-je été débité ?',
    ru: 'Я отменил подпись в кошельке — списалось что-нибудь?',
    sv: 'Jag avbröt signeringen i plånboken — drogs något?',
    hr: 'Otkazao sam potpis u novčaniku — je li nešto naplaćeno?',
    ar: 'ألغيت التوقيع في المحفظة — هل خُصم شيء؟',
    de: 'Ich habe die Signatur in der Wallet abgebrochen — wurde etwas abgebucht?',
    sr: 'Отказао сам потпис у новчанику — да ли је нешто наплаћено?',
    ur: 'میں نے والٹ میں دستخط منسوخ کیا — کیا کچھ کٹا؟',
  },
  'No. Si cancelas la firma en tu wallet, la transacción nunca sale: no se mueve nada y no hay nada que revertir. Puedes intentarlo de nuevo cuando quieras. Solo si FIRMASTE y luego algo falló vale la pena revisar: en ese caso guarda el hash de la transacción y escribe a soporte con él.':
    {
      en: 'No. If you cancel the signature in your wallet, the transaction never goes out: nothing moves and there is nothing to reverse. You can try again whenever you want. Only if you DID sign and something failed afterwards is it worth reviewing: in that case keep the transaction hash and write to support with it.',
      pt: 'Não. Se você cancela a assinatura na sua carteira, a transação nunca sai: nada se move e não há nada a reverter. Pode tentar de novo quando quiser. Só se você ASSINOU e depois algo falhou vale a pena revisar: nesse caso guarde o hash da transação e escreva ao suporte com ele.',
      fr: 'Non. Si tu annules la signature dans ton portefeuille, la transaction ne part jamais : rien ne bouge et il n’y a rien à annuler. Tu peux réessayer quand tu veux. Ce n’est que si tu AS signé et qu’ensuite quelque chose a échoué qu’il faut vérifier : dans ce cas, garde le hachage de la transaction et écris au support avec.',
      ru: 'Нет. Если ты отменяешь подпись в кошельке, транзакция вообще не уходит: ничего не двигается и отменять нечего. Можешь попробовать снова когда угодно. Проверять стоит только если ты ПОДПИСАЛ, а потом что-то не сработало: тогда сохрани хеш транзакции и напиши в поддержку с ним.',
      sv: 'Nej. Om du avbryter signeringen i plånboken går transaktionen aldrig iväg: inget flyttas och det finns inget att återkalla. Du kan försöka igen när du vill. Bara om du VERKLIGEN signerade och något sedan gick fel är det värt att titta på: spara i så fall transaktionshashen och skriv till supporten med den.',
      hr: 'Ne. Ako otkažeš potpis u svom novčaniku, transakcija nikad ne izađe: ništa se ne pomiče i nema što poništiti. Možeš pokušati ponovno kad želiš. Samo ako si POTPISAO pa je zatim nešto zakazalo vrijedi provjeriti: u tom slučaju sačuvaj hash transakcije i javi se podršci s njim.',
      ar: 'لا. إذا ألغيت التوقيع في محفظتك، فالمعاملة لا تخرج أصلًا: لا يتحرك شيء ولا يوجد ما يُعكس. يمكنك المحاولة مجددًا متى شئت. فقط إذا كنت قد وقّعت ثم فشل شيء بعد ذلك يستحق الأمر المراجعة: عندها احتفظ بـ hash المعاملة وراسل الدعم به.',
      de: 'Nein. Wenn du die Signatur in deiner Wallet abbrichst, geht die Transaktion gar nicht erst raus: Es bewegt sich nichts und es gibt nichts rückgängig zu machen. Du kannst es jederzeit erneut versuchen. Nur wenn du signiert hast und danach etwas fehlschlug, lohnt eine Prüfung: Bewahre in dem Fall den Transaktions-Hash auf und schreib damit an den Support.',
      sr: 'Не. Ако откажеш потпис у свом новчанику, трансакција никад не изађе: ништа се не помера и нема шта да се поништи. Можеш покушати поново кад желиш. Само ако си ПОТПИСАО па је затим нешто пошло по злу вреди проверити: у том случају сачувај hash трансакције и јави се подршци с њим.',
      ur: 'نہیں۔ اگر آپ اپنے والٹ میں دستخط منسوخ کرتے ہیں تو ٹرانزیکشن نکلتی ہی نہیں: کچھ نہیں ہلتا اور واپس کرنے کو کچھ نہیں۔ جب چاہیں دوبارہ کوشش کریں۔ صرف اُس صورت میں دیکھنا بنتا ہے جب آپ نے دستخط کیا ہو اور اس کے بعد کچھ ناکام ہوا ہو: تب ٹرانزیکشن کا hash محفوظ رکھیں اور اُسی کے ساتھ سپورٹ کو لکھیں۔',
    },
  '¿Qué es el rebooster?': {
    en: 'What is the rebooster?', pt: 'O que é o rebooster?',
    fr: 'Qu’est-ce que le rebooster ?', ru: 'Что такое rebooster?',
    sv: 'Vad är rebooster?', hr: 'Što je rebooster?',
    ar: 'ما هو الـ rebooster؟', de: 'Was ist der Rebooster?',
    sr: 'Шта је rebooster?', ur: 'rebooster کیا ہے؟',
  },
  'Es la reinversión desde tu saldo de booster: en lugar de traer fondos nuevos desde la wallet, usas lo ya generado para reforzar el paquete. Tras confirmar, el registro sigue el mismo camino que una compra de booster — así que si algo no se refleja, aplica lo mismo: no repitas la operación y guarda el detalle de la confirmación para soporte.':
    {
      en: 'It is reinvestment from your booster balance: instead of bringing new funds from the wallet, you use what has already been generated to reinforce the pack. After confirming, the record follows the same path as a booster purchase — so if something does not show up, the same applies: do not repeat the operation and keep the confirmation details for support.',
      pt: 'É o reinvestimento a partir do seu saldo de booster: em vez de trazer fundos novos da carteira, você usa o já gerado para reforçar o pacote. Após confirmar, o registro segue o mesmo caminho de uma compra de booster — então, se algo não se refletir, aplica-se o mesmo: não repita a operação e guarde o detalhe da confirmação para o suporte.',
      fr: 'C’est le réinvestissement depuis ton solde de booster : au lieu d’apporter de nouveaux fonds depuis le portefeuille, tu utilises ce qui a déjà été généré pour renforcer le pack. Après confirmation, l’enregistrement suit le même chemin qu’un achat de booster — donc si quelque chose n’apparaît pas, c’est pareil : ne répète pas l’opération et garde le détail de la confirmation pour le support.',
      ru: 'Это реинвестирование из твоего баланса booster: вместо того чтобы заводить новые средства из кошелька, ты используешь уже начисленное, чтобы усилить пакет. После подтверждения запись идёт тем же путём, что и покупка booster — так что если что-то не отражается, работает то же правило: не повторяй операцию и сохрани детали подтверждения для поддержки.',
      sv: 'Det är återinvestering från ditt boostersaldo: i stället för att föra in nya medel från plånboken använder du det som redan genererats för att förstärka paketet. Efter bekräftelsen följer registreringen samma väg som ett boosterköp — så om något inte syns gäller samma sak: upprepa inte operationen och spara bekräftelsens detaljer till supporten.',
      hr: 'To je reinvestiranje iz tvog stanja boostera: umjesto da dovodiš nova sredstva iz novčanika, koristiš već ostvareno za jačanje paketa. Nakon potvrde zapis ide istim putem kao kupnja boostera — pa ako se nešto ne vidi, vrijedi isto: nemoj ponavljati operaciju i sačuvaj detalje potvrde za podršku.',
      ar: 'هو إعادة استثمار من رصيد الـ booster لديك: بدل جلب أموال جديدة من المحفظة، تستخدم ما تولّد بالفعل لتعزيز الباقة. بعد التأكيد يسلك التسجيل المسار نفسه لشراء booster — فإذا لم يظهر شيء، ينطبق الأمر ذاته: لا تُكرّر العملية واحتفظ بتفاصيل التأكيد للدعم.',
      de: 'Das ist die Reinvestition aus deinem Booster-Guthaben: statt neue Mittel aus der Wallet zu holen, nutzt du das bereits Erzeugte, um das Paket zu verstärken. Nach dem Bestätigen geht die Erfassung denselben Weg wie ein Booster-Kauf — wenn also etwas nicht erscheint, gilt dasselbe: wiederhole den Vorgang nicht und bewahre die Bestätigungsdetails für den Support auf.',
      sr: 'То је реинвестирање из твог стања boostera: уместо да доводиш нова средства из новчаника, користиш већ остварено да ојачаш пакет. Након потврде запис иде истим путем као куповина boostera — па ако се нешто не види, важи исто: немој понављати операцију и сачувај детаље потврде за подршку.',
      ur: 'یہ آپ کے booster بیلنس سے دوبارہ سرمایہ کاری ہے: والٹ سے نئی رقم لانے کے بجائے آپ پہلے سے بنی رقم سے پیکج مضبوط کرتے ہیں۔ تصدیق کے بعد اندراج booster کی خریداری والا ہی راستہ لیتا ہے — تو اگر کچھ ظاہر نہ ہو تو وہی اصول: عمل نہ دہرائیں اور تصدیق کی تفصیل سپورٹ کے لیے محفوظ رکھیں۔',
    },
  '¿Cómo se calcula la compensación del binario y los equipos?': {
    en: 'How is the binary and team compensation calculated?',
    pt: 'Como se calcula a compensação do binário e das equipes?',
    fr: 'Comment se calcule la rémunération du binaire et des équipes ?',
    ru: 'Как рассчитывается вознаграждение по бинару и командам?',
    sv: 'Hur beräknas ersättningen för binären och teamen?',
    hr: 'Kako se računa naknada za binarni sustav i timove?',
    ar: 'كيف تُحتسب مكافأة النظام الثنائي والفرق؟',
    de: 'Wie wird die Binär- und Team-Vergütung berechnet?',
    sr: 'Како се рачуна накнада за бинарни систем и тимове?',
    ur: 'بائنری اور ٹیموں کا معاوضہ کیسے نکالا جاتا ہے؟',
  },
  'Los porcentajes y condiciones exactos del plan de compensación los confirma el equipo por los canales oficiales — preferimos no publicarte una cifra aquí sin esa confirmación, porque un número equivocado sobre tu compensación es peor que pedirte un paso más. Escríbenos por el canal oficial con tu usuario y te lo detallan sobre tu caso.':
    {
      en: 'The exact percentages and conditions of the compensation plan are confirmed by the team through the official channels — we would rather not publish a figure here without that confirmation, because a wrong number about your compensation is worse than asking you for one more step. Write to us through the official channel with your username and they will detail it for your case.',
      pt: 'As porcentagens e condições exatas do plano de compensação são confirmadas pela equipe pelos canais oficiais — preferimos não publicar uma cifra aqui sem essa confirmação, porque um número errado sobre sua compensação é pior do que lhe pedir um passo a mais. Escreva-nos pelo canal oficial com seu usuário e detalham para o seu caso.',
      fr: 'Les pourcentages et conditions exacts du plan de rémunération sont confirmés par l’équipe via les canaux officiels — nous préférons ne pas publier un chiffre ici sans cette confirmation, car un mauvais nombre sur ta rémunération est pire que de te demander une étape de plus. Écris-nous par le canal officiel avec ton identifiant et on te le détaillera pour ton cas.',
      ru: 'Точные проценты и условия плана вознаграждения подтверждает команда по официальным каналам — мы предпочитаем не публиковать здесь цифру без такого подтверждения, потому что неверное число о твоём вознаграждении хуже, чем просьба сделать ещё один шаг. Напиши нам по официальному каналу с твоим логином, и тебе распишут по твоему случаю.',
      sv: 'De exakta procentsatserna och villkoren i ersättningsplanen bekräftas av teamet via de officiella kanalerna — vi publicerar hellre ingen siffra här utan den bekräftelsen, eftersom ett felaktigt tal om din ersättning är värre än att be dig om ett steg till. Skriv till oss via den officiella kanalen med ditt användarnamn så går de igenom det för ditt fall.',
      hr: 'Točne postotke i uvjete plana naknada potvrđuje tim putem službenih kanala — radije ne objavljujemo brojku ovdje bez te potvrde, jer je pogrešan broj o tvojoj naknadi gori nego da te zamolimo za jedan korak više. Javi nam se službenim kanalom sa svojim korisničkim imenom i razradit će ti to za tvoj slučaj.',
      ar: 'النِّسب والشروط الدقيقة لخطة المكافآت يؤكّدها الفريق عبر القنوات الرسمية — نفضّل ألا ننشر لك رقمًا هنا دون ذلك التأكيد، لأن رقمًا خاطئًا عن مكافأتك أسوأ من أن نطلب منك خطوة إضافية. راسلنا عبر القناة الرسمية باسم المستخدم الخاص بك وسيوضّحونه لحالتك.',
      de: 'Die genauen Prozentsätze und Bedingungen des Vergütungsplans bestätigt das Team über die offiziellen Kanäle — wir veröffentlichen hier lieber keine Zahl ohne diese Bestätigung, denn eine falsche Zahl zu deiner Vergütung ist schlimmer, als dich um einen Schritt mehr zu bitten. Schreib uns über den offiziellen Kanal mit deinem Benutzernamen, dann wird es für deinen Fall aufgeschlüsselt.',
      sr: 'Тачне проценте и услове плана накнада потврђује тим путем званичних канала — радије не објављујемо бројку овде без те потврде, јер је погрешан број о твојој накнади гори него да те замолимо за један корак више. Јави нам се званичним каналом са својим корисничким именом и разрадиће ти то за твој случај.',
      ur: 'معاوضے کے پلان کے درست فیصد اور شرائط ٹیم سرکاری چینلز پر تصدیق کرتی ہے — ہم اُس تصدیق کے بغیر یہاں کوئی عدد شائع نہیں کرنا چاہتے، کیونکہ آپ کے معاوضے کے بارے میں غلط عدد ایک اضافی قدم مانگنے سے بدتر ہے۔ سرکاری چینل پر اپنے صارف نام کے ساتھ لکھیں، وہ آپ کے کیس کے مطابق تفصیل دیں گے۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · ALIANZA AITECH

     LA CATEGORÍA CON MÁS PESO LEGAL DEL CORPUS, y la que más cuidado pide.

     La respuesta de las credenciales es un ejercicio de precisión: dice
     «SEGÚN la documentación oficial», «la estructura DECLARA», «sujeto a sus
     términos», «aquí SÓLO REPETIMOS lo que dice el material, no lo
     certificamos». Cada una de esas cautelas está puesta a propósito, y una
     traducción que las suavice convierte una atribución en un aval.

     Traducir «declara registros» por «tiene registros» sería exactamente eso.
     En los once idiomas se mantiene el verbo de atribución.

     LOS NOMBRES DE LICENCIANTES NO SE TOCAN — Lloyd's of London, FSC Mauritius,
     FSCA, DASP, MSB — porque son lo único que permite verificarlos en su
     registro. Los países SÍ, que es lo que se lee.
     ══════════════════════════════════════════════════════════════════ */
  'Aitech One es una alianza entre Aitech —una comunidad y compañía internacional— y Genesis, presentada como una «trilogía financiera»: tres unidades dentro de un mismo ecosistema. Son: Tag Markets (trading sistemático), Bit1 (exchange de activos digitales) y BixCard/BIX (una tarjeta Visa respaldada por cripto). Genesis se une a esta alianza para sumar comunidad y dar usabilidad y liquidez al AiG Token a través de sus productos. Es material informativo: no es asesoría financiera y la participación es voluntaria y con riesgos.':
    {
      en: 'Aitech One is an alliance between Aitech — an international community and company — and Genesis, presented as a “financial trilogy”: three units within a single ecosystem. They are: Tag Markets (systematic trading), Bit1 (digital asset exchange) and BixCard/BIX (a crypto-backed Visa card). Genesis joins this alliance to add community and to give the AiG Token usability and liquidity through its products. This is informational material: it is not financial advice, and participation is voluntary and carries risk.',
      pt: 'A Aitech One é uma aliança entre a Aitech — uma comunidade e companhia internacional — e a Genesis, apresentada como uma «trilogia financeira»: três unidades dentro de um mesmo ecossistema. São: Tag Markets (trading sistemático), Bit1 (exchange de ativos digitais) e BixCard/BIX (um cartão Visa lastreado em cripto). A Genesis se une a esta aliança para somar comunidade e dar usabilidade e liquidez ao AiG Token através de seus produtos. É material informativo: não é assessoria financeira e a participação é voluntária e com riscos.',
      fr: 'Aitech One est une alliance entre Aitech — une communauté et société internationale — et Genesis, présentée comme une « trilogie financière » : trois unités au sein d’un même écosystème. Ce sont : Tag Markets (trading systématique), Bit1 (plateforme d’actifs numériques) et BixCard/BIX (une carte Visa adossée à la crypto). Genesis rejoint cette alliance pour apporter la communauté et donner au AiG Token utilité et liquidité à travers ses produits. Document d’information : ce n’est pas un conseil financier et la participation est volontaire et comporte des risques.',
      ru: 'Aitech One — это альянс между Aitech, международным сообществом и компанией, и Genesis, представленный как «финансовая трилогия»: три подразделения в рамках одной экосистемы. Это Tag Markets (системный трейдинг), Bit1 (биржа цифровых активов) и BixCard/BIX (карта Visa с криптообеспечением). Genesis присоединяется к альянсу, чтобы добавить сообщество и дать AiG Token применимость и ликвидность через свои продукты. Это информационный материал: не финансовая консультация; участие добровольное и сопряжено с рисками.',
      sv: 'Aitech One är en allians mellan Aitech — en internationell gemenskap och ett företag — och Genesis, presenterad som en ”finansiell trilogi”: tre enheter inom ett och samma ekosystem. De är: Tag Markets (systematisk handel), Bit1 (börs för digitala tillgångar) och BixCard/BIX (ett kryptotäckt Visakort). Genesis ansluter sig till alliansen för att bidra med gemenskap och ge AiG Token användbarhet och likviditet genom sina produkter. Detta är informationsmaterial: inte finansiell rådgivning, och deltagandet är frivilligt och innebär risker.',
      hr: 'Aitech One je savez između Aitecha — međunarodne zajednice i tvrtke — i Genesisa, predstavljen kao «financijska trilogija»: tri jedinice unutar istog ekosustava. To su: Tag Markets (sustavno trgovanje), Bit1 (burza digitalne imovine) i BixCard/BIX (Visa kartica pokrivena kriptom). Genesis se pridružuje ovom savezu kako bi donio zajednicu te dao AiG Tokenu upotrebljivost i likvidnost kroz svoje proizvode. Ovo je informativni materijal: nije financijski savjet, a sudjelovanje je dobrovoljno i nosi rizike.',
      ar: 'Aitech One تحالف بين Aitech — مجتمع وشركة دولية — و Genesis، مُقدَّم بوصفه «ثلاثية مالية»: ثلاث وحدات داخل نظام بيئي واحد. وهي: Tag Markets (تداول منهجي) و Bit1 (منصة أصول رقمية) و BixCard/BIX (بطاقة Visa مدعومة بالتشفير). تنضم Genesis إلى هذا التحالف لتضيف المجتمع وتمنح AiG Token قابلية استخدام وسيولة عبر منتجاتها. هذه مادة إعلامية: ليست استشارة مالية، والمشاركة طوعية وتنطوي على مخاطر.',
      de: 'Aitech One ist eine Allianz zwischen Aitech — einer internationalen Community und Firma — und Genesis, vorgestellt als „finanzielle Trilogie“: drei Einheiten innerhalb eines Ökosystems. Es sind: Tag Markets (systematisches Trading), Bit1 (Börse für digitale Vermögenswerte) und BixCard/BIX (eine krypto-gedeckte Visa-Karte). Genesis schließt sich dieser Allianz an, um Community beizusteuern und dem AiG Token über seine Produkte Nutzbarkeit und Liquidität zu geben. Dies ist Informationsmaterial: keine Finanzberatung; die Teilnahme ist freiwillig und mit Risiken verbunden.',
      sr: 'Aitech One је савез између Aitech-а — међународне заједнице и компаније — и Genesis-а, представљен као «финансијска трилогија»: три јединице унутар истог екосистема. То су: Tag Markets (системско трговање), Bit1 (берза дигиталне имовине) и BixCard/BIX (Visa картица покривена криптом). Genesis се придружује овом савезу да донесе заједницу и да AiG Token-у употребљивост и ликвидност кроз своје производе. Ово је информативни материјал: није финансијски савет, а учешће је добровољно и носи ризике.',
      ur: 'Aitech One، Aitech — ایک بین الاقوامی کمیونٹی اور کمپنی — اور Genesis کے درمیان اتحاد ہے، جسے ایک «مالیاتی سہ گانہ» کے طور پر پیش کیا جاتا ہے: ایک ہی ایکو سسٹم کے اندر تین اکائیاں۔ یہ ہیں: Tag Markets (سسٹمیٹک ٹریڈنگ)، Bit1 (ڈیجیٹل اثاثوں کا ایکسچینج) اور BixCard/BIX (کرپٹو سے سپورٹ شدہ ویزا کارڈ)۔ Genesis اس اتحاد میں کمیونٹی شامل کرنے اور اپنی مصنوعات کے ذریعے AiG Token کو افادیت اور لیکویڈیٹی دینے کے لیے شریک ہوتا ہے۔ یہ معلوماتی مواد ہے: مالی مشورہ نہیں، اور شرکت رضاکارانہ اور خطرات کے ساتھ ہے۔',
    },
  'La idea de la alianza es dar usabilidad real al AiG Token. Dentro de los productos de Aitech One, el AiG se usa junto con USDT en formato DUAL (AIG-USDT) como capital operativo, y así el token gana demanda y liquidez por el uso de la comunidad. En resumen: el AiG pasa a ser uno de los medios aceptados para operar en la alianza, en lugar de quedarse quieto. Cuánto y cómo se aplica en cada producto se ve en los canales oficiales; esto es informativo, no una recomendación.':
    {
      en: 'The point of the alliance is to give the AiG Token real usability. Within Aitech One’s products, AiG is used alongside USDT in DUAL format (AIG-USDT) as operating capital, so the token gains demand and liquidity through community use. In short: AiG becomes one of the accepted means of operating within the alliance, instead of sitting still. How much and how it applies in each product is shown in the official channels; this is informational, not a recommendation.',
      pt: 'A ideia da aliança é dar usabilidade real ao AiG Token. Dentro dos produtos da Aitech One, o AiG é usado junto com USDT no formato DUAL (AIG-USDT) como capital operacional, e assim o token ganha demanda e liquidez pelo uso da comunidade. Em resumo: o AiG passa a ser um dos meios aceitos para operar na aliança, em vez de ficar parado. Quanto e como se aplica em cada produto se vê nos canais oficiais; isto é informativo, não uma recomendação.',
      fr: 'L’idée de l’alliance est de donner au AiG Token une utilité réelle. Au sein des produits d’Aitech One, l’AiG s’utilise avec l’USDT au format DUAL (AIG-USDT) comme capital opérationnel, et le jeton gagne ainsi de la demande et de la liquidité par l’usage de la communauté. En résumé : l’AiG devient l’un des moyens acceptés pour opérer dans l’alliance, au lieu de rester immobile. Combien et comment cela s’applique à chaque produit se voit dans les canaux officiels ; ceci est informatif, pas une recommandation.',
      ru: 'Смысл альянса — дать AiG Token реальную применимость. Внутри продуктов Aitech One AiG используется вместе с USDT в формате DUAL (AIG-USDT) как операционный капитал, и так токен получает спрос и ликвидность за счёт использования сообществом. Коротко: AiG становится одним из принимаемых средств для работы в альянсе, вместо того чтобы лежать без движения. Сколько и как это применяется в каждом продукте — в официальных каналах; это информация, а не рекомендация.',
      sv: 'Tanken med alliansen är att ge AiG Token verklig användbarhet. Inom Aitech Ones produkter används AiG tillsammans med USDT i DUAL-format (AIG-USDT) som handelskapital, och token får så efterfrågan och likviditet genom gemenskapens användning. Kort sagt: AiG blir ett av de accepterade medlen för att handla inom alliansen, i stället för att ligga stilla. Hur mycket och hur det tillämpas i varje produkt visas i de officiella kanalerna; detta är information, inte en rekommendation.',
      hr: 'Ideja saveza je dati AiG Tokenu stvarnu upotrebljivost. Unutar proizvoda Aitech Onea AiG se koristi zajedno s USDT-om u DUAL formatu (AIG-USDT) kao operativni kapital, pa token tako dobiva potražnju i likvidnost kroz korištenje zajednice. Ukratko: AiG postaje jedno od prihvaćenih sredstava za poslovanje u savezu, umjesto da miruje. Koliko se i kako primjenjuje u svakom proizvodu vidi se u službenim kanalima; ovo je informativno, nije preporuka.',
      ar: 'فكرة التحالف هي منح AiG Token قابلية استخدام حقيقية. ضمن منتجات Aitech One يُستخدم AiG مع USDT بصيغة DUAL ‏(AIG-USDT) كرأس مال تشغيلي، فيكتسب الرمز طلبًا وسيولة من استخدام المجتمع. باختصار: يصبح AiG أحد الوسائل المقبولة للتعامل داخل التحالف بدل أن يبقى ساكنًا. مقدار ذلك وكيفية تطبيقه في كل منتج يظهر في القنوات الرسمية؛ هذا للإعلام، لا توصية.',
      de: 'Die Idee der Allianz ist, dem AiG Token echte Nutzbarkeit zu geben. Innerhalb der Produkte von Aitech One wird AiG zusammen mit USDT im DUAL-Format (AIG-USDT) als Handelskapital genutzt, und so gewinnt der Token durch die Nutzung der Community Nachfrage und Liquidität. Kurz: AiG wird zu einem der akzeptierten Mittel, um in der Allianz zu handeln, statt still zu liegen. Wie viel und wie das in jedem Produkt gilt, steht in den offiziellen Kanälen; dies ist Information, keine Empfehlung.',
      sr: 'Идеја савеза је дати AiG Token-у стварну употребљивост. Унутар производа Aitech One-а AiG се користи заједно са USDT-ом у DUAL формату (AIG-USDT) као оперативни капитал, па токен тако добија потражњу и ликвидност кроз коришћење заједнице. Укратко: AiG постаје једно од прихваћених средстава за пословање у савезу, уместо да мирује. Колико се и како примењује у сваком производу види се у званичним каналима; ово је информативно, није препорука.',
      ur: 'اتحاد کا مقصد AiG Token کو حقیقی افادیت دینا ہے۔ Aitech One کی مصنوعات کے اندر AiG، USDT کے ساتھ DUAL فارمیٹ (AIG-USDT) میں آپریٹنگ سرمائے کے طور پر استعمال ہوتا ہے، اور یوں کمیونٹی کے استعمال سے ٹوکن کو طلب اور لیکویڈیٹی ملتی ہے۔ مختصراً: AiG اتحاد میں کام کرنے کے قبول شدہ ذرائع میں سے ایک بن جاتا ہے، ساکن رہنے کے بجائے۔ ہر پروڈکٹ میں یہ کتنا اور کیسے لاگو ہوتا ہے، یہ سرکاری چینلز پر دکھتا ہے؛ یہ معلوماتی ہے، سفارش نہیں۔',
    },
  '¿Qué es Bit1?': {
    en: 'What is Bit1?', pt: 'O que é a Bit1?', fr: 'Qu’est-ce que Bit1 ?',
    ru: 'Что такое Bit1?', sv: 'Vad är Bit1?', hr: 'Što je Bit1?',
    ar: 'ما هو Bit1؟', de: 'Was ist Bit1?', sr: 'Шта је Bit1?', ur: 'Bit1 کیا ہے؟',
  },
  'Bit1 es el exchange de la alianza Aitech One: una plataforma para comprar, intercambiar y operar activos digitales, con presencia internacional. Según su material, ofrece compra de cripto, intercambio rápido (swap), comercio P2P, futuros y copy trading, y funciones para gastar cripto en muchos comercios. Su web oficial es bit1.com. Como toda operación con activos digitales, conlleva riesgos y la decisión es de cada persona.':
    {
      en: 'Bit1 is the Aitech One alliance’s exchange: a platform to buy, swap and trade digital assets, with an international presence. According to its material, it offers crypto purchase, quick swap, P2P trading, futures and copy trading, plus features to spend crypto at many merchants. Its official site is bit1.com. Like any operation with digital assets, it carries risk and the decision is each person’s own.',
      pt: 'A Bit1 é a exchange da aliança Aitech One: uma plataforma para comprar, trocar e operar ativos digitais, com presença internacional. Segundo seu material, oferece compra de cripto, troca rápida (swap), comércio P2P, futuros e copy trading, e funções para gastar cripto em muitos comércios. Seu site oficial é bit1.com. Como toda operação com ativos digitais, envolve riscos e a decisão é de cada pessoa.',
      fr: 'Bit1 est la plateforme d’échange de l’alliance Aitech One : un service pour acheter, échanger et négocier des actifs numériques, avec une présence internationale. Selon son matériel, elle propose l’achat de crypto, l’échange rapide (swap), le commerce P2P, les futures et le copy trading, ainsi que des fonctions pour dépenser de la crypto chez de nombreux commerçants. Son site officiel est bit1.com. Comme toute opération sur actifs numériques, cela comporte des risques et la décision appartient à chacun.',
      ru: 'Bit1 — биржа альянса Aitech One: платформа для покупки, обмена и торговли цифровыми активами с международным присутствием. Согласно её материалам, она предлагает покупку крипто, быстрый обмен (swap), P2P-торговлю, фьючерсы и копитрейдинг, а также функции для трат крипто у многих продавцов. Официальный сайт — bit1.com. Как и любая операция с цифровыми активами, это сопряжено с рисками, и решение принимает каждый сам.',
      sv: 'Bit1 är Aitech One-alliansens börs: en plattform för att köpa, växla och handla digitala tillgångar, med internationell närvaro. Enligt materialet erbjuder den köp av krypto, snabb växling (swap), P2P-handel, terminer och copy trading, samt funktioner för att spendera krypto hos många handlare. Den officiella webbplatsen är bit1.com. Som all handel med digitala tillgångar innebär det risker och beslutet är var och ens eget.',
      hr: 'Bit1 je burza saveza Aitech One: platforma za kupnju, zamjenu i trgovanje digitalnom imovinom, s međunarodnom prisutnošću. Prema njihovu materijalu, nudi kupnju kripta, brzu zamjenu (swap), P2P trgovanje, budućnosnice i copy trading, te mogućnosti trošenja kripta kod mnogih trgovaca. Službena stranica je bit1.com. Kao i svako poslovanje digitalnom imovinom, nosi rizike i odluka je svačija vlastita.',
      ar: 'Bit1 هي منصة تداول تحالف Aitech One: منصة لشراء الأصول الرقمية ومبادلتها وتداولها، بحضور دولي. وفق موادها، تقدّم شراء العملات المشفّرة والمبادلة السريعة (swap) والتداول P2P والعقود الآجلة ونسخ التداول، ووظائف لإنفاق العملات المشفّرة لدى متاجر كثيرة. موقعها الرسمي bit1.com. وكأي تعامل بالأصول الرقمية، ينطوي على مخاطر والقرار يخصّ كل شخص.',
      de: 'Bit1 ist die Börse der Aitech-One-Allianz: eine Plattform zum Kaufen, Tauschen und Handeln digitaler Vermögenswerte, mit internationaler Präsenz. Laut ihrem Material bietet sie Krypto-Kauf, schnellen Tausch (Swap), P2P-Handel, Futures und Copy Trading sowie Funktionen, um Krypto bei vielen Händlern auszugeben. Die offizielle Seite ist bit1.com. Wie jeder Handel mit digitalen Vermögenswerten birgt das Risiken, und die Entscheidung liegt bei jeder Person selbst.',
      sr: 'Bit1 је берза савеза Aitech One: платформа за куповину, замену и трговање дигиталном имовином, са међународним присуством. Према њиховом материјалу, нуди куповину крипта, брзу замену (swap), P2P трговање, фјучерсе и copy trading, те могућности трошења крипта код многих трговаца. Званична страница је bit1.com. Као и свако пословање дигиталном имовином, носи ризике и одлука је свачија сопствена.',
      ur: 'Bit1، Aitech One اتحاد کا ایکسچینج ہے: ڈیجیٹل اثاثے خریدنے، بدلنے اور ٹریڈ کرنے کا پلیٹ فارم، بین الاقوامی موجودگی کے ساتھ۔ اس کے مواد کے مطابق یہ کرپٹو کی خریداری، تیز تبادلہ (swap)، P2P تجارت، فیوچرز اور copy trading، اور بہت سے تاجروں کے ہاں کرپٹو خرچ کرنے کی سہولتیں دیتا ہے۔ سرکاری سائٹ bit1.com ہے۔ ڈیجیٹل اثاثوں کے ہر کام کی طرح اس میں خطرات ہیں اور فیصلہ ہر شخص کا اپنا ہے۔',
    },
  'BixCard (BIX) es la tarjeta Visa de la alianza Aitech One: permite usar tus activos digitales en el mundo real, donde acepten Visa. Según su material, es no-custodial (tú mantienes el control de tus llaves y tu cripto), admite colateral en USDT y USDC en varias redes, es compatible con Apple Pay y Google Pay, y suma beneficios de la línea Visa Signature. Es una forma de dar uso cotidiano a la cripto; su disponibilidad por país se confirma en los canales oficiales.':
    {
      en: 'BixCard (BIX) is the Aitech One alliance’s Visa card: it lets you use your digital assets in the real world, wherever Visa is accepted. According to its material, it is non-custodial (you keep control of your keys and your crypto), accepts USDT and USDC collateral on several networks, works with Apple Pay and Google Pay, and adds Visa Signature line benefits. It is a way to give crypto everyday use; availability by country is confirmed in the official channels.',
      pt: 'O BixCard (BIX) é o cartão Visa da aliança Aitech One: permite usar seus ativos digitais no mundo real, onde aceitem Visa. Segundo seu material, é não-custodial (você mantém o controle das suas chaves e da sua cripto), admite colateral em USDT e USDC em várias redes, é compatível com Apple Pay e Google Pay, e soma benefícios da linha Visa Signature. É uma forma de dar uso cotidiano à cripto; sua disponibilidade por país se confirma nos canais oficiais.',
      fr: 'BixCard (BIX) est la carte Visa de l’alliance Aitech One : elle permet d’utiliser tes actifs numériques dans le monde réel, partout où Visa est accepté. Selon son matériel, elle est non-custodiale (tu gardes le contrôle de tes clés et de ta crypto), accepte du collatéral en USDT et USDC sur plusieurs réseaux, fonctionne avec Apple Pay et Google Pay, et ajoute les avantages de la gamme Visa Signature. C’est une façon de donner un usage quotidien à la crypto ; sa disponibilité par pays se confirme dans les canaux officiels.',
      ru: 'BixCard (BIX) — карта Visa альянса Aitech One: она позволяет использовать твои цифровые активы в реальном мире, везде, где принимают Visa. Согласно её материалам, она некастодиальная (ключи и крипто остаются под твоим контролем), принимает залог в USDT и USDC в нескольких сетях, работает с Apple Pay и Google Pay и добавляет привилегии линейки Visa Signature. Это способ дать крипто повседневное применение; доступность по странам подтверждается в официальных каналах.',
      sv: 'BixCard (BIX) är Aitech One-alliansens Visakort: det låter dig använda dina digitala tillgångar i verkliga världen, överallt där Visa accepteras. Enligt materialet är det icke-förvarande (du behåller kontrollen över dina nycklar och din krypto), tar emot säkerhet i USDT och USDC på flera nätverk, fungerar med Apple Pay och Google Pay och lägger till förmåner från Visa Signature-linjen. Det är ett sätt att ge kryptan vardagsanvändning; tillgängligheten per land bekräftas i de officiella kanalerna.',
      hr: 'BixCard (BIX) je Visa kartica saveza Aitech One: omogućuje korištenje tvoje digitalne imovine u stvarnom svijetu, gdje god se prihvaća Visa. Prema njihovu materijalu, nije skrbnička (ti zadržavaš kontrolu nad ključevima i kriptom), prihvaća kolateral u USDT-u i USDC-u na više mreža, radi s Apple Payom i Google Payom te dodaje pogodnosti linije Visa Signature. To je način da se kriptu da svakodnevna upotreba; dostupnost po zemljama potvrđuje se u službenim kanalima.',
      ar: 'BixCard ‏(BIX) هي بطاقة Visa لتحالف Aitech One: تتيح استخدام أصولك الرقمية في العالم الحقيقي، حيثما تُقبل Visa. وفق موادها، هي غير حافظة (تحتفظ أنت بالتحكم بمفاتيحك وعملاتك)، وتقبل ضمانات بالـ USDT و USDC على عدة شبكات، وتعمل مع Apple Pay و Google Pay، وتضيف مزايا فئة Visa Signature. إنها وسيلة لمنح العملات المشفّرة استخدامًا يوميًا؛ ويُؤكَّد توفرها حسب البلد في القنوات الرسمية.',
      de: 'BixCard (BIX) ist die Visa-Karte der Aitech-One-Allianz: Sie erlaubt, deine digitalen Vermögenswerte in der realen Welt zu nutzen, überall wo Visa akzeptiert wird. Laut ihrem Material ist sie non-custodial (du behältst die Kontrolle über deine Schlüssel und deine Krypto), akzeptiert Sicherheiten in USDT und USDC auf mehreren Netzen, funktioniert mit Apple Pay und Google Pay und bringt Vorteile der Visa-Signature-Linie mit. Sie ist ein Weg, Krypto alltäglich nutzbar zu machen; die Verfügbarkeit je Land wird in den offiziellen Kanälen bestätigt.',
      sr: 'BixCard (BIX) је Visa картица савеза Aitech One: омогућава коришћење твоје дигиталне имовине у стварном свету, где год се прихвата Visa. Према њиховом материјалу, није старатељска (ти задржаваш контролу над кључевима и криптом), прихвата колатерал у USDT-у и USDC-у на више мрежа, ради са Apple Pay-ом и Google Pay-ом те додаје погодности линије Visa Signature. То је начин да се крипту да свакодневна употреба; доступност по земљама потврђује се у званичним каналима.',
      ur: 'BixCard (BIX)، Aitech One اتحاد کا ویزا کارڈ ہے: یہ آپ کو اپنے ڈیجیٹل اثاثے حقیقی دنیا میں استعمال کرنے دیتا ہے، جہاں بھی Visa قبول ہو۔ اس کے مواد کے مطابق یہ غیر تحویلی ہے (کلیدیں اور کرپٹو آپ کے قابو میں رہتے ہیں)، کئی نیٹ ورکس پر USDT اور USDC کولیٹرل قبول کرتا ہے، Apple Pay اور Google Pay کے ساتھ چلتا ہے، اور Visa Signature لائن کے فوائد شامل کرتا ہے۔ یہ کرپٹو کو روزمرہ استعمال دینے کا طریقہ ہے؛ ملک کے حساب سے دستیابی سرکاری چینلز پر تصدیق ہوتی ہے۔',
    },
  'El acceso es a través de la comunidad: contacta a la persona que te invitó y te guía para registrarte en el portal oficial (genesis.ibportal.io) y conocer los productos. Antes de decidir, revisa la documentación oficial y, si lo consideras, consulta a un asesor: la participación es voluntaria y conlleva riesgos, y los resultados varían. Nadie oficial te va a pedir tu frase de recuperación ni tus claves privadas. Los detalles de cifras, planes y condiciones solo son válidos desde los canales oficiales.':
    {
      en: 'Access is through the community: contact the person who invited you and they will guide you to register on the official portal (genesis.ibportal.io) and get to know the products. Before deciding, review the official documentation and, if you see fit, consult an adviser: participation is voluntary and carries risk, and results vary. Nobody official will ever ask you for your recovery phrase or your private keys. Details of figures, plans and conditions are only valid from the official channels.',
      pt: 'O acesso é através da comunidade: contate a pessoa que lhe convidou e ela lhe orienta para se cadastrar no portal oficial (genesis.ibportal.io) e conhecer os produtos. Antes de decidir, revise a documentação oficial e, se considerar, consulte um assessor: a participação é voluntária e envolve riscos, e os resultados variam. Ninguém oficial vai lhe pedir sua frase de recuperação nem suas chaves privadas. Os detalhes de cifras, planos e condições só são válidos a partir dos canais oficiais.',
      fr: 'L’accès se fait par la communauté : contacte la personne qui t’a invité, elle te guidera pour t’inscrire sur le portail officiel (genesis.ibportal.io) et découvrir les produits. Avant de décider, consulte la documentation officielle et, si tu le juges utile, un conseiller : la participation est volontaire et comporte des risques, et les résultats varient. Personne d’officiel ne te demandera jamais ta phrase de récupération ni tes clés privées. Les détails de chiffres, plans et conditions ne sont valables que depuis les canaux officiels.',
      ru: 'Доступ идёт через сообщество: свяжись с тем, кто тебя пригласил, и он проведёт тебя по регистрации на официальном портале (genesis.ibportal.io) и знакомству с продуктами. Прежде чем решать, изучи официальную документацию и, если сочтёшь нужным, посоветуйся со специалистом: участие добровольное и сопряжено с рисками, а результаты бывают разными. Никто из официальных лиц никогда не попросит твою сид-фразу или приватные ключи. Детали цифр, планов и условий действительны только из официальных каналов.',
      sv: 'Åtkomsten går via gemenskapen: kontakta personen som bjöd in dig, så guidar hen dig till att registrera dig på den officiella portalen (genesis.ibportal.io) och lära känna produkterna. Innan du bestämmer dig, läs den officiella dokumentationen och, om du finner det lämpligt, rådfråga en rådgivare: deltagandet är frivilligt och innebär risker, och resultaten varierar. Ingen officiell person kommer någonsin att be om din återställningsfras eller dina privata nycklar. Uppgifter om siffror, planer och villkor gäller endast från de officiella kanalerna.',
      hr: 'Pristup ide preko zajednice: javi se osobi koja te pozvala i uputit će te kako se registrirati na službenom portalu (genesis.ibportal.io) i upoznati proizvode. Prije odluke pregledaj službenu dokumentaciju i, ako smatraš potrebnim, posavjetuj se sa stručnjakom: sudjelovanje je dobrovoljno i nosi rizike, a rezultati variraju. Nitko službeni nikada neće tražiti tvoju frazu za oporavak ni tvoje privatne ključeve. Detalji brojki, planova i uvjeta vrijede samo iz službenih kanala.',
      ar: 'الوصول يتم عبر المجتمع: تواصل مع من دعاك وسيرشدك للتسجيل في البوابة الرسمية ‏(genesis.ibportal.io)‏ والتعرّف على المنتجات. قبل أن تقرّر، راجع الوثائق الرسمية، وإن رأيت، استشر مختصًا: المشاركة طوعية وتنطوي على مخاطر، والنتائج تتفاوت. لن يطلب منك أي شخص رسمي عبارة الاسترداد ولا مفاتيحك الخاصة أبدًا. تفاصيل الأرقام والخطط والشروط صالحة فقط من القنوات الرسمية.',
      de: 'Der Zugang läuft über die Community: Wende dich an die Person, die dich eingeladen hat — sie führt dich durch die Registrierung im offiziellen Portal (genesis.ibportal.io) und zeigt dir die Produkte. Prüfe vor der Entscheidung die offizielle Dokumentation und ziehe, wenn du magst, eine Beratung hinzu: Die Teilnahme ist freiwillig und mit Risiken verbunden, und die Ergebnisse schwanken. Niemand vom Team wird jemals nach deiner Wiederherstellungsphrase oder deinen privaten Schlüsseln fragen. Angaben zu Zahlen, Plänen und Bedingungen gelten nur aus den offiziellen Kanälen.',
      sr: 'Приступ иде преко заједнице: јави се особи која те позвала и упутиће те како да се региструјеш на званичном порталу (genesis.ibportal.io) и упознаш производе. Пре одлуке прегледај званичну документацију и, ако сматраш потребним, посаветуј се са стручњаком: учешће је добровољно и носи ризике, а резултати варирају. Нико званичан никада неће тражити твоју фразу за опоравак ни твоје приватне кључеве. Детаљи бројки, планова и услова важе само из званичних канала.',
      ur: 'رسائی کمیونٹی کے ذریعے ہے: جس نے آپ کو مدعو کیا اُس سے رابطہ کریں، وہ آپ کو سرکاری پورٹل (genesis.ibportal.io) پر رجسٹر ہونے اور مصنوعات جاننے میں رہنمائی دے گا۔ فیصلہ کرنے سے پہلے سرکاری دستاویزات دیکھیں اور اگر مناسب سمجھیں تو کسی مشیر سے مشورہ کریں: شرکت رضاکارانہ اور خطرات کے ساتھ ہے، اور نتائج مختلف ہوتے ہیں۔ کوئی بھی سرکاری فرد آپ سے آپ کا ریکوری فقرہ یا نجی کلیدیں کبھی نہیں مانگے گا۔ اعداد، پلانز اور شرائط کی تفصیلات صرف سرکاری چینلز سے معتبر ہیں۔',
    },
  '¿La alianza es confiable? ¿Qué respaldo y credenciales tiene?': {
    en: 'Is the alliance trustworthy? What backing and credentials does it have?',
    pt: 'A aliança é confiável? Que respaldo e credenciais tem?',
    fr: 'L’alliance est-elle fiable ? Quelles garanties et accréditations a-t-elle ?',
    ru: 'Насколько альянс надёжен? Какое у него обеспечение и документы?',
    sv: 'Är alliansen pålitlig? Vilket stöd och vilka meriter har den?',
    hr: 'Je li savez pouzdan? Kakvu podršku i vjerodajnice ima?',
    ar: 'هل التحالف موثوق؟ وما الدعم والاعتمادات التي يملكها؟',
    de: 'Ist die Allianz vertrauenswürdig? Welche Absicherung und Nachweise hat sie?',
    sr: 'Да ли је савез поуздан? Какву подршку и акредитиве има?',
    ur: 'کیا اتحاد قابلِ اعتماد ہے؟ اس کے پاس کیا پشت پناہی اور اسناد ہیں؟',
  },
  'Según la documentación oficial de Aitech One, la estructura declara respaldo y registros: un fondo de cobertura respaldado por Lloyd’s of London (sujeto a sus términos), y registros como FSC Mauritius, FSCA Sudáfrica y trámites ante otros reguladores; el exchange Bit1 declara registros DASP (El Salvador) y MSB (Canadá). Lo correcto es que verifiques estas credenciales directamente en las fuentes oficiales y en los registros públicos antes de tomar cualquier decisión: aquí solo repetimos lo que dice el material, no lo certificamos. La participación es voluntaria y con riesgos.':
    {
      en: 'According to Aitech One’s official documentation, the structure declares backing and registrations: a coverage fund backed by Lloyd’s of London (subject to its terms), and registrations such as FSC Mauritius, FSCA South Africa and filings before other regulators; the Bit1 exchange declares DASP (El Salvador) and MSB (Canada) registrations. The right thing is for you to verify these credentials directly with the official sources and the public registries before making any decision: here we only repeat what the material says, we do not certify it. Participation is voluntary and carries risk.',
      pt: 'Segundo a documentação oficial da Aitech One, a estrutura declara respaldo e registros: um fundo de cobertura respaldado pela Lloyd’s of London (sujeito aos seus termos), e registros como FSC Mauritius, FSCA África do Sul e trâmites perante outros reguladores; a exchange Bit1 declara registros DASP (El Salvador) e MSB (Canadá). O correto é que você verifique estas credenciais diretamente nas fontes oficiais e nos registros públicos antes de tomar qualquer decisão: aqui apenas repetimos o que diz o material, não o certificamos. A participação é voluntária e com riscos.',
      fr: 'Selon la documentation officielle d’Aitech One, la structure déclare des garanties et des enregistrements : un fonds de couverture adossé à Lloyd’s of London (soumis à ses conditions), et des enregistrements tels que FSC Mauritius, FSCA Afrique du Sud et des démarches auprès d’autres régulateurs ; la plateforme Bit1 déclare des enregistrements DASP (Salvador) et MSB (Canada). Le bon réflexe est de vérifier ces accréditations directement auprès des sources officielles et des registres publics avant toute décision : ici nous ne faisons que répéter ce que dit le matériel, nous ne le certifions pas. La participation est volontaire et comporte des risques.',
      ru: 'Согласно официальной документации Aitech One, структура заявляет обеспечение и регистрации: фонд покрытия при поддержке Lloyd’s of London (на его условиях) и регистрации вроде FSC Mauritius, FSCA ЮАР и обращения к другим регуляторам; биржа Bit1 заявляет регистрации DASP (Сальвадор) и MSB (Канада). Правильно будет проверить эти документы напрямую в официальных источниках и публичных реестрах прежде, чем принимать любое решение: здесь мы лишь повторяем то, что говорит материал, мы это не заверяем. Участие добровольное и сопряжено с рисками.',
      sv: 'Enligt Aitech Ones officiella dokumentation uppger strukturen stöd och registreringar: en täckningsfond med stöd av Lloyd’s of London (enligt dess villkor), och registreringar som FSC Mauritius, FSCA Sydafrika samt ansökningar hos andra tillsynsmyndigheter; börsen Bit1 uppger registreringarna DASP (El Salvador) och MSB (Kanada). Det rätta är att du kontrollerar dessa uppgifter direkt hos de officiella källorna och i de offentliga registren innan du fattar något beslut: här upprepar vi bara vad materialet säger, vi intygar det inte. Deltagandet är frivilligt och innebär risker.',
      hr: 'Prema službenoj dokumentaciji Aitech Onea, struktura navodi podršku i registracije: fond pokrića uz potporu Lloyd’s of London (podložno njihovim uvjetima), i registracije poput FSC Mauritius, FSCA Južna Afrika te postupke pred drugim regulatorima; burza Bit1 navodi registracije DASP (Salvador) i MSB (Kanada). Ispravno je da ove vjerodajnice provjeriš izravno u službenim izvorima i javnim registrima prije bilo kakve odluke: ovdje samo ponavljamo što piše u materijalu, ne potvrđujemo ga. Sudjelovanje je dobrovoljno i nosi rizike.',
      ar: 'وفق الوثائق الرسمية لـ Aitech One، يذكر الهيكل دعمًا وتسجيلات: صندوق تغطية مدعوم من Lloyd’s of London (وفق شروطه)، وتسجيلات مثل FSC Mauritius و FSCA جنوب أفريقيا ومعاملات أمام جهات تنظيمية أخرى؛ وتذكر منصة Bit1 تسجيلي DASP (السلفادور) و MSB (كندا). الصواب أن تتحقّق من هذه الاعتمادات مباشرةً لدى المصادر الرسمية والسجلات العامة قبل اتخاذ أي قرار: نحن هنا نكرّر ما تقوله المادة فقط، ولا نصادق عليه. المشاركة طوعية وتنطوي على مخاطر.',
      de: 'Laut der offiziellen Dokumentation von Aitech One gibt die Struktur Absicherungen und Registrierungen an: einen Deckungsfonds, getragen von Lloyd’s of London (vorbehaltlich dessen Bedingungen), und Registrierungen wie FSC Mauritius, FSCA Südafrika sowie Verfahren bei weiteren Regulierern; die Börse Bit1 gibt DASP- (El Salvador) und MSB-Registrierungen (Kanada) an. Richtig ist, dass du diese Nachweise direkt bei den offiziellen Quellen und in den öffentlichen Registern prüfst, bevor du irgendeine Entscheidung triffst: Hier wiederholen wir nur, was das Material sagt — wir zertifizieren es nicht. Die Teilnahme ist freiwillig und mit Risiken verbunden.',
      sr: 'Према званичној документацији Aitech One-а, структура наводи подршку и регистрације: фонд покрића уз подршку Lloyd’s of London (према њиховим условима), и регистрације попут FSC Mauritius, FSCA Јужна Африка те поступке пред другим регулаторима; берза Bit1 наводи регистрације DASP (Салвадор) и MSB (Канада). Исправно је да ове акредитиве провериш непосредно у званичним изворима и јавним регистрима пре било какве одлуке: овде само понављамо шта пише у материјалу, не потврђујемо га. Учешће је добровољно и носи ризике.',
      ur: 'Aitech One کی سرکاری دستاویزات کے مطابق، ڈھانچہ پشت پناہی اور رجسٹریشنز بیان کرتا ہے: Lloyd’s of London کی حمایت والا ایک کوریج فنڈ (اُن کی شرائط کے تابع)، اور FSC Mauritius، FSCA جنوبی افریقہ جیسی رجسٹریشنز اور دیگر ریگولیٹرز کے سامنے کارروائیاں؛ ایکسچینج Bit1، DASP (ایل سلواڈور) اور MSB (کینیڈا) کی رجسٹریشنز بیان کرتا ہے۔ درست یہ ہے کہ کوئی بھی فیصلہ کرنے سے پہلے آپ یہ اسناد براہِ راست سرکاری ذرائع اور عوامی رجسٹروں میں تصدیق کریں: ہم یہاں صرف وہی دہراتے ہیں جو مواد کہتا ہے، اس کی تصدیق نہیں کرتے۔ شرکت رضاکارانہ اور خطرات کے ساتھ ہے۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · MEMBRESÍA G-PULSE

     LA TABLA DE PRECIOS SE COPIA ENTERA: los cinco planes, sus días y sus
     dólares. Ni se redondea, ni se convierte a moneda local, ni se «adapta».

     Y SE MANTIENE EL «TODAVÍA NO» del plan de compensación. G-Pulse no tiene
     referidos, y la respuesta lo dice en mayúsculas porque es lo que separa la
     membresía de los packs de minería del ecosistema —que sí los tienen—.
     Suavizar ese «NO» al traducir haría creer que hay comisiones donde no las
     hay, y eso es lo que empieza una expectativa que nadie va a cumplir.
     ══════════════════════════════════════════════════════════════════ */
  '¿Cómo activo G-Pulse? ¿Necesito membresía?': {
    en: 'How do I activate G-Pulse? Do I need a membership?',
    pt: 'Como ativo o G-Pulse? Preciso de assinatura?',
    fr: 'Comment activer G-Pulse ? Ai-je besoin d’un abonnement ?',
    ru: 'Как активировать G-Pulse? Нужна ли подписка?',
    sv: 'Hur aktiverar jag G-Pulse? Behöver jag ett medlemskap?',
    hr: 'Kako aktivirati G-Pulse? Trebam li članstvo?',
    ar: 'كيف أُفعّل G-Pulse؟ وهل أحتاج عضوية؟',
    de: 'Wie aktiviere ich G-Pulse? Brauche ich eine Mitgliedschaft?',
    sr: 'Како да активирам G-Pulse? Треба ли ми чланство?',
    ur: 'میں G-Pulse کیسے فعال کروں؟ کیا مجھے ممبرشپ چاہیے؟',
  },
  'G-Pulse funciona por membresía: entras con tu cuenta de Genesis (el mismo acceso del ecosistema) y activas un plan desde el panel de G-Pulse. La activación se paga en modo dual —mitad en USDT y mitad en AiG Token, en una sola operación desde tu wallet—. Mientras la membresía esté vigente tienes acceso al plan que elegiste; cuando vence, el acceso se corta hasta que la reactivas.':
    {
      en: 'G-Pulse runs on membership: you sign in with your Genesis account (the same ecosystem login) and activate a plan from the G-Pulse dashboard. Activation is paid in dual mode — half in USDT and half in AiG Token, in a single operation from your wallet. While the membership is active you have access to the plan you chose; when it expires, access is cut until you reactivate it.',
      pt: 'O G-Pulse funciona por assinatura: você entra com sua conta Genesis (o mesmo acesso do ecossistema) e ativa um plano pelo painel do G-Pulse. A ativação é paga em modo dual — metade em USDT e metade em AiG Token, numa única operação a partir da sua carteira. Enquanto a assinatura estiver vigente você tem acesso ao plano escolhido; quando vence, o acesso é cortado até você reativá-la.',
      fr: 'G-Pulse fonctionne par abonnement : tu te connectes avec ton compte Genesis (le même accès que pour l’écosystème) et tu actives un plan depuis le tableau de bord de G-Pulse. L’activation se paie en mode dual — moitié en USDT et moitié en AiG Token, en une seule opération depuis ton portefeuille. Tant que l’abonnement est en cours, tu as accès au plan choisi ; à l’expiration, l’accès est coupé jusqu’à réactivation.',
      ru: 'G-Pulse работает по подписке: ты входишь со своим аккаунтом Genesis (тот же вход, что и во всю экосистему) и активируешь план в панели G-Pulse. Активация оплачивается в двойном режиме — половина в USDT, половина в AiG Token, одной операцией из кошелька. Пока подписка действует, у тебя есть доступ к выбранному плану; когда она истекает, доступ закрывается до повторной активации.',
      sv: 'G-Pulse fungerar med medlemskap: du loggar in med ditt Genesis-konto (samma inloggning som till ekosystemet) och aktiverar en plan från G-Pulse-panelen. Aktiveringen betalas i dualläge — hälften i USDT och hälften i AiG Token, i en enda transaktion från din plånbok. Så länge medlemskapet gäller har du tillgång till planen du valde; när det löper ut stängs åtkomsten tills du aktiverar igen.',
      hr: 'G-Pulse radi na članstvo: prijaviš se svojim Genesis računom (isti pristup kao za ekosustav) i aktiviraš plan s G-Pulse ploče. Aktivacija se plaća u dvojnom načinu — pola u USDT-u i pola u AiG Tokenu, u jednoj transakciji iz tvog novčanika. Dok je članstvo na snazi imaš pristup odabranom planu; kad istekne, pristup se prekida dok ga ponovno ne aktiviraš.',
      ar: 'يعمل G-Pulse بالعضوية: تدخل بحساب Genesis الخاص بك (نفس الدخول إلى النظام البيئي) وتُفعّل خطة من لوحة G-Pulse. يُدفع التفعيل بالنمط المزدوج — نصف بالـ USDT ونصف بالـ AiG Token، في عملية واحدة من محفظتك. ما دامت العضوية سارية لديك وصول إلى الخطة التي اخترتها؛ وعند انتهائها يُقطع الوصول حتى تُعيد تفعيلها.',
      de: 'G-Pulse läuft über Mitgliedschaft: Du meldest dich mit deinem Genesis-Konto an (derselbe Zugang wie zum Ökosystem) und aktivierst einen Plan im G-Pulse-Panel. Die Aktivierung wird im Dual-Modus bezahlt — halb in USDT und halb in AiG Token, in einem einzigen Vorgang aus deiner Wallet. Solange die Mitgliedschaft läuft, hast du Zugang zum gewählten Plan; läuft sie ab, wird der Zugang gesperrt, bis du sie reaktivierst.',
      sr: 'G-Pulse ради на чланство: пријавиш се својим Genesis налогом (исти приступ као за екосистем) и активираш план са G-Pulse табле. Активација се плаћа у двојном режиму — пола у USDT-у и пола у AiG Token-у, у једној трансакцији из твог новчаника. Док је чланство на снази имаш приступ одабраном плану; кад истекне, приступ се прекида док га поново не активираш.',
      ur: 'G-Pulse ممبرشپ سے چلتا ہے: آپ اپنے Genesis اکاؤنٹ سے داخل ہوتے ہیں (وہی ایکو سسٹم والا لاگ اِن) اور G-Pulse پینل سے کوئی پلان فعال کرتے ہیں۔ فعال کرنے کی ادائیگی دوہرے انداز میں ہوتی ہے — آدھی USDT میں اور آدھی AiG Token میں، آپ کے والٹ سے ایک ہی عمل میں۔ جب تک ممبرشپ چل رہی ہے آپ کو منتخب پلان تک رسائی ہے؛ ختم ہونے پر رسائی رک جاتی ہے جب تک دوبارہ فعال نہ کریں۔',
    },
  '¿Cuáles son las membresías de G-Pulse y qué cuestan?': {
    en: 'What are the G-Pulse memberships and what do they cost?',
    pt: 'Quais são as assinaturas do G-Pulse e quanto custam?',
    fr: 'Quels sont les abonnements G-Pulse et combien coûtent-ils ?',
    ru: 'Какие есть подписки G-Pulse и сколько они стоят?',
    sv: 'Vilka G-Pulse-medlemskap finns och vad kostar de?',
    hr: 'Koja su članstva G-Pulsea i koliko koštaju?',
    ar: 'ما عضويات G-Pulse وكم تكلّف؟',
    de: 'Welche G-Pulse-Mitgliedschaften gibt es und was kosten sie?',
    sr: 'Која су чланства G-Pulse-а и колико коштају?',
    ur: 'G-Pulse کی ممبرشپس کون سی ہیں اور کتنے کی ہیں؟',
  },
  'Hay cinco planes, según el panel de activación: WEEKLY (1 semana, 7 días, 50 USD) · BASIC (1 mes, 30 días, 100 USD) · PRO (6 meses, 180 días, 500 USD, el más popular) · EXPERT (9 meses, 270 días, 750 USD) · ELITE (12 meses, 365 días, 1000 USD). El precio es un valor en dólares que se cubre en modo dual: mitad en USDT y mitad en AiG Token. Cada plan suma capacidades: WEEKLY y BASIC dan las señales y el bot; PRO desbloquea el Oracle Runtime (motor predictivo) y funciones avanzadas; EXPERT y ELITE añaden prioridad, más herramientas y soporte VIP.':
    {
      en: 'There are five plans, according to the activation panel: WEEKLY (1 week, 7 days, 50 USD) · BASIC (1 month, 30 days, 100 USD) · PRO (6 months, 180 days, 500 USD, the most popular) · EXPERT (9 months, 270 days, 750 USD) · ELITE (12 months, 365 days, 1000 USD). The price is a dollar value covered in dual mode: half in USDT and half in AiG Token. Each plan adds capabilities: WEEKLY and BASIC give the signals and the bot; PRO unlocks the Oracle Runtime (predictive engine) and advanced features; EXPERT and ELITE add priority, more tools and VIP support.',
      pt: 'Há cinco planos, segundo o painel de ativação: WEEKLY (1 semana, 7 dias, 50 USD) · BASIC (1 mês, 30 dias, 100 USD) · PRO (6 meses, 180 dias, 500 USD, o mais popular) · EXPERT (9 meses, 270 dias, 750 USD) · ELITE (12 meses, 365 dias, 1000 USD). O preço é um valor em dólares coberto em modo dual: metade em USDT e metade em AiG Token. Cada plano soma capacidades: WEEKLY e BASIC dão os sinais e o bot; PRO desbloqueia o Oracle Runtime (motor preditivo) e funções avançadas; EXPERT e ELITE acrescentam prioridade, mais ferramentas e suporte VIP.',
      fr: 'Il y a cinq plans, selon le panneau d’activation : WEEKLY (1 semaine, 7 jours, 50 USD) · BASIC (1 mois, 30 jours, 100 USD) · PRO (6 mois, 180 jours, 500 USD, le plus populaire) · EXPERT (9 mois, 270 jours, 750 USD) · ELITE (12 mois, 365 jours, 1000 USD). Le prix est une valeur en dollars couverte en mode dual : moitié en USDT et moitié en AiG Token. Chaque plan ajoute des capacités : WEEKLY et BASIC donnent les signaux et le bot ; PRO débloque l’Oracle Runtime (moteur prédictif) et des fonctions avancées ; EXPERT et ELITE ajoutent la priorité, plus d’outils et le support VIP.',
      ru: 'Планов пять, согласно панели активации: WEEKLY (1 неделя, 7 дней, 50 USD) · BASIC (1 месяц, 30 дней, 100 USD) · PRO (6 месяцев, 180 дней, 500 USD, самый популярный) · EXPERT (9 месяцев, 270 дней, 750 USD) · ELITE (12 месяцев, 365 дней, 1000 USD). Цена — это долларовая величина, покрываемая в двойном режиме: половина в USDT и половина в AiG Token. Каждый план добавляет возможности: WEEKLY и BASIC дают сигналы и бота; PRO открывает Oracle Runtime (предиктивный движок) и продвинутые функции; EXPERT и ELITE добавляют приоритет, больше инструментов и VIP-поддержку.',
      sv: 'Det finns fem planer, enligt aktiveringspanelen: WEEKLY (1 vecka, 7 dagar, 50 USD) · BASIC (1 månad, 30 dagar, 100 USD) · PRO (6 månader, 180 dagar, 500 USD, den populäraste) · EXPERT (9 månader, 270 dagar, 750 USD) · ELITE (12 månader, 365 dagar, 1000 USD). Priset är ett dollarvärde som täcks i dualläge: hälften i USDT och hälften i AiG Token. Varje plan lägger till funktioner: WEEKLY och BASIC ger signalerna och boten; PRO låser upp Oracle Runtime (prediktiv motor) och avancerade funktioner; EXPERT och ELITE lägger till prioritet, fler verktyg och VIP-support.',
      hr: 'Postoji pet planova, prema ploči za aktivaciju: WEEKLY (1 tjedan, 7 dana, 50 USD) · BASIC (1 mjesec, 30 dana, 100 USD) · PRO (6 mjeseci, 180 dana, 500 USD, najpopularniji) · EXPERT (9 mjeseci, 270 dana, 750 USD) · ELITE (12 mjeseci, 365 dana, 1000 USD). Cijena je vrijednost u dolarima koja se pokriva u dvojnom načinu: pola u USDT-u i pola u AiG Tokenu. Svaki plan dodaje mogućnosti: WEEKLY i BASIC daju signale i bota; PRO otključava Oracle Runtime (prediktivni motor) i napredne funkcije; EXPERT i ELITE dodaju prioritet, više alata i VIP podršku.',
      ar: 'هناك خمس خطط، وفق لوحة التفعيل: WEEKLY (أسبوع واحد، 7 أيام، 50 دولارًا) · BASIC (شهر واحد، 30 يومًا، 100 دولار) · PRO (6 أشهر، 180 يومًا، 500 دولار، الأكثر شيوعًا) · EXPERT (9 أشهر، 270 يومًا، 750 دولارًا) · ELITE (12 شهرًا، 365 يومًا، 1000 دولار). السعر قيمة بالدولار تُغطّى بالنمط المزدوج: نصف بالـ USDT ونصف بالـ AiG Token. كل خطة تضيف قدرات: WEEKLY و BASIC تعطيان الإشارات والبوت؛ و PRO يفتح Oracle Runtime (محرك تنبؤي) ووظائف متقدمة؛ و EXPERT و ELITE تضيفان الأولوية والمزيد من الأدوات ودعم VIP.',
      de: 'Es gibt fünf Pläne, laut Aktivierungspanel: WEEKLY (1 Woche, 7 Tage, 50 USD) · BASIC (1 Monat, 30 Tage, 100 USD) · PRO (6 Monate, 180 Tage, 500 USD, der beliebteste) · EXPERT (9 Monate, 270 Tage, 750 USD) · ELITE (12 Monate, 365 Tage, 1000 USD). Der Preis ist ein Dollarwert, der im Dual-Modus gedeckt wird: halb in USDT und halb in AiG Token. Jeder Plan fügt Fähigkeiten hinzu: WEEKLY und BASIC geben die Signale und den Bot; PRO schaltet das Oracle Runtime (Vorhersagemotor) und erweiterte Funktionen frei; EXPERT und ELITE ergänzen Priorität, mehr Werkzeuge und VIP-Support.',
      sr: 'Постоји пет планова, према табли за активацију: WEEKLY (1 недеља, 7 дана, 50 USD) · BASIC (1 месец, 30 дана, 100 USD) · PRO (6 месеци, 180 дана, 500 USD, најпопуларнији) · EXPERT (9 месеци, 270 дана, 750 USD) · ELITE (12 месеци, 365 дана, 1000 USD). Цена је вредност у доларима која се покрива у двојном режиму: пола у USDT-у и пола у AiG Token-у. Сваки план додаје могућности: WEEKLY и BASIC дају сигнале и бота; PRO откључава Oracle Runtime (предиктивни мотор) и напредне функције; EXPERT и ELITE додају приоритет, више алата и VIP подршку.',
      ur: 'فعال کرنے کے پینل کے مطابق پانچ پلان ہیں: WEEKLY (1 ہفتہ، 7 دن، 50 USD) · BASIC (1 مہینہ، 30 دن، 100 USD) · PRO (6 مہینے، 180 دن، 500 USD، سب سے مقبول) · EXPERT (9 مہینے، 270 دن، 750 USD) · ELITE (12 مہینے، 365 دن، 1000 USD)۔ قیمت ڈالر میں ایک قدر ہے جو دوہرے انداز میں پوری ہوتی ہے: آدھی USDT اور آدھی AiG Token میں۔ ہر پلان صلاحیتیں بڑھاتا ہے: WEEKLY اور BASIC سگنلز اور بوٹ دیتے ہیں؛ PRO، Oracle Runtime (پیش گوئی کا انجن) اور اعلیٰ سہولتیں کھولتا ہے؛ EXPERT اور ELITE ترجیح، مزید اوزار اور VIP سپورٹ شامل کرتے ہیں۔',
    },
  '¿G-Pulse tiene referidos o plan de compensación?': {
    en: 'Does G-Pulse have referrals or a compensation plan?',
    pt: 'O G-Pulse tem indicações ou plano de compensação?',
    fr: 'G-Pulse a-t-il des parrainages ou un plan de rémunération ?',
    ru: 'Есть ли у G-Pulse рефералы или план вознаграждения?',
    sv: 'Har G-Pulse hänvisningar eller en ersättningsplan?',
    hr: 'Ima li G-Pulse preporuke ili plan naknada?',
    ar: 'هل لدى G-Pulse نظام إحالات أو خطة مكافآت؟',
    de: 'Hat G-Pulse Empfehlungen oder einen Vergütungsplan?',
    sr: 'Има ли G-Pulse препоруке или план накнада?',
    ur: 'کیا G-Pulse میں ریفرل یا معاوضے کا پلان ہے؟',
  },
  'Por ahora no. G-Pulse todavía NO ofrece un plan de compensación: dentro de G-Pulse no hay comisiones por invitar ni por armar una red de niveles. Ese tipo de plan (con sus aceleradores directo y de red) pertenece al ecosistema Genesis y a sus packs de minería, que es otra cosa distinta de la membresía de G-Pulse. Si en el futuro G-Pulse suma algún esquema, se comunicará por los canales oficiales.':
    {
      en: 'Not for now. G-Pulse does NOT yet offer a compensation plan: inside G-Pulse there are no commissions for inviting or for building a network of levels. That kind of plan (with its direct and network accelerators) belongs to the Genesis ecosystem and its mining packs, which is a different thing from the G-Pulse membership. If G-Pulse adds any scheme in the future, it will be announced through the official channels.',
      pt: 'Por enquanto não. O G-Pulse ainda NÃO oferece um plano de compensação: dentro do G-Pulse não há comissões por convidar nem por montar uma rede de níveis. Esse tipo de plano (com seus aceleradores direto e de rede) pertence ao ecossistema Genesis e a seus packs de mineração, que é coisa diferente da assinatura do G-Pulse. Se no futuro o G-Pulse somar algum esquema, será comunicado pelos canais oficiais.',
      fr: 'Pas pour l’instant. G-Pulse n’offre PAS encore de plan de rémunération : à l’intérieur de G-Pulse, il n’y a pas de commissions pour inviter ni pour bâtir un réseau de niveaux. Ce type de plan (avec ses accélérateurs direct et de réseau) appartient à l’écosystème Genesis et à ses packs de minage, ce qui est autre chose que l’abonnement G-Pulse. Si G-Pulse ajoute un jour un dispositif, ce sera annoncé par les canaux officiels.',
      ru: 'Пока нет. G-Pulse ещё НЕ предлагает план вознаграждения: внутри G-Pulse нет комиссий за приглашения и за построение сети уровней. Такой план (со своими прямыми и сетевыми ускорителями) относится к экосистеме Genesis и её майнинг-пакам, а это не то же самое, что подписка G-Pulse. Если в будущем G-Pulse что-то добавит, об этом сообщат по официальным каналам.',
      sv: 'Inte för närvarande. G-Pulse erbjuder ÄNNU INTE någon ersättningsplan: inom G-Pulse finns inga provisioner för att bjuda in eller bygga ett nätverk av nivåer. Den sortens plan (med sina direkt- och nätverksacceleratorer) hör till Genesis-ekosystemet och dess miningpaket, vilket är något annat än G-Pulse-medlemskapet. Om G-Pulse i framtiden lägger till något upplägg meddelas det via de officiella kanalerna.',
      hr: 'Za sada ne. G-Pulse još NE nudi plan naknada: unutar G-Pulsea nema provizija za pozivanje ni za gradnju mreže razina. Takva vrsta plana (sa svojim izravnim i mrežnim ubrzivačima) pripada Genesis ekosustavu i njegovim rudarskim paketima, što je nešto drugo od članstva u G-Pulseu. Ako G-Pulse u budućnosti doda neku shemu, objavit će se putem službenih kanala.',
      ar: 'ليس في الوقت الحالي. لا يقدّم G-Pulse بعدُ خطة مكافآت: داخل G-Pulse لا توجد عمولات على الدعوة ولا على بناء شبكة مستويات. هذا النوع من الخطط (بمسرّعاته المباشرة والشبكية) يخصّ نظام Genesis البيئي وباقات التعدين فيه، وهو أمر مختلف عن عضوية G-Pulse. وإذا أضاف G-Pulse أي نظام مستقبلًا، فسيُعلن عبر القنوات الرسمية.',
      de: 'Vorerst nein. G-Pulse bietet NOCH KEINEN Vergütungsplan: Innerhalb von G-Pulse gibt es keine Provisionen fürs Einladen oder fürs Aufbauen eines Ebenen-Netzwerks. Diese Art Plan (mit seinen Direkt- und Netzwerk-Beschleunigern) gehört zum Genesis-Ökosystem und seinen Mining-Paketen, was etwas anderes ist als die G-Pulse-Mitgliedschaft. Wenn G-Pulse künftig ein Modell ergänzt, wird das über die offiziellen Kanäle bekannt gegeben.',
      sr: 'За сада не. G-Pulse још НЕ нуди план накнада: унутар G-Pulse-а нема провизија за позивање ни за градњу мреже нивоа. Таква врста плана (са својим директним и мрежним убрзивачима) припада Genesis екосистему и његовим рударским пакетима, што је нешто друго од чланства у G-Pulse-у. Ако G-Pulse у будућности дода неку шему, објавиће се путем званичних канала.',
      ur: 'فی الحال نہیں۔ G-Pulse ابھی معاوضے کا کوئی پلان نہیں دیتا: G-Pulse کے اندر نہ دعوت دینے پر کمیشن ہے اور نہ لیولز کا نیٹ ورک بنانے پر۔ اس قسم کا پلان (اپنے ڈائریکٹ اور نیٹ ورک ایکسیلریٹرز کے ساتھ) Genesis ایکو سسٹم اور اس کے مائننگ پیکس کا حصہ ہے، جو G-Pulse ممبرشپ سے الگ چیز ہے۔ اگر مستقبل میں G-Pulse کوئی نظام شامل کرے تو سرکاری چینلز پر اعلان ہوگا۔',
    },
  '¿Qué pasa cuando vence mi membresía de G-Pulse?': {
    en: 'What happens when my G-Pulse membership expires?',
    pt: 'O que acontece quando minha assinatura do G-Pulse vence?',
    fr: 'Que se passe-t-il quand mon abonnement G-Pulse expire ?',
    ru: 'Что происходит, когда моя подписка G-Pulse истекает?',
    sv: 'Vad händer när mitt G-Pulse-medlemskap löper ut?',
    hr: 'Što se događa kad mi istekne članstvo u G-Pulseu?',
    ar: 'ماذا يحدث عند انتهاء عضويتي في G-Pulse؟',
    de: 'Was passiert, wenn meine G-Pulse-Mitgliedschaft abläuft?',
    sr: 'Шта се дешава кад ми истекне чланство у G-Pulse-у?',
    ur: 'میری G-Pulse ممبرشپ ختم ہونے پر کیا ہوتا ہے؟',
  },
  'La membresía tiene una fecha de vencimiento igual a los días del plan que activaste (por ejemplo, PRO son 180 días desde la activación). Al pasar esa fecha, el acceso al plan se corta automáticamente y el panel te ofrece reactivar. Pagar de nuevo mientras aún tienes una membresía activa no suma días encima: la reactivación cuenta cuando el plan ya venció. Puedes ver cuándo vence en tu propio panel de G-Pulse.':
    {
      en: 'The membership has an expiry date equal to the days of the plan you activated (for example, PRO is 180 days from activation). Once that date passes, access to the plan is cut automatically and the panel offers you to reactivate. Paying again while you still have an active membership does not stack days on top: reactivation counts once the plan has already expired. You can see when it expires in your own G-Pulse dashboard.',
      pt: 'A assinatura tem uma data de vencimento igual aos dias do plano que você ativou (por exemplo, PRO são 180 dias desde a ativação). Ao passar essa data, o acesso ao plano é cortado automaticamente e o painel lhe oferece reativar. Pagar de novo enquanto ainda tem uma assinatura ativa não soma dias por cima: a reativação conta quando o plano já venceu. Você pode ver quando vence no seu próprio painel do G-Pulse.',
      fr: 'L’abonnement a une date d’expiration égale aux jours du plan que tu as activé (par exemple, PRO c’est 180 jours depuis l’activation). Passée cette date, l’accès au plan est coupé automatiquement et le panneau te propose de réactiver. Repayer alors que tu as encore un abonnement actif n’ajoute pas de jours par-dessus : la réactivation compte une fois le plan expiré. Tu peux voir la date d’expiration dans ton propre tableau de bord G-Pulse.',
      ru: 'У подписки есть дата окончания, равная числу дней выбранного плана (например, PRO — это 180 дней с момента активации). После этой даты доступ к плану закрывается автоматически, и панель предлагает продлить. Оплата заново, пока подписка ещё активна, не добавляет дни сверху: продление считается, когда план уже истёк. Дату окончания видно в твоей панели G-Pulse.',
      sv: 'Medlemskapet har ett utgångsdatum som motsvarar dagarna i planen du aktiverade (till exempel är PRO 180 dagar från aktiveringen). När det datumet passerats stängs åtkomsten till planen automatiskt och panelen erbjuder dig att aktivera på nytt. Att betala igen medan du fortfarande har ett aktivt medlemskap lägger inte till dagar ovanpå: återaktiveringen räknas när planen redan gått ut. Du ser utgångsdatumet i din egen G-Pulse-panel.',
      hr: 'Članstvo ima datum isteka jednak danima plana koji si aktivirao (na primjer, PRO je 180 dana od aktivacije). Nakon tog datuma pristup planu se automatski prekida i ploča ti nudi ponovnu aktivaciju. Ponovno plaćanje dok još imaš aktivno članstvo ne zbraja dane odozgo: ponovna aktivacija računa se kad je plan već istekao. Datum isteka vidiš na svojoj G-Pulse ploči.',
      ar: 'للعضوية تاريخ انتهاء يساوي أيام الخطة التي فعّلتها (مثلًا PRO هي 180 يومًا من التفعيل). بعد مرور ذلك التاريخ يُقطع الوصول إلى الخطة تلقائيًا وتعرض عليك اللوحة إعادة التفعيل. الدفع مجددًا بينما لديك عضوية سارية لا يضيف أيامًا فوقها: إعادة التفعيل تُحتسب بعد أن تكون الخطة قد انتهت. يمكنك رؤية موعد الانتهاء في لوحة G-Pulse الخاصة بك.',
      de: 'Die Mitgliedschaft hat ein Ablaufdatum, das den Tagen des aktivierten Plans entspricht (PRO sind zum Beispiel 180 Tage ab Aktivierung). Nach diesem Datum wird der Zugang zum Plan automatisch gesperrt, und das Panel bietet dir die Reaktivierung an. Erneut zu zahlen, während die Mitgliedschaft noch aktiv ist, addiert keine Tage obendrauf: Die Reaktivierung zählt, wenn der Plan bereits abgelaufen ist. Wann er abläuft, siehst du in deinem eigenen G-Pulse-Panel.',
      sr: 'Чланство има датум истека једнак данима плана који си активирао (на пример, PRO је 180 дана од активације). Након тог датума приступ плану се аутоматски прекида и табла ти нуди поновну активацију. Поновно плаћање док још имаш активно чланство не сабира дане одозго: поновна активација се рачуна кад је план већ истекао. Датум истека видиш на својој G-Pulse табли.',
      ur: 'ممبرشپ کی میعاد اُس پلان کے دنوں کے برابر ہوتی ہے جو آپ نے فعال کیا (مثلاً PRO فعال ہونے سے 180 دن ہے)۔ اُس تاریخ کے بعد پلان تک رسائی خودکار طور پر رک جاتی ہے اور پینل دوبارہ فعال کرنے کی پیشکش کرتا ہے۔ ابھی فعال ممبرشپ ہوتے ہوئے دوبارہ ادائیگی کرنے سے دن اوپر نہیں جڑتے: دوبارہ فعال کرنا تب گنتا ہے جب پلان ختم ہو چکا ہو۔ میعاد ختم ہونے کی تاریخ آپ اپنے G-Pulse پینل میں دیکھ سکتے ہیں۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · HOLD (resto), SI ALGO SALE MAL, Y GEVY

     Tres respuestas dicen lo mismo con distintas palabras y las tres importan:
     NO PAGUES OTRA VEZ. En español está claro; en once idiomas hay que evitar
     el condicional cortés, que la vuelve una sugerencia.

     Y una respuesta marca una frontera de responsabilidad: «Compras a Gevy y
     reclamas a Gevy… eso es asunto nuestro, no tuyo». Traducida floja se lee
     como un descargo; traducida bien, como lo que es: quitarle al cliente el
     trabajo de averiguar quién fabrica.
     ══════════════════════════════════════════════════════════════════ */
  'Me falta AIG para llegar al hold. ¿De dónde lo saco?': {
    en: 'I am short of AIG to reach the hold. Where do I get it?',
    pt: 'Falta-me AIG para chegar ao hold. De onde tiro?',
    fr: 'Il me manque de l’AIG pour atteindre le hold. Où en trouver ?',
    ru: 'Мне не хватает AIG до hold. Где его взять?',
    sv: 'Jag saknar AIG för att nå hold. Var får jag tag i det?',
    hr: 'Nedostaje mi AIG-a da dosegnem hold. Gdje da ga nabavim?',
    ar: 'ينقصني AIG لبلوغ الـ hold. من أين أحصل عليه؟',
    de: 'Mir fehlt AIG, um den Hold zu erreichen. Woher bekomme ich es?',
    sr: 'Недостаје ми AIG-а да достигнем hold. Где да га набавим?',
    ur: 'مجھے hold تک پہنچنے کے لیے AIG کم ہے۔ کہاں سے لوں؟',
  },
  'Se consigue en la comunidad, fuera de la herramienta. Genesis es una comunidad global: allá donde preguntes hay participantes con AIG, y ese intercambio se acuerda entre personas. Lo que la plataforma no hace es venderte el AIG que te falta.':
    {
      en: 'You get it within the community, outside the tool. Genesis is a global community: wherever you ask there are participants holding AIG, and that exchange is agreed between people. What the platform does not do is sell you the AIG you are missing.',
      pt: 'Consegue-se na comunidade, fora da ferramenta. A Genesis é uma comunidade global: onde quer que você pergunte há participantes com AIG, e essa troca é acordada entre pessoas. O que a plataforma não faz é lhe vender o AIG que falta.',
      fr: 'On l’obtient dans la communauté, en dehors de l’outil. Genesis est une communauté mondiale : où que tu demandes, il y a des participants qui détiennent de l’AIG, et cet échange se convient entre personnes. Ce que la plateforme ne fait pas, c’est te vendre l’AIG qui te manque.',
      ru: 'Его находят в сообществе, за пределами инструмента. Genesis — глобальное сообщество: где ни спроси, есть участники с AIG, и такой обмен люди договаривают между собой. Чего платформа не делает — так это не продаёт тебе недостающий AIG.',
      sv: 'Du får tag i det i gemenskapen, utanför verktyget. Genesis är en global gemenskap: var du än frågar finns deltagare som har AIG, och det utbytet kommer man överens om mellan människor. Det plattformen inte gör är att sälja dig den AIG du saknar.',
      hr: 'Nabavlja se u zajednici, izvan alata. Genesis je globalna zajednica: gdje god pitaš ima sudionika s AIG-om, a ta se razmjena dogovara među ljudima. Ono što platforma ne radi jest da ti proda AIG koji ti nedostaje.',
      ar: 'تحصل عليه داخل المجتمع، خارج الأداة. Genesis مجتمع عالمي: أينما سألت تجد مشاركين يملكون AIG، ويُتفق على ذلك التبادل بين الأشخاص. ما لا تفعله المنصة هو أن تبيعك الـ AIG الناقص.',
      de: 'Du bekommst es in der Community, außerhalb des Werkzeugs. Genesis ist eine globale Community: Wo du auch fragst, gibt es Teilnehmende mit AIG, und dieser Tausch wird zwischen Menschen vereinbart. Was die Plattform nicht tut, ist dir das fehlende AIG zu verkaufen.',
      sr: 'Набавља се у заједници, изван алата. Genesis је глобална заједница: где год питаш има учесника са AIG-ом, а та се размена договара међу људима. Оно што платформа не ради јесте да ти прода AIG који ти недостаје.',
      ur: 'یہ کمیونٹی میں ملتا ہے، ٹول سے باہر۔ Genesis ایک عالمی کمیونٹی ہے: جہاں بھی پوچھیں، AIG رکھنے والے شرکاء ہیں، اور یہ تبادلہ لوگوں کے درمیان طے ہوتا ہے۔ پلیٹ فارم جو نہیں کرتا وہ یہ ہے کہ آپ کو کم پڑنے والا AIG بیچے۔',
    },
  'Mi minado no avanza': {
    en: 'My mining is not advancing', pt: 'Minha mineração não avança',
    fr: 'Mon minage n’avance pas', ru: 'Мой майнинг не движется',
    sv: 'Min mining går inte framåt', hr: 'Moje rudarenje ne napreduje',
    ar: 'تعديني لا يتقدّم', de: 'Mein Mining kommt nicht voran',
    sr: 'Моје рударење не напредује', ur: 'میری مائننگ آگے نہیں بڑھ رہی',
  },
  'Lo primero que hay que mirar es el hold: si la cuenta está por debajo del mínimo, los beneficios quedan congelados y el contador se detiene. Comprueba el estado en tu panel antes de reportarlo como avería. Si el hold está cubierto y aun así no avanza, es un caso para el equipo.':
    {
      en: 'The first thing to check is the hold: if the account is below the minimum, benefits are frozen and the counter stops. Check the status in your dashboard before reporting it as a fault. If the hold is covered and it still does not advance, it is a case for the team.',
      pt: 'A primeira coisa a olhar é o hold: se a conta está abaixo do mínimo, os benefícios ficam congelados e o contador para. Verifique o estado no seu painel antes de reportar como falha. Se o hold está coberto e mesmo assim não avança, é um caso para a equipe.',
      fr: 'La première chose à regarder, c’est le hold : si le compte est sous le minimum, les avantages sont gelés et le compteur s’arrête. Vérifie l’état dans ton tableau de bord avant de le signaler comme panne. Si le hold est couvert et que ça n’avance toujours pas, c’est un cas pour l’équipe.',
      ru: 'Первое, что нужно проверить, — hold: если аккаунт ниже минимума, преимущества заморожены и счётчик стоит. Посмотри состояние в панели, прежде чем сообщать о сбое. Если hold покрыт, а прогресса всё равно нет — это случай для команды.',
      sv: 'Det första att titta på är hold: ligger kontot under minimum fryses förmånerna och räknaren stannar. Kontrollera statusen i din panel innan du anmäler det som ett fel. Är hold täckt och det ändå inte går framåt är det ett ärende för teamet.',
      hr: 'Prvo treba pogledati hold: ako je račun ispod minimuma, pogodnosti su zamrznute i brojač staje. Provjeri stanje na svojoj ploči prije nego to prijaviš kao kvar. Ako je hold pokriven, a i dalje ne napreduje, to je slučaj za tim.',
      ar: 'أول ما يجب النظر إليه هو الـ hold: إذا كان الحساب تحت الحد الأدنى، تُجمَّد المزايا ويتوقف العدّاد. تحقّق من الحالة في لوحتك قبل الإبلاغ عن عطل. وإذا كان الـ hold مغطّى ومع ذلك لا يتقدّم، فهي حالة للفريق.',
      de: 'Als Erstes solltest du den Hold prüfen: Liegt das Konto unter dem Minimum, sind die Vorteile eingefroren und der Zähler steht. Prüfe den Status in deinem Panel, bevor du es als Störung meldest. Ist der Hold gedeckt und es geht trotzdem nicht voran, ist es ein Fall fürs Team.',
      sr: 'Прво треба погледати hold: ако је налог испод минимума, погодности су замрзнуте и бројач стаје. Провери стање на својој табли пре него што то пријавиш као квар. Ако је hold покривен, а и даље не напредује, то је случај за тим.',
      ur: 'سب سے پہلے hold دیکھیں: اگر اکاؤنٹ کم از کم سے نیچے ہے تو فوائد منجمد ہو جاتے ہیں اور کاؤنٹر رک جاتا ہے۔ خرابی کی اطلاع دینے سے پہلے اپنے پینل میں حالت دیکھیں۔ اگر hold پورا ہے اور پھر بھی نہیں بڑھتا تو یہ ٹیم کا کیس ہے۔',
    },
  'Pagué y no veo el pedido': {
    en: 'I paid and I do not see the order', pt: 'Paguei e não vejo o pedido',
    fr: 'J’ai payé et je ne vois pas la commande', ru: 'Я оплатил и не вижу заказ',
    sv: 'Jag betalade och ser ingen order', hr: 'Platio sam i ne vidim narudžbu',
    ar: 'دفعت ولا أرى الطلب', de: 'Ich habe bezahlt und sehe die Bestellung nicht',
    sr: 'Платио сам и не видим наруџбину', ur: 'میں نے ادائیگی کی اور آرڈر نظر نہیں آتا',
  },
  'No pagues otra vez. Entra en «Mis pedidos»: si el pedido quedó creado sin cobrar, puedes retomar el pago desde ahí, y el sistema no genera un segundo cargo. Si al fallar viste el aviso de que no se cobró nada, es literal: el cobro no llegó a producirse.':
    {
      en: 'Do not pay again. Go to “My orders”: if the order was created without being charged, you can resume the payment from there, and the system does not create a second charge. If when it failed you saw the notice saying nothing was charged, it is literal: the charge never happened.',
      pt: 'Não pague de novo. Entre em «Meus pedidos»: se o pedido ficou criado sem cobrança, você pode retomar o pagamento a partir dali, e o sistema não gera uma segunda cobrança. Se ao falhar você viu o aviso de que nada foi cobrado, é literal: a cobrança não chegou a acontecer.',
      fr: 'Ne repaie pas. Va dans « Mes commandes » : si la commande a été créée sans être débitée, tu peux reprendre le paiement de là, et le système ne génère pas un second débit. Si, à l’échec, tu as vu l’avis disant que rien n’a été débité, c’est littéral : le débit n’a pas eu lieu.',
      ru: 'Не плати снова. Зайди в «Мои заказы»: если заказ создан, но не оплачен, ты можешь возобновить оплату оттуда, и система не создаст второе списание. Если при сбое ты видел уведомление, что ничего не списалось, это буквально так: списания не произошло.',
      sv: 'Betala inte igen. Gå till ”Mina ordrar”: om ordern skapades utan att debiteras kan du återuppta betalningen därifrån, och systemet skapar ingen andra debitering. Om du vid felet såg meddelandet att inget debiterats är det bokstavligt: debiteringen blev aldrig av.',
      hr: 'Nemoj platiti ponovno. Uđi u «Moje narudžbe»: ako je narudžba stvorena bez naplate, odande možeš nastaviti plaćanje, a sustav ne stvara drugu naplatu. Ako si pri kvaru vidio obavijest da ništa nije naplaćeno, to je doslovno: naplata se nije ni dogodila.',
      ar: 'لا تدفع مرة أخرى. ادخل إلى «طلباتي»: إذا أُنشئ الطلب دون خصم، يمكنك استئناف الدفع من هناك، والنظام لا يولّد خصمًا ثانيًا. وإذا رأيت عند الفشل إشعارًا بأنه لم يُخصم شيء، فهو حرفيّ: الخصم لم يحدث أصلًا.',
      de: 'Zahle nicht erneut. Geh zu „Meine Bestellungen“: Wurde die Bestellung ohne Abbuchung erstellt, kannst du die Zahlung dort fortsetzen, und das System erzeugt keine zweite Abbuchung. Wenn du beim Fehlschlag den Hinweis gesehen hast, dass nichts abgebucht wurde, ist das wörtlich zu nehmen: die Abbuchung fand nicht statt.',
      sr: 'Немој платити поново. Уђи у «Моје наруџбине»: ако је наруџбина створена без наплате, одатле можеш наставити плаћање, а систем не ствара другу наплату. Ако си при квару видео обавештење да ништа није наплаћено, то је дословно: наплата се није ни догодила.',
      ur: 'دوبارہ ادائیگی نہ کریں۔ «میرے آرڈرز» میں جائیں: اگر آرڈر بغیر وصولی کے بن گیا تھا تو آپ وہیں سے ادائیگی دوبارہ شروع کر سکتے ہیں، اور نظام دوسرا چارج نہیں بناتا۔ اگر ناکامی پر آپ نے یہ نوٹس دیکھا کہ کچھ وصول نہیں ہوا، تو یہ لفظی ہے: وصولی ہوئی ہی نہیں۔',
    },
  'Mi pedido quedó a medias sin pagar': {
    en: 'My order was left half-finished, unpaid',
    pt: 'Meu pedido ficou pela metade, sem pagar',
    fr: 'Ma commande est restée à moitié faite, sans paiement',
    ru: 'Мой заказ остался незавершённым, неоплаченным',
    sv: 'Min order blev halvfärdig, obetald',
    hr: 'Moja je narudžba ostala nedovršena, neplaćena',
    ar: 'بقي طلبي ناقصًا دون دفع',
    de: 'Meine Bestellung ist halbfertig und unbezahlt geblieben',
    sr: 'Моја наруџбина је остала недовршена, неплаћена',
    ur: 'میرا آرڈر ادھورا رہ گیا، بغیر ادائیگی',
  },
  'Se puede retomar. El pedido queda creado y esperando el cobro, y desde «Mis pedidos» vuelves al mismo pago para confirmarlo. No se crea un pedido nuevo ni un cargo nuevo.':
    {
      en: 'It can be resumed. The order stays created and waiting to be charged, and from “My orders” you return to the same payment to confirm it. No new order and no new charge is created.',
      pt: 'Pode ser retomado. O pedido fica criado e esperando a cobrança, e a partir de «Meus pedidos» você volta ao mesmo pagamento para confirmá-lo. Não se cria um pedido novo nem uma cobrança nova.',
      fr: 'Elle peut être reprise. La commande reste créée en attente de paiement, et depuis « Mes commandes » tu reviens au même paiement pour le confirmer. Aucune nouvelle commande ni nouveau débit n’est créé.',
      ru: 'Его можно возобновить. Заказ остаётся созданным и ждёт оплаты, а из «Моих заказов» ты возвращаешься к тому же платежу, чтобы подтвердить его. Ни нового заказа, ни нового списания не создаётся.',
      sv: 'Den kan återupptas. Ordern förblir skapad och väntar på betalning, och från ”Mina ordrar” återvänder du till samma betalning för att bekräfta den. Ingen ny order och ingen ny debitering skapas.',
      hr: 'Može se nastaviti. Narudžba ostaje stvorena i čeka naplatu, a iz «Mojih narudžbi» vraćaš se na isto plaćanje da ga potvrdiš. Ne stvara se nova narudžba ni nova naplata.',
      ar: 'يمكن استئنافه. يبقى الطلب منشأً بانتظار الدفع، ومن «طلباتي» تعود إلى الدفع نفسه لتأكيده. لا يُنشأ طلب جديد ولا خصم جديد.',
      de: 'Sie lässt sich fortsetzen. Die Bestellung bleibt angelegt und wartet auf die Zahlung, und über „Meine Bestellungen“ kehrst du zur selben Zahlung zurück, um sie zu bestätigen. Es entsteht weder eine neue Bestellung noch eine neue Abbuchung.',
      sr: 'Може се наставити. Наруџбина остаје створена и чека наплату, а из «Мојих наруџбина» враћаш се на исто плаћање да га потврдиш. Не ствара се нова наруџбина ни нова наплата.',
      ur: 'اسے دوبارہ شروع کیا جا سکتا ہے۔ آرڈر بنا رہتا ہے اور ادائیگی کا منتظر ہوتا ہے، اور «میرے آرڈرز» سے آپ اُسی ادائیگی پر واپس جا کر تصدیق کرتے ہیں۔ نہ نیا آرڈر بنتا ہے نہ نیا چارج۔',
    },
  '¿Quién me responde si hay un problema con el producto?': {
    en: 'Who answers to me if there is a problem with the product?',
    pt: 'Quem me responde se houver um problema com o produto?',
    fr: 'Qui me répond s’il y a un problème avec le produit ?',
    ru: 'Кто отвечает, если с товаром проблема?',
    sv: 'Vem svarar mig om det blir problem med produkten?',
    hr: 'Tko mi odgovara ako ima problema s proizvodom?',
    ar: 'من يجيبني إذا كانت هناك مشكلة في المنتج؟',
    de: 'Wer ist für mich zuständig, wenn es ein Problem mit dem Produkt gibt?',
    sr: 'Ко ми одговара ако има проблема са производом?',
    ur: 'پروڈکٹ میں مسئلہ ہو تو مجھے کون جواب دے گا؟',
  },
  'Gevy. Compras a Gevy y reclamas a Gevy, con tu número de pedido. No tienes que averiguar quién fabrica o quién surte: eso es asunto nuestro, no tuyo.':
    {
      en: 'Gevy. You buy from Gevy and you claim from Gevy, with your order number. You do not have to find out who manufactures or who supplies: that is our business, not yours.',
      pt: 'A Gevy. Você compra da Gevy e reclama à Gevy, com seu número de pedido. Não tem que descobrir quem fabrica ou quem fornece: isso é assunto nosso, não seu.',
      fr: 'Gevy. Tu achètes chez Gevy et tu réclames chez Gevy, avec ton numéro de commande. Tu n’as pas à chercher qui fabrique ni qui approvisionne : ça, c’est notre affaire, pas la tienne.',
      ru: 'Gevy. Ты покупаешь у Gevy и обращаешься к Gevy, с номером своего заказа. Тебе не нужно выяснять, кто производит и кто поставляет: это наша забота, не твоя.',
      sv: 'Gevy. Du köper av Gevy och reklamerar hos Gevy, med ditt ordernummer. Du behöver inte ta reda på vem som tillverkar eller levererar: det är vår sak, inte din.',
      hr: 'Gevy. Kupuješ od Gevyja i reklamiraš Gevyju, sa svojim brojem narudžbe. Ne moraš doznavati tko proizvodi ni tko dobavlja: to je naša stvar, ne tvoja.',
      ar: 'Gevy. تشتري من Gevy وتُطالب Gevy، برقم طلبك. لست مضطرًا لمعرفة من يصنع أو من يورّد: هذا شأننا نحن، لا شأنك.',
      de: 'Gevy. Du kaufst bei Gevy und reklamierst bei Gevy, mit deiner Bestellnummer. Du musst nicht herausfinden, wer herstellt oder wer liefert: Das ist unsere Sache, nicht deine.',
      sr: 'Gevy. Купујеш од Gevy-ја и рекламираш Gevy-ју, са својим бројем наруџбине. Не мораш сазнавати ко производи ни ко снабдева: то је наша ствар, не твоја.',
      ur: 'Gevy۔ آپ Gevy سے خریدتے ہیں اور Gevy سے ہی شکایت کرتے ہیں، اپنے آرڈر نمبر کے ساتھ۔ آپ کو یہ معلوم کرنے کی ضرورت نہیں کہ کون بناتا یا کون سپلائی کرتا ہے: یہ ہمارا کام ہے، آپ کا نہیں۔',
    },
  '¿Qué es Gevy?': {
    en: 'What is Gevy?', pt: 'O que é a Gevy?', fr: 'Qu’est-ce que Gevy ?',
    ru: 'Что такое Gevy?', sv: 'Vad är Gevy?', hr: 'Što je Gevy?',
    ar: 'ما هو Gevy؟', de: 'Was ist Gevy?', sr: 'Шта је Gevy?', ur: 'Gevy کیا ہے؟',
  },
  'Es la tienda de Genesis: un catálogo global con envío internacional donde compras productos reales y te llegan a casa, pagando desde tu wallet con AIG y USDT.':
    {
      en: 'It is the Genesis store: a global catalogue with international shipping where you buy real products delivered to your home, paying from your wallet with AIG and USDT.',
      pt: 'É a loja da Genesis: um catálogo global com envio internacional onde você compra produtos reais que chegam à sua casa, pagando pela sua carteira com AIG e USDT.',
      fr: 'C’est la boutique de Genesis : un catalogue mondial avec livraison internationale où tu achètes de vrais produits livrés chez toi, en payant depuis ton portefeuille en AIG et USDT.',
      ru: 'Это магазин Genesis: глобальный каталог с международной доставкой, где ты покупаешь настоящие товары с доставкой домой, оплачивая из кошелька в AIG и USDT.',
      sv: 'Det är Genesis butik: en global katalog med internationell frakt där du köper riktiga produkter som levereras hem, och betalar från din plånbok med AIG och USDT.',
      hr: 'To je Genesisova trgovina: globalni katalog s međunarodnom dostavom gdje kupuješ stvarne proizvode koji stižu kući, plaćajući iz svog novčanika AIG-om i USDT-om.',
      ar: 'هو متجر Genesis: كتالوج عالمي بشحن دولي تشتري فيه منتجات حقيقية تصلك إلى بيتك، وتدفع من محفظتك بالـ AIG و USDT.',
      de: 'Das ist der Genesis-Shop: ein globaler Katalog mit internationalem Versand, in dem du echte Produkte kaufst, die nach Hause geliefert werden — bezahlt aus deiner Wallet mit AIG und USDT.',
      sr: 'То је Genesis-ова продавница: глобални каталог са међународном доставом где купујеш стварне производе који стижу кући, плаћајући из свог новчаника AIG-ом и USDT-ом.',
      ur: 'یہ Genesis کی دکان ہے: بین الاقوامی ترسیل کے ساتھ ایک عالمی کیٹلاگ جہاں آپ حقیقی مصنوعات خریدتے ہیں جو گھر پہنچتی ہیں، اپنے والٹ سے AIG اور USDT میں ادائیگی کرتے ہوئے۔',
    },
  '¿Tengo que registrarme en Gevy?': {
    en: 'Do I have to register on Gevy?', pt: 'Tenho que me cadastrar na Gevy?',
    fr: 'Dois-je m’inscrire sur Gevy ?', ru: 'Нужно ли регистрироваться в Gevy?',
    sv: 'Måste jag registrera mig på Gevy?', hr: 'Moram li se registrirati na Gevy?',
    ar: 'هل عليّ التسجيل في Gevy؟', de: 'Muss ich mich bei Gevy registrieren?',
    sr: 'Морам ли да се региструјем на Gevy?', ur: 'کیا مجھے Gevy پر رجسٹر کرنا ہوگا؟',
  },
  'No. Es la misma cuenta de Genesis: si ya entras al ecosistema, ya estás dentro de la tienda. No hay un alta aparte ni una contraseña distinta.':
    {
      en: 'No. It is the same Genesis account: if you already sign in to the ecosystem, you are already inside the store. There is no separate sign-up and no different password.',
      pt: 'Não. É a mesma conta da Genesis: se você já entra no ecossistema, já está dentro da loja. Não há um cadastro à parte nem uma senha diferente.',
      fr: 'Non. C’est le même compte Genesis : si tu accèdes déjà à l’écosystème, tu es déjà dans la boutique. Il n’y a pas d’inscription séparée ni de mot de passe différent.',
      ru: 'Нет. Это тот же аккаунт Genesis: если ты уже входишь в экосистему, ты уже внутри магазина. Отдельной регистрации и другого пароля нет.',
      sv: 'Nej. Det är samma Genesis-konto: loggar du redan in i ekosystemet är du redan inne i butiken. Det finns ingen separat registrering och inget annat lösenord.',
      hr: 'Ne. To je isti Genesis račun: ako već ulaziš u ekosustav, već si u trgovini. Nema zasebne registracije ni druge lozinke.',
      ar: 'لا. إنه حساب Genesis نفسه: إن كنت تدخل النظام البيئي فأنت داخل المتجر بالفعل. لا يوجد تسجيل منفصل ولا كلمة مرور مختلفة.',
      de: 'Nein. Es ist dasselbe Genesis-Konto: Wenn du dich schon im Ökosystem anmeldest, bist du bereits im Shop. Es gibt keine separate Anmeldung und kein anderes Passwort.',
      sr: 'Не. То је исти Genesis налог: ако већ улазиш у екосистем, већ си у продавници. Нема засебне регистрације ни друге лозинке.',
      ur: 'نہیں۔ یہ وہی Genesis اکاؤنٹ ہے: اگر آپ پہلے ہی ایکو سسٹم میں داخل ہوتے ہیں تو آپ دکان کے اندر بھی ہیں۔ نہ الگ رجسٹریشن ہے نہ مختلف پاس ورڈ۔',
    },
  '¿Qué pasó con AIGMarket?': {
    en: 'What happened to AIGMarket?', pt: 'O que aconteceu com o AIGMarket?',
    fr: 'Qu’est devenu AIGMarket ?', ru: 'Что стало с AIGMarket?',
    sv: 'Vad hände med AIGMarket?', hr: 'Što je bilo s AIGMarketom?',
    ar: 'ماذا حدث لـ AIGMarket؟', de: 'Was ist aus AIGMarket geworden?',
    sr: 'Шта је било са AIGMarket-ом?', ur: 'AIGMarket کا کیا ہوا؟',
  },
  'Gevy lo sucede: es el marketplace único del ecosistema. AIGMarket pasa a ser una herramienta dentro de Gevy, en desarrollo futuro. Para comprar hoy no hay que elegir entre dos sitios — el sitio es Gevy.':
    {
      en: 'Gevy succeeds it: it is the ecosystem’s single marketplace. AIGMarket becomes a tool inside Gevy, in future development. To buy today there is no choosing between two sites — the site is Gevy.',
      pt: 'A Gevy o sucede: é o marketplace único do ecossistema. O AIGMarket passa a ser uma ferramenta dentro da Gevy, em desenvolvimento futuro. Para comprar hoje não há que escolher entre dois sites — o site é a Gevy.',
      fr: 'Gevy lui succède : c’est la marketplace unique de l’écosystème. AIGMarket devient un outil au sein de Gevy, en développement futur. Pour acheter aujourd’hui, pas de choix entre deux sites — le site, c’est Gevy.',
      ru: 'Его сменяет Gevy: это единый маркетплейс экосистемы. AIGMarket становится инструментом внутри Gevy, в будущей разработке. Чтобы купить сегодня, выбирать между двумя сайтами не нужно — сайт это Gevy.',
      sv: 'Gevy efterträder den: det är ekosystemets enda marknadsplats. AIGMarket blir ett verktyg inuti Gevy, under framtida utveckling. För att handla i dag finns inget val mellan två sajter — sajten är Gevy.',
      hr: 'Nasljeđuje ga Gevy: to je jedinstvena tržnica ekosustava. AIGMarket postaje alat unutar Gevyja, u budućem razvoju. Za kupnju danas ne treba birati između dva mjesta — mjesto je Gevy.',
      ar: 'يخلفه Gevy: هو السوق الوحيد للنظام البيئي. ويصبح AIGMarket أداة داخل Gevy، قيد تطوير مستقبلي. للشراء اليوم لا اختيار بين موقعين — الموقع هو Gevy.',
      de: 'Gevy folgt darauf: Es ist der einzige Marktplatz des Ökosystems. AIGMarket wird zu einem Werkzeug innerhalb von Gevy, in künftiger Entwicklung. Um heute zu kaufen, muss man nicht zwischen zwei Seiten wählen — die Seite ist Gevy.',
      sr: 'Наслеђује га Gevy: то је јединствени маркетплејс екосистема. AIGMarket постаје алат унутар Gevy-ја, у будућем развоју. За куповину данас не треба бирати између два места — место је Gevy.',
      ur: 'اس کی جگہ Gevy لیتا ہے: یہ ایکو سسٹم کا واحد مارکیٹ پلیس ہے۔ AIGMarket، Gevy کے اندر ایک ٹول بن جاتا ہے، آئندہ ترقی میں۔ آج خریدنے کے لیے دو سائٹس میں سے چننا نہیں پڑتا — سائٹ Gevy ہے۔',
    },

  /* ══════════════════════════════════════════════════════════════════
     CORPUS · ENVÍO, SEÑALES, RED Y NOVEDADES

     CUATRO RESPUESTAS QUE DICEN «NO», y son las más valiosas del corpus:
     una señal NO es una recomendación · G-Pulse NO predice · NO se publica un
     porcentaje de aciertos · G-Pulse NO opera por ti.

     Cada una está redactada para cerrar una expectativa, no para sonar modesta.
     Traducidas con un «no exactamente» o un «no del todo» dejan la puerta
     entreabierta, y por esa rendija entra justo lo que niegan. En los once
     idiomas el «no» va primero y va solo.

     LA TABLA DE RANGOS SE COPIA ENTERA: los nombres —Bronze, Silver, Gold,
     Zappire, Ruby, Emerald, Diamond, Blue/Black/Red Diamond, G11— no se
     traducen, son nombres de nivel. Los puntos y los USDT tampoco se tocan.
     ══════════════════════════════════════════════════════════════════ */
  '¿Una señal me está diciendo que compre o que venda?': {
    en: 'Is a signal telling me to buy or to sell?',
    pt: 'Um sinal está me dizendo para comprar ou vender?',
    fr: 'Un signal me dit-il d’acheter ou de vendre ?',
    ru: 'Сигнал говорит мне покупать или продавать?',
    sv: 'Säger en signal åt mig att köpa eller sälja?',
    hr: 'Govori li mi signal da kupim ili prodam?',
    ar: 'هل تخبرني الإشارة بأن أشتري أو أبيع؟',
    de: 'Sagt mir ein Signal, ob ich kaufen oder verkaufen soll?',
    sr: 'Да ли ми сигнал говори да купим или продам?',
    ur: 'کیا سگنل مجھے خریدنے یا بیچنے کو کہہ رہا ہے؟',
  },
  'No. Una señal describe una condición que se ha cumplido en el mercado — nada más. No es una recomendación, no conoce tu situación y no te dice qué hacer. La decisión y el riesgo son de quien opera, siempre.':
    {
      en: 'No. A signal describes a condition that has been met in the market — nothing more. It is not a recommendation, it does not know your situation and it does not tell you what to do. The decision and the risk belong to whoever trades, always.',
      pt: 'Não. Um sinal descreve uma condição que se cumpriu no mercado — nada mais. Não é uma recomendação, não conhece sua situação e não lhe diz o que fazer. A decisão e o risco são de quem opera, sempre.',
      fr: 'Non. Un signal décrit une condition qui s’est réalisée sur le marché — rien de plus. Ce n’est pas une recommandation, il ne connaît pas ta situation et il ne te dit pas quoi faire. La décision et le risque appartiennent à celui qui opère, toujours.',
      ru: 'Нет. Сигнал описывает условие, которое выполнилось на рынке — и только. Это не рекомендация, он не знает твоей ситуации и не говорит, что делать. Решение и риск всегда на том, кто торгует.',
      sv: 'Nej. En signal beskriver ett villkor som uppfyllts på marknaden — inget mer. Den är ingen rekommendation, den känner inte din situation och säger inte vad du ska göra. Beslutet och risken tillhör den som handlar, alltid.',
      hr: 'Ne. Signal opisuje uvjet koji se ispunio na tržištu — ništa više. Nije preporuka, ne poznaje tvoju situaciju i ne govori ti što činiti. Odluka i rizik pripadaju onome tko trguje, uvijek.',
      ar: 'لا. الإشارة تصف شرطًا تحقّق في السوق — لا أكثر. ليست توصية، ولا تعرف وضعك، ولا تخبرك بما تفعل. القرار والمخاطرة يخصّان من يتداول، دائمًا.',
      de: 'Nein. Ein Signal beschreibt eine Bedingung, die am Markt eingetreten ist — mehr nicht. Es ist keine Empfehlung, es kennt deine Lage nicht und sagt dir nicht, was zu tun ist. Entscheidung und Risiko liegen immer bei dem, der handelt.',
      sr: 'Не. Сигнал описује услов који се испунио на тржишту — ништа више. Није препорука, не познаје твоју ситуацију и не говори ти шта да радиш. Одлука и ризик припадају ономе ко тргује, увек.',
      ur: 'نہیں۔ سگنل صرف یہ بتاتا ہے کہ مارکیٹ میں کوئی شرط پوری ہوئی — بس۔ یہ سفارش نہیں، آپ کی صورتحال نہیں جانتا اور یہ نہیں بتاتا کہ کیا کریں۔ فیصلہ اور خطرہ ہمیشہ اُسی کا ہے جو ٹریڈ کرتا ہے۔',
    },
  '¿G-Pulse predice lo que va a pasar?': {
    en: 'Does G-Pulse predict what is going to happen?',
    pt: 'O G-Pulse prevê o que vai acontecer?',
    fr: 'G-Pulse prédit-il ce qui va arriver ?',
    ru: 'Предсказывает ли G-Pulse, что произойдёт?',
    sv: 'Förutsäger G-Pulse vad som kommer att hända?',
    hr: 'Predviđa li G-Pulse što će se dogoditi?',
    ar: 'هل يتنبّأ G-Pulse بما سيحدث؟',
    de: 'Sagt G-Pulse voraus, was passieren wird?',
    sr: 'Да ли G-Pulse предвиђа шта ће се десити?',
    ur: 'کیا G-Pulse پیش گوئی کرتا ہے کہ کیا ہوگا؟',
  },
  'No. Procesa lo que ya ocurrió y lo que está ocurriendo. Cualquier lectura de la herramienta como anticipación del futuro es un malentendido: ningún sistema puede sostener eso, y G-Pulse tampoco lo intenta.':
    {
      en: 'No. It processes what has already happened and what is happening. Reading the tool as an anticipation of the future is a misunderstanding: no system can sustain that, and G-Pulse does not attempt it either.',
      pt: 'Não. Processa o que já ocorreu e o que está ocorrendo. Qualquer leitura da ferramenta como antecipação do futuro é um mal-entendido: nenhum sistema pode sustentar isso, e o G-Pulse também não tenta.',
      fr: 'Non. Il traite ce qui s’est déjà produit et ce qui se produit. Lire l’outil comme une anticipation de l’avenir est un malentendu : aucun système ne peut soutenir cela, et G-Pulse n’essaie pas non plus.',
      ru: 'Нет. Он обрабатывает то, что уже произошло и что происходит сейчас. Читать инструмент как предвидение будущего — недоразумение: ни одна система не может это утверждать, и G-Pulse тоже не пытается.',
      sv: 'Nej. Den bearbetar det som redan hänt och det som händer. Att läsa verktyget som en förutsägelse av framtiden är ett missförstånd: inget system kan hävda det, och G-Pulse försöker inte heller.',
      hr: 'Ne. Obrađuje ono što se već dogodilo i što se događa. Čitanje alata kao predviđanja budućnosti nesporazum je: nijedan sustav to ne može tvrditi, pa ni G-Pulse ne pokušava.',
      ar: 'لا. يعالج ما حدث بالفعل وما يحدث الآن. قراءة الأداة كاستباق للمستقبل سوء فهم: لا يمكن لأي نظام أن يزعم ذلك، و G-Pulse لا يحاوله أصلًا.',
      de: 'Nein. Es verarbeitet, was bereits geschehen ist und was gerade geschieht. Das Werkzeug als Vorwegnahme der Zukunft zu lesen, ist ein Missverständnis: Kein System kann das leisten, und G-Pulse versucht es auch nicht.',
      sr: 'Не. Обрађује оно што се већ десило и што се дешава. Читање алата као предвиђања будућности је неспоразум: ниједан систем то не може тврдити, па ни G-Pulse не покушава.',
      ur: 'نہیں۔ یہ اُس پر کام کرتا ہے جو ہو چکا اور جو ہو رہا ہے۔ اِس ٹول کو مستقبل کی پیش بینی سمجھنا غلط فہمی ہے: کوئی نظام یہ دعویٰ نہیں کر سکتا، اور G-Pulse کوشش بھی نہیں کرتا۔',
    },
  '¿Qué porcentaje de aciertos tienen las señales?': {
    en: 'What is the signals’ success rate?',
    pt: 'Qual é a porcentagem de acertos dos sinais?',
    fr: 'Quel est le taux de réussite des signaux ?',
    ru: 'Какой процент попаданий у сигналов?',
    sv: 'Vilken träffprocent har signalerna?',
    hr: 'Koliki je postotak pogodaka signala?',
    ar: 'ما نسبة نجاح الإشارات؟',
    de: 'Welche Trefferquote haben die Signale?',
    sr: 'Колики је проценат погодака сигнала?',
    ur: 'سگنلز کی درستی کی شرح کیا ہے؟',
  },
  'No se publica un porcentaje de aciertos, y no es una omisión: una cifra así convertiría la herramienta en algo con resultado esperado, que es justo lo que no es. Si algún día se publican métricas, irán con su método y su periodo, o no irán.':
    {
      en: 'No success rate is published, and that is not an omission: a figure like that would turn the tool into something with an expected outcome, which is exactly what it is not. If metrics are ever published, they will come with their method and their period, or they will not come at all.',
      pt: 'Não se publica uma porcentagem de acertos, e não é uma omissão: uma cifra assim converteria a ferramenta em algo com resultado esperado, que é justamente o que ela não é. Se algum dia forem publicadas métricas, virão com seu método e seu período, ou não virão.',
      fr: 'Aucun taux de réussite n’est publié, et ce n’est pas un oubli : un tel chiffre transformerait l’outil en quelque chose à résultat attendu, ce qu’il n’est justement pas. Si des métriques sont un jour publiées, elles viendront avec leur méthode et leur période, ou elles ne viendront pas.',
      ru: 'Процент попаданий не публикуется, и это не упущение: такая цифра превратила бы инструмент в нечто с ожидаемым результатом — а он именно этим не является. Если когда-нибудь метрики опубликуют, они выйдут вместе со своим методом и периодом, либо не выйдут вовсе.',
      sv: 'Ingen träffprocent publiceras, och det är ingen glömska: en sådan siffra skulle göra verktyget till något med förväntat utfall, vilket det just inte är. Om mätvärden någon gång publiceras kommer de med sin metod och sin period, annars kommer de inte alls.',
      hr: 'Postotak pogodaka se ne objavljuje, i to nije propust: takva bi brojka pretvorila alat u nešto s očekivanim ishodom, a upravo to nije. Ako se ikad objave mjere, doći će sa svojom metodom i razdobljem, ili neće doći.',
      ar: 'لا تُنشر نسبة نجاح، وهذا ليس إغفالًا: رقم كهذا يحوّل الأداة إلى شيء ذي نتيجة متوقّعة، وهو تحديدًا ما ليست عليه. وإن نُشرت مقاييس يومًا ما، فستأتي مع منهجها وفترتها، أو لن تأتي.',
      de: 'Es wird keine Trefferquote veröffentlicht, und das ist kein Versäumnis: Eine solche Zahl machte aus dem Werkzeug etwas mit erwartetem Ergebnis — genau das ist es nicht. Sollten je Kennzahlen veröffentlicht werden, kommen sie mit Methode und Zeitraum, oder sie kommen gar nicht.',
      sr: 'Проценат погодака се не објављује, и то није пропуст: таква би бројка претворила алат у нешто са очекиваним исходом, а управо то није. Ако се икад објаве мере, доћи ће са својом методом и периодом, или неће доћи.',
      ur: 'درستی کی کوئی شرح شائع نہیں کی جاتی، اور یہ بھول نہیں: ایسا عدد اِس ٹول کو متوقع نتیجے والی چیز بنا دیتا، جو یہ بالکل نہیں ہے۔ اگر کبھی پیمائشیں شائع ہوئیں تو وہ اپنے طریقے اور مدت کے ساتھ آئیں گی، ورنہ آئیں گی ہی نہیں۔',
    },
  '¿G-Pulse opera por mí?': {
    en: 'Does G-Pulse trade for me?', pt: 'O G-Pulse opera por mim?',
    fr: 'G-Pulse trade-t-il à ma place ?', ru: 'Торгует ли G-Pulse за меня?',
    sv: 'Handlar G-Pulse åt mig?', hr: 'Trguje li G-Pulse umjesto mene?',
    ar: 'هل يتداول G-Pulse نيابةً عني؟', de: 'Handelt G-Pulse für mich?',
    sr: 'Да ли G-Pulse тргује уместо мене?', ur: 'کیا G-Pulse میری جگہ ٹریڈ کرتا ہے؟',
  },
  'No. Informa. Quien decide y ejecuta es la persona, con su propio criterio.': {
    en: 'No. It informs. The one who decides and executes is the person, using their own judgement.',
    pt: 'Não. Informa. Quem decide e executa é a pessoa, com seu próprio critério.',
    fr: 'Non. Il informe. Celui qui décide et exécute, c’est la personne, avec son propre jugement.',
    ru: 'Нет. Он информирует. Решает и исполняет человек, по собственному усмотрению.',
    sv: 'Nej. Den informerar. Den som beslutar och utför är personen, efter eget omdöme.',
    hr: 'Ne. Informira. Onaj tko odlučuje i izvršava jest osoba, po vlastitoj prosudbi.',
    ar: 'لا. هو يُعلم فقط. من يقرّر وينفّذ هو الشخص، بتقديره الخاص.',
    de: 'Nein. Es informiert. Wer entscheidet und ausführt, ist die Person, nach eigenem Urteil.',
    sr: 'Не. Информише. Онај ко одлучује и извршава јесте особа, по сопственој процени.',
    ur: 'نہیں۔ یہ صرف بتاتا ہے۔ فیصلہ اور عمل انسان کا ہے، اپنی صوابدید سے۔',
  },
  '¿Cómo sé en qué punto está mi pedido?': {
    en: 'How do I know where my order is?', pt: 'Como sei em que ponto está meu pedido?',
    fr: 'Comment savoir où en est ma commande ?', ru: 'Как узнать, на каком этапе мой заказ?',
    sv: 'Hur vet jag var min order befinner sig?', hr: 'Kako znam gdje je moja narudžba?',
    ar: 'كيف أعرف أين وصل طلبي؟', de: 'Woher weiß ich, wo meine Bestellung steht?',
    sr: 'Како да знам где је моја наруџбина?', ur: 'مجھے کیسے پتہ چلے کہ میرا آرڈر کہاں ہے؟',
  },
  'El pedido va contando su estado solo, y recibes aviso en los momentos que importan: pagado, enviado, en tránsito y entregado. No hace falta preguntar para saber dónde está.':
    {
      en: 'The order reports its own status, and you get a notice at the moments that matter: paid, shipped, in transit and delivered. You do not need to ask to know where it is.',
      pt: 'O pedido vai contando seu estado sozinho, e você recebe aviso nos momentos que importam: pago, enviado, em trânsito e entregue. Não é preciso perguntar para saber onde está.',
      fr: 'La commande raconte son état toute seule, et tu reçois un avis aux moments qui comptent : payée, expédiée, en transit et livrée. Pas besoin de demander pour savoir où elle est.',
      ru: 'Заказ сам сообщает свой статус, и ты получаешь уведомление в важные моменты: оплачен, отправлен, в пути и доставлен. Спрашивать, где он, не нужно.',
      sv: 'Ordern berättar sin status själv, och du får besked i de ögonblick som betyder något: betald, skickad, under transport och levererad. Du behöver inte fråga för att veta var den är.',
      hr: 'Narudžba sama javlja svoje stanje, a obavijest dobivaš u trenucima koji su važni: plaćeno, poslano, u prijevozu i isporučeno. Ne treba pitati da bi znao gdje je.',
      ar: 'الطلب يروي حالته بنفسه، وتصلك إشعارات في اللحظات المهمة: مدفوع، مُرسل، قيد النقل، ومُسلَّم. لا حاجة للسؤال لتعرف أين هو.',
      de: 'Die Bestellung meldet ihren Status selbst, und du bekommst eine Nachricht zu den Momenten, die zählen: bezahlt, versandt, unterwegs und zugestellt. Du musst nicht nachfragen, um zu wissen, wo sie ist.',
      sr: 'Наруџбина сама јавља своје стање, а обавештење добијаш у тренуцима који су важни: плаћено, послато, у превозу и испоручено. Не треба питати да би знао где је.',
      ur: 'آرڈر خود اپنی حالت بتاتا رہتا ہے، اور اہم لمحوں پر آپ کو اطلاع ملتی ہے: ادا شدہ، بھیجا گیا، راستے میں، اور پہنچا دیا گیا۔ یہ جاننے کے لیے پوچھنے کی ضرورت نہیں کہ وہ کہاں ہے۔',
    },
  'Mi pedido lleva días en el mismo estado': {
    en: 'My order has been in the same status for days',
    pt: 'Meu pedido está há dias no mesmo estado',
    fr: 'Ma commande est au même statut depuis des jours',
    ru: 'Мой заказ уже несколько дней в одном статусе',
    sv: 'Min order har haft samma status i flera dagar',
    hr: 'Moja je narudžba danima u istom stanju',
    ar: 'طلبي في الحالة نفسها منذ أيام',
    de: 'Meine Bestellung steht seit Tagen im selben Status',
    sr: 'Моја наруџбина је данима у истом стању',
    ur: 'میرا آرڈر کئی دن سے ایک ہی حالت میں ہے',
  },
  'En envío internacional es normal que el estado se quede quieto un tiempo, sobre todo entre que sale del almacén y entra en la red del país de destino. Si pasa de ahí sin moverse, escribe con tu número de pedido y se revisa.':
    {
      en: 'With international shipping it is normal for the status to sit still for a while, especially between leaving the warehouse and entering the destination country’s network. If it goes beyond that without moving, write in with your order number and it will be reviewed.',
      pt: 'No envio internacional é normal que o estado fique parado um tempo, sobretudo entre a saída do armazém e a entrada na rede do país de destino. Se passar disso sem se mover, escreva com seu número de pedido e será revisado.',
      fr: 'En livraison internationale, il est normal que le statut reste figé un temps, surtout entre la sortie de l’entrepôt et l’entrée dans le réseau du pays de destination. Si ça dépasse ce délai sans bouger, écris avec ton numéro de commande et on regardera.',
      ru: 'При международной доставке нормально, что статус какое-то время стоит — особенно между выходом со склада и входом в сеть страны назначения. Если после этого он не двигается, напиши с номером заказа, и это проверят.',
      sv: 'Vid internationell frakt är det normalt att statusen står stilla ett tag, särskilt mellan att den lämnar lagret och kommer in i destinationslandets nät. Rör den sig inte efter det, skriv med ditt ordernummer så ses det över.',
      hr: 'Kod međunarodne dostave normalno je da stanje neko vrijeme miruje, osobito između izlaska iz skladišta i ulaska u mrežu odredišne zemlje. Ako i nakon toga stoji, javi se sa svojim brojem narudžbe pa će se pregledati.',
      ar: 'في الشحن الدولي من الطبيعي أن تبقى الحالة ثابتة بعض الوقت، خصوصًا بين مغادرة المستودع ودخول شبكة بلد الوجهة. وإن تجاوز ذلك دون حركة، راسلنا برقم طلبك وسيُراجَع.',
      de: 'Beim internationalen Versand ist es normal, dass der Status eine Weile stillsteht — vor allem zwischen dem Verlassen des Lagers und dem Eintritt ins Netz des Ziellands. Bewegt er sich darüber hinaus nicht, schreib mit deiner Bestellnummer und es wird geprüft.',
      sr: 'Код међународне доставе нормално је да стање неко време мирује, посебно између изласка из складишта и уласка у мрежу земље одредишта. Ако и након тога стоји, јави се са својим бројем наруџбине па ће се прегледати.',
      ur: 'بین الاقوامی ترسیل میں کچھ عرصہ حالت ساکن رہنا معمول ہے، خاص طور پر گودام سے نکلنے اور منزل کے ملک کے نیٹ ورک میں داخل ہونے کے درمیان۔ اگر اس سے آگے بھی نہ ہلے تو اپنے آرڈر نمبر کے ساتھ لکھیں، جائزہ لیا جائے گا۔',
    },
  '¿Enviáis a mi país?': {
    en: 'Do you ship to my country?', pt: 'Vocês enviam para o meu país?',
    fr: 'Livrez-vous dans mon pays ?', ru: 'Вы доставляете в мою страну?',
    sv: 'Skickar ni till mitt land?', hr: 'Šaljete li u moju zemlju?',
    ar: 'هل تشحنون إلى بلدي؟', de: 'Versendet ihr in mein Land?',
    sr: 'Да ли шаљете у моју земљу?', ur: 'کیا آپ میرے ملک بھیجتے ہیں؟',
  },
  'El catálogo sólo ofrece en cada país lo que se puede entregar allí: si un producto te aparece disponible, es porque hay envío a tu destino. Si no aparece, no es un fallo de la búsqueda — es que ese artículo no llega ahí.':
    {
      en: 'In each country the catalogue only offers what can be delivered there: if a product shows as available to you, it is because there is shipping to your destination. If it does not appear, it is not a search failure — it is that the item does not reach there.',
      pt: 'O catálogo só oferece em cada país o que se pode entregar ali: se um produto aparece disponível para você, é porque há envio ao seu destino. Se não aparece, não é uma falha da busca — é que aquele artigo não chega ali.',
      fr: 'Le catalogue ne propose dans chaque pays que ce qui peut y être livré : si un produit t’apparaît disponible, c’est qu’il existe une livraison vers ta destination. S’il n’apparaît pas, ce n’est pas une défaillance de la recherche — c’est que cet article n’arrive pas là-bas.',
      ru: 'В каждой стране каталог показывает только то, что туда можно доставить: если товар отображается доступным, значит доставка до тебя есть. Если его нет, это не сбой поиска — просто этот товар туда не едет.',
      sv: 'Katalogen erbjuder i varje land bara det som går att leverera dit: syns en produkt som tillgänglig för dig är det för att det finns frakt till din destination. Syns den inte är det inget sökfel — det är att artikeln inte når dit.',
      hr: 'Katalog u svakoj zemlji nudi samo ono što se ondje može isporučiti: ako ti se proizvod prikaže kao dostupan, to je zato što postoji dostava na tvoje odredište. Ako se ne pojavi, nije kvar pretrage — nego taj artikl onamo ne stiže.',
      ar: 'يعرض الكتالوج في كل بلد ما يمكن توصيله هناك فقط: إن ظهر لك منتج متاحًا، فلأن هناك شحنًا إلى وجهتك. وإن لم يظهر، فليس خللًا في البحث — بل لأن ذلك الصنف لا يصل إلى هناك.',
      de: 'Der Katalog bietet in jedem Land nur an, was dorthin geliefert werden kann: Erscheint dir ein Produkt als verfügbar, dann weil es Versand an dein Ziel gibt. Erscheint es nicht, ist das kein Suchfehler — der Artikel kommt dort schlicht nicht an.',
      sr: 'Каталог у свакој земљи нуди само оно што се тамо може испоручити: ако ти се производ прикаже као доступан, то је зато што постоји достава на твоје одредиште. Ако се не појави, није квар претраге — него тај артикал тамо не стиже.',
      ur: 'کیٹلاگ ہر ملک میں صرف وہی پیش کرتا ہے جو وہاں پہنچایا جا سکتا ہے: اگر آپ کو کوئی پروڈکٹ دستیاب دکھے تو اس کا مطلب ہے کہ آپ کی منزل تک ترسیل ہے۔ اگر نہ دکھے تو یہ تلاش کی خرابی نہیں — بلکہ وہ چیز وہاں نہیں پہنچتی۔',
    },
  '¿Cuándo sale la próxima actualización o novedad?': {
    en: 'When is the next update or announcement?',
    pt: 'Quando sai a próxima atualização ou novidade?',
    fr: 'Quand sort la prochaine mise à jour ou nouveauté ?',
    ru: 'Когда выйдет следующее обновление или новость?',
    sv: 'När kommer nästa uppdatering eller nyhet?',
    hr: 'Kada izlazi sljedeća nadogradnja ili novost?',
    ar: 'متى يصدر التحديث أو الجديد القادم؟',
    de: 'Wann kommt das nächste Update oder die nächste Neuigkeit?',
    sr: 'Када излази следећа надоградња или новост?',
    ur: 'اگلی اپ ڈیٹ یا خبر کب آئے گی؟',
  },
  'Las fechas y novedades se anuncian únicamente por los canales oficiales del ecosistema. Si viste una fecha en otro lado, trátala con cautela: nadie fuera del equipo puede confirmarla. Cuando algo esté disponible, lo verás anunciado — y aquí se responde sobre lo que ya existe, no sobre promesas.':
    {
      en: 'Dates and news are announced only through the ecosystem’s official channels. If you saw a date somewhere else, treat it with caution: nobody outside the team can confirm it. When something is available, you will see it announced — and here we answer about what already exists, not about promises.',
      pt: 'As datas e novidades são anunciadas unicamente pelos canais oficiais do ecossistema. Se você viu uma data em outro lugar, trate-a com cautela: ninguém fora da equipe pode confirmá-la. Quando algo estiver disponível, você o verá anunciado — e aqui se responde sobre o que já existe, não sobre promessas.',
      fr: 'Les dates et nouveautés sont annoncées uniquement par les canaux officiels de l’écosystème. Si tu as vu une date ailleurs, prends-la avec prudence : personne en dehors de l’équipe ne peut la confirmer. Quand quelque chose sera disponible, tu le verras annoncé — et ici on répond sur ce qui existe déjà, pas sur des promesses.',
      ru: 'Даты и новости объявляются только по официальным каналам экосистемы. Если ты видел дату где-то ещё, отнесись к ней осторожно: никто вне команды не может её подтвердить. Когда что-то станет доступно, ты увидишь объявление — а здесь отвечают о том, что уже есть, а не об обещаниях.',
      sv: 'Datum och nyheter meddelas endast via ekosystemets officiella kanaler. Har du sett ett datum någon annanstans, ta det med försiktighet: ingen utanför teamet kan bekräfta det. När något finns tillgängligt kommer du att se det annonserat — och här svarar vi om det som redan finns, inte om löften.',
      hr: 'Datumi i novosti objavljuju se isključivo putem službenih kanala ekosustava. Ako si datum vidio negdje drugdje, uzmi ga s oprezom: nitko izvan tima ne može ga potvrditi. Kad nešto bude dostupno, vidjet ćeš objavu — a ovdje se odgovara o onome što već postoji, ne o obećanjima.',
      ar: 'تُعلَن المواعيد والمستجدات عبر القنوات الرسمية للنظام البيئي فقط. وإن رأيت تاريخًا في مكان آخر، فتعامل معه بحذر: لا أحد خارج الفريق يستطيع تأكيده. وعندما يتوفّر شيء سترى إعلانه — وهنا نجيب عمّا هو موجود بالفعل، لا عن وعود.',
      de: 'Termine und Neuigkeiten werden ausschließlich über die offiziellen Kanäle des Ökosystems angekündigt. Hast du ein Datum anderswo gesehen, behandle es mit Vorsicht: Niemand außerhalb des Teams kann es bestätigen. Wenn etwas verfügbar ist, wirst du die Ankündigung sehen — und hier wird über das geantwortet, was bereits existiert, nicht über Versprechen.',
      sr: 'Датуми и новости објављују се искључиво путем званичних канала екосистема. Ако си датум видео негде другде, узми га са опрезом: нико изван тима не може да га потврди. Кад нешто буде доступно, видећеш објаву — а овде се одговара о ономе што већ постоји, не о обећањима.',
      ur: 'تاریخیں اور خبریں صرف ایکو سسٹم کے سرکاری چینلز پر بتائی جاتی ہیں۔ اگر آپ نے کہیں اور کوئی تاریخ دیکھی تو احتیاط سے لیں: ٹیم کے باہر کوئی اس کی تصدیق نہیں کر سکتا۔ جب کچھ دستیاب ہوگا تو آپ اعلان دیکھیں گے — اور یہاں اُس کا جواب دیا جاتا ہے جو پہلے سے موجود ہے، وعدوں کا نہیں۔',
    },

  /* ── el Aula: el material grabado dentro del asistente ─────────────
     OJO CON «Idioma del material»: es lo único que separa el idioma de la
     INTERFAZ del idioma del ARCHIVO. Traducido flojo —«Idioma», a secas— la
     distinción desaparece y el control se lee como un segundo selector de idioma
     de la web, que es exactamente lo que no es. */
  'Idioma del material': {
    en: 'Material language', pt: 'Idioma do material',
    fr: 'Langue du document', ru: 'Язык материала',
    sv: 'Materialets språk', hr: 'Jezik materijala',
    ar: 'لغة المادة', de: 'Sprache des Materials',
    sr: 'Језик материјала', ur: 'مواد کی زبان',
  },
  'material oficial del ecosistema': {
    en: 'official ecosystem material', pt: 'material oficial do ecossistema',
    fr: 'documentation officielle de l’écosystème', ru: 'официальные материалы экосистемы',
    sv: 'officiellt material från ekosystemet', hr: 'službeni materijal ekosustava',
    ar: 'المواد الرسمية للنظام البيئي', de: 'offizielles Material des Ökosystems',
    sr: 'званични материјал екосистема', ur: 'ایکو سسٹم کا سرکاری مواد',
  },
  'Todavía no hay edición en': {
    en: 'There is no edition yet in', pt: 'Ainda não há edição em',
    fr: 'Il n’existe pas encore d’édition en', ru: 'Пока нет издания на языке',
    sv: 'Det finns ännu ingen utgåva på', hr: 'Još nema izdanja na jeziku',
    ar: 'لا يوجد إصدار بعد بلغة', de: 'Es gibt noch keine Ausgabe auf',
    sr: 'Још нема издања на језику', ur: 'ابھی تک اس زبان میں ایڈیشن نہیں ہے',
  },
  'Elige otro idioma abajo o descarga el documento.': {
    en: 'Pick another language below, or download the document.',
    pt: 'Escolha outro idioma abaixo ou baixe o documento.',
    fr: 'Choisissez une autre langue ci-dessous ou téléchargez le document.',
    ru: 'Выберите другой язык ниже или скачайте документ.',
    sv: 'Välj ett annat språk nedan eller ladda ner dokumentet.',
    hr: 'Odaberite drugi jezik ispod ili preuzmite dokument.',
    ar: 'اختر لغة أخرى بالأسفل أو نزّل المستند.',
    de: 'Wähle unten eine andere Sprache oder lade das Dokument herunter.',
    sr: 'Изаберите други језик испод или преузмите документ.',
    ur: 'نیچے دوسری زبان منتخب کریں یا دستاویز ڈاؤن لوڈ کریں۔',
  },
  Reproducir: {
    en: 'Play', pt: 'Reproduzir', fr: 'Lire', ru: 'Воспроизвести',
    sv: 'Spela upp', hr: 'Reproduciraj', ar: 'تشغيل', de: 'Abspielen',
    sr: 'Репродукуј', ur: 'چلائیں',
  },
  idiomas: {
    en: 'languages', pt: 'idiomas', fr: 'langues', ru: 'языков',
    sv: 'språk', hr: 'jezika', ar: 'لغات', de: 'Sprachen',
    sr: 'језика', ur: 'زبانیں',
  },
  'Ampliar la ventana': {
    en: 'Expand the window', pt: 'Ampliar a janela', fr: 'Agrandir la fenêtre',
    ru: 'Развернуть окно', sv: 'Förstora fönstret', hr: 'Proširi prozor',
    ar: 'توسيع النافذة', de: 'Fenster vergrößern',
    sr: 'Прошири прозор', ur: 'ونڈو بڑی کریں',
  },
  'Reducir la ventana': {
    en: 'Shrink the window', pt: 'Reduzir a janela', fr: 'Réduire la fenêtre',
    ru: 'Свернуть окно', sv: 'Förminska fönstret', hr: 'Smanji prozor',
    ar: 'تصغير النافذة', de: 'Fenster verkleinern',
    sr: 'Смањи прозор', ur: 'ونڈو چھوٹی کریں',
  },
  'Cargando el material…': {
    en: 'Loading the material…', pt: 'Carregando o material…',
    fr: 'Chargement du document…', ru: 'Загрузка материала…',
    sv: 'Laddar materialet…', hr: 'Učitavanje materijala…',
    ar: '…جارٍ تحميل المادة', de: 'Material wird geladen…',
    sr: 'Учитавање материјала…', ur: '…مواد لوڈ ہو رہا ہے',
  },
  'video en': {
    en: 'video in', pt: 'vídeo em', fr: 'vidéo en', ru: 'видео на',
    sv: 'video på', hr: 'videozapis na', ar: 'فيديو بـ', de: 'Video in',
    sr: 'видео на', ur: 'ویڈیو',
  },
  ediciones: {
    en: 'editions', pt: 'edições', fr: 'éditions', ru: 'издания',
    sv: 'utgåvor', hr: 'izdanja', ar: 'إصدارات', de: 'Ausgaben',
    sr: 'издања', ur: 'ایڈیشنز',
  },
  'video y documento en varios idiomas': {
    en: 'video and document in several languages',
    pt: 'vídeo e documento em vários idiomas',
    fr: 'vidéo et document en plusieurs langues',
    ru: 'видео и документ на нескольких языках',
    sv: 'video och dokument på flera språk',
    hr: 'video i dokument na više jezika',
    ar: 'فيديو ومستند بعدة لغات',
    de: 'Video und Dokument in mehreren Sprachen',
    sr: 'видео и документ на више језика',
    ur: 'ویڈیو اور دستاویز کئی زبانوں میں',
  },
  '¿Te sirvió este material?': {
    en: 'Was this material useful?', pt: 'Este material foi útil?',
    fr: 'Ce document vous a-t-il été utile ?', ru: 'Этот материал был полезен?',
    sv: 'Var materialet till hjälp?', hr: 'Je li vam ovaj materijal pomogao?',
    ar: 'هل كانت هذه المادة مفيدة؟', de: 'War dieses Material hilfreich?',
    sr: 'Да ли вам је овај материјал помогао?', ur: 'کیا یہ مواد مفید تھا؟',
  },
  'Material informativo. No constituye una oferta de inversión ni promete rendimientos.': {
    en: 'Informational material. It is not an investment offer and promises no returns.',
    pt: 'Material informativo. Não constitui oferta de investimento nem promete rendimentos.',
    fr: 'Document d’information. Ne constitue pas une offre d’investissement et ne promet aucun rendement.',
    ru: 'Информационный материал. Не является инвестиционным предложением и не обещает доходности.',
    sv: 'Informationsmaterial. Utgör inte ett investeringserbjudande och lovar ingen avkastning.',
    hr: 'Informativni materijal. Ne predstavlja investicijsku ponudu niti obećava prinose.',
    ar: 'مادة إعلامية. لا تشكل عرض استثمار ولا تَعِد بأي عوائد.',
    de: 'Informationsmaterial. Es ist kein Anlageangebot und verspricht keine Renditen.',
    sr: 'Информативни материјал. Не представља инвестициону понуду нити обећава приносе.',
    ur: 'معلوماتی مواد۔ یہ سرمایہ کاری کی پیشکش نہیں ہے اور کسی منافع کا وعدہ نہیں کرتا۔',
  },

  /* ── descarga vinculada al idioma ──────────────────────────────── */
  'Descargar la presentación': {
    en: 'Download the presentation', pt: 'Baixar a apresentação',
    fr: 'Télécharger la présentation', ru: 'Скачать презентацию',
    sv: 'Ladda ner presentationen', hr: 'Preuzmi prezentaciju',
    ar: 'تنزيل العرض التقديمي', de: 'Präsentation herunterladen',
    sr: 'Преузми презентацију', ur: 'پریزنٹیشن ڈاؤن لوڈ کریں',
  },
  'Versión anterior (v1)': {
    en: 'Previous version (v1)', pt: 'Versão anterior (v1)',
    fr: 'Version précédente (v1)', ru: 'Предыдущая версия (v1)',
    sv: 'Tidigare version (v1)', hr: 'Prethodna verzija (v1)',
    ar: 'الإصدار السابق (v1)', de: 'Vorversion (v1)',
    sr: 'Претходна верзија (v1)', ur: 'پچھلا ورژن (v1)',
  },
  /* ── centro de ayuda (/soporte): SOLO la interfaz. El corpus de respuestas
        queda en español a propósito — es texto sensible al dinero y su
        traducción es una decisión del owner, no un relleno automático. ── */
  'Centro de ayuda': {
    en: 'Help center',
    pt: 'Central de ajuda',
    fr: "Centre d'aide",
    ru: 'Центр помощи',
    sv: 'Hjälpcenter',
    hr: 'Centar za pomoć',
    ar: 'مركز المساعدة',
    de: 'Hilfezentrum',
    sr: 'Центар за помоћ',
    ur: 'مرکزِ معاونت',
  },
  'Las respuestas están verificadas en español. Su traducción llegará por los canales oficiales.': {
    en: 'Answers are verified in Spanish. Translations will arrive through the official channels.',
    pt: 'As respostas estão verificadas em espanhol. A tradução chegará pelos canais oficiais.',
    fr: 'Les réponses sont vérifiées en espagnol. Leur traduction arrivera par les canaux officiels.',
    ru: 'Ответы проверены на испанском языке. Перевод появится в официальных каналах.',
    sv: 'Svaren är verifierade på spanska. Översättningen kommer via de officiella kanalerna.',
    hr: 'Odgovori su provjereni na španjolskom. Prijevod će stići službenim kanalima.',
    ar: 'الإجابات موثّقة بالإسبانية. وستصل ترجمتها عبر القنوات الرسمية.',
    de: 'Die Antworten sind auf Spanisch verifiziert. Die Übersetzung kommt über die offiziellen Kanäle.',
    sr: 'Одговори су проверени на шпанском. Превод ће стићи званичним каналима.',
    ur: 'جوابات ہسپانوی میں تصدیق شدہ ہیں۔ ترجمہ سرکاری ذرائع سے آئے گا۔',
  },
  'Buscar en las preguntas frecuentes': {
    en: 'Search the FAQ',
    pt: 'Pesquisar nas perguntas frequentes',
    fr: 'Rechercher dans la FAQ',
    ru: 'Поиск по частым вопросам',
    sv: 'Sök i vanliga frågor',
    hr: 'Pretraži česta pitanja',
    ar: 'ابحث في الأسئلة الشائعة',
    de: 'In den FAQ suchen',
    sr: 'Претражи честа питања',
    ur: 'عمومی سوالات میں تلاش کریں',
  },
  'Escribe tu pregunta — por ejemplo: no puedo reclamar': {
    en: 'Type your question — for example: I cannot claim',
    pt: 'Escreva a sua pergunta — por exemplo: não consigo resgatar',
    fr: 'Écrivez votre question — par exemple : je ne peux pas réclamer',
    ru: 'Введите вопрос — например: не могу получить награду',
    sv: 'Skriv din fråga — till exempel: jag kan inte hämta ut',
    hr: 'Upišite pitanje — na primjer: ne mogu podići',
    ar: 'اكتب سؤالك — مثلاً: لا أستطيع المطالبة',
    de: 'Schreibe deine Frage — zum Beispiel: Ich kann nicht claimen',
    sr: 'Упишите питање — на пример: не могу да подигнем',
    ur: 'اپنا سوال لکھیں — مثلاً: میں کلیم نہیں کر سکتا',
  },
  'Filtrar por producto': {
    en: 'Filter by product',
    pt: 'Filtrar por produto',
    fr: 'Filtrer par produit',
    ru: 'Фильтр по продукту',
    sv: 'Filtrera efter produkt',
    hr: 'Filtriraj po proizvodu',
    ar: 'تصفية حسب المنتج',
    de: 'Nach Produkt filtern',
    sr: 'Филтрирај по производу',
    ur: 'پروڈکٹ کے لحاظ سے فلٹر کریں',
  },
  'También suele preguntarse:': {
    en: 'People also ask:',
    pt: 'Também se costuma perguntar:',
    fr: 'On demande aussi souvent :',
    ru: 'Также часто спрашивают:',
    sv: 'Man frågar också ofta:',
    hr: 'Također se često pita:',
    ar: 'ويُسأل أيضاً:',
    de: 'Häufig wird auch gefragt:',
    sr: 'Такође се често пита:',
    ur: 'یہ بھی اکثر پوچھا جاتا ہے:',
  },

  /* ── el asistente flotante y el chat compartido ── */
  'Preguntar': {
    en: 'Ask', pt: 'Perguntar', fr: 'Demander', ru: 'Спросить', sv: 'Fråga',
    hr: 'Pitaj', ar: 'اسأل', de: 'Fragen', sr: 'Питај', ur: 'پوچھیں',
  },
  'Asistente Genesis': {
    en: 'Genesis Assistant', pt: 'Assistente Genesis', fr: 'Assistant Genesis',
    ru: 'Ассистент Genesis', sv: 'Genesis-assistenten', hr: 'Genesis asistent',
    ar: 'مساعد Genesis', de: 'Genesis-Assistent', sr: 'Genesis асистент', ur: 'Genesis اسسٹنٹ',
  },
  'Asistente de soporte': {
    en: 'Support assistant', pt: 'Assistente de suporte', fr: "Assistant d'assistance",
    ru: 'Ассистент поддержки', sv: 'Supportassistent', hr: 'Asistent podrške',
    ar: 'مساعد الدعم', de: 'Support-Assistent', sr: 'Асистент подршке', ur: 'سپورٹ اسسٹنٹ',
  },
  'Respuestas verificadas · si no sabe, lo dice': {
    en: "Verified answers · if it doesn't know, it says so",
    pt: 'Respostas verificadas · se não sabe, diz',
    fr: "Réponses vérifiées · s'il ne sait pas, il le dit",
    ru: 'Проверенные ответы · если не знает — так и скажет',
    sv: 'Verifierade svar · om den inte vet säger den det',
    hr: 'Provjereni odgovori · ako ne zna, kaže',
    ar: 'إجابات موثّقة · وإن لم يعرف، يقولها',
    de: 'Verifizierte Antworten · wenn er es nicht weiß, sagt er es',
    sr: 'Проверени одговори · ако не зна, каже',
    ur: 'تصدیق شدہ جوابات · اگر نہیں جانتا تو کہہ دیتا ہے',
  },
  'Abrir el asistente': {
    en: 'Open the assistant', pt: 'Abrir o assistente', fr: "Ouvrir l'assistant",
    ru: 'Открыть ассистента', sv: 'Öppna assistenten', hr: 'Otvori asistenta',
    ar: 'افتح المساعد', de: 'Assistenten öffnen', sr: 'Отвори асистента', ur: 'اسسٹنٹ کھولیں',
  },
  'Cerrar el asistente': {
    en: 'Close the assistant', pt: 'Fechar o assistente', fr: "Fermer l'assistant",
    ru: 'Закрыть ассистента', sv: 'Stäng assistenten', hr: 'Zatvori asistenta',
    ar: 'أغلق المساعد', de: 'Assistenten schließen', sr: 'Затвори асистента', ur: 'اسسٹنٹ بند کریں',
  },
  'Soporte Genesis': {
    en: 'Genesis Support', pt: 'Suporte Genesis', fr: 'Assistance Genesis',
    ru: 'Поддержка Genesis', sv: 'Genesis-support', hr: 'Genesis podrška',
    ar: 'دعم Genesis', de: 'Genesis-Support', sr: 'Genesis подршка', ur: 'Genesis سپورٹ',
  },
  'suele responder en minutos': {
    en: 'usually replies in minutes', pt: 'costuma responder em minutos',
    fr: 'répond généralement en quelques minutes', ru: 'обычно отвечает за минуты',
    sv: 'svarar oftast inom minuter', hr: 'obično odgovara u nekoliko minuta',
    ar: 'يرد عادةً خلال دقائق', de: 'antwortet meist in Minuten',
    sr: 'обично одговара за неколико минута', ur: 'عموماً منٹوں میں جواب دیتا ہے',
  },
  'Pregunta sobre tu cuenta, el hold, los reclamos, el P2P o la tienda. Si no lo sé, te lo digo.': {
    en: "Ask about your account, the hold, claims, the P2P or the store. If I don't know, I'll say so.",
    pt: 'Pergunte sobre a sua conta, o hold, os resgates, o P2P ou a loja. Se eu não souber, digo.',
    fr: "Posez vos questions sur votre compte, le hold, les réclamations, le P2P ou la boutique. Si je ne sais pas, je vous le dirai.",
    ru: 'Спросите о счёте, холде, наградах, P2P или магазине. Если не знаю — скажу.',
    sv: 'Fråga om ditt konto, holden, uttag, P2P eller butiken. Om jag inte vet säger jag det.',
    hr: 'Pitaj o računu, holdu, isplatama, P2P-u ili trgovini. Ako ne znam, reći ću.',
    ar: 'اسأل عن حسابك أو الاحتفاظ أو المطالبات أو P2P أو المتجر. وإن لم أعرف، سأقول ذلك.',
    de: 'Frag zu deinem Konto, dem Hold, den Claims, dem P2P oder dem Shop. Wenn ich es nicht weiß, sage ich es.',
    sr: 'Питај о налогу, холду, исплатама, P2P-у или продавници. Ако не знам, рећи ћу.',
    ur: 'اپنے اکاؤنٹ، ہولڈ، کلیم، P2P یا اسٹور کے بارے میں پوچھیں۔ اگر نہیں جانتا تو بتا دوں گا۔',
  },

  /* ── el mensajero flotante (Fase B) ── */
  'Hola': {
    en: 'Hi', pt: 'Olá', fr: 'Bonjour', ru: 'Привет', sv: 'Hej',
    hr: 'Bok', ar: 'مرحباً', de: 'Hallo', sr: 'Здраво', ur: 'خوش آمدید',
  },
  '¿Cómo podemos ayudarte?': {
    en: 'How can we help you?', pt: 'Como podemos ajudar?', fr: 'Comment pouvons-nous vous aider ?',
    ru: 'Чем можем помочь?', sv: 'Hur kan vi hjälpa dig?', hr: 'Kako vam možemo pomoći?',
    ar: 'كيف يمكننا مساعدتك؟', de: 'Wie können wir dir helfen?', sr: 'Како можемо да помогнемо?',
    ur: 'ہم آپ کی کیسے مدد کر سکتے ہیں؟',
  },
  'Hacer una pregunta': {
    en: 'Ask a question', pt: 'Fazer uma pergunta', fr: 'Poser une question',
    ru: 'Задать вопрос', sv: 'Ställ en fråga', hr: 'Postavi pitanje',
    ar: 'اطرح سؤالاً', de: 'Eine Frage stellen', sr: 'Постави питање', ur: 'سوال پوچھیں',
  },
  'Mensajes': {
    en: 'Messages', pt: 'Mensagens', fr: 'Messages', ru: 'Сообщения', sv: 'Meddelanden',
    hr: 'Poruke', ar: 'الرسائل', de: 'Nachrichten', sr: 'Поруке', ur: 'پیغامات',
  },
  'Ayuda': {
    en: 'Help', pt: 'Ajuda', fr: 'Aide', ru: 'Помощь', sv: 'Hjälp',
    hr: 'Pomoć', ar: 'مساعدة', de: 'Hilfe', sr: 'Помоћ', ur: 'مدد',
  },
  'No hay mensajes': {
    en: 'No messages', pt: 'Sem mensagens', fr: 'Aucun message', ru: 'Сообщений нет',
    sv: 'Inga meddelanden', hr: 'Nema poruka', ar: 'لا توجد رسائل', de: 'Keine Nachrichten',
    sr: 'Нема порука', ur: 'کوئی پیغام نہیں',
  },
  'Tus conversaciones se guardan en este navegador.': {
    en: 'Your conversations are saved in this browser.',
    pt: 'As suas conversas ficam guardadas neste navegador.',
    fr: 'Vos conversations sont enregistrées dans ce navigateur.',
    ru: 'Ваши беседы сохраняются в этом браузере.',
    sv: 'Dina konversationer sparas i den här webbläsaren.',
    hr: 'Vaši se razgovori spremaju u ovom pregledniku.',
    ar: 'تُحفظ محادثاتك في هذا المتصفح.',
    de: 'Deine Unterhaltungen werden in diesem Browser gespeichert.',
    sr: 'Ваши разговори се чувају у овом прегледачу.',
    ur: 'آپ کی گفتگو اسی براؤزر میں محفوظ رہتی ہے۔',
  },
  'Buscar ayuda': {
    en: 'Search help', pt: 'Pesquisar ajuda', fr: "Rechercher de l'aide", ru: 'Поиск помощи',
    sv: 'Sök hjälp', hr: 'Pretraži pomoć', ar: 'ابحث في المساعدة', de: 'Hilfe durchsuchen',
    sr: 'Претражи помоћ', ur: 'مدد تلاش کریں',
  },
  'colecciones': {
    en: 'collections', pt: 'coleções', fr: 'collections', ru: 'коллекций', sv: 'samlingar',
    hr: 'kolekcija', ar: 'مجموعات', de: 'Sammlungen', sr: 'колекција', ur: 'مجموعے',
  },
  'artículo': {
    en: 'article', pt: 'artigo', fr: 'article', ru: 'статья', sv: 'artikel',
    hr: 'članak', ar: 'مقالة', de: 'Artikel', sr: 'чланак', ur: 'مضمون',
  },
  'artículos': {
    en: 'articles', pt: 'artigos', fr: 'articles', ru: 'статей', sv: 'artiklar',
    hr: 'članaka', ar: 'مقالات', de: 'Artikel', sr: 'чланака', ur: 'مضامین',
  },
  'Fuente': {
    en: 'Source', pt: 'Fonte', fr: 'Source', ru: 'Источник', sv: 'Källa',
    hr: 'Izvor', ar: 'المصدر', de: 'Quelle', sr: 'Извор', ur: 'ماخذ',
  },
  '¿Respondió esto a tu pregunta?': {
    en: 'Did this answer your question?', pt: 'Isto respondeu à sua pergunta?',
    fr: 'Cela a-t-il répondu à votre question ?', ru: 'Это ответило на ваш вопрос?',
    sv: 'Besvarade detta din fråga?', hr: 'Je li ovo odgovorilo na vaše pitanje?',
    ar: 'هل أجاب هذا عن سؤالك؟', de: 'Hat das deine Frage beantwortet?',
    sr: 'Да ли је ово одговорило на ваше питање?', ur: 'کیا اس سے آپ کے سوال کا جواب مل گیا؟',
  },
  'Gracias — esto afina el asistente.': {
    en: 'Thanks — this tunes the assistant.', pt: 'Obrigado — isto afina o assistente.',
    fr: "Merci — cela affine l'assistant.", ru: 'Спасибо — это настраивает ассистента.',
    sv: 'Tack — detta finslipar assistenten.', hr: 'Hvala — ovo usavršava asistenta.',
    ar: 'شكراً — هذا يحسّن المساعد.', de: 'Danke — das verfeinert den Assistenten.',
    sr: 'Хвала — ово усавршава асистента.', ur: 'شکریہ — اس سے اسسٹنٹ بہتر ہوتا ہے۔',
  },
  'Abrir en el centro de ayuda': {
    en: 'Open in the help center', pt: 'Abrir na central de ajuda',
    fr: "Ouvrir dans le centre d'aide", ru: 'Открыть в центре помощи',
    sv: 'Öppna i hjälpcentret', hr: 'Otvori u centru za pomoć',
    ar: 'افتح في مركز المساعدة', de: 'Im Hilfezentrum öffnen',
    sr: 'Отвори у центру за помоћ', ur: 'مرکزِ معاونت میں کھولیں',
  },
  'Volver': {
    en: 'Back', pt: 'Voltar', fr: 'Retour', ru: 'Назад', sv: 'Tillbaka',
    hr: 'Natrag', ar: 'رجوع', de: 'Zurück', sr: 'Назад', ur: 'واپس',
  },
  'Ver como artículo': {
    en: 'View as article', pt: 'Ver como artigo', fr: 'Voir comme article',
    ru: 'Открыть как статью', sv: 'Visa som artikel', hr: 'Prikaži kao članak',
    ar: 'اعرض كمقالة', de: 'Als Artikel ansehen', sr: 'Прикажи као чланак', ur: 'بطور مضمون دیکھیں',
  },
  'No he entendido la pregunta lo bastante bien como para responderla con seguridad. Prefiero pasarte con alguien del equipo antes que darte algo que suene bien y esté mal.': {
    en: "I haven't understood the question well enough to answer it with confidence. I'd rather hand you to someone on the team than give you something that sounds right and is wrong.",
    pt: 'Não entendi a pergunta bem o suficiente para responder com segurança. Prefiro encaminhá-lo a alguém da equipa a dar-lhe algo que soe bem e esteja errado.',
    fr: "Je n'ai pas assez bien compris la question pour y répondre avec certitude. Je préfère vous passer à quelqu'un de l'équipe plutôt que de vous donner une réponse qui sonne bien mais qui est fausse.",
    ru: 'Я недостаточно понял вопрос, чтобы ответить уверенно. Лучше передам вас команде, чем дам ответ, который звучит правильно, но ошибочен.',
    sv: 'Jag förstod inte frågan tillräckligt väl för att svara säkert. Hellre lämnar jag över dig till teamet än ger något som låter rätt men är fel.',
    hr: 'Nisam dovoljno dobro razumio pitanje da odgovorim sa sigurnošću. Radije ću vas proslijediti timu nego dati odgovor koji zvuči dobro, a pogrešan je.',
    ar: 'لم أفهم السؤال جيداً بما يكفي للإجابة بثقة. أُفضّل تحويلك إلى أحد أعضاء الفريق على أن أعطيك إجابة تبدو صحيحة وهي خاطئة.',
    de: 'Ich habe die Frage nicht gut genug verstanden, um sie sicher zu beantworten. Lieber übergebe ich dich an jemanden aus dem Team, als dir etwas zu geben, das richtig klingt und falsch ist.',
    sr: 'Нисам довољно добро разумео питање да одговорим са сигурношћу. Радије ћу вас проследити тиму него дати одговор који звучи добро, а погрешан је.',
    ur: 'میں سوال کو اتنا نہیں سمجھ سکا کہ یقین سے جواب دوں۔ غلط مگر درست لگنے والا جواب دینے سے بہتر ہے کہ آپ کو ٹیم کے کسی فرد سے ملا دوں۔',
  },
  'No promete activaciones ni resultados. Cuando no sabe, deriva a una persona.': {
    en: "It promises no activations or results. When it doesn't know, it hands over to a person.",
    pt: 'Não promete ativações nem resultados. Quando não sabe, encaminha a uma pessoa.',
    fr: "Il ne promet ni activations ni résultats. Quand il ne sait pas, il transmet à une personne.",
    ru: 'Не обещает активаций и результатов. Когда не знает — передаёт человеку.',
    sv: 'Utlovar inga aktiveringar eller resultat. När den inte vet lämnar den över till en människa.',
    hr: 'Ne obećava aktivacije ni rezultate. Kad ne zna, prosljeđuje osobi.',
    ar: 'لا يَعِد بتفعيلات أو نتائج. وعندما لا يعرف، يحوّلك إلى شخص.',
    de: 'Verspricht keine Aktivierungen oder Ergebnisse. Wenn er es nicht weiß, übergibt er an einen Menschen.',
    sr: 'Не обећава активације ни резултате. Кад не зна, прослеђује особи.',
    ur: 'نہ ایکٹیویشن کا وعدہ کرتا ہے نہ نتائج کا۔ جب نہیں جانتا تو کسی فرد کے حوالے کر دیتا ہے۔',
  },

  'Escribiendo…': {
    en: 'Typing…', pt: 'A escrever…', fr: "En train d'écrire…", ru: 'Печатает…',
    sv: 'Skriver…', hr: 'Piše…', ar: 'يكتب…', de: 'Schreibt…', sr: 'Пише…',
    ur: 'لکھ رہا ہے…',
  },

  /* ── dictado y voz (Tren D) ── */
  'Escuchar': {
    en: 'Listen', pt: 'Ouvir', fr: 'Écouter', ru: 'Прослушать', sv: 'Lyssna',
    hr: 'Poslušaj', ar: 'استمع', de: 'Anhören', sr: 'Послушај', ur: 'سنیں',
  },
  'Leer en voz alta': {
    en: 'Read aloud', pt: 'Ler em voz alta', fr: 'Lire à voix haute', ru: 'Прочитать вслух',
    sv: 'Läs högt', hr: 'Pročitaj naglas', ar: 'اقرأ بصوت عالٍ', de: 'Vorlesen',
    sr: 'Прочитај наглас', ur: 'بلند آواز میں پڑھیں',
  },
  'Dictar la pregunta': {
    en: 'Dictate your question', pt: 'Ditar a pergunta', fr: 'Dicter la question',
    ru: 'Продиктовать вопрос', sv: 'Diktera frågan', hr: 'Izgovori pitanje',
    ar: 'أملِ سؤالك', de: 'Frage diktieren', sr: 'Издиктирај питање', ur: 'سوال بول کر لکھوائیں',
  },
  'Detener el dictado': {
    en: 'Stop dictation', pt: 'Parar o ditado', fr: 'Arrêter la dictée', ru: 'Остановить диктовку',
    sv: 'Stoppa diktering', hr: 'Zaustavi diktiranje', ar: 'أوقف الإملاء', de: 'Diktat stoppen',
    sr: 'Заустави диктирање', ur: 'ڈکٹیشن روکیں',
  },

}
