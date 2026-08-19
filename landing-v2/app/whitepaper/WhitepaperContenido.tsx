'use client'

import OfficialDownloadButton from '@/components/cta/OfficialDownloadButton'
import { useT } from '@/context/IdiomaContext'
import { EXTERNAL_LINKS, ROUTES } from '@/lib/routes'
import { AIG_TOKEN_CONTRACT } from '@/lib/official-links'
import {
  WHITEPAPER_SECCIONES,
  WHITEPAPER_REPARTO,
  WHITEPAPER_FASES,
} from '@/lib/whitepaper'
/*
 * IMPORT POR EFECTO: este modulo no exporta nada que se use aqui — registra sus
 * entradas en el diccionario al evaluarse. Esta importado desde ESTA pagina y
 * no desde el diccionario comun para que su peso viaje en el trozo de
 * `/whitepaper` y no en el de la portada: son 35 kB de texto que solo se leen
 * aqui. Ver la nota en `lib/i18n/diccionario-whitepaper.ts`.
 */
import '@/lib/i18n/diccionario-whitepaper'

/**
 * Hechos comprobables en cadena, medidos el 16-ago-2026 sobre el contrato
 * oficial. Van AQUÍ, en HTML, y no dentro del PDF: la página tenía dos frases y
 * dos botones, y quien llegaba buscando datos tenía que descargar 1,5 MB para
 * ver si le servían.
 *
 * DOS CORRECCIONES A LO QUE DECÍA ESTE COMENTARIO, las dos comprobadas:
 *
 *  1. Decía que el texto del PDF NO es extraíble. SÍ LO ES: 5.380 caracteres,
 *     ocho páginas, leídos con `pymupdf`. La afirmación llevaba aquí sin
 *     comprobar y sostenía una decisión correcta con un motivo falso, que es la
 *     peor forma de tener razón — porque nadie vuelve a mirarla.
 *  2. Decía que el PDF está en español. Está en INGLÉS, de principio a fin.
 *
 * De la primera sale `lib/whitepaper.ts`: como el texto se puede leer, se puede
 * traducir, y el documento entero está ahora en las once lenguas más abajo. El
 * PDF se conserva como artefacto original y se dice en qué idioma está.
 */
const HECHOS = [
  { valor: '111.000.000', etiqueta: 'Suministro total AIG' },
  { valor: '15.000+', etiqueta: 'Holders en cadena' },
  { valor: 'BEP-20', etiqueta: 'BNB Smart Chain' },
  { valor: 'Verificado', etiqueta: 'Código del contrato' },
] as const

