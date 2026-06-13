#Requires -Version 5.1
<#
.SYNOPSIS
  Repara entorno Next.js dev: libera puerto 3000, limpia caches y arranca dev limpio.

.USAGE
  npm run dev:repair
#>

$ErrorActionPreference = 'Continue'
$Port = 3000
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$DevUrl = "http://localhost:$Port"

function Write-Step([string]$Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok([string]$Message) {
  Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Warn([string]$Message) {
  Write-Host "[!] $Message" -ForegroundColor Yellow
}

function Write-Err([string]$Message) {
  Write-Host "[X] $Message" -ForegroundColor Red
}

function Get-PortProcessIds([int]$LocalPort) {
  $ids = New-Object System.Collections.Generic.HashSet[int]
  try {
    $connections = Get-NetTCPConnection -LocalPort $LocalPort -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
      if ($conn.OwningProcess -and $conn.OwningProcess -gt 0) {
        [void]$ids.Add([int]$conn.OwningProcess)
      }
    }
  } catch {
    # Fallback sin Get-NetTCPConnection (permisos / edición Windows)
    $netstat = netstat -ano | Select-String ":$LocalPort\s"
    foreach ($line in $netstat) {
      if ($line -match '\s+(\d+)\s*$') {
        [void]$ids.Add([int]$Matches[1])
      }
    }
  }
  return @($ids)
}

function Get-NextNodeProcessIds([string]$Root) {
  $ids = New-Object System.Collections.Generic.HashSet[int]

  try {
    $processes = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue
    foreach ($proc in $processes) {
      $cmd = $proc.CommandLine
      if (-not $cmd) { continue }

      $isNext = $cmd -match 'next(\.cmd)?\s+(dev|start)' -or $cmd -match 'npm(\.cmd)?\s+run\s+(dev|start)'
      $inProject = $cmd -match [regex]::Escape($Root)

      if ($isNext -and $inProject) {
        [void]$ids.Add([int]$proc.ProcessId)
      }
    }
  } catch {
    Write-Warn "No se pudo inspeccionar procesos node.exe: $($_.Exception.Message)"
  }

  return @($ids)
}

function Stop-ProcessIds([int[]]$ProcessIds, [string]$Reason) {
  $stopped = @()
  foreach ($processId in ($ProcessIds | Sort-Object -Unique)) {
    if ($processId -le 0) { continue }
    try {
      $proc = Get-Process -Id $processId -ErrorAction Stop
      Stop-Process -Id $processId -Force -ErrorAction Stop
      $stopped += "$($proc.ProcessName) (PID $processId)"
    } catch {
      Write-Warn "No se pudo terminar PID $processId ($Reason): $($_.Exception.Message)"
    }
  }
  return $stopped
}

function Remove-PathSafe([string]$Path, [string]$Label) {
  if (-not (Test-Path -LiteralPath $Path)) {
    Write-Warn "$Label no encontrado: $Path"
    return $false
  }
  try {
    Remove-Item -LiteralPath $Path -Recurse -Force -ErrorAction Stop
    Write-Ok "$Label borrado: $Path"
    return $true
  } catch {
    Write-Err "No se pudo borrar $Label ($Path): $($_.Exception.Message)"
    return $false
  }
}

Set-Location -LiteralPath $ProjectRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  NEXT.JS DEV AUTO REPAIR" -ForegroundColor Magenta
Write-Host "  Proyecto: $ProjectRoot" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# 1. Detectar y liberar puerto 3000
Write-Step "Detectando procesos en puerto $Port..."
$portPids = Get-PortProcessIds -LocalPort $Port
if ($portPids.Count -gt 0) {
  Write-Host "   PIDs en puerto $Port : $($portPids -join ', ')"
} else {
  Write-Host "   Puerto $Port libre."
}

# 2. Matar Node/Next relacionados (evita mezcla next start + next dev)
Write-Step "Deteniendo procesos Node/Next del proyecto..."
$nextPids = Get-NextNodeProcessIds -Root $ProjectRoot
$allPids = @($portPids + $nextPids | Sort-Object -Unique)

if ($allPids.Count -eq 0) {
  Write-Ok "No hay procesos Node/Next activos que requieran cierre."
} else {
  $killed = Stop-ProcessIds -ProcessIds $allPids -Reason "liberar puerto / limpiar next"
  if ($killed.Count -gt 0) {
    Write-Ok "Procesos eliminados: $($killed -join '; ')"
  }
  Start-Sleep -Seconds 1

  $remaining = Get-PortProcessIds -LocalPort $Port
  if ($remaining.Count -eq 0) {
    Write-Ok "Puerto $Port liberado."
  } else {
    Write-Warn "Puerto $Port aun ocupado por: $($remaining -join ', ')"
  }
}

# 3. Validar / limpiar estado híbrido build+dev (causa raíz de 404 en chunks)
Write-Step "Validando entorno dev (ensure-dev-next)..."
node (Join-Path $ProjectRoot 'scripts\ensure-dev-next.js') --force
if ($LASTEXITCODE -ne 0) {
  Write-Warn "ensure-dev-next reporto problemas (exit $LASTEXITCODE)."
}

# 4. Borrar caches corruptas (redundante si ensure-dev-next ya limpio)
Write-Step "Borrando caches locales..."
$removedNext = Remove-PathSafe -Path (Join-Path $ProjectRoot '.next') -Label '.next'
$removedNmCache = Remove-PathSafe -Path (Join-Path $ProjectRoot 'node_modules\.cache') -Label 'node_modules/.cache'
$removedTurbo = Remove-PathSafe -Path (Join-Path $ProjectRoot '.turbo') -Label '.turbo'

if ($removedNext -or $removedNmCache -or $removedTurbo) {
  Write-Ok "Caches borradas."
} else {
  Write-Warn "No habia caches para borrar (o no se pudieron eliminar)."
}

# 5. Verificar dependencias
Write-Step "Verificando npm install..."
if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot 'node_modules'))) {
  Write-Warn "node_modules ausente — instalando dependencias..."
}

npm install
if ($LASTEXITCODE -ne 0) {
  Write-Err "npm install fallo (exit $LASTEXITCODE). Abortando."
  exit $LASTEXITCODE
}
Write-Ok "Dependencias verificadas (npm install)."

# 6. Verificar cache npm
Write-Step "Verificando cache npm..."
npm cache verify
if ($LASTEXITCODE -ne 0) {
  Write-Warn "npm cache verify reporto problemas (exit $LASTEXITCODE). Continuando..."
} else {
  Write-Ok "Cache npm verificada."
}

# 7. Levantar Next dev limpio
Write-Step "Iniciando servidor de desarrollo..."
Write-Host ""
Write-Ok "Servidor iniciado en modo dev (puerto $Port)."
Write-Ok "URL final: $DevUrl"
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor." -ForegroundColor DarkGray
Write-Host ""

npm run dev -- -p $Port
