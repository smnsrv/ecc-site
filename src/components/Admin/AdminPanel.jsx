import { useEffect, useState } from "react";
import GeneralTab from "./tabs/GeneralTab.jsx";
import ServicesTab from "./tabs/ServicesTab.jsx";
import HeroTab from "./tabs/HeroTab.jsx";
import ContactsTab from "./tabs/ContactsTab.jsx";
import DesignTab from "./tabs/DesignTab.jsx";

const TABS = [
  { id: "general", Tab: GeneralTab },
  { id: "services", Tab: ServicesTab },
  { id: "hero", Tab: HeroTab },
  { id: "contacts", Tab: ContactsTab },
  { id: "design", Tab: DesignTab },
];

export default function AdminPanel({ data, setData, onSave, onReset, onClose, ui }) {
  const [tab, setTab] = useState("general");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const labels = ui.admin_tabs;

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true" aria-label={ui.admin_title}>
      <div className="admin-backdrop" onClick={onClose} aria-hidden />
      <div className="admin-panel">
        <header className="admin-header">
          <h2>{ui.admin_title}</h2>
          <button type="button" className="admin-close" onClick={onClose} aria-label={ui.admin_close}>
            ×
          </button>
        </header>
        <nav className="admin-tabs">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={`admin-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {labels[t.id]}
            </button>
          ))}
        </nav>
        <div className="admin-body">
          {TABS.map((t) => {
            const Comp = t.Tab;
            return tab === t.id ? <Comp key={t.id} data={data} setData={setData} /> : null;
          })}
        </div>
        <footer className="admin-footer">
          <button type="button" className="btn-primary" onClick={onSave}>
            {ui.admin_save}
          </button>
          <button type="button" className="btn-ghost" onClick={onReset}>
            {ui.admin_reset}
          </button>
        </footer>
      </div>
    </div>
  );
}