export default function WhitepaperContenido() {
  const t = useT()
  return (
    <>
      <p className="text-genesis-text font-medium">
        {t('Documentación oficial del ecosistema AiGenesis.')}
      </p>
      <p>
        {t(
          'El whitepaper AiG Token describe la arquitectura del protocolo, los tokenomics, los pilares del ecosistema y el marco de participación on-chain.'
        )}
      </p>

      <section aria-label={t('Datos verificables en cadena')} className="pt-2">
        <h2 className="text-caption text-genesis-ghost uppercase tracking-wider mb-3">
          {t('Verificable en cadena')}
        </h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 m-0">
          {HECHOS.map((h) => (
            <div key={h.etiqueta} className="flex flex-col gap-1">
              <dt className="sr-only">{t(h.etiqueta)}</dt>
              {/* Cifra aislada: «15.000+» se pinta «+15.000» en árabe y urdu sin esto. */}
              <dd
                dir="ltr"
                className="m-0 font-display text-xl sm:text-2xl font-bold text-genesis-text"
              >
                {t(h.valor)}
              </dd>
              <span className="text-caption text-genesis-ghost uppercase tracking-wider">
                {t(h.etiqueta)}
              </span>
            </div>
          ))}
        </dl>

        <p className="text-caption text-genesis-ghost pt-4 break-all">
          {t('Contrato:')}{' '}
          <code className="text-genesis-ion" dir="ltr">
            {AIG_TOKEN_CONTRACT}
          </code>
        </p>
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <OfficialDownloadButton href={EXTERNAL_LINKS.WHITEPAPER_PDF} variant="signature">
          Descargar Whitepaper (PDF)
        </OfficialDownloadButton>
        <OfficialDownloadButton href={ROUTES.BSCSCAN} variant="secondary">
          Ver contrato en BSCScan
        </OfficialDownloadButton>
      </div>

      {/*
        El documento, leíble sin salir de la página. `<object>` y no `<iframe>`
        porque trae respaldo propio: en un móvil que no sabe pintar PDF en línea
        —que son casi todos— se muestra el contenido de dentro en vez de un
        recuadro en blanco.

        Se oculta en pantallas pequeñas a propósito: incrustar 1,5 MB donde no
        se va a poder leer es gastar el dato de alguien a cambio de nada. Ahí
        queda el botón de descarga, que sí funciona.
      */}
      {/*
        AVISO ANTES DEL DOCUMENTO, y es lo más importante de esta página.

        El PDF es la v1.1 de febrero de 2024 y dentro publica la dirección
        `0x4b4594bf…`. Esa dirección YA NO ES la del token: desde entonces el
        contrato se migró varias veces y el vigente es `AIG_TOKEN_CONTRACT`, que
        es el que enseña esta página unas líneas más arriba.

        Sin este aviso, la página se contradice a sí misma sin decirlo: arriba
        una dirección y, al desplegar el visor, otra. Y quien copia una
        dirección de contrato de un documento oficial no vuelve a comprobarla.
        El documento se conserva —es el original y tiene valor histórico— pero
        no se sirve en silencio.
      */}
      <p className="text-caption text-state-warning pt-4">
        {t(
          'El PDF es la versión 1.1 de febrero de 2024 y la dirección de contrato que aparece dentro ya no está vigente. El contrato válido es el que figura arriba en esta página.'
        )}
      </p>

      <div className="hidden md:block pt-4">
        <object
          data={EXTERNAL_LINKS.WHITEPAPER_PDF}
          type="application/pdf"
          className="w-full rounded-xl border border-hairline bg-genesis-base"
          style={{ height: 'min(78vh, 900px)' }}
          aria-label={t('Whitepaper AiG Token, documento PDF')}
        >
          <p className="p-6">
            {t('Tu navegador no puede mostrar el PDF aquí.')}{' '}
            <a href={EXTERNAL_LINKS.WHITEPAPER_PDF} className="text-genesis-ion">
              {t('Descárgalo para leerlo')}
            </a>
            .
          </p>
        </object>
      </div>

      {/* ── EL DOCUMENTO, EN TU IDIOMA ──────────────────────────────
        El PDF de arriba es el artefacto original y está en INGLÉS. Debajo va
        el mismo texto, traducido, para que se pueda leer en las once lenguas
        sin descargar 1,5 MB de un documento que además no se entiende.

        No sustituye al PDF: lo acompaña. Y por eso se dice en qué idioma está
        el archivo, en vez de dejar que alguien lo descubra al abrirlo.
      */}
      <section aria-labelledby="wp-documento" className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-1">
          <h2
            id="wp-documento"
            className="font-display text-heading text-genesis-text"
          >
            {t('El documento, en tu idioma')}
          </h2>
          <p className="text-caption text-genesis-ghost">
            {t('Traducción del whitepaper oficial v1.1. El PDF descargable está en inglés.')}
          </p>
        </div>

        {WHITEPAPER_SECCIONES.map((sec) => (
          <div key={sec.titulo} className="flex flex-col gap-3">
            <h3 className="font-display text-body-lg text-genesis-text">{t(sec.titulo)}</h3>
            {sec.parrafos.map((par) => (
              <p key={par} className="text-body text-genesis-mist leading-relaxed">
                {t(par)}
              </p>
            ))}

            {/* El reparto va justo bajo Tokenomics, que es donde lo pone el documento. */}
            {sec.titulo === 'Tokenomics' ? (
              <>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 m-0 pt-1">
                  {WHITEPAPER_REPARTO.map((r) => (
                    <div key={r.etiqueta} className="flex flex-col">
                      <dt className="sr-only">{t(r.etiqueta)}</dt>
                      <dd
                        dir="ltr"
                        className="m-0 font-display text-body-lg font-bold text-genesis-text"
                      >
                        {r.pct}
                      </dd>
                      <span className="text-caption text-genesis-ghost uppercase tracking-wider">
                        {t(r.etiqueta)}
                      </span>
                    </div>
                  ))}
                </dl>
                {/*
                  SE DICE QUE SUMA 100,01 %.
                  Es lo que publica el documento oficial. Corregirlo por mi
                  cuenta seria cambiar una cifra de un documento que no es mio;
                  callarlo seria peor, porque quien lo lea y sume lo vera igual
                  y pensara que el error es de la traduccion.
                */}
                <p className="text-caption text-state-warning">
                  {t('El reparto publicado en el documento suma 100,01 %.')}
                </p>
              </>
            ) : null}
          </div>
        ))}

        {/* ── Las 20 fases del documento ───────────────────────────── */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-body-lg text-genesis-text">
            {t('Hoja de ruta del documento (v1.1, febrero de 2024)')}
          </h3>
          <p className="text-caption text-state-warning">
            {t('No es la hoja de ruta vigente: la sección Roadmap del sitio está actualizada.')}
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 m-0 ps-5 text-body text-genesis-mist">
            {WHITEPAPER_FASES.map((fase) => (
              <li key={fase}>{t(fase)}</li>
            ))}
          </ol>
        </div>
      </section>

      <p className="text-caption text-genesis-ghost uppercase tracking-wider pt-4">
        {t('AiG Token · Whitepaper oficial v1.1 · Febrero 2024')}
      </p>
    </>
  )
}
