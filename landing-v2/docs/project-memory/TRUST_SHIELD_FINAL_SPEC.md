# TRUST SHIELD — FINAL SPEC

> Genesis Quantum Trust Shield · Sección 1 (`#trust`)  
> Veredicto: **APPROVED** (Phases 4.3, 4.4, 4.5A, 4.6)

---

## 1. Historial de fases

| Fase | Entregable | Estado |
|------|------------|--------|
| **0** | `TrustShieldLayout.ts` — blueprint geométrico (hex rings, nodes, edges, paths) | ✅ |
| **1** | `TrustShieldGenerator.ts` — posiciones + meta stride 6 | ✅ |
| **2** | `TrustShieldMorph.ts` — scatter, formación 0.9s, ventanas por rol | ✅ |
| **3.6** | `trust-performance.ts` — tiers 1800/1200/600 | ✅ |
| **3.8–3.9** | PNG mask sampling — `GenesisLogoMaskSampler.ts` + pool generado | ✅ |
| **4.0** | `TrustShieldQuantumArchitecture.ts` — bridges, lattice, validation, flow | ✅ |
| **4.2** | Análisis overflow (~2406 diseñado vs 1800 cap) | ✅ Diagnóstico |
| **4.3** | `TrustShieldBudgetRecovery.ts` — normalización, 0 dropped | ✅ **APPROVE** |
| **4.4** | `GenesisStardustEntity.ts` — logo stardust, núcleo, spectral | ✅ **APPROVE** |
| **4.5A** | `trustShieldColorAmplification.ts` — jerarquía color | ✅ **APPROVE** |
| **4.6** | Panel control dev (`Ctrl+Shift+G`) | ✅ Funcional |

**Pendiente opcional (no bloqueante):**

- 4.4.1 — rebalance hex rings
- 4.5B — per-vertex `gl_PointSize` en shader (hoy size simula vía color boost)

---

## 2. Estado actual aprobado

### Comportamiento visible

1. Al entrar en Trust, partículas scatter desde origen orb y forman en **0.9 s** con easing por rol.
2. **Logo Genesis** emerge como constelación densa (88% del slice logo) muestreada del PNG oficial.
3. **Núcleo G** pulsa en la abertura del G (`NUCLEUS_NX = -0.17`, `NUCLEUS_NY = -0.03`).
4. **Escudo hex** triple anillo (inner/mid/outer) con electric blue institucional.
5. **Red neural** cyan conectada por lattice bands logo→hex.
6. **Validación** — pulsos quantum white en loops cerrados.
7. **Flow** — circuitos de energía azul entre nodos.
8. **Aura** — volumetric shell tenue, 35% contraste vs logo.
9. **Bridges** — radiales logo → capas hex.

### Invariantes congelados

- Sin texturas/sprites/SVG runtime para logo.
- `TRUST_FORM_DURATION = 0.9`
- Sampler PNG intacto.
- Budget sum = tier count exacto.
- Morph lerp sección: `0.088`

---

## 3. Geometría

### Constantes espaciales

| Constante | Valor | Uso |
|-----------|-------|-----|
| `TRUST_SHIELD_VISUAL_SCALE` | 2.2 | Escala local WebGL |
| `TRUST_CORE_RADIUS_MULT` | 2.5 | Radio núcleo/logo |
| `TRUST_DEPTH_Z_SCALE` | 1.92 | Separación Z capas hex |
| `TRUST_OUTER_RING_MULT` | 1.12 | Anillo exterior |
| `GENESIS_LOGO_WORLD_RADIUS` | 0.46 × 2.5 = 1.15 | Radio logo en world space |

### Hex rings (radios normalizados)

| Capa | radius | phase | zBias |
|------|--------|-------|-------|
| CORE | 0.13 | 0 | 0.042 |
| HEX_INNER | 0.36 | 0 | 0.032 |
| HEX_MID | 0.68 | π/6 | 0.022 |
| HEX_OUTER | 1.06 × 1.12 | 0 | 0.016 |

### Capas lógicas (`TRUST_LAYER`)

```
CORE(0) → HEX_INNER(1) → HEX_MID(2) → HEX_OUTER(3) →
RADIAL(4) → NEURAL(5) → VALIDATION(6) → FLOW(7)
```

### Path kinds

`HEX_PERIMETER`, `RADIAL`, `NEURAL_EDGE`, `VALIDATION_LOOP`, `FLOW_EDGE`

### Meta stride

6 floats por partícula Trust: rol, slot, params auxiliares (decode en Morph + QuantumArchitecture).

---

## 4. Morph

### Timing

| Parámetro | Valor |
|-----------|-------|
| `TRUST_FORM_DURATION` | **0.9 s** |
| Morph lerp (`sectionParticleStructures`) | **0.088** (~750 ms settle) |
| `groupLerp` | 0.15 |
| `fadeInLerp` | 0.14 |

### Ciclos de pulso (post-formación)

| Sistema | Ciclo (s) |
|---------|-----------|
| Core | 3.5 |
| Neural | 2.2 |
| Validation | 2.4 |
| Flow | 3.6 |
| Aura breath | 4.8 |

