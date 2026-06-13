#!/usr/bin/env node
/**
 * Auto-heal watcher for Next.js dev chunk 404s.
 * Probes /_next/static/chunks/main-app.js every 10s and recovers on 404.
 *
 * Usage: npm run dev:autoheal
 */

const { spawn } = require('child_process')
const {
  PROJECT_ROOT,
  DEFAULT_PORT,
  cleanNextCaches,
  writeDevLock,
  removeDevLock,
  readDevLock,
  isProcessAlive,
  probeMainAppChunk,
  killProjectNextProcesses,
  enforceSingleNextDevProcess,
  killPortListeners,
  killProcessTreeSync,
  runNpmInstall,
} = require('./next-dev-env')

const PORT = DEFAULT_PORT
const BASE_URL = `http://localhost:${PORT}`
const CHECK_INTERVAL_MS = 10_000
const DEV_START_GRACE_MS = 25_000
const RECOVERY_COOLDOWN_MS = 8_000
const MAX_AUTO_RECOVERIES = 12

const heal = (msg) => console.log(`[AUTOHEAL] ${msg}`)

const isWin = process.platform === 'win32'
const npmCmd = isWin ? 'npm.cmd' : 'npm'

let devChild = null
let healthTimer = null
let recovering = false
let shuttingDown = false
let recoveryCount = 0
let devStartedAt = 0

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function enforceSingleNext() {
  const { kept, killed } = enforceSingleNextDevProcess({ exceptPid: devChild?.pid })
  for (const pid of killed) {
    heal(`Duplicate Next process detected — terminated oldest (PID ${pid})`)
  }
  return kept
}

async function stopDevChild() {
  if (!devChild?.pid) return
  const pid = devChild.pid
  devChild.removeAllListeners()
  killProcessTreeSync(pid)
  devChild = null
}

async function waitForMainApp(timeoutMs = 120_000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    const probe = await probeMainAppChunk(BASE_URL)
    if (probe.ok) return true
    await sleep(2000)
  }
  return false
}

async function runRecovery(reason) {
  if (recovering || shuttingDown) return
  if (recoveryCount >= MAX_AUTO_RECOVERIES) {
    heal(`Recovery limit reached (${MAX_AUTO_RECOVERIES}). Stop duplicate dev servers manually.`)
    return
  }

  recovering = true
  recoveryCount += 1

  heal('Chunk 404 detectado')
  if (reason) heal(`Trigger: ${reason}`)

  if (healthTimer) {
    clearInterval(healthTimer)
    healthTimer = null
  }

  await stopDevChild()
  killProjectNextProcesses()
  enforceSingleNext()
  killPortListeners(PORT)
  await sleep(600)

  heal('Cleaning cache...')
  cleanNextCaches()

  const installed = runNpmInstall()
  if (!installed) {
    heal('npm install failed — retrying dev restart anyway')
  }

  await sleep(RECOVERY_COOLDOWN_MS)

  heal('Restarting Next...')
  await startDevServer({ skipDuplicateCheck: true })

  const ready = await waitForMainApp()
  if (ready) {
    heal('Recovery completed')
  } else {
    heal('Recovery completed (server up — chunks may still be compiling)')
  }

  recovering = false
  startHealthMonitor()
}

function pipeDevOutput(chunk) {
  process.stdout.write(chunk.toString())
}

async function startDevServer({ skipDuplicateCheck = false } = {}) {
  if (!skipDuplicateCheck) {
    enforceSingleNext()
  }

  const lock = readDevLock()
  if (lock?.pid && lock.pid !== process.pid && isProcessAlive(lock.pid)) {
    heal(`Stale lock PID ${lock.pid} — terminating`)
    killProcessTreeSync(lock.pid)
  }

  killPortListeners(PORT)
  writeDevLock()

  devChild = spawn(npmCmd, ['run', 'dev', '--', '-p', String(PORT)], {
    cwd: PROJECT_ROOT,
    env: { ...process.env, NEXT_DEV_AUTOHEAL: '1' },
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
  })

  devStartedAt = Date.now()

  devChild.stdout.on('data', pipeDevOutput)
  devChild.stderr.on('data', pipeDevOutput)

  devChild.on('exit', (code, signal) => {
    if (shuttingDown || recovering) return
    heal(`next dev exited (code=${code ?? 'null'}, signal=${signal ?? 'null'}) — scheduling recovery`)
    void runRecovery('dev-exit')
  })
}

async function healthCheck() {
  if (recovering || shuttingDown || !devChild) return

  enforceSingleNext()

  const uptime = Date.now() - devStartedAt
  if (uptime < DEV_START_GRACE_MS) return

  const probe = await probeMainAppChunk(BASE_URL)
  if (probe.status === 0) return
  if (probe.ok) return

  if (probe.status === 404) {
    await runRecovery(probe.url)
  }
}

function startHealthMonitor() {
  if (healthTimer) clearInterval(healthTimer)
  healthTimer = setInterval(() => {
    void healthCheck()
  }, CHECK_INTERVAL_MS)
}

async function shutdown() {
  if (shuttingDown) return
  shuttingDown = true
  heal('Stopping watcher...')
  if (healthTimer) clearInterval(healthTimer)
  await stopDevChild()
  removeDevLock()
  process.exit(0)
}

async function main() {
  console.log('')
  console.log('========================================')
  console.log('  NEXT.JS AUTOHEAL WATCHER')
  console.log(`  Project: ${PROJECT_ROOT}`)
  console.log(`  Probe:   ${BASE_URL}/_next/static/chunks/main-app.js`)
  console.log(`  Interval: ${CHECK_INTERVAL_MS / 1000}s`)
  console.log('========================================')
  console.log('')

  process.on('SIGINT', () => void shutdown())
  process.on('SIGTERM', () => void shutdown())

  killProjectNextProcesses()
  enforceSingleNext()

  await startDevServer()
  startHealthMonitor()

  heal(`Watching ${BASE_URL}/_next/static/chunks/main-app.js`)
  heal('Press Ctrl+C to stop.\n')
}

main().catch((err) => {
  console.error('[AUTOHEAL] Fatal error:', err.stack || err.message)
  removeDevLock()
  process.exit(1)
})
