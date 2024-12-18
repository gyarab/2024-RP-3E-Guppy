@echo off
echo Starting client...
cd client
call npm install & npm run dev
cd ..
echo Client started.