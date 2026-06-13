# AiGenesis V2 — Release Checklist

## Antes de staging

- [ ] `npm run build` exitoso sin errores TS
- [ ] `NEXT_PUBLIC_SITE_URL` configurado en Vercel (ver `.vercel-env.example`)
- [ ] OG image accesible: `/og-image.png` y `/og-image.svg`
- [ ] Favicon accesible: `/favicon.svg`
- [ ] `/sitemap.xml` generado y válido
- [ ] `/robots.txt` generado
- [ ] Páginas `/legal` y `/whitepaper` cargan y son scrollables
- [ ] Navegación snap-scroll en `/` intacta
- [ ] WebGL morphs (14 secciones) verificados manualmente
- [ ] Mobile drawer + skip link probados
- [ ] **PENDING:** URL registro (`ROUTES.REGISTER` → `#cta`)
- [ ] **PENDING:** URL login (`ROUTES.LOGIN` → `#cta`)
- [ ] **PENDING:** URL contacto dedicada
- [ ] **PENDING:** BSCScan contract address real
- [ ] **PENDING:** Whitepaper PDF oficial
- [ ] **PENDING:** Analytics (GA4 / Plausible / Vercel Analytics)
- [ ] Browser test: Chrome, Safari, Firefox, mobile
- [ ] Revisar `lib/routes.ts` → `PLACEHOLDERS` registry

## Antes de producción

- [ ] Dominio final `https://aigenesis.io` (o confirmado)
- [ ] Env vars producción en Vercel
- [ ] Legal review del copy en `/legal`
- [ ] Compliance review (disclaimers, métricas, CTAs)
- [ ] Lighthouse: Performance ≥ 80, Accessibility ≥ 90
- [ ] SEO preview: Google Rich Results / OG debugger
- [ ] Social preview: Twitter/X, LinkedIn, Telegram
- [ ] Confirmar URLs sociales (Twitter, Telegram, Discord)
- [ ] Confirmar métricas hardcodeadas en scenes
- [ ] Focus trap drawer (opcional — documentado como pendiente)
- [ ] `prefers-reduced-motion` validado en dispositivo real
- [ ] Staging sign-off → merge a producción

## Referencia placeholders

Ver registro centralizado: `lib/routes.ts` → `PLACEHOLDERS`
