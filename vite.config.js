import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
