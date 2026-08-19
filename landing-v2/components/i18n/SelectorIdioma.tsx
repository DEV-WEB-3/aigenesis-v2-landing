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
 * Porque aquí el idioma no es solo la interfaz: detrás de cada uno hay una
 * PRESENTACIÓN OFICIAL descargable, y de los once, ocho la tienen en la v5.0 y
 * tres todavía en la anterior. Elegir idioma y saber qué material vas a poder
 * bajar es la misma decisión, así que se toma en el mismo sitio. La insignia
 * `v5.0` / `v1` no es un detalle administrativo: quien elige su lengua está a un
 * clic de descargar.
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
          <p className="sel-idioma__nota">
            {t('La presentación oficial está disponible en cada idioma')}
          </p>
          <ul className="sel-idioma__lista">
            {IDIOMAS.map((i) => (
              <li key={i.codigo}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i.codigo === idioma}
                  lang={i.codigo}
                  dir={i.rtl ? 'rtl' : 'ltr'}
                  className={`sel-idioma__opcion${i.codigo === idioma ? ' es-actual' : ''}`}
                  onClick={() => elegir(i.codigo)}
                >
                  <span className="sel-idioma__nativo">{i.nativo}</span>
                  {/*
                    La insignia dice qué versión de la presentación hay en ese
                    idioma. `v1` va en ámbar y no en rojo: no es un error, es
                    material anterior — y material viejo en tu lengua sirve más
                    que material nuevo que no entiendes.
                  */}
                  <span
                    className={`sel-idioma__version sel-idioma__version--${i.material}`}
                    title={
                      i.material === 'v5'
                        ? t('Presentación oficial v5.0')
                        : t('Presentación de la versión anterior')
                    }
                  >
                    {i.material === 'v5' ? 'v5.0' : 'v1'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
