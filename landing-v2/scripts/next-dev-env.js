/**
 * Shared Next.js dev environment utilities.
 * Root cause: production `npm run build` leaves hashed chunks + BUILD_ID in `.next`,
 * then `next dev` serves HTML referencing dev paths (main-app.js, app/page.js, layout.css)
 * that do not exist → 404 cascade.
 */

const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const PROJECT_ROOT = path.join(__dirname, '..')
const NEXT_DIR = path.join(PROJECT_ROOT, '.next')
const NM_CACHE = path.join(PROJECT_ROOT, 'node_modules', '.cache')
const TURBO_DIR = path.join(PROJECT_ROOT, '.turbo')
const LOCK_FILE = path.join(PROJECT_ROOT, '.next-dev.lock')

const DEFAULT_PORT = parseInt(process.env.PORT || process.env.NEXT_DEV_PORT || '3000', 10)

/** Dev server HTML references these unhashed paths (not production main-app-*.js). */
const CRITICAL_DEV_ASSETS = [
  'static/chunks/main-app.js',
  'static/chunks/app-pages-internals.js',
  'static/chunks/app/page.js',
  'static/css/app/layout.css',
]

const PRODUCTION_MARKERS = ['BUILD_ID', 'export-marker.json', 'prerender-manifest.json']

const STATIC_404_RE =
  /(?:GET|HEAD)\s+(\/_next\/static\/[^\s"']+).*?\s404\b|404\s+.*?(\/_next\/static\/[^\s"']+)/i

const log = {
  step: (msg) => console.log(`\n==> ${msg}`),
  ok: (msg) => console.log(`[OK] ${msg}`),
  warn: (msg) => console.log(`[!] ${msg}`),
  err: (msg) => console.error(`[X] ${msg}`),
}

function exists(relPath) {
  return fs.existsSync(path.join(NEXT_DIR, relPath))
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

function hasProductionChunkHashes() {
  const chunksDir = path.join(NEXT_DIR, 'static', 'chunks')
  if (!fs.existsSync(chunksDir)) return false
  return fs.readdirSync(chunksDir).some((name) => /^main-app-[a-f0-9]+\.js$/.test(name))
}

function missingCriticalDevAssets() {
  if (!fs.existsSync(NEXT_DIR)) return []
  return CRITICAL_DEV_ASSETS.filter((rel) => !exists(rel))
}

/**
 * Detect hybrid .next: production build output + dev server expectations.
 */
function detectHybridCorruption() {
  if (!fs.existsSync(NEXT_DIR)) {
    return { corrupt: false, reason: 'no-next-dir' }
  }

  const productionMarkers = PRODUCTION_MARKERS.filter((m) => exists(m))
  const missing = missingCriticalDevAssets()
  const prodHashes = hasProductionChunkHashes()

  if (productionMarkers.length >= 2 && missing.length >= 2) {
    return {
      corrupt: true,
      reason: 'build-then-dev-hybrid',
      detail:
        `Marcadores de producción (${productionMarkers.join(', ')}) con chunks dev ausentes: ${missing.join(', ')}`,
    }
  }

  if (prodHashes && missing.includes('static/chunks/main-app.js')) {
    return {
      corrupt: true,
      reason: 'hashed-production-chunks-without-dev-main-app',
      detail: 'Existe main-app-<hash>.js de build pero falta static/chunks/main-app.js para dev',
    }
  }

  const routesManifest = readJsonSafe(path.join(NEXT_DIR, 'routes-manifest.json'))
  const buildManifest = readJsonSafe(path.join(NEXT_DIR, 'build-manifest.json'))
  if (
    routesManifest &&
    buildManifest &&
    Array.isArray(buildManifest.devFiles) &&
    buildManifest.devFiles.length === 0 &&
    productionMarkers.includes('BUILD_ID') &&
    missing.length >= 2
  ) {
    return {
      corrupt: true,
      reason: 'production-manifest-empty-devFiles',
      detail: 'build-manifest.json sin devFiles tras build de producción',
    }
  }

  return { corrupt: false, reason: 'ok' }
}

function rmDirSafe(dirPath, label) {
  if (!fs.existsSync(dirPath)) {
    log.warn(`${label} no encontrado`)
    return false
  }
  fs.rmSync(dirPath, { recursive: true, force: true })
  log.ok(`${label} borrado`)
  return true
}

function cleanNextCaches() {
  log.step('Limpiando caches de Next.js...')
  const a = rmDirSafe(NEXT_DIR, '.next')
  const b = rmDirSafe(NM_CACHE, 'node_modules/.cache')
  const c = rmDirSafe(TURBO_DIR, '.turbo')
  return a || b || c
}

function writeDevLock() {
  fs.writeFileSync(
    LOCK_FILE,
    JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), port: DEFAULT_PORT }, null, 2),
    'utf8'
  )
}

function removeDevLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE)
  } catch {
    /* ignore */
  }
}

function readDevLock() {
  if (!fs.existsSync(LOCK_FILE)) return null
  try {
    return JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'))
  } catch {
    return null
  }
}

function isProcessAlive(pid) {
  if (!pid || pid <= 0) return false
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

function httpHead(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http
    const req = lib.request(url, { method: 'HEAD', timeout: 8000 }, (res) => {
      res.resume()
      resolve(res.statusCode || 0)
    })
    req.on('timeout', () => {
      req.destroy()
      resolve(0)
    })
    req.on('error', () => resolve(0))
    req.end()
  })
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    const req = lib.get(url, { timeout: 10000 }, (res) => {
      let data = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => resolve({ status: res.statusCode || 0, body: data }))
    })
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('timeout'))
    })
    req.on('error', reject)
  })
}

function extractStaticAssetUrls(html, origin) {
  const urls = new Set()
  const re = /\/_next\/static\/[^"'\s)]+/g
  let match
  while ((match = re.exec(html)) !== null) {
    const pathname = match[0].split('?')[0]
    urls.add(`${origin}${pathname}`)
  }
  return [...urls]
}

async function probeCriticalChunks(baseUrl = `http://localhost:${DEFAULT_PORT}`) {
  const failures = []
  try {
    const { status, body } = await httpGet(`${baseUrl}/`)
    if (status !== 200) {
      failures.push({ url: `${baseUrl}/`, status })
      return { ok: false, failures, checked: 0 }
    }

    const assets = extractStaticAssetUrls(body, baseUrl.replace(/\/$/, ''))
    const priority = assets.filter(
      (u) =>
        u.includes('/_next/static/chunks/') ||
        u.includes('/_next/static/css/')
    )

    for (const url of priority.slice(0, 12)) {
      const code = await httpHead(url)
      if (code === 404) failures.push({ url, status: 404 })
    }

    return { ok: failures.length === 0, failures, checked: priority.length }
  } catch (err) {
    failures.push({ url: baseUrl, status: 0, error: err.message })
    return { ok: false, failures, checked: 0 }
  }
}

function parseStatic404FromLog(line) {
  const match = line.match(STATIC_404_RE)
  if (!match) return null
  return match[1] || match[2] || null
}

function ensureDevNext({ force = false, quiet = false } = {}) {
  const emit = quiet
    ? { step: () => {}, ok: () => {}, warn: () => {}, err: log.err }
    : log

  const state = detectHybridCorruption()
  if (!state.corrupt && !force) {
    emit.ok(`Entorno dev OK (${state.reason})`)
    return { cleaned: false, state }
  }

  emit.warn(`Estado corrupto detectado: ${state.reason}`)
  if (state.detail) emit.warn(state.detail)
  cleanNextCaches()
  emit.ok('Caches limpiadas — next dev regenerará chunks dev')
  return { cleaned: true, state }
}

async function probeMainAppChunk(baseUrl = `http://localhost:${DEFAULT_PORT}`) {
  const url = `${baseUrl.replace(/\/$/, '')}/_next/static/chunks/main-app.js`
  const status = await httpHead(url)
  return { url, status, ok: status === 200 }
}

function killProcessTreeSync(pid) {
  if (!pid || pid <= 0) return
  const { spawnSync } = require('child_process')
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' })
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
}

function commandLineMatchesProject(cmd) {
  if (!cmd) return false
  const norm = cmd.replace(/\//g, '\\')
  const root = PROJECT_ROOT.replace(/\//g, '\\')
  return norm.toLowerCase().includes(root.toLowerCase())
}

function isWatcherProcess(cmd) {
  return /watch-next-health|fix-next-404-watcher/.test(cmd || '')
}

function isNextDevServer(cmd) {
  if (!cmd || isWatcherProcess(cmd)) return false
  return (
    /next(\.cmd)?["'\\\s]+(dev|start)(\s|$)/i.test(cmd) ||
    (/\\next\\dist\\bin\\next/i.test(cmd) && /\b(dev|start)\b/.test(cmd))
  )
}

function isNpmDevWrapper(cmd) {
  if (!cmd || isWatcherProcess(cmd)) return false
  return /npm(\.cmd)?\s+run\s+(dev|start)\b/i.test(cmd)
}

function listProjectNextProcesses({ scope = 'dev-server' } = {}) {
  const { spawnSync } = require('child_process')
  const results = []

  if (process.platform === 'win32') {
    const rootLit = PROJECT_ROOT.replace(/'/g, "''")
    const ps = [
      "Get-CimInstance Win32_Process -Filter \"Name = 'node.exe'\" -ErrorAction SilentlyContinue |",
      `Where-Object { $_.CommandLine -and ($_.CommandLine -like '*${rootLit}*') } |`,
      "Select-Object ProcessId, @{N='Started';E={$_.CreationDate.ToUniversalTime().ToString('o')}}, CommandLine |",
      'ConvertTo-Json -Compress',
    ].join(' ')
    try {
      const out = spawnSync('powershell', ['-NoProfile', '-Command', ps], {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
      })
      const raw = (out.stdout || '').trim()
      if (!raw) return results
      const parsed = JSON.parse(raw)
      const rows = Array.isArray(parsed) ? parsed : [parsed]
      for (const row of rows) {
        const commandLine = row?.CommandLine || ''
        if (!row?.ProcessId || !commandLineMatchesProject(commandLine)) continue
        const devServer = isNextDevServer(commandLine)
        const npmDev = isNpmDevWrapper(commandLine)
        if (scope === 'dev-server' && !devServer) continue
        if (scope === 'dev-stack' && !devServer && !npmDev) continue
        results.push({
          pid: Number(row.ProcessId),
          started: row.Started || new Date(0).toISOString(),
          commandLine,
        })
      }
    } catch {
      /* ignore */
    }
    return results
  }

  try {
    const out = spawnSync('ps', ['-eo', 'pid,lstart,args'], { encoding: 'utf8' })
    const raw = out.stdout || ''
    for (const line of raw.split('\n').slice(1)) {
      const trimmed = line.trim()
      if (!commandLineMatchesProject(trimmed)) continue
      const devServer = isNextDevServer(trimmed)
      const npmDev = isNpmDevWrapper(trimmed)
      if (scope === 'dev-server' && !devServer) continue
      if (scope === 'dev-stack' && !devServer && !npmDev) continue
      const match = trimmed.match(/^(\d+)\s+(\w{3}\s+\w{3}\s+\d+\s+[\d:]+\s+\d+)\s+(.*)$/)
      if (!match) continue
      results.push({
        pid: Number(match[1]),
        started: match[2],
        commandLine: match[3],
      })
    }
  } catch {
    /* ignore */
  }
  return results
}

function killProjectNextProcesses({ exceptPid, scope = 'dev-stack' } = {}) {
  const killed = []
  for (const proc of listProjectNextProcesses({ scope })) {
    if (exceptPid && proc.pid === exceptPid) continue
    if (proc.pid === process.pid) continue
    killProcessTreeSync(proc.pid)
    killed.push(proc.pid)
  }
  return killed
}

/**
 * Keep a single Next dev server — terminate older duplicates.
 */
function enforceSingleNextDevProcess({ exceptPid } = {}) {
  const procs = listProjectNextProcesses({ scope: 'dev-server' }).filter(
    (p) => p.pid !== process.pid && (!exceptPid || p.pid !== exceptPid)
  )
  if (procs.length <= 1) return { kept: procs[0]?.pid ?? null, killed: [] }

  procs.sort((a, b) => new Date(a.started).getTime() - new Date(b.started).getTime())
  const toKill = procs.slice(0, -1)
  const kept = procs[procs.length - 1]

  for (const proc of toKill) {
    killProcessTreeSync(proc.pid)
  }

  return { kept: kept?.pid ?? null, killed: toKill.map((p) => p.pid) }
}

function killPortListeners(port = DEFAULT_PORT) {
  if (process.platform !== 'win32') return
  const { spawnSync } = require('child_process')
  spawnSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      `Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }`,
    ],
    { stdio: 'ignore' }
  )
}

function runNpmInstall() {
  const { spawnSync } = require('child_process')
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const result = spawnSync(npmCmd, ['install'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  return result.status === 0
}

module.exports = {
  PROJECT_ROOT,
  NEXT_DIR,
  DEFAULT_PORT,
  LOCK_FILE,
  CRITICAL_DEV_ASSETS,
  log,
  detectHybridCorruption,
  missingCriticalDevAssets,
  cleanNextCaches,
  ensureDevNext,
  writeDevLock,
  removeDevLock,
  readDevLock,
  isProcessAlive,
  probeCriticalChunks,
  probeMainAppChunk,
  parseStatic404FromLog,
  httpHead,
  listProjectNextProcesses,
  killProjectNextProcesses,
  enforceSingleNextDevProcess,
  killPortListeners,
  killProcessTreeSync,
  runNpmInstall,
}
