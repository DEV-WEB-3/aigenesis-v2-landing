'use client'

import { useEffect, useRef, useState } from 'react'
import { useT } from '@/context/IdiomaContext'
import type { Aliento } from '@/hooks/useAliento'
import {
  type Edicion,
  NOMBRE_IDIOMA,
  ORDEN_IDIOMAS,
  duracionLegible,
  urlDePoster,
  urlDeVideo,
} from '@/lib/soporte/ediciones'

/**
 * LA FICHA DE UNA EDICIÓN — video, idioma propio y descarga.
 *
 * Es hermana de la vista de artículo del asistente, pero NO la misma: un artículo
 * es texto que escribimos y vive en el idioma de la interfaz; una edición es un
 * archivo grabado que existe en unos idiomas y en otros no. Meter las dos cosas en
 * el mismo componente obligaba a llenarlo de condicionales sobre algo que no
 * comparten.
 *
 * EL SELECTOR DE IDIOMA NO TOCA LA INTERFAZ. Cambia el material y sólo el
 * material. El porqué está explicado en `lib/soporte/ediciones.ts`; en resumen:
 * quien usa esto no lo consume, lo presenta, y necesita el idioma de SU prospecto.
 *
 * EL VIDEO NO SE CARGA HASTA QUE SE PULSA. `preload="none"` y el póster de fondo:
 * el panel del asistente se abre muchísimas más veces de las que alguien ve un
 * video, y un `<video>` que precarga metadatos en cada apertura es tráfico que
 * nadie pidió — en móvil, con datos.
 */

/** Un idioma sin material no se oculta: se enseña apagado. Ocultarlo haría creer
 *  que el material no existe en ninguna parte, y el hueco es información. */
