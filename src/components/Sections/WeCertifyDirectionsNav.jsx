import { useId, useState } from "react";

function initialPanelOpenByViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 901px)").matches;
}

/** Левая навигация по направлениям «Мы сертифицируем» (текст; список в раскрывающейся панели) */
export default function WeCertifyDirectionsNav({
  items,
  ariaLabel,
  onSelect,
  activeArticleKey,
  allLabel,
  onAll,
  titleId,
  /** `quick` — компактное меню для прокрутки к карточкам на странице */
  variant = "default",
  /** Подсказка под заголовком переключателя */
  hint,
}) {
  const [panelOpen, setPanelOpen] = useState(initialPanelOpenByViewport);
  const reactId = useId();
  const panelId = `we-certify-dir-panel-${reactId.replace(/:/g, "")}`;

  if (!Array.isArray(items) || !items.length) return null;

  const navClass =
    variant === "quick"
      ? "we-certify-directions-nav we-certify-directions-nav--quick"
      : "we-certify-directions-nav";

  const handleAll = () => {
    setPanelOpen(false);
    if (typeof onAll === "function") onAll();
  };

  const handleSelect = (key) => {
    if (typeof onSelect === "function") onSelect(key);
    setPanelOpen(false);
  };

  const count = items.length;

  return (
    <nav className={navClass} aria-label={ariaLabel}>
      {typeof onAll === "function" && allLabel ? (
        <button type="button" className="we-certify-directions-nav-all" onClick={handleAll}>
          {allLabel}
        </button>
      ) : null}
      <button
        type="button"
        className={`we-certify-directions-nav-toggle ${panelOpen ? "is-open" : ""}`}
        aria-expanded={panelOpen}
        aria-controls={panelId}
        onClick={() => setPanelOpen((o) => !o)}
      >
        <span className="we-certify-directions-nav-toggle-text">
          <span id={titleId || undefined} className="we-certify-directions-nav-toggle-label">
            {ariaLabel}
          </span>
          {hint ? <span className="we-certify-directions-nav-hint">{hint}</span> : null}
        </span>
        <span className="we-certify-directions-nav-toggle-meta" aria-hidden>
          <span className="we-certify-directions-nav-count">{count}</span>
          <span className="we-certify-directions-nav-chevron-wrap">
            <span className="we-certify-directions-nav-chevron" />
          </span>
        </span>
      </button>
      <div id={panelId} className="we-certify-directions-nav-panel" hidden={!panelOpen}>
        <ul className="we-certify-directions-nav-list">
          {items.map((item) => {
            const key = item.articleKey;
            const clickable = Boolean(key && onSelect);
            const active = Boolean(key && activeArticleKey && key === activeArticleKey);

            return (
              <li key={item.id || item.title}>
                {clickable ? (
                  <button
                    type="button"
                    className={`we-certify-directions-nav-item ${active ? "is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => handleSelect(key)}
                  >
                    {item.title}
                  </button>
                ) : (
                  <span className="we-certify-directions-nav-item is-static">{item.title}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
