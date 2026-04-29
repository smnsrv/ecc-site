export default function Numbers({ data }) {
  const statA = data.numbers?.[1];
  const statB = data.numbers?.[2];
  const expert = data.reviews?.[0];

  return (
    <section className="numbers-strip">
      <div className="numbers-overlay">
        <div className="container numbers-cards">
          <article className="numbers-work-card fade-up">
            <h3>Наша работа</h3>
            <p>В Узбекистане и за рубежом</p>
            <div className="numbers-work-stats">
              <div>
                <strong>{statA?.val || "5 000+"}</strong>
                <span>{statA?.lbl || "Клиенты"}</span>
              </div>
              <div>
                <strong>{statB?.val || "15 000+"}</strong>
                <span>{statB?.lbl || "Выдано сертификатов"}</span>
              </div>
            </div>
          </article>

          <article className="numbers-expert-card fade-up d1">
            <h3>Мнение экспертов</h3>
            <div className="numbers-expert-person">
              {expert?.avatar ? <img src={expert.avatar} alt={expert.name} loading="lazy" /> : null}
              <div>
                <strong>{expert?.name || "Эксперт ECC"}</strong>
                <span>{expert?.org || "Сертификация и испытания"}</span>
              </div>
            </div>
            <p>{expert?.text || "Экспертиза и сопровождение по сертификации продукции."}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
