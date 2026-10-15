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
  // Recorta a primeira fileira de dias (domingo a quarta): mensalista, bloqueio e reservas
  // aparecem nela, e a imagem fica leve. A semana inteira em 2x passa de 500 KB.
  const days = await page.locator(".day").evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, right: box.right, bottom: box.bottom };
    })
  );
  const row = days.filter((day) => Math.abs(day.y - days[0].y) < 2);
  await page.screenshot({
    path: join(OUT, "agenda-bandas.jpg"),
    ...JPEG,
    clip: {
      x: row[0].x - 16,
      y: row[0].y - 4, // margem curta em cima: logo acima ficam os botões de semana
      width: row.at(-1).right - row[0].x + 32,
      height: Math.max(...row.map((day) => day.bottom)) - row[0].y + 20
    }
  });
  console.log("✔ agenda-bandas.jpg");
}

// 4. Admin: comanda da Sala 1 e janela de recebimento (sem confirmar o recebimento)
{
  // Janela alta: o painel de divisão fica inteiro na tela, sem rolar (o topo do admin é fixo).
  const page = await newPage({ width: 1280, height: 2400 });
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
  // Recorta o painel "Pessoas da comanda": o ensaio dividido entre as pessoas e o valor em aberto de cada uma.
  const heading = (await page.getByRole("heading", { name: "Pessoas da comanda" }).boundingBox());
  const shared = (await page.getByText("Item compartilhado: valor dividido igualmente").boundingBox());
  const addPerson = (await page.getByRole("button", { name: "Adicionar pessoa" }).boundingBox());
  await page.screenshot({
    path: join(OUT, "comanda.jpg"),
    ...JPEG,
    clip: {
      x: heading.x - 24,
      y: heading.y - 24,
      width: addPerson.x + addPerson.width - heading.x + 48,
      height: shared.y + shared.height - heading.y + 48
    }
  });
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
