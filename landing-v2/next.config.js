/**
 * Configuración de Next + cabeceras de seguridad.
 *
 * No había ninguna cabecera definida. Para un sitio que enlaza a un portal
 * financiero y muestra un contrato en cadena, eso significa que cualquiera podía
 * embeberlo en un iframe y presentarlo como suyo, y que el navegador no tenía
 * ninguna instrucción sobre qué está permitido cargar.
 */

/**
 * CSP EN MODO INFORME, no bloqueante — a propósito.
 *
 * Una política mal ajustada no avisa: rompe el sitio en silencio, y el fallo
 * aparece en el navegador de un visitante, no en el build. Este sitio tiene tres
 * cosas que complican la política y hay que verlas funcionar antes de aplicarla:
 *
 *  - Dos scripts EN LÍNEA: la guarda de extensiones de cartera y el JSON-LD.
 *  - WebGL, que puede necesitar `blob:` para trabajadores y texturas.
 *  - Analytics servidos desde el propio dominio en Vercel (/_vercel/...), pero
 *    desde googletagmanager si algún día se enciende GA4.
 *
 * `unsafe-inline` en `script-src` está aquí porque los dos scripts en línea lo
 * requieren. La forma correcta de quitarlo es un `nonce` por petición, que
 * necesita middleware — se hará cuando la política esté validada en informe.
 * Ponerlo estricto hoy garantiza romper algo sin haber medido qué.
 *
 * Para pasar a bloqueante: cambiar la clave a `Content-Security-Policy` cuando
 * el panel de informes esté limpio durante unos días de tráfico real.
 */
const CSP_INFORME = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // equivalente moderno de X-Frame-Options, y el que de verdad respetan
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const CABECERAS = [
  {
    /*
     * Nadie debe poder embeber esta página. Es la defensa contra un sitio
     * fraudulento que la presente dentro de un marco propio para capturar
     * credenciales o dar apariencia oficial a otra cosa. Va duplicado con
     * `frame-ancestors` de la CSP a propósito: navegadores viejos entienden esta
     * y no aquélla.
     */
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    /*
     * Impide que el navegador adivine el tipo de un archivo. Sin esto, un
     * archivo subido que el servidor sirva como texto puede acabar ejecutándose
     * como script.
     */
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    /*
     * Al salir hacia el portal o hacia BSCScan se envía sólo el origen, no la
     * ruta completa. Evita filtrar por dónde navegaba el usuario dentro del
     * sitio a terceros que no lo necesitan.
     */
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    /*
     * Un año de HTTPS obligatorio, subdominios incluidos. `preload` queda FUERA
     * a propósito: entrar en la lista de precarga de los navegadores es
     * practicamente irreversible, y no se decide desde un archivo de
     * configuración sin que el dueño del dominio lo sepa.
     */
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    /*
     * Se apaga todo lo que el sitio no usa. No es paranoia: reduce lo que una
     * extensión o un script inyectado podría pedir en nombre de la página.
     */
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: CSP_INFORME,
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    /*
     * Por defecto Next solo negocia WebP. Anadir AVIF delante hace que los
     * navegadores que lo soportan reciban el formato mas pequeno, y los que no
     * caigan a WebP y despues a PNG por la cabecera `Accept` — no hay que
     * mantener variantes a mano ni se rompe nada en navegadores viejos.
     *
     * El coste esta en la PRIMERA peticion de cada tamano: codificar AVIF es
     * bastante mas lento que WebP. A partir de ahi la imagen queda en la cache
     * del optimizador, asi que lo paga un visitante y lo aprovechan todos.
     */
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  async headers() {
    return [{ source: '/:path*', headers: CABECERAS }]
  },
}

module.exports = nextConfig
