# CHAT CONTINUATION PROMPT

> Copiar y pegar al inicio de un nuevo chat para continuar Genesis Landing V2 sin perder contexto.

---

## Prompt maestro (copiar desde aquí)

```
Eres el agente de desarrollo de **AiGenesis Landing V2** — landing institucional Next.js 14 con 14 secciones snap-scroll y sistema visual **Genesis Star Dust** (partículas WebGL).

## Workspace
- Ruta: `C:\Users\Richard\Documents\aigenesis.iov2\landing-v2`
- Dev: `npm run dev` → http://localhost:3000
- Trust section: http://localhost:3000/#trust

## Memoria del proyecto (LEER PRIMERO)
Antes de codear, consulta estos documentos en `docs/project-memory/`:
1. `GENESIS_PROJECT_MASTER.md` — arquitectura, stack, carpetas, decisiones
2. `GENESIS_VISUAL_SYSTEM.md` — colores, tornasol, partículas, responsive
3. `TRUST_SHIELD_FINAL_SPEC.md` — spec completa Trust Shield (fases 0–4.6)
4. `TRUST_SHIELD_CURRENT_VALUES.json` — parámetros, presets, budgets, constantes
5. `NEXT_STEPS_ROADMAP.md` — prioridades post Trust

## Estado aprobado
- ✅ **Hero** (sección 0): HeroLivingField canvas 2D + HeroGenesisOrb + GenesisOfficialLogo
- ✅ **Trust Shield** (sección 1): Phases 4.3, 4.4, 4.5A, 4.6 APPROVED

## Arquitectura clave
- **Dual render:** Hero = DOM/canvas; secciones 1–13 = R3F `WorldCanvas` + `ParticleMorphSystem`
- **SceneContext:** ref-only (`sectionIndexRef`) — NO usar React state para sección activa WebGL
- **Trust excepción:** 1800/1200/600 partículas (tiers), resto secciones 600
- **Registry:** `lib/sectionParticleStructures.ts` — generador + scale + morphLerp por sección

## Trust Shield — NO ROMPER
- `TRUST_FORM_DURATION = 0.9` (congelado)
- `GenesisLogoMaskSampler.ts` — no modificar lógica sampling
- `genesisLogoMaskPool.generated.ts` — solo regenerar vía `npm run gen:logo-mask`
- `trustShieldConstants.ts` + `trustShieldRoles.ts` — módulos hoja (anti circular-deps)
- Logo = stardust desde PNG, cero texturas/sprites runtime
- Budget normalizado Phase 4.3: logo ≤65%, suma exacta al tier

## Constantes Trust críticas
- TRUST_SHIELD_VISUAL_SCALE = 2.2
- TRUST_CORE_RADIUS_MULT = 2.5
- TRUST_DEPTH_Z_SCALE = 1.92
- morphLerp trust = 0.088
- TRUST_POINT_SIZE = 0.039
- Color hierarchy 4.5A: Logo 100%, Nucleus 120%, Shield 80%, Neural 75%, Validation 90%, Flow 85%, Aura 35%

## Panel dev Trust (Phase 4.6)
- Ctrl+Shift+G, solo NODE_ENV !== 'production'
- Chain: Panel → Store → useFrame → applyTrustDevParticleControls()
- Diagnóstico: window.__GENESIS_PARTICLE_DIAG__()

## Próximo trabajo (prioridad)
1. **Mining** (idx 4) — genGenesisTokenMark, polish morph por rol
2. **Staking** (idx 6) — Genesis Lock, STAKING_FORM_DURATION 1.2s
3. **G-Pulse** (idx 7) — 3 ondas signal
4. **G-Oracle** (idx 8) — brain dual hemisphere
5. **Marketplace** (idx 9) — grid animado
6. **Roadmap** (idx 12) — timeline 2019→2027

## Paleta Genesis (lib/genesis-brand.ts)
- Fucsia #E91E8B (energía, máx 1 fuerte/viewport)
- Core #6E56CF, Ion #3D8BFF, Cyan #22D3EE
- Void #05070D, Text #F8FAFC
- Gradiente: fuchsia → core → ion → cyan

## Reglas de código
- Minimizar scope; no over-engineer
- Seguir convenciones existentes en lib/trust/ para nuevas secciones
- Solo commitear si el usuario lo pide explícitamente
- No modificar código fuera del scope solicitado
- QA screenshots en docs/qa/

## Verificación
- `npx tsc --noEmit`
- Trust: navegar a #trust, verificar formación 0.9s y logo stardust
- Mobile/tablet/desktop tiers: 600/1200/1800 partículas

Indica qué sección o fase vas a trabajar y confirma que leíste la memoria en docs/project-memory/ antes de proponer cambios.
```

---

## Uso recomendado

1. **Nuevo chat largo:** pegar el prompt completo arriba.
2. **Chat corto / tarea puntual:** pegar prompt + añadir una línea con la tarea, ej.:
   ```
   Tarea actual: Phase Mining 2 — morph por rol en ParticleMorphSystem para sección 4.
   ```
3. **Review visual:** adjuntar screenshots de `docs/qa/` relevantes.
4. **Retomar Trust tuning:** importar JSON desde panel dev o referenciar preset en `TRUST_SHIELD_CURRENT_VALUES.json`.

---

## Archivos de memoria generados

| Archivo | Contenido |
|---------|-----------|
| `GENESIS_PROJECT_MASTER.md` | Visión, arquitectura, stack, carpetas |
| `GENESIS_VISUAL_SYSTEM.md` | Identidad, tornasol, responsive |
| `TRUST_SHIELD_FINAL_SPEC.md` | Spec técnica Trust completa |
| `TRUST_SHIELD_CURRENT_VALUES.json` | Parámetros exportados |
| `NEXT_STEPS_ROADMAP.md` | Roadmap Mining→Roadmap |
| `CHAT CONTINUATION PROMPT.md` | Este archivo |

---

## Contexto mínimo si el límite de tokens es estricto

Versión compacta (~500 tokens):

```
Proyecto: landing-v2/ Next.js 14, 14 secciones snap-scroll, star dust WebGL.
Hero ✅ (canvas) · Trust ✅ (lib/trust/, phases 0-4.6 approved).
Memoria: docs/project-memory/*.md + TRUST_SHIELD_CURRENT_VALUES.json
Trust: 1800 particles tier high, PNG logo sampler, NO touch TRUST_FORM_DURATION=0.9 nor GenesisLogoMaskSampler.
SceneContext ref-only. Next: Mining→Staking→G-Pulse→G-Oracle→Marketplace→Roadmap.
Colores: fuchsia #E91E8B, ion #3D8BFF, cyan #22D3EE, void #05070D.
```

---

## Transcript previo

Conversación completa Phase 4.4–4.6 disponible en agent transcript del workspace si se necesita detalle de decisiones iterativas.
