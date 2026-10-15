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
