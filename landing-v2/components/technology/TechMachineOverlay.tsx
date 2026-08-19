'use client'

import { useT } from '@/context/IdiomaContext'
import type { Ancla } from '@/components/technology/webgl/TechMachineCanvas'
import { CAPAS_3D } from '@/lib/technology/techMachine3d'

/** Glifo de cada capa. Trazo y `fill="none"`: el defecto de `fill` es NEGRO. */
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
 * EL TEXTO DE LA MAQUINA — en DOM, sobre el lienzo.
 *
 * POR QUE NO VA DENTRO DEL 3D
 * ---------------------------
 * Texto dentro de una textura de WebGL pierde nitidez en cuanto la camara no
 * lo mira de frente, no lo lee un lector de pantalla, no se puede seleccionar
 * ni buscar, y hay que regenerar la textura entera para cambiar una palabra.
 * En DOM es tipografia real: nitida a cualquier densidad de pantalla, en el
 * arbol de accesibilidad y traducible.
 *
 * COMO SE MANTIENE PEGADO A LA GEOMETRIA
 * --------------------------------------
 * No con porcentajes calibrados a ojo —que se descuelgan al primer cambio de
 * proporcion—, sino con las posiciones PROYECTADAS por la misma camara que
 * dibuja la escena. Mientras no lleguen, no se pinta nada: media lectura
 * colocada en el sitio equivocado durante dos cuadros se ve, y se ve mal.
 */
