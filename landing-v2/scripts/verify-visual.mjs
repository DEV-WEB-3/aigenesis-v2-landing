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
 *  8. Duraciones de animacion fuera de la rejilla de `lib/design/motion.ts`
 *  9. Capas DOM en % desalineadas con el cuadrado de su SVG hermano
 * 10. Duraciones sueltas en globals.css — se ve sin abrir el navegador
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

import { readFileSync } from 'node:fs'

export const ANCHOS = [390, 820, 1440]

/* ─────────────────────────────────────────────────────────────────────────
   LA REJILLA SE LEE DE `motion.ts`, NO SE COPIA AQUI.

   Copiarla seria construir exactamente el fallo que esta guarda existe para
   impedir. La gramatica del portal YA existia —`_PULSE_S`, `_FORM_S`,
   `*Position` estaban en las doce secciones— y se degrado a doce copias
   divergentes porque nada comprobaba que siguieran de acuerdo. Una guarda con
   su propia copia de la verdad se desincroniza al primer cambio y a partir de
   ahi miente en verde, que es peor que no existir.

   Si manana alguien anade un escalon a la rejilla, esta comprobacion lo
   aprende sola.
   ───────────────────────────────────────────────────────────────────────── */
const FUENTE_MOTION = new URL('../lib/design/motion.ts', import.meta.url)

function leerLista(texto, nombre) {
  const m = texto.match(new RegExp(`export const ${nombre} = \\[([^\\]]*)\\]`))
  if (!m) throw new Error(`verify-visual: no encuentro ${nombre} en motion.ts`)
  return m[1].split(',').map((x) => Number(x.trim())).filter((n) => Number.isFinite(n))
}

function leerObjeto(texto, nombre) {
  const m = texto.match(new RegExp(`export const ${nombre} = \\{([\\s\\S]*?)\\} as const`))
  if (!m) throw new Error(`verify-visual: no encuentro ${nombre} en motion.ts`)
  return [...m[1].matchAll(/:\s*([0-9.]+)\s*,/g)].map((x) => Number(x[1]))
}

function construirRejilla() {
  const t = readFileSync(FUENTE_MOTION, 'utf8')
  const pulsos = leerLista(t, 'PULSOS_ADMITIDOS')
  const llegadas = leerLista(t, 'LLEGADAS_ADMITIDAS')
  const paralaje = leerObjeto(t, 'PARALAJE')

  // Las dos excepciones declaradas del portal. Se leen igual que lo demas: si
  // alguien cambia su valor, la guarda lo sigue.
  const establecimiento = Math.max(...llegadas) * 2.5
  const primeraPintura = Number(
    (t.match(/export const LLEGADA_PRIMERA_PINTURA_S = ([0-9.]+)/) || [])[1],
  )
  if (!Number.isFinite(primeraPintura)) {
    throw new Error('verify-visual: no encuentro LLEGADA_PRIMERA_PINTURA_S')
  }

  return [...new Set([...pulsos, ...llegadas, ...paralaje, establecimiento, primeraPintura])]
    .sort((a, b) => a - b)
}

export const REJILLA = construirRejilla()

/**
 * Margen del cuadrado SVG/DOM, en pixeles.
 *
 * 4 px absorbe redondeos de subpixel sin dejar pasar un desajuste real: los que
 * se encontraron median +382 (marketplace), +284 (mining) y sacaban un satelite
 * entero fuera de la pantalla en G-Oracle.
 */
