# Landing page "grade da noite": plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** trocar o folheto atual de estudio-hub.com por uma landing page que leva o dono de estúdio a
agendar uma demonstração pelo WhatsApp, com a "grade da noite" no topo, telas reais do produto,
preços e dúvidas.

**Architecture:**
- Continua um site Next.js 15.5 exportado como estático. A página é composta por seções em
  `app/page.tsx`, o texto fica todo em `components/site-content.ts` e o estilo em
  `app/globals.css`, reescrito com os tokens da especificação.
- Só três partes usam JS no navegador: o menu ☰, a linha "agora" da grade e a barra fixa do
  celular.
- As telas do produto são capturadas uma vez, num ambiente local com dados fictícios, e entram como
  JPEG em `public/produto/`.

**Tech Stack:** Next.js 15.5.28 (`output: "export"`), React 19.0.9, TypeScript, CSS puro,
`next/font/google` (Archivo), `next/og` (`ImageResponse`), `@playwright/test` 1.63.0 (testes e
capturas), .NET 8 + Postgres 17 (Docker) + Vite (só para as capturas, fora do site).

**Spec:** `docs/superpowers/specs/2026-10-15-landing-grade-da-noite-design.md`

## Global Constraints

- **Onde trabalhar:** repositório `/Users/danilo/work/repos/estudio-hub`, branch
  `feat/landing-grade-da-noite`.
  - Nunca commitar na `main`.
  - Push na `main` publica em produção: só com aprovação explícita do Danilo, dizendo "isso faz
    deploy em produção" logo antes.
  - Push da branch não publica; a Cloudflare gera só um link de prévia.
- **Dependências:**
  - Nenhuma dependência nova de produção.
  - Em desenvolvimento entram `@playwright/test` **1.63.0** (exata; usa o Chromium 1243 que já
    está em `~/Library/Caches/ms-playwright`) e `@fontsource/archivo-narrow` **5.3.0** (exata).
    Sai `@fontsource/sora`.
  - Versões sempre exatas (`--save-exact`), como o resto do `package.json`.
- **Cores** (hex exatos):
  - Papel `#FFFFFF`, Espuma `#EDEEF0`, Tinta `#1F2125`, Azul `#3366FF`, Âmbar `#F5B700`,
    Vermelho `#E5484D`.
  - Verde do WhatsApp `#25D366` só no ícone.
  - Sem degradês.
- **Tipografia:**
  - Só Archivo, pelo `next/font/google` com o eixo `wdth`.
  - Títulos: `font-stretch: 75%`, peso 800. Texto: largura normal, peso 400.
  - Nada de `text-transform: uppercase`.
- **Texto:**
  - Português do Brasil, em frase normal.
  - O botão se chama "Agendar demonstração" em todo lugar; no primeiro bloco da página,
    "Agendar demonstração de 15 min".
- **Link da demonstração:** `https://wa.me/5511974571064?text=` + `encodeURIComponent("Oi! Quero
  agendar a demonstração de 15 min do EstudioHub.")`.
- **Preços** exatamente como na tabela da especificação.
- **Linha do cliente**, exatamente: "Em uso no Warzone, estúdio de ensaio em Santos (SP), nas
  unidades Canal 1 e Canal 3."
- **Nada de prometer pagamento online pela banda:** o app das bandas ainda não cobra na reserva.
- **Capturas:**
  - Só no ambiente local, banco `landing_demo`, com clones novos da `main` do GitHub.
  - Proibido tocar em `/Users/danilo/work/repos/studio-scheduler/*` (outra sessão trabalha lá) e no
    banco `postgres` do container.
  - Proibido logar no admin de produção.
- **Sandbox:** nesta máquina o sandbox impede abrir porta. Comandos que sobem servidor (testes
  Playwright, API, Vite) rodam com o sandbox desligado (`dangerouslyDisableSandbox`).
- **Shell:** o estado não persiste entre chamadas. Cada comando que usa as variáveis das capturas
  começa com `export PRODUCT_SCREENS_WORKDIR=...` e `source scripts/product-screens/vars.sh`.
- **Em todo commit:**
  - `npm run lint` e `npm run build` passando.
  - Mensagem em português no estilo do repositório (`feat:`, `fix:`, `chore:`, `test:`,
    `docs:`), terminando com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Visita de dia, fora das 18h às 0h de São Paulo** (a maioria das visitas): a linha "agora" tem
   de parar em 21h, nem no começo da grade nem fora dela. → teste "fora do horário da grade fica em
   21h" na Task 4.
2. **Visitante em outro fuso** (Lisboa, Manaus): a linha "agora" usa a hora de São Paulo, não a do
   navegador. → teste com `timezoneId: "Europe/Lisbon"` na Task 4.
3. **Acentos e "!" na mensagem pronta do WhatsApp:** o `text` decodificado de cada link tem de ser
   idêntico à mensagem. → teste do botão do topo na Task 3 e de todos os links na Task 7.
4. **Link do menu no celular com o topo fixo:** a seção escolhida não pode ficar escondida atrás do
   topo. → teste "link do menu leva a seção para baixo do topo fixo" na Task 6.
5. **Sem JavaScript, ou antes de carregar:** o conteúdo, os preços e o botão de demonstração
   aparecem, porque tudo é HTML estático. → teste "conteúdo aparece sem JavaScript" na Task 9.

---

## Mapa de arquivos

| Arquivo | Responsabilidade | Task |
|---|---|---|
| `package.json` | devDependencies e script `test:e2e` | 1, 8 |
| `playwright.config.ts` | config dos testes (build + servidor estático) | 1 |
| `e2e/serve-out.mjs` | servidor estático mínimo de `out/` para os testes | 1 |
| `e2e/helpers.ts` | larguras, mensagem e funções comuns dos testes | 1 |
| `e2e/smoke.spec.ts` | a página carrega | 1 |
| `scripts/product-screens/README.md` | como refazer as capturas | 2 |
| `scripts/product-screens/vars.sh` | variáveis do ambiente local, sem imprimir senhas | 2 |
| `scripts/product-screens/demo-seed.sql` | dados fictícios no banco `landing_demo` | 2 |
| `scripts/product-screens/capture.mjs` | travas de segurança e capturas com Playwright | 2 |
| `public/produto/*.jpg` | as três capturas | 2 |
| `app/layout.tsx` | fonte Archivo, metadados, topo e rodapé | 3 |
| `app/globals.css` | tokens e estilos (base na Task 3; cada seção acrescenta o seu) | 3–7 |
| `components/site-content.ts` | todo o texto e os dados da página | 3 |
| `components/whatsapp.tsx` | link da demonstração, botão e ícone | 3 |
| `components/site-chrome.tsx` | topo (com menu ☰) e rodapé | 3 |
| `app/page.tsx` | composição das seções | 3–7 |
| `e2e/header.spec.ts` | topo em todas as larguras, menu, link, fonte | 3 |
| `components/night-grid.tsx` | a grade da noite (HTML/CSS) | 4 |
| `components/playhead.tsx` | a linha "agora" (cliente) | 4 |
| `e2e/hero.spec.ts` | primeira tela, grade acessível, linha "agora" | 4 |
| `components/product-shot.tsx` | moldura das capturas, tamanho lido do JPEG | 5 |
| `components/whatsapp-bubble.tsx` | balão com o texto real da confirmação | 5 |
| `next.config.mjs` | `images.unoptimized` para o `next/image` no export | 5 |
| `e2e/sections.spec.ts` | como funciona, também tem, para quem | 5 |
| `e2e/pricing.spec.ts` | como começar, preços, dúvidas, âncoras | 6 |
| `components/sticky-cta.tsx` | barra fixa do celular | 7 |
| `e2e/cta.spec.ts` | links do WhatsApp, barra fixa, contato | 7 |
| `components/brand-image.tsx` | monograma e fonte das imagens geradas | 8 |
| `app/og-image.png/route.tsx`, `app/icon-64.png/route.tsx`, `app/apple-touch-icon.png/route.tsx` | imagens geradas no build | 8 |
| `e2e/brand.spec.ts` | ícone e prévia de link | 8 |
| `e2e/page.spec.ts`, `e2e/contrast.spec.ts` | página inteira, acessibilidade, contraste | 9 |
| `README.md`, `.gitignore`, `eslint.config.mjs` | documentação e ignorados | 1, 9 |

---

### Task 1: Base de testes com Playwright

**Files:**
- Modify: `package.json` (devDependency `@playwright/test`, script `test:e2e`)
- Create: `playwright.config.ts`, `e2e/serve-out.mjs`, `e2e/helpers.ts`, `e2e/smoke.spec.ts`
- Modify: `.gitignore`, `eslint.config.mjs`

**Interfaces:**
- Produces:
  - `npm run test:e2e`: faz o build e serve `out/` em `http://127.0.0.1:4300`.
  - `e2e/helpers.ts` exporta `WIDTHS: number[]`, `DEMO_MESSAGE: string`,
    `open(page, width, height?)` e `expectNoHorizontalScroll(page)`.

- [ ] **Step 1: Instalar o Playwright na versão do Chromium em cache**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm install --save-exact --save-dev --no-fund @playwright/test@1.63.0 && npx playwright --version && ls ~/Library/Caches/ms-playwright | grep chromium-1243
```
Expected: `Version 1.63.0` and `chromium-1243`. If `chromium-1243` is missing, run
`npx playwright install chromium`.

- [ ] **Step 2: Criar o servidor estático dos testes**

Create `e2e/serve-out.mjs`:
```js
// Servidor estático mínimo para os testes: serve out/ como a Cloudflare Pages
// (tipo pelo nome do arquivo; /caminho cai em /caminho.html ou /caminho/index.html).
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "out");
const port = Number(process.argv[2] ?? 4300);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon"
};

function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0]));
  for (const candidate of [clean, join(clean, "index.html"), `${clean}.html`]) {
    const file = join(root, candidate);
    if (!file.startsWith(root)) continue;
    try {
      if (statSync(file).isFile()) return file;
    } catch {
      // não existe: tenta o próximo
    }
  }
  return null;
}

