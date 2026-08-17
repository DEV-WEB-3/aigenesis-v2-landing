/**
 * Phase 11.0 — G-Oracle Quantum Brain layout (viewBox 0–100).
 */

import { pulsoDe, llegadaDe } from '@/lib/design/motion'

export const ORACLE_INFERENCE_PULSE_S = pulsoDe('goracle')
export const ORACLE_BRAIN_FORM_S = llegadaDe('goracle')
export const ORACLE_NEURAL_NODE_COUNT = 72
export const ORACLE_BRAIN_CENTER = { x: 50, y: 50 } as const

export type OracleSatelliteId = 'trust' | 'mining' | 'booster' | 'staking' | 'gpulse'

export interface OracleSatelliteDef {
  id: OracleSatelliteId
  x: number
  y: number
  pulseOffset: number
}

/**
 * LOS CINCO SATELITES, en anillo y en el orden en que los conociste.
 *
 * Estaban en (16,24) · (10,52) · (50,10) · (90,52) · (50,90): una dispersion
 * irregular que no dice nada. Dos de ellos casi a la misma altura por la
 * izquierda, uno arriba, uno abajo y uno lejisimos a la derecha — y ese ultimo
 * se salia literalmente de la pantalla (medido: x=1757 con un viewport de 1723).
 *
 * El gesto de esta seccion es CONVERGER: muchos independientes que se reconocen
 * como uno. Para que eso se lea, los cinco tienen que ser PARES — misma
 * distancia al centro y mismo reparto angular. Cualquier otra disposicion
 * insinua una jerarquia que la seccion no afirma.
 *
 * El orden va en el sentido del reloj desde arriba y NO es alfabetico ni
 * arbitrario: es el orden en que el visitante se encontro cada seccion bajando
 * por el portal. El anillo es su recorrido, y el cerebro en el centro es lo que
 * lo interpreta.
 */
const SATELITES_EN_ORDEN = ['trust', 'mining', 'booster', 'staking', 'gpulse'] as const

/**
 * Radio del anillo. 38 deja fuera los ~6 de radio que ocupa cada icono, asi que
 * el conjunto cabe entero en el lienzo 0–100 con margen.
 */
const ANILLO_R = 38

export const ORACLE_ECOSYSTEM_SATELLITES: readonly OracleSatelliteDef[] =
  SATELITES_EN_ORDEN.map((id, i) => {
    // desde arriba (-90°) y en el sentido del reloj
    const ang = (-90 + (360 / SATELITES_EN_ORDEN.length) * i) * (Math.PI / 180)
    return {
      id,
      x: ORACLE_BRAIN_CENTER.x + Math.cos(ang) * ANILLO_R,
      y: ORACLE_BRAIN_CENTER.y + Math.sin(ang) * ANILLO_R,
      pulseOffset: i / SATELITES_EN_ORDEN.length,
    }
  })

export interface OracleNeuralLayerDef {
  id: 'layer1' | 'layer2' | 'layer3'
  rx: number
  ry: number
  depth: number
  opacity: number
}

export const ORACLE_NEURAL_LAYERS: readonly OracleNeuralLayerDef[] = [
  { id: 'layer1', rx: 28, ry: 22, depth: 0.35, opacity: 0.22 },
  { id: 'layer2', rx: 34, ry: 26, depth: 0.55, opacity: 0.28 },
  { id: 'layer3', rx: 40, ry: 30, depth: 0.78, opacity: 0.32 },
] as const

const LAYER_SCALES = [0.52, 0.68, 0.84] as const

export function neuralNodePosition(
  index: number,
  total = ORACLE_NEURAL_NODE_COUNT
): { x: number; y: number; layer: number } {
  const layer = index % 3
  const layerScale = LAYER_SCALES[layer]!
  const angle = (index / total) * Math.PI * 2 + layer * 0.55 + (index % 5) * 0.08
  const r = layerScale * (19 + (index % 8) * 1.15)
  const blobX = 1 + Math.sin(angle * 2 + 0.4) * 0.12
  const blobY = 0.78 + Math.cos(angle + 1.2) * 0.08
  return {
    x: ORACLE_BRAIN_CENTER.x + r * Math.cos(angle) * blobX,
    y: ORACLE_BRAIN_CENTER.y + r * Math.sin(angle) * blobY,
    layer,
  }
}

export function synapsePath(fromIndex: number, toIndex: number, total = ORACLE_NEURAL_NODE_COUNT): string {
  const a = neuralNodePosition(fromIndex, total)
  const b = neuralNodePosition(toIndex, total)
  const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.08
  const my = (a.y + b.y) / 2 + (a.x - b.x) * 0.06
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`
}

export function buildSynapseConnections(total = ORACLE_NEURAL_NODE_COUNT): { from: number; to: number }[] {
  const connections: { from: number; to: number }[] = []
  for (let i = 0; i < total; i++) {
    const a = neuralNodePosition(i, total)
    for (let j = i + 1; j < total; j++) {
      const b = neuralNodePosition(j, total)
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 14.5 && ((i * 7 + j * 13) % 11 < 4 || (i + j) % 9 === 0)) {
        connections.push({ from: i, to: j })
      }
    }
  }
  return connections.slice(0, 110)
}

export function satelliteStreamPath(satelliteId: OracleSatelliteId): string {
  const sat = ORACLE_ECOSYSTEM_SATELLITES.find((s) => s.id === satelliteId)
  if (!sat) return ''
  const cx = ORACLE_BRAIN_CENTER.x
  const cy = ORACLE_BRAIN_CENTER.y
  const mx = (cx + sat.x) / 2 + (sat.y - cy) * 0.06
  const my = (cy + sat.y) / 2 + (cx - sat.x) * 0.05
  return `M${sat.x},${sat.y} Q${mx},${my} ${cx},${cy}`
}

export function oracleOutflowPath(index: number): string {
  const cx = ORACLE_BRAIN_CENTER.x
  const cy = ORACLE_BRAIN_CENTER.y
  const angle = ((index * 53 + 17) % 360) * (Math.PI / 180)
  const ex = cx + Math.cos(angle) * 32
  const ey = cy + Math.sin(angle) * 26
  const mx = (cx + ex) / 2 + Math.sin(angle) * 4
  const my = (cy + ey) / 2 - Math.cos(angle) * 3
  return `M${cx},${cy} Q${mx},${my} ${ex},${ey}`
}
