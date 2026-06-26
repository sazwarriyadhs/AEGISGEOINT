# ============================================================
# AEGIS GEOINT - PAPUA DEMO START
# ============================================================

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   🎯 AEGIS GEOINT PLATFORM" -ForegroundColor Yellow
Write-Host "   PAPUA DEMO - Perbatasan RI-PNG" -ForegroundColor Cyan
Write-Host "   Presenter: Pak Azwar" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

D:\AegisGeoInt = "D:\AegisGeoInt"

Write-Host "📍 LOCATION: JAYAPURA, PAPUA" -ForegroundColor Green
Write-Host "📊 COORDINATES: -2.5337, 140.7173" -ForegroundColor Green
Write-Host ""

Write-Host "[1] Starting PostgreSQL..." -ForegroundColor Yellow
docker-compose -f "D:\AegisGeoInt\docker-compose.yml" up -d postgres
Start-Sleep -Seconds 5

Write-Host "[2] Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\AegisGeoInt\backend; npm install; npm run dev"

Write-Host "[3] Starting Frontend Dashboard..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\AegisGeoInt\frontend; npm install; npm start"

Write-Host "[4] Starting AI Engine..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\AegisGeoInt\ai-engine; pip install -r requirements.txt; python main.py"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   🎯 PAPUA DEMO READY!" -ForegroundColor Green
Write-Host "   Dashboard: http://localhost:3000" -ForegroundColor Yellow
Write-Host "   API: http://localhost:5000" -ForegroundColor Yellow
Write-Host "   AI: http://localhost:8000" -ForegroundColor Yellow
Write-Host "   Location: Jayapura, Papua" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 DEMO SCENARIOS:" -ForegroundColor Green
Write-Host "   🔴 Scenario 1: Border Intrusion (Sector Charlie)" -ForegroundColor White
Write-Host "   🟠 Scenario 2: Suspicious Night Movement (Sector Echo)" -ForegroundColor White
Write-Host "   🟡 Scenario 3: Drone Activity (Sector Alpha)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 SELAMAT DEMO JUMAT!" -ForegroundColor Green
