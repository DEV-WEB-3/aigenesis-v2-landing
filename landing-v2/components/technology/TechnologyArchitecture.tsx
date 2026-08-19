'use client'

import { useId, useRef } from 'react'
import { EMISSION, INK } from '@/lib/design/tokens'
import { usePointerParallax } from '@/hooks/usePointerParallax'
import ArqSuelo from '@/components/technology/arq/ArqSuelo'
import ArqNucleo from '@/components/technology/arq/ArqNucleo'
import ArqHuds from '@/components/technology/arq/ArqHuds'
import ArqSubsistema from '@/components/technology/arq/ArqSubsistema'
import {
  ARQ_VIEWBOX,
  ARQ_EJE_X,
  ARQ_ESTRATOS,
  ARQ_CANTO,
  ARQ_NUCLEO_Y,
  ARQ_NUCLEO_R,
  ARQ_NUCLEO_S,
  ARQ_DATOS,
  ARQ_PULSO_S,
  ARQ_DATO_S,
  ARQ_ANILLO_S,
  ARQ_LLEGADA_S,
  ARQ_CICLO_S,
  ARQ_CICLO_PASO_S,
  ARQ_RESPUESTA_S,
  ARQ_BOOT,
  ARQ_TOTAL,
  arqRetardo,
  arqPuertos,
  arqVentanillas,
  arqInterludio,
  arqTapaY,
  arqRy,
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

/**
 * LA MAQUINA GENESIS.
 *
 * Cinco modulos con cuerpo, maquinaria propia y su reloj; una columna de
 * energia que los atraviesa; un nucleo que los alimenta; y una placa base que
 * lo ancla todo. La geometria vive en `lib/technology/techArchitecture.ts` y
 * cada subsistema en su componente: aqui solo se COMPONE, que es lo unico que
 * hace legible un SVG de este tamano.
 *
 * ORDEN DE PINTADO = ORDEN DE PROFUNDIDAD. En SVG no hay z-index: lo ultimo
 * escrito queda delante. Los estratos se recorren de abajo arriba, que ademas
 * es el orden narrativo del arranque, asi que la misma iteracion resuelve la
 * oclusion y la cascada.
 */
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
    halo: `arq-halo-${uid}`,
    emision: `arq-emi-${uid}`,
    barrido: `arq-barr-${uid}`,
  }

  /*
   * PROFUNDIDAD POR PARALAJE. Tres planos, no seis: cada plano extra es otra
   * capa de compositing por cuadro, y a partir del tercero el ojo ya no
   * distingue el escalon — paga rendimiento sin comprar credibilidad.
   */
  const svgRef = useRef<SVGSVGElement>(null)
  usePointerParallax(svgRef)

  const base = ARQ_ESTRATOS[0]!
  const cima = ARQ_ESTRATOS[ARQ_TOTAL - 1]!
  const columnaTope = ARQ_NUCLEO_Y + 3

  return (
    <svg
      ref={svgRef}
      className="arq"
      viewBox={`0 0 ${ARQ_VIEWBOX.w} ${ARQ_VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Arquitectura Genesis: backend, infraestructura, inteligencia artificial, blockchain y aplicaciones, alimentadas por un nucleo central"
      style={
        {
          '--arq-pulso-s': `${ARQ_PULSO_S}s`,
          '--arq-dato-s': `${ARQ_DATO_S}s`,
          '--arq-anillo-s': `${ARQ_ANILLO_S}s`,
          '--arq-llegada-s': `${ARQ_LLEGADA_S}s`,
          '--arq-ciclo-s': `${ARQ_CICLO_S}s`,
          '--arq-nucleo-s': `${ARQ_NUCLEO_S}s`,
          '--arq-respuesta-s': `${ARQ_RESPUESTA_S}s`,
          '--arq-huds-retardo': `${ARQ_BOOT.huds}s`,
          '--arq-lecturas-retardo': `${ARQ_BOOT.lecturas}s`,
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

        <radialGradient id={ID.barrido} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={EMISSION.violetHi} stopOpacity="0.2" />
          <stop offset="100%" stopColor={EMISSION.violetHi} stopOpacity="0" />
        </radialGradient>

        <radialGradient id={ID.halo} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={INK.base} stopOpacity="0.34" />
          <stop offset="42%" stopColor={EMISSION.cyan} stopOpacity="0.16" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0" />
        </radialGradient>

        <radialGradient id={ID.emision} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor={EMISSION.cyan} stopOpacity="0" />
          <stop offset="85%" stopColor={EMISSION.cyan} stopOpacity="0.3" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0" />
        </radialGradient>

        {/*
          UN solo filtro para todo. Cada `filter` distinto es una pasada de
          compositing propia; cinco estratos con cinco filtros serian cinco
          superficies fuera de pantalla por cuadro. El concepto pide brillo, no
          bloom: el resplandor va en los BORDES, y para eso basta uno.
        */}
        <filter id={ID.brillo} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ══ PLANO DE FONDO — la placa base ═══════════════════════════════ */}
      <g className="arq__capa arq__capa--fondo">
        <ArqSuelo idBarrido={ID.barrido} />
      </g>

      {/* ══ PLANO MEDIO — la maquina. Es el plano de referencia. ═════════ */}
      <g className="arq__capa arq__capa--medio">

        {/* ── LA COLUMNA DE ENERGIA ─────────────────────────────────── */}
        <g className="arq__columna">
          {/* aura: el volumen de la corriente */}
          <line
            x1={ARQ_EJE_X} y1={base.y} x2={ARQ_EJE_X} y2={columnaTope}
            stroke={`url(#${ID.columna})`} strokeWidth="1.8" strokeLinecap="round"
            filter={`url(#${ID.brillo})`} className="arq__conducto-halo"
          />
          {/* haz: el nucleo del rayo, fino y brillante */}
          <line
            x1={ARQ_EJE_X} y1={base.y} x2={ARQ_EJE_X} y2={columnaTope}
            stroke={`url(#${ID.columna})`} strokeWidth="0.5" strokeLinecap="round"
            className="arq__conducto"
          />
          {/*
            LINEAS DE BARRIDO. Un trazo discontinuo cuyo `stroke-dashoffset` se
            desplaza: es la unica propiedad de trazo que el concepto autoriza
            animar, y aqui gana a mover cuerpos porque son DECENAS de marcas
            —animarlas por separado costaria decenas de nodos y aqui cuesta uno.
          */}
          <line
            x1={ARQ_EJE_X} y1={base.y} x2={ARQ_EJE_X} y2={columnaTope}
            stroke={INK.base} strokeWidth="0.9" strokeDasharray="0.5 3.5"
            opacity="0.3" className="arq__conducto-scan"
          />

          {/*
            LOS DATOS SUBEN. Un cuerpo por tramo, misma duracion y distinto
            arranque. Se mueven cuerpos y no se repinta el trazo entero.
          */}
          {ARQ_DATOS.map((d, i) => (
            <circle key={`dato-${i}`} r="0.6" fill={d.color} className="arq__dato" filter={`url(#${ID.brillo})`}>
              <animateMotion
                dur={`${ARQ_DATO_S}s`}
                repeatCount="indefinite"
                path={`M${ARQ_EJE_X},${d.desde} L${ARQ_EJE_X},${d.hasta}`}
                begin={`-${d.retardo.toFixed(2)}s`}
                calcMode="linear"
              />
            </circle>
          ))}

          {/*
            LA RESPUESTA BAJA. Sin ella el sistema es una flecha: todo sube y
            nada contesta, que es un diagrama de flujo y no una maquina. Ocurre
            una vez cada 16 s y tarda 2,4 en recorrerlo —el resto del ciclo se
            queda quieta en el extremo, apagada, por `keyTimes`—: un evento, no
            un estado.
          */}
          <circle r="0.5" fill={EMISSION.cyan} className="arq__dato-baja">
            <animateMotion
              dur={`${ARQ_RESPUESTA_S}s`}
              repeatCount="indefinite"
              calcMode="linear"
              keyTimes="0;0.15;1"
              keyPoints="0;1;1"
              path={`M${ARQ_EJE_X},${cima.y} L${ARQ_EJE_X},${base.y}`}
            />
          </circle>
        </g>

        {/* ── ESTRUCTURAS SUSPENDIDAS entre modulos ─────────────────── */}
        <g className="arq__interludios" aria-hidden="true">
          {Array.from({ length: ARQ_TOTAL - 1 }, (_, i) =>
            arqInterludio(i).map((b, k) => (
              <g key={`int-${i}-${k}`} className="arq__interludio"
                 style={{ animationDelay: `${b.retardo.toFixed(2)}s` }}>
                <rect x={b.x - b.w / 2} y={b.y - b.h / 2} width={b.w} height={b.h} rx="0.16"
                      fill={b.color} fillOpacity="0.2" stroke={b.color} strokeWidth="0.1" />
                <line x1={b.x + b.w / 2} y1={b.y} x2={ARQ_EJE_X} y2={b.y}
                      stroke={b.color} strokeWidth="0.08" opacity="0.28" />
              </g>
            ))
          )}
        </g>

        {/* ── LOS CINCO MODULOS ─────────────────────────────────────── */}
        {ARQ_ESTRATOS.map((e) => {
          const ry = arqRy(e.rx)
          const tapa = arqTapaY(e)
          const retardo = arqRetardo(e.orden)
          const puertos = arqPuertos(e.orden, 14)
          const ventanas = arqVentanillas(e.orden)
          const lecturaX = ARQ_EJE_X + e.rx + 4
          /*
           * El ancho de la placa sale del ROTULO, no del radio del anillo: 6,4
           * de hueco para el glifo, 1,5 por caracter a font-size 2,2 con su
           * espaciado, y 4,5 de margen. Asi `IA` no arrastra el ancho de
           * `INFRAESTRUCTURA`, que con `rx * 1,24` ocupaba la placa entera y se
           * montaba sobre su propio glifo.
           */
          const anchoPlaca = 5.9 + e.label.length * 1.5 + 4.2

          return (
            <g
              key={e.id}
              className={`arq__estrato arq__estrato--${e.id}`}
              style={
                {
                  '--capa-color': e.color,
                  '--capa-color-alt': e.colorAlt,
                  '--capa-retardo': `${retardo.toFixed(2)}s`,
                  '--capa-latido': `${e.latido}s`,
                  // el latido del SISTEMA sube de abajo arriba: 0,3 s por escalon
                  '--capa-ciclo-retardo': `${(e.orden * ARQ_CICLO_PASO_S).toFixed(2)}s`,
                  /*
                   * Donde va el glifo CUANDO NO HAY PLACA (movil).
                   *
                   * En movil el rotulo cae a 5 px —ilegible— y una pastilla con
                   * texto que no se lee, detras de un parrafo, es ruido puro. El
                   * concepto solo pide conservar color, cuerpo, pulso e ICONO,
                   * asi que se queda el icono y centrado sobre la plataforma.
                   *
                   * La posicion viaja como variable porque depende del ancho de
                   * la placa, que es distinto en cada capa: el CSS no puede
                   * calcularla y la alternativa seria duplicar nodos por
                   * breakpoint.
                   */
                  '--glifo-cx': `${(ARQ_EJE_X - 3.84).toFixed(2)}px`,
                  '--glifo-cy': `${(tapa - 3.84).toFixed(2)}px`,
                } as React.CSSProperties
              }
            >
              {/* pared lateral: dos elipses y el volumen entre ellas */}
              <path
                className="arq__canto"
                d={`M${ARQ_EJE_X - e.rx},${e.y} A${e.rx},${ry} 0 0 0 ${ARQ_EJE_X + e.rx},${e.y}
                    L${ARQ_EJE_X + e.rx},${tapa} A${e.rx},${ry} 0 0 1 ${ARQ_EJE_X - e.rx},${tapa} Z`}
                fill={e.color}
                fillOpacity="0.1"
                stroke={e.color}
                strokeWidth="0.22"
              />

              {/*
                VENTANILLAS DE LA PARED. Son lo que hace percibir GROSOR: sin
                ellas la pared es una banda de color y el modulo vuelve a leerse
                como una silueta. Solo en el arco frontal — las de detras las
                taparia la propia pared.
              */}
              <g className="arq__ventanillas">
                {ventanas.map((v, i) => {
                  const x = ARQ_EJE_X + Math.cos(v.a) * e.rx
                  const y = e.y - ARQ_CANTO / 2 + Math.sin(v.a) * ry
                  return (
                    <rect
                      key={i}
                      x={x - v.ancho / 2} y={y - v.alto / 2}
                      width={v.ancho} height={v.alto} rx="0.12"
                      fill={e.colorAlt}
                      opacity={v.encendida ? 0.5 : 0.16}
                      className={v.encendida ? 'arq__ventanilla arq__ventanilla--viva' : 'arq__ventanilla'}
                      style={v.encendida ? { animationDelay: `${(retardo + i * 0.21).toFixed(2)}s` } : undefined}
                    />
                  )
                })}
              </g>

              {/* puertos: indicadores del canto */}
              <g className="arq__puertos">
                {puertos.map((p, i) => {
                  if (Math.sin(p.a) < -0.15) return null // los del lado oculto no se pintan
                  const x = ARQ_EJE_X + Math.cos(p.a) * e.rx
                  const y = e.y - ARQ_CANTO / 2 + Math.sin(p.a) * ry
                  return (
                    <rect
                      key={i}
                      x={x - 0.14} y={y - p.alto / 2} width="0.28" height={p.alto}
                      fill={e.color}
                      opacity={p.vivo ? 0.85 : 0.28}
                      className={p.vivo ? 'arq__puerto arq__puerto--vivo' : 'arq__puerto'}
                      style={{ animationDelay: `${(retardo + i * 0.13).toFixed(2)}s` }}
                    />
                  )
                })}
              </g>

              {/* superficie del modulo */}
              <ellipse
                cx={ARQ_EJE_X} cy={tapa} rx={e.rx} ry={ry}
                fill={e.color} fillOpacity="0.05"
                stroke={e.color} strokeWidth="0.3"
                className="arq__tapa" filter={`url(#${ID.brillo})`}
              />
              {/* anillo interior que gira: el modulo esta operando */}
              <ellipse
                cx={ARQ_EJE_X} cy={tapa} rx={e.rx * 0.9} ry={ry * 0.9}
                fill="none" stroke={e.color} strokeWidth="0.16"
                strokeDasharray="1.6 2.4" opacity="0.45"
                className="arq__orbita"
              />

              {/* LA MAQUINARIA — lo que identifica la capa sin leer el rotulo */}
              <ArqSubsistema e={e} idBrillo={ID.brillo} />

              {/*
                EL LATIDO DEL SISTEMA. Un aro que se expande cuando la orden del
                nucleo llega a este modulo. Retardado 0,3 s por escalon, asi que
                recorre los cinco de abajo arriba en 1,2 s dentro de un ciclo de
                8: el 85 % del tiempo no existe.
              */}
              <ellipse
                cx={ARQ_EJE_X} cy={tapa} rx={e.rx} ry={ry}
                fill="none" stroke={e.colorAlt} strokeWidth="0.44"
                className="arq__latido"
              />

              {/* placa con el rotulo */}
              {/*
                LA PLACA SUBE 0,8 Y ADELGAZA A 4,2.

                Medido con la placa centrada en la tapa: tapaba 11 de las 16
                piezas de APLICACIONES y 8 de las 19 de INFRAESTRUCTURA, varias
                por completo. En un anillo estrecho la placa ocupa el 80 % del
                ancho, asi que no bastaba con mover la maquinaria: habia que
                devolverle el frente de la plataforma.

                No sube mas porque enfrente tiene el limite contrario — el
                anillo de arriba, cuya pared la taparia. 0,8 es lo que cabe
                entre los dos, no una preferencia.
              */}
              <g className="arq__placa">
                <rect
                  x={ARQ_EJE_X - anchoPlaca / 2} y={tapa - 2.9}
                  width={anchoPlaca} height="4.2" rx="2.1"
                  fill="rgba(6,8,20,0.9)" stroke={e.color} strokeWidth="0.26"
                />
                <g className="arq__glifo" style={{ color: e.color }}
                   transform={`translate(${(ARQ_EJE_X - anchoPlaca / 2 + 1.5).toFixed(2)} ${(tapa - 2.35).toFixed(2)}) scale(0.15)`}>
                  <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" strokeLinecap="round">
                    {GLIFOS[e.id]}
                  </g>
                </g>
                <text
                  className="arq__rotulo"
                  x={ARQ_EJE_X - anchoPlaca / 2 + 5.9} y={tapa - 0.75}
                  fill={INK.base} textAnchor="start"
                >
                  {e.label}
                </text>
              </g>

              {/*
                LECTURA — aparece al posarse sobre el estrato.

                TODAS a la derecha, y no es preferencia estetica: alternando
                lados, las de la izquierda se metian 16 y 2 px DENTRO del texto
                pintado de la columna. A la derecha el choque no es improbable,
                es imposible — entre el texto y el eje queda el ancho entero de
                la maquina.
              */}
              {/*
                EL CONTRATO LLEGA A SU CAPA.

                Al posarse sobre la direccion del smart contract en la columna
                de texto, este cuerpo viaja hasta el anillo de blockchain y el
                anillo responde. Es la unica relacion explicita entre el marco
                teorico y el dibujo, y existe porque esa direccion no es un dato
                decorativo: es el contrato que ESTA capa valida.

                Sale del borde izquierdo del anillo y no del texto porque el
                texto vive fuera de este SVG; cruzar la frontera pediria un
                segundo sistema de coordenadas, que es exactamente lo que se
                evito montandolo todo en un solo lienzo.
              */}
              {e.id === 'blockchain' && (
                <circle
                  cx={ARQ_EJE_X - e.rx} cy={tapa} r="0.7"
                  fill={e.colorAlt} className="arq__sc-pulso"
                />
              )}

              <g className="arq__lectura">
                <line
                  x1={ARQ_EJE_X + e.rx} y1={tapa}
                  x2={lecturaX} y2={tapa}
                  stroke={e.color} strokeWidth="0.18" className="arq__lectura-guia"
                />
                <circle cx={lecturaX} cy={tapa} r="0.7" fill={e.color} className="arq__lectura-nodo" />
                <circle cx={lecturaX} cy={tapa} r="1.4" fill="none" stroke={e.color}
                        strokeWidth="0.16" className="arq__lectura-aro" />
                <text
                  className="arq__lectura-titulo"
                  x={lecturaX + 2.4} y={tapa - 1.6}
                  fill={e.color} textAnchor="start"
                >
                  {e.lectura}
                </text>
                {e.detalle.map((linea, i) => (
                  <text
                    key={i}
                    className="arq__lectura-detalle"
                    x={lecturaX + 2.4} y={tapa + 1.5 + i * 2.4}
                    fill={INK.muted} textAnchor="start"
                  >
                    {linea}
                  </text>
                ))}
              </g>
            </g>
          )
        })}

        {/*
          EL SOSTEN VA CON LA MAQUINA Y ACABA DENTRO DEL NUCLEO. Si terminara en
          el borde de la camara, los pocos pixeles que el nucleo se adelanta en
          el paralaje abririan un hueco y la linea quedaria colgando en el aire.
        */}
        <line
          x1={ARQ_EJE_X} y1={arqTapaY(cima)} x2={ARQ_EJE_X} y2={ARQ_NUCLEO_Y + ARQ_NUCLEO_R * 0.4}
          stroke={EMISSION.cyan} strokeWidth="0.3" opacity="0.5"
          className="arq__sosten"
        />
      </g>

      {/* ══ PLANO DE FRENTE — nucleo y producto ══════════════════════════ */}
      <g className="arq__capa arq__capa--frente">
        <ArqNucleo idHalo={ID.halo} idOrbita={ID.emision} />
        <ArqHuds />
      </g>
    </svg>
  )
}
