# Интеграции ECC-сайта

Кратко: как уходят лиды, какие переменные нужны при сборке и что менять в Google Apps Script.

## Google Apps Script (GAS) + Таблица

- **Клиент:** `src/integrations/sheetsForm.js` — функция `postJsonToGoogleScript` / `postConsultationToSheets`.
- **URL веб-приложения** задаётся константой `GOOGLE_SCRIPT_URL` (желательно вынести в секрет CI и подставлять через `import.meta.env` при сборке).
- **Надёжность:** до **3** повторов при сетевых сбоях и ответах **5xx / 429**; клиентские ошибки **4xx** (кроме 429) не повторяются.
- **Идемпотентность:** в каждый payload добавляется поле **`_ecc_request_id`** (UUID или fallback). В `Code.gs` можно хранить последние id и не дублировать строку при повторной доставке.

### Типичные поля тела (страница «Контакты»)

| Поле | Описание |
|------|-----------|
| `dateTime` | ISO-время |
| `productType` | Тип товара |
| `country` | Строка видов сертификации (чекбоксы через запятую) |
| `contact` | Telegram / WhatsApp |
| `email` | Email |
| `source` | URL + подпись формы |
| `telegramText` | HTML-текст для пересылки в Telegram из GAS |

### CTA на главной через `sendToTelegram`

Используется `postJsonToGoogleScript` с флагами `_ecc_telegram`, `_ecc_cta`, `formName`, `telegramText` и полями заявки — см. `src/integrations/telegram.js`.

## Telegram (только dev)

- Переменные: **`VITE_TG_TOKEN`**, **`VITE_TG_CHAT_ID`** (можно несколько id через `,;|`).
- Запросы идут через прокси Vite `/_telegram-api` → `api.telegram.org` (`vite.config.js`).
- Повторы: до **3** попыток на чат при сетевых / 5xx / 429.

## Google Analytics 4

- Переменная: **`VITE_GA_MEASUREMENT_ID=G-...`**.
- Инициализация: `src/ga4.js` (выставляет **`window.gtag`**).
- События из кода: `src/analytics.js` → `trackGaEvent(name, params)`.
  - Успех: **`generate_lead`** (`form_id`: `cta_home` | `contacts_page`, `method`).
  - Ошибка: **`form_submit_error`** (`form_id`, `reason`).

## Локальный «CMS»

- Данные по умолчанию: `src/data.js`.
- Правки пользователя: **`localStorage`** ключ `ecc_cms_data_react` (см. `src/hooks/useData.js`).
- При повреждённом JSON в консоли пишется ошибка и подставляется дефолтный объект.

## Хлебные крошки и SEO

- В шапке страниц используется компонент `PageHero` с опциональными `breadcrumbs` (кнопки-ссылки + текущая страница) и `breadcrumbSchema` для **JSON-LD `BreadcrumbList`** (скрипт `#ecc-breadcrumb-jsonld` в `<head>`).
- URL в разметке строятся как `location` без хеша + хеш-маршрут (`#/services`, `#/we-certify/...`).
- Текст `aria-label` навигации задаётся в `data.ui.breadcrumb_aria`.

## Сборка и деплой

- `npm run build` → каталог **`docs/`** (GitHub Pages).
- CI: `.github/workflows/deploy-pages.yml` — после проверок **lint**, **test**, **npm audit** (уровень `high`).

## Переменные окружения (Vite)

| Переменная | Назначение |
|------------|------------|
| `VITE_GA_MEASUREMENT_ID` | GA4, опционально |
| `VITE_TG_TOKEN` | Dev Telegram |
| `VITE_TG_CHAT_ID` | Dev Telegram |
| `VITE_SITE_ORIGIN` | Канонический URL и JSON-LD в `vite.config.js` (сборка) |
