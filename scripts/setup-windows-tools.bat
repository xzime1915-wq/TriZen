@echo off
setlocal EnableExtensions

echo.
echo ========================================
echo   TRIZEN Windows tools setup
echo ========================================
echo.
echo This installs Git, Node.js LTS, Python 3, and paramiko.
echo If Windows asks for admin permission, click Yes.
echo.

where winget >nul 2>&1
if errorlevel 1 (
  echo [ERROR] winget not found. Install "App Installer" from Microsoft Store, then run again.
  pause
  exit /b 1
)

winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
if errorlevel 1 goto :failed

winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
if errorlevel 1 goto :failed

winget install --id Python.Python.3.12 -e --source winget --accept-package-agreements --accept-source-agreements
if errorlevel 1 goto :failed

echo.
echo Installing Python deploy dependency: paramiko
py -3 -m pip install --upgrade pip
if errorlevel 1 goto :failed
py -3 -m pip install paramiko
if errorlevel 1 goto :failed

echo.
echo [OK] Tools installed. Close this window, open a new CMD/PowerShell, then run:
echo   scripts\localhost.bat
echo.
pause
exit /b 0

:failed
echo.
echo [FAILED] Setup did not finish. Check the message above.
echo If it was an admin prompt issue, right-click this file and choose Run as administrator.
echo.
pause
exit /b 1