### Ventanas de formación por rol (formT 0→1)

| Rol | start | end |
|-----|-------|-----|
| CORE | 0 | 0.22 |
| HEX_INNER | 0.12 | 0.35 |
| HEX_MID | 0.25 | 0.48 |
| HEX_OUTER | 0.38 | 0.58 |
| RADIAL | 0.50 | 0.68 |
| NEURAL | 0.58 | 0.76 |
| FLOW | 0.72 | 0.90 |
| VALIDATION | 0.74 | 0.92 |
| AURA | 0.82 | 1.00 |

Easing: `easeOutCubic`. Interpolación scatter → target por rol con activación escalonada.

### Origin scatter

Partículas parten de posición tipo orb dispersa y convergen a targets del generador. Gate en `ParticleMorphSystem`: `isTrust && trustShieldMeta && trustScatterRef`.

---

## 5. Sampler PNG

### Fuente

- **Archivo:** `public/brand/logo-genesis-mark.png`
- **Dimensiones:** 466 × 460 px
- **Alpha threshold:** 32
- **Pixels visibles:** 60 828
- **Pool count:** 60 828 samples (nx, ny, r, g, b interleaved float32)

### Pipeline

1. `scripts/sample-genesis-logo-mask.py` lee PNG alpha.
2. Genera `lib/trust/genesisLogoMaskPool.generated.ts` (base64 pool).
3. `GenesisLogoMaskSampler.resolveGenesisLogoMaskPosition(poolIndex)` → world XYZ.
4. Z fijo logo: `0.032 × TRUST_SHIELD_VISUAL_SCALE × TRUST_DEPTH_Z_SCALE`

### Regeneración

```bash
npm run gen:logo-mask
```

**Regla:** no editar manualmente el `.generated.ts`.

### Bounds content

- contentWidth/Height: 454 px
- aspectRatio: ~1.013
- Centro escudo: origen (0, 0)

---

## 6. Logo Genesis (Stardust Entity)

### Slice dentro del 65% logo cap

| Sub-cap | Ratio |
|---------|-------|
| MASK (cuerpo PNG) | 88% |
| HALO | 6% |
| FOG (energy fog) | 4% |
| NUCLEUS | 2.2% del logo cap (mín. 8 partículas) |

### Densidad visual relativa

| Zona | Ratio |
|------|-------|
| LOGO_BODY | 3× |
| SHIELD | 1× |
| BACKGROUND | 0.3× |

### Motion logo

- Micro-orbit radius: `0.0032 × S × (0.55 + speed×0.35) × motion`
- Clamp silueta: maxR = `hypot(tx,ty)×1.08 + 0.04×S`
- Spectral cycle: 6.2 s
- Orbit cycle: 4.8 s
- Nucleus cycle: 3.2 s

### Núcleo

- Posición normalizada G opening: (-0.17, -0.03)
- Warm white premium: `[1, 0.96, 0.93]`
- Contraste capa: **120%** vs logo

---

## 7. Neural network

### Arquitectura (`TrustShieldQuantumArchitecture`)

- **Lattice bands:** LOGO_TO_INNER, INNER_TO_MID, MID_TO_OUTER, OUTER_CROWN
- **Bridge layers:** INNER, MID, OUTER (radiales logo → hex)
- **Hotspots:** nodos pulsantes en intersecciones
- **Decode meta:** `decodeNeuralLatticeSlot`, `decodeRadialBridgeSlot`

### Budget mínimo

- **8%** del tier total (`TRUST_BUDGET_NEURAL_MIN_RATIO`)
- Tier high: **144** partículas neural

### Color

- Genesis Cyan `#22D3EE`
- `NEURAL_INTENSITY_BOOST = 1.45`
- Layer contrast: **75%** vs logo

### Pulso

- `TRUST_NEURAL_PULSE_CYCLE = 2.2 s`
- Formación ventana: 0.58 → 0.76

---

## 8. Validation network

### Comportamiento

- Loops cerrados sobre paths `VALIDATION_LOOP`
- Pulsos quantum white viajando por circuito
- `TRUST_VALIDATION_LOOP = 2.4 s`

### Budget

- **5%** mínimo → 90 @ 1800 tier

### Color

- Quantum White `[0.98, 0.99, 1]`
- Layer contrast: **90%**

### Meta decode

`decodeValidationQuantumSlot` — slot, param, phase para posición along path.

---

## 9. Flow system

### Comportamiento

- Edges `FLOW_EDGE` entre nodos energéticos
- Trails con loop `TRUST_FLOW_LOOP = 3.6 s`
- Spectral flow en logo (Phase 4.4) comparte filosofía de corriente

### Budget

- **6%** mínimo → 108 @ 1800 tier

### Color

- Electric Blue / Ion `#3B82F6`
- Layer contrast: **85%**

---

## 10. Aura

### Composición

- `volumetric` (72% del aura min) + `outerAura` (28%)
- Aura min: **3%** tier → ~16 outer + 38 volumetric @ 1800
- Sample functions: `sampleGenesisVolumetricShell`, `sampleTrustVolumetricDeep`

### Visual

