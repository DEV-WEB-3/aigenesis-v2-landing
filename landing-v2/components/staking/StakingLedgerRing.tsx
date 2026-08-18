'use client'

import {
  STAKING_LEDGER_MARKS,
  STAKING_LEDGER_RING,
  STAKING_LEDGER_LAP_S,
  STAKING_LEDGER_ASPECTO,
  STAKING_LEDGER_APLANADO,
} from '@/lib/staking/timeVaultLayout'

/**
 * EL REGISTRO DE LA BOVEDA.
 *
 * Un anillo exterior donde cada evento del ciclo deja una marca que ya no se
 * quita. Se llena una vez —en una vuelta del anillo mas lento— y se queda
 * lleno. No hay reinicio a proposito: un registro que se vacia no registra.
 *
 * Sin JavaScript de animacion. Cada marca es un elemento con su propio retardo
 * y `animation-fill-mode: both`, asi que antes de su turno esta a opacidad 0 y
 * despues se queda grabada para siempre. Todo lo que se anima es `opacity` y
 * `transform`, que el compositor resuelve sin repintar.
 */
export default function StakingLedgerRing() {
  return (
    <div
      className="staking-ledger"
      aria-hidden="true"
      style={
        {
          '--ledger-y': `${STAKING_LEDGER_RING.y}%`,
          '--ledger-rx': `${STAKING_LEDGER_RING.rx}%`,
          // como cadena a proposito: un numero suelto en una propiedad
          // personalizada depende de que React no le anada `px`, y eso es una
          // suposicion que no hace falta hacer
          '--ledger-aspecto': STAKING_LEDGER_ASPECTO.toFixed(4),
          '--ledger-aplanado': STAKING_LEDGER_APLANADO.toFixed(4),
          '--ledger-lap-s': `${STAKING_LEDGER_LAP_S}s`,
        } as React.CSSProperties
      }
    >
      <span className="staking-ledger__track" />

      {/*
        EL CABEZAL — lo que recorre el anillo y va dejando las marcas.

        Cuatro capas, y cada una existe por una razon medida:

          orbit    aplana el cuadrado hasta la elipse. Estatico.
          spin     gira. Va aparte porque `transform` es UNA propiedad: declarar
                   el giro junto al aplanado haria que la animacion sustituyera
                   al aplanado y el cabezal recorreria una circunferencia.
          anchor   CONTRAGIRA. Sin esto el cabezal se ve como una raya: la
                   contraescala de forma se aplicaria antes de rotar, asi que
                   solo corregiria en los extremos del eje mayor. Medido: 15 x
                   2,9 px en vez de 5 x 5.
          head     deshace el aplanado. Al ir despues del contragiro, la
                   correccion cae siempre en el eje correcto.

        El contragiro es `reverse` de la misma animacion: la suma de los dos
        giros es una constante de 180 grados, que sobre un punto simetrico no se
        nota. Misma duracion, asi que no pueden desincronizarse nunca.
      */}
      <span className="staking-ledger__orbit">
        <span className="staking-ledger__spin">
          <span className="staking-ledger__anchor">
            <span className="staking-ledger__head" />
          </span>
        </span>
      </span>

      {STAKING_LEDGER_MARKS.map((marca, i) => (
        <span
          key={i}
          className={`staking-ledger__mark staking-ledger__mark--${marca.tipo}`}
          style={
            {
              left: `${marca.left}%`,
              top: `${marca.top}%`,
              '--mark-color': marca.color,
              animationDelay: `${marca.retardo}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
