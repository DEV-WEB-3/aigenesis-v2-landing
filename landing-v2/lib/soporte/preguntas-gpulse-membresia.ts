import type { Pregunta } from './tipos'

/**
 * G-PULSE · MEMBRESÍAS, ACCESO Y MODOS — tercera tanda de la base ampliada.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALE. Del CÓDIGO VIVO, no de suposiciones:
 *   • `apps/gpulse/.../membership/gpulseMembershipTiers.js` — catálogo único de
 *     tiers (nombre, duración en días, precio). Es lo que ve el usuario al
 *     activar. WEEKLY 7d/50 · BASIC 30d/100 · PRO 180d/500 · EXPERT 270d/750 ·
 *     ELITE 365d/1000.
 *   • `backend/.../onChainDepositVerification.js` y `...DualMembershipReconcile.js`
 *     — el pago es DUAL: `buyPackDual(usdtAmount, aigAmount)`, USDT + AIG en una
 *     sola transacción. El reparto es 50/50 (mitad USDT, mitad AIG), confirmado
 *     por el owner.
 *   • `gpulseMembershipStore.js` / `gpulseMembershipService.js` — la membresía
 *     vence por fecha; al vencer se corta el acceso hasta reactivar.
 *
 * DOS ACLARACIONES DEL OWNER que corrigen errores previos:
 *   1. WINX ≠ G-Pulse. WINX es un proveedor de señales aparte; sus precios NO
 *      son los de G-Pulse. Aquí van SOLO los de G-Pulse.
 *   2. G-Pulse AÚN NO ofrece plan de compensación (ni referidos ni binario).
 *
 * REGLA DEL DESCARGO, heredada de `preguntas-gpulse.ts`: G-Pulse es una
 * herramienta de análisis y señales; no es asesoramiento financiero, no promete
 * un resultado y la decisión y el riesgo son de quien opera. Documentamos lo
 * QUE ES (tiers, pago, modos), no rutas de pantalla que no se han recorrido.
 */