createServer((req, res) => {
  const file = resolveFile(req.url ?? "/");
  if (!file) {
    res.writeHead(404, { "content-type": types[".html"] });
    createReadStream(join(root, "404.html")).pipe(res);
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`out/ em http://127.0.0.1:${port}`));
```

- [ ] **Step 3: Criar a configuração e os utilitários**

Create `playwright.config.ts`:
```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 4300;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://127.0.0.1:${PORT}`
  },
  webServer: {
    command: `npm run build && node e2e/serve-out.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: false,
    timeout: 180_000
  }
});
```

Create `e2e/helpers.ts`:
```ts
import { expect, type Page } from "@playwright/test";

export const WIDTHS = [320, 390, 720, 721, 1024, 1101, 1200, 1280, 1366, 1440, 1920];
export const DEMO_MESSAGE = "Oi! Quero agendar a demonstração de 15 min do EstudioHub.";

export async function open(page: Page, width: number, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}

export async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(scrollWidth, "rolagem horizontal").toBeLessThanOrEqual(clientWidth);
}
```

Create `e2e/smoke.spec.ts`:
```ts
import { expect, test } from "@playwright/test";

test("a página inicial carrega com o nome do EstudioHub", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/EstudioHub/);
});
```

- [ ] **Step 4: Script, ignorados e lint**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm pkg set scripts.test:e2e="playwright test" && printf '\ntest-results\nplaywright-report\n' >> .gitignore && tail -4 .gitignore
```

Modify `eslint.config.mjs`, replacing the `ignores` line with:
```js
    ignores: ["node_modules/**", ".next/**", "out/**", "next-env.d.ts", "test-results/**", "playwright-report/**"]
```

- [ ] **Step 5: Rodar o teste (sandbox desligado: abre porta)**

Run: `cd /Users/danilo/work/repos/estudio-hub && npm run test:e2e`
Expected: `1 passed`.

- [ ] **Step 6: Lint, build e commit**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm run lint && npm run build && git add package.json package-lock.json playwright.config.ts e2e .gitignore eslint.config.mjs && git commit -q -F - <<'EOF'
test: adiciona testes de navegador com Playwright

Os testes fazem o build e servem out/ num servidor estático mínimo, como
a Cloudflare Pages. Usa o Playwright 1.63.0 para aproveitar o Chromium já
baixado nesta máquina.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 2: Capturas reais do produto com dados fictícios

**Files:**
- Create: `scripts/product-screens/README.md`, `scripts/product-screens/vars.sh`,
  `scripts/product-screens/demo-seed.sql`, `scripts/product-screens/capture.mjs`
- Create (gerados): `public/produto/agenda-bandas.jpg`, `public/produto/comanda.jpg`,
  `public/produto/recebimento.jpg`

**Interfaces:**
- Consumes: `@playwright/test` (Task 1).
- Produces: os três JPEGs em 2x, que a Task 5 usa. Os nomes dos arquivos são fixos.

Pasta de trabalho desta sessão (temporária, fora do repositório):
`/private/tmp/claude-501/-Users-danilo-work-repos/141d80ce-5433-4cc0-8e2b-c7163f9eac3d/scratchpad/product-screens`.
Nos comandos abaixo ela aparece como `$PSW`.

- [ ] **Step 1: Escrever as variáveis do ambiente**

Create `scripts/product-screens/vars.sh`:
```bash
# Variáveis do ambiente local das capturas. Uso: source scripts/product-screens/vars.sh
# Não imprime nada: a senha do banco local e a da conta de teste ficam só nas variáveis.
export WORK="${PRODUCT_SCREENS_WORKDIR:-$HOME/.cache/estudio-hub-product-screens}"
export PATH="$HOME/.dotnet:$PATH"
export DOTNET_ROOT="$HOME/.dotnet"
export DEMO_EMAIL="gestora@estudio-exemplo.test"

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
```

- [ ] **Step 2: Escrever os dados fictícios**

Create `scripts/product-screens/demo-seed.sql`:
```sql
-- Dados fictícios para as capturas da landing page do EstudioHub.
-- Roda só no banco local landing_demo, depois do StudioScheduler.Migrations (schema + seed padrão).
-- Recebe o hash da senha da conta fictícia na variável :demo_hash (veja o README).
\set ON_ERROR_STOP on

DO $$
BEGIN
  IF current_database() <> 'landing_demo' THEN
    RAISE EXCEPTION 'demo-seed.sql só roda no banco landing_demo (atual: %)', current_database();
  END IF;
END $$;

BEGIN;

-- Data e hora de São Paulo convertidas para timestamptz
CREATE FUNCTION pg_temp.sp(dia date, hora text) RETURNS timestamptz
LANGUAGE sql STABLE AS $$ SELECT (dia + hora::time) AT TIME ZONE 'America/Sao_Paulo' $$;

CREATE TEMP TABLE ref AS
SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS hoje,
       date_trunc('week', now() AT TIME ZONE 'America/Sao_Paulo')::date + 7 AS proxima_segunda;

-- Organização, unidades e salas com nomes fictícios (o seed padrão traz a organização real)
UPDATE "Organizations"
SET "Name" = 'Estúdio Exemplo', "Slug" = 'exemplo', "Responsible" = 'Equipe EstudioHub',
    "Email" = 'demo@estudio-exemplo.test', "MobileNumber" = '+5511900000000'
WHERE "OrganizationID" = 1;

UPDATE "Studios" SET "Name" = 'Unidade Centro', "Address" = 'Rua Exemplo, 100 - São Paulo/SP',
  "ContactNumber" = '(11) 90000-0000' WHERE "StudioID" = 1;
UPDATE "Studios" SET "Name" = 'Unidade Norte', "Address" = 'Rua Exemplo, 200 - São Paulo/SP',
  "ContactNumber" = '(11) 90000-0001' WHERE "StudioID" = 2;

UPDATE "Rooms" SET "RoomName" = 'Sala 1' WHERE "RoomID" = 1;
UPDATE "Rooms" SET "RoomName" = 'Sala A' WHERE "RoomID" = 2;
INSERT INTO "Rooms" ("StudioID", "RoomName", "MinimumBookingHours") VALUES (1, 'Sala 2', 1), (1, 'Sala 3', 1);

CREATE TEMP TABLE sala AS
SELECT "RoomID" AS id, "RoomName" AS nome FROM "Rooms" WHERE "StudioID" = 1;

-- Usuários do seed padrão ficam desativados e sem email real; entra só a gestora fictícia
UPDATE "Users" SET "IsActive" = false, "Email" = 'desativado-' || "UserId" || '@estudio-exemplo.test';
INSERT INTO "Users" ("Name", "Email", "PasswordHash", "Role", "OrganizationId", "ActiveOrganizationId",
                     "FavoriteStudioId", "IsActive")
VALUES ('Marina', 'gestora@estudio-exemplo.test', :'demo_hash', 'Manager', 1, 1, 1, true);

-- Licença gratuita e isenta de cobrança, para o admin não pedir assinatura
INSERT INTO "OrganizationLicenses" ("OrganizationId", "LicensePlanId", "BillingCycle", "PriceSnapshot",
  "StartDate", "EndDate", "Status", "GrantType", "IsBillingExempt", "GrantReason")
SELECT 1, "Id", NULL, 0, now() - interval '30 days', now() + interval '5 years', 'Active', 'Free', true,
       'Demonstração local para capturas da landing page'
FROM "LicensePlans" WHERE "Code" = 'scale';

-- Disponibilidade e preço de ensaio das salas da Unidade Centro
DELETE FROM "RoomAvailability" WHERE "RoomId" IN (SELECT id FROM sala);
INSERT INTO "RoomAvailability" ("RoomId", "DayOfWeek", "StartHour", "EndHour")
SELECT sala.id, dia, time '10:00', time '23:00' FROM sala CROSS JOIN generate_series(0, 6) AS dia;

DELETE FROM "RehearsalPriceRules" WHERE "RoomId" IN (SELECT id FROM sala);
INSERT INTO "RehearsalPriceRules" ("RoomId", "DayOfWeek", "StartTime", "EndTime", "Price",
  "MonthlyMemberPrice", "Priority", "ValidFrom", "IsActive")
SELECT sala.id, dia, faixa.inicio, faixa.fim, faixa.preco, faixa.preco_mensalista, 0,
       now() - interval '1 year', true
FROM sala
CROSS JOIN generate_series(0, 6) AS dia
CROSS JOIN (VALUES (time '10:00', time '18:00', 80.00, 70.00),
                   (time '18:00', time '23:00', 120.00, 100.00)) AS faixa(inicio, fim, preco, preco_mensalista);

-- Estoque dos produtos da Unidade Centro
INSERT INTO "ProductStocks" ("OrganizationId", "StudioId", "ProductId", "Quantity")
SELECT "OrganizationId", "StudioId", "Id", 24 FROM "Products" WHERE "StudioId" = 1
ON CONFLICT DO NOTHING;
UPDATE "Products" SET "StockQuantity" = 24 WHERE "StudioId" = 1;

-- Próxima semana da Sala 2: reservas avulsas (uma pendente), dois mensalistas e um bloqueio
INSERT INTO "Scheduler" ("RoomID", "BandName", "ContactName", "Email", "MobileNumber", "StartDate",
  "EndDate", "Status", "CreatedAt")
SELECT (SELECT id FROM sala WHERE nome = 'Sala 2'), b.banda, b.contato, b.email, b.celular,
       pg_temp.sp(ref.proxima_segunda + b.dia, b.inicio), pg_temp.sp(ref.proxima_segunda + b.dia, b.fim),
       b.status, now()
FROM ref, (VALUES
  ('Lia Trio', 'Lia', 'lia@banda.test', '+5511900000001', 0, '19:00', '21:00', 'Confirmed'),
  ('Banda Norte', 'Caio', 'caio@banda.test', '+5511900000002', 2, '20:00', '22:00', 'Confirmed'),
  ('Fuzz Club', 'Rafa', 'rafa@banda.test', '+5511900000003', 4, '18:00', '20:00', 'Pending'),
  ('Maré Alta', 'Bia', 'bia@banda.test', '+5511900000004', 5, '15:00', '18:00', 'Confirmed')
) AS b(banda, contato, email, celular, dia, inicio, fim, status);

INSERT INTO "MonthlyContracts" ("RoomID", "BandName", "ContactName", "MobileNumber", "StartDate",
  "EndDate", "Weekday", "StartTime", "EndTime", "IntervalWeeks", "CreatedAt")
SELECT (SELECT id FROM sala WHERE nome = 'Sala 2'), m.banda, m.contato, m.celular,
       pg_temp.sp(ref.hoje - 60, '00:00'), NULL, m.dia_semana, m.inicio::interval, m.fim::interval, 1, now()
FROM ref, (VALUES
  ('Os Cobras', 'Duda', '+5511900000005', 2, '19:00', '22:00'),
  ('Quarto Escuro', 'Téo', '+5511900000006', 4, '20:00', '22:00')
) AS m(banda, contato, celular, dia_semana, inicio, fim);

INSERT INTO "RoomBlocks" ("RoomId", "StartDate", "EndDate", "Reason")
SELECT (SELECT id FROM sala WHERE nome = 'Sala 2'), pg_temp.sp(ref.proxima_segunda + 2, '14:00'),
       pg_temp.sp(ref.proxima_segunda + 2, '17:00'), 'Manutenção do ar-condicionado'
FROM ref;

-- Hoje na Sala 1: reserva da Ruído Branco com a comanda aberta, dividida entre três pessoas
INSERT INTO "Scheduler" ("RoomID", "BandName", "ContactName", "Email", "MobileNumber", "StartDate",
  "EndDate", "Status", "CreatedAt")
SELECT (SELECT id FROM sala WHERE nome = 'Sala 1'), 'Ruído Branco', 'Nina', 'nina@banda.test',
       '+5511900000007', pg_temp.sp(ref.hoje, '19:00'), pg_temp.sp(ref.hoje, '21:00'), 'Confirmed', now()
FROM ref
RETURNING "ScheduleID" AS reserva_id \gset

INSERT INTO "Tabs" ("OrganizationId", "StudioId", "ReservationId", "Status", "TotalAmount")
VALUES (1, 1, :reserva_id, 'OPEN', 0)
RETURNING "Id" AS comanda_id \gset

-- Mesmo formato que o sistema usa: horas como quantidade e preço por hora
INSERT INTO "TabItems" ("TabId", "ProductId", "ItemType", "Description", "Quantity", "UnitPrice", "Total",
  "IsPaid", "RowVersion")
VALUES (:comanda_id, NULL, 'RehearsalCharge', 'Ensaio da reserva #' || :reserva_id, 2, 120.00, 240.00,
        false, '\x'::bytea);

INSERT INTO "TabItems" ("TabId", "ProductId", "ItemType", "Description", "Quantity", "UnitPrice", "Total",
  "IsPaid", "RowVersion")
SELECT :comanda_id, p."Id", 'Product', p."Name", q.quantidade, p."SalePrice", p."SalePrice" * q.quantidade,
       false, '\x'::bytea
FROM (VALUES ('Cerveja', 4), ('Água', 2), ('Cordas de Guitarra', 1), ('Baquetas', 1)) AS q(nome, quantidade)
JOIN LATERAL (SELECT "Id", "Name", "SalePrice" FROM "Products"
              WHERE "StudioId" = 1 AND "Name" = q.nome ORDER BY "Id" LIMIT 1) p ON true;

INSERT INTO "TabParticipants" ("TabId") VALUES (:comanda_id), (:comanda_id), (:comanda_id);

-- O ensaio é dividido entre as três pessoas; cada produto fica com uma delas
INSERT INTO "TabItemSplits" ("TabItemId", "TabParticipantId")
SELECT item."Id", pessoa."Id"
FROM "TabItems" item
JOIN (SELECT "Id", row_number() OVER (ORDER BY "Id") AS n
      FROM "TabParticipants" WHERE "TabId" = :comanda_id) pessoa
  ON item."ItemType" = 'RehearsalCharge'
  OR (item."Description", pessoa.n) IN (('Cerveja', 1), ('Baquetas', 1), ('Água', 2), ('Cordas de Guitarra', 3))
WHERE item."TabId" = :comanda_id;

UPDATE "Tabs" SET "TotalAmount" = (SELECT sum("Total") FROM "TabItems" WHERE "TabId" = :comanda_id)
WHERE "Id" = :comanda_id;

-- Conferência: falha se algum produto do seed padrão mudou de nome e ficou de fora
DO $$
DECLARE itens int;
BEGIN
  SELECT count(*) INTO itens FROM "TabItems" t JOIN "Tabs" c ON c."Id" = t."TabId" WHERE c."Status" = 'OPEN';
  IF itens <> 5 THEN
    RAISE EXCEPTION 'Comanda de demonstração com % itens (esperado 5): confira os nomes dos produtos', itens;
  END IF;
END $$;

COMMIT;
```

- [ ] **Step 3: Testar a trava do script antes de usar (precisa falhar fora do landing_demo)**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && docker exec studioscheduler-db psql -U postgres -c 'CREATE DATABASE landing_guard_test;' && docker exec -i studioscheduler-db psql -U postgres -d landing_guard_test -v demo_hash=x < scripts/product-screens/demo-seed.sql; echo "exit=$?"; docker exec studioscheduler-db psql -U postgres -c 'DROP DATABASE landing_guard_test;'
```
Expected: `ERROR:  demo-seed.sql só roda no banco landing_demo (atual: landing_guard_test)` and
`exit=3`.

- [ ] **Step 4: Escrever o script de captura**

Create `scripts/product-screens/capture.mjs`:
```js
// Captura as telas reais do produto para a landing page, a partir do ambiente local de demonstração.
// Uso: veja scripts/product-screens/README.md.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const API = "http://localhost:5150";
const ADMIN = "http://localhost:5184";
const CUSTOMER = "http://localhost:5185";
const OUT = join(process.cwd(), "public", "produto");
const JPEG = { type: "jpeg", quality: 82 };
const { DEMO_EMAIL, DEMO_PASSWORD, TAB_ID, ROOM_ID } = process.env;

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

if (!DEMO_EMAIL || !DEMO_PASSWORD || !TAB_ID || !ROOM_ID) {
  fail("Faltam variáveis: rode `source scripts/product-screens/vars.sh` antes (veja o README).");
}

// 1. Travas: API local, banco local e organização fictícia
const health = await fetch(`${API}/health`).catch(() => null);
if (!health?.ok) fail(`API fora do ar em ${API}.`);

const login = await fetch(`${API}/api/admin/Login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
});
if (!login.ok) fail(`Login da conta fictícia falhou (${login.status}).`);
const { accessToken } = await login.json();
const auth = { headers: { Authorization: `Bearer ${accessToken}` } };

const target = await (await fetch(`${API}/api/environment/database-target`, auth)).json();
if (target.databaseEnvironment !== "LOCAL") {
  fail(`A API informou banco "${target.databaseEnvironment}"; só capturo com banco LOCAL.`);
}

const studios = JSON.stringify(await (await fetch(`${API}/api/admin/studios`, auth)).json());
if (!studios.includes("Unidade Centro") || /warzone/i.test(studios)) {
  fail("A API não está no banco de demonstração (landing_demo): unidades com nome inesperado.");
}

// 2. Navegador: só localhost, sem service worker, tema claro, 2x
const browser = await chromium.launch();

