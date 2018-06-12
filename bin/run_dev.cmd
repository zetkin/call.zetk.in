start docker-volume-watcher -v call_zetk_in

docker run ^
    -v %cd%/static:/var/app/static ^
    -v %cd%/bin:/var/app/bin ^
    -v %cd%/locale:/var/app/locale ^
    -v %cd%/src:/var/app/src ^
    --name call_zetk_in ^
    --env ZETKIN_LOGIN_URL=http://login.dev.zetkin.org ^
    --env ZETKIN_APP_ID=514d9750b6f242c2a7abc31f6fc17a73 ^
    --env ZETKIN_APP_KEY=NjcwOWU0ZDktOGVmYi00N2ViLTk1MTEtY2UyYjY0ODU5YWU4 ^
    --env ZETKIN_DOMAIN=dev.zetkin.org ^
    -p 80:80 ^
    -p 81:81 ^
    -t ^
    -i ^
    --rm ^
call_zetk_in