import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe, PARALAJE, desfase } from '@/lib/design/motion'

/**
 * LA SENDA DE EVOLUCION — historia y proyeccion en una sola linea ascendente.
 *
 * El lienzo NO es cuadrado: `160 x 100`. Es deliberado. Con `viewBox 0 0 100
 * 100` y `preserveAspectRatio="meet"`, el dibujo se encierra en un cuadrado del
 * lado MENOR, y en un hueco de 980 x 590 eso deja 195 px muertos a cada lado —
 * la mitad del ancho disponible. Una linea de tiempo necesita justo esa
 * anchura, y las etiquetas van a la derecha de cada nodo.
 *
 * A 160:100 la proporcion del lienzo (1,60) casi iguala la del hueco (1,66), asi
 * que se aprovecha entero. Y TODO —nodos, anillos, rotulos, estrellas— vive
 * dentro del mismo SVG: no hay dos sistemas de coordenadas que puedan
 * desalinearse, que es lo que separa las capas en el resto del portal.
 */
export const ROADMAP_VIEWBOX = { w: 160, h: 100 } as const

export const ROADMAP_EVOLUTION_PULSE_S = pulsoDe('roadmap')
export const ROADMAP_EVOLUTION_FORM_S = llegadaDe('roadmap')

/** Recorrido completo de la energia por la senda. El viaje es lento a proposito. */
export const ROADMAP_VIAJE_S = PARALAJE.frente
/** Giro de los anillos orbitales de cada hito. */
export const ROADMAP_ANILLO_S = PARALAJE.medio
/** Deriva del campo de estrellas y de la esfera del fondo. */
export const ROADMAP_FONDO_S = PARALAJE.fondo

export type RoadmapMilestoneId =
  | 'launch'
  | 'community'
  | 'oracle'
  | 'cinema'
  | 'marketplace'
  | 'aicard'
  | 'metaverse'

export type RoadmapStatus = 'completed' | 'active' | 'upcoming'

export interface RoadmapMilestoneDef {
  id: RoadmapMilestoneId
  /** Anio, tal cual se rotula. */
  year: string
  /** Trimestre, cuando el hito lo tiene. Se rotula mas pequeno al lado del anio. */
  quarter?: string
  /** Titulo, partido en las lineas con las que se pinta. */
  title: readonly string[]
  index: number
  x: number
  y: number
  status: RoadmapStatus
  /** Cuanto crece el nodo. El destino es el mas grande de todos. */
  escala: number
}

/**
 * LOS SIETE HITOS. Son la hoja de ruta OFICIAL, y eso ya estaba decidido.
 *
 * Habia dos publicas que no decian lo mismo: estos hitos de negocio y
 * veintiuna fases tecnicas con porcentaje de avance en aigtoken.io. Dos planes
 * a la vez sobre el mismo proyecto es lo que un visitante lee como
 * descoordinacion. Manda esta, porque sus hitos corresponden al trabajo real y
 * reciente; las 21 fases colgaban de un whitepaper de febrero de 2024 y dejan de
 * ser publicas cuando aigtoken.io redirija. Si alguien vuelve a
 * «reconciliarlas», que sea a sabiendas.
 *
 * EL ORIGEN ES 2023, NO 2019. Correccion del owner: la empresa y la vision
 * arrancan en 2023. La version anterior abria en 2019 y eso desplazaba la
 * historia entera cuatro anios hacia atras.
 *
 * Al mover el origen, `G11 Community + NFT` —que figuraba en 2023— pasa a 2024
 * para que el origen no comparta anio con el hito siguiente. Es lo unico que se
 * ha inferido aqui; si G11 tambien fue 2023, se corrige cambiando este numero, o
 * se le ponen trimestres a los dos como se hace con 2026.
 */
export const ROADMAP_MILESTONES: readonly RoadmapMilestoneDef[] = [
  { id: 'launch',      year: '2023',            title: ['Lanzamiento AiGenesis'],       index: 0, x: 16,  y: 84, status: 'completed', escala: 1.00 },
  { id: 'community',   year: '2024',            title: ['G11 Community + NFT'],         index: 1, x: 33,  y: 71, status: 'completed', escala: 1.04 },
  { id: 'oracle',      year: '2025',            title: ['Oracle V1 + GPulse'],          index: 2, x: 51,  y: 58, status: 'completed', escala: 1.10 },
  { id: 'cinema',      year: '2026', quarter: 'Q1', title: ['Cinema Runtime', '+ G-BRIDGE'], index: 3, x: 69, y: 45, status: 'completed', escala: 1.06 },
  { id: 'marketplace', year: '2026', quarter: 'Q2', title: ['Gevy Shop', 'Marketplace'],     index: 4, x: 86, y: 33, status: 'active',    escala: 1.12 },
  { id: 'aicard',      year: '2026', quarter: 'Q3', title: ['AiCard + Exchange'],            index: 5, x: 102, y: 22, status: 'upcoming',  escala: 1.02 },
  { id: 'metaverse',   year: '2027',            title: ['Genesis', 'Metaverse'],        index: 6, x: 118, y: 11, status: 'upcoming',  escala: 1.30 },
] as const

