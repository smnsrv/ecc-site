import { useEffect } from "react";

const BREADCRUMB_LD_ID = "ecc-breadcrumb-jsonld";

function injectBreadcrumbJsonLd(schemaItems) {
  if (typeof document === "undefined" || !schemaItems?.length) return;
  const root = window.location.href.split("#")[0].replace(/#$/, "");
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems.map((b, i) => {
      const hash = b.path.startsWith("#") ? b.path : `#/${b.path}`;
      return {
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: `${root}${hash}`,
      };
    }),
  };
  let el = document.getElementById(BREADCRUMB_LD_ID);
  if (!el) {
    el = document.createElement("script");
    el.id = BREADCRUMB_LD_ID;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json).replace(/</g, "\\u003c");
}

function removeBreadcrumbJsonLd() {
  if (typeof document === "undefined") return;
  document.getElementById(BREADCRUMB_LD_ID)?.remove();
}

export default function PageHero({
  eyebrow,
  title,
  sub,
  onBack,
  backLabel = "← Назад к услугам",
  breadcrumbs,
  breadcrumbSchema,
  breadcrumbAriaLabel = "Хлебные крошки",
  contextNote,
  heroClassName,
}) {
  const schemaKey =
    Array.isArray(breadcrumbSchema) && breadcrumbSchema.length > 0
      ? breadcrumbSchema.map((b) => `${b.name}::${b.path}`).join("|")
      : "";

  useEffect(() => {
    if (!schemaKey) {
      removeBreadcrumbJsonLd();
      return undefined;
    }
    injectBreadcrumbJsonLd(breadcrumbSchema);
    return () => removeBreadcrumbJsonLd();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- обновляем JSON-LD только при смене цепочки (schemaKey)
  }, [schemaKey]);

  const heroClasses = ["page-hero", heroClassName].filter(Boolean).join(" ");

  return (
    <section className={heroClasses}>
      <div className="container fade-up">
        {Array.isArray(breadcrumbs) && breadcrumbs.length ? (
          <nav className="page-breadcrumbs" aria-label={breadcrumbAriaLabel}>
            <ol className="page-breadcrumbs-list">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${i}`} className="page-breadcrumbs-item">
                    {!isLast ? (
                      typeof crumb.onClick === "function" ? (
                        <button type="button" className="page-breadcrumbs-link" onClick={crumb.onClick}>
                          {crumb.label}
                        </button>
                      ) : (
                        <span className="page-breadcrumbs-text">{crumb.label}</span>
                      )
                    ) : (
                      <span className="page-breadcrumbs-current" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                    {!isLast ? (
                      <span className="page-breadcrumbs-sep" aria-hidden>
                        /
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}
        {typeof onBack === "function" ? (
          <button type="button" className="btn-ghost page-hero-back" onClick={onBack}>
            {backLabel}
          </button>
        ) : null}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-hero-title">{title}</h1>
        <p className="s-sub page-hero-sub">{sub}</p>
        {contextNote ? <p className="page-hero-context">{contextNote}</p> : null}
      </div>
    </section>
  );
}
