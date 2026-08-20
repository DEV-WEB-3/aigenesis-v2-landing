# El cerebro que aprende: la API construye la máquina que la reemplaza

**Fecha:** 20-ago-2026 · **Complementa:** `analisis-asistente-fluido-clase-mundial.md` y el
handoff `FROM_CURSOR_SOPORTE_ARTEFACTO_MULTI_PROYECTO.md`
· **Pregunta del owner:** ¿podemos usar Claude/ChatGPT como cerebro conversacional que, mientras
atiende, vaya COMPILANDO una base propia — de modo que cada vez llame menos a la API, hasta que
lo compilado responda casi todo y la API quede sólo para lo nuevo?

---

## 0 · La confirmación, primero y sin rodeos

**Sí — y no es una esperanza, es una propiedad matemática de las preguntas de soporte.**

Las preguntas de una comunidad siguen una distribución de cola larga (Zipf): un puñado de temas
concentra casi todo el volumen. Nuestros propios datos lo muestran: en los 789 mensajes reales
del canal, hold/claims/P2P/acceso dominan por goleada. Eso implica:

- Cada pregunta NUEVA que la API responde **y se promueve al corpus** queda respondida
  determinísticamente PARA SIEMPRE. El costo se paga una vez; el beneficio es perpetuo.
- La tasa de llamadas a la API es proporcional a la **tasa de novedad**, y con producto estable
  la novedad decae sola: cada semana quedan menos preguntas que nadie hizo antes.
- **Sin proyectos nuevos**, lo compilado supera a la API en semanas, no años. Régimen realista:
  **85–95% compilado / 5–15% API** en estado estable. Nunca llega a cero literal (la cola larga
  es infinita y siempre nace alguna paráfrasis inédita), pero el costo residual es despreciable
  — exactamente el papel que describís: «la API para responder lo que aún no se haya construido».
- Un proyecto nuevo (o un cambio de reglas) produce un PICO de novedad que decae igual que el
  inicial. La máquina no se rompe: vuelve a compilar.

La prueba será falsable: un tablero semanal con el % de respuestas servidas por corpus vs API.
La curva tiene que subir; si no sube, el ciclo está roto y se ve en números, no en sensaciones.

---

## 1 · Forense: qué tiene la estructura HOY para este ciclo (medido en el código)

| Pieza del ciclo | Estado | Evidencia |
|---|---|---|
| Base compilada (el «destino» del aprendizaje) | ✅ EXISTE | `lib/soporte/` — corpus versionado por PR, con `fuente` y guarda de lenguaje |
| Cerebro determinista que la sirve | ✅ EXISTE | `responder()` con umbral honesto; mismo para landing y portal |
| Gateway único multi-proyecto | ✅ EXISTE | `POST /api/asistente` (Vercel) + CORS + `proyecto` |
| Superficies conversando de verdad | ✅ EXISTE | Landing (mensajero) + portal (tickets IA + flotante global) |
| **El ALIMENTO: registro de cada consulta y su resultado** | ❌ **NO EXISTE** | `route.ts` no registra nada; responde y olvida |
| Feedback visible para nosotros | ❌ NO EXISTE | 😞😐😍 vive en `localStorage` DEL USUARIO — nunca lo vemos |
| El destilador (misses → fichas candidatas) | ❌ NO EXISTE | — |
| Cerebro generativo de respaldo (API) | ❌ NO EXISTE | Fase D, gateado por GO del auditor |
| Tablero de convergencia corpus vs API | ❌ NO EXISTE | — |

**El hallazgo forense central:** la máquina no puede aprender de lo que no registra. Hoy cada
`derivar` — exactamente la señal más valiosa, «esto no lo sé» — se pierde en el momento en que
se responde. El primer paso NO es la API: es la memoria.

---

## 2 · La arquitectura del ciclo (nombres para poder hablar de él)

```
                    pregunta del usuario
                            │
                            ▼
              ┌── 1 CORPUS (responder) ──┐        90%+ con el tiempo
              │  hit ≥ umbral → responde │──────► GRATIS, determinista
              └───────────┬──────────────┘
                          │ miss
                          ▼
              ┌── 2 API (Claude, Fase D) ┐        el 10% que decae
              │  RAG sobre corpus+docs   │──────► responde CITANDO
              │  o deriva si ni así      │        o deriva honesto
              └───────────┬──────────────┘
                          │
                          ▼
        ┌───── 3 EL REGISTRO (cada consulta) ─────┐
        │  qué se preguntó · quién respondió       │
        │  (corpus id / API / derivar) · feedback  │
        └───────────┬──────────────────────────────┘
                    ▼
        ┌───── 4 EL DESTILADOR (diario/semanal) ───┐
        │  agrupa los misses repetidos              │
        │  Claude REDACTA fichas candidatas +       │
        │  sinónimos con fuente declarada           │
        │  → PR con guardas (lenguaje + umbral)     │
        └───────────┬──────────────────────────────┘
                    ▼
          revisión (owner/auditor) → merge
                    │
                    ▼
          EL CORPUS CRECE → el paso 1 atrapa más
          → la API se llama menos  (el ciclo)
```

