@echo off
echo ==========================================================================
echo   Pushing Swad Restaurant to GitHub: AI-Stock-Sense-
echo ==========================================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH!
    echo Please install Git from: https://git-scm.com/download/win
    echo After installing Git, double-click this file again.
    echo.
    pause
    exit /b 1
)

echo 1. Initializing Git...
if not exist ".git" (
    git init
)

echo 2. Staging files...
git add .

echo 3. Committing...
git commit -m "Add Swad Restaurant - Smart Inventory & Food Waste Management System with Chef Swad AI Bot"

echo 4. Setting branch to main...
git branch -M main

echo 5. Configuring remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/jadhavniraj1200-coder/AI-Stock-Sense-.git

echo 6. Pushing to GitHub...
git push -u origin main

echo.
echo ==========================================================================
echo Done! Check your repo: https://github.com/jadhavniraj1200-coder/AI-Stock-Sense-
echo ==========================================================================
pause
