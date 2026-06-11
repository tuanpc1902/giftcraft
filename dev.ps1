# GiftCraft Studio - local dev launcher
# Usage: .\dev.ps1          (start stack, auto-setup on first run)
#        .\dev.ps1 -Reset   (wipe DB volumes + re-seed)
#        .\dev.ps1 -Down    (stop and remove containers)
#        .\dev.ps1 -Logs    (tail all logs)

param(
    [switch]$Reset,
    [switch]$Down,
    [switch]$Logs
)

$COMPOSE = "docker compose -f infra/docker-compose.yml -p giftcraft"

# -- Stop --------------------------------------------------------------------
if ($Down) {
    Write-Host "Stopping GiftCraft..." -ForegroundColor Yellow
    Invoke-Expression "$COMPOSE down"
    exit 0
}

# -- Logs --------------------------------------------------------------------
if ($Logs) {
    Invoke-Expression "$COMPOSE logs -f"
    exit 0
}

# -- Check Docker is running -------------------------------------------------
try {
    docker info *>$null
} catch {
    Write-Host "ERROR: Docker is not running. Start Docker Desktop first." -ForegroundColor Red
    exit 1
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running. Start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# -- .env check --------------------------------------------------------------
if (-not (Test-Path ".env")) {
    Write-Host ".env not found - copying from .env.example" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# -- Reset: wipe volumes -----------------------------------------------------
if ($Reset) {
    Write-Host "Resetting volumes..." -ForegroundColor Yellow
    Invoke-Expression "$COMPOSE down -v"
    if (Test-Path ".setup-done") { Remove-Item ".setup-done" }
}

# -- Start stack -------------------------------------------------------------
Write-Host ""
Write-Host "Starting GiftCraft stack..." -ForegroundColor Cyan
Invoke-Expression "$COMPOSE up -d --build"

# -- Wait for Laravel --------------------------------------------------------
Write-Host "Waiting for Laravel..." -ForegroundColor Yellow
$attempts = 0
do {
    Start-Sleep -Seconds 3
    $attempts++
    $result = docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan --version 2>$null
} while ((-not $result) -and ($attempts -lt 20))

if ($attempts -ge 20) {
    Write-Host "ERROR: Laravel did not start. Run: .\dev.ps1 -Logs" -ForegroundColor Red
    exit 1
}

# -- First-run setup (detected via marker file) ------------------------------
$isFirstRun = -not (Test-Path ".setup-done")

if ($isFirstRun -or $Reset) {
    Write-Host ""
    Write-Host "First run - setting up database..." -ForegroundColor Cyan

    Write-Host "  [1/4] Running migrations..."
    docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan migrate --force

    Write-Host "  [2/4] Seeding data..."
    docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan db:seed --force

    Write-Host "  [3/4] Indexing products into Meilisearch..."
    docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan scout:import "App\Models\Product"

    Write-Host "  [4/4] Clearing caches..."
    docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan optimize:clear

    New-Item -ItemType File -Path ".setup-done" -Force | Out-Null
    Write-Host "Setup complete." -ForegroundColor Green
} else {
    docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan config:clear 2>$null | Out-Null
    docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan route:clear 2>$null | Out-Null
}

# -- Health check ------------------------------------------------------------
Write-Host ""
Write-Host "Health check..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
try {
    $health = Invoke-RestMethod -Uri "http://localhost/api/health" -TimeoutSec 10
    $color = if ($health.status -eq "ok") { "Green" } else { "Yellow" }
    Write-Host "  Status: $($health.status)" -ForegroundColor $color
    foreach ($svc in $health.services.PSObject.Properties) {
        $icon = if ($svc.Value -eq "ok") { "v" } else { "!" }
        Write-Host "  [$icon] $($svc.Name): $($svc.Value)"
    }
} catch {
    Write-Host "  Health endpoint not yet reachable - stack may still be warming up." -ForegroundColor Yellow
}

# -- Done --------------------------------------------------------------------
Write-Host ""
Write-Host "GiftCraft is running." -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend   http://localhost"
Write-Host "  API        http://localhost/api"
Write-Host "  Admin      http://localhost/admin"
Write-Host "  Horizon    http://localhost/horizon"
Write-Host "  Health     http://localhost/api/health"
Write-Host ""
Write-Host "  Postgres   localhost:5433   db=giftcraft_db  user=giftcraft  pass=secret"
Write-Host "  Redis      localhost:6380"
Write-Host "  Meili      localhost:7701   key=local_master_key"
Write-Host ""
Write-Host "  Admin login: admin@giftcraft.vn (see AdminSeeder for password)"
Write-Host ""
Write-Host "Other commands:"
Write-Host "  .\dev.ps1 -Logs    tail all container logs"
Write-Host "  .\dev.ps1 -Reset   wipe DB + re-seed from scratch"
Write-Host "  .\dev.ps1 -Down    stop and remove containers"
