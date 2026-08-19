import type { Metadata } from 'next'
import NotFoundContenido from './NotFoundContenido'

/**
 * 404 con marca.
 *
 * Antes no existía y Next servía su pantalla por defecto: fondo blanco, texto
 * negro, sin salida. En un sitio cuyo fondo es el vacío, eso es un fogonazo
 * blanco en la cara y la sensación de haberse caído fuera del producto.
 *
 * Deliberadamente sin WebGL ni animación: una página de error tiene que cargar
 * cuando algo ya ha ido mal. Si depende de la misma capa que puede estar
 * fallando, no sirve de nada.
 */
export const metadata: Metadata = {
  title: 'Página no encontrada — AiGenesis',
  description: 'La dirección solicitada no existe en AiGenesis.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="genesis-error-page">
      <div className="genesis-error-page__glow" aria-hidden="true" />
      <div className="genesis-error-page__content">
        <NotFoundContenido />
      </div>
    </main>
  )
}
