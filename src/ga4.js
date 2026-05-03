// В .env: VITE_GA_MEASUREMENT_ID=G-... и пересборка. Без G- префикса — скрипт не грузится.
const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (typeof id === "string" && id.trim().startsWith("G-")) {
  const mid = id.trim();
  window.dataLayer = window.dataLayer || [];
  // как в официальном сниппете gtag (в корне модуля для ESLint)
  const gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", mid);
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(mid);
  document.head.appendChild(s);
}
