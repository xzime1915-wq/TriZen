@echo off
setlocal
cd /d "%~dp0"

set "SCRIPT=%~dp0publish-deploy.py"

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  start "TRIZEN VPS Deploy" /D "%~dp0.." py -3 "%SCRIPT%"
  exit /b 0
)

where pythonw >nul 2>&1
if %ERRORLEVEL%==0 (
  start "TRIZEN VPS Deploy" /D "%~dp0.." pythonw "%SCRIPT%"
  exit /b 0
)

where python >nul 2>&1
if %ERRORLEVEL%==0 (
  start "TRIZEN VPS Deploy" /D "%~dp0.." python "%SCRIPT%"
  exit /b 0
)

echo Python not found. Install Python 3 from python.org
pause
exit /b 1
