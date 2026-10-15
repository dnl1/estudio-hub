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

test("barra fixa segue a leitura mais recente do botão do topo", async ({ page }) => {
  // Num gesto rápido o navegador entrega duas leituras de uma vez; vale a última.
  await page.addInitScript(() => {
    const observers: { callback: IntersectionObserverCallback; targets: Element[] }[] = [];
    Object.assign(window, { __observers: observers });
    window.IntersectionObserver = class {
      callback: IntersectionObserverCallback;
      targets: Element[] = [];
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        observers.push(this);
      }
      observe(target: Element) {
        this.targets.push(target);
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;
  });
  await open(page, 390, 844);
  const deliver = (states: boolean[]) =>
    page.evaluate((states) => {
      const hero = document.getElementById("hero-cta")!;
      const { __observers } = window as unknown as { __observers: { callback: (entries: unknown[]) => void; targets: Element[] }[] };
      __observers.find((observer) => observer.targets.includes(hero))!.callback(
        states.map((isIntersecting) => ({ target: hero, isIntersecting }))
      );
    }, states);
  const bar = page.locator(".sticky-cta");
  await deliver([true, false]); // o botão saiu da tela
  await expect(bar).toHaveAttribute("aria-hidden", "false");
  await deliver([false, true]); // saiu e voltou no mesmo gesto
  await expect(bar).toHaveAttribute("aria-hidden", "true");
});
