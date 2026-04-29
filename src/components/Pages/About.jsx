import PageHero from "./PageHero.jsx";
import VideoPlayerEmbed from "../VideoPlayerEmbed.jsx";
import { getPhoneList } from "../../data.js";

export default function About({ data }) {
  const u = data.ui;
  const ap = data.about_page;
  const c = data.company;
  const phones = getPhoneList(c);

  return (
    <main>
      <PageHero eyebrow={u.page_about_eyebrow} title={u.page_about_title} sub={u.page_about_sub} />

      <section className="section section-alt">
        <div className="container about-layout">
          <aside className="about-sidebar fade-up">
            <p className="about-sidebar-title">О компании</p>
            <nav className="about-sidebar-nav" aria-label="Навигация по разделам">
              <a href="#about-overview">О нас</a>
              <a href="#about-directions">Наши направления</a>
              <a href="#about-structure">Структура компании</a>
              <a href="#about-offices">Наш офис</a>
            </nav>
          </aside>

          <div className="about-content">
            <section id="about-overview" className="about-block fade-up">
              <h2 className="s-title">{ap.history_title}</h2>
              <div className="about-overview-media">
                <VideoPlayerEmbed
                  className="about-story-img"
                  company={c}
                  title="О компании — видео"
                />
              </div>
              {ap.history.map((p, i) => (
                <p key={i} className="s-sub about-para">
                  {p}
                </p>
              ))}
            </section>

            <section id="about-directions" className="about-block fade-up d1">
              <h2 className="s-title">Наши направления</h2>
              <p className="s-sub">
                Работаем с сертификацией, лабораторными испытаниями и документами для импорта.
              </p>
              <ul className="about-directions-list">
                {data.services.map((item) => (
                  <li key={item.id}>
                    <span aria-hidden>{item.ico}</span>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section id="about-structure" className="about-block fade-up d2">
              <h2 className="s-title">Структура компании</h2>
              <p className="s-sub about-para">{ap.mission}</p>
              <div className="accred-grid about-accred-grid">
                {ap.accreditations.map((a) => (
                  <article key={a.title} className="accred-card">
                    <h3>{a.title}</h3>
                    <p>{a.desc}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="about-offices" className="about-block fade-up d3">
              <h2 className="s-title">Наш офис</h2>
              <div className="about-office-card">
                <p>
                  <strong>Адрес:</strong>{" "}
                  <a href={c.map_url} target="_blank" rel="noreferrer">
                    {c.address_full}
                  </a>
                </p>
                <p>
                  <strong>Режим работы:</strong> {c.workhours}
                </p>
                <p>
                  <strong>Аккредитация:</strong> {c.accred}
                </p>
                <p>
                  <strong>Телефоны:</strong>{" "}
                  {phones.map((p, i) => (
                    <span key={p.tel}>
                      {i ? ", " : ""}
                      <a href={`tel:+${p.tel}`}>{p.text}</a>
                    </span>
                  ))}
                </p>
                <p>
                  <strong>Email:</strong> <a href={`mailto:${c.email}`}>{c.email}</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
