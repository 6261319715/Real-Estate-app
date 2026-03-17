@echo off
echo Installing all project dependencies...
echo.

echo [1/2] Backend...
cd backend
call npm install
if errorlevel 1 (
  echo Backend install failed.
  exit /b 1
)
cd ..
echo Backend done.
echo.

echo [2/2] Frontend...
cd frontend
call npm install
if errorlevel 1 (
  echo Frontend install failed.
  exit /b 1
)
cd ..
echo Frontend done.
echo.

echo All dependencies installed.
echo.
echo Next steps:
echo   1. Start MongoDB (or set MONGODB_URI in backend\.env for Atlas)
echo   2. Run backend:  cd backend ^&^& npm run dev
echo   3. Run frontend: cd frontend ^&^& npm run dev
echo   4. Open http://localhost:3000
pause
