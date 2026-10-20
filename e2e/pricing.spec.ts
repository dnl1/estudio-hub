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

test("preços mostram a promoção, o preço cheio e o anual em 12x", async ({ page }) => {
  await open(page, 1280);
  const section = page.locator("#precos");
  await expect(section.locator(".section-head p")).toHaveText(
    "Para estúdios que começarem até 31 de março de 2027: o primeiro mês é grátis e os três seguintes saem por cerca de 30% do preço."
  );
  const plans = section.locator(".plan");
  await expect(plans.locator("h3")).toHaveText(["Starter", "Growth", "Scale", "Enterprise"]);
  const expected = [
    ["Até 2 salas", "R$ 29,90", "Depois, R$ 99,90 por mês", "Ou plano anual em 12x de R$ 74,99 (R$ 899,90)"],
    ["De 3 a 5 salas", "R$ 59,90", "Depois, R$ 199,90 por mês", "Ou plano anual em 12x de R$ 149,99 (R$ 1.799,90)"],
    ["De 6 a 10 salas", "R$ 104,90", "Depois, R$ 349,90 por mês", "Ou plano anual em 12x de R$ 262,49 (R$ 3.149,90)"]
  ];
  for (const [index, texts] of expected.entries()) {
    const plan = plans.nth(index);
    await expect(plan.locator(".plan__badge")).toHaveText("1º mês grátis");
    await expect(plan.locator(".plan__price")).toContainText(texts[1]);
    await expect(plan.locator(".plan__window")).toHaveText("do 2º ao 4º mês");
    for (const text of [texts[0], texts[2], texts[3]]) await expect(plan).toContainText(text);
  }
  const enterprise = plans.nth(3);
  await expect(enterprise).toContainText("11 salas ou mais");
  await expect(enterprise).toContainText("Sob consulta");
  await expect(enterprise.locator(".plan__badge")).toHaveCount(0);
  await expect(section).not.toContainText("a cada 6 meses");
  await expect(section).toContainText(
    "Em uso no Warzone, estúdio de ensaio em Santos (SP), nas unidades Canal 1 e Canal 3."
  );
});

test("no plano, o selo vem antes do nome e o preço cheio é texto pequeno e legível", async ({ page }) => {
  await open(page, 390, 844);
  const starter = page.locator("#precos .plan").first();
  const text = (await starter.innerText()).replace(/\s+/g, " ");
  expect(text.indexOf("1º mês grátis")).toBeLessThan(text.indexOf("Starter"));
  const original = starter.locator(".plan__original");
  const style = await original.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { size: computed.fontSize, color: computed.color };
  });
  expect(style.size).toBe("12px");
  const muted = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--tinta-suave").trim());
  expect(style.color.replace(/\s/g, "")).toBe(muted.replace(/\s/g, ""));
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

for (const width of [1024, 1280]) {
  test(`valores do plano não quebram no meio em ${width}px`, async ({ page }) => {
    await open(page, width);
    const plans = page.locator("#precos .plan");
    for (let index = 0; index < 3; index++) {
      const prices = plans.nth(index).locator(".plan__original .nowrap");
      await expect(prices).toHaveCount(3);
      const lines = await prices.evaluateAll((items) => items.map((item) => item.getClientRects().length));
      expect(lines).toEqual([1, 1, 1]);
    }
  });
}
