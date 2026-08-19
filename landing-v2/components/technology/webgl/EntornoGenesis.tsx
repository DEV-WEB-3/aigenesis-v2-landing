'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { EMISSION, VOID } from '@/lib/design/tokens'

/**
 * EL ENTORNO QUE REFLEJAN LOS CRISTALES.
 *
 * POR QUE HACE FALTA, dicho sin rodeos: sin `environment`, un
 * `MeshPhysicalMaterial` con `transmission` o `clearcoat` no tiene NADA que
 * reflejar. El material esta bien configurado, hace los calculos, y devuelve
 * negro — el vidrio sale apagado y plano, y la reaccion natural es echarle mas
 * bloom, que es justo lo contrario de lo que hay que hacer. El reflejo no es un
 * extra del cristal: es la mitad de lo que lo hace parecer cristal.
 *
 * SE GENERA, NO SE CARGA. Un HDRI son cientos de kilobytes y traeria colores
 * ajenos a la marca. Aqui el entorno son seis planos emisivos con los colores
 * de Genesis —cian arriba, magenta a la derecha, azul a la izquierda, violeta
 * detras— pasados por PMREM. Pesa cero, no anade peticiones, y garantiza que lo
 * que se refleja en la maquina es la propia paleta del portal.
 *
 * Se construye UNA vez y se libera al desmontar: un `WebGLRenderTarget` que no
 * se destruye es memoria de GPU retenida para siempre.
 */
export default function EntornoGenesis() {
  const gl = useThree((e) => e.gl)
  const escena = useThree((e) => e.scene)

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()

    const cuarto = new THREE.Scene()
    cuarto.background = new THREE.Color(VOID.black)

    /** Un panel de luz: posicion, giro, tamano, color e intensidad. */
    const panel = (
      pos: [number, number, number],
      rot: [number, number, number],
      tam: [number, number],
      color: string,
      fuerza: number
    ) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(tam[0], tam[1]),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(fuerza) })
      )
      m.position.set(...pos)
      m.rotation.set(...rot)
      cuarto.add(m)
      return m
    }

    // cenital cian: es la luz clave, y por eso la mas grande y la mas fuerte
    panel([0, 8, 0], [Math.PI / 2, 0, 0], [16, 16], EMISSION.cyan, 1.5)
    // relleno magenta a la derecha
    panel([9, 1, 2], [0, -Math.PI / 2, 0], [14, 12], EMISSION.magenta, 1.1)
    // azul a la izquierda
    panel([-9, 1, 2], [0, Math.PI / 2, 0], [14, 12], EMISSION.blueHi, 0.9)
    // violeta detras: separa la maquina del fondo por el contorno
    panel([0, 2, -10], [0, 0, 0], [16, 12], EMISSION.violetHi, 0.8)
    // suelo apagado: si tambien iluminara, el cristal perderia el arriba/abajo
    panel([0, -7, 0], [-Math.PI / 2, 0, 0], [16, 16], VOID.base, 1)

    const objetivo = pmrem.fromScene(cuarto, 0.04)
    escena.environment = objetivo.texture

    return () => {
      escena.environment = null
      objetivo.dispose()
      pmrem.dispose()
      cuarto.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          ;(o.material as THREE.Material).dispose()
        }
      })
    }
  }, [gl, escena])

  return null
}
