import type { Metadata } from 'next'
import { QueEsContent } from '@/components/g1/site/QueEsContent'

export const metadata: Metadata = {
  title: 'Qué es G1 — la marca de la alianza',
  description:
    'G1 es la marca de la alianza entre la comunidad Génesis, Aitech y TAG: comunidad con herramientas financieras reales y la usabilidad del AiG Token. Material informativo.',
}

/** /g1/que-es-g1 — el mismo contenido que la home, pero SIN la narrativa (acceso directo por nav). */
export default function QueEsG1Page() {
  return <QueEsContent hero />
}
