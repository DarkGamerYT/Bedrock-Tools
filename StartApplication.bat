@echo off
echo Starting...
call npm run start
if errorlevel 1 goto :Error
goto :EOF 

:Error
echo Failed to start program...
timeout 30 /nobreak

:EOF