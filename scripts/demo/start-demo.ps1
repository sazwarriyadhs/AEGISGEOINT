# ============================================================
# AEGIS GEOINT PLATFORM - DEMO SCRIPT JUMAT
# ============================================================

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   AEGIS GEOINT PLATFORM DEMO" -ForegroundColor Yellow
Write-Host "   Presenter: Pak Azwar" -ForegroundColor Cyan
Write-Host "   Tanggal: Jumat, 23 Juni 2026" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Start PostgreSQL
Write-Host "[1] Starting PostgreSQL..." -ForegroundColor Green
docker-compose up -d postgres

# 2. Start Backend
Write-Host "[2] Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\AegisGeoInt\backend; npm run dev"

# 3. Start Frontend
Write-Host "[3] Starting Frontend Dashboard..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\AegisGeoInt\frontend; npm start"

# 4. Start AI Engine
Write-Host "[4] Starting AI Engine..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\AegisGeoInt\ai-engine; python main.py"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   DEMO READY!" -ForegroundColor Green
Write-Host "   Dashboard: http://localhost:3000" -ForegroundColor Yellow
Write-Host "   API: http://localhost:5000" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
