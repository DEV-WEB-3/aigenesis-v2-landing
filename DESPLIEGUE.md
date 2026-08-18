# Despliegue

Este repositorio nunca se ha desplegado. Este documento existe para que la
primera vez no haya que averiguar nada.

## Qué es esto

Una aplicación **Next.js 14 (App Router)** que vive en el subdirectorio
`landing-v2/`, no en la raíz. Ese detalle es el que hace fallar el primer
intento si no se sabe.

## Destino: Vercel

No es una preferencia: está decidido en el código y se puede comprobar.

- `@vercel/analytics` y `@vercel/speed-insights` están en las dependencias y
  montados en `app/layout.tsx`.
- `next.config.js` documenta la política de seguridad contando con
  «Analytics servidos desde el propio dominio en Vercel (`/_vercel/...`)».

En local esos dos scripts dan 404 en consola. **No es un fallo**: son rutas que
sólo existen cuando Vercel las sirve.

## Pasos, una sola vez

1. En Vercel: **Add New → Project** → importar `DEV-WEB-3/aigenesis-v2-landing`.

2. **Root Directory: `landing-v2`**

   Es lo único que hay que cambiar, y es lo que se olvida. Vercel busca el
   `package.json` en la raíz del repositorio; aquí está un nivel más abajo. Sin
   esto el despliegue falla antes de instalar nada.

   El resto se detecta solo: framework Next.js, `npm run build`, salida `.next`.

3. **Variables de entorno** — ver `landing-v2/.env.example`. Ninguna bloquea el
   build; `NEXT_PUBLIC_SITE_URL` sí cambia lo que publican el sitemap y los
   metadatos, así que conviene ponerla desde el principio.

4. **Dominio.** Al asignar el definitivo, actualizar `NEXT_PUBLIC_SITE_URL` para
   que coincida. Si no, el sitemap anuncia un dominio y el sitio vive en otro.

A partir de ahí, cada push a `main` despliega producción y cada rama genera su
propia previsualización. No hace falta ningún workflow: `.github/workflows/ci.yml`
sólo verifica tipos, lint y build en los PR.

## Después del primer despliegue

Dos cosas quedaron esperando a que hubiera tráfico real, y las dos están
documentadas en el código:

**La CSP está en modo informe, no bloqueante.** Es deliberado: una política mal
ajustada no avisa, rompe el sitio en silencio y el fallo aparece en el navegador
de un visitante, no en el build. Cuando el panel de informes esté limpio unos
días, se cambia la clave a `Content-Security-Policy` en `next.config.js`.

**Redirigir `aigtoken.io`.** Estaba pendiente de que existiera un destino: el
ancla `#token` no existe en el WordPress actual. Con la landing desplegada ya lo
hay.

## Comprobar antes de desplegar

```
cd landing-v2
npm ci
npm run verify:tempo     # duraciones fuera de la rejilla de movimiento
npx tsc --noEmit         # tipos
npm run build            # el build real
```

Los tres tienen que salir limpios. `verify:tempo` devuelve código 1 si alguien
metió una duración de animación fuera de la escalera del portal — está probado
rompiéndolo, no sólo escrito.

## Reversa

Vercel conserva todos los despliegues. Volver a uno anterior es
**Deployments → el que sea → Promote to Production**, y es instantáneo: no hay
que revertir commits ni reconstruir.
