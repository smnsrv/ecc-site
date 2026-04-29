export default function AboutHighlightSection({ data, onPage }) {
  const u = data.ui;
  const c = data.company;
  const stats = data.numbers || [];

  return (
    <section className="section section-alt about-highlight">
      <div className="container">
        <div className="about-highlight-head fade-up">
          <h2 className="about-highlight-title">{u.about_home_eyebrow}</h2>
          <button type="button" className="about-highlight-link" onClick={() => onPage("about")}>
            О нас
          </button>
        </div>

        <div className="about-highlight-main">
          <div className="about-highlight-media fade-up">
            <img src={c.about_img} alt="О компании" loading="lazy" />
          </div>

          <aside className="about-highlight-stats fade-up d1" aria-label="Ключевые показатели">
            {stats.map((item, idx) => (
              <div key={`${item.lbl}-${idx}`} className="about-highlight-stat">
                <strong>{item.val}</strong>
                <span>{item.lbl}</span>
              </div>
            ))}

            <button type="button" className="btn-primary about-highlight-btn" onClick={() => onPage("about")}>
              {u.about_home_btn1}
            </button>
          </aside>
        </div>

        <div className="about-highlight-copy fade-up d2">
          <h3>Ваш надежный партнер в области оценки соответствия</h3>
          <p>
            Основанная в 2022 году, компания Electro Class Control (ECC) за 3 года работы зарекомендовала себя как
            надежный партнер. Основные направления деятельности включают сертификацию электротехнической продукции,
            оборудования, кабельных систем, бытовой техники и медицинских изделий.
          </p>
        </div>
      </div>
    </section>
  );
}