**La regla que hace esto seguro** (y que nos diferencia de un chat que «aprende» solo):
la API **jamás escribe directo en la fuente de verdad**. Redacta CANDIDATAS; entran por PR con
las mismas guardas de siempre (lenguaje, umbral, suite de frases reales) y ojo humano. Sobre
dinero, un ciclo de auto-aprendizaje sin puerta es una fábrica de respuestas verosímiles y
equivocadas — la anti-meta. La velocidad se gana automatizando el BORRADOR, no la aprobación.

**¿Claude o ChatGPT?** El gateway queda agnóstico (el contrato `POST /api/asistente` no cambia),
pero la recomendación es Claude: `claude-haiku-4-5` para el tramo masivo (rápido y barato),
**citations nativas** (el criterio «cita id o deriva» del auditor es verificable de fábrica),
**tool use** para que consulte el corpus/docs en vez de responder de memoria, y **prompt
caching** (reglas + protocolo cacheados ≈ 10× menos costo). El mismo modelo sirve de
destilador nocturno vía la **Batch API** (50% de descuento — perfecto para un job diario).

---

## 3 · El plan por fases (R = retroalimentación)

### R1 · La memoria — registrar ANTES que generar *(sin GO; sin API de pago)*

1. `route.ts` registra cada consulta: `{ ts, proyecto, consulta, resultado: hit(id)|derivar,
   puntos, origen }` en **Vercel KV / Upstash** (free). Sin PII: no hay usuario en el endpoint.
2. `POST /api/asistente/feedback`: el 😞😐😍 y el «¿te sirvió?» viajan al mismo registro
   (hoy mueren en el localStorage del usuario).
3. Tablero mínimo (PostHog free o un JSON diario): hit-rate, top misses, feedback por ficha.

> Con R1 solo, ya sabemos QUÉ preguntan y QUÉ no sabemos — y el destilador tiene materia prima.
> Esto convierte el trabajo de corpus de adivinanza en lista ordenada por volumen real.

### R2 · El destilador — la API construye borradores *(primera llamada a la API; uso interno, no de cara al usuario — GO menor)*

4. Job diario (GitHub Action + Batch API): toma los misses agrupados de KV, y Claude redacta
   **fichas candidatas** (pregunta + respuesta + sinónimos + `fuente: 'porDefinir'` cuando el
   hecho no está confirmado) y **sinónimos nuevos** para fichas existentes que casi-acertaron.
5. Salida = un PR automático con las candidatas + las guardas corriendo en CI. El owner/auditor
   aprueba o corrige. Nada entra solo.
6. Medida de éxito: cada semana, los misses top-10 de la semana anterior deben estar cubiertos.

### R3 · El cerebro híbrido de cara al usuario *(Fase D del plan vigente — GO del auditor)*

7. En el endpoint: miss del corpus → Claude con RAG (fichas candidatas del retrieval + docs
   aprobados del producto) → responde **citando `pregunta.id`** o deriva. La guarda de lenguaje
   corre sobre la SALIDA del modelo.
8. Toda respuesta de API queda marcada en el registro como candidata caliente: si su feedback
   es 😍, va al frente de la cola del destilador.
9. Contexto que pediste («que consulte el código o backend y front»): el RAG indexa además los
   docs del repo (brújula del portal, hoja técnica booster, contratos) — NUNCA credenciales ni
   código del camino del dinero. Y el contexto de CUENTA (tu pedido, tu hold) entra por los
   endpoints de sólo lectura del plan hermano — la API los recibe como datos, no como acceso.

### R4 · El backend propio de soporte *(la «base de datos compilada a un backend propio»)*

10. Cuando los tickets persistan en AWS (Fase C, contrato ya escrito), el registro de R1 y la
    base compilada confluyen ahí: historial por usuario, casos, y el corpus como KB servida.
    El endpoint de Vercel sigue siendo la cara pública; el AWS de soporte es la bodega.

### El tablero de convergencia *(la prueba de tu pregunta)*

11. Gráfica semanal: `% corpus` vs `% API` vs `% derivar`. Criterios falsables:
    - Semana tras semana sin proyecto nuevo: `% corpus` sube, `% API` baja.
    - Meta de régimen estable: **corpus ≥ 85%**, derivar < 5%.
    - Un lanzamiento nuevo: pico de API permitido, con retorno a la curva en ≤ 4 semanas.

---

## 4 · Orden de ejecución y costos

| Paso | Requiere | Costo API |
|---|---|---|
| R1 memoria + feedback + tablero | nada (KV free) | $0 |
| R2 destilador batch | GO menor (uso interno) | centavos/día (Batch + Haiku) |
| R3 híbrido de cara al usuario | GO auditor (Fase D) | bajo y DECRECIENTE — esa es la gracia |
| R4 backend propio | Fase C tickets AWS | infra ya pagada |

La belleza del diseño: **R1 y R2 hacen crecer lo compilado ANTES de exponer la API al
usuario** — cuando R3 llegue, ya arranca con hit-rate alto y la factura nace pequeña y
va bajando. La API es la maestra de obra; el edificio queda nuestro.
