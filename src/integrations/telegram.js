/**
 * Уведомления в Telegram (Bot API). Секреты: VITE_TG_TOKEN, VITE_TG_CHAT_ID в .env
 * @see https://core.telegram.org/bots/api#sendmessage
 */
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
 * @param {Record<string, string>} fields подписи → значения
 * @returns {Promise<boolean>} data.ok от Telegram
 */
export async function sendToTelegram(formName, fields) {
  if (!isTelegramConfigured()) {
    if (import.meta.env.DEV) {
      console.warn("[telegram] Не заданы VITE_TG_TOKEN / VITE_TG_CHAT_ID в .env");
    }
    return true;
  }

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
  const text = lines.join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram API:", data);
    }
    return Boolean(data.ok);
  } catch (e) {
    console.error("Telegram error:", e);
    return false;
  }
}

/** В консоли браузера: testTelegram() (только dev-сборка, см. main.jsx) */
export async function testTelegram() {
  const ok = await sendToTelegram("Тест", { "✅ Проверка": "Интеграция работает!" });
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-alert
    alert(ok ? "✅ Telegram работает!" : "❌ Ошибка — проверь .env (VITE_TG_TOKEN, VITE_TG_CHAT_ID)");
  }
  return ok;
}
