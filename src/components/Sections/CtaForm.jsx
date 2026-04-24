import { useState } from "react";
import { getPhoneList } from "../../data.js";

/** Финальный CTA с формой */
export default function CtaForm({ data }) {
  const c = data.cta;
  const co = data.company;
  const phones = getPhoneList(co);
  const u = data.ui;
  const [sent, setSent] = useState(false);
  const [country, setCountry] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(fd.entries()), country };
    console.log("[cta]", payload);
    setSent(true);
  };

  return (
    <section className="cta-section">
      <div className="container cta-grid">
        <div className="cta-copy fade-up">
          <h2 className="cta-title">{c.title}</h2>
          <p className="cta-sub">{c.sub}</p>
          <ul className="cta-bullets">
            {c.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p className="cta-phone-note">{c.phone_note}</p>
          <div className="cta-phones" role="group" aria-label={c.phone_note.replace(":", "").trim()}>
            {phones.map((p) => (
              <a key={p.tel} className="cta-phone" href={`tel:+${p.tel}`}>
                {p.text}
              </a>
            ))}
          </div>
        </div>
        <div className="cta-card-wrap fade-up d1">
          {!sent ? (
            <div className="cta-card">
              <h3>{c.form_title}</h3>
              <form onSubmit={submit} className="cta-form">
                <label className="field">
                  <span>{c.fields.product}</span>
                  <input name="product" placeholder={c.placeholders.product} required />
                </label>
                <label className="field">
                  <span>{c.fields.country}</span>
                  <select name="country" value={country} onChange={(e) => setCountry(e.target.value)} required>
                    {data.consult_countries.map((o, idx) => (
                      <option key={o.value || `c-${idx}`} value={o.value} disabled={o.disabled}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>{c.fields.messenger}</span>
                  <input name="messenger" placeholder={c.placeholders.messenger} required />
                </label>
                <label className="field">
                  <span>{c.fields.email}</span>
                  <input name="email" type="email" placeholder={c.placeholders.email} required />
                </label>
                <button type="submit" className="btn-primary btn-block">
                  {c.submit}
                </button>
              </form>
            </div>
          ) : (
            <div className="cta-success" role="status">
              <div className="cta-success-icon" aria-hidden>
                ✓
              </div>
              <h3>{u.cta_success_title}</h3>
              <p>{u.cta_success_text}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
