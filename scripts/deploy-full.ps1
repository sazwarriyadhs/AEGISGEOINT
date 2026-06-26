# ============================================
# AEGISGEOINT - FULL DEPLOYMENT SCRIPT
# Drone Command Center dengan SEMUA fitur
# ============================================

param(
    [switch]$Reset,
    [switch]$Build,
    [switch]$Start,
    [switch]$Stop,
    [switch]$Status,
    [switch]$Logs,
    [string]$Service = "all"
)

# ============================================
# COLOR & STYLING
# ============================================
function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "=" * 70 -ForegroundColor Cyan
    Write-Host "  🛰️  $Text" -ForegroundColor White
    Write-Host "=" * 70 -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor Green
}

function Write-Error {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Text)
    Write-Host "⚠️  $Text" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Text)
    Write-Host "📌 $Text" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Text)
    Write-Host "▶️  $Text" -ForegroundColor Magenta
}

# ============================================
# CHECK DOCKER
# ============================================
function Test-Docker {
    Write-Step "Checking Docker status..."
    try {
        $dockerVersion = docker --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Docker is running: $dockerVersion"
            return $true
        } else {
            Write-Error "Docker is not running!"
            Write-Info "Starting Docker Desktop..."
            Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
            Start-Sleep -Seconds 15
            return $false
        }
    } catch {
        Write-Error "Docker not found!"
        return $false
    }
}

# ============================================
# DOCKER COMPOSE COMMANDS
# ============================================
function Invoke-DockerCompose {
    param([string]$Command)
    
    Write-Step "Running: docker-compose $Command"
    $result = docker-compose $Command 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Command completed successfully"
        return $result
    } else {
        Write-Error "Command failed!"
        Write-Error $result
        return $null
    }
}

# ============================================
# RESET SYSTEM
# ============================================
function Reset-System {
    Write-Header "RESET SYSTEM"
    
    $confirm = Read-Host "⚠️  This will REMOVE all containers and volumes. Continue? (y/n)"
    if ($confirm -ne 'y') {
        Write-Warning "Reset cancelled"
        return
    }
    
    Write-Step "Stopping all containers..."
    docker-compose down -v
    
    Write-Step "Removing all Aegis containers..."
    docker rm -f $(docker ps -aq --filter "name=aegis-*") 2>$null
    
    Write-Step "Removing images..."
    docker rmi $(docker images -q "aegisgeoint-*") 2>$null
    
    Write-Step "Pruning system..."
    docker system prune -f
    
    Write-Success "System reset complete!"
}

# ============================================
# BUILD SYSTEM
# ============================================
function Build-System {
    param([string]$Service = "all")
    
    Write-Header "BUILD SYSTEM"
    
    if ($Service -eq "all") {
        Write-Step "Building ALL services..."
        docker-compose build --no-cache
    } else {
        Write-Step "Building service: $Service"
        docker-compose build --no-cache $Service
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build complete!"
    } else {
        Write-Error "Build failed!"
    }
}

# ============================================
# START SYSTEM
# ============================================
function Start-System {
    param([string]$Service = "all")
    
    Write-Header "START SYSTEM"
    
    if (-not (Test-Docker)) {
        Write-Error "Docker not available. Please start Docker Desktop manually."
        return
    }
    
    if ($Service -eq "all") {
        Write-Step "Starting ALL services..."
        docker-compose up -d
    } else {
        Write-Step "Starting service: $Service"
        docker-compose up -d $Service
    }
    
    Start-Sleep -Seconds 10
    
    Show-Status
}

# ============================================
# STOP SYSTEM
# ============================================
function Stop-System {
    param([string]$Service = "all")
    
    Write-Header "STOP SYSTEM"
    
    if ($Service -eq "all") {
        Write-Step "Stopping ALL services..."
        docker-compose down
    } else {
        Write-Step "Stopping service: $Service"
        docker-compose stop $Service
    }
    
    Write-Success "Services stopped!"
}