function BotonIdioma({
  codigo,
  activo,
  hay,
  onClick,
}: {
  codigo: string
  activo: boolean
  hay: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!hay}
      aria-pressed={activo}
      lang={codigo}
      className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
        activo
          ? 'border-genesis-ion bg-genesis-ion/15 text-genesis-ion'
          : hay
            ? 'border-genesis-ghost text-genesis-mist hover:border-genesis-mist hover:text-genesis-text'
            : 'cursor-not-allowed border-genesis-ghost/40 text-genesis-ghost'
      }`}
    >
      {NOMBRE_IDIOMA[codigo] ?? codigo}
    </button>
  )
}

export default function FichaEdicion({
  edicion,
  idioma,
  onIdioma,
  ancho = false,
  onVoz,
}: {
  edicion: Edicion
  idioma: string
  onIdioma: (codigo: string) => void
  /** El panel está ampliado: el reproductor va a lo ancho, el texto no. */
  ancho?: boolean
  /** El aliento de la consola, para que el borde reaccione a la voz del video. */
  onVoz?: Aliento
}) {
  const t = useT()
  const [reproduciendo, setReproduciendo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  /*
   * EL TEXTO NO CRECE CON EL PANEL.
   *
   * En modo ancho el reproductor sube a 648 px, y si la prosa lo siguiera
   * quedarían renglones de ~100 caracteres: el ojo pierde la línea al volver a la
   * izquierda. El video quiere todo el ancho; el texto quiere 62 caracteres.
   */
  const columna = ancho ? 'max-w-[62ch]' : ''

  const pieza = edicion.piezas[idioma]
  const src = urlDeVideo(pieza)
  const poster = urlDePoster(pieza)
  const dur = duracionLegible(pieza?.segundos ?? null)

  /*
   * EN CUÁNTOS IDIOMAS EXISTE ESTO.
   *
   * Contaba sólo los que tienen PDF, y el tutorial de acceso no tiene ninguno:
   * la ficha anunciaba «0 idiomas» debajo de un video que sí existe en tres. El
   * recuento tiene que ser de MATERIAL —video o documento—, no de un formato.
   */
  const conMaterial = ORDEN_IDIOMAS.filter(
    (l) => edicion.piezas[l]?.video ?? edicion.piezas[l]?.pdf
  ).length
  const conVideo = ORDEN_IDIOMAS.filter((l) => edicion.piezas[l]?.video).length

  /* Cambiar de idioma cambia de ARCHIVO. Si no se rearma el reproductor, el
     navegador se queda con el `src` viejo y la persona ve el idioma anterior
     mientras el botón dice otra cosa: un fallo silencioso, de los peores. */
  useEffect(() => {
    setReproduciendo(false)
    videoRef.current?.pause()
    onVoz?.callar()
  }, [idioma, edicion.id, onVoz])

  /* Al salir de la ficha, la consola vuelve a respirar. Sin esto se quedaría
     «hablando» con un video que ya no está: el borde seguiría agitado en una
     pantalla quieta, y eso desconcierta más que no tener efecto. */
  useEffect(() => () => onVoz?.callar(), [onVoz])

  return (
    <article dir={pieza?.rtl ? 'rtl' : undefined}>
      <h3 className="text-lg font-semibold leading-snug text-genesis-text" lang="es">
        {edicion.titulo}
      </h3>
      <p className="mb-3 mt-1 text-[11px] text-genesis-mist">
        {edicion.version} · {t('Fuente')}:{' '}
        <span className="text-genesis-ion">{t('material oficial del ecosistema')}</span>
      </p>

      {/* ── El reproductor ── */}
      <div className="relative overflow-hidden rounded-xl border border-genesis-ghost bg-genesis-void">
        {src ? (
          <video
            ref={videoRef}
            key={src}
            src={src}
            poster={poster ?? undefined}
            controls={reproduciendo}
            preload="none"
            playsInline
            /*
             * `crossOrigin` hace falta para poder ANALIZAR el audio: sin él, un
             * video de otro origen «contamina» el grafo de Web Audio y el
             * analizador devuelve silencio — y peor, el video se queda mudo. En
             * local no importa (mismo origen); en producción los archivos vienen
             * de aigenesis.io y la página de g1.aigenesis.io, y por eso el
             * `.htaccess` de la videoteca manda `Access-Control-Allow-Origin`.
             */
            crossOrigin="anonymous"
            onPlay={() => {
              setReproduciendo(true)
              if (videoRef.current) onVoz?.escuchar(videoRef.current)
            }}
            onPause={() => onVoz?.callar()}
            onEnded={() => onVoz?.callar()}
            className="block aspect-video w-full bg-genesis-void"
          />
        ) : (
          /* Sin material: se dice, no se disimula con un reproductor que no
             arranca. La diferencia entre «no existe» y «está roto» es lo único
             que quien mira necesita saber. */
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-1 px-6 text-center">
            <span className="text-xl" aria-hidden>
              🎬
            </span>
            <p className="text-xs text-genesis-mist">
              {t('Todavía no hay edición en')} {NOMBRE_IDIOMA[idioma] ?? idioma}.
            </p>
            <p className="text-[11px] text-genesis-ghost">
              {t('Elige otro idioma abajo o descarga el documento.')}
            </p>
          </div>
        )}

        {src && !reproduciendo ? (
          <button
            type="button"
            onClick={() => {
              setReproduciendo(true)
              void videoRef.current?.play()
            }}
            aria-label={t('Reproducir')}
            className="absolute inset-0 grid place-items-center bg-genesis-void/30 transition-colors hover:bg-genesis-void/10"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-genesis-text text-genesis-void shadow-lg transition-transform hover:scale-110">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        ) : null}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-genesis-mist">
        {dur ? <span className="rounded-full border border-genesis-ghost px-2 py-0.5">{dur}</span> : null}
        <span className="rounded-full border border-genesis-ghost px-2 py-0.5">
          {conMaterial} {t('idiomas')}
        </span>
        {/* Sólo cuando NO coinciden. En el plan de negocio el documento está en
            ocho idiomas y el video en tres, y sin decirlo la persona elige un
            idioma esperando video y se encuentra sólo el PDF. Cuando coinciden,
            repetirlo sería ruido. */}
        {conVideo > 0 && conVideo < conMaterial ? (
          <span className="rounded-full border border-genesis-cyan/40 px-2 py-0.5 text-genesis-cyan">
            {t('video en')} {conVideo}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-genesis-mist" lang="es">
        {edicion.resumen}
      </p>

      {/* ── La descarga ── */}
      {pieza?.pdf ? (
        <>
          <a
            href={pieza.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-3 rounded-xl surface-card px-4 py-3 text-sm text-genesis-text transition-colors hover:border-genesis-ion"
          >
            <span aria-hidden>📄</span>
            <span className="min-w-0">
              {t('Descargar la presentación')}
              <span className="block text-[11px] text-genesis-mist">
                PDF · {NOMBRE_IDIOMA[idioma] ?? idioma}
              </span>
            </span>
            {/* El peso va MEDIDO y a la vista: quien descarga con datos móviles
                decide antes de pulsar, no después de gastar. */}
            <span className="ml-auto text-[11px] tabular-nums text-genesis-mist">
              {pieza.mb?.toFixed(2)} MB
            </span>
          </a>
          {edicion.avisoRiesgo ? (
            <p className="mt-2 text-[11px] leading-relaxed text-genesis-mist">
              {t(
                'Material informativo. No constituye una oferta de inversión ni promete rendimientos.'
              )}
            </p>
          ) : null}
        </>
      ) : null}

      {/* ── El idioma DEL MATERIAL ── */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-genesis-ghost pt-3">
        <span className="text-[11px] text-genesis-mist">🌐 {t('Idioma del material')}</span>
        {ORDEN_IDIOMAS.map((l) => (
          <BotonIdioma
            key={l}
            codigo={l}
            activo={l === idioma}
            hay={Boolean(edicion.piezas[l]?.video ?? edicion.piezas[l]?.pdf)}
            onClick={() => onIdioma(l)}
          />
        ))}
      </div>
    </article>
  )
}
