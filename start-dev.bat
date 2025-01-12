@echo off

cd client
echo Installing dependencies for client...
call npm install
echo Client dependencies installed.
cd ..

cd server
echo Installing dependencies for server...
call npm install
echo Server dependencies installed.
cd ..

echo Starting client, server, and docker (for database)  ...

start cmd /k "docker compose up"
start cmd /k "cd client && npm run dev"
start cmd /k "cd server && npm run dev"
