@echo off
start cmd /k "cd /d api && npm run start:dev"
timeout /t 10 /nobreak
start cmd /k "cd /d ui && npm start"