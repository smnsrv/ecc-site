// Prod: Telegram через GAS (CORS). Dev: VITE_TG_* + Vite proxy /_telegram-api (см. vite.config.js).
import { postJsonToGoogleScript, getSheetsUrlConfigError } from "./sheetsForm.js";

const TG_TOKEN = import.meta.env.VITE_TG_TOKEN ?? "";
const TG_CHAT_ID = import.meta.env.VITE_TG_CHAT_ID ?? "";

function parseDevChatIds() {
  return String(TG_CHAT_ID)
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function escHtml(s) {
  if (s == null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** В dev (прокси) в конец копии — id чата. В проде GAS так же только id (без лишнего API). */
function devRecipientFooterLine(chatId) {
  return `\n\n—\n<i>Получатель: id ${escHtml(String(chatId))}</i>`;
}

export function isTelegramConfigured() {
  return Boolean(String(TG_TOKEN).trim() && String(TG_CHAT_ID).trim());
}

export function buildTelegramHtmlMessage(formName, fields) {
  const lines = [
    `📋 <b>Новая заявка — ${escHtml(formName)}</b>`,
    "🌐 <b>Electro Class Control</b>",
    "",
  ];
  for (const [key, val] of Object.entries(fields)) {
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      lines.push(`${key}: ${escHtml(val)}`);
    }
  }
  lines.push("");
  lines.push(
    `🕐 ${escHtml(
      new Date().toLocaleString("ru-RU", {
        timeZone: "Asia/Tashkent",
        dateStyle: "short",
        timeStyle: "short",
      }),
    )}`,
  );
  return lines.join("\n");
}

export async function sendMessageViaDevProxy(telegramText) {
  if (!isTelegramConfigured()) return false;
  const ids = parseDevChatIds();
  let allOk = true;
  for (const chat_id of ids) {
    const res = await fetch(`/_telegram-api/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id,
        text: telegramText + devRecipientFooterLine(chat_id),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram (dev proxy):", chat_id, data);
      allOk = false;
    }
  }
  return allOk;
}

export async function sendToTelegram(formName, fields) {
  const telegramText = buildTelegramHtmlMessage(formName, fields);

  if (import.meta.env.DEV && isTelegramConfigured()) {
    return sendMessageViaDevProxy(telegramText);
  }

  if (getSheetsUrlConfigError()) {
    if (import.meta.env.DEV) {
      console.warn("[telegram] Задайте GOOGLE_SCRIPT_URL в sheetsForm.js (prod).");
    }
    return false;
  }

  const origin = typeof window !== "undefined" && window.location?.href ? window.location.href : "";
  const source = [origin, formName].filter(Boolean).join(" | ") || "ECC сайт";
  const certTypeFromForm = String(fields["🧾 Вид сертификации"] ?? "").trim();
  const sheetRow = {
    dateTime: new Date().toISOString(),
    productType: String(fields["📦 Тип товара"] ?? "").trim(),
    country: certTypeFromForm || String(fields["🌍 Страна"] ?? "").trim(),
    contact: String(fields["📱 Telegram / WhatsApp"] ?? "").trim(),
    email: String(fields["📧 Email"] ?? "").trim(),
    source,
  };

  try {
    /* В GAS (Code.gs) строка в Таблицу пишется только при data.dateTime — раньше CTA слала только telegramText. */
    await postJsonToGoogleScript({
      ...sheetRow,
      _ecc_telegram: true,
      _ecc_cta: true,
      formName,
      telegramText,
    });
    return true;
  } catch (e) {
    console.error("sendToTelegram (GAS CTA):", e);
    return false;
  }
}

export async function testTelegram() {
  const text = buildTelegramHtmlMessage("Тест", { "✅ Проверка": "Интеграция работает!" });
  if (import.meta.env.DEV && isTelegramConfigured()) {
    const ok = await sendMessageViaDevProxy(text);
    // eslint-disable-next-line no-alert
    alert(
      ok
        ? "✅ В dev запрос ушёл через Vite-прокси. В проде — через GAS."
        : "❌ Проверьте .env (VITE_TG_*) и консоль.",
    );
    return ok;
  }

  if (getSheetsUrlConfigError()) {
    // eslint-disable-next-line no-alert
    alert("Задайте GOOGLE_SCRIPT_URL в sheetsForm.js или VITE_TG_* в .env для dev.");
    return false;
  }

  try {
    await postJsonToGoogleScript({ _ecc_test: true, telegramText: text });
    // eslint-disable-next-line no-alert
    alert("Запрос в GAS отправлен. Проверьте Telegram.");
    return true;
  } catch (e) {
    console.error(e);
    // eslint-disable-next-line no-alert
    alert("Ошибка: " + (e.message || e));
    return false;
  }
}
