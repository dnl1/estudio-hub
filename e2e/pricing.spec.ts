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
  // A rolagem é suave: espera o título chegar à metade de cima da tela antes de medir
  await expect
    .poll(async () => (await page.locator("#precos h2").boundingBox())!.y, { timeout: 5000 })
    .toBeLessThan(844 / 2);
  await page.waitForTimeout(500);
  const titleTop = (await page.locator("#precos h2").boundingBox())!.y;
  expect(titleTop).toBeGreaterThanOrEqual(header.y + header.height);
});
