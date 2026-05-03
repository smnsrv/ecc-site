export default function FaqSection({ data }) {
  const u = data.ui;
  const faq = Array.isArray(data.faq) ? data.faq : [];
  if (!faq.length) return null;

  return (
    <section className="section faq-section" aria-labelledby="faq-title">
      <div className="container">
        <div className="center-head fade-up">
          <p className="eyebrow">{u.faq_eyebrow}</p>
          <h2 id="faq-title" className="s-title">
            {u.faq_title}
          </h2>
          {u.faq_sub ? <p className="s-sub">{u.faq_sub}</p> : null}
        </div>
        <div className="faq-list fade-up d1">
          {faq.map((item, i) => (
            <details key={i} className="faq-item">
              <summary>{item.q}</summary>
              <p className="faq-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
