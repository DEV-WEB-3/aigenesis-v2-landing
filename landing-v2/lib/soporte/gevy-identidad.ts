/**
 * GEVY — MISIÓN, VISIÓN E IDENTIDAD.
 *
 * Se escribe ahora porque Gevy está a punto de lanzarse y todavía no se ha
 * publicado nada: es el momento exacto en que una marca se define, antes de que
 * la definan por acumulación de decisiones sueltas.
 *
 * LO QUE YA ESTABA DECIDIDO Y NO SE TOCA (07-ago-2026):
 *  · Gevy es marca HIJA de Genesis, no su reemplazo. El comprador trata con
 *    Gevy en la cabecera; Genesis avala al cierre.
 *  · Símbolo v7: arco superior, seis círculos que cierran la G por cierre
 *    gestáltico, once rayos, flecha fundida en la junta.
 *  · Paleta con significado por color, mapeada a las cuatro etapas del pedido.
 *  · Tipografía: Exo 2 para texto, JetBrains Mono para datos.
 *
 * LO QUE SE DECIDE AQUÍ es la capa narrativa: qué promete, a quién y con qué
 * palabras. Sin eso, cada pantalla y cada correo inventan su propio tono.
 *
 * Y UNA DECISIÓN DEL OWNER (19-ago-2026): Gevy es el marketplace ÚNICO y
 * SUCESOR. AIGMarket deja de ser un marketplace paralelo y pasa a ser una
 * herramienta o servicio dentro de Gevy, en desarrollo futuro. Esto importa
 * para el soporte: ante la duda «¿dónde compro?», la respuesta es Gevy, una
 * sola, sin matices.
 */

