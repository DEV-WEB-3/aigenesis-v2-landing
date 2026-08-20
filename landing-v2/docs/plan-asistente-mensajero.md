# El asistente Genesis como mensajero completo — análisis forense y plan por fases

**Fecha:** 20-ago-2026 · **Referencia analizada:** el widget de soporte de bit1.com
(9 capturas del owner + inspección del DOM en vivo)

---

## 1 · Qué es lo que enseñan las capturas

Se llama **Intercom Messenger**. Lo confirma el DOM de bit1: el lanzador es
`intercom-lightweight-app-launcher` (círculo de 48px en el color de acento).
Intercom lo denomina «Messenger»; la categoría del producto es **plataforma de
mensajería de clientes** (customer messaging platform), y lo que bit1 usa es su
modo completo: mensajero + centro de ayuda embebido.

Es el patrón que copian Crisp, Zendesk Messaging, HubSpot Chat y Tawk: un
lanzador flotante que abre una app en miniatura con pestañas.

## 2 · Inventario forense de funciones (lo que se ve, pieza a pieza)

### El lanzador
- Círculo 48px, color de acento, esquina inferior derecha.
- Cambia de icono al abrir (chevron hacia abajo = cerrar).

### Pestaña INICIO
- Avatares del equipo (3 caras) arriba.
- Saludo: «Hola 👋 ¿Cómo podemos ayudarte?» — cabecera oscura, transición a la
  zona clara de contenido.
- Botón primario «Hacer una pregunta» → abre conversación nueva.
- **Buscador de ayuda embebido** en la misma portada.
- **Artículos sugeridos** (4): los que más se consultan — «Cómo realizar un
  retiro», «Activar 2FA», «Elegir la red correcta al depositar»… Nótese que
  son LAS PREGUNTAS DE DINERO: la selección no es decorativa.

### Pestaña MENSAJES
- Historial de conversaciones **persistente** (el estado vacío dice: «Los
  mensajes del equipo se mostrarán aquí»).
- CTA «Hacer una pregunta» también aquí.

### Pestaña AYUDA (centro de ayuda embebido)
- Buscador arriba.
- **9 colecciones** con título, descripción y CONTEO de artículos («Guías y
  procesos — 25 artículos», «Comisiones de trading — 1 artículo», «Cuenta y
  seguridad», «Verificación y límites»…).

### La conversación
- Cabecera con los avatares y nombre del equipo («BIT1 TEAM»), botón atrás.
- Menú «⋯» → **«Ampliar ventana»** (el panel crece a casi pantalla completa).
- Compositor con: adjuntar archivo 📎, emoji, GIF, **dictado por voz** 🎤.

### El artículo embebido (la pieza más fina)
- Se abre DENTRO del widget, con **esqueleto de carga** (skeleton) mientras llega.
- Título, **fecha de actualización**, contenido con capturas/vídeo.
- **Feedback de reacción**: «¿Respondió esto a su pregunta?» con 3 emojis.
- **Selector de idioma del artículo** (English/Español).
- «Abrir en el centro de ayuda» → versión página completa.
- Botones expandir/contraer.

### Efectos y detalle
- Skeleton loaders, animación de entrada, pestañas fijas abajo, panel que
  nunca tapa su propia conversación (cabecera y compositor fijos).

## 3 · Dónde nuestro asistente YA supera a esa referencia

No partimos de cero, y conviene decirlo para no copiar hacia abajo:

| Nuestro | Intercom/bit1 |
|---|---|
| **Deriva con honestidad** cuando no sabe — «prefiero pasarte con el equipo» | Responde siempre algo o deja el mensaje en cola |
| **Corpus verificado con fuente declarada** (owner/código/producto y fecha) | Artículos sin trazabilidad de verificación |
| **Una sola fuente** para página, flotante y futuro portal | Centro de ayuda y macros de chat suelen divergir |
| **Guarda de lenguaje** (12 reglas: sin promesas de activación ni resultado) | Sin control de promesas |
| Funciona **sin backend** (Hostinger estático) | Requiere sus servidores |
| **Sin cookies de seguimiento** | Intercom rastrea al visitante |

## 4 · El plan por fases

Regla transversal: **cada fase entrega algo usable y ninguna promete lo de la
siguiente.** Los iconos de funciones futuras no aparecen deshabilitados
«decorando»: si algo no funciona, no se enseña.

### FASE B — «Mensajero» (sin backend; entra en la landing actual)

La estructura de app en miniatura, con lo que ya tenemos de cerebro:

