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
    await expect(page.locator("#precos")).toContainText("R$ 29,90");
    await expect(page.locator("#precos")).toContainText("Depois, R$ 99,90 por mês");
    await expect(page.locator("#contato")).toContainText("Agendar demonstração");
  });
});

// Âncoras do site antigo, que podem estar em links já compartilhados
const OLD_ANCHORS = [
  ["home", "topo"],
  ["funcionalidades", "como-funciona"],
  ["integracoes", "tambem-tem"],
  ["sobre", "para-quem"],
  ["planos", "precos"],
  ["seguranca", "duvidas"]
] as const;

for (const [old, section] of OLD_ANCHORS) {
  test(`endereço antigo #${old} leva à seção #${section}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/#${old}`);
    await expect(page.locator(`#${old}`)).toHaveCount(1);
    const title = page.locator(`#${section}-titulo`);
    await expect(title).toBeInViewport();
    const header = (await page.locator(".site-header").boundingBox())!;
    await expect.poll(async () => (await title.boundingBox())!.y).toBeGreaterThanOrEqual(header.y + header.height);
  });
}
