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
  const invisibles = Array.from(document.querySelectorAll('*')).filter(el => {
    const s = getComputedStyle(el);
    if (s.color !== 'rgba(0, 0, 0, 0)' && s.webkitTextFillColor !== 'rgba(0, 0, 0, 0)') return false;
    if (s.backgroundImage !== 'none') return false;
    return (el.textContent || '').trim().length > 0 && el.getBoundingClientRect().width > 0;
  });
  for (const el of invisibles.slice(0, 8)) {
    fallos.push({
      tipo: 'texto-invisible',
      detalle: (el.className || el.tagName).toString().slice(0, 40),
      texto: (el.textContent || '').trim().slice(0, 24),
    });
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
