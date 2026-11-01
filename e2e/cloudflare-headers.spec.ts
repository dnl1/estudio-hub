import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

type HeaderRule = {
  pattern: string;
  headers: Record<string, string>;
};

function parseCloudflareHeaders(source: string): HeaderRule[] {
  const rules: HeaderRule[] = [];

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (!line.startsWith(" ") && !line.startsWith("\t")) {
      rules.push({ pattern: trimmed, headers: {} });
      continue;
    }

    const header = trimmed.match(/^([^:]+):\s*(.*)$/);
    const rule = rules.at(-1);
    if (!header || !rule) throw new Error(`Invalid Cloudflare _headers line: ${line}`);
    rule.headers[header[1]] = header[2];
  }

  return rules;
}

function matches(pattern: string, pathname: string): boolean {
  const regex = pattern
    .split("*")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${regex}$`).test(pathname);
}

function mergedCloudflareHeaders(rules: HeaderRule[], pathname: string): Map<string, string[]> {
  const merged = new Map<string, string[]>();
  for (const rule of rules) {
    if (!matches(rule.pattern, pathname)) continue;
    for (const [name, value] of Object.entries(rule.headers)) {
      merged.set(name, [...(merged.get(name) ?? []), value]);
    }
  }
  return merged;
}

test("Cloudflare Pages _headers has one nonconflicting cache policy per URL", () => {
  const source = readFileSync(join(process.cwd(), "public/_headers"), "utf8");
  const built = readFileSync(join(process.cwd(), "out/_headers"), "utf8");
  expect(built).toBe(source);

  const rules = parseCloudflareHeaders(source);
  const globalRule = rules.find((rule) => rule.pattern === "/*");
  expect(globalRule).toBeDefined();
  expect(globalRule?.headers["Cache-Control"]).toBeUndefined();

  const expected = new Map([
    ["/", "public, max-age=0, must-revalidate"],
    ["/index.html", "public, max-age=0, must-revalidate"],
    ["/robots.txt", "public, max-age=0, must-revalidate"],
    ["/sitemap.xml", "public, max-age=0, must-revalidate"],
    ["/404.html", "public, max-age=0, must-revalidate"],
    ["/fonts/archivo-latin.woff2", "public, max-age=86400, must-revalidate"],
    ["/produto/agenda-bandas.jpg", "public, max-age=3600, must-revalidate"],
    ["/og-image.png", "public, max-age=3600, must-revalidate"],
    ["/_astro/generated-hash.js", "public, max-age=31536000, immutable"]
  ]);

  for (const [pathname, cacheControl] of expected) {
    const headers = mergedCloudflareHeaders(rules, pathname);
    expect(headers.get("Cache-Control"), pathname).toEqual([cacheControl]);
  }

  const notFoundHeaders = mergedCloudflareHeaders(rules, "/404.html");
  expect(notFoundHeaders.get("X-Robots-Tag")).toEqual(["noindex"]);
});

test("Cloudflare immutable policy covers a generated Astro asset", () => {
  const source = readFileSync(join(process.cwd(), "public/_headers"), "utf8");
  const html = readFileSync(join(process.cwd(), "out/index.html"), "utf8");
  const assetPath = html.match(/\/_astro\/[^"'?]+/)?.[0];
  expect(assetPath).toBeTruthy();
  if (!assetPath) throw new Error("The built page has no generated Astro asset");

  const headers = mergedCloudflareHeaders(parseCloudflareHeaders(source), assetPath);
  expect(headers.get("Cache-Control")).toEqual(["public, max-age=31536000, immutable"]);
});
