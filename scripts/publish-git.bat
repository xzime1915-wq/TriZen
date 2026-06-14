@echo off
setlocal EnableExtensions
cd /d "%~dp0.."

echo.
echo  ========================================
echo    Git Push
echo  ========================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] Git not found. Install Git first.
  echo.
  pause
  exit /b 1
)

for /f %%b in ('git branch --show-current 2^>nul') do set "BRANCH=%%b"
if not defined BRANCH set "BRANCH=main"

echo  Branch: %BRANCH%
echo.
echo  --- Status ---
git status -sb
echo.

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] No git remote "origin" configured.
  echo.
  pause
  exit /b 1
)

echo  Pushing to origin/%BRANCH% ...
echo.
git push -u origin "%BRANCH%"
set "PUSH_CODE=%ERRORLEVEL%"

echo.
if "%PUSH_CODE%"=="0" (
  echo  [OK] Push successful.
) else (
  echo  [FAILED] Push failed. Check message above.
)
echo.
pause
exit /b %PUSH_CODE%
