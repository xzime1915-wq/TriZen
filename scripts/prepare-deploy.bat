@echo off
setlocal EnableExtensions
cd /d "%~dp0.."

echo.
echo ========================================
echo   TRIZEN pre-deploy check
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 goto :missing_tools

where npm >nul 2>&1
if errorlevel 1 goto :missing_tools

where git >nul 2>&1
if errorlevel 1 goto :missing_tools

where py >nul 2>&1
if errorlevel 1 goto :missing_tools

py -3 -c "import paramiko" >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Python package paramiko is missing.
  echo Run: py -3 -m pip install paramiko
  pause
  exit /b 1
)

if not exist ".env" (
  echo [ERROR] .env not found. Copy .env.example to .env and fill the values first.
  pause
  exit /b 1
)

echo Installing/verifying dependencies...
npm install
if errorlevel 1 goto :failed

echo.
echo Syncing Prisma...
npx prisma generate
if errorlevel 1 goto :failed
npx prisma db push
if errorlevel 1 goto :failed
npm run db:setup-safe
if errorlevel 1 goto :failed

echo.
echo Running typecheck...
npm run lint
if errorlevel 1 goto :failed

echo.
echo Running production build...
npm run build
if errorlevel 1 goto :failed

echo.
echo Git status:
git status -sb

echo.
echo [OK] Ready for GitHub push and deploy.
echo Push:   scripts\publish-git.bat
echo Deploy: publish.bat
echo.
pause
exit /b 0

:missing_tools
echo [ERROR] Git, Node.js/npm, or Python is missing.
echo Run scripts\setup-windows-tools.bat first, then open a new CMD/PowerShell.
pause
exit /b 1

:failed
echo.
echo [FAILED] Pre-deploy check failed. Fix the message above before push/deploy.
pause
exit /b 1
