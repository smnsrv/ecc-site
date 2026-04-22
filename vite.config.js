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
  };
});
