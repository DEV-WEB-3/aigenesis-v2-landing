# NEXT STEPS ROADMAP — Genesis Landing V2

> Priorización visual post Trust Shield · Junio 2026

---

## Estado actual

| Sección | Índice | Estado | Notas |
|---------|--------|--------|-------|
| **Hero** | 0 | ✅ **Completo** | Canvas 2D + HeroGenesisOrb + logo oficial |
| **Trust Shield** | 1 | ✅ **Completo** | Phases 0–4.6 aprobadas |
| Ecosistema | 2 | 🟡 Base | Generador `genEcosystemEnergyFlow` |
| Token | 3 | 🟡 Base | `genTokenGravityCore` |
| **Mining** | 4 | 🔴 **Próximo** | Generador existe; sin polish Trust-level |
| Booster | 5 | 🟡 Base | `genBoosterAscendingStack` |
| **Staking** | 6 | 🔴 **Próximo** | Lock geometry avanzada; falta morph dedicado |
| **G-Pulse** | 7 | 🔴 **Próximo** | 3 ondas; motion alto (0.48) |
| **G-Oracle** | 8 | 🔴 **Próximo** | Brain dual hemisphere; scale 2.26 |
| **Marketplace** | 9 | 🔴 **Próximo** | Grid básico |
| Comunidad | 10 | 🟡 Base | Constellation |
| Tech | 11 | 🟡 Base | Circuit |
| **Roadmap** | 12 | 🔴 **Próximo** | Timeline 2019→2027 |
| CTA | 13 | 🟡 Base | Portal orb |

**Leyenda:** ✅ production-ready visual · 🟡 generador funcional, copy/UI ok · 🔴 siguiente ciclo de polish WebGL

---

## Orden de implementación recomendado

```
Mining → Staking → G-Pulse → G-Oracle → Marketplace → Roadmap
```

Rationale: complejidad creciente, reutilización de patrones Trust (meta stride, formación por rol, color hierarchy, tier budgets).

---

## 1. Mining (Sección 4)

### Concepto visual

**Genesis Token Mark** — isotipo G burst radial: núcleo central + arco G + 34 rayos con densidad no uniforme (más arriba/izquierda, como logo oficial). Star dust fucsia/cyan tornasol emanando del centro. Sensación: **energía distribuida**, mining como radiación del token.

### Objetivo

Elevar `miningDistributedFlow.ts` / `genGenesisTokenMark` al nivel Trust:
- Formación escalonada (core → G stroke → rays → tips)
- Meta stride 6 con roles (`MINING_MARK_ROLE`)
- Color desde `GENESIS_RGB_NORM` con jerarquía capa
- Motion: pulsos en ray tips, rotación lenta del corona

### Nivel de complejidad

**Media-Alta** — geometría paramétrica ya definida; falta morph system dedicado en `ParticleMorphSystem` (hoy usa morph genérico).

### Dependencias

- Patrón Trust: `TrustShieldMorph` ventanas por rol
- Referencia PNG: mismo `logo-genesis-mark.png` (geometría, no sampler)
- `sectionParticleStructures`: scale 0.94, motion 0.30
- Hero/Mining coherencia cromática fucsia

### Archivos existentes

- `lib/miningDistributedFlow.ts`
- `components/scenes/Scene03_Mining.tsx`

---

## 2. Staking (Sección 6)

### Concepto visual

**Genesis Lock** — candado futurista premium: shackle + body shell + núcleo energético + sparkles + micro-órbitas + aura. Escala visual `STAKING_LOCK_VISUAL_SCALE = 3`. Sensación: **seguridad, confianza, valor bloqueado**.

### Objetivo

- Formación lenta (`STAKING_FORM_DURATION = 1.2`) — más solemne que Trust
- Roles: SHACKLE, BODY, CORE, SPARKLE, MICRO_ORBIT, AURA
- Pulso núcleo sincronizado con escudo Trust (familia visual)
- Mobile: scale ×0.6 ya aplicado en `buildStructuredTargets`

### Nivel de complejidad

**Alta** — muchos roles, geometría 2D compuesta (rounded rect lock), meta cached.

### Dependencias

- Trust color hierarchy (electric blue shell, fucsia core)
- Meta stride pattern de Trust
- `STAKING_SECTION_INDEX = 6`
- Posible tier budget propio si se supera 600 partículas con detalle

### Archivos existentes

- `lib/stakingSecurityShield.ts` (~515 líneas)
- `components/scenes/Scene05_Staking.tsx`

---

## 3. G-Pulse (Sección 7)

### Concepto visual

**Signal Wave Layers** — tres ondas horizontales (cyan, purple, magenta) fluyendo izquierda→derecha con beams y sparks. Sensación: **pulso de red viva**, comunicación, latido del ecosistema.

### Objetivo

- Loop 8 s (`GPULSE_LOOP_DURATION`)
- Formación rápida 0.6 s
- Motion intensity ya alto (0.48) — afinar sin jitter excesivo
- Sparks en crestas de onda; beams entre capas

### Nivel de complejidad

**Media** — geometría 1D/2D simple (sin PNG sampler); animación temporal dominante.

