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
