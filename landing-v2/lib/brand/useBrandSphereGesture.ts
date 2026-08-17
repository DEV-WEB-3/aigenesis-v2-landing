'use client'

import { useCallback, useEffect, useRef } from 'react'
import { CARAS_MARCA } from './brandSphere'

/** Vuelta completa, en segundos, cuando gira sola. */
export const PERIODO_S = 26

/**
 * Cuánto gira la esfera por píxel arrastrado.
 *
 * 0.006 rad/px sale de una regla de uso, no de una estimación: un arrastre de
 * unos 350 px —lo que da un gesto cómodo sin recolocar la mano— debe recorrer
 * algo más de una marca entera. 350 × 0.006 = 2.1 rad, y entre marcas hay 2.09.
 */
const RAD_POR_PX = 0.006

/** Rozamiento por fotograma tras soltar. Más bajo, para antes. */
const ROZAMIENTO = 0.94

/** Por debajo de esto la inercia se considera agotada y empieza el encaje. */
const VELOCIDAD_MINIMA = 0.0008

/** Rapidez del encaje a la marca más cercana. */
const FUERZA_ENCAJE = 0.09

/**
 * Tras soltar, la esfera espera esto antes de volver a girar sola. Da tiempo a
 * mirar la marca en la que se ha parado sin que se la lleve la rotación.
 */
const ESPERA_TRAS_SOLTAR_MS = 2600

const PASO = (2 * Math.PI) / CARAS_MARCA.length

export interface EstadoGesto {
  /** Giro acumulado, en radianes. Lo lee el bucle de dibujo. */
  giro: number
  /** Velocidad angular, en rad/s. */
  velocidad: number
  arrastrando: boolean
  /** Marca más cercana al frente, como índice de `CARAS_MARCA`. */
  caraActiva: number
}

/**
 * Gesto de la esfera de marca: arrastrar, inercia y encaje.
 *
 * POR QUE ESTA LOGICA VIVE FUERA DEL COMPONENTE 3D
 * El bucle de dibujo corre a 60 fps y no debe provocar renders de React. Todo el
 * estado del gesto vive en un `ref` que el bucle lee y escribe directamente; lo
 * único que se notifica a React es el CAMBIO DE MARCA ACTIVA, que ocurre como
 * mucho tres veces por vuelta y sí tiene que repintar los indicadores.
 *
 * DECISIONES DE INTERACCION
 *
 *  · El scroll NO gira la esfera. El scroll es de la página, y robarlo es la
 *    forma más rápida de que alguien no pueda salir de la sección.
 *
 *  · Sólo se atiende el arrastre HORIZONTAL. En móvil, un gesto vertical tiene
 *    que seguir desplazando la página; por eso `touch-action: pan-y` y por eso
 *    el primer movimiento decide si el gesto es nuestro o del navegador.
 *
 *  · Al soltar hay inercia, y cuando se agota la esfera ENCAJA en la marca más
 *    cercana. Ese detente es lo que hace que se sienta diseñado y no suelto: se
 *    para siempre mostrando algo, nunca a medio camino entre dos marcas.
 *
 *  · Y después vuelve a girar sola. Es la garantía de que nadie se queda con la
 *    esfera parada sin saber que había más marcas detrás.
 */
