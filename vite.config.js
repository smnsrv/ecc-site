import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project pages live at https://<user>.github.io/<repo>/ — CI sets GITHUB_REPOSITORY.
export default defineConfig(({ command }) => {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const prodBase = repo ? `/${repo}/` : "./";

  return {
    base: command === "serve" ? "/" : prodBase,
    plugins: [react()],
    build: {
      outDir: "docs",
      emptyOutDir: true,
    },
    // Локальный обход CORS: запросы к /_telegram-api/* идут на api.telegram.org (только dev).
    // В production Telegram должен идти через GAS, см. src/integrations/telegram.js
    server: {
      proxy: {
        "/_telegram-api": {
          target: "https://api.telegram.org",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/_telegram-api/, ""),
        },
      },
    },
  };
});
