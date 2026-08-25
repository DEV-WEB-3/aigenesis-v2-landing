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
