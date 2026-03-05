# Quick Start Script for AI Study Helper

Write-Host "🚀 Starting AI Study Helper..." -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found!" -ForegroundColor Yellow
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host ""
    Write-Host "📝 Please edit .env.local and add your Gemini API key" -ForegroundColor Red
    Write-Host "   Get your key from: https://aistudio.google.com/apikey" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After adding your API key, run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if GEMINI_API_KEY is set
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "GEMINI_API_KEY=your_gemini_api_key_here|GEMINI_API_KEY=MY_GEMINI_API_KEY") {
    Write-Host "⚠️  Please set your GEMINI_API_KEY in .env.local" -ForegroundColor Red
    Write-Host "   Get your key from: https://aistudio.google.com/apikey" -ForegroundColor Cyan
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
