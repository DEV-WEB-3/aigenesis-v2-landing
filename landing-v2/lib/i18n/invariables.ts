/**
 * LO QUE NO SE TRADUCE, DICHO EN VOZ ALTA.
 *
 * Traducir por componente tiene una consecuencia incomoda: a `t()` le llegan
 * tambien los nombres propios. `Card` no sabe si su titulo es «Compromiso
 * flexible» o «G-Pulse»; le pasa los dos igual. Y un nombre propio que no esta
 * en el diccionario produce, en desarrollo, exactamente el mismo aviso que una
 * frase que SI habria que traducir y a la que se le olvido.
 *
 * Ese es el problema real. No es el ruido: es que el aviso deja de distinguir
 * «falta trabajo» de «esto esta terminado», y una alarma que salta por todo se
 * ignora entera. La primera vez que pase, se perdera una traduccion de verdad
 * entre setenta nombres de marca.
 *
 * Asi que la exencion se DECLARA. Lo que esta en esta lista esta decidido: es un
 * nombre y se lee igual en las once lenguas. Lo que no esta y avisa, falta.
 *
 * El criterio para entrar: marcas y productos (Genesis, G-Pulse, Gevy),
 * tecnologias (React, MongoDB, BEP-20), rotulos de material publicado
 * («v5.0»), y los nombres en ingles de los artefactos visuales —son titulos de
 * pieza, como el nombre de un cuadro, y traducirlos los desdibuja—. NO entra
 * nada que un lector interprete como una frase: en cuanto describe algo, se
 * traduce.
 */
export const INVARIABLES: ReadonlySet<string> = new Set([
  /* ── marcas y productos ─────────────────────────────────────── */
  'Genesis', 'AiGenesis', 'AiGenesis.', 'AiG Token', 'Gevy', 'Gevy Shop',
  'G-Pulse', 'GPulse', 'G-Oracle', 'G-BRIDGE', 'G-BRIDGE AI', 'G11',
  'Mining', 'Booster', 'Staking', 'Marketplace', 'Token', 'Roadmap',
  'Metaverse', 'Cinema Runtime', '+ G-BRIDGE', 'AiCard + Exchange',
  'Oracle V1 + GPulse', 'G11 Community + NFT', 'GENESIS AI', 'GENESIS · OPS',
  'AiCard', 'Genesis Portal',

  /* ── tecnologias y cadenas ──────────────────────────────────── */
  'Web3', 'MetaMask', 'Socket.IO', 'Node.js', 'React', 'MongoDB', 'Redis',
  'Three.js', 'Smart Contract', 'Smart Contracts', 'BSC', 'BEP-20',
  /* «IA» NO esta aqui: es el acronimo ESPAÑOL de inteligencia artificial, no un
     nombre. En ingles es «AI» y en aleman «KI»; dejarlo fijo pinta un acronimo
     español en el rotulo de un anillo aleman. */
  'On-chain', 'on-chain', 'Core', 'BLOCKCHAIN', 'UPTIME',
  'Artificial Intelligence', 'Artificial Intelligence + Blockchain Infrastructure',
  'AI, Blockchain, Marketplace, Intelligence Network',
  'Whitepaper', 'BSC Explorer', 'Telegram', 'Discord', 'Instagram', 'YouTube',

  /*
   * ── nombres de los artefactos visuales ───────────────────────
   * Son titulos de pieza, no descripciones: cada uno nombra una escena WebGL
   * concreta. Van en la etiqueta accesible de su lienzo, que es el unico sitio
   * donde se leen. Las versiones que SI describen —«Red Genesis Mining»,
   * «Acelerador cuantico Genesis Booster»— no estan aqui: esas se traducen.
   */
  'Genesis Community Network', 'Genesis Quantum Brain', 'Genesis Signal Core',
  'Genesis Global Commerce Network', 'Genesis Evolution Path',
  'Genesis Time Vault', 'Genesis Technology Stack',
  'Genesis Token Atomic Orbital', 'Genesis Portal Network',

  /*
   * ── abreviaturas de magnitud ─────────────────────────────────
   * Llegan a `t()` como SUFIJO de un contador, no como palabra: la cifra y su
   * unidad se pintan juntas. «K», «M» y el ticker «USDT» se leen igual en las
   * once lenguas, y traducir un sufijo rompe la alineacion de la columna de
   * cifras sin ganar nada.
   */
  'K+', 'M', 'M USDT', 'USDT', '24h', '24/7', '6+', '12+', '0M USDT',

  /*
   * ── vocabulario de marca del hero ───────────────────────────
   * «AI · BLOCKCHAIN · MARKETPLACE · INTELLIGENCE NETWORK» es la firma de la
   * marca y se publica en ingles en las once versiones, igual que el logotipo.
   * «LIVE» y «GENESIS» son parte de la misma firma. No se traducen por la misma
   * razon por la que no se traduce un logotipo.
   */
  'LIVE', 'Blockchain', 'Intelligence Network', 'GENESIS', 'Genesis Token.',
  'AiGenesis.', 'Cinema Runtime + G-BRIDGE', 'Gevy Shop Marketplace',
  'Genesis Metaverse', 'Ctrl+Shift+G — Genesis Particle Control',
])
