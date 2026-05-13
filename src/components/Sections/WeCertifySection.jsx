import WeCertifyDirectionsNav from "./WeCertifyDirectionsNav.jsx";

function scrollToWeCertifyCard(articleKey) {
  if (typeof document === "undefined" || !articleKey) return;
  const root = document.getElementById(`we-certify-card-${articleKey}`);
  if (!root) return;
  root.scrollIntoView({ behavior: "smooth", block: "center" });
  const focusTarget = root.querySelector("button.we-certify-card--clickable");
  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus({ preventScroll: true });
  }
  root.classList.add("we-certify-grid-cell--pulse");
  window.setTimeout(() => root.classList.remove("we-certify-grid-cell--pulse"), 1000);
}

function WeCertifyCardsGrid({ items, onOpenDetail, ui }) {
  if (!Array.isArray(items) || !items.length) return null;

  return (
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
            {hasDetail ? <span className="we-certify-card-hint">{ui.we_certify_open_hint}</span> : null}
          </>
        );

        return (
          <li
            key={item.id || item.title}
            className="we-certify-grid-cell"
            role="none"
            id={item.articleKey ? `we-certify-card-${item.articleKey}` : undefined}
          >
            {hasDetail ? (
              <button
                type="button"
                className={cardClass}
                onClick={() => onOpenDetail(item.articleKey)}
                aria-label={`${item.title}: ${ui.we_certify_open_hint}`}
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
  );
}

export default function WeCertifySection({ data, onPage, showHead = true, onOpenDetail }) {
  const u = data.ui;
  const coreItems = Array.isArray(data.we_certify) ? data.we_certify : [];
  const industryItems = Array.isArray(data.we_certify_by_industry) ? data.we_certify_by_industry : [];
  if (!coreItems.length && !industryItems.length) return null;

  const useSidebar = Boolean(onOpenDetail);
  const sectionLabelledBy = showHead
    ? "we-certify-title"
    : useSidebar
      ? coreItems.length
        ? "we-certify-core-title"
        : industryItems.length
          ? "we-certify-industry-title"
          : "we-certify-core-title"
      : "we-certify-directions-label";

  const actions = onPage ? (
    <div className="we-certify-actions">
      <button type="button" className="btn-primary" onClick={() => onPage("contacts")}>
        {u.we_certify_cta}
      </button>
    </div>
  ) : null;

  const mainBlocks = (
    <>
      {coreItems.length ? (
        <div className="we-certify-block we-certify-block--core">
          <h2 id="we-certify-core-title" className="we-certify-block-title">
            {u.we_certify_directions_label}
          </h2>
          <WeCertifyCardsGrid items={coreItems} onOpenDetail={onOpenDetail} ui={u} />
        </div>
      ) : null}
      {coreItems.length && industryItems.length ? <hr className="we-certify-section-divider" aria-hidden /> : null}
      {industryItems.length ? (
        <div className="we-certify-block we-certify-block--industry">
          <h2 id="we-certify-industry-title" className="we-certify-block-title">
            {u.we_certify_industry_label}
          </h2>
          <WeCertifyCardsGrid items={industryItems} onOpenDetail={onOpenDetail} ui={u} />
        </div>
      ) : null}
    </>
  );

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
        ) : !useSidebar ? (
          <p id="we-certify-directions-label" className="we-certify-directions-label is-standalone">
            {u.we_certify_directions_label}
          </p>
        ) : null}

        {useSidebar ? (
          <div className="we-certify-shell">
            <aside className="we-certify-shell-aside">
              <div className="we-certify-shell-aside-stack">
                {coreItems.length ? (
                  <WeCertifyDirectionsNav
                    variant="quick"
                    items={coreItems}
                    ariaLabel={u.we_certify_directions_label}
                    titleId="we-certify-nav-core-summary"
                    onSelect={scrollToWeCertifyCard}
                    hint={u.we_certify_nav_hint_quick}
                  />
                ) : null}
                {industryItems.length ? (
                  <WeCertifyDirectionsNav
                    variant="quick"
                    items={industryItems}
                    ariaLabel={u.we_certify_industry_label}
                    titleId="we-certify-nav-industry-summary"
                    onSelect={scrollToWeCertifyCard}
                    hint={u.we_certify_nav_hint_quick}
                  />
                ) : null}
              </div>
            </aside>
            <div className="we-certify-shell-main">
              {mainBlocks}
              {actions}
            </div>
          </div>
        ) : (
          <>
            {mainBlocks}
            {actions}
          </>
        )}
      </div>
    </section>
  );
}
