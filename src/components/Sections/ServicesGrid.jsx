import { useState } from "react";

function servicesCountRu(n) {
  if (n % 10 === 1 && n % 100 !== 11) return `${n} услуга`;
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return `${n} услуги`;
  return `${n} услуг`;
}

export default function ServicesGrid({ data, home, onOpenService, onPage }) {
  const u = data.ui;
  const list = data.services;
  const [active, setActive] = useState(0);
  const s = list[active] ?? list[0];
  const ico = (it) => it?.ico || "📋";

  if (!list.length) return null;

  if (home) {
    return (
      <section
        className="section services-showcase"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(11, 31, 58, 0.9) 0%, rgba(11, 31, 58, 0.72) 45%, rgba(11, 31, 58, 0.86) 100%), url(${s.img})`,
        }}
      >
        <div className="container services-showcase-inner fade-up">
          <div className="services-showcase-head">
            <p className="eyebrow eyebrow-light">{u.services_home_eyebrow}</p>
            <button type="button" className="btn-ghost services-showcase-btn" onClick={() => onPage("services")}>
              {u.services_all_link}
            </button>
          </div>

          <h2 className="services-showcase-title">Сертификация и испытания продукции в Узбекистане</h2>
          {data.hero?.usp_one_liner ? <p className="services-showcase-usp">{data.hero.usp_one_liner}</p> : null}

          <div className="services-showcase-grid" role="list">
            {list.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`services-showcase-card ${active === i ? "is-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => {
                  setActive(i);
                  if (onOpenService) onOpenService(item);
                }}
              >
                <span className="services-showcase-ico" aria-hidden>
                  {ico(item)}
                </span>
                <span className="services-showcase-name">{item.name}</span>
                <span className="services-showcase-desc">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section services-section services-page-icons">
      <div className="container fade-up">
        <div className="services-page-icons-head">
          <h2 className="services-page-icons-title">{u.services_home_title}</h2>
          <span className="services-page-icons-count">{servicesCountRu(list.length)}</span>
        </div>
        <div className="services-page-icons-grid" role="list">
          {list.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="listitem"
              className={`services-page-icon-card ${active === i ? "is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => {
                setActive(i);
                if (onOpenService) onOpenService(item);
              }}
            >
              <span className="services-page-icon-ico" aria-hidden>
                {ico(item)}
              </span>
              <span className="services-page-icon-name">{item.name}</span>
              <span className="services-page-icon-desc">{item.desc}</span>
              <span className="services-page-icon-tag">{item.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
