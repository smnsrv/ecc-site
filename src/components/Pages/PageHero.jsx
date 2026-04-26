export default function PageHero({ eyebrow, title, sub }) {
  return (
    <section className="page-hero">
      <div className="container fade-up">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-hero-title">{title}</h1>
        <p className="s-sub page-hero-sub">{sub}</p>
      </div>
    </section>
  );
}
