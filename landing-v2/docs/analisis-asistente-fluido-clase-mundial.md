# Análisis: del asistente actual a uno clase Alibaba/Shein/eBay

**Fecha:** 20-ago-2026 · **Base:** `AGENT_HANDOFF/FROM_CURSOR_SOPORTE_ARTEFACTO_MULTI_PROYECTO.md` (monorepo)
· **Objetivo del owner:** un asistente que fluya como los de Alibaba/Shein/eBay — inteligente,
fluido, vasto en contenido y contexto de Genesis, Gevy, GPulse y futuros proyectos.

---

## 1 · Estado real HOY (actualiza el informe de Cursor)

El informe llegó el mismo día en que varios de sus puntos «Ahora» se ejecutaron. Estado medido:

| Punto del informe | Estado 20-ago (noche) |
|---|---|
| Fase B mensajero (landing) | **HECHA** — pestañas, historial localStorage, artículos, feedback, avatares, barra firma |
| Conversación real en el portal | **HECHA** — PR #492 vivo: modo IA llama a `/api/asistente`, protocolo de trato v1, certificado E2E |
| Botón flotante multi-superficie en el portal | **HECHA** — PR #494 vivo: login, lobby, dashboard, marketplace; mismo cerebro, cero fork |
| Efecto de escritura (fluidez percibida) | **HECHA** — puntos «Escribiendo…» + letra a letra (80/16 ms) en landing y portal |
| Retrieval robusto a muletillas | **HECHA** — conectores/cortesía fuera de la puntuación; suite 20/20 con casos reales |
| `ChatWidgetPlaceholder` («Consciousness») | **PENDIENTE** — sigue siendo cáscara vacía; decidir: cablear al mismo cerebro o retirar |
| Ampliar corpus (compensación, holdeo, Gevy, novedades) | **PENDIENTE** — el mayor multiplicador de valor hoy |
| Feedback API, tickets AWS, badge, KV, PostHog | **PENDIENTE** — Fase C |
| LLM + RAG con citas | **PENDIENTE** — Fase D, sólo con GO del auditor |

Lo que el informe pide NO revertir se mantiene intacto: corpus único versionado, umbral que
prefiere callar, endpoint en Vercel (no en el AWS del dinero), CORS cerrado, `proyecto`
multi-marca, y jamás Convai como fuente de verdad.

---

## 2 · Qué hace «fluido» a un asistente clase Alibaba/Shein/eBay

Estudiados los patrones de esos asistentes, su fluidez se descompone en SEIS capacidades.
Contra cada una, lo que tenemos:

| Capacidad | Ellos | Nosotros hoy |
|---|---|---|
| **1. Lenguaje natural real** | Entienden paráfrasis, errores, mezcla de idiomas; responden redactando, no pegando fichas | Retrieval léxico con umbral. Honesto pero rígido: la ficha se entrega tal cual |
| **2. Contexto de LA CUENTA** | «¿Dónde está mi pedido?» → miran TU pedido y responden con TU guía de envío | Cero. El asistente no sabe quién pregunta ni ve pedidos/hold/tickets |
| **3. Tarjetas ricas accionables** | Respuesta = tarjeta de pedido + botones («Rastrear», «Devolver», «Cancelar») | Texto plano + enlaces. El portal ya tiene playbooks con checklist — el germen correcto |
| **4. Continuidad conversacional** | «¿y el otro?» se entiende porque recuerdan el hilo | Cada consulta es independiente; el hilo se guarda pero el cerebro no lo lee |
| **5. Escalado con contexto** | Al pasar a humano, el agente ve TODO el hilo y los datos del caso | Derivación a Telegram con datos sugeridos a mano; tickets aún en memoria |
| **6. Proactividad** | «Tu pedido llegó a aduana» — el asistente inicia | S1 ya lo hace para incidencias de dinero (única vía proactiva, y bien elegida) |

**Diagnóstico honesto:** tenemos la ARQUITECTURA correcta (una fuente, umbral, protocolo,
gateway) y la fluidez *percibida* (escritura, trato). Nos faltan las dos cosas que de verdad
separan a Alibaba/Shein: **(1) un cerebro que redacta** y **(2) contexto de la cuenta**.

---

## 3 · Herramientas concretas (librería Claude + ecosistema) para cerrar cada brecha

### 3.1 · El cerebro que redacta — Fase D con la API de Anthropic (requiere GO del auditor)

El contrato del informe («LLM sólo ENCIMA del corpus, con citas») se implementa limpio con
piezas que la API de Claude ya trae:

- **Modelo:** `claude-haiku-4-5` para el tramo masivo (barato, rápido, suficiente para
  reformular con citas); escalar a Sonnet sólo si la evaluación lo exige.
- **Search results + citations:** la API acepta bloques `search_result` con
  `citations: {enabled: true}` — se le pasan las N fichas del corpus que `responder()` ya
  seleccionó y el modelo responde CITANDO la ficha (`pregunta.id`). Es exactamente el
  criterio falsable del informe («cita id o deriva») soportado nativamente.
- **Tool use:** definir `buscar_corpus` como herramienta; el modelo decide reformular la
  búsqueda («no me deja sacar la plata» → retiro) antes de responder. Esto resuelve la
  brecha 1 sin abandonar el determinista: el corpus sigue siendo la única verdad.
- **Prompt caching:** el system prompt (reglas de lenguaje, protocolo de trato, resumen del
  corpus) se cachea — ~10× menos costo por turno.
