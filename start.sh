#!/bin/bash

# Get the absolute path to the directory this script is in
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Navigate to frontend and start the frontend server
(
  cd "$SCRIPT_DIR/frontend" || exit
  echo "Starting frontend (React)..."
  bun run preview --host
) &

# Open the frontend in the default web browser after a short delay
(
  sleep 3  # Give it a few seconds to start
  if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:4173
  elif command -v open > /dev/null; then  # macOS
    open http://localhost:4173
  elif command -v start > /dev/null; then  # Windows Git Bash
    start http://localhost:4173
  fi
) &

# Navigate to backend and start the backend server
(
  cd "$SCRIPT_DIR/backend" || exit
  echo "Starting backend (Django)..."
  python manage.py runserver
)

wait
