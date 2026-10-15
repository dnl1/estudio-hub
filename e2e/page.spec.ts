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
