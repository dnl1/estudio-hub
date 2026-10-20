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

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("a linha agora fica em 21h", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    const line = (await page.locator(".playhead").boundingBox())!;
    const tick = (await page.locator(".night-grid__ruler span", { hasText: "21h" }).boundingBox())!;
    expect(Math.abs(line.x + line.width / 2 - (tick.x + tick.width / 2))).toBeLessThan(2);
  });
});

// Horários de São Paulo: fora da grade (linha em 21h), logo no começo, na virada de hora e no meio dela
const MOMENTS = [
  ["2026-10-20T13:00:00Z", "10h"],
  ["2026-10-20T21:05:00Z", "18h05"],
  ["2026-10-20T23:00:00Z", "20h"],
  ["2026-10-20T23:10:00Z", "20h10"],
  ["2026-10-21T02:40:00Z", "23h40"]
] as const;

for (const width of [320, 390, 1440]) {
  test(`etiqueta e linha agora não cobrem os textos da grade em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    let crossings = 0;
    for (const [instant, moment] of MOMENTS) {
      await page.clock.setFixedTime(new Date(instant));
      await open(page, width);
      await expect(page.locator(".playhead")).not.toHaveAttribute("data-position", "0.00");
      const result = await page.evaluate(() => {
        document.querySelector(".night-grid")!.scrollIntoView({ block: "center", behavior: "instant" });
        // A linha não recebe clique; aqui ela passa a receber, para saber o que fica por cima em cada ponto.
        const probe = document.createElement("style");
        probe.textContent = ".playhead-lane, .playhead-lane * { pointer-events: auto !important; }";
        document.head.append(probe);
        const line = document.querySelector(".playhead")!.getBoundingClientRect();
        const x = line.left + line.width / 2;
        const label = document.querySelector(".playhead__label")!.getBoundingClientRect();
        const covered: string[] = [];
        for (const tick of document.querySelectorAll(".night-grid__ruler span")) {
          const box = tick.getBoundingClientRect();
          if (label.left < box.right && box.left < label.right && label.top < box.bottom && box.top < label.bottom) {
            covered.push(`a etiqueta cobre ${tick.textContent}`);
          }
        }
        let crossings = 0;
        for (const text of document.querySelectorAll(".night-grid__ruler span, .booking__label, .booking__kind, .booking__tab")) {
          const box = text.getBoundingClientRect();
          if (box.width === 0 || !(box.left < x && x < box.right)) continue;
          crossings += 1;
          const top = document.elementFromPoint(x, box.top + box.height / 2);
          if (!top || !(top === text || text.contains(top))) covered.push(`a linha passa por cima de ${text.textContent}`);
        }
        probe.remove();
        return { covered, crossings };
      });
      expect(result.covered, `às ${moment}`).toEqual([]);
      crossings += result.crossings;
    }
    expect(crossings, "a linha cruzou algum texto em algum horário").toBeGreaterThan(0);
  });
}

test("nota do topo anuncia o primeiro mês grátis", async ({ page }) => {
  await open(page, 390, 844);
  await expect(page.locator(".hero__note")).toHaveText("1º mês grátis, com a gente acompanhando.");
  const description = await page.locator('meta[name="description"]').getAttribute("content");
  expect(description).toContain("1º mês grátis.");
  expect(description).not.toContain("14 dias");
});
