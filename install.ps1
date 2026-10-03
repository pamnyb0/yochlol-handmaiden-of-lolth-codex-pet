$ErrorActionPreference = 'Stop'

$packageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$codexRoot = if ($env:CODEX_HOME) {
    $env:CODEX_HOME
} else {
    Join-Path $env:USERPROFILE '.codex'
}
$destination = Join-Path $codexRoot 'pets\yochlol'
$source = Join-Path $packageRoot 'pet'

New-Item -ItemType Directory -Force -Path $destination | Out-Null
Copy-Item -LiteralPath (Join-Path $source 'pet.json') -Destination $destination -Force
Copy-Item -LiteralPath (Join-Path $source 'spritesheet.webp') -Destination $destination -Force

Write-Output "Yochlol installed at $destination"
Write-Output 'Restart Codex or refresh the pet picker, then select Yochlol.'
