/**
 * ESTRUCTURA DEL MATERIAL DE SOPORTE.
 *
 * Un solo juego de datos alimenta tres cosas: la página de preguntas
 * frecuentes, el buscador y el asistente. Si cada uno tuviera su copia, el día
 * que cambie una respuesta cambiarían dos y la tercera diría otra cosa —
 * exactamente el problema que ya apareció esta semana con el diccionario y con
 * las cabeceras.
 *
 * CADA RESPUESTA DECLARA DE DÓNDE SALE (`fuente`). No es burocracia: este
 * material describe un producto donde la gente pone dinero, y una respuesta sin
 * origen es una respuesta que nadie puede comprobar ni actualizar. Los tres
 * orígenes posibles están ordenados por autoridad:
 *
 *   'landing'    — lo dice la web pública. Es la fuente PRIORITARIA: si algo
 *                  la contradice, gana la landing (decisión del owner).
 *   'owner'      — lo confirmó el owner. Manda sobre el código cuando hablan
 *                  de política («la wallet no se cambia»), porque una regla
 *                  vive en la decisión, no en el programa.
 *   'codigo'     — leído en el paquete que se ejecuta en el navegador del
 *                  usuario. Es la autoridad sobre COMPORTAMIENTO: describe lo
 *                  que la aplicación hace, no lo que se pretendía que hiciera.
 *   'producto'   — verificado usando la aplicación real, con fecha.
 *   'porDefinir' — falta confirmarlo con el equipo. Se marca y NO se inventa:
 *                  el asistente dirá que no lo sabe y derivará a un humano.
 *
 * LOS DOS ÚLTIMOS SE APRENDIERON FALLANDO. Escribí que el registro no manda
 * código por correo porque no encontré rastro en el paquete de la SPA — pero
 * el alta no ocurre en la SPA, así que buscaba donde la cosa no estaba. Leer
 * código prueba mucho sobre la pantalla que leíste y NADA sobre las demás.
 */

export type Fuente = 'landing' | 'owner' | 'codigo' | 'producto' | 'porDefinir'

export type Proyecto = 'genesis' | 'gpulse' | 'gevy' | 'ecosistema'

/**
 * LAS CATEGORÍAS DEL MOTOR DE INCIDENCIAS DEL PORTAL.
 *
 * No las invento aquí: son los tipos que el producto ya declara en
 * `supportIncident.js` —`mining_post_failed`, `booster_post_failed`,
 * `claim_failed`, `staking_failed`, `p2p_order_failed`— más los tres flujos
 * que hoy no tienen guion y esperan en S2: depósito, retiro y bridge.
 *
 * POR QUÉ ETIQUETAR LA FAQ CON EL VOCABULARIO DEL MOTOR, y no con el mío:
 * porque este material tiene que poder acoplarse al centro de ayuda sin un
 * traductor en medio. Cuando alguien abre una incidencia de tipo `claim`, el
 * asistente debe poder ofrecerle las preguntas de esa misma categoría sin que
 * nadie mantenga una tabla de equivalencias — que es justo la clase de tabla
 * que se desincroniza y nadie revisa.
 *
 * `null` es una respuesta legítima y frecuente: acceso, credenciales o
 * identidad de marca no pertenecen a ninguna incidencia de dinero.
 */
export type CategoriaIncidencia =
  | 'deposito'
  | 'retiro'
  | 'bridge'
  | 'p2p'
  | 'mining'
  | 'booster'
  | 'claim'

export interface Pregunta {
  /** Identificador estable. No se cambia aunque se reescriba la pregunta: es lo que enlaza. */
  id: string
  proyecto: Proyecto
  /** Categoría visible, en español. */
  categoria: string
  pregunta: string
  respuesta: string
  /**
   * Otras formas de preguntar lo mismo. Es lo que hace que el buscador
   * encuentre la respuesta cuando el usuario no usa nuestras palabras — y casi
   * nunca las usa: nadie escribe «acelerador de red», escriben «cuánto gano
   * por invitar».
   */
  sinonimos?: readonly string[]
  fuente: Fuente
  /**
   * A qué incidencia del portal pertenece, si es que pertenece a alguna.
   * Ausente = pregunta general, sin flujo de dinero detrás.
   */
  categoriaIncidencia?: CategoriaIncidencia
  /** Enlace a la prueba o al sitio donde se hace. */
  enlace?: string
}

export interface Paso {
  titulo: string
  detalle: string
  /** Lo que suele salir mal AQUÍ. Un paso sin su trampa es media instrucción. */
  siFalla?: string
}

export interface Recorrido {
  id: string
  proyecto: Proyecto
  titulo: string
  /** Para quién es y qué consigue. Si no se puede escribir, el recorrido sobra. */
  objetivo: string
  /** Qué hace falta ANTES de empezar. El primer motivo de abandono es llegar sin esto. */
  requisitos: readonly string[]
  pasos: readonly Paso[]
  fuente: Fuente
  /**
   * Hasta dónde se ha verificado de verdad. Se escribe aunque incomode: un
   * recorrido «documentado» que nadie recorrió entero es una guía que falla
   * justo cuando alguien la sigue.
   */
  verificadoHasta?: string
}
