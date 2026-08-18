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
