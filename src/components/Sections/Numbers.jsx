/** Полоса с цифрами */
export default function Numbers({ data }) {
  const u = data.ui;
  return (
    <section className="numbers-strip">
      <div className="container">
        <p className="eyebrow eyebrow-light fade-up">{u.numbers_eyebrow}</p>
        <div className="numbers-grid">
          {data.numbers.map((n, i) => (
            <div key={`${n.lbl}-${i}`} className={`num-cell fade-up d${(i % 4) + 1}`}>
              <span className="num-val">{n.val}</span>
              <span className="num-lbl">{n.lbl}</span>
              {n.sub ? <span className="num-sub">{n.sub}</span> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
