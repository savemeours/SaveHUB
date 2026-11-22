@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Pasang Node.js LTS dari https://nodejs.org/ terlebih dahulu.
 pause
 exit /b 1
)
set "SAVEHUB_BUILD_STAGE=memasang dependensi"
call npm ci
if errorlevel 1 goto failed
set "SAVEHUB_BUILD_STAGE=pengujian aplikasi"
call npm test
if errorlevel 1 goto failed
set "SAVEHUB_BUILD_STAGE=pembuatan installer"
call npm run dist:win
if errorlevel 1 goto failed
echo Selesai. Installer dan aplikasi portable ada di folder release.
start "" "%~dp0release"
pause
exit /b 0
:failed
echo Proses gagal pada tahap: %SAVEHUB_BUILD_STAGE%.
echo Periksa pesan kesalahan di atas.
pause
exit /b 1
