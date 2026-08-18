'use client'

import { useId, useRef } from 'react'
import { EMISSION, INK } from '@/lib/design/tokens'
import { usePointerParallax } from '@/hooks/usePointerParallax'
import {
  ARQ_VIEWBOX,
  ARQ_EJE_X,
  ARQ_ESTRATOS,
  ARQ_APLANADO,
  ARQ_NUCLEO_Y,
  ARQ_DATOS,
  ARQ_PULSO_S,
  ARQ_DATO_S,
  ARQ_ANILLO_S,
  ARQ_ESCANEO_S,
  ARQ_LLEGADA_S,
  arqRetardo,
  arqPuertos,
} from '@/lib/technology/techArchitecture'

/** Glifo de cada estrato. Trazo, `fill="none"`: el defecto de `fill` es NEGRO. */
const GLIFOS: Record<string, React.ReactNode> = {
  backend: <path d="M9 8 5.5 12 9 16M15 8l3.5 4L15 16" />,
  infraestructura: (
    <>
      <rect x="4.5" y="5" width="15" height="4" rx="1" />
      <rect x="4.5" y="10" width="15" height="4" rx="1" />
      <rect x="4.5" y="15" width="15" height="4" rx="1" />
    </>
  ),
  ia: (
    <>
      <path d="M12 5.2a3 3 0 0 0-3 3v.4a2.6 2.6 0 0 0 0 5.1v.9a3 3 0 0 0 6 0v-.9a2.6 2.6 0 0 0 0-5.1v-.4a3 3 0 0 0-3-3Z" />
      <path d="M12 5.2v13.4" />
    </>
  ),
  blockchain: (
    <>
      <path d="M12 3.6 19 7.4v9.2L12 20.4 5 16.6V7.4l7-3.8Z" />
      <path d="M12 3.6v8.8M12 12.4 5 7.4M12 12.4l7-5" />
    </>
  ),
  aplicaciones: (
    <>
      <rect x="4" y="5.5" width="16" height="13" rx="2" />
      <path d="M4 9.5h16M7.4 13h5" />
    </>
  ),
}

