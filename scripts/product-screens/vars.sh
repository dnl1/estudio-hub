# Variáveis do ambiente local das capturas. Uso: source scripts/product-screens/vars.sh
# Não imprime nada: a senha do banco local e a da conta de teste ficam só nas variáveis.
export WORK="${PRODUCT_SCREENS_WORKDIR:-$HOME/.cache/estudio-hub-product-screens}"
export PATH="$HOME/.dotnet:$PATH"
export DOTNET_ROOT="$HOME/.dotnet"
export DEMO_EMAIL="gestora@estudio-exemplo.test"
# A main não traz o appsettings.Development.json (ignorado pelo git): a API local precisa de um
# segredo de JWT. Um aleatório por terminal basta, porque o login e as capturas usam a mesma API.
export DEMO_JWT_SECRET="${DEMO_JWT_SECRET:-$(openssl rand -base64 48)}"

_compose="$WORK/StudioScheduler/docker-compose.dev.yml"
if [ -f "$_compose" ]; then
  _pass=$(sed -n -E 's/^[[:space:]]*POSTGRES_PASSWORD:[[:space:]]*//p' "$_compose" | head -1 | tr -d "\"'")
  _port=$(docker port studioscheduler-db 5432/tcp | head -1 | sed 's/.*://')
  export DEMO_CONN="Host=localhost;Port=${_port};Database=landing_demo;Username=postgres;Password=${_pass}"
  unset _pass _port
fi
unset _compose

_e2e="$WORK/studio-scheduler-admin/e2e/fullstack"
if [ -f "$_e2e/seed-users.sql" ]; then
  DEMO_HASH=$(grep -o '\$2a\$11\$[^'"'"']*' "$_e2e/seed-users.sql" | head -1)
  DEMO_PASSWORD=$(sed -n -E "s/^export const E2E_PASSWORD = '(.*)';/\1/p" "$_e2e/users.ts")
  export DEMO_HASH DEMO_PASSWORD
fi
unset _e2e

_psql() { docker exec studioscheduler-db psql -U postgres -d landing_demo -Atc "$1" 2>/dev/null; }
if [ "$(_psql 'SELECT 1')" = "1" ]; then
  TAB_ID=$(_psql "SELECT t.\"Id\" FROM \"Tabs\" t JOIN \"Scheduler\" s ON s.\"ScheduleID\" = t.\"ReservationId\" WHERE s.\"BandName\" = 'Ruído Branco'")
  ROOM_ID=$(_psql "SELECT \"RoomID\" FROM \"Rooms\" WHERE \"StudioID\" = 1 AND \"RoomName\" = 'Sala 2'")
  export TAB_ID ROOM_ID
fi
unset -f _psql
