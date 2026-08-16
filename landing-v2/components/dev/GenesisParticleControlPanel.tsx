'use client'

import { INK } from '@/lib/design/tokens'

import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  FlowDevControls,
  GenesisParticleControlConfig,
  GenesisParticlePresetId,
  GlobalParticleControls,
  LayerParticleControls,
  LogoDevControls,
  NeuralDevControls,
  ShieldDevControls,
  TransformControls,
  TrustControlLayerId,
  ValidationDevControls,
} from '@/lib/trust/GenesisParticleControlTypes'
import {
  PRESET_LABELS,
  TRUST_CONTROL_LAYER_IDS,
  TRUST_CONTROL_LAYER_LABELS,
} from '@/lib/trust/GenesisParticleControlTypes'
import {
  exportGenesisParticleConfigJson,
  getGenesisParticleControlConfig,
  importGenesisParticleConfigJson,
  listCustomPresets,
  loadCustomPreset,
  loadGenesisParticlePreset,
  patchGenesisParticleControlConfig,
  requestTrustAnimationReset,
  resetGenesisParticleControlConfig,
  saveCustomPreset,
  setParticleControlPaused,
  subscribeGenesisParticleControl,
} from '@/lib/trust/GenesisParticleControlStore'
import { useIsMounted } from '@/hooks/useIsMounted'

type TabId =
  | 'general'
  | 'layers'
  | 'transform'
  | 'logo'
  | 'shield'
  | 'neural'
  | 'validation'
  | 'flow'
  | 'presets'