export default function TechMachineOverlay({ anclas }: { anclas: Ancla[] }) {
  const t = useT()
  if (!anclas.length) return null
  const porId = new Map(anclas.map((a) => [a.id, a]))

  return (
    <div className="maq-overlay" aria-hidden="true">
      {/*
        LAS GUIAS van en un SVG estirado, con `preserveAspectRatio="none"` para
        que sus coordenadas SEAN los porcentajes que devuelve la proyeccion. El
        estirado deformaria el grosor del trazo, y por eso lleva
        `vector-effect="non-scaling-stroke"`: el grosor se mide en pixeles de
        pantalla y no lo toca la deformacion.
      */}
      <svg className="maq-guias" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CAPAS_3D.map((capa) => {
          const a = porId.get(capa.id)
          if (!a) return null
          const izq = capa.lado === 'izq'
          const p0 = izq ? a.izq : a.der
          const dir = izq ? -1 : 1
          const codo = { x: p0.x + dir * 1.8, y: p0.y - 4.5 }
          const fin = { x: p0.x + dir * 4.2, y: codo.y }
          return (
            <g key={capa.id} className={`maq-guia maq-guia--${capa.id}`}>
              <polyline
                points={`${p0.x},${p0.y} ${codo.x},${codo.y} ${fin.x},${codo.y}`}
                fill="none"
                stroke={capa.color}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                opacity="0.75"
              />
              <circle cx={p0.x} cy={p0.y} r="0.5" fill={capa.color} vectorEffect="non-scaling-stroke" />
            </g>
          )
        })}
      </svg>

      {/* ── ROTULOS: la pastilla sobre el frente de cada anillo ──────── */}
      {CAPAS_3D.map((capa) => {
        const a = porId.get(capa.id)
        if (!a) return null
        return (
          <div
            key={capa.id}
            className="maq-rotulo"
            style={{
              left: `${a.frente.x}%`,
              top: `${a.frente.y}%`,
              '--capa-color': capa.color,
              '--capa-retardo': `${(0.15 + capa.orden * 0.15).toFixed(2)}s`,
            } as React.CSSProperties}
          >
            <span className="maq-rotulo__icono">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                {GLIFOS[capa.id]}
              </svg>
            </span>
            <span className="maq-rotulo__texto">{t(capa.label)}</span>
          </div>
        )
      })}

      {/* ── LECTURAS: repartidas a los dos lados, como en la referencia ─ */}
      {CAPAS_3D.map((capa) => {
        const a = porId.get(capa.id)
        if (!a) return null
        const izq = capa.lado === 'izq'
        const p0 = izq ? a.izq : a.der
        /*
         * SE ANCLAN POR EL BORDE QUE NO PUEDE SALIRSE, y el ancho maximo se
         * CALCULA del sitio que queda.
         *
         * El primer intento las colocaba con `left` mas un desplazamiento fijo
         * y las de la izquierda se traian hacia atras con `translateX(-100%)`.
         * Como el ancho lo decide el texto, el borde izquierdo caia donde
         * cayera: medido, se salian 62 px del lienzo y se metian 107 px dentro
         * del parrafo de la columna.
         *
         * Anclando la de la izquierda por su DERECHA y la de la derecha por su
         * IZQUIERDA, el borde libre es el unico que puede moverse — y como el
         * ancho maximo sale del hueco que queda hasta el borde del lienzo, no
         * hay tamano de ventana en el que se pueda salir. Es un limite
         * geometrico, no un valor afinado contra una captura.
         */
        const OFF = 4.5
        /*
         * MARGEN DE 4 %, no de 1. El lienzo empieza a la izquierda antes de que
         * acabe el texto de la columna —la rejilla los solapa—, asi que quedarse
         * pegado al borde del lienzo no basta: medido, las lecturas de la
         * izquierda seguian entrando 46 px en el parrafo. Cuatro puntos de
         * margen las devuelven al hueco util y cuestan ~24 px de ancho, que el
         * texto absorbe con una linea mas.
         */
        const MARGEN = 4
        const estilo: React.CSSProperties = izq
          ? { right: `${100 - (p0.x - OFF)}%`, maxWidth: `${Math.max(10, p0.x - OFF - MARGEN)}%` }
          : { left: `${p0.x + OFF}%`, maxWidth: `${Math.max(10, 100 - p0.x - OFF - MARGEN)}%` }
        return (
          <div
            key={capa.id}
            className={`maq-lectura maq-lectura--${izq ? 'izq' : 'der'}`}
            style={{
              ...estilo,
              top: `${p0.y - 4.5}%`,
              '--capa-color': capa.color,
              '--capa-retardo': `${(1.3 + capa.orden * 0.08).toFixed(2)}s`,
            } as React.CSSProperties}
          >
            <span className="maq-lectura__titulo">{t(capa.lectura)}</span>
            <span className="maq-lectura__linea">{t(capa.detalle)}</span>
          </div>
        )
      })}

      {/*
        ── MODULOS FLOTANTES ─────────────────────────────────────────

        DOS, no tres. El tercero —una tarjeta de wallet a media altura— se
        solapaba con la lectura de BLOCKCHAIN, y ademas la referencia solo tiene
        dos: el panel de metricas y el movil. Un modulo que hay que colocar
        esquivando texto es un modulo que sobra.

        Son lo que la capa de APLICACIONES produce, y por eso van arriba, a la
        altura de ese anillo. En DOM y no en la escena porque son INTERFACES:
        cristal, bordes finos y microtipografia se hacen mejor con `backdrop-filter`
        y un borde de 1 px que con un plano texturizado, y ademas cuestan cero
        al lienzo.
      */}
      <div className="maq-hud maq-hud--panel">
        <div className="maq-hud__barra">
          <span className="maq-hud__punto" />
          <span className="maq-hud__punto maq-hud__punto--dos" />
          <span className="maq-hud__titulo">{t('GENESIS · OPS')}</span>
        </div>
        <div className="maq-hud__cuerpo">
          <svg className="maq-hud__grafica" viewBox="0 0 120 46" preserveAspectRatio="none">
            <defs>
              <linearGradient id="maq-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.42" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 34 L20 26 L40 31 L60 15 L80 22 L100 8 L120 14 L120 46 L0 46 Z" fill="url(#maq-area)" />
            <polyline points="0,34 20,26 40,31 60,15 80,22 100,8 120,14" fill="none"
                      stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="maq-hud__filas">
            {[82, 64, 91].map((v, i) => (
              <span key={i} className="maq-hud__fila">
                <i style={{ width: `${v}%` }} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="maq-hud maq-hud--movil">
        <span className="maq-hud__muesca" />
        <div className="maq-hud__anillo" />
        <div className="maq-hud__filas maq-hud__filas--movil">
          {[100, 72, 88, 58].map((v, i) => (
            <span key={i} className="maq-hud__fila"><i style={{ width: `${v}%` }} /></span>
          ))}
        </div>
      </div>

    </div>
  )
}
