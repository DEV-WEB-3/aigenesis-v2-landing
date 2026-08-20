/**
 * G-PULSE — MISIÓN, VISIÓN E IDENTIDAD.
 *
 * FUENTE: la landing, que es la autoridad. Dice literalmente que «GPulse
 * entrega análisis operativo y señales automatizadas para mercados globales» y
 * que es «capa de ejecución táctica — complementaria al núcleo de inteligencia
 * G-Oracle». Todo lo de aquí desarrolla eso; nada lo contradice.
 *
 * COMPROBADO EL 19-AGO-2026: `conect.aigenesis.io` se titula «AiGenesis ·
 * G-Pulse». Es decir, la puerta de entrada del ecosistema Y la aplicación de
 * G-Pulse son el mismo sitio. Eso explica por qué todos los botones de la
 * landing —Mining, Staking, Booster, Marketplace— acaban ahí: la sesión es una
 * sola.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ESTE ES EL PRODUCTO DE MAYOR RIESGO DE LENGUAJE DEL ECOSISTEMA, y conviene
 * decirlo antes que nada.
 *
 * Un marketplace vende objetos: es difícil que una descripción de una tienda se
 * lea como una promesa financiera. Una herramienta que emite SEÑALES DE MERCADO
 * está a una frase de convertirse en asesoramiento financiero regulado — y la
 * frase que lo convierte suele ser inocente: «nuestras señales aciertan el
 * 80 %», «detecta oportunidades rentables», «te dice cuándo entrar».
 *
 * Por eso la identidad de G-Pulse se construye sobre una distinción explícita:
 * G-PULSE DESCRIBE LO QUE PASA EN EL MERCADO. NO DICE QUÉ HACER CON ESO.
 * Un termómetro no receta. Toda la redacción del producto debería poder pasar
 * esa prueba: si la frase suena a receta, está mal escrita.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const GPULSE_IDENTIDAD = {
  /**
   * QUÉ ES, sin metáforas. Se evita «inteligencia artificial que predice»:
   * predecir es exactamente lo que no hace, y prometerlo es lo que no se puede.
   */
  queEs:
    'G-Pulse es la herramienta de análisis del ecosistema: procesa datos de mercados globales de forma continua y publica señales automatizadas y alertas para que quien las lee vea lo que está ocurriendo sin tener que mirar veinte pantallas.',

  mision:
    'Reducir el tiempo entre que algo pasa en un mercado y que la persona que necesita saberlo se entera, sin pedirle que sea analista para entenderlo.',

  /**
   * VISIÓN sin cifras ni plazos, por el mismo motivo que en Gevy: una visión
   * con número es un objetivo comercial disfrazado.
   */
  vision:
    'Que la lectura del mercado dentro del ecosistema sea una capa de información compartida y comprensible — no un privilegio de quien ya sabe leer gráficos.',

  /**
   * LA DISTINCIÓN CON G-ORACLE, que es la confusión número uno.
   *
   * La landing la establece en una frase que conviene no reescribir: «GPulse
   * entrega señales; G-Oracle define la inteligencia estratégica del
   * protocolo». Uno es el pulso, el otro decide qué significa.
   */
  frenteAGOracle: {
    gpulse: 'Entrega señales y alertas. Capa de ejecución táctica: qué está pasando ahora.',
    goracle:
      'Interpreta, conecta y gobierna el flujo de información entre productos y protocolos. Capa de inteligencia: qué significa y cómo se orquesta.',
    comoExplicarlo:
      'G-Pulse es el pulso; G-Oracle es el criterio. El primero mide, el segundo decide qué hacer con lo medido a nivel de protocolo — no a nivel de la cartera de nadie.',
  },

  /**
   * LOS LÍMITES. Van en la identidad y no en un descargo al pie porque un
   * límite escondido en letra pequeña no evita el malentendido: lo documenta.
   */
  loQueNoEs: [
    {
      no: 'No es asesoramiento financiero',
      porque:
        'Una señal describe una condición de mercado. No recomienda comprar, vender ni mantener nada, y no conoce la situación de quien la lee.',
    },
    {
      no: 'No predice el futuro',
      porque:
        'Procesa lo que ya ocurrió y lo que está ocurriendo. Cualquier redacción que sugiera anticipación —«predice», «adelanta», «detecta antes que nadie»— promete algo que ningún sistema puede sostener.',
    },
    {
      no: 'No garantiza acierto',
      porque:
        'Publicar un porcentaje de aciertos convierte la herramienta en un producto con resultado esperado. Si algún día se publican métricas, van con su método y su periodo, o no van.',
    },
    {
      no: 'No opera por ti',
      porque:
        'Informa. Quien decide y ejecuta es la persona, con su propio criterio y su propio riesgo.',
    },
  ],

  /**
   * CÓMO SUENA. Los ejemplos hacen el trabajo que ningún adjetivo hace.
   */
  tono: {
    principio:
      'Se habla como un instrumento de medida: preciso, sin adjetivos de entusiasmo y sin sugerir acción.',
    ejemplos: [
      {
        mal: 'Detecta oportunidades rentables antes que el mercado.',
        bien: 'Señala movimientos relevantes en el momento en que ocurren.',
      },
      {
        mal: 'Nuestra IA te dice cuándo entrar y cuándo salir.',
        bien: 'Publica la condición que se ha cumplido y el dato que la respalda.',
      },
      {
        mal: 'Maximiza tus resultados con señales de alta precisión.',
        bien: 'Alertas configurables sobre los mercados que elijas seguir.',
      },
    ],
  },

  /**
   * LO QUE LA LANDING PUBLICA. Se copia aquí para que el soporte diga lo mismo
   * que la web, y con la advertencia de que las cifras cambian: si un día no
   * coinciden, manda la landing.
   */
  segunLaLanding: {
    descripcion:
      'Análisis operativo y señales automatizadas para mercados globales. Capa de ejecución táctica, complementaria a G-Oracle.',
    capacidades: ['Análisis en tiempo real', 'Señales automatizadas', 'Alertas de mercado', 'Integración con G-BRIDGE'],
    indicadoresPublicados:
      'La sección publica señales diarias, mesas activas y disponibilidad del servicio. Son cifras operativas del sistema, no resultados de nadie.',
  },
} as const
