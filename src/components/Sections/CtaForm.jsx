import { useState } from "react";
import { trackGaEvent } from "../../analytics.js";
import { getPhoneList } from "../../data.js";
import { sendToTelegram } from "../../integrations/telegram.js";

export default function CtaForm({ data }) {
  const c = data.cta;
  const co = data.company;
  const phones = getPhoneList(co);
  const u = data.ui;
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSendError(null);
    setSubmitting(true);
    const fd = new FormData(form);
    const product = (fd.get("product") || "").toString().trim();
    const certTypes = fd.getAll("cert_type").map((v) => String(v).trim()).filter(Boolean);
    const certTypeLabel = certTypes.join(", ");
    const contact = (fd.get("messenger") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    if (!product || !contact || certTypes.length === 0) {
      setSendError("Заполните тип товара, вид сертификации и контакт (Telegram / WhatsApp).");
      setSubmitting(false);
      return;
    }
    try {
      const ok = await sendToTelegram("Главная (быстрая заявка)", {
        "📦 Тип товара": product,
        "🧾 Вид сертификации": certTypeLabel,
        "📱 Telegram / WhatsApp": contact,
        "📧 Email": email,
      });
      if (!ok) {
        trackGaEvent("form_submit_error", { form_id: "cta_home", reason: "telegram_or_gas_failed" });
        setSendError(`Не удалось отправить. Напишите напрямую: @${co.telegram}`);
        return;
      }
      form.reset();
      setSent(true);
      trackGaEvent("generate_lead", { form_id: "cta_home", method: "telegram_gas" });
    } catch (err) {
      console.error(err);
      trackGaEvent("form_submit_error", { form_id: "cta_home", reason: "exception" });
      setSendError("Ошибка отправки. Попробуйте позже.");
    } finally {
      setSubmitting(false);
    }
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
          <p className="cta-workhours">
            <strong>{u.contacts_labels_hours}</strong> {co.workhours}
          </p>
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
                  <span>{c.fields.cert_type}</span>
                  <div className="check-list" role="group" aria-label={c.fields.cert_type}>
                    {c.cert_types.map((item) => (
                      <label key={item} className="check-item">
                        <input type="checkbox" name="cert_type" value={item} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </label>
                <label className="field">
                  <span>{c.fields.messenger}</span>
                  <input name="messenger" placeholder={c.placeholders.messenger} required />
                </label>
                <label className="field">
                  <span>{c.fields.email}</span>
                  <input name="email" type="email" placeholder={c.placeholders.email} required />
                </label>
                {sendError ? (
                  <p className="cta-form-error" role="alert">
                    {sendError}
                  </p>
                ) : null}
                <button type="submit" className="btn-primary btn-block" disabled={submitting}>
                  {submitting ? "Отправка…" : c.submit}
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
