'use client'

import { useEffect } from 'react'

/**
 * Pantalla de error de la aplicación.
 *
 * Se muestra cuando una ruta revienta en cliente. Sin este archivo, Next enseña
 * su pantalla por defecto —o en producción, una página en blanco.
 *
 * TRES DECISIONES:
 *
 * 1. `reset()` primero. La mayoría de estos errores son transitorios: un chunk
 *    que no llegó, una condición de carrera al hidratar. Reintentar resuelve más
 *    casos que recargar, y no pierde el estado de scroll.
 *
 * 2. Sin WebGL ni animación, igual que el 404. Si la capa 3D es lo que ha
 *    fallado, una pantalla de error que dependa de ella tampoco aparecerá.
 *
 * 3. El `digest` se muestra sólo si existe. Es el identificador que Next genera
 *    para correlacionar con los registros del servidor: para el usuario no
 *    significa nada, pero es lo único que permite encontrar el error real
 *    cuando alguien lo reporta.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[error de ruta]', error)
    }
  }, [error])

  return (
    <main className="genesis-error-page">
      <div className="genesis-error-page__glow" aria-hidden="true" />
      <div className="genesis-error-page__content">
        <p className="genesis-error-page__code">Error</p>
        <h1 className="genesis-error-page__title">Algo se ha interrumpido</h1>
        <p className="genesis-error-page__text">
          No hemos podido cargar esta parte del sitio. Suele resolverse
          reintentando; si persiste, vuelve al inicio.
        </p>
        <div className="genesis-error-page__actions">
          <button
            type="button"
            onClick={reset}
            className="genesis-error-page__btn genesis-error-page__btn--primary"
          >
            Reintentar
          </button>
          <a href="/" className="genesis-error-page__btn">
            Volver al inicio
          </a>
        </div>
        {error.digest ? (
          <p className="genesis-error-page__digest">
            Referencia: <code>{error.digest}</code>
          </p>
        ) : null}
      </div>
    </main>
  )
}