export default function TechnologyArchitecture() {
  /*
   * IDS UNICOS POR INSTANCIA. La seccion monta el visual dos veces —escritorio y
   * la variante movil, esta en `display: none`— y `url(#id)` resuelve al PRIMERO
   * del documento: el del contenedor oculto, que no pinta. Ya dejo la senda del
   * roadmap sin dibujar una vez.
   */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const ID = {
    columna: `arq-col-${uid}`,
    brillo: `arq-glow-${uid}`,
    suelo: `arq-suelo-${uid}`,
    nucleo: `arq-nucleo-${uid}`,
  }

  /*
   * PROFUNDIDAD POR PARALAJE. Tres planos, no seis: cada plano extra es otra
   * capa de compositing por cuadro, y a partir del tercero el ojo ya no
   * distingue el escalon — paga rendimiento sin comprar credibilidad.
   */
  const svgRef = useRef<SVGSVGElement>(null)
  usePointerParallax(svgRef)

  const base = ARQ_ESTRATOS[0]!
  const cima = ARQ_ESTRATOS[ARQ_ESTRATOS.length - 1]!

  return (
    <svg
      ref={svgRef}
      className="arq"
      viewBox={`0 0 ${ARQ_VIEWBOX.w} ${ARQ_VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Arquitectura Genesis: backend, infraestructura, inteligencia artificial, blockchain y aplicaciones"
      style={
        {
          '--arq-pulso-s': `${ARQ_PULSO_S}s`,
          '--arq-dato-s': `${ARQ_DATO_S}s`,
          '--arq-anillo-s': `${ARQ_ANILLO_S}s`,
          '--arq-escaneo-s': `${ARQ_ESCANEO_S}s`,
          '--arq-llegada-s': `${ARQ_LLEGADA_S}s`,
        } as React.CSSProperties
      }
    >
      <defs>
        {/* La corriente atraviesa un degradado real de abajo arriba. */}
        <linearGradient id={ID.columna} gradientUnits="userSpaceOnUse" x1={ARQ_EJE_X} y1={base.y} x2={ARQ_EJE_X} y2={ARQ_NUCLEO_Y}>
          <stop offset="0%" stopColor={EMISSION.violet} stopOpacity="0.9" />
          <stop offset="38%" stopColor={EMISSION.magenta} stopOpacity="0.95" />
          <stop offset="72%" stopColor={EMISSION.violetHi} stopOpacity="0.95" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="1" />
        </linearGradient>

        <radialGradient id={ID.suelo} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={EMISSION.violetHi} stopOpacity="0.22" />
          <stop offset="100%" stopColor={EMISSION.violetHi} stopOpacity="0" />
        </radialGradient>

        <radialGradient id={ID.nucleo} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={INK.base} stopOpacity="0.5" />
          <stop offset="55%" stopColor={EMISSION.cyan} stopOpacity="0.18" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0" />
        </radialGradient>

        {/*
          UN solo filtro para todo. Cada `filter` distinto es una pasada de
          compositing propia; cinco estratos con cinco filtros serian cinco
          superficies fuera de pantalla por cuadro.
        */}
        <filter id={ID.brillo} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* suelo: de donde emerge la maquina */}
      <g className="arq__capa arq__capa--fondo">
      <ellipse
        cx={ARQ_EJE_X}
        cy={base.y + base.rx * ARQ_APLANADO * 1.6}
        rx={base.rx * 1.5}
        ry={base.rx * ARQ_APLANADO * 0.9}
        fill={`url(#${ID.suelo})`}
        className="arq__suelo"
      />
      </g>

      {/* plano MEDIO: la maquina. Es el plano de referencia y el que menos se
          mueve; si el centro de la composicion viajara, mareria. */}
      <g className="arq__capa arq__capa--medio">

      {/* ── LA COLUMNA DE ENERGIA ─────────────────────────────────────── */}
      <g className="arq__columna">
        <line
          x1={ARQ_EJE_X} y1={base.y} x2={ARQ_EJE_X} y2={ARQ_NUCLEO_Y + 4}
          stroke={`url(#${ID.columna})`} strokeWidth="0.55" strokeLinecap="round"
          className="arq__conducto"
        />
        <line
          x1={ARQ_EJE_X} y1={base.y} x2={ARQ_EJE_X} y2={ARQ_NUCLEO_Y + 4}
          stroke={`url(#${ID.columna})`} strokeWidth="1.6" strokeLinecap="round"
          filter={`url(#${ID.brillo})`} className="arq__conducto-halo"
        />

        {/*
          LOS DATOS SUBEN. Un punto por tramo, misma duracion y distinto arranque.
          No se anima `stroke-dashoffset` —que repinta el trazo entero en cada
          cuadro y no lo compone el compositor—: se mueven cuerpos.
        */}
        {ARQ_DATOS.map((d, i) => (
          <circle key={`dato-${i}`} r="0.62" fill={d.color} className="arq__dato" filter={`url(#${ID.brillo})`}>
            <animateMotion
              dur={`${ARQ_DATO_S}s`}
              repeatCount="indefinite"
              path={`M${ARQ_EJE_X},${d.desde} L${ARQ_EJE_X},${d.hasta}`}
              begin={`-${d.retardo.toFixed(2)}s`}
              calcMode="linear"
            />
          </circle>
        ))}
      </g>

      {/* ── LOS CINCO ESTRATOS ────────────────────────────────────────── */}
      {ARQ_ESTRATOS.map((e) => {
        const ry = e.rx * ARQ_APLANADO
        const retardo = arqRetardo(e.orden)
        const puertos = arqPuertos(e.orden)
        const canto = 4.2
        const lecturaX = ARQ_EJE_X + e.rx + 4
        /*
         * El ancho de la placa sale del ROTULO, no del radio del anillo: 6,4 de
         * hueco para el glifo, 1,45 por caracter a font-size 2,2 con su espaciado,
         * y 3 de margen. Asi `IA` no arrastra el ancho de `INFRAESTRUCTURA`.
         */
        const anchoPlaca = 6.4 + e.label.length * 1.5 + 4.5

        return (
          <g
            key={e.id}
            className={`arq__estrato arq__estrato--${e.id}`}
            style={
              {
                '--capa-color': e.color,
                '--capa-retardo': `${retardo.toFixed(2)}s`,
              } as React.CSSProperties
            }
          >
            {/* el canto del modulo: dos elipses y una pared entre ellas */}
            <path
              className="arq__canto"
              d={`M${ARQ_EJE_X - e.rx},${e.y} A${e.rx},${ry} 0 0 0 ${ARQ_EJE_X + e.rx},${e.y}
                  L${ARQ_EJE_X + e.rx},${e.y - canto} A${e.rx},${ry} 0 0 1 ${ARQ_EJE_X - e.rx},${e.y - canto} Z`}
              fill={e.color}
              fillOpacity="0.1"
              stroke={e.color}
              strokeWidth="0.22"
            />

            {/* puertos del canto: lo que convierte una elipse en un modulo */}
            <g className="arq__puertos">
              {puertos.map((p, i) => {
                const x = ARQ_EJE_X + Math.cos(p.a) * e.rx
                const y = e.y - canto / 2 + Math.sin(p.a) * ry
                if (Math.sin(p.a) < -0.15) return null // los del lado oculto no se pintan
                return (
                  <rect
                    key={i}
                    x={x - 0.16} y={y - p.alto / 2} width="0.32" height={p.alto}
                    fill={e.color}
                    opacity={p.vivo ? 0.85 : 0.28}
                    className={p.vivo ? 'arq__puerto arq__puerto--vivo' : 'arq__puerto'}
                    style={{ animationDelay: `${(retardo + i * 0.13).toFixed(2)}s` } as React.CSSProperties}
                  />
                )
              })}
            </g>

            {/* tapa superior del modulo */}
            <ellipse
              cx={ARQ_EJE_X} cy={e.y - canto} rx={e.rx} ry={ry}
              fill="none" stroke={e.color} strokeWidth="0.3"
              className="arq__tapa" filter={`url(#${ID.brillo})`}
            />
            {/* anillo interior que gira: el modulo esta operando */}
            <ellipse
              cx={ARQ_EJE_X} cy={e.y - canto} rx={e.rx * 0.74} ry={ry * 0.74}
              fill="none" stroke={e.color} strokeWidth="0.18"
              strokeDasharray="1.6 2.4" opacity="0.5"
              className="arq__orbita"
            />

            {/* onda del autochequeo */}
            <ellipse
              cx={ARQ_EJE_X} cy={e.y - canto} rx={e.rx} ry={ry}
              fill="none" stroke={e.color} strokeWidth="0.4"
              className="arq__escaneo"
            />

            {/* placa con el rotulo */}
            {/*
              LA PLACA RESERVA SITIO PARA LAS DOS COSAS.

              Con `rx * 1.24` de ancho el rotulo mas largo —INFRAESTRUCTURA, 15
              caracteres— ocupaba casi la placa entera y se montaba encima del
              glifo. El ancho se mide desde el CONTENIDO, no desde el radio del
              anillo: cada rotulo pide lo suyo, y el estrecho no tiene por que
              heredar el hueco del ancho.
            */}
            <g className="arq__placa">
              <rect
                x={ARQ_EJE_X - anchoPlaca / 2} y={e.y - canto - 2.7}
                width={anchoPlaca} height="5.4" rx="2.7"
                fill="rgba(6,8,20,0.86)" stroke={e.color} strokeWidth="0.26"
              />
              <g className="arq__glifo" style={{ color: e.color }}
                 transform={`translate(${(ARQ_EJE_X - anchoPlaca / 2 + 1.5).toFixed(2)} ${(e.y - canto - 2.05).toFixed(2)}) scale(0.17)`}>
                <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round">
                  {GLIFOS[e.id]}
                </g>
              </g>
              <text
                className="arq__rotulo"
                x={ARQ_EJE_X - anchoPlaca / 2 + 6.4} y={e.y - canto + 0.05}
                fill={INK.base} textAnchor="start"
              >
                {e.label}
              </text>
            </g>

            {/* LECTURA — aparece al posarse sobre el estrato */}
            <g className="arq__lectura">
              <line
                x1={ARQ_EJE_X + e.rx}
                y1={e.y - canto}
                x2={lecturaX} y2={e.y - canto}
                stroke={e.color} strokeWidth="0.18"
              />
              <circle cx={lecturaX} cy={e.y - canto} r="0.7" fill={e.color} />
              <text
                className="arq__lectura-titulo"
                x={lecturaX + 2}
                y={e.y - canto - 1.6}
                fill={e.color}
                textAnchor="start"
              >
                {e.lectura}
              </text>
              {e.detalle.map((linea, i) => (
                <text
                  key={i}
                  className="arq__lectura-detalle"
                  x={lecturaX + 2}
                  y={e.y - canto + 1.5 + i * 2.4}
                  fill={INK.muted}
                  textAnchor="start"
                >
                  {linea}
                </text>
              ))}
            </g>
          </g>
        )
      })}

      {/*
        EL SOSTEN VA CON LA MAQUINA Y ACABA DENTRO DEL NUCLEO.
        Si terminara en el borde del hexagono, los pocos pixeles que el nucleo
        se adelanta en el paralaje abririan un hueco y la linea quedaria
        colgando en el aire. Metida bajo el cuerpo, el desfase no se ve.
      */}
      <line
        x1={ARQ_EJE_X} y1={cima.y - 4.2} x2={ARQ_EJE_X} y2={ARQ_NUCLEO_Y + 2}
        stroke={EMISSION.cyan} strokeWidth="0.3" opacity="0.5"
        className="arq__sosten"
      />
      </g>

      {/* ── NUCLEO GENESIS ───────────────────────────────────────────── */}
      <g className="arq__nucleo arq__capa arq__capa--frente">
        <circle cx={ARQ_EJE_X} cy={ARQ_NUCLEO_Y} r="9" fill={`url(#${ID.nucleo})`} className="arq__nucleo-halo" />
        <g className="arq__nucleo-cuerpo" filter={`url(#${ID.brillo})`}>
          <path
            d={`M${ARQ_EJE_X},${ARQ_NUCLEO_Y - 5} L${ARQ_EJE_X + 4.4},${ARQ_NUCLEO_Y - 2.5} L${ARQ_EJE_X + 4.4},${ARQ_NUCLEO_Y + 2.5} L${ARQ_EJE_X},${ARQ_NUCLEO_Y + 5} L${ARQ_EJE_X - 4.4},${ARQ_NUCLEO_Y + 2.5} L${ARQ_EJE_X - 4.4},${ARQ_NUCLEO_Y - 2.5} Z`}
            fill="rgba(6,8,20,0.7)" stroke={EMISSION.cyan} strokeWidth="0.34"
          />
          <text className="arq__nucleo-marca" x={ARQ_EJE_X} y={ARQ_NUCLEO_Y + 1.5} fill={EMISSION.cyan} textAnchor="middle">
            G
          </text>
        </g>
      </g>

    </svg>
  )
}
