@echo off
echo ========================================
echo Starting Paper Knows Development Servers
echo ========================================
echo.

echo [1/2] Starting Wechat Push Frontend (Port 3000)...
cd /d "%~dp0wechat-push-frontend-2.0"
start "Wechat Push Frontend" cmd /k "pnpm dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Main Backend Server...
cd /d "%~dp0"
echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Wechat Push Frontend: http://localhost:3000
echo.
echo Press any key to stop all services...
pause >nul

echo.
echo Stopping all services...
taskkill /FI "WINDOWTITLE eq Wechat Push Frontend*" /T /F >nul 2>&1

echo All services stopped.
pause
