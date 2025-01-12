#!/bin/bash

echo "Installing dependencies for client..."
cd client
npm install
echo "Client dependencies installed."
cd ..

echo "Installing dependencies for server..."
cd server
npm install
echo "Server dependencies installed."
cd ..

echo "Starting client, server, and Docker (for database)..."

gnome-terminal -- bash -c "sudo docker compose up; exec bash"
gnome-terminal -- bash -c "cd client && npm run dev; exec bash"
gnome-terminal -- bash -c "cd server && npm run dev; exec bash"
