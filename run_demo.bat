@echo off
echo Starting WeatherGPT Backend...
start cmd /k "cd /d %~dp0backend && ..\.venv\Scripts\python app/main.py"
echo Starting WeatherGPT Frontend...
start cmd /k "cd /d %~dp0frontend && npm run dev"
echo Both servers starting!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
