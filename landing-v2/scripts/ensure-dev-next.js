#!/usr/bin/env node
/**
 * Pre-dev guard: evita arrancar next dev sobre .next de producción (causa raíz de 404 en chunks).
 * Ejecutado automáticamente vía npm lifecycle `predev`.
 */

const { ensureDevNext, detectHybridCorruption, missingCriticalDevAssets, log } = require('./next-dev-env')

const force = process.argv.includes('--force')

const state = detectHybridCorruption()
const missing = missingCriticalDevAssets()

if (state.corrupt || force) {
  log.step('ensure-dev-next: validando entorno de desarrollo...')
  if (missing.length > 0) {
    log.warn(`Chunks dev ausentes: ${missing.join(', ')}`)
  }
  const result = ensureDevNext({ force: force || state.corrupt })
  process.exit(result.cleaned ? 0 : 0)
}

log.ok('ensure-dev-next: .next compatible con next dev')
