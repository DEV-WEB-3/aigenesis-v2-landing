# AiGenesis V2 — Deployment & Workflow

Staging URL: https://landing-v2-rho-three.vercel.app  
Vercel project: `landing-v2`  
Package root: `landing-v2/` (repo root when using a dedicated GitHub repo)

---

## Local development

```bash
cd landing-v2
npm install
npm run dev
```

Open http://localhost:3000

---

## Production build (local)

```bash
npm run build
npm run start   # optional smoke test on :3000
```

Expected routes:

- `/`
- `/legal`
- `/whitepaper`
- `/sitemap.xml`
- `/robots.txt`

---

## Git workflow

### Branch model

| Branch | Purpose |
|---|---|
| `main` | Staging RC / integration. Deploys to Vercel project URL. |
| `feature/*` | Features, fixes, polish. |
| `fix/*` | Bug fixes. |

**No production domain** (`aigenesis.io`) until explicit approval.

### Create a feature branch

```bash
git checkout main
git pull origin main
git checkout -b feature/my-change
```

### Commit conventions

- `feat:` new capability
- `fix:` bug fix
- `chore:` tooling, deps, CI
- `docs:` documentation only

Keep commits focused. Do not mix design refactors with infra changes.

---

## Pull requests & Vercel previews

1. Push branch to GitHub.
2. Open PR → `main`.
3. Vercel creates a **Preview Deployment** automatically (unique URL per PR).
4. Review preview URL in the PR checks.
5. Merge only after checklist below passes.

### Connect GitHub (one-time)

1. Vercel Dashboard → Project `landing-v2` → **Settings** → **Git**
2. Connect repository (suggested name: `aigenesis-v2-landing`)
3. Framework: **Next.js**
4. Root Directory: `.` (if repo is only `landing-v2`)
5. Production Branch: `main` (maps to project alias, not `aigenesis.io`)

CLI deploy (without Git) still works:

```bash
npx vercel deploy          # preview
npx vercel deploy --prod   # updates landing-v2-rho-three.vercel.app
```

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Staging: `https://landing-v2-rho-three.vercel.app`. Production TBD. |

Copy from `.vercel-env.example`. Set in:

**Vercel → Project → Settings → Environment Variables**

Scopes:

- **Production** — stable staging alias
- **Preview** — all preview branches
- **Development** — `vercel dev` / local parity

Never commit `.env`, `.env.local`, or MCP secret files.

---

## Pre-merge checklist

- [ ] `npm run build` passes locally
- [ ] No secrets in diff
- [ ] Logo / OG / favicon unchanged unless intentional
- [ ] WebGL scenes render (Hero orb, particle morph)
- [ ] Navbar desktop + mobile drawer
- [ ] `/legal`, `/whitepaper`, sitemap, robots OK
- [ ] Preview URL reviewed on mobile width
- [ ] No placeholder URLs invented (see `lib/routes.ts` → `PLACEHOLDERS`)

---

## Do not change without approval

- WebGL shaders / particle system architecture
- 14-section narrative order
- Design tokens (fuchsia signature, gradients)
- Custom production domain (`aigenesis.io`, `staging.aigenesis.io`)
- Hardcoded metrics / contract addresses until confirmed

---

## Release tags

```bash
git tag v0.1.0-staging-rc
git tag -l
```

Tags mark staging milestones before production cutover.

---

## Troubleshooting

| Issue | Action |
|---|---|
| Build fails on Vercel | Check build logs; run `npm run build` locally |
| OG image stale on social | Re-scrape in Twitter/LinkedIn debugger; verify `/og-image.png` |
| Preview env missing | Add `NEXT_PUBLIC_SITE_URL` to **Preview** scope in Vercel |
| Git not found (Windows) | Install Git for Windows; restart terminal |

---

## Security

- Next.js 14.x: stay on latest `14.2.x` patch (currently `14.2.35+`)
- Run `npm audit` before releases
- Do not run `npm audit fix --force` without reviewing major bumps
