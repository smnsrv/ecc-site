/** @param {object} data */
export function computeDocumentTitle(data, { page, serviceId, weArticleKey }) {
  const pt = data.ui?.page_titles;
  const suffix = (pt && pt.suffix) || "Electro Class Control";
  if (page === "home") return (pt && pt.home) || suffix;
  if (page === "services") return (pt && pt.services) || `Услуги — ${suffix}`;
  if (page === "about") return (pt && pt.about) || `О компании — ${suffix}`;
  if (page === "contacts") return (pt && pt.contacts) || `Контакты — ${suffix}`;
  if (page === "certification-stages") return (pt && pt.certification_stages) || `Этапы сертификации — ${suffix}`;
  if (page === "we-certify") {
    if (weArticleKey) {
      const dir = Array.isArray(data.we_certify) ? data.we_certify.find((d) => d.articleKey === weArticleKey) : null;
      if (dir?.title) return `${dir.title} — ${suffix}`;
    }
    return (pt && pt.we_certify) || `Мы сертифицируем — ${suffix}`;
  }
  if (page === "service" && serviceId != null) {
    const s = Array.isArray(data.services) ? data.services.find((x) => Number(x.id) === Number(serviceId)) : null;
    if (s?.name) return `${s.name} — ${suffix}`;
    return (pt && pt.service_fallback) || `Услуга — ${suffix}`;
  }
  return suffix;
}
