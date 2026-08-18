'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

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
 * Speed Insights, que va por `/_vercel/speed-insights/script.js`, SI esta
 * activo y con datos; por eso solo protesta uno de los dos.
 */
export default function SiteAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
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
