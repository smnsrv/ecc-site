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
      <section className="section">
        <div className="container">
          <h2 className="s-title center fade-up">{ap.team_title}</h2>
          <div className="team-grid">
            {ap.team.map((m, i) => (
              <article key={m.name} className={`team-card fade-up d${(i % 4) + 1}`}>
                <img src={m.photo} alt="" />
                <h3>{m.name}</h3>
                <p>{m.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
