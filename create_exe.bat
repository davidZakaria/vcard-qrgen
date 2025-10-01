@echo off
echo Creating Business Card Generator EXE...
echo.

REM Install PyInstaller if not already installed
echo Installing PyInstaller...
pip install pyinstaller

echo.
echo Building EXE file...
pyinstaller --onefile --windowed --name "Business_Card_Generator" --icon=card-background.png launcher.py

echo.
echo EXE created in 'dist' folder!
echo You can now run Business_Card_Generator.exe
pause
