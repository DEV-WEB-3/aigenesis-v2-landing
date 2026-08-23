import type { Metadata } from 'next'
import { FaqClient } from '@/components/g1/site/FaqClient'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes — G1',
  description:
    'Preguntas frecuentes sobre G1, la alianza, el AiG Token, G-Pulse y las credenciales. Índice por categorías y búsqueda. Respuestas del corpus verificado. Material informativo.',
}

export default function FaqPage() {
  return <FaqClient />
}
