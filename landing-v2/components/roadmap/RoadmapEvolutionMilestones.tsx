'use client'

import { useId } from 'react'
import { EMISSION } from '@/lib/design/tokens'
import RoadmapMilestoneIcon from '@/components/roadmap/RoadmapMilestoneIcon'
import {
  ROADMAP_MILESTONES,
  ROADMAP_VIEWBOX,
  ROADMAP_STARS,
  ROADMAP_SHELLS,
  ROADMAP_GLOBE,
  ROADMAP_VIAJE_S,
  ROADMAP_ANILLO_S,
  ROADMAP_FONDO_S,
  ROADMAP_EVOLUTION_PULSE_S,
  evolutionCurvePath,
  evolutionArrowPath,
  globeLatitudes,
  milestoneColor,
  milestoneDelay,
} from '@/lib/roadmap/evolutionPathLayout'

/** Radio del nodo, en unidades del lienzo. */
const NODO_R = 4.3
/** Los tres anillos orbitales que cada hito deja debajo. */
const PLATAFORMA = [1.55, 2.25, 3.0] as const

export default function RoadmapEvolutionMilestones() {
  /*
   * IDS UNICOS POR INSTANCIA, y no es un detalle de estilo.
   *
   * Esta seccion monta el visual DOS VECES: una en el hueco de escritorio y otra
   * en la variante movil, que vive en un contenedor con `display: none`. Con ids
   * fijos, los dos SVG declaraban el MISMO id y la referencia
   * resolvia al PRIMERO del documento — el del contenedor oculto, que no pinta.
   *
   * Resultado: la senda que une los siete hitos NO SE DIBUJABA. Y no fallaba de
   * forma visible: el elemento estaba, media 587 x 420 px y declaraba 6,3 px de
   * grosor. Solo pintandola con un color solido a mano aparecio.
   *
   * `useId` da un valor estable entre servidor y cliente —`Math.random()` o un
   * contador romperian la hidratacion— y se limpia de caracteres raros porque
   * React lo devuelve con dos puntos.
   */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const ID = {
    grad: `senda-grad-${uid}`,
    halo: `senda-halo-${uid}`,
    globo: `senda-globo-${uid}`,
    glow: `senda-glow-${uid}`,
  }
  const senda = evolutionCurvePath()
  const flecha = evolutionArrowPath()
  const latitudes = globeLatitudes()

  return (
    <svg
      className="roadmap-senda"
      viewBox={`0 0 ${ROADMAP_VIEWBOX.w} ${ROADMAP_VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={
        {
          '--senda-viaje-s': `${ROADMAP_VIAJE_S}s`,
          '--senda-anillo-s': `${ROADMAP_ANILLO_S}s`,
          '--senda-fondo-s': `${ROADMAP_FONDO_S}s`,
          '--senda-pulso-s': `${ROADMAP_EVOLUTION_PULSE_S}s`,
        } as React.CSSProperties
      }
    >
      <defs>
        <linearGradient id={ID.grad} gradientUnits="userSpaceOnUse" x1="16" y1="84" x2="118" y2="11">
          <stop offset="0%" stopColor={EMISSION.violetHi} stopOpacity="0.85" />
          <stop offset="46%" stopColor={EMISSION.magenta} stopOpacity="0.9" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0.95" />
        </linearGradient>

        <radialGradient id={ID.halo} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={ID.globo} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={EMISSION.magenta} stopOpacity="0.42" />
          <stop offset="55%" stopColor={EMISSION.violet} stopOpacity="0.1" />
          <stop offset="100%" stopColor={EMISSION.violet} stopOpacity="0" />
        </radialGradient>

        {/*
          Un solo filtro de desenfoque, reutilizado. Cada `filter` distinto es una
          pasada de compositing propia; siete nodos con siete filtros serian siete
          superficies fuera de pantalla por cuadro.
        */}
        <filter id={ID.glow} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="0.55" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── FONDO ─────────────────────────────────────────────────── */}
      <g className="roadmap-senda__fondo">
        {ROADMAP_SHELLS.map((s, i) => (
          <ellipse
            key={`shell-${i}`}
            cx={ROADMAP_GLOBE.cx}
            cy={ROADMAP_GLOBE.cy}
            rx={s.rx}
            ry={s.ry}
            fill="none"
            stroke={EMISSION.violetHi}
            strokeWidth="0.14"
            opacity="0.18"
            transform={`rotate(${s.rot} ${ROADMAP_GLOBE.cx} ${ROADMAP_GLOBE.cy})`}
            className="roadmap-senda__cascara"
            style={{ animationDelay: `${i * 2}s` } as React.CSSProperties}
          />
        ))}

        <circle
          cx={ROADMAP_GLOBE.cx}
          cy={ROADMAP_GLOBE.cy}
          r={ROADMAP_GLOBE.r * 1.5}
          fill={`url(#${ID.globo})`}
          className="roadmap-senda__globo-halo"
        />
        <g className="roadmap-senda__globo">
          {latitudes.map((l, i) => (
            <ellipse
              key={`lat-${i}`}
              cx={ROADMAP_GLOBE.cx}
              cy={l.y}
              rx={l.rx}
              ry={l.ry}
              fill="none"
              stroke={EMISSION.violetHi}
              strokeWidth="0.14"
              strokeDasharray="0.3 0.75"
              opacity={0.32 + Math.sin(((i + 1) / (latitudes.length + 1)) * Math.PI) * 0.42}
            />
          ))}
          {/*
            Meridianos: sin ellos siete latitudes se leen como una pila de aros,
            no como una esfera. Se dibujan como elipses muy estrechas girando
            sobre el centro, que es lo que hace una malla de globo.
          */}
          {[0, 30, 60, 90, 120, 150].map((a) => (
            <ellipse
              key={`mer-${a}`}
              cx={ROADMAP_GLOBE.cx}
              cy={ROADMAP_GLOBE.cy}
              rx={ROADMAP_GLOBE.r * 0.3}
              ry={ROADMAP_GLOBE.r}
              fill="none"
              stroke={EMISSION.violetHi}
              strokeWidth="0.1"
              strokeDasharray="0.28 0.8"
              opacity="0.3"
              transform={`rotate(${a} ${ROADMAP_GLOBE.cx} ${ROADMAP_GLOBE.cy})`}
            />
          ))}
          <circle cx={ROADMAP_GLOBE.cx} cy={ROADMAP_GLOBE.cy} r="1.1" fill={EMISSION.magentaHi} opacity="0.9" />
        </g>

        {ROADMAP_STARS.map((s, i) => (
          <circle
            key={`star-${i}`}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.color}
            className="roadmap-senda__estrella"
            style={{ animationDelay: `${s.retardo}s` } as React.CSSProperties}
          />
        ))}
      </g>

      {/* ── LA SENDA ──────────────────────────────────────────────── */}
      <path d={senda} className="roadmap-senda__traza" fill="none" stroke={`url(#${ID.grad})`} strokeWidth="0.5" />
      <path
        d={senda}
        className="roadmap-senda__energia"
        fill="none"
        stroke={`url(#${ID.grad})`}
        strokeWidth="1.1"
        strokeLinecap="round"
        filter={`url(#${ID.glow})`}
      />

      <path
        d={flecha}
        className="roadmap-senda__flecha"
        fill="none"
        stroke={EMISSION.cyan}
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${ID.glow})`}
      />

      {/*
        LA CHISPA Y SU COLA — cuatro cuerpos en el mismo camino, no una linea que
        se repinta.

        El efecto de energia recorriendo la senda se hace normalmente animando
        `stroke-dashoffset`, y eso NO lo compone el compositor: repinta el trazo
        entero en cada cuadro. Cuatro puntos con el mismo `animateMotion` y
        distinto `begin` dan la misma lectura —algo que avanza y deja rastro— con
        `transform` puro. La duracion es la misma en los cuatro: solo cambia el
        arranque, que es como se separan las cosas en este portal.
      */}
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={`chispa-${i}`}
          r={0.72 - i * 0.14}
          fill={i === 0 ? EMISSION.cyan : EMISSION.magentaHi}
          className={`roadmap-senda__chispa${i > 0 ? ' roadmap-senda__chispa--cola' : ''}`}
          filter={`url(#${ID.glow})`}
        >
          <animateMotion
            dur={`${ROADMAP_VIAJE_S}s`}
            repeatCount="indefinite"
            path={senda}
            calcMode="linear"
            begin={`-${(i * 0.22).toFixed(2)}s`}
          />
        </circle>
      ))}

      {/* ── LOS HITOS ─────────────────────────────────────────────── */}
      {ROADMAP_MILESTONES.map((m) => {
        const color = milestoneColor(m.index)
        const r = NODO_R * m.escala
        const esFuturo = m.status === 'upcoming'
        const esActivo = m.status === 'active'
        const retardo = milestoneDelay(m.index)

        return (
          <g
            key={m.id}
            className={`roadmap-hito roadmap-hito--${m.status}`}
            style={{ '--hito-color': color, animationDelay: `${retardo}s` } as React.CSSProperties}
          >
            {/* plataforma orbital: los anillos que el hito deja debajo */}
            <g className="roadmap-hito__plataforma">
              {PLATAFORMA.map((k, i) => (
                <ellipse
                  key={i}
                  cx={m.x}
                  cy={m.y + r * 0.95}
                  rx={r * k}
                  ry={r * k * 0.3}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.12"
                  opacity={0.42 - i * 0.1}
                  className="roadmap-hito__anillo"
                  style={{ animationDelay: `${(retardo + i * 0.4).toFixed(2)}s` } as React.CSSProperties}
                />
              ))}
              <ellipse
                cx={m.x}
                cy={m.y + r * 0.95}
                rx={r * 0.8}
                ry={r * 0.24}
                fill={`url(#${ID.halo})`}
                opacity="0.5"
              />
            </g>

            {/* halo y disco del nodo */}
            <circle cx={m.x} cy={m.y} r={r * 2} fill={`url(#${ID.halo})`} className="roadmap-hito__halo" />
            <circle cx={m.x} cy={m.y} r={r} className="roadmap-hito__disco" fill="rgba(6,8,20,0.82)" stroke={color} strokeWidth="0.42" filter={`url(#${ID.glow})`} />
            {esActivo && (
              <circle cx={m.x} cy={m.y} r={r * 1.28} className="roadmap-hito__latido" fill="none" stroke={color} strokeWidth="0.3" />
            )}
            {esFuturo && (
              <circle cx={m.x} cy={m.y} r={r * 1.5} className="roadmap-hito__futuro" fill="none" stroke={color} strokeWidth="0.16" strokeDasharray="1.2 1.2" />
            )}

            <g style={{ color }} className="roadmap-hito__icono">
              <RoadmapMilestoneIcon id={m.id} size={r * 1.05} x={m.x} y={m.y} />
            </g>

            {/* rotulo: el anio grande y el titulo debajo, a la derecha del nodo */}
            <g className="roadmap-hito__rotulo" transform={`translate(${(m.x + r + 3.2).toFixed(2)} ${m.y.toFixed(2)})`}>
              <text className="roadmap-hito__anio" x="0" y="0" fill={color}>
                {m.year}
              </text>
              {m.quarter && (
                <text className="roadmap-hito__trimestre" x={m.year.length * 3.15 + 1.4} y="0">
                  {m.quarter}
                </text>
              )}
              {m.title.map((linea, i) => (
                <text key={i} className="roadmap-hito__titulo" x="0" y={4.6 + i * 3.4}>
                  {linea}
                </text>
              ))}
            </g>
          </g>
        )
      })}
    </svg>
  )
}
