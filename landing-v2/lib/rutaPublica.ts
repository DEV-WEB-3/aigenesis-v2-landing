/**
 * PREFIJA LAS RUTAS ESCRITAS A MANO CUANDO EL SITIO CUELGA DE UNA SUBCARPETA.
 *
 * `basePath` de Next prefija su propio enrutado —`/_next/…`, los `<Link>`, las
 * rutas de página— pero NO toca una cadena literal como
 * `'/docs/aigenesis-whitepaper-v1.1.pdf'` o `src="/brand/genesis-mark-512.png"`.
 * Esas se quedan apuntando a la raíz del dominio.
 *
 * MEDIDO, no supuesto: al exportar para `aigenesis.io/nueva/`, el HTML salió
 * con `href="/docs/aigenesis-whitepaper-v1.1.pdf"` y `src="/brand/…"`. En ese
 * servidor la raíz es la plataforma Genesis, así que el PDF del whitepaper y
 * las cinco imágenes de marca habrían dado 404 — y el listado de archivos se
 * veía perfecto. Es el tipo de fallo que sólo aparece en el navegador de
 * alguien, después de subirlo.
 *
 * En la raíz de un dominio la variable va vacía y esto no hace nada: la copia
 * de Vercel se construye exactamente igual que hoy.
 */
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '')

export function rutaPublica(ruta: string): string {
  if (!BASE) return ruta
  /* Sólo las absolutas del propio sitio: una URL externa o una relativa no se
     tocan. Prefijar `https://…` produciría una ruta rota y silenciosa. */
  if (!ruta.startsWith('/')) return ruta
  if (ruta.startsWith(`${BASE}/`)) return ruta
  return `${BASE}${ruta}`
}
