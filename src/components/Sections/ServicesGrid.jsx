import { useState } from "react";
import { TECHNICAL_REGULATIONS_CONTENT } from "../Pages/ServiceTemplate.jsx";

function servicesCountRu(n) {
  if (n % 10 === 1 && n % 100 !== 11) return `${n} услуга`;
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return `${n} услуги`;
  return `${n} услуг`;
}

function ServiceRichPreview({ rich }) {
  return (
    <div className="service-rich-content services-center-article">
      <p className="service-template-desc">{rich.intro}</p>
      {rich.lead ? <p>{rich.lead}</p> : null}
      {rich.sections.map((section) => (
        <div key={section.heading} className="service-rich-block">
          <h3>{section.heading}</h3>
          {section.paragraphs?.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {section.bullets?.length ? (
            <ul>
              {section.bullets.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}
          {section.tail ? <p>{section.tail}</p> : null}
        </div>
      ))}
      {rich.outro ? <p className="service-rich-outro">{rich.outro}</p> : null}
      {rich.cta ? <p className="service-rich-outro">{rich.cta}</p> : null}
    </div>
  );
}

function shouldOpenServicePage(item, home) {
  return home || item.name !== "Технические регламенты";
}

export default function ServicesGrid({ data, onPage, home, onOpenService }) {
  const u = data.ui;
  const list = data.services;
  const [active, setActive] = useState(0);
  const s = list[active] ?? list[0];
  const ico = (it) => it?.ico || "📋";
  const isTechRegsPanel = s.name === "Технические регламенты" && !home;

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
                  if (onOpenService && shouldOpenServicePage(item, home)) onOpenService(item);
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
    <section className="section services-section">
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
                    if (onOpenService && shouldOpenServicePage(item, home)) onOpenService(item);
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
          <h3 className="services-center-title">
            {isTechRegsPanel ? "Технические регламенты" : "Направления области аккредитации"}
          </h3>
          {isTechRegsPanel ? (
            <>
              <ServiceRichPreview rich={TECHNICAL_REGULATIONS_CONTENT} />
              {onPage ? (
                <div className="services-center-article-actions">
                  <button type="button" className="btn-primary" onClick={() => onPage("contacts")}>
                    Оставить заявку
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="services-center-grid">
              {list.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className={`services-area-card ${active === i ? "is-active" : ""}`}
                  onClick={() => {
                    setActive(i);
                    if (onOpenService && shouldOpenServicePage(item, home)) onOpenService(item);
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
          )}
        </div>
      </div>
    </section>
  );
}
