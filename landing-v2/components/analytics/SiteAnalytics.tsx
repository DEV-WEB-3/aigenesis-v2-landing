'use client'

/*
 * `/next`, no `/react`.
 *
 * Los dos funcionan, pero la entrada de Next se engancha al router de la app
 * —`next/navigation`— y cuenta las navegaciones del App Router como vistas. La
 * generica de React solo ve la carga inicial, y en un sitio que navega por
 * secciones eso es casi todo el trafico sin registrar. Es ademas la que Vercel
 * documenta para Next.
 */
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/*
 * FUERA DE VERCEL, LOS DOS DE VERCEL NO SE MONTAN.
 *
 * `/_vercel/insights/script.js` y `/_vercel/speed-insights/script.js` los sirve
 * la plataforma: en la copia estatica que va a Hostinger no existen. Medido en
 * vivo sobre `aigenesis.io/nueva/`: dos 404 en CADA carga de pagina.
 *
 * No rompian nada —la pagina funciona igual— y por eso es justo el tipo de
 * ruido que se queda para siempre: nadie lo mira porque nada falla. Ademas
 * ensucia la consola donde un dia habra que buscar un fallo de verdad.
 *
 * TIENE QUE SER `NEXT_PUBLIC_`, y me costó una subida descubrirlo.
 *
 * Este es un componente de CLIENTE. En el paquete del navegador Next sólo
 * sustituye las variables que empiezan por `NEXT_PUBLIC_`; las demás quedan
 * como `undefined`. La primera versión usaba `process.env.EXPORTAR_ESTATICO`,
 * que en el servidor vale '1' y en el navegador `undefined` — así que la
 * condición SIEMPRE daba «estoy en Vercel» y los dos scripts se seguían
 * montando.
 *
 * Y NO LO VIO EL `grep` DEL HTML. Busqué `_vercel` en los archivos exportados y
 * dio cero, porque estos scripts no están en el HTML: los inyecta el JavaScript
 * al arrancar. Lo delató medir los recursos REALES en el navegador. Un grep
 * sobre lo que se sube no puede ver lo que se añade después de cargar.
 */
const EN_VERCEL = process.env.NEXT_PUBLIC_EXPORTACION_ESTATICA !== '1'

/**
 * Vercel Analytics (prod/preview) + GA4 opcional cuando hay env.
 *
 * SI LA CONSOLA DE PRODUCCION SE QUEJA DE `/_vercel/insights/script.js`
 * ---------------------------------------------------------------------
 *   Failed to load resource: 404
 *   Refused to execute script ... MIME type ('text/html') is not executable
 *
 * NO es un fallo del codigo y NO se arregla quitando `<Analytics />`. Esa ruta
 * la sirve la propia plataforma, y solo existe si Web Analytics esta ACTIVADO
 * en el proyecto de Vercel. Mientras no lo este, la peticion cae en el HTML de
 * la pagina de error, de ahi el `text/html`.
 *
 * Se activa en el panel: Proyecto -> Analytics -> Enable. En el plan Hobby es
 * gratuito. No hay endpoint publico en la API para hacerlo —comprobado contra
 * v1 y v9, los cuatro caminos devuelven 404—, asi que es un clic manual.
 *
 * Y HACE FALTA DESPLEGAR DESPUES. Activarlo no basta: la ruta se provisiona
 * para los despliegues POSTERIORES. Con el interruptor ya puesto —`enabledAt`
 * presente en la API— el sitio vivo seguia devolviendo 404 porque su build era
 * anterior. Si alguien vuelve a ver este error con Analytics activado, lo que
 * falta es un despliegue nuevo, no tocar este archivo.
 *
 * Speed Insights, que va por `/_vercel/speed-insights/script.js`, SI esta
 * activo y con datos; por eso solo protesta uno de los dos.
 */
export default function SiteAnalytics() {
  return (
    <>
      {EN_VERCEL ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
    </>
  )
}
