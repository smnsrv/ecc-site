/** Тело статьи по направлению «Мы сертифицируем» (данные из data.we_certify_articles[key]) */
export default function WeCertifyArticleBody({ article, anchorId }) {
  if (!article) return null;

  return (
    <div
      className="we-certify-article service-rich-content"
      id={anchorId || undefined}
    >
      <h2 className="we-certify-article-lead-title">{article.why_title}</h2>
      <p className="we-certify-article-lead">{article.why_lead}</p>

      {article.why_sections_title ? (
        <h2 className="we-certify-article-sections-title">{article.why_sections_title}</h2>
      ) : null}

      {article.why_sections.map((block) => (
        <div key={block.heading} className="service-rich-block we-certify-article-block">
          <h3 className="we-certify-article-subhead">{block.heading}</h3>
          {block.paragraphs?.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {block.bullets?.length ? (
            <ul>
              {block.bullets.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}
          {block.tail ? <p>{block.tail}</p> : null}
        </div>
      ))}

      <div className="we-certify-article-scope">
        <h2 className="we-certify-article-scope-title">{article.scope_title}</h2>

        {article.scope_sections.map((block) => (
          <div key={block.heading} className="service-rich-block we-certify-article-block">
            <h3 className="we-certify-article-subhead">{block.heading}</h3>
            {block.bullets?.length ? (
              <ul>
                {block.bullets.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {block.tail ? <p>{block.tail}</p> : null}
          </div>
        ))}
      </div>

      {article.regulations_title && article.regulations?.length ? (
        <div className="we-certify-article-regulations service-rich-block we-certify-article-block">
          <h2 className="we-certify-article-scope-title">{article.regulations_title}</h2>
          <ul>
            {article.regulations.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {article.closing ? <p className="we-certify-article-closing">{article.closing}</p> : null}
    </div>
  );
}
