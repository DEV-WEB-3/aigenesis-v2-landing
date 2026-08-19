'use client'

import { useT } from '@/context/IdiomaContext'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ANILLO,
  CAMPO,
  PILARES,
  barrido,
  enlacePilar,
  porcentaje,
  posicionPilar,
  type PilarId,
} from '@/lib/trust/scanFieldLayout'
import { llegadaDe, pulsoDe, respiracionDe } from '@/lib/design/motion'
import TrustPillarIcon from '@/components/trust/TrustPillarIcon'
import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

/**
 * EL ESCANEO — la estructura de Confianza se revela al alumbrarla.
 *
 * La seccion afirma «infraestructura verificable». Con esto, «verificable» deja
 * de ser un adjetivo y pasa a ser lo que el visitante HACE: el campo empieza
 * casi invisible y su puntero es la linterna.
 *
 * POR QUE NO DEPENDE DEL RATON
 * ----------------------------
 * Un gesto que solo funciona con puntero deja la seccion vacia en movil y para
 * quien navega con teclado — o sea, deja vacia la seccion que habla de
 * confianza. Asi que hay tres caminos al mismo sitio:
 *
 *   puntero    la luz sigue al cursor
 *   teclado    al enfocar un pilar, la luz salta a el
 *   ninguno    la luz recorre el anillo sola, un ciclo por respiracion
 *
 * El barrido automatico no es un respaldo degradado: es el estado por defecto, y
 * el puntero solo lo toma prestado mientras esta dentro.
 */
