@echo off
echo Starting Backend...
cd /d "c:\Users\DELL\Downloads\python quiz game\backend"
start "Backend Server" cmd /k "python -m uvicorn main:app --reload --port 8000"

echo Starting Frontend...
cd /d "c:\Users\DELL\Downloads\python quiz game\frontend"
start "Frontend Server" cmd /k "npm run dev"

echo Both servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
timeout /t 3
