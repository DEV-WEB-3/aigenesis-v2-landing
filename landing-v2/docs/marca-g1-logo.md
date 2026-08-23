# Sistema de Marca G1 — hoja técnica del logo

Guía visual completa (premium, con las imágenes): **artefacto**
`https://claude.ai/code/artifact/2a6254f8-bf79-427b-b06d-2b867af4c3f0`

## Assets (en el repo)

| Componente | Archivo | Fondo |
|---|---|---|
| Monograma (el logo) | `public/brand/g1/g1-monogram.png` | alfa transparente |
| Órbitas de cristal | `public/brand/g1/g1-orbits.png` | alfa transparente |
| Nodos de cristal | `public/brand/g1/g1-nodes.png` | oscuro (textura) |
| Biblioteca de efectos | `public/brand/g1/g1-effects.png` | alfa transparente |
| Emblema vectorial (UI/favicon, animable) | `public/brand/g1-mark.svg` · `<G1Mark/>` (`components/g1/brand/G1Mark.tsx`) | alfa |

## Componentes

1. **Monograma “G1”** — núcleo. Geometría FIJA: no deformar, no reinterpretar, no morphing.
2. **Órbitas** — 2–3 elipses de cristal líquido (conexión, movimiento, alcance global). No tapan la lectura.
3. **Nodos** — 3–6 esferas de cristal, tamaños variados (comunidad, energía).
4. **Efectos** — estelas, destellos, glows, micro-partículas. Siempre sutiles.

## Materiales

Black chrome / metal oscuro · chrome pulido · cristal óptico y líquido · glassmorphism multicapa ·
bevels precisos · profundidad 3D · refracción · reflejos y bloom CONTROLADOS · sombras ambientales.

## Paleta (rebrandable, G1)

- Fondo: `alfa` / `#080A14`
- Principal: `#6E56CF` (violeta) · Secundario: `#00F5FF` (cian) · Energía: `#FF8A3D` (ámbar)
- Estado vivo: `#00F5FF` · Reflejo metálico: plata (`#FFFFFF→#AAB4D6`)
- Distribución: **60%** black chrome · **25%** principal · **10%** secundario · **5%** energía

## Variantes

- **Master** (cristal fotorrealista) → hero, splash, OG, publicidad.
- **UI / favicon** (emblema plano SVG, animable) → header, favicon, loaders. Nítido a 16 px.
- **Monocromo** → sello G-TAG, marca de agua, impreso.

## Aire y tamaño mínimo

- Zona de protección ≥ altura del “1”. Las órbitas pueden salirse del recuadro (no cuentan como margen).
- Mín.: master con órbitas ≥ 96 px · emblema UI ≥ 32 px · favicon 16–48 px.

## Colocación por fases

| Lugar | Variante | Efectos | Fase |
|---|---|---|---|
| Header (todas las páginas) | Emblema UI | hover sutil | F1 |
| Favicon / app icon | Monograma chip | — | F1 |
| Sello footer (G-TAG) | Monocromo | — | F1 |
| Hero (inicio / Qué es G1) | Master + órbitas | glow + órbitas girando | F2 |
| Splash / loader | Emblema animado | nodos laten, órbitas | F2 |
| OG / redes | Master s/ black chrome | glow + destello | F2 |
| Reveal de campaña | Master + estelas | estelas + partículas | F3 |
| Marca de agua / merch | Monocromo | — | F3 |

## Reglas

**Sí:** alfa transparente con margen · vista frontal centrada · bordes nítidos · reflejos/bloom controlados · reteñir por submarca.
**No:** deformar geometría/letras · añadir palabras/marcas al símbolo · fuego/humo/explosiones · estética gamer · saturar partículas · abusar del bloom · fondo cuadriculado o watermark.

El prompt de generación con los valores de G1 rellenados está en el artefacto (sección 09).
