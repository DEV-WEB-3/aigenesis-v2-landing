'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * EL ALIENTO DE LA CONSOLA — un solo latido para todo el asistente.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * QUÉ PROBLEMA RESUELVE
 * ═══════════════════════════════════════════════════════════════════════════
 * Una consola que no se mueve se lee como una imagen. El objetivo no es
 * «animarla»: es que tenga presencia — que respire cuando espera, que se
 * concentre cuando piensa y que se mueva con la voz cuando habla.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LAS DOS DECISIONES QUE HACEN QUE PAREZCA VIVO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1 · LA RESPIRACIÓN ES ASIMÉTRICA.
 *
 *    Una onda seno sube y baja en el mismo tiempo, y eso el ojo lo lee como
 *    mecánico: es un latido de máquina. La respiración real NO es simétrica —
 *    se inspira en torno al 40 % del ciclo y se espira en el 60 % restante.
 *    Copiar esa proporción es la diferencia entre «un div que pulsa» y algo que
 *    parece que está vivo. Cuesta tres líneas y es el 80 % del efecto.
 *
 *    El ritmo va a ~4,5 s por ciclo (unas 13 por minuto), que es el de alguien
 *    en calma. Más rápido inquieta; más lento parece que se apagó.
 *
 * 2 · LA VOZ NECESITA ENVOLVENTE, NO AMPLITUD.
 *
 *    Pintar la amplitud del audio tal cual produce un parpadeo epiléptico: la
 *    voz humana es entrecortada y el valor salta docenas de veces por segundo.
 *    Lo que se percibe como «reacciona a la voz» es una ENVOLVENTE con ataque
 *    rápido y caída lenta —lo mismo que hace un compresor de audio—: sube de
 *    golpe con la sílaba y baja despacio en la pausa. Sin eso, el borde
 *    tiembla; con eso, el borde habla.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * POR QUÉ UN SOLO ESCRITOR Y UNA SOLA VARIABLE
 * ═══════════════════════════════════════════════════════════════════════════
 * Se escribe `--g-aliento` (0..1) en el elemento raíz, y el panel, el botón y
 * lo que venga después la LEEN. Si cada pieza se animara por su cuenta con su
 * propio `@keyframes`, arrancarían en momentos distintos y derivarían: se
 * verían tres animaciones sueltas en vez de un organismo. Un latido, muchos
 * oyentes.
 *
 * Y no pasa por el estado de React: el bucle escribe una propiedad CSS. Un
 * `setState` a 60 fps repintaría el asistente entero sesenta veces por segundo
 * para mover un brillo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ModoAliento = 'reposo' | 'pensando' | 'hablando'

/** Ciclo de respiración en calma, en segundos. */
const CICLO = 4.5
/** Proporción del ciclo que dura la inspiración. El resto se espira. */
const INSPIRA = 0.4

/* Constantes de la envolvente, en segundos. El ataque corto deja pasar la
   sílaba; la caída larga sostiene el brillo durante la pausa entre palabras. */
const ATAQUE = 0.04
const CAIDA = 0.22

export interface Aliento {
  /** Cambia el modo sin repintar nada de React. */
  modo: (m: ModoAliento) => void
  /**
   * Engancha el analizador al audio de un elemento y pasa a modo «hablando».
   * Si no se puede (audio de otro origen sin CORS), cae a una envolvente
   * sintética: sigue pareciendo que habla, sin arriesgar el sonido.
   */
  escuchar: (el: HTMLMediaElement) => void
  /** Vuelve a respirar en calma. */
  callar: () => void
}

