'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/SceneShared'

type MetricEntry =
  | { kind: 'counter'; to: number; suffix: string; label: string; decimals?: number }
  | { kind: 'static'; value: string; label: string }

const METRICS: MetricEntry[] = [
  { kind: 'counter', to: 100, suffix: 'K+', label: 'Comunidad' },
  { kind: 'counter', to: 12, suffix: '+', label: 'Países' },
  { kind: 'static', value: '2019', label: 'Fundado' },
  { kind: 'counter', to: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
]

interface InstitutionalMetricsProps {
  isActive?: boolean
  className?: string
}

export default function InstitutionalMetrics({
  isActive = true,
  className = '',
}: InstitutionalMetricsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={`institutional-metrics ${className}`.trim()}
      aria-label="Métricas institucionales"
    >
      {METRICS.map((metric) => (
        <div key={metric.label} className="institutional-metrics__item">
          <span className="institutional-metrics__value font-display">
            {metric.kind === 'static' ? (
              metric.value
            ) : (
              <AnimatedCounter
                to={metric.to}
                suffix={metric.suffix}
                isActive={isActive}
                decimals={metric.decimals ?? 0}
              />
            )}
          </span>
          <span className="institutional-metrics__label">{metric.label}</span>
        </div>
      ))}
    </motion.div>
  )
}
