# Quick Start Script for Smart Study Platform

Write-Host "🚀 Starting Smart Study Platform..." -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found!" -ForegroundColor Yellow
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host ""
    Write-Host "📝 Please edit .env.local and add your API key" -ForegroundColor Red
    Write-Host ""
    Write-Host "After adding your API key, run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if API key is set
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "GEMINI_API_KEY=your_gemini_api_key_here|GEMINI_API_KEY=MY_GEMINI_API_KEY") {
    Write-Host "⚠️  Please set your API key in .env.local" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host "✅ Starting both frontend and backend servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

npm run dev:all
