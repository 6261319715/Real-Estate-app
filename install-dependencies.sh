#!/bin/bash
set -e
echo "Installing all project dependencies..."
echo ""

echo "[1/2] Backend..."
cd backend && npm install && cd ..
echo "Backend done."
echo ""

echo "[2/2] Frontend..."
cd frontend && npm install && cd ..
echo "Frontend done."
echo ""

echo "All dependencies installed."
echo ""
echo "Next steps:"
echo "  1. Start MongoDB (or set MONGODB_URI in backend/.env for Atlas)"
echo "  2. Run backend:  cd backend && npm run dev"
echo "  3. Run frontend: cd frontend && npm run dev"
echo "  4. Open http://localhost:3000"
