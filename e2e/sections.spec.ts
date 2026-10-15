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

test("o balão confirma a reserva do Lia Trio que está na grade", async ({ page }) => {
  await open(page, 1280);
  const grid = page.getByRole("figure", { name: "Uma terça no estúdio, das 18h à meia-noite" });
  await expect(grid.getByRole("list", { name: "Sala 1" }).getByRole("listitem").filter({ hasText: "Lia Trio" })).toContainText(
    "das 20h às 22h"
  );
  const bubble = page.locator(".wa-bubble__text");
  await expect(bubble).toContainText("Olá, Lia!");
  await expect(bubble).toContainText("Sala: Sala 1");
  await expect(bubble).toContainText("Horário: 20:00 às 22:00");
});

// Dia de hoje em São Paulo → data que o balão mostra
const NEXT_TUESDAY = [
  ["2026-11-03T15:00:00Z", "10/11/2026 (terça)", "numa terça, a da semana seguinte"],
  ["2026-11-05T15:00:00Z", "10/11/2026 (terça)", "numa quinta"],
  ["2026-12-30T15:00:00Z", "05/01/2027 (terça)", "na virada do ano"]
] as const;

for (const [instant, expected, when] of NEXT_TUESDAY) {
  test(`o balão mostra a próxima terça ${when}`, async ({ page }) => {
    await page.clock.setFixedTime(new Date(instant));
    await open(page, 1280);
    await expect(page.locator(".wa-bubble__text")).toContainText(`Data: ${expected}`);
  });
}

test.describe("visitante em outro fuso", () => {
  test.use({ timezoneId: "Europe/Lisbon" });

  test("a próxima terça é contada no dia de São Paulo", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-03T02:00:00Z")); // segunda 23h em SP, terça 2h em Lisboa
    await open(page, 1280);
    await expect(page.locator(".wa-bubble__text")).toContainText("Data: 03/11/2026 (terça)");
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("o balão mostra uma terça dos próximos 7 dias", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator(".wa-bubble__text").innerText();
    const [, day, month, year] = text.match(/Data: (\d{2})\/(\d{2})\/(\d{4}) \(terça\)/)!;
    const shown = Date.UTC(Number(year), Number(month) - 1, Number(day));
    const [todayDay, todayMonth, todayYear] = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Sao_Paulo" })
      .format(new Date())
      .split("/")
      .map(Number);
    const days = (shown - Date.UTC(todayYear, todayMonth - 1, todayDay)) / 86_400_000;
    expect(new Date(shown).getUTCDay()).toBe(2);
    expect(days).toBeGreaterThanOrEqual(1);
    expect(days).toBeLessThanOrEqual(7);
  });
});
