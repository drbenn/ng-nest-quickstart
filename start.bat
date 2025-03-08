@echo off
start cmd /k "cd /d api && npm run start:dev"
timeout /t 0 /nobreak
start cmd /k "cd /d ui-d && npm start"
timeout /t 0 /nobreak
start cmd /k "cd /d ui && npm start"