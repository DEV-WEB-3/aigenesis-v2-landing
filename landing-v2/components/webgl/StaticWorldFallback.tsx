'use client'

/**
 * Respaldo del canvas WebGL, en CSS puro.
 *
 * NO ES UN RECTÁNGULO VACÍO. La identidad de Genesis está medida: 89–91% de
 * vacío y un 6,5–7,5% de color entrando como emisión desaturada con halo. Ese
 * reparto se puede reproducir con degradados radiales sin una sola línea de
 * WebGL, y el resultado se lee como la misma marca.
 *
 * Un respaldo que abandona la identidad convierte «no tienes 3D» en «esta web
 * está rota». Un respaldo que la conserva convierte lo mismo en «esta web es
 * sobria», y el visitante ni se entera de que le falta algo.
 *
 * Los colores vienen de las variables de marca, no escritos aquí: si la paleta
 * cambia, este respaldo cambia con ella.
 *
 * `prefers-reduced-motion` se respeta apagando la respiración. La animación es
 * lenta y de baja amplitud a propósito — es atmósfera, no movimiento.
 */
export default function StaticWorldFallback() {
  return (
    <div
      aria-hidden="true"
      className="genesis-static-world"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'var(--g-void)',
      }}
    >
      <div className="genesis-static-world__emission genesis-static-world__emission--a" />
      <div className="genesis-static-world__emission genesis-static-world__emission--b" />
      <div className="genesis-static-world__emission genesis-static-world__emission--c" />
      <div className="genesis-static-world__grain" />
    </div>
  )
}
