'use client'

import { useEffect, useState } from 'react'
import { resolveScrollMode, type ScrollMode } from '@/lib/scroll/scrollMode'

/**
 * Modo de scroll según el ancho de pantalla.
 *
 * EL PRIMER RENDER DEL CLIENTE DEBE COINCIDIR CON EL DEL SERVIDOR
 * ---------------------------------------------------------------
 * Antes esto era:
 *
 *   useState(() => typeof window !== 'undefined'
 *     ? resolveScrollMode(window.innerWidth)
 *     : 'snap')
 *
 * Parece defensivo y es justo lo contrario. El servidor no tiene `window`, así
 * que emitía `snap`; el cliente, en un móvil, calculaba otra cosa en su PRIMER
 * render. Eso es un desajuste de hidratación, y React no lo repara en silencio:
 * descarta el HTML del servidor y vuelve a renderizar toda la página en cliente
 * (errores #418 y #423 en producción).
 *
 * Peor todavía, y por eso lo descubrí: en un desajuste de ATRIBUTO React se
 * queda con el valor del servidor. El `data-scroll-mode` nunca llegaba a
 * cambiar, así que el modo nuevo se aplicaba en la lógica pero NO en el CSS.
 * Un cambio de comportamiento que no se veía por ninguna parte.
 *
 * Ahora el primer render es idéntico en los dos lados y el ancho real se aplica
 * en un efecto, que es una actualización de estado normal — React sí la pinta.
 *
 * `flow` como valor inicial y no `natural`: los rastreadores y la vista previa
 * social se sirven sin ejecutar el efecto, y `flow` es el modo del documento
 * completo.
 */
export function useScrollMode(): ScrollMode {
  const [mode, setMode] = useState<ScrollMode>('flow')

  useEffect(() => {
    const update = () => setMode(resolveScrollMode(window.innerWidth))
    update()

    const desktopMq = window.matchMedia('(min-width: 1024px)')
    const tabletMq = window.matchMedia('(min-width: 768px)')

    desktopMq.addEventListener('change', update)
    tabletMq.addEventListener('change', update)
    window.addEventListener('resize', update, { passive: true })

    return () => {
      desktopMq.removeEventListener('change', update)
      tabletMq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return mode
}
