<#
.SYNOPSIS
    Installs the engineering team toolkit (agents + standards skill) into a project or into your user config.

.DESCRIPTION
    Project scope copies the per-tool folders (.claude, .github, .opencode, .agents, .junie, .cursor)
    plus AGENTS.md and CLAUDE.md into the target repository.

    User scope copies the agents and the skill into each tool's global configuration directory.

.PARAMETER Scope
    project (default) or user.

.PARAMETER Target
    Project scope only: the repository to install into. Defaults to the current directory.

.PARAMETER Tools
    Comma separated list of tools to install. Defaults to all of them.
    Available: claude, copilot, opencode, junie, cursor, codex

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts/install.ps1 -Scope project -Target C:\repos\my-app
    powershell -ExecutionPolicy Bypass -File scripts/install.ps1 -Scope user
#>
param(
    [ValidateSet('project', 'user')]
    [string]$Scope = 'project',
    [string]$Target = '.',
    [string]$Tools = 'claude,copilot,opencode,junie,cursor,codex'
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$selected = $Tools.Split(',') | ForEach-Object { $_.Trim().ToLower() } | Where-Object { $_ }

function Copy-Tree([string]$Source, [string]$Destination) {
    if (-not (Test-Path $Source)) { return }
    New-Item -ItemType Directory -Force -Path $Destination | Out-Null
    Get-ChildItem -Path $Source -Recurse -File | ForEach-Object {
        $relative = $_.FullName.Substring($Source.Length).TrimStart('\', '/')
        $target = Join-Path $Destination $relative
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
        Copy-Item -Force $_.FullName $target
    }
}

function Copy-File([string]$Source, [string]$Destination) {
    if (-not (Test-Path $Source)) { return }
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Destination) | Out-Null
    Copy-Item -Force $Source $Destination
}

$home_ = $env:USERPROFILE
$agentsSrc = Join-Path $repo 'plugin\agents'
$skillSrc = Join-Path $repo 'plugin\skills\engineering-standards'

if ($Scope -eq 'project') {
    $root = (Resolve-Path $Target).Path
    $map = @{
        claude   = @('.claude\agents', '.claude\skills')
        copilot  = @('.github\agents', '.github\skills', '.github\instructions', '.agents\skills')
        opencode = @('.opencode\agents', '.opencode\skills')
        junie    = @('.junie', '.agents\skills')
        cursor   = @('.cursor\rules', '.agents\skills')
        codex    = @()
    }
    foreach ($tool in $selected) {
        if (-not $map.ContainsKey($tool)) { Write-Warning "Unknown tool: $tool"; continue }
        foreach ($folder in $map[$tool]) {
            Copy-Tree (Join-Path $repo $folder) (Join-Path $root $folder)
        }
        Write-Host "installed: $tool -> $root"
    }
    Copy-File (Join-Path $repo 'AGENTS.md') (Join-Path $root 'AGENTS.md')
    Copy-File (Join-Path $repo 'CLAUDE.md') (Join-Path $root 'CLAUDE.md')
    Copy-File (Join-Path $repo '.github\copilot-instructions.md') (Join-Path $root '.github\copilot-instructions.md')
    Write-Host ''
    Write-Host 'Done. Commit the generated folders to share them with your team.'
}
else {
    $map = @{
        claude   = @{ agents = "$home_\.claude\agents";            skills = "$home_\.claude\skills" }
        copilot  = @{ agents = "$home_\.copilot\agents";            skills = "$home_\.copilot\skills" }
        opencode = @{ agents = "$home_\.config\opencode\agents";    skills = "$home_\.config\opencode\skills" }
        junie    = @{ agents = $null;                                skills = "$home_\.junie\skills" }
        cursor   = @{ agents = $null;                                skills = "$home_\.cursor\skills" }
        codex    = @{ agents = $null;                                skills = "$home_\.agents\skills" }
    }
    foreach ($tool in $selected) {
        if (-not $map.ContainsKey($tool)) { Write-Warning "Unknown tool: $tool"; continue }
        $entry = $map[$tool]
        if ($entry.agents) { Copy-Tree $agentsSrc $entry.agents }
        if ($entry.skills) { Copy-Tree $skillSrc (Join-Path $entry.skills 'engineering-standards') }
        Write-Host "installed: $tool -> $home_"
    }
    Copy-File (Join-Path $repo 'AGENTS.md') "$home_\.codex\AGENTS.md"
    Copy-File (Join-Path $repo 'AGENTS.md') "$home_\.junie\AGENTS.md"
    Write-Host ''
    Write-Host 'Done. Restart your coding tool so it picks up the new agents and skills.'
}