# ============================================
# SHOW STATUS
# ============================================
function Show-Status {
    Write-Header "SYSTEM STATUS"
    
    Write-Step "All Aegis Containers:"
    docker ps --filter "name=aegis-*" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    Write-Host ""
    Write-Step "Service Health Checks:"
    
    $services = @(
        @{Name="Backend API"; URL="http://localhost:5000/health"},
        @{Name="Frontend"; URL="http://localhost:3000"},
        @{Name="AI Engine"; URL="http://localhost:8000/health"},
        @{Name="GeoServer"; URL="http://localhost:8089/geoserver/web/"}
    )
    
    foreach ($svc in $services) {
        try {
            $response = Invoke-WebRequest -Uri $svc.URL -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Success "$($svc.Name): Online"
            } else {
                Write-Warning "$($svc.Name): Status $($response.StatusCode)"
            }
        } catch {
            Write-Error "$($svc.Name): Offline"
        }
    }
    
    Write-Host ""
    Write-Step "Access Points:"
    Write-Host "  🌐 Frontend    : http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  🔧 Backend API : http://localhost:5000" -ForegroundColor Cyan
    Write-Host "  🧠 AI Engine   : http://localhost:8000" -ForegroundColor Cyan
    Write-Host "  🗺️ GeoServer   : http://localhost:8089/geoserver" -ForegroundColor Cyan
    Write-Host "  📊 PGAdmin     : http://localhost:5050" -ForegroundColor Cyan
    Write-Host "  📈 Grafana     : http://localhost:3001" -ForegroundColor Cyan
    Write-Host "  📉 Prometheus  : http://localhost:9090" -ForegroundColor Cyan
}

# ============================================
# SHOW LOGS
# ============================================
function Show-Logs {
    param([string]$Service = "all")
    
    Write-Header "LOGS"
    
    if ($Service -eq "all") {
        Write-Step "Showing logs for ALL services..."
        docker-compose logs -f --tail=50
    } else {
        Write-Step "Showing logs for: $Service"
        docker-compose logs -f --tail=50 $Service
    }
}

# ============================================
# INSTALL DEPENDENCIES
# ============================================
function Install-Dependencies {
    Write-Header "INSTALL DEPENDENCIES"
    
    Write-Step "Installing Frontend dependencies..."
    cd D:\AegisGeoInt\frontend
    npm install
    
    Write-Step "Installing Backend dependencies..."
    cd D:\AegisGeoInt\backend
    npm install
    
    Write-Step "Installing AI Engine dependencies..."
    cd D:\AegisGeoInt\ai-engine
    pip install -r requirements.txt
    
    Write-Success "All dependencies installed!"
}

# ============================================
# INIT DATABASE
# ============================================
function Init-Database {
    Write-Header "INIT DATABASE"
    
    Write-Step "Waiting for PostgreSQL to be ready..."
    Start-Sleep -Seconds 10
    
    Write-Step "Running migrations..."
    docker exec aegis-postgres-papua psql -U aegis_user -d aegis_db -f /docker-entrypoint-initdb.d/init.sql 2>$null
    
    Write-Step "Inserting sample data..."
    docker exec aegis-postgres-papua psql -U aegis_user -d aegis_db -c "
    INSERT INTO drones (id, name, model, status, battery, latitude, longitude, altitude, mission)
    VALUES 
        (gen_random_uuid(), 'DRONE 01 - ALPHA', 'DJI M30T', 'active', 85, -2.5, 140.5, 120, 'Surveillance'),
        (gen_random_uuid(), 'DRONE 02 - BRAVO', 'DJI M300', 'active', 78, -3.0, 139.8, 150, 'Mapping'),
        (gen_random_uuid(), 'DRONE 03 - CHARLIE', 'Autel EVO', 'active', 92, -2.8, 140.2, 200, 'Search & Rescue')
    ON CONFLICT DO NOTHING;
    " 2>$null
    
    Write-Success "Database initialized!"
}

# ============================================
# HEALTH CHECK
# ============================================
function Health-Check {
    Write-Header "HEALTH CHECK"
    
    Write-Step "Checking all services..."
    
    $checks = @(
        @{Name="PostgreSQL"; Command="docker exec aegis-postgres-papua pg_isready -U aegis_user"},
        @{Name="Redis"; Command="docker exec aegis-redis-papua redis-cli ping"},
        @{Name="Backend"; Command="curl -s http://localhost:5000/health"},
        @{Name="AI Engine"; Command="curl -s http://localhost:8000/health"},
        @{Name="GeoServer"; Command="curl -s http://localhost:8089/geoserver/web/"}
    )
    
    foreach ($check in $checks) {
        Write-Host "  Checking $($check.Name)..." -NoNewline
        try {
            $result = Invoke-Expression $check.Command 2>$null
            if ($result -match "200|OK|PONG|accepting connections") {
                Write-Host " ✅" -ForegroundColor Green
            } else {
                Write-Host " ❌" -ForegroundColor Red
            }
        } catch {
            Write-Host " ❌" -ForegroundColor Red
        }
    }
}