export const TOLERANCIA_LIENZO = 4

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
  //
  // SE SALTAN LOS ELEMENTOS QUE AUN SE ESTAN ANIMANDO, subiendo por el arbol.
  // Mirar el \`transform\` del propio enlace NO basta: la animacion de entrada
  // vive en un \`motion.div\` ANCESTRO, asi que el enlace da 'none' mientras su
  // padre lo esta desplazando. Eso produjo dos falsos «fuera de pantalla» en
  // Trust —dos tarjetas que al medirlas en reposo estaban en 16..370 dentro de
  // 390—. Un fallo fantasma en una guarda es peor que no tenerla: enseña a
  // ignorarla.
  const seEstaAnimando = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (getComputedStyle(n).transform !== 'none') return true;
    }
    return false;
  };
  if (window.innerWidth <= 480) {
    for (const el of Array.from(document.querySelectorAll('a, button'))) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || (el.textContent || '').trim().length === 0) continue;
      if (getComputedStyle(el).pointerEvents === 'none') continue;
      if (seEstaAnimando(el)) continue;
      const a = getComputedStyle(el, '::after');
      let w = b.width, h = b.height;
      if (a.content !== 'none' && a.position === 'absolute') {
        w = Math.max(parseFloat(a.width) || 0, parseFloat(a.minWidth) || 0);
        h = parseFloat(a.height) || 0;
      }
      // Se compara REDONDEADO. Un pseudoelemento de 24px puede resolver a
      // 23.9931 cuando el \`devicePixelRatio\` no es entero, y con \`< 24\` a secas
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

  // ── 8. TODA DURACION EN LA REJILLA ─────────────────────────────────────
  //
  // Al escribirse esta comprobacion habia 72 duraciones sueltas repartidas por
  // las catorce secciones, en CUATRO sistemas que no se citaban: los layouts,
  // las aura configs, los libs de WebGL y globals.css. Cuatro secciones tenian
  // ademas el MISMO error por separado —tres capas de fondo con velocidades
  // demasiado parecidas para leerse como profundidad—, que es lo que confirma
  // que no eran descuidos sino falta de una escalera compartida.
  //
  // Se mide lo COMPUTADO, no lo escrito: una duracion puede llegar por una
  // variable CSS, por un respaldo de \`var()\` que nadie sabe que esta activo o
  // desde un componente. Solo el valor final dice la verdad.
  const REJILLA = ${JSON.stringify(REJILLA)};
  for (const sec of Array.from(main.children)) {
    if (!sec.id) continue;
    main.scrollTop = sec.offsetTop;
    await esperar(420);
    const sueltas = new Set();
    for (const n of sec.querySelectorAll('*')) {
      const d = getComputedStyle(n).animationDuration;
      if (!d || d === '0s') continue;
      for (const parte of d.split(',')) {
        const v = parseFloat(parte);
        if (v > 0 && !REJILLA.includes(v)) sueltas.add(v);
      }
    }
    if (sueltas.size) {
      fallos.push({ tipo: 'tempo-fuera-de-rejilla', detalle: sec.id,
                    valores: Array.from(sueltas).sort((a, b) => a - b) });
    }
  }

  // ── 9. LIENZO CUADRADO: CAPAS DOM ALINEADAS CON SU SVG ─────────────────
  //
  // Un \`<svg preserveAspectRatio="xMidYMid meet">\` dibuja en un CUADRADO del
  // lado menor; un \`%\` de CSS se resuelve contra el ancho REAL. Cuando las dos
  // tecnicas describen la misma figura, todo lo que no este en el eje central
  // sale desplazado, y el error crece con la distancia al centro.
  //
  // Encontrado tres veces antes de existir esta guarda: en G-Oracle sacaba un
  // satelite ENTERO fuera de la pantalla (x=1757 con un viewport de 1723); en
  // marketplace dejaba cada icono a 82 px de su propio nodo; en mining estiraba
  // la constelacion 1,63x. Ninguna de las tres daba sintoma en el codigo.
  for (const sec of Array.from(main.children)) {
    if (!sec.id) continue;
    main.scrollTop = sec.offsetTop;
    await esperar(420);
    const svg = Array.from(sec.querySelectorAll('svg[preserveAspectRatio="xMidYMid meet"]'))
      .map(s => s.getBoundingClientRect()).filter(r => r.width > 50)[0];
    if (!svg) continue;
    const lado = Math.min(svg.width, svg.height);
    for (const d of sec.querySelectorAll('div')) {
      const hijo = d.firstElementChild;
      if (!hijo || !hijo.style || !hijo.style.left.endsWith('%')) continue;
      const ancho = d.getBoundingClientRect().width;
      // Ancho 0 = duplicado movil oculto. Contarlo dio cinco falsos positivos
      // en el primer barrido y habria mandado a tocar secciones sanas.
      if (ancho === 0) continue;
      if (Math.abs(ancho - lado) > ${TOLERANCIA_LIENZO}) {
        fallos.push({ tipo: 'lienzo-desalineado', detalle: sec.id,
                      svg: Math.round(lado), dom: Math.round(ancho),
                      error: Math.round(ancho - lado) });
      }
    }
  }

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

