'use client'

import { useEffect, useRef, useState } from 'react'
import { useT } from '@/context/IdiomaContext'
import { useCorpus } from '@/hooks/useCorpus'
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
  /* El título y el resumen de la edición son CORPUS, no chrome: se traducen
     por el mismo camino que las preguntas del asistente. */
  const c = useCorpus()
  const [reproduciendo, setReproduciendo] = useState(false)
  /* El motivo por el que el navegador se negó a reproducir, si se negó. Se
     guarda para ENSEÑARLO: un reproductor que falla en silencio es
     indistinguible de un archivo que no está. */
  const [falloAlReproducir, setFalloAlReproducir] = useState<string | null>(null)
  /*
   * ¿SE PIDE EL VIDEO CON CORS?
   *
   * `crossOrigin="anonymous"` hace falta para ANALIZAR el audio y que el borde
   * de la consola respire con la voz. Su precio: si el servidor no devuelve
   * `Access-Control-Allow-Origin` para ESE origen, el navegador no baja el
   * video. No degrada el efecto — mata la reproducción.
   *
   * Y la lista blanca vive en un `.htaccess` de OTRO servidor, que se sube a
   * mano. El 25-ago-2026 no incluía `aigenesis-landing.vercel.app`, que es donde
   * el owner prueba la landing: ni un video, ni un póster, en ningún idioma.
   *
   * El orden de importancia no admite discusión: un video que se ve sin efecto
   * es infinitamente mejor que un efecto sin video. Así que se intenta con CORS
   * y, si el medio falla por eso, se reintenta sin él. Se pierde el aliento
   * reactivo y se gana el Aula funcionando en cualquier host, esté o no en una
   * lista que vive fuera de este repositorio.
   */
  const [conCors, setConCors] = useState(true)
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
    setFalloAlReproducir(null)
    videoRef.current?.pause()
    onVoz?.callar()
  }, [idioma, edicion.id, onVoz])

  /* Al salir de la ficha, la consola vuelve a respirar. Sin esto se quedaría
     «hablando» con un video que ya no está: el borde seguiría agitado en una
     pantalla quieta, y eso desconcierta más que no tener efecto. */
  useEffect(() => () => onVoz?.callar(), [onVoz])

  return (
    <article dir={pieza?.rtl ? 'rtl' : undefined}>
      <h3 lang={c(edicion.titulo).lang} className="text-lg font-semibold leading-snug text-genesis-text">
        {c(edicion.titulo).texto}
      </h3>
      <p className="mb-3 mt-1 text-[11px] text-genesis-mist">
        {edicion.version} · {t('Fuente')}:{' '}
        <span className="text-genesis-ion">{t('material oficial del ecosistema')}</span>
      </p>

      {/* ── El reproductor ── */}
      <div className="relative overflow-hidden rounded-xl border border-genesis-ghost bg-genesis-void">
        {/*
         * EL PÓSTER, FUERA DEL ELEMENTO DE VIDEO.
         *
         * Estaba como atributo `poster`, que parece lo natural y tiene una
         * consecuencia que no vi: la imagen la descarga el propio `<video>`, así
         * que hereda su `crossOrigin`. Una foto de la que nunca leemos un píxel
         * pasaba a exigir `Access-Control-Allow-Origin`, y sin él el navegador la
         * bloqueaba. Fue la primera línea de la consola del owner:
         * «Access to image at '…/en.jpg?v1' … has been blocked by CORS policy».
         *
         * Como `<img>` suelto no exige nada. Se oculta en cuanto el video
         * arranca; `aria-hidden` porque no aporta información —el título ya está
         * escrito encima— y `onError` vacío para que un póster que falte deje el
         * fondo liso en vez de un icono de imagen rota.
         */}
        {src && poster && !reproduciendo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            aria-hidden
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {src ? (
          <video
            ref={videoRef}
            /* La `key` incluye `conCors`: cambiar `crossOrigin` sobre un
               elemento ya cargado no reintenta nada. Hay que rearmarlo. */
            key={`${src}|${conCors}`}
            src={src}
            /* El póster NO va como atributo: lo pintaría el propio elemento y
               heredaría su `crossOrigin`, así que una imagen que no necesita
               CORS —nunca leemos sus píxeles— quedaba bloqueada por él. Va
               debajo, como `<img>` normal. */
            controls={reproduciendo}
            preload="none"
            playsInline
            crossOrigin={conCors ? 'anonymous' : undefined}
            onPlay={() => {
              setReproduciendo(true)
              /*
               * SÓLO SE ANALIZA EL AUDIO SI VAMOS CON CORS.
               *
               * En el camino de respaldo el elemento es de otro origen SIN
               * `crossOrigin`, o sea «contaminado»: meterlo en el grafo de Web
               * Audio no devuelve silencio al analizador, devuelve silencio al
               * ALTAVOZ. El video se vería perfecto y no se oiría nada, que es
               * un fallo peor que no tener efecto — y más difícil de atribuir.
               */
              if (conCors && videoRef.current) onVoz?.escuchar(videoRef.current)
            }}
            onPause={() => onVoz?.callar()}
            onEnded={() => onVoz?.callar()}
            /*
             * `play()` no cubre todos los fallos. Los de RED y DECODIFICACIÓN
             * llegan después, cuando el elemento ya empezó a cargar, y no
             * rechazan la promesa: sólo disparan `error` en el elemento. Sin
             * esto, un archivo que se corta a medio descargar deja la misma
             * pantalla muda de antes. Se cuenta lo que el navegador dice.
             */
            onError={() => {
              /*
               * LOS NOMBRES DE LA ESPECIFICACIÓN, no una descripción mía.
               *
               * Primero puse «error de red», «no se pudo decodificar»… que es
               * prosa española disfrazada de nombre técnico: ni se traduce (mala
               * interfaz) ni se puede buscar (mal diagnóstico). Éstos son los
               * nombres que define HTMLMediaElement.error, los mismos que salen
               * en la consola y en cualquier búsqueda.
               */
              const codigo = videoRef.current?.error?.code
              const nombres: Record<number, string> = {
                1: 'MEDIA_ERR_ABORTED',
                2: 'MEDIA_ERR_NETWORK',
                3: 'MEDIA_ERR_DECODE',
                4: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
              }
              /*
               * UN FALLO DE CORS LLEGA AQUÍ DISFRAZADO. El navegador no dice
               * «CORS» al elemento —eso sólo va a la consola—: entrega un
               * MEDIA_ERR_NETWORK o un MEDIA_ERR_SRC_NOT_SUPPORTED, los mismos
               * códigos que daría un archivo que no existe.
               *
               * Como no se puede distinguir, se PRUEBA: si íbamos con CORS, se
               * reintenta sin él una vez. Si el problema era la lista blanca, el
               * video arranca y sólo se pierde el aliento reactivo. Si era otra
               * cosa, el segundo intento falla igual y entonces sí se enseña el
               * motivo. Un reintento, no un bucle: `conCors` ya es `false` la
               * segunda vez y esta rama no se vuelve a tomar.
               */
              if (conCors && (codigo === 2 || codigo === 4)) {
                setConCors(false)
                setReproduciendo(false)
                onVoz?.callar()
                return
              }
              setReproduciendo(false)
              onVoz?.callar()
              setFalloAlReproducir(codigo ? nombres[codigo] ?? `MEDIA_ERR_${codigo}` : 'MEDIA_ERR')
            }}
            className="relative block aspect-video w-full bg-genesis-void"
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
            /*
             * SI `play()` FALLA, TIENE QUE VERSE.
             *
             * Aquí ponía `void videoRef.current?.play()`. `play()` devuelve una
             * promesa que RECHAZA en varios casos reales —política de
             * reproducción del navegador, un formato que no puede decodificar,
             * la red— y `void` la tiraba. El resultado en pantalla: se pulsa, el
             * botón desaparece porque `reproduciendo` ya es `true`, y no pasa
             * nada más. Ni error, ni botón, ni forma de volver a intentarlo.
             *
             * Es el peor tipo de fallo que puede tener un reproductor: idéntico
             * a que el archivo no exista, y sin ninguna pista de cuál de los dos
             * es. Ahora el botón vuelve y el motivo se enseña.
             */
            onClick={() => {
              /* PRIMERO el audio, y aquí dentro: éste es el único momento en
                 que el navegador concede arrancar un AudioContext. Hacerlo
                 luego, en `onPlay`, lo dejaba suspendido — y un video
                 enganchado a un contexto suspendido se queda clavado. */
              onVoz?.preparar()
              setFalloAlReproducir(null)
              setReproduciendo(true)
              const p = videoRef.current?.play()
              if (p) {
                p.catch((e: unknown) => {
                  setReproduciendo(false)
                  const err = e as { name?: string; message?: string }
                  setFalloAlReproducir(err?.name || err?.message || 'error desconocido')
                })
              }
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

        {/* El motivo, encima del reproductor y no en un rincón: quien acaba de
            pulsar sin resultado está mirando aquí. El texto explicativo se
            traduce; el nombre técnico del fallo NO, porque es lo que sirve para
            reportarlo y traducirlo lo volvería imposible de buscar. */}
        {falloAlReproducir ? (
          <p
            role="status"
            className="absolute inset-x-0 bottom-0 bg-genesis-void/85 px-3 py-2 text-center text-[11px] text-genesis-mist"
          >
            {t('El navegador no pudo reproducirlo')} — <span className="font-mono">{falloAlReproducir}</span>
          </p>
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

      <p lang={c(edicion.resumen).lang} className="mt-3 text-sm leading-relaxed text-genesis-mist">
        {c(edicion.resumen).texto}
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
