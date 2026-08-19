import type { CodigoIdioma } from '@/lib/i18n/idiomas'
import { registrarEntradas } from '@/lib/i18n/diccionario'

/**
 * EL WHITEPAPER, EN LAS ONCE LENGUAS — bloque aparte del diccionario comun.
 *
 * ESTA SEPARADO POR PESO, no por orden. Metido en el diccionario compartido
 * subia la PORTADA de 274 a 309 kB: cincuenta entradas de parrafo largo por
 * once lenguas que solo se leen en `/whitepaper`, descargadas por todo el que
 * entra a `/`. Aqui, el empaquetador las mete en el trozo de esa pagina.
 *
 * SE REGISTRA SOLO al importarse. Quien lo usa no tiene que acordarse de nada
 * mas que de importarlo, y eso lo hace `WhitepaperContenido` — que es
 * exactamente el archivo que dejaria de compilar si alguien lo borrara.
 *
 * LOS `en` SON EL TEXTO EXACTO DEL PDF, palabra por palabra. El original esta
 * en ingles: quien lee en ingles lee el documento oficial sin intermediario.
 * La clave en español es la traduccion, y de ella salen las otras nueve.
 */
const WHITEPAPER: Record<string, Partial<Record<Exclude<CodigoIdioma, 'es'>, string>>> = {
  /* ═══ WHITEPAPER ══════════════════════════════════════════════════
     El documento oficial v1.1, en las once lenguas.

     LOS `en` DE LOS PARRAFOS SON EL TEXTO EXACTO DEL PDF, palabra por
     palabra. El original esta en ingles, asi que quien lee en ingles lee
     el documento oficial sin intermediario; la clave en español es la
     traduccion, y de ella salen las otras nueve.
     ═════════════════════════════════════════════════════════════════ */

  /* ── rotulos de la pagina ──────────────────────────────────────── */
  'El documento, en tu idioma': {
    en: 'The document, in your language', pt: 'O documento, no seu idioma',
    fr: 'Le document, dans votre langue', ru: 'Документ на вашем языке',
    sv: 'Dokumentet, på ditt språk', hr: 'Dokument, na vašem jeziku',
    ar: 'الوثيقة بلغتك', de: 'Das Dokument, in deiner Sprache',
    sr: 'Документ, на вашем језику', ur: 'دستاویز، آپ کی زبان میں',
  },
  'Traducción del whitepaper oficial v1.1. El PDF descargable está en inglés.': {
    en: 'Translation of the official whitepaper v1.1. The downloadable PDF is in English.',
    pt: 'Tradução do whitepaper oficial v1.1. O PDF para download está em inglês.',
    fr: "Traduction du whitepaper officiel v1.1. Le PDF téléchargeable est en anglais.",
    ru: 'Перевод официального вайтпейпера v1.1. Загружаемый PDF — на английском.',
    sv: 'Översättning av det officiella whitepapret v1.1. Den nedladdningsbara PDF:en är på engelska.',
    hr: 'Prijevod službenog whitepapera v1.1. PDF za preuzimanje je na engleskom.',
    ar: 'ترجمة الورقة البيضاء الرسمية v1.1. ملف PDF القابل للتنزيل بالإنجليزية.',
    de: 'Übersetzung des offiziellen Whitepapers v1.1. Das herunterladbare PDF ist auf Englisch.',
    sr: 'Превод званичног whitepapera v1.1. PDF за преузимање је на енглеском.',
    ur: 'سرکاری وائٹ پیپر v1.1 کا ترجمہ۔ ڈاؤن لوڈ کے قابل PDF انگریزی میں ہے۔',
  },
  'El PDF es la versión 1.1 de febrero de 2024 y la dirección de contrato que aparece dentro ya no está vigente. El contrato válido es el que figura arriba en esta página.': {
    en: 'The PDF is version 1.1 from February 2024, and the contract address printed inside is no longer current. The valid contract is the one shown above on this page.',
    pt: 'O PDF é a versão 1.1 de fevereiro de 2024 e o endereço de contrato que aparece dentro já não está em vigor. O contrato válido é o indicado acima nesta página.',
    fr: "Le PDF est la version 1.1 de février 2024 et l'adresse de contrat qui y figure n'est plus valable. Le contrat valide est celui indiqué plus haut sur cette page.",
    ru: 'PDF — это версия 1.1 от февраля 2024 года, и указанный внутри адрес контракта больше не актуален. Действующий контракт указан выше на этой странице.',
    sv: 'PDF:en är version 1.1 från februari 2024, och kontraktsadressen som står inuti gäller inte längre. Det giltiga kontraktet är det som visas ovan på den här sidan.',
    hr: 'PDF je verzija 1.1 iz veljače 2024., a adresa ugovora navedena unutra više nije važeća. Važeći ugovor je onaj naveden gore na ovoj stranici.',
    ar: 'ملف PDF هو الإصدار 1.1 من فبراير 2024، وعنوان العقد المذكور بداخله لم يعد ساري المفعول. العقد الصحيح هو المعروض أعلى هذه الصفحة.',
    de: 'Das PDF ist Version 1.1 vom Februar 2024, und die darin abgedruckte Vertragsadresse ist nicht mehr aktuell. Der gültige Vertrag ist der oben auf dieser Seite angegebene.',
    sr: 'PDF је верзија 1.1 из фебруара 2024, а адреса уговора наведена унутра више није важећа. Важећи уговор је онај приказан горе на овој страници.',
    ur: 'PDF فروری 2024 کا ورژن 1.1 ہے اور اس کے اندر درج کنٹریکٹ ایڈریس اب مؤثر نہیں۔ درست کنٹریکٹ وہی ہے جو اس صفحے پر اوپر دیا گیا ہے۔',
  },
  'El reparto publicado en el documento suma 100,01 %.': {
    en: 'The distribution published in the document adds up to 100.01%.',
    pt: 'A distribuição publicada no documento soma 100,01 %.',
    fr: 'La répartition publiée dans le document totalise 100,01 %.',
    ru: 'Опубликованное в документе распределение в сумме даёт 100,01 %.',
    sv: 'Fördelningen som publiceras i dokumentet summerar till 100,01 %.',
    hr: 'Raspodjela objavljena u dokumentu zbraja se na 100,01 %.',
    ar: 'مجموع التوزيع المنشور في الوثيقة هو 100.01 %.',
    de: 'Die im Dokument veröffentlichte Verteilung summiert sich auf 100,01 %.',
    sr: 'Расподела објављена у документу збраја се на 100,01 %.',
    ur: 'دستاویز میں شائع شدہ تقسیم کا مجموعہ 100.01 % بنتا ہے۔',
  },
  'Hoja de ruta del documento (v1.1, febrero de 2024)': {
    en: 'Roadmap in the document (v1.1, February 2024)',
    pt: 'Roteiro do documento (v1.1, fevereiro de 2024)',
    fr: 'Feuille de route du document (v1.1, février 2024)',
    ru: 'Дорожная карта документа (v1.1, февраль 2024)',
    sv: 'Färdplanen i dokumentet (v1.1, februari 2024)',
    hr: 'Plan puta iz dokumenta (v1.1, veljača 2024.)',
    ar: 'خارطة الطريق في الوثيقة (v1.1، فبراير 2024)',
    de: 'Fahrplan im Dokument (v1.1, Februar 2024)',
    sr: 'План пута из документа (v1.1, фебруар 2024.)',
    ur: 'دستاویز کا روڈ میپ (v1.1، فروری 2024)',
  },
  'No es la hoja de ruta vigente: la sección Roadmap del sitio está actualizada.': {
    en: 'This is not the current roadmap: the Roadmap section of the site is up to date.',
    pt: 'Não é o roteiro vigente: a seção Roadmap do site está atualizada.',
    fr: "Ce n'est pas la feuille de route actuelle : la section Roadmap du site est à jour.",
    ru: 'Это не действующая дорожная карта: актуальна секция Roadmap на сайте.',
    sv: 'Detta är inte den aktuella färdplanen: avsnittet Roadmap på webbplatsen är uppdaterat.',
    hr: 'Ovo nije važeći plan puta: odjeljak Roadmap na stranici je ažuriran.',
    ar: 'ليست خارطة الطريق الحالية: قسم Roadmap في الموقع هو المحدَّث.',
    de: 'Das ist nicht der aktuelle Fahrplan: Der Abschnitt Roadmap auf der Website ist aktuell.',
    sr: 'Ово није важећи план пута: одељак Roadmap на сајту је ажуриран.',
    ur: 'یہ موجودہ روڈ میپ نہیں: سائٹ کا Roadmap سیکشن تازہ ترین ہے۔',
  },

  /* ── titulos de sección del documento ──────────────────────────── */
  Resumen: {
    en: 'Abstract', pt: 'Resumo', fr: 'Résumé', ru: 'Аннотация',
    sv: 'Sammanfattning', hr: 'Sažetak', ar: 'ملخّص', de: 'Zusammenfassung',
    sr: 'Сажетак', ur: 'خلاصہ',
  },
  'Introducción': {
    en: 'Introduction', pt: 'Introdução', fr: 'Introduction', ru: 'Введение',
    sv: 'Inledning', hr: 'Uvod', ar: 'مقدّمة', de: 'Einleitung',
    sr: 'Увод', ur: 'تعارف',
  },
  Tokenomics: {
    en: 'Tokenomics', pt: 'Tokenomics', fr: 'Tokenomique', ru: 'Токеномика',
    sv: 'Tokenomics', hr: 'Tokenomija', ar: 'اقتصاد الرمز', de: 'Tokenomics',
    sr: 'Токеномија', ur: 'ٹوکنومکس',
  },
  'Versatilidad en operaciones virtuales': {
    en: 'Versatility in virtual operations', pt: 'Versatilidade em operações virtuais',
    fr: 'Polyvalence dans les opérations virtuelles', ru: 'Универсальность в виртуальных операциях',
    sv: 'Mångsidighet i virtuella operationer', hr: 'Svestranost u virtualnim operacijama',
    ar: 'تعدّد الاستخدامات في العمليات الافتراضية', de: 'Vielseitigkeit bei virtuellen Operationen',
    sr: 'Свестраност у виртуелним операцијама', ur: 'ورچوئل آپریشنز میں ہمہ گیریت',
  },
  'Tender el puente': {
    en: 'Bridging the gap', pt: 'Construir a ponte', fr: 'Jeter le pont',
    ru: 'Наведение моста', sv: 'Att slå bron', hr: 'Premošćivanje jaza',
    ar: 'ردم الفجوة', de: 'Die Brücke schlagen', sr: 'Премошћавање јаза',
    ur: 'خلا کو پُر کرنا',
  },
  'Facilitar las transacciones': {
    en: 'Facilitating transactions', pt: 'Facilitar as transações',
    fr: 'Faciliter les transactions', ru: 'Упрощение транзакций',
    sv: 'Att underlätta transaktioner', hr: 'Olakšavanje transakcija',
    ar: 'تيسير المعاملات', de: 'Transaktionen erleichtern',
    sr: 'Олакшавање трансакција', ur: 'لین دین کی سہولت',
  },
  'Conclusión': {
    en: 'Conclusion', pt: 'Conclusão', fr: 'Conclusion', ru: 'Заключение',
    sv: 'Slutsats', hr: 'Zaključak', ar: 'خاتمة', de: 'Fazit',
    sr: 'Закључак', ur: 'نتیجہ',
  },

  /* ── reparto del suministro ────────────────────────────────────── */
  Bloqueado: {
    en: 'Locked', pt: 'Bloqueado', fr: 'Verrouillé', ru: 'Заблокировано',
    sv: 'Låst', hr: 'Zaključano', ar: 'مُقفَل', de: 'Gesperrt',
    sr: 'Закључано', ur: 'مقفل',
  },
  Recompensas: {
    en: 'Rewards', pt: 'Recompensas', fr: 'Récompenses', ru: 'Вознаграждения',
    sv: 'Belöningar', hr: 'Nagrade', ar: 'المكافآت', de: 'Belohnungen',
    sr: 'Награде', ur: 'انعامات',
  },
  'Tesorería': {
    en: 'Treasury', pt: 'Tesouraria', fr: 'Trésorerie', ru: 'Казна',
    sv: 'Skattkammare', hr: 'Riznica', ar: 'الخزانة', de: 'Treasury',
    sr: 'Ризница', ur: 'خزانہ',
  },
  'Equipo corporativo': {
    en: 'Corporate team', pt: 'Equipe corporativa', fr: 'Équipe corporative',
    ru: 'Корпоративная команда', sv: 'Företagsteam', hr: 'Korporativni tim',
    ar: 'الفريق المؤسسي', de: 'Unternehmensteam', sr: 'Корпоративни тим',
    ur: 'کارپوریٹ ٹیم',
  },
  Liquidez: {
    en: 'Liquidity', pt: 'Liquidez', fr: 'Liquidité', ru: 'Ликвидность',
    sv: 'Likviditet', hr: 'Likvidnost', ar: 'السيولة', de: 'Liquidität',
    sr: 'Ликвидност', ur: 'لیکویڈیٹی',
  },

  /* ── párrafos del documento ────────────────────────────────────── */
  'En una época en la que la tecnología sigue transformando el paisaje de nuestra vida diaria, el A.I. Genesis Official Token surge como un faro de innovación, conexión y capacidad de acción. Con un suministro fijo de 111 millones de tokens y alojado con seguridad en la Binance Smart Chain, este token se sostiene como un pilar de gobernanza digital.': {
    en: 'In an age where technology continues to reshape the landscape of our daily lives, the A.I. Genesis Official Token emerges as a beacon of innovation, connection, and empowerment. With a fixed supply of 111 million tokens and securely nestled within the Binance Smart Chain, this token stands as a pillar of digital governance.',
    pt: 'Numa era em que a tecnologia continua a remodelar a paisagem da nossa vida diária, o A.I. Genesis Official Token surge como um farol de inovação, conexão e capacitação. Com um fornecimento fixo de 111 milhões de tokens e alojado com segurança na Binance Smart Chain, este token firma-se como um pilar de governança digital.',
    fr: "À une époque où la technologie ne cesse de remodeler le paysage de notre vie quotidienne, l'A.I. Genesis Official Token apparaît comme un phare d'innovation, de connexion et d'autonomie. Avec une offre fixe de 111 millions de jetons et solidement établi sur la Binance Smart Chain, ce jeton s'impose comme un pilier de la gouvernance numérique.",
    ru: 'В эпоху, когда технологии продолжают менять облик нашей повседневной жизни, A.I. Genesis Official Token выступает маяком инноваций, связи и новых возможностей. С фиксированной эмиссией в 111 миллионов токенов и надёжным размещением в Binance Smart Chain этот токен стоит как опора цифрового управления.',
    sv: 'I en tid då tekniken fortsätter att omforma landskapet i våra dagliga liv framträder A.I. Genesis Official Token som en fyrbåk för innovation, samhörighet och handlingskraft. Med ett fast utbud på 111 miljoner tokens och tryggt förankrad i Binance Smart Chain står denna token som en pelare för digital styrning.',
    hr: 'U vremenu u kojem tehnologija i dalje preoblikuje krajolik naše svakodnevice, A.I. Genesis Official Token pojavljuje se kao svjetionik inovacije, povezanosti i osnaživanja. S fiksnom ponudom od 111 milijuna tokena i sigurno smješten unutar Binance Smart Chaina, ovaj token stoji kao stup digitalnog upravljanja.',
    ar: 'في عصر تواصل فيه التقنية إعادة تشكيل ملامح حياتنا اليومية، يبرز A.I. Genesis Official Token منارةً للابتكار والتواصل والتمكين. وبعرض ثابت قدره 111 مليون رمز، وباستقرار آمن داخل Binance Smart Chain، يقف هذا الرمز ركيزةً للحوكمة الرقمية.',
    de: 'In einer Zeit, in der Technologie die Landschaft unseres Alltags weiter umformt, tritt der A.I. Genesis Official Token als Leuchtfeuer für Innovation, Verbindung und Handlungsfähigkeit hervor. Mit einem festen Angebot von 111 Millionen Token und sicher in der Binance Smart Chain verankert, steht dieser Token als Säule digitaler Governance.',
    sr: 'У времену у коме технологија наставља да преобликује пејзаж наше свакодневице, A.I. Genesis Official Token јавља се као светионик иновације, повезаности и оснаживања. Са фиксном понудом од 111 милиона токена и безбедно смештен унутар Binance Smart Chaina, овај токен стоји као стуб дигиталног управљања.',
    ur: 'ایسے دور میں جب ٹیکنالوجی ہماری روزمرہ زندگی کے منظرنامے کو بدلتی جا رہی ہے، A.I. Genesis Official Token جدت، رابطے اور اختیار کے مینار کے طور پر ابھرتا ہے۔ 111 ملین ٹوکن کی مقررہ سپلائی اور Binance Smart Chain میں محفوظ جگہ کے ساتھ، یہ ٹوکن ڈیجیٹل گورننس کے ستون کے طور پر کھڑا ہے۔',
  },
  'El Genesis Official Token sirve de cauce para multitud de operaciones virtuales: loterías cripto, participación en el metaverso, ecosistemas NFT, actividades de minería, videojuegos, plataformas de apuestas, servicios de intercambio y una cartera cripto nativa basada en EVM.': {
    en: 'Genesis Official Token serves as a conduit for a multitude of virtual operations including crypto lotteries, metaverse engagement, NFT ecosystems, mining endeavors, gaming exploits, betting platforms, exchange services, and a native EVM-based cryptowallet.',
    pt: 'O Genesis Official Token serve de canal para uma multidão de operações virtuais: loterias cripto, participação no metaverso, ecossistemas NFT, atividades de mineração, videojogos, plataformas de apostas, serviços de câmbio e uma carteira cripto nativa baseada em EVM.',
    fr: "Le Genesis Official Token sert de canal à une multitude d'opérations virtuelles : loteries crypto, participation au métavers, écosystèmes NFT, activités de minage, jeux vidéo, plateformes de paris, services d'échange et un portefeuille crypto natif basé sur l'EVM.",
    ru: 'Genesis Official Token служит каналом для множества виртуальных операций: криптолотерей, участия в метавселенной, экосистем NFT, майнинга, игр, ставочных платформ, обменных сервисов и нативного крипто-кошелька на базе EVM.',
    sv: 'Genesis Official Token fungerar som kanal för en mängd virtuella operationer: kryptolotterier, deltagande i metaversum, NFT-ekosystem, mining, spel, vadslagningsplattformar, växlingstjänster och en inbyggd EVM-baserad kryptoplånbok.',
    hr: 'Genesis Official Token služi kao kanal za mnoštvo virtualnih operacija: kripto lutrije, sudjelovanje u metaverzumu, NFT ekosustave, rudarenje, igre, kladioničarske platforme, mjenjačke usluge i vlastiti kripto novčanik temeljen na EVM-u.',
    ar: 'يعمل Genesis Official Token قناةً لعدد وافر من العمليات الافتراضية: يانصيب العملات المشفّرة، والمشاركة في الميتافيرس، ومنظومات NFT، وأنشطة التعدين، والألعاب، ومنصّات الرهان، وخدمات التبادل، ومحفظة مشفّرة أصلية قائمة على EVM.',
    de: 'Der Genesis Official Token dient als Kanal für eine Vielzahl virtueller Operationen: Krypto-Lotterien, Teilnahme am Metaverse, NFT-Ökosysteme, Mining, Gaming, Wettplattformen, Tauschdienste und eine native EVM-basierte Krypto-Wallet.',
    sr: 'Genesis Official Token служи као канал за мноштво виртуелних операција: крипто лутрије, учешће у метаверзуму, NFT екосистеме, рударење, игре, кладионичарске платформе, мењачке услуге и сопствени крипто новчаник заснован на EVM-у.',
    ur: 'Genesis Official Token متعدد ورچوئل آپریشنز کا ذریعہ ہے: کرپٹو لاٹریاں، میٹاورس میں شرکت، NFT ایکو سسٹمز، مائننگ، گیمنگ، بیٹنگ پلیٹ فارمز، ایکسچینج سروسز اور EVM پر مبنی اپنا کرپٹو والٹ۔',
  },
  'En este whitepaper profundizamos en el potencial transformador del A.I. Genesis Official Token, y exploramos cómo tiende un puente entre el terreno de la inteligencia artificial y la experiencia humana, revolucionando las transacciones a través de la cadena de bloques.': {
    en: 'In this white paper, we delve deep into the transformative potential of the A.I. Genesis Official Token, exploring how it seamlessly bridges the realm of artificial intelligence with the human experience, revolutionizing transactions through the blockchain.',
    pt: 'Neste whitepaper aprofundamos o potencial transformador do A.I. Genesis Official Token e exploramos como ele liga o domínio da inteligência artificial à experiência humana, revolucionando as transações através da blockchain.',
    fr: "Dans ce whitepaper, nous explorons en profondeur le potentiel transformateur de l'A.I. Genesis Official Token et la manière dont il relie le domaine de l'intelligence artificielle à l'expérience humaine, révolutionnant les transactions grâce à la blockchain.",
    ru: 'В этом вайтпейпере мы подробно разбираем преобразующий потенциал A.I. Genesis Official Token и то, как он связывает область искусственного интеллекта с человеческим опытом, меняя транзакции через блокчейн.',
    sv: 'I detta whitepaper går vi på djupet med den omvälvande potentialen hos A.I. Genesis Official Token och undersöker hur den sömlöst binder samman den artificiella intelligensens område med den mänskliga erfarenheten och revolutionerar transaktioner via blockkedjan.',
    hr: 'U ovom whitepaperu dubinski razmatramo transformativni potencijal A.I. Genesis Official Tokena i istražujemo kako povezuje područje umjetne inteligencije s ljudskim iskustvom, revolucionirajući transakcije putem blockchaina.',
    ar: 'في هذه الورقة البيضاء نتعمّق في الإمكانات التحويلية لـ A.I. Genesis Official Token، ونستكشف كيف يجسر بسلاسة بين مجال الذكاء الاصطناعي والتجربة الإنسانية، محدثاً ثورة في المعاملات عبر البلوكشين.',
    de: 'In diesem Whitepaper vertiefen wir das transformative Potenzial des A.I. Genesis Official Token und untersuchen, wie er den Bereich der künstlichen Intelligenz nahtlos mit der menschlichen Erfahrung verbindet und Transaktionen über die Blockchain revolutioniert.',
    sr: 'У овом whitepaperu дубински разматрамо трансформативни потенцијал A.I. Genesis Official Tokena и истражујемо како повезује област вештачке интелигенције с људским искуством, револуционишући трансакције путем блокчејна.',
    ur: 'اس وائٹ پیپر میں ہم A.I. Genesis Official Token کی تبدیلی لانے والی صلاحیت کا گہرا جائزہ لیتے ہیں اور دیکھتے ہیں کہ یہ مصنوعی ذہانت کے میدان کو انسانی تجربے سے کیسے جوڑتا ہے، بلاک چین کے ذریعے لین دین میں انقلاب لاتے ہوئے۔',
  },
  'El A.I. Genesis Official Token representa la culminación de tecnología de vanguardia y ofrece una vía singular para fundir la inteligencia artificial con la interacción humana. En un mundo donde el paisaje digital se expande a un ritmo sin precedentes, este token se presenta como el pegamento que une esos dos mundos.': {
    en: 'The A.I. Genesis Official Token represents the culmination of cutting-edge technology, offering a unique avenue for the amalgamation of artificial intelligence and human interaction. In a world where the digital landscape is expanding at an unprecedented pace, this token presents itself as the glue that binds these two worlds together.',
    pt: 'O A.I. Genesis Official Token representa a culminação da tecnologia de ponta e oferece uma via singular para fundir a inteligência artificial com a interação humana. Num mundo onde a paisagem digital se expande a um ritmo sem precedentes, este token apresenta-se como a cola que une esses dois mundos.',
    fr: "L'A.I. Genesis Official Token représente l'aboutissement d'une technologie de pointe et offre une voie unique pour fusionner l'intelligence artificielle et l'interaction humaine. Dans un monde où le paysage numérique s'étend à un rythme sans précédent, ce jeton se présente comme la colle qui relie ces deux mondes.",
    ru: 'A.I. Genesis Official Token — это вершина передовых технологий, открывающая уникальный путь к слиянию искусственного интеллекта и человеческого взаимодействия. В мире, где цифровое пространство расширяется беспрецедентными темпами, этот токен выступает связующим звеном между двумя мирами.',
    sv: 'A.I. Genesis Official Token är kulmen på spjutspetsteknik och erbjuder en unik väg att förena artificiell intelligens med mänsklig interaktion. I en värld där det digitala landskapet växer i en aldrig tidigare skådad takt framstår denna token som limmet som binder samman dessa två världar.',
    hr: 'A.I. Genesis Official Token predstavlja vrhunac vrhunske tehnologije i nudi jedinstven put za spajanje umjetne inteligencije i ljudske interakcije. U svijetu u kojem se digitalni krajolik širi neviđenom brzinom, ovaj se token predstavlja kao ljepilo koje povezuje ta dva svijeta.',
    ar: 'يمثّل A.I. Genesis Official Token ذروة التقنية المتقدّمة، ويتيح مساراً فريداً لدمج الذكاء الاصطناعي بالتفاعل الإنساني. وفي عالم يتوسّع فيه المشهد الرقمي بوتيرة غير مسبوقة، يقدّم هذا الرمز نفسه صمغاً يربط هذين العالمين.',
    de: 'Der A.I. Genesis Official Token ist der Höhepunkt modernster Technologie und eröffnet einen einzigartigen Weg, künstliche Intelligenz und menschliche Interaktion zu verschmelzen. In einer Welt, in der die digitale Landschaft in beispiellosem Tempo wächst, versteht sich dieser Token als der Klebstoff, der diese beiden Welten verbindet.',
    sr: 'A.I. Genesis Official Token представља врхунац најсавременије технологије и нуди јединствен пут за спајање вештачке интелигенције и људске интеракције. У свету у коме се дигитални пејзаж шири невиђеном брзином, овај се токен представља као лепак који повезује та два света.',
    ur: 'A.I. Genesis Official Token جدید ترین ٹیکنالوجی کا نقطۂ عروج ہے اور مصنوعی ذہانت کو انسانی تعامل سے ملانے کا منفرد راستہ پیش کرتا ہے۔ ایسی دنیا میں جہاں ڈیجیٹل منظرنامہ بے مثال رفتار سے پھیل رہا ہے، یہ ٹوکن ان دو دنیاؤں کو جوڑنے والے گوند کے طور پر سامنے آتا ہے۔',
  },
  'El Genesis Token tiene un suministro total de 111 millones de tokens. Su permanencia queda subrayada por la ausencia de mecanismos de emisión o quema, lo que asegura la integridad del ecosistema y mantiene la confianza del inversor.': {
    en: 'Genesis Token has a total supply of 111 million tokens. Its permanence is underscored by the absence of minting or burning mechanisms, ensuring the integrity of the ecosystem and maintaining investor trust.',
    pt: 'O Genesis Token tem um fornecimento total de 111 milhões de tokens. A sua permanência é sublinhada pela ausência de mecanismos de emissão ou queima, o que assegura a integridade do ecossistema e mantém a confiança do investidor.',
    fr: "Le Genesis Token dispose d'une offre totale de 111 millions de jetons. Sa permanence est soulignée par l'absence de mécanismes d'émission ou de destruction, ce qui garantit l'intégrité de l'écosystème et préserve la confiance de l'investisseur.",
    ru: 'Общая эмиссия Genesis Token составляет 111 миллионов токенов. Его неизменность подчёркивается отсутствием механизмов выпуска и сжигания, что обеспечивает целостность экосистемы и сохраняет доверие инвестора.',
    sv: 'Genesis Token har ett totalt utbud på 111 miljoner tokens. Dess beständighet understryks av avsaknaden av mekanismer för utgivning eller bränning, vilket säkrar ekosystemets integritet och bevarar investerarens förtroende.',
    hr: 'Genesis Token ima ukupnu ponudu od 111 milijuna tokena. Njegovu trajnost naglašava izostanak mehanizama izdavanja ili spaljivanja, čime se osigurava integritet ekosustava i održava povjerenje ulagatelja.',
    ar: 'يبلغ إجمالي المعروض من Genesis Token 111 مليون رمز. ويؤكّد ثباتَه غيابُ آليات السكّ أو الحرق، بما يضمن سلامة المنظومة ويحافظ على ثقة المستثمر.',
    de: 'Der Genesis Token hat ein Gesamtangebot von 111 Millionen Token. Seine Beständigkeit wird durch das Fehlen von Prägungs- oder Verbrennungsmechanismen unterstrichen, was die Integrität des Ökosystems sichert und das Vertrauen der Anleger erhält.',
    sr: 'Genesis Token има укупну понуду од 111 милиона токена. Његову трајност наглашава изостанак механизама издавања или спаљивања, чиме се осигурава интегритет екосистема и одржава поверење улагача.',
    ur: 'Genesis Token کی کل سپلائی 111 ملین ٹوکن ہے۔ اس کے دوام کو منٹنگ یا برننگ کے طریقہ کار کی عدم موجودگی نمایاں کرتی ہے، جو ایکو سسٹم کی سالمیت یقینی بناتی اور سرمایہ کار کا اعتماد برقرار رکھتی ہے۔',
  },
  'Este token es una herramienta de gobernanza. Quienes poseen el A.I. Genesis Official Token ejercen influencia sobre las decisiones que dan forma al ecosistema, lo que favorece un desarrollo descentralizado y guiado por la comunidad.': {
    en: 'This token is a tool for governance. Holders of the A.I. Genesis Official Token wield influence over decisions that shape the ecosystem, fostering a decentralized and community-driven approach to development.',
    pt: 'Este token é uma ferramenta de governança. Quem detém o A.I. Genesis Official Token exerce influência sobre as decisões que dão forma ao ecossistema, favorecendo um desenvolvimento descentralizado e guiado pela comunidade.',
    fr: "Ce jeton est un outil de gouvernance. Les détenteurs de l'A.I. Genesis Official Token exercent une influence sur les décisions qui façonnent l'écosystème, favorisant un développement décentralisé et porté par la communauté.",
    ru: 'Этот токен — инструмент управления. Держатели A.I. Genesis Official Token влияют на решения, формирующие экосистему, что способствует децентрализованному развитию под руководством сообщества.',
    sv: 'Denna token är ett verktyg för styrning. Innehavare av A.I. Genesis Official Token utövar inflytande över de beslut som formar ekosystemet, vilket främjar en decentraliserad och gemenskapsdriven utveckling.',
    hr: 'Ovaj je token alat upravljanja. Imatelji A.I. Genesis Official Tokena utječu na odluke koje oblikuju ekosustav, čime se potiče decentraliziran razvoj vođen zajednicom.',
    ar: 'هذا الرمز أداة حوكمة. فحائزو A.I. Genesis Official Token يؤثّرون في القرارات التي تشكّل المنظومة، بما يعزّز تطويراً لامركزياً تقوده المجتمعات.',
    de: 'Dieser Token ist ein Instrument der Governance. Inhaber des A.I. Genesis Official Token nehmen Einfluss auf Entscheidungen, die das Ökosystem prägen, und fördern so eine dezentrale, von der Community getragene Entwicklung.',
    sr: 'Овај је токен алат управљања. Власници A.I. Genesis Official Tokena утичу на одлуке које обликују екосистем, чиме се подстиче децентрализован развој вођен заједницом.',
    ur: 'یہ ٹوکن گورننس کا ایک آلہ ہے۔ A.I. Genesis Official Token رکھنے والے ان فیصلوں پر اثر رکھتے ہیں جو ایکو سسٹم کو شکل دیتے ہیں، جس سے غیر مرکزی اور کمیونٹی کی رہنمائی میں ترقی کو فروغ ملتا ہے۔',
  },
  'El A.I. Genesis Official Token permite participar en multitud de operaciones virtuales: desde entrar en loterías cripto y sumergirse en el metaverso hasta adquirir NFT, contribuir a labores de minería, disfrutar de experiencias de juego, realizar apuestas y facilitar intercambios en la cartera cripto nativa basada en EVM.': {
    en: 'The A.I. Genesis Official Token empowers users to engage in a plethora of virtual operations, ranging from participating in crypto lotteries and immersing themselves in the metaverse to acquiring NFTs, contributing to mining efforts, enjoying gaming experiences, placing bets, and facilitating exchanges in the native EVM-based cryptowallet.',
    pt: 'O A.I. Genesis Official Token permite participar numa multidão de operações virtuais: desde entrar em loterias cripto e mergulhar no metaverso até adquirir NFT, contribuir para tarefas de mineração, desfrutar de experiências de jogo, fazer apostas e facilitar câmbios na carteira cripto nativa baseada em EVM.',
    fr: "L'A.I. Genesis Official Token permet de participer à une multitude d'opérations virtuelles : des loteries crypto à l'immersion dans le métavers, en passant par l'acquisition de NFT, la contribution au minage, les expériences de jeu, les paris et les échanges dans le portefeuille crypto natif basé sur l'EVM.",
    ru: 'A.I. Genesis Official Token позволяет участвовать во множестве виртуальных операций: от криптолотерей и погружения в метавселенную до приобретения NFT, участия в майнинге, игровых впечатлений, ставок и обменов в нативном крипто-кошельке на базе EVM.',
    sv: 'A.I. Genesis Official Token gör det möjligt att delta i en mängd virtuella operationer: från kryptolotterier och fördjupning i metaversum till att skaffa NFT:er, bidra till mining, njuta av spelupplevelser, lägga vad och genomföra växlingar i den inbyggda EVM-baserade kryptoplånboken.',
    hr: 'A.I. Genesis Official Token omogućuje sudjelovanje u mnoštvu virtualnih operacija: od kripto lutrija i uranjanja u metaverzum do stjecanja NFT-ova, doprinosa rudarenju, uživanja u igrama, klađenja i olakšavanja razmjena u vlastitom kripto novčaniku temeljenom na EVM-u.',
    ar: 'يتيح A.I. Genesis Official Token المشاركة في وفرة من العمليات الافتراضية: من الدخول في يانصيب العملات المشفّرة والانغماس في الميتافيرس، إلى اقتناء NFT، والإسهام في التعدين، والاستمتاع بتجارب اللعب، ووضع الرهانات، وتيسير التبادلات في المحفظة المشفّرة الأصلية القائمة على EVM.',
    de: 'Der A.I. Genesis Official Token ermöglicht die Teilnahme an einer Fülle virtueller Operationen: von Krypto-Lotterien und dem Eintauchen ins Metaverse über den Erwerb von NFTs, Beiträge zum Mining, Spielerlebnisse und Wetten bis hin zu Tauschgeschäften in der nativen EVM-basierten Krypto-Wallet.',
    sr: 'A.I. Genesis Official Token омогућава учешће у мноштву виртуелних операција: од крипто лутрија и уроњавања у метаверзум до стицања NFT-ова, доприноса рударењу, уживања у играма, клађења и олакшавања размена у сопственом крипто новчанику заснованом на EVM-у.',
    ur: 'A.I. Genesis Official Token متعدد ورچوئل آپریشنز میں شرکت کی اجازت دیتا ہے: کرپٹو لاٹریوں میں شامل ہونے اور میٹاورس میں ڈوبنے سے لے کر NFT حاصل کرنے، مائننگ میں حصہ ڈالنے، گیمنگ کے تجربات، شرط لگانے اور EVM پر مبنی اپنے کرپٹو والٹ میں تبادلوں تک۔',
  },
  'En su núcleo, el A.I. Genesis Official Token sirve de puente entre las capacidades ilimitadas de la inteligencia artificial y el deseo humano de transacciones fluidas, seguras y eficientes. Al aprovechar la potencia de la tecnología blockchain, crea un ecosistema donde los servicios guiados por IA interactúan sin fricción con las personas.': {
    en: 'At its core, the A.I. Genesis Official Token serves as a bridge between the limitless capabilities of artificial intelligence and the human desire for seamless, secure, and efficient transactions. By harnessing the power of blockchain technology, it creates an ecosystem where AI-driven services seamlessly interact with human users.',
    pt: 'No seu núcleo, o A.I. Genesis Official Token serve de ponte entre as capacidades ilimitadas da inteligência artificial e o desejo humano de transações fluidas, seguras e eficientes. Ao aproveitar a potência da tecnologia blockchain, cria um ecossistema onde os serviços guiados por IA interagem sem atrito com as pessoas.',
    fr: "En son cœur, l'A.I. Genesis Official Token sert de pont entre les capacités illimitées de l'intelligence artificielle et le désir humain de transactions fluides, sûres et efficaces. En exploitant la puissance de la blockchain, il crée un écosystème où les services pilotés par l'IA interagissent sans friction avec les personnes.",
    ru: 'В своей основе A.I. Genesis Official Token служит мостом между безграничными возможностями искусственного интеллекта и человеческим стремлением к плавным, безопасным и эффективным транзакциям. Используя мощь блокчейна, он создаёт экосистему, где сервисы на базе ИИ без трения взаимодействуют с людьми.',
    sv: 'I sin kärna fungerar A.I. Genesis Official Token som en bro mellan den artificiella intelligensens obegränsade förmågor och människans önskan om smidiga, säkra och effektiva transaktioner. Genom att utnyttja blockkedjeteknikens kraft skapar den ett ekosystem där AI-drivna tjänster friktionsfritt möter människor.',
    hr: 'U svojoj srži, A.I. Genesis Official Token služi kao most između neograničenih mogućnosti umjetne inteligencije i ljudske želje za tečnim, sigurnim i učinkovitim transakcijama. Iskorištavanjem snage blockchain tehnologije stvara ekosustav u kojem usluge vođene umjetnom inteligencijom bez trenja komuniciraju s ljudima.',
    ar: 'في جوهره، يعمل A.I. Genesis Official Token جسراً بين قدرات الذكاء الاصطناعي غير المحدودة ورغبة الإنسان في معاملات سلسة وآمنة وفعّالة. وبتسخير قوة تقنية البلوكشين، يخلق منظومة تتفاعل فيها الخدمات المدفوعة بالذكاء الاصطناعي بلا احتكاك مع البشر.',
    de: 'Im Kern dient der A.I. Genesis Official Token als Brücke zwischen den grenzenlosen Fähigkeiten künstlicher Intelligenz und dem menschlichen Wunsch nach reibungslosen, sicheren und effizienten Transaktionen. Durch die Kraft der Blockchain-Technologie entsteht ein Ökosystem, in dem KI-gesteuerte Dienste reibungslos mit Menschen interagieren.',
    sr: 'У својој сржи, A.I. Genesis Official Token служи као мост између неограничених могућности вештачке интелигенције и људске жеље за течним, безбедним и ефикасним трансакцијама. Искоришћавањем снаге блокчејн технологије ствара екосистем у коме услуге вођене вештачком интелигенцијом без трења комуницирају с људима.',
    ur: 'اپنی اصل میں، A.I. Genesis Official Token مصنوعی ذہانت کی لامحدود صلاحیتوں اور رواں، محفوظ اور مؤثر لین دین کی انسانی خواہش کے درمیان پل کا کام کرتا ہے۔ بلاک چین ٹیکنالوجی کی طاقت سے یہ ایک ایسا ایکو سسٹم بناتا ہے جہاں AI پر مبنی خدمات لوگوں سے بلا رکاوٹ رابطہ کرتی ہیں۔',
  },
  'En un mundo donde la confianza es primordial, el A.I. Genesis Official Token establece un entorno en el que las transacciones se realizan con transparencia y seguridad. La cadena de bloques asegura la integridad de todas las interacciones, mientras que los servicios potenciados por IA las hacen más eficientes y fáciles de usar.': {
    en: 'In a world where trust is paramount, the A.I. Genesis Official Token establishes an environment where transactions are conducted with transparency and security. The blockchain ensures the integrity of all interactions, while AI-enhanced services make these interactions more efficient and user-friendly.',
    pt: 'Num mundo onde a confiança é primordial, o A.I. Genesis Official Token estabelece um ambiente em que as transações se realizam com transparência e segurança. A blockchain assegura a integridade de todas as interações, enquanto os serviços potenciados por IA as tornam mais eficientes e fáceis de usar.',
    fr: "Dans un monde où la confiance est primordiale, l'A.I. Genesis Official Token instaure un environnement où les transactions se déroulent avec transparence et sécurité. La blockchain garantit l'intégrité de toutes les interactions, tandis que les services enrichis par l'IA les rendent plus efficaces et plus simples d'usage.",
    ru: 'В мире, где доверие имеет первостепенное значение, A.I. Genesis Official Token создаёт среду, в которой транзакции проводятся прозрачно и безопасно. Блокчейн обеспечивает целостность всех взаимодействий, а сервисы с ИИ делают их эффективнее и удобнее.',
    sv: 'I en värld där förtroende är avgörande skapar A.I. Genesis Official Token en miljö där transaktioner genomförs med öppenhet och säkerhet. Blockkedjan säkrar integriteten i alla interaktioner, medan AI-förstärkta tjänster gör dem effektivare och enklare att använda.',
    hr: 'U svijetu u kojem je povjerenje ključno, A.I. Genesis Official Token uspostavlja okruženje u kojem se transakcije provode transparentno i sigurno. Blockchain osigurava integritet svih interakcija, dok ih usluge pojačane umjetnom inteligencijom čine učinkovitijima i jednostavnijima za uporabu.',
    ar: 'في عالم تُعدّ فيه الثقة أمراً جوهرياً، يُنشئ A.I. Genesis Official Token بيئةً تُجرى فيها المعاملات بشفافية وأمان. تضمن البلوكشين سلامة جميع التفاعلات، بينما تجعلها الخدمات المعزّزة بالذكاء الاصطناعي أكثر كفاءة وأيسر استخداماً.',
    de: 'In einer Welt, in der Vertrauen entscheidend ist, schafft der A.I. Genesis Official Token ein Umfeld, in dem Transaktionen transparent und sicher ablaufen. Die Blockchain sichert die Integrität aller Interaktionen, während KI-gestützte Dienste sie effizienter und benutzerfreundlicher machen.',
    sr: 'У свету у коме је поверење кључно, A.I. Genesis Official Token успоставља окружење у коме се трансакције спроводе транспарентно и безбедно. Блокчејн осигурава интегритет свих интеракција, док их услуге појачане вештачком интелигенцијом чине ефикаснијим и једноставнијим за употребу.',
    ur: 'ایسی دنیا میں جہاں اعتماد سب سے اہم ہے، A.I. Genesis Official Token ایسا ماحول قائم کرتا ہے جہاں لین دین شفافیت اور تحفظ کے ساتھ ہوتا ہے۔ بلاک چین تمام تعاملات کی سالمیت یقینی بناتی ہے، جبکہ AI سے بہتر بنائی گئی خدمات انہیں زیادہ مؤثر اور استعمال میں آسان بناتی ہیں۔',
  },
  'Situados en el cruce entre la tecnología y la experiencia humana, el A.I. Genesis Official Token simboliza una nueva era de innovación. Con su suministro fijo, sus capacidades de gobernanza y su versatilidad en operaciones virtuales, está preparado para transformar la forma en que nos relacionamos con la inteligencia artificial y realizamos transacciones. No es meramente un token: es un cauce hacia el futuro, donde las fronteras entre el mundo digital y el físico se difuminan y el potencial humano se amplifica con la fuerza de la IA.': {
    en: 'As we stand at the intersection of technology and human experience, the A.I. Genesis Official Token symbolizes a new era of innovation. With its fixed supply, governance capabilities, and versatility in virtual operations, it is poised to transform the way we engage with artificial intelligence and conduct transactions. It is not merely a token; it is a conduit for the future, where the boundaries between the digital and physical worlds blur, and human potential is augmented by the power of AI.',
    pt: 'Situados no cruzamento entre a tecnologia e a experiência humana, o A.I. Genesis Official Token simboliza uma nova era de inovação. Com o seu fornecimento fixo, as suas capacidades de governança e a sua versatilidade em operações virtuais, está preparado para transformar a forma como nos relacionamos com a inteligência artificial e realizamos transações. Não é meramente um token: é um canal para o futuro, onde as fronteiras entre o mundo digital e o físico se esbatem e o potencial humano é amplificado pela força da IA.',
    fr: "Situés au croisement de la technologie et de l'expérience humaine, l'A.I. Genesis Official Token symbolise une nouvelle ère d'innovation. Avec son offre fixe, ses capacités de gouvernance et sa polyvalence dans les opérations virtuelles, il est prêt à transformer notre rapport à l'intelligence artificielle et notre manière de transiger. Ce n'est pas simplement un jeton : c'est un canal vers l'avenir, où les frontières entre les mondes numérique et physique s'estompent et où le potentiel humain est amplifié par la puissance de l'IA.",
    ru: 'Находясь на пересечении технологии и человеческого опыта, A.I. Genesis Official Token символизирует новую эру инноваций. Благодаря фиксированной эмиссии, возможностям управления и универсальности в виртуальных операциях он готов преобразить то, как мы взаимодействуем с искусственным интеллектом и совершаем транзакции. Это не просто токен: это канал в будущее, где границы между цифровым и физическим мирами размываются, а человеческий потенциал усиливается мощью ИИ.',
    sv: 'I skärningspunkten mellan teknik och mänsklig erfarenhet symboliserar A.I. Genesis Official Token en ny era av innovation. Med sitt fasta utbud, sina styrningsmöjligheter och sin mångsidighet i virtuella operationer är den redo att förändra hur vi möter artificiell intelligens och genomför transaktioner. Den är inte enbart en token: den är en kanal till framtiden, där gränserna mellan den digitala och den fysiska världen suddas ut och den mänskliga potentialen förstärks av AI:ns kraft.',
    hr: 'Na sjecištu tehnologije i ljudskog iskustva, A.I. Genesis Official Token simbolizira novo doba inovacije. Sa svojom fiksnom ponudom, upravljačkim mogućnostima i svestranošću u virtualnim operacijama spreman je preobraziti način na koji se odnosimo prema umjetnoj inteligenciji i provodimo transakcije. Nije tek token: on je kanal prema budućnosti, u kojoj se granice između digitalnog i fizičkog svijeta zamagljuju, a ljudski potencijal pojačava snagom umjetne inteligencije.',
    ar: 'إذ نقف عند تقاطع التقنية والتجربة الإنسانية، يرمز A.I. Genesis Official Token إلى عصر جديد من الابتكار. فبعرضه الثابت وقدراته في الحوكمة وتعدّد استخداماته في العمليات الافتراضية، هو مهيّأ لتغيير طريقة تعاملنا مع الذكاء الاصطناعي وإجرائنا للمعاملات. إنه ليس مجرّد رمز؛ بل قناةٌ نحو المستقبل، حيث تتلاشى الحدود بين العالمين الرقمي والمادي، وتتعزّز الطاقة البشرية بقوّة الذكاء الاصطناعي.',
    de: 'Am Schnittpunkt von Technologie und menschlicher Erfahrung steht der A.I. Genesis Official Token für eine neue Ära der Innovation. Mit seinem festen Angebot, seinen Governance-Fähigkeiten und seiner Vielseitigkeit in virtuellen Operationen ist er bereit, unseren Umgang mit künstlicher Intelligenz und unsere Art zu transagieren zu verwandeln. Er ist nicht bloß ein Token: Er ist ein Kanal in die Zukunft, in der die Grenzen zwischen digitaler und physischer Welt verschwimmen und menschliches Potenzial durch die Kraft der KI verstärkt wird.',
    sr: 'На раскршћу технологије и људског искуства, A.I. Genesis Official Token симболизује ново доба иновације. Са својом фиксном понудом, управљачким могућностима и свестраношћу у виртуелним операцијама, спреман је да преобрази начин на који се односимо према вештачкој интелигенцији и обављамо трансакције. Није тек токен: он је канал ка будућности, у којој се границе између дигиталног и физичког света замагљују, а људски потенцијал појачава снагом вештачке интелигенције.',
    ur: 'ٹیکنالوجی اور انسانی تجربے کے سنگم پر کھڑا A.I. Genesis Official Token جدت کے ایک نئے دور کی علامت ہے۔ اپنی مقررہ سپلائی، گورننس کی صلاحیتوں اور ورچوئل آپریشنز میں ہمہ گیریت کے ساتھ، یہ اس بات کو بدلنے کے لیے تیار ہے کہ ہم مصنوعی ذہانت سے کیسے جڑتے اور لین دین کیسے کرتے ہیں۔ یہ محض ایک ٹوکن نہیں: یہ مستقبل کا راستہ ہے، جہاں ڈیجیٹل اور طبیعی دنیا کی سرحدیں دھندلی ہو جاتی ہیں اور انسانی صلاحیت AI کی طاقت سے بڑھ جاتی ہے۔',
  },
  'Bienvenido al génesis de una nueva era.': {
    en: 'Welcome to the genesis of a new era.',
    pt: 'Bem-vindo ao génesis de uma nova era.',
    fr: "Bienvenue à la genèse d'une nouvelle ère.",
    ru: 'Добро пожаловать в генезис новой эпохи.',
    sv: 'Välkommen till en ny eras genesis.',
    hr: 'Dobrodošli u genezu novog doba.',
    ar: 'مرحباً بك في تكوين عصر جديد.',
    de: 'Willkommen in der Genesis einer neuen Ära.',
    sr: 'Добродошли у генезу новог доба.',
    ur: 'ایک نئے دور کی ابتدا میں خوش آمدید۔',
  },

  /* ── las 20 fases del documento (los nombres propios no se traducen) ── */
  'Desarrollo del Genesis Core': {
    en: 'Development Genesis Core', pt: 'Desenvolvimento do Genesis Core',
    fr: 'Développement du Genesis Core', ru: 'Разработка Genesis Core',
    sv: 'Utveckling av Genesis Core', hr: 'Razvoj Genesis Corea',
    ar: 'تطوير Genesis Core', de: 'Entwicklung des Genesis Core',
    sr: 'Развој Genesis Corea', ur: 'Genesis Core کی ترقی',
  },
  'Desarrollo del AiG Token': {
    en: 'AiG Token Development', pt: 'Desenvolvimento do AiG Token',
    fr: 'Développement du AiG Token', ru: 'Разработка AiG Token',
    sv: 'Utveckling av AiG Token', hr: 'Razvoj AiG Tokena',
    ar: 'تطوير AiG Token', de: 'Entwicklung des AiG Token',
    sr: 'Развој AiG Tokena', ur: 'AiG Token کی ترقی',
  },
  'Integración con PancakeSwap': {
    en: 'PancakeSwap integration', pt: 'Integração com a PancakeSwap',
    fr: 'Intégration à PancakeSwap', ru: 'Интеграция с PancakeSwap',
    sv: 'Integration med PancakeSwap', hr: 'Integracija s PancakeSwapom',
    ar: 'التكامل مع PancakeSwap', de: 'Integration mit PancakeSwap',
    sr: 'Интеграција с PancakeSwapom', ur: 'PancakeSwap کے ساتھ انضمام',
  },
  'Integración con P2B': {
    en: 'P2B integration', pt: 'Integração com a P2B', fr: 'Intégration à P2B',
    ru: 'Интеграция с P2B', sv: 'Integration med P2B', hr: 'Integracija s P2B-om',
    ar: 'التكامل مع P2B', de: 'Integration mit P2B', sr: 'Интеграција с P2B-ом',
    ur: 'P2B کے ساتھ انضمام',
  },
  'Alta en Bitcoin Talk': {
    en: 'Log in to Bitcoin Talk', pt: 'Registo no Bitcoin Talk',
    fr: 'Inscription sur Bitcoin Talk', ru: 'Регистрация на Bitcoin Talk',
    sv: 'Registrering på Bitcoin Talk', hr: 'Prijava na Bitcoin Talk',
    ar: 'التسجيل في Bitcoin Talk', de: 'Anmeldung bei Bitcoin Talk',
    sr: 'Пријава на Bitcoin Talk', ur: 'Bitcoin Talk پر اندراج',
  },
  'AiG disponible en Dextool': {
    en: 'AiG available in Dextool', pt: 'AiG disponível na Dextool',
    fr: 'AiG disponible sur Dextool', ru: 'AiG доступен в Dextool',
    sv: 'AiG tillgänglig i Dextool', hr: 'AiG dostupan na Dextoolu',
    ar: 'AiG متاح في Dextool', de: 'AiG in Dextool verfügbar',
    sr: 'AiG доступан на Dextoolu', ur: 'AiG کی Dextool پر دستیابی',
  },
  'AiG se une a Dexgroup': {
    en: 'AiG joins Dexgroup', pt: 'AiG junta-se ao Dexgroup',
    fr: 'AiG rejoint Dexgroup', ru: 'AiG присоединяется к Dexgroup',
    sv: 'AiG ansluter sig till Dexgroup', hr: 'AiG se pridružuje Dexgroupu',
    ar: 'AiG ينضمّ إلى Dexgroup', de: 'AiG tritt Dexgroup bei',
    sr: 'AiG се придружује Dexgroupu', ur: 'AiG کی Dexgroup میں شمولیت',
  },
  'Auditoría de Certik aprobada': {
    en: 'Certik Audit Approved', pt: 'Auditoria da Certik aprovada',
    fr: 'Audit Certik approuvé', ru: 'Аудит Certik пройден',
    sv: 'Certik-granskning godkänd', hr: 'Certikova revizija odobrena',
    ar: 'اعتماد تدقيق Certik', de: 'Certik-Audit bestanden',
    sr: 'Certikova ревизија одобрена', ur: 'Certik آڈٹ منظور',
  },
  'Lanzamiento de la G11 Wallet': {
    en: 'Launch of G11 Wallet', pt: 'Lançamento da G11 Wallet',
    fr: 'Lancement du G11 Wallet', ru: 'Запуск G11 Wallet',
    sv: 'Lansering av G11 Wallet', hr: 'Lansiranje G11 Walleta',
    ar: 'إطلاق محفظة G11', de: 'Start der G11 Wallet',
    sr: 'Лансирање G11 Walleta', ur: 'G11 Wallet کا اجرا',
  },
  'Desarrollo de la AiG Academy': {
    en: 'Development of AiG Academy', pt: 'Desenvolvimento da AiG Academy',
    fr: "Développement de l'AiG Academy", ru: 'Развитие AiG Academy',
    sv: 'Utveckling av AiG Academy', hr: 'Razvoj AiG Academyja',
    ar: 'تطوير AiG Academy', de: 'Aufbau der AiG Academy',
    sr: 'Развој AiG Academyja', ur: 'AiG Academy کی ترقی',
  },
  'Desarrollo del metaverso': {
    en: 'Metaverse Development', pt: 'Desenvolvimento do metaverso',
    fr: 'Développement du métavers', ru: 'Разработка метавселенной',
    sv: 'Utveckling av metaversum', hr: 'Razvoj metaverzuma',
    ar: 'تطوير الميتافيرس', de: 'Entwicklung des Metaverse',
    sr: 'Развој метаверзума', ur: 'میٹاورس کی ترقی',
  },
  'Minería de NFT': {
    en: 'NFT mining', pt: 'Mineração de NFT', fr: 'Minage de NFT',
    ru: 'Майнинг NFT', sv: 'NFT-mining', hr: 'Rudarenje NFT-ova',
    ar: 'تعدين NFT', de: 'NFT-Mining', sr: 'Рударење NFT-ова',
    ur: 'NFT مائننگ',
  },
  'Desarrollo de Trasy': {
    en: 'Trasy development', pt: 'Desenvolvimento do Trasy',
    fr: 'Développement de Trasy', ru: 'Разработка Trasy',
    sv: 'Utveckling av Trasy', hr: 'Razvoj Trasyja',
    ar: 'تطوير Trasy', de: 'Entwicklung von Trasy',
    sr: 'Развој Trasyja', ur: 'Trasy کی ترقی',
  },
  'Lanzamiento del portal AiG News': {
    en: 'Launch of AiG News Portal', pt: 'Lançamento do portal AiG News',
    fr: 'Lancement du portail AiG News', ru: 'Запуск портала AiG News',
    sv: 'Lansering av portalen AiG News', hr: 'Lansiranje portala AiG News',
    ar: 'إطلاق بوابة AiG News', de: 'Start des AiG-News-Portals',
    sr: 'Лансирање портала AiG News', ur: 'AiG News پورٹل کا اجرا',
  },
  'Evento en Dubái y Latinoamérica': {
    en: 'Dubai & Latin American event', pt: 'Evento no Dubai e na América Latina',
    fr: 'Événement à Dubaï et en Amérique latine', ru: 'Мероприятие в Дубае и Латинской Америке',
    sv: 'Evenemang i Dubai och Latinamerika', hr: 'Događaj u Dubaiju i Latinskoj Americi',
    ar: 'فعالية في دبي وأمريكا اللاتينية', de: 'Event in Dubai und Lateinamerika',
    sr: 'Догађај у Дубаију и Латинској Америци', ur: 'دبئی اور لاطینی امریکہ میں تقریب',
  },
  'Lanzamiento de la tarjeta y los cajeros': {
    en: 'Launch of the Card and ATMs', pt: 'Lançamento do cartão e dos caixas automáticos',
    fr: 'Lancement de la carte et des distributeurs', ru: 'Запуск карты и банкоматов',
    sv: 'Lansering av kortet och uttagsautomaterna', hr: 'Lansiranje kartice i bankomata',
    ar: 'إطلاق البطاقة وأجهزة الصرّاف', de: 'Start der Karte und der Automaten',
    sr: 'Лансирање картице и банкомата', ur: 'کارڈ اور اے ٹی ایم کا اجرا',
  },
  'Génesis Exchange': {
    en: 'Génesis Exchange', pt: 'Génesis Exchange', fr: 'Génesis Exchange',
    ru: 'Génesis Exchange', sv: 'Génesis Exchange', hr: 'Génesis Exchange',
    ar: 'Génesis Exchange', de: 'Génesis Exchange', sr: 'Génesis Exchange',
    ur: 'Génesis Exchange',
  },
  'Red social AIG AiLink': {
    en: 'AIG AiLink Social Network', pt: 'Rede social AIG AiLink',
    fr: 'Réseau social AIG AiLink', ru: 'Социальная сеть AIG AiLink',
    sv: 'Sociala nätverket AIG AiLink', hr: 'Društvena mreža AIG AiLink',
    ar: 'شبكة AIG AiLink الاجتماعية', de: 'Soziales Netzwerk AIG AiLink',
    sr: 'Друштвена мрежа AIG AiLink', ur: 'AIG AiLink سوشل نیٹ ورک',
  },
  'Blockchain propia': {
    en: 'Own Blockchain', pt: 'Blockchain própria', fr: 'Blockchain propre',
    ru: 'Собственный блокчейн', sv: 'Egen blockkedja', hr: 'Vlastiti blockchain',
    ar: 'بلوكشين خاصة', de: 'Eigene Blockchain', sr: 'Сопствени блокчејн',
    ur: 'اپنی بلاک چین',
  },
  'Segunda capa de contratos inteligentes': {
    en: 'Second Smart-Contract Layer', pt: 'Segunda camada de contratos inteligentes',
    fr: 'Deuxième couche de contrats intelligents', ru: 'Второй слой смарт-контрактов',
    sv: 'Andra lagret av smarta kontrakt', hr: 'Drugi sloj pametnih ugovora',
    ar: 'طبقة ثانية من العقود الذكية', de: 'Zweite Smart-Contract-Ebene',
    sr: 'Други слој паметних уговора', ur: 'سمارٹ کنٹریکٹ کی دوسری پرت',
  },
}

registrarEntradas(WHITEPAPER)
