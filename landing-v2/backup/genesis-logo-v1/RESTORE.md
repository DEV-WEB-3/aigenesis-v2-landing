# Genesis Logo V1 — Backup (Phase 6.5)

Frozen snapshot of the Trust stardust logo system before the signature rebrand.

## Contents

- `GenesisStardustEntity.ts` — color, motion, nucleus pipeline
- `GenesisStardustLogoOnly.ts` — particle budget / PNG mask layout
- `GenesisLogoMaskSampler.ts` — PNG pool sampler
- `trustShieldParticles.ts` — barrel exports
- `assets/` — logo PNG/SVG sources

## Instant restore

Set in `.env.local`:

```
USE_GENESIS_LOGO_V1=true
```

Restart dev server. No code loss — V1 lives in `lib/trust/v1/GenesisStardustEntityV1.ts`.

## Use new signature (V2)

Remove `USE_GENESIS_LOGO_V1` or set:

```
USE_GENESIS_LOGO_V2=true
```

Default (no flag) = **V2 premium signature**.
