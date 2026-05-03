export default function Reviews({ data }) {
  const u = data.ui;
  return (
    <section className="section">
      <div className="container center-head fade-up">
        <p className="eyebrow">{u.reviews_eyebrow}</p>
        <h2 className="s-title">{u.reviews_title}</h2>
        <p className="s-sub">{u.reviews_sub}</p>
      </div>
      <div className="container reviews-grid">
        {data.reviews.map((r, i) => (
          <article key={r.name} className={`review-card fade-up d${(i % 3) + 1}`}>
            <div className="stars" aria-label="5 из 5">
              {"★★★★★"}
            </div>
            <p className="review-text">{r.text}</p>
            <div className="review-author">
              <img src={r.avatar} alt="" className="review-avatar" loading="lazy" decoding="async" />
              <div>
                <strong>
                  {r.name} {r.flag}
                </strong>
                <span>{r.org}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
