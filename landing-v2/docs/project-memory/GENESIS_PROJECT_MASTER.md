# GENESIS PROJECT MASTER — Landing V2

> Export de memoria del proyecto · Junio 2026  
> Workspace: `landing-v2/` dentro de `aigenesis.iov2`

---

## 1. Visión general

**AiGenesis Landing V2** es una landing page institucional de producto para [aigenesis.io](https://aigenesis.io). Es una SPA de **14 secciones con snap-scroll** que narra el ecosistema Genesis (token AIG, mining, staking, G-Pulse, G-Oracle, marketplace, comunidad, tecnología, roadmap).

La propuesta visual distintiva es **Genesis Star Dust**: campos de partículas WebGL que morph entre formas temáticas por sección, con identidad **tornasol** (fucsia → violeta → ion → cyan) sobre fondo void premium.

**Estado de madurez (jun 2026):**

| Sección | Índice | Estado visual |
|---------|--------|---------------|
| Hero | 0 | ✅ Completo (canvas DOM + orb) |
| Trust Shield | 1 | ✅ Completo (fases 0–4.6 aprobadas) |
| Ecosistema–CTA | 2–13 | Generadores base; pendiente polish por sección |

---

## 2. Arquitectura global

```
┌─────────────────────────────────────────────────────────────┐
│  app/page.tsx — 14 secciones snap-scroll                    │
│  SceneProvider (refs, sin re-render por sección)            │
├─────────────────────────────────────────────────────────────┤
│  Sección 0 (Hero)                                           │
│    HeroSection → HeroLivingField (2D canvas)                │
│                 → HeroGenesisOrb (DOM/CSS + logo oficial)   │
├─────────────────────────────────────────────────────────────┤
│  Secciones 1–13                                             │
│    Scene0X_*.tsx (contenido DOM)                            │
│    WorldCanvas (R3F, dynamic import, SSR off)               │
│      └─ ParticleMorphSystem (morph + motion por sección)    │
│      └─ PostEffects (bloom suave)                           │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de datos WebGL

1. `useSnapScroll` actualiza `sectionIndexRef` en `SceneContext` (ref-only, **no provoca re-render React**).
2. `ParticleMorphSystem` lee `sectionIndexRef.current` cada frame en `useFrame`.
3. `SECTION_PARTICLE_STRUCTURES` define generador, escala, bias, morphLerp por sección.
4. Al cambiar sección: scatter desde posición anterior → lerp hacia targets de la nueva estructura.
5. **Trust (índice 1)** es caso especial: hasta **1800 partículas**, meta stride 6, morph dedicado, control panel dev.

### Dual rendering Hero vs World

| Capa | Tecnología | Motivo |
|------|------------|--------|
| Hero (0) | Canvas 2D + DOM | Performance inicial, orb premium sin coste R3F en primera pantalla |
| Resto (1–13) | Three.js + R3F | Morph unificado, post-processing, budgets adaptativos |

---

## 3. Stack tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | Next.js App Router | 14.2.x |
| UI | React | 18.3 |
| Estilos | Tailwind CSS + CSS vars (`globals.css`) | 3.4 |
| Animación DOM | Framer Motion, GSAP | 11.x / 3.15 |
| WebGL | Three.js + @react-three/fiber | 0.169 / 8.18 |
| PostFX | postprocessing + @react-three/postprocessing | 6.39 |
| Lenguaje | TypeScript | 5.9 |
| Build mask PNG | Python (`scripts/sample-genesis-logo-mask.py`) | — |

**Scripts npm:**

- `npm run dev` — desarrollo local (`http://localhost:3000`)
- `npm run build` — producción
- `npm run gen:logo-mask` — regenerar pool PNG del logo Trust

---

## 4. Estructura de carpetas

```
landing-v2/
├── app/
│   ├── page.tsx              # Orquestador 14 secciones
│   ├── layout.tsx
│   └── globals.css           # Design tokens Genesis
├── components/
│   ├── hero/                 # HeroLivingField, HeroGenesisOrb
│   ├── scenes/               # Scene01_Trust … Scene08_CTA
│   ├── sections/             # HeroSection, EcosystemSection
│   ├── webgl/                # WorldCanvas, ParticleMorphSystem
│   ├── dev/                  # GenesisParticleControlPanel (dev only)
│   ├── brand/                # GenesisOfficialLogo, Wordmark
│   ├── ui/genesis/           # Button, Card, SectionHeader
│   └── layout/               # Navbar, Footer
├── context/
│   └── SceneContext.tsx      # Ref bridge sección activa
├── hooks/
│   └── useSnapScroll.ts
├── lib/
│   ├── routes.ts             # SECTIONS (14 capítulos)
│   ├── genesis-brand.ts      # Paleta oficial única
│   ├── sectionParticleStructures.ts  # Registry morph
│   ├── particleConstants.ts  # PARTICLE_COUNT = 600
│   ├── trust/                # Trust Shield (completo)
│   ├── miningDistributedFlow.ts
│   ├── stakingSecurityShield.ts
│   ├── gpulseSignalWaves.ts
│   ├── goracleGenesisBrain.ts
│   ├── roadmapTimelineFlow.ts
│   └── …
├── public/brand/
│   └── logo-genesis-mark.png # Fuente geométrica logo (no runtime texture)
├── scripts/
│   ├── sample-genesis-logo-mask.py
│   └── verify-particle-control-chain.ts
└── docs/
    ├── qa/                   # Screenshots fases Trust
    └── project-memory/       # Este export
```

---

## 5. Componentes principales

### Hero (sección 0)

- **`HeroLivingField`** — Océano neural en canvas 2D; densidad alta, sin Three.js.
- **`HeroGenesisOrb`** — Núcleo energético + `GenesisOfficialLogo` (burst G + lockup GENESIS).
- **`HeroSection`** — Layout, tagline, CTAs.

### Trust Shield (sección 1)

Pipeline modular en `lib/trust/`:

| Módulo | Responsabilidad |
|--------|-----------------|
| `TrustShieldLayout.ts` | Blueprint geométrico (hex rings, paths, nodes) |
| `GenesisLogoMaskSampler.ts` | Posiciones desde PNG alpha (pool pre-generado) |
| `TrustShieldGenerator.ts` | Posiciones + meta por rol |
| `TrustShieldMorph.ts` | Formación 0.9s, scatter, pulso por capa |
| `TrustShieldQuantumArchitecture.ts` | Neural, validation, flow, bridges |
| `GenesisStardustEntity.ts` | Logo stardust, núcleo G, spectral flow |
| `TrustShieldBudgetRecovery.ts` | Budget normalizado por tier |
| `trustShieldColorAmplification.ts` | Jerarquía color 4.5A |
| `GenesisParticleControl*` | Panel dev Ctrl+Shift+G |

### World WebGL

- **`WorldCanvas`** / **`WorldCanvasInner`** — Canvas R3F fullscreen, z-index detrás del contenido.
- **`ParticleMorphSystem`** — Shader points, morph lerp, motion, Trust meta decode, dev controls apply.
- **`PostEffects`** — Bloom sutil institucional.

### UI institucional

- **`Navbar`** + **`SectionProgressDots`** — Navegación snap + hash (`#trust`, etc.).
- **`components/ui/genesis/*`** — Design system (Button gradient Genesis, Card, StatBlock).

---

## 6. Dependencias críticas

### Runtime

- **Three.js + R3F** — Todo el star dust post-Hero.
- **Framer Motion / GSAP** — Entradas DOM, no bloquean WebGL loop.
- **SceneContext refs** — Evitar re-renders en scroll; crítico para 60fps.

### Trust Shield (no romper)

- `public/brand/logo-genesis-mark.png` — Fuente única geometría logo.
- `genesisLogoMaskPool.generated.ts` — 60 828 samples; regenerar solo vía script Python.
- `trustShieldConstants.ts` + `trustShieldRoles.ts` — **Módulos hoja** (evitar imports circulares).
- `TRUST_FORM_DURATION = 0.9` — Timing formación aprobado.
- `GenesisLogoMaskSampler.ts` — **No modificar lógica de sampling**.

### Enlaces oficiales

- `lib/official-links.ts` — CTAs → `conect.aigenesis.io`, BSCScan, whitepaper PDF.

---

## 7. Decisiones arquitectónicas

### 7.1 Ref-only scene state

`sectionIndexRef` en lugar de React state para la sección activa. El morph system lee la ref cada frame sin desmontar el canvas ni re-renderizar 14 escenas.

### 7.2 Trust como excepción de budget

Resto de secciones: **600 partículas** (`PARTICLE_COUNT`). Trust: **1800 / 1200 / 600** según viewport (`trust-performance.ts`). Buffer morph siempre padded a **1800** (`MORPH_MAX_PARTICLE_COUNT`).

### 7.3 PNG como fuente geométrica, no textura runtime

El logo Genesis en Trust es **constelación de partículas** muestreadas offline del PNG. Cero sprites/SVG/imágenes WebGL en runtime (Phase 4.4).

### 7.4 Budget recovery normalizado (Phase 4.3)

El diseño original (~2406 partidas) excedía el cap de 1800. `TrustShieldBudgetRecovery` garantiza suma exacta al tier con floors para neural/validation/flow/bridges/aura y logo ≤ 65%.

### 7.5 Leaf modules anti-circular-deps

Bug Phase 4.4: `ReferenceError: TRUST_SHIELD_VISUAL_SCALE before initialization`. Solución: extraer constantes y roles a `trustShieldConstants.ts` / `trustShieldRoles.ts`; Generator importa budget directamente de BudgetRecovery.

### 7.6 Color amplification separada de geometría (Phase 4.5A)

Intensidad por capa en `trustShieldColorAmplification.ts` sin tocar morph, budget ni sampler. Jerarquía: Logo 100% → Nucleus 120% → Shield 80% → … → Aura 35%.

### 7.7 Dev control panel aislado (Phase 4.6)

Panel flotante solo `NODE_ENV !== 'production'`. Cadena: Panel → Store → `applyTrustDevParticleControls()` en `useFrame`. No altera generadores ni budget.

### 7.8 Desktop bias columna derecha

Partículas desplazadas ~58–72% viewport en desktop (`DESKTOP_SECTION_BIAS`) para no competir con copy izquierdo. Mobile usa bias uniforme `{ x: 0.22, y: 0.02, z: -0.08 }`.

### 7.9 Hero canvas separado

Primera impresión sin esperar bundle Three.js. Neural ocean 2D + orb DOM mantiene LCP razonable.

---

## 8. Mapa de secciones

| Idx | ID | Componente | Generador partículas |
|-----|-----|------------|---------------------|
| 0 | hero | HeroSection | genSphere (no R3F) |
| 1 | trust | Scene01_Trust | genTrustQuantumShield |
| 2 | ecosistema | EcosystemSection | genEcosystemEnergyFlow |
| 3 | token | Scene02_AigToken | genTokenGravityCore |
| 4 | mining | Scene03_Mining | genGenesisTokenMark |
| 5 | booster | Scene04_Booster | genBoosterAscendingStack |
| 6 | staking | Scene05_Staking | genStakingSecurityShield |
| 7 | gpulse | Scene03_GPulse | genGpulseSignalWaves |
| 8 | goracle | Scene08_GOracle | genGoracleGenesisBrain |
| 9 | marketplace | Scene04_GevyShop | genMarketplaceGrid |
| 10 | comunidad | Scene05_Community | genCommunityConstellation |
| 11 | technology | Scene06_Technology | genTechCircuit |
| 12 | roadmap | Scene07_Roadmap | genRoadmapTimelineFlow |
| 13 | cta | Scene08_CTA | genPortalOrb |

---

## 9. QA y verificación

- Screenshots: `docs/qa/` (phase4, phase43, phase44, phase45a).
- Trust dev URL: `http://localhost:3000/#trust`
- Typecheck: `npx tsc --noEmit`
- Chain panel: `npx tsx scripts/verify-particle-control-chain.ts`
- Diagnóstico runtime: `window.__GENESIS_PARTICLE_DIAG__()` (dev)

---

## 10. Restricciones para futuros chats

**No modificar sin aprobación explícita:**

- `GenesisLogoMaskSampler.ts` (lógica)
- `genesisLogoMaskPool.generated.ts` (solo vía script)
- `TrustShieldMorph.ts` → `TRUST_FORM_DURATION`
- `trustShieldConstants.ts`, `trustShieldRoles.ts` (salvo nueva constante en hoja)

**Veredictos aprobados:** Phase 4.3 (budget), 4.4 (stardust logo), 4.5A (color), 4.6 (panel dev funcional).
