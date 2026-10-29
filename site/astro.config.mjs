// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

function watchParentDocs() {
  return {
    name: "watch-parent-docs",
    /** @param {any} server */
    configureServer(server) {
      const dirs = ["../roadmap", "../workflow", "../rfcs"].map((d) =>
        fileURLToPath(new URL(d, import.meta.url)),
      );
      server.watcher.add(dirs);
      /** @param {string} file */
      const onChange = (file) => {
        if (!file.endsWith(".md")) return;
        for (const mod of server.moduleGraph.idToModuleMap.values()) {
          if (
            mod.file === file ||
            mod.file?.endsWith("/src/shared/docs.ts") ||
            mod.file?.endsWith("/src/shared/site.ts")
          ) {
            server.moduleGraph.invalidateModule(mod);
          }
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("change", onChange);
      server.watcher.on("add", onChange);
    },
  };
}

export default defineConfig({
  site: "https://club.penguin.ooo",
  trailingSlash: "always",
  markdown: {
    smartypants: false,
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  },
  vite: {
    plugins: [tailwindcss(), watchParentDocs()],
    server: { fs: { allow: [".."] } },
  },
});
