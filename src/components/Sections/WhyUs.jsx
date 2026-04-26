export default function WhyUs({ data }) {
  const u = data.ui;
  const img = data.company.usp_img;
  return (
    <section className="section section-alt">
      <div className="container why-grid">
        <div className="why-visual fade-up">
          <img src={img} alt="" />
          <div className="why-badge">{u.why_badge}</div>
        </div>
        <div className="why-copy">
          <p className="eyebrow fade-up">{u.why_eyebrow}</p>
          <h2 className="s-title fade-up d1">{u.why_title}</h2>
          <ul className="usp-list">
            {data.usp.map((item, i) => (
              <li key={item.title} className={`usp-item fade-up d${(i % 4) + 1}`}>
                <span className="usp-ico" aria-hidden>
                  {item.ico}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
