/**
 * Уведомления в Telegram.
 *
 * ВАЖНО: запросы с браузера на https://api.telegram.org блокируются (CORS).
 * Production: отправка через тот же Google Apps Script, что и таблица
 * (UrlFetchApp + токен в настройках скрипта), см. комментарий в конце файла.
 * Разработка: при наличии VITE_TG_* в .env — обход через прокси Vite /_telegram-api/…
 */
import {
  postJsonToGoogleScript,
  GOOGLE_SCRIPT_URL,
  getSheetsUrlConfigError,
} from "./sheetsForm.js";

// Для dev-режима: прямые вызовы (через Vite proxy, не уходит CORS-ограничение)
const TG_TOKEN = import.meta.env.VITE_TG_TOKEN ?? "";
const TG_CHAT_ID = import.meta.env.VITE_TG_CHAT_ID ?? "";

function escHtml(s) {
  if (s == null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isTelegramConfigured() {
  return Boolean(String(TG_TOKEN).trim() && String(TG_CHAT_ID).trim());
}

/**
 * @param {string} formName
 * @param {Record<string, string | undefined | null>} fields
 */
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

/** Прямой вызов Bot API только с dev-сервера Vite (см. vite.config.js — proxy) */
export async function sendMessageViaDevProxy(telegramText) {
  if (!isTelegramConfigured()) return false;
  const res = await fetch(`/_telegram-api/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: telegramText,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  const data = await res.json();
  if (!data.ok) console.error("Telegram (dev proxy):", data);
  return Boolean(data?.ok);
}

/**
 * CTA с главной: в prod — GAS, в dev при наличии .env — прокси, иначе GAS.
 * @param {string} formName
 * @param {Record<string, string>} fields
 * @returns {Promise<boolean>}
 */
export async function sendToTelegram(formName, fields) {
  const telegramText = buildTelegramHtmlMessage(formName, fields);

  if (import.meta.env.DEV && isTelegramConfigured()) {
    return sendMessageViaDevProxy(telegramText);
  }

  if (getSheetsUrlConfigError()) {
    if (import.meta.env.DEV) {
      console.warn(
        "[telegram] Прод: задайте GOOGLE_SCRIPT_URL и добавьте в GAS обработку _ecc_cta (см. telegram.js внизу).",
      );
    }
    return false;
  }

  try {
    await postJsonToGoogleScript({
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
    alert(ok ? "✅ В dev Telegram ушёл через Vite-прокси. В проде — только через GAS (UrlFetch).\n\nКак тест: npm run dev → F12 → Console → testTelegram()" : "❌ Смотрите сеть/консоль, проверьте .env");
    return ok;
  }

  if (getSheetsUrlConfigError()) {
    // eslint-disable-next-line no-alert
    alert("Задайте GOOGLE_SCRIPT_URL в sheetsForm.js (для GAS) или запустите npm run dev + .env для теста через прокси.");
    return false;
  }

  try {
    await postJsonToGoogleScript({ _ecc_test: true, telegramText: text });
    // eslint-disable-next-line no-alert
    alert("Запрос ушёл в GAS. Проверьте Telegram, если в Code.gs обработан _ecc_test (или _ecc_telegram).");
    return true;
  } catch (e) {
    console.error(e);
    // eslint-disable-next-line no-alert
    alert("Ошибка: " + (e.message || e));
    return false;
  }
}

/*
 * ═══ Google Apps Script — добавьте в Code.gs (один doPost) ═══
 * Настройки: «Параметры проекта» (шестерёнка) → Свойства сценария:
 *   TG_TOKEN   = 123:ABC
 *   TG_CHAT_ID = 123456 (число или строка)
 *
 * function doPost(e) {
 *   try {
 *     if (!e.postData || !e.postData.contents) {
 *       return out({ ok: false, error: "no body" });
 *     }
 *     var p = JSON.parse(e.postData.contents);
 *
 *     // 1) Телеграм — из любой заявки (и CTA, и тест, и с таблицей)
 *     if (p.telegramText) {
 *       sendTg(p.telegramText);
 *     } else if (p._ecc_cta && p._ecc_telegram) {
 *       if (p.telegramText) sendTg(p.telegramText);
 *     }
 *     if (p._ecc_test) {
 *       if (p.telegramText) sendTg(p.telegramText);
 *       return out({ ok: true, test: true });
 *     }
 *     if (p._ecc_cta && p._ecc_telegram) {
 *       if (p.telegramText) sendTg(p.telegramText);
 *       return out({ ok: true, cta: true });
 *     }
 *
 *     // 2) Таблица (как у вас было)
 *     if (p.dateTime && p.source !== undefined) {
 *       var sh = SpreadsheetApp.openById("SHEET_ID").getSheets()[0];
 *       sh.appendRow([p.dateTime, p.productType, p.country, p.contact, p.email, p.source]);
 *     }
 *     if (p.telegramText && p.dateTime) { // при заявке с листа: только если GAS ещё не вызвал
 *        sendTg(p.telegramText);
 *     }
 *     return out({ ok: true });
 *   } catch (err) {
 *     return out({ ok: false, error: String(err) });
 *   }
 * }
 * function out(obj) {
 *   return ContentService.createTextOutput(JSON.stringify(obj))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 * function sendTg(html) {
 *   var props = PropertiesService.getScriptProperties();
 *   var token = props.getProperty("TG_TOKEN");
 *   var chatId = props.getProperty("TG_CHAT_ID");
 *   if (!token || !chatId) return;
 *   UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
 *     method: "post",
 *     contentType: "application/json",
 *     muteHttpExceptions: true,
 *     payload: JSON.stringify({
 *       chat_id: chatId,
 *       text: html,
 *       parse_mode: "HTML",
 *       disable_web_page_preview: true
 *     })
 *   });
 * }
 *
 * После правок: «Развёртывание» → новая версия веб-приложения.
 * (URL = GOOGLE_SCRIPT_URL из sheetsForm.js)
 */
