import { useState } from "react";
import PageHero from "./PageHero.jsx";
import { getPhoneList } from "../../data.js";
import { postConsultationToSheets } from "../../integrations/sheetsForm.js";
import { buildTelegramHtmlMessage } from "../../integrations/telegram.js";

const SUCCESS_MSG = "Спасибо! Ваша заявка отправлена.";
const ERROR_MSG = "Не удалось отправить заявку. Попробуйте позже.";
const ERR_CONFIG =
  "Форма не настроена: в файле src/integrations/sheetsForm.js укажите полный URL веб-приложения Google (начинается с https://script.google.com/...), выполните npm run build и снова выложите папку docs на GitHub Pages.";
const ERR_HTTPS = "В GOOGLE_SCRIPT_URL нужен полный адрес с https:// (скопируйте из Google Apps Script → Развёртывание).";
const ERR_NOT_GAS = "URL должен вести на script.google.com/macros/... (веб-приложение Google Apps Script).";

export default function Contacts({ data }) {
  const u = data.ui;
  const c = data.company;
  const phones = getPhoneList(c);
  const [country, setCountry] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSendError(null);
    setSubmitting(true);
    const fd = new FormData(form);
    const productType = (fd.get("product") || "").toString();
    const countryValue = (fd.get("country") || "").toString();
    const contact = (fd.get("messenger") || "").toString();
    const email = (fd.get("email") || "").toString();
    const countryLabel =
      data.consult_countries.find((o) => o.value === countryValue && !o.disabled)?.label || countryValue;
    const source = `${window.location.href} | ${u.contacts_form_title}`;
    const dateTime = new Date().toISOString();

    const telegramText = buildTelegramHtmlMessage(`Контакты: ${u.contacts_form_title}`, {
      "📦 Тип товара": productType,
      "🌍 Страна": countryLabel,
      "📱 Telegram / WhatsApp": contact,
      "📧 Email": email,
      "🌐 Источник": source,
    });

    try {
      await postConsultationToSheets({
        dateTime,
        productType,
        country: countryLabel,
        contact,
        email,
        source,
        telegramText,
      });
      form.reset();
      setCountry("");
      setSent(true);
    } catch (err) {
      console.log(err);
      const code = err.sheetsConfigCode;
      if (code === "SHEETS_PLACEHOLDER") {
        setSendError(ERR_CONFIG);
      } else if (code === "SHEETS_NOT_HTTPS") {
        setSendError(ERR_HTTPS);
      } else if (code === "SHEETS_NOT_SCRIPT") {
        setSendError(ERR_NOT_GAS);
      } else {
        setSendError(ERROR_MSG);
      }
    } finally {
      setSubmitting(false);
    }
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
                {sendError ? (
                  <p className="contacts-form-error" role="alert">
                    {sendError}
                  </p>
                ) : null}
                <button type="submit" className="btn-primary btn-block" disabled={submitting}>
                  {submitting ? "Отправка…" : u.contacts_form_submit}
                </button>
              </form>
            ) : (
              <div className="cta-success" role="status">
                <div className="cta-success-icon" aria-hidden>
                  ✓
                </div>
                <h3>{SUCCESS_MSG}</h3>
              </div>
            )}
          </div>
          <div className="contacts-info fade-up d1">
            <ul className="info-list">
              <li>
                <strong>{u.contacts_labels_address}</strong>{" "}
                <a href={c.map_url} target="_blank" rel="noreferrer">
                  {c.address_full}
                </a>
              </li>
              <li>
                <strong>{u.contacts_labels_hours}</strong> {c.workhours}
              </li>
              <li>
                <strong>{u.contacts_labels_accred}</strong> {c.accred}
              </li>
              <li className="info-list-phones">
                <strong>{u.contacts_labels_phone}</strong>{" "}
                <span className="info-phones">
                  {phones.map((p, i) => (
                    <span key={p.tel}>
                      {i > 0 ? ", " : null}
                      <a href={`tel:+${p.tel}`}>{p.text}</a>
                    </span>
                  ))}
                </span>
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
