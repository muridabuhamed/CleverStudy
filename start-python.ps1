# Quick Start Script for Smart Study Platform (Python Backend)

Write-Host "🐍 Starting Smart Study Platform with Python Backend..." -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found!" -ForegroundColor Yellow
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host ""
    Write-Host "📝 Please edit .env.local and add your API keys:" -ForegroundColor Red
    Write-Host "   - GEMINI_API_KEY (required)" -ForegroundColor Red
    Write-Host "   - JWT_SECRET (required)" -ForegroundColor Red
    Write-Host ""
    Write-Host "After adding your keys, run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if API keys are set
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "GEMINI_API_KEY=MY_GEMINI_API_KEY|GEMINI_API_KEY=`"MY_GEMINI_API_KEY`"") {
    Write-Host "⚠️  Please set your GEMINI_API_KEY in .env.local" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found! Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

# Check if virtual environment exists
if (!(Test-Path "backend\venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Cyan
    python -m venv backend\venv
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Cyan
& backend\venv\Scripts\Activate.ps1

# Install/Update Python dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Cyan
pip install -r backend\requirements.txt --quiet

# Check if node_modules exists for frontend
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host ""
Write-Host "✅ Starting servers..." -ForegroundColor Green
Write-Host ""
Write-Host "🐍 Python Backend (FastAPI): http://localhost:8000" -ForegroundColor Cyan
Write-Host "⚛️  Frontend (React): http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 API Documentation: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start both frontend and backend
$jobs = @()

# Start Python backend
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & backend\venv\Scripts\Activate.ps1
    python backend\main.py
}
$jobs += $backendJob
Write-Host "✅ Python backend started (Job ID: $($backendJob.Id))" -ForegroundColor Green

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}
$jobs += $frontendJob
Write-Host "✅ Frontend started (Job ID: $($frontendJob.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 All services started successfully!" -ForegroundColor Green
Write-Host ""

# Monitor jobs
try {
    while ($true) {
        foreach ($job in $jobs) {
            if ($job.State -eq 'Failed' -or $job.State -eq 'Stopped') {
                Write-Host "❌ Job $($job.Id) has stopped!" -ForegroundColor Red
                Receive-Job $job
            }
        }
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
    $jobs | Stop-Job
    $jobs | Remove-Job
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
