#!/usr/bin/env node
/**
 * Supervisa `next dev`, detecta 404 en /_next/static/* y recupera automáticamente.
 *
 * Uso: npm run dev:watch
 */

const { spawn } = require('child_process')
const path = require('path')
const {
  PROJECT_ROOT,
  DEFAULT_PORT,
  log,
  ensureDevNext,
  cleanNextCaches,
  writeDevLock,
  removeDevLock,
  readDevLock,
  isProcessAlive,
  probeCriticalChunks,
  parseStatic404FromLog,
} = require('./next-dev-env')

const PORT = DEFAULT_PORT
const BASE_URL = `http://localhost:${PORT}`
const MAX_CONSECUTIVE_404 = 3
const HEALTH_INTERVAL_MS = 12_000
const RESTART_COOLDOWN_MS = 4_000
const MAX_AUTO_RECOVERIES = 8

let child = null
let consecutive404 = 0
let recoveryCount = 0
let recovering = false
let healthTimer = null
let shuttingDown = false

const isWin = process.platform === 'win32'
const npmCmd = isWin ? 'npm.cmd' : 'npm'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function killProcessTree(pid) {
  if (!pid) return Promise.resolve()
  return new Promise((resolve) => {
    if (isWin) {
      spawn('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' }).on('close', () => resolve())
      return
    }
    try {
      process.kill(-pid, 'SIGTERM')
    } catch {
      try {
        process.kill(pid, 'SIGTERM')
      } catch {
        /* ignore */
      }
    }
    resolve()
  })
}

async function killPortListeners(port) {
  if (!isWin) return
  await new Promise((resolve) => {
    const killer = spawn(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }`,
      ],
      { stdio: 'ignore' }
    )
    killer.on('close', () => resolve())
  })
}

async function stopChild() {
  if (!child || !child.pid) return
  const pid = child.pid
  child.removeAllListeners()
  await killProcessTree(pid)
  child = null
}

function onStatic404(url) {
  consecutive404 += 1
  log.warn(`404 chunk (${consecutive404}/${MAX_CONSECUTIVE_404}): ${url || '/_next/static/*'}`)
  if (consecutive404 >= MAX_CONSECUTIVE_404 && !recovering) {
    void triggerRecovery('consecutive-404-threshold')
  }
}

function handleDevOutput(chunk) {
  const text = chunk.toString()
  process.stdout.write(text)

  for (const line of text.split(/\r?\n/)) {
    if (!line.includes('/_next/static/')) continue
    if (/\b404\b/.test(line)) {
      onStatic404(parseStatic404FromLog(line))
    } else if (/\b200\b/.test(line)) {
      consecutive404 = 0
    }
  }
}

async function waitForServerReady(timeoutMs = 90_000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    try {
      const probe = await probeCriticalChunks(BASE_URL)
      if (probe.checked > 0 && probe.ok) return true
      if (probe.failures.length === 0 && probe.checked === 0) {
        // server up but still compiling
      }
    } catch {
      /* retry */
    }
    await sleep(1500)
  }
  return false
}

async function triggerRecovery(reason) {
  if (recovering || shuttingDown) return
  if (recoveryCount >= MAX_AUTO_RECOVERIES) {
    log.err(`Límite de auto-recuperaciones alcanzado (${MAX_AUTO_RECOVERIES}). Detén procesos manualmente.`)
    return
  }

  recovering = true
  recoveryCount += 1
  consecutive404 = 0

  log.step(`AUTO-RECOVERY #${recoveryCount} (${reason})`)
  log.warn('Causa: .next híbrido o chunks dev desincronizados (build + dev / reinicio incompleto)')

  if (healthTimer) {
    clearInterval(healthTimer)
    healthTimer = null
  }

  await stopChild()
  await killPortListeners(PORT)
  await sleep(500)

  cleanNextCaches()
  log.ok('Caches limpiadas — reiniciando next dev...')

  await sleep(RESTART_COOLDOWN_MS)
  await startDevServer({ skipEnsure: true })

  const ready = await waitForServerReady()
  if (ready) {
    log.ok('Chunks dev verificados (HTTP 200)')
    log.ok(`Servidor recuperado: ${BASE_URL}`)
  } else {
    log.warn('Servidor reiniciado pero chunks aún no responden 200 — el watcher seguirá monitoreando')
  }

  recovering = false
}

async function startDevServer({ skipEnsure = false } = {}) {
  if (!skipEnsure) {
    log.step('Validando entorno antes de iniciar dev...')
    ensureDevNext({ force: false })
  }

  const existingLock = readDevLock()
  if (existingLock?.pid && existingLock.pid !== process.pid && isProcessAlive(existingLock.pid)) {
    log.warn(`Otro watcher/dev activo (PID ${existingLock.pid}). Terminando...`)
    await killProcessTree(existingLock.pid)
  }

  await killPortListeners(PORT)
  writeDevLock()

  log.step(`Iniciando next dev en puerto ${PORT}...`)

  child = spawn(npmCmd, ['run', 'dev', '--', '-p', String(PORT)], {
    cwd: PROJECT_ROOT,
    env: { ...process.env, NEXT_DEV_WATCHER: '1' },
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: isWin,
  })

  child.stdout.on('data', handleDevOutput)
  child.stderr.on('data', handleDevOutput)

  child.on('exit', (code, signal) => {
    if (shuttingDown) return
    log.warn(`next dev terminó (code=${code ?? 'null'}, signal=${signal ?? 'null'})`)
    if (!recovering) {
      void triggerRecovery('dev-process-exit')
    }
  })
}

function startHealthMonitor() {
  healthTimer = setInterval(async () => {
    if (recovering || shuttingDown || !child) return
    const probe = await probeCriticalChunks(BASE_URL)
    if (!probe.checked) return
    if (probe.ok) {
      consecutive404 = 0
      return
    }
    for (const failure of probe.failures) {
      onStatic404(failure.url)
    }
  }, HEALTH_INTERVAL_MS)
}

async function shutdown() {
  if (shuttingDown) return
  shuttingDown = true
  log.step('Deteniendo watcher...')
  if (healthTimer) clearInterval(healthTimer)
  await stopChild()
  removeDevLock()
  process.exit(0)
}

async function main() {
  console.log('')
  console.log('========================================')
  console.log('  NEXT.JS 404 CHUNK WATCHER')
  console.log(`  Proyecto: ${PROJECT_ROOT}`)
  console.log(`  URL: ${BASE_URL}`)
  console.log('========================================')

  process.on('SIGINT', () => void shutdown())
  process.on('SIGTERM', () => void shutdown())

  await startDevServer()
  startHealthMonitor()

  log.ok('Watcher activo — monitoreando /_next/static/*')
  log.ok(`URL final: ${BASE_URL}`)
  console.log('Presiona Ctrl+C para detener.\n')
}

main().catch((err) => {
  log.err(err.stack || err.message)
  removeDevLock()
  process.exit(1)
})
