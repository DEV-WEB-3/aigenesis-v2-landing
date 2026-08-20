/**
 * LO QUE EL SOPORTE NO PUEDE DECIR — y por qué es una guarda y no una nota.
 *
 * Este material lo va a leer gente que está decidiendo si pone dinero. Una
 * frase como «rentabilidad del 8 %» o «inversión garantizada» no es una torpeza
 * de estilo: en muchas jurisdicciones convierte lo que se ofrece en un producto
 * financiero regulado, y a quien lo escribió en responsable de una promesa.
 *
 * El propio sitio ya tiene esa disciplina —Booster dice «no es un esquema de
 * captación», la landing cambió «bono directo» por «acelerador»— pero una
 * disciplina que vive en la cabeza de quien escribe se pierde en cuanto escribe
 * otro. Por eso está aquí en forma de lista, y por eso `npm run verify:lenguaje`
 * falla si alguna de estas palabras entra en el material de soporte.
 *
 * NO ES CENSURA DE PALABRAS SUELTAS. Es que cada término prohibido tiene un
 * sustituto que dice lo mismo SIN prometer: no se trata de esconder cómo
 * funciona el producto, sino de describirlo sin garantizar un resultado que
 * nadie puede garantizar.
 */

export interface TerminoVetado {
  /** Lo que no se escribe. Se compara sin distinguir mayúsculas ni acentos. */
  patron: RegExp
  /** Qué problema causa. Va en el mensaje de error de la guarda. */
  motivo: string
  /** Qué escribir en su lugar. Sin esto, la regla sólo sabe prohibir. */
  enSuLugar: string
}

export const TERMINOS_VETADOS: readonly TerminoVetado[] = [
  {
    patron: /\brentabilidad(es)?\b/i,
    motivo: 'Anuncia un resultado económico. Nadie puede garantizarlo.',
    enSuLugar: '«participación», «asignación» o describir el mecanismo sin cifrar el resultado',
  },
  {
    patron: /\bganancias?\s+(garantizad|asegurad|fij)/i,
    motivo: 'Promesa explícita de beneficio.',
    enSuLugar: 'describir qué hace el protocolo, no qué recibirá quien participe',
  },
  {
    patron: /\b(retorno|rendimiento)\s+(garantizad|asegurad|fij|mensual|anual)/i,
    motivo: 'Compromete un resultado periódico.',
    enSuLugar: '«las reglas de asignación están publicadas» y enlazar a ellas',
  },
  {
    patron: /\bAPY\b|\bAPR\b/i,
    motivo: 'Son métricas de producto financiero. Su sola presencia lo enmarca como tal.',
    enSuLugar: 'explicar el mecanismo con sus condiciones, sin anualizar nada',
  },
  {
    patron: /\bintere(s|ses)\b(?!\s+(en|por|de)\b)/i,
    motivo: 'Interés implica préstamo remunerado.',
    enSuLugar: '«recompensa por participación», si eso es lo que ocurre',
  },
  {
    patron: /\binvertir\b|\binversi(ón|ones)\b|\binversor/i,
    motivo: 'Sitúa la operación como inversión regulada y a la persona como inversor.',
    enSuLugar: '«participar», «adquirir», «quien participa»',
  },
  {
    patron: /\bdoblar|duplicar(á|as|ás)?\s+(tu|su|el)\s+(dinero|capital|saldo)/i,
    motivo: 'Promesa de multiplicación de capital. Es la frase de un fraude.',
    enSuLugar: 'nada: no hay forma honesta de decir esto',
  },
  {
    patron: /\bsin\s+riesgos?\b|\briesgo\s+cero\b|\b100\s*%\s+segur/i,
    motivo: 'Falso en cualquier activo digital, y la propia página legal dice lo contrario.',
    enSuLugar: 'nombrar los riesgos reales, como ya hace /legal',
  },
  {
    patron: /\bpasiv[oa]s?\s+(ingreso|renta)|ingresos?\s+pasiv/i,
    motivo: 'Vocabulario de esquema de captación. El sitio se distancia de eso a propósito.',
    enSuLugar: 'describir qué actividad genera qué, y bajo qué condiciones',
  },
  {
    patron: /\bbono\s+(directo|binario)\b|\bred\s+binaria\b/i,
    motivo:
      'Vocabulario estándar de plan de compensación multinivel. El owner lo retiró del sitio en agosto de 2026 precisamente porque contradice el descargo de Booster.',
    enSuLugar: '«acelerador directo» y «acelerador de red»',
  },
  {
    patron: /\bprecio\s+de\s+AIG\b|\bcotiza(ción|ndo)\b/i,
    motivo:
      'AIG NO cotiza: no hay pool público de liquidez. Hablar de precio o cotización afirma algo falso y comprobable.',
    enSuLugar: '«valor interno de referencia», diciendo que no es precio de mercado',
  },
  {
    /*
     * NO PROMETER ACTIVACIÓN. Regla pedida por el auditor para el corpus de
     * S2, y con una historia detrás que explica por qué es de lenguaje y no
     * de procedimiento.
     *
     * El caso que la motiva: la transacción se confirma en cadena y el
     * registro en el servidor falla. El dinero YA salió, pero el pack, el
     * reclamo o la forja no están activos, y activarlos requiere que un
     * humano cruce cadena y cuenta — nunca es automático desde el chat, y la
     * nota de reconciliación del portal lo prohíbe expresamente.
     *
     * Si una respuesta dice «se activará en unos minutos» o «tu pack quedará
     * activado», la persona espera, no pasa nada, y vuelve enfadada — o peor:
     * repite la compra creyendo que la primera se perdió. La rúbrica del
     * propio producto ya lo vigila en los guiones («no prometer activación
     * instantánea sin verificación»); esta regla lo extiende a TODO el corpus.
     */
    patron: /\b(se\s+activar[áa]|quedar[áa]\s+activad|activaci[óo]n\s+(inmediata|instant[áa]nea|autom[áa]tica\s+del\s+pack))/i,
    motivo:
      'Promete una activación que requiere verificación humana de cadena y cuenta. Quien la lee espera, no llega, y repite la compra — que es el peor desenlace posible.',
    enSuLugar:
      'decir qué verifica el equipo y con qué datos: «un operador cruzará el hash con tu cuenta; no repitas la operación»',
  },
]

