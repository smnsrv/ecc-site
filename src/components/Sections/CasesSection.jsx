export default function CasesSection({ data }) {
  const u = data.ui;
  const cases = Array.isArray(data.cases) ? data.cases : [];
  if (!cases.length) return null;

  return (
    <section className="section section-alt cases-section" aria-labelledby="cases-title">
      <div className="container">
        <div className="center-head fade-up">
          <p className="eyebrow">{u.cases_eyebrow}</p>
          <h2 id="cases-title" className="s-title">
            {u.cases_title}
          </h2>
          <p className="s-sub">{u.cases_sub}</p>
        </div>
        <div className="cases-grid fade-up d1">
          {cases.map((c, i) => (
            <article key={i} className="case-card">
              <p className="case-card-sector">{c.sector}</p>
              <h3>{c.task}</h3>
              <p>{c.result}</p>
              {c.timeline ? <p className="case-card-time">{c.timeline}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
