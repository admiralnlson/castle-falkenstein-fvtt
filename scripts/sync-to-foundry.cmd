@echo off
setlocal

set "REPO=%~dp0.."
set "CONFIG=%~dp0foundry-sync.json"

for /f "usebackq delims=" %%D in (`powershell -NoProfile -Command "(Get-Content -Raw '%CONFIG%' | ConvertFrom-Json).foundrySystemPath"`) do set "DEST=%%D"

if not defined DEST (
  echo ERROR: could not read foundrySystemPath from %CONFIG%
  exit /b 1
)

echo Syncing Castle Falkenstein system...
echo   From: %REPO%
echo   To:   %DEST%
echo.

if not exist "%DEST%" mkdir "%DEST%"

robocopy "%REPO%" "%DEST%" /E /IS /IT /XD .git node_modules .vscode "src\packs\node_modules" /XF *.lock /NFL /NDL /NJH /NJS /nc /ns /np

if %ERRORLEVEL% GEQ 8 (
  echo robocopy failed with exit code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)

if exist "%DEST%\src\foundry-bases.mjs" del "%DEST%\src\foundry-bases.mjs"

powershell -NoProfile -Command ^
  "$h = Get-Content '%DEST%\src\documents\hand-sheet.mjs' -Head 10 -ErrorAction Stop; " ^
  "if ($h -match 'foundry.applications.sheets') { Write-Host 'OK: V14 hand-sheet fix present.' } " ^
  "else { Write-Error 'hand-sheet.mjs still outdated.'; exit 1 }"

echo.
echo Done. Restart Foundry or reload the world.
exit /b 0
