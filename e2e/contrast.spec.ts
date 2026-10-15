import { expect, test } from "@playwright/test";

type Rgb = [number, number, number];

function parse(color: string): { rgb: Rgb; alpha: number } {
  const hex = color.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const value = parseInt(hex[1], 16);
    return { rgb: [(value >> 16) & 255, (value >> 8) & 255, value & 255], alpha: 1 };
  }
  const rgba = color.match(/rgba?\(([^)]+)\)/)!;
  const [r, g, b, a = "1"] = rgba[1].split(",").map((part) => part.trim());
  return { rgb: [Number(r), Number(g), Number(b)], alpha: Number(a) };
}

function over(foreground: string, background: string): Rgb {
  const top = parse(foreground);
  const bottom = parse(background).rgb;
  return top.rgb.map((channel, index) => channel * top.alpha + bottom[index] * (1 - top.alpha)) as Rgb;
}

function luminance([r, g, b]: Rgb) {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function ratio(foreground: string, background: string) {
  const a = luminance(over(foreground, background));
  const b = luminance(parse(background).rgb);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("todo par de cor com texto passa 4,5:1", async ({ page }) => {
  await page.goto("/");
  const token = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const names = ["--papel", "--espuma", "--tinta", "--tinta-suave", "--azul", "--ambar"];
    return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
  });
  const pairs: [string, string, string][] = [
    ["texto no papel", token["--tinta"], token["--papel"]],
    ["texto secundário no papel", token["--tinta-suave"], token["--papel"]],
    ["texto secundário na espuma", token["--tinta-suave"], token["--espuma"]],
    ["branco no azul (mensalista)", "#ffffff", token["--azul"]],
    ["tinta no âmbar (avulsa)", token["--tinta"], token["--ambar"]],
    ["branco na tinta (grade, contato, rodapé)", "#ffffff", token["--tinta"]],
    ["régua da grade", "rgba(255, 255, 255, 0.64)", token["--tinta"]],
    ["texto suave no escuro", "rgba(255, 255, 255, 0.72)", token["--tinta"]],
    ["azul no papel", token["--azul"], token["--papel"]]
  ];
  for (const [name, foreground, background] of pairs) {
    expect(ratio(foreground, background), name).toBeGreaterThanOrEqual(4.5);
  }
});
