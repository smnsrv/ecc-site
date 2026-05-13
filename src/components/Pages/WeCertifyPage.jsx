import { useEffect } from "react";
import PageHero from "./PageHero.jsx";
import WeCertifyArticleBody from "../Sections/WeCertifyArticleBody.jsx";
import WeCertifyDirectionsNav from "../Sections/WeCertifyDirectionsNav.jsx";
import WeCertifySection from "../Sections/WeCertifySection.jsx";

export default function WeCertifyPage({ data, onPage, detailArticleKey, onOpenArticle, onCloseArticle }) {
  const u = data.ui;
  const articles = data.we_certify_articles && typeof data.we_certify_articles === "object" ? data.we_certify_articles : {};
  const weCertifyAll = [
    ...(Array.isArray(data.we_certify) ? data.we_certify : []),
    ...(Array.isArray(data.we_certify_by_industry) ? data.we_certify_by_industry : []),
  ];
  const direction =
    detailArticleKey && weCertifyAll.length
      ? weCertifyAll.find((item) => item.articleKey === detailArticleKey) ?? null
      : null;
  const article = detailArticleKey ? articles[detailArticleKey] : null;

  useEffect(() => {
    if (detailArticleKey) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [detailArticleKey]);

  if (detailArticleKey) {
    if (!article || !direction) {
      return (
        <main>
          <PageHero
            heroClassName="page-hero--we-certify we-certify-detail-hero"
            breadcrumbAriaLabel={u.breadcrumb_aria}
            breadcrumbs={[
              { label: u.nav_we_certify, onClick: onCloseArticle },
              { label: u.page_we_certify_title },
            ]}
            breadcrumbSchema={[
              { name: u.nav_we_certify, path: "#/we-certify" },
              { name: u.page_we_certify_title, path: "#/we-certify" },
            ]}
            eyebrow={u.page_we_certify_eyebrow}
            title={u.page_we_certify_title}
            sub="Материал для этого направления пока не добавлен."
            onBack={onCloseArticle}
            backLabel={`← ${u.we_certify_back}`}
          />
        </main>
      );
    }

    const detailTitle = direction.title;
    const detailHash = `#/we-certify/${detailArticleKey}`;

    return (
      <main>
        <PageHero
          heroClassName="page-hero--we-certify we-certify-detail-hero"
          breadcrumbAriaLabel={u.breadcrumb_aria}
          breadcrumbs={[
            { label: u.nav_we_certify, onClick: onCloseArticle },
            { label: detailTitle },
          ]}
          breadcrumbSchema={[
            { name: u.nav_we_certify, path: "#/we-certify" },
            { name: detailTitle, path: detailHash },
          ]}
          eyebrow={u.page_we_certify_eyebrow}
          title={detailTitle}
          sub={direction.text}
        />
        <section
          className="section we-certify-section we-certify-section--detail"
          aria-labelledby="we-certify-detail-nav-title"
        >
          <div className="container we-certify-inner fade-up">
            <div className="we-certify-shell">
              <aside className="we-certify-shell-aside">
                <WeCertifyDirectionsNav
                  items={[
                    ...(Array.isArray(data.we_certify) ? data.we_certify : []),
                    ...(Array.isArray(data.we_certify_by_industry) ? data.we_certify_by_industry : []),
                  ]}
                  ariaLabel={`${u.we_certify_directions_label} / ${u.we_certify_industry_label}`}
                  titleId="we-certify-detail-nav-title"
                  onSelect={onOpenArticle}
                  activeArticleKey={detailArticleKey}
                  allLabel={u.we_certify_back}
                  onAll={onCloseArticle}
                  hint={u.we_certify_nav_hint_detail}
                />
              </aside>
              <div className="we-certify-shell-main we-certify-shell-main--detail">
                <WeCertifyArticleBody article={article} anchorId={`we-certify-article-${detailArticleKey}`} />
                <div className="we-certify-actions we-certify-actions--row">
                  <button type="button" className="btn-primary" onClick={() => onPage("contacts")}>
                    {u.we_certify_cta}
                  </button>
                  {data.company?.telegram ? (
                    <a
                      className="btn-ghost we-certify-tg-link"
                      href={`https://t.me/${String(data.company.telegram).replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {u.we_certify_tg_cta}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHero
        heroClassName="page-hero--we-certify"
        breadcrumbAriaLabel={u.breadcrumb_aria}
        breadcrumbs={[
          { label: u.nav_services, onClick: () => onPage("services") },
          { label: u.page_we_certify_title },
        ]}
        breadcrumbSchema={[
          { name: u.nav_services, path: "#/services" },
          { name: u.page_we_certify_title, path: "#/we-certify" },
        ]}
        eyebrow={u.page_we_certify_eyebrow}
        title={u.page_we_certify_title}
        sub={u.page_we_certify_sub}
        contextNote={u.regulatory_context_line}
      />
      <WeCertifySection data={data} onPage={onPage} showHead={false} onOpenDetail={onOpenArticle} />
    </main>
  );
}
