'use client'

/*
 * EL CENTRO DE AYUDA VISIBLE — Y DE DÓNDE SALE CADA COSA.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * UNA SOLA FUENTE, Y ES CONDICIÓN DE DISEÑO, NO PREFERENCIA.
 *
 * Esta página NO tiene contenido propio. Todo lo que pinta sale de
 * `lib/soporte/`: las preguntas de `TODAS_LAS_PREGUNTAS` y el buscador de
 * `responder()`. Si mañana una respuesta cambia allí, cambia aquí sin tocar
 * esta pantalla — y lo mismo vale para el asistente del portal cuando se
 * acople en S2: ambos leerán el mismo corpus.
 *
 * La alternativa —un YAML o JSON paralelo «para la web»— es exactamente el
 * defecto que este proyecto ya pagó dos veces (el diccionario y las
 * cabeceras): dos copias que divergen en silencio hasta que un usuario recibe
 * respuestas distintas según la puerta por la que pregunte. El auditor lo
 * bloquearía, y con razón.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EL BUSCADOR PREFIERE CALLARSE, Y LA PÁGINA LO RESPETA.
 *
 * `responder()` devuelve `derivar` cuando no entiende la pregunta con
 * confianza suficiente. Esta pantalla NO rellena ese caso con «quizás quisiste
 * decir…» forzado: muestra el motivo, las sugerencias si las hay, y el camino
 * al equipo. Sobre un producto donde la gente pone dinero, una respuesta
 * plausible y equivocada es peor que un «no lo sé» honesto.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * IDIOMA: ESTA PÁGINA HABLA ESPAÑOL, Y SE DECLARA.
 *
 * El corpus son 52 respuestas verificadas EN ESPAÑOL. Meterlas al diccionario
 * de 11 idiomas serían ~570 traducciones de texto sensible al dinero — no es
 * un trabajo de esta página sino una decisión del owner (coste y riesgo:
 * una traducción imprecisa de «no repitas la operación» cuesta dinero real).
 * Mientras tanto, la interfaz de la página sí se traduce (cabecera, buscador,
 * avisos) y el contenido queda en español en los 11 idiomas, igual que hace
 * el whitepaper con su PDF cuando no existe la versión del idioma.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { useMemo, useState } from 'react'
import { useT } from '@/context/IdiomaContext'
import AsistenteChat from '@/components/soporte/AsistenteChat'
import { TODAS_LAS_PREGUNTAS } from '@/lib/soporte/buscar'
import type { Pregunta, Proyecto } from '@/lib/soporte/tipos'
import {
  type Conversacion,
  conTurno,
  guardarConversacion,
  nuevaConversacion,
  rehidratar,
  type TurnoGuardado,
} from '@/lib/soporte/conversaciones'


/* ── Orden de proyectos y sus rótulos visibles ─────────────────────────── */

const PROYECTOS: readonly { id: Proyecto | 'todos'; rotulo: string }[] = [
  { id: 'todos', rotulo: 'Todo' },
  { id: 'genesis', rotulo: 'Genesis' },
  { id: 'gpulse', rotulo: 'G-Pulse' },
  { id: 'gevy', rotulo: 'Gevy' },
]

/*
 * Las categorías se derivan del corpus, no se listan a mano: una categoría
 * nueva en `lib/soporte/` aparece aquí sola. Listarlas a mano sería la
 * segunda copia que juramos no tener.
 */
function categoriasDe(preguntas: readonly Pregunta[]): string[] {
  const vistas: string[] = []
  for (const p of preguntas) {
    if (!vistas.includes(p.categoria)) vistas.push(p.categoria)
  }
  return vistas
}

/* ── Una pregunta desplegable ──────────────────────────────────────────── */

function TarjetaPregunta({ pregunta }: { pregunta: Pregunta }) {
  /*
   * <details> nativo en vez de estado propio: el navegador da teclado,
   * lector de pantalla y búsqueda-en-página gratis, y no hay re-render al
   * abrir. Para 52 entradas, un acordeón con estado sería puro coste.
   */
  return (
    <details className="group rounded-xl surface-card transition-colors">
      <summary className="cursor-pointer select-none px-5 py-4 text-genesis-text marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="inline-block transition-transform duration-200 group-open:rotate-90" aria-hidden>
          ›
        </span>{' '}
        {pregunta.pregunta}
      </summary>
      <div className="px-5 pb-5 pt-1 text-genesis-mist">
        <p className="leading-relaxed">{pregunta.respuesta}</p>
        {pregunta.enlace ? (
          <a
            href={pregunta.enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-genesis-ion underline-offset-4 hover:underline"
          >
            {pregunta.enlace.replace(/^https?:\/\//, '')}
          </a>
        ) : null}
      </div>
    </details>
  )
}

/* ── La página ─────────────────────────────────────────────────────────── */

export default function SoporteContenido() {
  const t = useT()
  const [proyecto, setProyecto] = useState<Proyecto | 'todos'>('todos')
  /* MISMA memoria que el mensajero flotante: empezar aquí y retomar allí. */
  const [conv, setConv] = useState<Conversacion | null>(null)
  const alTurno = (turno: TurnoGuardado) => {
    setConv((actual) => {
      const siguiente = conTurno(actual ?? nuevaConversacion(), turno)
      guardarConversacion(siguiente)
      return siguiente
    })
  }
  const turnosVivos = useMemo(() => rehidratar(conv?.turnos ?? []), [conv])

  const visibles = useMemo(
    () =>
      proyecto === 'todos'
        ? TODAS_LAS_PREGUNTAS
        : TODAS_LAS_PREGUNTAS.filter((p) => p.proyecto === proyecto || p.proyecto === 'ecosistema'),
    [proyecto]
  )
  const categorias = useMemo(() => categoriasDe(visibles), [visibles])

  return (
    <div className="space-y-10">
      {/* ── Aviso de idioma: sólo cuando la interfaz NO está en español ── */}
      <p className="text-sm text-genesis-mist" lang="es">
        {t('Las respuestas están verificadas en español. Su traducción llegará por los canales oficiales.')}
      </p>

      {/* ── El asistente: el MISMO componente que el flotante de la portada.
            Tener aquí una copia propia del hilo fue la primera versión, y es
            justo la divergencia silenciosa que este proyecto jura no repetir. ── */}
      <section aria-label={t('Buscar en las preguntas frecuentes')} className="space-y-4">
        <AsistenteChat
          proyecto={proyecto === 'todos' ? undefined : proyecto}
          turnos={turnosVivos}
          onTurno={alTurno}
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('Filtrar por producto')}>
          {PROYECTOS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProyecto(p.id)}
              aria-pressed={proyecto === p.id}
              className={
                proyecto === p.id
                  ? 'rounded-full border border-genesis-ion px-4 py-1.5 text-sm text-genesis-text'
                  : 'rounded-full border border-genesis-ghost px-4 py-1.5 text-sm text-genesis-mist hover:text-genesis-text'
              }
            >
              {p.rotulo}
            </button>
          ))}
        </div>
      </section>

      {/* ── El catálogo completo, agrupado por categoría ── */}
      <div lang="es" className="space-y-10">
        {categorias.map((cat) => (
          <section key={cat} aria-label={cat}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-genesis-mist">{cat}</h2>
            <div className="space-y-3">
              {visibles
                .filter((p) => p.categoria === cat)
                .map((p) => (
                  <TarjetaPregunta key={p.id} pregunta={p} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
