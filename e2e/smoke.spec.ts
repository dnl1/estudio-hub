import { expect, test } from "@playwright/test";

test("a página inicial carrega com o nome do EstudioHub", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/EstudioHub/);
});
