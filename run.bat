@echo off
echo Starting development servers...

REM Bắt đầu frontend trong một cửa sổ terminal mới
echo Starting frontend (http://localhost:5173)...
start "Frontend" cmd /k "cd frontend && npm run dev"

REM Bắt đầu backend trong một cửa sổ terminal mới
echo Starting backend (http://localhost:3000)...
start "Backend" cmd /k "cd backend && npm run dev"