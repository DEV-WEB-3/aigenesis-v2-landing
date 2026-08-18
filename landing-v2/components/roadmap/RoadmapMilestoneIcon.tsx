import type { RoadmapMilestoneId } from '@/lib/roadmap/evolutionPathLayout'

/**
 * EL ICONO DE CADA HITO — uno por producto, no una viñeta genérica.
 *
 * Todos dibujan en una caja de 24 y sólo con TRAZO, en `currentColor`, así que
 * cada nodo hereda el color de su tramo de la senda sin repetir la paleta.
 *
 * `fill="none"` va en la raíz Y no se omite en ninguna forma cerrada. El
 * defecto de `fill` en SVG es NEGRO y se hereda: una forma sin regla no queda
 * invisible, queda como una mancha opaca sobre el nodo. Ya pasó en este portal.
 */
const PATHS: Record<RoadmapMilestoneId, React.ReactNode> = {
  // Lanzamiento — cohete
  launch: (
    <>
      <path d="M12 3c2.6 2.2 4 5.3 4 8.6 0 2-.5 3.4-1.3 4.6H9.3C8.5 15 8 13.6 8 11.6 8 8.3 9.4 5.2 12 3Z" />
      <path d="M9.3 16.2 8 20l2.6-1.4h2.8L16 20l-1.3-3.8" />
      <path d="M8.2 12 5.5 13.9M15.8 12l2.7 1.9" />
      <circle cx="12" cy="10" r="1.5" />
    </>
  ),
  // G11 Community — un grupo
  community: (
    <>
      <circle cx="9" cy="9" r="2.6" />
      <path d="M4 19c0-2.6 2.2-4.4 5-4.4s5 1.8 5 4.4" />
      <circle cx="16.4" cy="10.4" r="2" />
      <path d="M15 14.8c2.6.1 4.6 1.8 4.6 4.2" />
    </>
  ),
  // Oracle — diana concéntrica: el centro que interpreta
  oracle: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.3" />
      <path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20" />
    </>
  ),
  // Cinema Runtime — bobina de película
  cinema: (
    <>
      <rect x="3.4" y="5.4" width="17.2" height="13.2" rx="2" />
      <path d="M8 5.4v13.2M16 5.4v13.2" />
      <path d="M3.4 12h4.6M16 12h4.6" />
      <path d="M5.6 8.2h.01M5.6 15.8h.01M18.4 8.2h.01M18.4 15.8h.01" strokeLinecap="round" />
    </>
  ),
  // Gevy Shop — bolsa de compra
  marketplace: (
    <>
      <path d="M5.4 8h13.2l-1.1 11.2a1.6 1.6 0 0 1-1.6 1.4H8.1a1.6 1.6 0 0 1-1.6-1.4L5.4 8Z" />
      <path d="M9 8V6.4a3 3 0 0 1 6 0V8" />
    </>
  ),
  // AiCard — tarjeta
  aicard: (
    <>
      <rect x="3" y="6.2" width="18" height="11.6" rx="2" />
      <path d="M3 10.4h18" />
      <path d="M6.6 14.6h3.4" strokeLinecap="round" />
    </>
  ),
  // Genesis Metaverse — cubo isométrico
  metaverse: (
    <>
      <path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6l8-4.4Z" />
      <path d="M12 3.2v8.8M12 12 4 7.6M12 12l8-4.4" />
    </>
  ),
}

interface Props {
  id: RoadmapMilestoneId
  /** Lado del icono en unidades del lienzo de la senda. */
  size: number
  x: number
  y: number
}

export default function RoadmapMilestoneIcon({ id, size, x, y }: Props) {
  const k = size / 24
  return (
    <g
      transform={`translate(${(x - size / 2).toFixed(2)} ${(y - size / 2).toFixed(2)}) scale(${k.toFixed(4)})`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      {PATHS[id]}
    </g>
  )
}
