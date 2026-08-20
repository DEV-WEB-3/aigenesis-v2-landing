'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useT } from '@/context/IdiomaContext'
import { PAGES } from '@/lib/routes'

/**
 * AVISO DE COOKIES — y por qué dice lo que dice.
 *
 * LO PRIMERO FUE MEDIR QUÉ GUARDA EL SITIO, no copiar un banner. Sobre
 * aigenesis.io, el 19-ago-2026:
 *
 *   · `genesis:idioma` en localStorage — nuestro, guarda el idioma elegido.
 *   · CERO recursos de terceros. Ni fuentes, ni analítica, ni chat externo.
 *   · `_ga`, `_ga_66CZ4XTLJF`, `gt_autoswitch`, `wpEmojiSettingsSupports` —
 *     restos del WordPress anterior, todavía en el dominio.
 *
 * De ahí salen dos decisiones:
 *
 * 1. NO HAY BOTÓN DE «RECHAZAR TODO», Y NO ES UN ATAJO. Rechazar implica que
 *    hay algo opcional que rechazar, y aquí no lo hay: lo único que este sitio
 *    guarda es la lengua en la que quieres leerlo. Poner «Aceptar / Rechazar»
 *    sería teatro — el botón de rechazar no podría desactivar nada, porque no
 *    hay nada que desactivar. Un aviso que finge dar una opción que no existe
 *    es peor que no tenerlo: entrena a la gente a no leerlos.
 *
 * 2. SE DICE QUÉ SE GUARDA, POR SU NOMBRE. «Utilizamos cookies para mejorar tu
 *    experiencia» no informa de nada. «Guardamos el idioma que eliges» sí, y
 *    además es verdad y comprobable abriendo el inspector.
 *
 * EL DÍA QUE SE ENCIENDA LA ANALÍTICA, ESTO YA NO VALE. Si se activa GA4 o
 * cualquier medición, hace falta consentimiento REAL: dos botones que de
 * verdad enciendan y apaguen, y no cargar nada hasta que se acepte. Ese día se
 * cambia este componente — no se le añade un botón decorativo.
 *
 * NO BLOQUEA LA PÁGINA. Va abajo, se puede ignorar y el sitio funciona igual,
 * porque no hay ninguna decisión que tomar antes de leer. Un modal que tapa el
 * contenido para informar de que se guarda un idioma es desproporcionado.
 */

const CLAVE = 'genesis:aviso-cookies'

export default function AvisoCookies() {
  /*
   * Arranca oculto y se decide en un efecto, igual que el idioma: el HTML se
   * genera en el build y no sabe si esta persona ya lo leyó. Pintarlo en el
   * servidor y quitarlo en el cliente produce un parpadeo en CADA carga para
   * quien ya lo aceptó.
   */
  const [visible, setVisible] = useState(false)
  const t = useT()

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(CLAVE)) setVisible(true)
    } catch {
      /* Con el almacenamiento bloqueado no se puede recordar la respuesta, así
         que tampoco se pregunta: preguntar en cada carga sin poder recordar es
         molestar sin obtener nada. */
    }
  }, [])

  const aceptar = useCallback(() => {
    try {
      window.localStorage.setItem(CLAVE, new Date().toISOString())
    } catch {
      /* sin almacenamiento, dura lo que la pestaña */
    }
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <aside
      className="aviso-cookies"
      role="region"
      aria-label={t('Aviso sobre almacenamiento')}
    >
      <p className="aviso-cookies__texto">
        {t(
          'Este sitio no usa cookies de seguimiento ni carga servicios de terceros. Solo guarda en tu navegador el idioma que elijas, para no volver a preguntártelo.'
        )}{' '}
        <Link href={PAGES.LEGAL} className="aviso-cookies__enlace">
          {t('Más información')}
        </Link>
      </p>
      <button type="button" className="aviso-cookies__boton" onClick={aceptar}>
        {t('Entendido')}
      </button>
    </aside>
  )
}
