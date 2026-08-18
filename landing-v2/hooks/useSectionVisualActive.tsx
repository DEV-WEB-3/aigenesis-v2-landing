'use client'

import { createContext, useContext } from 'react'

const SectionVisualContext = createContext<boolean | null>(null)

export function SectionVisualProvider({
  visualActive,
  children,
}: {
  visualActive: boolean
  children: React.ReactNode
}) {
  return (
    <SectionVisualContext.Provider value={visualActive}>
      {children}
    </SectionVisualContext.Provider>
  )
}

/**
 * SI UN VISUAL SE CIERRA CON `isActive`, DESAPARECE ESTANDO A LA VISTA.
 *
 * Este hook devuelve `entered || isActive` —el gate PEGAJOSO: una vez que la
 * seccion ha entrado en pantalla, se queda—. Usar el prop `isActive` a secas no
 * es equivalente y no es una diferencia menor.
 *
 * QUE PASABA, y esta reportado con captura: en la seccion Tecnologia la mitad
 * derecha aparecia COMPLETAMENTE VACIA mientras el texto se leia perfecto.
 * `TechnologyGenesisStack` hacia `if (!isActive) return null`, e `isActive` solo
 * es cierto para el UNICO indice que el snap considera activo en ese instante.
 * Bajando, hay momentos en que la seccion ocupa la pantalla y el indice activo
 * todavia es la anterior —o se ha desincronizado, que ya paso y esta
 * documentado en `useSnapScroll`—. En esos momentos el visual no existe.
 *
 * Es un fallo dificil de ver desde dentro: saltando directo a la seccion con un
 * ancla el indice SI coincide y todo se pinta. Solo aparece deslizando.
 *
 * ALCANCE, medido con una busqueda sobre los catorce: lo tenian cinco visuales
 * —technology, goracle, trust x2 y el portal del cta— y los diez fondos de
 * seccion, que ademas recibian `visible={isActive}` desde su escena. Los otros
 * nueve visuales ya usaban este hook. Los fondos ya no aceptan el prop: la
 * unica fuente es el contexto, para que no se pueda volver a pasar el valor
 * crudo desde fuera.
 *
 * El parametro sigue existiendo como respaldo para un uso FUERA del proveedor.
 * Dentro de una seccion —que es donde viven todos— manda el contexto.
 */
export function useSectionVisualActive(fallbackIsActive: boolean): boolean {
  const ctx = useContext(SectionVisualContext)
  return ctx ?? fallbackIsActive
}
