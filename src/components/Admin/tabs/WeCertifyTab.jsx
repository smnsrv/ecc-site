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

export default function WeCertifyTab({ data, setData }) {
  const list = Array.isArray(data.we_certify) ? data.we_certify : [];
  const [openId, setOpenId] = useState(list[0]?.id ?? null);

  const updateDir = (id, patch) =>
    setData((prev) => ({
      ...prev,
      we_certify: (prev.we_certify || []).map((x) => (x.id === id ? { ...x, ...patch } : x)),
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

  const addDir = () => {
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
      we_certify: [...(prev.we_certify || []), next],
      we_certify_articles: {
        ...(prev.we_certify_articles && typeof prev.we_certify_articles === "object" ? prev.we_certify_articles : {}),
        [articleKey]: { ...ARTICLE_STUB },
      },
    }));
    setOpenId(id);
  };

  const removeDir = (id) => {
    if (!window.confirm("Удалить направление с карточки? Объект статьи в we_certify_articles не удаляется.")) return;
    setData((prev) => ({
      ...prev,
      we_certify: (prev.we_certify || []).filter((x) => x.id !== id),
    }));
    setOpenId(null);
  };

  return (
    <div className="admin-services admin-we-certify">
      <p className="admin-we-certify-hint">
        Карточки на странице «Мы сертифицируем». Поле <strong>articleKey</strong> — ключ объекта{" "}
        <code>we_certify_articles</code> в данных: там же лежит развёрнутый текст (why_title, why_lead, why_sections,
        scope_title, scope_sections). Удобно править большие статьи в <code>src/data.js</code> или вставить готовый JSON
        через экспорт/импорт после сохранения в админке.
      </p>
      <button type="button" className="btn-ghost admin-add-btn" onClick={addDir}>
        + Направление
      </button>
      {list.map((row) => {
        const isOpen = openId === row.id;
        const hasArticle =
          data.we_certify_articles && typeof data.we_certify_articles === "object" && row.articleKey
            ? Boolean(data.we_certify_articles[row.articleKey])
            : false;
        return (
          <div key={row.id} className={`admin-accordion ${isOpen ? "open" : ""}`}>
            <button type="button" className="admin-accordion-head" onClick={() => setOpenId(isOpen ? null : row.id)}>
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
                    onChange={(e) => updateDir(row.id, { articleKey: e.target.value })}
                    placeholder="household"
                  />
                </AdminField>
                <AdminField label="Иконка (emoji)">
                  <input value={row.ico || ""} onChange={(e) => updateDir(row.id, { ico: e.target.value })} />
                </AdminField>
                <AdminField label="Заголовок на карточке">
                  <input value={row.title} onChange={(e) => updateDir(row.id, { title: e.target.value })} />
                </AdminField>
                <AdminField label="Краткий текст на карточке">
                  <textarea rows={3} value={row.text} onChange={(e) => updateDir(row.id, { text: e.target.value })} />
                </AdminField>
                {!hasArticle && row.articleKey ? (
                  <p className="admin-we-certify-warn">
                    Для ключа «{row.articleKey}» нет статьи в we_certify_articles — на сайте будет заглушка.
                    <button type="button" className="btn-ghost admin-add-btn" onClick={() => ensureArticle(row.articleKey)}>
                      Вставить шаблон статьи
                    </button>
                  </p>
                ) : null}
                <button type="button" className="btn-ghost admin-danger" onClick={() => removeDir(row.id)}>
                  Удалить направление
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
