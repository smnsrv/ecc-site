import AdminField from "../AdminField.jsx";

/** Герой + фото USP (URL) */
export default function HeroTab({ data, setData }) {
  const h = data.hero;
  const patchHero = (key, val) => setData((prev) => ({ ...prev, hero: { ...prev.hero, [key]: val } }));
  const patchTrust = (idx, field, val) =>
    setData((prev) => {
      const trust = prev.hero.trust.map((t, i) => (i === idx ? { ...t, [field]: val } : t));
      return { ...prev, hero: { ...prev.hero, trust } };
    });
  const patchCompany = (key, val) =>
    setData((prev) => ({ ...prev, company: { ...prev.company, [key]: val } }));

  return (
    <div className="admin-tab-grid">
      <AdminField label="Бейдж">
        <input value={h.badge} onChange={(e) => patchHero("badge", e.target.value)} />
      </AdminField>
      <AdminField label="H1 (часть до выделения)">
        <input value={h.h1_pre} onChange={(e) => patchHero("h1_pre", e.target.value)} />
      </AdminField>
      <AdminField label="H1 (выделение)">
        <input value={h.h1_mark} onChange={(e) => patchHero("h1_mark", e.target.value)} />
      </AdminField>
      <AdminField label="Подзаголовок">
        <textarea rows={2} value={h.sub} onChange={(e) => patchHero("sub", e.target.value)} />
      </AdminField>
      <AdminField label="Кнопка 1">
        <input value={h.btn1} onChange={(e) => patchHero("btn1", e.target.value)} />
      </AdminField>
      <AdminField label="Кнопка 2">
        <input value={h.btn2} onChange={(e) => patchHero("btn2", e.target.value)} />
      </AdminField>
      <div className="admin-block-title">Цифры доверия в герое</div>
      {h.trust.map((t, idx) => (
        <div key={t.lbl} className="admin-usp-block">
          <div className="admin-row-2">
            <AdminField label={`Значение ${idx + 1}`}>
              <input value={t.num} onChange={(e) => patchTrust(idx, "num", e.target.value)} />
            </AdminField>
            <AdminField label="Подпись">
              <input value={t.lbl} onChange={(e) => patchTrust(idx, "lbl", e.target.value)} />
            </AdminField>
          </div>
          <AdminField label="Вторая строка подписи (необязательно)">
            <input value={t.sub ?? ""} onChange={(e) => patchTrust(idx, "sub", e.target.value || undefined)} />
          </AdminField>
        </div>
      ))}
      <AdminField label="URL фото USP (секция «Почему мы»)" hint="Также используется как картинка преимуществ">
        <input value={data.company.usp_img} onChange={(e) => patchCompany("usp_img", e.target.value)} />
      </AdminField>
    </div>
  );
}
