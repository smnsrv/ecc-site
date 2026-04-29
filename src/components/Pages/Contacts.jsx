import { useState } from "react";
import PageHero from "./PageHero.jsx";
import YandexMapEmbed, { yandexMapCoordinatesFromCompany } from "../YandexMapEmbed.jsx";
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
  const { lat: mapLat, lng: mapLng } = yandexMapCoordinatesFromCompany(c);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSendError(null);
    setSubmitting(true);
    const fd = new FormData(form);
    const productType = (fd.get("product") || "").toString().trim();
    const certTypes = fd.getAll("cert_type").map((v) => String(v).trim()).filter(Boolean);
    const certTypeLabel = certTypes.join(", ");
    const contact = (fd.get("messenger") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    if (!productType || !contact || certTypes.length === 0) {
      setSendError("Заполните тип товара, вид сертификации и контакт (Telegram / WhatsApp).");
      setSubmitting(false);
      return;
    }
    const source = `${window.location.href} | ${u.contacts_form_title}`;
    const dateTime = new Date().toISOString();

    const telegramText = buildTelegramHtmlMessage(`Контакты: ${u.contacts_form_title}`, {
      "📦 Тип товара": productType,
      "🧾 Вид сертификации": certTypeLabel,
      "📱 Telegram / WhatsApp": contact,
      "📧 Email": email,
      "🌐 Источник": source,
    });

    try {
      await postConsultationToSheets({
        dateTime,
        productType,
        country: certTypeLabel,
        contact,
        email,
        source,
        telegramText,
      });
      form.reset();
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
                  <span>{data.cta.fields.cert_type}</span>
                  <div className="check-list" role="group" aria-label={data.cta.fields.cert_type}>
                    {data.cta.cert_types.map((item) => (
                      <label key={item} className="check-item">
                        <input type="checkbox" name="cert_type" value={item} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
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
              <YandexMapEmbed
                title={`Карта: ${c.address_full || c.address_short}`}
                lat={mapLat}
                lng={mapLng}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
