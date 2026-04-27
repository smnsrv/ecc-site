import { useState, useEffect, useCallback } from "react";
import { getPhoneList } from "../data.js";

export default function ChatWidget({ data, onPage }) {
  const ch = data.chat;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [stubHint, setStubHint] = useState(null);
  const [timeStr] = useState(() =>
    new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
  );

  const showStub = useCallback(() => {
    setStubHint(ch?.stub_hint || "Чат в разработке. Пока оставьте заявку в разделе «Контакты».");
  }, [ch?.stub_hint]);

  useEffect(() => {
    if (!stubHint) return;
    const t = window.setTimeout(() => setStubHint(null), 12000);
    return () => clearTimeout(t);
  }, [stubHint]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    showStub();
    setDraft("");
  };

  const doCall = () => {
    const phones = getPhoneList(data.company);
    const first = phones[0];
    if (first?.tel) {
      window.location.href = `tel:+${first.tel}`;
    }
  };

  const onQuick = (text) => {
    setDraft(text);
    showStub();
  };

  const goContacts = () => {
    setOpen(false);
    onPage("contacts");
  };

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  if (!ch) return null;

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-widget-panel" role="dialog" aria-modal="true" aria-labelledby="chat-widget-title">
          <header className="chat-widget-header">
            <div className="chat-widget-header-accent" aria-hidden />
            <div className="chat-widget-hero">
              {ch.avatar ? (
                <img className="chat-widget-avatar" src={ch.avatar} alt="" width="48" height="48" loading="lazy" />
              ) : (
                <div className="chat-widget-avatar chat-widget-avatar--placeholder" aria-hidden>
                  ?
                </div>
              )}
              <div>
                <div id="chat-widget-title" className="chat-widget-name">
                  {ch.name}
                </div>
                <div className="chat-widget-role">{ch.role}</div>
              </div>
            </div>
            <button
              type="button"
              className="chat-widget-close"
              onClick={() => setOpen(false)}
              aria-label="Закрыть чат"
            >
              ×
            </button>
          </header>
          <div className="chat-widget-body">
            {stubHint ? (
              <p className="chat-widget-stub" role="status">
                {stubHint}
              </p>
            ) : null}
            <div className="chat-widget-row">
              {ch.avatar ? (
                <img className="chat-widget-msg-av" src={ch.avatar} alt="" width="32" height="32" loading="lazy" />
              ) : null}
              <div className="chat-widget-col">
                <span className="chat-widget-msg-from">{ch.name}</span>
                <div className="chat-widget-bubble">{ch.welcome}</div>
                <div className="chat-widget-time">{timeStr}</div>
              </div>
            </div>
            <div className="chat-widget-quick" role="group" aria-label="Быстрые ответы">
              <button type="button" className="chat-widget-chip" onClick={() => onQuick(ch.quick_hello)}>
                {ch.quick_hello}
              </button>
              <button type="button" className="chat-widget-chip" onClick={() => onQuick(ch.quick_consult)}>
                {ch.quick_consult}
              </button>
              <button type="button" className="chat-widget-chip" onClick={doCall}>
                {ch.quick_call}
              </button>
            </div>
            <p className="chat-widget-hint">
              <button type="button" className="chat-widget-link" onClick={goContacts}>
                Оставить заявку на сайте
              </button>
            </p>
            {ch.foot_note ? <p className="chat-widget-note">{ch.foot_note}</p> : null}
          </div>
          <form className="chat-widget-footer" onSubmit={onSubmit}>
            <input
              type="text"
              className="chat-widget-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={ch.placeholder}
              maxLength={800}
              autoComplete="off"
            />
            <button type="submit" className="chat-widget-send" disabled={!draft.trim()} aria-label="Отправить">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2v7z" />
              </svg>
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        className="chat-widget-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={ch.fab_aria || "Чат"}
        title={ch.fab_aria}
      >
        {open ? (
          <span aria-hidden className="chat-widget-fab-x">
            ×
          </span>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="var(--white)"
            />
            <path d="M7 9H17M7 13H12" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