async function newPage(viewport) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    colorScheme: "light",
    serviceWorkers: "block",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo"
  });
  await context.route("**/*", (route) => {
    const { hostname } = new URL(route.request().url());
    return hostname === "localhost" || hostname === "127.0.0.1" ? route.continue() : route.abort();
  });
  return context.newPage();
}

await mkdir(OUT, { recursive: true });

// 3. App das bandas: próxima semana da Sala 2 (sem dias passados)
{
  const page = await newPage({ width: 1280, height: 900 });
  await page.addInitScript(() =>
    localStorage.setItem("studio-scheduler-customer:install-prompt-dismissed", "true")
  );
  await page.goto(`${CUSTOMER}/exemplo/${ROOM_ID}`);
  const schedule = page.locator("section.week-schedule:not(.week-schedule--loading)");
  await schedule.waitFor();
  await page.getByRole("button", { name: "Ir para a proxima semana" }).click();
  await page.waitForLoadState("networkidle");
  await schedule.screenshot({ path: join(OUT, "agenda-bandas.jpg"), ...JPEG });
  console.log("✔ agenda-bandas.jpg");
}

// 4. Admin: comanda da Sala 1 e janela de recebimento (sem confirmar o recebimento)
{
  const page = await newPage({ width: 1280, height: 1000 });
  // Esconde o selo "LOCAL" do topo do admin: com erro nessa consulta, o admin não mostra selo.
  await page.route(`${API}/api/environment/database-target`, (route) => route.fulfill({ status: 500, body: "" }));
  await page.goto(`${ADMIN}/login`);
  await page.getByLabel("E-mail").fill(DEMO_EMAIL);
  await page.getByLabel("Senha").fill(DEMO_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(/\/dashboard$/);

  await page.goto(`${ADMIN}/admin/tabs/${TAB_ID}`);
  await page.getByRole("heading", { name: `Comanda #${TAB_ID}` }).waitFor();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3500); // o aviso de login some sozinho em 3 s
  await page.screenshot({ path: join(OUT, "comanda.jpg"), ...JPEG });
  console.log("✔ comanda.jpg");

  for (const item of ["Cerveja", "Baquetas"]) {
    await page.getByRole("checkbox", { name: new RegExp(`Selecionar item .*${item}`) }).check();
  }
  await page.getByRole("button", { name: "Marcar selecionados como pago" }).click();
  const modal = page.locator(".modal.show .modal-content").filter({ hasText: "Receber itens selecionados" });
  await modal.waitFor();
  await modal.screenshot({ path: join(OUT, "recebimento.jpg"), ...JPEG });
  await modal.getByRole("button", { name: "Cancelar" }).click();
  console.log("✔ recebimento.jpg");
}

await browser.close();
```

- [ ] **Step 5: Escrever o README das capturas**

Create `scripts/product-screens/README.md`:
````markdown
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
   source scripts/product-screens/vars.sh && cd "$WORK/StudioScheduler" && CONNECTIONSTRINGS__DEFAULTCONNECTION="$DEMO_CONN" ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5150 RateLimiting__Enabled=false Workers__EnableHostedWorkers=false dotnet run --project StudioScheduler/StudioScheduler.csproj --no-launch-profile
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
````

- [ ] **Step 6: Clonar a `main` do sistema e instalar as dependências**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && export PRODUCT_SCREENS_WORKDIR=/private/tmp/claude-501/-Users-danilo-work-repos/141d80ce-5433-4cc0-8e2b-c7163f9eac3d/scratchpad/product-screens && source scripts/product-screens/vars.sh && mkdir -p "$WORK" && for r in StudioScheduler studio-scheduler-admin studio-scheduler-customer; do [ -d "$WORK/$r" ] || gh repo clone "dnl1/$r" "$WORK/$r" -- --depth 1 --branch main; done && (cd "$WORK/studio-scheduler-admin" && pnpm install --frozen-lockfile) && (cd "$WORK/studio-scheduler-customer" && pnpm install --frozen-lockfile) && git -C "$WORK/StudioScheduler" log --oneline -1
```
Expected: the three clones exist and pnpm finishes. The `StudioScheduler` commit is the current
`main` on GitHub.

- [ ] **Step 7: Criar o banco, rodar as migrations e os dados fictícios**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && export PRODUCT_SCREENS_WORKDIR=/private/tmp/claude-501/-Users-danilo-work-repos/141d80ce-5433-4cc0-8e2b-c7163f9eac3d/scratchpad/product-screens && source scripts/product-screens/vars.sh && docker exec studioscheduler-db psql -U postgres -c 'DROP DATABASE IF EXISTS landing_demo;' -c 'CREATE DATABASE landing_demo;' && (cd "$WORK/StudioScheduler" && CONNECTIONSTRINGS__MIGRATIONSCONNECTION="$DEMO_CONN" ASPNETCORE_ENVIRONMENT=Development dotnet run --project StudioScheduler.Migrations/StudioScheduler.Migrations.csproj 2>&1 | tail -5) && docker exec -i studioscheduler-db psql -U postgres -d landing_demo -v demo_hash="$DEMO_HASH" < scripts/product-screens/demo-seed.sql && source scripts/product-screens/vars.sh && echo "TAB_ID=$TAB_ID ROOM_ID=$ROOM_ID"
```
Expected:
- the migrations finish without error;
- the seed ends with `COMMIT`;
- `TAB_ID` and `ROOM_ID` are numbers.

If the conference step raises "Comanda de demonstração com N itens", list the products with
`docker exec studioscheduler-db psql -U postgres -d landing_demo -c 'SELECT "Name" FROM "Products" WHERE "StudioId" = 1'`,
fix the names in `demo-seed.sql` and rerun this step.

- [ ] **Step 8: Subir API, admin e app das bandas em segundo plano (sandbox desligado)**

Run each as a separate background Bash command:
```bash
cd /Users/danilo/work/repos/estudio-hub && export PRODUCT_SCREENS_WORKDIR=/private/tmp/claude-501/-Users-danilo-work-repos/141d80ce-5433-4cc0-8e2b-c7163f9eac3d/scratchpad/product-screens && source scripts/product-screens/vars.sh && cd "$WORK/StudioScheduler" && CONNECTIONSTRINGS__DEFAULTCONNECTION="$DEMO_CONN" ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5150 RateLimiting__Enabled=false Workers__EnableHostedWorkers=false exec dotnet run --project StudioScheduler/StudioScheduler.csproj --no-launch-profile
```
```bash
cd /Users/danilo/work/repos/estudio-hub && export PRODUCT_SCREENS_WORKDIR=/private/tmp/claude-501/-Users-danilo-work-repos/141d80ce-5433-4cc0-8e2b-c7163f9eac3d/scratchpad/product-screens && source scripts/product-screens/vars.sh && cd "$WORK/studio-scheduler-admin" && VITE_API_BASE_URL=http://localhost:5150 VITE_PUBLIC_POSTHOG_KEY= VITE_PUBLIC_POSTHOG_HOST= exec pnpm exec vite --port 5184 --strictPort
```
```bash
cd /Users/danilo/work/repos/estudio-hub && export PRODUCT_SCREENS_WORKDIR=/private/tmp/claude-501/-Users-danilo-work-repos/141d80ce-5433-4cc0-8e2b-c7163f9eac3d/scratchpad/product-screens && source scripts/product-screens/vars.sh && cd "$WORK/studio-scheduler-customer" && VITE_API_BASE_URL=http://localhost:5150 VITE_PUBLIC_POSTHOG_KEY= VITE_PUBLIC_POSTHOG_HOST= VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA exec pnpm exec vite --port 5185 --strictPort
```
Then wait until all three answer:
`until curl -sf http://localhost:5150/health >/dev/null && curl -sf http://localhost:5184 >/dev/null && curl -sf http://localhost:5185 >/dev/null; do sleep 2; done`,
run as a background command with a timeout.