export function useBrandSphereGesture(
  onCaraActiva?: (indice: number) => void
) {
  const estado = useRef<EstadoGesto>({
    giro: 0,
    velocidad: 0,
    arrastrando: false,
    caraActiva: 0,
  })

  const ultimoX = useRef(0)
  const ultimoT = useRef(0)
  const soltadoEn = useRef(0)
  const punteroActivo = useRef<number | null>(null)

  /** Índice de la marca que queda más cerca del frente para un giro dado. */
  const caraDe = useCallback((giro: number) => {
    const normal = ((-giro % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    return Math.round(normal / PASO) % CARAS_MARCA.length
  }, [])

  const notificar = useCallback(
    (giro: number) => {
      const cara = caraDe(giro)
      if (cara !== estado.current.caraActiva) {
        estado.current.caraActiva = cara
        onCaraActiva?.(cara)
      }
    },
    [caraDe, onCaraActiva]
  )

  /**
   * Avanza un fotograma. Lo llama el bucle de dibujo con su propio delta, para
   * que el movimiento no dependa de la frecuencia de refresco del monitor.
   */
  const avanzar = useCallback(
    (delta: number, ahora: number) => {
      const e = estado.current
      if (e.arrastrando) {
        notificar(e.giro)
        return e.giro
      }

      const enEspera = ahora - soltadoEn.current < ESPERA_TRAS_SOLTAR_MS

      if (Math.abs(e.velocidad) > VELOCIDAD_MINIMA) {
        // inercia
        e.giro += e.velocidad * delta
        e.velocidad *= Math.pow(ROZAMIENTO, delta * 60)
      } else if (enEspera) {
        // encaje a la marca más cercana
        const objetivo = Math.round(e.giro / PASO) * PASO
        const dif = objetivo - e.giro
        if (Math.abs(dif) > 0.0005) e.giro += dif * FUERZA_ENCAJE
        else e.giro = objetivo
        e.velocidad = 0
      } else {
        // vuelta a la rotación automática
        e.giro += (delta * Math.PI * 2) / PERIODO_S
      }

      notificar(e.giro)
      return e.giro
    },
    [notificar]
  )

  const alBajar = useCallback((ev: PointerEvent) => {
    // Sólo el botón principal; un clic derecho o el botón central no arrastran.
    if (ev.button !== 0 && ev.pointerType === 'mouse') return
    punteroActivo.current = ev.pointerId
    estado.current.arrastrando = true
    estado.current.velocidad = 0
    ultimoX.current = ev.clientX
    ultimoT.current = ev.timeStamp
  }, [])

  const alMover = useCallback((ev: PointerEvent) => {
    if (punteroActivo.current !== ev.pointerId) return
    const e = estado.current
    if (!e.arrastrando) return

    const dx = ev.clientX - ultimoX.current
    const dt = Math.max(1, ev.timeStamp - ultimoT.current)

    e.giro += dx * RAD_POR_PX
    // rad/s, para que la inercia siga siendo coherente con el gesto real
    e.velocidad = (dx * RAD_POR_PX) / (dt / 1000)

    ultimoX.current = ev.clientX
    ultimoT.current = ev.timeStamp
  }, [])

  const alSoltar = useCallback((ev: PointerEvent) => {
    if (punteroActivo.current !== ev.pointerId) return
    punteroActivo.current = null
    estado.current.arrastrando = false
    soltadoEn.current = performance.now()
  }, [])

  /**
   * Los manejadores van en `window` y no en el elemento: si el puntero sale del
   * lienzo mientras se arrastra, el gesto tiene que seguir —y sobre todo tiene
   * que TERMINAR cuando se suelte fuera—. Sin esto la esfera se queda pegada al
   * ratón para siempre.
   */
  useEffect(() => {
    window.addEventListener('pointermove', alMover, { passive: true })
    window.addEventListener('pointerup', alSoltar)
    window.addEventListener('pointercancel', alSoltar)
    return () => {
      window.removeEventListener('pointermove', alMover)
      window.removeEventListener('pointerup', alSoltar)
      window.removeEventListener('pointercancel', alSoltar)
    }
  }, [alMover, alSoltar])

  /** Lleva la esfera a una marca concreta, para los indicadores. */
  const irACara = useCallback((indice: number) => {
    const e = estado.current
    e.velocidad = 0
    soltadoEn.current = performance.now()
    // se elige la vuelta más corta desde el giro actual
    const objetivo = -indice * PASO
    const vueltas = Math.round((e.giro - objetivo) / (2 * Math.PI))
    e.giro = objetivo + vueltas * 2 * Math.PI
  }, [])

  return { estado, avanzar, alBajar, irACara, caraDe }
}