1. **Tres pestañas: Inicio · Mensajes · Ayuda** (paridad estructural con la referencia).
2. **Inicio**: saludo con avatares, «Hacer una pregunta», buscador embebido y
   **sugeridos medidos** — nuestros 4 no salen de una intuición sino de los 789
   mensajes analizados: congelado, reclamo que no llega, descuadre MetaMask,
   cómo funciona el P2P.
3. **Mensajes**: conversaciones persistentes en `localStorage` (título = primera
   pregunta, fecha, retomar al pulsar). Sin backend ya se puede: el historial
   es del navegador de la persona.
4. **Ayuda**: colecciones **derivadas del corpus** (categoría → conteo) — jamás
   una lista a mano. Búsqueda con el mismo `responder()`.
5. **Artículo embebido**: la respuesta en vista completa dentro del panel, con
   su **fecha de verificación y su fuente** (esto Intercom no lo tiene),
   relacionadas pulsables y «Abrir en el centro de ayuda» → `/soporte`.
6. **Feedback por respuesta** (3 niveles). Sin backend se guarda local y se
   agrega; con Fase C viaja al endpoint. Es la semilla del aprendizaje: dice
   QUÉ respuestas fallan.
7. **Ampliar ventana** (⤢) y esqueleto de carga al abrir artículo.
8. Interfaz en los 11 idiomas (ya está el mecanismo); el corpus en español
   declarado, como decidió el owner.

### FASE C — «Canal» (Vercel + AWS; requiere S1b/S2 del auditor)

1. **Feedback al endpoint** `/api/asistente/feedback` (Vercel): primera
   telemetría real de qué respuestas no sirven.
2. **Tickets persistentes** en el AWS de Genesis (contrato ya especificado en
   `contrato-tickets-soporte.md`) — la pestaña Mensajes pasa de local a cuenta.
3. **Adjuntar captura** (solo imagen, con límite y limpieza de metadatos). El
   caso de dinero casi siempre necesita una captura.
4. **Aviso en el botón** (badge) cuando hay incidencia esperando — enlaza con
   el motor de incidencias ya cableado en el portal (S1).
5. **Estado del sistema real** en Inicio (no «señales simuladas» como hoy
   enseña el portal).

### FASE D — «Cerebro» (S3; con GO del auditor)

1. Modelo + retrieval sobre el corpus (el endpoint ya está; se cambia el
   interior, no el contrato).
2. **Protocolo de trato**: saludo, empatía, lectura del estado emocional de
   quien escribe — SE AFINA AQUÍ, por decisión del owner del 20-ago. Quien
   llega congelado no escribe igual que quien curiosea; la apertura correcta
   es distinta.
3. **Traspaso a humano** con el caso ya montado (hash, hora, alias).
4. Dictado por voz y GIF — al final, porque son azúcar: sin cerebro ni canal,
   un micrófono no ayuda a nadie.
5. Evaluación del modelo contra la rúbrica que ya existe en los guiones del
   portal.

## 4b · Tres hallazgos añadidos (capturas del 20-ago, segunda tanda)

1. **Nivel intermedio de navegación**: colección (con descripción propia) →
   lista de artículos → artículo. La primera versión de nuestra demo se lo
   saltaba: la colección abría el primer artículo directamente. Integrado en
   Fase B, con «volver» que respeta la jerarquía (artículo → Ayuda).
2. **Descripción por colección** — la colección se explica antes de abrirse
   («Aquí podrá conocer el proceso para verificar su cuenta»). Integrado.
3. **Vídeo tutorial dentro del artículo.** bit1 incrusta Vimeo (3:34, con su
   fecha). Encaja EXACTAMENTE con los 4 videotutoriales de G11 pendientes del
   owner: cuando existan, cada artículo lleva su paso a paso en vídeo. Con la
   diferencia nuestra: **autoalojado** — Vimeo/YouTube rastrean al visitante y
   esta landing presume de no hacerlo. Va en Fase C (requiere producir los
   vídeos); el hueco ya está previsto en la vista de artículo.

## 5 · Lo que NO vamos a copiar

- **El «suele responder en minutos» sin humanos detrás.** Hasta que exista la
  cola humana (Fase C/D), nuestro texto debe prometer lo que hay: respuestas
  verificadas al instante y derivación honesta.
- **Iconos muertos en el compositor.** bit1 enseña 📎/GIF/🎤 siempre; nosotros
  los enseñamos cuando funcionen.
- **El rastreo.** Intercom identifica y sigue al visitante. Nuestra landing
  presume de no hacerlo — y el asistente no va a ser la excepción.
