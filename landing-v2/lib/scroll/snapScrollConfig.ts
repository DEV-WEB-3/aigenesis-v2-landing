/** Phase 18.1 — Smooth snap scroll tuning */

export const SNAP_SCROLL = {
  /** Wheel / trackpad delta to trigger one section (~40% lower vs ~90 baseline) */
  SCROLL_THRESHOLD: 55,
  /** Bloqueo al ARRANCAR el salto. Lo cubre casi entero `scrollAnimatingRef`. */
  WHEEL_LOCK_MS: 750,
  /**
   * COLA DE BLOQUEO al terminar el salto.
   *
   * Antes se re-armaban aqui los mismos 750 ms, que se sumaban a los 950 del
   * desplazamiento: 1700 ms en los que cada tick se descartaba EN SILENCIO. Un
   * segundo tick deliberado —lo normal es a los 300-600 ms— no hacia nada y el
   * usuario volvia a girar la rueda.
   *
   * 250 ms bastan para lo unico que este bloqueo tiene que atrapar: la cola de
   * una pasada de trackpad, que sigue emitiendo eventos decrecientes despues de
   * levantar los dedos. Un gesto nuevo nunca llega tan pegado al anterior.
   */
  WHEEL_LOCK_TAIL_MS: 250,
  /** Premium slide duration */
  SCROLL_DURATION_MS: 950,
  /**
   * Ventana de acumulacion.
   *
   * Eran 140 ms. Con una rueda cuyo tope emite menos que el umbral —las de alta
   * resolucion mandan 16-40 por muesca— hacian falta DOS muescas en menos de
   * 140 ms, que no es un gesto natural: girando a ritmo normal el acumulador se
   * vaciaba entre una y otra y no se llegaba nunca. 400 ms cubre el ritmo real
   * de una rueda y sigue siendo demasiado corto para que una deriva lenta de
   * trackpad acumule sin querer.
   */
  TRACKPAD_ACCUM_WINDOW_MS: 400,
  /**
   * Cuanto puede sobrar una seccion antes de considerarla «alta».
   *
   * Era 2 px, y con eso LAS CATORCE secciones se consideraban altas: el hueco
   * visible son 539 px y todas lo exceden, de +39 en roadmap a +252 en booster.
   * Con las catorce en esa rama, la rueda cedia SIEMPRE al scroll nativo y no
   * saltaba nunca al primer tick.
   *
   * 48 px es lo que puede sobrar sin que haya nada que leer ahi —relleno,
   * redondeos, el margen del enganche—. Por debajo de eso la seccion salta
   * directamente; por encima, se recorre primero, que es lo correcto cuando de
   * verdad hay contenido debajo.
   */
  HOLGURA_ALTO: 48,
  /**
   * Hueco minimo entre eventos de rueda para considerarlo un GESTO NUEVO.
   *
   * Solo lo que supera este hueco se ENCOLA mientras el portal se esta moviendo.
   * Separa dos cosas que hay que tratar distinto: la cola de inercia de un
   * trackpad —un chorro continuo cada ~16 ms— y un segundo gesto deliberado.
   *
   * Estuvo en 120 ms y era DEMASIADO PERMISIVO. Un giro rapido de rueda tiene
   * las muescas a unos 140 ms, asi que cada muesca del MISMO gesto contaba como
   * un gesto nuevo y se encolaba: medido, tres muescas seguidas producian DOS
   * saltos de seccion. Desde fuera se lee como un scroll hipersensible que
   * «brinca mas de la cuenta».
   *
   * 320 ms es la frontera util: por debajo esta el ritmo de una misma vuelta de
   * rueda, y por encima esta la pausa que separa dos intenciones. Un segundo
   * giro deliberado llega a los 400-600 ms y sigue encolandose, que es lo que
   * este mecanismo vino a resolver.
   */
  GESTO_NUEVO_MS: 320,
  /** Max sections per gesture */
  MAX_STEP: 1,
  /**
   * Lo que tapa la barra fija, en pixeles.
   *
   * Tiene que coincidir con `--enganche-alto` de `globals.css`. Se repite aqui
   * porque JavaScript no lee variables CSS sin un `getComputedStyle` por evento
   * de rueda, y eso es un reflujo forzado en el peor sitio posible. Si se mueve
   * una, hay que mover la otra — por eso el nombre es el mismo.
   */
  ENGANCHE_ALTO: 76,
} as const

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}
