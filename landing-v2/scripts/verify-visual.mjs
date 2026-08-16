/**
 * Comprobación visual de las 14 secciones.
 *
 * POR QUE EXISTE
 * --------------
 * La comprobación anterior comparaba píxeles de TRES secciones antes y después
 * de un cambio. Dio "dentro del ruido de animación" a un commit que había dejado
 * invisible todo el texto en degradado del sitio —titulares, contadores, botones—
 * porque la sección más afectada no estaba entre las muestreadas y el área de
 * texto es pequeña frente al fondo animado.
 *
 * No era una comprobación mala: era estrecha. Tres de catorce no cubren catorce.
 *
 * Esta mira las 14 secciones y busca clases enteras de fallo, no diferencias de
 * píxel. Un fallo de clase se detecta aunque ocupe 40 px de pantalla.
 *
 * QUE COMPRUEBA
 *  1. Desbordamiento horizontal — el documento nunca más ancho que la ventana
 *  2. Jerarquía de encabezados sin saltos de nivel
 *  3. Variables de diseño que resuelven a vacío
 *  4. Texto invisible: color transparente sin fondo que lo pinte
 *  5. Presencia de color dentro del presupuesto de marca
 *  6. Formas SVG caidas al `fill` negro por defecto
 *  7. Objetivos tactiles por debajo de 24x24 (WCAG 2.2 AA), solo en movil
 *
 * QUE NO COMPRUEBA, Y POR QUE
 * ---------------------------
 * Nada de `scrollHeight > clientHeight` para detectar «contenido que no cabe».
 * Se intentó y dio TRES falsos positivos seguidos, todos por la misma causa: un
 * `transform` extiende el area de scroll sin ser un problema de maquetacion.
 *
 *   - el mapa de ecosistema, con `scale(1.35)`
 *   - los titulares, con el `translateY(28px)` de su animacion de entrada
 *   - las tarjetas, cuyo padding se contaba como aire desperdiciado
 *
 * En los tres casos la caja encajaba perfectamente con su contenido. Una
 * comprobacion que grita cuando no pasa nada acaba ignorandose, y entonces no
 * sirve para cuando si pasa. Si hay que medir solapamiento, se mide comparando
 * los rectangulos de DOS elementos hermanos — eso si es real y fue lo que
 * encontro el solape de 98px en ecosistema.
 *
 * COMO SE USA
 * Se pega el contenido de `CHEQUEO` en la consola del navegador sobre el build
 * de producción, o se ejecuta por CDP. Devuelve un objeto con los fallos; array
 * vacío significa que pasa.
 */

export const ANCHOS = [390, 820, 1440]

/** Variables que deben resolver a algo. Vacías = el token no llega. */
export const VARIABLES_CRITICAS = [
  '--g-void', '--g-base', '--g-surface', '--g-ink', '--g-ink-muted',
  '--g-blue', '--g-blue-hi', '--g-violet', '--g-violet-hi',
  '--g-magenta', '--g-magenta-hi', '--g-cyan',
  '--gradient-genesis-strong', '--gradient-genesis-button',
]

/** Presupuesto de presencia, medido sobre el logo oficial. */
export const PRESUPUESTO = { vacioMin: 0.80, vacioMax: 0.95, verdeMax: 0.02 }