export const ROADMAP_MILESTONE_COUNT = ROADMAP_MILESTONES.length

/** El hito en curso. Es el que la lista de la izquierda destaca. */
export const ROADMAP_ACTIVE_INDEX = ROADMAP_MILESTONES.findIndex(
  (m) => m.status === 'active'
)

/**
 * Color de un hito segun donde cae en el recorrido.
 *
 * Violeta al principio, magenta en el tramo vivo, cian en el futuro. Los tres
 * son de la paleta EMISSION: la senda no introduce ningun color nuevo.
 */
export function milestoneColor(index: number): string {
  const t = index / (ROADMAP_MILESTONE_COUNT - 1)
  if (t < 0.34) return EMISSION.violetHi
  if (t < 0.72) return EMISSION.magenta
  return EMISSION.cyan
}

/** Retardo de entrada de un hito, repartido con la rejilla. */
export function milestoneDelay(index: number): number {
  return desfase(index, ROADMAP_MILESTONE_COUNT, ROADMAP_EVOLUTION_FORM_S * 2)
}

/**
 * LA SENDA. Curva suave que sube de izquierda a derecha, nunca vertical.
 *
 * Los puntos de control se apartan de la recta lo justo para que la linea
 * respire; una recta pura entre siete nodos se lee como un grafico, y esto es un
 * recorrido.
 */
function controlPoint(a: RoadmapMilestoneDef, b: RoadmapMilestoneDef) {
  return {
    x: (a.x + b.x) / 2 + (b.y - a.y) * 0.07,
    y: (a.y + b.y) / 2 - (b.x - a.x) * 0.05,
  }
}

export function evolutionCurvePath(): string {
  let d = `M${ROADMAP_MILESTONES[0]!.x},${ROADMAP_MILESTONES[0]!.y}`
  for (let i = 0; i < ROADMAP_MILESTONE_COUNT - 1; i++) {
    const a = ROADMAP_MILESTONES[i]!
    const b = ROADMAP_MILESTONES[i + 1]!
    const c = controlPoint(a, b)
    d += ` Q${c.x.toFixed(2)},${c.y.toFixed(2)} ${b.x},${b.y}`
  }
  return d
}

/**
 * La punta de flecha del final, orientada segun el ultimo tramo.
 *
 * Va DESPUES del ultimo nodo, apuntando fuera del lienzo: es lo que convierte la
 * linea en una direccion en vez de un final.
 */
export function evolutionArrowPath(): string {
  const ultimo = ROADMAP_MILESTONES[ROADMAP_MILESTONE_COUNT - 1]!
  const previo = ROADMAP_MILESTONES[ROADMAP_MILESTONE_COUNT - 2]!
  const dx = ultimo.x - previo.x
  const dy = ultimo.y - previo.y
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  // arranca pegado al nodo destino y sale hacia adelante
  const bx = ultimo.x + ux * 7
  const by = ultimo.y + uy * 7
  const px = ultimo.x + ux * 13
  const py = ultimo.y + uy * 13
  // perpendicular, para las dos alas
  const nx = -uy
  const ny = ux
  const ala = 2.6
  return [
    `M${(bx + nx * ala).toFixed(2)},${(by + ny * ala).toFixed(2)}`,
    `L${px.toFixed(2)},${py.toFixed(2)}`,
    `L${(bx - nx * ala).toFixed(2)},${(by - ny * ala).toFixed(2)}`,
  ].join(' ')
}

/* ─────────────────────────────────────────────────────────────────────────
   COMPATIBILIDAD CON EL CONSTRUCTOR DE PARTICULAS

   `lib/roadmapEvolutionPath.ts` construye la nube WebGL de esta seccion y pide
   estos tres nombres. Ese lienzo esta APAGADO —`PINTAR_PARTICULAS = false`— asi
   que nada de esto se pinta hoy, pero se compila, y si el dia que se reactive
   las dos fuentes no coinciden, la nube dibujaria una linea de tiempo distinta
   de la que se ve.

   Por eso NO se duplican los datos: se derivan de `ROADMAP_MILESTONES`. Aqui
   mismo, en este archivo, ya hubo una lista escrita a mano en paralelo con la de
   la escena y bastaba tocar una para que el dibujo y el texto discreparan.
   ───────────────────────────────────────────────────────────────────────── */

