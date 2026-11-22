@echo off
setlocal
cd /d "%~dp0"
if exist "%~dp0release\win-unpacked\SaveHUB.exe" (
 start "" "%~dp0release\win-unpacked\SaveHUB.exe"
 exit /b 0
)
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js belum terpasang. Pasang Node.js LTS dari https://nodejs.org/
 pause
 exit /b 1
)
echo Menjalankan SaveHUB dari sumber. Hasil build ada di folder release.
call npm ci
if errorlevel 1 goto failed
call npm start
if errorlevel 1 goto failed
exit /b 0
:failed
echo SaveHUB gagal dijalankan. Periksa pesan di atas dan koneksi internet.
pause
exit /b 1
