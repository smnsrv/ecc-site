import { useCallback, useEffect, useMemo, useState } from "react";
import { useFadeUp } from "../../hooks/useFadeUp.js";
import PageHero from "./PageHero.jsx";
import WeCertifyArticleBody from "../Sections/WeCertifyArticleBody.jsx";
import WeCertifySection from "../Sections/WeCertifySection.jsx";

function parseWeCertifyHash(articlesObj) {
  const raw = (window.location.hash || "").replace(/^#/, "");
  if (!raw || !articlesObj || typeof articlesObj !== "object") return null;
  if (raw === "we-certify-household" && articlesObj.household) return "household";
  if (raw.startsWith("we-certify-article-")) {
    const key = raw.slice("we-certify-article-".length);
    return articlesObj[key] ? key : null;
  }
  return null;
}

export default function WeCertifyPage({ data, onPage }) {
  const u = data.ui;
  const articles = data.we_certify_articles && typeof data.we_certify_articles === "object" ? data.we_certify_articles : {};
  const [detailArticleKey, setDetailArticleKey] = useState(() => parseWeCertifyHash(articles));

  const direction = useMemo(
    () => data.we_certify?.find((item) => item.articleKey === detailArticleKey) ?? null,
    [data.we_certify, detailArticleKey],
  );
  const article = detailArticleKey ? articles[detailArticleKey] : null;

  /** Без этого при смене list→detail класс .visible не вешается: в App deps не меняется page */
  useFadeUp([detailArticleKey]);

  const openDetail = useCallback(
    (key) => {
      setDetailArticleKey(key);
      window.history.replaceState(null, "", `#we-certify-article-${key}`);
    },
    [setDetailArticleKey],
  );

  const closeDetail = useCallback(() => {
    setDetailArticleKey(null);
    const base = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", base);
  }, []);

  useEffect(() => {
    const onHash = () => {
      const articlesObj =
        data.we_certify_articles && typeof data.we_certify_articles === "object" ? data.we_certify_articles : {};
      setDetailArticleKey(parseWeCertifyHash(articlesObj));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [data.we_certify_articles]);

  useEffect(() => {
    if (detailArticleKey) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [detailArticleKey]);

  if (detailArticleKey) {
    if (!article || !direction) {
      return (
        <main>
          <section className="section">
            <div className="container fade-up">
              <button type="button" className="btn-ghost" onClick={closeDetail}>
                ← {u.we_certify_back}
              </button>
              <p className="s-sub" style={{ marginTop: 16 }}>
                Материал для этого направления пока не добавлен.
              </p>
            </div>
          </section>
        </main>
      );
    }

    return (
      <main>
        <section className="page-hero we-certify-detail-hero">
          <div className="container fade-up">
            <button type="button" className="btn-ghost we-certify-detail-back" onClick={closeDetail}>
              ← {u.we_certify_back}
            </button>
            <p className="eyebrow">{u.page_we_certify_eyebrow}</p>
            <h1 className="page-hero-title">{direction.title}</h1>
            <p className="s-sub page-hero-sub">{direction.text}</p>
          </div>
        </section>
        <section className="section we-certify-section we-certify-section--detail">
          <div className="container fade-up">
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
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHero eyebrow={u.page_we_certify_eyebrow} title={u.page_we_certify_title} sub={u.page_we_certify_sub} />
      <WeCertifySection data={data} onPage={onPage} showHead={false} onOpenDetail={openDetail} />
    </main>
  );
}
