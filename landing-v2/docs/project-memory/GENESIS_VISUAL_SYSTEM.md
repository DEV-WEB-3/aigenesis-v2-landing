# GENESIS VISUAL SYSTEM

> Identidad visual unificada — Landing V2 · Fuente: `lib/genesis-brand.ts`, `app/globals.css`

---

## 1. Identidad visual

Genesis se presenta como **tecnología institucional premium**, no estética memecoin/casino. Tres pilares cromáticos:

| Rol | Color | Significado |
|-----|-------|-------------|
| **Fucsia** (`#E91E8B`) | Energía, firma de marca | Máx. 1 elemento fuerte por viewport |
| **Ion / Azul** (`#3D8BFF`) | Tecnología, confianza | Escudos, flujos, UI focus |
| **Cyan** (`#22D3EE`) | Datos, pulso vivo | Neural, validación, acentos WebGL |

Superficies: **void profundo** (`#05070D` / `#02040a`) con capas surface sutiles. Texto principal `#F8FAFC`, secundario mist `#AAB4C8`, ghost `#5C6B82`.

---

## 2. Filosofía Genesis

### Star Dust, no imagen plana

El producto se comunica mediante **constelaciones vivas** — partículas que forman símbolos (logo G, escudo hex, candado, cerebro) y respiran con motion orgánico. Nunca clipart; siempre energía cuantificable.

### Tornasol como ADN

El gradiente horizontal oficial recorre el espectro Genesis:

```
Fucsia (#E91E8B) → Core (#6E56CF) → Ion (#3D8BFF) → Cyan (#22D3EE)
```

En WebGL, `genesisColorAtX(nx)` asigna fucsia / core / ion según posición normalizada. El logo Trust aplica **spectral flow** cíclico sobre partículas muestreadas del PNG (Phase 4.4).

### Restricción de fucsia (Design Bible)

**Permitido:** logo, palabra clave hero, orb glow, G-Pulse, G-Oracle, CTA final, highlights marketplace, energía WebGL focal.

**Prohibido:** fondos grandes, todos los botones, body text, cards completas, sombras exageradas.

### Profundidad Z institucional

Capas hex del Trust Shield usan `TRUST_DEPTH_Z_SCALE = 1.92` para separación frontal sin caos. Aura y fondo **receden** (35% contraste vs logo).

---

## 3. Colores oficiales

### CSS variables (`:root`)

```css
--genesis-void: #02040a;
--genesis-base: #080a14;
--genesis-surface: #0f111c;
--genesis-text: #f8fafc;
--genesis-fuchsia: #e91e8b;
--genesis-fuchsia-soft: #ff4fb8;
--genesis-core: #6e56cf;
--genesis-ion: #3d8bff;
--genesis-cyan: #22d3ee;
--genesis-pulse: #5b6cff;
--genesis-mist: #aab4c8;
--genesis-ghost: #5c6b82;
```

### Paleta TypeScript (`GENESIS_COLORS`)

| Token | Hex |
|-------|-----|
| void | `#05070D` |
| base | `#080A14` |
| surface | `#0F111C` |
| text | `#F8FAFC` |
| fuchsia | `#E91E8B` |
| fuchsiaSoft | `#FF4FB8` |
| core | `#6E56CF` |
| ion | `#3D8BFF` |
| cyan | `#22D3EE` |
| pulse | `#5B6CFF` |

### RGB normalizado WebGL (`GENESIS_RGB_NORM`)

Usado en generadores de partículas y shaders. Incluye `success` para estados positivos.

### Gradientes

- **`--gradient-genesis-strong`** — Botones CTA, acentos fuertes.
- **`--gradient-genesis-button`** — Mismo espectro, uso interactivo.

### Colores Trust Shield (Phase 4.5A)

| Capa | RGB aprox | Contraste vs Logo |
|------|-----------|-------------------|
| Logo / tornasol | PNG sample + spectral | 100% |
| Núcleo G | `#E91E8B` + warm white `[1, 0.96, 0.93]` | 120% |
| Escudo hex | Electric Blue `#3B82F6` | 80% |
| Neural | Genesis Cyan `#22D3EE` | 75% |
| Validación | Quantum White `#F8FBFF` | 90% |
| Flow | Ion Blue `#3B82F6` | 85% |
| Aura | Deep `#1E4A8A` | 35% |

---

## 4. Comportamiento de partículas

### Motion global

- **Scatter → Form:** al entrar en sección, partículas parten de posición dispersa (orb origin) y lerp hacia targets del generador.
- **Morph lerp default:** `0.032`; Trust y mayoría secciones polish: **`0.088`** (~750 ms settle).
- **Group lerp:** `0.15` — anclaje del grupo completo al bias de sección.
- **Fade-in:** `fadeInLerp 0.14` — opacidad progresiva al activar sección.

### Densidad y escala por sección

Registry en `sectionParticleStructures.ts`. Ejemplos:

