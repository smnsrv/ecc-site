const TOPBAR_PHONE = { text: "+998 95 1159997", tel: "998951159997" };

export default function Topbar({ data }) {
  const c = data.company;
  const p = TOPBAR_PHONE;
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
          <span className="topbar-phone-item">
            <a className="topbar-link" href={`tel:+${p.tel}`}>
              {p.text}
            </a>
          </span>
        </div>
      </div>
    </header>
  );
}