- [ ] **Step 9: Capturar**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && export PRODUCT_SCREENS_WORKDIR=/private/tmp/claude-501/-Users-danilo-work-repos/141d80ce-5433-4cc0-8e2b-c7163f9eac3d/scratchpad/product-screens && source scripts/product-screens/vars.sh && node scripts/product-screens/capture.mjs && file public/produto/*.jpg && du -k public/produto/*.jpg
```
Expected:
- `✔ agenda-bandas.jpg`, `✔ comanda.jpg`, `✔ recebimento.jpg`;
- three `JPEG image data` files;
- each one at most 350 KB. If any is bigger, lower `quality` in `capture.mjs` to 72 and capture
  again.

If a locator times out, open the page in the Playwright MCP browser at the same URL, look at the
snapshot, and fix only that locator in `capture.mjs`. Keep the same screen and the same safety
checks.

- [ ] **Step 10: Revisar as três imagens**

Open each JPEG with the Read tool and check:
- no "LOCAL" badge;
- no "Warzone";
- no real name, email or phone;
- the week grid shows next week with taken slots (mensalistas on Tuesday and Thursday, the
  Wednesday block, the bookings);
- the comanda shows the rehearsal, the 4 products and the split panel;
- the receive window shows Pix, Crédito, Débito and Dinheiro.

Anything wrong → fix the seed or the script and repeat Steps 7–9.

- [ ] **Step 11: Desligar os serviços e apagar o banco**

Stop the three background commands (TaskStop). Then run
`docker exec studioscheduler-db psql -U postgres -c 'DROP DATABASE landing_demo;'`.
Expected: `DROP DATABASE`.

- [ ] **Step 12: Commit**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm run lint && git add scripts/product-screens public/produto && git commit -q -F - <<'EOF'
feat: capturas reais do produto para a landing page

Admin e app das bandas rodando localmente sobre um banco landing_demo com
dados fictícios. O script de dados se recusa a rodar fora desse banco e o
de captura confere API local, banco local e organização fictícia antes de
abrir o navegador.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 3: Tokens, fonte, botão do WhatsApp, topo e rodapé

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css` (reescrito), `components/site-chrome.tsx` (reescrito),
  `components/site-content.ts` (reescrito), `app/page.tsx` (reescrito)
- Create: `components/whatsapp.tsx`, `e2e/header.spec.ts`

**Interfaces:**
- Consumes: `e2e/helpers.ts` (Task 1).
- Produces:
  - `components/whatsapp.tsx` exports `WHATSAPP_DISPLAY: string`, `DEMO_URL: string`,
    `WhatsAppIcon()` and `DemoButton({ children?, className?, id? })`. `DemoButton` renders
    `<a class="btn btn-demo …" href={DEMO_URL}>` with the icon.
  - `components/site-content.ts` exports `ADMIN_URL`, `CONTACT_EMAIL`, `navLinks`, `hero`,
    `BookingKind`, `NightBooking`, `bookingKindLabel`, `nightGrid`, `ProductShotImage`,
    `ProductRow`, `productSection`, `whatsappConfirmation`, `extras`, `audience`, `steps`, `Plan`,
    `pricing`, `faq`, `contact` and `footer` (used by Tasks 3–7).
  - Section ids used in later tasks: `#topo`, `#como-funciona`, `#tambem-tem`, `#para-quem`,
    `#como-comecar`, `#precos`, `#duvidas`, `#contato`.
  - CSS classes for later tasks: `.container`, `.section`, `.section--espuma`, `.section-head`,
    `.btn`, `.btn-demo`, `.sr-only`.

- [ ] **Step 1: Escrever o teste do topo (falha: topo antigo)**

Create `e2e/header.spec.ts`:
```ts
import { expect, test } from "@playwright/test";
import { DEMO_MESSAGE, WIDTHS, expectNoHorizontalScroll, open } from "./helpers";

for (const width of WIDTHS) {
  test(`topo em ${width}px: uma linha e nada fora da tela`, async ({ page }) => {
    await open(page, width);
    await expectNoHorizontalScroll(page);
    const header = (await page.locator(".site-header").boundingBox())!;
    expect(header.height, "altura do topo").toBeLessThanOrEqual(73);
    for (const selector of [".logo", ".menu-toggle", ".header-cta", "#main-navigation a"]) {
      for (const element of await page.locator(selector).all()) {
        if (!(await element.isVisible())) continue;
        const box = (await element.boundingBox())!;
        expect(box.x, `${selector} começa fora da tela`).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width, `${selector} passa da borda`).toBeLessThanOrEqual(width + 0.5);
      }
    }
    const desktop = width >= 900;
    await expect(page.locator("#main-navigation")).toBeVisible({ visible: desktop });
    await expect(page.locator(".menu-toggle")).toBeVisible({ visible: !desktop });
    await expect(page.locator(".header-cta")).toBeVisible({ visible: width >= 400 });
  });
}

test("menu ☰ abre com os links e fecha ao escolher um", async ({ page }) => {
  await open(page, 390, 844);
  await page.getByRole("button", { name: "Abrir menu" }).click();
  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link")).toHaveText(["Como funciona", "Preços", "Dúvidas", "Entrar"]);
  await nav.getByRole("link", { name: "Dúvidas" }).click();
  await expect(nav).toBeHidden();
  await expect(page.locator(".menu-toggle")).toHaveAttribute("aria-expanded", "false");
});

test("botão do topo abre o WhatsApp com a mensagem pronta", async ({ page }) => {
  await open(page, 1280);
  const url = new URL((await page.locator(".header-cta").getAttribute("href"))!);
  expect(`${url.origin}${url.pathname}`).toBe("https://wa.me/5511974571064");
  expect(url.searchParams.get("text")).toBe(DEMO_MESSAGE);
  await expect(page.locator(".header-cta")).toHaveText("Agendar demonstração");
});

test("Archivo carregada e condensada de verdade nos títulos", async ({ page }) => {
  await open(page, 1280);
  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    const loaded = [...document.fonts].some((face) => face.family.includes("Archivo") && face.status === "loaded");
    const measure = (stretch: string) => {
      const span = document.createElement("span");
      span.textContent = "EstudioHub agenda das salas";
      span.style.cssText = `position:absolute;white-space:nowrap;font-family:var(--fonte);font-weight:800;font-size:40px;font-stretch:${stretch}`;
      document.body.append(span);
      const width = span.getBoundingClientRect().width;
      span.remove();
      return width;
    };
    return { loaded, condensada: measure("75%"), normal: measure("100%") };
  });
  expect(result.loaded).toBe(true);
  expect(result.condensada).toBeLessThan(result.normal * 0.9);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/header.spec.ts`
Expected: FAIL. The current header has no "Abrir menu" button at 1280, the CTA text is "Quero uma
demonstração" and its `href` is `#contato`, and Archivo is not loaded.

- [ ] **Step 3: Escrever o conteúdo da página**

Replace `components/site-content.ts` with:
```ts
export const ADMIN_URL = "https://admin.estudio-hub.com";
export const CONTACT_EMAIL = "contato@estudio-hub.com";

export type LinkItem = {
  href: string;
  label: string;
};

export const navLinks: LinkItem[] = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#precos", label: "Preços" },
  { href: "#duvidas", label: "Dúvidas" }
];

export const hero = {
  title: "A agenda das salas, as comandas e os pagamentos do seu estúdio num lugar só.",
  lead: "Sem conflito de horário e sem consumo que não fecha no fim do mês.",
  cta: "Agendar demonstração de 15 min",
  note: "14 dias grátis, com a gente acompanhando."
};

export type BookingKind = "mensal" | "avulsa" | "bloqueio";

export type NightBooking = {
  room: string;
  start: number;
  end: number;
  label: string;
  kind: BookingKind;
  tab?: string;
};

export const bookingKindLabel: Record<BookingKind, string> = {
  mensal: "mensalista",
  avulsa: "avulsa",
  bloqueio: "bloqueio"
};

const nightBookings: NightBooking[] = [
  { room: "Sala 1", start: 18, end: 20, label: "Os Cobras", kind: "mensal" },
  { room: "Sala 1", start: 20, end: 22, label: "Lia Trio", kind: "avulsa", tab: "Comanda R$ 86,00" },
  { room: "Sala 1", start: 22, end: 24, label: "Maré Alta", kind: "mensal" },
  { room: "Sala 2", start: 19, end: 21, label: "Banda Norte", kind: "avulsa" },
  { room: "Sala 2", start: 21, end: 23, label: "Quarto Escuro", kind: "mensal" },
  { room: "Sala 3", start: 18, end: 20, label: "Manutenção", kind: "bloqueio" },
  { room: "Sala 3", start: 20, end: 22, label: "Ruído Branco", kind: "mensal" },
  { room: "Sala 3", start: 22, end: 24, label: "Fuzz Club", kind: "avulsa" }
];

// Ilustração de uma noite no estúdio: não é uma tela do sistema.
export const nightGrid = {
  caption: "Uma terça no estúdio, das 18h à meia-noite",
  startHour: 18,
  endHour: 24,
  rooms: ["Sala 1", "Sala 2", "Sala 3"],
  bookings: nightBookings
};

export type ProductShotImage = {
  src: string;
  alt: string;
  crop?: boolean;
  narrow?: boolean;
};

export type ProductRow = {
  id: string;
  title: string;
  text: string;
  shot: ProductShotImage;
  bubble?: boolean;
};

const productRows: ProductRow[] = [
  {
    id: "agenda",
    title: "Ninguém marca em cima de ninguém",
    text: "As bandas escolhem a sala e os horários livres da semana pelo app e pedem a reserva; o estúdio confirma. Mensalistas e bloqueios já aparecem ocupados, e remarcar ou cancelar um dia de mensalista não mexe no resto do mês.",
    shot: {
      src: "/produto/agenda-bandas.jpg",
      alt: "App de reservas do EstudioHub mostrando a semana da Sala 2, com horários livres e ocupados"
    }
  },
  {
    id: "comanda",
    title: "A comanda fecha no fim da noite",
    text: "Cerveja, corda e baqueta entram na comanda da própria reserva, junto com o valor do ensaio. Na hora de pagar, você divide os itens entre os integrantes da banda e vê quanto ainda falta receber.",
    shot: {
      src: "/produto/comanda.jpg",
      alt: "Comanda de uma reserva no EstudioHub, com o ensaio, os produtos consumidos e o saldo pendente",
      crop: true
    }
  },
  {
    id: "recebimento",
    title: "Recebimento no balcão e aviso no WhatsApp",
    text: "Receba por Pix, cartão ou dinheiro, item por item, com o troco calculado. A banda recebe pelo WhatsApp a confirmação da reserva e um lembrete um dia antes do ensaio.",
    shot: {
      src: "/produto/recebimento.jpg",
      alt: "Janela de recebimento do EstudioHub com as opções Pix, crédito, débito e dinheiro",
      narrow: true
    },
    bubble: true
  }
];

export const productSection = {
  title: "O que sai do caderno, da planilha e do WhatsApp",
  lead: "Três problemas de toda noite de ensaio, resolvidos no mesmo sistema.",
  rows: productRows
};

// Texto do modelo estudiohub_reserva_aprovada, que o sistema envia quando o estúdio confirma.
export const whatsappConfirmation = {
  caption: "Mensagem que a banda recebe quando o estúdio confirma",
  text: "Olá, Lia! Seu ensaio no Estúdio Exemplo está confirmado. ✅\n\nSala: Sala 2\nData: 20/10/2026 (terça)\nHorário: 19:00 às 21:00\nEndereço: Rua Exemplo, 100 - São Paulo/SP\n\nNos vemos em breve!",
  time: "18:42"
};

export const extras = {
  title: "E o resto que o dia a dia pede",
  items: [
    "Painel do dia com as reservas de hoje, as comandas abertas, as pendências e a receita.",
    "Estoque por unidade, com entrada de produtos pelo XML da nota fiscal.",
    "Mensalistas semanais ou quinzenais, com remarcação e cancelamento de um dia só.",
    "Várias unidades na mesma conta, cada uma com suas salas e seu estoque.",
    "Perfis de gestor e de equipe, com histórico das ações importantes.",
    "Integração com o Google Agenda e relatórios para exportar."
  ]
};

export const audience = {
  title: "Feito para quem aluga sala por hora",
  items: [
    { title: "Estúdios de ensaio", text: "Agenda por sala, mensalistas e comanda de consumo na mesma noite." },
    { title: "Estúdios de gravação", text: "Reserva por sala, consumo e financeiro num lugar só, com histórico e relatório." },
    { title: "Escolas de música", text: "Turmas recorrentes como mensalistas, com exceções pontuais e sem planilha paralela." },
    { title: "Podcast e vídeo", text: "Reserva do estúdio, consumo e cobrança num painel só, mesmo com vários horários por dia." }
  ]
};

export const steps = {
  title: "Como começar",
  items: [
    { title: "Conversa de 15 minutos", text: "Pelo WhatsApp, a gente entende como o seu estúdio funciona hoje." },
    { title: "Configuração com você", text: "Salas, preços, mensalistas e equipe, com a gente do lado." },
    { title: "14 dias grátis", text: "Você usa na rotina real, com acompanhamento." },
    { title: "Escolha do plano", text: "Pelo número de salas ativas, sem surpresa no valor." }
  ]
};

export type Plan = {
  name: string;
  rooms: string;
  monthly: string | null;
  cycles: string[];
  custom?: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    rooms: "Até 2 salas",
    monthly: "R$ 99,90",
    cycles: ["R$ 499,90 a cada 6 meses (R$ 83,32 por mês)", "R$ 899,90 por ano (R$ 74,99 por mês)"]
  },
  {
    name: "Growth",
    rooms: "De 3 a 5 salas",
    monthly: "R$ 199,90",
    cycles: ["R$ 999,90 a cada 6 meses (R$ 166,65 por mês)", "R$ 1.799,90 por ano (R$ 149,99 por mês)"]
  },
  {
    name: "Scale",
    rooms: "De 6 a 10 salas",
    monthly: "R$ 349,90",
    cycles: ["R$ 1.749,90 a cada 6 meses (R$ 291,65 por mês)", "R$ 3.149,90 por ano (R$ 262,49 por mês)"]
  },
  { name: "Enterprise", rooms: "11 salas ou mais", monthly: null, cycles: [], custom: "Sob consulta" }
];

export const pricing = {
  title: "Preço pelo número de salas",
  lead: "Todo plano começa com 14 dias grátis. Depois, o valor depende de quantas salas estão ativas.",
  plans,
  client: "Em uso no Warzone, estúdio de ensaio em Santos (SP), nas unidades Canal 1 e Canal 3."
};

export const faq = {
  title: "Dúvidas",
  items: [
    {
      question: "Como funciona o teste grátis?",
      answer: "São 14 dias usando o EstudioHub na rotina real do estúdio, sem pagar nada. A gente configura as salas, os preços e os mensalistas com você e acompanha os primeiros dias."
    },
    {
      question: "Como é a migração do que eu uso hoje?",
      answer: "Por etapas: primeiro salas e preços, depois agenda e mensalistas, estoque, usuários e a operação do dia a dia."
    },
    {
      question: "Como funciona a cobrança da assinatura?",
      answer: "Você escolhe pagar por mês, por semestre ou por ano, e acompanha a assinatura e as faturas pelo painel."
    },
    {
      question: "Qual plano eu escolho?",
      answer: "O que cobre o número de salas ativas do seu estúdio: até 2 no Starter, de 3 a 5 no Growth, de 6 a 10 no Scale e a partir de 11 no Enterprise."
    },
    {
      question: "Meus dados ficam seguros?",
      answer: "Cada estúdio só vê os próprios dados, cada pessoa da equipe só acessa o que o perfil dela permite, e as ações importantes ficam registradas no histórico."
    },
    {
      question: "Funciona fora de São Paulo?",
      answer: "Funciona no Brasil todo. A demonstração e o acompanhamento são feitos pelo WhatsApp."
    }
  ]
};

export const contact = {
  title: "Quer ver como fica no seu estúdio?",
  lead: "Em 15 minutos pelo WhatsApp a gente mostra o sistema com as salas e a rotina do seu estúdio.",
  cta: "Agendar demonstração",
  emailIntro: "Prefere email? Escreva para"
};

export const footer = {
  text: "Agenda das salas, comandas e pagamentos do seu estúdio num lugar só."
};
```

- [ ] **Step 4: Escrever o link e o botão do WhatsApp**

Create `components/whatsapp.tsx`:
```tsx
import type { ReactNode } from "react";

const WHATSAPP_NUMBER = "5511974571064";
export const WHATSAPP_DISPLAY = "+55 (11) 97457-1064";
const DEMO_MESSAGE = "Oi! Quero agendar a demonstração de 15 min do EstudioHub.";
export const DEMO_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEMO_MESSAGE)}`;

export function WhatsAppIcon() {
  return (
    <svg className="wa-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

type DemoButtonProps = {
  children?: ReactNode;
  className?: string;
  id?: string;
};

export function DemoButton({ children = "Agendar demonstração", className = "", id }: DemoButtonProps) {
  return (
    <a id={id} className={`btn btn-demo ${className}`.trim()} href={DEMO_URL} target="_blank" rel="noreferrer">
      <WhatsAppIcon />
      <span>{children}</span>
    </a>
  );
}
```

- [ ] **Step 5: Escrever topo e rodapé**

Replace `components/site-chrome.tsx` with:
```tsx
"use client";

import { useState } from "react";
import { ADMIN_URL, CONTACT_EMAIL, footer, navLinks } from "@/components/site-content";
import { DEMO_URL, DemoButton, WHATSAPP_DISPLAY } from "@/components/whatsapp";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="logo" href="#topo" onClick={closeMenu}>
          EstudioHub
        </a>
        <nav
          id="main-navigation"
          className={`site-nav${isMenuOpen ? " is-open" : ""}`}
          aria-label="Navegação principal"
        >
          <ul className="nav-list">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={ADMIN_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>
                Entrar
              </a>
            </li>
          </ul>
        </nav>
        <DemoButton className="header-cta" />
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">EstudioHub</p>
          <p>{footer.text}</p>
        </div>
        <ul className="footer-links">
          <li>
            <a href={DEMO_URL} target="_blank" rel="noreferrer">
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </li>
          <li>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
          <li>
            <a href={ADMIN_URL} target="_blank" rel="noreferrer">
              Entrar no sistema
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Fonte e metadados no layout**

Replace `app/layout.tsx` with:
```tsx
import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap"
});

const siteTitle = "EstudioHub | Agenda, comandas e pagamentos para estúdios";
const siteDescription =
  "Sistema para estúdios de ensaio, gravação e escolas de música: agenda das salas sem conflito, comandas de consumo e pagamentos num lugar só. Teste grátis por 14 dias.";

// As imagens são geradas no build por app/og-image.png, app/icon-64.png e app/apple-touch-icon.png.
// Os endereços terminam em .png para a hospedagem servir com o tipo certo (image/png).
const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "EstudioHub: agenda, comandas e pagamentos para estúdios",
  type: "image/png"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://estudio-hub.com"),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: [{ url: "/icon-64.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }]
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "EstudioHub",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Página vazia até as próximas tasks**

Replace `app/page.tsx` with:
```tsx
export default function HomePage() {
  return <main id="conteudo" />;
}
```

- [ ] **Step 8: Reescrever o CSS com os tokens, a base, o topo e o rodapé**

Replace `app/globals.css` with:
```css
/* Landing "grade da noite". Tokens em docs/superpowers/specs/2026-10-15-landing-grade-da-noite-design.md */

