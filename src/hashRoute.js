/**
 * Клиентский роутинг через location.hash (совместимо с GitHub Pages без SPA-fallback на сервере).
 * Форматы: #/, #/services, #/service/2, #/we-certify, #/we-certify/household, #/about, #/contacts, #/certification-stages, #/admin
 */

function normalize(raw) {
  let h = (raw || "").replace(/^#/, "");
  if (!h || h === "/") return "/";
  return h.startsWith("/") ? h : `/${h}`;
}

/** @returns {{ key: string, legacy: boolean } | null} */
function legacyArticleFromHash(hash) {
  const h = (hash || "").replace(/^#/, "");
  if (h === "we-certify-household") return { key: "household", legacy: true };
  if (h.startsWith("we-certify-article-")) return { key: h.slice("we-certify-article-".length), legacy: true };
  return null;
}

/**
 * @param {string} hash
 * @param {string[] | null} validArticleKeys — ключи we_certify_articles для валидации сегмента (можно null)
 */
export function parseAppHash(hash, validArticleKeys = null) {
  const path = normalize(hash);
  if (path === "/admin" || path === "admin") {
    return { admin: true, page: "home", serviceId: null, articleKey: null, legacyHash: false };
  }

  const legacy = legacyArticleFromHash(hash);
  if (legacy) {
    const ok = !validArticleKeys || validArticleKeys.includes(legacy.key);
    return {
      admin: false,
      page: "we-certify",
      serviceId: null,
      articleKey: ok ? legacy.key : null,
      legacyHash: Boolean(ok && legacy.legacy),
    };
  }

  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return { admin: false, page: "home", serviceId: null, articleKey: null, legacyHash: false };

  const [a, b] = parts;
  if (a === "service" && b != null) {
    const id = Number.parseInt(String(b), 10);
    if (!Number.isNaN(id)) return { admin: false, page: "service", serviceId: id, articleKey: null, legacyHash: false };
  }
  if (a === "we-certify") {
    let articleKey = b || null;
    if (articleKey && validArticleKeys && !validArticleKeys.includes(articleKey)) articleKey = null;
    return { admin: false, page: "we-certify", serviceId: null, articleKey, legacyHash: false };
  }
  if (a === "services") return { admin: false, page: "services", serviceId: null, articleKey: null, legacyHash: false };
  if (a === "about") return { admin: false, page: "about", serviceId: null, articleKey: null, legacyHash: false };
  if (a === "contacts") return { admin: false, page: "contacts", serviceId: null, articleKey: null, legacyHash: false };
  if (a === "certification-stages")
    return { admin: false, page: "certification-stages", serviceId: null, articleKey: null, legacyHash: false };

  return { admin: false, page: "home", serviceId: null, articleKey: null, legacyHash: false };
}

/**
 * @param {string} page
 * @param {{ id?: number, articleKey?: string | null }} opts
 */
export function buildHash(page, opts = {}) {
  if (page === "admin") return "#/admin";
  if (page === "home") return "#/";
  if (page === "services") return "#/services";
  if (page === "about") return "#/about";
  if (page === "contacts") return "#/contacts";
  if (page === "certification-stages") return "#/certification-stages";
  if (page === "service" && opts.id != null) return `#/service/${opts.id}`;
  if (page === "we-certify") {
    if (opts.articleKey) return `#/we-certify/${opts.articleKey}`;
    return "#/we-certify";
  }
  return "#/";
}

export function articleKeysFromData(weCertifyArticles) {
  if (!weCertifyArticles || typeof weCertifyArticles !== "object") return [];
  return Object.keys(weCertifyArticles);
}
