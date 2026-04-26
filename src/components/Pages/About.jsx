import PageHero from "./PageHero.jsx";

export default function About({ data }) {
  const u = data.ui;
  const ap = data.about_page;
  const c = data.company;
  return (
    <main>
      <PageHero eyebrow={u.page_about_eyebrow} title={u.page_about_title} sub={u.page_about_sub} />
      <section className="section">
        <div className="container about-story">
          <div className="about-story-copy fade-up">
            <h2 className="s-title">{ap.history_title}</h2>
            {ap.history.map((p, i) => (
              <p key={i} className="s-sub about-para">
                {p}
              </p>
            ))}
          </div>
          <div className="about-story-img fade-up d1">
            <img src={c.about_img} alt="" />
          </div>
        </div>
      </section>
      {ap.mission ? (
        <section className="section section--mission">
          <div className="container about-mission">
            <h2 className="s-title center fade-up">{ap.mission_title}</h2>
            <p className="s-sub about-mission-text fade-up d1">{ap.mission}</p>
          </div>
        </section>
      ) : null}
      <section className="section section-alt">
        <div className="container">
          <h2 className="s-title center fade-up">{ap.accreditations_title}</h2>
          <div className="accred-grid">
            {ap.accreditations.map((a, i) => (
              <article key={a.title} className={`accred-card fade-up d${(i % 3) + 1}`}>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