:root {
  --papel: #ffffff;
  --espuma: #edeef0;
  --tinta: #1f2125;
  --tinta-suave: rgba(31, 33, 37, 0.72);
  --azul: #3366ff;
  --ambar: #f5b700;
  --vermelho: #e5484d;
  --whatsapp: #25d366;
  --linha: rgba(31, 33, 37, 0.14);
  --gutter: 16px;
  --container: 1180px;
  --topo: 64px;
  --raio-bloco: 4px;
  --raio-botao: 8px;
  --raio-moldura: 12px;
  --fonte: var(--font-archivo), "Arial Narrow", Arial, sans-serif;
}

@media (min-width: 900px) {
  :root {
    --gutter: 32px;
    --topo: 72px;
  }
}

* {
  box-sizing: border-box;
}

html {
  color-scheme: light;
  scroll-behavior: smooth;
  scroll-padding-top: calc(var(--topo) + 16px);
  -webkit-text-size-adjust: 100%;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

body {
  margin: 0;
  background: var(--papel);
  color: var(--tinta);
  font-family: var(--fonte);
  font-size: 1.0625rem;
  line-height: 1.55;
}

@media (min-width: 900px) {
  body {
    font-size: 1.125rem;
  }
}

h1,
h2,
h3 {
  margin: 0;
  font-weight: 800;
  font-stretch: 75%;
  line-height: 1.02;
  letter-spacing: -0.01em;
  text-wrap: balance;
}

h1 {
  font-size: clamp(2.5rem, 1.6rem + 3.8vw, 4.5rem);
}

h2 {
  font-size: clamp(2.25rem, 1.9rem + 1.5vw, 3rem);
}

h3 {
  font-size: clamp(1.3125rem, 1.2rem + 0.5vw, 1.5rem);
  font-weight: 700;
  line-height: 1.15;
}

p,
ul,
ol,
figure {
  margin: 0;
}

p {
  max-width: 65ch;
}

a {
  color: inherit;
}

:focus-visible {
  outline: 3px solid var(--azul);
  outline-offset: 3px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.container {
  width: min(var(--container), 100% - 2 * var(--gutter));
  margin-inline: auto;
}

.section {
  padding-block: 64px;
}

.section--espuma {
  background: var(--espuma);
}

@media (min-width: 900px) {
  .section {
    padding-block: 96px;
  }
}

.section-head {
  display: grid;
  gap: 12px;
  margin-bottom: 40px;
}

.section-head p {
  color: var(--tinta-suave);
  font-size: clamp(1.125rem, 1rem + 0.4vw, 1.3125rem);
}

/* Botões */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 12px 20px;
  border: 0;
  border-radius: var(--raio-botao);
  font: inherit;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}

.btn-demo {
  background: var(--tinta);
  color: #ffffff;
}

.btn-demo:hover {
  background: #000000;
}

.wa-icon {
  flex: none;
  width: 20px;
  height: 20px;
}

.btn-demo .wa-icon {
  color: var(--whatsapp);
}

/* Topo */
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--linha);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(8px);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: var(--topo);
}

.logo {
  margin-right: auto;
  font-size: 1.5rem;
  font-weight: 800;
  font-stretch: 75%;
  letter-spacing: -0.01em;
  text-decoration: none;
}

.nav-list {
  list-style: none;
  padding: 0;
}

.site-nav {
  display: none;
}

.site-nav.is-open {
  display: block;
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  border-bottom: 1px solid var(--linha);
  background: var(--papel);
}

.site-nav.is-open .nav-list {
  display: grid;
  width: min(var(--container), 100% - 2 * var(--gutter));
  margin-inline: auto;
  padding-block: 4px 12px;
}

.site-nav.is-open a {
  display: block;
  padding: 12px 0;
  border-bottom: 1px solid var(--linha);
  font-weight: 600;
  text-decoration: none;
}

.header-cta {
  min-height: 44px;
  padding: 8px 14px;
  font-size: 1rem;
}

.menu-toggle {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 0 11px;
  border: 1px solid var(--linha);
  border-radius: var(--raio-botao);
  background: var(--papel);
  cursor: pointer;
}

.menu-toggle span {
  height: 2px;
  border-radius: 2px;
  background: var(--tinta);
}

@media (max-width: 399px) {
  .header-cta {
    display: none;
  }
}

@media (min-width: 900px) {
  .logo {
    margin-right: 0;
  }

  .site-nav,
  .site-nav.is-open {
    display: block;
    position: static;
    margin-right: auto;
    margin-left: 32px;
    border: 0;
    background: none;
  }

  .nav-list,
  .site-nav.is-open .nav-list {
    display: flex;
    gap: 28px;
    width: auto;
    padding: 0;
  }

  .nav-list a,
  .site-nav.is-open a {
    padding: 0;
    border: 0;
    color: var(--tinta-suave);
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  .nav-list a:hover {
    color: var(--tinta);
  }

  .menu-toggle {
    display: none;
  }
}

/* Rodapé */
.site-footer {
  padding-block: 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background: var(--tinta);
  color: #ffffff;
}

.footer-inner {
  display: grid;
  gap: 24px;
}

.footer-brand {
  font-size: 1.5rem;
  font-weight: 800;
  font-stretch: 75%;
}

.site-footer p {
  color: rgba(255, 255, 255, 0.72);
}

.footer-links {
  display: grid;
  gap: 8px;
  list-style: none;
  padding: 0;
}

.footer-links a {
  text-underline-offset: 3px;
}

@media (min-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr auto;
    align-items: start;
  }
}
```

- [ ] **Step 9: Rodar o teste do topo e ver passar (sandbox desligado)**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/header.spec.ts e2e/smoke.spec.ts`
Expected: all passed (11 widths + 3 tests + smoke).

- [ ] **Step 10: Lint, build e commit**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm run lint && npm run build && git add app components e2e && git commit -q -F - <<'EOF'
feat: tokens, Archivo, topo e rodapé da nova landing

Cores e tipografia da especificação "grade da noite". O topo fica numa
linha só e fixo ao rolar: links e "Entrar" a partir de 900 px, menu ☰
abaixo disso. Todos os botões de demonstração abrem o WhatsApp com a
mensagem pronta. As seções entram nas próximas tasks.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 4: Topo da página com a grade da noite

**Files:**
- Create: `components/night-grid.tsx`, `components/playhead.tsx`, `e2e/hero.spec.ts`
- Modify: `app/page.tsx`, `app/globals.css` (append)

**Interfaces:**
- Consumes: `nightGrid`, `bookingKindLabel`, `hero` from `site-content.ts`; `DemoButton` (Task 3).
- Produces:
  - `#hero-cta`, the first-screen button, which the sticky bar in Task 7 observes.
  - `playheadTarget(hourNow: number, startHour: number, endHour: number): number`, exported from
    `components/playhead.tsx`.

- [ ] **Step 1: Escrever o teste (falha: não existe topo)**

Create `e2e/hero.spec.ts`:
```ts
import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, open } from "./helpers";

const FIRST_SCREENS = [
  [320, 568],
  [390, 844],
  [1366, 768],
  [1440, 900]
] as const;

for (const [width, height] of FIRST_SCREENS) {
  test(`botão de demonstração na primeira tela em ${width}x${height}`, async ({ page }) => {
    await open(page, width, height);
    const box = (await page.locator("#hero-cta").boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(height);
    await expect(page.locator("#hero-cta")).toHaveText("Agendar demonstração de 15 min");
    await expectNoHorizontalScroll(page);
  });
}

test("a grade lista as reservas de cada sala para leitor de tela", async ({ page }) => {
  await open(page, 1280);
  const grid = page.getByRole("figure", { name: "Uma terça no estúdio, das 18h à meia-noite" });
  for (const room of ["Sala 1", "Sala 2", "Sala 3"]) {
    await expect(grid.getByRole("list", { name: room })).toBeVisible();
  }
  await expect(grid.getByRole("listitem")).toHaveCount(8);
  await expect(grid.getByRole("listitem").filter({ hasText: "Banda Norte" })).toContainText("das 19h às 21h");
  await expect(grid.getByRole("listitem").filter({ hasText: "Manutenção" })).toContainText("bloqueio");
});

test("às 20h30 de São Paulo a linha agora fica em 20h30 da grade", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-20T23:30:00Z"));
  await open(page, 1280);
  await expect(page.locator(".playhead")).toHaveAttribute("data-position", "41.67");
});

test("fora do horário da grade a linha agora fica em 21h", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-20T13:00:00Z")); // 10h em São Paulo
  await open(page, 1280);
  await expect(page.locator(".playhead")).toHaveAttribute("data-position", "50.00");
});

test.describe("visitante em outro fuso", () => {
  test.use({ timezoneId: "Europe/Lisbon" });

  test("a linha agora usa a hora de São Paulo", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-10-20T23:30:00Z")); // 0h30 em Lisboa, 20h30 em SP
    await open(page, 1280);
    await expect(page.locator(".playhead")).toHaveAttribute("data-position", "41.67");
  });
});

test("sem animação para quem pediu menos movimento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, 1280);
  const duration = await page.locator(".playhead").evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(duration).toBe("0s");
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/hero.spec.ts`
Expected: FAIL. `#hero-cta` and `.playhead` do not exist.

- [ ] **Step 3: Escrever a linha "agora"**

Create `components/playhead.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

// Hora decimal de São Paulo, qualquer que seja o fuso do navegador.
function saoPauloHour(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour + minute / 60;
}

// Posição em % da grade. Fora do horário da grade, a linha para em 21h.
export function playheadTarget(hourNow: number, startHour: number, endHour: number) {
  const hour = hourNow >= startHour && hourNow < endHour ? hourNow : 21;
  return ((hour - startHour) / (endHour - startHour)) * 100;
}

export function Playhead({ startHour, endHour }: { startHour: number; endHour: number }) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setPosition(playheadTarget(saoPauloHour(new Date()), startHour, endHour))
    );
    return () => cancelAnimationFrame(frame);
  }, [startHour, endHour]);

  return (
    <div className="playhead-lane" aria-hidden="true">
      <div className="playhead" style={{ left: `${position}%` }} data-position={position.toFixed(2)}>
        <span className="playhead__label">agora</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Escrever a grade**

Create `components/night-grid.tsx`:
```tsx
import { Playhead } from "@/components/playhead";
import { bookingKindLabel, nightGrid } from "@/components/site-content";

const hourLabel = (hour: number) => `${String(hour % 24).padStart(2, "0")}h`;