- **Continuidad (brecha 4):** con LLM, mandar los últimos K turnos del hilo cuesta tokens,
  no arquitectura. El hilo YA se persiste (localStorage/panel); sólo falta enviarlo.
- **Flujo:** `responder()` primero, SIEMPRE. Hit ≥ umbral → directo (gratis, determinista).
  Miss o consulta conversacional → LLM con las fichas candidatas + guarda de lenguaje sobre
  la SALIDA del modelo (la guarda ya existe: `verify-lenguaje` aplica las 12 reglas).
- **Antes de la primera clave de pago:** rate-limit real (Vercel KV / Upstash free) — ya
  anotado como deuda en `route.ts`.

### 3.2 · Contexto de la cuenta — la brecha más valiosa y la más delicada

Regla de oro vigente: **el chat jamás toca el AWS del dinero directo**. El camino seguro:

1. Backend expone endpoints de SOLO LECTURA con el JWT del usuario (pedido, estado del
   hold, últimos tickets) — en `core-api`, linaje `prod-aligned`, PRs separados.
2. La SUPERFICIE (portal) los consulta y le pasa al cerebro un `contexto` estructurado
   pequeño: `{ pedidoActivo: {...}, holdEstado: {...} }`.
3. El cerebro (determinista o LLM) responde «tu pedido #X está en tránsito» — con tarjeta.
4. En la landing (sin sesión) simplemente no hay contexto: mismo código, menos datos.

Esto convierte «¿dónde está mi pedido?» de derivación a respuesta — el salto Shein.

### 3.3 · Tarjetas ricas — extender el formato de respuesta, no romper el contrato

Añadir al contrato un campo OPCIONAL `tarjeta` (`{ tipo: 'pedido'|'hold'|'ticket', datos }`).
Los consumidores viejos lo ignoran (compatible); los nuevos pintan tarjeta + botones que ya
existen como playbooks/checklist en el portal. El germen (Copiar hash, checklist S1) ya
demostró el patrón.

### 3.4 · Piezas gratis que suman ya (sin GO)

| Pieza | Brecha que toca | Costo |
|---|---|---|
| Web Speech API (dictado) + `speechSynthesis` (leer) | Fluidez percibida, accesibilidad | $0 |
| PostHog: `asistente_hit` / `derivar` / `feedback` | Saber QUÉ preguntas fallan → dirigir el corpus | Free tier |
| Sinónimos desde los 789 mensajes reales del canal | Brecha 1 sin LLM: el retrieval entiende más paráfrasis | $0 |
| Vercel KV rate-limit | Prerrequisito de D | Free |
| Embeddings (Voyage/OpenAI free) sobre el corpus | Recall semántico sin generación — paso intermedio B→D | Free |

---

## 4 · Lo que NO hay que hacer (refuerza el informe)

- **No** reabrir Convai/Character.AI como fuente: la lección V1 (cáscara rica, cerebro ajeno
  y desactualizado) es la anti-meta.
- **No** dejar que el LLM responda de memoria sobre dinero: siempre corpus primero, cita o
  derivación. Los asistentes de Shein/Alibaba alucinan poco porque el 90% de sus respuestas
  son datos de cuenta + plantillas — imitemos ESO, no el chat libre.
- **No** montar Intercom/Zendesk de pago sin decisión del owner: divergiría del corpus.
- **No** bloquear el soporte por cuota en incidentes de dinero (lección del gate V1).

---

## 5 · Orden de ejecución propuesto (PRs pequeños, cada uno verificable)

| # | Qué | Dónde | Gate |
|---|---|---|---|
| 1 | **Corpus**: compensación/booster, holdeo con cifras y validez, Gevy (precio por país, pedidos, CJ), novedades | landing `lib/soporte` | suite umbral + guarda lenguaje |
| 2 | Sinónimos desde el canal real (789 msgs) | landing | suite con frases textuales |
| 3 | `ChatWidgetPlaceholder`: cablear al cerebro o retirar (decisión) | portal `main` | guarda de cableado |
| 4 | PostHog 3 eventos + KV rate-limit | landing | evento visible + 429 medido |
| 5 | **Fase C**: feedback API, tickets persistentes (contrato ya escrito), badge | landing + portal + AWS | E2E |
| 6 | Contexto de cuenta de sólo lectura (pedido/hold) + tarjeta `pedido` | `prod-aligned` + portal | E2E con sesión |
| 7 | **Fase D** (GO auditor): Haiku 4.5 + search results/citations + tool `buscar_corpus` + guarda lenguaje sobre salida | landing endpoint | «cita id o deriva» falsable |

Los pasos 1–2 son el mejor retorno inmediato: el cerebro actual responde EXACTAMENTE tan
bien como ancho sea el corpus, y hoy el corpus (52 fichas) cubre una fracción de lo que la
gente pregunta.

---

## 6 · Criterios de aceptación añadidos (a los del informe)

- [ ] «¿Dónde está mi pedido?» con sesión → tarjeta del pedido real; sin sesión → guía + derivar
- [ ] Una paráfrasis nueva («no me deja sacar la plata») llega a la ficha de retiro
- [ ] El hilo influye: «¿y cuánto tarda?» tras preguntar por reclamo responde sobre reclamos
- [ ] Todo turno del LLM cita `pregunta.id` verificable o deriva — medido en tests, no confiado
- [ ] La guarda de lenguaje corre sobre la SALIDA del modelo, no sólo sobre el corpus