export const PREGUNTAS_GPULSE_MEMBRESIA: readonly Pregunta[] = [
  /* ════════════ ACCESO / MEMBRESÍA ════════════ */
  {
    id: 'gpm-acceso-membresia',
    proyecto: 'gpulse',
    categoria: 'Membresía G-Pulse',
    pregunta: '¿Cómo activo G-Pulse? ¿Necesito membresía?',
    respuesta:
      'G-Pulse funciona por membresía: entras con tu cuenta de Genesis (el mismo acceso del ecosistema) y activas un plan desde el panel de G-Pulse. La activación se paga en modo dual —mitad en USDT y mitad en AiG Token, en una sola operación desde tu wallet—. Mientras la membresía esté vigente tienes acceso al plan que elegiste; cuando vence, el acceso se corta hasta que la reactivas.',
    sinonimos: [
      'como activo gpulse', 'necesito membresia', 'como entro a gpulse', 'activar membresia gpulse',
      'como pago gpulse', 'membresia del pulse', 'acceso a gpulse', 'como me suscribo a gpulse',
    ],
    fuente: 'codigo',
  },
  {
    id: 'gpm-membresias',
    proyecto: 'gpulse',
    categoria: 'Membresía G-Pulse',
    pregunta: '¿Cuáles son las membresías de G-Pulse y qué cuestan?',
    respuesta:
      'Hay cinco planes, según el panel de activación: WEEKLY (1 semana, 7 días, 50 USD) · BASIC (1 mes, 30 días, 100 USD) · PRO (6 meses, 180 días, 500 USD, el más popular) · EXPERT (9 meses, 270 días, 750 USD) · ELITE (12 meses, 365 días, 1000 USD). El precio es un valor en dólares que se cubre en modo dual: mitad en USDT y mitad en AiG Token. Cada plan suma capacidades: WEEKLY y BASIC dan las señales y el bot; PRO desbloquea el Oracle Runtime (motor predictivo) y funciones avanzadas; EXPERT y ELITE añaden prioridad, más herramientas y soporte VIP.',
    sinonimos: [
      'cuanto cuesta gpulse', 'precios de gpulse', 'planes de gpulse', 'membresias gpulse',
      'weekly basic pro expert elite', 'que planes hay', 'cuanto vale la membresia', 'tarifas gpulse',
      'plan mensual gpulse', 'plan anual gpulse',
    ],
    fuente: 'codigo',
  },
  {
    id: 'gpm-pago-dual',
    proyecto: 'gpulse',
    categoria: 'Membresía G-Pulse',
    categoriaIncidencia: 'deposito',
    pregunta: '¿Con qué monedas pago la membresía de G-Pulse?',
    respuesta:
      'El pago de la membresía es DUAL 50/50: se cubre mitad en USDT y mitad en AiG Token, y ambas partes viajan juntas en una sola transacción desde tu wallet (necesitas saldo de USDT y de AiG en la red BSC, más BNB para el gas). No es solo-USDT ni solo-AiG: el modo de activación de G-Pulse es el dual. Si la transacción no se refleja, no la repitas: guarda el hash y repórtalo.',
    sinonimos: [
      'con que pago gpulse', 'monedas de gpulse', 'pago dual gpulse', 'aig y usdt gpulse',
      'como se paga la membresia', 'puedo pagar solo usdt', 'puedo pagar solo aig', 'mitad aig mitad usdt',
      'modo de pago gpulse', 'dual 50 50',
    ],
    fuente: 'owner',
  },

  /* ════════════ MODOS DE OPERACIÓN ════════════ */
  {
    id: 'gpm-modos',
    proyecto: 'gpulse',
    categoria: 'Uso de G-Pulse',
    pregunta: '¿Qué modos tiene G-Pulse: manual y automático?',
    respuesta:
      'G-Pulse tiene dos modos de trabajo. El modo MANUAL: la herramienta te muestra las señales y las decisiones las tomas y ejecutas tú, a tu criterio. El modo AUTOMÁTICO (auto IA): un bot ejecuta la estrategia que tú configuras, sin que tengas que estar delante. Ambos parten de la misma base: G-Pulse informa y ejecuta lo que tú defines; no es asesoramiento financiero, no adivina el futuro y el resultado y el riesgo son tuyos. El bot automático básico entra desde BASIC; el avanzado y el Oracle Runtime, desde PRO en adelante.',
    sinonimos: [
      'modo manual y automatico', 'auto ia', 'modo ia', 'bot automatico', 'bot manual',
      'que modos hay', 'modo automatico gpulse', 'diferencia manual automatico', 'el bot de gpulse',
      'modo auto', 'operar automatico',
    ],
    fuente: 'codigo',
  },
  {
    id: 'gpm-configurar-detener',
    proyecto: 'gpulse',
    categoria: 'Uso de G-Pulse',
    pregunta: '¿Cómo configuro una jugada y cómo la detengo?',
    respuesta:
      'El recorrido exacto (configurar los parámetros, iniciar y detener) está dentro del panel, detrás del acceso, y esta guía no describe pantallas que no se han recorrido: antes que darte una ruta inventada, se te pasa con alguien que lo tenga delante. Lo que sí es firme: necesitas la membresía vigente, el modo automático ejecuta la estrategia que TÚ configuras y puedes detenerlo desde el mismo panel. Tú decides los parámetros y asumes el resultado; G-Pulse no garantiza ninguna ganancia.',
    sinonimos: [
      'como configuro una jugada', 'como inicio el bot', 'como detengo el bot', 'como paro la jugada',
      'como se detiene', 'configurar la jugada', 'iniciar operacion', 'detener operacion',
      'como pauso gpulse', 'parar el automatico',
    ],
    fuente: 'porDefinir',
  },
  {
    id: 'gpm-sin-plan-compensacion',
    proyecto: 'gpulse',
    categoria: 'Membresía G-Pulse',
    pregunta: '¿G-Pulse tiene referidos o plan de compensación?',
    respuesta:
      'Por ahora no. G-Pulse todavía NO ofrece un plan de compensación: dentro de G-Pulse no hay comisiones por invitar ni por armar una red de niveles. Ese tipo de plan (con sus aceleradores directo y de red) pertenece al ecosistema Genesis y a sus packs de minería, que es otra cosa distinta de la membresía de G-Pulse. Si en el futuro G-Pulse suma algún esquema, se comunicará por los canales oficiales.',
    sinonimos: [
      'gpulse tiene referidos', 'comisiones de gpulse', 'plan de compensacion gpulse', 'gano por referir en gpulse',
      'referidos del pulse', 'me pagan por invitar a gpulse', 'bonos de gpulse', 'gpulse paga por invitar',
    ],
    fuente: 'owner',
  },
  {
    id: 'gpm-membresia-vencida',
    proyecto: 'gpulse',
    categoria: 'Membresía G-Pulse',
    pregunta: '¿Qué pasa cuando vence mi membresía de G-Pulse?',
    respuesta:
      'La membresía tiene una fecha de vencimiento igual a los días del plan que activaste (por ejemplo, PRO son 180 días desde la activación). Al pasar esa fecha, el acceso al plan se corta automáticamente y el panel te ofrece reactivar. Pagar de nuevo mientras aún tienes una membresía activa no suma días encima: la reactivación cuenta cuando el plan ya venció. Puedes ver cuándo vence en tu propio panel de G-Pulse.',
    sinonimos: [
      'se vencio mi membresia', 'cuando vence la membresia', 'expiro mi plan gpulse', 'renovar membresia gpulse',
      'reactivar gpulse', 'mi acceso se corto', 'cuantos dias dura', 'caduco mi plan',
    ],
    fuente: 'codigo',
  },
] as const
