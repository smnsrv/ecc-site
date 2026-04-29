import PageHero from "./PageHero.jsx";

export default function ServiceTemplate({ service, onBack, onPage }) {
  if (!service) return null;

  return (
    <main>
      <PageHero
        eyebrow="Услуга"
        title={service.name}
        sub="Шаблон страницы услуги. Здесь будет подробное описание, этапы, сроки и требования."
      />
      <section className="section">
        <div className="container service-template">
          <div className="service-template-main fade-up">
            <span className="card-tag">{service.tag}</span>
            <h2 className="s-title">О услуге</h2>
            <p className="s-sub service-template-desc">{service.desc}</p>
            <p className="card-time">{service.time}</p>

            <h3>Что включить в финальную страницу</h3>
            <ul>
              <li>Кому подходит услуга и для каких товаров.</li>
              <li>Пошаговый процесс прохождения сертификации.</li>
              <li>Список документов и требований к образцам.</li>
              <li>Сроки, стоимость и формат сопровождения.</li>
            </ul>

            <div className="service-template-actions">
              <button type="button" className="btn-ghost" onClick={onBack}>
                ← Назад к услугам
              </button>
              <button type="button" className="btn-primary" onClick={() => onPage("contacts")}>
                Оставить заявку
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
