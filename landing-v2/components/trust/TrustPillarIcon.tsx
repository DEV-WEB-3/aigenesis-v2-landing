import type { PilarId } from '@/lib/trust/scanFieldLayout'

/**
 * Los seis iconos de los pilares.
 *
 * Trazo, nunca relleno. Un SVG sin `fill` explicito se pinta NEGRO —el valor
 * inicial se hereda— y sobre este fondo eso es una mancha opaca, no una forma
 * invisible. Aqui `fill="none"` va en el elemento raiz para que ninguna forma
 * pueda caerse a ese defecto, que es como estuvieron dos elipses del portal
 * desde que se escribieron.
 *
 * El color lo pone `currentColor`, asi que el icono hereda el tono del pilar y
 * no hay una segunda lista de colores que mantener de acuerdo.
 */
const TRAZOS: Record<PilarId, JSX.Element> = {
  red: (
    <>
      <circle cx="12" cy="5" r="2.6" />
      <circle cx="5" cy="17" r="2.6" />
      <circle cx="19" cy="17" r="2.6" />
      <path d="M10.3 7.2 6.7 14.6M13.7 7.2l3.6 7.4M7.6 17h8.8" />
    </>
  ),
  seguridad: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
      <circle cx="12" cy="15.4" r="1.4" />
    </>
  ),
  contratos: <path d="M9 8 5 12l4 4M15 8l4 4-4 4" />,
  auditoria: (
    <>
      <path d="M12 2.8 4.6 6v6.2c0 4.4 3.1 7.6 7.4 9 4.3-1.4 7.4-4.6 7.4-9V6z" />
      <path d="M9 12.2l2.2 2.2 4-4.4" />
    </>
  ),
  nodos: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2M12 3.4c2.4 2.6 3.6 5.5 3.6 8.6s-1.2 6-3.6 8.6c-2.4-2.6-3.6-5.5-3.6-8.6S9.6 6 12 3.4z" />
    </>
  ),
  trazabilidad: (
    <path d="M6.5 12a5.5 5.5 0 0 1 11 0v2.5M9.4 12a2.6 2.6 0 0 1 5.2 0v4.4M12 12v6.6M4 10.5A8.2 8.2 0 0 1 20 10.5" />
  ),
}

export default function TrustPillarIcon({ id }: { id: PilarId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {TRAZOS[id]}
    </svg>
  )
}
