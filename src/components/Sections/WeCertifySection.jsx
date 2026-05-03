export default function WeCertifySection({ data, onPage, showHead = true, onOpenDetail }) {
  const u = data.ui;
  const items = data.we_certify;
  if (!Array.isArray(items) || !items.length) return null;

  const sectionLabelledBy = showHead ? "we-certify-title" : "we-certify-directions-label";

  return (
    <section
      className={`section we-certify-section ${showHead ? "" : "we-certify-section--subpage"}`}
      aria-labelledby={sectionLabelledBy}
    >
      <div className="container we-certify-inner fade-up">
        {showHead ? (
          <header className="we-certify-head">
            <p className="eyebrow">{u.we_certify_eyebrow}</p>
            <h2 id="we-certify-title" className="we-certify-title">
              {u.we_certify_title}
            </h2>
            <p className="s-sub we-certify-sub">{u.we_certify_sub}</p>
          </header>
        ) : (
          <p id="we-certify-directions-label" className="we-certify-directions-label is-standalone">
            {u.we_certify_directions_label}
          </p>
        )}

        <ul
          className={`we-certify-grid${items.length === 1 ? " we-certify-grid--solo" : ""}`}
          role="list"
        >
          {items.map((item) => {
            const hasDetail = Boolean(item.articleKey && onOpenDetail);
            const cardClass = `we-certify-card${hasDetail ? " we-certify-card--clickable is-featured" : ""}`;

            const inner = (
              <>
                <span className="we-certify-ico" aria-hidden>
                  {item.ico || "✓"}
                </span>
                <h3 className="we-certify-name">{item.title}</h3>
                <p className="we-certify-text">{item.text}</p>
                {hasDetail ? (
                  <span className="we-certify-card-hint">{u.we_certify_open_hint}</span>
                ) : null}
              </>
            );

            return (
              <li key={item.id || item.title} className="we-certify-grid-cell" role="none">
                {hasDetail ? (
                  <button
                    type="button"
                    className={cardClass}
                    onClick={() => onOpenDetail(item.articleKey)}
                    aria-label={`${item.title}: ${u.we_certify_open_hint}`}
                  >
                    {inner}
                  </button>
                ) : (
                  <div className={cardClass} role="group" aria-label={item.title}>
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {onPage ? (
          <div className="we-certify-actions">
            <button type="button" className="btn-primary" onClick={() => onPage("contacts")}>
              {u.we_certify_cta}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
