# ECC site

Сайт на **Vite + React**. Статика для GitHub Pages — каталог **`docs/`** (см. `vite.config.js`).

## Команды

- `npm install` — зависимости
- `npm run dev` — разработка
- `npm run build` — продакшен-сборка в `docs/`

## Интеграции

- Формы: `src/integrations/sheetsForm.js` — `GOOGLE_SCRIPT_URL` (веб-приложение Google Apps Script).
- Telegram в проде: **UrlFetch** в GAS, токен в свойствах сценария. Код: `google-apps-script/Code.gs`.
- Локально: скопируйте `.env.example` в `.env` и задайте `VITE_TG_*` (опционально).

## SEO — с чего начать (порядок)

**Аналитика ≠ SEO.** Счётчики не поднимают позиции; они показывают трафик. Сначала — поисковые кабинеты и техника, потом по желанию GA4.

1. **Google Search Console** — главный старт: [search.google.com/search-console](https://search.google.com/search-console), подтвердите сайт, при необходимости добавьте `sitemap.xml` (URL из `public/sitemap.xml` после правки + деплой).
2. **Яндекс.Вебмастер** (если нужен СНГ) — [webmaster.yandex.ru](https://webmaster.yandex.ru), тот же sitemap.
3. **Сборка с каноничным URL** — в `.env` задайте `VITE_SITE_ORIGIN=https://ваш-реальный-домен/или/github.io/репо` **без** завершающего `/` и выполните `npm run build`. Тогда в `index` попадут `canonical`, `og:url`, `og:image` и **JSON-LD** Organization.
4. **Sitemap** — в `public/sitemap.xml` замените `https://YOUR_USER.github.io/YOUR_REPO/` на **точный** публичный URL, в `public/robots.txt` раскомментируйте и пропишите строку `Sitemap: ...` (тот же путь + `sitemap.xml`), снова `npm run build`.
5. **Google Analytics 4 (по желанию)** — в [analytics.google.com](https://analytics.google.com) создайте ресурс, поток **Web**, скопируйте **ID измерения** `G-...` в `.env` как `VITE_GA_MEASUREMENT_ID=G-...` и **пересоберите** (подключает `src/ga4.js`).

В репозитории уже: `public/robots.txt`, шаблон `public/sitemap.xml`, мета **Open Graph** / **Twitter** в `index.html`, **favicon** на логотип, опциональная **GA4** и **Schema.org** при `VITE_SITE_ORIGIN` на этапе билда.