export function useAliento(activo: boolean): Aliento {
  const modoRef = useRef<ModoAliento>('reposo')
  const envRef = useRef(0)
  const analizadorRef = useRef<AnalyserNode | null>(null)
  /* `Uint8Array<ArrayBuffer>` y no `Uint8Array` a secas: desde TypeScript 5.7 el
     tipo lleva parámetro y `getByteTimeDomainData` sólo acepta el respaldado por
     un `ArrayBuffer` normal, no por uno compartido. */
  const bufRef = useRef<Uint8Array<ArrayBuffer> | null>(null)
  /* El contexto y la fuente se guardan para NO crearlos dos veces sobre el
     mismo elemento: `createMediaElementSource` lanza si se repite, y una
     excepción ahí deja el video sin sonido. */
  const ctxRef = useRef<AudioContext | null>(null)
  const enganchadosRef = useRef(new WeakSet<HTMLMediaElement>())

  const modo = useCallback((m: ModoAliento) => {
    modoRef.current = m
  }, [])

  const callar = useCallback(() => {
    modoRef.current = 'reposo'
    analizadorRef.current = null
  }, [])

  const escuchar = useCallback((el: HTMLMediaElement) => {
    modoRef.current = 'hablando'
    /* Ya enganchado antes: se reutiliza el analizador. Volver a crear la fuente
       sobre el mismo elemento tira una excepción y silencia el video. */
    if (enganchadosRef.current.has(el)) return
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      const ctx = ctxRef.current ?? new Ctor()
      ctxRef.current = ctx
      void ctx.resume()
      const fuente = ctx.createMediaElementSource(el)
      const an = ctx.createAnalyser()
      an.fftSize = 1024
      /* El suavizado propio del analizador se deja bajo: el alisado bueno lo
         hace la envolvente de abajo, que sí distingue subir de bajar. */
      an.smoothingTimeConstant = 0.2
      fuente.connect(an)
      /* IMPRESCINDIBLE: si no se reconecta a la salida, el video se queda mudo.
         El grafo se traga el audio y no sale por ningún lado. */
      an.connect(ctx.destination)
      analizadorRef.current = an
      bufRef.current = new Uint8Array(an.fftSize)
      enganchadosRef.current.add(el)
    } catch {
      /* Sin analizador se sigue en modo «hablando» con envolvente sintética.
         El efecto se degrada; el sonido no se toca. */
      analizadorRef.current = null
    }
  }, [])

  useEffect(() => {
    const raiz = document.documentElement
    const quieto = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (!activo || quieto) {
      /* Con el asistente cerrado o con movimiento reducido, un valor fijo y
         discreto: el borde queda encendido, sin moverse. Apagarlo del todo
         haría que la consola pareciera desconectada. */
      raiz.style.setProperty('--g-aliento', quieto ? '0.35' : '0')
      return
    }

    let vivo = true
    let cuadro = 0
    let previo = performance.now()

    const paso = (ahora: number) => {
      if (!vivo) return
      const dt = Math.min((ahora - previo) / 1000, 0.1)
      previo = ahora
      const t = ahora / 1000
      let objetivo: number

      if (modoRef.current === 'hablando') {
        const an = analizadorRef.current
        const buf = bufRef.current
        if (an && buf) {
          an.getByteTimeDomainData(buf)
          /* RMS sobre la onda centrada en 128. */
          let suma = 0
          for (let i = 0; i < buf.length; i++) {
            const v = (buf[i] - 128) / 128
            suma += v * v
          }
          const rms = Math.sqrt(suma / buf.length)
          /* Curva perceptual: el volumen no se percibe lineal, y sin esto la
             voz normal apenas movería el borde. */
          objetivo = Math.min(1, Math.pow(rms * 3.2, 0.6))
        } else {
          /* Envolvente sintética: dos senos primos entre sí para que no se
             note el bucle, con la misma cadencia que una frase hablada. */
          objetivo = 0.28 + 0.34 * Math.abs(Math.sin(t * 5.1) * Math.sin(t * 1.7))
        }
      } else if (modoRef.current === 'pensando') {
        /* Más corto y más apretado que la respiración: es atención, no calma. */
        objetivo = 0.3 + 0.3 * (0.5 - 0.5 * Math.cos(t * 5.6))
      } else {
        /* Respiración: sube durante el 40 % del ciclo y baja durante el 60 %. */
        const f = (t % CICLO) / CICLO
        const x = f < INSPIRA ? f / INSPIRA : 1 - (f - INSPIRA) / (1 - INSPIRA)
        objetivo = 0.12 + 0.32 * (0.5 - 0.5 * Math.cos(Math.PI * x))
      }

      /* Envolvente: ataque rápido, caída lenta. `1 - e^(-dt/τ)` en vez de un
         factor fijo para que el resultado no dependa de los fotogramas por
         segundo — con un factor fijo, la misma animación es distinta a 60 y a
         120 Hz. */
      const tau = objetivo > envRef.current ? ATAQUE : CAIDA
      envRef.current += (objetivo - envRef.current) * (1 - Math.exp(-dt / tau))
      raiz.style.setProperty('--g-aliento', envRef.current.toFixed(3))
      cuadro = requestAnimationFrame(paso)
    }
    cuadro = requestAnimationFrame(paso)

    /* La pestaña oculta estrangula los temporizadores y `requestAnimationFrame`
       deja de dispararse: al volver, `dt` valdría minutos. Se para y se rearma
       con el reloj puesto a cero. */
    const alCambiarVisibilidad = () => {
      if (document.hidden) {
        cancelAnimationFrame(cuadro)
      } else {
        previo = performance.now()
        cuadro = requestAnimationFrame(paso)
      }
    }
    document.addEventListener('visibilitychange', alCambiarVisibilidad)

    return () => {
      vivo = false
      cancelAnimationFrame(cuadro)
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
      raiz.style.setProperty('--g-aliento', '0')
    }
  }, [activo])

  return { modo, escuchar, callar }
}
