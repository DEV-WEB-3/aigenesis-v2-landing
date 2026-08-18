'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

/**
 * Barrera de error alrededor del canvas WebGL.
 *
 * POR QUE HACE FALTA
 * ------------------
 * Medido simulando un dispositivo sin WebGL —haciendo que `getContext` devuelva
 * `null`—: la página no perdía el fondo 3D, perdía TODO. Cero secciones
 * renderizadas, cero caracteres de texto visible, nueve errores no capturados.
 *
 * La causa es que sin barrera, un error lanzado al montar el canvas sube por el
 * árbol hasta la raíz, y React desmonta la aplicación entera. El visitante ve
 * una página en blanco sin explicación.
 *
 * A quién afecta: móviles antiguos, aceleración por hardware desactivada,
 * navegadores corporativos con políticas restrictivas, y los navegadores dentro
 * de apps —Instagram, Facebook, algunos clientes de correo—, que es por donde
 * llega buena parte del tráfico de una comunidad.
 *
 * Nada exótico.
 *
 * QUE HACE
 * --------
 * Aísla el fallo al canvas y deja pasar el resto de la página. El sitio queda
 * legible y utilizable sin su capa 3D, que es como debería haber estado desde el
 * principio: el WebGL es un realce, no el cimiento.
 */

interface Props {
  children: ReactNode
  /** Qué pintar en lugar del canvas cuando falla. */
  fallback: ReactNode
}

interface State {
  fallo: boolean
}

export class WebGLBoundary extends Component<Props, State> {
  state: State = { fallo: false }

  static getDerivedStateFromError(): State {
    return { fallo: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    /*
     * Se registra en consola pero NO se propaga: propagarlo aquí devolvería el
     * comportamiento que esta barrera existe para evitar.
     *
     * Sin `console.error` en producción tampoco: un error capturado y manejado
     * no es un error del que informar al usuario, y llenar su consola de ruido
     * sólo dificulta depurar lo que sí importa.
     */
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[webgl] canvas degradado a respaldo estático:', error.message, info.componentStack)
    }
  }

  render() {
    if (this.state.fallo) return this.props.fallback
    return this.props.children
  }
}

/**
 * ¿Este dispositivo puede crear un contexto WebGL?
 *
 * Se comprueba ANTES de montar el canvas, no sólo se espera al error: crear el
 * contexto y que falle cuesta tiempo y deja avisos en consola. Preguntarlo antes
 * es más limpio y más rápido.
 *
 * El contexto de prueba se libera de inmediato con `WEBGL_lose_context`. Sin
 * eso, cada comprobación consumiría uno de los pocos contextos simultáneos que
 * permite el navegador (unos 8–16), y el canvas de verdad podría quedarse sin.
 */
export function soportaWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const lienzo = document.createElement('canvas')
    const gl = (lienzo.getContext('webgl2') ||
      lienzo.getContext('webgl') ||
      lienzo.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return false
    const perder = gl.getExtension('WEBGL_lose_context')
    perder?.loseContext()
    return true
  } catch {
    return false
  }
}
