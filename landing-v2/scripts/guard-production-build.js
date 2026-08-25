#!/usr/bin/env node
/**
 * prebuild guard — causa raíz de chunks 404:
 * `next dev` activo mientras `next build` sobrescribe `.next` deja un estado híbrido
 * (HTML dev pide main-app.js; disco solo tiene main-app-<hash>.js).
 *
 * Antes de cada build de producción, detiene el stack dev del proyecto.
 */

const {
  log,
  listProjectNextProcesses,
  killProjectNextProcesses,
  killPortListeners,
  DEFAULT_PORT,
} = require('./next-dev-env')

/*
 * En CI no hay stack de desarrollo que detener: el runner arranca limpio y hace
 * `npm ci` + `build`. Buscar procesos ahí no protege de nada y sí puede fallar
 * —este guard rastrea procesos con utilidades de Windows— convirtiendo un
 * detalle de entorno en un build rojo que no dice nada útil.
 *
 * GitHub Actions define `CI=true` por su cuenta; no hay que configurarlo.
 *
 * `VERCEL` va ademas de `CI` a proposito, aunque Vercel define las dos. Este
 * guard rastrea procesos con utilidades de WINDOWS, y la maquina de build de
 * Vercel es Linux: si por lo que sea `CI` no llegara, el prebuild fallaria con
 * un error de comando no encontrado y el despliegue moriria antes de compilar
 * una sola linea. Dos llaves para una puerta que no se puede quedar cerrada.
 */
/*
 * EL DESVÍO LOCAL DEL AULA NO PUEDE ENTRAR EN UN BUILD.
 *
 * `.env.local` puede llevar `NEXT_PUBLIC_AULA_BASE=/media/aula` para ver los
 * videos desde `public/` sin subirlos. Next lee ese archivo TAMBIÉN en `build`, y
 * como el valor se hornea en el bundle, un build hecho en esta máquina publicaría
 * un reproductor apuntando a `/media/aula` —relativo al dominio que sirva la
 * página— cuando los videos viven en `aigenesis.io/media/aula`. En el subdominio
 * G1 esa ruta no existe: reproductor presente y ni un video.
 *
 * No falla nada, y por eso hay que pararlo aquí. CI está a salvo porque
 * `.env.local` no se versiona, pero el build de a mano no.
 */
/*
 * SE LEE EL ARCHIVO, NO `process.env`.
 *
 * Escribí primero `if (process.env.NEXT_PUBLIC_AULA_BASE)` y no habría saltado
 * jamás: este script corre en node pelado y quien carga `.env.local` es Next,
 * después. La variable no existe aquí. Una guarda que no puede fallar es peor que
 * no tenerla, porque además tranquiliza.
 */
if (!process.env.CI && !process.env.VERCEL) {
  const { existsSync, readFileSync } = require('node:fs')
  const { resolve } = require('node:path')
  for (const archivo of ['.env.local', '.env.development.local', '.env']) {
    const ruta = resolve(__dirname, '..', archivo)
    if (!existsSync(ruta)) continue
    const linea = readFileSync(ruta, 'utf8')
      .split(/\r?\n/)
      .find((l) => /^\s*NEXT_PUBLIC_AULA_BASE\s*=/.test(l))
    if (!linea) continue
    log.warn(`guard-production-build: ${archivo} define NEXT_PUBLIC_AULA_BASE`)
    log.warn(`  ${linea.trim()}`)
    log.warn('  Es el desvío LOCAL de la videoteca del Aula y Next lo hornea también en build.')
    log.warn('  El resultado sería un reproductor apuntando a una ruta que en el servidor no existe.')
    log.warn(`  Comenta esa línea en ${archivo} y repite el build.`)
    process.exit(1)
  }
}

if (process.env.CI || process.env.VERCEL) {
  log.ok('guard-production-build: CI o Vercel detectado — sin stack dev que detener')
  process.exit(0)
}

const procs = listProjectNextProcesses({ scope: 'dev-stack' })

if (procs.length === 0) {
  log.ok('guard-production-build: sin next dev activo — build seguro')
  process.exit(0)
}

log.warn(
  `guard-production-build: ${procs.length} proceso(s) dev activo(s) — deteniendo antes del build`
)
for (const proc of procs) {
  log.warn(`  PID ${proc.pid}: ${(proc.commandLine || '').slice(0, 120)}`)
}

const killed = killProjectNextProcesses({ scope: 'dev-stack' })
killPortListeners(DEFAULT_PORT)

if (killed.length > 0) {
  log.ok(`Procesos dev terminados: ${killed.join(', ')}`)
} else {
  log.warn('No se pudieron terminar procesos dev — revisa tasklist manualmente')
}

log.ok('Tras el build, ejecuta npm run dev (predev regenerará .next para desarrollo)')
