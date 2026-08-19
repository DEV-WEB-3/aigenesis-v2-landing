'use client'

import { EMISSION } from '@/lib/design/tokens'

/**
 * LOS CUATRO PILARES — la fila que cierra la seccion.
 *
 * QUE HACEN QUE NO HAGA YA LA MAQUINA
 * -----------------------------------
 * La maquina cuenta la ARQUITECTURA: que hay cinco capas y como se relacionan.
 * No puede contar las PROPIEDADES del sistema —que es seguro, que escala, que
 * es rapido, que es modular— porque esas no tienen forma: no se dibujan, se
 * afirman. Por eso van en texto y por eso van al final, cuando el visitante ya
 * ha visto de que se esta hablando.
 *
 * POR QUE CUATRO Y EN UNA FILA
 * ----------------------------
 * Cuatro es el maximo que se lee de un vistazo sin contar. En una fila se leen
 * como propiedades EQUIVALENTES del mismo sistema; apiladas se leerian como una
 * lista con orden de importancia, que es otra cosa y no es la que corresponde.
 *
 * El color de cada una la ata a la capa de la maquina que la sostiene —cian
 * como aplicaciones, violeta como blockchain, magenta como IA, azul como
 * infraestructura—, asi que la fila no es un bloque suelto: es el pie de lo que
 * hay encima.
 */
const PILARES = [
  {
    id: 'seguridad',
    titulo: 'Seguridad por diseño',
    texto: 'Auditorías continuas, formal verification y estándares de seguridad de nivel bancario.',
    color: EMISSION.cyan,
    icono: (
      <>
        <path d="M12 3.2 19 6v6.1c0 4-2.9 7.4-7 8.7-4.1-1.3-7-4.7-7-8.7V6l7-2.8Z" />
        <path d="m8.8 11.9 2.2 2.2 4.2-4.4" />
      </>
    ),
  },
  {
    id: 'escalabilidad',
    titulo: 'Escalabilidad global',
    texto: 'Nodos distribuidos en múltiples regiones para máxima velocidad y disponibilidad.',
    color: EMISSION.violetHi,
    icono: (
      <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M3.4 12h17.2M12 3.4c2.2 2.4 3.4 5.4 3.4 8.6s-1.2 6.2-3.4 8.6c-2.2-2.4-3.4-5.4-3.4-8.6S9.8 5.8 12 3.4Z" />
      </>
    ),
  },
  {
    id: 'rendimiento',
    titulo: 'Rendimiento élite',
    texto: 'Arquitectura optimizada para baja latencia, alto throughput y respuesta instantánea.',
    color: EMISSION.magenta,
    icono: <path d="M13.4 2.6 5.2 13.4h5.3l-.9 8 8.2-10.8h-5.3l.9-8Z" />,
  },
  {
    id: 'modular',
    titulo: 'Modular y adaptable',
    texto: 'Componentes desacoplados que permiten evolucionar sin límites.',
    color: EMISSION.blueHi,
    icono: (
      <>
        <path d="M12 2.8 17 5.6 12 8.4 7 5.6l5-2.8Z" />
        <path d="M6.4 9.9 11.4 12.7 6.4 15.5 1.4 12.7l5-2.8Z" transform="translate(1.1 3.2)" />
        <path d="M12.6 9.9 17.6 12.7 12.6 15.5 7.6 12.7l5-2.8Z" transform="translate(1.1 3.2)" />
      </>
    ),
  },
] as const

export default function TechnologyPillars() {
  return (
    <ul className="tech-pilares">
      {PILARES.map((p, i) => (
        <li
          key={p.id}
          className="tech-pilar"
          style={{ '--pilar-color': p.color, '--pilar-retardo': `${(0.1 + i * 0.08).toFixed(2)}s` } as React.CSSProperties}
        >
          <span className="tech-pilar__icono" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round">
              {p.icono}
            </svg>
          </span>
          <span className="tech-pilar__cuerpo">
            <span className="tech-pilar__titulo">{p.titulo}</span>
            <span className="tech-pilar__texto">{p.texto}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
