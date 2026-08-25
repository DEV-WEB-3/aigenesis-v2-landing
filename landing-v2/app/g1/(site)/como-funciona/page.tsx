import type { Metadata } from 'next'
import { ComoFuncionaContent } from '@/components/g1/site/ComoFuncionaContent'

/** Cáscara de servidor: sólo metadatos. Ver `ComoFuncionaContent`. */
export const metadata: Metadata = {
  title: 'Cómo funciona G1',
  description:
    'Cómo se participa en G1: te unes por la comunidad, accedes a las herramientas de la alianza y el AiG Token conecta todo. Material informativo, sin promesas de resultado.',
}

export default function ComoFuncionaPage() {
  return <ComoFuncionaContent />
}
