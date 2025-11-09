@echo off
echo.
echo ==============================================
echo   PUSH AGENDA ANGULAR SU GITHUB
echo ==============================================
echo.
echo Inserisci il tuo username GitHub:
set /p USERNAME=Username: 

echo.
echo Collegamento a GitHub...
git remote add origin https://github.com/%USERNAME%/agenda-angular.git
git branch -M main

echo.
echo Push in corso...
git push -u origin main

echo.
echo ==============================================
echo   COMPLETATO!
echo ==============================================
echo.
echo Ora vai su https://vercel.com per il deploy!
echo.
pause