### Dependencias

- Colores spec: `GPULSE_CYAN`, `GPULSE_PURPLE`, `GPULSE_MAGENTA`
- Tornasol horizontal (coherente con Design Bible — G-Pulse permitido fucsia fuerte)
- `Scene03_GPulse.tsx`

### Archivos existentes

- `lib/gpulseSignalWaves.ts`
- `components/scenes/Scene03_GPulse.tsx`

---

## 4. G-Oracle (Sección 8)

### Concepto visual

**Genesis Brain** — dos hemisferios elipsoidales, surcos (sulci), sinapsis pulsantes, puente corpus callosum, núcleo Genesis central. Escala `BRAIN_SCALE = 2.4`, section scale **2.26** (la más grande). Sensación: **inteligencia, predicción, oracle**.

### Objetivo

- Formación 0.85 s, core pulse 3.5 s (mismo cycle que Trust core)
- Roles: HEMI, SULCUS, LINK, SYNAPSE, CORE, BRIDGE
- Separación cromática hemisferio izq (fucsia/violet) vs der (cyan/blue)
- Sinapsis como validation-like pulses

### Nivel de complejidad

**Alta** — geometría 3D elipsoidal, muchos links, mayor particle demand.

### Dependencias

- Trust neural/validation patterns
- Posible budget tier dedicado (evaluar 900–1200 partículas)
- `Scene08_GOracle.tsx`

### Archivos existentes

- `lib/goracleGenesisBrain.ts`
- `components/scenes/Scene08_GOracle.tsx`

---

## 5. Marketplace (Sección 9)

### Concepto visual

**Grid comercial** — retícula de partículas con nodos activos, flujos entre celdas, highlights fucsia en ofertas destacadas (per Design Bible). Sensación: **intercambio, liquidez, vitrina digital**.

### Objetivo

- Evolucionar `genMarketplaceGrid` de placeholder a grid animado
- Nodos "producto" con pulse; edges de transacción
- Desktop bias x=0.56 (más centrado que otras secciones)

### Nivel de complejidad

**Media** — estructura regular; animación modular por celda.

### Dependencias

- Flow system conceptual de Trust
- Highlight fucsia restringido (1 focal point)
- `Scene04_GevyShop.tsx`

### Archivos existentes

- `lib/particleStructureGenerators.ts` → `genMarketplaceGrid`
- `components/scenes/Scene04_GevyShop.tsx`

---

## 6. Roadmap (Sección 12)

### Concepto visual

**Timeline Flow** — corriente vertical 2019→2027 con spine central, halos por hito, bursts en logros, 7 milestones. Colores milestone: violet → blue → fuchsia → cyan. Sensación: **historia, progreso, visión futura**.

### Objetivo

- Loop 10 s, formación 0.72 s
- Roles: STREAM, SPINE, HALO, BURST, NODE
- Sincronizar con contenido DOM `Scene07_Roadmap.tsx` (años)
- Desktop bias x=0.40 (timeline izquierda, partículas acompañan)

### Nivel de complejidad

**Media-Alta** — path vertical + eventos discretos; narrativa temporal.

### Dependencias

- Validation pulse pattern (bursts)
- Flow stream (corriente vertical)
- `lib/roadmapTimelineFlow.ts`

### Archivos existentes

- `lib/roadmapTimelineFlow.ts`
- `components/scenes/Scene07_Roadmap.tsx`

---

## Patrón de entrega sugerido (por sección)

Replicar ciclo Trust acortado:

1. **Phase 0** — Layout blueprint + roles
2. **Phase 1** — Generator + meta
3. **Phase 2** — Morph + formación
4. **Phase 3** — Performance tier (si aplica)
5. **Phase 4** — Color amplification + QA screenshots
6. **Opcional** — Dev panel layer (solo si iteración larga)

---

## Dependencias transversales

| Dependencia | Secciones afectadas |
|-------------|---------------------|
| `ParticleMorphSystem` section-specific morph | Todas |
| Meta stride 6 convention | Mining, Staking, G-Oracle, Roadmap |
| `trustShieldColorAmplification` pattern | Todas |
| `sectionParticleStructures` tuning | Todas |
| Performance tiers (600 default vs custom) | Staking, G-Oracle |
| QA screenshot pipeline `docs/qa/` | Todas |
| Design Bible fucsia restraint | G-Pulse, Marketplace, CTA |

---

## No prioritario inmediato

- Ecosistema, Token, Booster, Comunidad, Tech, CTA — generadores aceptables para staging
- Phase 4.5B Trust (per-vertex point size)
- Remover logs debug panel (`GenesisParticleControlDiagnostics`)
- Analytics (GA4/Plausible — not implemented)
- Legal page production review

---

## Métricas de éxito por sección

- [ ] Formación reconocible < 1.2 s
- [ ] 60 fps desktop en tier high
- [ ] 45+ fps mobile tier low
- [ ] Coherencia tornasol con Trust/Hero
- [ ] Screenshots QA before/after en `docs/qa/`
- [ ] Sin regresión Trust Shield al integrar morph section-specific