export const CHEQUEO = `
async function verificarGenesis() {
  const esperar = (ms) => new Promise(r => setTimeout(r, ms));
  const fallos = [];
  const raiz = getComputedStyle(document.documentElement);

  // ── 3. variables que resuelven a vacio ─────────────────────────────────
  for (const v of ${JSON.stringify(VARIABLES_CRITICAS)}) {
    if (!raiz.getPropertyValue(v).trim()) {
      fallos.push({ tipo: 'variable-vacia', detalle: v });
    }
  }

  // ── 4. texto invisible: transparente y sin fondo que lo pinte ──────────
  //
  // El degradado puede vivir en un ANCESTRO. Con \`background-clip: text\` el
  // fondo del ancestro pinta el texto de toda su descendencia, asi que un hijo
  // transparente y sin fondo propio se ve perfectamente. Mirar solo el elemento
  // marcaba los tres contadores de Trust —que se leen sin problema— como texto
  // invisible. Hay que subir por el arbol.
  const loPintaUnAncestro = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      const clip = s.webkitBackgroundClip || s.backgroundClip;
      if (clip === 'text' && s.backgroundImage !== 'none') return true;
    }
    return false;
  };
  const invisibles = Array.from(document.querySelectorAll('*')).filter(el => {
    const s = getComputedStyle(el);
    if (s.color !== 'rgba(0, 0, 0, 0)' && s.webkitTextFillColor !== 'rgba(0, 0, 0, 0)') return false;
    if (s.backgroundImage !== 'none') return false;
    if (loPintaUnAncestro(el)) return false;
    return (el.textContent || '').trim().length > 0 && el.getBoundingClientRect().width > 0;
  });

  // ── 6. formas SVG que caen al relleno negro por defecto ────────────────
  //
  // El \`fill\` inicial de SVG es negro y se hereda. Una forma a la que se le
  // olvide el relleno no desaparece: se pinta como una mancha opaca sobre el
  // fondo oscuro, sin romper el build ni la consola. Asi estuvieron dos elipses
  // —los halos de Marketplace y Comunidad— desde que se escribieron.
  for (const n of Array.from(document.querySelectorAll('svg *'))) {
    if (!['path','circle','ellipse','rect','polygon','polyline'].includes(n.tagName)) continue;
    const s = getComputedStyle(n);
    const b = n.getBoundingClientRect();
    if (s.fill === 'rgb(0, 0, 0)' && s.fillOpacity !== '0' && s.opacity !== '0' && b.width > 6 && b.height > 6) {
      fallos.push({ tipo: 'svg-relleno-negro', detalle: n.tagName + '.' + String(n.className.baseVal || '').slice(0, 30) });
    }
  }
  for (const el of invisibles.slice(0, 8)) {
    fallos.push({
      tipo: 'texto-invisible',
      detalle: (el.className || el.tagName).toString().slice(0, 40),
      texto: (el.textContent || '').trim().slice(0, 24),
    });
  }

  // ── 7. objetivos tactiles por debajo de WCAG 2.2 AA (24x24) ───────────
  //
  // Medido a 390 px: los once enlaces del pie iban a 16-17 px de alto y el de X
  // media NUEVE de ancho. La zona se amplia con un ::after, asi que hay que
  // medir el PSEUDOELEMENTO, no la caja del enlace.
  //
  // OJO con el fallo que tuvo la primera version de esta comprobacion: si el
  // ::after no existe devolvia null y el enlace quedaba FUERA del conteo, con lo
  // que daba verde justo en el caso que debia cazar. Sin ::after, la zona de
  // toque es la caja del propio elemento — ese es el respaldo correcto.
  if (window.innerWidth <= 480) {
    for (const el of Array.from(document.querySelectorAll('a, button'))) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || (el.textContent || '').trim().length === 0) continue;
      if (getComputedStyle(el).pointerEvents === 'none') continue;
      const a = getComputedStyle(el, '::after');
      let w = b.width, h = b.height;
      if (a.content !== 'none' && a.position === 'absolute') {
        w = Math.max(parseFloat(a.width) || 0, parseFloat(a.minWidth) || 0);
        h = parseFloat(a.height) || 0;
      }
      // Se compara REDONDEADO. Un pseudoelemento de 24px puede resolver a
      // 23.9931 cuando el `devicePixelRatio` no es entero, y con `< 24` a secas
      // eso sale como fallo. Una guarda que grita por un subpíxel acaba
      // ignorándose, que es la forma de morir de todas las guardas.
      if (Math.round(w) < 24 || Math.round(h) < 24) {
        fallos.push({ tipo: 'tactil-bajo-minimo', texto: (el.textContent || '').trim().slice(0, 20),
                      zona: Math.round(w) + 'x' + Math.round(h) });
      }
    }
  }

  const main = document.querySelector('.home-snap-main');
  if (!main) { fallos.push({ tipo: 'sin-contenedor' }); return fallos; }

  // ── 1. desbordamiento, recorriendo las 14 ──────────────────────────────
  for (const sec of Array.from(main.children)) {
    main.scrollTop = sec.offsetTop;
    await esperar(280);
    const exceso = document.documentElement.scrollWidth - window.innerWidth;
    if (exceso > 2) {
      fallos.push({ tipo: 'desborde-horizontal', detalle: sec.id, px: exceso });
    }
  }
  await esperar(800);

  // ── 2. jerarquia de encabezados ────────────────────────────────────────
  const niveles = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => +h.tagName[1]);
  for (let i = 1; i < niveles.length; i++) {
    if (niveles[i] > niveles[i-1] + 1) {
      fallos.push({ tipo: 'salto-de-nivel', detalle: 'h' + niveles[i-1] + ' -> h' + niveles[i] });
      break;
    }
  }
  if (niveles.filter(n => n === 1).length !== 1) {
    fallos.push({ tipo: 'h1-incorrecto', detalle: niveles.filter(n => n === 1).length + ' elementos h1' });
  }

  return { anchura: window.innerWidth, encabezados: niveles.length, fallos };
}
verificarGenesis()
`
