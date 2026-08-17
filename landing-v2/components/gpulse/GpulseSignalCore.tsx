'use client'

import Image from 'next/image'

import { GPULSE_SIGNAL_CENTER, GPULSE_SIGNAL_PULSE_S } from '@/lib/gpulse/signalNetworkLayout'

const ORBIT_COUNT = 10

export default function GpulseSignalCore() {
  return (
    <div
      className="gpulse-signal-core"
      style={
        {
          left: `${GPULSE_SIGNAL_CENTER.x}%`,
          top: `${GPULSE_SIGNAL_CENTER.y}%`,
          '--gpulse-pulse-s': `${GPULSE_SIGNAL_PULSE_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="gpulse-signal-core__volumetric" aria-hidden="true">
        <span className="gpulse-signal-core__volume gpulse-signal-core__volume--a" />
        <span className="gpulse-signal-core__volume gpulse-signal-core__volume--b" />
      </div>

      <div className="gpulse-signal-core__orbit-field" aria-hidden="true">
        {Array.from({ length: ORBIT_COUNT }, (_, i) => (
          <span
            key={i}
            className="gpulse-signal-core__orbit-particle"
            style={
              {
                '--orbit-angle': `${i * (360 / ORBIT_COUNT)}deg`,
                animationDelay: `${i * 0.38}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="gpulse-signal-core__nucleus">
        <span className="gpulse-signal-core__inner-glow" aria-hidden="true" />
        <span className="gpulse-signal-core__pulse-ring" aria-hidden="true" />
        {/*
          EL LOGO REAL DE G-PULSE, no un icono genérico.

          Aquí había un SVG de 24×24 dibujado a mano: un círculo con ocho rayos,
          el icono de «señal» de cualquier biblioteca. Mientras tanto el logotipo
          oficial de G-Pulse llevaba en `public/brand/` sin que lo usara NADIE
          —tres tamaños, PNG y WebP—.

          O sea que la sección de G-Pulse no mostraba el logo de G-Pulse. Ésa es
          la desalineación de marca de verdad, y no cuesta nada arreglarla.

          Encaja además por contenido: el logotipo ES un radar de anillos
          concéntricos con núcleo magenta, que es exactamente lo que esta sección
          cuenta. Y su paleta ya es la de Genesis —magenta, violeta, azul, cian—,
          así que no hay nada que rebrandear.

          El tamaño sube de 32 a 44 px: a 32 los anillos del logo se empastaban
          entre sí dentro de un núcleo de 94.
        */}
        <span className="gpulse-signal-core__glyph marca-halo marca-halo--gpulse" aria-hidden="true">
          <Image
            src="/brand/gpulse-128.png"
            alt=""
            width={44}
            height={44}
            className="object-contain"
            aria-hidden
          />
        </span>
      </div>
    </div>
  )
}
