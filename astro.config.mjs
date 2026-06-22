import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://vesper20001208-glitch.github.io",
  base: "/frenchiepedia",
  integrations: [sitemap()],
  build: { format: "directory" },
  compressHTML: true,
  scopedStyleStrategy: "class",
  prefetch: { prefetchAll: true },
});
