'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useIdioma } from '@/context/IdiomaContext'
import { IDIOMAS, buscarIdioma, type CodigoIdioma } from '@/lib/i18n/idiomas'

/**
 * EL SELECTOR DE IDIOMA — y por qué muestra también el material.
 *
 * Un desplegable de banderas habría sido lo fácil y habría estado mal por dos
 * motivos. Uno: una bandera es un país, no una lengua — el español no es
 * España, el árabe no es un solo país y el serbio no cabe en ninguna. Dos: no
 * dice nada de lo único que el visitante necesita saber ademas del nombre.
 *
 * LLEVÓ INSIGNIAS `v5.0` / `v1` Y SE QUITARON. Decisión del owner, y es la
 * correcta: en un selector se está eligiendo IDIOMA, no versión de documento.
 * Once filas con una etiqueta técnica al lado convierten un control de sistema
 * en un catálogo, y el ruido se paga en todas las pantallas para informar de
 * algo que sólo importa en el momento de descargar.
 *
 * La información no se pierde, se dice donde sirve: `/g11` separa la tanda v1
 * en su propio bloque, y el botón de descarga avisa en ámbar —con el peso—
 * cuando lo que entrega no es la v5.0. Ahí el dato llega justo cuando cambia
 * una decisión; aquí sólo estorbaba.
 *
 * EL GLIFO ES UN ORBE DE MERIDIANOS, no un globo terráqueo con continentes. Es
 * la misma figura que sostiene el hero —una esfera con anillos— y por eso el
 * control pertenece a la pieza en vez de parecer un añadido de plantilla.
 */
export default function SelectorIdioma({ compacto = false }: { compacto?: boolean }) {
  const { idioma, cambiar, t } = useIdioma()
  const [abierto, setAbierto] = useState(false)
  const caja = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const actual = buscarIdioma(idioma)

  /*
   * Se cierra al pulsar fuera y con Escape. Las dos, no una: el ratón espera lo
   * primero y el teclado lo segundo, y un panel que solo atiende a uno deja
   * atrapado a quien use el otro.
   */
  useEffect(() => {
    if (!abierto) return
    const fuera = (e: PointerEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false)
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto])

  const elegir = useCallback(
    (c: CodigoIdioma) => {
      cambiar(c)
      setAbierto(false)
    },
    [cambiar]
  )

  return (
    <div ref={caja} className={`sel-idioma${compacto ? ' sel-idioma--compacto' : ''}`}>
      <button
        type="button"
        className="sel-idioma__boton"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={panelId}
        aria-label={`${t('Idioma')}: ${actual?.nativo ?? idioma}`}
        onClick={() => setAbierto((v) => !v)}
      >
        <span className="sel-idioma__orbe" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="12" cy="12" r="8.4" />
            {/* meridianos: la misma figura que la esfera del hero */}
            <ellipse cx="12" cy="12" rx="3.4" ry="8.4" />
            <path d="M3.9 9.2h16.2M3.9 14.8h16.2" />
          </svg>
        </span>
        <span className="sel-idioma__codigo">{idioma.toUpperCase()}</span>
      </button>

      {abierto ? (
        <div className="sel-idioma__panel" id={panelId} role="listbox" aria-label={t('Idioma')}>
          <ul className="sel-idioma__lista">
            {IDIOMAS.map((i) => (
              <li key={i.codigo}>
                {/*
                  SIN `dir` EN LA FILA, y con `<bdi>` alrededor del nombre.

                  Cada fila llevaba `dir="rtl"` para el árabe y el urdu, y eso
                  hacía dos cosas a la vez: ordenaba las letras —que hay que
                  hacerlo— y alineaba el bloque al otro lado —que no—. El
                  resultado era una lista con nueve nombres pegados a un margen
                  y dos pegados al contrario: la columna dejaba de existir.

                  `dir` es propiedad del PÁRRAFO, no de la palabra. Quitándolo,
                  la fila hereda la dirección del panel y todos los nombres
                  arrancan del mismo margen; el árabe se sigue leyendo de
                  derecha a izquierda porque eso lo decide el algoritmo bidi por
                  el propio alfabeto, no el atributo.

                  El aislamiento se hace con `unicode-bidi: isolate` en el CSS
                  y NO con `<bdi>`, aunque `<bdi>` es el elemento que parece
                  hecho para esto. Motivo, comprobado en pantalla: `<bdi>` lleva
                  `dir="auto"` de serie, deduce «rtl» de la primera letra árabe
                  y vuelve a alinear la fila a la derecha — exactamente el
                  problema que se venía a quitar. `isolate` da el aislamiento sin
                  tocar la dirección.

                  `lang` se queda: es lo que hace que un lector de pantalla
                  cambie de voz y que el navegador elija la tipografía correcta.
                */}
                <button
                  type="button"
                  role="option"
                  aria-selected={i.codigo === idioma}
                  lang={i.codigo}
                  className={`sel-idioma__opcion${i.codigo === idioma ? ' es-actual' : ''}`}
                  onClick={() => elegir(i.codigo)}
                >
                  <span className="sel-idioma__nativo">{i.nativo}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
