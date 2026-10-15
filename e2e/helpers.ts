import { expect, type Page } from "@playwright/test";

export const WIDTHS = [320, 390, 400, 412, 430, 720, 721, 1024, 1101, 1200, 1280, 1366, 1440, 1920];
export const DEMO_MESSAGE = "Oi! Quero agendar a demonstração de 15 min do EstudioHub.";

export async function open(page: Page, width: number, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}

export async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(scrollWidth, "rolagem horizontal").toBeLessThanOrEqual(clientWidth);
}
