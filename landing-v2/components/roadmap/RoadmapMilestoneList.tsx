'use client'

import { useT } from '@/context/IdiomaContext'
import RoadmapMilestoneIcon from '@/components/roadmap/RoadmapMilestoneIcon'
import {
  ROADMAP_MILESTONES,
  milestoneColor,
  milestoneDelay,
} from '@/lib/roadmap/evolutionPathLayout'

/**
 * LA LISTA — el mismo recorrido, legible de un vistazo.
 *
 * Existe porque la senda dibujada cuenta la FORMA del recorrido y una lista
 * cuenta su CONTENIDO, y no son lo mismo: sobre la curva los rotulos van
 * pequenos y repartidos, aqui se leen en orden y de arriba abajo.
 *
 * Las dos salen de `ROADMAP_MILESTONES`, asi que no pueden discrepar. Antes eran
 * dos listas escritas a mano —una en el layout y otra en la escena— y bastaba
 * tocar una para que el dibujo y el texto contaran cosas distintas.
 *
 * Los iconos son los MISMOS componentes que los de la senda. Un icono repetido
 * a mano en dos sitios acaba divergiendo.
 */
export default function RoadmapMilestoneList() {
  const t = useT()
  return (
    <ol className="roadmap-lista" aria-label={t('Hitos del recorrido')}>
      {ROADMAP_MILESTONES.map((m) => {
        const color = milestoneColor(m.index)
        const activo = m.status === 'active'
        return (
          <li
            key={m.id}
            className={`roadmap-lista__fila roadmap-lista__fila--${m.status}`}
            style={
              {
                '--fila-color': color,
                animationDelay: `${milestoneDelay(m.index)}s`,
              } as React.CSSProperties
            }
            aria-current={activo ? 'step' : undefined}
          >
            <span className="roadmap-lista__marco" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="roadmap-lista__icono" style={{ color }}>
                <RoadmapMilestoneIcon id={m.id} size={24} x={12} y={12} />
              </svg>
            </span>

            <span className="roadmap-lista__punto" aria-hidden="true" />

            <span className="roadmap-lista__texto">
              <span className="roadmap-lista__anio" style={{ color }}>
                {m.year}
                {m.quarter ? <span className="roadmap-lista__trimestre"> {m.quarter}</span> : null}
              </span>
              <span className="roadmap-lista__titulo">{m.title.map(t).join(' ')}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
