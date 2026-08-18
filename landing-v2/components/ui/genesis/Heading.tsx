'use client'

/**
 * Encabezado semántico con nivel DERIVADO, no escrito.
 *
 * EL PROBLEMA QUE RESUELVE
 * ------------------------
 * El nivel de un encabezado no es una decisión de estilo: es la estructura del
 * documento. Un lector de pantalla navega por ella, y saltarse un nivel rompe el
 * mapa de la página igual que faltaría un capítulo en un índice.
 *
 * Pero si cada componente escribe su propio `<h3>` o `<h4>` a mano, el nivel
 * deja de describir la estructura y pasa a describir el tamaño de letra que le
 * pareció bien a quien lo escribió. Aquí pasaba exactamente eso:
 *
 *   Card.tsx ......... <h3>
 *   TrustBadge.tsx ... <h4>
 *
 * Las dos son tarjetas al mismo nivel, bajo la misma `<h2>` de sección. El
 * resultado en pantalla era H2 → H4 → H4 → H4 → H3, que Lighthouse marca como
 * jerarquía rota. Y no era un descuido: cada componente se escribió por
 * separado, sin forma de saber en qué nivel iba a acabar.
 *
 * LA SOLUCIÓN
 * -----------
 * El nivel viaja por contexto. Un componente no elige su nivel: hereda el de su
 * sitio en el árbol. Envolver contenido en `<HeadingLevel>` baja un escalón.
 *
 *   <Heading>            → h1   (raíz de la página)
 *   <HeadingLevel>
 *     <Heading>          → h2   (sección)
 *     <HeadingLevel>
 *       <Heading>        → h3   (tarjeta dentro de la sección)
 *
 * Con esto un salto de nivel deja de ser posible por construcción: para llegar a
 * h4 hay que estar de verdad tres niveles dentro.
 */
import { createContext, useContext, type ReactNode, type HTMLAttributes } from 'react'

type Nivel = 1 | 2 | 3 | 4 | 5 | 6

const NivelCtx = createContext<Nivel>(1)

/** Baja un escalón para todo lo que quede dentro. */
export function HeadingLevel({ children }: { children: ReactNode }) {
  const actual = useContext(NivelCtx)
  const siguiente = Math.min(actual + 1, 6) as Nivel
  return <NivelCtx.Provider value={siguiente}>{children}</NivelCtx.Provider>
}

/** El nivel en el que estamos. Útil para depurar o para decidir tamaños. */
export function useHeadingLevel(): Nivel {
  return useContext(NivelCtx)
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  /**
   * Fuerza un nivel concreto. ESCAPE, no atajo: sólo para casos donde la
   * estructura real no coincide con el anidamiento del JSX. Si se usa "porque
   * queda mejor de tamaño", el problema es el tamaño y se arregla con clases.
   */
  levelOverride?: Nivel
}

export function Heading({ children, levelOverride, ...rest }: HeadingProps) {
  // El hook va SIEMPRE antes del override: `levelOverride ?? useContext(...)`
  // sólo lo llamaría cuando no hay override, y un hook condicional rompe el
  // orden de hooks entre renders.
  const heredado = useContext(NivelCtx)
  const nivel = levelOverride ?? heredado
  const Tag = `h${nivel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <Tag {...rest}>{children}</Tag>
}
