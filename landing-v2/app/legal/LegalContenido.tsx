'use client'

import { useT } from '@/context/IdiomaContext'
import { PAGES, SITE_URL } from '@/lib/routes'
import { OFFICIAL_SOCIAL } from '@/lib/official-links'

const LEGAL_DISCLAIMER =
  'AiGenesis involucra activos digitales y tecnologías blockchain. La participación puede implicar riesgos tecnológicos, regulatorios y de mercado. Ningún contenido debe interpretarse como garantía de rendimiento financiero.'

/**
 * EL CUERPO DE /legal.
 *
 * TRADUCIR TEXTO LEGAL TIENE UN MATIZ que el resto del portal no tiene: una
 * advertencia de riesgo traducida sin abogado sigue siendo una advertencia de
 * riesgo, y quien la lee actúa sobre ella. Se traduce igualmente —dejarla sólo
 * en español significa que diez comunidades no la entienden, que es peor— pero
 * la propia página dice, y ahora lo dice en once idiomas, que es un borrador
 * pendiente de revisión legal. Esa frase viaja con el texto a propósito: es la
 * que sitúa lo que se está leyendo.
 *
 * Cuando llegue la revisión legal, lo que hay que revisar son las once
 * versiones, no la española.
 */
export default function LegalContenido() {
  const t = useT()
  return (
    <>
      <p>{t(LEGAL_DISCLAIMER)}</p>

      <section id="privacy" className="flex flex-col gap-4">
        <h2 className="font-display text-heading text-genesis-text">{t('Privacidad')}</h2>
        <p>
          {t(
            'AiGenesis trata los datos personales conforme a las prácticas descritas en esta documentación. Para consultas sobre privacidad, escríbenos a'
          )}{' '}
          <a href={OFFICIAL_SOCIAL.EMAIL} className="text-genesis-ion hover:underline" dir="ltr">
            tokenaig@aigenesis.io
          </a>
          . {t('Política de privacidad completa pendiente de revisión legal.')}
        </p>
      </section>

      <section id="riesgos" className="flex flex-col gap-4">
        <h2 className="font-display text-heading text-genesis-text">{t('Riesgos')}</h2>
        <p>
          {t(
            'Los activos digitales pueden experimentar alta volatilidad. Los protocolos blockchain pueden contener vulnerabilidades tecnológicas. Los marcos regulatorios varían por jurisdicción y pueden cambiar sin previo aviso.'
          )}
        </p>
        <p>
          {t(
            'AiGenesis no proporciona asesoramiento financiero, legal ni fiscal. Consulte profesionales calificados antes de participar.'
          )}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-heading text-genesis-text">{t('Contacto')}</h2>
        <p>
          {/*
            Correo, URL y ruta van con `dir="ltr"`. Una dirección se lee de
            izquierda a derecha en las once lenguas, y dentro de un párrafo árabe
            el punto final de «aigenesis.io» se recoloca: deja de ser parte de la
            dirección y pasa a ser puntuación de la frase.
          */}
          {t('Consultas legales o de cumplimiento:')}{' '}
          <a href={OFFICIAL_SOCIAL.EMAIL} className="text-genesis-ion hover:underline" dir="ltr">
            tokenaig@aigenesis.io
          </a>
          . {t('Sitio institucional:')}{' '}
          <a href={SITE_URL} className="text-genesis-ion hover:underline" dir="ltr">
            {SITE_URL}
          </a>
          . {t('Documentación adicional en')}{' '}
          <a href={PAGES.WHITEPAPER} className="text-genesis-ion hover:underline">
            {t('whitepaper')}
          </a>
          .
        </p>
      </section>

      <p className="text-caption text-genesis-ghost uppercase tracking-wider pt-4">
        {t('Borrador operativo — revisión legal pendiente antes de producción en dominio principal.')}
      </p>
    </>
  )
}