export function NightGrid() {
  const { caption, startHour, endHour, rooms, bookings } = nightGrid;
  const span = endHour - startHour;
  const hours = Array.from({ length: span + 1 }, (_, index) => startHour + index);
  const percent = (hour: number) => ((hour - startHour) / span) * 100;

  return (
    <figure className="night-grid">
      <figcaption className="night-grid__caption">{caption}</figcaption>
      <div className="night-grid__board">
        <div className="night-grid__ruler" aria-hidden="true">
          {hours.map((hour) => (
            <span key={hour} style={{ left: `${percent(hour)}%` }}>
              {hourLabel(hour)}
            </span>
          ))}
        </div>
        {rooms.map((room) => (
          <div className="night-grid__room" key={room}>
            <span className="night-grid__room-name" aria-hidden="true">
              {room}
            </span>
            <ul className="night-grid__track" aria-label={room}>
              {bookings
                .filter((booking) => booking.room === room)
                .map((booking) => (
                  <li
                    key={`${room}-${booking.start}`}
                    className={`booking booking--${booking.kind}`}
                    style={{
                      left: `${percent(booking.start)}%`,
                      width: `calc(${(booking.end - booking.start) * (100 / span)}% - 4px)`
                    }}
                  >
                    <span className="booking__label">{booking.label}</span>
                    <span className="booking__kind">{bookingKindLabel[booking.kind]}</span>
                    <span className="sr-only">
                      , das {hourLabel(booking.start)} às {hourLabel(booking.end)}
                    </span>
                    {booking.tab ? <span className="booking__tab">{booking.tab}</span> : null}
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <Playhead startHour={startHour} endHour={endHour} />
      </div>
    </figure>
  );
}
```

- [ ] **Step 5: Colocar o topo na página**

Replace `app/page.tsx` with:
```tsx
import { NightGrid } from "@/components/night-grid";
import { hero } from "@/components/site-content";
import { DemoButton } from "@/components/whatsapp";

export default function HomePage() {
  return (
    <main id="conteudo">
      <section className="hero" id="topo" aria-labelledby="topo-titulo">
        <div className="container">
          <h1 id="topo-titulo">{hero.title}</h1>
          <p className="hero__lead">{hero.lead}</p>
          <div className="hero__cta">
            <DemoButton id="hero-cta">{hero.cta}</DemoButton>
            <p className="hero__note">{hero.note}</p>
          </div>
          <NightGrid />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Estilos do topo e da grade**

Append to `app/globals.css`:
```css

/* Topo da página e grade da noite */
.hero {
  padding-block: 40px 64px;
}

@media (min-width: 900px) {
  .hero {
    padding-block: 72px 96px;
  }
}

.hero h1 {
  max-width: 22ch;
}

.hero__lead {
  max-width: 50ch;
  margin-top: 20px;
  color: var(--tinta-suave);
  font-size: clamp(1.125rem, 1rem + 0.4vw, 1.3125rem);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 28px;
}

.hero__note {
  color: var(--tinta-suave);
  font-size: 1rem;
}

.night-grid {
  margin-top: 48px;
}

@media (min-width: 900px) {
  .night-grid {
    margin-top: 64px;
  }
}

.night-grid__caption {
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 700;
  font-stretch: 75%;
}

.night-grid__board {
  --rotulo: 52px;
  --borda: 12px;
  position: relative;
  overflow: hidden;
  padding: 36px var(--borda) var(--borda);
  border-radius: var(--raio-moldura);
  background: var(--tinta);
  color: #ffffff;
}

@media (min-width: 900px) {
  .night-grid__board {
    --rotulo: 88px;
    --borda: 20px;
    padding-top: 40px;
  }
}

.night-grid__ruler {
  position: absolute;
  top: 12px;
  right: var(--borda);
  left: calc(var(--borda) + var(--rotulo));
  height: 16px;
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.75rem;
  font-weight: 600;
  font-stretch: 75%;
}

@media (min-width: 900px) {
  .night-grid__ruler {
    top: 14px;
    font-size: 0.875rem;
  }
}

.night-grid__ruler span {
  position: absolute;
  transform: translateX(-50%);
}

.night-grid__ruler span:first-child {
  transform: none;
}

.night-grid__ruler span:last-child {
  transform: translateX(-100%);
}

.night-grid__room {
  display: grid;
  grid-template-columns: var(--rotulo) 1fr;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.night-grid__room-name {
  align-self: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8125rem;
  font-weight: 700;
  font-stretch: 75%;
}

@media (min-width: 900px) {
  .night-grid__room-name {
    font-size: 1rem;
  }
}

.night-grid__track {
  position: relative;
  height: 52px;
  list-style: none;
  padding: 0;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: calc(100% / 6) 100%;
}

@media (min-width: 900px) {
  .night-grid__track {
    height: 72px;
  }
}

.booking {
  position: absolute;
  top: 6px;
  bottom: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 8px;
  overflow: hidden;
  border-radius: var(--raio-bloco);
  line-height: 1.15;
}

.booking__label {
  overflow: hidden;
  font-size: 0.8125rem;
  font-weight: 700;
  font-stretch: 75%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.booking__kind {
  font-size: 0.75rem;
  font-weight: 500;
  font-stretch: 75%;
}

.booking__tab {
  display: none;
}

@media (min-width: 900px) {
  .booking__label {
    font-size: 1rem;
  }

  .booking__kind {
    font-size: 0.8125rem;
  }

  .booking__tab {
    display: inline-block;
    align-self: flex-start;
    margin-top: 3px;
    padding: 0 6px;
    border-radius: 3px;
    background: #ffffff;
    color: var(--tinta);
    font-size: 0.75rem;
    font-weight: 700;
    font-stretch: 75%;
  }
}

.booking--mensal {
  background: var(--azul);
  color: #ffffff;
}

.booking--avulsa {
  background: var(--ambar);
  color: var(--tinta);
}

/* Vermelho não passa 4,5:1 com texto: hachura e borda vermelhas, texto branco sobre a Tinta */
.booking--bloqueio {
  border: 1px solid var(--vermelho);
  background: repeating-linear-gradient(-45deg, rgba(229, 72, 77, 0.45) 0 6px, transparent 6px 12px);
  color: #ffffff;
}

.booking--bloqueio .booking__label,
.booking--bloqueio .booking__kind {
  align-self: flex-start;
  padding-inline: 4px;
  border-radius: 2px;
  background: var(--tinta);
}

.playhead-lane {
  position: absolute;
  top: 8px;
  right: var(--borda);
  bottom: var(--borda);
  left: calc(var(--borda) + var(--rotulo));
  pointer-events: none;
}

.playhead {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: #ffffff;
  transition: left 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.playhead__label {
  position: absolute;
  top: 0;
  right: 6px;
  padding: 0 6px;
  border-radius: 3px;
  background: #ffffff;
  color: var(--tinta);
  font-size: 0.75rem;
  font-weight: 700;
  font-stretch: 75%;
  line-height: 1.4;
}

@media (prefers-reduced-motion: reduce) {
  .playhead {
    transition: none;
  }
}
```

- [ ] **Step 7: Rodar e ver passar (sandbox desligado)**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/hero.spec.ts e2e/header.spec.ts`
Expected: all passed.

- [ ] **Step 8: Olhar a grade em 390 e 1280 px**

With `node e2e/serve-out.mjs 4300` running in the background (sandbox off), take screenshots of
`http://127.0.0.1:4300/` with the Playwright MCP at 390×844 and 1280×800, and look at them. Check:
- no booking label is cut so short that it can't be read;
- the "agora" label does not cover a room name;
- the block hatching is visible.

Adjust only spacing or font sizes in the CSS of this task, then rerun Step 7.

- [ ] **Step 9: Lint, build e commit**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm run lint && npm run build && git add app components e2e && git commit -q -F - <<'EOF'
feat: topo da landing com a grade da noite

Título, botão de demonstração de 15 min e a ilustração de uma noite no
estúdio: salas como faixas, reservas como blocos e a linha "agora" na
hora de São Paulo (em 21h fora do horário da grade). A grade é lida como
uma lista de reservas por sala no leitor de tela.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 5: Como funciona (telas reais), também tem e para quem

**Files:**
- Create: `components/product-shot.tsx`, `components/whatsapp-bubble.tsx`, `e2e/sections.spec.ts`
- Modify: `app/page.tsx`, `app/globals.css` (append), `next.config.mjs`

**Interfaces:**
- Consumes:
  - `productSection`, `whatsappConfirmation`, `extras`, `audience` from `site-content.ts`;
  - `public/produto/*.jpg` from Task 2.
- Produces:
  - `ProductShot({ src, alt, crop? })`;
  - `WhatsAppBubble()`;
  - sections `#como-funciona`, `#tambem-tem`, `#para-quem`.

- [ ] **Step 1: Escrever o teste (falha: seções não existem)**

Create `e2e/sections.spec.ts`:
```ts
import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("como funciona mostra três problemas com telas reais", async ({ page }) => {
  await open(page, 1280);
  const section = page.locator("#como-funciona");
  await expect(section.getByRole("heading", { level: 3 })).toHaveText([
    "Ninguém marca em cima de ninguém",
    "A comanda fecha no fim da noite",
    "Recebimento no balcão e aviso no WhatsApp"
  ]);
  const images = section.getByRole("img");
  await expect(images).toHaveCount(3);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("alt", /EstudioHub/);
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
      .toBe(true);
  }
  await expect(section.getByText("Seu ensaio no Estúdio Exemplo está confirmado.")).toBeVisible();
});

test("também tem e para quem", async ({ page }) => {
  await open(page, 1280);
  await expect(page.locator("#tambem-tem li")).toHaveCount(6);
  await expect(page.locator("#para-quem li strong")).toHaveText([
    "Estúdios de ensaio",
    "Estúdios de gravação",
    "Escolas de música",
    "Podcast e vídeo"
  ]);
});

test("não promete pagamento online pela banda", async ({ page }) => {
  await open(page, 1280);
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(/banda paga|pagar online|pagamento online/i);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/sections.spec.ts`
Expected: FAIL. The first two tests fail because `#como-funciona` doesn't exist yet. The third
already passes, and should stay that way.

- [ ] **Step 3: Habilitar `next/image` no export estático**

Replace `next.config.mjs` with:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  // Export estático: as capturas já saem no tamanho certo, sem otimização em servidor.
  images: { unoptimized: true }
};

export default nextConfig;
```

- [ ] **Step 4: Moldura das capturas e balão do WhatsApp**

Create `components/product-shot.tsx`:
```tsx
import Image from "next/image";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ProductShotImage } from "@/components/site-content";

// Lê largura e altura do cabeçalho do JPEG (marcador SOF), no build.
function jpegSize(src: string) {
  const file = readFileSync(join(process.cwd(), "public", src));
  let offset = 2;
  while (offset < file.length) {
    const marker = file[offset + 1];
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: file.readUInt16BE(offset + 5), width: file.readUInt16BE(offset + 7) };
    }
    offset += 2 + file.readUInt16BE(offset + 2);
  }
  throw new Error(`Não achei o tamanho de ${src}`);
}

// As capturas são feitas em 2x: o tamanho de exibição é metade do arquivo.
export function ProductShot({ src, alt, crop = false, narrow = false }: ProductShotImage) {
  const { width, height } = jpegSize(src);
  return (
    <figure className={`shot${crop ? " shot--recorte" : ""}${narrow ? " shot--estreita" : ""}`}>
      <div className="shot__viewport">
        <Image src={src} alt={alt} width={width / 2} height={height / 2} sizes="(min-width: 900px) 640px, 100vw" />
      </div>
    </figure>
  );
}
```

Create `components/whatsapp-bubble.tsx`:
```tsx
import { whatsappConfirmation } from "@/components/site-content";

export function WhatsAppBubble() {
  return (
    <figure className="wa-bubble">
      <figcaption className="wa-bubble__caption">{whatsappConfirmation.caption}</figcaption>
      <p className="wa-bubble__text">
        {whatsappConfirmation.text}
        <span className="wa-bubble__time">{whatsappConfirmation.time}</span>
      </p>
    </figure>
  );
}
```

- [ ] **Step 5: Colocar as seções na página**

Replace `app/page.tsx` with:
```tsx
import { NightGrid } from "@/components/night-grid";
import { ProductShot } from "@/components/product-shot";
import { audience, extras, hero, productSection } from "@/components/site-content";
import { DemoButton } from "@/components/whatsapp";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";

export default function HomePage() {
  return (
    <main id="conteudo">
      <section className="hero" id="topo" aria-labelledby="topo-titulo">
        <div className="container">
          <h1 id="topo-titulo">{hero.title}</h1>
          <p className="hero__lead">{hero.lead}</p>
          <div className="hero__cta">
            <DemoButton id="hero-cta">{hero.cta}</DemoButton>
            <p className="hero__note">{hero.note}</p>
          </div>
          <NightGrid />
        </div>
      </section>

      <section className="section" id="como-funciona" aria-labelledby="como-funciona-titulo">
        <div className="container">
          <div className="section-head">
            <h2 id="como-funciona-titulo">{productSection.title}</h2>
            <p>{productSection.lead}</p>
          </div>
          <div className="product-rows">
            {productSection.rows.map((row) => (
              <article className="product-row" key={row.id}>
                <div className="product-row__text">
                  <h3>{row.title}</h3>
                  <p>{row.text}</p>
                </div>
                <div className="product-row__media">
                  <ProductShot {...row.shot} />
                  {row.bubble ? <WhatsAppBubble /> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--espuma" id="tambem-tem" aria-labelledby="tambem-tem-titulo">
        <div className="container">
          <div className="section-head">
            <h2 id="tambem-tem-titulo">{extras.title}</h2>
          </div>
          <ul className="feature-list">
            {extras.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="para-quem" aria-labelledby="para-quem-titulo">
        <div className="container">
          <div className="section-head">
            <h2 id="para-quem-titulo">{audience.title}</h2>
          </div>
          <ul className="audience-list">
            {audience.items.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Estilos**

Append to `app/globals.css`:
```css

/* Como funciona */
.product-rows {
  display: grid;
  gap: 64px;
}

.product-row {
  display: grid;
  align-items: center;
  gap: 24px;
}

.product-row__text {
  display: grid;
  gap: 12px;
}

.product-row__text p {
  color: var(--tinta-suave);
}

.product-row__media {
  display: grid;
  gap: 16px;
}

@media (min-width: 900px) {
  .product-rows {
    gap: 96px;
  }

  .product-row {
    grid-template-columns: 5fr 7fr;
    gap: 56px;
  }

  .product-row:nth-child(even) .product-row__text {
    order: 2;
  }
}

.shot {
  padding: 10px;
  border-radius: var(--raio-moldura);
  background: var(--espuma);
  box-shadow: 0 1px 2px rgba(31, 33, 37, 0.08), 0 16px 40px rgba(31, 33, 37, 0.12);
}

.shot__viewport {
  overflow: hidden;
  border-radius: 6px;
}

.shot img {
  display: block;
  width: 100%;
  height: auto;
}

.shot--recorte .shot__viewport {
  aspect-ratio: 16 / 10;
}

.shot--recorte img {
  height: 100%;
  object-fit: cover;
  object-position: top left;
}

/* Janela vertical (recebimento): mais estreita, para não esticar a página */
.shot--estreita {
  justify-self: start;
  width: 100%;
  max-width: 420px;
}

.wa-bubble {
  justify-self: start;
  max-width: 360px;
}

.wa-bubble__caption {
  margin-bottom: 8px;
  color: var(--tinta-suave);
  font-size: 0.875rem;
}

.wa-bubble__text {
  padding: 10px 12px 8px;
  border: 1px solid var(--linha);
  border-radius: 10px 10px 10px 2px;
  background: var(--papel);
  font-size: 1rem;
  line-height: 1.4;
  white-space: pre-line;
}

.wa-bubble__time {
  display: block;
  margin-top: 4px;
  color: var(--tinta-suave);
  font-size: 0.75rem;
  text-align: right;
}

/* Também tem */
.feature-list {
  display: grid;
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding-block: 16px;
  border-top: 1px solid var(--linha);
}

@media (min-width: 900px) {
  .feature-list {
    grid-template-columns: 1fr 1fr;
    column-gap: 48px;
  }
}

/* Para quem */
.audience-list {
  display: grid;
  gap: 24px;
  list-style: none;
  padding: 0;
}

.audience-list li {
  display: grid;
  gap: 4px;
}

.audience-list strong {
  font-size: 1.3125rem;
  font-weight: 700;
  font-stretch: 75%;
}

.audience-list span {
  color: var(--tinta-suave);
}

@media (min-width: 900px) {
  .audience-list {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}
```

- [ ] **Step 7: Rodar e ver passar (sandbox desligado)**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/sections.spec.ts e2e/hero.spec.ts e2e/header.spec.ts`
Expected: all passed.

- [ ] **Step 8: Olhar em 390 e 1280 px**

Screenshot `#como-funciona` with the Playwright MCP at both widths and look at them. Check:
- the cropped comanda still shows the header and the items;
- text and screens alternate sides on desktop;
- the bubble is legible.

Adjust only this task's CSS, then rerun Step 7.

- [ ] **Step 9: Lint, build e commit**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm run lint && npm run build && git add app components e2e next.config.mjs && git commit -q -F - <<'EOF'
feat: como funciona com telas reais, também tem e para quem

Três problemas da noite de ensaio, cada um com uma captura real do
produto: a grade semanal do app das bandas, a comanda dividida e a janela
de recebimento, mais o texto real da confirmação que a banda recebe no
WhatsApp. O tamanho das imagens é lido do próprio JPEG no build.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 6: Como começar, preços e dúvidas

**Files:**
- Create: `e2e/pricing.spec.ts`
- Modify: `app/page.tsx`, `app/globals.css` (append)

**Interfaces:**
- Consumes: `steps`, `pricing`, `faq` from `site-content.ts`.
- Produces: sections `#como-comecar`, `#precos`, `#duvidas`.

- [ ] **Step 1: Escrever o teste (falha: seções não existem)**

Create `e2e/pricing.spec.ts`:
```ts
import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("como começar tem os quatro passos em ordem", async ({ page }) => {
  await open(page, 1280);
  await expect(page.locator("#como-comecar ol > li strong")).toHaveText([
    "Conversa de 15 minutos",
    "Configuração com você",
    "14 dias grátis",
    "Escolha do plano"
  ]);
});

test("preços batem com os planos do sistema", async ({ page }) => {
  await open(page, 1280);
  const section = page.locator("#precos");
  const plans = section.locator(".plan");
  await expect(plans.locator("h3")).toHaveText(["Starter", "Growth", "Scale", "Enterprise"]);
  const expected = [
    ["Até 2 salas", "R$ 99,90", "R$ 499,90 a cada 6 meses (R$ 83,32 por mês)", "R$ 899,90 por ano (R$ 74,99 por mês)"],
    ["De 3 a 5 salas", "R$ 199,90", "R$ 999,90 a cada 6 meses (R$ 166,65 por mês)", "R$ 1.799,90 por ano (R$ 149,99 por mês)"],
    ["De 6 a 10 salas", "R$ 349,90", "R$ 1.749,90 a cada 6 meses (R$ 291,65 por mês)", "R$ 3.149,90 por ano (R$ 262,49 por mês)"],
    ["11 salas ou mais", "Sob consulta"]
  ];
  for (const [index, texts] of expected.entries()) {
    for (const text of texts) await expect(plans.nth(index)).toContainText(text);
  }
  await expect(section).toContainText("14 dias grátis");
  await expect(section).toContainText(
    "Em uso no Warzone, estúdio de ensaio em Santos (SP), nas unidades Canal 1 e Canal 3."
  );
});

test("dúvidas abrem e fecham", async ({ page }) => {
  await open(page, 1280);
  const items = page.locator("#duvidas details");
  await expect(items).toHaveCount(6);
  const first = items.first();
  await expect(first.locator("p")).toBeHidden();
  await first.locator("summary").click();
  await expect(first.locator("p")).toBeVisible();
});

test("link do menu leva a seção para baixo do topo fixo", async ({ page }) => {
  await open(page, 390, 844);
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Preços" }).click();
  const header = (await page.locator(".site-header").boundingBox())!;
  await expect
    .poll(async () => (await page.locator("#precos h2").boundingBox())!.y, { timeout: 5000 })
    .toBeGreaterThanOrEqual(header.y + header.height);
  const titleTop = (await page.locator("#precos h2").boundingBox())!.y;
  expect(titleTop).toBeLessThan(844 / 2);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/pricing.spec.ts`
Expected: FAIL. The sections don't exist yet.

- [ ] **Step 3: Colocar as seções na página**

In `app/page.tsx`, change the content import line to:
```tsx
import { audience, extras, faq, hero, pricing, productSection, steps } from "@/components/site-content";
```
and insert, right after the closing `</section>` of `#para-quem` (before `</main>`):
```tsx
      <section className="section section--espuma" id="como-comecar" aria-labelledby="como-comecar-titulo">
        <div className="container">
          <div className="section-head">
            <h2 id="como-comecar-titulo">{steps.title}</h2>
          </div>
          <ol className="steps">
            {steps.items.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="precos" aria-labelledby="precos-titulo">
        <div className="container">
          <div className="section-head">
            <h2 id="precos-titulo">{pricing.title}</h2>
            <p>{pricing.lead}</p>
          </div>
          <ul className="plans">
            {pricing.plans.map((plan) => (
              <li className="plan" key={plan.name}>
                <h3>{plan.name}</h3>
                <p className="plan__rooms">{plan.rooms}</p>
                {plan.monthly ? (
                  <>
                    <p className="plan__price">
                      {plan.monthly} <span>por mês</span>
                    </p>
                    <ul className="plan__cycles">
                      {plan.cycles.map((cycle) => (
                        <li key={cycle}>{cycle}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="plan__price">{plan.custom}</p>
                )}
              </li>
            ))}
          </ul>
          <p className="client-line">{pricing.client}</p>
        </div>
      </section>

      <section className="section section--espuma" id="duvidas" aria-labelledby="duvidas-titulo">
        <div className="container">
          <div className="section-head">
            <h2 id="duvidas-titulo">{faq.title}</h2>
          </div>
          <div className="faq">
            {faq.items.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 4: Estilos**

Append to `app/globals.css`:
```css

/* Como começar: sequência real, por isso numerada */
.steps {
  display: grid;
  gap: 24px;
  list-style: none;
  padding: 0;
  counter-reset: passo;
}

.steps li {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 4px 16px;
  counter-increment: passo;
}

.steps li::before {
  content: counter(passo);
  grid-row: span 2;
  color: var(--azul);
  font-size: 2.25rem;
  font-weight: 800;
  font-stretch: 75%;
  line-height: 1;
}

.steps strong {
  font-size: 1.3125rem;
  font-stretch: 75%;
}

.steps p {
  color: var(--tinta-suave);
}

@media (min-width: 900px) {
  .steps {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }

  .steps li {
    grid-template-columns: 1fr;
  }

  .steps li::before {
    grid-row: auto;
    margin-bottom: 8px;
  }
}

/* Preços */
.plans {
  display: grid;
  list-style: none;
  padding: 0;
}

.plan {
  display: grid;
  align-content: start;
  gap: 6px;
  padding-block: 24px;
  border-top: 1px solid var(--linha);
}

.plan__rooms,
.plan__cycles {
  color: var(--tinta-suave);
}

.plan__price {
  font-size: 2.25rem;
  font-weight: 800;
  font-stretch: 75%;
  line-height: 1.1;
}

.plan__price span {
  color: var(--tinta-suave);
  font-size: 1rem;
  font-weight: 500;
}

.plan__cycles {
  display: grid;
  gap: 2px;
  list-style: none;
  padding: 0;
  font-size: 1rem;
}

@media (min-width: 900px) {
  .plans {
    grid-template-columns: repeat(4, 1fr);
  }

  .plan {
    padding: 4px 24px 0;
    border-top: 0;
    border-left: 1px solid var(--linha);
  }

  .plan:first-child {
    padding-left: 0;
    border-left: 0;
  }
}

.client-line {
  margin-top: 40px;
  font-weight: 600;
}

/* Dúvidas */
.faq {
  display: grid;
  max-width: 760px;
}

.faq details {
  border-top: 1px solid var(--linha);
}

.faq details:last-child {
  border-bottom: 1px solid var(--linha);
}

.faq summary {
  position: relative;
  padding: 18px 40px 18px 0;
  font-size: 1.3125rem;
  font-weight: 700;
  font-stretch: 75%;
  list-style: none;
  cursor: pointer;
}

.faq summary::-webkit-details-marker {
  display: none;
}

.faq summary::after {
  content: "+";
  position: absolute;
  top: 50%;
  right: 4px;
  font-size: 1.5rem;
  font-weight: 400;
  transform: translateY(-50%);
}

.faq details[open] summary::after {
  content: "−";
}

.faq details p {
  padding-bottom: 20px;
  color: var(--tinta-suave);
}
```

- [ ] **Step 5: Rodar e ver passar (sandbox desligado)**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test`
Expected: all passed.

- [ ] **Step 6: Lint, build e commit**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm run lint && npm run build && git add app e2e && git commit -q -F - <<'EOF'
feat: como começar, preços e dúvidas na landing

Os quatro passos do primeiro contato até a escolha do plano, os preços
de cada plano por número de salas (mensal, semestral e anual), a linha
do Warzone e seis dúvidas que abrem e fecham.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 7: Chamada final e barra fixa no celular

**Files:**
- Create: `components/sticky-cta.tsx`, `e2e/cta.spec.ts`
- Modify: `app/page.tsx`, `app/globals.css` (append)

**Interfaces:**
- Consumes: `contact`, `CONTACT_EMAIL` from `site-content.ts`; `DemoButton`; `#hero-cta` (Task 4).
- Produces: section `#contato`; `StickyCta()`.

- [ ] **Step 1: Escrever o teste (falha: não existe contato nem barra)**

Create `e2e/cta.spec.ts`:
```ts
import { expect, test } from "@playwright/test";
import { DEMO_MESSAGE, open } from "./helpers";

test("todos os links de WhatsApp levam a mensagem pronta", async ({ page }) => {
  await open(page, 1280);
  const links = page.locator('a[href*="wa.me"]');
  expect(await links.count()).toBeGreaterThanOrEqual(5);
  for (const link of await links.all()) {
    const url = new URL((await link.getAttribute("href"))!);
    expect(`${url.origin}${url.pathname}`).toBe("https://wa.me/5511974571064");
    expect(url.searchParams.get("text")).toBe(DEMO_MESSAGE);
  }
});

test("barra fixa no celular aparece depois do primeiro botão e some no contato", async ({ page }) => {
  await open(page, 390, 844);
  const bar = page.locator(".sticky-cta");
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  await page.locator("#como-funciona").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("aria-hidden", "false");
  await expect(bar.getByRole("link", { name: "Agendar demonstração" })).toBeInViewport();
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("aria-hidden", "true");
});

test("sem barra fixa no computador", async ({ page }) => {
  await open(page, 1280);
  await page.locator("#como-funciona").scrollIntoViewIfNeeded();
  await expect(page.locator(".sticky-cta")).toBeHidden();
});

test("contato oferece WhatsApp e email", async ({ page }) => {
  await open(page, 1280);
  const section = page.locator("#contato");
  await expect(section.getByRole("link", { name: "Agendar demonstração" })).toBeVisible();
  await expect(section.getByRole("link", { name: "contato@estudio-hub.com" })).toHaveAttribute(
    "href",
    "mailto:contato@estudio-hub.com"
  );
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/cta.spec.ts`
Expected: FAIL. `.sticky-cta` and `#contato` don't exist, and there are only 3 WhatsApp links
(header, hero and footer).

- [ ] **Step 3: Escrever a barra fixa**

Create `components/sticky-cta.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { DemoButton } from "@/components/whatsapp";

// Barra do celular: aparece quando o botão do topo sai da tela e some na chamada final.
export function StickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const contact = document.getElementById("contato");
    if (!hero || !contact) return;
    const heroObserver = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    const contactObserver = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting));
    heroObserver.observe(hero);
    contactObserver.observe(contact);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  const visible = !heroVisible && !contactVisible;

  return (
    <div className={`sticky-cta${visible ? " is-visible" : ""}`} aria-hidden={!visible} inert={!visible}>
      <DemoButton />
    </div>
  );
}
```

- [ ] **Step 4: Chamada final na página**

In `app/page.tsx`:
- change the content import to
  `import { CONTACT_EMAIL, audience, contact, extras, faq, hero, pricing, productSection, steps } from "@/components/site-content";`;
- add `import { StickyCta } from "@/components/sticky-cta";`;
- wrap the return in a fragment `<>…</>`;
- after the `#duvidas` section, before `</main>`, insert:
```tsx
      <section className="section contact" id="contato" aria-labelledby="contato-titulo">
        <div className="container">
          <h2 id="contato-titulo">{contact.title}</h2>
          <p className="contact__lead">{contact.lead}</p>
          <div className="contact__actions">
            <DemoButton>{contact.cta}</DemoButton>
            <p>
              {contact.emailIntro} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </div>
      </section>
```
and right after `</main>`, still inside the fragment, add `<StickyCta />`.

- [ ] **Step 5: Estilos**

Append to `app/globals.css`:
```css

/* Chamada final */
.contact {
  background: var(--tinta);
  color: #ffffff;
}

.contact h2 {
  max-width: 18ch;
}

.contact__lead {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.72);
  font-size: clamp(1.125rem, 1rem + 0.4vw, 1.3125rem);
}

.contact__actions {
  display: grid;
  justify-items: start;
  gap: 16px;
  margin-top: 28px;
}

.contact__actions p {
  color: rgba(255, 255, 255, 0.72);
}

.contact__actions a:not(.btn) {
  color: #ffffff;
  text-underline-offset: 3px;
}

.contact .btn-demo {
  background: #ffffff;
  color: var(--tinta);
}

.contact .btn-demo:hover {
  background: var(--espuma);
}

/* Barra fixa do celular */
.sticky-cta {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  padding: 12px var(--gutter) calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--linha);
  background: rgba(255, 255, 255, 0.96);
  transform: translateY(110%);
  transition: transform 0.2s ease;
}

.sticky-cta.is-visible {
  transform: none;
}

.sticky-cta .btn {
  justify-content: center;
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .sticky-cta {
    transition: none;
  }
}

@media (max-width: 899px) {
  .site-footer {
    padding-bottom: calc(48px + 76px);
  }
}

@media (min-width: 900px) {
  .sticky-cta {
    display: none;
  }
}
```

- [ ] **Step 6: Rodar e ver passar (sandbox desligado)**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test`
Expected: all passed.

- [ ] **Step 7: Lint, build e commit**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm run lint && npm run build && git add app components e2e && git commit -q -F - <<'EOF'
feat: chamada final e barra fixa de demonstração no celular

A chamada final oferece o WhatsApp e o email. No celular, uma barra com
"Agendar demonstração" aparece quando o botão do topo sai da tela e some
na chamada final.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 8: Ícone e prévia de link nas cores novas

**Files:**
- Modify: `components/brand-image.tsx`, `app/og-image.png/route.tsx`, `app/icon-64.png/route.tsx`,
  `app/apple-touch-icon.png/route.tsx`, `package.json`
- Create: `e2e/brand.spec.ts`

**Interfaces:**
- Produces:
  - `components/brand-image.tsx` exports `brandFonts()`, `brandColors` and
    `Monogram({ size, rounded? })`.
  - `soraFonts` and `loadSoraBold` are removed.

- [ ] **Step 1: Escrever o teste (falha: monograma ainda em degradê)**

Create `e2e/brand.spec.ts`:
```ts
import { expect, test } from "@playwright/test";

const IMAGES = [
  ["/og-image.png", 1200, 630],
  ["/icon-64.png", 64, 64],
  ["/apple-touch-icon.png", 180, 180]
] as const;

test("imagens geradas são PNG nos tamanhos certos", async ({ request }) => {
  for (const [path, width, height] of IMAGES) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
    const body = await response.body();
    expect([body.readUInt32BE(16), body.readUInt32BE(20)]).toEqual([width, height]);
  }
});

test("monograma em azul sólido e prévia com fundo Tinta", async ({ page }) => {
  await page.goto("/");
  const pixels = await page.evaluate(async () => {
    const read = async (src: string, points: [number, number][]) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      return points.map(([x, y]) => Array.from(context.getImageData(x, y, 1, 1).data).slice(0, 3));
    };
    return {
      icon: await read("/icon-64.png", [[32, 6], [32, 58]]),
      og: await read("/og-image.png", [[10, 10], [1190, 620]])
    };
  });
  for (const rgb of pixels.icon) expect(rgb).toEqual([51, 102, 255]);
  for (const rgb of pixels.og) expect(rgb).toEqual([31, 33, 37]);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/brand.spec.ts`
Expected: the first test passes. The second fails, because the icon is still a blue→teal gradient
and the preview background is `#0b1220`.

- [ ] **Step 3: Trocar a fonte das imagens**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm uninstall --no-fund @fontsource/sora && npm install --save-exact --save-dev --no-fund @fontsource/archivo-narrow@5.3.0 && ls node_modules/@fontsource/archivo-narrow/files/archivo-narrow-latin-700-normal.woff
```
Expected: the `.woff` path is printed.

- [ ] **Step 4: Monograma, fonte e cores**

Replace `components/brand-image.tsx` with:
```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const brandColors = {
  papel: "#ffffff",
  tinta: "#1f2125",
  azul: "#3366ff",
  ambar: "#f5b700"
};

// Ícones e prévia de link usam a Archivo Narrow, irmã condensada da Archivo do site.
// O ImageResponse não lê woff2 nem fonte variável, por isso a fonte vem do @fontsource (woff).
export async function brandFonts() {
  const data = await readFile(
    join(process.cwd(), "node_modules/@fontsource/archivo-narrow/files/archivo-narrow-latin-700-normal.woff")
  );
  return [{ name: "Archivo Narrow", data, weight: 700 as const, style: "normal" as const }];
}

export function Monogram({ size, rounded = true }: { size: number; rounded?: boolean }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: rounded ? size * 0.22 : 0,
        backgroundColor: brandColors.azul,
        color: brandColors.papel,
        fontFamily: "Archivo Narrow",
        fontWeight: 700,
        fontSize: size * 0.5,
        letterSpacing: "-0.02em"
      }}
    >
      EH
    </div>
  );
}
```

- [ ] **Step 5: Rotas das imagens**

Replace `app/icon-64.png/route.tsx` with:
```tsx
import { ImageResponse } from "next/og";
import { Monogram, brandFonts } from "@/components/brand-image";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(<Monogram size={64} />, {
    width: 64,
    height: 64,
    fonts: await brandFonts()
  });
}
```

Replace `app/apple-touch-icon.png/route.tsx` with:
```tsx
import { ImageResponse } from "next/og";
import { Monogram, brandFonts } from "@/components/brand-image";

export const dynamic = "force-static";

// Sem cantos arredondados: o iOS aplica a própria máscara e pinta de preto o que for transparente.
export async function GET() {
  return new ImageResponse(<Monogram size={180} rounded={false} />, {
    width: 180,
    height: 180,
    fonts: await brandFonts()
  });
}
```

Replace `app/og-image.png/route.tsx` with:
```tsx
import { ImageResponse } from "next/og";
import { Monogram, brandColors, brandFonts } from "@/components/brand-image";

export const dynamic = "force-static";

// Prévia de link (WhatsApp, redes sociais). Tamanho 1200x630, declarado em app/layout.tsx.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: brandColors.tinta,
          color: brandColors.papel,
          fontFamily: "Archivo Narrow"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Monogram size={84} />
          <div style={{ fontSize: 48, fontWeight: 700 }}>EstudioHub</div>
        </div>
        <div style={{ display: "flex", maxWidth: 1000, fontSize: 72, fontWeight: 700, lineHeight: 1.04 }}>
          A agenda das salas, as comandas e os pagamentos do seu estúdio num lugar só.
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30 }}>
          <span style={{ color: brandColors.ambar }}>14 dias grátis</span>
          <span style={{ color: "rgba(255, 255, 255, 0.72)" }}>estudio-hub.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await brandFonts() }
  );
}
```

- [ ] **Step 6: Rodar e ver passar; olhar as imagens**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test e2e/brand.spec.ts`
Expected: both passed. Then open `out/og-image.png`, `out/icon-64.png` and
`out/apple-touch-icon.png` with the Read tool and check:
- accents render;
- "EH" is centered;
- the headline fits in 3 lines.

- [ ] **Step 7: Lint, build e commit**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && npm run lint && npm run build && git add app components e2e package.json package-lock.json && git commit -q -F - <<'EOF'
feat: ícone e prévia de link nas cores da nova landing

Monograma "EH" em azul sólido e prévia de link com fundo Tinta, título
da landing e "14 dias grátis". A fonte das imagens passa a ser a Archivo
Narrow (woff do @fontsource), irmã condensada da Archivo do site; sai o
@fontsource/sora.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 9: Página inteira, acessibilidade, documentação e prévia

**Files:**
- Create: `e2e/page.spec.ts`, `e2e/contrast.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Escrever os testes da página inteira e do contraste**

Create `e2e/page.spec.ts`:
```ts
import { expect, test } from "@playwright/test";
import { WIDTHS, expectNoHorizontalScroll, open } from "./helpers";

test("mais curta que antes, e 30% mais curta no celular", async ({ page }) => {
  // Antes: 7.042 px em 1440x900 e 11.683 px em 390x844
  await open(page, 1440, 900);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(7042);
  await open(page, 390, 844);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(8178);
});

for (const width of WIDTHS) {
  test(`página inteira sem rolagem horizontal em ${width}px`, async ({ page }) => {
    await open(page, width);
    await expectNoHorizontalScroll(page);
  });
}

test("nenhum texto em caixa alta forçada", async ({ page }) => {
  await open(page, 1280);
  const count = await page
    .locator("body *")
    .evaluateAll((elements) => elements.filter((element) => getComputedStyle(element).textTransform === "uppercase").length);
  expect(count).toBe(0);
});

test("foco visível ao navegar pelo teclado", async ({ page }) => {
  await open(page, 1280);
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement!);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(outline.style).not.toBe("none");
  expect(outline.width).toBe("3px");
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("conteúdo, preços e botão de demonstração aparecem", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator("#topo h1")).toBeVisible();
    await expect(page.locator("#hero-cta")).toBeVisible();
    await expect(page.locator("#precos")).toContainText("R$ 99,90");
    await expect(page.locator("#contato")).toContainText("Agendar demonstração");
  });
});
```

Create `e2e/contrast.spec.ts`:
```ts
import { expect, test } from "@playwright/test";