| Sección | scale | density | motionIntensity |
|---------|-------|---------|-----------------|
| trust | 1.04 | 0.94 | 0.26 |
| staking | 1.56 | 1.15 | 0.20 |
| goracle | 2.26 | 0.92 | 0.38 |
| gpulse | 0.94 | 0.90 | 0.48 |

### Point size

- Global: `DEFAULT_POINT_SIZE = 0.028`
- Trust: `TRUST_POINT_SIZE = 0.039` (mayor legibilidad del logo stardust)

### Trust — micro-orbit logo

Partículas logo: attract + micro-orbit alrededor del target PNG; **nunca salen de la silueta** (`clampToSilhouette`). Ciclos: orbit 4.8s, spectral 6.2s, nucleus 3.2s.

### Hero — canvas 2D

Océano neural independiente: partículas flotantes con conexiones sutiles, densidad alta en CSS (`neural-particle-ocean`). No comparte pipeline R3F.

---

## 5. Sistema tornasol

### Definición

**Tornasol Genesis** = transición cromática continua fucsia-magenta-cyan-violeta-blue aplicada por **posición X normalizada** y **tiempo** (spectral cycle), no por textura.

### Implementación Trust (logo stardust)

1. Pool PNG trae RGB por sample (`genesisLogoMaskPool.generated.ts`).
2. `GenesisStardustEntity` aplica:
   - `LOGO_SATURATION_BOOST = 1.35`
   - `LOGO_LUMINANCE_BOOST = 1.25`
   - Spectral shift sinusoidal (`STARDUST_SPECTRAL_CYCLE = 6.2`)
3. Panel dev expone: `tornasolSaturation`, `magentaIntensity`, `cyanIntensity`, `blueIntensity`, `purpleIntensity`.

### Función de marca

```typescript
genesisColorAtX(nx): 'fuchsia' | 'core' | 'ion'
// nx < 0.32 → fuchsia
// nx > 0.58 → ion
// 0.40–0.52 → core (violeta ecosistema)
```

### Uso en secciones futuras

Mining (ray burst), G-Pulse (3 ondas cyan/purple/magenta), G-Oracle (hemisferios fucsia/violet/cyan) ya referencian espectro tornasol en generadores base.

---

## 6. Jerarquía visual

### Por capa (Trust — referencia maestra)

```
1. Logo Genesis stardust + Núcleo G     ← protagonista (65% budget)
2. Escudo hex (inner/mid/outer)         ← estructura institucional
3. Neural lattice + Radial bridges      ← conectividad
4. Validation pulses + Flow circuits    ← actividad cuántica
5. Aura volumétrica + fondo             ← profundidad, no compite
```

Contraste numérico: ver `TRUST_LAYER_CONTRAST` en `trustShieldColorAmplification.ts`.

### Por viewport (layout)

- **Desktop:** copy izquierda (~40%), star dust derecha (bias x 0.56–0.84 según sección).
- **Mobile:** bias uniforme; staking scale ×0.6 en mobile.
- **Navbar + progress dots:** siempre accesibles; hero sin nav item (showInNav: false).

### Tipografía y UI

- Section headers: `SectionHeader` con gradiente en keyword.
- Cards: surface `#0F111C`, border `--genesis-line` (8% white).
- CTAs: gradient button; hover glow fucsia contenido (`--ui-signature-glow`).

---

## 7. Responsive strategy

### Breakpoints partículas Trust

| Tier | Ancho mínimo | Partículas | Notas |
|------|--------------|------------|-------|
| high | ≥1024px | 1800 | Desktop |
| medium | ≥768px | 1200 | Tablet |
| low | <768px | 600 | Mobile |
| low | cualquiera | 600 | `prefers-reduced-motion: reduce` |

Detección: `detectTrustPerfTier(width)` en `trust-performance.ts`.

### Layout snap-scroll

- 14 secciones `100vh` con snap obligatorio (`useSnapScroll`).
- Hash navigation (`#trust`) con delay 720ms para anchor interno (legal en CTA).

### Presets panel dev

- **`mobileSafe`** — brightness 0.95, pointSize 0.9, opacity 0.7.
- **`performance`** — aura off, neural/flow reducidos.

### Post-processing

Bloom suave; en tiers bajos el budget de partículas ya reduce fill-rate. No hay LOD geométrico separado — el LOD **es el tier count**.

### Imágenes y assets

Logo PNG 466×460px; pool 60 828 puntos visibles (alpha ≥ 32). Aspect ~1.01 (cuadrado).

---

## 8. Referencias visuales cruzadas

| Asset | Uso |
|-------|-----|
| `logo-genesis-mark.png` | Trust sampler, Mining G burst reference |
| `GenesisOfficialLogo` | Hero DOM lockup |
| `GenesisBurstMark` | Marca compacta |
| QA screenshots | `docs/qa/phase44`, `phase45a` |

---

## 9. Anti-patterns (evitar)

- Fucsia como fondo de sección completa.
- Partículas blancas planas sin jerarquía de capa.
- Texturas runtime para logo (viola Phase 4.4).
- Re-renders React en scroll (mata fps).
- Modificar sampler PNG sin regenerar pool.