const TABS: { id: TabId; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'layers', label: 'Capas' },
  { id: 'transform', label: 'Posición' },
  { id: 'logo', label: 'Logo' },
  { id: 'shield', label: 'Escudo' },
  { id: 'neural', label: 'Neural' },
  { id: 'validation', label: 'Validación' },
  { id: 'flow', label: 'Flujo' },
  { id: 'presets', label: 'Presets' },
]

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <label className="gpc-row">
      <span className="gpc-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="gpc-val">{value.toFixed(2)}</span>
    </label>
  )
}

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="gpc-row gpc-switch">
      <span className="gpc-label">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  )
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="gpc-row">
      <span className="gpc-label">{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function LayerEditor({
  layerId,
  layer,
  onChange,
}: {
  layerId: TrustControlLayerId
  layer: LayerParticleControls
  onChange: (next: LayerParticleControls) => void
}) {
  const set = (patch: Partial<LayerParticleControls>) => onChange({ ...layer, ...patch })
  return (
    <details className="gpc-layer" open={layerId === 'logoGenesis'}>
      <summary>{TRUST_CONTROL_LAYER_LABELS[layerId]}</summary>
      <SwitchRow label="Visible" checked={layer.visible} onChange={(v) => set({ visible: v })} />
      <SliderRow label="Intensidad" value={layer.intensity} min={0} max={2} step={0.01} onChange={(v) => set({ intensity: v })} />
      <SliderRow label="Brillo" value={layer.brightness} min={0} max={2} step={0.01} onChange={(v) => set({ brightness: v })} />
      <SliderRow label="Saturación" value={layer.saturation} min={0} max={2} step={0.01} onChange={(v) => set({ saturation: v })} />
      <SliderRow label="Tamaño" value={layer.particleSize} min={0.2} max={2.5} step={0.01} onChange={(v) => set({ particleSize: v })} />
      <SliderRow label="Velocidad" value={layer.speed} min={0} max={2} step={0.01} onChange={(v) => set({ speed: v })} />
      <SliderRow label="Opacidad" value={layer.opacity} min={0} max={1} step={0.01} onChange={(v) => set({ opacity: v })} />
      <ColorRow label="Color primario" value={layer.primaryColor} onChange={(v) => set({ primaryColor: v })} />
      <ColorRow label="Color secundario" value={layer.secondaryColor} onChange={(v) => set({ secondaryColor: v })} />
      <SliderRow label="Offset X" value={layer.offsetX} min={-1.5} max={1.5} step={0.01} onChange={(v) => set({ offsetX: v })} />
      <SliderRow label="Offset Y" value={layer.offsetY} min={-1.5} max={1.5} step={0.01} onChange={(v) => set({ offsetY: v })} />
      <SliderRow label="Offset Z" value={layer.offsetZ} min={-1} max={1} step={0.01} onChange={(v) => set({ offsetZ: v })} />
      <SliderRow label="Escala" value={layer.scale} min={0.2} max={2} step={0.01} onChange={(v) => set({ scale: v })} />
    </details>
  )
}

export default function GenesisParticleControlPanel() {
  const mounted = useIsMounted()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [tab, setTab] = useState<TabId>('general')
  const [config, setConfig] = useState<GenesisParticleControlConfig>(() =>
    getGenesisParticleControlConfig()
  )
  const [customPresets, setCustomPresets] = useState<string[]>([])
  const [presetName, setPresetName] = useState('')
  const [importText, setImportText] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null)
  const [pos, setPos] = useState({ x: 16, y: 72 })

  useEffect(() => {
    return subscribeGenesisParticleControl(() => {
      setConfig(getGenesisParticleControlConfig())
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const patch = useCallback((patchCfg: Parameters<typeof patchGenesisParticleControlConfig>[0]) => {
    patchGenesisParticleControlConfig(patchCfg)
    if (patchCfg.global?.intensity !== undefined) {
      console.log('Control Update', patchCfg.global.intensity)
    }
  }, [])

  const patchGlobal = (g: Partial<GlobalParticleControls>) =>
    patch({ global: { ...config.global, ...g } })

  const patchTransform = (t: Partial<TransformControls>) =>
    patch({ transform: { ...config.transform, ...t } })

  const patchLogo = (l: Partial<LogoDevControls>) => patch({ logo: { ...config.logo, ...l } })

  const patchShield = (s: Partial<ShieldDevControls>) =>
    patch({ shield: { ...config.shield, ...s } })

  const patchNeural = (n: Partial<NeuralDevControls>) =>
    patch({ neural: { ...config.neural, ...n } })

  const patchValidation = (v: Partial<ValidationDevControls>) =>
    patch({ validation: { ...config.validation, ...v } })

  const patchFlow = (f: Partial<FlowDevControls>) => patch({ flow: { ...config.flow, ...f } })

  const patchLayer = (id: TrustControlLayerId, layer: LayerParticleControls) =>
    patch({ layers: { ...config.layers, [id]: layer } })

  const onDragStart = (e: React.MouseEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      setPos({
        x: dragRef.current.px + (e.clientX - dragRef.current.x),
        y: dragRef.current.py + (e.clientY - dragRef.current.y),
      })
    }
    const onUp = () => {
      dragRef.current = null
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [pos.x, pos.y])

  if (!mounted || process.env.NODE_ENV === 'production') return null
  if (!open) {
    return (
      <div className="gpc-hint" aria-hidden>
        Ctrl+Shift+G — Genesis Particle Control
      </div>
    )
  }

  const refreshCustom = () => setCustomPresets(listCustomPresets())

  return (
    <>
      <style jsx global>{`
        .gpc-hint {
          position: fixed;
          bottom: 8px;
          left: 8px;
          z-index: 9998;
          font: 10px/1.2 var(--font-mono, monospace);
          color: rgba(34, 211, 238, 0.35);
          pointer-events: none;
        }
        .gpc-panel {
          position: fixed;
          z-index: 9999;
          width: min(360px, calc(100vw - 24px));
          max-height: min(82vh, 720px);
          display: flex;
          flex-direction: column;
          border-radius: 14px;
          border: 1px solid rgba(34, 211, 238, 0.35);
          background: linear-gradient(
            145deg,
            rgba(8, 12, 24, 0.92) 0%,
            rgba(12, 8, 20, 0.88) 100%
          );
          backdrop-filter: blur(18px);
          box-shadow:
            0 0 0 1px rgba(233, 30, 139, 0.12),
            0 16px 48px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          color: var(--g-ink-muted);
          font: 11px/1.35 var(--font-inter, system-ui, sans-serif);
          overflow: hidden;
        }
        .gpc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          cursor: move;
          border-bottom: 1px solid rgba(34, 211, 238, 0.2);
          background: linear-gradient(90deg, rgba(233, 30, 139, 0.12), rgba(34, 211, 238, 0.08));
        }
        .gpc-title {
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.04em;
          background: linear-gradient(90deg, var(--g-cyan), var(--g-magenta));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .gpc-header-actions {
          display: flex;
          gap: 6px;
        }
        .gpc-header-actions button {
          border: none;
          background: rgba(255, 255, 255, 0.08);
          color: var(--g-ink-muted);
          border-radius: 6px;
          padding: 2px 8px;
          cursor: pointer;
          font-size: 11px;
        }
        .gpc-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .gpc-tabs button {
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.04);
          color: var(--g-ink-muted);
          border-radius: 6px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 10px;
        }
        .gpc-tabs button.active {
          color: var(--g-cyan);
          border-color: rgba(34, 211, 238, 0.35);
          background: rgba(34, 211, 238, 0.1);
        }
        .gpc-body {
          overflow-y: auto;
          padding: 10px 12px 14px;
          flex: 1;
        }
        .gpc-row {
          display: grid;
          grid-template-columns: 1fr 1fr 36px;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .gpc-switch {
          grid-template-columns: 1fr auto;
        }
        .gpc-label {
          color: var(--g-ink-muted);
          font-size: 10px;
        }
        .gpc-val {
          text-align: right;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: var(--g-cyan);
        }
        .gpc-row input[type='range'] {
          width: 100%;
          accent-color: var(--g-magenta);
        }
        .gpc-row input[type='color'] {
          width: 100%;
          height: 22px;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .gpc-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
        .gpc-actions button,
        .gpc-preset-grid button {
          border: 1px solid rgba(34, 211, 238, 0.25);
          background: rgba(34, 211, 238, 0.08);
          color: var(--g-ink-muted);
          border-radius: 6px;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 10px;
        }
        .gpc-actions button:hover,
        .gpc-preset-grid button:hover {
          background: rgba(233, 30, 139, 0.15);
          border-color: rgba(233, 30, 139, 0.35);
        }
        .gpc-layer {
          margin-bottom: 8px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 6px 8px;
        }
        .gpc-layer summary {
          cursor: pointer;
          font-weight: 500;
          color: var(--g-ink-muted);
          margin-bottom: 6px;
        }
        .gpc-preset-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
        .gpc-textarea {
          width: 100%;
          min-height: 80px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.35);
          color: var(--g-ink-muted);
          font: 10px/1.4 monospace;
          padding: 8px;
          resize: vertical;
        }
      `}</style>

      <div
        ref={panelRef}
        className="gpc-panel"
        style={{ left: pos.x, top: pos.y }}
        role="dialog"
        aria-label="Genesis Particle Control Panel"
      >
        <div className="gpc-header" onMouseDown={onDragStart}>
          <span className="gpc-title">Genesis Particle Control</span>
          <div className="gpc-header-actions">
            <button type="button" onClick={() => setCollapsed((v) => !v)}>
              {collapsed ? '▾' : '▴'}
            </button>
            <button type="button" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
        </div>

        {!collapsed && (
          <>
            <div className="gpc-tabs">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={tab === t.id ? 'active' : ''}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="gpc-body">
              {tab === 'general' && (
                <>
                  <div className="gpc-actions">
                    <button type="button" onClick={() => requestTrustAnimationReset()}>
                      Reiniciar animación
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setParticleControlPaused(!config.global.paused, performance.now() / 1000)
                      }
                    >
                      {config.global.paused ? 'Reanudar' : 'Pausar'}
                    </button>
                  </div>
                  <SwitchRow
                    label="Partículas activas"
                    checked={config.global.enabled}
                    onChange={(v) => patchGlobal({ enabled: v })}
                  />
                  <SliderRow label="Velocidad global" value={config.global.speed} min={0} max={2} step={0.01} onChange={(v) => patchGlobal({ speed: v })} />
                  <SliderRow label="Intensidad global" value={config.global.intensity} min={0} max={2} step={0.01} onChange={(v) => patchGlobal({ intensity: v })} />
                  <SliderRow label="Brillo global" value={config.global.brightness} min={0} max={2} step={0.01} onChange={(v) => patchGlobal({ brightness: v })} />
                  <SliderRow label="Tamaño global" value={config.global.pointSize} min={0.3} max={2.5} step={0.01} onChange={(v) => patchGlobal({ pointSize: v })} />
                  <SliderRow label="Opacidad global" value={config.global.opacity} min={0} max={1} step={0.01} onChange={(v) => patchGlobal({ opacity: v })} />
                </>
              )}

              {tab === 'layers' &&
                TRUST_CONTROL_LAYER_IDS.map((id) => (
                  <LayerEditor
                    key={id}
                    layerId={id}
                    layer={config.layers[id]}
                    onChange={(layer) => patchLayer(id, layer)}
                  />
                ))}

              {tab === 'transform' && (
                <>
                  <SliderRow label="X" value={config.transform.x} min={-2} max={2} step={0.01} onChange={(v) => patchTransform({ x: v })} />
                  <SliderRow label="Y" value={config.transform.y} min={-2} max={2} step={0.01} onChange={(v) => patchTransform({ y: v })} />
                  <SliderRow label="Z" value={config.transform.z} min={-2} max={2} step={0.01} onChange={(v) => patchTransform({ z: v })} />
                  <SliderRow label="Escala" value={config.transform.scale} min={0.2} max={2} step={0.01} onChange={(v) => patchTransform({ scale: v })} />
                  <SliderRow label="Rotación X°" value={config.transform.rotX} min={-180} max={180} step={1} onChange={(v) => patchTransform({ rotX: v })} />
                  <SliderRow label="Rotación Y°" value={config.transform.rotY} min={-180} max={180} step={1} onChange={(v) => patchTransform({ rotY: v })} />
                  <SliderRow label="Rotación Z°" value={config.transform.rotZ} min={-180} max={180} step={1} onChange={(v) => patchTransform({ rotZ: v })} />
                </>
              )}

              {tab === 'logo' && (
                <>
                  <SliderRow label="Densidad visual" value={config.logo.density} min={0.2} max={2} step={0.01} onChange={(v) => patchLogo({ density: v })} />
                  <SliderRow label="Brillo logo" value={config.logo.brightness} min={0} max={2} step={0.01} onChange={(v) => patchLogo({ brightness: v })} />
                  <SliderRow label="Saturación tornasol" value={config.logo.tornasolSaturation} min={0} max={2} step={0.01} onChange={(v) => patchLogo({ tornasolSaturation: v })} />
                  <SliderRow label="Intensidad magenta" value={config.logo.magentaIntensity} min={0} max={2} step={0.01} onChange={(v) => patchLogo({ magentaIntensity: v })} />
                  <SliderRow label="Intensidad cyan" value={config.logo.cyanIntensity} min={0} max={2} step={0.01} onChange={(v) => patchLogo({ cyanIntensity: v })} />
                  <SliderRow label="Intensidad azul" value={config.logo.blueIntensity} min={0} max={2} step={0.01} onChange={(v) => patchLogo({ blueIntensity: v })} />
                  <SliderRow label="Intensidad morado" value={config.logo.purpleIntensity} min={0} max={2} step={0.01} onChange={(v) => patchLogo({ purpleIntensity: v })} />
                  <SwitchRow label="Núcleo activo" checked={config.logo.nucleusEnabled} onChange={(v) => patchLogo({ nucleusEnabled: v })} />
                  <SliderRow label="Tamaño núcleo" value={config.logo.nucleusSize} min={0.2} max={2} step={0.01} onChange={(v) => patchLogo({ nucleusSize: v })} />
                  <SliderRow label="Brillo núcleo" value={config.logo.nucleusBrightness} min={0} max={2} step={0.01} onChange={(v) => patchLogo({ nucleusBrightness: v })} />
                  <SliderRow label="Pulso núcleo" value={config.logo.nucleusPulse} min={0} max={2} step={0.01} onChange={(v) => patchLogo({ nucleusPulse: v })} />
                </>
              )}

              {tab === 'shield' && (
                <>
                  <SliderRow label="Grosor hex" value={config.shield.hexThickness} min={0.2} max={2} step={0.01} onChange={(v) => patchShield({ hexThickness: v })} />
                  <SliderRow label="Intensidad escudo" value={config.shield.intensity} min={0} max={2} step={0.01} onChange={(v) => patchShield({ intensity: v })} />
                  <SliderRow label="Brillo nodos" value={config.shield.nodeBrightness} min={0} max={2} step={0.01} onChange={(v) => patchShield({ nodeBrightness: v })} />
                  <SliderRow label="Tamaño nodos" value={config.shield.nodeSize} min={0.2} max={2} step={0.01} onChange={(v) => patchShield({ nodeSize: v })} />
                  <SliderRow label="Fuerza puentes" value={config.shield.bridgeStrength} min={0} max={2} step={0.01} onChange={(v) => patchShield({ bridgeStrength: v })} />
                  <SliderRow label="Intensidad bordes" value={config.shield.edgeIntensity} min={0} max={2} step={0.01} onChange={(v) => patchShield({ edgeIntensity: v })} />
                  <SliderRow label="Profundidad Z" value={config.shield.depthZ} min={0.2} max={2} step={0.01} onChange={(v) => patchShield({ depthZ: v })} />
                  <SliderRow label="Escala escudo" value={config.shield.scale} min={0.2} max={2} step={0.01} onChange={(v) => patchShield({ scale: v })} />
                </>
              )}

              {tab === 'neural' && (
                <>
                  <SliderRow label="Intensidad red" value={config.neural.intensity} min={0} max={2} step={0.01} onChange={(v) => patchNeural({ intensity: v })} />
                  <SliderRow label="Densidad conexiones" value={config.neural.connectionDensity} min={0} max={2} step={0.01} onChange={(v) => patchNeural({ connectionDensity: v })} />
                  <SliderRow label="Brillo conexiones" value={config.neural.connectionBrightness} min={0} max={2} step={0.01} onChange={(v) => patchNeural({ connectionBrightness: v })} />
                  <SliderRow label="Velocidad pulso" value={config.neural.pulseSpeed} min={0} max={2} step={0.01} onChange={(v) => patchNeural({ pulseSpeed: v })} />
                  <SliderRow label="Tamaño hotspots" value={config.neural.hotspotSize} min={0.2} max={2} step={0.01} onChange={(v) => patchNeural({ hotspotSize: v })} />
                  <SliderRow label="Intensidad hotspots" value={config.neural.hotspotIntensity} min={0} max={2} step={0.01} onChange={(v) => patchNeural({ hotspotIntensity: v })} />
                </>
              )}

              {tab === 'validation' && (
                <>
                  <SwitchRow label="Validación activa" checked={config.validation.enabled} onChange={(v) => patchValidation({ enabled: v })} />
                  <ColorRow label="Color" value={config.validation.color} onChange={(v) => patchValidation({ color: v })} />
                  <SliderRow label="Brillo" value={config.validation.brightness} min={0} max={2} step={0.01} onChange={(v) => patchValidation({ brightness: v })} />
                  <SliderRow label="Velocidad" value={config.validation.speed} min={0} max={2} step={0.01} onChange={(v) => patchValidation({ speed: v })} />
                  <SliderRow label="Largo pulso" value={config.validation.pulseLength} min={0} max={2} step={0.01} onChange={(v) => patchValidation({ pulseLength: v })} />
                  <SliderRow label="Frecuencia pulso" value={config.validation.pulseFrequency} min={0} max={2} step={0.01} onChange={(v) => patchValidation({ pulseFrequency: v })} />
                </>
              )}

              {tab === 'flow' && (
                <>
                  <SwitchRow label="Flujo activo" checked={config.flow.enabled} onChange={(v) => patchFlow({ enabled: v })} />
                  <ColorRow label="Color" value={config.flow.color} onChange={(v) => patchFlow({ color: v })} />
                  <SliderRow label="Brillo" value={config.flow.brightness} min={0} max={2} step={0.01} onChange={(v) => patchFlow({ brightness: v })} />
                  <SliderRow label="Velocidad" value={config.flow.speed} min={0} max={2} step={0.01} onChange={(v) => patchFlow({ speed: v })} />
                  <SliderRow label="Longitud trail" value={config.flow.trailLength} min={0} max={2} step={0.01} onChange={(v) => patchFlow({ trailLength: v })} />
                  <SliderRow label="Intensidad trail" value={config.flow.trailIntensity} min={0} max={2} step={0.01} onChange={(v) => patchFlow({ trailIntensity: v })} />
                </>
              )}

              {tab === 'presets' && (
                <>
                  <div className="gpc-preset-grid">
                    {(Object.keys(PRESET_LABELS) as GenesisParticlePresetId[]).map((id) => (
                      <button key={id} type="button" onClick={() => loadGenesisParticlePreset(id)}>
                        {PRESET_LABELS[id]}
                      </button>
                    ))}
                  </div>
                  <div className="gpc-actions">
                    <button type="button" onClick={() => resetGenesisParticleControlConfig()}>
                      Reset Default
                    </button>
                    <button type="button" onClick={refreshCustom}>
                      Refrescar custom
                    </button>
                  </div>
                  <label className="gpc-row gpc-switch">
                    <span className="gpc-label">Guardar preset custom</span>
                    <input
                      type="text"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="Nombre…"
                      style={{
                        gridColumn: '1 / -1',
                        marginTop: 4,
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.3)',
                        color: INK.muted,
                      }}
                    />
                  </label>
                  <div className="gpc-actions">
                    <button
                      type="button"
                      onClick={() => {
                        saveCustomPreset(presetName)
                        refreshCustom()
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                  {customPresets.length > 0 && (
                    <div className="gpc-preset-grid">
                      {customPresets.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => loadCustomPreset(name)}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="gpc-actions">
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(exportGenesisParticleConfigJson())
                      }}
                    >
                      Copiar JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportText(exportGenesisParticleConfigJson())}
                    >
                      Ver JSON
                    </button>
                  </div>
                  <textarea
                    className="gpc-textarea"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Pegar JSON de configuración…"
                  />
                  <div className="gpc-actions">
                    <button
                      type="button"
                      onClick={() => {
                        if (importGenesisParticleConfigJson(importText)) {
                          setConfig(getGenesisParticleControlConfig())
                        }
                      }}
                    >
                      Importar JSON
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
