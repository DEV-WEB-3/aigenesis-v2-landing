'use client'

import { useT } from '@/context/IdiomaContext'
import { ROADMAP_EVOLUTION_FORM_S, ROADMAP_EVOLUTION_PULSE_S } from '@/lib/roadmap/evolutionPathLayout'
import RoadmapEvolutionMilestones from '@/components/roadmap/RoadmapEvolutionMilestones'
import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

interface RoadmapEvolutionPathProps {
  isActive: boolean
}

export default function RoadmapEvolutionPath({ isActive }: RoadmapEvolutionPathProps) {

  const t = useT()
  const visible = useSectionVisualActive(isActive)
  if (!visible) return null

  return (
    <div
      className="roadmap-evolution-path roadmap-evolution-path--enter"
      aria-label={t('Genesis Evolution Path')}
      style={
        {
          '--roadmap-pulse-s': `${ROADMAP_EVOLUTION_PULSE_S}s`,
          '--roadmap-form-s': `${ROADMAP_EVOLUTION_FORM_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="roadmap-evolution-path__field" aria-hidden="true" />
      <RoadmapEvolutionMilestones />
    </div>
  )
}
