import { expect, test } from "@playwright/test";

const IMAGES = [
  ["/og-image.png", 1200, 630],
  ["/icon-64.png", 64, 64],
  ["/apple-touch-icon.png", 180, 180]
] as const;

test("imagens geradas são PNG nos tamanhos certos", async ({ request }) => {
  for (const [path, width, height] of IMAGES) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
    const body = await response.body();
    expect([body.readUInt32BE(16), body.readUInt32BE(20)]).toEqual([width, height]);
  }
});

test("monograma em azul sólido e prévia com fundo Tinta", async ({ page }) => {
  await page.goto("/");
  const pixels = await page.evaluate(async () => {
    const read = async (src: string, points: [number, number][]) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      return points.map(([x, y]) => Array.from(context.getImageData(x, y, 1, 1).data).slice(0, 3));
    };
    return {
      icon: await read("/icon-64.png", [[32, 6], [32, 58]]),
      og: await read("/og-image.png", [[10, 10], [1190, 620]])
    };
  });
  for (const rgb of pixels.icon) expect(rgb).toEqual([51, 102, 255]);
  for (const rgb of pixels.og) expect(rgb).toEqual([31, 33, 37]);
});