/** Vista que espera el constructor de particulas: `nodeScale` en vez de `escala`. */
export const ROADMAP_EVOLUTION_MILESTONES = ROADMAP_MILESTONES.map((m) => ({
  year: m.year,
  index: m.index,
  x: m.x,
  y: m.y,
  isFuture: m.status === 'upcoming',
  nodeScale: m.escala,
}))

export function roadmapMilestonePosition(index: number): { x: number; y: number } {
  const m = ROADMAP_MILESTONES[index % ROADMAP_MILESTONE_COUNT]
  if (!m) return { x: ROADMAP_VIEWBOX.w / 2, y: ROADMAP_VIEWBOX.h / 2 }
  return { x: m.x, y: m.y }
}

/** Punto de la senda en `t` ∈ [0,1], por los mismos tramos cuadraticos que la traza. */
export function evolutionPathPoint(t: number): { x: number; y: number } {
  const clamped = Math.max(0, Math.min(1, t))
  const tramos = ROADMAP_MILESTONE_COUNT - 1
  const escalado = clamped * tramos
  const i = Math.min(Math.floor(escalado), tramos - 1)
  const f = escalado - i
  const a = ROADMAP_MILESTONES[i]!
  const b = ROADMAP_MILESTONES[i + 1]!
  const c = controlPoint(a, b)
  const u = 1 - f
  return {
    x: u * u * a.x + 2 * u * f * c.x + f * f * b.x,
    y: u * u * a.y + 2 * u * f * c.y + f * f * b.y,
  }
}

/**
 * ESTRELLAS DEL FONDO, generadas con semilla y NO con `Math.random()`.
 *
 * El azar romperia la hidratacion: el servidor pintaria unas posiciones y el
 * cliente otras, y React avisaria de la discrepancia —o peor, la arreglaria
 * repintando—. Con una semilla, servidor y cliente producen exactamente lo
 * mismo.
 */
const ESTRELLAS = 78

function seeded(i: number, sal: number): number {
  const x = Math.sin(i * 127.1 + sal * 311.7) * 43758.5453
  return x - Math.floor(x)
}

export interface RoadmapStar {
  x: number
  y: number
  r: number
  color: string
  /** Retardo del centelleo, para que no titilen a la vez. */
  retardo: number
}

export const ROADMAP_STARS: readonly RoadmapStar[] = Array.from(
  { length: ESTRELLAS },
  (_, i) => {
    const t = seeded(i, 1)
    return {
      x: seeded(i, 2) * ROADMAP_VIEWBOX.w,
      y: seeded(i, 3) * ROADMAP_VIEWBOX.h,
      r: 0.18 + seeded(i, 4) * 0.34,
      color: t < 0.5 ? EMISSION.violetHi : t < 0.82 ? EMISSION.cyan : EMISSION.magentaHi,
      retardo: seeded(i, 5) * ROADMAP_FONDO_S,
    }
  }
)

/**
 * LA ESFERA DE ALAMBRE del fondo — latitudes, no una malla completa.
 *
 * Una malla de verdad son cientos de nodos y aqui es un elemento de ambiente:
 * cinco elipses de distinta apertura leen como esfera y cuestan cinco trazos.
 */
export const ROADMAP_GLOBE = { cx: 62, cy: 40, r: 15 } as const

export function globeLatitudes(): readonly { rx: number; ry: number; y: number }[] {
  const filas = 7
  return Array.from({ length: filas }, (_, i) => {
    const f = (i + 1) / (filas + 1)
    const ang = f * Math.PI
    return {
      rx: ROADMAP_GLOBE.r * Math.sin(ang),
      ry: ROADMAP_GLOBE.r * Math.sin(ang) * 0.24,
      y: ROADMAP_GLOBE.cy - Math.cos(ang) * ROADMAP_GLOBE.r,
    }
  })
}

/** Cascaras orbitales sueltas del fondo, muy tenues. */
export const ROADMAP_SHELLS: readonly { rx: number; ry: number; rot: number }[] = [
  { rx: 46, ry: 15, rot: -14 },
  { rx: 36, ry: 11, rot: 9 },
  { rx: 27, ry: 8, rot: -25 },
] as const
