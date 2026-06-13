@echo off
title TriZen VPS Deploy
echo.
echo TriZen VPS Deploy
echo =================
echo Password diye Enter din (letter dekhabe na - normal)
echo.
ssh -t -o PreferredAuthentications=password -o PubkeyAuthentication=no root@144.79.133.209 "cd /var/www/trizen && bash scripts/vps-update.sh"
echo.
echo Done. Window bondho korte y ba Enter chapun.
pause
