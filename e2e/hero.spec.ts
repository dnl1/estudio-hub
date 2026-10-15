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

test("cada sala da grade é uma lista explícita, para o VoiceOver anunciar o nome da sala", async ({ page }) => {
  // O WebKit tira o papel de lista de <ul> com list-style:none, e aí o aria-label da sala some.
  await open(page, 390, 844);
  const tracks = page.locator(".night-grid__track");
  await expect(tracks).toHaveCount(3);
  for (const track of await tracks.all()) {
    await expect(track).toHaveAttribute("role", "list");
  }
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