# ============================================
# BACKUP DATABASE
# ============================================
function Backup-Database {
    param([string]$BackupPath = "D:\AegisGeoInt\backups")
    
    Write-Header "BACKUP DATABASE"
    
    if (-not (Test-Path $BackupPath)) {
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    }
    
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $backupFile = "$BackupPath\aegis_backup_$timestamp.sql"
    
    Write-Step "Creating backup: $backupFile"
    docker exec aegis-postgres-papua pg_dump -U aegis_user aegis_db | Out-File -FilePath $backupFile -Encoding utf8
    
    if (Test-Path $backupFile) {
        $size = (Get-Item $backupFile).Length / 1MB
        Write-Success "Backup created! Size: $([math]::Round($size, 2)) MB"
    } else {
        Write-Error "Backup failed!"
    }
}

# ============================================
# DEPLOY FULL
# ============================================
function Deploy-Full {
    Write-Header "🚀 AEGISGEOINT FULL DEPLOYMENT"
    Write-Host "  Drone Command Center - Complete System" -ForegroundColor White
    Write-Host "  Version: 2.0.0" -ForegroundColor Gray
    Write-Host "  Features: ALL" -ForegroundColor Gray
    Write-Host "=" * 70 -ForegroundColor Cyan
    
    if (-not (Test-Docker)) {
        Write-Error "Docker not available. Please start Docker Desktop first."
        return
    }
    
    Build-System
    Start-System
    Init-Database
    Health-Check
    Show-Status
    
    Write-Host ""
    Write-Host "=" * 70 -ForegroundColor Green
    Write-Host "  ✅ AEGISGEOINT FULLY DEPLOYED!" -ForegroundColor Green
    Write-Host "=" * 70 -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Access your system:" -ForegroundColor Cyan
    Write-Host "   Frontend    : http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend API : http://localhost:5000" -ForegroundColor White
    Write-Host "   AI Engine   : http://localhost:8000" -ForegroundColor White
    Write-Host "   GeoServer   : http://localhost:8089/geoserver" -ForegroundColor White
}

# ============================================
# MENU
# ============================================
function Show-Menu {
    Clear-Host
    Write-Host ""
    Write-Host "  🛰️  AEGISGEOINT - DRONE COMMAND CENTER" -ForegroundColor Cyan
    Write-Host "  " + "=" * 50 -ForegroundColor Gray
    Write-Host ""
    Write-Host "  1. 🚀 Deploy Full System" -ForegroundColor White
    Write-Host "  2. 🔨 Build System" -ForegroundColor White
    Write-Host "  3. ▶️  Start System" -ForegroundColor White
    Write-Host "  4. ⏹️  Stop System" -ForegroundColor White
    Write-Host "  5. 📊 Show Status" -ForegroundColor White
    Write-Host "  6. 📜 Show Logs" -ForegroundColor White
    Write-Host "  7. 🏥 Health Check" -ForegroundColor White
    Write-Host "  8. 💾 Backup Database" -ForegroundColor White
    Write-Host "  9. 🔄 Reset System" -ForegroundColor White
    Write-Host "  10. 📦 Install Dependencies" -ForegroundColor White
    Write-Host "  11. ❌ Exit" -ForegroundColor White
    Write-Host ""
    Write-Host "  " + "-" * 50 -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "  Select option (1-11)"
    
    switch ($choice) {
        "1" { Deploy-Full }
        "2" { Build-System }
        "3" { Start-System }
        "4" { Stop-System }
        "5" { Show-Status }
        "6" { Show-Logs }
        "7" { Health-Check }
        "8" { Backup-Database }
        "9" { Reset-System }
        "10" { Install-Dependencies }
        "11" { Write-Host "  👋 Goodbye!" -ForegroundColor Yellow; exit }
        default { Write-Error "Invalid option!" }
    }
    
    Read-Host "`nPress Enter to continue..."
    Show-Menu
}

# ============================================
# MAIN
# ============================================
# Check if running as admin
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Warning "Running without administrator privileges. Some features may not work."
}

# Check if docker-compose.yml exists
if (-not (Test-Path "D:\AegisGeoInt\docker-compose.yml")) {
    Write-Error "docker-compose.yml not found! Make sure you're in the correct directory."
    exit 1
}

# Main
Show-Menu
