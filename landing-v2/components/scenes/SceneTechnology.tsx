'use client'

import { forwardRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper, GradientButton,
  containerV, slideLeft,
} from '@/components/ui/SceneShared'
import { ROUTES, EXTERNAL_LINKS } from '@/lib/routes'
import { TECHNOLOGY_STATS } from '@/lib/institutionalMetrics'
import TechnologySectionBackdrop from '@/components/technology/TechnologySectionBackdrop'
import TechnologyGenesisStack from '@/components/technology/TechnologyGenesisStack'

const TECH_STACK = [
  'BSC', 'Smart Contracts', 'Web3', 'MetaMask', 'Socket.IO',
  'Node.js', 'React', 'MongoDB', 'Redis', 'G-BRIDGE AI', 'Three.js',
]

const STATS = TECHNOLOGY_STATS

interface Props { isActive?: boolean }

const SceneTechnology = forwardRef<HTMLElement, Props>(
  function SceneTechnology({ isActive = false }, ref) {
    /*
     * LAS CIFRAS SE REVELAN UNA VEZ, Y SE QUEDAN.
     *
     * Un contador que se reinicia cada vez que vuelves a la seccion deja de ser
     * un dato y pasa a ser un adorno: a la tercera pasada el visitante ya no lo
     * lee, lo espera. El pestillo hace que la revelacion ocurra en la primera
     * visita y nunca mas — despues, las cifras estan simplemente ahi.
     */
    const [cifrasVistas, setCifrasVistas] = useState(false)
    useEffect(() => {
      if (isActive) setCifrasVistas(true)
    }, [isActive])

    /*
     * EL CONTRATO SENALA A SU CAPA.
     *
     * La bandera se pone en la SECCION y no se pasa por props: el dibujo vive
     * en `particleSlot`, que es un hermano, y llevar el estado hasta alli
     * obligaria a subirlo a `SceneWrapper` —comun a las catorce secciones— por
     * una interaccion que solo tiene esta. Un atributo en el ancestro comun es
     * la via mas corta que no contamina a las otras trece.
     */
    const marcarContrato = useCallback((activo: boolean) => (ev: React.SyntheticEvent) => {
      const seccion = ev.currentTarget.closest('section')
      if (!seccion) return
      if (activo) seccion.dataset.arqSc = '1'
      else delete seccion.dataset.arqSc
    }, [])

    return (
      <SceneWrapper
        ref={ref}
        isActive={isActive}
        motionKey="scene06"
        sectionId="technology"
        particleColumn
        className="technology-section-layout"
        sectionOverlay={<TechnologySectionBackdrop />}
        particleSlot={<TechnologyGenesisStack isActive={isActive} />}
      >

        <SectionHeader
          label="Tecnología"
          title="Ingeniería de"
          highlight="vanguardia."
        />

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg text-genesis-mist">
          Stack tecnológico de clase enterprise. Smart contracts auditados, infraestructura
          distribuida, y motor de inteligencia artificial propietario.
        </motion.p>

        <motion.div variants={slideLeft} className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-full text-xs cursor-default border border-genesis-core/30 text-genesis-mist bg-genesis-core/5 transition-all duration-200 hover:border-genesis-fuchsia/50 hover:text-genesis-text hover:bg-genesis-fuchsia/10"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        <motion.div
          variants={slideLeft}
          className="flex flex-col gap-1 tech-contrato"
          onPointerEnter={marcarContrato(true)}
          onPointerLeave={marcarContrato(false)}
          onFocus={marcarContrato(true)}
          onBlur={marcarContrato(false)}
        >
          <span className="text-xs text-genesis-ghost uppercase tracking-widest">Smart Contract</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-genesis-mist">0xC1F076...E2a4</span>
            {/*
              Media 134x16 en movil: por debajo del minimo de WCAG 2.2 AA. Va con
              zona de toque ampliada a 44 px, que aqui cabe porque el enlace esta
              solo en su fila. `target`/`rel` para no perder la landing al salir
              hacia BSCScan — es el mismo criterio que ya aplica TrustBadge a sus
              enlaces externos.
            */}
            <a
              href={ROUTES.BSCSCAN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-genesis-ion transition-colors hover:underline pointer-events-auto zona-toque enlace-verificacion"
            >
              Verificar en BSCScan ↗
            </a>
          </div>
        </motion.div>

        <motion.div
          variants={slideLeft}
          className={`flex gap-10 tech-cifras${cifrasVistas ? ' tech-cifras--revelada' : ''}`}
        >
          {STATS.map(({ value, label }, i) => (
            <div key={label} className="flex flex-col gap-1">
              <span
                className="text-2xl font-bold text-genesis-text font-display tech-cifra"
                style={{ '--cifra-retardo': `${(i * 0.15).toFixed(2)}s` } as React.CSSProperties}
              >
                {value}
              </span>
              <span className="text-xs text-genesis-ghost uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </motion.div>

        <GradientButton href={EXTERNAL_LINKS.DOCS}>Ver Documentación →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default SceneTechnology
