'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import TechnologyArchitecture from '@/components/technology/TechnologyArchitecture'
import TechMachineOverlay from '@/components/technology/TechMachineOverlay'
import type { Ancla } from '@/components/technology/webgl/TechMachineCanvas'

/**
 * `ssr: false` es obligatorio, no una precaucion.
 *
 * La escena crea texturas dibujando en un `<canvas>`, y `document` no existe en
 * el servidor. Ademas el lienzo no aporta NADA al HTML inicial —es una imagen
 * que se pinta despues—, asi que cargarlo aparte mantiene fuera del arranque
 * tanto `three` como el post-proceso.
 */
const TechMachineCanvas = dynamic(
  () => import('@/components/technology/webgl/TechMachineCanvas'),
  { ssr: false }
)

/**
 * QUIEN DIBUJA LA MAQUINA.
 *
 * DOS IMPLEMENTACIONES, Y LAS DOS SE QUEDAN
 * -----------------------------------------
 * La version WebGL da el volumen que la referencia pide —tubos con hueco,
 * oclusion real, luz que cae sobre superficies curvas—. La version SVG da algo
 * que WebGL no puede garantizar: que la seccion se vea SIEMPRE.
 *
 * No es duplicidad por indecision. Cada una cubre un caso que la otra no puede:
 *
 *   movimiento reducido   quien pidio menos movimiento no quiere un lienzo
 *                         animado, y una escena 3D congelada en su primer
 *                         cuadro no es lo mismo que un dibujo pensado para
 *                         estar quieto
 *   sin WebGL             driver en lista negra, aceleracion desactivada, o
 *                         demasiados contextos vivos. Sin salida, la seccion
 *                         quedaria en blanco
 *   movil y tablet        el concepto dice explicitamente que no se lleve el
 *                         render completo de escritorio al movil
 *
 * En los tres casos el SVG no es un degradado: es la respuesta correcta.
 *
 * SE ESPERA A SABER. Mientras la comprobacion de WebGL no ha terminado no se
 * pinta ninguna de las dos. Pintar el SVG «por si acaso» y cambiarlo medio
 * segundo despues produce un parpadeo entre dos maquinas distintas, que se ve
 * mucho mas que esperar dos cuadros.
 */
export default function TechnologyMachine({ activo }: { activo: boolean }) {
  const [modo, setModo] = useState<'esperando' | '3d' | 'svg'>('esperando')
  const [anclas, setAnclas] = useState<Ancla[]>([])

  useEffect(() => {
    const win = window
    const anchoOk = () => win.matchMedia('(min-width: 1024px)').matches
    const quieto = () => win.matchMedia('(prefers-reduced-motion: reduce)').matches

    /*
     * SE PREGUNTA CREANDO UN CONTEXTO DE VERDAD, no mirando si existe
     * `window.WebGLRenderingContext`. Esa constante existe en navegadores que
     * luego NO conceden el contexto, y entonces el «si» se convierte en un
     * lienzo en blanco — peor que no haberlo intentado.
     */
    const hayWebGL = () => {
      try {
        const c = document.createElement('canvas')
        const gl = c.getContext('webgl2') ?? c.getContext('webgl')
        if (!gl) return false
        ;(gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext()
        return true
      } catch {
        return false
      }
    }

    const decidir = () => {
      setModo(anchoOk() && !quieto() && hayWebGL() ? '3d' : 'svg')
    }
    decidir()

    const alRedimensionar = () => setModo(anchoOk() && !quieto() && hayWebGL() ? '3d' : 'svg')
    win.addEventListener('resize', alRedimensionar, { passive: true })
    return () => win.removeEventListener('resize', alRedimensionar)
  }, [])

  const recibirAnclas = useCallback((a: Ancla[]) => setAnclas(a), [])

  if (modo === 'esperando') return null
  if (modo === 'svg') return <TechnologyArchitecture />

  return (
    <div className="maq" data-modo="3d">
      <TechMachineCanvas activo={activo} onAnclas={recibirAnclas} calidad="alta" />
      <TechMachineOverlay anclas={anclas} />
    </div>
  )
}