type Rgb = [number, number, number];

function parse(color: string): { rgb: Rgb; alpha: number } {
  const hex = color.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const value = parseInt(hex[1], 16);
    return { rgb: [(value >> 16) & 255, (value >> 8) & 255, value & 255], alpha: 1 };
  }
  const rgba = color.match(/rgba?\(([^)]+)\)/)!;
  const [r, g, b, a = "1"] = rgba[1].split(",").map((part) => part.trim());
  return { rgb: [Number(r), Number(g), Number(b)], alpha: Number(a) };
}

function over(foreground: string, background: string): Rgb {
  const top = parse(foreground);
  const bottom = parse(background).rgb;
  return top.rgb.map((channel, index) => channel * top.alpha + bottom[index] * (1 - top.alpha)) as Rgb;
}

function luminance([r, g, b]: Rgb) {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function ratio(foreground: string, background: string) {
  const a = luminance(over(foreground, background));
  const b = luminance(parse(background).rgb);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("todo par de cor com texto passa 4,5:1", async ({ page }) => {
  await page.goto("/");
  const token = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const names = ["--papel", "--espuma", "--tinta", "--tinta-suave", "--azul", "--ambar"];
    return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
  });
  const pairs: [string, string, string][] = [
    ["texto no papel", token["--tinta"], token["--papel"]],
    ["texto secundário no papel", token["--tinta-suave"], token["--papel"]],
    ["texto secundário na espuma", token["--tinta-suave"], token["--espuma"]],
    ["branco no azul (mensalista)", "#ffffff", token["--azul"]],
    ["tinta no âmbar (avulsa)", token["--tinta"], token["--ambar"]],
    ["branco na tinta (grade, contato, rodapé)", "#ffffff", token["--tinta"]],
    ["régua da grade", "rgba(255, 255, 255, 0.64)", token["--tinta"]],
    ["texto suave no escuro", "rgba(255, 255, 255, 0.72)", token["--tinta"]],
    ["azul no papel", token["--azul"], token["--papel"]]
  ];
  for (const [name, foreground, background] of pairs) {
    expect(ratio(foreground, background), name).toBeGreaterThanOrEqual(4.5);
  }
});
```

- [ ] **Step 2: Rodar a suíte inteira (sandbox desligado)**

Run: `cd /Users/danilo/work/repos/estudio-hub && npx playwright test`
Expected: all passed. If the page-height test fails, reduce spacing (`.section`, `.product-rows`,
`.hero`) before touching content, and report the numbers.

- [ ] **Step 3: Atualizar o README**

Replace `README.md` with:
````markdown
# EstudioHub Site

Landing page do EstudioHub em Next.js, exportada como site estático (`output: "export"`) e publicada
pela Cloudflare Pages a cada push na `main`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Export estático

```bash
npm run build
```

Arquivos gerados em `out/`.

## Testes

```bash
npm run lint
npm run test:e2e
```

`test:e2e` faz o build, serve `out/` num servidor estático mínimo (`e2e/serve-out.mjs`) e roda os
testes de `e2e/` com Playwright.

## Estrutura

Página única em `/`, com seções navegáveis por âncora:

- `#topo`: título, botão de demonstração e a grade da noite
- `#como-funciona`: três problemas, com telas reais do produto
- `#tambem-tem`
- `#para-quem`
- `#como-comecar`
- `#precos`
- `#duvidas`
- `#contato`

