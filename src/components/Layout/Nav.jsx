import { logoUrl } from "../../logoUrl.js";

const PAGES = ["home", "services", "about", "contacts"];

/** Sticky-навигация: логотип, пункты меню, CTA */
export default function Nav({ data, page, onPage, mobileOpen, setMobileOpen }) {
  const u = data.ui;

  const label = (p) => {
    if (p === "home") return u.nav_home;
    if (p === "services") return u.nav_services;
    if (p === "about") return u.nav_about;
    return u.nav_contacts;
  };

  const go = (p) => {
    onPage(p);
    setMobileOpen(false);
  };

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <button type="button" className="logo" onClick={() => go("home")} aria-label={u.nav_home}>
          <img
            className="logo-img"
            src={logoUrl}
            alt=""
            width={640}
            height={128}
            decoding="async"
          />
        </button>
        <div className="nav-menu desktop">
          {PAGES.map((p) => (
            <button
              key={p}
              type="button"
              className={`nav-link ${page === p ? "active" : ""}`}
              onClick={() => go(p)}
            >
              {label(p)}
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary nav-cta desktop" onClick={() => go("contacts")}>
          {u.nav_cta}
        </button>
        <button
          type="button"
          className="nav-burger"
          aria-expanded={mobileOpen}
          aria-label="Меню"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        {PAGES.map((p) => (
          <button key={p} type="button" className={`nav-link ${page === p ? "active" : ""}`} onClick={() => go(p)}>
            {label(p)}
          </button>
        ))}
        <button type="button" className="btn-primary mobile-cta" onClick={() => go("contacts")}>
          {u.nav_cta}
        </button>
      </div>
    </nav>
  );
}
