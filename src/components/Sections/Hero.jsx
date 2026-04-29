export default function Hero({ data }) {
  const h = data.hero;
  return (
    <div className="hero-main fade-up">
      <p className="hero-badge">{h.badge}</p>
      <h1 className="hero-title">
        {h.h1_pre} <mark className="hero-mark">{h.h1_mark}</mark>
      </h1>
      <p className="hero-slogan">{h.slogan}</p>
    </div>
  );
}
