import { useState } from "react";
import PageHero from "./PageHero.jsx";

export default function Contacts({ data }) {
  const u = data.ui;
  const c = data.company;
  const [country, setCountry] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    console.log("[contacts]", { ...Object.fromEntries(fd.entries()), country });
    setSent(true);
  };

  return (
    <main>
      <PageHero eyebrow={u.page_contacts_eyebrow} title={u.page_contacts_title} sub={u.page_contacts_sub} />
      <section className="section">
        <div className="container contacts-grid">
          <div className="contacts-card fade-up">
            {!sent ? (
              <form onSubmit={submit} className="contacts-form">
                <h2 className="s-title">{u.contacts_form_title}</h2>
                <label className="field">
                  <span>{data.cta.fields.product}</span>
                  <input name="product" placeholder={data.cta.placeholders.product} required />
                </label>
                <label className="field">
                  <span>{data.cta.fields.country}</span>
                  <select name="country" value={country} onChange={(e) => setCountry(e.target.value)} required>
                    {data.consult_countries.map((o, idx) => (
                      <option key={o.value || `co-${idx}`} value={o.value} disabled={o.disabled}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>{data.cta.fields.messenger}</span>
                  <input name="messenger" placeholder={data.cta.placeholders.messenger} required />
                </label>
                <label className="field">
                  <span>{data.cta.fields.email}</span>
                  <input name="email" type="email" placeholder={data.cta.placeholders.email} required />
                </label>
                <button type="submit" className="btn-primary btn-block">
                  {u.contacts_form_submit}
                </button>
              </form>
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
          <div className="contacts-info fade-up d1">
            <ul className="info-list">
              <li>
                <strong>{u.contacts_labels_address}</strong> {c.address_full}
              </li>
              <li>
                <strong>{u.contacts_labels_hours}</strong> {c.workhours}
              </li>
              <li>
                <strong>{u.contacts_labels_accred}</strong> {c.accred}
              </li>
              <li>
                <strong>{u.contacts_labels_phone}</strong>{" "}
                <a href={`tel:+${c.phone_link}`}>{c.phone}</a>
              </li>
              <li>
                <strong>{u.contacts_labels_email}</strong>{" "}
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </li>
            </ul>
            <div className="contacts-map">
              <img src={c.map_img} alt="" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
