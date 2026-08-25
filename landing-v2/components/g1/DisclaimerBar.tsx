'use client'

import { useIdioma } from '@/context/IdiomaContext'

/**
 * DISCLAIMER BAR — el descargo persistente en superficies con contenido
 * financiero.
 *
 * ANTES ESTABA EN ESPAÑOL A PROPÓSITO, y esa decisión se revierte el
 * 25-ago-2026. El razonamiento era: «una traducción imprecisa de *no es
 * asesoría* cuesta caro». Es cierto, pero lleva a la conclusión contraria de la
 * que parece:
 *
 *   Un aviso de riesgo que quien lo lee NO ENTIENDE no protege a nadie.
 *
 * Dejarlo en español ante alguien que lee la web en croata o en árabe no es
 * prudencia: es un descargo que no descarga. Lo que importa a efectos legales es
 * que la persona quedara informada, y no queda informada en un idioma que no
 * habla. El riesgo de traducir se gestiona revisando la traducción; el riesgo de
 * no traducir no se gestiona de ninguna manera.
 *
 * LA CLAVE ES EL ESPAÑOL, y eso da la red de seguridad que faltaba: si algún día
 * se corrige el descargo en español, TODAS las traducciones dejan de aplicarse
 * solas y se vuelve a ver el original. Nunca queda una versión vieja diciendo
 * algo que el texto legal ya no dice.
 *
 * PENDIENTE Y DECLARADO: estas líneas tienen peso jurídico y conviene que
 * alguien las revise por idioma antes de darlas por definitivas.
 */
export function DisclaimerBar({ className = '' }: { className?: string }) {
  const { t, idioma } = useIdioma()
  const es = 'Informativo · no es asesoría financiera · participación voluntaria y con riesgos.'
  const texto = t(es)
  return (
    <p
      /* El idioma real del texto: si no hay traducción, `t` devuelve el
         español y hay que declararlo — un lector de pantalla en árabe
         pronunciaría el español con fonética árabe. */
      lang={texto === es && idioma !== 'es' ? 'es' : idioma}
      className={`font-mono text-[10.5px] leading-relaxed tracking-[0.04em] text-genesis-ghost ${className}`}
    >
      {texto}
    </p>
  )
}
