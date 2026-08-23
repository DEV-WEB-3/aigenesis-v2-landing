'use client'

import { useEffect, useState } from 'react'
import { G1 } from '@/lib/design/g1'

/**
 * GLASS MEDIA — "cristal con media": marco glass (borde de marca + brillo diagonal
 * + tinte de marca) con VIDEO real adentro. Los videos son assets de la alianza
 * (Aitech), self-hosteados en /public/g1/media, integrados a nuestra marca. En
 * reduced-motion muestra el póster estático.
 */
export type MediaMotif = 'markets' | 'network' | 'card' | 'community' | 'token' | 'appDemo' | 'about' | 'formacion'

const MEDIA: Record<MediaMotif, { v: string; p: string }> = {
  markets: { v: '/g1/media/trading.mp4', p: '/g1/media/trading.jpg' },
  network: { v: '/g1/media/bit1.mp4', p: '/g1/media/bit1.jpg' },
  card: { v: '/g1/media/bix.mp4', p: '/g1/media/bix.jpg' },
  community: { v: '/g1/media/comunidad.mp4', p: '/g1/media/comunidad.jpg' },
  token: { v: '/g1/media/ecosistema.mp4', p: '/g1/media/ecosistema.jpg' },
  appDemo: { v: '/g1/media/aitech/app/mockup-trading.mp4', p: '/g1/media/aitech/app/bit1-app.jpeg' },
  about: { v: '/g1/media/aitech/about/sobre-nosotros-principal.mp4', p: '/g1/media/aitech/about/ecosistema.jpg' },
  formacion: { v: '/g1/media/formacion.mp4', p: '/g1/media/comunidad.jpg' },
}

export function GlassMedia({ motif, className, ratio = '16 / 9' }: { motif: MediaMotif; className?: string; ratio?: string }) {
  const [reduce, setReduce] = useState(true)
  useEffect(() => {
    setReduce(window.matchMedia?.('(prefers-reduced-motion:reduce)').matches ?? false)
  }, [])
  const m = MEDIA[motif]
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-genesis-void ${className ?? ''}`}
      style={{ aspectRatio: ratio, border: `1px solid ${G1.cyan}26`, boxShadow: `0 20px 50px -30px ${G1.violet}, inset 0 1px 0 0 ${G1.cyan}1f` }}
    >
      {reduce ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.p} alt="" className="h-full w-full object-cover" />
      ) : (
        <video className="h-full w-full object-cover" src={m.v} poster={m.p} autoPlay loop muted playsInline preload="metadata" />
      )}
      {/* tinte de marca sobre el video */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${G1.violet}1f 0%, transparent 40%, ${G1.cyan}14 100%)`, mixBlendMode: 'overlay' }}
      />
      {/* brillo diagonal de cristal */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(120deg, ${G1.cyan}14 0%, transparent 45%, transparent 72%, ${G1.violet}12 100%)` }}
      />
      {/* borde interior de vidrio */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: `inset 0 0 0 1px ${G1.cyan}14` }} />
    </div>
  )
}
