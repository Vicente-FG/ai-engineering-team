<#
.SYNOPSIS
    Runs check-sources.mjs with an available Node runtime.

.DESCRIPTION
    `node` is frequently absent from PATH in this environment. This launcher prefers `node`
    when it exists and otherwise falls back to the Node runtime bundled with the MiniMax Code
    desktop app (Electron exposes it through ELECTRON_RUN_AS_NODE).

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts/check-sources.ps1
    powershell -ExecutionPolicy Bypass -File scripts/check-sources.ps1 --domain security
#>
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Rest
)

$ErrorActionPreference = 'Stop'
$script = Join-Path $PSScriptRoot 'check-sources.mjs'
if (-not (Test-Path $script)) {
    Write-Error "Missing script: $script"
    exit 2
}

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCmd) {
    & $nodeCmd.Source $script @Rest
    exit $LASTEXITCODE
}

$appCandidates = @(
    (Join-Path $env:LOCALAPPDATA 'Programs\MiniMax Code\MiniMax Code.exe'),
    (Join-Path $env:LOCALAPPDATA 'Programs\minimax-code\minimax-code.exe')
)
$app = $appCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($app) {
    $env:ELECTRON_RUN_AS_NODE = '1'
    # Start-Process -PassThru reports the child exit code reliably; $LASTEXITCODE can stay
    # empty when a native exe is invoked through a variable path inside a script scope.
    # Build the argument list defensively: with no arguments $Rest is $null, and an array
    # containing $null makes Start-Process fail with a binding error.
    $argList = New-Object System.Collections.Generic.List[string]
    $argList.Add($script)
    foreach ($a in @($Rest)) {
        if ($null -ne $a -and $a -ne '') { $argList.Add([string]$a) }
    }
    $proc = Start-Process -FilePath $app -ArgumentList $argList.ToArray() -NoNewWindow -Wait -PassThru
    exit $proc.ExitCode
}

Write-Error 'No Node runtime found. Install Node.js LTS with: winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements'
exit 2
