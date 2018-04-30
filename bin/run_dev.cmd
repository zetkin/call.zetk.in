start docker-volume-watcher -v call_zetk_in

docker run ^
    -v %cd%/static:/var/app/static ^
    -v %cd%/bin:/var/app/bin ^
    -v %cd%/locale:/var/app/locale ^
    -v %cd%/src:/var/app/src ^
    --name call_zetk_in ^
    --env ZETKIN_LOGIN_URL=http://login.dev.zetkin.org ^
    --env ZETKIN_APP_ID=a5 ^
    --env ZETKIN_APP_KEY=abc123 ^
    --env ZETKIN_DOMAIN=dev.zetkin.org ^
    -p 80:80 ^
    -p 81:81 ^
    -t ^
    -i ^
    --rm ^
call_zetk_in