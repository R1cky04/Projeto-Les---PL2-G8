param(
  [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

function Test-Command {
  param([string]$Name)
  return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

if (-not (Test-Command "docker")) {
  Write-Error "Docker nao encontrado no PATH. Instala o Docker Desktop e tenta novamente."
}

if (-not (Test-Command "npm")) {
  Write-Error "npm nao encontrado no PATH. Instala o Node.js e tenta novamente."
}

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $repoRoot "frontend"

Write-Host "[1/4] A subir DB e backend via Docker Compose..." -ForegroundColor Cyan
Push-Location $repoRoot
try {
  docker compose up -d db backend
}
finally {
  Pop-Location
}

Write-Host "[2/4] A aguardar backend ficar disponivel em http://localhost:3000 ..." -ForegroundColor Cyan
$maxAttempts = 60
for ($i = 1; $i -le $maxAttempts; $i++) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:3000" -TimeoutSec 2
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
      break
    }
  }
  catch {
    Start-Sleep -Seconds 2
  }

  if ($i -eq $maxAttempts) {
    Write-Warning "Backend ainda nao respondeu. Vou continuar mesmo assim; verifica os logs com: docker compose logs -f backend"
  }
}

if (-not $SkipInstall) {
  Write-Host "[3/4] A garantir dependencias do frontend..." -ForegroundColor Cyan
  Push-Location $frontendDir
  try {
    npm install
  }
  finally {
    Pop-Location
  }
}
else {
  Write-Host "[3/4] SkipInstall ativo: a saltar npm install no frontend." -ForegroundColor Yellow
}

Write-Host "[4/4] A iniciar Electron (frontend + app desktop)..." -ForegroundColor Green
Write-Host "Para parar tudo: fecha este processo e corre 'docker compose stop backend db' na raiz do projeto." -ForegroundColor DarkYellow

Push-Location $frontendDir
try {
  npm run electron:serve
}
finally {
  Pop-Location
}
