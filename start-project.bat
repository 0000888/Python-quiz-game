@echo off
echo Starting Quiz Game Backend...
cd /d "c:\Users\DELL\Downloads\python quiz game\backend"
start "Backend" cmd /k "python -m uvicorn main:app --reload --port 8000"

echo Starting Quiz Game Frontend...
cd /d "c:\Users\DELL\Downloads\python quiz game\frontend"
start "Frontend" cmd /k "npm run dev"

echo Both services are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
pause
