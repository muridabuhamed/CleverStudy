# Smart Study Platform - Start Script
# Run this from the project root: .\start-python.ps1

$ROOT = $PSScriptRoot

# --- Check .env.local ---
if (!(Test-Path "$ROOT\.env.local")) {
    Write-Host "ERROR: .env.local not found." -ForegroundColor Red
    Write-Host "Copy .env.example to .env.local and fill in your GEMINI_API_KEY." -ForegroundColor Yellow
    exit 1
}

# --- Check Python ---
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Python not found. Install Python 3.8+ and try again." -ForegroundColor Red
    exit 1
}

# --- Install Python deps if needed ---
Write-Host "Checking Python dependencies..." -ForegroundColor Cyan
pip install -r "$ROOT\backend\requirements.txt" -q

# --- Install frontend deps if needed ---
if (!(Test-Path "$ROOT\frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    Push-Location "$ROOT\frontend"
    npm install
    Pop-Location
}

Write-Host ""
Write-Host "Starting backend on  http://localhost:8000" -ForegroundColor Green
Write-Host "Starting frontend on http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Open backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT\backend'; python main.py"

# Wait for backend to be ready
Start-Sleep -Seconds 3

# Open frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT\frontend'; npx vite --port 3000 --host"

Write-Host "Both windows are open. Close them to stop the servers." -ForegroundColor Yellow
