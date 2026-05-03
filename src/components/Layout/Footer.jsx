import { getPhoneList } from "../../data.js";
import { logoUrl } from "../../logoUrl.js";

export default function Footer({ data, onPage }) {
  const c = data.company;
  const u = data.ui;
  const phones = getPhoneList(c);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand fade-up">
          <div className="footer-logo">
            <img
              className="logo-img logo-img--footer"
              src={logoUrl}
              alt={c.name}
              width={520}
              height={120}
              decoding="async"
            />
          </div>
          <p className="footer-desc">{c.desc}</p>
        </div>
        <div className="footer-col fade-up d1">
          <h4>{u.footer_services}</h4>
          <ul>
            {data.services.map((s) => (
              <li key={s.id}>
                <button type="button" className="footer-link" onClick={() => onPage("services")}>
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col fade-up d2">
          <h4>{u.footer_company}</h4>
          <ul>
            <li>
              <button type="button" className="footer-link" onClick={() => onPage("about")}>
                {u.footer_cta_about}
              </button>
            </li>
            <li>
              <button type="button" className="footer-link" onClick={() => onPage("services")}>
                {u.footer_cta_services}
              </button>
            </li>
            <li>
              <button type="button" className="footer-link" onClick={() => onPage("we-certify")}>
                {u.nav_we_certify}
              </button>
            </li>
            <li>
              <button type="button" className="footer-link" onClick={() => onPage("contacts")}>
                {u.footer_cta_contacts}
              </button>
            </li>
          </ul>
        </div>
        <div className="footer-col fade-up d3">
          <h4>{u.footer_contacts}</h4>
          <ul className="footer-contacts">
            {phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:+${p.tel}`}>{p.text}</a>
              </li>
            ))}
            <li>
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </li>
            <li>
              <a href={c.map_url} target="_blank" rel="noreferrer">
                {c.address_short}
              </a>
            </li>
            <li>{c.workhours}</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>{u.footer_rights}</p>
      </div>
    </footer>
  );
}
