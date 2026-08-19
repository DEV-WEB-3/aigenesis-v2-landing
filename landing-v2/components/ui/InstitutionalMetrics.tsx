'use client'

import { useT } from '@/context/IdiomaContext'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/SceneShared'
import { TRUST_INSTITUTIONAL_METRICS, type InstitutionalMetric } from '@/lib/institutionalMetrics'

const METRICS: InstitutionalMetric[] = [...TRUST_INSTITUTIONAL_METRICS]

interface InstitutionalMetricsProps {
  isActive?: boolean
  className?: string
}

export default function InstitutionalMetrics({
  isActive = true,
  className = '',
}: InstitutionalMetricsProps) {
  const t = useT()
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={`institutional-metrics ${className}`.trim()}
      aria-label={t('Métricas institucionales')}
    >
      {METRICS.map((metric) => (
        <div key={metric.label} className="institutional-metrics__item">
          <span dir="ltr" className="institutional-metrics__value font-display">
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
          <span className="institutional-metrics__label">{t(metric.label)}</span>
        </div>
      ))}
    </motion.div>
  )
}
