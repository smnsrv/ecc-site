/** Герой: заголовок, кнопки, блок доверия */
export default function Hero({ data, onPage }) {
  const h = data.hero;
  const c = data.company;
  return (
    <div className="hero-main fade-up">
      <p className="hero-badge">{h.badge}</p>
      <h1 className="hero-title">
        {h.h1_pre} <mark className="hero-mark">{h.h1_mark}</mark>
      </h1>
      <p className="hero-sub">{h.sub}</p>
      <div className="hero-actions">
        <button type="button" className="btn-primary" onClick={() => onPage("contacts")}>
          {h.btn1}
        </button>
        <a className="btn-outline-w" href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noreferrer">
          {h.btn2}
        </a>
      </div>
      <div className="trust-grid">
        {h.trust.map((t, i) => (
          <div key={`${t.lbl}-${i}`} className={`trust-item fade-up d${i + 1}`}>
            <strong>{t.num}</strong>
            <span className="trust-lbl">{t.lbl}</span>
            {t.sub ? <span className="trust-sub">{t.sub}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