export const GEVY_IDENTIDAD = {
  /**
   * QUÉ HACE, en una frase que un desconocido entienda.
   *
   * Se evita «tienda del ecosistema»: describe la relación interna, no lo que
   * la persona obtiene. Y se evita «marketplace descentralizado», que promete
   * una arquitectura que no es la que hay.
   */
  queEs:
    'Gevy es la tienda de Genesis: un catálogo global con envío internacional donde se paga con AIG, con USDT o con tarjeta.',

  /**
   * MISIÓN — el trabajo de hoy.
   *
   * Está escrita alrededor de un verbo concreto —«convertir»— y de una tensión
   * real: un token que no cotiza en mercado abierto necesita sitios donde
   * signifique algo. Gevy es uno de esos sitios. Decirlo así es más honesto y
   * más útil que «democratizar el comercio».
   */
  mision:
    'Que lo que alguien tiene dentro del ecosistema sirva para comprar cosas reales, con la misma facilidad y las mismas garantías que en cualquier tienda a la que ya esté acostumbrado.',

  /**
   * VISIÓN — hacia dónde, sin fecha ni promesa numérica.
   *
   * A propósito no dice «ser el marketplace líder de Web3» ni pone cifras: una
   * visión con número es un objetivo comercial disfrazado, y envejece mal.
   */
  vision:
    'Que pagar con AIG deje de ser una decisión y pase a ser una opción más en la caja, indistinguible de pagar con tarjeta — y que la tienda se juzgue por el pedido que llega, no por la tecnología que lleva debajo.',

  /**
   * PARA QUIÉN, en orden de prioridad. El orden importa: cuando dos necesidades
   * chocan, gana la primera.
   */
  paraQuien: [
    'Quien ya participa en Genesis y quiere usar lo que tiene sin convertirlo antes.',
    'Quien llega por un producto concreto y no sabe —ni necesita saber— qué es una cadena de bloques.',
    'Quien enseña el proyecto a otros y necesita algo tangible que mostrar.',
  ],

  /**
   * PRINCIPIOS. Cada uno está redactado como una decisión que se puede tomar
   * mañana, no como un valor de póster. «Transparencia» no es un principio:
   * «el precio final se ve antes de pagar» sí, porque se puede cumplir o
   * incumplir.
   */
  principios: [
    {
      titulo: 'El precio que se ve es el que se paga',
      porque:
        'El envío internacional es donde las tiendas esconden el coste. Si aparece al final, el carrito se abandona — y con razón.',
    },
    {
      titulo: 'El estado del pedido se cuenta sin que haya que preguntarlo',
      porque:
        'Las cuatro etapas —pagado, enviado, en tránsito, entregado— tienen color propio y correo propio. Un pedido que no informa genera un ticket de soporte por cada día de silencio.',
    },
    {
      titulo: 'No se nombra al proveedor',
      porque:
        'Quien compra trata con Gevy. Nombrar a quien surte no aporta confianza: la reparte, y deja al comprador sin saber a quién reclamar.',
    },
    {
      titulo: 'Si no se puede enviar a un país, no se ofrece allí',
      porque:
        'Un catálogo que enseña lo que no puede entregar convierte una venta en una devolución y a un cliente nuevo en uno perdido.',
    },
    {
      titulo: 'Nada en la tienda promete un resultado económico',
      porque:
        'Es una tienda. Vende objetos. El día que el lenguaje de la tienda hable de rendimiento, deja de ser una tienda a ojos de un regulador.',
    },
  ],

  /**
   * EL NOMBRE. No se explica en el sitio público —una marca que necesita
   * explicarse ya perdió— pero el equipo debe saberlo para no «corregirlo».
   */
  nombre: {
    comoSeLee:
      'En español la «ge» antes de «e» suena como jota: se lee «jevi».',
    porQueImporta:
      'En República Dominicana «jevi» significa buenísimo, top. En el mercado principal del proyecto el nombre ya es un elogio antes de significar nada. Eso se explota, no se corrige.',
  },

  /**
   * RELACIÓN CON GENESIS Y CON AIGMARKET.
   *
   * Es la parte que más consultas de soporte va a generar, así que se escribe
   * explícita: quién es quién y qué pasó con lo anterior.
   */
  relaciones: {
    conGenesis:
      'Gevy es marca hija. El comprador ve Gevy en la cabecera y «Un marketplace de GENESIS» al cierre. La cuenta es la misma de Genesis: no hay que registrarse otra vez.',
    conAigmarket:
      'Gevy sucede a AIGMarket como marketplace único del ecosistema. AIGMarket pasa a ser una herramienta o servicio dentro de Gevy, en desarrollo futuro. Para quien compra hoy, el sitio es Gevy y no hay que elegir entre dos.',
  },

  /**
   * CÓMO SUENA. Tres pares de ejemplo, que enseñan más que cualquier adjetivo.
   */
  tono: {
    principio:
      'Se habla como una tienda que sabe de tecnología, no como un proyecto de tecnología que además vende.',
    ejemplos: [
      { mal: 'Adquiere productos premium con nuestra tecnología blockchain de vanguardia.', bien: 'Elige, paga con AIG o con tarjeta, y te llega a casa.' },
      { mal: 'Tu pedido ha sido procesado exitosamente por el sistema.', bien: 'Pagado. Te avisamos en cuanto salga del almacén.' },
      { mal: 'Experimenta el futuro del comercio descentralizado.', bien: 'Catálogo global, envío internacional, tres formas de pagar.' },
    ],
  },

  /**
   * LAS CUATRO ETAPAS. El color no se eligió por gusto: cada uno ya significaba
   * eso en el libro de marca de Genesis, y la etapa hereda el significado.
   */
  etapasDelPedido: [
    { etapa: 'Pagado', color: 'Cian a turquesa', significado: 'claridad, expansión, futuro' },
    { etapa: 'Enviado', color: 'Azul eléctrico', significado: 'tecnología, precisión, enfoque' },
    { etapa: 'En tránsito', color: 'Púrpura a violeta', significado: 'sofisticación, profundidad' },
    { etapa: 'Entregado', color: 'Magenta a fucsia', significado: 'energía, impulso, transformación' },
  ],
} as const
