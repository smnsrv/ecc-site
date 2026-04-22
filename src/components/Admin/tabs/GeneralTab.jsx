import AdminField from "../AdminField.jsx";

/** Основное: компания, цифры, USP */
export default function GeneralTab({ data, setData }) {
  const patchCompany = (key, val) =>
    setData((prev) => ({ ...prev, company: { ...prev.company, [key]: val } }));

  const patchNumber = (idx, field, val) =>
    setData((prev) => {
      const numbers = prev.numbers.map((n, i) => (i === idx ? { ...n, [field]: val } : n));
      return { ...prev, numbers };
    });

  const patchUsp = (idx, field, val) =>
    setData((prev) => {
      const usp = prev.usp.map((u, i) => (i === idx ? { ...u, [field]: val } : u));
      return { ...prev, usp };
    });

  const c = data.company;
  return (
    <div className="admin-tab-grid">
      <AdminField label="Название компании">
        <input value={c.name} onChange={(e) => patchCompany("name", e.target.value)} />
      </AdminField>
      <AdminField label="Слоган (под логотипом)">
        <input value={c.sub} onChange={(e) => patchCompany("sub", e.target.value)} />
      </AdminField>
      <AdminField label="Описание (краткое)">
        <textarea rows={3} value={c.desc} onChange={(e) => patchCompany("desc", e.target.value)} />
      </AdminField>
      <div className="admin-block-title">Большие цифры (главная полоса)</div>
      {data.numbers.map((n, idx) => (
        <div key={n.lbl} className="admin-row-2">
          <AdminField label={`Цифра ${idx + 1}`}>
            <input value={n.val} onChange={(e) => patchNumber(idx, "val", e.target.value)} />
          </AdminField>
          <AdminField label="Подпись">
            <input value={n.lbl} onChange={(e) => patchNumber(idx, "lbl", e.target.value)} />
          </AdminField>
        </div>
      ))}
      <div className="admin-block-title">Преимущества (USP)</div>
      {data.usp.map((u, idx) => (
        <div key={u.title} className="admin-usp-block">
          <AdminField label={`Иконка ${idx + 1}`}>
            <input value={u.ico} onChange={(e) => patchUsp(idx, "ico", e.target.value)} />
          </AdminField>
          <AdminField label="Заголовок">
            <input value={u.title} onChange={(e) => patchUsp(idx, "title", e.target.value)} />
          </AdminField>
          <AdminField label="Текст">
            <textarea rows={2} value={u.text} onChange={(e) => patchUsp(idx, "text", e.target.value)} />
          </AdminField>
        </div>
      ))}
    </div>
  );
}
