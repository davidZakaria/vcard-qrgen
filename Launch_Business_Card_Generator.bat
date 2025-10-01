@echo off
echo Starting Business Card Generator...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python found, starting server...
    start "Business Card Server" python -m http.server 8000
    goto :open_browser
)

REM Check if py command is available
py --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python found via py command, starting server...
    start "Business Card Server" py -m http.server 8000
    goto :open_browser
)

echo ERROR: Python not found!
echo Please install Python from https://python.org
echo.
pause
exit

:open_browser
echo Waiting for server to start...
timeout /t 3 /nobreak >nul
echo Opening Business Card Generator in browser...
start http://localhost:8000
echo.
echo Business Card Generator is now running!
echo Close this window to stop the server.
echo.
pause
