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
        // A margem lateral (16 px no celular, 32 px a partir de 900 px) não pode ser comida
        const gutter = width >= 900 ? 32 : 16;
        expect(box.x + box.width, `${selector} invade a margem direita`).toBeLessThanOrEqual(width - gutter + 0.5);
      }
    }
    const desktop = width >= 900;
    await expect(page.locator("#main-navigation")).toBeVisible({ visible: desktop });
    await expect(page.locator(".menu-toggle")).toBeVisible({ visible: !desktop });
    await expect(page.locator(".header-cta")).toBeVisible({ visible: width >= 450 });
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
