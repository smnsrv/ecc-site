export default function Process({ data, onPage }) {
  const u = data.ui;
  return (
    <section className="section">
      <div className="container center-head fade-up">
        <p className="eyebrow">{u.process_eyebrow}</p>
        <h2 className="s-title">{u.process_title}</h2>
        <p className="s-sub">Роудмап по всем этапам оформления документов.</p>
      </div>
      <div className="container process-track">
        {data.process.map((step, idx) => (
          <article key={step.num} className={`process-step fade-up d${idx + 1}`}>
            <div className="process-node">
              <span className="process-num">{step.num}</span>
            </div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
            {idx < data.process.length - 1 && <div className="process-line" aria-hidden />}
          </article>
        ))}
      </div>
      <div className="container process-actions fade-up d2">
        <button type="button" className="btn-ghost" onClick={() => onPage("certification-stages")}>
          Подробно: все 7 этапов →
        </button>
      </div>
    </section>
  );
}
