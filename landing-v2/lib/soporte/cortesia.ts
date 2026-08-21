/*
 * CORTESÍA DETERMINISTA — E1 de la ruta unificada (GO del auditor, 20-ago-2026).
 *
 * El problema que resuelve: «hola buenas tardes» caía en `derivar` — el filtro
 * de palabras vacías dejaba cero términos y el buscador, con razón, se
 * callaba. Pero un asistente que responde a un saludo con «no he entendido tu
 * pregunta» es descortés por diseño.
 *
 * La regla: cortesía es SALUDO SIN CONTENIDO. Si además del saludo hay
 * cualquier término con sustancia («hola, mi hold…»), esto devuelve null y el
 * retrieval manda, exactamente como hoy. Por eso la clasificación se hace
 * sobre lo que SOBRA después de quitar el léxico de cortesía: si sobra algo
 * con contenido, no era un saludo — era una pregunta que empezaba con uno.
 *
 * Este módulo no importa nada (ni de `buscar`): recibe el texto YA
 * normalizado (sin acentos, minúsculas) para no crear un ciclo de imports.
 */

export type ClaseDeCortesia = 'saludo' | 'agradecimiento' | 'despedida' | 'bienestar'

/*
 * El orden importa: «muchas gracias, hasta luego» debe cerrar con la
 * despedida, no repetir el «de nada». Se clasifica por la ÚLTIMA intención
 * del mensaje: despedida > agradecimiento > bienestar > saludo.
 */
const LEXICO: readonly [ClaseDeCortesia, RegExp][] = [
  ['despedida', /\b(adios|hasta (luego|pronto|manana)|chao|chau|bye|nos vemos|me despido|feliz (dia|noche|tarde))\b/],
  ['agradecimiento', /\b(gracias|thank(s| you)?|se agradece|muy amable|agradecido|agradecida)\b/],
  ['bienestar', /\b(como (estas|andas|va|te va|has estado)|todo bien|que tal (estas|andas))\b/],
  /* Las alternativas LARGAS van primero: si «buenas» se prueba antes que
     «buenas tardes», el regex se come la mitad y deja «tardes» como sobrante
     — y el saludo entero se clasifica como no-cortesía. */
  ['saludo', /\b(buenos dias|buenas (tardes|noches)|buen (dia|dias)|holaa+|hola|buenas|hey|saludos|hello|hi|que tal)\b/],
]

/* Relleno que puede acompañar un saludo sin convertirlo en pregunta. */
const RELLENO = new Set([
  'muy', 'mucho', 'muchas', 'muchos', 'bien', 'todo', 'todos', 'igualmente',
  'amigo', 'amiga', 'equipo', 'genesis', 'asistente', 'don', 'sr', 'sra',
  'que', 'como', 'por', 'aqui', 'alli', 'estoy', 'soy', 'les', 'los', 'las',
  'una', 'uno', 'con', 'sin', 'para', 'del', 'este', 'esta', 'esto', 'ok',
  'dia', 'dias', 'tardes', 'noches', 'tarde', 'noche',
])

/**
 * @param textoNormalizado salida de `normalizar()` de `buscar.ts`:
 *   minúsculas, sin acentos ni signos.
 */
export function clasificarCortesia(textoNormalizado: string): ClaseDeCortesia | null {
  const texto = ` ${textoNormalizado} `
  let clase: ClaseDeCortesia | null = null
  let sobrante = texto
  for (const [c, patron] of LEXICO) {
    const global = new RegExp(patron.source, 'g')
    if (patron.test(sobrante)) {
      clase = clase ?? c
      sobrante = sobrante.replace(global, ' ')
    }
  }
  if (!clase) return null
  /* Si lo que sobra tiene contenido, era una pregunta con saludo — no cortesía. */
  const resto = sobrante.split(/\s+/).filter((t) => t.length > 2 && !RELLENO.has(t))
  return resto.length === 0 ? clase : null
}

/*
 * Las respuestas: cortas, cálidas y sin prometer nada — pasan por la misma
 * guarda de lenguaje que el resto del material de soporte.
 */
export const RESPUESTAS_DE_CORTESIA: Readonly<Record<ClaseDeCortesia, string>> = {
  saludo:
    '¡Hola! Un gusto saludarte. Cuéntame en qué te ayudo — puedo responder sobre tu cuenta, el hold, los reclamos, el P2P o la tienda.',
  bienestar:
    '¡Todo en orden por aquí — gracias por preguntar! ¿En qué te puedo ayudar hoy?',
  agradecimiento:
    'Con gusto, para eso estoy. Si surge otra duda, aquí me tienes.',
  despedida:
    'Hasta pronto — que te vaya muy bien. Cuando necesites algo del ecosistema, aquí estaré.',
}
