#!/bin/bash

# Start Docker Compose
echo "Starting Docker Compose..."
sudo docker compose up -d

# Navigate to client directory and run commands
echo "Setting up client..."
cd client || { echo "Client directory not found!" ; exit 1; }
npm install
npm run dev &
cd ..

# Navigate to server directory and run commands
echo "Setting up server..."
cd server || { echo "Server directory not found!" ; exit 1; }
npm install
npx prisma db push
npm run dev &

# Wait for background processes
echo "Setup complete. Services are running."
wait