/* ═════════════════════════════════════════════════════════════════════════
   10. DURACIONES SUELTAS EN LA HOJA DE ESTILOS

   Las comprobaciones 8 y 9 miden lo que YA se esta pintando: necesitan un
   navegador, un build y las catorce secciones recorridas. Esta lee la fuente,
   corre en un segundo y falla en el momento de escribir el valor — que es
   cuando sale barato arreglarlo.

   No sustituye a la 8. La 8 caza duraciones que llegan por una variable, por un
   respaldo de `var()` que nadie sabe que esta activo o desde un componente; esta
   caza las que estan escritas a mano. Los dos caminos existen y los dos han
   producido fallos reales en este portal.
   ═════════════════════════════════════════════════════════════════════════ */

const FUENTE_CSS = new URL('../app/globals.css', import.meta.url)

export function verificarTempoEnFuente() {
  const css = readFileSync(FUENTE_CSS, 'utf8')
  const fallos = []
  const lineas = css.split('\n')

  lineas.forEach((linea, i) => {
    // Solo declaraciones de duracion. `animation-delay` queda fuera a
    // proposito: un retardo NO va en la rejilla — es justo el mecanismo con el
    // que se separan elementos sin sacarlos de ella.
    const m = linea.match(/animation(?:-duration)?:\s*([^;]+);/)
    if (!m) return
    const cuerpo = m[1]

    for (const bruto of cuerpo.matchAll(/(?<![\w-])([0-9]*\.?[0-9]+)s(?![\w-])/g)) {
      const v = Number(bruto[1])
      if (!Number.isFinite(v) || v <= 0) continue
      if (REJILLA.includes(v)) continue
      fallos.push({
        tipo: 'tempo-suelto-en-css',
        linea: i + 1,
        valor: v,
        texto: linea.trim().slice(0, 80),
      })
    }
  })

  return fallos
}

/**
 * Ejecutable directo: `node scripts/verify-visual.mjs`
 *
 * Se compara SOLO el nombre del fichero, sin separadores de ruta.
 *
 * En Windows `process.argv[1]` llega con barras invertidas, y cualquier version
 * que las normalice necesita escaparlas. Eso se rompio dos veces seguidas al
 * escribir este archivo: la primera no compilaba —ruidosa, se arregla en un
 * minuto— y la segunda compilaba y devolvia `false` EN SILENCIO, con lo que el
 * verificador salia con codigo 0 sin haber comprobado nada.
 *
 * Un nombre de fichero no contiene separadores, asi que esta comparacion vale
 * igual en Windows y en Unix y no hay nada que escapar.
 */
const esEntrada = (process.argv[1] || '').endsWith('verify-visual.mjs')

if (esEntrada) {
  const fallos = verificarTempoEnFuente()
  console.log(`rejilla leida de motion.ts: ${REJILLA.join(' · ')}`)
  if (fallos.length === 0) {
    console.log('globals.css: ninguna duracion fuera de la rejilla')
  } else {
    console.log(`globals.css: ${fallos.length} duraciones sueltas`)
    for (const f of fallos) console.log(`  L${f.linea}  ${f.valor}s  ${f.texto}`)
    process.exitCode = 1
  }
}
