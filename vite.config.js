import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub project pages are served under /<repo>/; relative base keeps asset URLs valid.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
