@echo off
echo Starting database deletion...
start cmd /k "cd /d postgres && bash.exe ./delete-db.sh && echo Database deletion complete! && exit"
timeout /t 5 /nobreak >nul

echo Starting database creation...
start cmd /k "cd /d postgres && bash.exe ./create-db.sh && echo Database creation complete! && exit"
timeout /t 5 /nobreak >nul

echo Starting api in watch mode...
start cmd /k start cmd /k "cd /d api && npm run start:dev"
timeout /t 5 /nobreak >nul

echo Starting ui in watch mode...
start cmd /k "cd /d ui && npm start"
timeout /t 5 /nobreak >nul