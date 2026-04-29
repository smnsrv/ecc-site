export default function VideoSection({ data }) {
  const labImage = data.services.find((item) => item.tag === "Лаборатория")?.img || data.company.about_img;
  const stats = [
    { val: "4 500", label: "единиц испытательного оборудования" },
    { val: "11 000", label: "методик испытаний" },
    { val: "60 000+", label: "образцов проходят испытания" },
  ];

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="lab-showcase">
          <div className="lab-showcase-head fade-up">
            <h2>Испытательные центры и лаборатории</h2>
          </div>

          <div className="lab-showcase-main">
            <div className="lab-showcase-media fade-up">
              <img src={labImage} alt="Испытательная лаборатория" loading="lazy" />
            </div>

            <aside className="lab-showcase-stats fade-up d1" aria-label="Показатели лаборатории">
              {stats.map((item) => (
                <div key={item.label} className="lab-showcase-stat">
                  <strong>{item.val}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
