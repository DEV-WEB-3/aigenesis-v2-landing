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

          EL TAMAÑO: el logo ES el núcleo, no un glifo dentro de la decoración.

          Medido: a 45 px dentro de un visual de 864 era el 5,2 % del ancho —
          imperceptible. El logotipo del hero, que sí funciona como ancla de
          marca, ocupa el 24,3 % de su ventana. Aquí queda en el 18 % contando
          la escala del núcleo, que es lo que hace que se lea sin competir con
          la red de señales que lo rodea.

          Fuente de 512 y no de 128: a 156 px pintados, una retina pide 312.
        */}
        <span className="gpulse-signal-core__glyph marca-halo marca-halo--gpulse" aria-hidden="true">
          <Image
            src="/brand/gpulse-512.png"
            alt=""
            width={78}
            height={78}
            className="object-contain"
            aria-hidden
          />
        </span>
      </div>
    </div>
  )
}
