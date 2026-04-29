import { useState } from "react";

function servicesCountRu(n) {
  if (n % 10 === 1 && n % 100 !== 11) return `${n} услуга`;
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return `${n} услуги`;
  return `${n} услуг`;
}

export default function ServicesGrid({ data, onPage, home, onOpenService }) {
  const u = data.ui;
  const list = data.services;
  const [active, setActive] = useState(0);
  const s = list[active] ?? list[0];
  const ico = (it) => it?.ico || "📋";

  if (!list.length) return null;

  return (
    <section className={`section services-section ${home ? "" : "section-tight-top"}`}>
      {home ? (
        <div className="container section-head services-section-head">
          <div className="fade-up">
            <p className="eyebrow">{u.services_home_eyebrow}</p>
          </div>
          <button
            type="button"
            className="btn-ghost fade-up d1"
            onClick={() => onPage("services")}
          >
            {u.services_all_link}
          </button>
        </div>
      ) : null}
      <div className="container services-split fade-up">
        <nav className="services-rail" aria-label="Список услуг">
          <div className="services-rail-head">
            <h2 className="services-rail-title">{u.services_home_title}</h2>
            <span className="services-rail-count">{servicesCountRu(list.length)}</span>
          </div>
          <ul className="services-rail-list" role="tablist">
            {list.map((item, i) => (
              <li key={item.id} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`svc-tab-${item.id}`}
                  aria-selected={active === i}
                  className={`services-rail-item ${active === i ? "is-active" : ""}`}
                  onClick={() => {
                    setActive(i);
                    if (onOpenService) onOpenService(item);
                  }}
                >
                  <span className="services-rail-ico" aria-hidden>
                    {ico(item)}
                  </span>
                  <span className="services-rail-name">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="services-center" role="tabpanel" id={`svc-panel-${s.id}`} aria-labelledby={`svc-tab-${s.id}`}>
          <h3 className="services-center-title">Направления области аккредитации</h3>
          <div className="services-center-grid">
            {list.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`services-area-card ${active === i ? "is-active" : ""}`}
                onClick={() => {
                  setActive(i);
                  if (onOpenService) onOpenService(item);
                }}
              >
                <span className="services-area-ico" aria-hidden>
                  {ico(item)}
                </span>
                <span className="services-area-name">{item.name}</span>
                <span className="services-area-tag">{item.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