O texto da página fica todo em `components/site-content.ts`. O design segue
`docs/superpowers/specs/2026-10-15-landing-grade-da-noite-design.md`.

## Telas do produto

As imagens de `public/produto/` são capturas reais, com dados fictícios. Para refazer, siga
`scripts/product-screens/README.md`.
````

- [ ] **Step 4: Verificação final completa**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && rm -rf .next out && npm run lint && npm run build && npx playwright test && npm audit --omit=dev 2>&1 | tail -1 && git status -s
```
Expected:
- lint clean;
- build exit 0;
- all tests passed;
- `found 0 vulnerabilities`;
- only `README.md` and the two new specs pending.

- [ ] **Step 5: Commit**

Run:
```bash
cd /Users/danilo/work/repos/estudio-hub && git add README.md e2e && git commit -q -F - <<'EOF'
test: página inteira, acessibilidade e contraste da landing

Página mais curta que a anterior (30% no celular), nada de rolagem horizontal
em 11 larguras, nada de caixa alta, foco visível pelo teclado, conteúdo
legível sem JavaScript e contraste mínimo de 4,5:1 em todos os pares de
cor com texto. README atualizado com a nova estrutura e os testes.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 6: Enviar a branch e conferir a prévia da Cloudflare**

Push only the branch; this does not publish the site. Run
`cd /Users/danilo/work/repos/estudio-hub && git push -u origin feat/landing-grade-da-noite`.
Then wait for the "Cloudflare Pages" check on the head commit to complete (background `until`
loop on `gh api repos/dnl1/estudio-hub/commits/<sha>/check-runs`), and read its "Branch Preview
URL".

- [ ] **Step 7: Prints para o Danilo**

With the Playwright MCP, take full-page screenshots of the preview URL at 390×844 and 1440×900,
plus a first-screen screenshot at each size. Save them under
`/Users/danilo/work/repos/.playwright-mcp/estudio-hub-landing/`. Look at every one before
reporting.

Then send the Danilo:
- the preview link;
- the screenshot paths;
- the test results.

Ask for approval before any merge into `main`, saying "isso faz deploy em produção".
