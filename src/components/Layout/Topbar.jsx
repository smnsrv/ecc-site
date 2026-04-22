/** Верхняя полоса: адрес, часы, аккредитация слева; email и телефон справа */
export default function Topbar({ data }) {
  const c = data.company;
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-left">
          <span>{c.address_short}</span>
          <span className="topbar-sep" aria-hidden>
            ·
          </span>
          <span>{c.workhours}</span>
          <span className="topbar-sep" aria-hidden>
            ·
          </span>
          <span>{c.accred}</span>
        </div>
        <div className="topbar-right">
          <a className="topbar-link" href={`mailto:${c.email}`}>
            {c.email}
          </a>
          <a className="topbar-link" href={`tel:+${c.phone_link}`}>
            {c.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
