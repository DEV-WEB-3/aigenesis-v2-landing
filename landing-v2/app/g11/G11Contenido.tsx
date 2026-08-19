'use client'

import { Button } from '@/components/ui/genesis'
import { useIdioma } from '@/context/IdiomaContext'
import { presentacionParaIdioma } from '@/lib/i18n/presentacion'
import { ROUTES } from '@/lib/routes'
import {
  PRESENTACIONES_G11,
  PRESENTACIONES_G11_V1,
  GUIAS_G11,
  CANALES_G11,
  MB_PESADO,
  type PresentacionG11,
} from '@/lib/g11'

/**
 * EL CUERPO DE /g11, SEPARADO DE SU `page.tsx`.
 *
 * No es una división estética: `page.tsx` exporta `metadata`, y eso obliga a que
 * sea un componente de SERVIDOR. Traducir necesita `useT`, que es un hook y por
 * tanto sólo existe en cliente. Los dos requisitos no caben en el mismo archivo,
 * así que el metadata se queda arriba y el contenido baja aquí.
 *
 * Esta página se quedó fuera del primer barrido de traducción justamente porque
 * no es la portada: el recorrido midió las catorce secciones de `/` y estas tres
 * páginas propias no aparecen en ninguna. Lo que no entra en la medición, no
 * existe para la medición.
 */
function FichaPresentacion({ p, antigua = false }: { p: PresentacionG11; antigua?: boolean }) {
  const pesado = p.mb >= MB_PESADO
  return (
    <li>
      <a
        href={p.archivo}
        target="_blank"
        rel="noopener noreferrer"
        /*
         * `dir="rtl"` POR FICHA, y ahora conviven dos direcciones.
         *
         * Antes el documento entero era LTR y sólo estas fichas iban al revés.
         * Ahora el documento puede ser RTL —si alguien lee la página en árabe—
         * y entonces son las fichas LATINAS las que necesitan declararse: sin
         * esto, «Deutsch» dentro de un documento árabe hereda RTL y el nombre
         * queda alineado al lado que no lee quien lo busca.
         *
         * Se declara la dirección de CADA ficha por su propio idioma, que es lo
         * único que no depende de en qué idioma esté leyendo el visitante.
         */
        dir={p.rtl ? 'rtl' : 'ltr'}
        lang={p.codigo}
        className={`surface-card card-genesis-hover focus-ring-genesis rounded-2xl px-genesis-4 py-genesis-4 flex flex-col gap-1 no-underline h-full ${
          antigua ? 'opacity-75' : ''
        }`}
      >
        <span className="font-display text-body-lg text-genesis-text">{p.nativo}</span>
        {/* El peso es cifra y unidad: se aísla para que «2,5 MB» no se reordene en RTL. */}
        <span
          dir="ltr"
          className={`text-caption uppercase tracking-wider ${
            pesado ? 'text-state-warning' : 'text-genesis-ghost'
          }`}
        >
          PDF · {p.mb} MB
        </span>
      </a>
    </li>
  )
}