export default function TrustScanField({ isActive }: { isActive: boolean }) {
  const campoRef = useRef<HTMLDivElement>(null)
  const [manual, setManual] = useState(false)
  const [enfocado, setEnfocado] = useState<PilarId | null>(null)
  const manualRef = useRef(false)
  const cuadroRef = useRef<number>(0)

  /** Mueve la luz. Se escribe en el DOM, no en el estado: corre por cuadro. */
  const alumbrar = useCallback((mx: number, my: number) => {
    const el = campoRef.current
    if (!el) return
    el.style.setProperty('--luz-x', `${mx.toFixed(2)}%`)
    el.style.setProperty('--luz-y', `${my.toFixed(2)}%`)
  }, [])

  /**
   * El barrido. Arranca en cuanto la seccion esta viva y se detiene al salir
   * de ella: un requestAnimationFrame corriendo en una seccion que nadie ve es
   * bateria regalada, y este portal tiene catorce.
   */
  useEffect(() => {
    if (!isActive) return
    const lento =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (lento) {
      // Sin movimiento, la luz se queda en el centro y el campo se ve entero:
      // el escaneo es un adorno, la informacion no puede depender de el.
      alumbrar(50, (CAMPO.cy / CAMPO.alto) * 100)
      return
    }

    const ciclo = respiracionDe('trust') * 1000
    const inicio = performance.now()
    const paso = (t: number) => {
      if (!manualRef.current) {
        const { mx, my } = barrido((((t - inicio) % ciclo) / ciclo))
        alumbrar(mx, my)
      }
      cuadroRef.current = requestAnimationFrame(paso)
    }
    cuadroRef.current = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(cuadroRef.current)
  }, [isActive, alumbrar])

  const alMover = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = campoRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      manualRef.current = true
      setManual(true)
      alumbrar(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100)
    },
    [alumbrar],
  )

  const alSalir = useCallback(() => {
    manualRef.current = false
    setManual(false)
  }, [])

  /** Al enfocar con teclado, la luz VIAJA al pilar: el foco manda sobre todo. */
  const alEnfocar = useCallback(
    (id: PilarId, angulo: number) => {
      const { x, y } = posicionPilar(angulo)
      manualRef.current = true
      setManual(true)
      setEnfocado(id)
      alumbrar((x / CAMPO.ancho) * 100, (y / CAMPO.alto) * 100)
    },
    [alumbrar],
  )

  // Gate PEGAJOSO, no `isActive` a secas. El motivo, medido, esta en
  // `useSectionVisualActive`: con el prop crudo el visual desaparecia
  // mientras la seccion estaba a la vista.
  const visible = useSectionVisualActive(isActive)
  if (!visible) return null

  const vb = `0 0 ${CAMPO.ancho} ${CAMPO.alto}`

  return (
    <div
      ref={campoRef}
      className={`trust-scan${manual ? ' trust-scan--manual' : ''}`}
      style={
        {
          '--scan-pulso': `${pulsoDe('trust')}s`,
          '--scan-respiracion': `${respiracionDe('trust')}s`,
          '--scan-llegada': `${llegadaDe('trust')}s`,
        } as React.CSSProperties
      }
      onPointerMove={alMover}
      onPointerLeave={alSalir}
    >
      {/*
        DOS COPIAS DEL MISMO CAMPO.

        La de abajo esta al 5 % y no se toca nunca: es la que dice «aqui hay
        algo» y evita que la seccion parezca rota antes de que nadie mueva el
        raton. La de arriba lleva la mascara y es la que se revela.

        Duplicar el marcado es el precio de que la mascara solo afecte a una
        capa. La alternativa —una sola capa con la mascara— deja la seccion
        completamente negra alrededor de la luz, y eso se lee como fallo, no
        como intencion.
      */}
      <div className="trust-scan__capa trust-scan__capa--fantasma" aria-hidden="true">
        <CampoDibujado vb={vb} />
      </div>

      <div className="trust-scan__capa trust-scan__capa--viva">
        <CampoDibujado vb={vb} enfocado={enfocado} interactivo onEnfocar={alEnfocar} onDesenfocar={() => { setEnfocado(null); alSalir() }} />
      </div>

      <span className="trust-scan__linterna" aria-hidden="true" />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */

function CampoDibujado({
  vb,
  enfocado,
  interactivo = false,
  onEnfocar,
  onDesenfocar,
}: {
  vb: string
  enfocado?: PilarId | null
  interactivo?: boolean
  onEnfocar?: (id: PilarId, angulo: number) => void
  onDesenfocar?: () => void
}) {
  const t = useT()
  return (
    <div className="lienzo-apaisado">
      <svg viewBox={vb} preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="trust-scan__svg">
        {/* las tres orbitas, en la escalera de paralaje del portal */}
        <ellipse className="trust-scan__orbita trust-scan__orbita--fondo" cx={CAMPO.cx} cy={CAMPO.cy} rx={ANILLO.rx} ry={ANILLO.ry} />
        <ellipse className="trust-scan__orbita trust-scan__orbita--medio" cx={CAMPO.cx} cy={CAMPO.cy} rx={ANILLO.rx * 0.78} ry={ANILLO.ry * 0.78} />
        <ellipse className="trust-scan__orbita trust-scan__orbita--frente" cx={CAMPO.cx} cy={CAMPO.cy} rx={ANILLO.rx * 0.56} ry={ANILLO.ry * 0.56} />

        {/* dos trazas inclinadas: dan volumen sin competir con las orbitas */}
        <ellipse className="trust-scan__traza" cx={CAMPO.cx} cy={CAMPO.cy} rx={52} ry={30} transform={`rotate(-18 ${CAMPO.cx} ${CAMPO.cy})`} />
        <ellipse className="trust-scan__traza" cx={CAMPO.cx} cy={CAMPO.cy} rx={52} ry={30} transform={`rotate(18 ${CAMPO.cx} ${CAMPO.cy})`} />

        {PILARES.map((p) => (
          <path
            key={p.id}
            className={`trust-scan__enlace${enfocado === p.id ? ' trust-scan__enlace--vivo' : ''}`}
            d={enlacePilar(p.angulo)}
            style={{ '--tono': p.color } as React.CSSProperties}
          />
        ))}
      </svg>

      {/* el nucleo: pila de laminas, haz vertical y el aro del logo encima */}
      <div className="trust-scan__nucleo" aria-hidden="true">
        <span className="trust-scan__lamina trust-scan__lamina--1" />
        <span className="trust-scan__lamina trust-scan__lamina--2" />
        <span className="trust-scan__lamina trust-scan__lamina--3" />
        <span className="trust-scan__lamina trust-scan__lamina--4" />
        <span className="trust-scan__haz" />
        <span className="trust-scan__aro" />
      </div>

      {PILARES.map((p) => {
        const { x, y } = posicionPilar(p.angulo)
        const sitio = porcentaje(x, y)
        /**
         * El rotulo se ancla EN el pilar; la direccion la decide el CSS.
         *
         * Antes el desplazamiento iba en el `left/top` en linea, y eso lo dejaba
         * fuera del alcance de las consultas de contenedor. Medido en el hueco
         * real: la columna de texto acaba en x=879 y el pilar izquierdo esta en
         * x=899, asi que quedan VEINTE pixeles para un rotulo. A los lados no
         * cabe, y con la posicion cocida en linea no habia forma de moverlo.
         */
        const Etiqueta = interactivo ? 'button' : 'div'
        /** Mitad del anillo: decide si el rotulo sube o baja cuando no cabe al lado. */
        const mitad = y < CAMPO.cy ? 'alta' : 'baja'

        return (
          <div key={p.id} className="trust-scan__pilar-grupo" style={{ '--tono': p.color } as React.CSSProperties}>
            <Etiqueta
              className="trust-scan__pilar"
              style={sitio}
              data-pilar={p.id}
              {...(interactivo
                ? {
                    type: 'button' as const,
                    'aria-label': `${t(p.titulo)}. ${t(p.descripcion)}`,
                    onFocus: () => onEnfocar?.(p.id, p.angulo),
                    onBlur: () => onDesenfocar?.(),
                    onPointerEnter: () => onEnfocar?.(p.id, p.angulo),
                  }
                : { 'aria-hidden': true as const })}
            >
              <span className="trust-scan__pilar-aro" />
              <TrustPillarIcon id={p.id} />
            </Etiqueta>

            <div
              className={`trust-scan__rotulo trust-scan__rotulo--${p.lado}`}
              data-mitad={mitad}
              style={sitio}
              aria-hidden="true"
            >
              <b>{t(p.titulo)}</b>
              <span>{t(p.descripcion)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
