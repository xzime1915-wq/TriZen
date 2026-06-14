@echo off
py -3 "%~dp0scripts\deploy-auto.py"
exit /b %ERRORLEVEL%
