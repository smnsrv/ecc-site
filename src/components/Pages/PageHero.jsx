export default function PageHero({ eyebrow, title, sub, onBack, backLabel = "← Назад к услугам" }) {
  return (
    <section className="page-hero">
      <div className="container fade-up">
        {typeof onBack === "function" ? (
          <button type="button" className="btn-ghost page-hero-back" onClick={onBack}>
            {backLabel}
          </button>
        ) : null}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-hero-title">{title}</h1>
        <p className="s-sub page-hero-sub">{sub}</p>
      </div>
    </section>
  );
}
