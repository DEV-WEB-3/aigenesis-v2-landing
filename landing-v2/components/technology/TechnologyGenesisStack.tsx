'use client'

import { TECH_STACK_FORM_S, TECH_STACK_PULSE_S } from '@/lib/technology/techStackLayout'
import TechnologyStackLayers from '@/components/technology/TechnologyStackLayers'
import TechnologyStackFlows from '@/components/technology/TechnologyStackFlows'
import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

interface TechnologyGenesisStackProps {
  isActive: boolean
}

export default function TechnologyGenesisStack({ isActive }: TechnologyGenesisStackProps) {
  // Gate PEGAJOSO, no `isActive` a secas. El motivo, medido, esta en
  // `useSectionVisualActive`: con el prop crudo el visual desaparecia
  // mientras la seccion estaba a la vista.
  const visible = useSectionVisualActive(isActive)
  if (!visible) return null

  return (
    <div
      className="technology-genesis-stack technology-genesis-stack--enter"
      aria-label="Genesis Technology Stack"
      style={
        {
          '--tech-pulse-s': `${TECH_STACK_PULSE_S}s`,
          '--tech-form-s': `${TECH_STACK_FORM_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="technology-genesis-stack__layer technology-genesis-stack__layer--back">
        <div className="technology-genesis-stack__field" aria-hidden="true" />
      </div>

      <div className="technology-genesis-stack__layer technology-genesis-stack__layer--mid">
        <TechnologyStackFlows />
        <TechnologyStackLayers />
      </div>
    </div>
  )
}
