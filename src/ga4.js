// В .env: VITE_GA_MEASUREMENT_ID=G-... и пересборка. Без G- префикса — скрипт не грузится.
const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (typeof id === "string" && id.trim().startsWith("G-")) {
  const mid = id.trim();
  window.dataLayer = window.dataLayer || [];
  // как в официальном сниппете gtag
  // eslint-disable-next-line prefer-rest-params, func-names
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", mid);
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(mid);
  document.head.appendChild(s);
}
