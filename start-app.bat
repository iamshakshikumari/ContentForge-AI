@echo off
title ContentForge AI Launcher
echo ==============================================
echo       Starting ContentForge AI App
echo ==============================================
echo.

echo Starting Backend Server on port 3000...
start "ContentForge AI - Backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo Starting Frontend Vite Client on port 5173...
start "ContentForge AI - Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ==============================================
echo  Frontend UI: http://localhost:5173
echo  Backend API: http://localhost:3000
echo ==============================================
echo.
pause