/**
 * Comprueba un texto. Devuelve los problemas encontrados, vacío si está limpio.
 *
 * Se exporta además de usarse en la guarda para que cualquier pantalla que un
 * día acepte texto de soporte pueda validarlo antes de publicarlo.
 */
export function revisarLenguaje(texto: string): { termino: string; motivo: string; enSuLugar: string }[] {
  const hallazgos: { termino: string; motivo: string; enSuLugar: string }[] = []
  for (const t of TERMINOS_VETADOS) {
    const m = texto.match(t.patron)
    if (m) hallazgos.push({ termino: m[0], motivo: t.motivo, enSuLugar: t.enSuLugar })
  }
  return hallazgos
}

/**
 * LO QUE SÍ SE PUEDE AFIRMAR, porque es comprobable.
 *
 * La otra mitad de la disciplina: no basta con prohibir. Quien escribe soporte
 * necesita saber qué SÍ puede decir sin pedir permiso, y todo esto se verifica
 * en cadena o en el propio sitio.
 */
export const HECHOS_COMPROBABLES = [
  'AIG es un token BEP-20 sobre BNB Smart Chain.',
  'El contrato es 0xC1F0768587Dc889e494C171B155C60B4e9a13F08 y es público en BscScan.',
  'El suministro total es de 111.000.000 AIG.',
  'No existen mecanismos de emisión ni de quema en el contrato.',
  'AIG no tiene pool público de liquidez: no se negocia en mercado abierto.',
  'El registro en el ecosistema es solo por invitación: hace falta el enlace de un patrocinador.',
  'La cuenta de Genesis es la misma para todos los productos del ecosistema.',
] as const
