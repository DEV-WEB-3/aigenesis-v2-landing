'use client'

import { ROADMAP_EVOLUTION_FORM_S, ROADMAP_EVOLUTION_PULSE_S } from '@/lib/roadmap/evolutionPathLayout'
import RoadmapEvolutionMilestones from '@/components/roadmap/RoadmapEvolutionMilestones'

interface RoadmapEvolutionPathProps {
  isActive: boolean
}

export default function RoadmapEvolutionPath({ isActive }: RoadmapEvolutionPathProps) {
  if (!isActive) return null

  return (
    <div
      className="roadmap-evolution-path roadmap-evolution-path--enter"
      aria-label="Genesis Evolution Path"
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
