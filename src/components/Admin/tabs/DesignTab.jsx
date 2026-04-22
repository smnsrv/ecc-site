import AdminField from "../AdminField.jsx";

const PRESETS = [
  { name: "Классика ECC", navy: "#0B1F3A", blue: "#1854C4", accent: "#E85D04", light: "#F9FAFB" },
  { name: "Глубокий океан", navy: "#0A2540", blue: "#1D6FEB", accent: "#F97316", light: "#F8FAFC" },
  { name: "Изумруд", navy: "#064E3B", blue: "#0D9488", accent: "#CA8A04", light: "#F0FDF4" },
  { name: "Винный", navy: "#1E1B4B", blue: "#6366F1", accent: "#DB2777", light: "#FAF5FF" },
  { name: "Сталь", navy: "#111827", blue: "#3B82F6", accent: "#22C55E", light: "#F9FAFB" },
  { name: "Песок", navy: "#292524", blue: "#B45309", accent: "#EA580C", light: "#FFFBEB" },
];

/** Цвета и пресеты */
export default function DesignTab({ data, setData }) {
  const d = data.design;

  const applyDesign = (next) => {
    setData((prev) => ({ ...prev, design: { ...prev.design, ...next } }));
  };

  const rows = [
    { key: "navy", label: "Navy" },
    { key: "blue", label: "Blue" },
    { key: "accent", label: "Accent" },
    { key: "light", label: "Light bg" },
  ];

  return (
    <div className="admin-tab-grid">
      <div className="admin-block-title">Текущая палитра</div>
      {rows.map((row) => (
        <div key={row.key} className="admin-color-row">
          <AdminField label={row.label}>
            <div className="admin-color-inputs">
              <input
                type="color"
                value={d[row.key]}
                onChange={(e) => applyDesign({ [row.key]: e.target.value })}
              />
              <input
                type="text"
                value={d[row.key]}
                onChange={(e) => applyDesign({ [row.key]: e.target.value })}
              />
            </div>
          </AdminField>
        </div>
      ))}
      <div className="admin-block-title">Пресеты</div>
      <div className="admin-presets">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className="admin-preset-btn"
            onClick={() => applyDesign({ navy: p.navy, blue: p.blue, accent: p.accent, light: p.light })}
          >
            <span className="admin-preset-swatches">
              <i style={{ background: p.navy }} />
              <i style={{ background: p.blue }} />
              <i style={{ background: p.accent }} />
            </span>
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