- Deep blue `#1E4A8A`
- `AURA_BRIGHTNESS_REDUCE = 0.8`
- Layer contrast: **35%** — debe receder
- Breath cycle: 4.8 s

---

## 11. Particle budgets

### Ratios globales

| Slot | Ratio |
|------|-------|
| Logo (total) | ≤ **65%** |
| Neural | ≥ **8%** |
| Validation | ≥ **5%** |
| Flow | ≥ **6%** |
| Bridges (radial) | ≥ **8%** |
| Aura | ≥ **3%** |

### Allocación tier HIGH (1800) — Phase 4.3 normalizado

| Slot | Count |
|------|-------|
| logoMask | 791 |
| logoHalo | 68 |
| logoFog | 286 |
| logoNucleus | 25 |
| coreVolume | 0 |
| coreRing | 4 |
| secondary | 6 |
| volumetric | 38 |
| hexInner | 27 |
| hexMid | 26 |
| hexOuter | 27 |
| radial | 144 |
| neural | 144 |
| validation | 90 |
| flow | 108 |
| outerAura | 16 |
| **total** | **1800** |

### Tier MEDIUM (1200) / LOW (600)

Ver `TRUST_SHIELD_CURRENT_VALUES.json` → `performanceTiers`.

### Fill order (prioridad generator)

```
logoMask → logoNucleus → logoHalo → logoFog → coreVolume →
coreRing → secondary → hexInner → hexMid → hexOuter →
radial → neural → validation → flow → volumetric → outerAura
```

### Legacy overflow (Phase 4.2 — solo referencia)

`computeLegacyOverflowBudget()` — ~2406 diseñado, dropped en high tier. **No usar en runtime.**

---

## 12. Performance tiers

| Tier | Condición | Count | Buffer morph |
|------|-----------|-------|--------------|
| high | width ≥ 1024 | 1800 | padded 1800 |
| medium | width ≥ 768 | 1200 | padded 1800 |
| low | width < 768 o reduced-motion | 600 | padded 1800 |

- `MORPH_MAX_PARTICLE_COUNT = 1800`
- Partículas extra buffer: posición `(0, -120, 0)` — ocultas
- Point size Trust: **0.039** vs default **0.028**

### Sección config

```typescript
scale: 1.04
density: 0.94
motionIntensity: 0.26
morphLerp: 0.088
```

---

## 13. Panel de control (Phase 4.6)

### Activación

- **Atajo:** `Ctrl+Shift+G`
- **Entorno:** solo `NODE_ENV !== 'production'`
- **Componente:** `components/dev/GenesisParticleControlPanel.tsx`

### Cadena verificada

```
Panel UI
  → patchGenesisParticleControlConfig()
  → GenesisParticleControlStore
  → ParticleMorphSystem useFrame (lee store cada frame)
  → applyTrustDevParticleControls() (solo sectionIndex === 1)
  → geometry.attributes.color.needsUpdate
  → render
```

### Capas editables (`TRUST_CONTROL_LAYER_IDS`)

logoGenesis, nucleusGenesis, shieldInner/Mid/Outer, logoBridges, neural, validation, flow, aura, background

### Sub-sistemas

- **logo:** density, tornasol, nucleus pulse/size
- **shield:** hex thickness, bridges, depthZ
- **neural:** connection density, hotspots
- **validation / flow:** enable, speed, trail/pulse params

### Presets built-in

`default`, `premium`, `intense`, `soft`, `performance`, `mobileSafe`, `cinematic`

### Persistencia

- localStorage: `genesis-particle-control-config`
- Custom presets: `genesis-particle-control-custom-presets`
- Import/export JSON desde panel

### Limitaciones conocidas

- `particleSize` por capa simula vía color boost, no `gl_PointSize` per-vertex
- Transform posición usa multiplicador 0.02 (efecto sutil)
- Solo afecta Trust cuando meta + scatter refs activos

### Diagnóstico dev

```javascript
window.__GENESIS_PARTICLE_DIAG__()
```

---

## 14. Archivos clave

```
lib/trust/
├── TrustShieldLayout.ts
├── TrustShieldGenerator.ts
├── TrustShieldMorph.ts
├── TrustShieldQuantumArchitecture.ts
├── TrustShieldBudgetRecovery.ts
├── TrustShieldColors.ts
├── GenesisLogoLayout.ts
├── GenesisLogoMaskSampler.ts
├── genesisLogoMaskPool.generated.ts
├── GenesisStardustEntity.ts
├── trustShieldConstants.ts      ← HOJA (no circular imports)
├── trustShieldRoles.ts          ← HOJA
├── trustShieldColorAmplification.ts
├── trust-performance.ts
├── GenesisParticleControl*.ts
└── trustShieldParticles.ts

components/webgl/ParticleMorphSystem.tsx
components/dev/GenesisParticleControlPanel.tsx
components/scenes/Scene01_Trust.tsx
```

---

## 15. QA

Screenshots before/after: `docs/qa/phase44/`, `docs/qa/phase45a/`

URLs:

- `http://localhost:3000/#trust`
- Desktop / tablet / mobile capturas en QA folders

Verificación chain: `npx tsx scripts/verify-particle-control-chain.ts`
