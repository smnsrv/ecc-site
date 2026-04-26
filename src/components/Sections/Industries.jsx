export default function Industries({ data }) {
  const u = data.ui;
  return (
    <section className="section section-alt">
      <div className="container center-head fade-up">
        <p className="eyebrow">{u.industries_eyebrow}</p>
        <h2 className="s-title">{u.industries_title}</h2>
        <p className="s-sub">{u.industries_sub}</p>
      </div>
      <div className="container industries-grid">
        {data.industries.map((it, i) => (
          <div key={it.name} className={`industry-item fade-up d${(i % 4) + 1}`}>
            <span className="industry-ico" aria-hidden>
              {it.ico}
            </span>
            <span>{it.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
