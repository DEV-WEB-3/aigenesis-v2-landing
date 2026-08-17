import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe } from '@/lib/design/motion'
/**
 * Phase 14.0 — Genesis Technology Stack (viewBox 0–100).
 * Backend → Infraestructura → IA → Blockchain → Aplicaciones
 */

export const TECH_STACK_PULSE_S = pulsoDe('technology')
export const TECH_STACK_FORM_S = llegadaDe('technology')
export const TECH_STACK_CENTER = { x: 50, y: 50 } as const

export type TechStackLayerId =
  | 'backend'
  | 'infraestructura'
  | 'ia'
  | 'blockchain'
  | 'aplicaciones'

export interface TechStackLayerDef {
  id: TechStackLayerId
  label: string
  index: number
  y: number
  width: number
  color: string
  pulseOffset: number
}

export interface TechStackFlowDef {
  id: string
  fromLayer: number
  toLayer: number
  duration: number
  delay: number
}

/**
 * LOS CINCO ESTRATOS, del sustrato a la superficie.
 *
 * Tres cosas cambiaron aqui, y ninguna es cosmetica:
 *
 * 1. LA PILA ESTABA INVERTIDA. Backend arriba (y=15) y Aplicaciones abajo
 *    (y=75). Todo diagrama de stack se construye hacia arriba: lo que sostiene
 *    va debajo. Y el gesto de esta seccion es DIFERENCIAR — «el sustrato, lo
 *    que sostenia todo lo anterior, mostrado en capas». Con la base arriba, la
 *    figura decia lo contrario que la seccion.
 *
 * 2. LOS ANCHOS NO CODIFICABAN NADA. Eran 52 · 58 · 54 · 56 · 62: ruido con
 *    aspecto de dato. Ahora el ancho ES la informacion — el sustrato es el mas
 *    ancho porque sostiene todo lo que tiene encima, y cada capa se estrecha
 *    conforme se acerca a lo que el usuario toca.
 *
 * 3. EL REPARTO VERTICAL ERA IRREGULAR (15, 30, 45, 60, 75 con la figura
 *    descentrada). Ahora los cinco estan repartidos de forma pareja alrededor
 *    del centro del lienzo.
 *
 * El `pulseOffset` se deriva del indice en vez de escribirse a mano: cinco
 * capas repartidas dentro de un ciclo, sin numeros sueltos que mantener.
 */
const ESTRATOS = [
  { id: 'backend', label: 'Backend', color: EMISSION.violetHi },
  { id: 'infraestructura', label: 'Infraestructura', color: EMISSION.blueHi },
  { id: 'ia', label: 'IA', color: EMISSION.magenta },
  { id: 'blockchain', label: 'Blockchain', color: EMISSION.violet },
  { id: 'aplicaciones', label: 'Aplicaciones', color: EMISSION.cyan },
] as const

/** Base abajo (y alta), superficie arriba (y baja). */
const ESTRATO_BASE_Y = 80
const ESTRATO_SALTO_Y = 14
/** El sustrato es el mas ancho: sostiene todo lo que lleva encima. */
const ESTRATO_ANCHO_BASE = 68
const ESTRATO_MERMA = 7

export const TECH_STACK_LAYERS: readonly TechStackLayerDef[] = ESTRATOS.map(
  (e, index) => ({
    ...e,
    index,
    y: ESTRATO_BASE_Y - index * ESTRATO_SALTO_Y,
    width: ESTRATO_ANCHO_BASE - index * ESTRATO_MERMA,
    pulseOffset: index / ESTRATOS.length,
  }),
)

/**
 * Aplastamiento de la perspectiva.
 *
 * Un estrato es un DISCO visto en angulo, no un rectangulo. Esa es la
 * diferencia entre «capas» y «una lista». Y aqui importaba de verdad: la
 * columna izquierda de esta misma seccion ya muestra once pastillas con las
 * tecnologias, asi que dibujar cinco pastillas mas a la derecha repetia la
 * misma forma y el grafico no anadia nada que el texto no dijera ya.
 */
export const ESTRATO_APLASTADO = 0.19

export function techLayerPosition(index: number): { x: number; y: number; w: number } {
  const layer = TECH_STACK_LAYERS[index % TECH_STACK_LAYERS.length]
  if (!layer) return { x: 50, y: 50, w: 50 }
  return { x: TECH_STACK_CENTER.x, y: layer.y, w: layer.width }
}

export function techLayerPlatePoint(layerIndex: number, t: number): { x: number; y: number } {
  const { x, y, w } = techLayerPosition(layerIndex)
  const half = w / 2
  const px = x - half + t * w
  const wave = Math.sin(t * Math.PI * 3 + layerIndex) * 0.8
  return { x: px, y: y + wave }
}

function buildFlows(): TechStackFlowDef[] {
  const flows: TechStackFlowDef[] = []
  for (let i = 0; i < TECH_STACK_LAYERS.length - 1; i++) {
    flows.push({
      id: `flow-${i}-${i + 1}`,
      fromLayer: i,
      toLayer: i + 1,
      duration: 2.4 + i * 0.18,
      delay: i * 0.35,
    })
  }
  return flows
}

export const TECH_STACK_FLOWS: readonly TechStackFlowDef[] = buildFlows()

export function techStackFlowPath(fromLayer: number, toLayer: number): string {
  const a = techLayerPosition(fromLayer)
  const b = techLayerPosition(toLayer)
  const startY = a.y + 2.2
  const endY = b.y - 2.2
  const mx = (a.x + b.x) / 2 + 3
  const my = (startY + endY) / 2
  return `M${a.x},${startY} Q${mx},${my} ${b.x},${endY}`
}
