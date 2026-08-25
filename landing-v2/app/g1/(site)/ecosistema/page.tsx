import type { Metadata } from 'next'
import { EcosistemaContent } from '@/components/g1/site/EcosistemaContent'

/**
 * La página es una CÁSCARA DE SERVIDOR: sólo los metadatos.
 *
 * Todo lo que se lee vive en `EcosistemaContent`, que es de cliente porque el
 * sistema de traducción es un contexto de React. `metadata` sólo existe en el
 * servidor, así que las dos cosas no caben en el mismo archivo. Ver el encabezado
 * de ese componente.
 *
 * Los metadatos siguen en español a propósito: los leen los buscadores y las
 * redes ANTES de que exista un idioma elegido. Traducirlos es otro problema
 * —rutas por idioma con `hreflang`— y no se arregla con un diccionario en cliente.
 */
export const metadata: Metadata = {
  title: 'Ecosistema G1 — la trilogía y los productos',
  description:
    'El ecosistema G1: la trilogía de mercado de la alianza (Tag Markets, Bit1, BixCard) y los productos de la comunidad Génesis (G-Pulse, Gevy, AiG Token). Material informativo.',
}

export default function EcosistemaPage() {
  return <EcosistemaContent />
}
