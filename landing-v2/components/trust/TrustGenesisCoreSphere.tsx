'use client'

import { useCallback, useEffect, useRef } from 'react'
import { TRUST_CORE_PULSE_S } from '@/lib/trust/trustGenesisCoreLayout'
import {
  getTrustCoreLogoLayout,
  patchTrustCoreLogoLayout,
  resetTrustCoreLogoLayout,
} from '@/lib/trust/trustCoreLogoLayoutStore'
import { useTrustCoreLogoEditorMode } from '@/lib/trust/useTrustCoreLogoEditorMode'
import { useTrustCoreLogoLayout } from '@/lib/trust/useTrustCoreLogoLayout'
import TrustCoreLogoEditorHud from '@/components/trust/TrustCoreLogoEditorHud'

const ASSET_BASE = '/assets/token-core'

interface TrustGenesisCoreSphereProps {
  isActive?: boolean
}

/** Trust section — Genesis mark centered in WebGL stardust void. */
export default function TrustGenesisCoreSphere({ isActive = false }: TrustGenesisCoreSphereProps) {
  const layout = useTrustCoreLogoLayout()
  const editorMode = useTrustCoreLogoEditorMode()
  const sphereRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null)

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!editorMode) return
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        baseX: layout.offsetXPx,
        baseY: layout.offsetYPx,
      }
    },
    [editorMode, layout.offsetXPx, layout.offsetYPx]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      patchTrustCoreLogoLayout({
        offsetXPx: dragRef.current.baseX + dx,
        offsetYPx: dragRef.current.baseY + dy,
      })
    },
    []
  )

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    dragRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }, [])

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!editorMode) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -4 : 4
      patchTrustCoreLogoLayout({
        sizeMaxPx: Math.min(360, Math.max(48, layout.sizeMaxPx + delta)),
      })
    },
    [editorMode, layout.sizeMaxPx]
  )

  useEffect(() => {
    if (!editorMode || !isActive) return

    const onKey = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 1
      const l = getTrustCoreLogoLayout()

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        patchTrustCoreLogoLayout({ offsetXPx: l.offsetXPx - step })
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        patchTrustCoreLogoLayout({ offsetXPx: l.offsetXPx + step })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        patchTrustCoreLogoLayout({ offsetYPx: l.offsetYPx - step })
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        patchTrustCoreLogoLayout({ offsetYPx: l.offsetYPx + step })
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        patchTrustCoreLogoLayout({ sizeMaxPx: Math.min(360, l.sizeMaxPx + 4) })
      } else if (e.key === '-') {
        e.preventDefault()
        patchTrustCoreLogoLayout({ sizeMaxPx: Math.max(48, l.sizeMaxPx - 4) })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editorMode, isActive])

  return (
    <>
      <div
        ref={sphereRef}
        className={`trust-genesis-core-sphere trust-genesis-core-sphere--nucleus${editorMode ? ' trust-genesis-core-sphere--editable' : ''}`}
        aria-hidden={!editorMode}
        style={
          {
            '--trust-core-pulse-s': `${TRUST_CORE_PULSE_S}s`,
            '--trust-core-size': `${layout.sizePercent}%`,
            '--trust-core-size-max': `${layout.sizeMaxPx}px`,
            '--trust-core-offset-x': `${layout.offsetXPx}px`,
            '--trust-core-offset-y': `${layout.offsetYPx}px`,
          } as React.CSSProperties
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        {editorMode ? (
          <div className="trust-genesis-core-sphere__editor-ring" aria-hidden="true" />
        ) : null}
        <div className="trust-genesis-core-sphere__logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ASSET_BASE}/genesis-nucleus-mark.png`}
            srcSet={`${ASSET_BASE}/genesis-nucleus-mark.webp 1x, ${ASSET_BASE}/genesis-nucleus-mark@2x.webp 2x`}
            alt=""
            className="trust-genesis-core-sphere__mark"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>

      {editorMode && isActive ? (
        <TrustCoreLogoEditorHud
          layout={layout}
          onChange={patchTrustCoreLogoLayout}
          onReset={resetTrustCoreLogoLayout}
        />
      ) : null}
    </>
  )
}
