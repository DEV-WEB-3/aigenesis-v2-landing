'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  IDIOMAS,
  IDIOMA_POR_DEFECTO,
  buscarIdioma,
  idiomaDelNavegador,
  type CodigoIdioma,
} from '@/lib/i18n/idiomas'
import { hayTraduccion, traducir } from '@/lib/i18n/traducir'
import { INVARIABLES } from '@/lib/i18n/invariables'

/**
 * EL IDIOMA DEL PORTAL.
 *
 * LA CLAVE DE TRADUCCION ES EL TEXTO EN ESPAÑOL, no un identificador.
 *
 * Es decir: se escribe `t('Explorar Marketplace →')` y no
 * `t('marketplace.cta')`. Tiene tres consecuencias, y las tres importan:
 *
 *  1. NO HAY CLAVES QUE INVENTAR ni convenios que recordar. Quien escribe una
 *     seccion escribe el texto que se ve, como siempre.
 *  2. LA REGRESION ES IMPOSIBLE. Si falta una traduccion, sale el español —que
 *     es texto correcto—. Con claves simbolicas, una clave sin traducir sale
 *     como `marketplace.cta` en mitad de la pagina: un fallo visible y feo.
 *  3. CAMBIAR EL ESPAÑOL INVALIDA SU TRADUCCION, y eso es exactamente lo que
 *     debe pasar: si cambia el original, la traduccion vieja ya no le
 *     corresponde. Con claves simbolicas el texto cambia y la traduccion se
 *     queda, en silencio, diciendo otra cosa.
 *
 * El precio es que un cambio de una coma en español deja esa frase sin traducir
 * hasta que se actualice el diccionario. Es un precio justo: prefiero perder una
 * traduccion a mostrar una equivocada.
 *
 * SE PERSISTE LA ELECCION, y solo la eleccion. Al entrar por primera vez se
 * propone el idioma del navegador; en cuanto alguien elige, manda su eleccion
 * para siempre — nadie quiere que la web le corrija el idioma que acaba de
 * poner.
 */

const CLAVE = 'genesis:idioma'

interface Contexto {
  idioma: CodigoIdioma
  rtl: boolean
  cambiar: (c: CodigoIdioma) => void
  t: (es: string) => string
}

const IdiomaCtx = createContext<Contexto | null>(null)

export function IdiomaProvider({ children }: { children: React.ReactNode }) {
  /*
   * Arranca SIEMPRE en español, aunque el navegador pida otro.
   *
   * El servidor pinta el HTML en español y no sabe nada del navegador. Si el
   * cliente arrancara en otro idioma, el primer render no coincidiria con el
   * HTML servido y React descartaria el arbol entero por desajuste de
   * hidratacion. El idioma real se aplica en un efecto, ya en el cliente.
   */
  const [idioma, setIdioma] = useState<CodigoIdioma>(IDIOMA_POR_DEFECTO)

  useEffect(() => {
    let inicial: CodigoIdioma | undefined
    try {
      const guardado = window.localStorage.getItem(CLAVE)
      if (guardado && buscarIdioma(guardado)) inicial = guardado as CodigoIdioma
    } catch {
      /* almacenamiento bloqueado: se sigue con el del navegador */
    }
    setIdioma(inicial ?? idiomaDelNavegador())
  }, [])

  /*
   * `lang` y `dir` van en el ELEMENTO RAIZ, no en un contenedor.
   *
   * `lang` es lo que usan los lectores de pantalla para elegir la voz y el
   * navegador para partir palabras; `dir` invierte la maquetacion entera —no
   * solo el texto: tambien margenes logicos, orden de flex y scrollbars—. En un
   * contenedor interior, la mitad de la pagina se quedaria del reves.
   */
  useEffect(() => {
    const info = buscarIdioma(idioma)
    const raiz = document.documentElement
    raiz.lang = idioma
    raiz.dir = info?.rtl ? 'rtl' : 'ltr'
  }, [idioma])

  const cambiar = useCallback((c: CodigoIdioma) => {
    if (!buscarIdioma(c)) return
    setIdioma(c)
    try {
      window.localStorage.setItem(CLAVE, c)
    } catch {
      /* sin almacenamiento, el idioma dura lo que la pestaña */
    }
  }, [])

  const t = useCallback(
    (es: string) => {
      /*
       * LA BÚSQUEDA VIVE EN `lib/i18n/traducir`, no aquí.
       *
       * La movimos cuando resultó que el endpoint del asistente —el mismo
       * cerebro para la página y para el portal— devolvía español siempre:
       * traducir era algo que sólo sabía hacer React. Lo que queda aquí es lo
       * que SÍ es del contexto: el idioma vigente y el aviso de desarrollo.
       */
      const trad = traducir(es, idioma)
      /*
       * Sin traduccion se devuelve el ESPAÑOL, nunca la clave ni un hueco. En
       * desarrollo se avisa una sola vez por cadena: un aviso por render
       * convierte la consola en ruido y deja de leerse.
       *
       * Se pregunta por la FILA y no se compara `trad !== es`: las frases que
       * se traducen a sí mismas —las marcas, «P2P», «Powered by»— darían un
       * aviso falso, y un aviso que grita por lo correcto deja de leerse.
       */
      if (
        process.env.NODE_ENV !== 'production' &&
        idioma !== 'es' &&
        !hayTraduccion(es, idioma) &&
        !INVARIABLES.has(es) &&
        /[A-Za-zÀ-ɏЀ-ӿ؀-ۿ]/.test(es)
      ) {
        avisarUnaVez(es, idioma)
      }
      return trad
    },
    [idioma]
  )

  const valor = useMemo<Contexto>(
    () => ({ idioma, rtl: Boolean(buscarIdioma(idioma)?.rtl), cambiar, t }),
    [idioma, cambiar, t]
  )

  return <IdiomaCtx.Provider value={valor}>{children}</IdiomaCtx.Provider>
}

const avisados = new Set<string>()
function avisarUnaVez(es: string, idioma: string) {
  const clave = `${idioma}::${es}`
  if (avisados.has(clave)) return
  avisados.add(clave)
  console.warn(`[i18n] sin ${idioma}: ${JSON.stringify(es)}`)
}

/**
 * Fuera del proveedor devuelve español y un `cambiar` inerte en vez de lanzar.
 *
 * Asi un componente compartido puede llamar a `t()` sin saber si esta dentro del
 * portal traducido o en una pagina suelta —legal, whitepaper, g11—, que es
 * justo lo que permite traducir desde los componentes de UI en lugar de desde
 * las catorce secciones.
 */
export function useIdioma(): Contexto {
  const ctx = useContext(IdiomaCtx)
  if (ctx) return ctx
  return {
    idioma: IDIOMA_POR_DEFECTO,
    rtl: false,
    cambiar: () => {},
    t: (es: string) => es,
  }
}

/** Atajo para el caso mayoritario: solo traducir. */
export function useT(): (es: string) => string {
  return useIdioma().t
}

export { IDIOMAS }