export default function G11Contenido() {
  const { idioma, t } = useIdioma()
  /* La presentación que le toca a quien está leyendo, sin que tenga que buscarla. */
  const miPresentacion = presentacionParaIdioma(idioma)
  return (
    <>
      <p className="text-genesis-text font-medium">
        {t(
          'El material con el que se crece: guías, presentaciones oficiales y los canales donde está la comunidad.'
        )}
      </p>

      {/* ── Guías ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="g11-guias">
        <h2 id="g11-guias" className="font-display text-heading text-genesis-text mb-1">
          {t('Guías')}
        </h2>
        <p className="text-body text-genesis-ghost mb-4">
          {t('Los cuatro pasos, de la cuenta nueva a la oficina virtual.')}
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none m-0 p-0">
          {GUIAS_G11.map((guia) => {
            const contenido = (
              <>
                <span className="font-display text-body-lg text-genesis-text">
                  {t(guia.titulo)}
                </span>
                <span className="text-body text-genesis-mist">{t(guia.descripcion)}</span>
                {/*
                  La etiqueta de «en el canal» sólo aparece si NO hay vídeo
                  propio. En cuanto se rellene la URL en `lib/g11.ts`, la ficha
                  se convierte en enlace y esta línea desaparece sola — no hay
                  que acordarse de venir a borrarla.
                */}
                {guia.video ? null : (
                  <span className="text-caption text-genesis-ghost uppercase tracking-wider">
                    {t('Disponible en el canal')}
                  </span>
                )}
              </>
            )

            return (
              <li key={guia.titulo}>
                {guia.video ? (
                  <a
                    href={guia.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card card-genesis-hover focus-ring-genesis rounded-2xl p-genesis-6 flex flex-col gap-2 no-underline h-full"
                  >
                    {contenido}
                  </a>
                ) : (
                  <div className="surface-card rounded-2xl p-genesis-6 flex flex-col gap-2 h-full">
                    {contenido}
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        <div className="pt-4">
          <Button
            variant="secondary"
            size="md"
            href={CANALES_G11.find((c) => c.nombre === 'YouTube')!.url}
          >
            Ver las guías en YouTube
          </Button>
        </div>
      </section>

      {/* ── Presentaciones ────────────────────────────────────────────── */}
      <section aria-labelledby="g11-presentaciones">
        <h2 id="g11-presentaciones" className="font-display text-heading text-genesis-text mb-1">
          {t('Presentaciones oficiales')}
        </h2>
        <p className="text-body text-genesis-ghost mb-4">
          {t(
            'Versión 5.0, en ocho idiomas. Cada ficha indica su peso: son unos 2,5 MB, pensadas para descargar y enseñar desde el móvil.'
          )}
        </p>

        {/*
          LA DEL IDIOMA EN CURSO, ARRIBA Y COMO BOTON.
          
          La rejilla de abajo sigue estando entera —alguien que enseña la
          presentacion necesita PODER elegir el idioma de a quien se la
          enseña—, pero el caso mayoritario es querer la suya. Tenerla que
          buscar entre once fichas cuando la pagina ya sabe en que idioma se
          esta leyendo es hacer trabajar al visitante por nada.
        */}
        <div className="flex flex-col items-start gap-2 pb-5">
          <Button variant="primary" size="md" href={miPresentacion.archivo}>
            {`${t('Descargar la presentación')} · ${miPresentacion.nativo}`}
          </Button>
          <span className="text-caption text-genesis-ghost" dir="ltr">
            PDF · {miPresentacion.mb} MB
            {miPresentacion.material === 'v1' ? (
              <span className="text-state-warning"> · {t('Versión anterior (v1)')}</span>
            ) : null}
          </span>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none m-0 p-0">
          {PRESENTACIONES_G11.map((p) => (
            <FichaPresentacion key={p.archivo} p={p} />
          ))}
        </ul>

        {/*
          Bloque aparte, no una fila más de la rejilla de arriba.
          La v5.0 no tiene alemán, serbio ni urdu; la v1 sí. Borrarlos habría
          dejado a tres comunidades sin material, y mezclarlos con los de arriba
          sería hacer pasar el v1 por v5. Se conservan, separados y etiquetados.
        */}
        <div className="pt-6">
          <h3 className="text-caption text-genesis-ghost uppercase tracking-wider mb-1">
            {t('Sólo en versión anterior (v1)')}
          </h3>
          <p className="text-body text-genesis-ghost mb-3">
            {t('Estos idiomas todavía no tienen la 5.0. Son archivos antiguos y más pesados.')}
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none m-0 p-0">
            {PRESENTACIONES_G11_V1.map((p) => (
              <FichaPresentacion key={p.archivo} p={p} antigua />
            ))}
          </ul>
        </div>
      </section>

      {/* ── Canales ───────────────────────────────────────────────────── */}
      <section aria-labelledby="g11-canales">
        <h2 id="g11-canales" className="font-display text-heading text-genesis-text mb-1">
          {t('Canales oficiales')}
        </h2>
        <p className="text-body text-genesis-ghost mb-4">
          {t('Los canales de la comunidad G11. Son distintos de los de AiGenesis.')}
        </p>

        <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
          {CANALES_G11.map((c) => (
            <li key={c.nombre}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-11 px-5 rounded-full border border-hairline text-body text-genesis-mist hover:text-genesis-text hover:border-genesis-ion no-underline transition-base focus-ring-genesis"
              >
                {c.nombre}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Alta ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="g11-alta" className="pt-2">
        <h2 id="g11-alta" className="font-display text-heading text-genesis-text mb-1">
          {t('Empezar')}
        </h2>
        <p className="text-body text-genesis-mist mb-4">
          {t(
            'El alta necesita el enlace de tu patrocinador y una cartera Web3. Si aún no tienes patrocinador, escribe por cualquiera de los canales de arriba.'
          )}
        </p>
        <Button variant="signature" size="lg" href={ROUTES.REGISTER}>
          Crear cuenta
        </Button>
      </section>
    </>
  )
}
