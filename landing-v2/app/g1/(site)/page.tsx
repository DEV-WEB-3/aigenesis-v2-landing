import type { Metadata } from 'next'
import { G1Narrative } from '@/components/g1/scenes/G1Narrative'
import { QueEsContent } from '@/components/g1/site/QueEsContent'

export const metadata: Metadata = {
  title: 'G1 — tu comunidad, con herramientas reales',
  description:
    'G1 es la marca de la alianza Génesis × Aitech × TAG: comunidad con herramientas financieras reales (trading, exchange, tarjeta cripto) y la usabilidad del AiG Token. Material informativo.',
}

/**
 * HOME /g1 — la NARRATIVA montada como intro de la página "Qué es G1". Al terminar,
 * la narrativa se funde y el contenido fluye sobre el fondo WebGL persistente. La
 * barra superior (todas las páginas) está presente todo el tiempo; desde acá el
 * usuario elige las otras páginas.
 */
export default function G1Home() {
  return (
    <>
      <G1Narrative />
      <div className="relative z-10">
        <QueEsContent hero={false} />
      </div>
    </>
  )
}
