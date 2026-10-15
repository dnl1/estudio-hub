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
