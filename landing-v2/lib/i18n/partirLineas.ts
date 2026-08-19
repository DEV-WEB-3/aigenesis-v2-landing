/**
 * PARTIR UNA FRASE EN LINEAS EQUILIBRADAS.
 *
 * Existe por una sola razon: en SVG el texto NO envuelve. Un `<text>` es una
 * linea y punto — no hay ancho maximo que valga—, asi que el corte hay que
 * decidirlo antes de pintar.
 *
 * Antes ese corte estaba escrito a mano en los datos, y eso era una decision
 * tomada sobre el español. Al traducir deja de valer: la frase alemana es un
 * 30 % mas larga, la rusa parte por otro sitio y la arabe se lee al reves. Un
 * salto de linea fijo no es tipografia en cuanto hay mas de un idioma: es un
 * defecto que solo se ve en los idiomas que nadie revisa.
 *
 * SE EQUILIBRA POR LONGITUD, no se llena la primera linea hasta el borde.
 * Llenar y desbordar produce una linea larga y un rabito de dos palabras, que
 * es justo lo que se ve mal en un rotulo corto. Buscando el corte que minimiza
 * la diferencia entre las dos mitades salen dos lineas parecidas, que es lo que
 * hacia el corte a mano cuando estaba bien puesto.
 *
 * No sabe de anchos reales de glifo y no le hace falta: no esta ajustando una
 * caja, esta repartiendo una frase corta en dos renglones.
 */
export function partirEnLineas(texto: string, lineas = 2): string[] {
  const palabras = texto.trim().split(/\s+/)
  if (lineas <= 1 || palabras.length <= lineas) return [texto.trim()]

  /* Reparto goloso por objetivo de longitud, y luego se afina el corte. */
  const total = texto.length
  const objetivo = total / lineas
  const salida: string[] = []
  let resto = palabras.slice()

  for (let l = 0; l < lineas - 1; l++) {
    const quedan = lineas - l
    const meta = resto.join(' ').length / quedan
    let mejor = 1
    let mejorCoste = Infinity
    for (let corte = 1; corte < resto.length - (quedan - 2); corte++) {
      const coste = Math.abs(resto.slice(0, corte).join(' ').length - meta)
      if (coste < mejorCoste) {
        mejorCoste = coste
        mejor = corte
      }
    }
    salida.push(resto.slice(0, mejor).join(' '))
    resto = resto.slice(mejor)
  }
  salida.push(resto.join(' '))
  void objetivo
  return salida
}
