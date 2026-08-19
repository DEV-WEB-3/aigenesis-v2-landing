'use client'

import Link from 'next/link'
import { useT } from '@/context/IdiomaContext'

/**
 * El cuerpo del 404, separado por lo mismo que en g11 y legal: `not-found.tsx`
 * exporta `metadata` y por tanto es de servidor, y traducir necesita un hook.
 *
 * Un 404 es la página que MÁS necesita estar en el idioma del visitante: es
 * exactamente el momento en el que alguien está perdido, y darle la explicación
 * en un idioma que no lee lo deja igual de perdido pero además fuera.
 */
export default function NotFoundContenido() {
  const t = useT()
  return (
    <>
      {/* El código es cifra: se aísla para que no se reordene en RTL. */}
      <p className="genesis-error-page__code" dir="ltr">
        404
      </p>
      <h1 className="genesis-error-page__title">{t('Esta dirección no existe')}</h1>
      <p className="genesis-error-page__text">
        {t(
          'El enlace que has seguido apunta a un punto del universo que no está cartografiado. El ecosistema sigue donde lo dejaste.'
        )}
      </p>
      <div className="genesis-error-page__actions">
        <Link href="/" className="genesis-error-page__btn genesis-error-page__btn--primary">
          {t('Volver al inicio')}
        </Link>
        <Link href="/#ecosistema" className="genesis-error-page__btn">
          {t('Ver el ecosistema')}
        </Link>
      </div>
    </>
  )
}
