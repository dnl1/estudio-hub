# Capturas do produto para a landing page

As imagens de `public/produto/` são capturas reais do admin e do app das bandas, feitas num ambiente
100% local, com dados fictícios. Nada aqui toca produção nem as cópias de trabalho do sistema.

## O que precisa estar pronto

- O container `studioscheduler-db` rodando (do `docker-compose.dev.yml` do StudioScheduler).
- .NET 8 em `~/.dotnet`, Node, pnpm e `gh` com login.
- As dependências do site instaladas (`npm ci`), que trazem o Playwright.

## Passo a passo

Todos os comandos rodam na raiz do site. Cada terminal novo precisa de
`source scripts/product-screens/vars.sh`, que monta as variáveis sem imprimir senhas. Para usar
outra pasta de trabalho, defina `PRODUCT_SCREENS_WORKDIR` antes.

1. **Clonar a `main` do sistema numa pasta à parte**, e não nas cópias de trabalho:
   ```bash
   source scripts/product-screens/vars.sh && mkdir -p "$WORK" && for r in StudioScheduler studio-scheduler-admin studio-scheduler-customer; do [ -d "$WORK/$r" ] || gh repo clone "dnl1/$r" "$WORK/$r" -- --depth 1 --branch main; done
   (cd "$WORK/studio-scheduler-admin" && pnpm install --frozen-lockfile) && (cd "$WORK/studio-scheduler-customer" && pnpm install --frozen-lockfile)
   ```
2. **Criar o banco `landing_demo`, aplicar as migrations e os dados fictícios:**
   ```bash
   source scripts/product-screens/vars.sh
   docker exec studioscheduler-db psql -U postgres -c 'DROP DATABASE IF EXISTS landing_demo;' -c 'CREATE DATABASE landing_demo;'
   (cd "$WORK/StudioScheduler" && CONNECTIONSTRINGS__MIGRATIONSCONNECTION="$DEMO_CONN" ASPNETCORE_ENVIRONMENT=Development dotnet run --project StudioScheduler.Migrations/StudioScheduler.Migrations.csproj)
   docker exec -i studioscheduler-db psql -U postgres -d landing_demo -v demo_hash="$DEMO_HASH" < scripts/product-screens/demo-seed.sql
   ```
3. **Subir a API (5150), o admin (5184) e o app das bandas (5185)**, cada um num terminal:
   ```bash
   source scripts/product-screens/vars.sh && cd "$WORK/StudioScheduler" && CONNECTIONSTRINGS__DEFAULTCONNECTION="$DEMO_CONN" ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5150 JwtSettings__Secret="$DEMO_JWT_SECRET" RateLimiting__Enabled=false Workers__EnableHostedWorkers=false dotnet run --project StudioScheduler/StudioScheduler.csproj --no-launch-profile
   source scripts/product-screens/vars.sh && cd "$WORK/studio-scheduler-admin" && VITE_API_BASE_URL=http://localhost:5150 VITE_PUBLIC_POSTHOG_KEY= VITE_PUBLIC_POSTHOG_HOST= pnpm exec vite --port 5184 --strictPort
   source scripts/product-screens/vars.sh && cd "$WORK/studio-scheduler-customer" && VITE_API_BASE_URL=http://localhost:5150 VITE_PUBLIC_POSTHOG_KEY= VITE_PUBLIC_POSTHOG_HOST= VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA pnpm exec vite --port 5185 --strictPort
   ```
4. **Capturar.** O script confere antes se a API é local, se o banco é local e se a organização é a
   fictícia, e para se algo não bater:
   ```bash
   source scripts/product-screens/vars.sh && node scripts/product-screens/capture.mjs
   ```
5. **Desligar tudo e apagar o banco:**
   `docker exec studioscheduler-db psql -U postgres -c 'DROP DATABASE landing_demo;'`
