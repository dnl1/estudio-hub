import { expect, test } from "@playwright/test";

const productionUrl = "https://estudio-hub.com/";

test("HTML estático tem metadados, conteúdo indexável e imagens descritivas", async ({ browser, request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("A agenda das salas, as comandas e os pagamentos do seu estúdio num lugar só.");
  expect(html).not.toMatch(/__NEXT_DATA__|self\.__next_f|\/_next\/|astro-island/);

  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveTitle("EstudioHub | Agenda, comandas e pagamentos para estúdios");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", productionUrl);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /agenda das salas sem conflito/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", productionUrl);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${productionUrl}og-image.png`);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  await expect(page.locator("#precos")).toContainText("R$ 104,90");
  await page.locator("#duvidas summary").first().click();
  await expect(page.locator("#duvidas details").first().locator("p")).toBeVisible();
  for (const image of await page.locator("main img").all()) {
    await expect(image).toHaveAttribute("alt", /EstudioHub/);
    expect(Number(await image.getAttribute("width"))).toBeGreaterThan(0);
    expect(Number(await image.getAttribute("height"))).toBeGreaterThan(0);
    await expect(image).toHaveAttribute("loading", "lazy");
  }
  await context.close();
});

test("navegação e FAQ funcionam sem JavaScript no celular", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 320, height: 568 } });
  const page = await context.newPage();
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(navigation).toBeVisible();
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeHidden();
  await navigation.getByRole("link", { name: "Preços" }).click();
  await expect(page).toHaveURL(/\/#precos$/);
  await expect(page.locator("#precos-titulo")).toBeInViewport();
  await page.locator("#duvidas summary").first().click();
  await expect(page.locator("#duvidas details").first().locator("p")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await context.close();
});

test("JSON-LD descreve somente o site e o produto, sem avaliações ou ofertas inventadas", async ({ page }) => {
  await page.goto("/");
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(data["@context"]).toBe("https://schema.org");
  expect(data["@graph"].map((item: { "@type": string }) => item["@type"])).toEqual([
    "WebSite", "Organization", "SoftwareApplication"
  ]);
  for (const item of data["@graph"]) {
    expect(item.name).toBe("EstudioHub");
    expect(item.url).toBe(productionUrl);
    expect(item).not.toHaveProperty("aggregateRating");
    expect(item).not.toHaveProperty("review");
    expect(item).not.toHaveProperty("offers");
  }
});

test("robots e sitemap apontam à produção e não incluem o 404", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toContain("text/plain");
  expect(await robots.text()).toContain("User-agent: *\nAllow: /");
  expect(await robots.text()).toContain(`Sitemap: ${productionUrl}sitemap.xml`);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toContain("xml");
  const xml = await sitemap.text();
  expect(xml.match(/<loc>([^<]+)<\/loc>/g)).toEqual([`<loc>${productionUrl}</loc>`]);
  expect(xml).not.toMatch(/404|localhost|127\.0\.0\.1/);
});

test("rota desconhecida retorna 404 real e não é indexável", async ({ page }) => {
  const response = await page.goto("/pagina-que-nao-existe");
  expect(response?.status()).toBe(404);
  expect(response?.headers()["x-robots-tag"]).toBe("noindex");
  await expect(page.locator(".logo")).toHaveAttribute("href", "/#topo");
  await expect(page).toHaveTitle("Página não encontrada | EstudioHub");
  await expect(page.locator("h1")).toHaveText("Página não encontrada");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await page.getByRole("link", { name: "Voltar para o EstudioHub", exact: true }).click();
  await expect(page.locator("#hero-cta")).toBeVisible();
});

test("scripts nativos funcionam sob CSP estrita e os assets têm cache correto", async ({ page, request }) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      document.documentElement.dataset.cspViolation = event.violatedDirective;
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto("/");
  const csp = response?.headers()["content-security-policy"];
  expect(csp).toContain("script-src 'self'");
  expect(csp).toContain("style-src 'self'");
  expect(csp).not.toMatch(/unsafe-inline|unsafe-eval|_next/);
  expect(response?.headers()["strict-transport-security"]).toContain("max-age=31536000");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.locator("#main-navigation")).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-csp-violation");
  expect(failures).toEqual([]);

  for (const asset of await page.locator('script[src], link[rel="stylesheet"]').all()) {
    const url = (await asset.getAttribute("src")) ?? (await asset.getAttribute("href"))!;
    expect(url).toMatch(/^\/_astro\//);
    const response = await request.get(url);
    expect(response.status()).toBe(200);
    expect(response.headers()["cache-control"]).toContain("immutable");
  }
  await expect(page.locator('script:not([src]):not([type="application/ld+json"])')).toHaveCount(0);
  const font = await request.get("/fonts/archivo-latin.woff2");
  expect(font.status()).toBe(200);
  expect(font.headers()["content-type"]).toBe("font/woff2");
  expect(font.headers()["cache-control"]).not.toContain("immutable");
  const image = await request.get("/og-image.png");
  expect(image.status()).toBe(200);
  expect(image.headers()["cache-control"]).toContain("must-revalidate");
  expect(image.headers()["cache-control"]).not.toContain("immutable");
});
