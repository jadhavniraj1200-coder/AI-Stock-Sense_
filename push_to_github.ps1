# PowerShell script to push Swad Restaurant project to GitHub repository
$ErrorActionPreference = "Stop"

$repoUrl = "https://github.com/jadhavniraj1200-coder/AI-Stock-Sense-.git"

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "  Pushing Swad Restaurant to GitHub: $repoUrl" -ForegroundColor Yellow
Write-Host "==========================================================================" -ForegroundColor Cyan

# Check for Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "❌ Error: Git is not installed or not found in your system PATH." -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "After installing Git, re-run this script." -ForegroundColor Yellow
    Write-Host ""
    Read-Host -Prompt "Press Enter to exit"
    exit 1
}

try {
    # Initialize repository if needed
    if (-not (Test-Path ".git")) {
        Write-Host "1. Initializing Git repository..." -ForegroundColor Green
        git init
    }

    Write-Host "2. Adding all files..." -ForegroundColor Green
    git add .

    Write-Host "3. Creating commit..." -ForegroundColor Green
    git commit -m "Add Swad Restaurant - Smart Inventory & Food Waste Management System with Chef Swad AI Bot"

    Write-Host "4. Setting main branch..." -ForegroundColor Green
    git branch -M main

    # Setup remote
    $currentRemotes = git remote
    if ($currentRemotes -contains "origin") {
        git remote set-url origin $repoUrl
    } else {
        git remote add origin $repoUrl
    }

    Write-Host "5. Pushing to GitHub (origin main)..." -ForegroundColor Green
    git push -u origin main

    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository URL: $repoUrl" -ForegroundColor Cyan
}
catch {
    Write-Host ""
    Write-Host "Push failed: $_" -ForegroundColor Red
    Write-Host "Tip: If GitHub prompts for credentials, use your GitHub username and Personal Access Token (PAT)." -ForegroundColor Yellow
}

Write-Host ""
Read-Host -Prompt "Press Enter to exit"
