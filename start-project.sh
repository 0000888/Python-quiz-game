#!/bin/bash

echo "Starting Quiz Game Backend..."
cd "c:\Users\DELL\Downloads\python quiz game\backend"
gnome-terminal -- bash -c "python -m uvicorn main:app --reload --port 8000; exec bash" &

echo "Starting Quiz Game Frontend..."
cd "c:\Users\DELL\Downloads\python quiz game\frontend"
gnome-terminal -- bash -c "npm run dev; exec bash" &

echo "Both services are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
