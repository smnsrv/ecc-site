import { useState } from "react";
import AdminField from "../AdminField.jsx";

export default function ServicesTab({ data, setData }) {
  const [openId, setOpenId] = useState(data.services[0]?.id ?? null);

  const updateSvc = (id, patch) =>
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));

  const addSvc = () => {
    const maxId = data.services.reduce((m, s) => Math.max(m, s.id), 0);
    const newId = maxId + 1;
    const next = {
      id: newId,
      tag: "Новая",
      name: "Новая услуга",
      desc: "Описание услуги",
      time: "⏱ срок",
      img: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&q=80",
    };
    setData((prev) => ({ ...prev, services: [...prev.services, next] }));
    setOpenId(newId);
  };

  const removeSvc = (id) => {
    if (!window.confirm("Удалить услугу?")) return;
    setData((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) }));
    setOpenId(null);
  };

  return (
    <div className="admin-services">
      <button type="button" className="btn-ghost admin-add-btn" onClick={addSvc}>
        + Добавить
      </button>
      {data.services.map((s) => {
        const isOpen = openId === s.id;
        return (
          <div key={s.id} className={`admin-accordion ${isOpen ? "open" : ""}`}>
            <button type="button" className="admin-accordion-head" onClick={() => setOpenId(isOpen ? null : s.id)}>
              <span>
                <strong>{s.name}</strong>
                <small>{s.tag}</small>
              </span>
              <span className="admin-accordion-ico" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="admin-accordion-body">
                <AdminField label="Тег">
                  <input value={s.tag} onChange={(e) => updateSvc(s.id, { tag: e.target.value })} />
                </AdminField>
                <AdminField label="Название">
                  <input value={s.name} onChange={(e) => updateSvc(s.id, { name: e.target.value })} />
                </AdminField>
                <AdminField label="Описание">
                  <textarea rows={3} value={s.desc} onChange={(e) => updateSvc(s.id, { desc: e.target.value })} />
                </AdminField>
                <AdminField label="Срок">
                  <input value={s.time} onChange={(e) => updateSvc(s.id, { time: e.target.value })} />
                </AdminField>
                <AdminField label="URL фото">
                  <input value={s.img} onChange={(e) => updateSvc(s.id, { img: e.target.value })} />
                </AdminField>
                <button type="button" className="btn-ghost admin-danger" onClick={() => removeSvc(s.id)}>
                  Удалить услугу
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
