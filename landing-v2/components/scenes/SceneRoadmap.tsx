'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import OfficialDownloadButton from '@/components/cta/OfficialDownloadButton'
import RoadmapSectionBackdrop from '@/components/roadmap/RoadmapSectionBackdrop'
import RoadmapEvolutionPath from '@/components/roadmap/RoadmapEvolutionPath'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper,
  slideLeft,
} from '@/components/ui/SceneShared'
import { EXTERNAL_LINKS } from '@/lib/routes'

type Status = 'completed' | 'active' | 'upcoming'

interface TimelineItemProps {
  year: string
  title: string
  status: Status
}

function TimelineItem({ year, title, status }: TimelineItemProps) {
  const dotClass =
    status === 'completed'
      ? 'bg-genesis-core'
      : status === 'active'
      ? 'bg-genesis-fuchsia shadow-[0_0_0_4px_rgba(233,30,139,0.22)] animate-pulse'
      : 'border-2 border-genesis-ghost bg-transparent'

  return (
    <div className="flex items-start gap-4 relative">
      <div
        className={`absolute left-[-22px] top-1 h-3 w-3 shrink-0 rounded-full ${dotClass}`}
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-xs uppercase tracking-widest text-genesis-ghost">
          {year}
        </span>
        <span
          className={`text-sm font-medium ${
            status === 'upcoming' ? 'text-genesis-ghost' : 'text-genesis-text'
          }`}
        >
          {title}
        </span>
      </div>
    </div>
  )
}

interface Props { isActive?: boolean }

const SceneRoadmap = forwardRef<HTMLElement, Props>(
  function SceneRoadmap({ isActive = false }, ref) {
    return (
      <SceneWrapper
        ref={ref}
        isActive={isActive}
        motionKey="scene07"
        sectionId="roadmap"
        particleColumn
        className="roadmap-section-layout"
        sectionOverlay={<RoadmapSectionBackdrop visible={isActive} />}
        particleSlot={<RoadmapEvolutionPath isActive={isActive} />}
      >

        <SectionHeader
          label="Roadmap"
          title="Nuestro"
          highlight="horizonte."
        />

        <motion.div
          variants={slideLeft}
          className="scene-roadmap-timeline mt-4 border-l-2 border-genesis-core/30 pl-7 flex flex-col gap-7"
        >
          {/*
            ESTA ES LA HOJA DE RUTA OFICIAL. Decidido el 16-ago-2026.

            Habia DOS publicas y no decian lo mismo: estos seis hitos de negocio,
            y veintiuna fases tecnicas con porcentaje de avance en aigtoken.io.
            Dos planes distintos sobre el mismo proyecto, a la vez, es lo que un
            visitante lee como descoordinacion.

            Manda esta: sus hitos corresponden al trabajo real y reciente. Las 21
            fases colgaban de un whitepaper de febrero de 2024 y dejan de ser
            publicas cuando aigtoken.io redirija.

            Si alguien vuelve a «reconciliarlas», que sea a sabiendas.
          */}
          <TimelineItem year="2019"    title="Lanzamiento AiGenesis"       status="completed" />
          <TimelineItem year="2023"    title="G11 Community + NFT"         status="completed" />
          <TimelineItem year="2025"    title="Oracle V1 + GPulse"          status="completed" />
          <TimelineItem year="2026 Q1" title="Cinema Runtime + G-BRIDGE"   status="completed" />
          <TimelineItem year="2026 Q2" title="Gevy Shop Marketplace"       status="active"    />
          <TimelineItem year="2026 Q3" title="AiCard + Exchange"           status="upcoming"  />
          <TimelineItem year="2027"    title="Genesis Metaverse"            status="upcoming"  />
        </motion.div>

        <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
          <RoadmapEvolutionPath isActive={isActive} />
        </motion.div>

        <motion.div variants={slideLeft} className="mt-4">
          <OfficialDownloadButton href={EXTERNAL_LINKS.MARKETING_PLAN_ES}>
            Descargar plan de marketing
          </OfficialDownloadButton>
        </motion.div>

      </SceneWrapper>
    )
  }
)

export default SceneRoadmap
