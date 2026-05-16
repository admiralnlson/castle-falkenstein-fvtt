# Sync repo -> Foundry user data (see scripts/foundry-sync.json).

$Repo = Split-Path $PSScriptRoot -Parent
$ConfigPath = Join-Path $PSScriptRoot "foundry-sync.json"

if (-not (Test-Path $ConfigPath)) {
  Write-Error "Missing $ConfigPath"
  exit 1
}

$Dest = (Get-Content $ConfigPath -Raw | ConvertFrom-Json).foundrySystemPath
if (-not $Dest) {
  Write-Error "foundrySystemPath not set in foundry-sync.json"
  exit 1
}

Write-Host "Source: $Repo"
Write-Host "Dest:   $Dest"

& (Join-Path $PSScriptRoot "sync-to-foundry.cmd")
exit $LASTEXITCODE
