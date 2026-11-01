// Serve out/ com os mesmos cabeçalhos e 404 do Azure Static Web Apps.
import { createReadStream, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const root = resolve("out");
const port = Number(process.argv[2] ?? 4300);
const hosting = JSON.parse(readFileSync(join(root, "staticwebapp.config.json"), "utf8"));
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon"
};

function resolveFile(urlPath) {
  for (const candidate of [urlPath, `${urlPath}/index.html`, `${urlPath}.html`]) {
    const file = resolve(root, `.${candidate}`);
    if (!file.startsWith(`${root}${sep}`)) continue;
    try {
      if (statSync(file).isFile()) return file;
    } catch {
      // Tenta o próximo formato de rota estática.
    }
  }
  return null;
}

function routeMatches(route, pathname) {
  const pattern = route.split("*").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${pattern}$`).test(pathname);
}

createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent((req.url ?? "/").split("?")[0]);
  } catch {
    res.writeHead(400, { ...hosting.globalHeaders, "content-type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { ...hosting.globalHeaders, Allow: "GET, HEAD" });
    res.end();
    return;
  }
  const file = resolveFile(pathname);
  const status = file ? 200 : 404;
  const target = file ?? join(root, "404.html");
  const headers = { ...hosting.globalHeaders, "content-type": types[extname(target)] ?? "application/octet-stream" };
  for (const route of hosting.routes ?? []) {
    if (routeMatches(route.route, pathname)) Object.assign(headers, route.headers);
  }
  if (status === 404) headers["X-Robots-Tag"] = "noindex";
  res.writeHead(status, headers);
  if (req.method === "HEAD") res.end();
  else createReadStream(target).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`out/ em http://127.0.0.1:${port}`));
