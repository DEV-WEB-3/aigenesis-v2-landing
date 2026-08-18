'use client'

import { EMISSION } from '@/lib/design/tokens'

import {
  TOKEN_ATOMIC_ORBIT_COUNT,
  TOKEN_ORBIT_MAX_POINTS,
  TOKEN_ORBIT_MIN_POINTS,
  type OrbitEditorOrbitState,
} from '@/lib/token/tokenOrbitalValueLayout'

const HANDLE_COLORS = [EMISSION.magenta, EMISSION.cyan, EMISSION.violetHi, EMISSION.magentaHi, EMISSION.blue] as const

interface TokenOrbitEditorHudProps {
  orbits: readonly OrbitEditorOrbitState[]
  activeOrbit: number
  activePoint: number
  copied: boolean
  onSelectOrbit: (index: number) => void
  onSelectPoint: (index: number) => void
  onPointChange: (orbitIndex: number, pointIndex: number, field: 'x' | 'y', value: number) => void
  onAddPoint: () => void
  onDeletePoint: () => void
  onResetOrbit: () => void
  onCopy: () => void
  onResetAll: () => void
}

export default function TokenOrbitEditorHud({
  orbits,
  activeOrbit,
  activePoint,
  copied,
  onSelectOrbit,
  onSelectPoint,
  onPointChange,
  onAddPoint,
  onDeletePoint,
  onResetOrbit,
  onCopy,
  onResetAll,
}: TokenOrbitEditorHudProps) {
  const current = orbits[activeOrbit]
  const point = current?.points[activePoint]
  const pointCount = current?.points.length ?? 0

  return (
    <div className="token-orbit-editor-hud" role="region" aria-label="Editor de órbitas">
      <p className="token-orbit-editor-hud__title">Editor libre de órbitas</p>
      <p className="token-orbit-editor-hud__hint">
        Arrastra cada <strong>punto</strong> para dar la forma que quieras. Doble clic en la línea = añadir punto.
        Supr = borrar punto · Flechas = mover punto fino.
      </p>

      <ul className="token-orbit-editor-hud__list">
        {Array.from({ length: TOKEN_ATOMIC_ORBIT_COUNT }, (_, i) => (
          <li key={i}>
            <button
              type="button"
              className={`token-orbit-editor-hud__row${activeOrbit === i ? ' is-active' : ''}`}
              onClick={() => onSelectOrbit(i)}
            >
              <span
                className="token-orbit-editor-hud__swatch"
                style={{ background: HANDLE_COLORS[i % HANDLE_COLORS.length] }}
                aria-hidden="true"
              />
              <span className="token-orbit-editor-hud__label">Órbita {i + 1}</span>
              <span className="token-orbit-editor-hud__angle">{orbits[i]?.points.length ?? 0} pts</span>
            </button>
          </li>
        ))}
      </ul>

      {point && (
        <div className="token-orbit-editor-hud__controls">
          <p className="token-orbit-editor-hud__subhead">
            Punto {activePoint + 1} / {pointCount}
          </p>

          <div className="token-orbit-editor-hud__point-nav">
            <button type="button" className="token-orbit-editor-hud__btn" onClick={() => onSelectPoint(Math.max(0, activePoint - 1))}>
              ← Pt
            </button>
            <button
              type="button"
              className="token-orbit-editor-hud__btn"
              onClick={() => onSelectPoint(Math.min(pointCount - 1, activePoint + 1))}
            >
              Pt →
            </button>
          </div>

          <label className="token-orbit-editor-hud__field">
            <span>X</span>
            <input
              type="range"
              min={2}
              max={98}
              step={0.1}
              value={point.x}
              onChange={(e) => onPointChange(activeOrbit, activePoint, 'x', Number(e.target.value))}
            />
            <input
              type="number"
              step={0.1}
              value={point.x}
              onChange={(e) => onPointChange(activeOrbit, activePoint, 'x', Number(e.target.value))}
            />
          </label>

          <label className="token-orbit-editor-hud__field">
            <span>Y</span>
            <input
              type="range"
              min={2}
              max={98}
              step={0.1}
              value={point.y}
              onChange={(e) => onPointChange(activeOrbit, activePoint, 'y', Number(e.target.value))}
            />
            <input
              type="number"
              step={0.1}
              value={point.y}
              onChange={(e) => onPointChange(activeOrbit, activePoint, 'y', Number(e.target.value))}
            />
          </label>

          <div className="token-orbit-editor-hud__point-nav">
            <button type="button" className="token-orbit-editor-hud__btn" onClick={onAddPoint} disabled={pointCount >= TOKEN_ORBIT_MAX_POINTS}>
              + Punto
            </button>
            <button type="button" className="token-orbit-editor-hud__btn" onClick={onDeletePoint} disabled={pointCount <= TOKEN_ORBIT_MIN_POINTS}>
              − Punto
            </button>
          </div>

          <button type="button" className="token-orbit-editor-hud__btn token-orbit-editor-hud__btn--block" onClick={onResetOrbit}>
            Reset órbita {activeOrbit + 1}
          </button>

          <p className="token-orbit-editor-hud__keys">
            Flechas = mover punto · Shift = paso 1 · Supr = borrar punto
          </p>
        </div>
      )}

      <div className="token-orbit-editor-hud__actions">
        <button type="button" className="token-orbit-editor-hud__btn token-orbit-editor-hud__btn--primary" onClick={onCopy}>
          {copied ? 'Copiado ✓' : 'Copiar formas'}
        </button>
        <button type="button" className="token-orbit-editor-hud__btn" onClick={onResetAll}>
          Reset todo
        </button>
      </div>

      <p className="token-orbit-editor-hud__url">
        URL: <code>/?orbit-edit=1#token</code>
      </p>
    </div>
  )
}
