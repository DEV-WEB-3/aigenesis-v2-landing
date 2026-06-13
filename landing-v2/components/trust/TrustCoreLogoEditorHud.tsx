'use client'

import { useState } from 'react'
import type { TrustCoreLogoLayout } from '@/lib/trust/trustCoreLogoLayoutStore'
import { exportTrustCoreLogoLayoutSnippet } from '@/lib/trust/trustCoreLogoLayoutStore'

interface TrustCoreLogoEditorHudProps {
  layout: TrustCoreLogoLayout
  onChange: (patch: Partial<TrustCoreLogoLayout>) => void
  onReset: () => void
}

export default function TrustCoreLogoEditorHud({
  layout,
  onChange,
  onReset,
}: TrustCoreLogoEditorHudProps) {
  const [copied, setCopied] = useState(false)

  const copySnippet = async () => {
    const snippet = exportTrustCoreLogoLayoutSnippet()
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      console.log('[TrustLogoEditor]', snippet)
    }
  }

  return (
    <div className="trust-logo-editor-hud" role="region" aria-label="Editor logo Genesis">
      <p className="trust-logo-editor-hud__title">Editor logo Genesis</p>
      <p className="trust-logo-editor-hud__hint">
        Arrastra el logo · Rueda = tamaño · Flechas = mover · <kbd>+</kbd>/<kbd>-</kbd> = escala
      </p>

      <label className="trust-logo-editor-hud__field">
        <span>X (px)</span>
        <input
          type="range"
          min={-400}
          max={400}
          step={1}
          value={layout.offsetXPx}
          onChange={(e) => onChange({ offsetXPx: Number(e.target.value) })}
        />
        <input
          type="number"
          value={Math.round(layout.offsetXPx)}
          onChange={(e) => onChange({ offsetXPx: Number(e.target.value) })}
        />
      </label>

      <label className="trust-logo-editor-hud__field">
        <span>Y (px)</span>
        <input
          type="range"
          min={-400}
          max={400}
          step={1}
          value={layout.offsetYPx}
          onChange={(e) => onChange({ offsetYPx: Number(e.target.value) })}
        />
        <input
          type="number"
          value={Math.round(layout.offsetYPx)}
          onChange={(e) => onChange({ offsetYPx: Number(e.target.value) })}
        />
      </label>

      <label className="trust-logo-editor-hud__field">
        <span>Tamaño %</span>
        <input
          type="range"
          min={8}
          max={72}
          step={1}
          value={layout.sizePercent}
          onChange={(e) => onChange({ sizePercent: Number(e.target.value) })}
        />
        <input
          type="number"
          value={Math.round(layout.sizePercent)}
          onChange={(e) => onChange({ sizePercent: Number(e.target.value) })}
        />
      </label>

      <label className="trust-logo-editor-hud__field">
        <span>Máx px</span>
        <input
          type="range"
          min={48}
          max={360}
          step={2}
          value={layout.sizeMaxPx}
          onChange={(e) => onChange({ sizeMaxPx: Number(e.target.value) })}
        />
        <input
          type="number"
          value={Math.round(layout.sizeMaxPx)}
          onChange={(e) => onChange({ sizeMaxPx: Number(e.target.value) })}
        />
      </label>

      <div className="trust-logo-editor-hud__actions">
        <button type="button" className="trust-logo-editor-hud__btn trust-logo-editor-hud__btn--primary" onClick={copySnippet}>
          {copied ? 'Copiado ✓' : 'Copiar layout TS'}
        </button>
        <button type="button" className="trust-logo-editor-hud__btn" onClick={onReset}>
          Restablecer
        </button>
      </div>

      <p className="trust-logo-editor-hud__url">
        URL: <code>?trust-logo-edit=1#trust</code>
      </p>
    </div>
  )
}
