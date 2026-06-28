@echo off
setlocal EnableExtensions
cd /d "%~dp0.."

echo.
echo ========================================
echo   TRIZEN localhost
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 goto :missing_tools

where npm >nul 2>&1
if errorlevel 1 goto :missing_tools

if not exist ".env" (
  echo .env not found. Creating it from .env.example...
  copy ".env.example" ".env" >nul
  echo.
  echo [ACTION NEEDED] Edit .env first, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  npm install
  if errorlevel 1 goto :failed
)

echo Preparing Prisma database...
npx prisma generate
if errorlevel 1 goto :failed
npx prisma db push
if errorlevel 1 goto :failed
npm run db:setup-safe
if errorlevel 1 goto :failed

echo.
echo Opening http://localhost:3000
start "" "http://localhost:3000"
echo.
echo Starting Next.js dev server...
npm run dev
exit /b %ERRORLEVEL%

:missing_tools
echo [ERROR] Node.js/npm not found.
echo Run scripts\setup-windows-tools.bat first, then open a new CMD/PowerShell.
pause
exit /b 1

:failed
echo.
echo [FAILED] Localhost setup failed. Check the message above.
pause
exit /b 1
