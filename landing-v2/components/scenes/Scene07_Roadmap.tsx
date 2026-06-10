'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import {
  SceneWrapper, SectionLabel, GradientText,
  containerV, slideLeft, wordV,
} from '@/components/ui/SceneShared'

type Status = 'completed' | 'active' | 'upcoming'

interface TimelineItemProps {
  year: string
  title: string
  status: Status
}

function TimelineItem({ year, title, status }: TimelineItemProps) {
  const dotStyle: React.CSSProperties =
    status === 'completed'
      ? { width: 12, height: 12, borderRadius: '50%', background: '#8B5CF6', flexShrink: 0 }
      : status === 'active'
      ? {
          width: 12, height: 12, borderRadius: '50%', background: '#E91E8B', flexShrink: 0,
          boxShadow: '0 0 0 4px rgba(233,30,139,0.2)',
        }
      : { width: 12, height: 12, borderRadius: '50%', border: '2px solid #4B5563', flexShrink: 0 }

  return (
    <div className="flex items-start gap-4 relative">
      {/* Dot posicionado sobre la línea */}
      <div
        style={{
          ...dotStyle,
          position: 'absolute',
          left: -22,
          top: 4,
        }}
        className={status === 'active' ? 'animate-pulse' : ''}
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-xs uppercase tracking-widest" style={{ color: '#6B7280' }}>
          {year}
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: status === 'upcoming' ? '#4B5563' : '#fff' }}
        >
          {title}
        </span>
      </div>
    </div>
  )
}

interface Props { isActive?: boolean }

const Scene07_Roadmap = forwardRef<HTMLElement, Props>(
  function Scene07_Roadmap({ isActive = false }, ref) {
    return (
      <SceneWrapper ref={ref} isActive={isActive} motionKey="scene07">

        <SectionLabel>Sección 07</SectionLabel>

        <motion.h2
          className="text-5xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-space-grotesk)', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          <motion.span variants={wordV} style={{ display: 'block', color: '#fff' }}>
            Nuestro
          </motion.span>
          <GradientText>horizonte.</GradientText>
        </motion.h2>

        {/* Timeline */}
        <motion.div
          variants={slideLeft}
          className="mt-4"
          style={{
            borderLeft: '2px solid rgba(139,92,246,0.3)',
            paddingLeft: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <TimelineItem year="2019"    title="Lanzamiento AiGenesis"       status="completed" />
          <TimelineItem year="2023"    title="G11 Community + NFT"         status="completed" />
          <TimelineItem year="2025"    title="Oracle V1 + GPulse"          status="completed" />
          <TimelineItem year="2026 Q1" title="Cinema Runtime + G-BRIDGE"   status="completed" />
          <TimelineItem year="2026 Q2" title="Gevy Shop Marketplace"       status="active"    />
          <TimelineItem year="2026 Q3" title="AiCard + Exchange"           status="upcoming"  />
          <TimelineItem year="2027"    title="Genesis Metaverse"            status="upcoming"  />
        </motion.div>

      </SceneWrapper>
    )
  }
)

export default Scene07_Roadmap
