/** Сетка услуг на главной */
export default function ServicesGrid({ data, onPage, home }) {
  const u = data.ui;
  return (
    <section className={`section ${home ? "" : "section-tight-top"}`}>
      <div className="container section-head">
        <div className="fade-up">
          <p className="eyebrow">{u.services_home_eyebrow}</p>
          <h2 className="s-title">{u.services_home_title}</h2>
        </div>
        {home && (
          <button type="button" className="btn-ghost fade-up d1" onClick={() => onPage("services")}>
            {u.services_all_link}
          </button>
        )}
      </div>
      <div className="container card-grid">
        {data.services.map((s, i) => (
          <article key={s.id} className={`card service-card fade-up d${(i % 4) + 1}`}>
            <div className="card-img-wrap">
              <img src={s.img} alt="" />
            </div>
            <div className="card-body">
              <span className="card-tag">{s.tag}</span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <span className="card-time">{s.time}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
