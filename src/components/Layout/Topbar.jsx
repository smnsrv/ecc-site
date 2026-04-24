import { getPhoneList } from "../../data.js";

/** Верхняя полоса: адрес, часы, аккредитация слева; email и телефон справа */
export default function Topbar({ data }) {
  const c = data.company;
  const phones = getPhoneList(c);
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-left">
          <a className="topbar-link" href={c.map_url} target="_blank" rel="noreferrer">
            {c.address_short}
          </a>
          <span className="topbar-sep" aria-hidden>
            ·
          </span>
          <span>{c.workhours}</span>
          <span className="topbar-sep" aria-hidden>
            ·
          </span>
          <span>{c.accred}</span>
        </div>
        <div className="topbar-right topbar-phones">
          <a className="topbar-link" href={`mailto:${c.email}`}>
            {c.email}
          </a>
          {phones.map((p, i) => (
            <span className="topbar-phone-item" key={p.tel}>
              {i > 0 ? (
                <span className="topbar-sep" aria-hidden>
                  ·
                </span>
              ) : null}
              <a className="topbar-link" href={`tel:+${p.tel}`}>
                {p.text}
              </a>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
