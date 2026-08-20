'use client'

/*
 * EL CHAT DEL ASISTENTE — un solo componente para todas las superficies.
 *
 * Lo usan el mensajero flotante de la portada y la página /soporte. Si cada
 * superficie tuviera su copia del hilo, divergirían en silencio — el mismo
 * defecto que este proyecto jura no repetir con los datos, aplicado a la
 * interfaz.
 *
 * CONTROLADO DESDE FUERA (Fase B): el padre es dueño de la conversación y de
 * su persistencia — este componente pinta y pregunta al cerebro, nada más.
 * Así el flotante y /soporte comparten el MISMO historial (localStorage hoy;
 * la cuenta, en Fase C) sin que este archivo sepa dónde vive.
 *
 * El cerebro es `responder()`: el MISMO que sirve /api/asistente en Vercel.
 * Aquí corre en local porque la copia de Hostinger es estática. Cuando llegue
 * el modelo (S3) se cambia el interior del endpoint y esta interfaz no se
 * toca.
 */

import { useRef, useState } from 'react'
import { useT } from '@/context/IdiomaContext'
import { responder } from '@/lib/soporte/buscar'
import type { Pregunta, Proyecto } from '@/lib/soporte/tipos'
import type { TurnoGuardado, TurnoVivo } from '@/lib/soporte/conversaciones'
import ZonaDeslizable from './ZonaDeslizable'

interface AsistenteChatProps {
  proyecto?: Proyecto
  /** Los turnos ya rehidratados que el padre quiere pintar. */
  turnos: readonly TurnoVivo[]
  /** El padre recibe cada turno nuevo y decide dónde persistirlo. */
  onTurno: (turno: TurnoGuardado) => void
  /** Si está, cada respuesta ofrece «ver como artículo» y navega el padre. */
  onVerArticulo?: (pregunta: Pregunta) => void
  /** Modo panel flotante: tipografía compacta. */
  compacto?: boolean
}

export default function AsistenteChat({
  proyecto,
  turnos,
  onTurno,
  onVerArticulo,
  compacto = false,
}: AsistenteChatProps) {
  const t = useT()
  const [consulta, setConsulta] = useState('')
  const finDelHilo = useRef<HTMLDivElement>(null)

  const preguntar = (texto?: string) => {
    const q = (texto ?? consulta).trim()
    if (q.length < 3) return
    const r = responder(q, proyecto)
    onTurno(
      r.tipo === 'respuesta'
        ? { q, t: 'r', id: r.pregunta.id, rel: r.relacionadas.map((p) => p.id) }
        : { q, t: 'd', rel: r.sugerencias.map((p) => p.id) }
    )
    setConsulta('')
    requestAnimationFrame(() =>
      finDelHilo.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    )
  }

  const txt = compacto ? 'text-sm' : ''

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <ZonaDeslizable className="pr-2">
        <div lang="es" aria-live="polite" className="space-y-3">
          {turnos.length === 0 ? (
            <p className={`text-genesis-mist ${compacto ? 'text-sm' : ''}`}>
              {t('Pregunta sobre tu cuenta, el hold, los reclamos, el P2P o la tienda. Si no lo sé, te lo digo.')}
            </p>
          ) : null}
          {turnos.map((turno, i) => (
            <div key={i} className="space-y-2">
              <p className={`ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm surface-card px-4 py-2.5 text-genesis-text ${txt}`}>
                {turno.q}
              </p>
              {turno.tipo === 'respuesta' && turno.pregunta ? (
                <div className="max-w-[92%] rounded-2xl rounded-bl-sm surface-card border-genesis-ion/40 px-4 py-3">
                  <p className={`font-semibold text-genesis-text ${compacto ? 'text-sm' : ''}`}>
                    {turno.pregunta.pregunta}
                  </p>
                  <p className={`mt-1.5 leading-relaxed text-genesis-mist ${txt}`}>
                    {turno.pregunta.respuesta}
                  </p>
                  {turno.relacionadas.length > 0 ? (
                    <div className="mt-2 text-xs text-genesis-mist">
                      <p>{t('También suele preguntarse:')}</p>
                      <ul className="mt-1 space-y-0.5">
                        {turno.relacionadas.map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              onClick={() => preguntar(p.pregunta)}
                              className="text-left text-genesis-ion underline-offset-4 hover:underline"
                            >
                              › {p.pregunta}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {onVerArticulo ? (
                    <button
                      type="button"
                      onClick={() => onVerArticulo(turno.pregunta as Pregunta)}
                      className="mt-2 text-xs text-genesis-ion underline-offset-4 hover:underline"
                    >
                      ⧉ {t('Ver como artículo')}
                    </button>
                  ) : null}
                </div>
              ) : (
                /*
                 * LA DERIVACIÓN, TAL CUAL. El «no lo sé» honesto con la salida
                 * real de hoy: el canal oficial. En Fase C, este bloque se
                 * convierte además en «abrir un caso».
                 */
                <div className={`max-w-[92%] rounded-2xl rounded-bl-sm surface-card px-4 py-3 text-genesis-mist ${txt}`}>
                  <p>
                    {t('No he entendido la pregunta lo bastante bien como para responderla con seguridad. Prefiero pasarte con alguien del equipo antes que darte algo que suene bien y esté mal.')}
                  </p>
                  {turno.relacionadas.length > 0 ? (
                    <ul className="mt-2 space-y-0.5 text-xs">
                      {turno.relacionadas.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => preguntar(p.pregunta)}
                            className="text-left text-genesis-ion underline-offset-4 hover:underline"
                          >
                            › {p.pregunta}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <a
                    href="https://t.me/AiGenesisComunity"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-genesis-ion underline-offset-4 hover:underline"
                  >
                    t.me/AiGenesisComunity
                  </a>
                </div>
              )}
            </div>
          ))}
          <div ref={finDelHilo} />
        </div>
      </ZonaDeslizable>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          preguntar()
        }}
        className="flex shrink-0 gap-2"
      >
        <input
          type="text"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder={t('Escribe tu pregunta — por ejemplo: no puedo reclamar')}
          className={`w-full rounded-xl surface-card text-genesis-text placeholder:text-genesis-mist focus:border-genesis-ion focus:outline-none ${
            compacto ? 'px-4 py-3 text-sm' : 'px-5 py-4'
          }`}
          lang="es"
        />
        <button
          type="submit"
          className={`shrink-0 rounded-xl border border-genesis-ion text-genesis-text transition-colors hover:bg-genesis-surface ${
            compacto ? 'px-4 py-3 text-sm' : 'px-5 py-4'
          }`}
        >
          {t('Preguntar')}
        </button>
      </form>
    </div>
  )
}
