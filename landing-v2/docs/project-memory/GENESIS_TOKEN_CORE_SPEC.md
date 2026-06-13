# Genesis Token Core — Especificación oficial (capas)

**Estado:** Pendiente de implementación (spec aprobada, assets por extraer)  
**Sección:** `#token` — núcleo Genesis (logo orbital)  
**Componente objetivo:** `GenesisTokenCore.tsx`

---

## Objetivo

Usar assets del Genesis Token Core como **componentes individuales limpios**, no como una sola imagen mezclada.

---

## Assets requeridos (9 archivos)

| Archivo | Rol |
|---------|-----|
| `genesis-ambient-glow.png` | Resplandor ambiente (fondo) |
| `genesis-outer-ring.png` | Aro externo |
| `genesis-mid-ring.png` | Aro medio |
| `genesis-inner-ring.png` | Aro interno |
| `genesis-radial-bars.png` | Barras radiales (anillo G) |
| `genesis-center-c.png` | Centro C / núcleo del logo |
| `genesis-sparks.png` | Brillos y destellos |
| `genesis-particles.png` | Partículas |
| `genesis-core-logo.png` | Logo compuesto (referencia / fallback opcional) |

**Ruta de salida:** `public/assets/genesis-token-core/`

---

## Formato

- PNG transparente (obligatorio)
- WebP transparente (optimización, mantener PNG como fallback)
- SVG solo si el glow se mantiene correcto (anillos simples)
- **NO** fondo, **NO** checkerboard, **NO** mezclar todo en un solo PNG

---

## Optimización

- Comprimir cada asset
- Objetivo: **100–250 KB** por archivo (@1x PNG)
- Glow ambiente puede pesar más, pero optimizado
- Versiones **@1x** y **@2x** (+ WebP) si hace falta

---

## React — `GenesisTokenCore.tsx`

Montar por capas con z-index:

| z-index | Capa | Animación |
|---------|------|-----------|
| 1 | ambient glow | breathing light |
| 2 | outer ring | rotación lenta |
| 3 | mid ring | rotación inversa lenta |
| 4 | inner ring | pulso suave |
| 5 | radial bars | — |
| 6 | center C | — |
| 7 | sparks | opacity flicker sutil |
| 8 | particles | — |

**Props:** `layers?: Partial<Record<LayerId, boolean>>` para apagar capas individualmente (validación/debug).

**Integración:** `TokenValueCore.tsx` delega en `GenesisTokenCore` (mantener tamaño/contenedor `#token .token-value-core`).

---

## Validación en `#token`

- [ ] Centro limpio
- [ ] Capas alineadas (mismo centro, mismo viewBox)
- [ ] Peso optimizado
- [ ] Sin bordes visibles
- [ ] Sin fondo gris
- [ ] Sin pixelación
- [ ] Cada asset apagable individualmente

---

## Imagen fuente (sprite sheet)

- **Archivo:** `assets/.../309598a9-ce2e-410e-9207-aae48cd045f5-64ac9115-e26c-465b-8261-4e03ea73994c.png`
- **Tamaño:** 1024×682 px, fondo negro (mejor que checkerboard para extracción)
- **Layout:** 4 columnas × 3 filas (ver labels en imagen)

### Grid aproximado (px)

| Celda | Asset |
|-------|-------|
| (0,0) | genesis-core-logo |
| (1,0) | genesis-inner-ring |
| (2,0) | genesis-mid-ring |
| (3,0) | genesis-outer-ring |
| (0,1) | genesis-radial-bars |
| (1,1) | genesis-sparks |
| (2,1) | genesis-particles |
| (3,1) | genesis-ambient-glow |
| (0,2) | genesis-center-c |

---

## Notas de implementación previa (revertida)

- Intento anterior con checkerboard + extracción automática **no gustó al usuario** — revertido a `GenesisBurstMark` + CSS.
- Próximo intento: usar **sprite con fondo negro**, mejor alineación de capas, ajuste fino de escalas (`center-c`, `sparks`, `particles`).
- **No tocar** sistema orbital alrededor del núcleo salvo que se pida.

---

## Script de extracción (recrear cuando se implemente)

`scripts/extract-genesis-token-core-assets.py` — crop, remove black bg → alpha, trim, square canvas, export PNG/WebP @1x/@2x.
