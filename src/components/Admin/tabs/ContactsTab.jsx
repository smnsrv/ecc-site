import AdminField from "../AdminField.jsx";

export default function ContactsTab({ data, setData }) {
  const c = data.company;
  const patch = (key, val) => setData((prev) => ({ ...prev, company: { ...prev.company, [key]: val } }));

  const fields = [
    ["name", "Название"],
    ["sub", "Слоган"],
    ["accred", "Аккредитация"],
    ["address_short", "Адрес (короткий)"],
    ["address_full", "Адрес (полный)"],
    ["map_url", "Ссылка на карту (открытие в новой вкладке)"],
    ["map_lat", "Широта (Яндекс, карта на сайте)"],
    ["map_lng", "Долгота (Яндекс, карта на сайте)"],
    ["workhours", "Часы работы"],
    ["phone", "Телефон (отображение)"],
    ["phone_link", "Телефон (ссылка, только цифры)"],
    ["email", "Email"],
    ["telegram", "Telegram"],
    ["whatsapp", "WhatsApp (для wa.me)"],
    ["desc", "Описание"],
    ["about_img", "Устарело: фото (на «О компании» — плеер из video_url)"],
    ["map_img", "URL фото карты"],
    ["video_url", "URL embed YouTube"],
  ];

  return (
    <div className="admin-tab-grid">
      {fields.map(([key, label]) => (
        <AdminField key={key} label={label}>
          {key === "desc" ? (
            <textarea rows={3} value={c[key] ?? ""} onChange={(e) => patch(key, e.target.value)} />
          ) : (
            <input value={c[key] ?? ""} onChange={(e) => patch(key, e.target.value)} />
          )}
        </AdminField>
      ))}
    </div>
  );
}
