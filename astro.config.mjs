import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://estudio-hub.com",
  outDir: "./out/",
  build: {
    format: "directory",
    inlineStylesheets: "never"
  },
  vite: {
    build: { assetsInlineLimit: 0 }
  }
});
