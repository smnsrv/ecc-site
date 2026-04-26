import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const prodBase = repo ? `/${repo}/` : "./";

  return {
    base: command === "serve" ? "/" : prodBase,
    plugins: [
      react(),
      {
        name: "seo-canon-ld",
        transformIndexHtml(html) {
          const origin = (process.env.VITE_SITE_ORIGIN || "").trim().replace(/\/$/, "");
          if (!origin) return html;
          const logo = `${origin}/${encodeURIComponent("ECC Logo-v1.svg")}`;
          const org = {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Electro Class Control",
            url: origin + "/",
            logo,
          };
          const inj = `    <link rel="canonical" href="${origin}/" />
    <meta property="og:url" content="${origin}/" />
    <meta property="og:image" content="${logo}" />
    <meta name="twitter:image" content="${logo}" />
    <script type="application/ld+json">${JSON.stringify(org)}<\/script>
`;
          return html.replace(/<\/head>/, inj + "  </head>");
        },
      },
    ],
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
