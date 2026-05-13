import { useState } from "react";
import AdminField from "../AdminField.jsx";

const ARTICLE_STUB = {
  why_title: "Заголовок вводного блока",
  why_lead: "Краткий вводный текст перед списком причин.",
  why_sections: [
    {
      heading: "1. Первый подпункт",
      paragraphs: ["Текст абзаца."],
      bullets: [],
    },
  ],
  scope_title: "Мы сертифицируем:",
  scope_sections: [
    {
      heading: "1. Категория продукции",
      bullets: ["Пример позиции в перечне."],
    },
  ],
};

const LIST_KEYS = [
  { key: "we_certify", title: "Направления (верх страницы)" },
  { key: "we_certify_by_industry", title: "Направления по отраслям (нижний блок)" },
];

export default function WeCertifyTab({ data, setData }) {
  const [openKey, setOpenKey] = useState(null);

  const updateDir = (listKey, id, patch) =>
    setData((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] || []).map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));

  const ensureArticle = (articleKey) => {
    setData((prev) => {
      const articles =
        prev.we_certify_articles && typeof prev.we_certify_articles === "object" ? prev.we_certify_articles : {};
      if (articles[articleKey]) return prev;
      return {
        ...prev,
        we_certify_articles: { ...articles, [articleKey]: { ...ARTICLE_STUB } },
      };
    });
  };

  const addDir = (listKey) => {
    const id = `wc-${Date.now()}`;
    const articleKey = `key_${Date.now()}`;
    const next = {
      id,
      articleKey,
      ico: "📋",
      title: "Новое направление",
      text: "Краткое описание на карточке страницы «Мы сертифицируем».",
    };
    setData((prev) => ({
      ...prev,
      [listKey]: [...(prev[listKey] || []), next],
      we_certify_articles: {
        ...(prev.we_certify_articles && typeof prev.we_certify_articles === "object" ? prev.we_certify_articles : {}),
        [articleKey]: { ...ARTICLE_STUB },
      },
    }));
    setOpenKey(`${listKey}:${id}`);
  };

  const removeDir = (listKey, id) => {
    if (!window.confirm("Удалить направление с карточки? Объект статьи в we_certify_articles не удаляется.")) return;
    setData((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] || []).filter((x) => x.id !== id),
    }));
    setOpenKey(null);
  };

  return (
    <div className="admin-services admin-we-certify">
      <p className="admin-we-certify-hint">
        Два списка: <strong>we_certify</strong> — основной блок «Направления»; <strong>we_certify_by_industry</strong> — блок
        «Направления по отраслям» под разделительной линией. Поле <strong>articleKey</strong> — ключ в{" "}
        <code>we_certify_articles</code>. Редактирование длинных статей удобно в <code>src/data.js</code>.
      </p>
      {LIST_KEYS.map(({ key: listKey, title }) => {
        const list = Array.isArray(data[listKey]) ? data[listKey] : [];
        return (
          <div key={listKey} className="admin-we-certify-group">
            <h3 className="admin-we-certify-group-title">{title}</h3>
            <p className="admin-we-certify-group-code">
              <code>{listKey}</code>
            </p>
            <button type="button" className="btn-ghost admin-add-btn" onClick={() => addDir(listKey)}>
              + В этот список
            </button>
            {list.map((row) => {
              const openId = `${listKey}:${row.id}`;
              const isOpen = openKey === openId;
              const hasArticle =
                data.we_certify_articles && typeof data.we_certify_articles === "object" && row.articleKey
                  ? Boolean(data.we_certify_articles[row.articleKey])
                  : false;
              return (
                <div key={row.id} className={`admin-accordion ${isOpen ? "open" : ""}`}>
                  <button type="button" className="admin-accordion-head" onClick={() => setOpenKey(isOpen ? null : openId)}>
                    <span>
                      <strong>{row.title}</strong>
                      <small>{row.articleKey || "без articleKey"}</small>
                    </span>
                    <span className="admin-accordion-ico" aria-hidden>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="admin-accordion-body">
                      <AdminField label="Внутренний id (не меняется)">
                        <input value={row.id} readOnly disabled />
                      </AdminField>
                      <AdminField label="articleKey (ключ в we_certify_articles)">
                        <input
                          value={row.articleKey || ""}
                          onChange={(e) => updateDir(listKey, row.id, { articleKey: e.target.value })}
                          placeholder="household"
                        />
                      </AdminField>
                      <AdminField label="Иконка (emoji)">
                        <input value={row.ico || ""} onChange={(e) => updateDir(listKey, row.id, { ico: e.target.value })} />
                      </AdminField>
                      <AdminField label="Заголовок на карточке">
                        <input value={row.title} onChange={(e) => updateDir(listKey, row.id, { title: e.target.value })} />
                      </AdminField>
                      <AdminField label="Краткий текст на карточке">
                        <textarea rows={3} value={row.text} onChange={(e) => updateDir(listKey, row.id, { text: e.target.value })} />
                      </AdminField>
                      {!hasArticle && row.articleKey ? (
                        <p className="admin-we-certify-warn">
                          Для ключа «{row.articleKey}» нет статьи в we_certify_articles — на сайте будет заглушка.
                          <button type="button" className="btn-ghost admin-add-btn" onClick={() => ensureArticle(row.articleKey)}>
                            Вставить шаблон статьи
                          </button>
                        </p>
                      ) : null}
                      <button type="button" className="btn-ghost admin-danger" onClick={() => removeDir(listKey, row.id)}>
                        Удалить направление
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
