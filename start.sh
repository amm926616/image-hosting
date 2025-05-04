#!/bin/bash

# Navigate to frontend and start the frontend server
(
  cd frontend || exit
  echo "Starting frontend (React)..."
  bun run preview --host
) &

# Navigate to backend and start the backend server
(
  cd backend || exit
  echo "Starting backend (Django)..."
  python manage.py runserver
)

# Wait for both to finish
wait

